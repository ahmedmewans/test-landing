"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { navItems } from "./constants";
import SunWaveLogo from "./SunWaveLogo";

export const PortfolioHeader: React.FC = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-100! pointer-events-none"
    >
      <div className="pointer-events-auto">
        <Link href="/">
          <motion.div whileHover={{ scale: 1.02 }}>
            <SunWaveLogo className="h-8 md:h-10 w-auto" />
          </motion.div>
        </Link>
      </div>

      {/* Navigation Section */}
      <div className="flex items-center gap-6 pointer-events-auto">
        {/* Availability Indicator (Desktop Only) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="hidden lg:flex items-center gap-2 px-4 py-2 glass rounded-full"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] uppercase tracking-widest text-portfolio-dark/70 font-sans">
            Available for hire
          </span>
        </motion.div>

        {/* Navigation Pill */}
        <nav className="hidden md:flex items-center px-6 py-3 glass rounded-full">
          <div className="flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center"
              >
                <Link
                  href={item.href}
                  className="text-portfolio-dark hover:text-portfolio-orange transition-colors text-sm tracking-tight font-sans"
                >
                  <motion.span
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                    className="inline-block"
                  >
                    {item.name}
                  </motion.span>
                </Link>
                {index < navItems.length - 1 && (
                  <div
                    className="ml-8 w-px h-3 bg-portfolio-dark/10"
                    aria-hidden="true"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </nav>
      </div>
    </motion.header>
  );
};
