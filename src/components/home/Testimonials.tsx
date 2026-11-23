"use client";

import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { testimonials } from "@/lib/content/testimonials";
import { Star } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
          <Badge>Đánh giá người dùng</Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Học Sinh & Giáo Viên Nói Gì Về QuizKen
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Hàng ngàn người dùng đã tiết kiệm hàng trăm giờ soạn đề và nâng cao kết quả học tập mỗi ngày.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none p-6 flex flex-col justify-between gap-5"
            >
              <div className="space-y-4">
                {/* Star Rating */}
                <div className="flex items-center gap-1 text-foreground/80">
                  {[...Array(5)].map((_, sIdx) => (
                    <Star key={sIdx} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm sm:text-base leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-0 shadow-none bg-foreground/[0.06] text-sm font-bold text-foreground">
                  {t.initial}
                </span>
                <div>
                  <p className="font-heading text-sm font-bold text-foreground leading-snug">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
