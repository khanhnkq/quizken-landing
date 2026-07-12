import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostsByCategory } from "@/lib/blog";
import { getAllCategorySlugs, getCategoryBySlug } from "@/lib/categories";
import { buildMetadata, breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return getAllCategorySlugs().map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};

  return buildMetadata({
    title: `${cat.label} — Blog`,
    description: cat.metaDescription,
    path: `/blog/category/${category}`,
    keywords: [cat.label, "QuizKen", "blog", cat.slug],
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const posts = getPostsByCategory(category);

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(
            `${cat.label} — Blog QuizKen`,
            cat.metaDescription,
            `/blog/category/${category}`,
          ),
          breadcrumbSchema([
            { name: "Trang chủ", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: cat.label, path: `/blog/category/${category}` },
          ]),
        ]}
      />
      <section className="py-16 sm:py-24">
        <Container>
          <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
            {cat.label}
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-foreground">
            {cat.description}
          </p>

          {/* Category filter */}
          <div className="mt-8">
            <CategoryFilter />
          </div>

          {posts.length === 0 ? (
            <p className="mt-14 text-center text-muted-foreground">
              Chưa có bài viết nào trong danh mục này. Quay lại sau nhé!
            </p>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <ArticleCard key={post.frontmatter.slug} post={post} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
