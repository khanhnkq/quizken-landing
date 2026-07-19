"use client";

import Image from "next/image";
import { Zap, Sparkles, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { appLink } from "@/lib/site";

export function FinalCta() {
  return (
    <section className="py-20 sm:py-28 relative">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border-4 border-emerald-300 dark:border-emerald-800 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white p-8 sm:p-14 lg:p-20 shadow-2xl">
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-15 bg-dot-grid" />

          <div className="relative z-10 flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left lg:gap-12">
            {/* Mascot / Visual */}
            <div className="shrink-0">
              <div className="relative mx-auto h-40 w-40 lg:h-52 lg:w-52 animate-bounce-slow">
                <div className="absolute inset-0 rounded-full bg-white/20 blur-2xl" />
                <Image
                  src="/images/mascot-happy.png"
                  alt="QuizKen Mascot"
                  width={320}
                  height={320}
                  className="relative h-full w-full object-contain drop-shadow-2xl"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Text & CTAs */}
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-yellow-300 border border-white/30">
                <Sparkles className="w-4 h-4 fill-yellow-300" />
                Dùng Thử Miễn Phí 100% Không Cần Đăng Ký
              </div>

              <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Sẵn Sàng Tạo Bài Kiểm Tra <br className="hidden sm:block" />
                Đầu Tiên Bằng AI Trong 3 Giây?
              </h2>

              <p className="text-emerald-100 text-base sm:text-lg leading-relaxed font-medium">
                Tham gia cùng hơn 500+ trường học, 100.000+ đề thi đã được biên soạn bởi QuizKen. Tạo bài thi trắc nghiệm chuyên nghiệp hoàn toàn miễn phí ngay trên trình duyệt!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Button
                  href={appLink("/")}
                  size="lg"
                  className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 rounded-[2rem] shadow-2xl font-heading font-800 bg-yellow-400 text-slate-900 hover:bg-yellow-300 border-4 border-white/30 flex items-center justify-center gap-3"
                >
                  <span>Tạo Quiz Ngay Trực Tiếp</span>
                  <Zap className="w-5 h-5 fill-current" />
                </Button>

                <Button
                  href={appLink("/english")}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 rounded-[2rem] border-2 border-white/40 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 font-bold flex items-center justify-center gap-2"
                >
                  <span>Góc Học Tiếng Anh</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
