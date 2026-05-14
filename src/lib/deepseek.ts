import { createDeepSeek } from '@ai-sdk/deepseek';
import { anthropic, openai } from '@inngest/agent-kit';

export const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

interface DeepseekModel {
  provider: 'OpenAI' | 'Anthropic',
  model: 'deepseek-v4-flash' | 'deepseek-v4-pro'
  feature?: {
    temperature: number,
    max_tokens: number
  }
}

export const deepseekModel = ({ provider, model, feature }: DeepseekModel) => {
  if (provider === 'Anthropic') {
    return anthropic({
      model,
      baseUrl: 'https://api.deepseek.com/anthropic/v1',
      apiKey: process.env.DEEPSEEK_API_KEY,
      defaultParameters: { temperature: feature?.temperature, max_tokens: feature!.max_tokens }
    })
  }

  return openai({
    model,
    baseUrl: 'https://api.deepseek.com/v1',
    apiKey: process.env.DEEPSEEK_API_KEY,
  })
}