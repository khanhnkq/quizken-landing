import type { Metadata } from "next";
import { BookOpen, Sparkles, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { RandomNameWheelTool } from "@/components/tools/RandomNameWheelTool";

const SLUG = "vong-quay-goi-ten-hoc-sinh";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Làm sao dán nhanh danh sách 40–50 học sinh từ Excel vào vòng quay?",
    answer:
      "Bạn chỉ cần bôi đen cột Họ và tên trong Excel hoặc Google Sheets, nhấn Ctrl+C (hoặc Cmd+C) rồi dán trực tiếp vào ô Danh sách học sinh bên phải. Hệ thống tự động tách từng dòng hoặc dấu phẩy.",
  },
  {
    question: "Chế độ 'Không trùng lặp' hoạt động như thế nào?",
    answer:
      "Khi bật tùy chọn 'Tự động loại tên đã trúng', mỗi học sinh sau khi được gọi sẽ tự động tạm ẩn khỏi vòng quay ở các lượt tiếp theo để đảm bảo công bằng. Bạn có thể nhấn 'Khôi phục' bất cứ lúc nào để quay lại đủ cả lớp.",
  },
  {
    question: "Danh sách học sinh có bị gửi lên máy chủ hay lộ thông tin không?",
    answer:
      "Không. Vòng quay hoạt động 100% trên trình duyệt của thầy cô, không lưu dữ liệu lớp học lên bất kỳ máy chủ nào.",
  },
  {
    question: "Có thể kết hợp vòng quay gọi tên với thi trắc nghiệm cả lớp trên QuizKen không?",
    answer:
      "Có! Sau khi gọi tên kiểm tra bài cũ hoặc chia nhóm, thầy cô có thể mở QuizKen Teacher Tools để tổ chức Phòng Thi Live Game cho cả lớp quét mã QR thi đua trực tiếp.",
  },
];

export default function VongQuayGoiTenHocSinhPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Tổ chức trò chơi trắc nghiệm Live Game cả lớp với QuizKen!"
      ctaDescription="Không chỉ gọi tên từng bạn — thầy cô có thể tạo nhanh bộ câu hỏi từ PDF bài giảng và cho cả lớp tham gia thi đấu bảng xếp hạng trực tiếp qua mã QR."
      ctaHref={appLink("/quiz/create")}
      ctaLabel="Mở QuizKen Teacher Tools"
      secondaryCtaHref="/cong-cu/chia-nhom-ngau-nhien-lop-hoc"
      secondaryCtaLabel="Chia nhóm lớp học ngẫu nhiên"
      seoContent={
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-xl font-bold text-foreground">
                  4 Cách dùng Vòng quay gọi tên giúp giờ học sôi nổi hơn
                </h2>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                <li><strong className="text-foreground">Kiểm tra bài cũ công bằng:</strong> Bật chế độ không trùng lặp để mọi học sinh đều có cơ hội được gọi.</li>
                <li><strong className="text-foreground">Chia lượt thuyết trình:</strong> Quay chọn thứ tự lên bảng báo cáo của các nhóm hoặc cá nhân.</li>
                <li><strong className="text-foreground">Mini-game cộng điểm:</strong> Gọi ngẫu nhiên 3 bạn trả lời câu hỏi nhanh đầu giờ để cộng điểm khuyến khích.</li>
                <li><strong className="text-foreground">Chiếu màn hình lớn:</strong> Giao diện chữ rõ, màu sắc tương phản cao dễ nhìn từ cuối lớp học.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Mẹo chuẩn bị danh sách quay nhanh trong 10 giây
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Thầy cô có thể giữ sẵn một file ghi chú chứa danh sách tên các lớp phụ trách (ví dụ 10A1, 10A2...). Mỗi lần lên lớp chỉ cần dán vào ô nhập, hệ thống xử lý mượt mà tới 60+ tên học sinh trên một vòng quay.
              </p>
              <div className="rounded-xl bg-foreground/[0.04] p-3.5 text-xs text-foreground dark:bg-foreground/[0.06]">
                <BookOpen className="inline h-4 w-4 text-primary mr-1.5" />
                <strong>Gợi ý:</strong> Kết hợp cùng{" "}
                <span className="font-semibold">Đồng hồ bấm giờ máy chiếu</span>{" "}
                để giới hạn 60 giây trả lời cho mỗi học sinh được quay trúng.
              </div>
            </div>
          </div>
        </div>
      }
    >
      <RandomNameWheelTool />
    </ToolPageShell>
  );
}
