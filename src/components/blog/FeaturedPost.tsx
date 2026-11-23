import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, FileText, Sparkles } from "lucide-react";
import type { Post } from "@/lib/blog";
import { Badge } from "@/components/ui/Badge";

export function FeaturedPost({ post }: { post: Post }) {
  const { frontmatter } = post;

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none transition-colors hover:border-border mb-10">
      <div className="grid gap-0 lg:grid-cols-2">
        {/* Cover image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-foreground/[0.04] border-0 shadow-none lg:aspect-auto lg:min-h-[360px]">
          {frontmatter.cover ? (
            <Image
              src={frontmatter.cover}
              alt={frontmatter.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <FileText className="h-12 w-12 opacity-40" />
            </div>
          )}
          {/* Top Floating Badge */}
          <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-lg border-0 shadow-none bg-background/85 px-2.5 py-1 text-xs font-semibold text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Bài viết nổi bật</span>
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 gap-6">
          <div className="space-y-4">
            {frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {frontmatter.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            )}

            <h2 className="font-heading text-2xl sm:text-3xl font-bold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors">
              <Link href={`/blog/${frontmatter.slug}`} className="after:absolute after:inset-0">
                {frontmatter.title}
              </Link>
            </h2>

            <p className="line-clamp-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
              {frontmatter.description}
            </p>
          </div>

          <div className="rounded-xl border-0 shadow-none bg-foreground/[0.04] p-3 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground font-medium">
            <div className="flex items-center gap-4 pl-1">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <time dateTime={frontmatter.date}>
                  {new Date(frontmatter.date).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {post.readingTime}
              </span>
            </div>

            <span className="inline-flex h-10 items-center gap-2 px-5 rounded-xl border-0 shadow-none bg-primary text-primary-foreground font-heading font-semibold text-sm group-hover:bg-primary/90 transition-colors">
              Đọc Bài Viết
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
