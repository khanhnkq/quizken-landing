import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { Post } from "@/lib/blog";

export function ArticleCard({ post }: { post: Post }) {
  const { frontmatter } = post;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none transition-colors hover:border-border">
      {frontmatter.cover && (
        <div className="relative aspect-[16/9] overflow-hidden bg-foreground/[0.04] border-0 shadow-none">
          <Image
            src={frontmatter.cover}
            alt={frontmatter.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
          {frontmatter.tags.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
              {frontmatter.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border-0 shadow-none bg-background/85 px-2.5 py-1 text-[11px] font-semibold text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 gap-3">
        <h2 className="font-heading text-lg sm:text-xl font-bold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors">
          <Link href={`/blog/${frontmatter.slug}`} className="after:absolute after:inset-0">
            {frontmatter.title}
          </Link>
        </h2>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {frontmatter.description}
        </p>

        <div className="mt-auto rounded-xl border-0 shadow-none bg-foreground/[0.04] px-3.5 py-2.5 flex items-center justify-between text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <time dateTime={frontmatter.date}>
                {new Date(frontmatter.date).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              {post.readingTime}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-primary font-semibold">
            Đọc <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
