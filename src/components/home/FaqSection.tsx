"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { faqs } from "@/lib/content/faq";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 sm:py-24 bg-background">
      <Container className="max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
          <Badge>Giải đáp thắc mắc</Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Câu Hỏi Thường Gặp
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Mọi thông tin bạn cần biết về tính năng, độ chính xác và cách sử dụng QuizKen.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-heading text-base sm:text-lg font-bold text-foreground cursor-pointer border-0 shadow-none"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle
                      className={`h-5 w-5 shrink-0 transition-colors ${
                        isOpen ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
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
                      <p className="rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] mx-5 mb-5 p-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
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
