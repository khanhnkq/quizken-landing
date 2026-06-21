"use client";

import { MessageSquareText, Sparkles, ClipboardCheck, FileDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";

const steps = [
  {
    icon: MessageSquareText,
    title: "Nhập chủ đề",
    description: "Gõ bất kỳ chủ đề nào: TOEIC Reading, lịch sử Việt Nam, sinh học lớp 10...",
    accent: "bg-emerald-50 text-emerald-600 ring-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800/40",
    number: "01",
  },
  {
    icon: Sparkles,
    title: "AI tạo quiz",
    description: "Google Gemini tạo bộ câu hỏi trắc nghiệm kèm đáp án và giải thích chi tiết.",
    accent: "bg-amber-50 text-amber-600 ring-amber-200/60 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-800/40",
    number: "02",
  },
  {
    icon: ClipboardCheck,
    title: "Làm & kiểm tra",
    description: "Làm quiz ngay trên trình duyệt. Chấm điểm tự động, xem kết quả tức thì.",
    accent: "bg-sky-50 text-sky-600 ring-sky-200/60 dark:bg-sky-950/40 dark:text-sky-400 dark:ring-sky-800/40",
    number: "03",
  },
  {
    icon: FileDown,
    title: "Xuất PDF",
    description: "Tải đề kiểm tra dưới dạng PDF chuyên nghiệp để in ấn hoặc chia sẻ.",
    accent: "bg-rose-50 text-rose-600 ring-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-800/40",
    number: "04",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-secondary/20 py-20 sm:py-28">
      {/* Dot grid texture */}
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40" />

      <Container className="relative">
        <ScrollReveal>
          <span className="eyebrow">Cách hoạt động</span>
          <h2 className="mt-4 max-w-md font-heading text-3xl tracking-tight sm:text-4xl">
            Bốn bước, vài giây, xong đề
          </h2>
        </ScrollReveal>

        <StaggerContainer className="relative mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <StaggerItem key={s.title}>
                <div className="group relative h-full rounded-2xl border border-border/40 bg-card p-6 transition-all duration-300 hover:border-primary/15 hover:shadow-lg hover:shadow-primary/5 sm:p-7">
                  {/* Step number watermark */}
                  <span className="absolute -right-1 -top-1 font-heading text-6xl font-800 text-primary/[0.06] leading-none select-none sm:text-7xl">
                    {s.number}
                  </span>

                  <span className={`relative grid h-12 w-12 place-items-center rounded-xl ring-1 ${s.accent} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="h-5 w-5" />
                  </span>

                  <h3 className="relative mt-4 font-heading text-lg font-600 leading-snug">
                    {s.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </Container>
    </section>
  );
}
