import parse, { type DOMNode, domToReact, Element } from "html-react-parser";
import React from "react";
import slugify from "slugify";
import CodeBlock from "./CodeBlock";
import PostIt from "./PostIt";

// Static imports for Server Component usage

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export const parseArticleContent = (htmlContent: string) => {
  const headings: TOCItem[] = [];

  const options = {
    replace: (domNode: DOMNode) => {
      if (domNode instanceof Element && domNode.attribs) {
        // Handle Headings for TOC
        if (["h1", "h2", "h3"].includes(domNode.name)) {
          // Extract text content recursively first to generate ID
          const getText = (node: DOMNode): string => {
            if (node.type === "text") return node.data || "";
            if ("children" in node)
              return (node.children as DOMNode[]).map(getText).join("");
            return "";
          };
          const text = getText(domNode);

          // Use deterministic ID based on text
          const id =
            domNode.attribs.id || slugify(text, { lower: true, strict: true });
          domNode.attribs.id = id;

          headings.push({
            id,
            text,
            level: parseInt(domNode.name.charAt(1)),
          });

          // Define font sizes based on heading level
          const fontSizes: Record<string, string> = {
            h1: "text-3xl md:text-5xl",
            h2: "text-2xl md:text-3xl",
            h3: "text-xl md:text-2xl",
          };
          const fontSize = fontSizes[domNode.name] || "text-xl";

          // Return modified component with ID
          return React.createElement(
            domNode.name,
            {
              ...domNode.attribs,
              className: `scroll-mt-24 font-serif font-black tracking-tight text-[#5A3927] mt-20 mb-8 flex items-center gap-4 group ${fontSize}`,
            },
            <>
              <span className="w-1.5 h-10 bg-[#FA9939] rounded-full group-hover:scale-y-110 transition-transform origin-center" />
              <span className="relative">
                {domToReact(domNode.children as DOMNode[], options)}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-2 text-[#FA9939]/30"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <title>Heading underline</title>
                  <path
                    d="M0 5 Q 25 0, 50 5 T 100 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </>,
          );
        }

        // Handle Code Blocks
        if (domNode.name === "pre") {
          const codeEl = domNode.children[0] as Element;
          if (codeEl && codeEl.name === "code") {
            const className = codeEl.attribs.class || "";
            const languageMatch = className.match(/language-(\w+)/);
            const language = languageMatch ? languageMatch[1] : "text";

            // Extract text content
            const getText = (node: DOMNode): string => {
              if (node.type === "text") return node.data || "";
              if ("children" in node)
                return (node.children as DOMNode[]).map(getText).join("");
              return "";
            };
            const codeString = getText(codeEl);

            return (
              <CodeBlock
                code={codeString}
                language={language}
                filename={
                  language === "typescript" || language === "ts"
                    ? "schema.ts"
                    : "snippet"
                } // simple heuristic
              />
            );
          }
        }

        // Handle Blockquotes as PostIt notes
        if (domNode.name === "blockquote") {
          return (
            <PostIt title="Case Note">
              {domToReact(domNode.children as DOMNode[], options)}
            </PostIt>
          );
        }

        // Style Paragraphs
        if (domNode.name === "p") {
          return (
            <p className="text-xl text-[#5A3927]/85 leading-[1.8] mb-10 font-medium">
              {domToReact(domNode.children as DOMNode[], options)}
            </p>
          );
        }
      }
    },
  };

  const parsed = parse(htmlContent, options);
  return { content: parsed, toc: headings };
};
