"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { startTransition, useEffect } from "react";
import { Link } from "@/i18n/navigation";

type Props = {
  error: Error & { digest?: string };
  reset(): void;
};

export default function ErrorPage({ error, reset }: Props) {
  const t = useTranslations("errorPage");
  const router = useRouter();

  const reload = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden min-h-[70vh] bg-background-light dark:bg-background-dark">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-50 z-0"></div>

      {/* Coffee Stain Decoration */}
      <div className="absolute top-1/4 right-[10%] opacity-10 pointer-events-none z-0 rotate-45 hidden md:block text-[#8B4513]">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="currentColor"
          aria-label="coffee-stain"
        >
          <title>Coffee Stain</title>
          <path
            d="M100,20 C150,20 190,60 190,110 C190,160 150,190 100,190 C50,190 10,150 10,100 C10,50 50,20 100,20 Z M100,40 C60,40 30,70 30,110 C30,150 60,180 100,180 C140,180 170,150 170,110 C170,70 140,40 100,40 Z"
            fillOpacity="0.8"
          />
          <path
            d="M110,30 Q160,30 180,100"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            opacity="0.5"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-lg shadow-polaroid border-2 border-ink/5 dark:border-zinc-800 relative transform -rotate-1 mx-auto">
          <div className="flex flex-col items-center text-center">
            {/* Icon Group */}
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-scribble-red/10 rounded-full flex items-center justify-center border-2 border-scribble-red border-dashed animate-pulse">
                <AlertTriangle size={48} className="text-scribble-red" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-ink text-white text-[10px] font-bold px-2 py-1 transform -rotate-6 font-mono shadow-sm border border-white uppercase">
                {error.digest ? `ID:${error.digest.slice(0, 8)}` : "ERR_500"}
              </div>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink dark:text-zinc-100 mb-4">
              {t("errorTitle")}
            </h1>
            <p className="font-hand text-2xl text-gray-500 mb-8 rotate-1">
              {t("errorSubtitle")}
            </p>

            <p className="text-lg text-gray-700 dark:text-zinc-400 font-display mb-8 max-w-md leading-relaxed">
              {t("errormessage")}
            </p>

            {/* Stack Trace / Error Details */}
            <div className="w-full bg-code-bg rounded-md p-4 mb-8 text-left relative overflow-hidden group shadow-inner border border-ink/10">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 font-mono"></div>
              <pre className="font-mono text-xs md:text-sm text-gray-400 overflow-x-auto whitespace-pre-wrap">
                <span className="text-red-400">Error:</span>{" "}
                {error.message || "Unknown error occurred"}
                {"\n"}
                <span className="text-gray-500">
                  {error.stack?.split("\n").slice(1, 4).join("\n") ||
                    "No stack trace available"}
                </span>
              </pre>

              {/* Hand-drawn circle on stack trace */}
              <svg
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[80%] pointer-events-none opacity-80 text-scribble-red"
                viewBox="0 0 200 60"
                preserveAspectRatio="none"
              >
                <title>Doodle Circle</title>
                <path
                  d="M10,10 Q100,-10 190,10 T190,50 T10,50 T10,10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />
              </svg>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button
                onClick={() => reload()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-zinc-800 border-2 border-ink dark:border-zinc-700 rounded-full font-bold text-ink dark:text-zinc-100 hover:bg-gray-50 dark:hover:bg-zinc-750 transition-all shadow-hard active:shadow-none active:translate-y-[2px]"
                type="button"
              >
                <RefreshCw size={18} /> {t("Try Again")}
              </button>

              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary border-2 border-ink rounded-full font-bold text-ink hover:bg-primary-hover transition-all shadow-hard active:shadow-none active:translate-y-[2px]"
              >
                <Home size={18} /> {t("Return to Homepage")}
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="font-hand text-gray-400 text-lg">{t("footerNote")}</p>
        </div>
      </div>
    </div>
  );
}
