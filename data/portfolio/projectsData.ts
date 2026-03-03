import type { Project } from "@/types/portfolio";

export const projectsData: Project[] = [
  {
    id: 1,
    title: "Bloom Analytics",
    category: "SaaS Dashboard",
    color: "bg-[#FFD05B]",
    tags: ["React", "Next.js", "Tailwind", "Recharts"],
    description:
      "A data visualization platform for plant nurseries featuring real-time charts and inventory tracking.",
    mockupType: "dashboard",
    longDescription:
      "Bloom Analytics transforms complex agricultural data into actionable insights. Designed for modern nurseries, it tracks soil moisture levels, inventory turnover, and sales forecasts in real-time.",
    challenge:
      "The primary challenge was rendering thousands of data points without compromising UI performance. The client needed a dashboard that felt instantaneous despite heavy background calculations.",
    solution:
      "I implemented virtualized lists and Web Workers to handle data processing off the main thread. We used Recharts with optimized memoization to ensure smooth interactions even during live data updates.",
    features: [
      "Real-time WebSocket Data Feeds",
      "Custom Interactive Charts",
      "Inventory Management System",
      "Exportable PDF Reports",
    ],
  },
  {
    id: 2,
    title: "Orbit UI",
    category: "Component Library",
    color: "bg-[#93E190]",
    tags: ["TypeScript", "Storybook", "Framer Motion", "NPM"],
    description:
      "An open-source design system focusing on accessible, high-performance interactive primitives.",
    mockupType: "components",
    longDescription:
      "Orbit UI is a collection of unstyled, accessible UI primitives designed for flexibility. It provides the behavioral foundation for complex UIs while allowing complete visual freedom.",
    challenge:
      "Balancing flexibility with ease of use is difficult. We needed components that worked out of the box but could be brutally customized without fighting specificity wars.",
    solution:
      "We adopted a headless UI approach, providing logic hooks and functional components that accept arbitrary classes. Accessibility (a11y) was treated as a first-class citizen, with automated testing via axe-core.",
    features: [
      "WAI-ARIA Compliant",
      "Headless Architecture",
      "Dark Mode Support",
      "Comprehensive Storybook Docs",
    ],
  },
  {
    id: 3,
    title: "Canvas",
    category: "Creative Portfolio",
    color: "bg-[#FA9939]",
    tags: ["Three.js", "React Three Fiber", "GSAP", "WebGL"],
    description:
      "An immersive 3D digital gallery experience allowing users to navigate through virtual art spaces.",
    mockupType: "gallery",
    longDescription:
      "Canvas is an experimental portfolio template for digital artists. It treats the browser window as a 3D exhibition space where visitors walk through galleries using FPS-style controls.",
    challenge:
      "Bringing a 3D game-like experience to the web often results in large bundle sizes and long load times, which drives users away.",
    solution:
      "I utilized Draco compression for 3D models and aggressive texture optimization. A custom level-of-detail (LOD) system ensures that high-res assets only load when the user approaches them.",
    features: [
      "3D Navigation Controls",
      "Dynamic Lighting Engine",
      "Spatial Audio",
      "Optimized GLTF Loading",
    ],
  },
  {
    id: 4,
    title: "Revive Health",
    category: "Mobile App",
    color: "bg-[#FFC760]",
    tags: ["React Native", "Redux Toolkit", "Node.js", "Expo"],
    description:
      "Cross-platform mobile application for meditation tracking with custom gestural interactions.",
    mockupType: "mobile",
    longDescription:
      "Revive helps users build sustainable mindfulness habits. Unlike typical trackers, it uses gesture-based input to record moods and sessions, making the interaction feel more organic and less like filling a form.",
    challenge:
      "Creating a custom gesture system in React Native that felt as smooth as native animations (60fps) on older Android devices.",
    solution:
      "I used React Native Reanimated 2 to run animations on the UI thread, completely bypassing the JS bridge for gestures. This resulted in silky smooth interactions regardless of device CPU load.",
    features: [
      "Custom Gesture Handler",
      "Offline-First Architecture",
      "Haptic Feedback Integration",
      "Daily Streak Gamification",
    ],
  },
  {
    id: 5,
    title: "Echo Social",
    category: "Social Platform",
    color: "bg-[#93E190]",
    tags: ["Vue.js", "Firebase", "WebRTC", "Pinia"],
    description:
      "Real-time collaborative workspace allowing remote teams to share audio snippets and designs.",
    mockupType: "chat",
    longDescription:
      "Echo bridges the gap between async text chat and live calls. It allows teams to leave voice annotations directly on design artifacts, creating a richer context for feedback.",
    challenge:
      'Synchronizing audio playback state across multiple clients with low latency was critical for the "listen together" feature.',
    solution:
      "We leveraged Firebase Realtime Database for signaling and WebRTC for the data streams. A custom clock synchronization algorithm ensures all clients play audio within 20ms of each other.",
    features: [
      "Voice Annotations",
      "Live Audio Rooms",
      "Drag-and-Drop File Sharing",
      "Role-Based Access Control",
    ],
  },
  {
    id: 6,
    title: "Shift Finance",
    category: "Fintech Web App",
    color: "bg-[#FA9939]",
    tags: ["Angular", "RxJS", "D3.js", "NestJS"],
    description:
      "Complex financial modeling tool simplifying personal asset management with predictive AI.",
    mockupType: "dashboard",
    longDescription:
      "Shift gives users power-user tools for personal finance. It aggregates accounts and uses predictive models to suggest budget adjustments based on spending habits.",
    challenge:
      "Handling complex state dependencies where a change in one variable (e.g., inflation rate) needed to cascade through dozens of charts and tables instantly.",
    solution:
      "We used RxJS for reactive state management. The entire application state is a stream, allowing us to compose complex data transformations declaratively and efficiently.",
    features: [
      "Predictive Budgeting",
      "Multi-Currency Support",
      "Interactive D3 Visualizations",
      "Bank Level Security",
    ],
  },
];
