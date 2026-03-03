"use client";

import { Frown, HelpCircle, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const NotFound = () => {
  const t = useTranslations("NotFoundPage");

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center py-12 relative overflow-hidden bg-grid-pattern min-h-screen">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 md:left-32 text-accent/20 rotate-12 animate-pulse">
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        >
          <title>Decorative wave</title>
          <path d="M10 50C30 30 70 70 90 50" strokeLinecap="round" />
          <path d="M10 60C30 40 70 80 90 60" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute bottom-20 right-10 md:right-32 text-primary/30 -rotate-12">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="currentColor">
          <title>Decorative star</title>
          <path d="M40 0L50 30L80 40L50 50L40 80L30 50L0 40L30 30L40 0Z" />
        </svg>
      </div>

      <div className="relative w-full max-w-2xl px-6 flex flex-col items-center">
        <div className="relative bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-sm shadow-polaroid transform rotate-1 border border-gray-100 dark:border-zinc-800 max-w-lg w-full text-center">
          <div className="mb-8 relative mx-auto w-48 h-48 flex items-center justify-center">
            <div className="absolute inset-0 text-primary/20 scale-125 rotate-6">
              <svg
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <title>Blob background</title>
                <path
                  d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90.1,-18,88.7,-2.8C87.3,12.4,81.8,27.3,73,40.1C64.2,52.9,52.1,63.6,38.7,70.1C25.3,76.6,10.6,78.9,-3.3,84.6C-17.2,90.3,-30.3,99.4,-41.7,96.3C-53.1,93.2,-62.8,77.9,-70.6,63.5C-78.4,49.1,-84.3,35.6,-85.7,21.5C-87.1,7.4,-84,-7.3,-77.1,-20.5C-70.2,-33.7,-59.5,-45.4,-47.5,-53.4C-35.5,-61.4,-22.2,-65.7,-8.6,-66.9C5,-68.1,10,-66.2,15.7,-64.3"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <h1 className="font-hand text-9xl font-bold text-ink leading-none tracking-tighter drop-shadow-sm">
                404
              </h1>
              <HelpCircle
                className="absolute -top-2 -right-4 text-accent animate-bounce"
                size={40}
              />
              <Frown
                className="absolute bottom-2 -left-4 text-primary rotate-12"
                size={40}
              />
            </div>
          </div>

          <div className="absolute -right-4 top-20 bg-accent text-white font-hand text-lg font-bold px-4 py-1.5 transform rotate-6 shadow-md rounded-sm z-20">
            {t("Whoops!")}
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink">
              {t("Page not found")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-display leading-relaxed">
              {t("notfoundmessage")}
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-ink px-8 py-3 rounded-full font-bold text-lg border-2 border-ink hover:bg-[#e0a02d] hover:text-white transition-all shadow-hard active:translate-y-1 active:shadow-none"
            >
              <Home size={20} /> {t("Return to Homepage")}
            </Link>
          </div>
        </div>

        <div className="mt-12 opacity-40">
          <svg
            width="200"
            height="20"
            viewBox="0 0 200 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 6"
            strokeLinecap="round"
            className="text-ink"
            aria-label="decorative-dashed-line"
          >
            <path d="M2 10C30 15 50 5 80 10C110 15 130 5 160 10C180 13 190 8 198 10" />
            <title>Decorative dashed line</title>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
