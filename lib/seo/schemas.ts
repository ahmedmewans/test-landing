import { AUTHOR, SITE_NAME, SITE_URL, SOCIAL_LINKS } from "./constants";

export function getWebsiteSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: AUTHOR.description,
    inLanguage: locale,
    author: {
      "@type": "Person",
      name: AUTHOR.name,
    },
  };
}

export function getPersonSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR.name,
    jobTitle: AUTHOR.jobTitle,
    description: AUTHOR.description,
    url: SITE_URL,
    image: `${SITE_URL}${AUTHOR.image}`,
    email: AUTHOR.email,
    sameAs: [SOCIAL_LINKS.github, SOCIAL_LINKS.linkedin, SOCIAL_LINKS.twitter],
    knowsAbout: [
      "Web Development",
      "UI/UX Design",
      "Frontend Development",
      "React",
      "Next.js",
      "TypeScript",
    ],
    inLanguage: locale,
  };
}

type ProjectSchemaParams = {
  title: string;
  description: string;
  slug: string;
  imageUrl?: string | null;
  publishedAt?: number;
  tags?: string[];
};

export function getProjectSchema(params: ProjectSchemaParams, locale: string) {
  const { title, description, slug, imageUrl, publishedAt, tags } = params;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description,
    url: `${SITE_URL}/${locale === "ar" ? "ar/" : ""}projects/${slug}`,
    author: {
      "@type": "Person",
      name: AUTHOR.name,
      url: SITE_URL,
    },
    ...(imageUrl && { image: imageUrl }),
    ...(publishedAt && { datePublished: new Date(publishedAt).toISOString() }),
    ...(tags && tags.length > 0 && { keywords: tags.join(", ") }),
    inLanguage: locale,
  };
}

type BreadcrumbItem = {
  name: string;
  path: string;
};

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function getCollectionPageSchema(
  title: string,
  description: string,
  locale: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${SITE_URL}/${locale === "ar" ? "ar/" : ""}projects`,
    author: {
      "@type": "Person",
      name: AUTHOR.name,
    },
    inLanguage: locale,
  };
}

export function getContactPageSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact",
    description:
      "Get in touch with Ahmed Fahmy. Have a project in mind or just want to say hi? I'm always open to discussing new opportunities and creative collaborations.",
    url: `${SITE_URL}/${locale === "ar" ? "ar/" : ""}contact`,
    mainEntity: {
      "@type": "Person",
      name: AUTHOR.name,
      email: AUTHOR.email,
      url: SITE_URL,
    },
    inLanguage: locale,
  };
}
