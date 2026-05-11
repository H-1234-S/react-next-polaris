// src/app/api/inngest/route.ts
import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { demoGemini, demoMinimax, demoFunction } from "@/inngest/functions";
import { processMessage } from "@/features/conversations/inngest/process-message";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    demoFunction,
    demoMinimax,
    demoGemini,
    processMessage
  ],
});