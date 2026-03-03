import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { fraunces, outfit } from "@/assets/fonts";
import { Provider } from "@/context/provider";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/types/translations";
import "../globals.css";
import { getDirection } from "@/utils";
import { getMetadata } from "@/utils/metadata/i18n.metadata";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  return getMetadata(locale);
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = (await params) as { locale: Locale };
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const allFonts = [outfit.variable, fraunces.variable].join(" ");

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      suppressHydrationWarning
      className={allFonts}
    >
      <head>
        <link
          rel="preconnect"
          href="https://ahmed-fahmi-portfolio.vercel.app"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://ahmed-fahmi-portfolio.vercel.app"
        />
      </head>
      <body className="antialiased bg-background">
        <Suspense fallback={null}>
          <Provider params={params as Promise<{ locale: Locale }>}>
            {children}
          </Provider>
        </Suspense>
      </body>
    </html>
  );
}
