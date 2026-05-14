# database setup

```
项目初始化 -> 配置clerk登录认证 -> 配置convex数据库 -> 使用clerk给convex添加身份验证功能
```
## Canvex

Convex 是一个 **面向文档的数据模型 + 支持关系查询能力的数据库**。文档意味着数据库中的每条记录像json，关系意味着表与表之间可以通过字段关联

canvex最重要的功能是同步，意思是如果表中的数据发生了改变，那么订阅了该表的查询函数自动运行更新应用中的数据

同步功能的流程可以概括为：useQuery查询了某一个数据表示**订阅某个 Query Function 的结果**。那么使用useMutation**导致该Quyer Function的结果发生变化**后，useQuery自动运行，然后React刷新ui

**为什么useMutation运行后，convex知道该运行哪个useQuery？**
每个 query 运行时，**Convex 会记录**它读取过哪些数据。当 mutation 修改数据时，系统拿修改范围和依赖记录一比对，就知道哪些 query 结果可能变了，需要重跑。

# background jobs

## Inngest

inngest是一个**事件驱动的后台任务/工作流编排平台**，只是**协调代码执行任务**，集成了**持久化函数执行**、**事件驱动架构**以及**任务队列**

用于将**耗时、异步、定时、多步骤任务**从前端请求拆解出去，在后台可靠执行。主要解决的是在**serverless环境**下如何可靠执行后台任务，也就是长任务执行、多步骤流程、定时、重试还有异步任务

---

**Serverless**指的是无服务器架构，其实不是没有服务器，只是**无需管理服务器**，开发者只需要关注代码怎么写就好。

**Serverless**通常由两部分构成：

**FaaS (Function as a Service - 函数即服务)**

这是 Serverless 的核心。你编写一段逻辑代码（一个函数），比如“图片缩放”或“处理登录”，然后上传。

- **触发机制：** 代码不会主动运行，而是由**事件驱动**。比如用户上传了照片、收到了 HTTP 请求、或者是定时任务触发。

**BaaS (Backend as a Service - 后端即服务)**

如果你的代码是“大脑”，BaaS 就是“器官”。为了让函数保持轻量，你将非业务逻辑的功能外包给成熟的第三方云服务。

- **常见服务：** 身份认证（Clerk, Auth0）、数据库（Convex, MongoDB Atlas）、存储（S3）、消息队列。

---

工作流程可以概括为：

- inngest.send发送**事件**，发送后并不是立即执行代码

- 而是进入inngest cloud，在inngest cloud里

	- **首先**接收并且**存储事件**，找到哪些**函数监听**这个事件，为**每个 Function 创建 Run 实例**

	- **然后**创建执行任务，向router handle发送请求，请求再下发，执行对应的**任务**，并且把run信息发送过去

- 执行step，同时**inngest cloud跟踪**step状态，失败时重试，完成时记录

	- 到step时，首先检查此 step 是否执行过，如果没有执行过，那么执行callback，保存结果到inngest，返回结果

	- 如果某个步骤失败，inngest会记录，这也是**持久化执行**的原因

```
1. inngest.send(event) 发送事件
2. Cloud 持久化事件并匹配监听函数
3. 为每个函数创建 Run 实例
4. 调度调用 /api/inngest endpoint
5. 按 step.run 分步执行
6. 每一步结果持久化
7. 失败自动重试
8. 从失败步骤恢复，而非重头执行
```

# firecrawl scrape

## firecrawl

firecrawl是一个面向ai的web数据采集平台，它将传统爬虫、网页抓取、站点遍历、动态网页操作这些复杂能力，封装成简单 API，让开发者能快速把互联网内容变成 **LLM 可直接使用的数据**（Markdown / JSON / HTML）。

对于传统爬虫来说，需要请求网页，解析 HTML，处理 JS 渲染页面，登录态，反爬机制，多页面抓取，数据清洗，输出结构化内容，这些firecrawl以及做好了，直接调用api即可使用，是**非常非常非常的方便**

# error tracking

## sentry

sentry可以在**生产环境**下进行了错误跟踪，也是**非常非常非常好用**，可以具体到哪个文件哪一行代码报错，还有错误回放功能，可以看到页面报错的前一段时间，用户做了什么

同时sentry还有一个agents功能，和vercel的ai-sdk集成在一起，可以看到用户使用了哪个模型、消耗了多少token，问了什么问题，模型给出的结果是什么，也是非常非常的好用。

同时inngest还有sentry middleware中间件，可以捕获异常并报告、还可以对每个函数添加追踪。

**运行流程可以概括为：** **首先**Sentry.init注册了全局错误监听，并且与远端sentry服务器连接；**然后**发生错误时，sentry sdk自动捕获错误，运行`Sentry.captureException(error)`，并且收集上下文信息，将context打包为json发送给sentry 服务器。

在不用环境的运行方式也不同，在**浏览器环境**下：监听 `window.onerror`，监听 Promise 错误，记录用户行为（点击、路由）。在**服务器环境**下：捕获接口异常、数据库错误、业务逻辑错误。在**severless/inngest环境**下：哪个 step 出错、输入参数、- 执行路径

```
[代码]
     ↓
[Sentry SDK]
     ↓
[事件收集 + 上下文]
     ↓
[HTTP上报]
     ↓
[Sentry服务端]
     ↓
[错误分析 + UI]
```

# design skills

## shadcn

## frontend-design

# projects

设计project install，包括新建项目、从github导入项目、current proejct、project list

在convex\project文件内，新增create mutation函数

# ide layout


# file explorer

创建了`files table`和`file server function`

**file server function：**
```
getFiles 获取一个项目下所有文件

getFile 获取对应id的文件

getFolderContents 获取一个文件夹里的内容，可以是root下，也可以是文件夹下，结果排序文件夹、文件，每组内按字母顺序排列

createFile 创建文件

createFolder 创建文件夹

renameFile 重命名文件/文件夹

deleteFile 删除文件/文件夹，递归删除所有子元素，判断如果是文件夹，递归调用

updateFile 更新文件/文件夹内容
```

搭建了一下ui，例如创建文件、创建文件夹、关闭所有文件夹按钮

创建文件夹/创建文件，点击后，项目文件夹展开，展示创建文件夹/文件组件，确认后展示tree组件

合上所有文件夹原理（key重置组件状态技巧）：

 *  将collapseKey传递给tree的key，当collapseKey变化时，react会视作为所有tree发生变化

 *  那么将会销毁所有tree组件，然后重新创建tree组件

 *  重新挂载tree组件时，因为isOpne default value 是false

 *  因此会合上所有的tree组件

tree组件，有isOpen 是否打开state；isRenaming 是否正在重命名state；creating 是否在创建state，根据不同的状态渲染不同的component

同时也根据不同的item type 决定展示folder or file

# code editor

## zustand

使用zustand进行 编辑器 状态管理，zustand是一个ts友好的高性能的react state管理库

> 它的核心目标是：用极少的代码，创建一个**全局状态**，所有组件**按需更新**

也是非常非常的好用，用来**管理全局状态**的，不再进行不必要的渲染

在react之外开辟一块空间存储状态，也就是外部存储

**运行流程大致是：** 使用create函数创建store，zustand内部会维护`state和订阅者`，然后返回一个hook；如果组件内部调用了该hook，获取了state，那么就将该组件注册为订阅者；调用**set更新函数**修改state之后，就会通知订阅者，然后react重新渲染。

在本项目内部使用了zustand管理editor状态。

```
tabs也就是editor状态，使用Map创建的对象，有三个属性。

openTabs当前项目中所有已打开的文件 ID 列表，activeTabId当前激活的标签页，previewTabId预览模式的标签页，也就是临时标签页，可以被替换的。

editor store中有五个处理函数。

getTabState获得tabs状态。

openfile处理打开时的state更新，但存在三种打开方式，第一种作为预览打开，替换现有预览或者添加新的预览；第二种作为固定打开，直接添加到openTabs中；第三种是file已经打开，那么只需要激活

closeTab处理关闭当前标签页

closeAllTabs处理关闭所有标签页

setActiveTab设置当前激活的标签页
```

## codemirror

CodeMirror 是一个 **浏览器中的代码编辑器组件**，专门让网页具备像 VS Code 那样的代码输入体验。

codemirror6的设计思路非常前沿，类似于react，采用state 和 view 分离，transaction驱动更新，几乎所有的功能都是通过extension集成

codemirror 维护着自己的状态，比如光标位置、文档内容，但有的时候我们需要自定义额外状态，这时候需要stateField，`stateField.define`就是在开辟一个空间存储我们自定义额外状态

**核心概念：**`immutable state`和`transaction`，将编辑器的状态视为不可变的，每次更改返回新的状态，这与react很类似。`transaction`就是状态变化的“描述对象”，也就是本次操作所产生的信息包，例如：每次用户操作（打字、选中、按键）都会产生一个或多个事务，事物是codemirror最小变更单位

**整个系统的数据流：**
```
用户输入
   ↓
dispatch(transactionSpec)  派发一个事务
   ↓
生成 Transaction
   ↓
旧 State 应用 Transaction
   ↓
生成新 State
   ↓
所有 StateField 更新
   ↓
View diff DOM
   ↓
局部更新页面
```

**codemirror extension的生命周期：**

codemirror 严格区分了state和view，因此生命周期也要分state和view

**初始化与挂载：**
``` 
state：
当编辑器state被创建时，codemirror会首先调用state.field的create函数，返回该字段的初始值
```
``` js
const myStateField = StateField.define({
  create(state) {
    console.log("1. State 挂载：初始化数据");
    return { count: 0, active: false }; // 返回初始状态
  },
  // ...
});
```
```
view：
当state创建完毕并绑定editorState时，编辑器 View 实例挂载到 DOM 上，负责ui的viewPlugin开始挂载
```
``` ts
const myViewPlugin = ViewPlugin.fromClass(class {
  constructor(view:EditorView) {
    console.log("2. View 挂载：可以在这里创建 DOM 节点");
    this.dom = document.createElement("div");
    // 此时可以通过 view.state 读取上面 create 产生的初始状态
  }
});
```

**更新循环：**

任何用户的输入、API 调用或外部事件都会派发一个**事务（Transaction）**，从而触发更新循环。

```
state：
每次调用 view.dispatch(tr) 时，会执行 StateField.update，接收一个oldstate和transaction
```
``` js
update(oldValue, tr) {
    console.log("3. State 更新：事务到来");
    
    // 如果文档没有改变，且没有相关的 Effect，直接返回旧值以优化性能
    if (!tr.docChanged && !tr.effects.length) return oldValue;

    // 否则，计算并返回全新的状态对象 (不可变数据)
    return { ...oldValue, count: oldValue.count + 1 };
  }
```
```
view:
State 更新完毕后，CM6 会将旧 State、新 State 和事务打包成一个 ViewUpdate 对象，传递给所有的 View 插件。
```
``` ts
update(update:ViewUpdate) {
    // 高效判断：只有当我的特定 StateField 发生变化时，才操作 DOM
    if (update.state.field(myStateField) !== update.startState.field(myStateField)) {
       console.log("4. View 更新：发现数据变化，准备更新 DOM 或重绘");
       const newData = update.state.field(myStateField);
       this.dom.textContent = `Count: ${newData.count}`;
    }
  }
```

**销毁与卸载：**
```
view：
ViewPlugin.destroy，清理在 constructor 或 update 中创建的外部资源（如 setTimeout、setInterval、外部事件监听器 window.addEventListener 等）。
```

# ai features

## codemirror

在codemirror中自定义扩展，stateField用来存储插件状态，stateEffect是修改插件状态的命令，viewPlugin是在视图层面更新/操作DOM，facet提供配置

**`StateEffect` 是修改 `StateField` 的标准途径**。

`stateEffect`意思是用来通知`transaction`附带做什么**额外状态**操作。

`StateEffect` 发命令，`StateField` 接命令并更新状态。

```
1. 定义 Effect 类型（静态）
2. 在需要时 dispatch（发送）一个 Effect
3. StateField 的 update 方法监听并处理 Effect，通过transaction.effect
```

**实现幽灵文本插件：**
```
状态管理层：
用 StateField 在编辑器状态中开辟了一块存储空间，通过 StateEffect 来更新这个状态。当 API 返回结果后，用 dispatch 分发效果，状态就更新了。
渲染层：
自定义了一个 WidgetType 组件，它会创建一个半透明的 <span> 元素。然后用 Decoration.widget 把这个组件挂载到光标位置，side: 1 表示在光标之后渲染。
触发层：
用 ViewPlugin 监听编辑器的 update 事件。当文档变化或光标移动时，触发 generatePayload 构建上下文（包括当前代码、光标位置、上下五行等），然后防抖 300ms 后调用 AI 接口。
接受层：
通过 keymap 拦截 Tab 按键。如果有建议，就 dispatch 一个事务：插入文本、移动光标、清空状态
```

**Prompt Design**
```
You are a code suggestion assistant.

<context>
<file_name>{fileName}</file_name>
<previous_lines>
{previousLines}
</previous_lines>
<current_line number="{lineNumber}">{currentLine}</current_line>
<before_cursor>{textBeforeCursor}</before_cursor>
<after_cursor>{textAfterCursor}</after_cursor>
<next_lines>
{nextLines}
</next_lines>
<full_code>
{code}
</full_code>
</context>

<instructions>
Follow these steps IN ORDER:
1. First, look at next_lines. If next_lines contains ANY code, check if it continues from where the cursor is. If it does, return empty string immediately - the code is already written.
2. Check if before_cursor ends with a complete statement (;, }, )). If yes, return empty string.
3. Only if steps 1 and 2 don't apply: suggest what should be typed at the cursor position, using context from full_code.
Your suggestion is inserted immediately after the cursor, so never suggest code that's already in the file.
</instructions>
```

**执行流程：**
```
用户输入/光标移动后

触发 createDebouncePlugin.update 函数

调用 createDebouncePlugin.triggerSuggestion 函数

如果用户 xxx 时间内没有操作，则发送请求

拿到响应后，dispatch 一个 effect ，也就是改变 setSuggestionEffect 的 value

同时会调用 suggestionState.update 函数，更改 suggestionState 的 value

这时才到 renderPlugin 发生作用，虽然 renderPlugin 在 view 变化时触发，但是做了一些信号操作

当不在请求也就是拿到响应并且 suggestionState 存在时，才会在当前光标位置创建一个 widget decoration

真正的 DOM 由 SuggestionWidget 创建，SuggestionWidget 继承 WidgetType，这是在编辑器中创建 DOM 的标准方法

最后，tab 键接受
```

> **实现快速编辑插件：**

在codemirror创建跟随光标移动的悬浮提示时，`codemirror官方`推荐使用`Tooltip`扩展

**快速编辑插件执行过程：**
```
用户按ctrl + k，CodeMirror 遍历 keymap，找到 quickEditKeymap 匹配

选区为空 → return false（不处理）

选区有内容 → view.dispatch(effects: showQuickEditEffect.of(true))

quickEditState.update先执行，更改状态为 effect.value，也就是ture

quickEditTooltipField.update()后执行，调用 createQuickEditTooltip 函数返回 tooltip

当 quickEditTooltipField 变化时，通知 showTooltip 重新渲染，显示悬浮提示框

执行顺序：按注册顺序执行
1. quickEditState.update() 先运行，发现 showQuickEditEffect → 返回 false
2. quickEditTooltipField.update() 后运行，发现 showQuickEditEffect → 重新创建 tooltip 并返回空数组（因为 isQuickEditActive 变为 false）
```

**注意：**
```
每次 dispatch 一个 transaction 时，会按 StateField 注册顺序执行 update 函数

也就是先执行 quickEditState，更改当前 transaction.state 中 quickEditState 结果

再执行 quickEditTooltipField，quickEditTooltipField 变化时通知 showTooltip 重新渲染 tooltip
```

**Prompt Design**
```
You are a code editing assistant. Edit the selected code based on the user's instruction.

<context>
<selected_code>
{selectedCode}
</selected_code>
<full_code_context>
{fullCode}
</full_code_context>
</context>
{documentation}

<instruction>
{instruction}
</instruction>

<instructions>
Return ONLY the edited version of the selected code.
Maintain the same indentation level as the original.
Do not include any explanations or comments unless requested.
If the instruction is unclear or cannot be applied, return the original code unchanged.
</instructions>
```
## cursor

**cursor的架构可以从四个方面理解：**

客户端层：负责监听用户的输入，渲染ui

上下文引擎：负责收集ai需要知道的背景信息

云端网关：负责鉴权和prompt的优化

模型层：根据不同的任务，请求路由到不同的llm

### Chat 的底层原理

> **代码库索引**，也就是cursor是怎么知道项目长什么样的？

- **ast解析**，也就是用 Tree-sitter将项目代码转为ast抽象语法树，提取出变量、类、函数的定义，这样就知道这个方法属于哪个对象或类，这不就js的v8引擎中ast那一部分吗。

- **代码分块**，并不会将整个项目的上下文喂给ai，而是用分块机制，即一个函数、一个类就是一个块。

- **向量化**，代码块通过 Embedding 模型转化为多维向量，存入本地的向量数据库中

	- 什么是Embedding？Embedding就是将一段代码翻译为一串数字/数组，两段功能接近的代码，数字/坐标越接近。

		- **作用：** 解决了传统语义上搜索代码的缺陷，只要功能相同，哪怕语义上每个单词都不一样，坐标也会很接近

	- 什么是向量数据库？整个项目的代码切成了成千上万个小块，并且都算出了它们的“坐标（向量），那么就需要将坐标存起来。

		- **向量数据库的作用：**  专门用来存储这些“长数组”，并且极其擅长做一件事：**计算相似度（通常用“余弦相似度 Cosine Similarity”算法）**。

		- **本地向量数据库：** 通常的做法是在本地建一个 SQLite 数据库，并加上类似 `sqlite-vec` 这样的底层 C 语言扩展，让本地 SQLite 拥有计算向量距离的能力)


> **混合检索**，也就是当提问时，cursor的上下文引擎如何工作的

- **语义检索 ：** 把提问的问题变成向量，去向量数据库里找余弦相似度最高的代码块。

- **字面检索：** 结合传统的关键词搜索（找代码里包含 "login", "user" 的文件）。

- **LSP 集成寻路：** 这是 Cursor 极其聪明的一点。如果提到了 `UserService`，Cursor 会通过 IDE 底层的语言服务器（LSP）直接找到 `UserService` 的定义文件，将其强行加入上下文。

> 其实核心的是**LSP + AST + 向量搜索**，这样就能拿到很准确的信息。

### 实时补全的底层原理

**FIM 机制：** 意思是模型在训练时，给它前几行的代码，给它后几行的代码，让他生成当前行的代码，就是FIM

**Speculative Decoding 投机解码机制：** 它会先用一个极其轻量、速度极快的模型迅速“猜”出一段代码，然后再用稍微聪明一点的模型去“验证”这段代码。如果猜对了，就直接打包推给客户端，**长见识了md，但是为什么这么块？？**

**本地微型上下文：** 为了快，Tab 补全不能去检索整个大项目。它只收集极少量的**强相关上下文**。例如：当前光标附近1000行代码、最近编辑过的几个文件

# conversation system

## ai element

`ai element` 是一个基于 `shadcn/ui` 构建的组件库，内部封装了很多用于构建 ai 原生应用的组件，例如：对话、消息，开箱即用，还与 `vercel ai sdk` 深度集成，不用处理sse、md还有语音输入等，内部已经封装好了，也是**非常非常好用**

`ai sdk` 为 ai 提供交互基础，例如流式传输、多模态、工具调用

`ai element` 为 `ai sdk` 提供了 ui 层

完整流程：

1. **用户输入** AI Elements `PromptInput`

2. **React 钩子** (`useChat`) 将消息发送到您的 API 路由

3. **AI SDK** 通过 AI Gateway 从模型流式传输响应

4. **AI 元素**在 `MessageResponse` 中渲染流式响应

每一层负责其职责：

|层|职责|
|---|---|
|AI 网关|模型访问、缓存、可观察性|
|AI SDK|流媒体、钩子、服务器集成|
|AI 元素|UI 组件、主题定制、无障碍访问|

**示例：**
``` js
"use client";

import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const handleSubmit = (message: { text: string }) => {
    sendMessage({ text: message.text });
  };

  return (
    <div className="h-screen flex flex-col">
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                {message.parts.map((part, i) =>
                  part.type === "text" ? (
                    <MessageResponse key={i}>{part.text}</MessageResponse>
                  ) : null
                )}
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
      </Conversation>

      <PromptInputProvider>
        <PromptInput onSubmit={handleSubmit} className="p-4">
          <PromptInputBody>
            <PromptInputTextarea placeholder="Type a message..." />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
    </div>
  );
}
```

# ai agent tools

## agentkit

`agentkit`是一个ai框架，是为了构建从单一模型调用到多agent系统的ai应用

**核心概念：** 

- agent，指的是一个有角色、有系统提示词、可以调用工具的执行单元
- tools，工具，指的是可以让模型安全的调用你的代码
- network，可以把多agent整合成一个可以工作的系统
- state，可以让agent、tools、router之间共享短期上下文
- router，注意：基于代码的路由，可以更清晰的知道下一步是调用agent还是返回undefined结束router

`agentkit`可以与`inngest`结合