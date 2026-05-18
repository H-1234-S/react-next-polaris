import { anthropic } from '@inngest/agent-kit'
import { createMinimax } from 'vercel-minimax-ai-provider'

export const minimax = createMinimax({
  apiKey: process.env.MINIMAX_API_KEY,
  baseURL: process.env.MINIMAX_QUERY_URL
})

export const minimaxModel = anthropic({
  model: 'MiniMax-M2.7',
  apiKey: process.env.MINIMAX_API_KEY,
  baseUrl: process.env.MINIMAX_QUERY_URL,
  defaultParameters: { temperature: 0.3, max_tokens: 16000 }
})