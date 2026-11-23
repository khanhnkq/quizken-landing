"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Facebook, Youtube, Github, Mail } from "lucide-react";
import { SITE, appLink } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const footerNav: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Sản phẩm",
    links: [
      { label: "Tạo Quiz AI", href: appLink("/"), external: true },
      { label: "English Hub", href: appLink("/english"), external: true },
      { label: "Đấu trường Game", href: appLink("/game/lobby"), external: true },
      { label: "Thư viện Quiz", href: appLink("/quiz/library"), external: true },
    ],
  },
  {
    title: "Tài nguyên",
    links: [
      { label: "Mẹo & Tool học tập", href: "/meo" },
      { label: "Hướng dẫn sử dụng", href: "/howtouse" },
      { label: "Bài viết Blog", href: "/blog" },
      { label: "Câu hỏi FAQ", href: "/faq" },
      { label: "Số liệu nền tảng", href: "/stats" },
      { label: "Tính năng nổi bật", href: "/#features" },
      { label: "Cách thức hoạt động", href: "/#how-it-works" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="relative pt-16 pb-12 bg-background border-t border-border/70">
      <Container className="space-y-12">
        {/* Compact Frosted CTA Card */}
        <div className="w-full rounded-2xl bg-card/85 border border-border/70 shadow-none p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-foreground/[0.06] px-2.5 py-1 text-xs font-semibold text-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Miễn phí trên trình duyệt</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-foreground">
              Tạo Bài Kiểm Tra AI Miễn Phí
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Trải nghiệm sức mạnh của AI trong việc soạn đề thi và học tập. Bắt đầu ngay mà không cần cài đặt.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button href={appLink("/")} size="lg" className="h-11 px-6 rounded-xl font-bold border-0 shadow-none">
              <span>Tạo Quiz Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Footer Links & Social */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-4">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Nền tảng tạo bài kiểm tra trắc nghiệm bằng AI và học tiếng Anh hàng đầu cho giáo viên và học sinh Việt Nam. Tiết kiệm thời gian, tăng cảm hứng học tập.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid h-10 w-10 place-items-center rounded-xl border-0 bg-foreground/[0.06] text-muted-foreground transition-colors hover:bg-foreground/[0.10] hover:text-foreground shadow-none"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={SITE.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="grid h-10 w-10 place-items-center rounded-xl border-0 bg-foreground/[0.06] text-muted-foreground transition-colors hover:bg-foreground/[0.10] hover:text-foreground shadow-none"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href={SITE.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="grid h-10 w-10 place-items-center rounded-xl border-0 bg-foreground/[0.06] text-muted-foreground transition-colors hover:bg-foreground/[0.10] hover:text-foreground shadow-none"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${SITE.email}`}
                aria-label="Email"
                className="grid h-10 w-10 place-items-center rounded-xl border-0 bg-foreground/[0.06] text-muted-foreground transition-colors hover:bg-foreground/[0.10] hover:text-foreground shadow-none"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          {footerNav.map((col) => (
            <div key={col.title} className="space-y-3.5">
              <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>Phát triển bởi đội ngũ QuizKen</p>
          <p>© {year} QuizKen. Tất cả quyền được bảo lưu.</p>
        </div>
      </Container>
    </footer>
  );
}
