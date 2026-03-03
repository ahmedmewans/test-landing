"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion } from "framer-motion";
import { AlertCircle, Clock, Loader2, Send, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaceCenter } from "../FaceCenter";
import { MarkdownMessage } from "./MarkdownMessage";

interface ChatInterfaceProps {
  onClose: () => void;
}

interface RateLimitInfo {
  message: string;
  resetsAt: number;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [rateLimitError, setRateLimitError] = useState<RateLimitInfo | null>(
    null,
  );

  // AI SDK v5: useChat uses transport instead of api string
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (error) => {
      // The AI SDK wraps HTTP errors — check for 429 rate limit
      if (error.message?.includes("429") || error.message?.includes("limit")) {
        try {
          // Try to parse the error body for resetsAt info
          const match = error.message.match(/\{[\s\S]*\}/);
          if (match) {
            const body = JSON.parse(match[0]);
            setRateLimitError({
              message:
                body.error ||
                "You've reached the message limit. Try again later!",
              resetsAt: body.resetsAt || Date.now() + 24 * 60 * 60 * 1000,
            });
            return;
          }
        } catch {
          // Parsing failed, use generic message
        }
        setRateLimitError({
          message:
            "You've reached the message limit (5 per day). Please try again later! ⏳",
          resetsAt: Date.now() + 24 * 60 * 60 * 1000,
        });
      }
    },
  });

  const isLoading = status === "submitted";
  const isDisabled = isLoading || !!rateLimitError;

  // Format remaining time until reset
  const getTimeRemaining = useCallback(() => {
    if (!rateLimitError) return "";
    const diff = rateLimitError.resetsAt - Date.now();
    if (diff <= 0) return "soon";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }, [rateLimitError]);

  // Clear rate limit when the window resets
  useEffect(() => {
    if (!rateLimitError) return;
    const diff = rateLimitError.resetsAt - Date.now();
    if (diff <= 0) {
      setRateLimitError(null);
      return;
    }
    const timer = setTimeout(() => setRateLimitError(null), diff);
    return () => clearTimeout(timer);
  }, [rateLimitError]);

  // Auto-scroll when messages update
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Fast-path: always scroll to bottom if the most recent message is from the user
    const lastMessage = messages[messages.length - 1];
    const isUserMessage = lastMessage?.role === "user";

    // Or if already near the bottom (prevents fighting scroll while reading older messages)
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      150;

    if (isUserMessage || isNearBottom) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50); // Small delay to let React render the new message DOM node first
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || isDisabled) return;
    sendMessage({ text: inputValue });
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isDisabled) {
      handleSend();
    }
  };

  const getMessageText = (msg: (typeof messages)[number]) => {
    // Extract text from message parts (AI SDK v5 format)
    return msg.parts
      .filter((p) => p.type === "text")
      .map((p) => ("text" in p ? p.text : ""))
      .join("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed bottom-24 right-6 w-[90vw] md:w-[380px] h-[500px] bg-background rounded-[2rem] shadow-2xl z-50 flex flex-col overflow-hidden border border-portfolio-dark/10"
    >
      {/* Header */}
      <div className="bg-portfolio-sun p-4 flex items-center justify-between shrink-0 relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center overflow-hidden border-2 border-background/50">
            <div className="w-[150%] h-[150%] pt-2">
              <FaceCenter hoveredId="chat" />
            </div>
          </div>
          <div>
            <h3 className="font-serif font-bold text-portfolio-dark leading-none">
              Ahmed AI
            </h3>
            <span className="text-xs font-bold text-portfolio-dark/60 uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={10} />
              {isLoading ? "Thinking..." : "Online"}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center text-portfolio-dark transition-colors relative z-10"
        >
          <X size={18} />
        </button>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 pointer-events-none" />
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 bg-secondary p-4 overflow-y-auto flex flex-col gap-4"
      >
        {/* Static welcome message */}
        <div className="flex justify-start">
          <div className="bg-background text-foreground rounded-bl-none shadow-[0_4px_20px_-10px_rgba(90,57,39,0.1)] border border-portfolio-dark/5 max-w-[95%] p-3 md:p-4 rounded-2xl text-sm leading-relaxed">
            Hi there! I&apos;m Ahmed&apos;s AI assistant. Ask me anything about
            his work, frontend skills, or experience! ☕
          </div>
        </div>

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
                max-w-[95%] p-3 md:p-4 rounded-2xl text-sm leading-relaxed overflow-x-hidden
                ${
                  msg.role === "user"
                    ? "bg-portfolio-dark text-background rounded-br-none max-w-[80%]"
                    : "bg-background text-foreground rounded-bl-none shadow-[0_4px_20px_-10px_rgba(90,57,39,0.1)] border border-portfolio-dark/5"
                }
              `}
            >
              {msg.role === "user" ? (
                getMessageText(msg)
              ) : (
                <MarkdownMessage content={getMessageText(msg)} />
              )}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-background text-foreground rounded-bl-none shadow-sm max-w-[80%] p-3 rounded-2xl">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </motion.div>
        )}

        {/* Rate limit warning in message area */}
        {rateLimitError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-[95%] p-3 md:p-4 rounded-2xl text-sm leading-relaxed bg-portfolio-orange/10 border border-portfolio-orange/30 text-portfolio-dark">
              <div className="flex items-start gap-2">
                <AlertCircle
                  size={16}
                  className="text-portfolio-orange shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-medium">{rateLimitError.message}</p>
                  <p className="text-xs text-portfolio-dark/60 mt-1 flex items-center gap-1">
                    <Clock size={12} />
                    Resets in {getTimeRemaining()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-background border-t border-portfolio-dark/10">
        <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-2 border border-transparent focus-within:border-portfolio-orange/50 transition-colors">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              rateLimitError ? "Message limit reached" : "Ask me anything..."
            }
            disabled={isDisabled}
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-foreground/40 text-sm disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim() || isDisabled}
            className="w-8 h-8 bg-portfolio-orange rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send size={14} />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
