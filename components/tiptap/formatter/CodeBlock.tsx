"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  code: string;
  filename?: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  filename = "schema.ts",
  language = "typescript",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Custom theme to ensure no background on spans
  const customOneDark = {
    ...oneDark,
    'code[class*="language-"]': {
      ...oneDark['code[class*="language-"]'],
      background: "transparent",
    },
    'pre[class*="language-"]': {
      ...oneDark['pre[class*="language-"]'],
      background: "transparent",
    },
  };

  return (
    <div className="bg-[#1e2127] rounded-sm shadow-[16px_16px_0px_0px_rgba(90,57,39,0.15)] border-4 border-[#5A3927] my-16 overflow-hidden relative group transition-transform duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="bg-[#21252b]/80 backdrop-blur-sm px-5 py-3 flex items-center justify-between border-b border-white/5 relative z-20">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-[0_0_8px_rgba(255,95,87,0.4)]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e] shadow-[0_0_8px_rgba(254,188,46,0.4)]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-[0_0_8px_rgba(40,200,64,0.4)]" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
            {language}
          </span>
          <span className="text-xs font-mono text-gray-300 italic opacity-80">
            {filename}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        <div className="absolute inset-0 bg-graph-paper opacity-[0.03] pointer-events-none z-0" />
        <div className="relative z-10">
          <SyntaxHighlighter
            language={language}
            style={customOneDark}
            customStyle={{
              margin: 0,
              padding: "2rem",
              background: "transparent",
              fontSize: "0.875rem",
              lineHeight: "1.7",
              fontFamily: "var(--font-mono)",
            }}
            wrapLines={true}
            codeTagProps={{
              style: {
                background: "transparent",
              },
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>

      <button
        type="button"
        className="absolute top-14 end-5 p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white/70 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 cursor-pointer overflow-hidden"
        onClick={handleCopy}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check size={16} className="text-emerald-400" />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Copy size={16} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

export default CodeBlock;
