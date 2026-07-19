"use client";

import { Container } from "@/components/ui/Container";
import { testimonials } from "@/lib/content/testimonials";
import { Star } from "lucide-react";

const cardBorders = [
  "border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20",
  "border-sky-200 dark:border-sky-900 bg-sky-50/40 dark:bg-sky-950/20",
  "border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20",
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28 relative">
      <Container>
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="eyebrow mb-4">Đánh giá người dùng</span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight mt-3">
            Học Sinh & Giáo Viên <span className="text-gradient">Nói Gì Về QuizKen</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Hàng ngàn người dùng đã tiết kiệm hàng trăm giờ soạn đề và nâng cao kết quả học tập mỗi ngày.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => {
            const borderClass = cardBorders[i % cardBorders.length];

            return (
              <div
                key={i}
                className={`group relative rounded-3xl border-4 ${borderClass} p-7 sm:p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl space-y-6 flex flex-col justify-between`}
              >
                <div className="space-y-4">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, sIdx) => (
                      <Star key={sIdx} className="h-5 w-5 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-sm sm:text-base leading-relaxed text-foreground font-medium italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-4 border-t border-border/60">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-2xl text-base font-bold text-white shadow-md ${t.accent}`}
                  >
                    {t.initial}
                  </span>
                  <div>
                    <p className="font-heading text-base font-bold text-foreground leading-snug">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
