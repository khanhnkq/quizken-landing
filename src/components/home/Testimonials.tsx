"use client";

import { Container } from "@/components/ui/Container";
import { testimonials, stats } from "@/lib/content/testimonials";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import { Star, Users, FileQuestion, Clock } from "lucide-react";

const statIcons = [FileQuestion, Users, Star, Clock];

/** Per-testimonial card background accents */
const cardAccents = [
  "bg-emerald-50/50 dark:bg-emerald-950/20",
  "bg-sky-50/50 dark:bg-sky-950/20",
  "bg-rose-50/50 dark:bg-rose-950/20",
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <ScrollReveal>
          <span className="eyebrow">Feedback</span>
          <h2 className="mt-4 max-w-md font-heading text-3xl tracking-tight sm:text-4xl">
            Người dùng nói gì về QuizKen
          </h2>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Testimonial cards: first card spans 2 cols */}
          {testimonials.map((t, i) => (
            <ScrollReveal
              key={t.name}
              delay={i * 0.1}
              direction={i === 0 ? "up" : i === 1 ? "right" : "left"}
              className={i === 0 ? "lg:col-span-2" : ""}
            >
              <div
                className={`group relative h-full rounded-2xl border border-border/40 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 sm:p-8 ${cardAccents[i]}`}
              >
                {/* Large quote mark */}
                <svg
                  className="absolute top-5 right-5 h-10 w-10 text-primary/8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.681 11 13.148 11 15c0 1.933-1.567 3.5-3.5 3.5-1.073 0-2.099-.49-2.917-1.179M13.583 17.321C12.553 16.227 12 15 12 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C18.591 11.681 20 13.148 20 15c0 1.933-1.567 3.5-3.5 3.5-1.073 0-2.099-.49-2.917-1.179" />
                </svg>

                <p className="relative text-sm leading-relaxed text-foreground/90 sm:text-base">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <footer className="mt-6 flex items-center gap-3">
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-full text-sm font-700 text-white ${t.accent}`}
                  >
                    {t.initial}
                  </span>
                  <div>
                    <p className="text-sm font-600 leading-snug">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </footer>
              </div>
            </ScrollReveal>
          ))}

          {/* Stats card: fills the gap in the last row */}
          <ScrollReveal delay={0.3} direction="up">
            <div className="glass relative h-full rounded-2xl p-6 ring-1 ring-border/30 sm:p-8">
              <h3 className="font-heading text-lg font-600">QuizKen trong số</h3>
              <div className="mt-6 grid grid-cols-2 gap-6">
                {stats.map((s, i) => {
                  const Icon = statIcons[i];
                  return (
                    <div key={s.label}>
                      <Icon className="mb-2 h-5 w-5 text-primary" />
                      <p className="text-2xl font-800 tracking-tight text-foreground sm:text-3xl">
                        {s.value}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
