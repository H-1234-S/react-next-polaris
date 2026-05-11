import { inngest } from "@/inngest/client";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { messageCancel, messageSent } from "@/inngest/events";
import { convex } from "@/lib/convex-client";
import { api } from "../../../../convex/_generated/api";
import { NonRetriableError } from "inngest";


interface MessageEvent {
    messageId: Id<"messages">;
    conversationId: Id<"conversations">;
    projectId: Id<"projects">;
    message: string;
};

export const processMessage = inngest.createFunction(
    {
        id: "process-message",
        triggers: [messageSent],
        cancelOn: [
            {
                event: messageCancel,
                if: "event.data.messageId == async.data.messageId",
            },
        ],

        // 耗尽所有重试次数时执行
        onFailure: async ({ event, step }) => {
            const { messageId } = event.data.event.data as MessageEvent;
            const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;

            // 使用错误内容更新消息
            if (internalKey) {
                await step.run("update-message-on-failure", async () => {
                    await convex.mutation(api.system.updateMessageContent, {
                        internalKey,
                        messageId,
                        content:
                            "My apologies, I encountered an error while processing your request. Let me know if you need anything else!",
                    });
                });
            }
        }
    },
    async ({ event, step }) => {

        const {
            messageId,
            conversationId,
            projectId,
            message
        } = event.data as MessageEvent;

        const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;

        if (!internalKey) {
            throw new NonRetriableError("POLARIS_CONVEX_INTERNAL_KEY is not configured");
        }

        // TODO: Check if this is needed
        await step.sleep("wait-for-db-sync", "1s");

        // 获取用于标题生成检查的对话
        const conversation = await step.run("get-conversation", async () => {
            return await convex.query(api.system.getConversationById, {
                internalKey,
                conversationId,
            });
        }) as Doc<"conversations"> | null;

        if (!conversation) {
            throw new NonRetriableError("Conversation not found");
        }
        
    })
