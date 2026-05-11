import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    ownerId: v.string(),
    updatedAt: v.number(),
    importStatus: v.optional(
      v.union(
        v.literal("importing"),
        v.literal("completed"),
        v.literal("failed"),
      ),
    ),
    exportStatus: v.optional(
      v.union(
        v.literal("exporting"),
        v.literal("completed"),
        v.literal("failed"),
        v.literal("cancelled"),
      ),
    ),
    exportRepoUrl: v.optional(v.string()),
  }).index("by_owner", ["ownerId"]),

  /**
   *  每一个文件都属于一个项目
   * 
   *  每一个文件可以属于一个文件的子文件，也可以不属于
   * 
   *  文件名
   * 
   *  每一个文件可以是一个文件，也可以是一个文件夹
   * 
   *  两种文件内容，一种是string，另一种是二进制
   */
  files: defineTable({
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files")),
    name: v.string(),
    type: v.union(v.literal("file"), v.literal("folder")),
    content: v.optional(v.string()), // 仅文本文件
    storageId: v.optional(v.id("_storage")), // 仅二进制文件 图片 会转为二进制
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_parent", ["parentId"])
    .index("by_project_parent", ["projectId", "parentId"]),


  conversations: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    projectId: v.id("projects"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    // 只有 LLM 回复才有这个字段
    status: v.optional(
      v.union(
        v.literal("processing"),  // AI正在生成回复
        v.literal("completed"),   // 生成完成
        v.literal("cancelled")    // 生成被取消
      )
    ),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_project_status", ["projectId", "status"]),
});