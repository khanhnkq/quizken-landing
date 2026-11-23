import type { Metadata } from "next";
import { BookOpen, Calculator, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { VstepScoreCalculator } from "@/components/tools/VstepScoreCalculator";

const SLUG = "tinh-diem-thi-vstep-b1-b2-c1";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Quy tắc làm tròn điểm thi VSTEP B1, B2, C1 của Bộ GD&ĐT là gì?",
    answer:
      "Điểm bài thi VSTEP là trung bình cộng của 4 kỹ năng Nghe, Nói, Đọc, Viết (thang 10) và được làm tròn đến 0.5 gần nhất. Cụ thể, mức .25 làm tròn lên .5 và mức .75 làm tròn lên số nguyên tiếp theo (ví dụ 5.75 làm tròn thành 6.0 — đạt B2).",
  },
  {
    question: "Bao nhiêu điểm VSTEP thì đạt chứng chỉ B1, B2 hoặc C1?",
    answer:
      "Sau khi làm tròn đến 0.5: đạt từ 4.0 đến 5.5 điểm được cấp bậc 3 (B1); từ 6.0 đến 8.0 điểm được cấp bậc 4 (B2); từ 8.5 đến 10.0 điểm được cấp bậc 5 (C1). Dưới 4.0 điểm chưa đủ điều kiện cấp chứng chỉ.",
  },
  {
    question: "Nếu có 1 kỹ năng bị điểm thấp thì có bị tính liệt trong VSTEP không?",
    answer:
      "Bài thi VSTEP 3–5 bậc không quy định điểm liệt cho từng kỹ năng riêng lẻ, miễn là điểm trung bình 4 kỹ năng sau làm tròn đạt ngưỡng quy định của bậc tương ứng (tuy nhiên một số trường đại học có thể yêu cầu riêng về điểm sàn kỹ năng đầu ra).",
  },
  {
    question: "Điểm VSTEP B2 tương đương IELTS bao nhiêu?",
    answer:
      "Theo khung tham chiếu quy đổi năng lực ngoại ngữ phổ biến tại Việt Nam, VSTEP bậc 4 (B2: 6.0–8.0) tương đương trình độ CEFR B2 hoặc IELTS khoảng 5.5 – 6.5.",
  },
];

export default function TinhDiemThiVstepPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Luyện đề thi VSTEP B1–B2 & từ vựng CEFR miễn phí trên QuizKen"
      ctaDescription="Truy cập bộ câu hỏi mẫu VSTEP và lộ trình English Hub theo chuẩn CEFR từ A1 đến C2 giúp bạn tăng tốc nhanh phần Đọc hiểu và Từ vựng học thuật."
      ctaHref={appLink("/english")}
      ctaLabel="Học tiếng Anh trên QuizKen"
      secondaryCtaHref="/de-thi/chung-chi/vstep-b1-b2"
      secondaryCtaLabel="Xem đề mẫu VSTEP B1–B2"
      seoContent={
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Cách tính điểm bài thi VSTEP 3–5 bậc (Thông tư 23/2017/TT-BGDĐT)
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Mỗi kỹ năng Nghe, Nói, Đọc, Viết được chấm trên thang điểm 10 (làm tròn đến 0.5). Điểm toàn bài là trung bình cộng 4 kỹ năng, làm tròn đến bậc 0.5:
            </p>
            <div className="rounded-xl bg-foreground/[0.04] p-4 font-mono text-xs leading-relaxed text-foreground dark:bg-foreground/[0.06] sm:text-sm space-y-2">
              <div>
                <strong>Điểm TB gốc</strong> = (Nghe + Nói + Đọc + Viết) / 4
              </div>
              <div>
                <strong>Điểm VSTEP chính thức</strong> = Math.round(Điểm TB gốc × 2) / 2
              </div>
              <div className="text-muted-foreground">
                Mốc tổng 4 kỹ năng tối thiểu: B1 ≥ 15.0 (TB 3.75 → 4.0) | B2 ≥ 23.0 (TB 5.75 → 6.0) | C1 ≥ 33.0 (TB 8.25 → 8.5)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Ví dụ tính điểm VSTEP thực tế
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Thí sinh đạt điểm thành phần: Nghe 6.0, Đọc 6.5, Viết 5.5, Nói 5.5:
              </p>
              <ul className="space-y-1.5 text-sm text-foreground list-disc pl-5">
                <li>
                  Tổng 4 kỹ năng: 6.0 + 6.5 + 5.5 + 5.5 = <strong>23.5 điểm</strong>.
                </li>
                <li>
                  Trung bình cộng: 23.5 / 4 = <strong>5.875</strong>.
                </li>
                <li>
                  Làm tròn đến 0.5 gần nhất: 5.875 → <strong>6.0 điểm</strong> (Đạt <strong>Bậc 4 — B2</strong>).
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Bảng quy đổi thang điểm VSTEP sang CEFR &amp; IELTS
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Điểm VSTEP</th>
                      <th className="py-2 pr-3 font-semibold">Bậc KNLNN VN</th>
                      <th className="py-2 pr-3 font-semibold">CEFR</th>
                      <th className="py-2 font-semibold text-primary">IELTS tham chiếu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="py-2 pr-3 font-bold">&lt; 4.0</td>
                      <td className="py-2 pr-3 text-muted-foreground">Chưa xét bậc 3–5</td>
                      <td className="py-2 pr-3">Dưới B1</td>
                      <td className="py-2 text-muted-foreground">&lt; 4.0</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-bold">4.0 – 5.5</td>
                      <td className="py-2 pr-3">Bậc 3 (B1)</td>
                      <td className="py-2 pr-3">B1</td>
                      <td className="py-2 font-semibold">4.0 – 5.0</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-bold">6.0 – 8.0</td>
                      <td className="py-2 pr-3">Bậc 4 (B2)</td>
                      <td className="py-2 pr-3">B2</td>
                      <td className="py-2 font-semibold">5.5 – 6.5</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-bold">8.5 – 10.0</td>
                      <td className="py-2 pr-3">Bậc 5 (C1)</td>
                      <td className="py-2 pr-3">C1</td>
                      <td className="py-2 font-semibold text-primary">7.0 – 8.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <VstepScoreCalculator />
    </ToolPageShell>
  );
}
