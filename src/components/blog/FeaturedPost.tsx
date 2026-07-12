import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { Post } from "@/lib/blog";

export function FeaturedPost({ post }: { post: Post }) {
  const { frontmatter } = post;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/15 hover:shadow-xl hover:shadow-primary/5">
      <div className="grid gap-0 md:grid-cols-2">
        {/* Cover image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 md:aspect-auto md:min-h-[320px]">
          {frontmatter.cover ? (
            <Image
              src={frontmatter.cover}
              alt={frontmatter.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-6xl opacity-20">📝</div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="eyebrow">Bài viết nổi bật</span>
          </div>

          {frontmatter.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {frontmatter.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h2 className="font-heading text-2xl font-600 leading-tight tracking-tight transition-colors group-hover:text-primary sm:text-3xl">
            <Link href={`/blog/${frontmatter.slug}`} className="after:absolute after:inset-0">
              {frontmatter.title}
            </Link>
          </h2>

          <p className="mt-3 line-clamp-3 text-base leading-relaxed text-muted-foreground">
            {frontmatter.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={frontmatter.date}>
                {new Date(frontmatter.date).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readingTime}
            </span>
          </div>

          <div className="mt-6">
            <span className="inline-flex items-center gap-2 text-sm font-600 text-primary transition-transform group-hover:translate-x-1">
              Đọc bài viết
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
