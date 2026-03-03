import type { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];
export type LocalePrefix = typeof routing.localePrefix;
