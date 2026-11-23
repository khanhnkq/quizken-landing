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
  title: "Mẹo Học Tập & 58 Công Cụ Tiện Ích Sinh Viên Miễn Phí | QuizKen",
  description:
    "Tổng hợp 58 công cụ học tập & văn phòng chạy 100% trên trình duyệt, tiện ích chế độ đọc tập trung (Reader Mode), mẹo khai thác học liệu mở Open Access và công nghệ AI ôn thi đỉnh cao.",
  path: "/meo",
  keywords: [
    "mẹo học tập",
    "công cụ sinh viên",
    "chế độ đọc tập trung reader mode",
    "học liệu mở open access",
    "doccleaner reader mode",
    "công cụ tính điểm và lập trình miễn phí",
    "tiện ích học tập chrome",
    "mẹo ôn thi hiệu quả",
  ],
});

const docCleanerHighlights = [
  "Chế độ đọc tập trung (Reader Mode) cho tài liệu công khai",
  "Ẩn thanh điều hướng & khung hiển thị gây xao nhãng",
  "Hỗ trợ căn chỉnh bố cục in ấn A4 rõ nét cho bài giảng mở",
  "58 công cụ học tập & dev chạy 100% Client-Side tại /cong-cu",
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
          "reader mode",
          "học liệu",
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
              <span>Thư viện Tiện ích & Thủ thuật Học tập Hợp pháp</span>
            </Badge>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Kho Mẹo & Công Cụ Học Tập Đỉnh Cao
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Tổng hợp 58 công cụ học tập, văn phòng và lập trình chạy 100% trên
              trình duyệt, cùng hướng dẫn bật chế độ đọc tập trung (Reader Mode)
              và khai thác kho học liệu mở (Open Access) hợp pháp giúp học sinh,
              sinh viên tiết kiệm hàng giờ mỗi tuần.
            </p>
          </div>

          {/* Featured Spotlight: Reader Mode & Client-Side Tools */}
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none backdrop-blur-none sm:p-8">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="space-y-5 lg:col-span-7">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>Tiện Ích Học Tập</Badge>
                  <Badge>Reader Mode & Open Access</Badge>
                  <Badge>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    100% Client-Side & Tuân thủ Bản quyền
                  </Badge>
                </div>

                <h2 className="font-heading text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-3xl">
                  Tối Ưu Giao Diện Đọc Tập Trung (Reader Mode) & 58 Công Cụ Học Tập Miễn Phí
                </h2>

                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Bộ giải pháp giúp sinh viên tối ưu không gian đọc tài liệu học
                  thuật công khai trên trình duyệt (ẩn thanh bên gây xao nhãng,
                  căn chỉnh khổ giấy in A4 cho các bài giảng được phép chia sẻ)
                  kết hợp hệ sinh thái 58 công cụ tính điểm, trộn đề Word, lập
                  trình Python và mật mã học chạy trực tiếp trên thiết bị.
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
                    href="/cong-cu"
                    variant="primary"
                    size="md"
                    className="h-10 rounded-xl border-0 shadow-none"
                  >
                    <Wrench className="h-4 w-4" />
                    Mở 58 Công Cụ Miễn Phí
                  </Button>
                  <Button
                    href="/blog/bat-reader-mode-cho-studocu-vn-va-scribd-khong-banner-quang-cao"
                    variant="secondary"
                    size="md"
                    className="h-10 rounded-xl border-0 shadow-none"
                  >
                    <BookOpen className="h-4 w-4" />
                    Hướng Dẫn Reader Mode
                  </Button>
                  <Button
                    href="https://github.com/khanhnkq"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    size="md"
                    className="h-10 rounded-xl border-0 shadow-none"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <Link
                  href="/blog/bat-reader-mode-cho-studocu-vn-va-scribd-khong-banner-quang-cao"
                  className="group block rounded-xl border-0 bg-foreground/[0.04] p-2 shadow-none transition-colors hover:bg-foreground/[0.07] dark:bg-foreground/[0.06]"
                >
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src="/images/blog/cach-tai-va-xem-tai-lieu-studocu-mien-phi-unblur-doccleaner.png"
                      alt="Chế độ đọc tập trung Reader Mode cho tài liệu học tập"
                      width={800}
                      height={450}
                      className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      priority
                    />
                  </div>
                  <div className="flex items-center justify-between px-2 pb-1 pt-2.5 text-xs font-semibold text-muted-foreground transition-colors group-hover:text-foreground">
                    <span>Đọc hướng dẫn tối ưu giao diện Reader Mode</span>
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
                Đã Có Giáo Trình & Bài Giảng PDF? Biến Ngay Thành Đề Trắc Nghiệm AI
                Trong 5 Giây!
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Đọc tài liệu thụ động khiến bạn chỉ nhớ được 20% kiến thức. Hãy
                kéo thả file PDF giáo trình hoặc ghi chú cá nhân của bạn vào{" "}
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
