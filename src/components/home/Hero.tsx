"use client";

import { useState } from "react";
import { Sparkles, Brain, Zap, Layout, CheckCircle, Play } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { appLink } from "@/lib/site";
import { BackgroundDecorations } from "@/components/ui/BackgroundDecorations";

const FEATURES = [
  {
    id: 1,
    name: "AI Power",
    role: "Generator",
    icon: Brain,
    color: "bg-primary/20 text-primary",
    desc: "Tạo đề thi trắc nghiệm thông minh tự động từ văn bản & tài liệu học tập trong vài giây.",
    power: "98/100",
  },
  {
    id: 2,
    name: "Speed",
    role: "Instant",
    icon: Zap,
    color: "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300",
    desc: "Tốc độ biên soạn cực nhanh, hoàn thành bộ 50 câu hỏi trắc nghiệm chỉ trong 3 giây.",
    power: "99/100",
  },
  {
    id: 3,
    name: "Format",
    role: "Flexible",
    icon: Layout,
    color: "bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300",
    desc: "Hỗ trợ đa dạng câu hỏi Trắc nghiệm 4 lựa chọn, Đúng/Sai, Điền từ & Xuất PDF/Word.",
    power: "95/100",
  },
];

export function Hero() {
  const [activeFeature, setActiveFeature] = useState(FEATURES[0]);

  return (
    <section className="relative min-h-[90vh] md:min-h-screen pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden flex items-center bg-background">
      {/* Background Floating Animals & Objects */}
      <BackgroundDecorations density="high" />

      {/* Generalized Background Ambient Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 mix-blend-screen filter blur-[80px] opacity-40 animate-blob" />
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-amber-400/20 mix-blend-screen filter blur-[80px] opacity-40 animate-blob [animation-delay:2s]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] rounded-full bg-sky-400/20 mix-blend-screen filter blur-[80px] opacity-40 animate-blob [animation-delay:4s]" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Text Content */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left order-2 lg:order-1 px-1 sm:px-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs sm:text-sm shadow-sm mx-auto lg:mx-0">
              <Sparkles className="w-3.5 h-3.5 fill-primary text-primary" />
              <span>AI Quiz Generator hàng đầu</span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-[2.5rem] leading-[1.15] sm:text-5xl sm:leading-[1.1] md:text-6xl xl:text-7xl font-black tracking-tight text-foreground drop-shadow-sm">
              Tạo{" "}
              <span className="text-primary relative inline-block">
                Đề Trắc Nghiệm
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-emerald-400 -z-10"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 50 10 100 5"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                  />
                </svg>
              </span>
              <br className="hidden md:block" />
              Bằng <span className="text-primary">AI</span> Thông Minh
            </h1>

            {/* Description */}
            <p className="text-[15px] sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium px-4 md:px-0">
              Biến mọi đoạn văn bản, tài liệu bài học thành bộ quiz trắc nghiệm tương tác sinh động chỉ trong 3 giây. Hoàn toàn miễn phí cho giáo viên và học sinh!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                href={appLink("/")}
                size="lg"
                className="w-full sm:w-auto text-base sm:text-lg px-6 py-6 sm:px-8 sm:py-7 rounded-[2rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 font-black bg-primary text-primary-foreground hover:bg-primary/90 border-4 border-white/20 flex items-center justify-center gap-3"
              >
                <span>Tạo Quiz Ngay</span>
                <div className="bg-white/20 p-2 rounded-full hidden sm:block">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-current fill-current" />
                </div>
              </Button>

              <Button
                href="#features"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base sm:text-lg px-6 py-6 sm:px-8 sm:py-7 rounded-[2rem] border-2 font-bold transition-all border-border hover:border-primary/50 hover:bg-card text-foreground hover:text-primary flex items-center justify-center gap-2"
              >
                <span>Khám Phá Tính Năng</span>
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </Button>
            </div>

            {/* Feature Tags/Mini-list */}
            <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-4">
              {[
                { icon: CheckCircle, text: "Miễn phí 100%" },
                { icon: CheckCircle, text: "Xuất file PDF & Word" },
                { icon: CheckCircle, text: "Hỗ trợ 100+ môn học" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm font-bold text-muted-foreground bg-card px-3.5 py-1.5 rounded-full shadow-sm border border-border"
                >
                  <item.icon className="w-4 h-4 text-primary" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: App Hero Character Card Showcase */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end h-[460px] sm:h-[540px] items-center">
            {/* Background Shapes for Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] bg-primary/5 rounded-[3rem] -rotate-6 z-0" />

            {/* Main Card (The Character / Feature Card) */}
            <div className="relative z-10 w-full max-w-md aspect-[4/5] rounded-[3rem] bg-card shadow-2xl border-4 border-card flex flex-col overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
              
              {/* Illustration Area */}
              <div className={`flex-1 ${activeFeature.color} relative flex items-center justify-center p-8 transition-colors duration-500`}>
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage:
                      "radial-gradient(currentColor 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                {/* Animated Feature Icon */}
                <activeFeature.icon
                  className="w-40 h-40 sm:w-48 sm:h-48 drop-shadow-2xl filter transition-all duration-500 animate-float"
                  strokeWidth={1.5}
                />
              </div>

              {/* Card Info Area */}
              <div className="p-6 bg-card/90 backdrop-blur-md relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight font-heading">
                      {activeFeature.name}
                    </h3>
                    <p className="text-muted-foreground font-bold text-xs uppercase tracking-wider">
                      {activeFeature.role}
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-secondary font-bold text-secondary-foreground text-xs border border-border">
                    lvl 99
                  </div>
                </div>

                <p className="text-muted-foreground font-medium leading-relaxed text-xs sm:text-sm">
                  {activeFeature.desc}
                </p>

                {/* Stat Power Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-bold text-muted-foreground">
                    <span>AI Power Level</span>
                    <span className="text-primary">{activeFeature.power}</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: activeFeature.power.replace("/100", "%") }}
                    />
                  </div>
                </div>
              </div>

              {/* Floating Selector Cards */}
              <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2">
                {FEATURES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFeature(f)}
                    className={`flex items-center gap-2.5 p-2.5 bg-card/95 backdrop-blur-md rounded-2xl shadow-xl border-2 transition-all duration-200 hover:scale-105 text-left w-40 cursor-pointer ${
                      activeFeature.id === f.id
                        ? "border-primary ring-2 ring-primary/20 shadow-primary/20"
                        : "border-border/80"
                    }`}
                  >
                    <div className={`p-1.5 rounded-xl ${f.color}`}>
                      <f.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-xs font-heading">
                        {f.name}
                      </div>
                      <div className="text-[9px] text-muted-foreground font-bold uppercase">
                        {f.role}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Floating Verified Badge (Top Right) */}
              <div className="absolute top-6 right-6 bg-card/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border-2 border-border animate-float hidden sm:block">
                <div className="flex items-center gap-2.5">
                  <div className="bg-primary/15 p-2 rounded-full text-primary">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-black text-foreground text-xs font-heading">
                      Verified AI
                    </div>
                    <div className="text-[10px] text-muted-foreground font-bold">
                      Top Rated Quiz Maker
                    </div>
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
