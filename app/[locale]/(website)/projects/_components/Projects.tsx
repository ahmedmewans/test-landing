"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  Cpu,
  FolderOpen,
  Globe,
  Layers,
  MessageCircle,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useMousePosition } from "@/app/[locale]/(website)/_components/context/MousePositionContext";
import { DecorativeCircle } from "@/components/portfolio/shared/DecorativeCircle";
import { Link } from "@/i18n/navigation";
import type { ProjectPublic } from "@/types/portfolio";

interface ProjectsProps {
  projects: ProjectPublic[];
}

const mockupIcons: Record<string, React.ReactNode> = {
  dashboard: (
    <Layers
      size={48}
      className="text-portfolio-dark opacity-10 md:size-16 lg:size-16"
    />
  ),
  mobile: (
    <Cpu
      size={48}
      className="text-portfolio-dark opacity-10 md:size-16 lg:size-16"
    />
  ),
  components: (
    <Code2
      size={48}
      className="text-portfolio-dark opacity-10 md:size-16 lg:size-16"
    />
  ),
  gallery: (
    <Globe
      size={48}
      className="text-portfolio-dark opacity-10 md:size-16 lg:size-16"
    />
  ),
  chat: (
    <MessageCircle
      size={48}
      className="text-portfolio-dark opacity-10 md:size-16 lg:size-16"
    />
  ),
};

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const { springX, springY, xRaw, yRaw } = useMousePosition();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 w-full h-full overflow-y-auto bg-background px-6 py-32 md:px-12 md:py-36 z-40 custom-scrollbar"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16 lg:mb-24 relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl lg:text-8xl text-sticker mb-6 md:mb-10 inline-block relative py-2 md:py-4"
          >
            Selected Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto font-sans leading-relaxed px-4 md:px-0"
          >
            A collection of digital products, websites, and experiments crafted
            with care.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 pb-12 md:pb-20">
          {projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full flex flex-col items-center justify-center py-12 md:py-20 text-center"
            >
              <div className="w-16 h-16 md:w-24 md:h-24 bg-[#FFD05B]/20 rounded-full flex items-center justify-center mb-4 md:mb-6">
                <FolderOpen
                  size={32}
                  className="text-[#5A3927]/40 md:size-12"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-[#5A3927] mb-2 md:mb-3">
                No Projects Yet
              </h3>
              <p className="text-sm md:text-base text-[#693B2A]/70 max-w-md px-4">
                Projects will appear here once they're published. Check back
                soon!
              </p>
            </motion.div>
          ) : (
            projects.map((project: ProjectPublic, index: number) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Link href={`/projects/${project.slug}`} className="block">
                  <div
                    className={`
                  relative aspect-[4/3] md:aspect-4/3 rounded-2xl md:rounded-[2rem] mb-4 md:mb-6 overflow-hidden shadow-sm transition-transform duration-500 group-hover:scale-[1.02]
                  ${project.color}
                `}
                  >
                    {/* Thumbnail Image */}
                    {project.thumbnailUrl ? (
                      <Image
                        src={project.thumbnailUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      /* Mockup Placeholder */
                      <div className="absolute inset-0 flex items-center justify-center">
                        {mockupIcons[project.mockupType || ""] || (
                          <Code2
                            size={48}
                            className="text-[#5A3927] opacity-20 md:size-16 lg:size-16"
                          />
                        )}
                      </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-[#5A3927]/0 group-hover:bg-[#5A3927]/10 transition-colors duration-300" />

                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-3 left-3 md:top-4 md:left-4 flex items-center gap-1 md:gap-1.5 px-2 py-1 md:px-3 md:py-1.5 glass rounded-full shadow-sm z-10">
                        <Star
                          size={12}
                          className="text-portfolio-orange fill-portfolio-orange md:size-3.5"
                        />
                        <span className="text-[10px] md:text-xs font-bold text-portfolio-dark">
                          Featured
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                      <ArrowUpRight
                        size={20}
                        className="text-portfolio-dark md:size-6"
                      />
                    </div>
                  </div>

                  <div className="px-1">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <span className="font-bold text-portfolio-orange uppercase tracking-widest text-[9px] md:text-[10px] lg:text-xs">
                        {project.category}
                      </span>
                      {project.tags.length > 0 && (
                        <div className="flex gap-1 md:gap-1.5">
                          {project.tags.slice(0, 2).map((tag: string) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 md:px-2 glass rounded-full text-[8px] md:text-[9px] font-bold text-portfolio-dark/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-foreground mb-2 md:mb-3 group-hover:text-portfolio-orange transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed line-clamp-2 text-sm md:text-base">
                      {project.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <DecorativeCircle
          color="bg-[#FFD05B]"
          size="w-48 h-48 md:w-72 lg:w-96 lg:h-96"
          top="-10%"
          left="-10%"
          depth={0.05}
          mouseX={springX}
          mouseY={springY}
          mouseXRaw={xRaw}
          mouseYRaw={yRaw}
        />
        <DecorativeCircle
          color="bg-[#93E190]"
          size="w-32 h-32 md:w-48 lg:w-64 lg:h-64"
          top="40%"
          right="-5%"
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
