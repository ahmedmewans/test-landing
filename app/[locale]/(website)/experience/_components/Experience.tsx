"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useMousePosition } from "@/app/[locale]/(website)/_components/context/MousePositionContext";
import { DecorativeCircle } from "@/components/portfolio/shared/DecorativeCircle";
import { cn } from "@/lib/utils";
import type { ExperiencePublic } from "@/types/portfolio";

interface ExperienceProps {
  experiences: ExperiencePublic[];
}

export const Experience: React.FC<ExperienceProps> = ({ experiences }) => {
  const { springX, springY, xRaw, yRaw } = useMousePosition();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 w-full h-full overflow-y-auto bg-background px-6 py-32 md:px-12 md:py-36 z-40"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 md:mb-24 relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-extrabold text-portfolio-dark mb-6 inline-block relative"
          >
            My Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-portfolio-dark/80 max-w-2xl mx-auto font-sans leading-relaxed"
          >
            A timeline of my professional growth, key roles, and the impactful
            projects I've contributed to.
          </motion.p>
        </div>

        <div className="space-y-12 md:space-y-20 pb-20 relative">
          {/* Central Timeline Line (visible on desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-portfolio-dark/10 -translate-x-1/2" />

          {experiences.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-24 h-24 bg-portfolio-sun/20 rounded-full flex items-center justify-center mb-6">
                <Briefcase size={48} className="text-portfolio-dark/40" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-portfolio-dark mb-3">
                No Experience Yet
              </h3>
              <p className="text-portfolio-dark/70 max-w-md">
                Experience entries will appear here once added.
              </p>
            </motion.div>
          ) : (
            experiences.map((exp: ExperiencePublic, index: number) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Dot */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 w-4 h-4 rounded-full bg-portfolio-dark -translate-x-1/2 -translate-y-1/2 z-10 border-4 border-background" />

                {/* Content Card */}
                <div className="w-full md:w-[45%]">
                  <div
                    className={cn(
                      "p-8 md:p-10 rounded-[2.5rem] bg-white shadow-sm border border-portfolio-dark/5",
                      "hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group",
                    )}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center text-portfolio-dark shadow-sm transform group-hover:rotate-6 transition-transform",
                          exp.color,
                        )}
                      >
                        <Briefcase size={28} />
                      </div>
                      <span className="text-sm font-bold text-portfolio-dark/60 font-mono bg-background px-4 py-1.5 rounded-full">
                        {exp.period}
                      </span>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-portfolio-dark mb-2">
                        {exp.role}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-portfolio-dark/70 font-medium">
                        <span className="flex items-center gap-1.5 border-r border-portfolio-dark/10 pr-4">
                          <Building2 size={18} />
                          {exp.company}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={18} />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    <p className="text-portfolio-dark/80 leading-relaxed mb-8 text-lg">
                      {exp.description}
                    </p>

                    {exp.highlights.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-portfolio-orange">
                          Key Highlights
                        </h4>
                        <ul className="space-y-3">
                          {exp.highlights.map((highlight: string) => (
                            <li
                              key={highlight}
                              className="flex items-start gap-3"
                            >
                              <CheckCircle2
                                size={20}
                                className="text-portfolio-green shrink-0 mt-0.5"
                              />
                              <span className="text-portfolio-dark/90 font-medium leading-snug">
                                {highlight}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {exp.tags.length > 0 && (
                      <div className="mt-8 pt-8 border-t border-[#5A3927]/5 flex flex-wrap gap-2">
                        {exp.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-background rounded-lg text-xs font-bold text-portfolio-dark/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Spacer for desktop layout */}
                <div className="hidden md:block w-1/2" />
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <DecorativeCircle
          color="bg-portfolio-sun"
          size="w-96 h-96"
          top="-10%"
          right="-10%"
          depth={0.05}
          mouseX={springX}
          mouseY={springY}
          mouseXRaw={xRaw}
          mouseYRaw={yRaw}
        />
        <DecorativeCircle
          color="bg-portfolio-green"
          size="w-64 h-64"
          bottom="10%"
          left="-5%"
          depth={0.1}
          mouseX={springX}
          mouseY={springY}
          mouseXRaw={xRaw}
          mouseYRaw={yRaw}
        />
      </div>
    </motion.div>
  );
};
