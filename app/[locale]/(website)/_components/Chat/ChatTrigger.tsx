"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

interface ChatTriggerProps {
  isOpen: boolean;
  onClick: () => void;
}

export const ChatTrigger: React.FC<ChatTriggerProps> = ({
  isOpen,
  onClick,
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`
        w-14 h-14 md:w-16 md:h-16 rounded-full shadow-xl flex items-center justify-center 
        transition-all duration-300 pointer-events-auto border-2 border-transparent 
        hover:border-foreground/5 hover:scale-110 z-50 relative
        ${isOpen ? "bg-background text-foreground" : "bg-portfolio-green text-portfolio-dark hover:rotate-12"}
      `}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
          >
            <X size={30} strokeWidth={2.5} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
          >
            <MessageCircle size={30} strokeWidth={2.5} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
