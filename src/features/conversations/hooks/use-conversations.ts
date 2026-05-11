import { useMutation, useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

// 传入 skip 告诉 convex 先跳过该操作
// 避免因传入 undefined 产生报错
export const useConversation = (id: Id<"conversations"> | null) => {
  return useQuery(api.conversations.getById, id ? { id } : "skip");
};

export const useMessages = (conversationId: Id<"conversations"> | null) => {
  return useQuery(
    api.conversations.getMessages,
    conversationId ? { conversationId } : "skip"
  );
};

export const useConversations = (projectId: Id<"projects">) => {
  return useQuery(api.conversations.getByProject, { projectId });
};

export const useCreateConversation = () => {
  return useMutation(api.conversations.create);
};