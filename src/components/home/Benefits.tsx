"use client";

import { CheckCircle2, GraduationCap, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { benefits } from "@/lib/content/benefits";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import { cn } from "@/lib/utils";

const audienceIcons = [GraduationCap, BookOpen];
const audienceAccents = [
  "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400",
];

export function Benefits() {
  return (
    <section id="benefits" className="py-20 sm:py-28">
      <Container>
        <ScrollReveal>
          <span className="eyebrow">Dành cho ai</span>
          <h2 className="mt-4 max-w-lg font-heading text-3xl tracking-tight sm:text-4xl">
            Thiết kế cho từng đối tượng
          </h2>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {benefits.map(({ audience, data }, idx) => {
            const Icon = audienceIcons[idx];
            const accent = audienceAccents[idx];

            return (
              <ScrollReveal
                key={audience}
                delay={idx * 0.15}
                direction={idx === 0 ? "left" : "right"}
              >
                <div
                  className={cn(
                    "group relative h-full overflow-hidden rounded-2xl border border-border/40 p-7 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 sm:p-8",
                    idx === 0
                      ? "bg-gradient-to-br from-emerald-50/60 via-card to-card dark:from-emerald-950/20 dark:via-card dark:to-card"
                      : "bg-gradient-to-br from-sky-50/60 via-card to-card dark:from-sky-950/20 dark:via-card dark:to-card"
                  )}
                >
                  {/* Decorative blob */}
                  <div
                    className={cn(
                      "pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl transition-opacity duration-500 opacity-20 group-hover:opacity-30",
                      idx === 0
                        ? "bg-emerald-400"
                        : "bg-sky-400"
                    )}
                  />

                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center justify-center rounded-xl p-2.5 ring-1 ring-inset ring-current/15 ${accent}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-600",
                          idx === 0
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300"
                        )}
                      >
                        {audience}
                      </span>
                    </div>

                    <h3 className="mt-5 font-heading text-xl font-600 leading-snug">
                      {data.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {data.description}
                    </p>

                    <StaggerContainer className="mt-6 space-y-3" stagger={0.06}>
                      {data.items.map((item) => (
                        <StaggerItem key={item}>
                          <div className="flex items-start gap-3 text-sm">
                            <CheckCircle2
                              className={cn(
                                "mt-0.5 h-4 w-4 shrink-0",
                                idx === 0
                                  ? "text-emerald-500"
                                  : "text-sky-500"
                              )}
                            />
                            <span className="text-foreground/85">{item}</span>
                          </div>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
