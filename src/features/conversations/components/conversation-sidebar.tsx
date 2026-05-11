import ky from "ky";
import { toast } from "sonner";
import { useState } from "react";
import {
    CopyIcon,
    HistoryIcon,
    LoaderIcon,
    PlusIcon
} from "lucide-react";

import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
    Message,    // 一条消息容器
    MessageContent,
    MessageResponse,
    MessageActions,
    MessageAction,
} from "@/components/ai-elements/message";
import {
    PromptInput,
    PromptInputBody,
    PromptInputFooter,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputTools,
    type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";

import {
    useConversation,
    useConversations,
    useCreateConversation,
    useMessages,
} from "../hooks/use-conversations";

import { Id } from "../../../../convex/_generated/dataModel";
import { DEFAULT_CONVERSATION_TITLE } from "../data/constants";
import { PastConversationsDialog } from "./past-conversations-dialog";

interface ConversationSidebarProps {
    projectId: Id<"projects">;
};

export const ConversationSidebar = ({
    projectId,
}: ConversationSidebarProps) => {
    const [input, setInput] = useState("");
    const [
        selectedConversationId,
        setSelectedConversationId,
    ] = useState<Id<"conversations"> | null>(null);
    const [
        pastConversationsOpen,
        setPastConversationsOpen
    ] = useState(false);

    const createConversation = useCreateConversation();
    const conversations = useConversations(projectId);

    // 刷新/加载页面、创建新对话
    const activeConversationId =
        selectedConversationId ?? conversations?.[0]?._id ?? null;

    const activeConversation = useConversation(activeConversationId);
    const conversationMessages = useMessages(activeConversationId);

    // 检查是否有消息正在处理
    const isProcessing = conversationMessages?.some(
        (msg) => msg.status === "processing"
    );

    const handleCancel = async () => {
        try {
            await ky.post("/api/messages/cancel", {
                json: { projectId },
            });
        } catch {
            toast.error("Unable to cancel request");
        }
    };

    const handleCreateConversation = async () => {
        try {
            const newConversationId = await createConversation({
                projectId,
                title: DEFAULT_CONVERSATION_TITLE,
            });
            setSelectedConversationId(newConversationId);
            return newConversationId;
        } catch {
            toast.error("Unable to create new conversation");
            return null;
        }
    };

    const handleSubmit = async (message: PromptInputMessage) => {
        // 如果正在处理且没有新消息，这只是一个停止函数
        if (isProcessing && !message.text) {
            await handleCancel()
            setInput("");
            return;
        }

        let conversationId = activeConversationId;

        if (!conversationId) {
            conversationId = await handleCreateConversation();
            if (!conversationId) {
                return;
            }
        }

        // 通过 API 触发 Inngest 函数
        try {
            await ky.post("/api/messages", {
                json: {
                    conversationId,
                    message: message.text,
                },
            });
        } catch {
            toast.error("Message failed to send");
        }

        setInput("");
    }

    return (
        <>
            <PastConversationsDialog
                projectId={projectId}
                open={pastConversationsOpen}
                onOpenChange={setPastConversationsOpen}
                onSelect={setSelectedConversationId}
            />
            <div className="flex flex-col h-full bg-sidebar">
                <div className="h-8.75 flex items-center justify-between border-b">
                    <div className="text-sm truncate pl-3">
                        {activeConversation?.title ?? DEFAULT_CONVERSATION_TITLE}
                    </div>
                    <div className="flex items-center px-1 gap-1">
                        <Button
                            size="icon-xs"
                            variant="highlight"
                            onClick={() => setPastConversationsOpen(true)}
                        >
                            <HistoryIcon className="size-3.5" />
                        </Button>
                        <Button
                            size="icon-xs"
                            variant="highlight"
                            onClick={handleCreateConversation}
                        >
                            <PlusIcon className="size-3.5" />
                        </Button>
                    </div>
                </div>
                <Conversation className="flex-1">
                    <ConversationContent>
                        {conversationMessages?.map((message, messageIndex) => (
                            <Message
                                key={message._id}
                                from={message.role}
                            >
                                <MessageContent>
                                    {message.status === "processing" ? (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <LoaderIcon className="size-4 animate-spin" />
                                            <span>Thinking...</span>
                                        </div>
                                    ) : message.status === "cancelled" ? (
                                        <span className="text-muted-foreground italic">
                                            Request cancelled
                                        </span>
                                    ) : (
                                        <MessageResponse>{message.content}</MessageResponse>
                                    )}
                                </MessageContent>
                                {/* 底部容器 */}
                                {message.role === "assistant" &&
                                    message.status === "completed" &&
                                    messageIndex === (conversationMessages?.length ?? 0) - 1 && (
                                        <MessageActions>
                                            {/* 单个复制按钮 */}
                                            <MessageAction
                                                onClick={() => {
                                                    navigator.clipboard.writeText(message.content)
                                                }}
                                                label="Copy"
                                            >
                                                <CopyIcon className="size-3" />
                                            </MessageAction>
                                        </MessageActions>
                                    )
                                }
                            </Message>
                        ))}
                    </ConversationContent>
                    <ConversationScrollButton />
                </Conversation>
                <div className="p-3">
                    <PromptInput
                        onSubmit={handleSubmit}
                        className="mt-2"
                    >
                        <PromptInputBody>
                            <PromptInputTextarea
                                placeholder="Ask Polaris anything..."
                                onChange={(e) => setInput(e.target.value)}
                                value={input}
                                disabled={isProcessing}
                            />
                        </PromptInputBody>
                        <PromptInputFooter>
                            {/* 工具栏 */}
                            <PromptInputTools />
                            <PromptInputSubmit
                                disabled={isProcessing ? false : !input}
                                status={isProcessing ? "streaming" : undefined}
                            />
                        </PromptInputFooter>
                    </PromptInput>
                </div>
            </div>
        </>
    );
};