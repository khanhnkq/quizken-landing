"use client";

import { cn } from "@/lib/utils";

type Heading = { id: string; text: string; level: number };

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Mục lục"
      className="rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none p-5"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Mục lục
      </p>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "block rounded-lg border-0 shadow-none px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground",
                h.level === 3 && "pl-5",
                h.level === 4 && "pl-8",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
