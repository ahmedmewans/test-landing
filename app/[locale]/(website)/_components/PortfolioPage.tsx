"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FileText, Github, Linkedin, Mail } from "lucide-react";
import dynamic from "next/dynamic";
import {
  EMAIL_LINK,
  GITHUB_LINK,
  LINKEDIN_LINK,
  RESUME_LINK,
} from "@/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import type { CardId } from "@/types/portfolio";
import {
  FaceAbout,
  FaceContact,
  FaceExperience,
  FaceProjects,
} from "./CardFaces";
import { ChatIndicator } from "./Chat/ChatIndicator";
import { ChatTrigger } from "./Chat/ChatTrigger";
import { ChatProvider, useChat } from "./context/ChatContext";
import {
  MousePositionProvider,
  useMousePosition,
} from "./context/MousePositionContext";
import { FaceCenter } from "./FaceCenter";
import { FloatingCard } from "./FloatingCard";
import { PortfolioHeader } from "./PortfolioHeader";

const ChatInterface = dynamic(
  () => import("./Chat/ChatInterface").then((mod) => mod.ChatInterface),
  { ssr: false },
);

const DecorativeCircles = dynamic(
  () => import("./DecorativeCircles").then((mod) => mod.DecorativeCircles),
  { ssr: false },
);

function PortfolioContent() {
  const { hoveredId, setHoveredId, isLoaded, setIsLoaded } = useMousePosition();
  const {
    isOpen: isChatOpen,
    toggle: toggleChat,
    close: closeChat,
  } = useChat();
  const isMobile = useIsMobile();

  return (
    <>
      <PortfolioHeader />

      <main className="relative w-full h-full flex items-center justify-center">
        <CenterSun
          hoveredId={hoveredId}
          isLoaded={isLoaded}
          setIsLoaded={setIsLoaded}
          isMobile={isMobile}
        />

        <div className="absolute inset-0 z-20 pointer-events-none w-full h-full overflow-hidden">
          <DesktopLayout
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            isMobile={isMobile}
          />
        </div>

        <HeroText />
      </main>

      <ChatWidget
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        closeChat={closeChat}
      />
    </>
  );
}

interface CenterSunProps {
  hoveredId: CardId | null;
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
  isMobile: boolean;
}

function CenterSun({
  hoveredId,
  isLoaded,
  setIsLoaded,
  isMobile,
}: CenterSunProps) {
  return (
    <div className="absolute z-10 w-full h-full pointer-events-none">
      <motion.div
        initial={{
          scale: 0,
          opacity: 0,
          rotate: -720,
          x: "-20vw",
          y: "-20vh",
        }}
        animate={{
          scale: hoveredId ? 1.05 : 1,
          opacity: 1,
          rotate: 0,
          x: 0,
          y: 0,
        }}
        onAnimationComplete={() => setIsLoaded(true)}
        transition={{
          duration: 2.1,
          ease: [0.23, 1, 0.32, 1],
          rotate: { duration: 2, ease: "easeOut" },
          scale: { duration: 2.1 },
          opacity: { duration: 1.5 },
        }}
        style={{
          top: isMobile ? "28%" : "27.8%",
          ...(isMobile
            ? { left: 0, right: 0, margin: "0 auto" }
            : { left: "39.6%" }),
          width: isMobile ? "min(45vw, 180px)" : "min(70vw, 280px)",
          height: isMobile ? "min(45vw, 180px)" : "min(70vw, 280px)",
          backgroundColor: "var(--color-portfolio-sun)",
        }}
        className={`absolute rounded-full flex items-center justify-center p-6 md:p-12 lg:p-16 shadow-sm border-2 border-transparent md:w-[400px]! md:h-[400px]! ${isLoaded ? "animate-sun-float" : ""}`}
      >
        <FaceCenter hoveredId={hoveredId} />
      </motion.div>
    </div>
  );
}

interface DesktopLayoutProps {
  hoveredId: CardId | null;
  setHoveredId: (id: CardId | null) => void;
  isMobile?: boolean;
}

function DesktopLayout({
  hoveredId,
  setHoveredId,
  isMobile = false,
}: DesktopLayoutProps) {
  return (
    <div className="w-full h-full relative">
      <div className="hidden md:block">
        <DecorativeCircles />
      </div>
      <OrbitCards
        hoveredId={hoveredId}
        setHoveredId={setHoveredId}
        isMobile={isMobile}
      />
    </div>
  );
}

function OrbitCards({
  hoveredId,
  setHoveredId,
  isMobile = false,
}: DesktopLayoutProps) {
  const cards = [
    {
      id: "projects" as CardId,
      label: "UXUI Projects",
      FaceComponent: FaceProjects,
      size: isMobile ? "w-16 h-16" : "w-28 h-28 md:w-40 md:h-40",
      style: isMobile
        ? { top: "20%", left: "15%" }
        : { top: "27.6%", left: "27.8%" },
      depth: 1.5,
      rotation: 12,
      href: "/projects",
      floatDelay: 0,
      labelPosition: isMobile ? ("bottom" as const) : ("right" as const),
      initial: { opacity: 0, scale: 0, x: "-22vw", y: "-22vh" },
      animate: { opacity: 1, scale: 1, x: 0, y: 0 },
      transition: {
        duration: 2.1,
        ease: [0.23, 1, 0.32, 1] as const,
        opacity: { duration: 1.2 },
      },
    },
    {
      id: "contact" as CardId,
      label: "Contact",
      FaceComponent: FaceContact,
      size: isMobile ? "w-14 h-14" : "w-24 h-24 md:w-32 md:h-32",
      style: isMobile
        ? { top: "16%", left: "65%" }
        : { top: "21.8%", left: "59.6%" },
      depth: 1.2,
      rotation: -8,
      href: "/contact",
      floatDelay: 0.7,
      labelPosition: isMobile ? ("bottom" as const) : ("left" as const),
      initial: { opacity: 0, scale: 0, x: "20vw", y: "-30vh" },
      animate: { opacity: 1, scale: 1, x: 0, y: 0 },
      transition: {
        duration: 2.3,
        ease: [0.23, 1, 0.32, 1] as const,
        opacity: { duration: 1.4 },
      },
    },
    {
      id: "experience" as CardId,
      label: "Experience",
      FaceComponent: FaceExperience,
      size: isMobile ? "w-16 h-16" : "w-36 h-36 md:w-48 md:h-48",
      style: isMobile
        ? { top: "55%", left: "62%" }
        : { top: "44.8%", left: "63.6%" },
      depth: 2.2,
      rotation: -5,
      href: "/experience",
      floatDelay: 1.2,
      labelPosition: isMobile ? ("bottom" as const) : ("left" as const),
      initial: { opacity: 0, scale: 0, x: "25vw", y: 0 },
      animate: { opacity: 1, scale: 1, x: 0, y: 0 },
      transition: {
        duration: 1.8,
        ease: [0.23, 1, 0.32, 1] as const,
        opacity: { duration: 1.1 },
      },
    },
    {
      id: "about" as CardId,
      label: "About Me",
      FaceComponent: FaceAbout,
      size: isMobile ? "w-14 h-14" : "w-32 h-32 md:w-44 md:h-44",
      style: isMobile
        ? { top: "55%", left: "12%" }
        : { top: "61.9%", left: "36.6%" },
      depth: 1.8,
      rotation: 8,
      href: "/about",
      floatDelay: 1.8,
      labelPosition: isMobile ? ("bottom" as const) : ("right" as const),
      initial: { opacity: 0, scale: 0, x: "-15vw", y: "25vh" },
      animate: { opacity: 1, scale: 1, x: 0, y: 0 },
      transition: {
        duration: 2.4,
        ease: [0.23, 1, 0.32, 1] as const,
        opacity: { duration: 1.6 },
      },
    },
  ];

  return (
    <>
      {cards.map((card) => (
        <FloatingCard
          key={card.id}
          {...card}
          baseColor="var(--color-portfolio-orange)"
          isHovered={hoveredId === card.id}
          onHoverStart={setHoveredId}
          onHoverEnd={() => setHoveredId(null)}
        />
      ))}
    </>
  );
}

function HeroText() {
  return (
    <div className="absolute bottom-10 left-6 md:bottom-12 md:left-12 lg:bottom-16 lg:left-16 lg:w-[480px] z-30 pointer-events-none">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.3,
            },
          },
        }}
        className="text-left"
      >
        <div className="animate-in fade-in slide-in-from-left-4 duration-700 delay-300 fill-mode-both flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 bg-portfolio-orange rounded-full animate-pulse" />
          <p className="font-sans font-black text-foreground/50 uppercase tracking-[0.3em] text-[10px]">
            Open for Magic
          </p>
        </div>

        <p className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both font-sans font-bold text-foreground/70 mb-1 tracking-tight text-sm md:text-base">
          Ahmed specializes in designing
        </p>

        <h2 className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-0 fill-mode-both text-3xl md:text-5xl lg:text-6xl font-serif font-black text-foreground leading-[0.9] tracking-tighter">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-portfolio-orange to-portfolio-sun inline-block">
            Interactive
          </span>{" "}
          <br />
          Websites <br />
          <span className="text-foreground italic opacity-80">
            & Applications.
          </span>
        </h2>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both flex flex-wrap gap-4 mt-8 pointer-events-auto">
          <a
            href={RESUME_LINK}
            download="Ahmed Abdo-FrontEnd-Resume.pdf"
            className="inline-flex items-center gap-2 px-6 py-3 bg-portfolio-dark text-portfolio-cream rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
          >
            <FileText size={20} /> Resume
          </a>
          <a
            href={LINKEDIN_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center bg-white text-[#0077B5] rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Linkedin size={22} />
          </a>
          <a
            href={GITHUB_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center bg-white text-[#333] rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Github size={22} />
          </a>
          <a
            href={`mailto:${EMAIL_LINK}`}
            className="w-12 h-12 flex items-center justify-center bg-white text-portfolio-orange rounded-full shadow-lg hover:scale-110 transition-transform"
            title="Email"
          >
            <Mail size={22} />
          </a>
        </div>
      </motion.div>
    </div>
  );
}

function ChatWidget({
  isChatOpen,
  toggleChat,
  closeChat,
}: {
  isChatOpen: boolean;
  toggleChat: () => void;
  closeChat: () => void;
}) {
  return (
    <>
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex flex-col items-end pointer-events-none">
        <ChatIndicator isVisible={!isChatOpen} />
        <ChatTrigger isOpen={isChatOpen} onClick={toggleChat} />
      </div>

      <AnimatePresence>
        {isChatOpen && <ChatInterface onClose={closeChat} />}
      </AnimatePresence>
    </>
  );
}

export default function PortfolioPage() {
  return (
    <MousePositionProvider>
      <ChatProvider>
        <PortfolioContent />
      </ChatProvider>
    </MousePositionProvider>
  );
}
