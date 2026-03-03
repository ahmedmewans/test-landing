import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = {
    home: (await import(`../../messages/${locale}/home.json`)).default,
    errorPage: (await import(`../../messages/${locale}/errorPage.json`))
      .default,
  };

  return {
    locale,
    messages,
  };
});
