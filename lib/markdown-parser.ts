import matter from "gray-matter";
import { marked } from "marked";

interface FrontmatterData {
  title?: string;
  slug?: string;
  category?: string;
  description?: string;
  tags?: string | string[];
  color?: string;
  featured?: boolean;
  status?: "draft" | "published" | "archived";
  metaTitle?: string;
  metaDescription?: string;
}

export interface ParsedMarkdown {
  title: string;
  slug: string;
  category: string;
  description: string;
  content: string;
  tags: string[];
  color: string;
  featured: boolean;
  status: "draft" | "published" | "archived";
  metaTitle?: string;
  metaDescription?: string;
}

export function parseMarkdown(markdownContent: string): ParsedMarkdown {
  const { data, content } = matter(markdownContent);
  const frontmatter = data as FrontmatterData;

  const htmlContent = marked(content) as string;

  const tags = Array.isArray(frontmatter.tags)
    ? frontmatter.tags
    : frontmatter.tags
      ? frontmatter.tags.split(",").map((t) => t.trim())
      : [];

  const slug =
    frontmatter.slug || frontmatter.title
      ? frontmatter
          .title!.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      : "";

  return {
    title: frontmatter.title || "",
    slug,
    category: frontmatter.category || "",
    description: frontmatter.description || "",
    content: htmlContent,
    tags,
    color: frontmatter.color || "#3B82F6",
    featured: frontmatter.featured || false,
    status: frontmatter.status || "draft",
    metaTitle: frontmatter.metaTitle,
    metaDescription: frontmatter.metaDescription,
  };
}
