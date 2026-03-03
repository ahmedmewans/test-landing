import type { Metadata } from "next";
import { cacheLife } from "next/cache";
// import { connection } from "next/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/seo/constants";
import { getContactPageSchema } from "@/lib/seo/schemas";
import ContactPageWrapper from "./_components/ContactPageWrapper";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact",
    description:
      "Get in touch with Ahmed Fahmy. Have a project in mind or just want to say hi? I'm always open to discussing new opportunities and creative collaborations.",
    alternates: {
      canonical: "/contact",
      languages: {
        en: `${SITE_URL}/contact`,
        ar: `${SITE_URL}/ar/contact`,
      },
    },
    openGraph: {
      title: "Contact | Ahmed Fahmy",
      description:
        "Get in touch with Ahmed Fahmy. Have a project in mind or just want to say hi? I'm always open to discussing new opportunities and creative collaborations.",
      type: "website",
      url: `${SITE_URL}/contact`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Contact | Ahmed Fahmy",
      description:
        "Get in touch with Ahmed Fahmy. Have a project in mind or just want to say hi? I'm always open to discussing new opportunities and creative collaborations.",
    },
  };
}

export default async function ContactPage() {
  "use cache";
  cacheLife("max");

  // await connection();

  return (
    <>
      <JsonLd data={getContactPageSchema("en")} />
      <ContactPageWrapper />
    </>
  );
}
