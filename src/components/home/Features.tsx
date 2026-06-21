"use client";

import { features, accentStyles } from "@/lib/content/features";
import { Container } from "@/components/ui/Container";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/ScrollReveal";

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <Container>
        <StaggerContainer>
          <StaggerItem>
            <span className="eyebrow">Tính năng nổi bật</span>
            <h2 className="mt-4 max-w-lg font-heading text-3xl tracking-tight sm:text-4xl">
              Mọi công cụ bạn cần, trong một nền tảng
            </h2>
          </StaggerItem>
        </StaggerContainer>

        {/* Bento grid: 9 features in asymmetric layout */}
        <StaggerContainer
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.06}
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            const style = accentStyles[f.accent];

            // Make first card span 2 cols on lg for hero feature
            const isHero = i === 0;
            const spanClass = isHero ? "sm:col-span-2 lg:col-span-2" : "";

            return (
              <StaggerItem key={f.title} className={spanClass}>
                <div
                  className={`group relative h-full overflow-hidden rounded-2xl border border-border/40 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 sm:p-8 ${style.bg}`}
                >
                  {/* Subtle radial glow on hover */}
                  <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-current opacity-0 transition-opacity duration-500 group-hover:opacity-[0.04]" />

                  <span
                    className={`inline-flex items-center justify-center rounded-xl p-2.5 ${style.bg} ring-1 ${style.ring}`}
                  >
                    <Icon className={`h-5 w-5 ${style.icon}`} />
                  </span>

                  <h3 className="mt-4 font-heading text-lg font-600 leading-snug">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>

                  {/* Decorative accent dot */}
                  <span
                    className={`absolute bottom-4 right-4 h-2 w-2 rounded-full ${style.icon} opacity-30 transition-opacity group-hover:opacity-60`}
                  />
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </Container>
    </section>
  );
}
