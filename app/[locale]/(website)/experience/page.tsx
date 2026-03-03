import type { Metadata } from "next";
import { cacheLife } from "next/cache";
// import { connection } from "next/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { getConvexClient } from "@/lib/convex-server";
import { SITE_URL } from "@/lib/seo/constants";
import { getPersonSchema } from "@/lib/seo/schemas";
import type { ExperiencePublic } from "@/types/portfolio";
import { api } from "../../../../../convex/_generated/api";
import type { Doc } from "../../../../../convex/_generated/dataModel";
import ExperiencePageWrapper from "./_components/ExperiencePageWrapper";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Experience",
    description:
      "A timeline of professional growth, key roles, and impactful projects I've contributed to throughout my career.",
    alternates: {
      canonical: "/experience",
      languages: {
        en: `${SITE_URL}/experience`,
        ar: `${SITE_URL}/ar/experience`,
      },
    },
    openGraph: {
      title: "Experience | Ahmed Fahmy",
      description:
        "A timeline of professional growth, key roles, and impactful projects I've contributed to throughout my career.",
      type: "website",
      url: `${SITE_URL}/experience`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Experience | Ahmed Fahmy",
      description:
        "A timeline of professional growth, key roles, and impactful projects I've contributed to throughout my career.",
    },
  };
}

function formatPeriod(startDate: number, endDate?: number): string {
  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });

  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : "Present";

  return `${start} - ${end}`;
}

export default async function ExperiencePage() {
  "use cache";
  cacheLife("max");

  // await connection();

  const convex = getConvexClient();

  const rawExperiences = await convex.query(api.experience.getExperience, {});

  const experiences: ExperiencePublic[] = rawExperiences
    .sort(
      (a: Doc<"experience">, b: Doc<"experience">) => a.sortOrder - b.sortOrder,
    )
    .map((exp: Doc<"experience">) => ({
      _id: exp._id,
      _creationTime: exp._creationTime,
      company: exp.company,
      role: exp.role,
      description: exp.description,
      highlights: exp.highlights,
      tags: exp.tags,
      color: exp.color,
      icon: exp.icon,
      startDate: exp.startDate,
      endDate: exp.endDate,
      location: exp.location,
      sortOrder: exp.sortOrder,
      period: formatPeriod(exp.startDate, exp.endDate),
    }));

  return (
    <>
      <JsonLd data={getPersonSchema("en")} />
      <ExperiencePageWrapper experiences={experiences} />
    </>
  );
}
