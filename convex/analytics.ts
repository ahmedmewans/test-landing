import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const trackEvent = mutation({
  args: {
    event: v.string(),
    page: v.optional(v.string()),
    referrer: v.optional(v.string()),
    metadata: v.optional(v.string()),
  },
  returns: v.id("analytics"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("analytics", args);
  },
});

export const getAnalyticsBrief = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("analytics"),
      _creationTime: v.number(),
      event: v.string(),
      page: v.optional(v.string()),
      referrer: v.optional(v.string()),
      metadata: v.optional(v.string()),
    }),
  ),
  handler: async (ctx) => {
    const all = await ctx.db.query("analytics").collect();
    // Simple grouping logic can be added here or in the frontend
    return all;
  },
});
