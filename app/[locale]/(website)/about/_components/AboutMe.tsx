"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Code2,
  Cpu,
  FileText,
  Github,
  Globe,
  Layout,
  Linkedin,
  Mail,
  Server,
  Terminal,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { useMousePosition } from "@/app/[locale]/(website)/_components/context/MousePositionContext";
import { DecorativeCircle } from "@/components/portfolio/shared/DecorativeCircle";
import {
  EMAIL_LINK,
  GITHUB_LINK,
  LINKEDIN_LINK,
  RESUME_LINK,
} from "@/constants";
import type { SkillPublic, TestimonialPublic } from "@/types/portfolio";

interface AboutMeProps {
  skills: SkillPublic[];
  testimonials: TestimonialPublic[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

export const AboutMe: React.FC<AboutMeProps> = ({ skills, testimonials }) => {
  const { springX, springY, xRaw, yRaw } = useMousePosition();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
    offset: ["start start", "end end"],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      const category = skill.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    },
    {} as Record<string, SkillPublic[]>,
  );

  const levelColors: Record<string, string> = {
    beginner: "bg-gray-100",
    intermediate: "bg-blue-100",
    advanced: "bg-portfolio-sun/30",
    expert: "bg-portfolio-green",
  };

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="absolute inset-0 w-full h-full overflow-y-auto bg-portfolio-cream px-4 py-24 md:px-8 md:py-32 lg:px-12 lg:py-36 z-40 selection:bg-portfolio-orange/30"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero Section */}
        <motion.div
          style={{ opacity: headerOpacity, scale: headerScale }}
          className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-center mb-16 md:mb-24 lg:mb-32 text-center md:text-left"
        >
          {/* Avatar Area with floating and glow */}
          <motion.div variants={itemVariants} className="relative shrink-0">
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 2, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-portfolio-sun rounded-full flex items-center justify-center border-4 md:border-6 lg:border-8 border-white shadow-[0_20px_40px_-10px_rgba(250,153,57,0.3)] md:shadow-[0_30px_60px_-15px_rgba(250,153,57,0.3)] relative overflow-hidden z-20"
            >
              <Image
                src="/linkedin-image.png"
                alt="Ahmed Fahmy"
                className="object-cover"
                fill
                priority
              />
            </motion.div>
            <div className="absolute -inset-6 md:-inset-8 lg:-inset-10 bg-portfolio-sun rounded-full blur-[60px] md:blur-[80px] lg:blur-[100px] opacity-20 -z-10 animate-pulse" />
          </motion.div>

          <div className="space-y-4 md:space-y-6 md:max-w-xl">
            <motion.div variants={itemVariants} className="space-y-2">
              <span className="font-sans font-black text-portfolio-orange tracking-[0.15em] md:tracking-[0.2em] uppercase text-xs md:text-sm block">
                Frontend Engineer
              </span>
              <div className="h-1 w-16 md:w-20 bg-portfolio-orange rounded-full mx-auto md:mx-0" />
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-serif font-black text-portfolio-dark leading-[0.9] tracking-tight"
            >
              Architecting{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-portfolio-orange to-portfolio-sun">
                Scalable
              </span>{" "}
              Web Applications.
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg lg:text-xl xl:text-2xl text-portfolio-dark/80 leading-relaxed font-(--font-outfit) opacity-90"
            >
              I'm Ahmed, a Frontend Engineer crafting experiences where
              <span className="text-portfolio-orange font-bold">
                {" "}
                performance meets precision.
              </span>
            </motion.p>

            {/* Resume & Socials Call To Action */}
            <motion.div
              variants={itemVariants}
              className="pt-4 md:pt-6 flex flex-wrap items-center gap-4"
            >
              <a
                href={RESUME_LINK}
                download="Ahmed_Fahmy-FrontEnd_Engineer-Resume.pdf"
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-portfolio-dark text-portfolio-cream rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all text-sm md:text-base font-sans group"
              >
                <div className="bg-portfolio-sun/20 p-1.5 md:p-2 rounded-full text-portfolio-sun group-hover:bg-portfolio-sun group-hover:text-portfolio-dark transition-colors">
                  <FileText size={18} className="md:size-[22px]" />
                </div>
                Download Resume
              </a>
              <a
                href={LINKEDIN_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white text-[#0077B5] rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
                title="LinkedIn Profile"
              >
                <Linkedin size={22} className="md:size-[26px]" />
              </a>
              <a
                href={GITHUB_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white text-[#333] rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
                title="GitHub Profile"
              >
                <Github size={22} className="md:size-[26px]" />
              </a>
              <a
                href={`mailto:${EMAIL_LINK}`}
                target="_self"
                rel="noopener noreferrer"
                className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white text-portfolio-orange rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
                title="Email"
              >
                <Mail size={22} className="md:size-[26px]" />
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Content Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-16 md:mb-24 lg:mb-32 font-(--font-outfit)">
          {/* Main Story */}
          <motion.div
            variants={itemVariants}
            whileInView="visible"
            viewport={{ once: true }}
            className="md:col-span-8 bg-white/40 backdrop-blur-xl border border-white/60 p-6 md:p-10 lg:p-14 rounded-2xl md:rounded-[3rem] shadow-[0_10px_30px_-8px_rgba(133,64,45,0.05)] md:shadow-[0_20px_50px_-12px_rgba(133,64,45,0.05)] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 md:p-6 lg:p-8 text-portfolio-orange/10 group-hover:text-portfolio-orange/20 transition-colors">
              <Zap
                size={64}
                strokeWidth={1}
                className="md:size-24 lg:size-30"
              />
            </div>
            <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-black text-portfolio-dark mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
              The Journey
            </h3>
            <div className="space-y-4 md:space-y-6 text-portfolio-dark/80 text-base md:text-lg lg:text-xl leading-relaxed">
              <p>
                My path into software engineering wasn't a straight line. I
                graduated with a{" "}
                <span className="text-portfolio-orange font-extrabold italic">
                  Bachelor of Civil Engineering
                </span>
                , which taught me the fundamentals of robust architecture,
                before pivoting to the digital world.
              </p>
              <p>
                Since 2022, I specialize in high-concurrency web applications,
                agentic AI systems, and scalable enterprise tools using{" "}
                <span className="text-portfolio-green font-extrabold">
                  Next.js 16, React 19, and strict TypeScript.
                </span>
              </p>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="md:col-span-4 flex flex-col gap-4 md:gap-6 lg:gap-8">
            <motion.div
              variants={itemVariants}
              whileInView="visible"
              viewport={{ once: true }}
              className="flex-1 bg-portfolio-orange p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-[3rem] text-portfolio-cream shadow-lg md:shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500"
            >
              <div className="relative z-10">
                <Zap
                  className="mb-4 md:mb-6 group-hover:rotate-12 transition-transform"
                  size={32}
                />
                <p className="text-xs md:text-sm font-black uppercase tracking-widest opacity-60 mb-1 md:mb-2">
                  Specialty
                </p>
                <h4 className="text-lg md:text-xl lg:text-2xl font-serif font-black leading-tight text-white">
                  High-Performance
                  <br />
                  React Architecture
                </h4>
              </div>
              <div className="absolute -bottom-4 -right-4 text-portfolio-cream/10 group-hover:scale-125 transition-transform duration-1000 hidden md:block">
                <Zap size={200} />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-md p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-[3rem] border border-white shadow-sm flex items-center justify-between group hover:shadow-lg transition-all"
            >
              <div>
                <p className="text-2xl md:text-3xl font-black text-portfolio-dark">
                  4+
                </p>
                <p className="text-xs md:text-sm text-portfolio-dark/60 uppercase tracking-wider">
                  Years Experience
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-portfolio-cream rounded-xl md:rounded-2xl flex items-center justify-center text-portfolio-orange">
                <Briefcase size={20} className="md:size-6" />
              </div>
            </motion.div>
          </div>

          {/* Toolkit: Creative Workbench */}
          <motion.div
            variants={itemVariants}
            whileInView="visible"
            viewport={{ once: true }}
            className="md:col-span-12 bg-white p-6 md:p-10 lg:p-14 rounded-2xl md:rounded-[3rem] lg:rounded-[4rem] shadow-2xl relative overflow-hidden border-4 border-portfolio-dark/5"
          >
            {/* Blueprint Background */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(var(--color-portfolio-dark)_1px,transparent_1px),linear-gradient(90deg,var(--color-portfolio-dark)_1px,transparent_1px)] bg-size-[40px_40px] md:bg-size-[60px_60px]" />
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(var(--color-portfolio-dark)_0.5px,transparent_0.5px),linear-gradient(90deg,var(--color-portfolio-dark)_0.5px,transparent_0.5px)] bg-size-[10px_10px] md:bg-size-[15px_15px]" />

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 md:mb-16 gap-6 md:gap-8">
                <div className="space-y-3 md:space-y-4 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 md:p-3 bg-portfolio-sun/20 rounded-xl md:rounded-2xl text-portfolio-orange">
                      <Terminal size={24} className="md:size-8" />
                    </div>
                    <span className="font-sans font-black text-portfolio-orange tracking-[0.2em] uppercase text-xs md:text-sm">
                      Fullstack Toolkit
                    </span>
                  </div>
                  <h3 className="font-serif text-3xl md:text-5xl lg:text-6xl font-black text-portfolio-dark leading-[0.9] tracking-tighter">
                    My Creative <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-portfolio-orange to-portfolio-sun">
                      Workbench
                    </span>
                  </h3>
                  <p className="text-base md:text-lg lg:text-xl text-portfolio-dark/80 font-medium opacity-80 leading-relaxed">
                    Weaponry of choice for crafting high-concurrency
                    environments and pixel-perfect interfaces.
                  </p>
                </div>

                {/* Decorative Measurement Marker */}
                <div className="hidden lg:flex flex-col items-center gap-4 py-8">
                  <div className="h-24 w-px bg-linear-to-b from-portfolio-dark/0 via-portfolio-dark/20 to-portfolio-dark/0" />
                  <p className="text-[10px] font-mono text-portfolio-dark/30 uppercase">
                    precision & scale
                  </p>
                  <div className="h-24 w-px bg-linear-to-b from-portfolio-dark/0 via-portfolio-dark/20 to-portfolio-dark/0" />
                </div>
              </div>

              {Object.keys(skillsByCategory).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {Object.entries(skillsByCategory).map(
                    ([category, categorySkills], idx) => {
                      const icons: Record<string, LucideIcon> = {
                        Frontend: Layout,
                        Backend: Server,
                        Tools: Terminal,
                        Mobile: Globe,
                        AI: Cpu,
                        Core: Code2,
                      };
                      const Icon = icons[category] || Code2;

                      return (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-portfolio-cream/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-portfolio-dark/5 group hover:bg-white transition-all hover:shadow-xl"
                        >
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 md:p-2.5 bg-white rounded-lg md:rounded-xl text-portfolio-orange shadow-sm transform group-hover:rotate-12 transition-transform">
                              <Icon size={18} className="md:size-5" />
                            </div>
                            <h4 className="font-serif italic font-black text-portfolio-dark group-hover:text-portfolio-orange transition-colors">
                              {category}
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {categorySkills.map((skill) => (
                              <motion.span
                                key={skill._id}
                                whileHover={{
                                  scale: 1.05,
                                  translateY: -3,
                                  rotate: [0, 1, -1, 0],
                                }}
                                className={`px-3 py-1.5 md:px-4 md:py-2 ${levelColors[skill.level] || "bg-white"} rounded-lg md:rounded-xl text-portfolio-dark font-black text-[10px] md:text-xs shadow-sm border border-white/80 hover:border-portfolio-orange/30 transition-all cursor-default`}
                              >
                                {skill.name}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      );
                    },
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 md:gap-4 mt-8">
                  {[
                    { name: "React 19", color: "bg-portfolio-green" },
                    { name: "TypeScript", color: "bg-blue-100" },
                    { name: "Next.js 16", color: "bg-white" },
                    { name: "Zustand", color: "bg-purple-100" },
                    { name: "Tailwind v4", color: "bg-cyan-100" },
                    { name: "Convex", color: "bg-portfolio-sun/30" },
                    { name: "AI Agents", color: "bg-orange-50" },
                    { name: "Three.js", color: "bg-slate-100" },
                  ].map((skill, i) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.1, rotate: 2 }}
                      className={`px-5 py-2.5 md:px-7 md:py-3.5 ${skill.color} rounded-xl md:rounded-2xl text-portfolio-dark font-black text-xs md:text-lg shadow-[4px_4px_0px_0px_var(--color-portfolio-dark)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all border-2 border-portfolio-dark`}
                    >
                      {skill.name}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Engineering Scribble Decoration */}
            <svg
              className="absolute -bottom-10 -right-10 w-40 h-40 md:w-64 md:h-64 text-portfolio-orange/5 pointer-events-none"
              viewBox="0 0 200 200"
            >
              <title>Engineering Scribble</title>
              <path
                d="M40 40 L160 160 M40 160 L160 40"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
              />
              <circle
                cx="100"
                cy="100"
                r="60"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
              />
            </svg>
          </motion.div>
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-portfolio-sun/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-portfolio-orange/10 blur-[150px] rounded-full" />

        <DecorativeCircle
          color="bg-portfolio-sun"
          size="w-64 h-64 md:w-96 lg:w-[600px] lg:h-[600px]"
          bottom="-10%"
          right="-5%"
          depth={0.05}
          mouseX={springX}
          mouseY={springY}
          mouseXRaw={xRaw}
          mouseYRaw={yRaw}
        />
        <DecorativeCircle
          color="bg-portfolio-orange"
          size="w-48 h-48 md:w-64 lg:w-80 lg:h-80"
          top="10%"
          left="-5%"
          depth={0.12}
          mouseX={springX}
          mouseY={springY}
          mouseXRaw={xRaw}
          mouseYRaw={yRaw}
        />
        <DecorativeCircle
          color="bg-portfolio-green"
          size="w-32 h-32 md:w-64 lg:w-[400px] lg:h-[400px]"
          top="30%"
          right="-10%"
          depth={0.08}
          mouseX={springX}
          mouseY={springY}
          mouseXRaw={xRaw}
          mouseYRaw={yRaw}
        />
      </div>
    </motion.div>
  );
};
