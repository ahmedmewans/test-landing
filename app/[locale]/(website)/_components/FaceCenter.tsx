"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { CardId } from "@/types/portfolio";
import {
  SunFaceAbout,
  SunFaceContact,
  SunFaceDefault,
  SunFaceExperience,
  SunFaceProjects,
} from "./SunFaces";

interface FaceCenterProps {
  hoveredId: CardId | null;
}

export const FaceCenter: React.FC<FaceCenterProps> = ({ hoveredId }) => {
  const getFaceComponent = () => {
    switch (hoveredId) {
      case "projects":
        return <SunFaceProjects key="projects" />;
      case "experience":
        return <SunFaceExperience key="experience" />;
      case "contact":
        return <SunFaceContact key="contact" />;
      case "about":
        return <SunFaceAbout key="about" />;
      default:
        return <SunFaceDefault key="default" />;
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={hoveredId || "default"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full h-full"
        >
          {getFaceComponent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
