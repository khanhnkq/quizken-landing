"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/categories";

export function CategoryFilter() {
  const pathname = usePathname();

  // Determine current category from URL
  const currentCategory = pathname.startsWith("/blog/category/")
    ? pathname.split("/blog/category/")[1]?.split("/")[0]
    : null;
  const isAllActive = pathname === "/blog";

  return (
    <nav aria-label="Danh mục blog" className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
          isAllActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
        )}
      >
        Tất cả
      </Link>
      {CATEGORIES.map((cat) => {
        const isActive = currentCategory === cat.slug;
        return (
          <Link
            key={cat.slug}
            href={`/blog/category/${cat.slug}`}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
            )}
          >
            {cat.label}
          </Link>
        );
      })}
    </nav>
  );
}
