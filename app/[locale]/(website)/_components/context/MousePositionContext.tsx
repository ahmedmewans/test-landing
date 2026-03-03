"use client";

import { type MotionValue, useMotionValue, useSpring } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { CardId } from "@/types/portfolio";
import { springConfig } from "../constants";

interface MousePositionState {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  xRaw: MotionValue<number>;
  yRaw: MotionValue<number>;
  hoveredId: CardId | null;
  isMobile: boolean;
  isLoaded: boolean;
}

interface MousePositionActions {
  setHoveredId: (id: CardId | null) => void;
  setIsLoaded: (loaded: boolean) => void;
}

type MousePositionContextValue = MousePositionState & MousePositionActions;

const MousePositionContext = createContext<MousePositionContextValue | null>(
  null,
);

function useMousePosition(): MousePositionContextValue {
  const context = useContext(MousePositionContext);
  if (!context) {
    throw new Error(
      "useMousePosition must be used within MousePositionProvider",
    );
  }
  return context;
}

function MousePositionProvider({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);

  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredId, setHoveredId] = useState<CardId | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const normalizedX = clientX / innerWidth - 0.5;
      const normalizedY = clientY / innerHeight - 0.5;
      x.set(normalizedX);
      y.set(normalizedY);
      xRaw.set(clientX);
      yRaw.set(clientY);
    },
    [x, y, xRaw, yRaw],
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setHoveredId(null);
  }, [x, y]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  const value: MousePositionContextValue = {
    springX,
    springY,
    xRaw,
    yRaw,
    hoveredId,
    isMobile,
    isLoaded,
    setHoveredId,
    setIsLoaded,
  };

  return (
    <MousePositionContext value={value}>
      <div
        ref={containerRef}
        className="relative w-full h-screen bg-background overflow-hidden font-sans text-foreground selection:bg-accent/30"
      >
        {children}
      </div>
    </MousePositionContext>
  );
}

export {
  MousePositionContext,
  MousePositionProvider,
  useMousePosition,
  type MousePositionContextValue,
};
