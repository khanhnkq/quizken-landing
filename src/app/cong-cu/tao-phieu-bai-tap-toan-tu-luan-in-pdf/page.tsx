import type { Metadata } from "next";
import { Calculator, Printer } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { MathWorksheetGeneratorTool } from "@/components/tools/MathWorksheetGeneratorTool";

const SLUG = "tao-phieu-bai-tap-toan-tu-luan-in-pdf";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Phương trình bậc hai và Hệ phương trình có đảm bảo ra nghiệm đẹp không?",
    answer:
      "Có. Thuật toán sinh ngược từ cặp nghiệm nguyên (x₁, x₂) hoặc (x₀, y₀) cho trước, do đó 100% bài toán Phương trình bậc nhất, Phương trình bậc hai và Hệ phương trình đều có nghiệm nguyên hoặc phân số tối giản đẹp để học sinh rèn tốc độ tính toán.",
  },
  {
    question: "Tôi có thể tái tạo lại đúng một bộ phiếu bài tập cho nhiều lớp khác nhau không?",
    answer:
      "Có. Mỗi phiếu đi kèm một Mã phiếu (Seed) cố định. Chỉ cần giữ nguyên mã phiếu và dạng bài, hệ thống sẽ sinh chính xác bộ câu hỏi và đáp án giống hệt nhau trên mọi thiết bị.",
  },
  {
    question: "Làm sao tách riêng phần Bảng Đáp Án sang trang giấy mới khi in cho học sinh?",
    answer:
      "Khi nhấn 'In / Xuất PDF A4', CSS in ấn đã tự động chèn ngắt trang (page-break) ngay trước phần Bảng Đáp Án Cuối Trang, giúp giáo viên phát đề sạch cho học sinh và giữ trang đáp án riêng.",
  },
];

export default function TaoPhieuBaiTapToanPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Chuyển từ Phiếu tự luận sang Đề trắc nghiệm Toán 3 phần AI"
      ctaDescription="Cần đề kiểm tra Toán 15 phút, 45 phút hoặc Đề thi thử THPT Quốc gia 2027 chuẩn Công văn 7991? QuizKen AI giúp thầy cô soạn đề và mở phòng thi online chỉ trong 10 giây."
      ctaHref={appLink("/?subject=toan")}
      ctaLabel="Tạo đề Toán bằng AI"
      secondaryCtaHref="/cong-cu/tao-ma-tran-de-thi-cong-van-7991"
      secondaryCtaLabel="Tạo Ma trận đề thi CV 7991"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                5 Chuyên đề Toán nền tảng giúp học sinh tránh mất điểm tính nhẩm
              </h2>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">Số nguyên âm/dương:</strong> Luyện dấu ngoặc, lũy thừa và thứ tự thực hiện phép tính.
              </li>
              <li>
                <strong className="text-foreground">Phân số tối giản:</strong> Tự động rút gọn bằng ước chung lớn nhất (ƯCLN) để đối chiếu kết quả chuẩn.
              </li>
              <li>
                <strong className="text-foreground">Tìm x & Hệ phương trình:</strong> Rèn phản xạ chuyển vế đổi dấu, giải hệ bằng thế hoặc cộng đại số.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Printer className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Thiết kế chuẩn khổ giấy A4 cho Giáo viên & Phụ huynh
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Thầy cô và phụ huynh có thể chọn số lượng 10, 20, 30 hoặc 40 bài, tùy chỉnh tên Trường/Lớp, chừa sẵn dòng kẻ để học sinh trình bày trực tiếp lên giấy và bật/tắt Bảng Đáp Án Cuối Trang chỉ bằng 1 cú nhấp chuột.
            </p>
          </div>
        </div>
      }
    >
      <MathWorksheetGeneratorTool />
    </ToolPageShell>
  );
}
