import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const logProjectActivity = internalMutation({
  args: {
    action: v.union(
      v.literal("create"),
      v.literal("update"),
      v.literal("delete"),
    ),
    entityId: v.string(),
    entityName: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("activityLog", {
      action: args.action,
      entityType: "project",
      entityId: args.entityId,
      entityName: args.entityName,
      description: args.description,
    });
  },
});

export const logExperienceActivity = internalMutation({
  args: {
    action: v.union(
      v.literal("create"),
      v.literal("update"),
      v.literal("delete"),
    ),
    entityId: v.string(),
    entityName: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("activityLog", {
      action: args.action,
      entityType: "experience",
      entityId: args.entityId,
      entityName: args.entityName,
      description: args.description,
    });
  },
});

export const logSkillActivity = internalMutation({
  args: {
    action: v.union(
      v.literal("create"),
      v.literal("update"),
      v.literal("delete"),
    ),
    entityId: v.string(),
    entityName: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("activityLog", {
      action: args.action,
      entityType: "skill",
      entityId: args.entityId,
      entityName: args.entityName,
      description: args.description,
    });
  },
});

export const logTestimonialActivity = internalMutation({
  args: {
    action: v.union(
      v.literal("create"),
      v.literal("update"),
      v.literal("delete"),
    ),
    entityId: v.string(),
    entityName: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("activityLog", {
      action: args.action,
      entityType: "testimonial",
      entityId: args.entityId,
      entityName: args.entityName,
      description: args.description,
    });
  },
});

export const logContactActivity = internalMutation({
  args: {
    action: v.union(
      v.literal("create"),
      v.literal("update"),
      v.literal("delete"),
    ),
    entityId: v.optional(v.string()),
    entityName: v.optional(v.string()),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("activityLog", {
      action: args.action,
      entityType: "contact",
      entityId: args.entityId,
      entityName: args.entityName,
      description: args.description,
    });
  },
});
