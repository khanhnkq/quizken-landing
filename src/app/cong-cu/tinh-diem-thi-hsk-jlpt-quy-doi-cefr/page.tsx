import type { Metadata } from "next";
import { BookOpen, Calculator, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { HskJlptCalculatorTool } from "@/components/tools/HskJlptCalculatorTool";

const SLUG = "tinh-diem-thi-hsk-jlpt-quy-doi-cefr";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Điểm đỗ và điểm liệt từng phần của kỳ thi JLPT N5–N1 là bao nhiêu?",
    answer:
      "Thang điểm JLPT tối đa là 180. Điểm đỗ tổng: N5 = 80, N4 = 90, N3 = 95, N2 = 90, N1 = 100. Ngoài tổng điểm, mọi phần thi đều có điểm liệt: 19/60 cho từng phần 60 điểm (N3–N1 và Nghe N5/N4) và 38/120 cho phần Từ vựng-Ngữ pháp-Đọc N5/N4.",
  },
  {
    question: "Nếu tổng điểm JLPT đủ 100/180 nhưng một phần thi bị 18/60 thì có đỗ không?",
    answer:
      "Không đỗ. Theo quy chế JLPT chính thức, thí sinh bắt buộc phải vượt qua cả tổng điểm tối thiểu LẪN điểm liệt ở tất cả các phần thi thành phần.",
  },
  {
    question: "HSK 3.0 (3 Bậc 9 Cấp) khác gì so với HSK 2.0 (6 cấp)?",
    answer:
      "Hệ thống HSK mới chia thành 3 bậc (Sơ cấp 1–3, Trung cấp 4–6, Cao cấp 7–9) với yêu cầu lượng từ vựng và chữ Hán cao hơn, bổ sung kỹ năng dịch và viết sâu hơn ở bậc trung-cao cấp.",
  },
  {
    question: "Bao nhiêu điểm HSK thì đạt yêu cầu cấp chứng chỉ?",
    answer:
      "Ở HSK 1–2 (tối đa 200 điểm), thí sinh đạt từ 120 điểm trở lên là đỗ. Ở HSK 3–4 (tối đa 300 điểm), ngưỡng đạt là 180/300 điểm.",
  },
];

export default function TinhDiemHskJlptPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Luyện từ vựng Kanji JLPT & Hán tự HSK mỗi ngày với AI trên QuizKen"
      ctaDescription="Tạo nhanh bộ câu hỏi trắc nghiệm từ vựng N5–N1 hoặc HSK 1–6 từ giáo trình PDF của bạn để ôn tập siêu tốc trước kỳ thi."
      ctaHref={appLink("/")}
      ctaLabel="Tạo đề JLPT / HSK bằng AI"
      secondaryCtaHref="/de-thi/chung-chi"
      secondaryCtaLabel="Xem đề chứng chỉ quốc tế"
      seoContent={
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Quy tắc xét đỗ kép của JLPT &amp; Khung quy đổi HSK 3.0 sang CEFR
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Khi tự chấm đề thi thử JLPT hoặc HSK, thí sinh cần chú ý không chỉ tổng điểm mà cả điểm liệt từng phần (đối với JLPT) và sự thay đổi về lượng từ vựng khi chuyển sang chuẩn HSK 3.0 mới.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Ví dụ kiểm tra điểm liệt JLPT N3
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Giả sử thí sinh thi JLPT N3 đạt: Kiến thức ngôn ngữ 45/60, Đọc hiểu 38/60, Nghe hiểu 17/60:
              </p>
              <ul className="space-y-1.5 text-sm text-foreground list-disc pl-5">
                <li>Tổng điểm: 45 + 38 + 17 = <strong>100/180</strong> (vượt ngưỡng tổng 95 điểm).</li>
                <li>Tuy nhiên phần Nghe hiểu 17 &lt; <strong>19</strong> (bị điểm liệt), nên kết quả vẫn là <strong>Chưa đạt</strong>.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Bảng ngưỡng điểm đỗ JLPT N5 – N1 chính thức
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Cấp độ</th>
                      <th className="py-2 pr-3 font-semibold">Điểm đỗ / 180</th>
                      <th className="py-2 pr-3 font-semibold">Liệt phần thi</th>
                      <th className="py-2 font-semibold text-primary">CEFR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr><td className="py-2 pr-3 font-bold">N5</td><td className="py-2 pr-3">80</td><td className="py-2 pr-3">38/120 &amp; 19/60</td><td className="py-2">A1</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">N4</td><td className="py-2 pr-3">90</td><td className="py-2 pr-3">38/120 &amp; 19/60</td><td className="py-2">A2</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">N3</td><td className="py-2 pr-3">95</td><td className="py-2 pr-3">19/60 mỗi phần</td><td className="py-2">B1</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">N2</td><td className="py-2 pr-3">90</td><td className="py-2 pr-3">19/60 mỗi phần</td><td className="py-2">B2</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">N1</td><td className="py-2 pr-3">100</td><td className="py-2 pr-3">19/60 mỗi phần</td><td className="py-2 text-primary font-semibold">C1</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <HskJlptCalculatorTool />
    </ToolPageShell>
  );
}
