"use client";

import { cn } from "@/lib/utils";

type Heading = { id: string; text: string; level: number };

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null;

  return (
    <nav aria-label="Mục lục" className="rounded-xl border border-border/50 bg-card p-5">
      <p className="mb-3 text-xs font-600 uppercase tracking-widest text-muted-foreground">
        Mục lục
      </p>
      <ul className="space-y-2">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "block text-sm text-muted-foreground transition-colors hover:text-primary",
                h.level === 3 && "pl-4",
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
