import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getSkills = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("skills"),
      _creationTime: v.number(),
      name: v.string(),
      category: v.string(),
      level: v.union(
        v.literal("beginner"),
        v.literal("intermediate"),
        v.literal("advanced"),
        v.literal("expert"),
      ),
      icon: v.optional(v.string()),
      sortOrder: v.number(),
      yearsOfExperience: v.optional(v.number()),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("skills").withIndex("by_category").collect();
  },
});

export const getSkillById = query({
  args: { id: v.id("skills") },
  returns: v.union(
    v.object({
      _id: v.id("skills"),
      _creationTime: v.number(),
      name: v.string(),
      category: v.string(),
      level: v.union(
        v.literal("beginner"),
        v.literal("intermediate"),
        v.literal("advanced"),
        v.literal("expert"),
      ),
      icon: v.optional(v.string()),
      sortOrder: v.number(),
      yearsOfExperience: v.optional(v.number()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createSkill = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    level: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("expert"),
    ),
    icon: v.optional(v.string()),
    sortOrder: v.number(),
    yearsOfExperience: v.optional(v.number()),
  },
  returns: v.id("skills"),
  handler: async (ctx, args) => {
    const skillId = await ctx.db.insert("skills", args);

    await ctx.db.insert("activityLog", {
      action: "create",
      entityType: "skill",
      entityId: skillId,
      entityName: args.name,
      description: `Added skill "${args.name}"`,
    });

    return skillId;
  },
});

export const updateSkill = mutation({
  args: {
    id: v.id("skills"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    level: v.optional(
      v.union(
        v.literal("beginner"),
        v.literal("intermediate"),
        v.literal("advanced"),
        v.literal("expert"),
      ),
    ),
    icon: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
    yearsOfExperience: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined),
    );
    if (Object.keys(cleanUpdates).length > 0) {
      await ctx.db.patch(id, cleanUpdates);

      const skill = await ctx.db.get(id);
      if (skill) {
        await ctx.db.insert("activityLog", {
          action: "update",
          entityType: "skill",
          entityId: id,
          entityName: skill.name,
          description: `Updated skill "${skill.name}"`,
        });
      }
    }
    return null;
  },
});

export const deleteSkill = mutation({
  args: { id: v.id("skills") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const skill = await ctx.db.get(args.id);

    await ctx.db.delete(args.id);

    if (skill) {
      await ctx.db.insert("activityLog", {
        action: "delete",
        entityType: "skill",
        entityId: args.id,
        entityName: skill.name,
        description: `Deleted skill "${skill.name}"`,
      });
    }

    return null;
  },
});

export const reorderSkills = mutation({
  args: {
    skillIds: v.array(v.id("skills")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    for (let i = 0; i < args.skillIds.length; i++) {
      await ctx.db.patch(args.skillIds[i], { sortOrder: i });
    }
    return null;
  },
});
