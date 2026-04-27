import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new Error("Not authenticated");
        }

        return await ctx.db
            .query('users')
            .collect()
    }
})

export const create = mutation({
    args:{
        name:v.string(),
        email:v.string()
    },
    handler: async (ctx,args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new Error("Not authenticated");
        }

        await ctx.db.insert('users',{
            name:args.name,
            email:args.email,
            createdAt:Date.now(),
            role:'admin'
        })
    }
})