import type { Metadata } from "next";
import { BookOpen, Calculator, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { Tt22AverageCalculator } from "@/components/tools/Tt22AverageCalculator";

const SLUG = "tinh-diem-trung-binh-mon-thong-tu-22";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Công thức tính điểm trung bình môn theo Thông tư 22 khác gì Thông tư 58 cũ?",
    answer:
      "Theo Thông tư 22/2021/TT-BGDĐT, tất cả các đầu điểm kiểm tra miệng và 15 phút được gộp thành Đánh giá thường xuyên (ĐĐGtx, hệ số 1). Công thức học kỳ là (Tổng ĐĐGtx + 2×Giữa kỳ + 3×Cuối kỳ) / (Số cột TX + 5), làm tròn đến 1 chữ số thập phân.",
  },
  {
    question: "Điểm trung bình môn cả năm được tính như thế nào?",
    answer:
      "Điểm trung bình môn cả năm (ĐTBmcn) bằng (ĐTB học kỳ 1 + 2 × ĐTB học kỳ 2) / 3, lấy đến 1 chữ số thập phân sau khi làm tròn. Điều này có nghĩa Học kỳ 2 chiếm trọng số gấp đôi Học kỳ 1.",
  },
  {
    question: "Theo Thông tư 22, điều kiện để đạt học sinh Tốt (Giỏi) và Khá là gì?",
    answer:
      "Với kết quả học tập mức Tốt: tất cả các môn đánh giá bằng nhận xét đạt mức Đạt, các môn tính điểm đều đạt từ 6.5 trở lên và có ít nhất 6 môn đạt từ 8.0 trở lên. Với mức Khá: các môn tính điểm đều đạt từ 5.0 trở lên và có ít nhất 6 môn đạt từ 6.5 trở lên.",
  },
  {
    question: "Điểm 7.95 khi tính ra có được làm tròn lên 8.0 theo Thông tư 22 không?",
    answer:
      "Có. Theo quy tắc làm tròn đến chữ số thập phân thứ nhất, chữ số hàng phần trăm từ 5 trở lên (ví dụ 7.95, 7.96) được làm tròn lên 8.0. Công cụ của QuizKen tính sẵn cả ngưỡng làm tròn (T - 0.05) lẫn ngưỡng chính xác để bạn đặt mục tiêu Cuối kỳ chuẩn nhất.",
  },
];

export default function TinhDiemTrungBinhMonTt22Page() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Cần kéo điểm kiểm tra giữa kỳ & cuối kỳ lên 8.5+? Luyện đề AI ngay!"
      ctaDescription="Tải tài liệu bài giảng hoặc chọn môn Toán, Lý, Hóa, Anh lớp 10–12 trên QuizKen để luyện ngay bộ đề trắc nghiệm & tự luận chuẩn GDPT 2018."
      ctaHref={appLink("/?grade=lop-11")}
      ctaLabel="Luyện đề ôn kiểm tra ngay"
      secondaryCtaHref="/de-thi"
      secondaryCtaLabel="Xem kho đề lớp 10-12"
      seoContent={
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Công thức tính điểm trung bình môn chuẩn Thông tư 22/2021/TT-BGDĐT
              </h2>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-4 font-mono text-xs leading-relaxed text-foreground dark:bg-foreground/[0.06] sm:text-sm space-y-2">
              <div>
                <strong>1. ĐTB Môn Học kỳ (ĐTBmhk):</strong> (TĐĐGtx + 2 × ĐĐGgk + 3 × ĐĐGck) / (Số cột TX + 5)
              </div>
              <div>
                <strong>2. ĐTB Môn Cả năm (ĐTBmcn):</strong> (ĐTBmhk1 + 2 × ĐTBmhk2) / 3
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Ví dụ tính điểm ngược Cuối kỳ
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Giả sử môn Toán học kỳ có 4 cột ĐĐGtx là <strong className="text-foreground">8.0, 8.5, 9.0, 7.5</strong> (tổng = 33.0) và điểm Giữa kỳ là <strong className="text-foreground">8.0</strong>. Mẫu số là <code className="text-foreground">4 + 5 = 9</code>. Để đạt tổng kết <strong className="text-foreground">8.0</strong>, tổng điểm quy đổi tối thiểu cần là <code className="text-foreground">7.95 × 9 = 71.55</code>. Do đó điểm Cuối kỳ cần đạt tối thiểu <strong className="text-primary">(71.55 − 33.0 − 16.0) / 3 = 7.52 điểm</strong>.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Số cột ĐĐGtx tối thiểu theo số tiết/năm
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Thời lượng môn</th>
                      <th className="py-2 pr-3 font-semibold">Số cột TX / kỳ</th>
                      <th className="py-2 font-semibold">Mẫu số ĐTBmhk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="py-2 pr-3">≤ 35 tiết/năm</td>
                      <td className="py-2 pr-3 font-semibold">2 cột TX</td>
                      <td className="py-2 font-bold text-primary">7 (2 + 2 + 3)</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3">36 – 70 tiết/năm</td>
                      <td className="py-2 pr-3 font-semibold">3 cột TX</td>
                      <td className="py-2 font-bold text-primary">8 (3 + 2 + 3)</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3">&gt; 70 tiết/năm (Toán, Văn, Anh)</td>
                      <td className="py-2 pr-3 font-semibold">4 cột TX</td>
                      <td className="py-2 font-bold text-primary">9 (4 + 2 + 3)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <Tt22AverageCalculator />
    </ToolPageShell>
  );
}
