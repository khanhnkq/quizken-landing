"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPages = () => {
    const pages = [];
    const showMax = 5; // Max page buttons to show

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (start === 1) {
        end = showMax;
      } else if (end === totalPages) {
        start = totalPages - showMax + 1;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pages = getPages();

  return (
    <nav aria-label="Phân trang" className="flex items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex h-10 min-w-[40px] items-center justify-center rounded-xl border-0 shadow-none bg-foreground/[0.04] text-muted-foreground transition-colors hover:bg-foreground/[0.08] hover:text-foreground disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
        aria-label="Trang trước"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p) => {
        const isActive = p === currentPage;
        return (
          <button
            type="button"
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex h-10 min-w-[40px] px-3 items-center justify-center rounded-xl border-0 shadow-none text-sm font-semibold transition-colors cursor-pointer",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/[0.04] text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground"
            )}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex h-10 min-w-[40px] items-center justify-center rounded-xl border-0 shadow-none bg-foreground/[0.04] text-muted-foreground transition-colors hover:bg-foreground/[0.08] hover:text-foreground disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
        aria-label="Trang sau"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
