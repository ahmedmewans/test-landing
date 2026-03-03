import type { Locale } from "@/types/translations";

/**
 * Get text direction based on locale
 */
export function getDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
