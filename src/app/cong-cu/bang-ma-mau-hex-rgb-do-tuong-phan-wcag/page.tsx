import type { Metadata } from "next";
import { Monitor, Palette } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { ColorContrastWcagTool } from "@/components/tools/ColorContrastWcagTool";

const SLUG = "bang-ma-mau-hex-rgb-do-tuong-phan-wcag";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Tỷ lệ tương phản WCAG 2.1 bao nhiêu là đạt chuẩn dễ đọc?",
    answer:
      "Theo tiêu chuẩn W3C WCAG 2.1, chữ thường cần đạt tối thiểu 4.5:1 (mức AA) và lý tưởng từ 7.0:1 trở lên (mức AAA). Đối với chữ lớn (từ 18pt trở lên hoặc 14pt in đậm), mức AA yêu cầu tối thiểu 3.0:1 và AAA là 4.5:1.",
  },
  {
    question: "Tại sao làm Slide bài giảng máy chiếu nên chọn độ tương phản ≥ 7.0:1?",
    answer:
      "Máy chiếu trong phòng học có ánh sáng tự nhiên thường bị giảm độ bão hòa và độ sáng thực tế. Những cặp màu chỉ đạt 3.0:1–4.0:1 trên màn hình laptop có thể bị mờ nhòe khi chiếu lên bảng trắng, vì vậy mức AAA (≥ 7.0:1) giúp học sinh ngồi cuối lớp vẫn đọc rõ.",
  },
  {
    question: "HEX, RGB và HSL khác nhau như thế nào trong CSS?",
    answer:
      "Cả ba đều biểu diễn cùng một không gian màu sRGB trên web: HEX viết gọn dạng thập lục phân (#RRGGBB), RGB tách 3 kênh Đỏ-Lục-Lam (0–255), còn HSL biểu diễn theo Tông màu (Hue 0–360°), Độ bão hòa (Saturation %) và Độ sáng (Lightness %) rất thuận tiện khi tinh chỉnh sắc độ.",
  },
];

export default function BangMaMauWcagPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Thực hành Thiết kế Web HTML/CSS & Tin học 12 cùng QuizKen AI"
      ctaDescription="Kết hợp bảng mã màu chuẩn WCAG vào bài thực hành CSS và ôn luyện bộ câu hỏi trắc nghiệm Thiết kế Web Tin học 12 ngay trên QuizKen."
      ctaHref={appLink("/?subject=tin-hoc")}
      ctaLabel="Tạo đề Tin học 12 bằng AI"
      secondaryCtaHref="/cong-cu/thuc-hanh-html-css-tin-hoc-12"
      secondaryCtaLabel="Mở Sandbox HTML & CSS"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Công thức tính Độ tương phản chuẩn W3C WCAG 2.1
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tỷ lệ tương phản được tính từ độ sáng tương đối (Relative Luminance{" "}
              <code className="text-foreground">L</code>) của màu sáng hơn và màu tối
              hơn theo công thức{" "}
              <strong className="text-foreground">(L1 + 0.05) / (L2 + 0.05)</strong>. Giá trị
              này luôn nằm trong khoảng từ <code>1:1</code> (hai màu giống hệt nhau) đến{" "}
              <code>21:1</code> (chữ đen tuyệt đối trên nền trắng hoặc ngược lại).
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Mẹo phối màu Slide PowerPoint &amp; Website học tập
              </h2>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                Tránh đặt chữ xanh lá sáng hoặc vàng chanh lên nền trắng vì độ
                chói cao khiến tỷ lệ tương phản rất thấp.
              </li>
              <li>
                Ưu tiên nền trắng/kem nhạt với chữ xanh đen (<code>#0F172A</code>) hoặc
                bảng xanh rêu đậm (<code>#14452F</code>) chữ trắng cho bài giảng dài.
              </li>
            </ul>
          </div>
        </div>
      }
    >
      <ColorContrastWcagTool />
    </ToolPageShell>
  );
}
