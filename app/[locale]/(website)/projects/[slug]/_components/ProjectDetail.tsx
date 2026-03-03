"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Layers,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useMousePosition } from "@/app/[locale]/(website)/_components/context/MousePositionContext";
import { DecorativeCircle } from "@/components/portfolio/shared/DecorativeCircle";
import { Doodle } from "@/components/portfolio/shared/Doodle";
import { Polaroid } from "@/components/portfolio/shared/Polaroid";
import { Sticker } from "@/components/portfolio/shared/Sticker";
import { parseArticleContent } from "@/components/tiptap/formatter/ArticleParser";
import { Link } from "@/i18n/navigation";
import type { ProjectPublic } from "@/types/portfolio";

interface ProjectDetailProps {
  project: ProjectPublic;
  nextProject?: {
    title: string;
    slug: string;
    category: string;
    thumbnailUrl: string | null;
    color: string;
  } | null;
}

function formatDate(timestamp: number | undefined): string {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  nextProject,
}) => {
  const { springX, springY, xRaw, yRaw } = useMousePosition();

  const hasDate = project.startDate || project.endDate;
  const dateRange = `${formatDate(project.startDate)}${project.startDate && !project.endDate ? " - Present" : project.endDate ? ` - ${formatDate(project.endDate)}` : ""}`;

  const imageUrls = project.imageUrls ?? [];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % imageUrls.length);
  }, [lightboxIndex, imageUrls.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + imageUrls.length) % imageUrls.length);
  }, [lightboxIndex, imageUrls.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, goNext, goPrev, closeLightbox]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 w-full h-full overflow-y-auto bg-[#F7EFE4] z-50 selection:bg-[#FFC760]/30 custom-scrollbar"
    >
      {/* --- Floating Background Elements (Canvas Layer) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <DecorativeCircle
          color="bg-[#FFC760]"
          size="w-48 h-48 md:w-72 lg:w-96 lg:h-96"
          top="-5%"
          left="-5%"
          depth={0.1}
          mouseX={springX}
          mouseY={springY}
          mouseXRaw={xRaw}
          mouseYRaw={yRaw}
        />
        <DecorativeCircle
          color="bg-[#FA9939]"
          size="w-32 h-32 md:w-48 lg:w-72 lg:h-72"
          bottom="10%"
          right="5%"
          depth={0.2}
          mouseX={springX}
          mouseY={springY}
          mouseXRaw={xRaw}
          mouseYRaw={yRaw}
        />
        <DecorativeCircle
          color="bg-[#FFC760]"
          size="w-20 h-20 md:w-24 lg:w-36 lg:h-36"
          top="40%"
          right="15%"
          depth={0.3}
          mouseX={springX}
          mouseY={springY}
          mouseXRaw={xRaw}
          mouseYRaw={yRaw}
        />
      </div>

      <div className="relative z-10 min-h-screen px-4 py-24 md:px-12 md:py-32 lg:px-20 max-w-7xl mx-auto space-y-16 md:space-y-24 lg:space-y-32">
        {/* --- Hero Section: Asymmetrical & Hand-crafted --- */}
        <section className="relative flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-start">
          {/* New Character Doodle 1: Orange Peeker - Hidden on mobile */}
          <Doodle
            mouseX={springX}
            mouseY={springY}
            depth={3}
            top="40%"
            left="-15%"
            rotation={-5}
            svg={
              <div className="hidden lg:flex items-center justify-center bg-[#FF9736] h-[140px] w-[140px] p-4 rounded-full shadow-2xl border-4 border-white">
                <svg
                  fill="none"
                  height="100%"
                  viewBox="0 0 58 52"
                  width="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Orange character face</title>
                  {/* Recenter group */}
                  <g transform="translate(0, -5)">
                    <circle
                      cx="7.25021"
                      cy="28.394"
                      fill="#FF0000"
                      r="7.11667"
                    ></circle>
                    <circle
                      cx="50.1838"
                      cy="28.4507"
                      fill="#FF0000"
                      r="7.11667"
                    ></circle>

                    {/* Left Eye Mask & Group */}
                    <mask
                      height="29"
                      id="mask_left_eye"
                      maskUnits="userSpaceOnUse"
                      style={{ maskType: "alpha" }}
                      width="25"
                      x="4"
                      y="0"
                    >
                      <path
                        d="M16.0928 26.0009C18.9322 26.0009 21.4167 27.5564 22.304 28.3342C25.4151 26.2731 30.8674 19.5842 27.7874 9.31752C23.9374 -3.51581 8.5374 -2.11581 5.3874 9.31752C2.8674 18.4642 7.2151 25.576 9.704 27.9885C10.6505 27.326 13.2533 26.0009 16.0928 26.0009Z"
                        fill="#D9D9D9"
                      ></path>
                    </mask>
                    <g mask="url(#mask_left_eye)">
                      <ellipse
                        cx="16.0608"
                        cy="16.9282"
                        fill="white"
                        rx="9.20752"
                        ry="12.6275"
                      ></ellipse>
                      <mask
                        height="26"
                        id="mask_left_pupil"
                        maskUnits="userSpaceOnUse"
                        style={{ maskType: "alpha" }}
                        width="20"
                        x="6"
                        y="4"
                      >
                        <ellipse
                          cx="16.061"
                          cy="16.9282"
                          fill="white"
                          rx="9.20752"
                          ry="12.6275"
                        ></ellipse>
                      </mask>
                      <g mask="url(#mask_left_pupil)">
                        <ellipse
                          cx="16.5664"
                          cy="15.8506"
                          fill="#85402D"
                          rx="7.93333"
                          ry="8.75"
                        ></ellipse>
                      </g>
                    </g>

                    <mask
                      height="29"
                      id="mask0_char1"
                      maskUnits="userSpaceOnUse"
                      style={{ maskType: "alpha" }}
                      width="25"
                      x="29"
                      y="0"
                    >
                      <path
                        d="M41.9072 26.0009C39.0678 26.0009 36.5833 27.5564 35.696 28.3342C32.5849 26.2731 27.1326 19.5842 30.2126 9.31752C34.0626 -3.51581 49.4626 -2.11581 52.6126 9.31752C55.1326 18.4642 50.7849 25.576 48.296 27.9885C47.3495 27.326 44.7467 26.0009 41.9072 26.0009Z"
                        fill="#D9D9D9"
                      ></path>
                    </mask>
                    <g mask="url(#mask0_char1)">
                      <ellipse
                        cx="41.9392"
                        cy="16.9282"
                        fill="white"
                        rx="9.20752"
                        ry="12.6275"
                      ></ellipse>
                      <mask
                        height="26"
                        id="mask1_char1"
                        maskUnits="userSpaceOnUse"
                        style={{ maskType: "alpha" }}
                        width="20"
                        x="32"
                        y="4"
                      >
                        <ellipse
                          cx="41.939"
                          cy="16.9282"
                          fill="white"
                          rx="9.20752"
                          ry="12.6275"
                        ></ellipse>
                      </mask>
                      <g mask="url(#mask1_char1)">
                        <ellipse
                          cx="41.4336"
                          cy="15.8506"
                          fill="#85402D"
                          rx="7.93333"
                          ry="8.75"
                        ></ellipse>
                      </g>
                    </g>
                    <path
                      d="M48.2 28.3333C47.3126 27.5556 44.8281 26 41.9887 26C39.1492 26 36.5464 27.3251 35.6 27.9877"
                      stroke="#85402D"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                    <path
                      d="M9.8 28.3333C10.6874 27.5556 13.1719 26 16.0113 26C18.8508 26 21.4536 27.3251 22.4 27.9877"
                      stroke="#85402D"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                    <path
                      d="M26.0514 27.7579C27.8013 22.8464 32.1181 25.0633 30.3681 28.33"
                      stroke="#85402D"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                    <path
                      d="M36.4212 35.0804C41.9542 32.5314 45.9348 40.3891 39.5762 45.971C39.005 46.4724 38.4174 46.925 37.8172 47.3314C34.8469 49.3426 31.5706 50.2211 28.4839 50.2661C24.3681 50.326 20.5894 48.904 18.3227 46.7093C17.9421 46.3408 17.5924 45.9709 17.2723 45.6012C11.4042 38.825 15.449 32.0973 20.3924 34.3932C20.7618 34.5647 21.1251 34.7311 21.4839 34.8912C23.5688 35.8214 25.4981 36.5362 27.5505 36.7903C29.5304 37.0355 31.6248 36.8519 34.0839 36.0195C34.8273 35.7678 35.6041 35.4568 36.4212 35.0804Z"
                      fill="white"
                    ></path>
                    <path
                      d="M21.4839 34.8912C21.1251 34.7311 20.7618 34.5647 20.3924 34.3932C15.449 32.0973 11.4042 38.825 17.2723 45.6012M21.4839 34.8912C19.9595 36.789 16.983 41.5879 17.2723 45.6012M21.4839 34.8912C23.5688 35.8214 25.4981 36.5362 27.5505 36.7903M17.2723 45.6012C17.5924 45.9709 17.9421 46.3408 18.3227 46.7093C20.5894 48.904 24.3681 50.326 28.4839 50.2661M27.5505 36.7903C27.2005 39.8427 26.8972 46.8113 28.4839 50.2661M27.5505 36.7903C29.5304 37.0355 31.6248 36.8519 34.0839 36.0195M28.4839 50.2661C31.5706 50.2211 34.8469 49.3426 37.8172 47.3314M34.0839 36.0195C34.8273 35.7678 35.6041 35.4568 36.4212 35.0804C41.9542 32.5314 45.9348 40.3891 39.5762 45.971C39.005 46.4724 38.4174 46.925 37.8172 47.3314M34.0839 36.0195C35.3283 38.0335 37.8172 43.1156 37.8172 47.3314"
                      stroke="#85402D"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                  </g>
                </svg>
              </div>
            }
          />

          <div className="w-full md:w-1/2 space-y-6 md:space-y-10 order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <Sticker className="mb-4 md:mb-8" color="bg-[#FFC760]">
                {project.category}
              </Sticker>

              <h1 className="text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-serif font-black text-[#5A3927] leading-[0.9] md:leading-[0.85] tracking-tighter mb-4 md:mb-8 max-w-md">
                {project.title.split(" ").map((word, i) => (
                  <span key={word} className="inline-block mr-2 md:mr-4">
                    {word}
                    {i === 0 && (
                      <svg
                        className="absolute -z-10 top-0 -left-4 w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 text-[#FFC760]/20"
                        viewBox="0 0 100 100"
                      >
                        <title>Decorative background shape</title>
                        <path
                          d="M20,50 Q50,0 80,50 T20,50"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                  </span>
                ))}
              </h1>

              <div className="flex flex-wrap gap-2 md:gap-3">
                {project.tags.map((tag, i) => (
                  <Sticker
                    key={tag}
                    color={i % 2 === 0 ? "bg-white" : "bg-[#FFC760]/40"}
                    className="text-[10px] md:text-xs"
                  >
                    #{tag}
                  </Sticker>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="relative w-full md:w-1/2 aspect-square md:aspect-4/5 rounded-sm shadow-[12px_12px_0px_0px_rgba(90,57,39,0.1)] md:shadow-[24px_24px_0px_0px_rgba(90,57,39,0.1)] border-4 md:border-8 border-white z-10 order-1 md:order-2"
          >
            {project.thumbnailUrl && (
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            )}
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-[#5A3927]/20 to-transparent" />

            {/* New Character Doodle 2: Yellow Peeker (positioned relative to container without overflow-hidden) */}
            <Doodle
              mouseX={springX}
              mouseY={springY}
              depth={2.5}
              bottom="-8%"
              right="-8%"
              rotation={15}
              svg={
                <div className="hidden md:flex w-16 h-16 lg:w-20 lg:h-20 p-2 bg-white rounded-full shadow-lg border-2 border-[#85402D]">
                  <svg
                    fill="none"
                    height="100%"
                    viewBox="0 0 64 64"
                    width="100%"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Yellow character face</title>
                    <circle cx="32" cy="32" fill="#FFC760" r="32"></circle>
                    <ellipse
                      cx="27.6642"
                      cy="48.8012"
                      fill="#FF0000"
                      rx="4.04339"
                      ry="4.04339"
                    ></ellipse>
                    <circle
                      cx="51.3942"
                      cy="47.2104"
                      fill="#FF0000"
                      r="4.04339"
                    ></circle>
                    <ellipse
                      cx="47.3185"
                      cy="42.2867"
                      fill="#F7EFE4"
                      rx="5.23132"
                      ry="7.17439"
                    ></ellipse>
                    <mask
                      height="15"
                      id="mask0_char2"
                      maskUnits="userSpaceOnUse"
                      style={{ maskType: "alpha" }}
                      width="11"
                      x="42"
                      y="35"
                    >
                      <ellipse
                        cx="47.3185"
                        cy="42.2867"
                        fill="white"
                        rx="5.23132"
                        ry="7.17439"
                      ></ellipse>
                    </mask>
                    <g mask="url(#mask0_char2)">
                      <ellipse
                        cx="44.7606"
                        cy="39.7315"
                        fill="#85402D"
                        rx="5.23133"
                        ry="5.67972"
                      ></ellipse>
                    </g>
                    <path
                      d="M33.8662 53.0482C36.5462 54.5012 42.9759 54.435 45.3621 52.5127"
                      stroke="#85402D"
                      strokeLinecap="round"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M34.1048 50.9561C33.7624 52.7121 31.9064 54.0378 30.2493 53.7064"
                      stroke="#85402D"
                      strokeLinecap="round"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M44.9871 50.9561C45.2959 52.2481 46.6878 53.1761 48.6101 52.9109"
                      stroke="#85402D"
                      strokeLinecap="round"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M39.9931 55.4299C38.4686 55.7613 34.6903 55.2972 33.696 54.5019"
                      stroke="#85402D"
                      strokeLinecap="round"
                      strokeWidth="0.5"
                    ></path>
                    <path
                      d="M39.3967 46.8068C41.834 46.2647 42.3756 49.5181 39.9383 50.0603"
                      stroke="#85402D"
                      strokeLinecap="round"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M35.9757 41.0618C34.4276 41.3372 30.9326 42.7644 29.338 46.2698C29.5937 42.8575 33.867 40.7313 35.6116 40.3547C32.5761 39.383 29.4741 42.77 28.6096 44.8555"
                      stroke="#85402D"
                      strokeLinecap="round"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </div>
              }
            />
          </motion.div>
        </section>

        {/* --- Details Content --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-20 items-start">
          {/* Left: Paper Note Aside */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 1 }}
              viewport={{ once: true }}
              className="relative bg-[#FDFBF7] p-6 md:p-10 lg:p-12 shadow-[8px_8px_0px_0px_rgba(90,57,39,0.05)] md:shadow-[15px_15px_0px_0px_rgba(90,57,39,0.05)] border border-gray-100 group"
            >
              {/* Tape visual effect */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 md:w-32 h-6 md:h-8 bg-white/40 backdrop-blur-md border border-white/50 rotate-1 shadow-sm" />

              <div className="space-y-6 md:space-y-8 lg:space-y-12 relative z-10">
                <div>
                  <h3 className="font-serif italic font-black text-lg md:text-xl text-[#FA9939] mb-3 md:mb-4">
                    The Brief
                  </h3>
                  <p className="text-base md:text-lg lg:text-xl text-[#5A3927]/80 font-medium leading-relaxed italic">
                    {project.description}
                  </p>
                </div>

                {hasDate && (
                  <div>
                    <h3 className="font-serif italic font-black text-lg md:text-xl text-[#FA9939] mb-3 md:mb-4">
                      Timeline
                    </h3>
                    <div className="flex items-center gap-3 md:gap-4 text-[#5A3927]/70 font-bold text-base md:text-lg">
                      <Calendar
                        size={18}
                        className="text-[#FA9939] md:size-5"
                      />
                      <span>{dateRange}</span>
                    </div>
                  </div>
                )}

                {project.featured && (
                  <div className="pt-2 md:pt-4">
                    <Sticker
                      color="bg-[#D8704D]"
                      className="text-white transform rotate-3 text-xs md:text-sm"
                    >
                      Featured Work
                    </Sticker>
                  </div>
                )}
              </div>

              {/* Decorative scribble */}
              <svg
                className="absolute bottom-4 right-4 w-12 h-12 md:w-16 md:h-16 text-[#FA9939]/20"
                viewBox="0 0 100 100"
              >
                <title>Decorative scribble</title>
                <path
                  d="M10,90 Q50,10 90,90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>
            </motion.div>
          </aside>

          {/* Right: Main Content (The Physical Canvas) */}
          <main className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative bg-white/30 backdrop-blur-xs rounded-sm p-6 md:p-12 lg:p-20 shadow-[10px_10px_0px_0px_rgba(255,199,96,0.1)] md:shadow-[20px_20px_0px_0px_rgba(255,199,96,0.1)] border border-white/20 min-h-[400px] md:min-h-[600px]"
            >
              <div className="absolute inset-0 bg-graph-paper opacity-[0.02] pointer-events-none" />

              {project.content ? (
                <div className="max-w-none relative z-10">
                  {parseArticleContent(project.content).content}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] md:min-h-[400px] text-center opacity-20">
                  <Layers
                    size={48}
                    className="mb-4 text-[#5A3927] md:size-20 md:mb-6"
                  />
                  <p className="font-serif italic font-black text-[#5A3927] text-xl md:text-3xl">
                    Drafting the story...
                  </p>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>

      {/* --- Project Image Gallery: Polaroid Collection --- */}
      {imageUrls.length > 0 && (
        <section className="relative z-10 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 md:mb-12 lg:mb-16 text-center"
          >
            <Sticker className="mb-3 md:mb-4" color="bg-[#FA9939]/10">
              Visual Showcase
            </Sticker>
            <h2 className="text-2xl md:text-4xl lg:text-6xl font-serif font-black text-[#5A3927]">
              Project Gallery
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
            {imageUrls.map((url, index) => (
              <Polaroid
                key={url}
                src={url}
                alt={`${project.title} screenshot ${index + 1}`}
                caption={`${project.title} — Vol. 0${index + 1}`}
                rotation={index % 2 === 0 ? 2 : -2}
                onClick={() => openLightbox(index)}
                className={index % 3 === 1 ? "lg:-translate-y-8" : ""}
              />
            ))}
          </div>
        </section>
      )}

      {/* --- Lightbox Modal --- */}
      <AnimatePresence>
        {lightboxIndex !== null && imageUrls[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-xl"
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <X size={20} className="md:size-6" />
            </button>

            <div className="absolute top-4 left-4 md:top-6 md:left-6 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-md text-white/70 font-bold text-xs md:text-sm z-10">
              {lightboxIndex + 1} / {imageUrls.length}
            </div>

            {imageUrls.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-2 md:left-4 lg:left-8 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              >
                <ChevronLeft size={24} className="md:size-7" />
              </button>
            )}

            {imageUrls.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-2 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              >
                <ChevronRight size={24} className="md:size-7" />
              </button>
            )}

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-w-[95vw] md:max-w-[90vw] max-h-[80vh] md:max-h-[85vh] w-auto h-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={imageUrls[lightboxIndex]}
                alt={`${project.title} screenshot ${lightboxIndex + 1}`}
                width={1400}
                height={900}
                className="rounded-xl md:rounded-2xl object-contain max-h-[80vh] md:max-h-[85vh] w-auto shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {nextProject && (
        <section className="relative w-full py-16 md:py-24 lg:py-32 px-4 md:px-12 lg:px-20 overflow-hidden group">
          <Link
            href={`/projects/${nextProject.slug}`}
            className="block max-w-7xl mx-auto"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 p-6 md:p-12 lg:p-16 rounded-2xl md:rounded-[3rem] bg-white/40 backdrop-blur-xl border border-white hover:bg-white/60 transition-all duration-500 shadow-[10px_10px_30px_rgba(90,57,39,0.05)] md:shadow-[20px_20px_60px_rgba(90,57,39,0.05)] hover:shadow-[15px_15px_40px_rgba(90,57,39,0.1)] md:hover:shadow-[30px_30px_80px_rgba(90,57,39,0.1)]">
              <div className="space-y-3 md:space-y-4 text-center md:text-left">
                <span className="text-[#5A3927]/40 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm">
                  Next Project
                </span>
                <h2 className="text-2xl md:text-4xl lg:text-6xl font-serif font-extrabold text-[#5A3927] transition-transform duration-500 group-hover:translate-x-2">
                  {nextProject.title}
                </h2>
                <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 text-[#FA9939] font-bold text-sm md:text-base">
                  View Full Case Study{" "}
                  <div className="p-1.5 md:p-2 bg-[#FA9939]/10 rounded-full group-hover:bg-[#FA9939] group-hover:text-white transition-all">
                    <ArrowLeft className="rotate-180" size={16} />
                  </div>
                </div>
              </div>

              <div className="relative w-full md:w-1/3 aspect-video rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl -skew-y-2 group-hover:skew-y-0 transition-transform duration-700">
                {nextProject.thumbnailUrl ? (
                  <Image
                    src={nextProject.thumbnailUrl}
                    alt={nextProject.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full ${nextProject.color} opacity-20`}
                  />
                )}
              </div>
            </div>
          </Link>
        </section>
      )}
    </motion.div>
  );
};
