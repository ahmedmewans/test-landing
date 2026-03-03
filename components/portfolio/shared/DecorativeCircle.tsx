"use client";

import { motion } from "framer-motion";
import { useMousePosition } from "@/app/[locale]/(website)/_components/context/MousePositionContext";
import { ParallaxObject } from "@/app/[locale]/(website)/_components/ParallaxObject";
import type { DecorativeCircleProps } from "@/types/portfolio";

type SizeValues = {
  mobile: { width: string; height: string };
  desktop: { width: string; height: string };
};

const DEFAULT_SIZE_VALUES: SizeValues = {
  mobile: { width: "14rem", height: "14rem" },
  desktop: { width: "14rem", height: "14rem" },
};

function getSizeValues(size: string): SizeValues {
  const allMatches = size.match(/(?:md:|lg:)?w-(\d+)/g);
  if (!allMatches || allMatches.length === 0) {
    return DEFAULT_SIZE_VALUES;
  }

  const mobileMatch = allMatches.find(
    (m) => !m.startsWith("md:") && !m.startsWith("lg:"),
  );
  const mdMatch = allMatches.find((m) => m.startsWith("md:"));
  const lgMatch = allMatches.find((m) => m.startsWith("lg:"));

  const parseSize = (match: string | undefined) => {
    if (!match) return null;
    const num = match.match(/w-(\d+)/);
    if (num) {
      const val = Number.parseInt(num[1], 10);
      const rem = val / 4;
      return { width: `${rem}rem`, height: `${rem}rem` };
    }
    return null;
  };

  const mobileSize = parseSize(mobileMatch);
  const mdSize = parseSize(mdMatch);
  const lgSize = parseSize(lgMatch);

  return {
    mobile: mobileSize ?? mdSize ?? lgSize ?? DEFAULT_SIZE_VALUES.mobile,
    desktop: lgSize ?? mdSize ?? mobileSize ?? DEFAULT_SIZE_VALUES.desktop,
  };
}

export const DecorativeCircle: React.FC<DecorativeCircleProps> = ({
  color,
  size,
  top,
  left,
  right,
  bottom,
  depth,
  floatDelay = 0,
  initial,
  animate,
  transition,
  mouseX,
  mouseY,
  mouseXRaw,
  mouseYRaw,
}) => {
  const { isLoaded } = useMousePosition();

  const sizeValues = getSizeValues(size);

  const mobileWidthRem = Number.parseFloat(sizeValues.mobile.width);
  const mobileRadiusPx = mobileWidthRem * 8;
  const desktopWidthRem = Number.parseFloat(sizeValues.desktop.width);
  const desktopRadiusPx = desktopWidthRem * 8;
  const mobileMagnetic = mobileRadiusPx + 100;
  const desktopMagnetic = desktopRadiusPx + 150;

  return (
    <ParallaxObject
      depth={depth}
      radius={desktopRadiusPx}
      magneticRadius={desktopMagnetic}
      style={{
        top,
        left,
        right,
        bottom,
        width: sizeValues.mobile.width,
        height: sizeValues.mobile.height,
        ["--circle-w" as string]: sizeValues.desktop.width,
        ["--circle-h" as string]: sizeValues.desktop.height,
      }}
      className="pointer-events-none z-0 md:!w-[var(--circle-w)] md:!h-[var(--circle-h)]"
      initial={initial}
      animate={animate}
      transition={transition}
      mouseX={mouseX}
      mouseY={mouseY}
      mouseXRaw={mouseXRaw}
      mouseYRaw={mouseYRaw}
    >
      <motion.div
        className={`w-full h-full rounded-full ${color} opacity-90 relative overflow-hidden`}
        initial={{ y: 0 }}
        animate={{
          y: isLoaded ? [0, -10, 0] : 0,
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: floatDelay,
        }}
      >
        <div className="absolute inset-0 rounded-full bg-linear-to-b from-white/20 to-transparent pointer-events-none" />
        <div className="absolute inset-[10%] rounded-full bg-white/5 blur-md pointer-events-none" />
      </motion.div>
    </ParallaxObject>
  );
};
