"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type React from "react";

interface PolaroidProps {
  src: string;
  alt: string;
  caption?: string;
  rotation?: number;
  className?: string;
  onClick?: () => void;
}

export const Polaroid: React.FC<PolaroidProps> = ({
  src,
  alt,
  caption,
  rotation = 0,
  className = "",
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: rotation - 5 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true }}
      whileHover={{ y: -10, rotate: 0, scale: 1.02 }}
      onClick={onClick}
      className={`relative p-4 pb-12 bg-white shadow-[12px_12px_0px_0px_rgba(90,57,39,0.1)] border border-gray-200 cursor-pointer group ${className}`}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100 border border-gray-100">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>

      {caption && (
        <div className="absolute bottom-2 left-0 w-full text-center">
          <p className="font-serif italic font-black text-[#5A3927]/60 text-sm tracking-tighter">
            {caption}
          </p>
        </div>
      )}

      {/* Glossy highlight effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-linear-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};
