import type { Metadata } from "next";
import { SearchCode, ShieldCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { RegexTesterTool } from "@/components/tools/RegexTesterTool";

const SLUG = "kiem-tra-bieu-thuc-chinh-quy-regex";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Biểu thức chính quy (Regex) dùng để làm gì trong lập trình?",
    answer:
      "Regex (Regular Expression) là chuỗi mẫu dùng để kiểm tra định dạng dữ liệu đầu vào (như email, số điện thoại, ngày tháng DD/MM/YYYY, CCCD), tìm kiếm và trích xuất thông tin hoặc thay thế văn bản hàng loạt trong Python, JavaScript, SQL và Excel/Google Sheets.",
  },
  {
    question: "Vì sao công cụ cảnh báo lượng từ lồng nhau (ReDoS)?",
    answer:
      "Một số mẫu Regex chứa các dấu lặp lồng nhau không giới hạn như (a+)+ hoặc (.*)* có thể khiến bộ máy Regex quay lui theo cấp số mũ (Catastrophic Backtracking) làm treo trình duyệt. Công cụ tự động phát hiện và chặn trước các mẫu này để bảo vệ thiết bị của bạn.",
  },
  {
    question: "Các cờ g, i, m, u trong Regex có ý nghĩa gì?",
    answer:
      "Cờ g (global) tìm tất cả kết quả thay vì dừng ở kết quả đầu tiên; i (case-insensitive) không phân biệt chữ HOA/thường; m (multiline) cho phép ^ và $ khớp đầu/cuối mỗi dòng; u (unicode) hỗ trợ đầy đủ ký tự tiếng Việt có dấu và emoji.",
  },
];

export default function KiemTraRegexPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Ôn luyện Lập trình Python & Xử lý Chuỗi cùng QuizKen AI"
      ctaDescription="Tạo nhanh bộ câu hỏi trắc nghiệm về xử lý chuỗi, thư viện re trong Python, thuật toán tìm kiếm và Tin học ứng dụng trên QuizKen."
      ctaHref={appLink("/?subject=tin-hoc")}
      ctaLabel="Luyện đề Tin học bằng AI"
      secondaryCtaHref="/cong-cu/dinh-dang-kiem-tra-json-sql-online"
      secondaryCtaLabel="Mở JSON & SQL Formatter"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <SearchCode className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Bảng tra cứu nhanh Ký tự Regex thường gặp
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              {[
                ["\\d", "Chữ số (0–9)"],
                ["\\w", "Chữ, số, dấu _"],
                ["\\s", "Khoảng trắng / Tab"],
                [".", "Bất kỳ ký tự nào"],
                ["^ / $", "Đầu / Cuối chuỗi"],
                ["+", "Lặp ≥ 1 lần"],
                ["*", "Lặp ≥ 0 lần"],
                ["{m,n}", "Lặp từ m đến n lần"],
              ].map(([sym, desc]) => (
                <div
                  key={sym}
                  className="flex items-center justify-between rounded-lg bg-foreground/[0.04] px-3 py-2"
                >
                  <strong className="text-primary">{sym}</strong>
                  <span className="font-sans text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                10 Mẫu Regex thực tế cho Giáo dục &amp; Văn phòng
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Bên cạnh việc gõ biểu thức tùy ý, bạn có thể bấm chọn nhanh 10 mẫu
              dựng sẵn như ngày tháng chuẩn Việt Nam{" "}
              <code className="text-foreground">DD/MM/YYYY</code>, email{" "}
              <code className="text-foreground">.edu.vn</code>, mã học sinh, số điện
              thoại 10 số, mã màu CSS HEX hay mẫu bóc tách số thứ tự câu hỏi trắc
              nghiệm để học và áp dụng ngay.
            </p>
          </div>
        </div>
      }
    >
      <RegexTesterTool />
    </ToolPageShell>
  );
}
