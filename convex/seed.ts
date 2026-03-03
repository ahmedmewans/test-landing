import { mutation } from "./_generated/server";
import { createAuth } from "./auth";

// ============================================================================
// SEED ADMIN USER
// ============================================================================

export const seedAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const auth = createAuth(ctx);

    try {
      const result = await auth.api.signUpEmail({
        body: {
          email: "admin@admin.com",
          password: "A0168764085a$",
          name: "admin",
        },
      });

      return { success: true, user: result };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
});

// ============================================================================
// SEED ALL DATA
// ============================================================================

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const results: Record<string, unknown> = {};

    // Seed admin user
    try {
      const auth = createAuth(ctx);
      await auth.api.signUpEmail({
        body: {
          email: "admin@admin.com",
          password: "A0168764085a$",
          name: "admin",
        },
      });
      results.admin = { success: true };
    } catch (error) {
      results.admin = { success: false, error: String(error) };
    }

    // Seed projects
    const existingProjects = await ctx.db.query("projects").first();
    if (!existingProjects) {
      const projects = [
        {
          title: "Bloom Analytics",
          slug: "bloom-analytics",
          category: "SaaS Dashboard",
          status: "published" as const,
          description:
            "A data visualization platform for plant nurseries featuring real-time charts and inventory tracking.",
          content: `
            <h2>Overview</h2>
            <p>Bloom Analytics transforms complex agricultural data into actionable insights. Designed for modern nurseries, it tracks soil moisture levels, inventory turnover, and sales forecasts in real-time.</p>
            <h2>Challenge</h2>
            <p>The primary challenge was rendering thousands of data points without compromising UI performance. The client needed a dashboard that felt instantaneous despite heavy background calculations.</p>
            <h2>Solution</h2>
            <p>I implemented virtualized lists and Web Workers to handle data processing off the main thread. We used Recharts with optimized memoization to ensure smooth interactions even during live data updates.</p>
            <h2>Key Features</h2>
            <ul>
              <li>Real-time WebSocket Data Feeds</li>
              <li>Custom Interactive Charts</li>
              <li>Inventory Management System</li>
              <li>Exportable PDF Reports</li>
            </ul>
          `,
          tags: ["React", "Next.js", "Tailwind", "Recharts", "TypeScript"],
          color: "#FFD05B",
          featured: true,
          sortOrder: 0,
        },
        {
          title: "Orbit UI",
          slug: "orbit-ui",
          category: "Component Library",
          status: "published" as const,
          description:
            "An open-source design system focusing on accessible, high-performance interactive primitives.",
          content: `
            <h2>Overview</h2>
            <p>Orbit UI is a collection of unstyled, accessible UI primitives designed for flexibility. It provides the behavioral foundation for complex UIs while allowing complete visual freedom.</p>
            <h2>Features</h2>
            <ul>
              <li>WAI-ARIA Compliant</li>
              <li>Headless Architecture</li>
              <li>Dark Mode Support</li>
              <li>Comprehensive Storybook Docs</li>
            </ul>
          `,
          tags: [
            "TypeScript",
            "Storybook",
            "Framer Motion",
            "NPM",
            "Accessibility",
          ],
          color: "#93E190",
          featured: true,
          sortOrder: 1,
        },
        {
          title: "Canvas",
          slug: "canvas",
          category: "Creative Portfolio",
          status: "published" as const,
          description:
            "An immersive 3D digital gallery experience allowing users to navigate through virtual art spaces.",
          content: `
            <h2>Overview</h2>
            <p>Canvas is an experimental portfolio template for digital artists. It treats the browser window as a 3D exhibition space where visitors walk through galleries using FPS-style controls.</p>
            <h2>Technical Highlights</h2>
            <p>I utilized Draco compression for 3D models and aggressive texture optimization. A custom level-of-detail (LOD) system ensures that high-res assets only load when the user approaches them.</p>
            <h2>Key Features</h2>
            <ul>
              <li>3D Navigation Controls</li>
              <li>Dynamic Lighting Engine</li>
              <li>Spatial Audio</li>
              <li>Optimized GLTF Loading</li>
            </ul>
          `,
          tags: ["Three.js", "React Three Fiber", "GSAP", "WebGL", "3D"],
          color: "#FA9939",
          featured: true,
          sortOrder: 2,
        },
        {
          title: "Revive Health",
          slug: "revive-health",
          category: "Mobile App",
          status: "published" as const,
          description:
            "Cross-platform mobile application for meditation tracking with custom gestural interactions.",
          content: `
            <h2>Overview</h2>
            <p>Revive helps users build sustainable mindfulness habits. Unlike typical trackers, it uses gesture-based input to record moods and sessions, making the interaction feel more organic.</p>
            <h2>Key Features</h2>
            <ul>
              <li>Gesture-based Mood Tracking</li>
              <li>Guided Meditation Library</li>
              <li>Progress Analytics</li>
              <li>Social Challenges</li>
            </ul>
          `,
          tags: ["React Native", "Redux Toolkit", "Node.js", "Expo", "Mobile"],
          color: "#FFC760",
          featured: false,
          sortOrder: 3,
        },
        {
          title: "FinanceFlow",
          slug: "financeflow",
          category: "Fintech",
          status: "published" as const,
          description:
            "Personal finance management app with AI-powered insights and automated budgeting.",
          content: `
            <h2>Overview</h2>
            <p>FinanceFlow combines intuitive design with machine learning to help users understand their spending patterns and make better financial decisions.</p>
            <h2>Key Features</h2>
            <ul>
              <li>AI-powered Spending Insights</li>
              <li>Automated Budget Categories</li>
              <li>Bill Reminders</li>
              <li>Investment Tracking</li>
            </ul>
          `,
          tags: ["React", "Python", "TensorFlow", "PostgreSQL", "AI"],
          color: "#3B82F6",
          featured: true,
          sortOrder: 4,
        },
        {
          title: "EcoTrack",
          slug: "ecotrack",
          category: "Sustainability",
          status: "draft" as const,
          description:
            "Carbon footprint tracking application for environmentally conscious individuals and businesses.",
          content: `
            <h2>Overview</h2>
            <p>EcoTrack helps users monitor and reduce their environmental impact through gamified challenges and community features.</p>
          `,
          tags: ["Vue.js", "Node.js", "MongoDB", "AWS"],
          color: "#10B981",
          featured: false,
          sortOrder: 5,
        },
      ];

      for (const project of projects) {
        await ctx.db.insert("projects", project);
      }
      results.projects = { success: true, count: projects.length };
    } else {
      results.projects = { success: false, message: "Already seeded" };
    }

    // Seed experience
    const existingExperience = await ctx.db.query("experience").first();
    if (!existingExperience) {
      const experiences = [
        {
          company: "Creative Studio",
          role: "Lead UI/UX Designer",
          description:
            "Leading the design for award-winning digital products and websites for global clients.",
          highlights: [
            "Designed a complete design system for a fintech startup",
            "Mentored junior designers and improved team workflow",
            "Collaborated with developers to ensure pixel-perfect implementation",
            "Led redesign of 3 major enterprise applications",
          ],
          tags: ["UI/UX", "Mentorship", "Figma", "Design Systems"],
          color: "#FFD05B",
          startDate: Date.parse("2022-01-01"),
          location: "Stockholm, Sweden",
          sortOrder: 0,
        },
        {
          company: "Tech Solutions",
          role: "Senior Frontend Developer",
          description:
            "Developed complex web applications using React and Next.js for enterprise clients.",
          highlights: [
            "Optimized application performance by 40%",
            "Integrated complex third-party APIs",
            "Implemented inclusive and accessible components",
            "Led frontend architecture decisions",
          ],
          tags: ["React", "Performance", "A11y", "Architecture"],
          color: "#93E190",
          startDate: Date.parse("2020-03-01"),
          endDate: Date.parse("2021-12-31"),
          location: "Remote",
          sortOrder: 1,
        },
        {
          company: "Digital Agency",
          role: "Frontend Developer",
          description:
            "Crafted brand identities and marketing materials for international clients.",
          highlights: [
            "Created visual assets for global marketing campaigns",
            "Developed unique brand guidelines for multiple startups",
            "Worked closely with copywriters to create engaging stories",
            "Built 10+ responsive websites",
          ],
          tags: ["Branding", "Visual Design", "Motion", "JavaScript"],
          color: "#FA9939",
          startDate: Date.parse("2018-06-01"),
          endDate: Date.parse("2020-02-28"),
          location: "Berlin, Germany",
          sortOrder: 2,
        },
        {
          company: "Startup Hub",
          role: "Junior Developer",
          description:
            "First role in tech, building MVPs for early-stage startups.",
          highlights: [
            "Built 5+ MVPs from scratch",
            "Learned React and Node.js",
            "Participated in 2 accelerator programs",
            "Contributed to open-source projects",
          ],
          tags: ["JavaScript", "React", "Node.js", "Learning"],
          color: "#3B82F6",
          startDate: Date.parse("2016-09-01"),
          endDate: Date.parse("2018-05-31"),
          location: "London, UK",
          sortOrder: 3,
        },
      ];

      for (const exp of experiences) {
        await ctx.db.insert("experience", exp);
      }
      results.experience = { success: true, count: experiences.length };
    } else {
      results.experience = { success: false, message: "Already seeded" };
    }

    // Seed skills
    const existingSkills = await ctx.db.query("skills").first();
    if (!existingSkills) {
      const skills = [
        {
          name: "React",
          category: "Frontend",
          level: "expert" as const,
          sortOrder: 0,
          yearsOfExperience: 7,
        },
        {
          name: "Next.js",
          category: "Frontend",
          level: "expert" as const,
          sortOrder: 1,
          yearsOfExperience: 5,
        },
        {
          name: "TypeScript",
          category: "Frontend",
          level: "advanced" as const,
          sortOrder: 2,
          yearsOfExperience: 5,
        },
        {
          name: "Tailwind CSS",
          category: "Frontend",
          level: "expert" as const,
          sortOrder: 3,
          yearsOfExperience: 4,
        },
        {
          name: "Vue.js",
          category: "Frontend",
          level: "intermediate" as const,
          sortOrder: 4,
          yearsOfExperience: 2,
        },
        {
          name: "Framer Motion",
          category: "Frontend",
          level: "advanced" as const,
          sortOrder: 5,
          yearsOfExperience: 3,
        },
        {
          name: "Three.js",
          category: "Frontend",
          level: "intermediate" as const,
          sortOrder: 6,
          yearsOfExperience: 2,
        },
        {
          name: "Node.js",
          category: "Backend",
          level: "advanced" as const,
          sortOrder: 7,
          yearsOfExperience: 5,
        },
        {
          name: "Python",
          category: "Backend",
          level: "intermediate" as const,
          sortOrder: 8,
          yearsOfExperience: 2,
        },
        {
          name: "PostgreSQL",
          category: "Backend",
          level: "intermediate" as const,
          sortOrder: 9,
          yearsOfExperience: 3,
        },
        {
          name: "MongoDB",
          category: "Backend",
          level: "intermediate" as const,
          sortOrder: 10,
          yearsOfExperience: 3,
        },
        {
          name: "GraphQL",
          category: "Backend",
          level: "intermediate" as const,
          sortOrder: 11,
          yearsOfExperience: 2,
        },
        {
          name: "Convex",
          category: "Backend",
          level: "intermediate" as const,
          sortOrder: 12,
          yearsOfExperience: 1,
        },
        {
          name: "Figma",
          category: "Design",
          level: "advanced" as const,
          sortOrder: 13,
          yearsOfExperience: 5,
        },
        {
          name: "Adobe XD",
          category: "Design",
          level: "intermediate" as const,
          sortOrder: 14,
          yearsOfExperience: 3,
        },
        {
          name: "Photoshop",
          category: "Design",
          level: "intermediate" as const,
          sortOrder: 15,
          yearsOfExperience: 4,
        },
        {
          name: "Illustrator",
          category: "Design",
          level: "beginner" as const,
          sortOrder: 16,
          yearsOfExperience: 1,
        },
        {
          name: "Git",
          category: "Tools",
          level: "expert" as const,
          sortOrder: 17,
          yearsOfExperience: 7,
        },
        {
          name: "VS Code",
          category: "Tools",
          level: "expert" as const,
          sortOrder: 18,
          yearsOfExperience: 6,
        },
        {
          name: "Docker",
          category: "DevOps",
          level: "beginner" as const,
          sortOrder: 19,
          yearsOfExperience: 1,
        },
        {
          name: "AWS",
          category: "DevOps",
          level: "beginner" as const,
          sortOrder: 20,
          yearsOfExperience: 1,
        },
        {
          name: "Vercel",
          category: "DevOps",
          level: "intermediate" as const,
          sortOrder: 21,
          yearsOfExperience: 3,
        },
      ];

      for (const skill of skills) {
        await ctx.db.insert("skills", skill);
      }
      results.skills = { success: true, count: skills.length };
    } else {
      results.skills = { success: false, message: "Already seeded" };
    }

    // Seed testimonials
    const existingTestimonials = await ctx.db.query("testimonials").first();
    if (!existingTestimonials) {
      const testimonials = [
        {
          name: "Sarah Johnson",
          role: "CEO at TechStart",
          content:
            "Working with this team was an absolute pleasure. They delivered a stunning product that exceeded our expectations. The attention to detail and commitment to quality was exceptional. I would highly recommend them for any design project.",
          rating: 5,
          featured: true,
          sortOrder: 0,
        },
        {
          name: "Michael Chen",
          role: "Product Manager at FinanceApp",
          content:
            "The dashboard they built for us transformed how we visualize our data. Intuitive, fast, and beautifully designed. Our users love it! The team was professional and delivered on time.",
          rating: 5,
          featured: true,
          sortOrder: 1,
        },
        {
          name: "Emma Williams",
          role: "Founder at CreativeStudio",
          content:
            "Incredible design work and seamless collaboration. They understood our vision from day one and brought it to life perfectly. The communication throughout the project was excellent.",
          rating: 5,
          featured: true,
          sortOrder: 2,
        },
        {
          name: "David Park",
          role: "CTO at StartupXYZ",
          content:
            "Technical excellence combined with great communication. They delivered on time and the code quality is top-notch. Would definitely work with them again.",
          rating: 4,
          featured: false,
          sortOrder: 3,
        },
        {
          name: "Lisa Anderson",
          role: "Marketing Director at BrandCo",
          content:
            "The website they created has significantly improved our conversion rates. Beautiful design and excellent user experience. Our customers frequently compliment the new design.",
          rating: 5,
          featured: true,
          sortOrder: 4,
        },
      ];

      for (const testimonial of testimonials) {
        await ctx.db.insert("testimonials", testimonial);
      }
      results.testimonials = { success: true, count: testimonials.length };
    } else {
      results.testimonials = { success: false, message: "Already seeded" };
    }

    // Seed contacts (sample messages)
    const existingContacts = await ctx.db.query("contacts").first();
    if (!existingContacts) {
      const contacts = [
        {
          name: "John Smith",
          email: "john.smith@example.com",
          subject: "Project Inquiry",
          message:
            "Hi, I'm interested in discussing a potential project. We need a web application built for our business. Could we schedule a call to discuss the requirements and timeline?",
          status: "read" as const,
        },
        {
          name: "Alice Brown",
          email: "alice.brown@company.com",
          subject: "Collaboration Opportunity",
          message:
            "We're looking for a talented designer to join our team for an exciting new project. The timeline is about 3 months. Would you be interested in discussing further?",
          status: "unread" as const,
        },
        {
          name: "Bob Wilson",
          email: "bob.wilson@startup.io",
          subject: "Job Offer",
          message:
            "We were impressed by your portfolio and would like to discuss a senior frontend developer position at our company. We're a Series A startup in the fintech space.",
          status: "replied" as const,
        },
        {
          name: "Carol Davis",
          email: "carol.davis@agency.com",
          subject: "Website Redesign Project",
          message:
            "Our company needs a complete website redesign. We love your work on the Canvas project and would like to explore working together. Budget is flexible.",
          status: "unread" as const,
        },
      ];

      for (const contact of contacts) {
        await ctx.db.insert("contacts", contact);
      }
      results.contacts = { success: true, count: contacts.length };
    } else {
      results.contacts = { success: false, message: "Already seeded" };
    }

    return {
      success: true,
      results,
      summary: {
        projects: (results.projects as { count?: number })?.count || 0,
        experience: (results.experience as { count?: number })?.count || 0,
        skills: (results.skills as { count?: number })?.count || 0,
        testimonials: (results.testimonials as { count?: number })?.count || 0,
        contacts: (results.contacts as { count?: number })?.count || 0,
      },
    };
  },
});

// ============================================================================
// CLEAR ALL DATA (for testing)
// ============================================================================

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const tables = [
      "projects",
      "experience",
      "skills",
      "testimonials",
      "contacts",
      "activityLog",
    ] as const;
    const counts: Record<string, number> = {};

    for (const table of tables) {
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
      counts[table] = docs.length;
    }

    return { success: true, deleted: counts };
  },
});
