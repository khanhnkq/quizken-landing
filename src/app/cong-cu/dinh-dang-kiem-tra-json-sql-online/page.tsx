import type { Metadata } from "next";
import { Braces, Database } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { JsonSqlFormatterTool } from "@/components/tools/JsonSqlFormatterTool";

const SLUG = "dinh-dang-kiem-tra-json-sql-online";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Làm thế nào để chuyển một mảng JSON sang file Excel CSV?",
    answer:
      "Bạn chỉ cần dán mảng các đối tượng JSON (ví dụ danh sách học sinh [{...}, {...}]) vào tab JSON Validator & CSV. Khi JSON hợp lệ, bảng xem trước CSV sẽ tự động xuất hiện cùng nút \"Tải bảng .csv\" chuẩn UTF-8 BOM để mở tiếng Việt trên Excel không bị lỗi font.",
  },
  {
    question: "Trình định dạng SQL có làm thay đổi giá trị chuỗi bên trong dấu nháy không?",
    answer:
      "Không. Bộ tách từ vựng (Tokenizer) thuần túy giữ nguyên 100% nội dung bên trong dấu nháy đơn ('...'), nháy kép (\"...\"), dấu huyền (`...`) và ghi chú SQL (-- hoặc /* ... */); chỉ viết hoa từ khóa và xuống dòng gọn gàng các mệnh đề SELECT, FROM, WHERE, JOIN, GROUP BY, ORDER BY.",
  },
  {
    question: "Dữ liệu JSON hoặc câu lệnh SQL của em có bị lưu trên máy chủ không?",
    answer:
      "Hoàn toàn không. Mọi thao tác phân tích cú pháp JSON.parse, chuyển CSV và chuẩn hóa SQL đều chạy cục bộ 100% trên trình duyệt của bạn.",
  },
];

export default function DinhDangJsonSqlPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Luyện tập Cơ sở dữ liệu SQL & Tin học 11–12 trên QuizKen AI"
      ctaDescription="Ôn luyện nhanh các câu hỏi trắc nghiệm về khóa chính, khóa ngoại, truy vấn SELECT–JOIN–GROUP BY và cấu trúc dữ liệu JSON bằng trợ lý QuizKen AI."
      ctaHref={appLink("/?subject=tin-hoc")}
      ctaLabel="Tạo đề CSDL SQL bằng AI"
      secondaryCtaHref="/de-thi/tin-hoc/on-thi-thpt"
      secondaryCtaLabel="Làm đề thi Tin học THPT"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Braces className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                3 lỗi cú pháp JSON phổ biến cần tránh
              </h2>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">Dấu phẩy thừa (Trailing comma):</strong>{" "}
                JSON chuẩn không cho phép dấu phẩy sau phần tử cuối cùng trong mảng hoặc đối tượng.
              </li>
              <li>
                <strong className="text-foreground">Dùng nháy đơn thay nháy kép:</strong>{" "}
                Tên khóa (key) và chuỗi giá trị trong JSON bắt buộc phải đặt trong dấu nháy kép <code>&quot;...&quot;</code>.
              </li>
              <li>
                <strong className="text-foreground">Viết ghi chú (comment):</strong>{" "}
                Định dạng JSON tiêu chuẩn không hỗ trợ <code>{"//"}</code> hay <code>{"/* */"}</code>.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Thứ tự các mệnh đề SQL chuẩn CSDL Tin học 11
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Khi viết câu truy vấn lấy dữ liệu trong SQL, các mệnh đề chuẩn luôn tuân
              thủ thứ tự: <strong className="text-foreground">SELECT → FROM → JOIN ... ON → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT</strong>.
              Công cụ tự động thụt lề và viết hoa từ khóa để bạn kiểm tra cấu trúc truy vấn dễ dàng.
            </p>
          </div>
        </div>
      }
    >
      <JsonSqlFormatterTool />
    </ToolPageShell>
  );
}
