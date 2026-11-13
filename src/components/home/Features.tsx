"use client";

import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import MascotCard from "@/components/mascot-3d/MascotCard";
import type { ExpressionId } from "@/components/mascot-3d/cat/expressions";

const pastelColors = [
  {
    bg: "bg-gradient-to-br from-pink-100 to-pink-50 dark:from-pink-900/50 dark:to-pink-950/30",
    border: "border-pink-200 dark:border-pink-900",
  },
  {
    bg: "bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/50 dark:to-amber-950/30",
    border: "border-amber-200 dark:border-amber-900",
  },
  {
    bg: "bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/50 dark:to-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-900",
  },
  {
    bg: "bg-gradient-to-br from-sky-100 to-sky-50 dark:from-sky-900/50 dark:to-sky-950/30",
    border: "border-sky-200 dark:border-sky-900",
  },
  {
    bg: "bg-gradient-to-br from-violet-100 to-violet-50 dark:from-violet-900/50 dark:to-violet-950/30",
    border: "border-violet-200 dark:border-violet-900",
  },
  {
    bg: "bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-900/50 dark:to-rose-950/30",
    border: "border-rose-200 dark:border-rose-900",
  },
];

const featuresList: {
  emotion: ExpressionId;
  title: string;
  description: string;
}[] = [
  {
    emotion: "surprised",
    title: "AI Soạn Đề Tự Động",
    description: "Nhập bài học, văn bản hoặc tài liệu bất kỳ. AI sẽ tự động phân tích và tạo bộ trắc nghiệm đầy đủ đáp án & giải thích.",
  },
  {
    emotion: "cool",
    title: "Tốc Độ Nhanh Tức Thì",
    description: "Chỉ mất chưa tới 3 giây để AI hoàn thành bộ 50 câu hỏi trắc nghiệm, tiết kiệm 95% thời gian cho giáo viên.",
  },
  {
    emotion: "happy",
    title: "Đa Dạng 100+ Môn Học",
    description: "Hỗ trợ đầy đủ các môn Toán, Lịch sử, Địa lý, Sinh học, Vật lý và đặc biệt chuyên sâu cho luyện thi Tiếng Anh.",
  },
  {
    emotion: "laughing",
    title: "Chấm Điểm & Giải Thích",
    description: "Hệ thống tự động chấm điểm bài làm và cung cấp lời giải thích chi tiết cho từng đáp án giúp người học hiểu sâu.",
  },
  {
    emotion: "angry",
    title: "Game Đấu Trực Tuyến",
    description: "Tạo phòng thi đấu trắc nghiệm thời gian thực cho lớp học hoặc nhóm bạn cùng ôn thi thêm phần hào hứng.",
  },
  {
    emotion: "sleepy",
    title: "Xuất PDF & Word Đẹp",
    description: "Tải bài kiểm tra dưới định dạng PDF/Word được định dạng sẵn chuyên nghiệp để in ấn hoặc chia sẻ ngay.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-gradient-to-b from-secondary/30 via-background to-secondary/20 dark:from-slate-900/40 dark:via-slate-950 dark:to-slate-900/40 py-20 sm:py-28 px-4"
    >
      {/* Floating Background Decorative Blobs */}
      <div className="absolute top-20 left-[5%] w-16 h-16 rounded-full bg-pink-200/40 animate-bounce-slow" />
      <div className="absolute top-40 right-[10%] w-12 h-12 rounded-2xl bg-amber-200/40 rotate-12 animate-bounce-slow [animation-delay:0.5s]" />
      <div className="absolute bottom-32 left-[15%] w-10 h-10 rounded-full bg-emerald-200/40 animate-bounce-slow [animation-delay:1s]" />
      <div className="absolute bottom-20 right-[20%] w-14 h-14 rounded-3xl bg-violet-200/40 -rotate-12 animate-bounce-slow [animation-delay:1.5s]" />

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex justify-center p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full shadow-lg mb-6 animate-bounce-slow border border-emerald-200 dark:border-emerald-800">
            <Star className="w-9 h-9 text-[#B5CC89] fill-[#B5CC89]" />
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-heading mb-6 tracking-tight">
            Tính Năng Nổi Bật Của <span className="text-gradient">QuizKen</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            Công nghệ AI tiên tiến kết hợp với trải nghiệm học tập gamification giúp việc tạo và làm đề thi trở nên thú vị và hiệu quả hơn bao giờ hết.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuresList.map((feature, index) => {
            const color = pastelColors[index % pastelColors.length];

            return (
              <div
                key={index}
                className={`
                  group cursor-pointer
                  rounded-3xl border-4 ${color.border}
                  bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm
                  shadow-[0_8px_30px_rgba(0,0,0,0.06),inset_0_2px_0_rgba(255,255,255,0.8)]
                  dark:shadow-[0_8px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
                  hover:shadow-[0_16px_40px_rgba(0,0,0,0.12),inset_0_2px_0_rgba(255,255,255,0.9)]
                  dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]
                  hover:-translate-y-3 hover:rotate-1
                  transition-all duration-300 ease-out
                  p-6 sm:p-8 text-center space-y-5
                `}
              >
                {/* 3D Mascot Stage */}
                <div
                  className={`
                    mx-auto w-28 h-28 sm:w-32 sm:h-32 rounded-3xl
                    ${color.bg}
                    shadow-inner border border-white/60 dark:border-white/10
                    relative overflow-hidden group-hover:scale-110 group-hover:-rotate-2
                    transition-all duration-300 flex items-center justify-center
                  `}
                >
                  <MascotCard
                    emotion={feature.emotion}
                    cameraPosition={[0, 0.05, 5.8]}
                    autoPoke={true}
                    autoPokeInterval={5000 + (index % 3) * 800}
                    className="w-full h-full"
                  />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold font-heading tracking-tight text-foreground">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
