import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        createdAt: v.number(),
        role: v.union(
            v.literal("admin"),
            v.literal("user"),
            v.literal("guest")
        ),
    }).index("by_email", ["email"])
})