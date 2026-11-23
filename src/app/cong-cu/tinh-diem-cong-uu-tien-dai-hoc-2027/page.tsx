import type { Metadata } from "next";
import { BookOpen, Calculator, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { PriorityPointsCalculator } from "@/components/tools/PriorityPointsCalculator";

const SLUG = "tinh-diem-cong-uu-tien-dai-hoc-2027";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Từ mức điểm nào thì điểm ưu tiên xét tuyển đại học bắt đầu bị giảm?",
    answer:
      "Theo quy chế tuyển sinh đại học của Bộ GD&ĐT, khi tổng điểm 3 môn của thí sinh đạt từ 22.5 điểm trở lên (theo thang điểm 30), điểm ưu tiên khu vực và đối tượng sẽ giảm dần tuyến tính về 0 tại mốc 30.0 điểm.",
  },
  {
    question: "Thí sinh đạt dưới 22.5 điểm có bị giảm điểm ưu tiên không?",
    answer:
      "Không. Nếu tổng điểm 3 môn dưới 22.5 điểm, thí sinh được cộng nguyên vẹn 100% mức điểm ưu tiên khu vực và đối tượng theo quy định (tối đa 2.75 điểm nếu vừa thuộc KV1 vừa thuộc nhóm ƯT1).",
  },
  {
    question: "Công thức giảm điểm ưu tiên từ mốc 22.5 điểm được tính như thế nào?",
    answer:
      "Điểm ưu tiên thực tế = [(30 - Tổng điểm đạt được) / 7.5] × Mức điểm ưu tiên gốc, sau đó làm tròn đến 2 chữ số thập phân. Khi tổng điểm bằng 30.0, điểm ưu tiên thực tế bằng 0.",
  },
  {
    question: "Điểm ưu tiên khu vực có còn hiệu lực sau năm tốt nghiệp THPT không?",
    answer:
      "Theo quy chế hiện hành của Bộ GD&ĐT, thí sinh chỉ được hưởng chính sách ưu tiên khu vực trong năm tốt nghiệp THPT và một năm kế tiếp.",
  },
];

export default function TinhDiemCongUuTienDaiHocPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Nâng cao điểm tổ hợp 3 môn vượt ngưỡng 26+ cùng QuizKen AI"
      ctaDescription="Luyện đề thi thử 3 phần chuẩn GDPT 2018 cho Toán, Lý, Hóa, Sinh, Anh, Sử, Địa và các bài ĐGNL (HSA, V-ACT, TSA) để bứt phá điểm gốc mà không phụ thuộc điểm cộng."
      ctaHref={appLink("/?grade=on-thi-thpt")}
      ctaLabel="Luyện đề 3 môn ngay"
      secondaryCtaHref="/de-thi/dgnl"
      secondaryCtaLabel="Xem đề thi ĐGNL 2027"
      seoContent={
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Công thức tính điểm ưu tiên giảm dần của Bộ GD&amp;ĐT
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Nhằm đảm bảo công bằng ở nhóm điểm cao, Bộ GD&amp;ĐT áp dụng quy tắc giảm tuyến tính điểm ưu tiên khu vực và đối tượng đối với thí sinh có tổng điểm tổ hợp từ 22.50 trở lên:
            </p>
            <div className="rounded-xl bg-foreground/[0.04] p-4 font-mono text-xs leading-relaxed text-foreground dark:bg-foreground/[0.06] sm:text-sm space-y-2">
              <div>
                <strong>1. Nếu Tổng điểm &lt; 22.50:</strong> Điểm ƯT thực tế = Điểm KV + Điểm ĐT
              </div>
              <div>
                <strong>2. Nếu 22.50 ≤ Tổng điểm &lt; 30.0:</strong> Điểm ƯT thực tế = [(30 − Tổng điểm) / 7.5] × (Điểm KV + Điểm ĐT)
              </div>
              <div>
                <strong>3. Nếu Tổng điểm ≥ 30.0:</strong> Điểm ƯT thực tế = 0.00
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Ví dụ tính điểm minh họa
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Thí sinh thuộc <strong>KV1 (+0.75)</strong> và đối tượng <strong>ƯT2 (+1.00)</strong> (mức gốc = 1.75 điểm), đạt tổng điểm 3 môn là <strong>26.25 điểm</strong>:
              </p>
              <ul className="space-y-1.5 text-sm text-foreground list-disc pl-5">
                <li>
                  Phần giảm trừ: (30 − 26.25) / 7.5 = 3.75 / 7.5 = <strong>0.50</strong> (còn 50% mức gốc).
                </li>
                <li>
                  Điểm ưu tiên thực tế: 0.50 × 1.75 = 0.875 → làm tròn 2 chữ số là{" "}
                  <strong>+0.88 điểm</strong>.
                </li>
                <li>
                  Tổng điểm xét tuyển cuối cùng: 26.25 + 0.88 = <strong>27.13 điểm</strong>.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Bảng mức điểm ưu tiên gốc theo quy định
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Phân loại</th>
                      <th className="py-2 pr-3 font-semibold">Ký hiệu</th>
                      <th className="py-2 font-semibold text-primary">Mức gốc</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="py-2 pr-3 font-medium">Khu vực 1</td>
                      <td className="py-2 pr-3 text-muted-foreground">KV1</td>
                      <td className="py-2 font-semibold">+0.75</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-medium">Khu vực 2 Nông thôn</td>
                      <td className="py-2 pr-3 text-muted-foreground">KV2-NT</td>
                      <td className="py-2 font-semibold">+0.50</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-medium">Khu vực 2</td>
                      <td className="py-2 pr-3 text-muted-foreground">KV2</td>
                      <td className="py-2 font-semibold">+0.25</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-medium">Đối tượng 01–04 / 05–07</td>
                      <td className="py-2 pr-3 text-muted-foreground">ƯT1 / ƯT2</td>
                      <td className="py-2 font-semibold">+2.00 / +1.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <PriorityPointsCalculator />
    </ToolPageShell>
  );
}
