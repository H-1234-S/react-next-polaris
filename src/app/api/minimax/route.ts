import { generateText } from 'ai'
import { createMinimax } from 'vercel-minimax-ai-provider'

const minimax = createMinimax({
  apiKey: process.env.MINIMAX_API_KEY,
  baseURL: 'https://api.minimaxi.com/anthropic/v1'
})

export async function POST() {
  try {
    const result = await generateText({
      model: minimax('MiniMax-M2.7'),
      prompt: '你好'
    })

    return Response.json({
      text: result.text
    })
  } catch (error) {
    console.error('报错详情:', error)
    return Response.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}