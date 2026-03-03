import { Check, Copy } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownMessageProps {
  content: string;
  className?: string;
}

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({
  content,
  className,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div
      className={cn(
        "prose prose-sm md:prose-base dark:prose-invert max-w-none w-full",
        "prose-p:leading-relaxed prose-p:mb-3 last:prose-p:mb-0",
        "prose-a:text-portfolio-orange prose-a:underline-offset-4 hover:prose-a:text-portfolio-orange/80",
        "prose-strong:font-black prose-strong:text-foreground",
        "prose-ul:list-disc prose-ul:pl-4 prose-ul:my-2 prose-ul:space-y-1",
        "prose-ol:list-decimal prose-ol:pl-4 prose-ol:my-2 prose-ol:space-y-1",
        "prose-li:marker:text-portfolio-orange/70",
        "prose-headings:font-serif prose-headings:font-black prose-headings:text-foreground prose-headings:mb-3 prose-headings:mt-6 first:prose-headings:mt-0",
        "prose-h1:text-xl",
        "prose-h2:text-lg",
        "prose-h3:text-base",
        // Table styling
        "prose-table:w-full prose-table:border-collapse prose-table:my-4 prose-table:text-sm prose-table:overflow-hidden prose-table:rounded-xl",
        "prose-th:bg-portfolio-dark/5 prose-th:px-4 prose-th:py-2.5 prose-th:text-left prose-th:font-black prose-th:text-foreground prose-th:border-b-2 prose-th:border-portfolio-dark/10",
        "prose-td:px-4 prose-td:py-2.5 prose-td:border-b prose-td:border-portfolio-dark/5 prose-td:align-top",
        "prose-tr:transition-colors hover:prose-tr:bg-portfolio-dark/5",
        "prose-hr:border-portfolio-dark/10 prose-hr:my-6",
        "prose-blockquote:border-l-4 prose-blockquote:border-portfolio-orange/50 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-foreground/80",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node, ...props }) => (
            <div className="w-full overflow-x-auto my-4 rounded-xl border border-portfolio-dark/10 bg-background/50 backdrop-blur-sm">
              <table
                className="w-full text-left border-collapse text-sm mt-0! no-scrollbar!"
                {...props}
              />
            </div>
          ),
          code({ node, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !className;
            const codeString = String(children).replace(/\n$/, "");

            if (isInline) {
              return (
                <code
                  className="bg-portfolio-dark/10 text-portfolio-orange px-1.5 py-0.5 rounded-md text-[0.85em] font-mono before:content-none after:content-none"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="relative my-4 rounded-xl overflow-hidden shadow-lg border border-portfolio-dark/10">
                <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-white/10 text-xs font-mono text-zinc-400">
                  <span>{match?.[1] || "text"}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(codeString)}
                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    {copiedCode === codeString ? (
                      <>
                        <Check size={14} className="text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy code</span>
                      </>
                    )}
                  </button>
                </div>
                <SyntaxHighlighter
                  {...props}
                  style={vscDarkPlus as any}
                  language={match?.[1] || "text"}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    padding: "1rem",
                    background: "#1e1e1e",
                    fontSize: "0.875rem",
                  }}
                  wrapLines={true}
                  wrapLongLines={true}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
