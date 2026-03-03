"use client";

import type { Transition } from "framer-motion";
import { DecorativeCircle } from "@/components/portfolio/shared/DecorativeCircle";

function DecorativeCircleWrapper(props: {
  color: string;
  size: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  depth: number;
  floatDelay: number;
  initial?: { opacity: number; scale: number };
  animate?: { opacity: number; scale: number };
  transition?: Transition;
}) {
  return <DecorativeCircle {...props} />;
}

export function DecorativeCircles() {
  const circles = [
    {
      size: "w-48 h-48",
      top: "10%",
      left: "12%",
      depth: 0.2,
      delay: 0.5,
      animDelay: 0.3,
    },
    {
      size: "w-12 h-12",
      top: "5%",
      left: "45%",
      depth: 0.8,
      delay: 1.2,
      animDelay: 0.6,
    },
    {
      size: "w-40 h-40",
      top: "18%",
      right: "8%",
      depth: 0.3,
      delay: 0.8,
      animDelay: 0.4,
    },
    {
      size: "w-16 h-16",
      top: "55%",
      right: "15%",
      depth: 1.1,
      delay: 1.5,
      animDelay: 0.7,
    },
    {
      size: "w-32 h-32",
      bottom: "12%",
      right: "12%",
      depth: 0.4,
      delay: 0.3,
      animDelay: 0.2,
    },
    {
      size: "w-10 h-10",
      bottom: "8%",
      left: "38%",
      depth: 1.3,
      delay: 1.0,
      animDelay: 0.5,
    },
    {
      size: "w-24 h-24",
      bottom: "18%",
      left: "15%",
      depth: 0.6,
      delay: 1.8,
      animDelay: 0.8,
    },
  ];

  return (
    <>
      {circles.map((circle, index) => (
        <DecorativeCircleWrapper
          key={index}
          color="bg-portfolio-sun"
          size={circle.size}
          top={circle.top}
          left={circle.left}
          right={circle.right}
          bottom={circle.bottom}
          depth={circle.depth}
          floatDelay={circle.delay}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.8,
            ease: [0.23, 1, 0.32, 1],
            delay: circle.animDelay,
          }}
        />
      ))}
    </>
  );
}
