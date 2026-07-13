import Image from "next/image";
import { Sparkles, Zap, FileDown, Coins } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { appLink } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
      {/* Gradient mesh background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute left-[10%] top-[5%] h-[460px] w-[460px] rounded-full bg-primary/20 blur-[120px] animate-blob" />
        <span className="absolute right-[8%] top-[10%] h-[380px] w-[380px] rounded-full bg-amber-300/25 blur-[120px] animate-blob [animation-delay:3s]" />
        <span className="absolute bottom-0 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-sky-300/20 blur-[120px] animate-blob [animation-delay:6s]" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-dot-grid opacity-60" />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          {/* Text */}
          <div className="max-w-xl">
            <span className="eyebrow">
              <Sparkles className="h-3.5 w-3.5" />
              Được tạo bởi AI
            </span>

            <h1 className="mt-5 font-heading text-[2.6rem] leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.2rem]">
              Tạo{" "}
              <span className="relative whitespace-nowrap">
                <span className="text-gradient">Bài Kiểm Tra</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full text-primary/40"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9C40 3 80 3 120 6C150 8 180 7 198 4"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              với <span className="text-gradient">AI</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              QuizKen giúp giáo viên và học sinh tạo bài kiểm tra trắc nghiệm
              với AI trong vài giây. Hỗ trợ 100+ chủ đề, tự động chấm điểm, xuất
              PDF miễn phí.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={appLink("/")} size="lg">
                <Zap className="h-4 w-4" />
                Tạo Quiz Ngay
              </Button>
              <Button href="#features" variant="outline" size="lg">
                Khám phá tính năng
              </Button>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Miễn phí 100%
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileDown className="h-3.5 w-3.5" />
                Xuất PDF
              </span>
              <span className="inline-flex items-center gap-1.5">
                Tiếng Việt &amp; English
              </span>
            </div>
          </div>

          {/* Visual: mascot + floating UI cards */}
          <div className="relative mx-auto h-[360px] w-full max-w-md lg:h-[480px] lg:max-w-none">
            {/* Glow disc behind mascot */}
            <div className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/30 via-emerald-300/20 to-transparent blur-2xl" />

            {/* Mascot */}
            <div className="absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2 animate-float">
              <Image
                src="/images/hero_mockup.png"
                alt="QuizKen AI Quiz Dashboard Preview"
                width={640}
                height={640}
                priority
                className="h-auto w-full drop-shadow-2xl rounded-2xl"
              />
            </div>

            {/* Floating card: streak */}
            <div className="absolute left-0 top-6 glass rounded-2xl border border-border/60 p-3 shadow-xl shadow-primary/10 animate-float [animation-delay:1.5s] sm:left-2">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-xl dark:bg-amber-950/50">
                  🔥
                </span>
                <div>
                  <p className="font-heading text-sm font-600 leading-none">47 ngày</p>
                  <p className="text-[11px] text-muted-foreground">Streak học tập</p>
                </div>
              </div>
            </div>

            {/* Floating card: XP */}
            <div className="absolute right-0 top-1/3 glass rounded-2xl border border-border/60 p-3 shadow-xl shadow-primary/10 animate-float [animation-delay:2.8s] sm:right-2">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary">
                  <Coins className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-heading text-sm font-600 leading-none">+250 XP</p>
                  <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                    <span className="block h-full w-3/4 rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating card: AI status */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass rounded-2xl border border-border/60 px-4 py-2.5 shadow-xl shadow-primary/10 animate-float [animation-delay:0.8s]">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <p className="text-xs font-600">AI vừa tạo xong 10 câu hỏi</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
