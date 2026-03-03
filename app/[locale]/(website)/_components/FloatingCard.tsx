"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "@/i18n/navigation";
import type { FloatingCardBaseProps } from "@/types/portfolio";
import { useMousePosition } from "./context/MousePositionContext";
import { ParallaxObject } from "./ParallaxObject";

const LABEL_STYLES: Record<string, React.CSSProperties> = {
  left: {
    right: "100%",
    marginRight: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
  },
  right: {
    left: "100%",
    marginLeft: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
  },
  top: {
    bottom: "100%",
    marginBottom: "1rem",
    left: "50%",
    transform: "translateX(-50%)",
  },
  bottom: {
    top: "100%",
    marginTop: "1rem",
    left: "50%",
    transform: "translateX(-50%)",
  },
  center: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
};

type SizeValues = {
  mobile: {
    width: string;
    height: string;
    hoverWidth: string;
    hoverHeight: string;
  };
  desktop: {
    width: string;
    height: string;
    hoverWidth: string;
    hoverHeight: string;
  };
};

const DEFAULT_SIZE_VALUES: SizeValues = {
  mobile: {
    width: "14rem",
    height: "14rem",
    hoverWidth: "16.8rem",
    hoverHeight: "16.8rem",
  },
  desktop: {
    width: "14rem",
    height: "14rem",
    hoverWidth: "16.8rem",
    hoverHeight: "16.8rem",
  },
};

function getSizeValues(size: string): SizeValues {
  const allMatches = size.match(/(?:md:)?w-(\d+)/g);
  if (!allMatches || allMatches.length === 0) {
    return DEFAULT_SIZE_VALUES;
  }

  const mobileMatch = allMatches.find((m) => !m.startsWith("md:"));
  const desktopMatch = allMatches.find((m) => m.startsWith("md:"));

  const parseSize = (match: string | undefined) => {
    if (!match) return null;
    const num = match.match(/w-(\d+)/);
    if (num) {
      const val = Number.parseInt(num[1], 10);
      const rem = val / 4;
      return {
        width: `${rem}rem`,
        height: `${rem}rem`,
        hoverWidth: `${rem * 1.2}rem`,
        hoverHeight: `${rem * 1.2}rem`,
      };
    }
    return null;
  };

  const mobileSize = parseSize(mobileMatch);
  const desktopSize = parseSize(desktopMatch);

  return {
    mobile: mobileSize ?? desktopSize ?? DEFAULT_SIZE_VALUES.mobile,
    desktop: desktopSize ?? mobileSize ?? DEFAULT_SIZE_VALUES.desktop,
  };
}

interface FloatingCardProps extends FloatingCardBaseProps {
  isHovered: boolean;
  onHoverStart: (id: FloatingCardBaseProps["id"]) => void;
  onHoverEnd: () => void;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  id,
  label,
  FaceComponent,
  baseColor,
  size,
  depth,
  rotation = 0,
  isHovered,
  onHoverStart,
  onHoverEnd,
  className,
  style,
  floatDelay = 0,
  labelPosition = "center",
  initial,
  animate,
  transition,
  href,
}) => {
  const { isLoaded } = useMousePosition();
  const isMobile = useIsMobile();

  const sizeValues = useMemo(() => getSizeValues(size), [size]);
  const labelStyle = LABEL_STYLES[labelPosition] ?? LABEL_STYLES.center;

  const mobileWidthRem = Number.parseFloat(sizeValues.mobile.width);
  const mobileRadiusPx = (mobileWidthRem * 16) / 2;
  const desktopWidthRem = Number.parseFloat(sizeValues.desktop.width);
  const desktopRadiusPx = (desktopWidthRem * 16) / 2;
  const mobileMagnetic = mobileRadiusPx + 100;
  const desktopMagnetic = desktopRadiusPx + 150;

  return (
    <ParallaxObject
      depth={depth}
      radius={desktopRadiusPx}
      magneticRadius={desktopMagnetic}
      className={`flex items-center justify-center pointer-events-auto ${className}`}
      style={{
        ...style,
        width: sizeValues.mobile.width,
        height: sizeValues.mobile.height,
      }}
      initial={initial}
      animate={animate}
      transition={transition}
      onMouseEnter={() => onHoverStart(id)}
      onMouseLeave={onHoverEnd}
    >
      <Link
        href={href || "#"}
        id={id}
        className="contents"
        onClick={(e) => {
          if (!href) {
            e.preventDefault();
          }
        }}
      >
        <motion.button
          className={`
            relative
            flex items-center justify-center 
            rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] cursor-pointer 
            group
            border-2 border-transparent hover:border-white/20
            outline-none focus:ring-4 focus:ring-white/30
            w-full h-full
            md:!w-[var(--card-w)] md:!h-[var(--card-h)]
          `}
          aria-label={label}
          style={{
            rotate: rotation,
            ["--card-w" as string]: sizeValues.desktop.width,
            ["--card-h" as string]: sizeValues.desktop.height,
            ["--card-hover-w" as string]: sizeValues.desktop.hoverWidth,
            ["--card-hover-h" as string]: sizeValues.desktop.hoverHeight,
          }}
          initial={{
            backgroundColor: baseColor,
            y: 0,
          }}
          animate={{
            backgroundColor:
              isMobile || isHovered
                ? "var(--color-portfolio-green)"
                : baseColor,
            zIndex: isHovered ? 40 : 10,
            y: isLoaded ? [0, -10, 0] : 0,
          }}
          transition={{
            backgroundColor: { duration: 0.3 },
            y: {
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: floatDelay,
            },
          }}
        >
          <div
            className={`absolute z-20 transition-all duration-300 pointer-events-none ${isMobile || isHovered ? "opacity-100 scale-110" : "opacity-0 scale-95"}`}
            style={labelStyle}
          >
            <span className="text-sticker text-xs md:text-3xl">{label}</span>
          </div>

          <div
            className={`absolute inset-0 flex items-center justify-center pointer-events-none p-3 md:p-6 transition-all duration-300 ${isMobile || isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
          >
            <FaceComponent />
          </div>
        </motion.button>
      </Link>
    </ParallaxObject>
  );
};
