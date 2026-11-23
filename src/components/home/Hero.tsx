"use client";

import { useState, useRef } from "react";
import { Sparkles, Brain, Zap, Layout, CheckCircle, Play } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { appLink } from "@/lib/site";
import MascotCard from "@/components/mascot-3d/MascotCard";
import type { ExpressionId } from "@/components/mascot-3d/cat/expressions";

const FEATURES = [
  {
    id: 1,
    name: "AI Power",
    role: "Generator",
    icon: Brain,
    desc: "Tạo đề thi trắc nghiệm thông minh tự động từ văn bản & tài liệu học tập trong vài giây.",
    power: "98/100",
  },
  {
    id: 2,
    name: "Speed",
    role: "Instant",
    icon: Zap,
    desc: "Tốc độ biên soạn cực nhanh, hoàn thành bộ 50 câu hỏi trắc nghiệm chỉ trong 3 giây.",
    power: "99/100",
  },
  {
    id: 3,
    name: "Format",
    role: "Flexible",
    icon: Layout,
    desc: "Hỗ trợ đa dạng câu hỏi Trắc nghiệm 4 lựa chọn, Đúng/Sai, Điền từ & Xuất PDF/Word.",
    power: "95/100",
  },
];

const FEATURE_EMOTION_MAP: Record<number, ExpressionId> = {
  1: "happy",
  2: "cool",
  3: "laughing",
};

export function Hero() {
  const [activeFeature, setActiveFeature] = useState(FEATURES[0]);
  const [pokeKey, setPokeKey] = useState(0);

  const heroRef = useRef<HTMLElement>(null);
  const pointerRef = useRef<{ x: number; y: number; inside: boolean }>({
    x: 0,
    y: 0,
    inside: false,
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointerRef.current = {
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
      inside: true,
    };
  };

  const handlePointerLeave = () => {
    pointerRef.current = { x: 0, y: 0, inside: false };
  };

  const triggerPoke = () => {
    setPokeKey((k) => k + 1);
  };

  return (
    <section
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative py-14 sm:py-20 lg:py-24 bg-background"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* LEFT COLUMN: Text Content */}
          <div className="space-y-6 text-center lg:text-left order-2 lg:order-1">
            <Badge className="mx-auto lg:mx-0">
              <Sparkles className="w-3.5 h-3.5 text-foreground" />
              <span>AI Quiz Generator hàng đầu</span>
            </Badge>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.12]">
              Tạo Đề Trắc Nghiệm{" "}
              <br className="hidden md:block" />
              Bằng AI Thông Minh
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Biến mọi đoạn văn bản, tài liệu bài học thành bộ quiz trắc nghiệm tương tác sinh động chỉ trong 3 giây. Hoàn toàn miễn phí cho giáo viên và học sinh!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              <Button
                href={appLink("/")}
                size="lg"
                className="w-full sm:w-auto h-11 rounded-xl border-0 shadow-none font-bold"
              >
                <span>Tạo Quiz Ngay</span>
                <Zap className="w-4 h-4" />
              </Button>

              <Button
                href="#features"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto h-11 rounded-xl border-0 shadow-none"
              >
                <span>Khám Phá Tính Năng</span>
                <Play className="w-4 h-4" />
              </Button>
            </div>

            {/* Feature Tags */}
            <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-2.5">
              {[
                { icon: CheckCircle, text: "Miễn phí 100%" },
                { icon: CheckCircle, text: "Xuất file PDF & Word" },
                { icon: CheckCircle, text: "Hỗ trợ 100+ môn học" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground bg-foreground/[0.06] px-3 py-1.5 rounded-lg border-0 shadow-none"
                >
                  <item.icon className="w-4 h-4 text-primary shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: 3D Mascot Showcase Card */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none p-4 sm:p-5 space-y-4">
              {/* 3D Mascot Stage */}
              <div className="relative h-64 sm:h-72 w-full rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] overflow-hidden flex items-center justify-center">
                <MascotCard
                  emotion={FEATURE_EMOTION_MAP[activeFeature.id] || "happy"}
                  pointerRef={pointerRef}
                  pokeKey={pokeKey}
                  onPoke={triggerPoke}
                  className="w-full h-full"
                />
              </div>

              {/* Internal Mode Selector Tabs */}
              <div className="grid grid-cols-3 gap-1.5 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-1">
                {FEATURES.map((f) => {
                  const Icon = f.icon;
                  const isActive = activeFeature.id === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActiveFeature(f)}
                      className={`flex items-center justify-center gap-1.5 h-9 px-2 rounded-lg border-0 shadow-none text-xs font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{f.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Feature Info Well */}
              <div className="rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground tracking-tight">
                    {activeFeature.name}
                  </h3>
                  <Badge>{activeFeature.role}</Badge>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {activeFeature.desc}
                </p>

                {/* Stat Power Bar */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                    <span>AI Power Level</span>
                    <span className="text-primary">{activeFeature.power}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-foreground/[0.08] overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: activeFeature.power.replace("/100", "%") }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
