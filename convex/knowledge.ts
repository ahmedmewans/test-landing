import { google } from "@ai-sdk/google";
import { RAG } from "@convex-dev/rag";
import { v } from "convex/values";
import { api, components } from "./_generated/api";
import { action } from "./_generated/server";

const rag = new RAG(components.rag, {
  textEmbeddingModel: google.textEmbedding("text-embedding-004"),
  embeddingDimension: 768,
});

const NAMESPACE = "portfolio";

export const searchKnowledge = action({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      type: v.string(),
      content: v.string(),
      score: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const { results } = await rag.search(ctx, {
      namespace: NAMESPACE,
      query: args.query,
      limit: args.limit ?? 5,
    });

    return results.map((r) => {
      const firstContent = r.content[0];
      return {
        type: (firstContent?.metadata?.type as string) ?? "unknown",
        content: firstContent?.text ?? "",
        score: r.score,
      };
    });
  },
});

export const seedKnowledge = action({
  args: {},
  returns: v.object({
    added: v.number(),
    errors: v.array(v.string()),
  }),
  handler: async (ctx) => {
    let added = 0;
    const errors: string[] = [];

    const projects = await ctx.runQuery(api.projects.getProjects, {
      status: "published",
    });

    for (const project of projects) {
      try {
        const content = [
          `Project: ${project.title}`,
          `Category: ${project.category}`,
          `Description: ${project.description}`,
          `Technologies: ${project.tags.join(", ")}`,
          project.aiSummary ? `Summary: ${project.aiSummary}` : "",
        ]
          .filter(Boolean)
          .join("\n");

        await rag.add(ctx, {
          namespace: NAMESPACE,
          text: content,
          metadata: {
            type: "project",
            title: project.title,
            slug: project.slug,
            category: project.category,
          },
        });
        added++;
      } catch (e) {
        errors.push(`Failed to add project ${project.title}: ${e}`);
      }
    }

    const skills = await ctx.runQuery(api.skills.getSkills, {});
    const skillsByCategory = skills.reduce(
      (acc: Record<string, typeof skills>, skill: (typeof skills)[0]) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
      },
      {} as Record<string, typeof skills>,
    );

    for (const [category, categorySkills] of Object.entries(skillsByCategory)) {
      try {
        const content = [
          `Skills in ${category}:`,
          ...((categorySkills as unknown as any[]).map(
            (s: any) =>
              `- ${s.name} (${s.level}${s.yearsOfExperience ? `, ${s.yearsOfExperience} years` : ""})`,
          ) as string[]),
        ].join("\n");

        await rag.add(ctx, {
          namespace: NAMESPACE,
          text: content,
          metadata: {
            type: "skills",
            category: category,
          },
        });
        added++;
      } catch (e) {
        errors.push(`Failed to add skills for ${category}: ${e}`);
      }
    }

    const experiences = await ctx.runQuery(api.experience.getExperience, {});

    for (const exp of experiences) {
      try {
        const content = [
          `Work Experience: ${exp.role} at ${exp.company}`,
          `Location: ${exp.location}`,
          `Period: ${new Date(exp.startDate).getFullYear()} - ${exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}`,
          `Description: ${exp.description}`,
          `Highlights: ${exp.highlights.join("; ")}`,
          `Technologies: ${exp.tags.join(", ")}`,
        ].join("\n");

        await rag.add(ctx, {
          namespace: NAMESPACE,
          text: content,
          metadata: {
            type: "experience",
            company: exp.company,
            role: exp.role,
          },
        });
        added++;
      } catch (e) {
        errors.push(`Failed to add experience ${exp.company}: ${e}`);
      }
    }

    const testimonials = await ctx.runQuery(
      api.testimonials.getTestimonials,
      {},
    );

    for (const testimonial of testimonials) {
      try {
        const content = [
          `Testimonial from ${testimonial.name} (${testimonial.role}):`,
          `"${testimonial.content}"`,
        ].join("\n");

        await rag.add(ctx, {
          namespace: NAMESPACE,
          text: content,
          metadata: {
            type: "testimonial",
            name: testimonial.name,
            role: testimonial.role,
          },
        });
        added++;
      } catch (e) {
        errors.push(`Failed to add testimonial from ${testimonial.name}: ${e}`);
      }
    }

    return { added, errors };
  },
});
