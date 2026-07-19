import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Sparkles } from "lucide-react";
import { getAllSlugs, getPost, extractHeadings, getRelatedPosts, extractFaqs } from "@/lib/blog";
import { buildMetadata, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";
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
import { BackgroundDecorations } from "@/components/ui/BackgroundDecorations";

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
  const faqs = extractFaqs(post.content);

  const schemas: any[] = [
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
  ];

  if (faqs.length > 0) {
    schemas.push(faqSchema(faqs));
  }

  return (
    <>
      <JsonLd data={schemas} />
      <article className="py-12 sm:py-20 relative">
        <BackgroundDecorations density="low" />

        <Container className="relative z-10">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm font-heading font-bold text-muted-foreground transition-all hover:border-emerald-500 hover:text-emerald-600 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại tất cả bài viết
          </Link>

          {/* Article Hero Header */}
          <header className="max-w-3xl space-y-6">
            {post.frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-heading text-3xl sm:text-5xl font-bold leading-tight tracking-tight text-foreground">
              {post.frontmatter.title}
            </h1>

            {post.frontmatter.description && (
              <p className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed">
                {post.frontmatter.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground font-semibold pt-2 border-t border-border/60">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-emerald-500" />
                <time dateTime={post.frontmatter.date}>
                  {new Date(post.frontmatter.date).toLocaleDateString("vi-VN", {
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

            {/* Cover Image Frame */}
            {post.frontmatter.cover && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border-4 border-emerald-200 dark:border-emerald-900 shadow-xl mt-6">
                <Image
                  src={post.frontmatter.cover}
                  alt={post.frontmatter.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
            )}

            {/* Share buttons */}
            <div className="pt-2">
              <ShareButtons
                url={postUrl}
                title={post.frontmatter.title}
                description={post.frontmatter.description}
              />
            </div>
          </header>

          {/* Article Body & Sidebar */}
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_280px]">
            <div className="min-w-0 space-y-10">
              <MarkdownRenderer content={post.content} />

              <BlogCta />
              <NewsletterCta />

              <div className="pt-4">
                <AuthorCard name={post.frontmatter.author || "QuizKen Team"} />
              </div>

              <div className="flex items-center justify-between border-t border-border/60 pt-8">
                <ShareButtons
                  url={postUrl}
                  title={post.frontmatter.title}
                  description={post.frontmatter.description}
                />
              </div>

              <RelatedPosts posts={relatedPosts} />
            </div>

            {headings.length > 2 && (
              <aside className="hidden lg:block">
                <div className="sticky top-28 space-y-6">
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
