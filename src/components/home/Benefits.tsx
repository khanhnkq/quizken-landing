"use client";

import { CheckCircle2, GraduationCap, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";

const audienceList = [
  {
    audience: "Dành Cho Giáo Viên & Giảng Viên",
    title: "Tiết Kiệm 95% Thời Gian Soạn Đề Thi Trắc Nghiệm",
    description: "Không còn cảnh mất hàng giờ đồng hồ tìm kiếm câu hỏi hoặc gõ lại đề từ sách giáo khoa.",
    icon: GraduationCap,
    accentBg: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300",
    border: "border-emerald-300 dark:border-emerald-800",
    gradient: "from-emerald-50/80 via-white to-emerald-50/30 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900",
    checkColor: "text-emerald-500",
    items: [
      "Tự động tạo bộ đề kiểm tra 15 phút, 1 tiết, học kỳ chỉ với 1 cú click.",
      "Xuất file PDF & Word sắc nét có kèm ma trận đề thi & lời giải chi tiết.",
      "Tổ chức thi trắc nghiệm online hoặc chiếu đề lên bảng tương tác trên lớp.",
      "Đa dạng hình thức: Nhiều lựa chọn, Đúng/Sai, Điền từ vào chỗ trống.",
    ],
  },
  {
    audience: "Dành Cho Học Sinh & Sinh Viên",
    title: "Học Tập Gamified - Ôn Thi Không Còn Nhàn Chán",
    description: "Biến lý thuyết khô khan thành bài trắc nghiệm tương tác giúp ghi nhớ lâu gấp 3 lần.",
    icon: BookOpen,
    accentBg: "bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300",
    border: "border-sky-300 dark:border-sky-800",
    gradient: "from-sky-50/80 via-white to-sky-50/30 dark:from-sky-950/30 dark:via-slate-900 dark:to-slate-900",
    checkColor: "text-sky-500",
    items: [
      "Tạo đề ôn tập tức thì theo từng chương sách giáo khoa hoặc đề thi thử.",
      "Chế độ Streak tích điểm XP, duy trì thói quen học tập hàng ngày.",
      "Thách đấu kiến thức trực tuyến với bạn bè trong Game Lobby.",
      "Xem ngay giải thích chi tiết vì sao đúng/sai để rút kinh nghiệm nhanh.",
    ],
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="py-20 sm:py-28 relative">
      <Container>
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="eyebrow mb-4">Đối tượng sử dụng</span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight mt-3">
            Giải Pháp Hoàn Hảo Cho <span className="text-gradient">Mọi Nhu Cầu</span>
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {audienceList.map((item, idx) => {
            const Icon = item.icon;

            return (
              <div
                key={idx}
                className={`group relative rounded-3xl border-4 ${item.border} bg-gradient-to-br ${item.gradient} p-8 sm:p-10 shadow-xl transition-all duration-300 hover:-translate-y-2 space-y-6 overflow-hidden`}
              >
                <div className="flex items-center gap-3">
                  <span className={`p-3.5 rounded-2xl ${item.accentBg} shadow-inner`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-heading font-bold text-sm px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-border shadow-sm">
                    {item.audience}
                  </span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground leading-snug">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {item.description}
                </p>

                <ul className="space-y-3.5 pt-2">
                  {item.items.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-3 text-sm font-medium">
                      <CheckCircle2 className={`h-5 w-5 shrink-0 mt-0.5 ${item.checkColor}`} />
                      <span className="text-foreground/90">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
