import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getContacts = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("unread"),
        v.literal("read"),
        v.literal("replied"),
        v.literal("archived"),
      ),
    ),
  },
  returns: v.array(
    v.object({
      _id: v.id("contacts"),
      _creationTime: v.number(),
      name: v.string(),
      email: v.string(),
      subject: v.optional(v.string()),
      message: v.string(),
      status: v.union(
        v.literal("unread"),
        v.literal("read"),
        v.literal("replied"),
        v.literal("archived"),
      ),
      repliedAt: v.optional(v.number()),
    }),
  ),
  handler: async (ctx, args) => {
    if (args.status) {
      const status = args.status;
      return await ctx.db
        .query("contacts")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
    }
    return await ctx.db.query("contacts").collect();
  },
});

export const getContactById = query({
  args: { id: v.id("contacts") },
  returns: v.union(
    v.object({
      _id: v.id("contacts"),
      _creationTime: v.number(),
      name: v.string(),
      email: v.string(),
      subject: v.optional(v.string()),
      message: v.string(),
      status: v.union(
        v.literal("unread"),
        v.literal("read"),
        v.literal("replied"),
        v.literal("archived"),
      ),
      repliedAt: v.optional(v.number()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const submitContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.optional(v.string()),
    message: v.string(),
  },
  returns: v.id("contacts"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("contacts", {
      ...args,
      status: "unread",
    });
  },
});

export const updateContactStatus = mutation({
  args: {
    id: v.id("contacts"),
    status: v.union(
      v.literal("unread"),
      v.literal("read"),
      v.literal("replied"),
      v.literal("archived"),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      ...(args.status === "replied" ? { repliedAt: Date.now() } : {}),
    });
    return null;
  },
});

export const deleteContact = mutation({
  args: { id: v.id("contacts") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const contact = await ctx.db.get(args.id);

    await ctx.db.delete(args.id);

    if (contact) {
      await ctx.db.insert("activityLog", {
        action: "delete",
        entityType: "contact",
        entityId: args.id,
        entityName: contact.name,
        description: `Deleted message from "${contact.name}"`,
      });
    }

    return null;
  },
});
