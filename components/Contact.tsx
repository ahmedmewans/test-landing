'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Mail, MessageSquare, Phone, Send } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-32 bg-neutral-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-emerald-500 font-display font-medium tracking-widest uppercase text-sm mb-4 block"
            >
              Get in Touch
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-8"
            >
              Let&apos;s Create <br /> Something <span className="text-neutral-500">Exceptional</span> Together.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-neutral-400 max-w-md mb-12"
            >
              Have a project in mind or just want to chat? I&apos;m always open to new opportunities and collaborations.
            </motion.p>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 p-6 bg-neutral-900 border border-white/5 rounded-3xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Mail size={20} />
                </div>
                <div>
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-widest block mb-1">
                    Email
                  </span>
                  <a href="mailto:hello@aura.dev" className="text-lg font-display font-bold text-white hover:text-emerald-400 transition-colors">
                    hello@aura.dev
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 p-6 bg-neutral-900 border border-white/5 rounded-3xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Phone size={20} />
                </div>
                <div>
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-widest block mb-1">
                    Phone
                  </span>
                  <a href="tel:+1234567890" className="text-lg font-display font-bold text-white hover:text-indigo-400 transition-colors">
                    +1 (234) 567-890
                  </a>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="p-10 bg-neutral-900 border border-white/5 rounded-[40px] relative"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-widest ml-4">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-6 py-4 bg-neutral-950 border border-white/5 rounded-2xl focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all text-white placeholder:text-neutral-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-widest ml-4">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-6 py-4 bg-neutral-950 border border-white/5 rounded-2xl focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all text-white placeholder:text-neutral-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-widest ml-4">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="New Project Inquiry"
                  className="w-full px-6 py-4 bg-neutral-950 border border-white/5 rounded-2xl focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all text-white placeholder:text-neutral-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-widest ml-4">
                  Message
                </label>
                <textarea
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="w-full px-6 py-4 bg-neutral-950 border border-white/5 rounded-2xl focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all text-white placeholder:text-neutral-700 resize-none"
                />
              </div>

              <button
                type="submit"
                className="group w-full py-5 bg-emerald-500 text-neutral-950 font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
