"use client";

import { AnimatePresence, motion } from "framer-motion";

interface ChatIndicatorProps {
  isVisible: boolean;
}

export const ChatIndicator: React.FC<ChatIndicatorProps> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0, x: 20, y: 20 }}
          animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
          exit={{ scale: 0, opacity: 0, x: 20, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 1,
          }}
          className="bg-black text-white py-4 px-6 rounded-2xl rounded-br-none shadow-2xl hidden md:block mb-4 origin-bottom-right"
        >
          <p className="text-sm font-bold flex items-center gap-2 whitespace-nowrap">
            Good day! It&apos;s nice to see you here 😋
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
