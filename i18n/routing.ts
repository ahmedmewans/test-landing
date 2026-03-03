import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "ar"],

  // Used when no locale matches
  defaultLocale: "en",

  localePrefix: "as-needed",

  // Disable automatic locale detection to force Arabic as default
  localeDetection: false,

  // Custom cookie configuration for locale persistence
  localeCookie: {
    // Custom cookie name
    name: "portfolio-locale",
    // Expire in one year
    maxAge: 60 * 60 * 24 * 365,
  },
});
