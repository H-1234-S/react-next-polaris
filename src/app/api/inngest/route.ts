// src/app/api/inngest/route.ts
import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { processMessage } from "@/features/conversations/inngest/process-message";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processMessage
  ],
});