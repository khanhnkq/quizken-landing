"use client";

import { useState } from "react";
import { Zap, Sparkles, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { appLink } from "@/lib/site";
import MascotCard from "@/components/mascot-3d/MascotCard";

export function FinalCta() {
  const [pokeKey, setPokeKey] = useState(0);

  return (
    <section className="py-16 sm:py-24 bg-background">
      <Container>
        <div className="rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none p-6 sm:p-10 lg:p-12">
          <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left lg:gap-12">
            {/* Mascot 3D Stage */}
            <div className="shrink-0">
              <div
                onClick={() => setPokeKey((k) => k + 1)}
                className="mx-auto h-48 w-48 sm:h-56 sm:w-56 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] overflow-hidden cursor-pointer select-none flex items-center justify-center"
                title="Chạm vào tớ để chơi đùa!"
              >
                <MascotCard
                  emotion="happy"
                  cameraPosition={[0, 0.05, 5.2]}
                  pokeKey={pokeKey}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Text & CTAs */}
            <div className="max-w-2xl space-y-5">
              <Badge className="mx-auto lg:mx-0">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dùng Thử Miễn Phí 100% Không Cần Đăng Ký</span>
              </Badge>

              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
                Sẵn Sàng Tạo Bài Kiểm Tra <br className="hidden sm:block" />
                Đầu Tiên Bằng AI Trong 3 Giây?
              </h2>

              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Tham gia cùng hơn 500+ trường học, 100.000+ đề thi đã được biên soạn bởi QuizKen. Tạo bài thi trắc nghiệm chuyên nghiệp hoàn toàn miễn phí ngay trên trình duyệt!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                <Button
                  href={appLink("/")}
                  size="lg"
                  className="w-full sm:w-auto h-11 rounded-xl border-0 shadow-none font-bold"
                >
                  <span>Tạo Quiz Ngay Trực Tiếp</span>
                  <Zap className="w-4 h-4" />
                </Button>

                <Button
                  href={appLink("/english")}
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto h-11 rounded-xl border-0 shadow-none"
                >
                  <span>Góc Học Tiếng Anh</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
