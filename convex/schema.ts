import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    // Core
    title: v.string(),
    slug: v.string(),
    category: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived"),
    ),

    // Content
    description: v.string(),
    content: v.string(), // HTML or JSON from Tiptap

    // Media
    thumbnail: v.optional(v.id("_storage")),
    images: v.optional(v.array(v.id("_storage"))),
    mockupType: v.optional(v.string()),

    // Metadata
    tags: v.array(v.string()),
    color: v.string(),
    featured: v.boolean(),
    sortOrder: v.number(),

    // Dates
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    publishedAt: v.optional(v.number()),

    // SEO
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),

    // AI-Generated
    aiSummary: v.optional(v.string()),
    aiEmbedding: v.optional(v.array(v.float64())),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_featured", ["featured"])
    .index("by_category", ["category"])
    .index("by_status_and_featured", ["status", "featured"])
    .searchIndex("search_projects", {
      searchField: "title",
      filterFields: ["status", "category"],
    }),

  experience: defineTable({
    company: v.string(),
    role: v.string(),
    description: v.string(),
    highlights: v.array(v.string()),
    tags: v.array(v.string()),
    color: v.string(),
    icon: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.optional(v.number()), // undefined = "Present"
    location: v.string(),
    sortOrder: v.number(),
  }).index("by_sortOrder", ["sortOrder"]),

  skills: defineTable({
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
  }).index("by_category", ["category"]),

  testimonials: defineTable({
    name: v.string(),
    role: v.string(),
    content: v.string(),
    avatar: v.optional(v.id("_storage")),
    rating: v.optional(v.number()),
    featured: v.boolean(),
    sortOrder: v.number(),
  })
    .index("by_featured", ["featured"])
    .index("by_sortOrder", ["sortOrder"]),

  contacts: defineTable({
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
  }).index("by_status", ["status"]),

  analytics: defineTable({
    event: v.string(),
    page: v.optional(v.string()),
    referrer: v.optional(v.string()),
    metadata: v.optional(v.string()), // JSON string
  }).index("by_event", ["event"]),

  activityLog: defineTable({
    action: v.union(
      v.literal("create"),
      v.literal("update"),
      v.literal("delete"),
    ),
    entityType: v.string(), // "project", "experience", "skill", "testimonial", "contact"
    entityId: v.optional(v.string()), // ID of the entity (optional for bulk deletes)
    entityName: v.optional(v.string()), // Name/title for display
    description: v.string(), // Human-readable description
    metadata: v.optional(v.string()), // JSON string for additional data
  })
    .index("by_entityType", ["entityType"])
    .index("by_action", ["action"]),

  chatRateLimit: defineTable({
    identifier: v.string(), // hashed IP address
    requestCount: v.number(), // requests in current window
    windowStart: v.number(), // timestamp (ms) when window opened
  }).index("by_identifier", ["identifier"]),
});
