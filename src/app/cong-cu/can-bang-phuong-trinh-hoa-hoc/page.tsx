import type { Metadata } from "next";
import { BookOpen, FlaskConical, Scale } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { ChemEquationBalancer } from "@/components/tools/ChemEquationBalancer";

const SLUG = "can-bang-phuong-trinh-hoa-hoc";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Công cụ cân bằng phương trình hóa học này dùng thuật toán gì?",
    answer:
      "Hệ thống sử dụng phương pháp đại số kết hợp khử Gauss trên phân số nguyên chính xác (BigInt), giải trực tiếp hệ phương trình bảo toàn số nguyên tử từng nguyên tố để tìm bộ hệ số nguyên dương tối giản nhất, không bị sai số làm tròn.",
  },
  {
    question: "Có hỗ trợ công thức chứa dấu ngoặc và tinh thể ngậm nước không?",
    answer:
      "Có. Bạn có thể nhập các công thức có dấu ngoặc đơn/vuông như Fe2(SO4)3, Ca(OH)2, K4[Fe(CN)6] hoặc muối ngậm nước như CuSO4.5H2O để cân bằng và tính phân tử khối M.",
  },
  {
    question: "Cách viết mũi tên phản ứng khi nhập phương trình?",
    answer:
      "Bạn có thể gõ '->', '=>', '=' hoặc ký tự mũi tên '→' giữa vế chất tham gia và vế sản phẩm. Ví dụ: Cu + HNO3 -> Cu(NO3)2 + NO + H2O.",
  },
  {
    question: "Nguyên tử khối M sử dụng theo chuẩn nào?",
    answer:
      "Bảng nguyên tử khối bám sát giá trị chuẩn chương trình Hóa học GDPT 2018 (như H = 1, C = 12, N = 14, O = 16, Na = 23, Mg = 24, Al = 27, S = 32, Cl = 35.5, Fe = 56, Cu = 64, Zn = 65, Ag = 108, Ba = 137).",
  },
];

export default function CanBangPhuongTrinhHoaHocPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Luyện giải bài tập Hóa học GDPT 2018 & Tự tạo đề bằng AI"
      ctaDescription="Chuyển đổi ghi chú, PDF bài tập Hóa học thành đề trắc nghiệm 3 phần (4 lựa chọn, Đúng/Sai, Trả lời ngắn) trên QuizKen chỉ trong 30 giây."
      ctaHref={appLink("/?subject=hoa-hoc")}
      ctaLabel="Tạo đề Hóa học bằng AI"
      secondaryCtaHref="/de-thi/hoa-hoc/on-thi-thpt"
      secondaryCtaLabel="Làm đề thi Hóa học THPT"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Ví dụ minh họa: Cân bằng phản ứng Oxi hóa – Khử
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Xét phản ứng kinh điển:{" "}
              <strong className="font-mono text-foreground">
                Fe + H2SO4 → Fe2(SO4)3 + SO2 + H2O
              </strong>
            </p>
            <div className="rounded-xl bg-foreground/[0.04] p-4 font-mono text-xs leading-relaxed text-foreground dark:bg-foreground/[0.06] sm:text-sm space-y-1.5">
              <div>1. Quá trình oxi hóa: 2Fe⁰ → 2Fe⁺³ + 6e</div>
              <div>2. Quá trình khử: S⁺⁶ + 2e → S⁺⁴ (nhân 3)</div>
              <div>
                3. Kết quả:{" "}
                <strong className="text-primary">
                  2Fe + 6H2SO4 → Fe2(SO4)3 + 3SO2 + 6H2O
                </strong>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Nguyên tử khối (M) thường gặp khi giải nhanh
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm">
              {[
                ["H = 1", "C = 12", "N = 14"],
                ["O = 16", "Na = 23", "Mg = 24"],
                ["Al = 27", "S = 32", "Cl = 35.5"],
                ["K = 39", "Ca = 40", "Fe = 56"],
                ["Cu = 64", "Zn = 65", "Ag = 108"],
              ]
                .flat()
                .map((item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-foreground/[0.04] px-3 py-2 font-mono font-semibold text-foreground dark:bg-foreground/[0.06]"
                  >
                    {item}
                  </div>
                ))}
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
              Mẹo: Chọn tab &ldquo;Tính Phân tử khối (M)&rdquo; ngay phía trên
              để tính nhanh % khối lượng từng nguyên tố.
            </p>
          </div>
        </div>
      }
    >
      <ChemEquationBalancer />
    </ToolPageShell>
  );
}
