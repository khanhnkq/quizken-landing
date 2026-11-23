import type { Metadata } from "next";
import { ShieldCheck, Terminal } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { PythonRunnerTool } from "@/components/tools/PythonRunnerTool";

const SLUG = "chay-code-python-online-tin-hoc-10";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Trình chạy Python này có cần cài đặt phần mềm hay mạng Internet tốc độ cao không?",
    answer:
      "Không. Trình thông dịch Python 3 thu gọn chạy 100% bằng TypeScript ngay trên trình duyệt của bạn, không gửi mã nguồn lên máy chủ và phản hồi tức thì dưới vài mili-giây.",
  },
  {
    question: "Điều gì xảy ra nếu em viết nhầm vòng lặp vô hạn while True:?",
    answer:
      "Hệ thống tích hợp bộ đếm an toàn tối đa 10.000 bước thực thi. Nếu phát hiện vòng lặp vô hạn hoặc đệ quy quá sâu, chương trình sẽ tự ngắt sạch sẽ trong dưới 15ms kèm thông báo tiếng Việt để trình duyệt không bị treo.",
  },
  {
    question: "Công cụ hỗ trợ những cú pháp Python nào trong chương trình Tin học 10?",
    answer:
      "Hỗ trợ đầy đủ biến, số nguyên/số thực/chuỗi/boolean/list/dict, f-string, toán tử số học và logic, rẽ nhánh if/elif/else, vòng lặp for/while, break/continue, hàm def/return (kể cả đệ quy), list comprehension và các hàm chuẩn như print, range, len, sum, min, max, sorted, enumerate.",
  },
  {
    question: "Em có thể tải mã nguồn Python về máy để mở trên IDLE hoặc Thonny không?",
    answer:
      "Có. Nhấn nút \"Tải .py\" ở thanh công cụ phía trên để lưu bài làm thành tệp .py chuẩn UTF-8 và mở trực tiếp bằng Python IDLE, Thonny hoặc VS Code.",
  },
];

export default function ChayCodePythonOnlinePage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Luyện trắc nghiệm Python & Thuật toán Tin học 10–12 trên QuizKen AI"
      ctaDescription="Tạo đề thi thử Tin học chuẩn GDPT 2018 gồm cả câu hỏi Đúng/Sai đọc hiểu đoạn code Python, theo dõi giá trị biến và bài tập thuật toán."
      ctaHref={appLink("/?subject=tin-hoc")}
      ctaLabel="Tạo đề Tin học bằng AI"
      secondaryCtaHref="/de-thi/tin-hoc/lop-10"
      secondaryCtaLabel="Xem đề thi Tin học 10"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Kiến thức Python trọng tâm Tin học 10 GDPT 2018
              </h2>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">Biến &amp; Kiểu dữ liệu:</strong>{" "}
                <code>int</code>, <code>float</code>, <code>str</code>, <code>bool</code>,{" "}
                <code>list</code>, <code>dict</code> cùng các phép chia <code>{"//"}</code>, <code>%</code>, <code>**</code>.
              </li>
              <li>
                <strong className="text-foreground">Cấu trúc điều khiển:</strong>{" "}
                Rẽ nhánh <code>if / elif / else</code>, vòng lặp <code>for ... in range(...)</code>,{" "}
                <code>while</code>, <code>break</code> và <code>continue</code>.
              </li>
              <li>
                <strong className="text-foreground">Hàm &amp; Chương trình con:</strong>{" "}
                Định nghĩa hàm bằng <code>def</code>, truyền tham số, trả về giá trị với{" "}
                <code>return</code> và cài đặt hàm đệ quy như giai thừa, Fibonacci, Euclid.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                An toàn Sandbox &amp; Bảng theo dõi biến trực quan
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Khác với các trình chạy gửi code về máy chủ từ xa, bộ thông dịch
              thuần TypeScript chạy hoàn toàn trong bộ nhớ trình duyệt, tuyệt đối
              không dùng cơ chế biên dịch chuỗi động mất an toàn và tự động
              ngắt khi vượt quá <strong className="text-foreground">10.000 bước thực thi</strong>.
              Bảng theo dõi biến bên cạnh giúp học sinh kiểm tra ngay giá trị cuối
              cùng của từng biến và hàm sau khi chạy.
            </p>
          </div>
        </div>
      }
    >
      <PythonRunnerTool />
    </ToolPageShell>
  );
}
