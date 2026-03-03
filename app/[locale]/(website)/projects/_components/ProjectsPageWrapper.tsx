"use client";

import { MousePositionProvider } from "@/app/[locale]/(website)/_components/context/MousePositionContext";
import { PortfolioHeader } from "@/app/[locale]/(website)/_components/PortfolioHeader";
import type { ProjectPublic } from "@/types/portfolio";
import { Projects } from "./Projects";

interface ProjectsPageWrapperProps {
  projects: ProjectPublic[];
}

function ProjectsContent({ projects }: ProjectsPageWrapperProps) {
  console.log("projects", projects);
  return (
    <>
      <PortfolioHeader />
      <Projects projects={projects} />
    </>
  );
}

export default function ProjectsPageWrapper({
  projects,
}: ProjectsPageWrapperProps) {
  return (
    <MousePositionProvider>
      <ProjectsContent projects={projects} />
    </MousePositionProvider>
  );
}
