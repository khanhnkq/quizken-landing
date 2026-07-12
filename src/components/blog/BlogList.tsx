"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X } from "lucide-react";
import type { Post } from "@/lib/blog";
import { ArticleCard } from "./ArticleCard";
import { FeaturedPost } from "./FeaturedPost";
import { Pagination } from "./Pagination";
import { CATEGORIES } from "@/lib/categories";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BlogListProps = {
  posts: Post[];
  initialCategory?: string | null;
};

export function BlogList({ posts, initialCategory = null }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Sync with initialCategory prop (useful for category subpages)
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // 1. Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    let result = posts;

    if (selectedCategory) {
      result = result.filter((p) => p.frontmatter.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.frontmatter.title.toLowerCase().includes(q) ||
          p.frontmatter.description.toLowerCase().includes(q) ||
          p.frontmatter.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [posts, selectedCategory, searchQuery]);

  // 2. Identify the featured post (only when no search and no specific category is selected, showing the top featured)
  const featuredPost = useMemo(() => {
    if (searchQuery.trim() || selectedCategory) return null;
    return posts.find((p) => p.frontmatter.featured) || posts[0] || null;
  }, [posts, searchQuery, selectedCategory]);

  // 3. Exclude featured post from the grid if active
  const gridPosts = useMemo(() => {
    if (featuredPost) {
      return filteredPosts.filter((p) => p.frontmatter.slug !== featuredPost.frontmatter.slug);
    }
    return filteredPosts;
  }, [filteredPosts, featuredPost]);

  // 4. Calculate pagination
  const totalPages = Math.max(1, Math.ceil(gridPosts.length / postsPerPage));
  
  const paginatedGridPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return gridPosts.slice(start, start + postsPerPage);
  }, [gridPosts, currentPage, postsPerPage]);

  return (
    <div>
      {/* Search and Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
            {selectedCategory 
              ? CATEGORIES.find(c => c.slug === selectedCategory)?.label 
              : "Blog"}
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-foreground">
            {selectedCategory
              ? CATEGORIES.find(c => c.slug === selectedCategory)?.description
              : "Hướng dẫn, mẹo hay và tin tức mới nhất về giáo dục, AI và cách sử dụng QuizKen hiệu quả."}
          </p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm bài viết..."
            className="w-full rounded-xl border border-border/50 bg-card py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Xóa tìm kiếm"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
            selectedCategory === null
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
          )}
        >
          Tất cả
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
              selectedCategory === cat.slug
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      {filteredPosts.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          Không tìm thấy bài viết nào phù hợp. Quay lại sau nhé!
        </p>
      ) : (
        <>
          {/* Featured Post (only shown on page 1 of default view) */}
          {featuredPost && currentPage === 1 && (
            <div className="mt-10">
              <FeaturedPost post={featuredPost} />
            </div>
          )}

          {/* Grid Posts */}
          {paginatedGridPosts.length > 0 && (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedGridPosts.map((post) => (
                <ArticleCard key={post.frontmatter.slug} post={post} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              // Scroll to top of listing smoothly
              window.scrollTo({ top: 200, behavior: "smooth" });
            }}
          />
        </>
      )}
    </div>
  );
}
