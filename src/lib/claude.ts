import { anthropic } from "@inngest/agent-kit";

export const claudeModel = anthropic({
    model: 'claude-opus-4-20250514',
    apiKey: process.env.CLAUDE_API_KEY,
    baseUrl: process.env.CLAUDE_QUERK_URL,
    defaultParameters: { temperature: 0.3, max_tokens: 16000 }
})