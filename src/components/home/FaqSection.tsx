"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { faqs } from "@/lib/content/faq";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="relative overflow-hidden bg-secondary/20 py-20 sm:py-28">
      {/* Dot grid texture */}
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-30" />

      <Container className="relative max-w-3xl">
        <ScrollReveal>
          <span className="eyebrow">FAQ</span>
          <h2 className="mt-4 font-heading text-3xl tracking-tight sm:text-4xl">
            Câu hỏi thường gặp
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Những thắc mắc phổ biến nhất về QuizKen.
          </p>
        </ScrollReveal>

        <StaggerContainer className="mt-10 space-y-3" stagger={0.04}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <StaggerItem key={i}>
                <div
                  className={`group rounded-xl border transition-all duration-300 ${
                    isOpen
                      ? "border-primary/20 bg-primary/[0.03] shadow-sm shadow-primary/5"
                      : "border-border/50 bg-card hover:border-primary/10"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-600 transition-colors hover:text-primary sm:text-base"
                  >
                    <HelpCircle className={`h-4.5 w-4.5 shrink-0 transition-colors duration-200 ${isOpen ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="flex-1">{faq.question}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: reduce ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={reduce ? {} : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 pl-12 text-sm leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </Container>
    </section>
  );
}
