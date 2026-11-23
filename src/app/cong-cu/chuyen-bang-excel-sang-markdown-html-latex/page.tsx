import type { Metadata } from "next";
import { Code2, FileSpreadsheet, ShieldCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { ExcelTableConverterTool } from "@/components/tools/ExcelTableConverterTool";

const SLUG = "chuyen-bang-excel-sang-markdown-html-latex";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Làm sao để copy bảng từ Excel hoặc Google Sheets sang công cụ này nhanh nhất?",
    answer:
      "Bạn chỉ cần bôi đen vùng dữ liệu trong Excel hoặc Google Sheets, nhấn Ctrl+C (hoặc Cmd+C trên macOS) rồi dán trực tiếp vào ô nhập liệu. Trình duyệt tự giữ dấu Tab ngăn cách các cột nên bảng được nhận diện chính xác ngay lập tức.",
  },
  {
    question: "Đầu ra HTML và LaTeX có xử lý các ký tự đặc biệt như <, >, &, % không?",
    answer:
      "Có. Toàn bộ ký tự đặc biệt trong HTML (<, >, &, \", ') và trong LaTeX (%, $, &, _, #, {, }) đều được escape tự động để tránh lỗi hiển thị hoặc lỗi biên dịch Overleaf.",
  },
  {
    question: "Tôi có thể căn lề riêng cho từng cột (ví dụ cột Tên căn trái, cột Điểm căn phải) không?",
    answer:
      "Có. Trong phần Xem trước bảng, bạn chỉ cần nhấn trực tiếp vào ô tiêu đề của cột bất kỳ để xoay vòng căn lề Trái (L) → Giữa (C) → Phải (R) cho từng cột riêng biệt.",
  },
];

export default function ChuyenBangExcelSangMarkdownHtmlLatexPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Soạn ghi chú Markdown & tạo đề thi tự động cùng QuizKen!"
      ctaDescription="Kết hợp bảng Markdown vừa xuất vào trình soạn thảo đề cương của QuizKen hoặc tải file PDF lên QuizKen AI để tạo bài kiểm tra trắc nghiệm trong tích tắc."
      ctaHref={appLink("/")}
      ctaLabel="Trải nghiệm QuizKen ngay"
      secondaryCtaHref="/cong-cu/soan-thao-markdown-xuat-pdf-a4"
      secondaryCtaLabel="Mở Trình soạn thảo Markdown"
      seoContent={
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Nhận diện TSV & CSV chuẩn RFC
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Hỗ trợ cả dữ liệu copy trực tiếp từ Excel/Google Sheets (Tab-Separated) lẫn tệp CSV có dấu ngoặc kép bao quanh chuỗi chứa dấu phẩy.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  4 định dạng: Markdown, HTML, LaTeX, JSON
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Phục vụ trọn vẹn từ viết tài liệu GitHub/Notion (Markdown GFM), bài tập Tin học 12 (HTML), báo cáo khóa luận khoa học (LaTeX) đến lập trình web (JSON).
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  An toàn & 100% tại trình duyệt
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Dữ liệu bảng điểm lớp học hay số liệu thí nghiệm không bao giờ rời khỏi thiết bị của bạn. Sao chép 1 chạm hoặc tải file về máy ngay lập tức.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <ExcelTableConverterTool />
    </ToolPageShell>
  );
}
