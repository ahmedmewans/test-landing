import { google } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { LanguageModel } from "ai";
import { generateText, stepCountIs, tool } from "ai";
import { v } from "convex/values";
import { z } from "zod/v3";
import { api } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";
import { action } from "./_generated/server";

type Project = Doc<"projects">;
type Skill = Doc<"skills">;
type Experience = Doc<"experience">;
type Testimonial = Doc<"testimonials">;

const SYSTEM_PROMPT = `You are Ahmed's AI portfolio assistant. You help visitors learn about Ahmed's work, skills, and experience in a friendly and engaging way.

## Your Personality
- Warm, approachable, and professional
- Enthusiastic about Ahmed's work and projects
- Helpful in guiding visitors to relevant information
- Concise but thorough in your responses

## What You Know About Ahmed
Ahmed is a Frontend Engineer specializing in Next.js 15, React 19, and strict TypeScript.
You have access to tools that let you query Ahmed's portfolio data:
- Projects (with technologies, descriptions, and links)
- Skills (organized by category with proficiency levels)
- Work Experience (companies, roles, achievements)
- Testimonials (client feedback and reviews)

## How to Respond
1. **Be conversational** - Don't just list facts, engage naturally
2. **Use tools** - When asked about specific work, skills, or projects, use the appropriate tool to get accurate information
3. **Be specific** - When discussing projects, mention technologies used and highlight interesting aspects
4. **Recommend** - If someone asks for a recommendation, suggest relevant projects based on their interests

## Guidelines
- If you don't know something, say so honestly rather than making things up
- Keep responses focused and avoid unnecessary fluff
- Use markdown formatting for better readability
- When listing multiple items, use bullet points
- **Never use markdown tables.** The chat interface is too narrow (378x351) to display tables properly. Always use bulleted lists instead.
- Always be encouraging and positive about Ahmed's capabilities

Remember: You're representing Ahmed professionally, so always put the best foot forward while being genuine and helpful.`;

export const sendMessage = action({
  args: {
    message: v.string(),
    history: v.optional(
      v.array(
        v.object({
          role: v.union(v.literal("user"), v.literal("assistant")),
          content: v.string(),
        }),
      ),
    ),
  },
  returns: v.object({
    response: v.string(),
  }),
  handler: async (ctx, args): Promise<{ response: string }> => {
    const messages = args.history ?? [];

    /**
     * Fallback chain: Google direct API first (fastest), then OpenRouter free models.
     * Each provider+model combo has separate rate limits, maximizing availability.
     */
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY!,
    });

    const MODELS: { name: string; instance: LanguageModel }[] = [
      // Google direct API models (20 RPD each on free tier)
      {
        name: "google/gemini-2.0-flash",
        instance: google("gemini-2.0-flash") as any,
      },
      {
        name: "google/gemini-2.0-flash-lite",
        instance: google("gemini-2.0-flash-lite") as any,
      },
      {
        name: "google/gemini-2.5-flash",
        instance: google("gemini-2.5-flash") as any,
      },
      // OpenRouter free models with tool support (verified via API + article research)
      {
        name: "openrouter/meta-llama/llama-3.3-70b-instruct:free",
        instance: openrouter("meta-llama/llama-3.3-70b-instruct:free") as any,
      },
      {
        name: "openrouter/mistralai/mistral-small-3.1-24b-instruct:free",
        instance: openrouter(
          "mistralai/mistral-small-3.1-24b-instruct:free",
        ) as any,
      },
      {
        name: "openrouter/google/gemma-3-27b-it:free",
        instance: openrouter("google/gemma-3-27b-it:free") as any,
      },
      {
        name: "openrouter/openai/gpt-oss-120b:free",
        instance: openrouter("openai/gpt-oss-120b:free") as any,
      },
      {
        name: "openrouter/nvidia/nemotron-3-nano-30b-a3b:free",
        instance: openrouter("nvidia/nemotron-3-nano-30b-a3b:free") as any,
      },
      {
        name: "openrouter/qwen/qwen3-coder:free",
        instance: openrouter("qwen/qwen3-coder:free") as any,
      },
      {
        name: "openrouter/stepfun/step-3.5-flash:free",
        instance: openrouter("stepfun/step-3.5-flash:free") as any,
      },
      {
        name: "openrouter/z-ai/glm-4.5-air:free",
        instance: openrouter("z-ai/glm-4.5-air:free") as any,
      },
      // Ultimate fallback: OpenRouter free router auto-selects the best
      // available free model that supports the request's features (tool calling, etc.)
      {
        name: "openrouter/free",
        instance: openrouter("openrouter/free") as any,
      },
    ];

    const formattedMessages = [
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: args.message },
    ];

    const toolDefinitions = {
      getProjects: tool({
        description:
          "Get a list of published portfolio projects. Can filter by category or featured status.",
        inputSchema: z.object({
          category: z.string().optional(),
          featured: z.boolean().optional(),
        }),
        execute: async ({ category, featured }) => {
          const projects = await ctx.runQuery(api.projects.getProjects, {
            status: "published",
            featured: featured,
          });

          if (projects.length === 0) {
            return "No projects found.";
          }

          let filtered = projects;
          if (category) {
            filtered = projects.filter((p: Project) =>
              p.category.toLowerCase().includes(category.toLowerCase()),
            );
          }

          return filtered
            .map((p: Project) => ({
              title: p.title,
              category: p.category,
              description: p.description,
              technologies: p.tags,
              featured: p.featured,
            }))
            .slice(0, 5);
        },
      }),
      getProjectBySlug: tool({
        description:
          "Get detailed information about a specific project by its slug.",
        inputSchema: z.object({
          slug: z.string(),
        }),
        execute: async ({ slug }) => {
          const project = await ctx.runQuery(api.projects.getProjectBySlug, {
            slug,
          });

          if (!project) {
            return { error: `Project "${slug}" not found.` };
          }

          return {
            title: project.title,
            category: project.category,
            description: project.description,
            technologies: project.tags,
            featured: project.featured,
            startDate: project.startDate,
            endDate: project.endDate,
          };
        },
      }),
      getSkills: tool({
        description:
          "Get a list of technical skills organized by category with proficiency levels.",
        inputSchema: z.object({
          category: z.string().optional(),
        }),
        execute: async ({ category }) => {
          const skills = await ctx.runQuery(api.skills.getSkills, {});

          let filtered = skills;
          if (category) {
            filtered = skills.filter((s: Skill) =>
              s.category.toLowerCase().includes(category.toLowerCase()),
            );
          }

          return filtered.reduce(
            (
              acc: Record<
                string,
                Array<{ name: string; level: string; years?: number }>
              >,
              s: Skill,
            ) => {
              if (!acc[s.category]) acc[s.category] = [];
              acc[s.category].push({
                name: s.name,
                level: s.level,
                years: s.yearsOfExperience,
              });
              return acc;
            },
            {} as Record<
              string,
              Array<{ name: string; level: string; years?: number }>
            >,
          );
        },
      }),
      getExperience: tool({
        description: "Get work experience history.",
        inputSchema: z.object({
          limit: z.number().optional(),
        }),
        execute: async ({ limit }) => {
          const experiences = await ctx.runQuery(
            api.experience.getExperience,
            {},
          );
          const limited = limit ? experiences.slice(0, limit) : experiences;

          return limited.map((exp: Experience) => ({
            company: exp.company,
            role: exp.role,
            location: exp.location,
            description: exp.description,
            highlights: exp.highlights,
            technologies: exp.tags,
            period: `${new Date(exp.startDate).getFullYear()} - ${exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}`,
          }));
        },
      }),
      getTestimonials: tool({
        description: "Get client testimonials and reviews.",
        inputSchema: z.object({
          featuredOnly: z.boolean().optional(),
        }),
        execute: async ({ featuredOnly }) => {
          const testimonials = await ctx.runQuery(
            api.testimonials.getTestimonials,
            { featuredOnly },
          );

          return testimonials.map((t: Testimonial) => ({
            name: t.name,
            role: t.role,
            content: t.content,
            rating: t.rating,
          }));
        },
      }),
    };

    // Try each model in the fallback chain
    for (let i = 0; i < MODELS.length; i++) {
      const { name: modelName, instance: modelInstance } = MODELS[i];
      try {
        console.log(`[Chat] Trying model: ${modelName}`);

        const result = await generateText({
          model: modelInstance,
          system: SYSTEM_PROMPT,
          stopWhen: stepCountIs(5),
          // Don't retry on the same model — just fail fast and try the next one
          maxRetries: 0,
          messages: formattedMessages,
          tools: toolDefinitions,
        });

        console.log(
          `[Chat] Success with ${modelName}. Steps: ${result.steps.length}, Text length: ${result.text?.length ?? 0}`,
        );

        return {
          response: result.text,
        };
      } catch (error: unknown) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        // If more models available, try the next one regardless of error type
        if (i < MODELS.length - 1) {
          console.warn(
            `[Chat] ${modelName} failed (${errorMsg.slice(0, 100)}), falling back...`,
          );
          continue;
        }

        // All models exhausted — return friendly message
        const isRateLimit =
          errorMsg.includes("quota") ||
          errorMsg.includes("429") ||
          errorMsg.includes("RESOURCE_EXHAUSTED") ||
          errorMsg.includes("rate");
        console.error(
          `[Chat Error] All ${MODELS.length} models failed. Last error:`,
          errorMsg.slice(0, 300),
        );
        return {
          response: isRateLimit
            ? "I'm a bit overwhelmed right now — too many requests! Please wait about 30 seconds and try again. ⏳"
            : "Sorry, I ran into an issue processing your message. Please try again shortly.",
        };
      }
    }

    // Should never reach here, but just in case
    return {
      response:
        "Sorry, I couldn't process your message. Please try again later.",
    };
  },
});
