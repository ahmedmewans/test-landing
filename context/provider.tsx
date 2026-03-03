import { connection } from "next/server";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import { getToken } from "@/lib/auth-server";
import type { Locale } from "@/types/translations";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ThemeProvider } from "./theme-provider";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
};

export const Provider = async ({ children, params }: Props) => {
  const { locale } = await params;

  // Mark this as dynamic to allow reading cookies/headers
  await connection();

  const [messages, token] = await Promise.all([
    getMessages({ locale }),
    getToken(),
  ]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        storageKey="portfolio-theme"
        disableTransitionOnChange
      >
        <ConvexClientProvider initialToken={token}>
          {children}
        </ConvexClientProvider>
        <Toaster expand={false} closeButton richColors />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
};
