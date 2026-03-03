import type { Metadata } from "next";
import { cacheLife } from "next/cache";
// import { connection } from "next/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/seo/constants";
import { getPersonSchema, getWebsiteSchema } from "@/lib/seo/schemas";
import PortfolioPage from "./_components/PortfolioPage";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Ahmed Fahmy | Interactive Designer & Developer",
    description:
      "Ahmed Fahmy is a creative developer specializing in interactive websites and applications. Explore UX/UI projects, experience, and creative work.",
    alternates: {
      canonical: "/",
      languages: {
        en: SITE_URL,
        ar: `${SITE_URL}/ar`,
      },
    },
    openGraph: {
      title: "Ahmed Fahmy | Interactive Designer & Developer",
      description:
        "Ahmed Fahmy is a creative developer specializing in interactive websites and applications. Explore UX/UI projects, experience, and creative work.",
      type: "website",
      url: SITE_URL,
    },
    twitter: {
      card: "summary_large_image",
      title: "Ahmed Fahmy | Interactive Designer & Developer",
      description:
        "Ahmed Fahmy is a creative developer specializing in interactive websites and applications.",
    },
  };
}

export default async function HomePage() {
  "use cache";
  cacheLife("max");
  // await connection();

  return (
    <>
      <JsonLd data={getWebsiteSchema("en")} />
      <JsonLd data={getPersonSchema("en")} />
      <PortfolioPage />
    </>
  );
}
