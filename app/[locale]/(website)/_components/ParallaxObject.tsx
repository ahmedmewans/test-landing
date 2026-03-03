"use client";

import {
  type MotionValue,
  motion,
  type TargetAndTransition,
  type Transition,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  type VariantLabels,
} from "framer-motion";
import { useContext, useRef } from "react";
import type { ParallaxObjectProps } from "@/types/portfolio";
import { MousePositionContext } from "./context/MousePositionContext";

interface ParallaxObjectExtendedProps extends ParallaxObjectProps {
  initial?: boolean | TargetAndTransition | VariantLabels;
  animate?: boolean | TargetAndTransition | VariantLabels;
  transition?: Transition;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onAnimationComplete?: () => void;
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
  mouseXRaw?: MotionValue<number>;
  mouseYRaw?: MotionValue<number>;
}

export const ParallaxObject: React.FC<ParallaxObjectExtendedProps> = ({
  depth: _depth,
  magneticRadius = 400,
  radius,
  className,
  style,
  children,
  initial,
  animate,
  transition,
  onMouseEnter,
  onMouseLeave,
  onAnimationComplete,
  mouseX: _mouseXProp,
  mouseY: _mouseYProp,
  mouseXRaw: mouseXRawProp,
  mouseYRaw: mouseYRawProp,
}) => {
  const context = useContext(MousePositionContext);
  const ref = useRef<HTMLDivElement>(null);

  const xRaw = mouseXRawProp ?? context?.xRaw;
  const yRaw = mouseYRawProp ?? context?.yRaw;

  const repelX = useMotionValue(0);
  const repelY = useMotionValue(0);

  const smoothRepelX = useSpring(repelX, { damping: 40, stiffness: 60 });
  const smoothRepelY = useSpring(repelY, { damping: 40, stiffness: 60 });

  const updateRepel = () => {
    if (!ref.current || !xRaw || !yRaw) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = xRaw.get() - centerX;
    const dy = yRaw.get() - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const R = radius || 50;
    const threshold = 300;
    const maxDisplacement = 0.5 * R;

    if (distance < threshold) {
      const dCalculated =
        distance > 200
          ? maxDisplacement * (1 - (distance - 200) / 100)
          : maxDisplacement;

      const factor = distance > 0 ? dCalculated / distance : 0;
      repelX.set(-dx * factor);
      repelY.set(-dy * factor);
    } else {
      repelX.set(0);
      repelY.set(0);
    }
  };

  useMotionValueEvent(xRaw as MotionValue<number>, "change", updateRepel);
  useMotionValueEvent(yRaw as MotionValue<number>, "change", updateRepel);

  return (
    <motion.div
      ref={ref}
      className={`absolute ${className}`}
      style={{
        ...style,
      }}
      initial={initial}
      animate={animate}
      transition={transition}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onAnimationComplete={onAnimationComplete}
    >
      <motion.div
        className="w-full h-full"
        style={{
          x: smoothRepelX,
          y: smoothRepelY,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
