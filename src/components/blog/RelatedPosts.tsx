import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/blog";
import { Badge } from "@/components/ui/Badge";

export function RelatedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-8">
      <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
        Bài viết liên quan
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.frontmatter.slug}
            href={`/blog/${post.frontmatter.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none p-5 transition-colors hover:border-border"
          >
            {post.frontmatter.cover && (
              <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-xl border-0 shadow-none bg-foreground/[0.04]">
                <Image
                  src={post.frontmatter.cover}
                  alt={post.frontmatter.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized
                />
              </div>
            )}
            {post.frontmatter.tags.length > 0 && (
              <Badge className="mb-2.5 self-start">{post.frontmatter.tags[0]}</Badge>
            )}
            <h3 className="font-heading text-base font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
              {post.frontmatter.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {post.frontmatter.description}
            </p>
            <time
              dateTime={post.frontmatter.date}
              className="mt-auto pt-3 text-xs font-medium text-muted-foreground"
            >
              {new Date(post.frontmatter.date).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </Link>
        ))}
      </div>
    </section>
  );
}
