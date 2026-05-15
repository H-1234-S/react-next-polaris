import { createDeepSeek } from '@ai-sdk/deepseek';
import { anthropic, openai } from '@inngest/agent-kit';

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

// DeepSeek reasoner: 将 reasoning_content 存入 thread-local 变量，onCall 时读取
let pendingReasoning: string | undefined;

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

    // DeepSeek reasoner: 从 thread-local 变量读取 reasoning_content 并注入
    const reasoning = pendingReasoning;
    console.log('[DeepSeek onCall] pendingReasoning:', reasoning ? `${reasoning.slice(0, 100)}...` : 'null');
    if (reasoning) {
      const messages = body.messages as Array<Record<string, unknown>> | undefined;
      console.log('[DeepSeek onCall] messages count:', messages?.length);
      if (messages) {
        for (let i = messages.length - 1; i >= 0; i--) {
          const msg = messages[i];
          const hasToolCalls = !!(msg.tool_calls && (msg.tool_calls as unknown[]).length > 0);
          const hasContent = !!(msg.content && (msg.content as string).trim() !== '');
          console.log(`[DeepSeek onCall] msg[${i}]: role=${msg.role}, hasToolCalls=${hasToolCalls}, hasContent=${hasContent}`);
          if (msg.role === 'assistant' && hasToolCalls) {
            msg.reasoning_content = reasoning;
            console.log('[DeepSeek onCall] injected reasoning_content to msg index:', i);
            break;
          }
          if (msg.role === 'assistant' && hasContent) {
            msg.reasoning_content = reasoning;
            console.log('[DeepSeek onCall] injected reasoning_content to text-msg index:', i);
            break;
          }
        }
      }
    }
    // 注入后清除，避免泄露到后续请求
    pendingReasoning = undefined;
  };

  return adapter;
};

// 导出给 router 调用：从 raw 响应提取 reasoning_content 并存入 thread-local 变量
export const setReasoning: (reasoning: string) => void = (reasoning) => {
  pendingReasoning = reasoning;
};