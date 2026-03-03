"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import type React from "react";

interface DoodleProps {
  svg: React.ReactNode;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  depth?: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  rotation?: number;
  className?: string;
}

export const Doodle: React.FC<DoodleProps> = ({
  svg,
  top,
  left,
  right,
  bottom,
  depth = 1,
  mouseX,
  mouseY,
  rotation = 0,
  className = "",
}) => {
  const x = useTransform(mouseX, (val) => val * 20 * depth);
  const y = useTransform(mouseY, (val) => val * 20 * depth);

  return (
    <motion.div
      style={{
        top,
        left,
        right,
        bottom,
        x,
        y,
        rotate: rotation,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`absolute z-20 pointer-events-none ${className}`}
    >
      {svg}
    </motion.div>
  );
};
