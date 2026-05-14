import { anthropic, createAgent, createNetwork } from '@inngest/agent-kit';
import { messageCancel, messageSent } from "@/inngest/events";
import { inngest } from "@/inngest/client";
import { NonRetriableError } from "inngest";

import { convex } from "@/lib/convex-client";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

import { DEFAULT_CONVERSATION_TITLE } from "../data/constants";
import { CODING_AGENT_SYSTEM_PROMPT, TITLE_GENERATOR_SYSTEM_PROMPT } from "./constants";

import { createReadFilesTool } from './tools/read-files';
import { createListFilesTool } from './tools/list-files';
import { createUpdateFileTool } from './tools/update-file';
import { createCreateFilesTool } from './tools/create-files';
import { createCreateFolderTool } from './tools/create-folder';
import { createRenameFileTool } from './tools/rename-file';
import { createDeleteFilesTool } from './tools/delete-files';
import { createScrapeUrlsTool } from './tools/scrape-urls';
import { deepseekModel } from '@/lib/deepseek';

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
        // await step.sleep("wait-for-db-sync", "1s");

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

        // 获取最近消息以了解会话上下文
        const recentMessages = await step.run("get-recent-messages", async () => {
            return await convex.query(api.system.getRecentMessages, {
                internalKey,
                conversationId,
                limit: 10,
            });
        }) as Doc<"messages">[];

        // 使用对话历史构建系统提示（不包括当前处理的消息）
        let systemPrompt = CODING_AGENT_SYSTEM_PROMPT;

        // 过滤掉当前处理中的消息和空消息
        const contextMessages = recentMessages.filter(
            (msg) => msg._id !== messageId && msg.content.trim() !== ""
        );

        if (contextMessages.length > 0) {
            const historyText = contextMessages
                .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
                .join("\n\n");

            systemPrompt += `\n\n## Previous Conversation (for context only - do NOT repeat these responses):\n${historyText}\n\n## Current Request:\nRespond ONLY to the user's new message below. Do not repeat or reference your previous responses.`;
        }

        // 如果仍为默认，请生成对话标题
        const shouldGenerateTitle =
            conversation.title === DEFAULT_CONVERSATION_TITLE;

        if (shouldGenerateTitle) {
            const titleAgent = createAgent({
                name: "title-generator",
                system: TITLE_GENERATOR_SYSTEM_PROMPT,
                model: deepseekModel({ model: 'deepseek-v4-flash', provider: 'OpenAI' })
            });

            console.log("start title agent");

            const { output } = await titleAgent.run(message, { step });

            console.log("done title agent", output);

            const textMessage = output.find(
                (m) => m.type === "text" && m.role === "assistant"
            );

            if (textMessage?.type === "text") {
                const title =
                    typeof textMessage.content === "string"
                        ? textMessage.content.trim()
                        : textMessage.content
                            .map((c) => c.text)
                            .join("")
                            .trim();

                if (title) {
                    await step.run("update-conversation-title", async () => {
                        await convex.mutation(api.system.updateConversationTitle, {
                            internalKey,
                            conversationId,
                            title,
                        });
                    });
                }
            }
        }

        // 使用文件工具创建编码代理
        const codingAgent = createAgent({
            name: "polaris",
            description: "An expert AI coding assistant",
            system: systemPrompt,
            model: deepseekModel({ model: 'deepseek-v4-flash', provider: 'OpenAI' }),
            tools: [
                createListFilesTool({ internalKey, projectId }),
                createReadFilesTool({ internalKey }),
                /*
                createUpdateFileTool({ internalKey }),
                createCreateFilesTool({ projectId, internalKey }),
                createCreateFolderTool({ projectId, internalKey }),
                createRenameFileTool({ internalKey }),
                createDeleteFilesTool({ internalKey }),
                createScrapeUrlsTool(),
                */
            ],
        });

        // 使用单一代理创建网络
        const network = createNetwork({
            name: "polaris-network",
            agents: [codingAgent],
            maxIter: 20,
            router: ({ network }) => {

                const lastResult = network.state.results.at(-1);

                const raw = lastResult?.raw as {
                    choices?: Array<{
                        message?: {
                            reasoning_content?: string;
                            content?: string;
                        }
                    }>
                };

                const reasoning = raw?.choices?.[0]?.message?.reasoning_content;
                const content = raw?.choices?.[0]?.message?.content;

                // DeepSeek 要求在思考模式下，reasoning_content 必须传回给 API
                // 使用 _messages 直接修改内部数组（messages 是 getter 返回副本）
                if (reasoning) {
                    network.state._messages.push({
                        role: "assistant",
                        content: content ?? "",
                        reasoning_content: reasoning
                    });
                }

                // 有文本响应
                const hasTextResponse = lastResult?.output.some(
                    (m) => m.type === "text" && m.role === "assistant"
                );
                // 有工具调用
                const hasToolCalls = lastResult?.output.some(
                    (m) => m.type === "tool_call"
                );

                // Anthropic 输出文本和工具调用一起
                // 只有当有文本但没有工具调用（最终响应）时才停止
                if (hasTextResponse && !hasToolCalls) {
                    return undefined;
                }
                return codingAgent;
            }
        });

        // 运行代理
        console.log('start network agent')

        const result = await network.run(message);

        console.log("done network agent");


        // 从上一个代理结果中提取助手的文本响应
        const lastResult = result.state.results.at(-1);
        const textMessage = lastResult?.output.find(
            (m) => m.type === "text" && m.role === "assistant"
        );

        let assistantResponse =
            "I processed your request. Let me know if you need anything else!";

        if (textMessage?.type === "text") {
            assistantResponse =
                typeof textMessage.content === "string"
                    ? textMessage.content
                    : textMessage.content.map((c) => c.text).join("");
        }

        // 使用回应更新助手消息（这也会将状态设置为已完成）
        await step.run("update-assistant-message", async () => {
            await convex.mutation(api.system.updateMessageContent, {
                internalKey,
                messageId,
                content: assistantResponse,
            })
        });

        return { success: true, messageId, conversationId };

    }
)
