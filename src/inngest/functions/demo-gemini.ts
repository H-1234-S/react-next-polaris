import { inngest } from "../client";
import { generateText } from "ai";
import { createVertex } from "@ai-sdk/google-vertex";

const vertex = createVertex({
    project: process.env.GOOGLE_CLOUD_PROJECT!,
    location: process.env.GOOGLE_CLOUD_LOCATION!,
});

export const demoGemini = inngest.createFunction(
    {
        id: 'demo-gemini',
        triggers: { event: 'demo/gemini' }
    },
    async ({ step }) => {
        await step.run('gemini-text', async () => {
            return await generateText({
                model: vertex('gemini-2.5-flash'),
                prompt: '你好,你是什么模型？',
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                },
            })
        })
    }
)