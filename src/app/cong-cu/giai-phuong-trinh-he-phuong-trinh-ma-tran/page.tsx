import type { Metadata } from "next";
import { Calculator, Grid3X3, Sigma } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { EquationMatrixSolver } from "@/components/tools/EquationMatrixSolver";

const SLUG = "giai-phuong-trinh-he-phuong-trinh-ma-tran";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Công cụ có hỗ trợ giải nghiệm phức khi biệt thức Δ < 0 không?",
    answer:
      "Có. Với phương trình bậc 2 (ax² + bx + c = 0) khi Δ < 0 và phương trình bậc 3 khi Δ_c > 0, công cụ tính đầy đủ cả nghiệm thực lẫn cặp nghiệm phức liên hợp (dạng a ± bi).",
  },
  {
    question: "Tại sao hệ phương trình và ma trận hiển thị phân số chính xác?",
    answer:
      "Thay vì dùng số dấu phẩy động gây sai số (như 0.3333), bộ giải ma trận và hệ phương trình tính hoàn toàn trên phân số tối giản BigInt nên giữ chính xác kết quả dạng p/q (hoặc bật chế độ thập phân nếu cần).",
  },
  {
    question: "Điều gì xảy ra nếu ma trận có định thức det(A) = 0?",
    answer:
      "Khi det(A) = 0, ma trận là ma trận suy biến nên không khả nghịch. Công cụ sẽ phát hiện an toàn và thông báo rõ không tồn tại ma trận nghịch đảo A⁻¹ thay vì chia cho 0.",
  },
  {
    question: "Có thể nhập phân số như 1/2 hoặc -3/4 vào ô ma trận không?",
    answer:
      "Có. Bạn có thể nhập số nguyên (2, -5), số thập phân (1.5 hoặc 1,5) hoặc phân số (1/2, -3/4) trực tiếp vào từng ô của hệ phương trình và ma trận.",
  },
];

export default function GiaiPhuongTrinhMaTranPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Luyện giải đề thi Toán THPT & Đại số tuyến tính bằng AI"
      ctaDescription="Tải tài liệu Toán học lên QuizKen để tạo bộ câu hỏi trắc nghiệm 3 phần, bài tập Đúng/Sai và Trả lời ngắn có lời giải chi tiết."
      ctaHref={appLink("/?subject=toan")}
      ctaLabel="Tạo đề Toán học bằng AI"
      secondaryCtaHref="/de-thi/toan/on-thi-thpt"
      secondaryCtaLabel="Làm đề thi Toán THPT"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-lg font-bold text-foreground">
                Công thức Phương trình Bậc 2
              </h2>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-4 font-mono text-xs leading-relaxed text-foreground dark:bg-foreground/[0.06]">
              <div>Δ = b² − 4ac</div>
              <div>Δ &gt; 0: x₁,₂ = (−b ± √Δ) / (2a)</div>
              <div>Vi-ét: x₁ + x₂ = −b/a; x₁·x₂ = c/a</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Sigma className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-lg font-bold text-foreground">
                Quy tắc Cramer (Hệ 2×2 &amp; 3×3)
              </h2>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-4 font-mono text-xs leading-relaxed text-foreground dark:bg-foreground/[0.06]">
              <div>D = det(A) ≠ 0 → Nghiệm duy nhất:</div>
              <div>x = D_x / D; y = D_y / D; z = D_z / D</div>
              <div>D = 0 → Vô nghiệm hoặc Vô số nghiệm</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Grid3X3 className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-lg font-bold text-foreground">
                Ma trận Nghịch đảo A⁻¹
              </h2>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-4 font-mono text-xs leading-relaxed text-foreground dark:bg-foreground/[0.06]">
              <div>Điều kiện khả nghịch: det(A) ≠ 0</div>
              <div>A⁻¹ = (1 / det(A)) · adj(A)</div>
              <div>Trong đó adj(A) = Cᵀ (phụ hợp)</div>
            </div>
          </div>
        </div>
      }
    >
      <EquationMatrixSolver />
    </ToolPageShell>
  );
}
