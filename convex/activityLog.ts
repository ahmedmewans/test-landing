import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const logActivity = mutation({
  args: {
    action: v.union(
      v.literal("create"),
      v.literal("update"),
      v.literal("delete"),
    ),
    entityType: v.string(),
    entityId: v.optional(v.string()),
    entityName: v.optional(v.string()),
    description: v.string(),
    metadata: v.optional(v.string()),
  },
  returns: v.id("activityLog"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("activityLog", {
      ...args,
      _creationTime: Date.now(),
    } as any);
  },
});

export const getRecentActivity = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(
    v.object({
      _id: v.id("activityLog"),
      _creationTime: v.number(),
      action: v.union(
        v.literal("create"),
        v.literal("update"),
        v.literal("delete"),
      ),
      entityType: v.string(),
      entityId: v.optional(v.string()),
      entityName: v.optional(v.string()),
      description: v.string(),
      metadata: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    return await ctx.db.query("activityLog").order("desc").take(limit);
  },
});

export const getActivityByEntity = query({
  args: {
    entityType: v.string(),
    entityId: v.optional(v.string()),
  },
  returns: v.array(
    v.object({
      _id: v.id("activityLog"),
      _creationTime: v.number(),
      action: v.union(
        v.literal("create"),
        v.literal("update"),
        v.literal("delete"),
      ),
      entityType: v.string(),
      entityId: v.optional(v.string()),
      entityName: v.optional(v.string()),
      description: v.string(),
      metadata: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("activityLog")
      .withIndex("by_entityType", (q) => q.eq("entityType", args.entityType));

    const results = await query.collect();

    if (args.entityId) {
      return results.filter((r) => r.entityId === args.entityId);
    }

    return results.slice(0, 50);
  },
});
