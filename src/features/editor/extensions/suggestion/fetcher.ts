import ky from "ky";
import { z } from "zod";
import { toast } from "sonner";

const suggestionRequestSchema = z.object({
  fileName: z.string(),
  code: z.string(),
  currentLine: z.string(),
  previousLines: z.string(),
  textBeforeCursor: z.string(),
  textAfterCursor: z.string(),
  nextLines: z.string(),
  lineNumber: z.number(),
});

const suggestionResponseSchema = z.object({
  suggestion: z.string(),
});

type SuggestionRequest = z.infer<typeof suggestionRequestSchema>;
type SuggestionResponse = z.infer<typeof suggestionResponseSchema>;

let isRequestInFlight = false;

export const fetcher = async (
  payload: SuggestionRequest,
  signal: AbortSignal,
): Promise<string | null> => {
  if (isRequestInFlight) {
    return null;
  }

  isRequestInFlight = true;

  try {
    const validatedPayload = suggestionRequestSchema.parse(payload);

    // 发送请求
    const response = await ky
      .post("/api/suggestion", {
        json: validatedPayload,      // 请求体，会自动序列化并设置 Content-Type
        signal,                       // 用于取消请求的 AbortSignal
        timeout: 10_000,              // 10秒超时
        retry: 0,                     // 不重试
      })
      .json<SuggestionResponse>();   // 直接获取 JSON 响应（类型安全）

    const validatedResponse = suggestionResponseSchema.parse(response);

    return validatedResponse.suggestion || null;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }
    toast.error("Failed to fetch AI completion");
    return null;
  } finally {
    isRequestInFlight = false;
  }
};
