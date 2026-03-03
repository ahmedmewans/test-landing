"use client";

import { MousePositionProvider } from "@/app/[locale]/(website)/_components/context/MousePositionContext";
import { PortfolioHeader } from "@/app/[locale]/(website)/_components/PortfolioHeader";
import type { SkillPublic, TestimonialPublic } from "@/types/portfolio";
import { AboutMe } from "./AboutMe";

interface AboutPageWrapperProps {
  skills: SkillPublic[];
  testimonials: TestimonialPublic[];
}

function AboutContent({ skills, testimonials }: AboutPageWrapperProps) {
  return (
    <>
      <PortfolioHeader />
      <AboutMe skills={skills} testimonials={testimonials} />
    </>
  );
}

export default function AboutPageWrapper({
  skills,
  testimonials,
}: AboutPageWrapperProps) {
  return (
    <MousePositionProvider>
      <AboutContent skills={skills} testimonials={testimonials} />
    </MousePositionProvider>
  );
}
