"use client";

import { MousePositionProvider } from "@/app/[locale]/(website)/_components/context/MousePositionContext";
import { PortfolioHeader } from "@/app/[locale]/(website)/_components/PortfolioHeader";
import type { ProjectPublic } from "@/types/portfolio";
import { ProjectDetail } from "./ProjectDetail";

interface ProjectDetailClientProps {
  project: ProjectPublic;
  nextProject?: {
    title: string;
    slug: string;
    category: string;
    thumbnailUrl: string | null;
    color: string;
  } | null;
}

function ProjectDetailContent({
  project,
  nextProject,
}: ProjectDetailClientProps) {
  return (
    <>
      <PortfolioHeader />
      <ProjectDetail project={project} nextProject={nextProject} />
    </>
  );
}

export default function ProjectDetailClient({
  project,
  nextProject,
}: ProjectDetailClientProps) {
  return (
    <MousePositionProvider>
      <ProjectDetailContent project={project} nextProject={nextProject} />
    </MousePositionProvider>
  );
}
