"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { extendedFaqs } from "@/lib/content/faq";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { appLink } from "@/lib/site";

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <section className="py-16 sm:py-24">
        <Container className="max-w-3xl text-center">
          <h1 className="font-heading text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            Câu hỏi thường gặp
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
            Mọi thắc mắc về QuizKen, từ cách sử dụng, tính năng, cho đến bảo mật
            dữ liệu. Không tìm thấy câu trả lời? Liên hệ trực tiếp với chúng
            tôi.
          </p>
          <Button href={appLink("/")} className="mt-6" variant="outline">
            Thử QuizKen ngay
          </Button>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container className="max-w-3xl">
          <dl className="space-y-3">
            {extendedFaqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-border/60 bg-card transition-colors"
                >
                  <dt>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-600 transition-colors hover:text-primary sm:text-base"
                    >
                      {faq.question}
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>
                  </dt>
                  <dd
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      isOpen ? "max-h-96 pb-5" : "max-h-0",
                    )}
                  >
                    <p className="px-5 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </dd>
                </div>
              );
            })}
          </dl>
        </Container>
      </section>
    </>
  );
}
