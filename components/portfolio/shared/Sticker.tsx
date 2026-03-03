"use client";

import type React from "react";

interface StickerProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export const Sticker: React.FC<StickerProps> = ({
  children,
  className = "",
  color = "bg-[#FFC760]",
}) => {
  return (
    <div
      className={`inline-block px-4 py-1.5 ${color} text-[#5A3927] font-black rounded-lg shadow-[4px_4px_0px_0px_rgba(90,57,39,0.2)] border-2 border-[#5A3927] -skew-x-6 transform-gpu transition-transform hover:scale-110 cursor-default select-none ${className}`}
    >
      {children}
    </div>
  );
};
