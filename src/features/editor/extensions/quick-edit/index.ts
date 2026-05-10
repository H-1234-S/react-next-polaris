import { Tooltip, showTooltip, keymap, EditorView } from "@codemirror/view";
import { StateField, EditorState, StateEffect } from "@codemirror/state";

import { fetcher } from "./fetcher";

export const showQuickEditEffect = StateEffect.define<boolean>();

let editorView: EditorView | null = null;
let currentAbortController: AbortController | null = null;

// 用于保存 tooltip 是否激活
export const quickEditState = StateField.define<boolean>({
  create() {
    return false;
  },

  update(value, transaction) {
    for (const effect of transaction.effects) {
      if (effect.is(showQuickEditEffect)) {
        return effect.value;
      }
    }
    if (transaction.selection) {
      const selection = transaction.state.selection.main;
      // 如果选区为空
      if (selection.empty) {
        return false;
      }
    }
    return value;
  }
});

// 创建 Tooltip DOM
const createQuickEditTooltip = (state: EditorState): readonly Tooltip[] => {
  const selection = state.selection.main;

  // 没有选区
  if (selection.empty) {
    return [];
  }

  // 快速编辑未激活
  const isQuickEditActive = state.field(quickEditState);
  if (!isQuickEditActive) {
    return [];
  }

  return [
    {
      pos: selection.to,       // tooltip 定位在选区结束位置
      above: false,             // 下方显示
      strictSide: false,        // 允许在编辑器边缘溢出

      // 创建DOM
      create() {
        const dom = document.createElement("div");
        dom.className =
          "bg-popover text-popover-foreground z-50 rounded-sm border border-input p-2 shadow-md flex flex-col gap-2 text-sm";

        const form = document.createElement("form");
        form.className = "flex flex-col gap-2";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Edit selected code";
        input.className =
          "bg-transparent border-none outline-none px-2 py-1 font-sans w-100";
        input.autofocus = true;

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "flex items-center justify-between gap-2";

        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.textContent = "Cancel";
        cancelButton.className =
          "font-sans p-1 px-2 text-muted-foreground hover:text-foreground hover:bg-foreground/10 rounded-sm";

        cancelButton.onclick = () => {
          if (currentAbortController) {
            // 取消 AI 请求
            currentAbortController.abort();
            currentAbortController = null;
          }
          if (editorView) {
            // 关闭 tooltip
            editorView.dispatch({
              effects: showQuickEditEffect.of(false),
            });
          }
        }

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Submit";
        submitButton.className =
          "font-sans p-1 px-2 text-muted-foreground hover:text-foreground hover:bg-foreground/10 rounded-sm";

        form.onsubmit = async (e) => {
          e.preventDefault();

          if (!editorView) return;

          const instruction = input.value.trim();
          if (!instruction) return;

          // 获取选区代码和完整代码
          const selection = editorView.state.selection.main;
          const selectedCode = editorView.state.doc.sliceString(
            selection.from,
            selection.to
          );
          const fullCode = editorView.state.doc.toString();

          submitButton.disabled = true;
          submitButton.textContent = "Editing...";

          currentAbortController = new AbortController();
          const editedCode = await fetcher(
            {
              selectedCode,
              fullCode,
              instruction,
            },
            currentAbortController.signal
          );

          // 成功后用 editedCode 替换选区内容
          if (editedCode) {
            editorView.dispatch({
              changes: {
                from: selection.from,
                to: selection.to,
                insert: editedCode,
              },
              selection: { anchor: selection.from + editedCode.length },
              // 关闭 tooltip 
              effects: showQuickEditEffect.of(false),
            });
          } else {
            // 恢复按钮状态
            submitButton.disabled = false;
            submitButton.textContent = "Submit";
          }

          currentAbortController = null;
        };

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(submitButton);

        form.appendChild(input);
        form.appendChild(buttonContainer);

        dom.appendChild(form);

        // 将input.focus推到下一个宏任务执行
        // 作用是在 tooltip DOM 完全挂载后再执行
        // create() 返回的 DOM 会被 CodeMirror 插入到编辑器中，这个插入操作发生在当前事件处理完成之后
        setTimeout(() => {
          input.focus();
        }, 0);

        return { dom };
      },
    },
  ];
};

const quickEditTooltipField = StateField.define<readonly Tooltip[]>({
  create(state) {
    return createQuickEditTooltip(state);
  },

  update(tooltips, transaction) {
    if (transaction.docChanged || transaction.selection) {
      return createQuickEditTooltip(transaction.state);
    }
    for (const effect of transaction.effects) {
      // effect 变化时重新创建
      if (effect.is(showQuickEditEffect)) {
        return createQuickEditTooltip(transaction.state);
      }
    }
    // 无变化则保持原样
    return tooltips;
  },

  /**
   * - provide：将 tooltip 数组注册到 showTooltip 插件
   * - computeN：当 quickEditTooltipField 变化时，通知 showTooltip 重新渲染
   */
  provide: (field) => showTooltip.computeN(
    [field],
    (state) => state.field(field),
  ),
});

/**
 * - return true：事件已消费，不再传递给其他 keymap
 * - return false：事件未处理，继续传递给下一个 keymap
 */
const quickEditKeymap = keymap.of([
  {
    key: "Mod-k",
    run: (view) => {
      const selection = view.state.selection.main;
      if (selection.empty) {
        return false;
      }

      view.dispatch({
        effects: showQuickEditEffect.of(true),
      });
      return true;
    },
  },
]);

// 每次编辑器更新时，将当前 EditorView 实例保存到 editorView 变量。用于在 tooltip 表单回调中访问编辑器。
const captureViewExtension = EditorView.updateListener.of((update) => {
  editorView = update.view;
});

export const quickEdit = (fileName: string) => [
  quickEditState,
  quickEditTooltipField,
  quickEditKeymap,
  captureViewExtension,
];

/**
 *  用户按ctrl + k，CodeMirror 遍历 keymap，找到 quickEditKeymap 匹配 
 * 
 *  选区为空 → return false（不处理）
 *  选区有内容 → view.dispatch(effects: showQuickEditEffect.of(true))
 * 
 *  quickEditTooltipField.update() 检测到 showQuickEditEffect 变化
 *  
 *  重新调用 createQuickEditTooltip(state) 创建 tooltip
 */