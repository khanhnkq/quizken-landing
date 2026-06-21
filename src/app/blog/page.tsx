import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { JsonLd } from "@/components/JsonLd";
import { webPageSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Bài viết hướng dẫn tạo đề kiểm tra AI, mẹo học tiếng Anh, so sánh công cụ quiz và tin tức giáo dục từ QuizKen.",
  path: "/blog",
  keywords: [
    "blog QuizKen",
    "tạo đề kiểm tra AI",
    "hướng dẫn quiz",
    "học tiếng Anh",
    "công cụ giáo dục",
  ],
});

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <JsonLd
        data={[
          webPageSchema("Blog - QuizKen", "Bài viết hướng dẫn và tin tức giáo dục từ QuizKen.", "/blog"),
          breadcrumbSchema([
            { name: "Trang chủ", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        ]}
      />
      <section className="py-16 sm:py-24">
        <Container>
          <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
            Blog
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-foreground">
            Hướng dẫn, mẹo hay và tin tức mới nhất về giáo dục, AI và cách sử
            dụng QuizKen hiệu quả.
          </p>

          {posts.length === 0 ? (
            <p className="mt-14 text-center text-muted-foreground">
              Chưa có bài viết nào. Quay lại sau nhé!
            </p>
          ) : (
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
