"use client";

import { AlertCircle, CheckCircle2, FileUp, Loader2 } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { cn } from "@/lib/utils";

interface ParsedMarkdown {
  title: string;
  slug: string;
  category: string;
  description: string;
  content: string;
  tags: string[];
  color: string;
  featured: boolean;
  status: "draft" | "published" | "archived";
  metaTitle?: string;
  metaDescription?: string;
}

interface MarkdownUploadProps {
  onParsed: (data: ParsedMarkdown) => void;
  className?: string;
}

export function MarkdownUpload({ onParsed, className }: MarkdownUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".md")) {
      setError("Please select a Markdown file (.md)");
      setSuccess(null);
      return;
    }

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const text = await file.text();

        const { parseMarkdown } = await import("@/lib/markdown-parser");
        const parsed = parseMarkdown(text);

        onParsed(parsed);
        setSuccess(`Successfully parsed "${file.name}"`);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to parse markdown file",
        );
      }
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept=".md"
        onChange={handleChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          "w-full py-3 px-4 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-muted/50 transition-colors flex items-center justify-center gap-2 text-muted-foreground",
          isPending && "opacity-50 cursor-not-allowed",
        )}
      >
        {isPending ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            <span>Parsing markdown...</span>
          </>
        ) : (
          <>
            <FileUp className="size-5" />
            <span>Upload Markdown (.md)</span>
          </>
        )}
      </button>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 p-2 rounded-lg">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-sm text-green-500 bg-green-500/10 p-2 rounded-lg">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
}
