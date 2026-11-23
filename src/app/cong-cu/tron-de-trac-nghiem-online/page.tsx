import type { Metadata } from "next";
import { BookOpen, FileCode2, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { ExamShufflerTool } from "@/components/tools/ExamShufflerTool";

const SLUG = "tron-de-trac-nghiem-online";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Làm sao để đánh dấu đáp án đúng khi dán câu hỏi vào công cụ trộn đề?",
    answer:
      "Bạn chỉ cần đặt dấu sao (*) ngay trước ký tự đáp án đúng (ví dụ *A. Nội dung đúng) hoặc ghi [Đáp án: A] ở cuối mỗi câu hỏi. Hệ thống sẽ tự động ghi nhớ đáp án đúng khi đảo thứ tự A/B/C/D và xuất ra Bảng Đáp Án Tổng cho cả 4 mã đề 101–104.",
  },
  {
    question: "Dữ liệu đề thi của thầy cô dán vào có bị lưu lên máy chủ không?",
    answer:
      "Hoàn toàn không. Công cụ trộn đề chạy 100% trực tiếp trên trình duyệt của bạn (client-side), không gửi nội dung đề lên bất kỳ máy chủ nào nên đảm bảo bảo mật tuyệt đối cho đề kiểm tra nội bộ.",
  },
  {
    question: "Nếu đề thi có công thức Toán (MathType/LaTeX) và hình ảnh từ Word thì nên dùng công cụ nào?",
    answer:
      "Công cụ trộn nhanh này phù hợp nhất với đề văn bản thuần (TXT/HTML). Nếu đề của bạn có công thức Toán/Lý/Hóa phức tạp, hình ảnh minh họa hoặc 3 phần GDPT 2018, hãy dùng QuizKen Teacher Tools (miễn phí) để trộn và xuất thẳng ra file Word (.docx) giữ nguyên 100% định dạng.",
  },
  {
    question: "File tải về định dạng HTML có in được ngay thành đề A4 không?",
    answer:
      "Có. File .HTML tải về đã được định dạng sẵn khổ giấy A4, chia 4 mã đề riêng biệt từng trang (page-break) và kèm Bảng Đáp Án Tổng ở trang cuối. Bạn chỉ cần mở bằng Chrome/Edge rồi nhấn Ctrl+P (hoặc Cmd+P) để in hoặc lưu PDF.",
  },
];

export default function TronDeTracNghiemOnlinePage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Xuất thẳng Word (.docx) & PDF chuẩn A4 với QuizKen Teacher Tools"
      ctaDescription="Tạo đề kiểm tra bằng AI từ file PDF/Word sẵn có, trộn đề không giới hạn mã đề, tự động giữ nguyên công thức Toán/Hóa và in phiếu chấm điểm ngay trên QuizKen."
      ctaHref={appLink("/teacher/tools")}
      ctaLabel="Mở Teacher Tools ngay"
      secondaryCtaHref="/cong-cu/tao-phieu-tra-loi-trac-nghiem-2027"
      secondaryCtaLabel="Tạo phiếu tô đáp án A4"
      seoContent={
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <FileCode2 className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Hướng dẫn cú pháp soạn đề chuẩn để trộn 100% chính xác
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Bạn có thể copy trực tiếp từ file Word hoặc Google Docs theo một trong 2 mẫu sau:
              </p>
              <pre className="overflow-x-auto rounded-xl bg-foreground/[0.04] p-4 font-mono text-xs leading-relaxed text-foreground dark:bg-foreground/[0.06]">
{`Câu 1: Thủ đô của Việt Nam là gì?
*A. Hà Nội
B. Đà Nẵng
C. TP. Hồ Chí Minh
D. Hải Phòng

Câu 2: Số nguyên tố chẵn duy nhất là?
A. 0
B. 1
C. 2
D. 4
[Đáp án: C]`}
              </pre>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-xl font-bold text-foreground">
                  So sánh Trộn đề nhanh &amp; QuizKen Teacher Tools
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Tính năng</th>
                      <th className="py-2 pr-3 font-semibold">Trộn nhanh Web</th>
                      <th className="py-2 font-semibold text-primary">Teacher Tools App</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="py-2.5 pr-3 font-medium">Số mã đề</td>
                      <td className="py-2.5 pr-3">4 mã (101–104)</td>
                      <td className="py-2.5 font-semibold">Tùy chọn không giới hạn</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-medium">Định dạng xuất</td>
                      <td className="py-2.5 pr-3">Copy, .TXT, .HTML (In A4)</td>
                      <td className="py-2.5 font-semibold">Word (.docx) &amp; PDF A4</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-medium">Cấu trúc GDPT 2018</td>
                      <td className="py-2.5 pr-3 text-muted-foreground">Phần I (A/B/C/D)</td>
                      <td className="py-2.5 font-semibold">Đủ cả 3 phần (MCQ, Đ/S, Ngắn)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-medium">Công thức &amp; Ảnh</td>
                      <td className="py-2.5 pr-3 text-muted-foreground">Văn bản thuần</td>
                      <td className="py-2.5 font-semibold">Giữ nguyên MathType / LaTeX</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-2.5">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="font-heading text-lg font-bold text-foreground">
                Ví dụ quy trình trộn đề trong 30 giây
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              1. Dán 20–40 câu hỏi trắc nghiệm vào ô bên trái (hoặc bấm <strong className="text-foreground">Nạp đề mẫu</strong> để thử nghiệm). 2. Giữ bật cả 2 tùy chọn đảo câu hỏi và đảo đáp án A/B/C/D. 3. Kiểm tra nhanh ở tab <strong className="text-foreground">Bảng Đáp Án Tổng</strong> rồi bấm <strong className="text-foreground">Tải bản in A4 (.HTML)</strong> để in phát cho cả phòng thi.
            </p>
          </div>
        </div>
      }
    >
      <ExamShufflerTool />
    </ToolPageShell>
  );
}
