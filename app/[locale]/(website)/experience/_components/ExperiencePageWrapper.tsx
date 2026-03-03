"use client";

import { MousePositionProvider } from "@/app/[locale]/(website)/_components/context/MousePositionContext";
import { PortfolioHeader } from "@/app/[locale]/(website)/_components/PortfolioHeader";
import type { ExperiencePublic } from "@/types/portfolio";
import { Experience } from "./Experience";

interface ExperiencePageWrapperProps {
  experiences: ExperiencePublic[];
}

function ExperienceContent({ experiences }: ExperiencePageWrapperProps) {
  return (
    <>
      <PortfolioHeader />
      <Experience experiences={experiences} />
    </>
  );
}

export default function ExperiencePageWrapper({
  experiences,
}: ExperiencePageWrapperProps) {
  return (
    <MousePositionProvider>
      <ExperienceContent experiences={experiences} />
    </MousePositionProvider>
  );
}
