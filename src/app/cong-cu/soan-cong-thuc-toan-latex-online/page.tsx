import type { Metadata } from "next";
import { Sigma, Sparkles } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { LatexFormulaEditorTool } from "@/components/tools/LatexFormulaEditorTool";

const SLUG = "soan-cong-thuc-toan-latex-online";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Sự khác nhau giữa Inline ($...$) và Block ($$...$$) trong LaTeX là gì?",
    answer:
      "Inline ($...$) dùng để chèn công thức nằm cùng dòng với đoạn văn bản (ví dụ: 'Hàm số $f(x) = x^2$'). Còn Block ($$...$$) hiển thị công thức căn giữa thành một dòng độc lập, phù hợp cho phân số phức tạp hoặc tích phân lớn.",
  },
  {
    question: "Công thức tạo từ đây có dán được vào QuizKen và Microsoft Word không?",
    answer:
      "Có. QuizKen hỗ trợ đầy đủ cú pháp LaTeX ($...$ và $$...$$) để hiển thị công thức Toán – Lý – Hóa sắc nét. Trong Word (Equation Editor), bạn cũng có thể chuyển chế độ nhập sang LaTeX và dán trực tiếp đoạn mã.",
  },
  {
    question: "Làm sao viết chỉ số dưới trong công thức Hóa học bằng LaTeX?",
    answer:
      "Dùng dấu gạch dưới `_`, ví dụ `H_2SO_4` hoặc `Fe_2(SO_4)_3`. Nếu chỉ số có từ 2 ký tự trở lên, hãy bọc trong ngoặc nhọn như `C_{12}H_{22}O_{11}`.",
  },
];

export default function SoanCongThucLatexPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Soạn đề thi Toán – Lý – Hóa hỗ trợ LaTeX tự động trên QuizKen"
      ctaDescription="Chỉ cần nhập chủ đề hoặc tải PDF đề thi Toán/Lý/Hóa, QuizKen AI tự động chuẩn hóa công thức LaTeX và xuất ra file Word/PDF sắc nét."
      ctaHref={appLink("/teacher/tools")}
      ctaLabel="Mở bộ công cụ Giáo viên QuizKen"
      secondaryCtaHref="/cong-cu/giai-phuong-trinh-he-phuong-trinh-ma-tran"
      secondaryCtaLabel="Mở bộ giải PT & Ma trận"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Sigma className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Bảng cú pháp LaTeX thông dụng cho Giáo viên &amp; Học sinh
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {[
                ["\\frac{a}{b}", "Phân số a/b"],
                ["\\sqrt[n]{x}", "Căn bậc n của x"],
                ["\\int_{a}^{b}", "Tích phân cận a đến b"],
                ["\\lim_{x \\to 0}", "Giới hạn khi x → 0"],
                ["\\sum_{i=1}^{n}", "Tổng Sigma i=1..n"],
                ["\\rightleftharpoons", "Mũi tên thuận nghịch"],
              ].map(([cmd, desc]) => (
                <div
                  key={cmd}
                  className="rounded-xl bg-foreground/[0.04] p-3 dark:bg-foreground/[0.06]"
                >
                  <div className="font-bold text-primary">{cmd}</div>
                  <div className="mt-0.5 font-sans text-muted-foreground">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Ví dụ soạn câu hỏi trắc nghiệm Toán học chuẩn LaTeX
              </h2>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-4 font-mono text-xs leading-relaxed text-foreground dark:bg-foreground/[0.06]">
              Tính tích phân $I = \int_&#123;0&#125;^&#123;1&#125; (3x^2 + 2x)\,dx$ có giá trị bằng bao nhiêu?
            </div>
            <p className="text-xs text-muted-foreground">
              Nhờ bảng nút bấm phía trên, bạn không cần nhớ thuộc lòng toàn bộ lệnh LaTeX mà vẫn soạn nhanh đề thi Toán, Lý, Hóa chuyên nghiệp.
            </p>
          </div>
        </div>
      }
    >
      <LatexFormulaEditorTool />
    </ToolPageShell>
  );
}
