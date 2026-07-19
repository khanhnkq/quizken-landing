import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, Sparkles } from "lucide-react";
import type { Post } from "@/lib/blog";

export function FeaturedPost({ post }: { post: Post }) {
  const { frontmatter } = post;

  return (
    <article className="group relative overflow-hidden rounded-3xl border-4 border-emerald-300 dark:border-emerald-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl transition-all duration-300 hover:shadow-emerald-500/10 mb-12">
      <div className="grid gap-0 lg:grid-cols-2">
        {/* Cover image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-emerald-50 dark:bg-slate-800 lg:aspect-auto lg:min-h-[380px]">
          {frontmatter.cover ? (
            <Image
              src={frontmatter.cover}
              alt={frontmatter.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-6xl opacity-30">📝</div>
            </div>
          )}
          {/* Top Floating Badge */}
          <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-white font-bold text-xs shadow-lg">
            <Sparkles className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
            <span>Bài viết nổi bật</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between p-6 sm:p-10 space-y-6">
          <div className="space-y-4">
            {frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {frontmatter.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug tracking-tight text-foreground group-hover:text-emerald-600 transition-colors">
              <Link href={`/blog/${frontmatter.slug}`} className="after:absolute after:inset-0">
                {frontmatter.title}
              </Link>
            </h2>

            <p className="line-clamp-3 text-sm sm:text-base leading-relaxed text-muted-foreground font-medium">
              {frontmatter.description}
            </p>
          </div>

          <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground font-semibold">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-emerald-500" />
                <time dateTime={frontmatter.date}>
                  {new Date(frontmatter.date).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-500" />
                {post.readingTime}
              </span>
            </div>

            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-heading font-bold text-xs sm:text-sm shadow-md group-hover:bg-emerald-600 transition-all">
              Đọc Bài Viết
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
