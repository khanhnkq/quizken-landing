import type { Metadata } from "next";
import { Code2, ShieldCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { HtmlCssSandboxTool } from "@/components/tools/HtmlCssSandboxTool";

const SLUG = "thuc-hanh-html-css-tin-hoc-12";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Công cụ thực hành HTML & CSS này có bám sát SGK Tin học 12 GDPT 2018 không?",
    answer:
      "Có. 6 bài mẫu được biên soạn theo mạch kiến thức Chủ đề F (Tạo trang web) của chương trình Tin học 12 GDPT 2018: định dạng văn bản và danh sách, bảng biểu thời khóa biểu, biểu mẫu tĩnh, CSS Box Model, bố cục Flexbox và dự án hồ sơ học tập.",
  },
  {
    question: "Tại sao chế độ học tập lại tắt JavaScript và thẻ script?",
    answer:
      "Để đảm bảo an toàn tuyệt đối cho học sinh và giáo viên khi thử nghiệm mã HTML/CSS trên trình duyệt, công cụ lọc bỏ mọi thẻ script, sự kiện on* và chạy khung xem trước bên trong iframe sandbox=\"\" tắt thực thi kịch bản.",
  },
  {
    question: "Em có thể tải bài thực hành về máy để nộp cho thầy cô không?",
    answer:
      "Có. Bạn chỉ cần nhấn nút \"Tải .html\" ở thanh công cụ phía trên để lưu toàn bộ mã HTML5 và CSS3 thành một tệp .html hoàn chỉnh, có thể mở bằng Chrome, Edge hoặc nộp trực tiếp lên hệ thống học tập.",
  },
  {
    question: "Làm sao để kiểm tra trang web hiển thị trên điện thoại và máy tính?",
    answer:
      "Ở góc trên khung Xem trước trực tiếp, bạn có thể chuyển đổi nhanh giữa 3 kích thước màn hình: Máy tính, Tablet (768px) và Điện thoại (375px) để rèn kỹ năng thiết kế giao diện đáp ứng.",
  },
];

export default function ThucHanhHtmlCssPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Ôn thi Trắc nghiệm HTML, CSS & Tin học 12 GDPT 2018 cùng QuizKen AI"
      ctaDescription="Tạo ngay đề luyện tập trắc nghiệm chuẩn 3 phần (Nhiều lựa chọn, Đúng/Sai, Trả lời ngắn) về thẻ HTML5, CSS Selector, Box Model và mạng máy tính."
      ctaHref={appLink("/?subject=tin-hoc")}
      ctaLabel="Tạo đề Tin học 12 bằng AI"
      secondaryCtaHref="/de-thi/tin-hoc/on-thi-thpt"
      secondaryCtaLabel="Làm đề thi Tin học THPT"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Nhóm thẻ HTML5 &amp; Thuộc tính CSS3 trọng tâm Tin học 12
              </h2>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">Cấu trúc &amp; Văn bản:</strong>{" "}
                <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>,{" "}
                <code>&lt;section&gt;</code>, <code>&lt;h1&gt;–&lt;h6&gt;</code>,{" "}
                <code>&lt;p&gt;</code>, <code>&lt;ul&gt;/&lt;ol&gt;/&lt;li&gt;</code>.
              </li>
              <li>
                <strong className="text-foreground">Bảng biểu &amp; Biểu mẫu:</strong>{" "}
                <code>&lt;table&gt;</code>, <code>&lt;thead&gt;</code>,{" "}
                <code>&lt;tr&gt;</code>, <code>&lt;th&gt;</code>, <code>&lt;td&gt;</code>,{" "}
                <code>&lt;label&gt;</code>, <code>&lt;input&gt;</code>, <code>&lt;select&gt;</code>.
              </li>
              <li>
                <strong className="text-foreground">Định dạng CSS cốt lõi:</strong>{" "}
                <code>color</code>, <code>background</code>,{" "}
                <code>padding / border / margin</code> (Box Model) và{" "}
                <code>display: flex</code>.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                An toàn tuyệt đối trong môi trường lớp học
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Toàn bộ mã nguồn HTML/CSS được xử lý trực tiếp trên trình duyệt của
              bạn, không gửi dữ liệu lên máy chủ. Hệ thống lọc nghiêm ngặt các
              thẻ động và cô lập khung hiển thị bằng{" "}
              <code className="text-foreground">iframe sandbox=&quot;&quot;</code> để học sinh
              thực hành an toàn ngay cả trên máy tính phòng thực hành nhà trường.
            </p>
          </div>
        </div>
      }
    >
      <HtmlCssSandboxTool />
    </ToolPageShell>
  );
}
