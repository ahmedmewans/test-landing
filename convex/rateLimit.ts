import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/** 24 hours in milliseconds */
const WINDOW_MS = 24 * 60 * 60 * 1000;

/** Max requests per window */
const MAX_REQUESTS = 5;

/**
 * Check if a given identifier (hashed IP) is within its rate limit.
 * Returns whether the request is allowed, how many remain, and when the window resets.
 */
export const checkRateLimit = query({
  args: { identifier: v.string() },
  returns: v.object({
    allowed: v.boolean(),
    remaining: v.number(),
    resetsAt: v.number(),
  }),
  handler: async (ctx, { identifier }) => {
    const record = await ctx.db
      .query("chatRateLimit")
      .withIndex("by_identifier", (q) => q.eq("identifier", identifier))
      .unique();

    if (!record) {
      return { allowed: true, remaining: MAX_REQUESTS, resetsAt: 0 };
    }

    const now = Date.now();
    const windowExpired = now - record.windowStart >= WINDOW_MS;

    if (windowExpired) {
      return { allowed: true, remaining: MAX_REQUESTS, resetsAt: 0 };
    }

    const remaining = Math.max(0, MAX_REQUESTS - record.requestCount);
    const resetsAt = record.windowStart + WINDOW_MS;

    return {
      allowed: remaining > 0,
      remaining,
      resetsAt,
    };
  },
});

/**
 * Record a request for the given identifier.
 * Creates a new window if none exists or the previous one expired.
 */
export const recordRequest = mutation({
  args: { identifier: v.string() },
  returns: v.null(),
  handler: async (ctx, { identifier }) => {
    const record = await ctx.db
      .query("chatRateLimit")
      .withIndex("by_identifier", (q) => q.eq("identifier", identifier))
      .unique();

    const now = Date.now();

    if (!record) {
      await ctx.db.insert("chatRateLimit", {
        identifier,
        requestCount: 1,
        windowStart: now,
      });
      return null;
    }

    const windowExpired = now - record.windowStart >= WINDOW_MS;

    if (windowExpired) {
      // Reset the window
      await ctx.db.patch(record._id, {
        requestCount: 1,
        windowStart: now,
      });
    } else {
      // Increment within the current window
      await ctx.db.patch(record._id, {
        requestCount: record.requestCount + 1,
      });
    }

    return null;
  },
});
