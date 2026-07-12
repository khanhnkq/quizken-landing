import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { getAllCategorySlugs, getCategoryBySlug } from "@/lib/categories";
import { buildMetadata, breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { BlogList } from "@/components/blog/BlogList";
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

  const posts = getAllPosts();

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
          <BlogList posts={posts} initialCategory={category} />
        </Container>
      </section>
    </>
  );
}

