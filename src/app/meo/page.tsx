import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Wrench,
  Download,
  Github,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  BookOpen,
  Laptop,
} from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { buildMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { JsonLd } from "@/components/JsonLd";
import { BackgroundDecorations } from "@/components/ui/BackgroundDecorations";

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

      <div className="relative py-12 sm:py-20 overflow-hidden">
        <BackgroundDecorations density="low" />

        <Container className="relative z-10 space-y-16">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-sm">
              <Wrench className="h-4 w-4" />
              <span>Thư viện Tiện ích & Thủ thuật Công nghệ</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-6xl font-black tracking-tight text-foreground">
              Kho Mẹo & Công Cụ{" "}
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Học Tập Đỉnh Cao
              </span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground font-medium leading-relaxed">
              Tổng hợp tiện ích mã nguồn mở, mẹo tải tài liệu không giới hạn, unblur Studocu/Scribd và các công cụ công nghệ giúp học sinh, sinh viên tiết kiệm hàng giờ mỗi tuần.
            </p>
          </div>

          {/* Featured Spotlight: DocCleaner */}
          <div className="relative rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-card to-card p-6 sm:p-10 shadow-xl overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-500 text-white text-xs font-heading font-extrabold px-3 py-1 shadow-sm">
                    Công Cụ Nổi Bật #1
                  </span>
                  <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-muted-foreground">
                    Chrome Extension v1.3
                  </span>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Miễn phí & An toàn
                  </span>
                </div>

                <h2 className="font-heading text-2xl sm:text-4xl font-black text-foreground tracking-tight leading-snug">
                  DocCleaner: Unblur & Tải Tài Liệu Studocu, Scribd Chuẩn HD 1-Click
                </h2>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Tiện ích mở rộng thông minh giúp sinh viên tự động gỡ bỏ lớp làm mờ (unblur) trên Studocu qua CloudFront signature, chặn sạch quảng cáo phiền toái, tự động preload trang chống lỗi trắng và xuất file PDF in ấn chuẩn A4 sắc nét chỉ với 1 cú click chuột.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-medium text-foreground/90">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Unblur 100% trang khóa Studocu & Scribd</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Chặn sạch Ads, Popup VIP & Cookie Banner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Auto-scroll preload chống mất trang khi xuất PDF</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Mã nguồn mở an toàn trên GitHub (khanhnkq)</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    href="/blog/cach-tai-va-xem-tai-lieu-studocu-mien-phi-unblur-doccleaner"
                    size="md"
                    className="rounded-full px-6 font-heading font-extrabold shadow-md"
                  >
                    <BookOpen className="w-4 h-4 mr-1.5" />
                    Xem Hướng Dẫn Chi Tiết
                  </Button>
                  <Button
                    href="https://github.com/khanhnkq/DocCleaner"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="md"
                    className="rounded-full px-5 font-heading font-bold"
                  >
                    <Github className="w-4 h-4 mr-1.5" />
                    GitHub Repo
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <Link
                  href="/blog/cach-tai-va-xem-tai-lieu-studocu-mien-phi-unblur-doccleaner"
                  className="group relative block rounded-2xl overflow-hidden border border-border shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/20"
                >
                  <Image
                    src="/images/blog/cach-tai-va-xem-tai-lieu-studocu-mien-phi-unblur-doccleaner.png"
                    alt="DocCleaner Studocu Unblur Tool"
                    width={800}
                    height={450}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-bold font-heading flex items-center gap-1.5">
                      Đọc hướng dẫn cài đặt & tải tool ngay <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Categories Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                Tất Cả Mẹo & Bài Viết Hướng Dẫn
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Các phương pháp học tập khoa học, mẹo ôn thi và công cụ hỗ trợ mới nhất
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/meo"
                className="rounded-full px-4 py-1.5 text-xs font-heading font-bold bg-primary text-white border border-primary shadow-sm"
              >
                Mẹo & Tool
              </Link>
              <Link
                href="/blog/category/meo-hoc-tap"
                className="rounded-full px-4 py-1.5 text-xs font-heading font-bold bg-card text-muted-foreground border border-border hover:border-emerald-400 hover:text-foreground transition-all"
              >
                Mẹo học tập
              </Link>
              <Link
                href="/blog/category/ai-giao-duc"
                className="rounded-full px-4 py-1.5 text-xs font-heading font-bold bg-card text-muted-foreground border border-border hover:border-emerald-400 hover:text-foreground transition-all"
              >
                AI giáo dục
              </Link>
              <Link
                href="/blog"
                className="rounded-full px-4 py-1.5 text-xs font-heading font-bold bg-card text-muted-foreground border border-border hover:border-emerald-400 hover:text-foreground transition-all"
              >
                Xem tất cả Blog
              </Link>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayPosts.map((post) => (
              <ArticleCard key={post.frontmatter.slug} post={post} />
            ))}
          </div>

          {/* QuizKen Bridge CTA */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-8 sm:p-12 text-white shadow-2xl">
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wide backdrop-blur-md">
                <Zap className="w-3.5 h-3.5 fill-current" />
                Vòng Lặp Học Tập Đột Phá
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Đã Tải Được Tài Liệu PDF? Biến Ngay Thành Đề Trắc Nghiệm AI Trong 5 Giây!
              </h2>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                Đọc tài liệu thụ động khiến bạn chỉ nhớ được 20% kiến thức. Hãy kéo thả file PDF vừa tải từ Studocu/Scribd vào <strong>QuizKen</strong> để AI tự động tạo bộ câu hỏi trắc nghiệm, giải thích chi tiết và flashcard ôn thi chủ động (Active Recall).
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  href={appLink("/")}
                  size="lg"
                  className="rounded-full bg-white text-emerald-800 hover:bg-emerald-50 px-8 font-heading font-extrabold shadow-lg"
                >
                  Tải File Lên Tạo Quiz Ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  href="/howtouse"
                  variant="outline"
                  size="lg"
                  className="rounded-full border-white/40 text-white hover:bg-white/10 px-6 font-heading font-bold"
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
