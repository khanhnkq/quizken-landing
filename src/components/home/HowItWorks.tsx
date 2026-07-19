"use client";

import { MessageSquareText, Sparkles, ClipboardCheck, FileDown } from "lucide-react";
import { Container } from "@/components/ui/Container";

const steps = [
  {
    icon: MessageSquareText,
    title: "1. Nhập chủ đề hoặc tài liệu",
    description: "Gõ bất kỳ đề tài nào: Lịch sử Việt Nam, TOEIC Reading, Sinh học 10... hoặc dán văn bản bài học.",
    accentBg: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-900",
    number: "01",
  },
  {
    icon: Sparkles,
    title: "2. AI tạo bộ trắc nghiệm",
    description: "AI Gemini xử lý và tự động biên soạn câu hỏi, 4 phương án lựa chọn kèm đáp án và giải thích chi tiết.",
    accentBg: "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-900",
    number: "02",
  },
  {
    icon: ClipboardCheck,
    title: "3. Làm bài & Chấm tự động",
    description: "Thực hành làm quiz ngay trên ứng dụng web hoặc mobile. Chấm điểm tức thì và xem ngay gợi ý ôn tập.",
    accentBg: "bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300",
    border: "border-sky-200 dark:border-sky-900",
    number: "03",
  },
  {
    icon: FileDown,
    title: "4. Xuất PDF / Thi đấu Game",
    description: "Tải file PDF bài thi để in cho học sinh hoặc mở phòng Game Đấu Đối Kháng trực tuyến thời gian thực.",
    accentBg: "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-900",
    number: "04",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-secondary/30 py-20 sm:py-28">
      {/* Background Dot Texture */}
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40" />

      <Container className="relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="eyebrow mb-4">Cách thức hoạt động</span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight mt-3">
            Bốn Bước Nhanh Chóng, <span className="text-gradient">Xong Ngay Đề Thi</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Quy trình tạo đề thi đơn giản chưa từng có giúp giáo viên & học sinh tiết kiệm hàng giờ soạn bài.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className={`group relative h-full rounded-3xl border-4 ${s.border} bg-white/90 dark:bg-slate-900/90 p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl space-y-4 overflow-hidden`}
              >
                {/* Large Watermark Step Number */}
                <span className="absolute -right-2 -top-2 font-heading text-7xl font-bold text-primary/[0.08] leading-none select-none">
                  {s.number}
                </span>

                <div className={`inline-flex p-4 rounded-2xl ${s.accentBg} shadow-inner transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="font-heading text-xl font-bold tracking-tight text-foreground leading-snug">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
