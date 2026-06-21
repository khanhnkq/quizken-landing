import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type readingTimeType from "reading-time";

type ReadingTimeResult = ReturnType<typeof readingTimeType>;

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  updated?: string;
  slug: string;
  tags: string[];
  cover?: string;
  author?: string;
};

export type Post = {
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
};

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

/**
 * Read all markdown files from src/content/blog, parse frontmatter, sort by date desc.
 */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const posts = files.map((file) => getPost(file.replace(/\.md$/, ""))).filter(Boolean) as Post[];

  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  );
}

/**
 * Read a single post by slug. Returns null if not found.
 */
export function getPost(slug: string): Post | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const rt = estimateReadingTime(content);

  return {
    frontmatter: {
      title: data.title || "Untitled",
      description: data.description || "",
      date: data.date || "2026-01-01",
      updated: data.updated || undefined,
      slug,
      tags: data.tags || [],
      cover: data.cover || undefined,
      author: data.author || "QuizKen Team",
    },
    content,
    readingTime: rt,
  };
}

/** Get all unique tags across all posts. */
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach((p) => p.frontmatter.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

/** Get all slugs for generateStaticParams. */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/**
 * Lightweight reading time estimate (no external lib needed at runtime
 * since we only need the string).
 */
function estimateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const words = text.replace(/\s+/g, " ").split(" ").filter(Boolean).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} phút đọc`;
}

/** Extract headings from markdown for Table of Contents. */
export function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const lines = content.split("\n");
  const headings: { id: string; text: string; level: number }[] = [];

  for (const line of lines) {
    const match = line.match(/^(#{2,4})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+/g, "")
        .replace(/\s+/g, "-");
      headings.push({ id, text, level });
    }
  }

  return headings;
}
