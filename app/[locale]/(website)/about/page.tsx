import type { Metadata } from "next";
import { cacheLife } from "next/cache";
// import { connection } from "next/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { getConvexClient } from "@/lib/convex-server";
import { SITE_URL } from "@/lib/seo/constants";
import { getPersonSchema } from "@/lib/seo/schemas";
import type { SkillPublic, TestimonialPublic } from "@/types/portfolio";
import { api } from "../../../../../convex/_generated/api";
import type { Doc } from "../../../../../convex/_generated/dataModel";
import AboutPageWrapper from "./_components/AboutPageWrapper";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About",
    description:
      "Get to know Ahmed Fahmy - a creative developer crafting experiences where code meets emotion. Learn about skills, journey, and passion for interactive design.",
    alternates: {
      canonical: "/about",
      languages: {
        en: `${SITE_URL}/about`,
        ar: `${SITE_URL}/ar/about`,
      },
    },
    openGraph: {
      title: "About | Ahmed Fahmy",
      description:
        "Get to know Ahmed Fahmy - a creative developer crafting experiences where code meets emotion.",
      type: "website",
      url: `${SITE_URL}/about`,
    },
    twitter: {
      card: "summary_large_image",
      title: "About | Ahmed Fahmy",
      description:
        "Get to know Ahmed Fahmy - a creative developer crafting experiences where code meets emotion.",
    },
  };
}

export default async function AboutPage() {
  "use cache";
  cacheLife("max");
  // await connection();

  const convex = getConvexClient();

  const [rawSkills, rawTestimonials] = await Promise.all([
    convex.query(api.skills.getSkills, {}),
    convex.query(api.testimonials.getTestimonials, { featuredOnly: true }),
  ]);

  const skills: SkillPublic[] = rawSkills
    .sort((a: Doc<"skills">, b: Doc<"skills">) => a.sortOrder - b.sortOrder)
    .map((skill: Doc<"skills">) => ({
      _id: skill._id,
      _creationTime: skill._creationTime,
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon,
      sortOrder: skill.sortOrder,
      yearsOfExperience: skill.yearsOfExperience,
    }));

  const testimonials: TestimonialPublic[] = await Promise.all(
    rawTestimonials
      .sort(
        (a: Doc<"testimonials">, b: Doc<"testimonials">) =>
          a.sortOrder - b.sortOrder,
      )
      .map(async (testimonial: Doc<"testimonials">) => {
        let avatarUrl: string | null = null;
        if (testimonial.avatar) {
          avatarUrl = await convex.query(api.projects.getFileUrl, {
            storageId: testimonial.avatar,
          });
        }
        return {
          _id: testimonial._id,
          _creationTime: testimonial._creationTime,
          name: testimonial.name,
          role: testimonial.role,
          content: testimonial.content,
          avatar: testimonial.avatar,
          avatarUrl,
          rating: testimonial.rating,
          featured: testimonial.featured,
          sortOrder: testimonial.sortOrder,
        };
      }),
  );

  return (
    <>
      <JsonLd data={getPersonSchema("en")} />
      <AboutPageWrapper skills={skills} testimonials={testimonials} />
    </>
  );
}
