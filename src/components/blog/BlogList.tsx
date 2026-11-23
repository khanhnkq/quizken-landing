"use client";

import { useState, useMemo } from "react";
import { Search, Sparkles, BookOpen, X } from "lucide-react";
import type { Post } from "@/lib/blog";
import { ArticleCard } from "./ArticleCard";
import { FeaturedPost } from "./FeaturedPost";
import { Pagination } from "./Pagination";
import { Badge } from "@/components/ui/Badge";
import { CATEGORIES } from "@/lib/categories";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BlogListProps = {
  posts: Post[];
  initialCategory?: string | null;
};

export function BlogList({ posts, initialCategory = null }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const selectedCategory = initialCategory;
  const filterKey = `${selectedCategory ?? ""}|${searchQuery}`;
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
  const currentPage = pageState.key === filterKey ? pageState.page : 1;
  const setCurrentPage = (page: number) => setPageState({ key: filterKey, page });
  const postsPerPage = 6;

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

  const featuredPost = useMemo(() => {
    if (searchQuery.trim() || selectedCategory) return null;
    return posts.find((p) => p.frontmatter.featured) || posts[0] || null;
  }, [posts, searchQuery, selectedCategory]);

  const gridPosts = useMemo(() => {
    if (featuredPost) {
      return filteredPosts.filter((p) => p.frontmatter.slug !== featuredPost.frontmatter.slug);
    }
    return filteredPosts;
  }, [filteredPosts, featuredPost]);

  const totalPages = Math.max(1, Math.ceil(gridPosts.length / postsPerPage));

  const paginatedGridPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return gridPosts.slice(start, start + postsPerPage);
  }, [gridPosts, currentPage, postsPerPage]);

  return (
    <div className="relative">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-4">
        <Badge className="mx-auto">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Thư viện kiến thức &amp; tin tức QuizKen</span>
        </Badge>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          {selectedCategory
            ? CATEGORIES.find((c) => c.slug === selectedCategory)?.label
            : "Góc Chia Sẻ Kiến Thức"}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {selectedCategory
            ? CATEGORIES.find((c) => c.slug === selectedCategory)?.description
            : "Hướng dẫn tạo đề thi trắc nghiệm AI, mẹo học tiếng Anh, kinh nghiệm giảng dạy và các công cụ giáo dục mới nhất."}
        </p>
      </div>

      {/* Unified Search & Filter Toolbar */}
      <div className="mb-10 rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none p-2 flex flex-col gap-2">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết, chủ đề, mẹo học..."
            className="w-full h-10 rounded-xl border-0 shadow-none bg-foreground/[0.04] pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Xóa tìm kiếm"
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-lg border-0 shadow-none text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <nav aria-label="Danh mục blog" className="flex flex-wrap items-center gap-1.5">
          <Link
            href="/blog"
            className={cn(
              "inline-flex items-center justify-center h-9 px-3.5 rounded-xl border-0 shadow-none text-xs sm:text-sm font-heading font-semibold transition-colors whitespace-nowrap",
              !selectedCategory
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/[0.04] text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground"
            )}
          >
            Tất cả
          </Link>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <Link
                key={cat.slug}
                href={`/blog/category/${cat.slug}`}
                className={cn(
                  "inline-flex items-center justify-center h-9 px-3.5 rounded-xl border-0 shadow-none text-xs sm:text-sm font-heading font-semibold transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/[0.04] text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground"
                )}
              >
                {cat.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Featured Post */}
      {featuredPost && <FeaturedPost post={featuredPost} />}

      {/* Grid Posts */}
      {paginatedGridPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedGridPosts.map((post) => (
            <ArticleCard key={post.frontmatter.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border-0 shadow-none bg-foreground/[0.06] text-muted-foreground">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-xl font-bold text-foreground">
            Không tìm thấy bài viết nào
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Hãy thử tìm kiếm với từ khóa khác hoặc chuyển danh mục bài viết.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
