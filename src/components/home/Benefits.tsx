"use client";

import { CheckCircle2, GraduationCap, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

const audienceList = [
  {
    audience: "Dành Cho Giáo Viên & Giảng Viên",
    title: "Tiết Kiệm 95% Thời Gian Soạn Đề Thi Trắc Nghiệm",
    description: "Không còn cảnh mất hàng giờ đồng hồ tìm kiếm câu hỏi hoặc gõ lại đề từ sách giáo khoa.",
    icon: GraduationCap,
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
    <section id="benefits" className="py-16 sm:py-24 bg-background">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
          <Badge>Đối tượng sử dụng</Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Giải Pháp Hoàn Hảo Cho Mọi Nhu Cầu
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {audienceList.map((item, idx) => {
            const Icon = item.icon;

            return (
              <div
                key={idx}
                className="rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none p-6 sm:p-8 space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-0 shadow-none bg-foreground/[0.06] text-foreground shrink-0">
                      <Icon className="h-5 w-5" />
                    </span>
                    <Badge>{item.audience}</Badge>
                  </div>

                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <ul className="rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-4 sm:p-5 space-y-3">
                  {item.items.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-3 text-sm font-medium">
                      <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
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
