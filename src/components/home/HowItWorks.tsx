"use client";

import { MessageSquareText, Sparkles, ClipboardCheck, FileDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

const steps = [
  {
    icon: MessageSquareText,
    title: "1. Nhập chủ đề hoặc tài liệu",
    description: "Gõ bất kỳ đề tài nào: Lịch sử Việt Nam, TOEIC Reading, Sinh học 10... hoặc dán văn bản bài học.",
    number: "01",
  },
  {
    icon: Sparkles,
    title: "2. AI tạo bộ trắc nghiệm",
    description: "AI Gemini xử lý và tự động biên soạn câu hỏi, 4 phương án lựa chọn kèm đáp án và giải thích chi tiết.",
    number: "02",
  },
  {
    icon: ClipboardCheck,
    title: "3. Làm bài & Chấm tự động",
    description: "Thực hành làm quiz ngay trên ứng dụng web hoặc mobile. Chấm điểm tức thì và xem ngay gợi ý ôn tập.",
    number: "03",
  },
  {
    icon: FileDown,
    title: "4. Xuất PDF / Thi đấu Game",
    description: "Tải file PDF bài thi để in cho học sinh hoặc mở phòng Game Đấu Đối Kháng trực tuyến thời gian thực.",
    number: "04",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-background">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
          <Badge>Cách thức hoạt động</Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Bốn Bước Nhanh Chóng, Xong Ngay Đề Thi
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Quy trình tạo đề thi đơn giản chưa từng có giúp giáo viên & học sinh tiết kiệm hàng giờ soạn bài.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none p-6 space-y-4 flex flex-col"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-0 shadow-none bg-foreground/[0.06] text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="inline-flex items-center rounded-lg border-0 shadow-none bg-foreground/[0.06] px-2.5 py-1 text-xs font-bold text-foreground">
                    {s.number}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold tracking-tight text-foreground leading-snug">
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
