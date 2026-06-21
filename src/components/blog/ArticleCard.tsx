import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/blog";

export function ArticleCard({ post }: { post: Post }) {
  const { frontmatter } = post;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/15 hover:shadow-lg hover:shadow-primary/5">
      {frontmatter.cover && (
        <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
          <Image
            src={frontmatter.cover}
            alt={frontmatter.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {frontmatter.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {frontmatter.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h2 className="font-heading text-lg font-600 leading-snug tracking-tight transition-colors group-hover:text-primary">
          <Link href={`/blog/${frontmatter.slug}`} className="after:absolute after:inset-0">
            {frontmatter.title}
          </Link>
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {frontmatter.description}
        </p>
        <div className="mt-auto pt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <time dateTime={frontmatter.date}>
            {new Date(frontmatter.date).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{post.readingTime}</span>
        </div>
      </div>
    </article>
  );
}
