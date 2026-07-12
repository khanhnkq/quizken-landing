import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/blog";

export function RelatedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border/50 pt-12">
      <h2 className="font-heading text-2xl tracking-tight">Bài viết liên quan</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.frontmatter.slug}
            href={`/blog/${post.frontmatter.slug}`}
            className="group flex flex-col rounded-xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5"
          >
            {post.frontmatter.cover && (
              <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg bg-secondary">
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
              <span className="mb-2 self-start rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-medium text-primary">
                {post.frontmatter.tags[0]}
              </span>
            )}
            <h3 className="font-heading text-base font-600 leading-snug tracking-tight transition-colors group-hover:text-primary">
              {post.frontmatter.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {post.frontmatter.description}
            </p>
            <time
              dateTime={post.frontmatter.date}
              className="mt-auto pt-3 text-xs text-muted-foreground"
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
