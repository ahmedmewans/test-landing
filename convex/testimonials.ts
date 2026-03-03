import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTestimonials = query({
  args: { featuredOnly: v.optional(v.boolean()) },
  returns: v.array(
    v.object({
      _id: v.id("testimonials"),
      _creationTime: v.number(),
      name: v.string(),
      role: v.string(),
      content: v.string(),
      avatar: v.optional(v.id("_storage")),
      rating: v.optional(v.number()),
      featured: v.boolean(),
      sortOrder: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    if (args.featuredOnly) {
      return await ctx.db
        .query("testimonials")
        .withIndex("by_featured", (q) => q.eq("featured", true))
        .collect();
    }
    return await ctx.db
      .query("testimonials")
      .withIndex("by_sortOrder")
      .collect();
  },
});

export const getTestimonialById = query({
  args: { id: v.id("testimonials") },
  returns: v.union(
    v.object({
      _id: v.id("testimonials"),
      _creationTime: v.number(),
      name: v.string(),
      role: v.string(),
      content: v.string(),
      avatar: v.optional(v.id("_storage")),
      rating: v.optional(v.number()),
      featured: v.boolean(),
      sortOrder: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createTestimonial = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    content: v.string(),
    avatar: v.optional(v.id("_storage")),
    rating: v.optional(v.number()),
    featured: v.boolean(),
    sortOrder: v.number(),
  },
  returns: v.id("testimonials"),
  handler: async (ctx, args) => {
    const testimonialId = await ctx.db.insert("testimonials", args);

    await ctx.db.insert("activityLog", {
      action: "create",
      entityType: "testimonial",
      entityId: testimonialId,
      entityName: args.name,
      description: `Added testimonial from "${args.name}"`,
    });

    return testimonialId;
  },
});

export const updateTestimonial = mutation({
  args: {
    id: v.id("testimonials"),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    content: v.optional(v.string()),
    avatar: v.optional(v.id("_storage")),
    rating: v.optional(v.number()),
    featured: v.optional(v.boolean()),
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

      const testimonial = await ctx.db.get(id);
      if (testimonial) {
        await ctx.db.insert("activityLog", {
          action: "update",
          entityType: "testimonial",
          entityId: id,
          entityName: testimonial.name,
          description: `Updated testimonial from "${testimonial.name}"`,
        });
      }
    }
    return null;
  },
});

export const deleteTestimonial = mutation({
  args: { id: v.id("testimonials") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const testimonial = await ctx.db.get(args.id);

    await ctx.db.delete(args.id);

    if (testimonial) {
      await ctx.db.insert("activityLog", {
        action: "delete",
        entityType: "testimonial",
        entityId: args.id,
        entityName: testimonial.name,
        description: `Deleted testimonial from "${testimonial.name}"`,
      });
    }

    return null;
  },
});
