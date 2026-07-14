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
  category?: string;
  cover?: string;
  author?: string;
  featured?: boolean;
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
      tags: (data.tags || []).map(String),
      category: data.category || undefined,
      cover: data.cover || undefined,
      author: data.author || "QuizKen Team",
      featured: data.featured || false,
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

/** Get posts filtered by category slug. */
export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((p) => p.frontmatter.category === category);
}

/** Get posts filtered by tag. */
export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) =>
    p.frontmatter.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );
}

/**
 * Get related posts for a given slug, ordered by number of shared tags.
 * Excludes the current post. Returns at most `limit` results.
 */
export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const current = getPost(slug);
  if (!current) return [];

  const currentTags = new Set(current.frontmatter.tags.map((t) => t.toLowerCase()));
  const allPosts = getAllPosts().filter((p) => p.frontmatter.slug !== slug);

  const scored = allPosts.map((post) => {
    const shared = post.frontmatter.tags.filter((t) =>
      currentTags.has(t.toLowerCase()),
    ).length;
    // Bonus if same category
    const categoryBonus =
      post.frontmatter.category && post.frontmatter.category === current.frontmatter.category
        ? 2
        : 0;
    return { post, score: shared + categoryBonus };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.post);
}

/**
 * Get paginated posts. Returns { posts, totalPages, currentPage }.
 */
export function getPaginatedPosts(
  page = 1,
  pageSize = 9,
  category?: string,
): { posts: Post[]; totalPages: number; currentPage: number; totalPosts: number } {
  let allPosts = getAllPosts();
  if (category) {
    allPosts = allPosts.filter((p) => p.frontmatter.category === category);
  }

  const totalPosts = allPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const posts = allPosts.slice(start, start + pageSize);

  return { posts, totalPages, currentPage, totalPosts };
}

/** Get the featured post (first post with featured: true, or newest post). */
export function getFeaturedPost(): Post | null {
  const posts = getAllPosts();
  return posts.find((p) => p.frontmatter.featured) || posts[0] || null;
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

export type FaqItem = {
  question: string;
  answer: string;
};

/** Extract FAQ Q&A from blog markdown content. */
export function extractFaqs(content: string): FaqItem[] {
  const faqs: FaqItem[] = [];
  const lines = content.split("\n");
  let inFaqSection = false;
  let currentQuestion = "";
  let currentAnswerLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed.startsWith("## ") &&
      (trimmed.toLowerCase().includes("câu hỏi thường gặp") || trimmed.toLowerCase().includes("faq"))
    ) {
      inFaqSection = true;
      continue;
    }

    if (inFaqSection) {
      // Exit FAQ section if another H1 or H2 is found
      if (
        trimmed.startsWith("# ") ||
        (trimmed.startsWith("## ") &&
          !trimmed.toLowerCase().includes("câu hỏi thường gặp") &&
          !trimmed.toLowerCase().includes("faq"))
      ) {
        break;
      }

      if (trimmed.startsWith("### ")) {
        if (currentQuestion && currentAnswerLines.length > 0) {
          faqs.push({
            question: currentQuestion,
            answer: currentAnswerLines.join("\n").trim(),
          });
        }
        currentQuestion = trimmed.slice(4).replace(/^\d+\.\s*/, "").trim();
        currentAnswerLines = [];
      } else if (currentQuestion) {
        currentAnswerLines.push(line);
      }
    }
  }

  if (currentQuestion && currentAnswerLines.length > 0) {
    faqs.push({
      question: currentQuestion,
      answer: currentAnswerLines.join("\n").trim(),
    });
  }

  return faqs;
}

