import { createDeepSeek } from '@ai-sdk/deepseek';
import { anthropic, openai } from '@inngest/agent-kit';
import { AsyncLocalStorage } from 'node:async_hooks';

export const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

interface DeepseekModel {
  provider: 'OpenAI' | 'Anthropic';
  model: 'deepseek-v4-flash' | 'deepseek-v4-pro';
  feature?: {
    temperature: number;
    max_tokens: number;
  };
}

interface ReasoningScope {
  reasoningHistory: string[];
}

// DeepSeek reasoner: 将 reasoning_content 存入当前 network 异步链路，onCall 时读取。
const reasoningStorage = new AsyncLocalStorage<ReasoningScope>();

const getReasoningScope = () => reasoningStorage.getStore();

const getReasoningHistory = () => {
  const scope = getReasoningScope();
  return scope?.reasoningHistory ?? [];
};

const addReasoning = (reasoning: string) => {
  const scope = getReasoningScope();
  if (!scope) {
    console.warn('[DeepSeek setReasoning] skipped reasoning_content without active scope.');
    return;
  }

  scope.reasoningHistory.push(reasoning);
};

const injectReasoningHistory = (
  messages: Array<Record<string, unknown>> | undefined,
  reasoningHistory: string[],
) => {
  if (!messages || reasoningHistory.length === 0) {
    return { reasoningCount: 0, messageCount: 0 };
  }

  let reasoningIndex = 0;
  let injectedCount = 0;

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const hasToolCalls =
      Array.isArray(msg.tool_calls) && msg.tool_calls.length > 0;
    const hasContent =
      typeof msg.content === 'string' && msg.content.trim() !== '';

    if (msg.role !== 'assistant' || (!hasToolCalls && !hasContent)) {
      continue;
    }

    if (reasoningIndex >= reasoningHistory.length) {
      break;
    }

    const reasoning = reasoningHistory[reasoningIndex];

    // AgentKit 会把同一次 OpenAI 响应里的 content 和 tool_calls 拆成连续的 assistant 消息。
    // DeepSeek 校验历史时需要这组 assistant 消息都带回同一份 reasoning_content。
    while (i < messages.length) {
      const assistantMsg = messages[i];
      const assistantHasToolCalls =
        Array.isArray(assistantMsg.tool_calls) &&
        assistantMsg.tool_calls.length > 0;
      const assistantHasContent =
        typeof assistantMsg.content === 'string' &&
        assistantMsg.content.trim() !== '';

      if (
        assistantMsg.role !== 'assistant' ||
        (!assistantHasToolCalls && !assistantHasContent)
      ) {
        i--;
        break;
      }

      assistantMsg.reasoning_content = reasoning;
      injectedCount++;
      i++;
    }

    reasoningIndex++;
  }

  return {
    reasoningCount: reasoningIndex,
    messageCount: injectedCount,
  };
};

export const deepseekModel = ({ provider, model, feature }: DeepseekModel) => {
  if (provider === 'Anthropic') {
    return anthropic({
      model,
      baseUrl: 'https://api.deepseek.com/anthropic/v1',
      apiKey: process.env.DEEPSEEK_API_KEY,
      defaultParameters: {
        temperature: feature?.temperature,
        max_tokens: feature!.max_tokens,
      },
    });
  }

  const adapter = openai({
    model,
    baseUrl: 'https://api.deepseek.com/v1',
    apiKey: process.env.DEEPSEEK_API_KEY,
  }) as ReturnType<typeof openai> & {
    onCall?: (modelInstance: object, body: Record<string, unknown>) => void;
  };

  adapter.onCall = (model, body) => {
    // 复制父类 @inngest/ai 的 onCall 行为，设置 body.model
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body.model = (model as any).options.model;

    // DeepSeek reasoner: 每一轮都会重建完整 messages，需要给历史 assistant 消息批量补回 reasoning_content。
    const reasoningHistory = getReasoningHistory();
    if (reasoningHistory.length > 0) {
      const messages = body.messages as Array<Record<string, unknown>> | undefined;
      const injected = injectReasoningHistory(messages, reasoningHistory);

      if (injected.reasoningCount < reasoningHistory.length) {
        console.warn(
          `[DeepSeek onCall] injected ${injected.reasoningCount}/${reasoningHistory.length} reasoning_content values into ${injected.messageCount} assistant messages.`,
        );
      }
    }
  };

  return adapter;
};

// 导出给 router 调用：从 raw 响应提取 reasoning_content 并存入 thread-local 变量
export const setReasoning: (reasoning: string) => void = (reasoning) => {
  addReasoning(reasoning);
};

export const runWithReasoningScope = <T>(callback: () => T) => {
  return reasoningStorage.run({ reasoningHistory: [] }, callback);
};

/**
 *  不懂onCall方法  -> 源码
 *  不明确response中有哪些字段  -> 接口文档
 * 
 *  解决步骤：
 *  获取reasoning_content字段
 *    通过raw参数获取，raw是模型的原始响应
 *  将reasoning_content字段注入到下一轮请求中
 *    通过onCall这个hook注入，这个hook是发送请求前最后一个钩子，用于临时换 endpoint、改鉴权信息、补默认参数，或者塞一些 provider 特定字段
 */
