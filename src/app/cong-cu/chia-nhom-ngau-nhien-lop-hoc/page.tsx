import type { Metadata } from "next";
import { BookOpen, Table2, Users } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { RandomGroupMakerTool } from "@/components/tools/RandomGroupMakerTool";

const SLUG = "chia-nhom-ngau-nhien-lop-hoc";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Công cụ có chia đều sĩ số khi số học sinh không chia hết không?",
    answer:
      "Có. Thuật toán phân bổ theo vòng tròn (round-robin) giúp chênh lệch sĩ số giữa các nhóm không bao giờ vượt quá 1 học sinh (ví dụ 42 bạn chia 4 nhóm sẽ ra 11, 11, 10, 10).",
  },
  {
    question: "Làm sao gửi danh sách nhóm nhanh vào nhóm Zalo lớp học?",
    answer:
      "Sau khi chia xong, bạn nhấn nút 'Copy gửi Zalo / Word'. Văn bản đã được định dạng sẵn tiêu đề nhóm, số thứ tự và ký hiệu ★ Nhóm trưởng để dán vào Zalo hoặc Google Docs rất gọn đẹp.",
  },
  {
    question: "Có thể xuất kết quả chia nhóm sang file Excel không?",
    answer:
      "Có. Nhấn nút 'Tải CSV Excel' để tải bảng danh sách gồm 3 cột (Nhóm, Họ và tên, Vai trò) hỗ trợ UTF-8 BOM nên mở trên Excel không bị lỗi font tiếng Việt.",
  },
];

export default function ChiaNhomNgauNhienPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Chia nhóm xong? Giao bài kiểm tra nhóm qua mã QR trên QuizKen!"
      ctaDescription="Tạo nhanh bộ câu hỏi ôn tập từ PDF bài giảng và cho các nhóm thi đua tính điểm ngay trên lớp học với QuizKen Teacher Tools."
      ctaHref={appLink("/teacher/tools")}
      ctaLabel="Mở Teacher Tools ngay"
      secondaryCtaHref="/cong-cu/vong-quay-goi-ten-hoc-sinh"
      secondaryCtaLabel="Mở Vòng quay gọi tên"
      seoContent={
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-xl font-bold text-foreground">
                  2 Chế độ chia nhóm linh hoạt cho mọi hoạt động lớp học
                </h2>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                <li><strong className="text-foreground">Chia theo số lượng nhóm:</strong> Phù hợp khi lớp chia cố định 4 tổ hoặc 6 nhóm thảo luận trạm.</li>
                <li><strong className="text-foreground">Chia theo sĩ số mỗi nhóm:</strong> Phù hợp bài tập nhóm đôi (2 người), nhóm 4 hoặc nhóm 5 làm dự án STEM.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Ví dụ chia lớp 40 học sinh thành 8 nhóm thảo luận
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Dán cột tên 40 học sinh từ file điểm danh, chọn <strong className="text-foreground">Theo số lượng nhóm = 8</strong>, bật chọn <strong className="text-foreground">Nhóm trưởng</strong>. Hệ thống tạo 8 nhóm × 5 thành viên trong 0.1 giây và cho phép thầy cô copy gửi ngay vào nhóm lớp.
              </p>
              <div className="rounded-xl bg-foreground/[0.04] p-3 text-xs text-foreground dark:bg-foreground/[0.06]">
                <BookOpen className="inline h-4 w-4 text-primary mr-1.5" />
                Mọi thao tác diễn ra cục bộ trên trình duyệt — bảo mật danh sách lớp.
              </div>
            </div>
          </div>
        </div>
      }
    >
      <RandomGroupMakerTool />
    </ToolPageShell>
  );
}
