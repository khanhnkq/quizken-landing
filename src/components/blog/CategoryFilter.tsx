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
    <nav
      aria-label="Danh mục blog"
      className="rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none p-2 flex flex-wrap gap-1.5"
    >
      <Link
        href="/blog"
        className={cn(
          "inline-flex items-center justify-center h-9 px-3.5 rounded-xl border-0 shadow-none text-sm font-heading font-semibold transition-colors whitespace-nowrap",
          isAllActive
            ? "bg-primary text-primary-foreground"
            : "bg-foreground/[0.04] text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground",
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
              "inline-flex items-center justify-center h-9 px-3.5 rounded-xl border-0 shadow-none text-sm font-heading font-semibold transition-colors whitespace-nowrap",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/[0.04] text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground",
            )}
          >
            {cat.label}
          </Link>
        );
      })}
    </nav>
  );
}
