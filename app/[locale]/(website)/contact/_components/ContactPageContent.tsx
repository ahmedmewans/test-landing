"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, FileText, Github, Linkedin, Mail } from "lucide-react";
import { useMousePosition } from "@/app/[locale]/(website)/_components/context/MousePositionContext";
import { DecorativeCircle } from "@/components/portfolio/shared/DecorativeCircle";
import { GITHUB_LINK, LINKEDIN_LINK } from "@/constants";
import { ContactForm } from "../../about/_components/ContactForm";

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

export const ContactPageContent: React.FC = () => {
  const { springX, springY, xRaw, yRaw } = useMousePosition();

  return (
    <div className="absolute inset-0 w-full h-full overflow-y-auto bg-[#F7EFE4] px-4 py-24 md:px-8 md:py-32 lg:px-12 lg:py-36 z-40 selection:bg-[#FA9939]/30">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="text-center mb-10 md:mb-12 lg:mb-16"
        >
          <span className="font-sans font-black text-[#FA9939] tracking-[0.15em] md:tracking-[0.2em] uppercase text-xs md:text-sm block mb-3 md:mb-4">
            Get in touch
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif font-black text-[#5A3927] leading-tight mb-4 md:mb-6">
            Let's build something <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FA9939] to-[#FFD05B]">
              legendary
            </span>
            .
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-[#693B2A] max-w-2xl mx-auto font-medium opacity-90 px-4 md:px-0">
            Have a project in mind or just want to say hi? I'm always open to
            discussing new opportunities and creative collaborations.
          </p>
        </motion.div>

        {/* Contact Form Wrapper */}
        <div className="mb-10 md:mb-16 lg:mb-20">
          <ContactForm itemVariants={itemVariants} />
        </div>

        {/* Connect Section */}
        <motion.div
          variants={itemVariants}
          whileInView="visible"
          viewport={{ once: true }}
          className="md:col-span-12 bg-portfolio-dark p-6 md:p-10 lg:p-12 rounded-2xl md:rounded-[2rem] lg:rounded-[3rem] text-portfolio-cream flex flex-col md:flex-row items-center gap-6 md:gap-10 overflow-hidden relative shadow-xl md:shadow-2xl"
        >
          <div className="flex-1 space-y-3 md:space-y-4 lg:space-y-6 relative z-10 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black leading-[1.1]">
              Interested in <br />
              <span className="text-portfolio-orange">working</span> together?
            </h3>
            <p className="text-sm md:text-base lg:text-lg font-medium opacity-80 max-w-xl mx-auto md:mx-0">
              I'm currently available for new projects. Let's talk about yours!
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 pt-2">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/resume.pdf"
                download="Ahmed_Fahmy-FrontEnd_Engineer-Resume.pdf"
                className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-portfolio-orange rounded-full font-black text-white shadow-[0_10px_20px_-5px_rgba(250,153,57,0.4)] md:shadow-[0_20px_40px_-10px_rgba(250,153,57,0.4)] text-sm md:text-base transition-transform"
              >
                <FileText size={18} className="md:size-5" /> Download Resume
              </motion.a>

              <div className="flex gap-2 md:gap-3">
                {[
                  { icon: Linkedin, link: LINKEDIN_LINK, id: "linkedin" },
                  { icon: Github, link: GITHUB_LINK, id: "github" },
                  {
                    icon: Mail,
                    link: "mailto:ahmedmewans2040@gmail.com",
                    id: "email",
                  },
                ].map((soc) => (
                  <motion.a
                    key={soc.id}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(255,255,255,0.2)",
                    }}
                    href={soc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/20 transition-all font-sans"
                  >
                    <soc.icon size={18} className="md:size-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          <div className="relative shrink-0 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 opacity-40 md:opacity-100 hidden md:block">
            <div className="absolute inset-0 bg-portfolio-orange rounded-full blur-[80px] opacity-30 animate-pulse" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-full h-full border-[1.5px] border-dashed border-portfolio-orange/40 rounded-full flex items-center justify-center"
            >
              <ArrowUpRight
                size={48}
                className="text-portfolio-orange md:size-16"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#FA9939]/5 blur-[120px]" />

        <DecorativeCircle
          color="bg-[#FFD05B]"
          size="w-64 h-64 md:w-80 lg:w-[500px] lg:h-[500px]"
          bottom="-10%"
          right="-5%"
          depth={0.05}
          mouseX={springX}
          mouseY={springY}
          mouseXRaw={xRaw}
          mouseYRaw={yRaw}
        />
        <DecorativeCircle
          color="bg-[#FA9939]"
          size="w-40 h-40 md:w-52 lg:w-64 lg:h-64"
          top="10%"
          left="-5%"
          depth={0.12}
          mouseX={springX}
          mouseY={springY}
          mouseXRaw={xRaw}
          mouseYRaw={yRaw}
        />
      </div>
    </div>
  );
};
