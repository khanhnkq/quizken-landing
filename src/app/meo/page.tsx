import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Wrench,
  Github,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  BookOpen,
} from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { buildMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "Mẹo Học Tập & Công Cụ Tiện Ích Sinh Viên Miễn Phí | QuizKen",
  description:
    "Tổng hợp các công cụ tải tài liệu Studocu, Scribd không bị mờ (unblur), tiện ích Chrome mở rộng, mẹo ôn thi và công nghệ AI hỗ trợ học tập đỉnh cao.",
  path: "/meo",
  keywords: [
    "mẹo học tập",
    "công cụ sinh viên",
    "tải tài liệu studocu miễn phí",
    "studocu unblur free",
    "doccleaner extension",
    "tải pdf studocu scribd",
    "tiện ích học tập chrome",
    "mẹo ôn thi hiệu quả",
  ],
});

const docCleanerHighlights = [
  "Unblur 100% trang khóa Studocu & Scribd",
  "Chặn sạch Ads, Popup VIP & Cookie Banner",
  "Auto-scroll preload chống mất trang khi xuất PDF",
  "Mã nguồn mở an toàn trên GitHub (khanhnkq)",
];

export default function MeoPage() {
  const allPosts = getAllPosts();

  // Filter posts related to tools, study tips, or extensions
  const meoPosts = allPosts.filter(
    (p) =>
      p.frontmatter.category === "cong-cu-meo" ||
      p.frontmatter.category === "meo-hoc-tap" ||
      p.frontmatter.tags.some((t) =>
        [
          "tool",
          "công cụ",
          "mẹo",
          "studocu",
          "doccleaner",
          "extension",
          "unblur",
          "tải tài liệu",
        ].some((key) => t.toLowerCase().includes(key)),
      ),
  );

  const displayPosts = meoPosts.length > 0 ? meoPosts : allPosts.slice(0, 9);

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(
            "Kho Mẹo & Công Cụ Học Tập Thông Minh - QuizKen",
            "Tổng hợp các công cụ tải tài liệu, tiện ích Chrome, mẹo ôn thi và công nghệ hỗ trợ học tập.",
            "/meo",
          ),
          breadcrumbSchema([
            { name: "Trang chủ", path: "/" },
            { name: "Mẹo & Tool", path: "/meo" },
          ]),
        ]}
      />

      <div className="bg-background py-12 sm:py-20">
        <Container className="space-y-14">
          {/* Header Section */}
          <div className="mx-auto max-w-3xl space-y-5 text-center">
            <Badge>
              <Wrench className="h-3.5 w-3.5" />
              <span>Thư viện Tiện ích & Thủ thuật Công nghệ</span>
            </Badge>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Kho Mẹo & Công Cụ Học Tập Đỉnh Cao
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Tổng hợp tiện ích mã nguồn mở, mẹo tải tài liệu không giới hạn,
              unblur Studocu/Scribd và các công cụ công nghệ giúp học sinh, sinh
              viên tiết kiệm hàng giờ mỗi tuần.
            </p>
          </div>

          {/* Featured Spotlight: DocCleaner */}
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none backdrop-blur-none sm:p-8">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="space-y-5 lg:col-span-7">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>Công Cụ Nổi Bật #1</Badge>
                  <Badge>Chrome Extension v1.3</Badge>
                  <Badge>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    100% Miễn phí & An toàn
                  </Badge>
                </div>

                <h2 className="font-heading text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-3xl">
                  DocCleaner: Unblur & Tải Tài Liệu Studocu, Scribd Chuẩn HD
                  1-Click
                </h2>

                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Tiện ích mở rộng thông minh giúp sinh viên tự động gỡ bỏ lớp
                  làm mờ (unblur) trên Studocu qua CloudFront signature, chặn
                  sạch quảng cáo phiền toái, tự động preload trang chống lỗi
                  trắng và xuất file PDF in ấn chuẩn A4 sắc nét chỉ với 1 cú
                  click chuột.
                </p>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {docCleanerHighlights.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 rounded-xl border-0 bg-foreground/[0.04] p-3 text-xs font-medium text-foreground shadow-none dark:bg-foreground/[0.06] sm:text-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button
                    href="/blog/cach-tai-va-xem-tai-lieu-studocu-mien-phi-unblur-doccleaner"
                    variant="primary"
                    size="md"
                    className="h-10 rounded-xl border-0 shadow-none"
                  >
                    <BookOpen className="h-4 w-4" />
                    Xem Hướng Dẫn Chi Tiết
                  </Button>
                  <Button
                    href="https://github.com/khanhnkq/DocCleaner"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    size="md"
                    className="h-10 rounded-xl border-0 shadow-none"
                  >
                    <Github className="h-4 w-4" />
                    GitHub Repo
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <Link
                  href="/blog/cach-tai-va-xem-tai-lieu-studocu-mien-phi-unblur-doccleaner"
                  className="group block rounded-xl border-0 bg-foreground/[0.04] p-2 shadow-none transition-colors hover:bg-foreground/[0.07] dark:bg-foreground/[0.06]"
                >
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src="/images/blog/cach-tai-va-xem-tai-lieu-studocu-mien-phi-unblur-doccleaner.png"
                      alt="DocCleaner Studocu Unblur Tool"
                      width={800}
                      height={450}
                      className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      priority
                    />
                  </div>
                  <div className="flex items-center justify-between px-2 pb-1 pt-2.5 text-xs font-semibold text-muted-foreground transition-colors group-hover:text-foreground">
                    <span>Đọc hướng dẫn cài đặt & tải tool ngay</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Categories Filter Bar */}
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border/70 bg-card/85 p-5 shadow-none backdrop-blur-none md:flex-row md:items-center sm:p-6">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                Tất Cả Mẹo & Bài Viết Hướng Dẫn
              </h2>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Các phương pháp học tập khoa học, mẹo ôn thi và công cụ hỗ trợ
                mới nhất
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/meo"
                className="inline-flex h-9 items-center justify-center rounded-xl border-0 bg-primary px-4 font-heading text-xs font-semibold text-primary-foreground shadow-none"
              >
                Mẹo & Tool
              </Link>
              <Link
                href="/blog/category/meo-hoc-tap"
                className="inline-flex h-9 items-center justify-center rounded-xl border-0 bg-foreground/[0.04] px-4 font-heading text-xs font-semibold text-muted-foreground shadow-none transition-colors hover:bg-foreground/[0.08] hover:text-foreground dark:bg-foreground/[0.06]"
              >
                Mẹo học tập
              </Link>
              <Link
                href="/blog/category/ai-giao-duc"
                className="inline-flex h-9 items-center justify-center rounded-xl border-0 bg-foreground/[0.04] px-4 font-heading text-xs font-semibold text-muted-foreground shadow-none transition-colors hover:bg-foreground/[0.08] hover:text-foreground dark:bg-foreground/[0.06]"
              >
                AI giáo dục
              </Link>
              <Link
                href="/blog"
                className="inline-flex h-9 items-center justify-center rounded-xl border-0 bg-foreground/[0.04] px-4 font-heading text-xs font-semibold text-muted-foreground shadow-none transition-colors hover:bg-foreground/[0.08] hover:text-foreground dark:bg-foreground/[0.06]"
              >
                Xem tất cả Blog
              </Link>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayPosts.map((post) => (
              <ArticleCard key={post.frontmatter.slug} post={post} />
            ))}
          </div>

          {/* QuizKen Bridge CTA */}
          <div className="rounded-2xl border border-border/70 bg-card/85 p-8 shadow-none backdrop-blur-none sm:p-10">
            <div className="max-w-2xl space-y-4">
              <Badge>
                <Zap className="h-3.5 w-3.5" />
                Vòng Lặp Học Tập Đột Phá
              </Badge>
              <h2 className="font-heading text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                Đã Tải Được Tài Liệu PDF? Biến Ngay Thành Đề Trắc Nghiệm AI
                Trong 5 Giây!
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Đọc tài liệu thụ động khiến bạn chỉ nhớ được 20% kiến thức. Hãy
                kéo thả file PDF vừa tải từ Studocu/Scribd vào{" "}
                <strong className="text-foreground">QuizKen</strong> để AI tự
                động tạo bộ câu hỏi trắc nghiệm, giải thích chi tiết và
                flashcard ôn thi chủ động (Active Recall).
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  href={appLink("/")}
                  variant="primary"
                  size="md"
                  className="h-10 rounded-xl border-0 shadow-none"
                >
                  Tải File Lên Tạo Quiz Ngay
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  href="/howtouse"
                  variant="secondary"
                  size="md"
                  className="h-10 rounded-xl border-0 shadow-none"
                >
                  Xem Hướng Dẫn Sử Dụng
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
