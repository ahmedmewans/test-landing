import type { MetadataRoute } from "next";
import { getConvexClient } from "@/lib/convex-server";
import { SITE_URL } from "@/lib/seo/constants";
import { api } from "../../convex/_generated/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const convex = getConvexClient();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: SITE_URL,
          ar: `${SITE_URL}/ar`,
        },
      },
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${SITE_URL}/about`,
          ar: `${SITE_URL}/ar/about`,
        },
      },
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${SITE_URL}/projects`,
          ar: `${SITE_URL}/ar/projects`,
        },
      },
    },
    {
      url: `${SITE_URL}/experience`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${SITE_URL}/experience`,
          ar: `${SITE_URL}/ar/experience`,
        },
      },
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          en: `${SITE_URL}/contact`,
          ar: `${SITE_URL}/ar/contact`,
        },
      },
    },
  ];

  try {
    const projects = await convex.query(api.projects.getProjects, {
      status: "published",
    });

    const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: project.publishedAt
        ? new Date(project.publishedAt)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${SITE_URL}/projects/${project.slug}`,
          ar: `${SITE_URL}/ar/projects/${project.slug}`,
        },
      },
    }));

    return [...staticPages, ...projectPages];
  } catch {
    return staticPages;
  }
}
