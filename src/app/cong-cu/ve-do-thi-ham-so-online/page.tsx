import type { Metadata } from "next";
import { LineChart, Sparkles } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { FunctionGrapherTool } from "@/components/tools/FunctionGrapherTool";

const SLUG = "ve-do-thi-ham-so-online";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Tôi có thể vẽ nhiều đồ thị cùng lúc để tìm giao điểm không?",
    answer:
      "Có. Công cụ cho phép vẽ tối đa 4 hàm số trên cùng một hệ trục tọa độ Oxy với 4 màu sắc khác nhau (ví dụ vẽ đồng thời Parabol y = x^2 - 2x - 3 và đường thẳng y = x + 1), sau đó rê chuột để đọc tọa độ giao điểm.",
  },
  {
    question: "Công cụ hỗ trợ những hàm toán học và phép tính nào?",
    answer:
      "Hỗ trợ đầy đủ phép toán +, -, *, /, ^ (lũy thừa), nhân ngầm (như 2x, 3sin(x)), hằng số pi và e, cùng các hàm sin, cos, tan, abs (trị tuyệt đối), sqrt (căn bậc 2), ln, log (logarit cơ số 10), exp (e^x).",
  },
  {
    question: "Khi vẽ hàm phân thức có tiệm cận đứng như (2x+1)/(x-1) có bị nối đường thẳng đứng sai không?",
    answer:
      "Không. Thuật toán vẽ đồ thị tự động phát hiện bước nhảy gián đoạn lớn tại tiệm cận đứng (x = 1) và ngắt nét vẽ chính xác thành hai nhánh riêng biệt.",
  },
];

export default function VeDoThiHamSoOnlinePage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Luyện giải bài toán Khảo sát hàm số & Tương giao THPT 2027"
      ctaDescription="Ôn luyện hàng trăm câu hỏi trắc nghiệm Toán lớp 12 chuyên đề Hàm số, Cực trị, Tiệm cận chuẩn GDPT 2018 trên QuizKen."
      ctaHref={appLink("/?subject=toan")}
      ctaLabel="Tạo đề Hàm số bằng AI"
      secondaryCtaHref="/de-thi/toan/on-thi-thpt"
      secondaryCtaLabel="Làm đề thi Toán THPT"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Cú pháp nhập hàm số nhanh
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              {[
                ["x^3 - 3x + 1", "Hàm bậc ba"],
                ["(2x+1)/(x-1)", "Hàm phân thức"],
                ["sqrt(x^2 + 1)", "Căn bậc hai"],
                ["2*sin(x) + cos(2x)", "Hàm lượng giác"],
                ["abs(x^2 - 4)", "Hàm trị tuyệt đối"],
                ["ln(x) + exp(-x)", "Logarit & Mũ"],
              ].map(([expr, label]) => (
                <div
                  key={expr}
                  className="rounded-xl bg-foreground/[0.04] p-3 dark:bg-foreground/[0.06]"
                >
                  <div className="font-bold text-primary">{expr}</div>
                  <div className="mt-0.5 font-sans text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Ứng dụng khi học chương Khảo sát hàm số lớp 12
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Bạn có thể nhập cả hàm gốc <code className="font-mono text-foreground">f(x)</code> và đạo hàm <code className="font-mono text-foreground">f&apos;(x)</code> trên cùng đồ thị để quan sát trực quan mối liên hệ giữa điểm cực trị của hàm số và nghiệm đổi dấu của đạo hàm, hoặc tải ảnh SVG chèn vào bài giảng PowerPoint.
            </p>
          </div>
        </div>
      }
    >
      <FunctionGrapherTool />
    </ToolPageShell>
  );
}
