import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const getProjects = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("published"),
        v.literal("archived"),
      ),
    ),
    featured: v.optional(v.boolean()),
  },
  returns: v.array(
    v.object({
      _id: v.id("projects"),
      _creationTime: v.number(),
      title: v.string(),
      slug: v.string(),
      category: v.string(),
      status: v.union(
        v.literal("draft"),
        v.literal("published"),
        v.literal("archived"),
      ),
      description: v.string(),
      content: v.string(),
      thumbnail: v.optional(v.id("_storage")),
      images: v.optional(v.array(v.id("_storage"))),
      mockupType: v.optional(v.string()),
      tags: v.array(v.string()),
      color: v.string(),
      featured: v.boolean(),
      sortOrder: v.number(),
      startDate: v.optional(v.number()),
      endDate: v.optional(v.number()),
      publishedAt: v.optional(v.number()),
      metaTitle: v.optional(v.string()),
      metaDescription: v.optional(v.string()),
      aiSummary: v.optional(v.string()),
      aiEmbedding: v.optional(v.array(v.float64())),
    }),
  ),
  handler: async (ctx, args) => {
    if (args.status && args.featured !== undefined) {
      const status = args.status;
      const featured = args.featured;
      return await ctx.db
        .query("projects")
        .withIndex("by_status_and_featured", (q) =>
          q.eq("status", status).eq("featured", featured),
        )
        .collect();
    }

    if (args.status) {
      const status = args.status;
      return await ctx.db
        .query("projects")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
    }

    if (args.featured !== undefined) {
      const featured = args.featured;
      return await ctx.db
        .query("projects")
        .withIndex("by_featured", (q) => q.eq("featured", featured))
        .collect();
    }

    return await ctx.db.query("projects").collect();
  },
});

export const getProjectBySlug = query({
  args: { slug: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("projects"),
      _creationTime: v.number(),
      title: v.string(),
      slug: v.string(),
      category: v.string(),
      status: v.union(
        v.literal("draft"),
        v.literal("published"),
        v.literal("archived"),
      ),
      description: v.string(),
      content: v.string(),
      thumbnail: v.optional(v.id("_storage")),
      images: v.optional(v.array(v.id("_storage"))),
      mockupType: v.optional(v.string()),
      tags: v.array(v.string()),
      color: v.string(),
      featured: v.boolean(),
      sortOrder: v.number(),
      startDate: v.optional(v.number()),
      endDate: v.optional(v.number()),
      publishedAt: v.optional(v.number()),
      metaTitle: v.optional(v.string()),
      metaDescription: v.optional(v.string()),
      aiSummary: v.optional(v.string()),
      aiEmbedding: v.optional(v.array(v.float64())),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getProjectById = query({
  args: { id: v.id("projects") },
  returns: v.union(
    v.object({
      _id: v.id("projects"),
      _creationTime: v.number(),
      title: v.string(),
      slug: v.string(),
      category: v.string(),
      status: v.union(
        v.literal("draft"),
        v.literal("published"),
        v.literal("archived"),
      ),
      description: v.string(),
      content: v.string(),
      thumbnail: v.optional(v.id("_storage")),
      images: v.optional(v.array(v.id("_storage"))),
      mockupType: v.optional(v.string()),
      tags: v.array(v.string()),
      color: v.string(),
      featured: v.boolean(),
      sortOrder: v.number(),
      startDate: v.optional(v.number()),
      endDate: v.optional(v.number()),
      publishedAt: v.optional(v.number()),
      metaTitle: v.optional(v.string()),
      metaDescription: v.optional(v.string()),
      aiSummary: v.optional(v.string()),
      aiEmbedding: v.optional(v.array(v.float64())),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createProject = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    category: v.string(),
    description: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    color: v.string(),
    featured: v.boolean(),
    sortOrder: v.number(),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived"),
    ),
    thumbnail: v.optional(v.id("_storage")),
    images: v.optional(v.array(v.id("_storage"))),
    mockupType: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    aiSummary: v.optional(v.string()),
    aiEmbedding: v.optional(v.array(v.float64())),
  },
  returns: v.id("projects"),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      throw new ConvexError({
        code: "ALREADY_EXISTS",
        message: "Project with this slug already exists.",
      });
    }

    const projectId = await ctx.db.insert("projects", args);

    await ctx.db.insert("activityLog", {
      action: "create",
      entityType: "project",
      entityId: projectId,
      entityName: args.title,
      description: `Created project "${args.title}"`,
    });

    return projectId;
  },
});

export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    color: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("published"),
        v.literal("archived"),
      ),
    ),
    thumbnail: v.optional(v.id("_storage")),
    images: v.optional(v.array(v.id("_storage"))),
    mockupType: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    aiSummary: v.optional(v.string()),
    aiEmbedding: v.optional(v.array(v.float64())),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined),
    );
    if (Object.keys(cleanUpdates).length > 0) {
      await ctx.db.patch(id, cleanUpdates);

      const project = await ctx.db.get(id);
      if (project) {
        await ctx.db.insert("activityLog", {
          action: "update",
          entityType: "project",
          entityId: id,
          entityName: project.title,
          description: `Updated project "${project.title}"`,
        });
      }
    }
    return null;
  },
});

export const deleteProject = mutation({
  args: { id: v.id("projects") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);

    await ctx.db.delete(args.id);

    if (project) {
      await ctx.db.insert("activityLog", {
        action: "delete",
        entityType: "project",
        entityId: args.id,
        entityName: project.title,
        description: `Deleted project "${project.title}"`,
      });
    }

    return null;
  },
});

export const reorderProjects = mutation({
  args: {
    projectIds: v.array(v.id("projects")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    for (let i = 0; i < args.projectIds.length; i++) {
      await ctx.db.patch(args.projectIds[i], { sortOrder: i });
    }
    return null;
  },
});
