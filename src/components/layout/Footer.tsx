"use client";

import Link from "next/link";
import { Sparkles, Star, Music, Heart, ArrowRight, Facebook, Youtube, Github, Mail } from "lucide-react";
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="footer" className="relative pt-24 pb-12 overflow-hidden bg-gradient-to-b from-secondary/30 via-background to-background">
      {/* Peeking Floating Background Icons */}
      <div className="absolute top-10 left-[8%] opacity-20 hidden md:block animate-bounce-slow" style={{ animationDelay: "0s" }}>
        <Star className="w-24 h-24 text-primary rotate-[-12deg]" />
      </div>
      <div className="absolute top-16 right-[12%] opacity-20 hidden md:block animate-bounce-slow" style={{ animationDelay: "1s" }}>
        <Music className="w-20 h-20 text-primary rotate-[12deg]" />
      </div>
      <div className="absolute bottom-40 left-[18%] opacity-15 hidden lg:block animate-bounce-slow" style={{ animationDelay: "0.5s" }}>
        <Heart className="w-16 h-16 text-primary rotate-[6deg]" />
      </div>

      {/* Hero CTA Section in Footer */}
      <Container className="relative z-10 mb-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex justify-center p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full shadow-lg mb-2 animate-bounce-slow border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-10 h-10 text-primary fill-primary" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight bg-gradient-to-br from-primary via-emerald-600 to-teal-700 bg-clip-text text-transparent">
              Tạo Bài Kiểm Tra AI Miễn Phí
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
              Trải nghiệm sức mạnh của AI trong việc soạn đề thi và học tập. Bắt đầu ngay trên trình duyệt mà không cần cài đặt!
            </p>
          </div>

          <div className="flex justify-center pt-4 relative">
            <Button
              href={appLink("/")}
              size="lg"
              className="relative z-10 px-10 py-7 text-lg sm:text-xl rounded-[2rem] shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 border-[6px] border-white/80 dark:border-slate-800/80 ring-4 ring-primary/20 hover:ring-primary/40 font-heading font-extrabold flex items-center gap-3 bg-primary text-primary-foreground cursor-pointer"
            >
              <span>Tạo Quiz Ngay Bây Giờ</span>
              <div className="bg-white/20 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-sm">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-3 -right-3 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md transform rotate-12 animate-pulse">
                Miễn phí!
              </div>
            </Button>
          </div>
        </div>
      </Container>

      {/* Main Footer Links & Social */}
      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-t-2 border-dashed border-primary/20 pt-12">
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-4">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground font-medium">
              Nền tảng tạo bài kiểm tra trắc nghiệm bằng AI và học tiếng Anh hàng đầu cho giáo viên và học sinh Việt Nam. Tiết kiệm thời gian, tăng cảm hứng học tập.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid h-10 w-10 place-items-center rounded-2xl border border-border bg-card text-muted-foreground transition-all hover:border-primary hover:text-primary hover:scale-110 shadow-sm"
              >
                <Facebook className="h-4.5 w-4.5" />
              </a>
              <a
                href={SITE.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="grid h-10 w-10 place-items-center rounded-2xl border border-border bg-card text-muted-foreground transition-all hover:border-primary hover:text-primary hover:scale-110 shadow-sm"
              >
                <Youtube className="h-4.5 w-4.5" />
              </a>
              <a
                href={SITE.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="grid h-10 w-10 place-items-center rounded-2xl border border-border bg-card text-muted-foreground transition-all hover:border-primary hover:text-primary hover:scale-110 shadow-sm"
              >
                <Github className="h-4.5 w-4.5" />
              </a>
              <a
                href={`mailto:${SITE.email}`}
                aria-label="Email"
                className="grid h-10 w-10 place-items-center rounded-2xl border border-border bg-card text-muted-foreground transition-all hover:border-primary hover:text-primary hover:scale-110 shadow-sm"
              >
                <Mail className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          {footerNav.map((col) => (
            <div key={col.title} className="space-y-4">
              <h3 className="font-heading text-base font-bold text-foreground tracking-wide">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
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

        {/* Copyright & Made with Love */}
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-medium">
          <p className="flex items-center gap-2">
            <span>Được làm với</span>
            <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
            <span>bởi đội ngũ QuizKen</span>
          </p>
          <p>
            © {year} QuizKen. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </Container>
    </footer>
  );
}
