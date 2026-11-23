import type { Metadata } from "next";
import { BookOpen, Calculator, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { GpaCalculatorTool } from "@/components/tools/GpaCalculatorTool";

const SLUG = "tinh-diem-gpa-dai-hoc";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Công thức tính điểm GPA Đại học theo tín chỉ chuẩn là gì?",
    answer:
      "GPA (Grade Point Average) được tính theo trung bình trọng số tín chỉ: GPA = Tổng(Điểm môn hệ 4 × Số tín chỉ môn) / Tổng số tín chỉ đã học. Những môn nhiều tín chỉ (3–4 TC) ảnh hưởng đến GPA mạnh hơn môn ít tín chỉ.",
  },
  {
    question: "Điểm F (dưới 4.0 hệ 10) có bị tính vào GPA tích lũy không?",
    answer:
      "Có. Khi bị điểm F (0.0 hệ 4), số tín chỉ của học phần đó vẫn nằm ở mẫu số của GPA học kỳ cho đến khi bạn học lại và đạt điểm cao hơn (thay thế điểm F trong GPA tích lũy toàn khóa tùy quy chế trường).",
  },
  {
    question: "Bao nhiêu điểm GPA hệ 4 thì được bằng Giỏi hoặc Xuất sắc?",
    answer:
      "Theo Quy chế đào tạo trình độ đại học (Thông tư 08/2021/TT-BGDĐT): Xuất sắc từ 3.60 đến 4.00; Giỏi từ 3.20 đến 3.59; Khá từ 2.50 đến 3.19; Trung bình từ 2.00 đến 2.49. Lưu ý bằng Giỏi/Xuất sắc có thể bị hạ 1 bậc nếu thi lại/học lại vượt quá 5% tổng tín chỉ hoặc bị kỷ luật.",
  },
  {
    question: "Bảng quy đổi B+ tại trường tôi bắt đầu từ 7.8 thay vì 8.0 thì sao?",
    answer:
      "Công cụ hỗ trợ sẵn nút chuyển chế độ nhập 'Hệ 10 / Chữ' ngay trên từng dòng môn học. Nếu trường bạn dùng ngưỡng 7.8 cho B+, bạn chỉ cần bấm chuyển sang 'Chữ' và chọn đúng điểm chữ trên bảng điểm chính thức của trường để tính GPA hệ 4 chính xác 100%.",
  },
];

export default function TinhDiemGpaDaiHocPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Ôn thi cuối kỳ Đại học nhanh gấp 3 lần bằng Flashcard & Quiz AI"
      ctaDescription="Tải slide bài giảng, giáo trình PDF môn chuyên ngành lên QuizKen để tạo ngay bộ câu hỏi trắc nghiệm ôn tập Active Recall, giữ vững GPA 3.6+."
      ctaHref={appLink("/")}
      ctaLabel="Tạo đề ôn thi từ Slide PDF"
      secondaryCtaHref="/meo"
      secondaryCtaLabel="Xem mẹo học Đại học & Studocu"
      seoContent={
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Công thức tính GPA Hệ 4 &amp; Hệ 10 theo Quy chế tín chỉ
              </h2>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-4 font-mono text-xs leading-relaxed text-foreground dark:bg-foreground/[0.06] sm:text-sm space-y-2">
              <div>
                <strong>GPA = (Σ [Điểm số môn i × Số tín chỉ môn i]) / (Σ Số tín chỉ)</strong>
              </div>
              <div>
                <strong>GPA tối thiểu các kỳ tới = (GPA_mục_tiêu × Tổng_TC − GPA_hiện_tại × TC_đã_học) / TC_còn_lại</strong>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Bảng quy đổi Hệ 10 ↔ Điểm chữ ↔ Hệ 4 chuẩn
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Thang 10</th>
                      <th className="py-2 pr-3 font-semibold">Điểm chữ</th>
                      <th className="py-2 font-semibold text-primary">Thang 4</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {[
                      ["8.5 – 10.0", "A", "4.0"],
                      ["8.0 – 8.4", "B+", "3.5"],
                      ["7.0 – 7.9", "B", "3.0"],
                      ["6.5 – 6.9", "C+", "2.5"],
                      ["5.5 – 6.4", "C", "2.0"],
                      ["5.0 – 5.4", "D+", "1.5"],
                      ["4.0 – 4.9", "D", "1.0"],
                      ["< 4.0", "F", "0.0"],
                    ].map(([s10, ch, s4]) => (
                      <tr key={ch}>
                        <td className="py-2 pr-3 font-medium">{s10}</td>
                        <td className="py-2 pr-3 font-bold">{ch}</td>
                        <td className="py-2 font-bold text-primary">{s4}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Xếp loại bằng tốt nghiệp Đại học &amp; Ví dụ mục tiêu
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between rounded-xl bg-foreground/[0.04] px-3.5 py-2.5 dark:bg-foreground/[0.06]">
                  <span className="font-semibold">Xuất sắc</span>
                  <span className="font-bold text-primary">3.60 – 4.00</span>
                </div>
                <div className="flex justify-between rounded-xl bg-foreground/[0.04] px-3.5 py-2.5 dark:bg-foreground/[0.06]">
                  <span className="font-semibold">Giỏi</span>
                  <span className="font-bold text-primary">3.20 – 3.59</span>
                </div>
                <div className="flex justify-between rounded-xl bg-foreground/[0.04] px-3.5 py-2.5 dark:bg-foreground/[0.06]">
                  <span className="font-semibold">Khá</span>
                  <span className="font-bold">2.50 – 3.19</span>
                </div>
                <div className="flex justify-between rounded-xl bg-foreground/[0.04] px-3.5 py-2.5 dark:bg-foreground/[0.06]">
                  <span className="font-semibold">Trung bình</span>
                  <span className="text-muted-foreground">2.00 – 2.49</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                <strong>Ví dụ:</strong> Chương trình 130 tín chỉ, bạn đã tích lũy 60 TC với GPA 3.05 và muốn tốt nghiệp bằng Giỏi (≥ 3.20). Khi đó 70 TC còn lại cần đạt trung bình tối thiểu: (3.20 × 130 − 3.05 × 60) / 70 = <strong className="text-foreground">3.33 / 4.00</strong>.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <GpaCalculatorTool />
    </ToolPageShell>
  );
}
