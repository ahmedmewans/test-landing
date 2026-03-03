import type { Metadata } from "next";
import { cacheLife } from "next/cache";
// import { connection } from "next/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { getConvexClient } from "@/lib/convex-server";
import { SITE_URL } from "@/lib/seo/constants";
import { getCollectionPageSchema } from "@/lib/seo/schemas";
import type { ProjectPublic } from "@/types/portfolio";
import { api } from "../../../../../convex/_generated/api";
import type { Doc } from "../../../../../convex/_generated/dataModel";
import ProjectsPageWrapper from "./_components/ProjectsPageWrapper";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Projects",
    description:
      "Explore a collection of digital products, websites, and experiments crafted with care. UX/UI projects showcasing interactive design and development.",
    alternates: {
      canonical: "/projects",
      languages: {
        en: `${SITE_URL}/projects`,
        ar: `${SITE_URL}/ar/projects`,
      },
    },
    openGraph: {
      title: "Projects | Ahmed Fahmy",
      description:
        "Explore a collection of digital products, websites, and experiments crafted with care.",
      type: "website",
      url: `${SITE_URL}/projects`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Projects | Ahmed Fahmy",
      description:
        "Explore a collection of digital products, websites, and experiments crafted with care.",
    },
  };
}

export default async function ProjectsPage() {
  "use cache";
  cacheLife("max");

  // await connection();

  const convex = getConvexClient();

  const rawProjects = await convex.query(api.projects.getProjects, {
    status: "published",
  });

  const projects: ProjectPublic[] = await Promise.all(
    rawProjects
      .sort(
        (a: Doc<"projects">, b: Doc<"projects">) => a.sortOrder - b.sortOrder,
      )
      .map(async (project: Doc<"projects">) => {
        let thumbnailUrl: string | null = null;
        if (project.thumbnail) {
          thumbnailUrl = await convex.query(api.projects.getFileUrl, {
            storageId: project.thumbnail,
          });
        }
        return {
          _id: project._id,
          _creationTime: project._creationTime,
          title: project.title,
          slug: project.slug,
          category: project.category,
          status: project.status,
          description: project.description,
          content: project.content,
          thumbnail: project.thumbnail,
          thumbnailUrl,
          images: project.images,
          mockupType: project.mockupType,
          tags: project.tags,
          color: project.color,
          featured: project.featured,
          sortOrder: project.sortOrder,
          startDate: project.startDate,
          endDate: project.endDate,
          publishedAt: project.publishedAt,
          metaTitle: project.metaTitle,
          metaDescription: project.metaDescription,
          aiSummary: project.aiSummary,
        };
      }),
  );

  return (
    <>
      <JsonLd
        data={getCollectionPageSchema(
          "Projects",
          "Explore a collection of digital products, websites, and experiments crafted with care.",
          "en",
        )}
      />
      <ProjectsPageWrapper projects={projects} />
    </>
  );
}
