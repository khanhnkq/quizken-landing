"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { appLink } from "@/lib/site";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function FinalCta() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-gradient-to-br from-primary/8 via-card to-sky-100/30 dark:from-primary/12 dark:via-card dark:to-sky-950/20 px-8 py-16 sm:px-14 sm:py-20">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-sky-300/10 blur-3xl" />
            <div className="pointer-events-none absolute right-1/4 top-1/3 h-32 w-32 rounded-full bg-rose-200/10 blur-2xl" />

            {/* Dot grid overlay */}
            <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-20" />

            <div className="relative flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left lg:gap-12">
              {/* Mascot */}
              <div className="shrink-0">
                <div className="relative mx-auto h-36 w-36 lg:h-44 lg:w-44">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/15 to-sky-200/15 blur-2xl" />
                  <Image
                    src="/images/mascot-happy.png"
                    alt="QuizKen mascot"
                    width={320}
                    height={320}
                    className="relative h-full w-full drop-shadow-lg"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="max-w-xl">
                <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
                  Sẵn sàng tạo bài kiểm tra đầu tiên?
                </h2>
                <p className="mt-4 text-base text-muted-foreground">
                  Tham gia cùng hàng nghìn giáo viên và học sinh đang dùng QuizKen
                  mỗi ngày. Không cần cài đặt, không cần thẻ tín dụng.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <Button href={appLink("/")} size="lg">
                    Tạo quiz miễn phí
                  </Button>
                  <Button href={appLink("/english")} variant="outline" size="lg">
                    Học tiếng Anh ngay
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
