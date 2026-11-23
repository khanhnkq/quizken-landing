import type { Metadata } from "next";
import { QrCode, Smartphone } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { ClassroomQrTool } from "@/components/tools/ClassroomQrTool";

const SLUG = "tao-ma-qr-lop-hoc-mien-phi";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Mã QR tạo bằng công cụ này có bị hết hạn hay chèn quảng cáo không?",
    answer:
      "Không bao giờ. Đây là mã QR tĩnh (Static QR) được mã hóa trực tiếp nội dung trên trình duyệt của bạn theo chuẩn ISO/IEC 18004, không qua link trung gian rút gọn nên tồn tại vĩnh viễn và không chứa quảng cáo.",
  },
  {
    question: "Tôi có thể dùng mã QR để chia sẻ link đề thi QuizKen lên máy chiếu lớp học không?",
    answer:
      "Hoàn toàn được. Bạn chỉ cần dán link bài thi trên app.quizken.com, đặt tiêu đề thẻ như 'Kiểm tra 15 phút - Lớp 12A1' rồi tải ảnh PNG/SVG hoặc bấm In thẻ để phát cho học sinh quét.",
  },
  {
    question: "Nên chọn mức sửa lỗi M hay L khi tạo mã QR?",
    answer:
      "Mức M (15%) là lựa chọn cân bằng tốt nhất cho máy chiếu và giấy in. Nếu đường dẫn rất dài (trên 150 ký tự), bạn có thể chuyển sang mức L (7%) để các ô vuông trên mã QR thưa và dễ quét hơn.",
  },
];

export default function TaoMaQrLopHocPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Tạo đề thi trắc nghiệm AI và chia sẻ ngay bằng mã QR"
      ctaDescription="Tạo bài kiểm tra 15 phút, 45 phút trên QuizKen trong 30 giây, sau đó copy link dán vào công cụ tạo QR này để học sinh quét vào phòng thi tức thì."
      ctaHref={appLink("/")}
      ctaLabel="Tạo đề kiểm tra trên QuizKen"
      secondaryCtaHref="/cong-cu/dong-ho-bam-gio-thi-thu-may-chieu"
      secondaryCtaLabel="Mở đồng hồ thi thử máy chiếu"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                3 ứng dụng hiệu quả nhất của Mã QR trong lớp học
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • <strong className="text-foreground">Vào phòng thi online nhanh:</strong> Chiếu thẻ QR trên màn hình lớp học để 40+ học sinh quét vào link QuizKen cùng lúc không gõ sai URL.
              </li>
              <li>
                • <strong className="text-foreground">Chia sẻ Wi-Fi phòng máy:</strong> Chọn tab Wi-Fi Lớp học để học sinh quét tự động kết nối mạng mà không cần đọc mật khẩu.
              </li>
              <li>
                • <strong className="text-foreground">Gắn lên phiếu bài tập in giấy:</strong> Học sinh làm xong trên giấy có thể quét mã QR góc trang để xem đáp án &amp; giải thích chi tiết.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Lưu ý kỹ thuật để mã QR luôn quét nhạy 100%
              </h2>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-4 text-xs leading-relaxed text-muted-foreground dark:bg-foreground/[0.06] sm:text-sm space-y-1.5">
              <div>• Luôn giữ khoảng trắng bao quanh (Quiet Zone) quanh mã QR — công cụ đã tự động thêm viền chuẩn 4 ô.</div>
              <div>• Nếu in khổ nhỏ dưới 3×3 cm, hãy dùng link ngắn và tải định dạng SVG vector để không bị nhòe mực.</div>
            </div>
          </div>
        </div>
      }
    >
      <ClassroomQrTool />
    </ToolPageShell>
  );
}
