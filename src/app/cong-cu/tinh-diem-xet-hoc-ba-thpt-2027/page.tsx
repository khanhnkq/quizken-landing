import type { Metadata } from "next";
import { BookOpen, Calculator, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { HocBaCalculator } from "@/components/tools/HocBaCalculator";

const SLUG = "tinh-diem-xet-hoc-ba-thpt-2027";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Xét học bạ THPT năm 2027 có bắt buộc phải dùng kết quả cả năm lớp 12 không?",
    answer:
      "Theo quy chế tuyển sinh đại học mới của Bộ GD&ĐT (áp dụng từ 2025–2027), khi sử dụng phương thức xét học bạ, các trường phải dùng kết quả học tập của cả năm lớp 12 (tổng 6 học kỳ hoặc 3 năm học) thay vì chỉ xét 5 học kỳ như trước đây.",
  },
  {
    question: "Trong tổ hợp xét học bạ, có quy định bắt buộc về môn Toán hoặc Ngữ văn không?",
    answer:
      "Có. Tổ hợp môn dùng để xét tuyển phải bao gồm ít nhất 1 trong 2 môn Toán hoặc Ngữ văn với trọng số tính điểm xét tuyển không dưới 1/3 tổng điểm của tổ hợp.",
  },
  {
    question: "Điểm ưu tiên khi xét học bạ có bị giảm khi tổng điểm trên 22.5 không?",
    answer:
      "Có. Theo quy chế hiện hành của Bộ GD&ĐT, mức điểm ưu tiên tối đa giảm tuyến tính khi thí sinh đạt tổng điểm từ 22.5 trở lên (trên thang 30) theo công thức: Điểm ƯT thực tế = [(30 − Tổng điểm 3 môn) / 7.5] × Điểm ưu tiên quy định.",
  },
  {
    question: "Nên chọn xét học bạ theo tổ hợp nào để tối ưu khả năng trúng tuyển?",
    answer:
      "Bạn hãy nhập toàn bộ điểm các môn đã học vào công cụ để hệ thống tự xếp hạng 7 tổ hợp phổ biến (A00, A01, B00, C00, D01, D07, C01). Ngoài tổ hợp cao điểm nhất, hãy kiểm tra thêm điểm chuẩn năm trước của ngành mục tiêu vì mỗi tổ hợp có thể xét chung hoặc chênh lệch nhẹ tùy trường.",
  },
];

export default function TinhDiemXetHocBaThptPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Song song xét học bạ, bứt phá điểm thi THPT & ĐGNL cùng QuizKen!"
      ctaDescription="Đa dạng hóa cơ hội trúng tuyển đại học với bộ đề thi thử 3 phần chuẩn GDPT 2018 cho Toán, Lý, Hóa, Sinh, Anh, Sử, Địa trên QuizKen."
      ctaHref={appLink("/?grade=on-thi-thpt")}
      ctaLabel="Luyện đề thi THPT 2027"
      secondaryCtaHref="/de-thi/dai-hoc"
      secondaryCtaLabel="Xem đề thi đại học theo khối"
      seoContent={
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Công thức tính điểm xét học bạ THPT 6 học kỳ &amp; 3 năm
              </h2>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-4 font-mono text-xs leading-relaxed text-foreground dark:bg-foreground/[0.06] sm:text-sm space-y-2">
              <div>
                <strong>1. Theo 6 học kỳ:</strong> ĐTB_Môn = (HK1_L10 + HK2_L10 + HK1_L11 + HK2_L11 + HK1_L12 + HK2_L12) / 6
              </div>
              <div>
                <strong>2. Theo 3 năm:</strong> ĐTB_Môn = (ĐTB_Lớp_10 + ĐTB_Lớp_11 + ĐTB_Lớp_12) / 3
              </div>
              <div>
                <strong>3. Tổng điểm xét tuyển:</strong> Tổng = ĐTB_Môn_1 + ĐTB_Môn_2 + ĐTB_Môn_3 + Điểm_Ưu_Tiên (giảm trừ từ 22.5đ)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  7 Tổ hợp xét tuyển Học bạ phổ biến nhất
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Mã khối</th>
                      <th className="py-2 font-semibold">3 môn tổ hợp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr><td className="py-2 pr-3 font-bold text-primary">A00</td><td className="py-2">Toán – Vật lý – Hóa học</td></tr>
                    <tr><td className="py-2 pr-3 font-bold text-primary">A01</td><td className="py-2">Toán – Vật lý – Tiếng Anh</td></tr>
                    <tr><td className="py-2 pr-3 font-bold text-primary">B00</td><td className="py-2">Toán – Hóa học – Sinh học</td></tr>
                    <tr><td className="py-2 pr-3 font-bold text-primary">C00</td><td className="py-2">Ngữ văn – Lịch sử – Địa lý</td></tr>
                    <tr><td className="py-2 pr-3 font-bold text-primary">D01</td><td className="py-2">Toán – Ngữ văn – Tiếng Anh</td></tr>
                    <tr><td className="py-2 pr-3 font-bold text-primary">D07</td><td className="py-2">Toán – Hóa học – Tiếng Anh</td></tr>
                    <tr><td className="py-2 pr-3 font-bold text-primary">C01</td><td className="py-2">Toán – Ngữ văn – Vật lý</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Ví dụ xếp hạng khối lợi điểm nhất
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Giả sử trung bình 6 học kỳ của bạn là: Toán <strong className="text-foreground">8.70</strong>, Vật lý <strong className="text-foreground">8.57</strong>, Hóa học <strong className="text-foreground">8.18</strong>, Tiếng Anh <strong className="text-foreground">8.90</strong>, Ngữ văn <strong className="text-foreground">7.88</strong>:
              </p>
              <ul className="space-y-1.5 text-sm text-foreground list-disc pl-5">
                <li><strong>Khối A01 (Toán + Lý + Anh):</strong> 8.70 + 8.57 + 8.90 = <strong className="text-primary">26.17 điểm</strong> (Cao nhất).</li>
                <li><strong>Khối D07 (Toán + Hóa + Anh):</strong> 8.70 + 8.18 + 8.90 = <strong>25.78 điểm</strong>.</li>
                <li><strong>Khối A00 (Toán + Lý + Hóa):</strong> 8.70 + 8.57 + 8.18 = <strong>25.45 điểm</strong>.</li>
                <li><strong>Khối D01 (Toán + Văn + Anh):</strong> 8.70 + 7.88 + 8.90 = <strong>25.48 điểm</strong>.</li>
              </ul>
            </div>
          </div>
        </div>
      }
    >
      <HocBaCalculator />
    </ToolPageShell>
  );
}
