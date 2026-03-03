import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getExperience = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("experience"),
      _creationTime: v.number(),
      company: v.string(),
      role: v.string(),
      description: v.string(),
      highlights: v.array(v.string()),
      tags: v.array(v.string()),
      color: v.string(),
      icon: v.optional(v.string()),
      startDate: v.number(),
      endDate: v.optional(v.number()),
      location: v.string(),
      sortOrder: v.number(),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("experience").withIndex("by_sortOrder").collect();
  },
});

export const getExperienceById = query({
  args: { id: v.id("experience") },
  returns: v.union(
    v.object({
      _id: v.id("experience"),
      _creationTime: v.number(),
      company: v.string(),
      role: v.string(),
      description: v.string(),
      highlights: v.array(v.string()),
      tags: v.array(v.string()),
      color: v.string(),
      icon: v.optional(v.string()),
      startDate: v.number(),
      endDate: v.optional(v.number()),
      location: v.string(),
      sortOrder: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createExperience = mutation({
  args: {
    company: v.string(),
    role: v.string(),
    description: v.string(),
    highlights: v.array(v.string()),
    tags: v.array(v.string()),
    color: v.string(),
    icon: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    location: v.string(),
    sortOrder: v.number(),
  },
  returns: v.id("experience"),
  handler: async (ctx, args) => {
    const experienceId = await ctx.db.insert("experience", args);

    await ctx.db.insert("activityLog", {
      action: "create",
      entityType: "experience",
      entityId: experienceId,
      entityName: `${args.role} at ${args.company}`,
      description: `Added experience "${args.role} at ${args.company}"`,
    });

    return experienceId;
  },
});

export const updateExperience = mutation({
  args: {
    id: v.id("experience"),
    company: v.optional(v.string()),
    role: v.optional(v.string()),
    description: v.optional(v.string()),
    highlights: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    location: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined),
    );
    if (Object.keys(cleanUpdates).length > 0) {
      await ctx.db.patch(id, cleanUpdates);

      const experience = await ctx.db.get(id);
      if (experience) {
        await ctx.db.insert("activityLog", {
          action: "update",
          entityType: "experience",
          entityId: id,
          entityName: `${experience.role} at ${experience.company}`,
          description: `Updated experience "${experience.role} at ${experience.company}"`,
        });
      }
    }
    return null;
  },
});

export const deleteExperience = mutation({
  args: { id: v.id("experience") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const experience = await ctx.db.get(args.id);

    await ctx.db.delete(args.id);

    if (experience) {
      await ctx.db.insert("activityLog", {
        action: "delete",
        entityType: "experience",
        entityId: args.id,
        entityName: `${experience.role} at ${experience.company}`,
        description: `Deleted experience "${experience.role} at ${experience.company}"`,
      });
    }

    return null;
  },
});

export const reorderExperience = mutation({
  args: {
    experienceIds: v.array(v.id("experience")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    for (let i = 0; i < args.experienceIds.length; i++) {
      await ctx.db.patch(args.experienceIds[i], { sortOrder: i });
    }
    return null;
  },
});
