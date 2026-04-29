import { createMinimax } from "vercel-minimax-ai-provider";
import { inngest } from "../client";
import { generateText } from "ai";

const minimax = createMinimax({
    apiKey: process.env.MINIMAX_API_KEY,
    baseURL: process.env.MINIMAX_QUERY_URL
})

export const demoMinimax = inngest.createFunction(
    {
        id: 'demo-minimax',
        triggers: { event: 'demo/minimax' }
    },
    async ({ step }) => {
        await step.run('minimax-text', async () => {
            return await generateText({
                model: minimax('MiniMax-M2.7'),
                prompt: '你好,你是什么模型？'
            })
        })
    }
)