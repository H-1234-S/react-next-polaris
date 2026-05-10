# CodeMirror 幽灵文本建议功能教程

本教程通过实现一个 AI 代码建议功能，逐步讲解 CodeMirror 的核心概念。

---

## 第一章：基础概念 —— CodeMirror 状态系统

### 1.1 为什么需要自定义状态？

CodeMirror 编辑器维护着自己的状态，包含文档内容、光标位置、撤销历史等。但有时候我们需要存储额外的自定义数据，比如：
- 当前是否正在等待服务器返回建议
- 建议的文本内容是什么
- 用户的自定义设置

这时候就需要 **StateField** 来扩展 CodeMirror 的状态系统。

### 1.2 StateField —— 在编辑器状态中存储自定义数据

**StateField** 本质上是在编辑器状态（EditorState）中开辟一块我们自己的"命名空间"。

```typescript
import { StateField } from "@codemirror/state";

const suggestionState = StateField.define<string | null>({
  create() {
    return null;  // 初始状态
  },
  update(value, transaction) {
    // 每次事务（用户操作）时触发
    // 返回新值来决定状态如何变化
    return value;
  },
});
```

**关键点解析：**

| 方法 | 作用 |
|------|------|
| `create()` | 编辑器初始化时调用，返回初始值 |
| `update(value, transaction)` | 每次事务（按键、选择等）时调用，返回新状态 |

`update` 方法的两个参数：
- `value`：当前存储的值（比如之前的建议文本）
- `transaction`：本次操作的信息包，包含操作类型、影响范围等

### 1.3 StateEffect —— 更新状态的方式

StateEffect 是一种**消息机制**，用于从外部通知状态更新。

```typescript
import { StateEffect } from "@codemirror/state";

// 定义一个 Effect 类型，表示"设置建议文本"这个操作
const setSuggestionEffect = StateEffect.define<string | null>();
```

**Effect 的使用流程：**

```
1. 定义 Effect 类型（静态）
2. 在需要时 dispatch（发送）一个 Effect
3. StateField 的 update 方法监听并处理 Effect
```

```typescript
// 发送 Effect
view.dispatch({
  effects: setSuggestionEffect.of("your suggestion text")
});

// StateField 监听
update(value, transaction) {
  for (const effect of transaction.effects) {
    if (effect.is(setSuggestionEffect)) {
      return effect.value;  // 返回 Effect 携带的新值
    }
  }
  return value;  // 没有找到匹配的 Effect，保持原值
}
```

**为什么用 Effect 而不是直接赋值？**

因为 Effect 是**声明式**的 —— 它描述"发生了什么操作"，而不是"直接把状态改成什么"。这让状态变化可追踪、可调试。

### 1.4 状态系统的设计思想

```
┌─────────────────────────────────────────────────────┐
│                   EditorState                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │   doc       │  │ selection   │  │ customField │  │
│  │  (文档内容)   │  │  (光标位置)  │  │ (我们自定义)  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────┘

StateField 给 EditorState 增加自定义字段
StateEffect 是更新这些字段的消息载体
```

---

## 第二章：装饰系统 —— 在编辑器中渲染自定义内容

### 2.1 Decoration 概述

Decoration 是 CodeMirror 用来在编辑器中渲染**视觉标记**的机制。可以用来：
- 高亮文本
- 显示内联提示（如代码建议）
- 添加装饰性元素（如图标）

### 2.2 Decoration.widget —— 创建内联元素

`Decoration.widget` 可以在指定位置插入一个自定义 DOM 元素：

```typescript
import { Decoration } from "@codemirror/view";

// 在光标位置创建一个 widget
Decoration.widget({
  widget: new SuggestionWidget("AI建议文本"),
  side: 1,  // 1=光标右侧，-1=光标左侧
}).range(cursorPosition)
```

### 2.3 WidgetType —— 自定义 DOM 元素

WidgetType 是创建自定义元素的基类：

```typescript
import { WidgetType } from "@codemirror/view";

class SuggestionWidget extends WidgetType {
  constructor(readonly text: string) {
    super();  // 必须调用 super()
  }

  toDOM() {
    const span = document.createElement("span");
    span.textContent = this.text;
    span.style.opacity = "0.4";  // 幽灵文字效果
    span.style.pointerEvents = "none";  // 不拦截点击
    return span;
  }
}
```

**关键方法：**

| 方法 | 作用 |
|------|------|
| `toDOM()` | 返回渲染到编辑器中的实际 DOM 元素 |

### 2.4 DecorationSet —— 管理装饰集合

通常一个插件会管理多个 Decoration，它们以 **DecorationSet** 形式存在：

```typescript
import { DecorationSet } from "@codemirror/view";

// 返回空集合（不显示任何装饰）
Decoration.none

// 创建多个装饰的集合
Decoration.set([
  Decoration.widget({ widget: widget1, side: 1 }).range(pos1),
  Decoration.widget({ widget: widget2, side: 1 }).range(pos2),
])
```

### 2.5 装饰系统的设计思想

```
┌──────────────────────────────────────────────────┐
│                  EditorView                       │
│  ┌────────────────────────────────────────────┐  │
│  │              DecorationSet                  │  │
│  │  ┌────────┐  ┌────────┐  ┌────────┐       │  │
│  │  │Decor 1 │  │Decor 2 │  │Decor 3 │  ...   │  │
│  │  │(高亮)  │  │(widget)│  │(下划线) │        │  │
│  │  └────────┘  └────────┘  └────────┘       │  │
│  └────────────────────────────────────────────┘  │
│                     ↓                             │
│            渲染到编辑器 DOM 中                     │
└──────────────────────────────────────────────────┘
```

---

## 第三章：插件系统 —— 让代码响应更新

### 3.1 ViewPlugin 概述

ViewPlugin 是 CodeMirror 6 推荐的插件编写方式。它创建一个**响应式对象**，能够监听编辑器的各种更新事件。

### 3.2 基本结构

```typescript
import { ViewPlugin } from "@codemirror/view";

const myPlugin = ViewPlugin.fromClass(
  class {
    // 构造函数：插件首次创建时调用
    constructor(view: EditorView) {
      // 初始化工作
    }

    // 更新监听：每次视图更新时调用
    update(update: ViewUpdate) {
      // 检查具体发生了什么变化
    }

    // 销毁时清理
    destroy() {
      // 清理定时器、取消请求等
    }
  }
);
```

### 3.3 ViewUpdate —— 事务信息包

`ViewUpdate` 包含每次更新的详细信息：

```typescript
update(update: ViewUpdate) {
  // 是否文档内容发生变化
  if (update.docChanged) { }

  // 是否光标位置发生变化
  if (update.selectionSet) { }

  // 获取本次事务中的所有 Effect
  for (const transaction of update.transactions) {
    for (const effect of transaction.effects) {
      // 检查特定的 Effect
    }
  }
}
```

### 3.4 在插件中使用 StateField

StateField 和 ViewPlugin 通常配合使用：

```typescript
// 定义状态
const suggestionState = StateField.define<string | null>({ ... });

// 定义插件
const debouncePlugin = ViewPlugin.fromClass(class { ... });

// 导出组合
export const suggestion = () => [
  suggestionState,
  debouncePlugin,
];
```

然后在创建 EditorView 时传入：

```typescript
new EditorView({
  extensions: [
    suggestionState,
    debouncePlugin,
    // 其他扩展...
  ]
})
```

### 3.5 插件设计模式

```
┌─────────────────────────────────────────────────────────┐
│                      EditorView                          │
│  ┌───────────────────────────────────────────────────┐   │
│  │                   插件实例                          │   │
│  │  ┌─────────────────┐  ┌────────────────────────┐  │   │
│  │  │ StateField      │  │ ViewPlugin            │  │   │
│  │  │ (存储状态)        │  │ (监听变化 + 执行业务)   │  │   │
│  │  └─────────────────┘  └────────────────────────┘  │   │
│  └───────────────────────────────────────────────────┘   │
│                          ↓                                │
│                  更新流程                                 │
│  用户输入 → docChanged → triggerSuggestion → fetch API  │
│                    ↓                                      │
│              dispatch Effect → 更新 StateField           │
│                    ↓                                      │
│              StateField 变化 → 装饰重建                    │
└─────────────────────────────────────────────────────────┘
```

---

## 第四章：键盘交互 —— keymap

### 4.1 基本用法

keymap 允许绑定键盘快捷键到特定操作：

```typescript
import { keymap } from "@codemirror/view";

const myKeymap = keymap.of([
  {
    key: "Tab",
    run: (view) => {
      // 处理 Tab 键
      return true;  // true = 已处理，false = 交给默认处理
    }
  }
]);
```

### 4.2 在 suggestion 中的应用

```typescript
const acceptSuggestionKeymap = keymap.of([
  {
    key: "Tab",
    run: (view) => {
      // 从状态中获取建议
      const suggestion = view.state.field(suggestionState);
      if (!suggestion) {
        return false;  // 没有建议，交给默认 Tab 处理（缩进）
      }

      // 在光标位置插入建议文本
      const cursor = view.state.selection.main.head;
      view.dispatch({
        changes: { from: cursor, insert: suggestion },
        selection: { anchor: cursor + suggestion.length },
        effects: setSuggestionEffect.of(null),  // 清空建议
      });
      return true;
    }
  }
]);
```

### 4.3 keymap 的优先级

多个 keymap 按顺序匹配，第一个返回 `true` 的处理程序会**阻止**后续处理。

---

## 第五章：实战 —— 实现 AI 幽灵文本建议

### 5.1 功能概述

当用户在编辑器中输入时：
1. 延迟 300ms 后，向 AI 服务器发送请求
2. 获取建议文本后，在光标位置显示**幽灵文字**（半透明）
3. 用户按 **Tab** 键接受建议

### 5.2 完整实现

```typescript
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

// 1. 定义状态
const setSuggestionEffect = StateEffect.define<string | null>();

const suggestionState = StateField.define<string | null>({
  create() { return null; },
  update(value, transaction) {
    for (const effect of transaction.effects) {
      if (effect.is(setSuggestionEffect)) {
        return effect.value;
      }
    }
    return value;
  },
});

// 2. 自定义 widget
class SuggestionWidget extends WidgetType {
  constructor(readonly text: string) { super(); }
  toDOM() {
    const span = document.createElement("span");
    span.textContent = this.text;
    span.style.opacity = "0.4";
    span.style.pointerEvents = "none";
    return span;
  }
}

// 3. 渲染插件
const renderPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.build(view);
    }

    update(update: ViewUpdate) {
      // 检查建议是否变化
      const suggestionChanged = update.transactions.some((t) =>
        t.effects.some((e) => e.is(setSuggestionEffect))
      );

      if (update.docChanged || update.selectionSet || suggestionChanged) {
        this.decorations = this.build(update.view);
      }
    }

    build(view: EditorView) {
      const suggestion = view.state.field(suggestionState);
      if (!suggestion) return Decoration.none;

      const cursor = view.state.selection.main.head;
      return Decoration.set([
        Decoration.widget({
          widget: new SuggestionWidget(suggestion),
          side: 1,
        }).range(cursor),
      ]);
    }
  },
  { decorations: (plugin) => plugin.decorations }
);

// 4. 防抖插件（触发请求）
const createDebouncePlugin = (fileName: string) => {
  let debounceTimer: number | null = null;

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

      async triggerSuggestion(view: EditorView) {
        if (debounceTimer !== null) {
          clearTimeout(debounceTimer);
        }

        debounceTimer = window.setTimeout(async () => {
          const payload = generatePayload(view, fileName);
          const suggestion = await fetcher(payload);

          view.dispatch({
            effects: setSuggestionEffect.of(suggestion),
          });
        }, 300);
      }
    }
  );
};

// 5. Tab 接受建议
const acceptSuggestionKeymap = keymap.of([
  {
    key: "Tab",
    run: (view) => {
      const suggestion = view.state.field(suggestionState);
      if (!suggestion) return false;

      const cursor = view.state.selection.main.head;
      view.dispatch({
        changes: { from: cursor, insert: suggestion },
        selection: { anchor: cursor + suggestion.length },
        effects: setSuggestionEffect.of(null),
      });
      return true;
    }
  }
]);

// 6. 导出组合
export const suggestion = (fileName: string) => [
  suggestionState,
  createDebouncePlugin(fileName),
  renderPlugin,
  acceptSuggestionKeymap,
];
```

### 5.3 数据流图

```
用户输入
    ↓
update.docChanged 触发
    ↓
防抖定时器重置 (300ms)
    ↓
定时器到期 → fetch API 获取建议
    ↓
dispatch setSuggestionEffect
    ↓
StateField 更新 → renderPlugin 重建装饰
    ↓
幽灵文本显示在光标位置
    ↓
用户按 Tab → 插入建议文本 → 清空状态
```

---

## 总结

本章涉及的核心概念：

| 概念 | 作用 |
|------|------|
| `StateField` | 在编辑器状态中存储自定义数据 |
| `StateEffect` | 作为状态更新的消息载体 |
| `Decoration` | 在编辑器中渲染视觉标记 |
| `WidgetType` | 创建自定义 DOM 元素 |
| `ViewPlugin` | 创建响应式插件 |
| `ViewUpdate` | 事务信息包，包含更新详情 |
| `keymap` | 绑定键盘快捷键 |

这些概念组合起来，形成了 CodeMirror 强大的扩展系统，使得实现复杂的编辑器功能成为可能。
