import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
  keymap,
} from "@codemirror/view";
import { StateEffect, StateField } from "@codemirror/state";

import { fetcher } from "./fetcher";

// StateEffect：一种发送“消息”以更新状态的方式。
// 定义了一种用于设置建议文本的效果类型。
const setSuggestionEffect = StateEffect.define<string | null>();

// StateField：在编辑器中保存建议状态。
// 也就是在编译器状态里开辟了一块新的内存空间，增加了一个叫suggestionState新字段
// - create(): 当编辑器加载时返回初始值
// - update(): 在每次事务（按键等）时调用，以可能更新值
const suggestionState = StateField.define<string | null>({
  // 编辑器初始化时之执行一次
  create() {
    return null;
  },
  // 每次用户操作时都会执行
  update(value, transaction) {
    // value - 当前的旧值；transaction - 本次操作的信息包
    // 如果我们找到 setSuggestionEffect，返回它的新值
    // 否则，保持当前值不变
    for (const effect of transaction.effects) {
      if (effect.is(setSuggestionEffect)) {
        return effect.value;
      }
    }
    return value;
  },
});

// WidgetType：创建自定义 DOM 元素以在编辑器中显示。
// CodeMirror 会调用 toDOM() 来创建实际的 HTML 元素。
class SuggestionWidget extends WidgetType {
  constructor(readonly text: string) {
    super();
  }

  toDOM() {
    const span = document.createElement("span");
    span.textContent = this.text;
    span.style.opacity = "0.4"; // 幽灵文字外观
    span.style.pointerEvents = "none"; // 不要干扰点击
    return span;
  }
}

let debounceTimer: number | null = null;
let isWaitingForSuggestion = false;
const DEBOUNCE_DELAY = 3000;
let currentAbortController: AbortController | null = null;

// 参数处理函数
const generatePayload = (view: EditorView, fileName: string) => {
  const code = view.state.doc.toString();
  if (!code || code.trim().length === 0) return null;

  // 主光标的位置（一个数字，表示在文档中的字符偏移量）。
  const cursorPosition = view.state.selection.main.head;

  // lineAt() 根据字符位置找到所在行的信息，返回一个包含 from、to、number、text 等属性的对象。
  const currentLine = view.state.doc.lineAt(cursorPosition);

  // 计算光标在当前行内的列索引（从0开始）
  // currentLine.from 是该行在文档中的起始位置。
  const cursorInLine = cursorPosition - currentLine.from;

  const previousLines: string[] = [];

  // 最多取5行，但不能超过已有行数。比如第2行就只能取1行
  const previousLinesToFetch = Math.min(5, currentLine.number - 1);

  // 从当前行往前数，取 previousLinesToFetch 行，把每行的 text 加入数组
  for (let i = previousLinesToFetch; i >= 1; i--) {
    previousLines.push(view.state.doc.line(currentLine.number - i).text);
  }

  const nextLines: string[] = [];
  const totalLines = view.state.doc.lines;
  const linesToFetch = Math.min(5, totalLines - currentLine.number);

  // 从当前行往后数，取 linesToFetch 行
  for (let i = 1; i <= linesToFetch; i++) {
    nextLines.push(view.state.doc.line(currentLine.number + i).text);
  }

  return {
    fileName,
    code,
    currentLine: currentLine.text,
    previousLines: previousLines.join("\n"),
    textBeforeCursor: currentLine.text.slice(0, cursorInLine),
    textAfterCursor: currentLine.text.slice(cursorInLine),
    nextLines: nextLines.join("\n"),
    lineNumber: currentLine.number,
  }
}

// debounce plugin
const createDebouncePlugin = (fileName: string) => {
  return ViewPlugin.fromClass(
    class {
      constructor(view: EditorView) {
        this.triggerSuggestion(view);
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.selectionSet) {
          this.triggerSuggestion(update.view);
        }
      }

      triggerSuggestion(view: EditorView) {
        if (debounceTimer !== null) {
          clearTimeout(debounceTimer);
        }

        // 如果当前有fetch请求，那么终止它
        if (currentAbortController !== null) {
          currentAbortController.abort();
        }

        isWaitingForSuggestion = true;

        debounceTimer = window.setTimeout(async () => {
          const payload = generatePayload(view, fileName);
          if (!payload) {
            isWaitingForSuggestion = false;
            view.dispatch({ effects: setSuggestionEffect.of(null) });
            return;
          }
          currentAbortController = new AbortController();
          const suggestion = await fetcher(
            payload,
            currentAbortController.signal
          );

          isWaitingForSuggestion = false;
          view.dispatch({
            effects: setSuggestionEffect.of(suggestion),
          });
        }, DEBOUNCE_DELAY);
      }

      destroy() {
        if (debounceTimer !== null) {
          clearTimeout(debounceTimer);
        }

        if (currentAbortController !== null) {
          currentAbortController.abort();
        }
      }
    }
  )
}

// 渲染幽灵文本插件
// 编辑器创建 -> constructor执行 -> 用户输入 -> update执行
const renderPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.build(view);
    }

    // update 参数是 CodeMirror 每次操作后的事件对象，包含所有变更信息
    update(update: ViewUpdate) {
      // 如果建议已经更改
      const suggestionChanged = update.transactions.some((transaction) => {
        return transaction.effects.some((effect) => {
          return effect.is(setSuggestionEffect);
        });
      });

      // 如果文档更改、光标移动或建议更改，则重建装饰
      const shouldRebuild =
        update.docChanged || update.selectionSet || suggestionChanged;

      if (shouldRebuild) {
        this.decorations = this.build(update.view);
      }
    }

    build(view: EditorView) {
      if (isWaitingForSuggestion) {
        return Decoration.none;
      }

      // 从状态获取当前建议
      const suggestion = view.state.field(suggestionState);
      if (!suggestion) {
        return Decoration.none;
      }

      // 在光标位置创建一个小部件装饰
      const cursor = view.state.selection.main.head;
      return Decoration.set([
        // 创建一个部件装饰，在指定位置插入一个 DOM 元素
        Decoration.widget({
          widget: new SuggestionWidget(suggestion), // 要渲染的 WidgetType 实例
          side: 1, // 在光标之后渲染（侧：1），而不是之前（侧：-1）
        }).range(cursor),
      ]);
    }
  },
  { decorations: (plugin) => plugin.decorations } // 告诉 CodeMirror 使用我们的装饰
);

// 自定义tab快捷键
const acceptSuggestionKeymap = keymap.of([
  {
    key: "Tab",
    run: (view) => {
      const suggestion = view.state.field(suggestionState);
      if (!suggestion) {
        return false; // 没有建议？让 Tab 做它正常的事情（缩进）
      }

      const cursor = view.state.selection.main.head;
      view.dispatch({
        changes: { from: cursor, insert: suggestion }, // 插入建议文本
        selection: { anchor: cursor + suggestion.length }, // 将光标移动到末尾
        effects: setSuggestionEffect.of(null), // 清除建议，这会触发 suggestionState.update()，将存储的建议文本设为 null。
      });
      return true; // 我们处理了Tab，不要缩进
    },
  },
]);

export const suggestion = (fileName: string) => [
  suggestionState, // 状态存储
  createDebouncePlugin(fileName), // 在输入时触发建议
  renderPlugin, // 渲染幽灵文字
  acceptSuggestionKeymap, // 按 Tab 键接受
];
