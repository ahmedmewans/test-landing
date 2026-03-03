import type { Experience } from "@/types/portfolio";

export const experienceData: Experience[] = [
  {
    id: 1,
    company: "Creative Studio",
    role: "Lead UI/UX Designer",
    period: "2022 - Present",
    location: "Stockholm, Sweden",
    description:
      "Leading the design for award-winning digital products and websites.",
    highlights: [
      "Designed a complete design system for a fintech startup",
      "Mentored junior designers and improved team workflow",
      "Collaborated with developers to ensure pixel-perfect implementation",
    ],
    tags: ["UI/UX", "Mentorship", "Figma"],
    color: "bg-[#FFD05B]",
  },
  {
    id: 2,
    company: "Tech Solutions",
    role: "Frontend Developer",
    period: "2020 - 2022",
    location: "Remote",
    description: "Developed complex web applications using React and Next.js.",
    highlights: [
      "Optimized application performance by 40%",
      "Integrated complex third-party APIs",
      "Implemented inclusive and accessible components",
    ],
    tags: ["React", "Performance", "A11y"],
    color: "bg-[#93E190]",
  },
  {
    id: 3,
    company: "Digital Agency",
    role: "Visual Designer",
    period: "2018 - 2020",
    location: "Berlin, Germany",
    description:
      "Crafted brand identities and marketing materials for international clients.",
    highlights: [
      "Created visual assets for global marketing campaigns",
      "Developed unique brand guidelines for multiple startups",
      "Worked closely with copywriters to create engaging stories",
    ],
    tags: ["Branding", "Visual Design", "Motion"],
    color: "bg-[#FA9939]",
  },
];
