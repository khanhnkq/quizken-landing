import type { Metadata } from "next";
import { FileText, Printer, ShieldCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { MarkdownPrintEditorTool } from "@/components/tools/MarkdownPrintEditorTool";

const SLUG = "soan-thao-markdown-xuat-pdf-a4";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Làm sao để xuất ghi chú Markdown sang file PDF khổ A4 đẹp mắt?",
    answer:
      "Bạn chỉ cần nhấn nút 'In / Xuất PDF A4' ở góc trên bên phải. Hệ thống đã cấu hình sẵn CSS @media print để ẩn thanh công cụ và chỉ giữ lại phần nội dung tài liệu khổ A4 (lề chuẩn 14–16mm), bạn chọn 'Lưu dưới dạng PDF' (Save as PDF) là xong.",
  },
  {
    question: "Trình soạn thảo hỗ trợ những cú pháp Markdown nào?",
    answer:
      "Công cụ hỗ trợ đầy đủ GitHub Flavored Markdown (GFM): tiêu đề H1–H6, chữ đậm/nghiêng, bảng biểu căn lề, danh sách checklist ([ ] / [x]), khối code và trích dẫn.",
  },
  {
    question: "Dữ liệu ghi chú có bị gửi ra ngoài hay lưu trên máy chủ không?",
    answer:
      "Không. Toàn bộ nội dung bạn viết được xử lý trực tiếp trên trình duyệt và tắt hoàn toàn việc thực thi thẻ HTML thô để đảm bảo an toàn tuyệt đối.",
  },
];

export default function SoanThaoMarkdownXuatPdfA4Page() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Chuyển đề cương Markdown thành bộ câu hỏi trắc nghiệm trên QuizKen!"
      ctaDescription="Sau khi hệ thống hóa kiến thức hoặc xuất PDF đề cương, hãy tải tài liệu lên QuizKen AI để tạo bài thi thử trắc nghiệm kèm đáp án giải thích chi tiết."
      ctaHref={appLink("/")}
      ctaLabel="Tạo đề từ tài liệu ngay"
      secondaryCtaHref="/cong-cu/chuyen-bang-excel-sang-markdown-html-latex"
      secondaryCtaLabel="Chuyển bảng Excel sang Markdown"
      seoContent={
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  4 mẫu học tập dựng sẵn
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Bắt đầu ngay chỉ với 1 cú nhấp chuột với Đề cương ôn tập, Bảng tóm tắt công thức, Ghi chú phương pháp Cornell và Biên bản họp nhóm dự án.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Printer className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Tối ưu in ấn khổ A4
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Tự động ngắt trang hợp lý để không bị cắt đôi bảng biểu hay tiêu đề khi in ra giấy hoặc lưu file PDF gửi bạn bè, giảng viên.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  An toàn & Xuất file .md chuẩn
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Tương thích 100% với Notion, Obsidian, GitHub và VS Code. Dễ dàng tải xuống tệp <code>.md</code> hoặc sao chép nhanh.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <MarkdownPrintEditorTool />
    </ToolPageShell>
  );
}
