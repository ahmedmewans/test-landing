import { createTool } from "@convex-dev/agent";
import { z } from "zod/v3";
import { api } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";

type Project = Doc<"projects">;
type Skill = Doc<"skills">;
type Experience = Doc<"experience">;
type Testimonial = Doc<"testimonials">;

export const getProjects = createTool({
  description:
    "Get a list of published portfolio projects. Can filter by category or featured status. Returns project titles, descriptions, technologies, and links.",
  args: z.object({
    category: z.string().optional().describe("Filter by project category"),
    featured: z.boolean().optional().describe("Only return featured projects"),
  }),
  handler: async (ctx, args): Promise<string> => {
    const projects = await ctx.runQuery(api.projects.getProjects, {
      status: "published",
      featured: args.featured,
    });

    if (projects.length === 0) {
      return "No projects found matching the criteria.";
    }

    const projectList = projects
      .map((p: Project) => {
        const parts = [
          `**${p.title}**`,
          `Category: ${p.category}`,
          `Description: ${p.description}`,
          `Technologies: ${p.tags.join(", ")}`,
        ];
        if (p.featured) parts.push("Featured: Yes");
        return parts.join("\n");
      })
      .join("\n\n---\n\n");

    return `Found ${projects.length} project(s):\n\n${projectList}`;
  },
});

export const getProjectBySlug = createTool({
  description:
    "Get detailed information about a specific project by its slug (URL-friendly identifier). Returns full project details including description, technologies, and timeline.",
  args: z.object({
    slug: z.string().describe("The project's URL slug (e.g., 'my-portfolio')"),
  }),
  handler: async (ctx, args): Promise<string> => {
    const project = await ctx.runQuery(api.projects.getProjectBySlug, {
      slug: args.slug,
    });

    if (!project) {
      return `No project found with slug "${args.slug}". Try listing all projects first to see available slugs.`;
    }

    const parts = [
      `# ${project.title}`,
      `**Category:** ${project.category}`,
      `**Status:** ${project.status}`,
      `**Description:** ${project.description}`,
      `**Technologies:** ${project.tags.join(", ")}`,
    ];

    if (project.featured) parts.push("**Featured Project**");
    if (project.startDate) {
      const startDate = new Date(project.startDate).toLocaleDateString();
      parts.push(`**Started:** ${startDate}`);
    }
    if (project.endDate) {
      const endDate = new Date(project.endDate).toLocaleDateString();
      parts.push(`**Completed:** ${endDate}`);
    }
    if (project.aiSummary) {
      parts.push(`\n**AI Summary:** ${project.aiSummary}`);
    }

    return parts.join("\n");
  },
});

export const getSkills = createTool({
  description:
    "Get a list of technical skills organized by category. Shows proficiency level and years of experience for each skill.",
  args: z.object({
    category: z.string().optional().describe("Filter by skill category"),
  }),
  handler: async (ctx, args): Promise<string> => {
    const allSkills = await ctx.runQuery(api.skills.getSkills, {});

    let skills: Skill[] = allSkills;
    if (args.category) {
      skills = allSkills.filter((s: Skill) =>
        s.category.toLowerCase().includes(args.category?.toLowerCase() ?? ""),
      );
    }

    if (skills.length === 0) {
      return "No skills found matching the criteria.";
    }

    const groupedByCategory = skills.reduce(
      (acc: Record<string, Skill[]>, skill: Skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
      },
      {} as Record<string, Skill[]>,
    );

    const output = Object.entries(groupedByCategory)
      .map(([category, categorySkills]: [string, Skill[]]) => {
        const skillList = categorySkills
          .map((s: Skill) => {
            let line = `- ${s.name} (${s.level})`;
            if (s.yearsOfExperience) {
              line += ` - ${s.yearsOfExperience} years`;
            }
            return line;
          })
          .join("\n");
        return `### ${category}\n${skillList}`;
      })
      .join("\n\n");

    return `**Technical Skills**\n\n${output}`;
  },
});

export const getExperience = createTool({
  description:
    "Get work experience history. Shows companies, roles, responsibilities, and key achievements.",
  args: z.object({
    limit: z
      .number()
      .optional()
      .describe("Maximum number of experiences to return"),
  }),
  handler: async (ctx, args): Promise<string> => {
    const experiences = await ctx.runQuery(api.experience.getExperience, {});
    const limited: Experience[] = args.limit
      ? experiences.slice(0, args.limit)
      : experiences;

    if (limited.length === 0) {
      return "No work experience found.";
    }

    const output = limited
      .map((exp: Experience) => {
        const startDate = new Date(exp.startDate).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        const endDate = exp.endDate
          ? new Date(exp.endDate).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
          : "Present";

        const parts = [
          `## ${exp.role} at ${exp.company}`,
          `**Period:** ${startDate} - ${endDate}`,
          `**Location:** ${exp.location}`,
          `**Description:** ${exp.description}`,
        ];

        if (exp.highlights.length > 0) {
          parts.push(
            `**Key Achievements:**\n${exp.highlights.map((h: string) => `- ${h}`).join("\n")}`,
          );
        }

        if (exp.tags.length > 0) {
          parts.push(`**Technologies:** ${exp.tags.join(", ")}`);
        }

        return parts.join("\n");
      })
      .join("\n\n---\n\n");

    return `**Work Experience**\n\n${output}`;
  },
});

export const getTestimonials = createTool({
  description:
    "Get client testimonials and reviews. Shows feedback from previous clients and collaborators.",
  args: z.object({
    featuredOnly: z
      .boolean()
      .optional()
      .describe("Only return featured testimonials"),
  }),
  handler: async (ctx, args): Promise<string> => {
    const testimonials = await ctx.runQuery(api.testimonials.getTestimonials, {
      featuredOnly: args.featuredOnly,
    });

    if (testimonials.length === 0) {
      return "No testimonials found.";
    }

    const output = testimonials
      .map((t: Testimonial) => {
        const parts = [`"${t.content}"`, `— **${t.name}**, ${t.role}`];
        if (t.rating) {
          const stars = "★".repeat(t.rating) + "☆".repeat(5 - t.rating);
          parts.push(`Rating: ${stars}`);
        }
        return parts.join("\n");
      })
      .join("\n\n---\n\n");

    return `**Client Testimonials**\n\n${output}`;
  },
});

export const searchPortfolio = createTool({
  description:
    "Search across all portfolio content (projects, skills, experience) using semantic search. Use this when the user asks a question that might require finding relevant information across multiple areas. Note: This tool requires RAG to be set up - if not available, use other tools instead.",
  args: z.object({
    query: z.string().describe("The search query"),
    limit: z.number().optional().describe("Maximum results to return"),
  }),
  handler: async (ctx, args): Promise<string> => {
    const results = await ctx.runAction(api.knowledge.searchKnowledge, {
      query: args.query,
      limit: args.limit,
    });

    if (results.length === 0) {
      return `No relevant information found for "${args.query}".`;
    }

    const formattedResults = results
      .map((r: any) => {
        return `[${r.type.toUpperCase()}] (Score: ${r.score.toFixed(2)})\n${r.content}`;
      })
      .join("\n\n---\n\n");

    return `Found relevant information:\n\n${formattedResults}`;
  },
});
