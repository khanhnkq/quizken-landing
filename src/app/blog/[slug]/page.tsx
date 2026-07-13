import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getAllSlugs, getPost, extractHeadings, getRelatedPosts } from "@/lib/blog";
import { buildMetadata, articleSchema, breadcrumbSchema } from "@/lib/seo";
import { buildAbsoluteUrl } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { BlogCta } from "@/components/blog/BlogCta";
import { NewsletterCta } from "@/components/blog/NewsletterCta";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    path: `/blog/${slug}`,
    image: post.frontmatter.cover,
    keywords: post.frontmatter.tags,
    publishedTime: post.frontmatter.date,
    modifiedTime: post.frontmatter.updated,
    authors: [post.frontmatter.author || "QuizKen Team"],
    type: "article",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const headings = extractHeadings(post.content);
  const relatedPosts = getRelatedPosts(slug, 3);
  const postUrl = buildAbsoluteUrl(`/blog/${slug}`);

  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            title: post.frontmatter.title,
            description: post.frontmatter.description,
            path: `/blog/${slug}`,
            image: post.frontmatter.cover,
            datePublished: post.frontmatter.date,
            dateModified: post.frontmatter.updated,
            author: post.frontmatter.author,
          }),
          breadcrumbSchema([
            { name: "Trang chủ", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.frontmatter.title, path: `/blog/${slug}` },
          ]),
        ]}
      />
      <article className="py-14 sm:py-20">
        <Container>
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại Blog
          </Link>

          <header className="max-w-2xl">
            {post.frontmatter.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-heading text-3xl leading-tight tracking-tight sm:text-4xl">
              {post.frontmatter.title}
            </h1>
            {post.frontmatter.description && (
              <p className="mt-4 text-lg text-muted-foreground">
                {post.frontmatter.description}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.frontmatter.date}>
                  {new Date(post.frontmatter.date).toLocaleDateString("vi-VN", {
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

            {/* Share buttons below header */}
            <div className="mt-6">
              <ShareButtons
                url={postUrl}
                title={post.frontmatter.title}
                description={post.frontmatter.description}
              />
            </div>
          </header>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_260px]">
            <div className="min-w-0">
              <MarkdownRenderer content={post.content} />

              {/* CTA banner after content */}
              <BlogCta />

              {/* Newsletter email capture */}
              <NewsletterCta />

              {/* Author card */}
              <div className="mt-8">
                <AuthorCard name={post.frontmatter.author || "QuizKen Team"} />
              </div>

              {/* Share buttons bottom */}
              <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-8">
                <ShareButtons
                  url={postUrl}
                  title={post.frontmatter.title}
                  description={post.frontmatter.description}
                />
              </div>

              {/* Related posts */}
              <RelatedPosts posts={relatedPosts} />
            </div>
            {headings.length > 2 && (
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <TableOfContents headings={headings} />
                </div>
              </aside>
            )}
          </div>
        </Container>
      </article>
    </>
  );
}

