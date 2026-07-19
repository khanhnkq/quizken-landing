"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Sparkles, BookOpen } from "lucide-react";
import type { Post } from "@/lib/blog";
import { ArticleCard } from "./ArticleCard";
import { FeaturedPost } from "./FeaturedPost";
import { Pagination } from "./Pagination";
import { CATEGORIES } from "@/lib/categories";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BackgroundDecorations } from "@/components/ui/BackgroundDecorations";

type BlogListProps = {
  posts: Post[];
  initialCategory?: string | null;
};

export function BlogList({ posts, initialCategory = null }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

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
      <BackgroundDecorations density="low" />

      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
        <div className="eyebrow mx-auto">
          <Sparkles className="h-4 w-4 fill-emerald-500 text-emerald-500" />
          <span>Thư viện kiến thức & tin tức QuizKen</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
          {selectedCategory
            ? CATEGORIES.find((c) => c.slug === selectedCategory)?.label
            : "Góc Chia Sẻ Kiến Thức"}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed">
          {selectedCategory
            ? CATEGORIES.find((c) => c.slug === selectedCategory)?.description
            : "Hướng dẫn tạo đề thi trắc nghiệm AI, mẹo học tiếng Anh, kinh nghiệm giảng dạy và các công cụ giáo dục mới nhất."}
        </p>

        {/* Search Bar */}
        <div className="pt-2 max-w-md mx-auto relative">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết, chủ đề, mẹo học..."
            className="w-full rounded-full border-2 border-border/80 bg-card/90 backdrop-blur-md py-3.5 pl-11 pr-4 text-sm font-medium focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15 shadow-md transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
        </div>
      </div>

      {/* Category Pills */}
      <nav aria-label="Danh mục blog" className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
        <Link
          href="/blog"
          className={cn(
            "rounded-full px-5 py-2 text-xs sm:text-sm font-heading font-bold transition-all shadow-sm border",
            !selectedCategory
              ? "bg-primary text-white border-primary shadow-md scale-105"
              : "bg-card text-muted-foreground border-border hover:border-emerald-300 hover:text-foreground"
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
                "rounded-full px-5 py-2 text-xs sm:text-sm font-heading font-bold transition-all shadow-sm border",
                isActive
                  ? "bg-primary text-white border-primary shadow-md scale-105"
                  : "bg-card text-muted-foreground border-border hover:border-emerald-300 hover:text-foreground"
              )}
            >
              {cat.label}
            </Link>
          );
        })}
      </nav>

      {/* Featured Post */}
      {featuredPost && <FeaturedPost post={featuredPost} />}

      {/* Grid Posts */}
      {paginatedGridPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {paginatedGridPosts.map((post) => (
            <ArticleCard key={post.frontmatter.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl border-4 border-dashed border-border bg-card">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading text-xl font-bold">Không tìm thấy bài viết nào</h3>
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
