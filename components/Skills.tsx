'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Code2, Palette, Layout, Server, Database, Globe, Zap, Shield } from 'lucide-react';

const skills = [
  { name: 'Frontend Development', icon: Layout, color: 'text-emerald-400' },
  { name: 'Backend Systems', icon: Server, color: 'text-indigo-400' },
  { name: 'UI/UX Design', icon: Palette, color: 'text-rose-400' },
  { name: 'Database Management', icon: Database, color: 'text-amber-400' },
  { name: 'Cloud Architecture', icon: Globe, color: 'text-cyan-400' },
  { name: 'Performance Optimization', icon: Zap, color: 'text-yellow-400' },
  { name: 'Cyber Security', icon: Shield, color: 'text-emerald-400' },
  { name: 'Clean Code Architecture', icon: Code2, color: 'text-indigo-400' },
];

export default function Skills() {
  return (
    <section id="skills" className="py-32 bg-neutral-900/30 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-emerald-500 font-display font-medium tracking-widest uppercase text-sm mb-4 block"
          >
            My Expertise
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold tracking-tight"
          >
            A Multi-Disciplinary <br /> <span className="text-neutral-500">Approach</span> to Development.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-8 bg-neutral-900 border border-white/5 rounded-3xl hover:border-emerald-500/30 transition-all group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-emerald-500/10 transition-colors ${skill.color}`}>
                <skill.icon size={24} />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">
                {skill.name}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Building scalable, maintainable, and high-performance solutions with modern technologies.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
