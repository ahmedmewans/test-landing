import { google } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { LanguageModel, UIMessage } from "ai";
import {
  convertToModelMessages,
  generateText,
  stepCountIs,
  streamText,
  tool,
} from "ai";
import { ConvexHttpClient } from "convex/browser";
import { z } from "zod";
import { api } from "../../../../convex/_generated/api";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";

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
- **Never use markdown tables.** The chat interface is too narrow to display tables properly. Always use bulleted lists instead.
- Always be encouraging and positive about Ahmed's capabilities

Remember: You're representing Ahmed professionally, so always put the best foot forward while being genuine and helpful.`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const convex = new ConvexHttpClient(CONVEX_URL);

  // ── Rate Limiting (IP-based, 5 requests / 24h) ──────────────────────
  const forwarded = req.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  // Hash the IP for privacy — we never store raw IPs
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(ip));
  const identifier = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const rateCheck = await convex.query(api.rateLimit.checkRateLimit, {
    identifier,
  });

  if (!rateCheck.allowed) {
    return new Response(
      JSON.stringify({
        error:
          "You've reached the message limit (5 per day). Please try again later! ⏳",
        resetsAt: rateCheck.resetsAt,
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Record this request (increment counter)
  await convex.mutation(api.rateLimit.recordRequest, { identifier });
  // ────────────────────────────────────────────────────────────────────

  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
  });

  // Diverse provider spread — if one infrastructure is overloaded, others stay up.
  // Order based on historical success in this project's Convex logs.
  const MODELS: { name: string; instance: LanguageModel }[] = [
    {
      // ✅ Previously confirmed working in Convex logs
      name: "openrouter/nvidia/nemotron-3-nano-30b-a3b:free",
      instance: openrouter(
        "nvidia/nemotron-3-nano-30b-a3b:free",
      ) as unknown as LanguageModel,
    },
    {
      name: "openrouter/deepseek/deepseek-chat-v3-0324:free",
      instance: openrouter(
        "deepseek/deepseek-chat-v3-0324:free",
      ) as unknown as LanguageModel,
    },
    {
      name: "openrouter/google/gemini-2.0-flash-exp:free",
      instance: openrouter(
        "google/gemini-2.0-flash-exp:free",
      ) as unknown as LanguageModel,
    },
    {
      name: "openrouter/mistralai/mistral-small-3.1-24b-instruct:free",
      instance: openrouter(
        "mistralai/mistral-small-3.1-24b-instruct:free",
      ) as unknown as LanguageModel,
    },
    {
      name: "openrouter/meta-llama/llama-3.3-70b-instruct:free",
      instance: openrouter(
        "meta-llama/llama-3.3-70b-instruct:free",
      ) as unknown as LanguageModel,
    },
    {
      name: "openrouter/qwen/qwen-2.5-72b-instruct:free",
      instance: openrouter(
        "qwen/qwen-2.5-72b-instruct:free",
      ) as unknown as LanguageModel,
    },
    {
      name: "openrouter/google/gemma-3-27b-it:free",
      instance: openrouter(
        "google/gemma-3-27b-it:free",
      ) as unknown as LanguageModel,
    },
    {
      name: "google/gemini-2.0-flash-lite",
      instance: google("gemini-2.0-flash-lite") as unknown as LanguageModel,
    },
    {
      name: "google/gemini-2.0-flash",
      instance: google("gemini-2.0-flash") as unknown as LanguageModel,
    },
  ];

  const tools = {
    getProjects: tool({
      description:
        "Get a list of published portfolio projects. Can filter by featured status.",
      inputSchema: z.object({
        featured: z.boolean().optional(),
      }),
      execute: async ({ featured }) => {
        const projects = await convex.query(api.projects.getProjects, {
          status: "published",
          featured,
        });
        if (projects.length === 0) return "No projects found.";
        return projects
          .slice(0, 5)
          .map(
            (p) =>
              `**${p.title}**\nCategory: ${p.category}\nDescription: ${p.description}\nTechnologies: ${p.tags.join(", ")}`,
          )
          .join("\n\n---\n\n");
      },
    }),
    getSkills: tool({
      description:
        "Get a list of technical skills organized by category with proficiency levels.",
      inputSchema: z.object({
        category: z.string().optional(),
      }),
      execute: async ({ category }) => {
        const skills = await convex.query(api.skills.getSkills, {});
        const filtered = category
          ? skills.filter((s) =>
              s.category.toLowerCase().includes(category.toLowerCase()),
            )
          : skills;
        if (filtered.length === 0) return "No skills found.";
        const grouped = filtered.reduce(
          (acc, s) => {
            if (!acc[s.category]) acc[s.category] = [];
            acc[s.category].push(
              `- ${s.name} (${s.level})${s.yearsOfExperience ? ` - ${s.yearsOfExperience} years` : ""}`,
            );
            return acc;
          },
          {} as Record<string, string[]>,
        );
        return Object.entries(grouped)
          .map(([cat, items]) => `### ${cat}\n${items.join("\n")}`)
          .join("\n\n");
      },
    }),
    getExperience: tool({
      description: "Get work experience history.",
      inputSchema: z.object({
        limit: z.number().optional(),
      }),
      execute: async ({ limit }) => {
        const experiences = await convex.query(
          api.experience.getExperience,
          {},
        );
        const limited = limit ? experiences.slice(0, limit) : experiences;
        if (limited.length === 0) return "No work experience found.";
        return limited
          .map((exp) => {
            const start = new Date(exp.startDate).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });
            const end = exp.endDate
              ? new Date(exp.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "Present";
            const parts = [
              `## ${exp.role} at ${exp.company}`,
              `**Period:** ${start} - ${end}`,
              `**Description:** ${exp.description}`,
            ];
            if (exp.highlights.length > 0) {
              parts.push(
                `**Highlights:**\n${exp.highlights.map((h: string) => `- ${h}`).join("\n")}`,
              );
            }
            return parts.join("\n");
          })
          .join("\n\n---\n\n");
      },
    }),
    getTestimonials: tool({
      description: "Get client testimonials and reviews.",
      inputSchema: z.object({
        featuredOnly: z.boolean().optional(),
      }),
      execute: async ({ featuredOnly }) => {
        const testimonials = await convex.query(
          api.testimonials.getTestimonials,
          { featuredOnly },
        );
        if (testimonials.length === 0) return "No testimonials found.";
        return testimonials
          .map((t) => {
            const parts = [`"${t.content}"`, `— **${t.name}**, ${t.role}`];
            if (t.rating) {
              parts.push(
                `Rating: ${"★".repeat(t.rating)}${"☆".repeat(5 - t.rating)}`,
              );
            }
            return parts.join("\n");
          })
          .join("\n\n---\n\n");
      },
    }),
  };

  const modelMessages = await convertToModelMessages(messages);

  // IMPORTANT: streamText is LAZY — the actual HTTP call to the AI provider
  // only happens when the response stream is consumed, AFTER we return 200.
  // So a try/catch around streamText() will NEVER catch rate-limit (429) errors.
  //
  // Fix: probe each model with a 1-token generateText() call first. This
  // forces any errors (quota, auth, etc.) to surface synchronously before we
  // commit to a streaming response.
  for (let i = 0; i < MODELS.length; i++) {
    const { name: modelName, instance: modelInstance } = MODELS[i];
    try {
      console.log(`[StreamChat] Probing model: ${modelName}`);
      // Use a minimal fixed probe — sending the full conversation on each
      // probe attempt is wasteful and slow. We just need to confirm the
      // model endpoint is reachable and within quota.
      await generateText({
        model: modelInstance,
        messages: [{ role: "user", content: [{ type: "text", text: "hi" }] }],
        maxOutputTokens: 1,
        maxRetries: 0,
      });

      // Probe passed — model is available. Commit to streaming with it.
      console.log(`[StreamChat] Streaming with: ${modelName}`);
      const result = streamText({
        model: modelInstance,
        system: SYSTEM_PROMPT,
        messages: modelMessages,
        tools,
        stopWhen: stepCountIs(5),
        maxRetries: 0,
      });

      return result.toUIMessageStreamResponse();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (i < MODELS.length - 1) {
        console.warn(
          `[StreamChat] ${modelName} unavailable (${errorMsg.slice(0, 120)}), trying next...`,
        );
        continue;
      }
      console.error("[StreamChat] All models exhausted.");
      return new Response(
        JSON.stringify({
          error:
            "All AI models are currently unavailable. Please try again later.",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  return new Response(JSON.stringify({ error: "No models available" }), {
    status: 503,
    headers: { "Content-Type": "application/json" },
  });
}
