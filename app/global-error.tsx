"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";
import { Link } from "@/i18n/navigation";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
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
    <html lang="en">
      <body className="antialiased font-display bg-background-light text-ink overflow-x-hidden selection:bg-primary/30">
        <div className="flex min-h-screen items-center justify-center py-20 px-4 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-50 z-0"></div>

          {/* Coffee Stain Decoration */}
          <div className="absolute top-1/4 right-[10%] opacity-10 pointer-events-none z-0 rotate-45 hidden md:block text-[#8B4513]">
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              fill="currentColor"
            >
              <title>Coffee Stain</title>
              <path
                d="M100,20 C150,20 190,60 190,110 C190,160 150,190 100,190 C50,190 10,150 10,100 C10,50 50,20 100,20 Z M100,40 C60,40 30,70 30,110 C30,150 60,180 100,180 C140,180 170,150 170,110 C170,70 140,40 100,40 Z"
                fillOpacity="0.8"
              />
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl w-full">
            {/* Main Card */}
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-polaroid border-2 border-ink/5 relative transform -rotate-1 mx-auto text-center">
              <div className="flex flex-col items-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-scribble-red/10 rounded-full flex items-center justify-center border-2 border-scribble-red border-dashed animate-pulse">
                    <AlertTriangle size={48} className="text-scribble-red" />
                  </div>
                </div>

                <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink mb-4">
                  A critical error occurred.
                </h1>
                <p className="font-hand text-2xl text-gray-500 mb-8 rotate-1">
                  (We suggest trying a fresh page.)
                </p>

                <p className="text-lg text-gray-700 font-display mb-8 max-w-md leading-relaxed">
                  The application encountered a major issue. We've been notified
                  and are investigating.
                </p>

                {/* Stack Trace / Error Details */}
                <div className="w-full bg-code-bg rounded-md p-4 mb-8 text-left relative overflow-hidden group shadow-inner border border-ink/10">
                  <pre className="font-mono text-xs md:text-sm text-gray-400 overflow-x-auto whitespace-pre-wrap">
                    <span className="text-red-400">Critical:</span>{" "}
                    {error.message}
                    {"\n"}
                    {error.digest && (
                      <span className="text-accent">ID: {error.digest}</span>
                    )}
                  </pre>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  <button
                    onClick={() => reload()}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-ink rounded-full font-bold text-ink hover:bg-gray-50 transition-all shadow-hard active:shadow-none active:translate-y-[2px]"
                    type="button"
                  >
                    <RefreshCw size={18} /> Reload Application
                  </button>

                  <Link
                    href="/"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary border-2 border-primary rounded-full font-bold text-ink hover:bg-primary-hover transition-all shadow-hard active:shadow-none active:translate-y-[2px]"
                  >
                    <Home size={18} /> Return Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
