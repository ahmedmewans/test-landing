export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ahmedfahmy.com";

export const SITE_NAME = "Ahmed Fahmy Portfolio";

export const AUTHOR = {
  name: "Ahmed Fahmy",
  jobTitle: "Interactive Designer & Developer",
  description:
    "Creative developer specializing in interactive websites and applications. Crafting experiences where code meets emotion.",
  email: "contact@ahmedfahmy.com",
  image: "/og-image.png",
};

export const SOCIAL_LINKS = {
  github: "https://github.com/ahmedfahmy",
  linkedin: "https://linkedin.com/in/ahmedfahmy",
  twitter: "https://twitter.com/ahmedfahmy",
} as const;

export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Ahmed Fahmy - Interactive Designer & Developer",
};

export const LOCALES = {
  en: "en_US",
  ar: "ar_EG",
} as const;
