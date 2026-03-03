'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-20 bg-neutral-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-20">
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-display font-bold tracking-tighter mb-4"
            >
              AURA<span className="text-emerald-500">.</span>
            </motion.div>
            <p className="text-neutral-500 max-w-sm">
              Building the future of the web with precision, passion, and a touch of magic.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex items-center gap-4">
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-neutral-400 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all">
                <Github size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-neutral-400 hover:bg-indigo-500/10 hover:text-indigo-400 transition-all">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-neutral-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-neutral-400 hover:bg-amber-500/10 hover:text-amber-400 transition-all">
                <Instagram size={20} />
              </a>
            </div>
            <p className="text-sm text-neutral-600">
              © {currentYear} Aura Creative. All rights reserved.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-xs font-medium text-neutral-700 uppercase tracking-widest">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookies</a>
          <a href="#" className="hover:text-white transition-colors">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
