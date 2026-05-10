import { createMinimax } from 'vercel-minimax-ai-provider'

export const minimax = createMinimax({
  apiKey: process.env.MINIMAX_API_KEY,
  baseURL: process.env.MINIMAX_QUERY_URL
})