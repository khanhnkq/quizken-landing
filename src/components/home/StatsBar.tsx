"use client";

import { Container } from "@/components/ui/Container";

const stats = [
  { value: "100.000+", label: "Bài kiểm tra đã tạo" },
  { value: "500+", label: "Trường học & Giáo viên tin dùng" },
  { value: "98.5%", label: "Tỷ lệ hài lòng" },
  { value: "< 3 Giây", label: "Thời gian AI tạo bài thi" },
];

export function StatsBar() {
  return (
    <section className="py-6 sm:py-10 bg-background">
      <Container>
        <div className="rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none p-4 sm:p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-4 sm:p-5 text-center"
              >
                <p className="font-heading text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                  {s.value}
                </p>
                <p className="mt-1.5 text-xs sm:text-sm font-medium text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
