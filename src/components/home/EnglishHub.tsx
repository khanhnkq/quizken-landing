"use client";

import Image from "next/image";
import { BookOpen, Flame, Gem, Target, Trophy, ChevronRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { appLink } from "@/lib/site";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";

const HIGHLIGHTS = [
  { icon: BookOpen, label: "Lộ trình CEFR & TOEIC", desc: "Từ A1 đến C2, bài học có cấu trúc rõ ràng." },
  { icon: Flame, label: "Streak & XP", desc: "Giữ chuỗi ngày học, tích điểm kinh nghiệm mỗi ngày." },
  { icon: Gem, label: "Thu thập đá quý", desc: "Hoàn thành bài học để nhận phần thưởng vật lý." },
  { icon: Target, label: "Sổ tay từ vựng", desc: "Lưu từ khó, ôn tập spaced repetition." },
];

export function EnglishHub() {
  return (
    <section id="english-hub" className="relative overflow-hidden bg-secondary/20 py-20 sm:py-28">
      {/* Dot grid texture */}
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-30" />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Visual side: mascot with floating badge cards */}
          <ScrollReveal direction="right" delay={0.1}>
            <div className="relative mx-auto w-full max-w-md lg:mx-0">
              {/* Glow backdrop */}
              <div className="absolute inset-0 -m-8 rounded-3xl bg-gradient-to-br from-sky-200/20 via-emerald-100/10 to-rose-100/10 blur-3xl" />

              {/* Mascot image with glass frame */}
              <div className="glass relative overflow-hidden rounded-2xl p-2 ring-1 ring-border/30">
                <Image
                  src="/images/mascot-3d.png"
                  alt="QuizKen mascot studying English"
                  width={1024}
                  height={1024}
                  className="block h-auto w-full rounded-xl"
                  loading="lazy"
                />
              </div>

              {/* Floating badge: XP */}
              <div className="glass absolute -left-4 top-8 flex items-center gap-2 rounded-xl px-3 py-2 ring-1 ring-border/30 shadow-lg sm:-left-6">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-600 leading-tight">XP hôm nay</p>
                  <p className="text-sm font-700 text-primary">+240</p>
                </div>
              </div>

              {/* Floating badge: Streak */}
              <div className="glass absolute -right-2 bottom-20 flex items-center gap-2 rounded-xl px-3 py-2 ring-1 ring-border/30 shadow-lg sm:-right-4">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                  <Flame className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-600 leading-tight">Streak</p>
                  <p className="text-sm font-700 text-primary">47 ngày</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Text side */}
          <div>
            <ScrollReveal>
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-600 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400">
                <Trophy className="h-3.5 w-3.5" />
                English Hub
              </span>
              <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
                Hành trình tiếng Anh{" "}
                <span className="text-gradient">Zero to Hero</span>
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                Hệ thống bài học từ vựng, ngữ pháp, luyện nghe nói theo lộ trình
                cá nhân hóa. Kết hợp gamification để việc học trở nên thú vị như
                chơi game.
              </p>
            </ScrollReveal>

            <StaggerContainer className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2" stagger={0.08}>
              {HIGHLIGHTS.map((h) => {
                const Icon = h.icon;
                return (
                  <StaggerItem key={h.label} direction="left">
                    <div className="flex items-start gap-3 rounded-xl p-3 transition-colors duration-200 hover:bg-card">
                      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-200/60 dark:bg-sky-950/40 dark:text-sky-400 dark:ring-sky-800/40">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-600">{h.label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{h.desc}</p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            <ScrollReveal delay={0.4}>
              <Button href={appLink("/english")} className="mt-8" size="lg">
                Vào English Hub
                <ChevronRight className="h-4 w-4" />
              </Button>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
