"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { faqs } from "@/lib/content/faq";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative overflow-hidden bg-secondary/30 py-20 sm:py-28">
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40" />

      <Container className="relative z-10 max-w-4xl">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="eyebrow mb-4">Giải đáp thắc mắc</span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight mt-3">
            Câu Hỏi <span className="text-gradient">Thường Gặp</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Mọi thông tin bạn cần biết về tính năng, độ chính xác và cách sử dụng QuizKen.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-emerald-500 bg-white dark:bg-slate-900 shadow-lg"
                    : "border-border/80 bg-card hover:border-emerald-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left font-heading text-base sm:text-lg font-bold text-foreground cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className={`h-5 w-5 shrink-0 transition-colors ${isOpen ? "text-emerald-500" : "text-muted-foreground"}`} />
                    <span>{faq.question}</span>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base leading-relaxed text-muted-foreground border-t border-border/40 font-medium">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
