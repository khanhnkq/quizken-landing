"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { extendedFaqs } from "@/lib/content/faq";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { appLink } from "@/lib/site";

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-background">
      <section className="py-14 sm:py-20">
        <Container className="text-center">
          <div className="mx-auto max-w-3xl space-y-4">
            <Badge>
              <HelpCircle className="h-3.5 w-3.5" />
              Hỗ trợ & Giải đáp
            </Badge>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Câu hỏi thường gặp
            </h1>
            <p className="mx-auto max-w-lg text-base text-muted-foreground">
              Mọi thắc mắc về QuizKen, từ cách sử dụng, tính năng, cho đến bảo
              mật dữ liệu. Không tìm thấy câu trả lời? Liên hệ trực tiếp với
              chúng tôi.
            </p>
            <div className="pt-2">
              <Button
                href={appLink("/")}
                variant="primary"
                size="md"
                className="h-10 rounded-xl border-0 shadow-none"
              >
                Thử QuizKen ngay
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <dl className="mx-auto max-w-3xl space-y-3">
            {extendedFaqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-border/70 bg-card/85 shadow-none backdrop-blur-none"
                >
                  <dt>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground transition-colors hover:bg-foreground/[0.03] sm:text-base"
                    >
                      <span>{faq.question}</span>
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
                      "overflow-hidden px-5 transition-all duration-200",
                      isOpen ? "max-h-96 pb-5" : "max-h-0 pb-0",
                    )}
                  >
                    <div className="rounded-xl border-0 bg-foreground/[0.04] p-4 shadow-none dark:bg-foreground/[0.06]">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  </dd>
                </div>
              );
            })}
          </dl>
        </Container>
      </section>
    </div>
  );
}
