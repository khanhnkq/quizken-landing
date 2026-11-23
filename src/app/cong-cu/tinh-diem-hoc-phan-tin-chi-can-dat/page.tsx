import type { Metadata } from "next";
import { BookOpen, Calculator, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { CoursePassCalculatorTool } from "@/components/tools/CoursePassCalculatorTool";

const SLUG = "tinh-diem-hoc-phan-tin-chi-can-dat";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Cần đạt bao nhiêu điểm tổng kết học phần thì được qua môn theo hệ tín chỉ?",
    answer:
      "Theo quy chế đào tạo tín chỉ tại hầu hết trường đại học Việt Nam, điểm tổng kết học phần đạt từ 4.0/10 (tương đương điểm chữ D) trở lên sẽ được công nhận qua môn. Tuy nhiên nhiều trường quy định thêm điểm liệt bài thi cuối kỳ (thường dưới 3.0 hoặc 4.0).",
  },
  {
    question: "Điểm thi cuối kỳ bị điểm liệt thì điểm quá trình cao có kéo lại được không?",
    answer:
      "Không. Nếu trường của bạn áp dụng ngưỡng điểm liệt bài thi kết thúc học phần (ví dụ phải ≥ 3.0), thì dù điểm chuyên cần và giữa kỳ đạt 10/10, bài thi cuối kỳ dưới mức liệt vẫn bị đánh giá là trượt học phần.",
  },
  {
    question: "Làm sao tính điểm cần đạt để nâng từ C lên B hoặc A?",
    answer:
      "Bạn chỉ cần nhập tỷ trọng phần trăm (ví dụ 10-30-60 hoặc 10-20-20-50) và điểm chuyên cần/giữa kỳ hiện có. Công cụ sẽ tính ngay điểm thi cuối kỳ tối thiểu cho từng mốc D (4.0), C (5.5), B (7.0), B+ (8.0), A (8.5) và A+ (9.0).",
  },
  {
    question: "Điểm tổng kết hệ 10 quy đổi sang hệ 4 và điểm chữ thế nào?",
    answer:
      "Mức chuẩn phổ biến: 8.5–10.0 = A (4.0); 8.0–8.4 = B+ (3.5); 7.0–7.9 = B (3.0); 6.5–6.9 = C+ (2.5); 5.5–6.4 = C (2.0); 5.0–5.4 = D+ (1.5); 4.0–4.9 = D (1.0); dưới 4.0 = F (0.0).",
  },
];

export default function TinhDiemHocPhanTinChiPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Ôn thi cuối kỳ 1 Đại học siêu tốc cùng QuizKen AI"
      ctaDescription="Tải ngay slide bài giảng PDF môn Triết học Mác-Lênin, Pháp luật đại cương, Kinh tế vi mô hoặc Xác suất thống kê lên QuizKen để tạo bộ đề ôn thi trong 30 giây."
      ctaHref={appLink("/")}
      ctaLabel="Tạo đề ôn thi đại học ngay"
      secondaryCtaHref="/de-thi/dai-hoc"
      secondaryCtaLabel="Xem đề đại cương đại học"
      seoContent={
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Công thức tính điểm thi cuối kỳ cần đạt để qua môn / đạt A
              </h2>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-4 font-mono text-xs leading-relaxed text-foreground dark:bg-foreground/[0.06] sm:text-sm space-y-2">
              <div>
                <strong>Điểm quá trình tích lũy</strong> = (Đ_CC × %CC + Đ_GK × %GK + Đ_TH × %TH) / 100
              </div>
              <div>
                <strong>Điểm CK cần đạt</strong> = max(Điểm_liệt_CK, (Mục_tiêu − Điểm quá trình tích lũy) / (%CK / 100))
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Ví dụ tính điểm qua môn và mục tiêu B+
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Học phần theo cơ cấu <strong>10% Chuyên cần – 30% Giữa kỳ – 60% Cuối kỳ</strong>, điểm liệt cuối kỳ 3.0. Bạn đạt CC = 9.0, GK = 7.5:
              </p>
              <ul className="space-y-1.5 text-sm text-foreground list-disc pl-5">
                <li>Điểm quá trình: 9.0×0.1 + 7.5×0.3 = <strong>3.15 điểm</strong>.</li>
                <li>Để đạt D (4.0): (4.0 − 3.15) / 0.6 = 1.42, nhưng do điểm liệt CK là 3.0 nên cần tối thiểu <strong>3.00đ</strong>.</li>
                <li>Để đạt B+ (8.0): (8.0 − 3.15) / 0.6 = <strong>8.09 điểm</strong> cuối kỳ.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Bảng quy đổi điểm học phần hệ 10 sang điểm chữ
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Thang 10</th>
                      <th className="py-2 pr-3 font-semibold">Điểm chữ</th>
                      <th className="py-2 font-semibold text-primary">Thang 4</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr><td className="py-2 pr-3">8.5 – 10.0</td><td className="py-2 pr-3 font-bold">A / A+</td><td className="py-2 font-semibold text-primary">4.0</td></tr>
                    <tr><td className="py-2 pr-3">8.0 – 8.4</td><td className="py-2 pr-3 font-bold">B+</td><td className="py-2 font-semibold">3.5</td></tr>
                    <tr><td className="py-2 pr-3">7.0 – 7.9</td><td className="py-2 pr-3 font-bold">B</td><td className="py-2 font-semibold">3.0</td></tr>
                    <tr><td className="py-2 pr-3">5.5 – 6.4</td><td className="py-2 pr-3 font-bold">C</td><td className="py-2 font-semibold">2.0</td></tr>
                    <tr><td className="py-2 pr-3">4.0 – 4.9</td><td className="py-2 pr-3 font-bold">D</td><td className="py-2 font-semibold">1.0</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <CoursePassCalculatorTool />
    </ToolPageShell>
  );
}
