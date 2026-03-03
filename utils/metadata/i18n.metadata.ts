import type { Metadata } from "next";
import {
  AUTHOR,
  LOCALES,
  OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
} from "@/lib/seo/constants";
import type { Locale } from "@/types/translations";

const baseMetadata: Record<Locale, Metadata> = {
  en: {
    title: {
      default: "Ahmed Fahmy | Interactive Designer & Developer",
      template: "%s | Ahmed Fahmy",
    },
    description:
      "Ahmed Fahmy is a creative developer specializing in interactive websites and applications. Explore UX/UI projects, experience, and creative work.",
    applicationName: SITE_NAME,
    keywords: [
      "interactive design",
      "web development",
      "UI/UX",
      "frontend developer",
      "React developer",
      "Next.js",
      "portfolio",
    ],
  },
  ar: {
    title: {
      default: "أحمد فهمي | مصمم ومطور تفاعلي",
      template: "%s | أحمد فهمي",
    },
    description:
      "أحمد فهمي مطور إبداعي متخصص في تصميم وتطوير المواقع والتطبيقات التفاعلية. استكشف المشاريع والخبرات والأعمال الإبداعية.",
    applicationName: SITE_NAME,
    keywords: [
      "تصميم تفاعلي",
      "تطوير ويب",
      "واجهة مستخدم",
      "مطور واجهات",
      "رياكت",
      "نكست جي إس",
      "بورتفوليو",
    ],
  },
};

export function getMetadata(locale: Locale): Metadata {
  const t = baseMetadata[locale] || baseMetadata.en;

  return {
    metadataBase: new URL(SITE_URL),
    title: t.title ?? undefined,
    description: t.description ?? undefined,
    applicationName: t.applicationName ?? undefined,
    keywords: t.keywords ?? undefined,
    authors: [{ name: AUTHOR.name, url: SITE_URL }],
    creator: AUTHOR.name,
    publisher: AUTHOR.name,
    alternates: {
      canonical: locale === "ar" ? "/ar" : "/",
      languages: {
        en: SITE_URL,
        ar: `${SITE_URL}/ar`,
      },
    },
    openGraph: {
      title: (t.title as { default: string })?.default ?? (t.title as string),
      description: t.description ?? undefined,
      url: locale === "ar" ? `${SITE_URL}/ar` : SITE_URL,
      siteName: SITE_NAME,
      locale: LOCALES[locale],
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: (t.title as { default: string })?.default ?? (t.title as string),
      description: t.description ?? undefined,
      images: [OG_IMAGE.url],
      creator: "@ahmedfahmy",
      site: "@ahmedfahmy",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: "/logo.png", type: "image/png" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: [
        { url: "/apple-icon.png" },
        { url: "/web-app-manifest-192x192.png", sizes: "192x192" },
      ],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black",
      title: SITE_NAME,
    },
    formatDetection: {
      telephone: false,
    },
    other: {
      "github:site": SOCIAL_LINKS.github,
      "linkedin:site": SOCIAL_LINKS.linkedin,
    },
  };
}
