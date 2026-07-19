import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { Post } from "@/lib/blog";

export function ArticleCard({ post }: { post: Post }) {
  const { frontmatter } = post;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border-4 border-emerald-100 dark:border-emerald-900/60 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-md hover:shadow-xl hover:border-emerald-300 hover:-translate-y-2 hover:rotate-1 transition-all duration-300 ease-out">
      {frontmatter.cover && (
        <div className="relative aspect-[16/9] overflow-hidden bg-emerald-50 dark:bg-slate-800 border-b-2 border-border/50">
          <Image
            src={frontmatter.cover}
            alt={frontmatter.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {frontmatter.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-600/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 space-y-3">
        <h2 className="font-heading text-xl font-bold leading-snug tracking-tight text-foreground group-hover:text-emerald-600 transition-colors">
          <Link href={`/blog/${frontmatter.slug}`} className="after:absolute after:inset-0">
            {frontmatter.title}
          </Link>
        </h2>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground font-medium">
          {frontmatter.description}
        </p>

        <div className="mt-auto pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground font-semibold">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-emerald-500" />
              <time dateTime={frontmatter.date}>
                {new Date(frontmatter.date).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              {post.readingTime}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
            Đọc <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
