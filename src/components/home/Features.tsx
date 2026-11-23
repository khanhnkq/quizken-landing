"use client";

import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import MascotCard from "@/components/mascot-3d/MascotCard";
import type { ExpressionId } from "@/components/mascot-3d/cat/expressions";

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
    <section id="features" className="py-16 sm:py-24 bg-background">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
          <Badge>
            <Sparkles className="w-3.5 h-3.5 text-foreground" />
            <span>Tính năng nổi bật</span>
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Tính Năng Nổi Bật Của QuizKen
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Công nghệ AI tiên tiến kết hợp với trải nghiệm học tập gamification giúp việc tạo và làm đề thi trở nên thú vị và hiệu quả hơn bao giờ hết.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {featuresList.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none p-6 text-center space-y-4 transition-colors duration-200"
            >
              {/* 3D Mascot Stage */}
              <div className="mx-auto w-full h-36 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] overflow-hidden flex items-center justify-center">
                <MascotCard
                  emotion={feature.emotion}
                  cameraPosition={[0, 0.05, 5.8]}
                  autoPoke={true}
                  autoPokeInterval={5000 + (index % 3) * 800}
                  className="w-full h-full"
                />
              </div>

              {/* Title */}
              <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
