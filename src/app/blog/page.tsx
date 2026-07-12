import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { BlogList } from "@/components/blog/BlogList";
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
          <BlogList posts={posts} />
        </Container>
      </section>
    </>
  );
}


