"use client";

import Image from "next/image";
import { BookOpen, Flame, Gem, Target, Trophy, Sparkles, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { appLink } from "@/lib/site";

const HIGHLIGHTS = [
  { icon: BookOpen, label: "Lộ trình CEFR & TOEIC", desc: "Từ A1 đến C2, bài học chuẩn hóa quốc tế." },
  { icon: Flame, label: "Streak & Tích XP", desc: "Duy trì chuỗi ngày học để thăng hạng." },
  { icon: Gem, label: "Hệ thống phần thưởng", desc: "Tích đá quý mở khóa giao diện & huy hiệu." },
  { icon: Target, label: "Sổ tay từ vựng AI", desc: "Lưu từ khó, ôn tập phản xạ Spaced Repetition." },
];

export function EnglishHub() {
  return (
    <section id="english-hub" className="relative overflow-hidden bg-gradient-to-b from-sky-50/50 via-background to-emerald-50/30 dark:from-sky-950/20 dark:via-slate-950 dark:to-emerald-950/20 py-20 sm:py-28">
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-30" />

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* Visual side */}
          <div className="relative mx-auto w-full max-w-md lg:mx-0">
            <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-br from-sky-300/30 via-emerald-200/20 to-transparent blur-3xl -z-10" />

            <div className="rounded-3xl border-4 border-sky-200 dark:border-sky-900 bg-white/90 dark:bg-slate-900/90 p-3 shadow-2xl overflow-hidden">
              <Image
                src="/images/english_hub_path.png"
                alt="QuizKen English Hub Learning Path Preview"
                width={1024}
                height={1024}
                className="block h-auto w-full rounded-2xl"
                loading="lazy"
              />
            </div>

            {/* Floating badges */}
            <div className="glass absolute -left-4 top-8 flex items-center gap-3 rounded-2xl p-3 border border-border shadow-xl">
              <span className="p-2.5 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-muted-foreground">XP Hôm Nay</p>
                <p className="font-heading text-base font-bold text-emerald-600">+240 XP</p>
              </div>
            </div>

            <div className="glass absolute -right-2 bottom-16 flex items-center gap-3 rounded-2xl p-3 border border-border shadow-xl">
              <span className="p-2.5 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300">
                <Flame className="h-5 w-5 animate-bounce" />
              </span>
              <div>
                <p className="text-xs font-bold text-muted-foreground">Streak Chuỗi Ngược</p>
                <p className="font-heading text-base font-bold text-rose-500">47 Ngày</p>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 dark:bg-sky-950/60 px-4 py-1.5 text-xs font-bold text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              <Trophy className="h-4 w-4" />
              English Hub - Góc Học Tiếng Anh
            </span>

            <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-snug">
              Hành Trình Học Tiếng Anh <br className="hidden sm:block" />
              <span className="text-gradient">Zero to Hero Với AI</span>
            </h2>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Hệ thống bài học từ vựng, ngữ pháp, luyện phản xạ theo lộ trình cá nhân hóa. Tự động chuyển giao bài tập thành dạng game hấp dẫn giúp bạn học không bao giờ chán.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {HIGHLIGHTS.map((h, i) => {
                const Icon = h.icon;
                return (
                  <div key={i} className="flex items-start gap-3.5 p-4 rounded-2xl bg-card border border-border/80 shadow-sm hover:border-sky-300 transition-all">
                    <span className="p-2.5 rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300 shrink-0">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-heading font-bold text-sm text-foreground">{h.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{h.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4">
              <Button href={appLink("/english")} size="lg" className="rounded-[2rem] px-8 py-4 font-heading font-bold text-base shadow-xl">
                Khám Phá English Hub
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
