import type { Metadata } from "next";
import { BookMarked, FileCheck2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { CitationGeneratorTool } from "@/components/tools/CitationGeneratorTool";

const SLUG = "tao-trich-dan-tai-lieu-apa-ieee";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Nên chọn chuẩn APA 7, IEEE hay chuẩn Việt Nam (TCVN) cho khóa luận tốt nghiệp?",
    answer:
      "Khối ngành Kinh tế, Xã hội, Giáo dục, Tâm lý học thường dùng APA 7; khối ngành Kỹ thuật, CNTT dùng IEEE (đánh số [1], [2]); các trường công lập viết bằng tiếng Việt theo quy định Bộ GD&ĐT thường dùng chuẩn TCVN xếp thứ tự A–Z.",
  },
  {
    question: "Cách nhập nhiều tác giả trong cùng một tài liệu?",
    answer:
      "Bạn hãy ngăn cách tên các tác giả bằng dấu chấm phẩy (;) hoặc xuống dòng, ví dụ: 'Nguyễn Văn An; Trần Thị Bình'. Công cụ sẽ tự động nối ký hiệu '&' (APA) hoặc 'and' (IEEE).",
  },
  {
    question: "Làm sao định dạng thụt đầu dòng treo (Hanging Indent) khi dán vào Word?",
    answer:
      "Sau khi sao chép toàn bộ danh mục và dán vào Microsoft Word, bạn bôi đen đoạn tài liệu tham khảo rồi nhấn tổ hợp phím Ctrl + T (trên Windows) hoặc Command + T (trên Mac) để thụt lề chuẩn học thuật.",
  },
];

export default function TaoTrichDanTaiLieuPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Ôn thi các môn Đại cương & Nghiên cứu khoa học nhanh hơn với QuizKen"
      ctaDescription="Tải tài liệu PDF nghiên cứu hoặc giáo trình đại học lên QuizKen để tóm tắt ý chính và tự tạo câu hỏi trắc nghiệm ôn thi cuối kỳ."
      ctaHref={appLink("/")}
      ctaLabel="Tạo Quiz từ tài liệu PDF"
      secondaryCtaHref="/de-thi/dai-hoc"
      secondaryCtaLabel="Xem đề thi môn Đại cương"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <BookMarked className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                So sánh nhanh 4 chuẩn trích dẫn phổ biến
              </h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <div className="rounded-xl bg-foreground/[0.04] p-3 dark:bg-foreground/[0.06]">
                <strong className="text-foreground">APA 7th:</strong> Tác giả (Năm). Tiêu đề. Nguồn. DOI/URL — Sắp xếp A–Z.
              </div>
              <div className="rounded-xl bg-foreground/[0.04] p-3 dark:bg-foreground/[0.06]">
                <strong className="text-foreground">IEEE:</strong> [1] Tác giả, &ldquo;Tiêu đề,&rdquo; Tạp chí, Năm — Đánh số theo thứ tự xuất hiện.
              </div>
              <div className="rounded-xl bg-foreground/[0.04] p-3 dark:bg-foreground/[0.06]">
                <strong className="text-foreground">TCVN (Việt Nam):</strong> Tác giả (Năm), Tên tài liệu, Nhà xuất bản/Tạp chí.
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Mẹo kiểm tra danh mục tài liệu tham khảo trước khi nộp luận văn
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Đảm bảo mọi tài liệu trích dẫn trong bài viết đều có mặt trong danh mục cuối bài.</li>
              <li>• Thống nhất duy nhất một chuẩn trích dẫn xuyên suốt toàn bộ báo cáo/tiểu luận.</li>
              <li>• Ưu tiên gắn liên kết DOI cho bài báo khoa học quốc tế và ghi rõ ngày truy cập đối với Website.</li>
            </ul>
          </div>
        </div>
      }
    >
      <CitationGeneratorTool />
    </ToolPageShell>
  );
}
