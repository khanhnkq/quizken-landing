import type { Metadata } from "next";
import { BookOpen, Calculator, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { ToeicScoreCalculatorTool } from "@/components/tools/ToeicScoreCalculatorTool";

const SLUG = "tinh-diem-toeic-listening-reading";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Cách tính điểm TOEIC Listening & Reading có phải mỗi câu đúng được 5 điểm không?",
    answer:
      "Không hoàn toàn tuyến tính. Bài thi TOEIC quy đổi số câu đúng (0–100 mỗi phần) sang thang điểm chuẩn 5–495 theo độ khó từng bộ đề (equating). Thông thường phần Listening có đường quy đổi thoáng hơn phần Reading một chút.",
  },
  {
    question: "Đúng bao nhiêu câu TOEIC thì đạt mốc 450, 550 và 650 điểm?",
    answer:
      "Để đạt 450 điểm cần khoảng 95–100/200 câu đúng; mốc 550 cần khoảng 115–120/200 câu đúng; mốc 650 cần khoảng 135–140/200 câu đúng; và mốc 800+ cần khoảng 165/200 câu đúng trở lên.",
  },
  {
    question: "Điểm TOEIC tối đa và tối thiểu là bao nhiêu?",
    answer:
      "Mỗi kỹ năng Listening và Reading có thang điểm từ 5 đến 495 (bội số của 5), do đó tổng điểm TOEIC 2 kỹ năng dao động từ tối thiểu 10 điểm đến tối đa 990 điểm.",
  },
  {
    question: "Bằng TOEIC 550 hoặc 650 tương đương bậc nào theo CEFR?",
    answer:
      "Theo bảng tham chiếu ETS, tổng điểm TOEIC Listening & Reading từ 550 tương đương B1 (ngưỡng cao), từ 785 tương đương B2, và từ 945 tương đương C1.",
  },
];

export default function TinhDiemToeicPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Luyện từ vựng & ngữ pháp TOEIC Part 5–7 mỗi ngày cùng QuizKen"
      ctaDescription="Truy cập bộ đề mẫu TOEIC và English Hub lộ trình CEFR để cải thiện tốc độ đọc hiểu và ghi nhớ từ vựng kinh doanh hiệu quả."
      ctaHref={appLink("/english")}
      ctaLabel="Học TOEIC trên QuizKen"
      secondaryCtaHref="/de-thi/chung-chi/toeic"
      secondaryCtaLabel="Xem đề mẫu TOEIC"
      seoContent={
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Nguyên tắc quy đổi điểm TOEIC Listening &amp; Reading (Thang 10–990)
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Đề thi TOEIC gồm 200 câu trắc nghiệm (100 câu Listening, 100 câu Reading), không trừ điểm câu sai. Tổng điểm là tổng điểm quy đổi của cả hai kỹ năng (mỗi kỹ năng 5–495, bước nhảy 5 điểm).
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Ví dụ quy đổi điểm thi thử thực tế
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Nếu bạn làm đúng <strong>72/100 câu Listening</strong> và <strong>68/100 câu Reading</strong> (tổng 140/200 câu):
              </p>
              <ul className="space-y-1.5 text-sm text-foreground list-disc pl-5">
                <li>Listening 72 câu ≈ <strong>375 / 495 điểm</strong>.</li>
                <li>Reading 68 câu ≈ <strong>335 / 495 điểm</strong>.</li>
                <li>Tổng điểm TOEIC ước tính: <strong>710 / 990 điểm</strong> (đủ chuẩn đầu ra đa số trường đại học).</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Bảng tham chiếu số câu đúng theo mục tiêu TOEIC
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Mục tiêu điểm</th>
                      <th className="py-2 pr-3 font-semibold">Tổng câu đúng / 200</th>
                      <th className="py-2 font-semibold text-primary">Mức CEFR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr><td className="py-2 pr-3 font-bold">450+</td><td className="py-2 pr-3">~95 – 100 câu</td><td className="py-2">B1 cơ bản</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">550+</td><td className="py-2 pr-3">~115 – 120 câu</td><td className="py-2">B1+</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">650+</td><td className="py-2 pr-3">~135 – 140 câu</td><td className="py-2">B1+ – B2</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">800+</td><td className="py-2 pr-3">~165 – 170 câu</td><td className="py-2 text-primary font-semibold">B2+</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">945+</td><td className="py-2 pr-3">~190+ câu</td><td className="py-2 text-primary font-semibold">C1</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ToeicScoreCalculatorTool />
    </ToolPageShell>
  );
}
