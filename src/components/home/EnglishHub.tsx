"use client";

import Image from "next/image";
import { BookOpen, Flame, Gem, Target, Trophy, Sparkles, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { appLink } from "@/lib/site";

const HIGHLIGHTS = [
  { icon: BookOpen, label: "Lộ trình CEFR & TOEIC", desc: "Từ A1 đến C2, bài học chuẩn hóa quốc tế." },
  { icon: Flame, label: "Streak & Tích XP", desc: "Duy trì chuỗi ngày học để thăng hạng." },
  { icon: Gem, label: "Hệ thống phần thưởng", desc: "Tích đá quý mở khóa giao diện & huy hiệu." },
  { icon: Target, label: "Sổ tay từ vựng AI", desc: "Lưu từ khó, ôn tập phản xạ Spaced Repetition." },
];

export function EnglishHub() {
  return (
    <section id="english-hub" className="py-16 sm:py-24 bg-background">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Visual side */}
          <div className="mx-auto w-full max-w-md lg:mx-0 rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none p-3 space-y-3">
            <div className="rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] overflow-hidden">
              <Image
                src="/images/english_hub_path.png"
                alt="QuizKen English Hub Learning Path Preview"
                width={1024}
                height={1024}
                className="block h-auto w-full rounded-xl"
                loading="lazy"
              />
            </div>

            {/* Compact XP & Streak Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-0 shadow-none bg-foreground/[0.06] text-foreground">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">XP Hôm Nay</p>
                  <p className="font-heading text-sm font-bold text-primary">+240 XP</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-0 shadow-none bg-foreground/[0.06] text-foreground">
                  <Flame className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Streak Chuỗi Ngược</p>
                  <p className="font-heading text-sm font-bold text-foreground">47 Ngày</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div className="space-y-6">
            <Badge>
              <Trophy className="h-3.5 w-3.5" />
              <span>English Hub - Góc Học Tiếng Anh</span>
            </Badge>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-snug">
              Hành Trình Học Tiếng Anh <br className="hidden sm:block" />
              Zero to Hero Với AI
            </h2>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Hệ thống bài học từ vựng, ngữ pháp, luyện phản xạ theo lộ trình cá nhân hóa. Tự động chuyển giao bài tập thành dạng game hấp dẫn giúp bạn học không bao giờ chán.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {HIGHLIGHTS.map((h, i) => {
                const Icon = h.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06]"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-0 shadow-none bg-foreground/[0.06] text-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-heading font-bold text-sm text-foreground">{h.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{h.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Button href={appLink("/english")} size="lg" className="h-11 rounded-xl border-0 shadow-none font-bold">
                <span>Khám Phá English Hub</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
