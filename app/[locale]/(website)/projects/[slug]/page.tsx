import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
// import { connection } from "next/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { getConvexClient } from "@/lib/convex-server";
import { SITE_URL } from "@/lib/seo/constants";
import { getBreadcrumbSchema, getProjectSchema } from "@/lib/seo/schemas";
import type { ProjectPublic } from "@/types/portfolio";
import { api } from "../../../../../../convex/_generated/api";
import ProjectDetailClient from "./_components/ProjectDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const convex = getConvexClient();

  const project = await convex.query(api.projects.getProjectBySlug, {
    slug: params.slug,
  });

  if (!project || project.status !== "published") {
    return {
      title: "Project Not Found",
    };
  }

  const title = project.metaTitle || project.title;
  const description = project.metaDescription || project.description;

  let imageUrl: string | null = null;
  if (project.thumbnail) {
    imageUrl = await convex.query(api.projects.getFileUrl, {
      storageId: project.thumbnail,
    });
  }

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${params.slug}`,
      languages: {
        en: `${SITE_URL}/projects/${params.slug}`,
        ar: `${SITE_URL}/ar/projects/${params.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/projects/${params.slug}`,
      publishedTime: project.publishedAt
        ? new Date(project.publishedAt).toISOString()
        : undefined,
      authors: ["Ahmed Fahmy"],
      ...(imageUrl && { images: [imageUrl] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}

export async function generateStaticParams() {
  const convex = getConvexClient();
  const rawProjects = await convex.query(api.projects.getProjects, {
    status: "published",
  });

  return rawProjects.map((project) => ({
    slug: project.slug,
  }));
}

async function getProjectData(slug: string) {
  "use cache";
  cacheLife("max");

  // await connection();

  const convex = getConvexClient();
  const rawProjects = await convex.query(api.projects.getProjects, {
    status: "published",
  });

  const sortedProjects = rawProjects.sort((a, b) => a.sortOrder - b.sortOrder);
  const currentIndex = sortedProjects.findIndex((p) => p.slug === slug);

  if (currentIndex === -1) {
    return null;
  }

  const rawProject = sortedProjects[currentIndex];

  let currentThumbnailUrl: string | null = null;
  if (rawProject.thumbnail) {
    currentThumbnailUrl = await convex.query(api.projects.getFileUrl, {
      storageId: rawProject.thumbnail,
    });
  }

  const imageUrls: string[] = [];
  if (rawProject.images && rawProject.images.length > 0) {
    for (const storageId of rawProject.images) {
      const url = await convex.query(api.projects.getFileUrl, {
        storageId,
      });
      if (url) {
        imageUrls.push(url);
      }
    }
  }

  const project: ProjectPublic = {
    ...rawProject,
    thumbnailUrl: currentThumbnailUrl,
    imageUrls,
  };

  const nextProjectRaw =
    sortedProjects[(currentIndex + 1) % sortedProjects.length];

  let nextProject = null;
  if (nextProjectRaw && nextProjectRaw.slug !== slug) {
    let nextThumbnailUrl: string | null = null;
    if (nextProjectRaw.thumbnail) {
      nextThumbnailUrl = await convex.query(api.projects.getFileUrl, {
        storageId: nextProjectRaw.thumbnail,
      });
    }
    nextProject = {
      title: nextProjectRaw.title,
      slug: nextProjectRaw.slug,
      category: nextProjectRaw.category,
      thumbnailUrl: nextThumbnailUrl,
      color: nextProjectRaw.color,
    };
  }

  return { project, nextProject };
}

export default async function ProjectPage(props: PageProps) {
  const params = await props.params;
  const data = await getProjectData(params.slug);

  if (!data) {
    notFound();
  }

  const { project, nextProject } = data;

  return (
    <>
      <JsonLd
        data={getProjectSchema(
          {
            title: project.title,
            description: project.description,
            slug: project.slug,
            imageUrl: project.thumbnailUrl,
            publishedAt: project.publishedAt,
            tags: project.tags,
          },
          "en",
        )}
      />
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: project.title, path: `/projects/${project.slug}` },
        ])}
      />
      <ProjectDetailClient project={project} nextProject={nextProject} />
    </>
  );
}
