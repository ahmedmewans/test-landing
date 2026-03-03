'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: 'Aura Dashboard',
    category: 'SaaS Platform',
    image: 'https://picsum.photos/seed/dashboard/800/600',
    tags: ['Next.js', 'Tailwind', 'Framer Motion'],
    link: '#',
    github: '#',
  },
  {
    title: 'Lumina E-Commerce',
    category: 'Online Store',
    image: 'https://picsum.photos/seed/store/800/600',
    tags: ['React', 'Stripe', 'Supabase'],
    link: '#',
    github: '#',
  },
  {
    title: 'Echo Social App',
    category: 'Social Network',
    image: 'https://picsum.photos/seed/social/800/600',
    tags: ['TypeScript', 'Node.js', 'Socket.io'],
    link: '#',
    github: '#',
  },
  {
    title: 'Prism Creative Agency',
    category: 'Portfolio Site',
    image: 'https://picsum.photos/seed/agency/800/600',
    tags: ['Gatsby', 'GraphQL', 'Contentful'],
    link: '#',
    github: '#',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-32 bg-neutral-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-emerald-500 font-display font-medium tracking-widest uppercase text-sm mb-4 block"
          >
            Selected Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold tracking-tight"
          >
            Building the <span className="text-neutral-500">Future</span> of the Web.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-neutral-900/50 rounded-3xl border border-white/5 overflow-hidden hover:border-emerald-500/30 transition-all duration-500"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                  <a
                    href={project.link}
                    className="p-4 bg-emerald-500 text-neutral-950 rounded-full hover:scale-110 transition-transform"
                  >
                    <ExternalLink size={20} />
                  </a>
                  <a
                    href={project.github}
                    className="p-4 bg-white/10 text-white rounded-full hover:scale-110 transition-transform backdrop-blur-md"
                  >
                    <Github size={20} />
                  </a>
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-medium text-emerald-400 uppercase tracking-widest mb-1 block">
                      {project.category}
                    </span>
                    <h3 className="text-2xl font-display font-bold text-white">
                      {project.title}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-medium text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-emerald-400 transition-colors font-medium"
          >
            View all projects on GitHub <Github size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
