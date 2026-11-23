import type { Metadata } from "next";
import { BarChart3, Code2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { AlgorithmVisualizerTool } from "@/components/tools/AlgorithmVisualizerTool";

const SLUG = "mo-phong-thuat-toan-sap-xep-tim-kiem";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Thuật toán nào có trong chương trình Tin học 11 GDPT 2018?",
    answer:
      "Chủ đề Khoa học máy tính Tin học 11 GDPT 2018 tập trung vào các thuật toán sắp xếp cơ bản (Sắp xếp nổi bọt Bubble Sort, Sắp xếp chọn Selection Sort, Sắp xếp chèn Insertion Sort, Sắp xếp nhanh Quick Sort) và hai thuật toán tìm kiếm nền tảng (Tìm kiếm tuần tự, Tìm kiếm nhị phân).",
  },
  {
    question: "Tại sao Tìm kiếm nhị phân lại nhanh hơn rất nhiều so với Tìm kiếm tuần tự?",
    answer:
      "Tìm kiếm tuần tự phải xét tối đa n phần tử (O(n)), còn Tìm kiếm nhị phân mỗi lần so sánh phần tử giữa sẽ loại bỏ một nửa khoảng tìm kiếm nên chỉ mất tối đa khoảng log2(n) bước. Với 1 triệu phần tử, tìm kiếm nhị phân chỉ cần tối đa 20 lần so sánh.",
  },
  {
    question: "Em có thể tự nhập dãy số riêng của đề kiểm tra để xem từng bước chạy không?",
    answer:
      "Có. Bạn chỉ cần nhập dãy số vào ô Dãy số tùy chỉnh, nhấn Áp dụng rồi dùng nút Tiến bước / Lùi bước để quan sát chi tiết từng lần so sánh, hoán đổi và số phép tính phát sinh.",
  },
  {
    question: "Code mẫu Python và C++ có thể chạy thử trực tiếp không?",
    answer:
      "Bạn có thể sao chép ngay đoạn code mẫu Python và mở sang công cụ Chạy Code Python Online ngay trên QuizKen để thử nghiệm với dữ liệu khác nhau.",
  },
];

export default function MoPhongThuatToanPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Ôn tập Trắc nghiệm Thuật toán Tin học 11 & Thi HSG cùng QuizKen AI"
      ctaDescription="Tạo đề thi trắc nghiệm đánh giá độ phức tạp Big-O, đọc hiểu vết thuật toán sắp xếp/tìm kiếm và câu hỏi Đúng/Sai chuẩn GDPT 2018."
      ctaHref={appLink("/?subject=tin-hoc")}
      ctaLabel="Tạo đề Tin học 11 bằng AI"
      secondaryCtaHref="/de-thi/tin-hoc/lop-11"
      secondaryCtaLabel="Xem đề thi Tin học 11"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                So sánh Độ phức tạp Thời gian (Big-O)
              </h2>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">Bubble / Selection / Insertion Sort:</strong>{" "}
                Độ phức tạp trung bình <code className="text-foreground">O(n²)</code>, cài đặt đơn giản,
                dùng bộ nhớ phụ <code className="text-foreground">O(1)</code>.
              </li>
              <li>
                <strong className="text-foreground">Quick Sort:</strong>{" "}
                Độ phức tạp trung bình <code className="text-foreground">O(n log n)</code>,
                rất nhanh trong thực tế nhờ chia để trị.
              </li>
              <li>
                <strong className="text-foreground">Linear vs Binary Search:</strong>{" "}
                Tuần tự tốn <code className="text-foreground">O(n)</code> trên mọi mảng;
                Nhị phân chỉ tốn <code className="text-foreground">O(log n)</code> nhưng đòi hỏi mảng đã sắp xếp.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Học qua trực quan hóa từng bước (Step-by-Step)
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Công cụ ghi lại toàn bộ lịch sử trạng thái của mảng để bạn có thể
              nhấn <strong className="text-foreground">Lùi bước</strong> hoặc{" "}
              <strong className="text-foreground">Tiến bước</strong> bất kỳ lúc nào,
              đối chiếu trực tiếp màu sắc thanh cột với bộ đếm số lần so sánh và
              hoán đổi kèm code mẫu song ngữ <strong className="text-foreground">Python &amp; C++</strong>.
            </p>
          </div>
        </div>
      }
    >
      <AlgorithmVisualizerTool />
    </ToolPageShell>
  );
}
