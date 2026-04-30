// src/inngest/functions.ts
import { inngest } from "../client";
import Firecrawl from '@mendable/firecrawl-js';

import { createMinimax } from "vercel-minimax-ai-provider";
import { generateText } from "ai";

const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });

const minimax = createMinimax({
  apiKey: process.env.MINIMAX_API_KEY,
  baseURL: process.env.MINIMAX_QUERY_URL
})

const URL_REGEX = /https?:\/\/[^\s\u3000\u4e00-\u9fa5，。！？、]+(?<![,，.])/g;

export const demoFunction = inngest.createFunction(
  { id: "demo-function", triggers: { event: "demo/function" } },
  async ({ event, step }) => {

    const { prompt } = event.data as { prompt: string }

    const urls = await step.run('exctract-urls', async () => {
      return prompt.match(URL_REGEX) ?? [];
    }) as string[]

    const scrapedContent = await step.run("scrape-urls", async () => {
      const results = await Promise.all(
        urls.map(async (url) => {
          const result = await firecrawl.scrape(
            url,
            { formats: ["markdown"] },
          );
          return result.markdown ?? null;
        })
      );
      return results.filter(Boolean).join("\n\n");
    });

    const finalPrompt = scrapedContent
      ? `Context:\n${scrapedContent}\n\nQuestion: ${prompt}`
      : prompt;

    await step.run('minimax-text', async () => {
      return await generateText({
        model: minimax('MiniMax-M2.7'),
        prompt: finalPrompt,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      })
    })

  }
);