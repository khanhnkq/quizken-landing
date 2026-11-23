"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import type { Post } from "@/lib/blog";
import { ArticleCard } from "./ArticleCard";

type BlogSearchProps = {
  posts: Post[];
  placeholder?: string;
};

export function BlogSearch({ posts, placeholder = "Tìm bài viết…" }: BlogSearchProps) {
  const [query, setQuery] = useState("");

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return null; // null means "show default", not "show all"
    const q = query.toLowerCase();
    return posts.filter(
      (p) =>
        p.frontmatter.title.toLowerCase().includes(q) ||
        p.frontmatter.description.toLowerCase().includes(q) ||
        p.frontmatter.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [query, posts]);

  return (
    <div>
      <div className="rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none p-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full h-10 rounded-xl border-0 shadow-none bg-foreground/[0.04] pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-lg border-0 shadow-none text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground transition-colors cursor-pointer"
              aria-label="Xóa tìm kiếm"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {filteredPosts !== null && (
        <div className="mt-6">
          {filteredPosts.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Không tìm thấy bài viết nào cho &ldquo;{query}&rdquo;
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <ArticleCard key={post.frontmatter.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
