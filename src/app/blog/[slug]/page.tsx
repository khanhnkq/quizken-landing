import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getAllSlugs, getPost, extractHeadings, getRelatedPosts, extractFaqs } from "@/lib/blog";
import { buildMetadata, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { buildAbsoluteUrl } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { BlogCta } from "@/components/blog/BlogCta";
import { StickySidebarAd } from "@/components/ads/StickySidebarAd";
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
  const faqs = extractFaqs(post.content);

  const schemas: unknown[] = [
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
      <article className="bg-background py-12 sm:py-20 relative">
        <Container className="relative z-10">
          <Button href="/blog" variant="secondary" size="sm" className="mb-8">
            <ArrowLeft className="h-4 w-4" />
            Quay lại tất cả bài viết
          </Button>

          {/* Article Hero Header */}
          <header className="max-w-3xl space-y-5">
            {post.frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.frontmatter.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            )}

            <h1 className="font-heading text-3xl sm:text-5xl font-bold leading-tight tracking-tight text-foreground">
              {post.frontmatter.title}
            </h1>

            {post.frontmatter.description && (
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {post.frontmatter.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground font-medium border-0 shadow-none">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <time dateTime={post.frontmatter.date}>
                  {new Date(post.frontmatter.date).toLocaleDateString("vi-VN", {
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

            {/* Cover Image Frame */}
            {post.frontmatter.cover && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none mt-6">
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

              <BlogCta
                category={post.frontmatter.category}
                tags={post.frontmatter.tags}
              />
              <NewsletterCta />

              <div className="pt-4">
                <AuthorCard name={post.frontmatter.author || "QuizKen Team"} />
              </div>

              <div className="flex items-center justify-between border-0 shadow-none pt-4">
                <ShareButtons
                  url={postUrl}
                  title={post.frontmatter.title}
                  description={post.frontmatter.description}
                />
              </div>

              <RelatedPosts posts={relatedPosts} />
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">
                {headings.length > 2 && <TableOfContents headings={headings} />}
                <StickySidebarAd
                  category={post.frontmatter.category}
                  tags={post.frontmatter.tags}
                  slug={slug}
                />
              </div>
            </aside>
          </div>
        </Container>
      </article>
    </>
  );
}
