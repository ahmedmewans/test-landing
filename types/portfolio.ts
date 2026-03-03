import type {
  MotionValue,
  Target,
  Transition,
  VariantLabels,
} from "framer-motion";

export type CardId = "projects" | "contact" | "experience" | "about" | "chat";

export interface FloatingCardBaseProps {
  id: CardId;
  label: string;
  FaceComponent: React.FC;
  size: string;
  depth: number;
  rotation?: number;
  floatDelay?: number;
  baseColor: string;
  href?: string;
  labelPosition?: "left" | "right" | "top" | "bottom" | "center";
  className?: string;
  style?: React.CSSProperties;
  initial?: Target | VariantLabels | boolean;
  animate?: Target | VariantLabels | boolean;
  transition?: Transition;
}

export interface ParallaxObjectProps {
  depth: number;
  magneticRadius?: number;
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface DecorativeCircleProps {
  color: string;
  size: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  depth: number;
  floatDelay?: number;
  initial?: Target | VariantLabels;
  animate?: Target | VariantLabels;
  transition?: Transition;
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
  mouseXRaw?: MotionValue<number>;
  mouseYRaw?: MotionValue<number>;
}

export interface FloatingCardProps extends FloatingCardBaseProps {
  isHovered: boolean;
  onHoverStart: (id: CardId) => void;
  onHoverEnd: () => void;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  color: string;
  tags: string[];
  description: string;
  mockupType: string;
  longDescription: string;
  challenge: string;
  solution: string;
  features: string[];
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  tags: string[];
  color: string;
  icon?: string;
}

export interface ProjectPublic {
  _id: string;
  _creationTime: number;
  title: string;
  slug: string;
  category: string;
  status: "draft" | "published" | "archived";
  description: string;
  content: string;
  thumbnail?: string;
  thumbnailUrl?: string | null;
  images?: string[];
  imageUrls?: string[];
  mockupType?: string;
  tags: string[];
  color: string;
  featured: boolean;
  sortOrder: number;
  startDate?: number;
  endDate?: number;
  publishedAt?: number;
  metaTitle?: string;
  metaDescription?: string;
  aiSummary?: string;
}

export interface ExperiencePublic {
  _id: string;
  _creationTime: number;
  company: string;
  role: string;
  description: string;
  highlights: string[];
  tags: string[];
  color: string;
  icon?: string;
  startDate: number;
  endDate?: number;
  location: string;
  sortOrder: number;
  period: string;
}

export interface SkillPublic {
  _id: string;
  _creationTime: number;
  name: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  icon?: string;
  sortOrder: number;
  yearsOfExperience?: number;
}

export interface TestimonialPublic {
  _id: string;
  _creationTime: number;
  name: string;
  role: string;
  content: string;
  avatar?: string;
  avatarUrl?: string | null;
  rating?: number;
  featured: boolean;
  sortOrder: number;
}
