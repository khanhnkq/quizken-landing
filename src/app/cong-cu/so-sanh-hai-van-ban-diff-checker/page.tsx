import type { Metadata } from "next";
import { FileDiff, Sparkles } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { TextDiffCheckerTool } from "@/components/tools/TextDiffCheckerTool";

const SLUG = "so-sanh-hai-van-ban-diff-checker";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Khi nào nên dùng chế độ Theo dòng (Line) và Theo từ (Word)?",
    answer:
      "Chế độ Theo dòng (Line) phù hợp để so sánh mã nguồn Python/HTML/SQL, danh sách học sinh hoặc 2 phiên bản đề thi theo từng câu. Chế độ Theo từ (Word) rất hữu ích khi bạn muốn rà soát từng chữ đã sửa trong một đoạn văn Nghị luận hay bài luận Tiếng Anh.",
  },
  {
    question: "Tùy chọn \"Bỏ khoảng trắng thừa\" và \"Bỏ qua HOA/thường\" hoạt động ra sao?",
    answer:
      "Khi bật các tùy chọn này, thuật toán LCS sẽ chuẩn hóa khoảng trắng đầu/cuối dòng (hoặc viết hoa/thường) trước khi đối chiếu, giúp bạn tập trung vào các thay đổi thực sự về mặt nội dung thay vì lỗi định dạng lặt vặt.",
  },
  {
    question: "Tỷ lệ giống nhau (%) được tính như thế nào?",
    answer:
      "Công cụ tính dựa trên công thức Dice từ kết quả dãy con chung dài nhất (LCS): (2 × số phần tử trùng khớp) / (tổng số phần tử của hai văn bản) × 100%.",
  },
];

export default function SoSanhHaiVanBanPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Soạn & Nâng cấp Đề thi Chuẩn 3 Phần Tự động với QuizKen AI"
      ctaDescription="Thay vì rà soát thủ công từng phiên bản đề, bạn có thể nhập tài liệu vào QuizKen để AI tự động sinh bộ câu hỏi mới, trộn mã đề và xuất Word sắc nét."
      ctaHref={appLink("/quiz/create")}
      ctaLabel="Mở QuizKen Studio"
      secondaryCtaHref="/cong-cu/chuyen-de-word-docx-sang-trac-nghiem"
      secondaryCtaLabel="Trộn mã đề Word (.docx)"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <FileDiff className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Ứng dụng Diff Checker cho Giáo viên &amp; Học sinh
              </h2>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">Soát bản sửa đề thi &amp; giáo án:</strong>{" "}
                Nhận biết ngay câu hỏi hoặc đáp án nào đã được chỉnh sửa giữa 2 bản nháp.
              </li>
              <li>
                <strong className="text-foreground">Đối chiếu bài luận Tiếng Anh / Ngữ văn:</strong>{" "}
                Xem lại những cụm từ đã cải thiện sau khi biên tập câu văn.
              </li>
              <li>
                <strong className="text-foreground">Gỡ lỗi mã nguồn Tin học:</strong>{" "}
                So sánh nhanh đoạn code chạy đúng với đoạn code đang báo lỗi.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Bảo mật nội dung đề thi 100% trên trình duyệt
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Thuật toán đối chiếu LCS (Longest Common Subsequence) chạy hoàn
              toàn bằng JavaScript cục bộ trên máy của bạn. Đề kiểm tra, giáo án
              hay mã nguồn nội bộ không bao giờ bị tải lên bất kỳ máy chủ bên thứ ba nào.
            </p>
          </div>
        </div>
      }
    >
      <TextDiffCheckerTool />
    </ToolPageShell>
  );
}
