import type { Metadata } from "next";
import { BookOpen, Printer, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { AnswerSheetTool } from "@/components/tools/AnswerSheetTool";

const SLUG = "tao-phieu-tra-loi-trac-nghiem-2027";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Phiếu trả lời trắc nghiệm mới 2026–2027 của Bộ GD&ĐT gồm những phần nào?",
    answer:
      "Theo mẫu phiếu mới áp dụng từ kỳ thi THPT 2025–2027, phiếu gồm 3 phần rõ rệt: Phần I (Câu trắc nghiệm nhiều lựa chọn A, B, C, D); Phần II (Câu trắc nghiệm Đúng/Sai với 4 ý a, b, c, d mỗi câu); và Phần III (Câu trắc nghiệm trả lời ngắn gồm 4 cột ký tự: dấu '-', dấu ',' và chữ số 0–9).",
  },
  {
    question: "Cách tô đáp án Phần III (Trả lời ngắn) chuẩn để không bị máy chấm lỗi là gì?",
    answer:
      "Thí sinh viết kết quả (tối đa 4 ký tự gồm số âm '-', dấu phẩy thập phân ',' và các chữ số 0–9) vào 4 ô trống phía trên từ trái sang phải, sau đó tô kín các ô tròn tương ứng ngay bên dưới mỗi cột. Ô trống không dùng đến để nguyên.",
  },
  {
    question: "Làm sao để lưu phiếu trả lời thành file PDF sắc nét trên máy tính?",
    answer:
      "Bạn chỉ cần tùy chỉnh số lượng câu cho từng phần rồi nhấn nút 'In / Lưu PDF A4'. Trong hộp thoại in của trình duyệt (Chrome/Edge/Safari), chọn Máy in đích là 'Save as PDF' (Lưu dưới dạng PDF), khổ giấy A4 và lề mặc định/nhỏ — thanh điều hướng website sẽ tự động được ẩn đi.",
  },
  {
    question: "Có thể tạo mẫu phiếu chỉ có 40 câu trắc nghiệm ABCD cho môn Tiếng Anh không?",
    answer:
      "Có. Bạn chỉ cần nhấn nút chọn nhanh 'Mẫu 40 câu MCQ' (hoặc kéo thanh trượt Phần II và Phần III về 0 câu), phiếu sẽ tự động căn chỉnh lại lưới 40 câu Phần I chuẩn A4.",
  },
];

export default function TaoPhieuTraLoiTracNghiemPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Đã có phiếu tô A4? Tạo đề thi 3 phần chuẩn GDPT 2018 ngay trên QuizKen"
      ctaDescription="Kết hợp phiếu tô đáp án A4 miễn phí với tính năng tự động sinh đề & trộn 4 mã đề chuẩn cấu trúc Bộ GD&ĐT trên QuizKen Teacher Tools để tổ chức thi thử chỉ trong 5 phút."
      ctaHref={appLink("/quiz/create")}
      ctaLabel="Tạo đề thi chuẩn 3 phần"
      secondaryCtaHref="/cong-cu/tron-de-trac-nghiem-online"
      secondaryCtaLabel="Trộn đề trắc nghiệm 4 mã"
      seoContent={
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Cấu trúc số câu chuẩn các môn thi THPT 2025–2027
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Môn thi</th>
                      <th className="py-2 pr-3 font-semibold">Phần I (MCQ)</th>
                      <th className="py-2 pr-3 font-semibold">Phần II (Đ/S)</th>
                      <th className="py-2 font-semibold">Phần III (Ngắn)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="py-2.5 pr-3 font-bold">Toán học</td>
                      <td className="py-2.5 pr-3">12 câu</td>
                      <td className="py-2.5 pr-3">4 câu</td>
                      <td className="py-2.5">6 câu</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-bold">Vật lý, Hóa, Sinh, Địa</td>
                      <td className="py-2.5 pr-3">18 câu</td>
                      <td className="py-2.5 pr-3">4 câu</td>
                      <td className="py-2.5">6 câu</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-bold">Lịch sử, GDKT&amp;PL, Tin</td>
                      <td className="py-2.5 pr-3">24 câu</td>
                      <td className="py-2.5 pr-3">4 câu</td>
                      <td className="py-2.5">0 câu</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-bold">Tiếng Anh / Ngoại ngữ</td>
                      <td className="py-2.5 pr-3">40 câu</td>
                      <td className="py-2.5 pr-3">0 câu</td>
                      <td className="py-2.5">0 câu</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Printer className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Hướng dẫn in phiếu A4 &amp; quy tắc tô đáp án chuẩn
                </h2>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                <li>
                  <strong className="text-foreground">Bước 1:</strong> Chọn mẫu môn học (VD: 12-4-6 cho Toán, 18-4-6 cho Lý/Hóa/Sinh) và điền tên trường/kỳ thi.
                </li>
                <li>
                  <strong className="text-foreground">Bước 2:</strong> Nhấn nút <strong className="text-foreground">In / Lưu PDF A4</strong>. Chọn khổ giấy A4 dọc, bỏ chọn &ldquo;Headers and footers&rdquo; trong cửa sổ in để phiếu sạch đẹp nhất.
                </li>
                <li>
                  <strong className="text-foreground">Bước 3:</strong> Nhắc học sinh tô kín tròn bằng bút chì đen 2B ở Số báo danh (6 số), Mã đề (3 số) và cả 3 phần trả lời.
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-2.5">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="font-heading text-lg font-bold text-foreground">
                Ví dụ ghi &amp; tô Phần III (Trả lời ngắn)
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Nếu đáp án bài toán là <strong className="text-foreground">-2,5</strong>, học sinh điền vào 4 ô đầu cột theo thứ tự <code className="rounded bg-foreground/[0.06] px-1.5 py-0.5 text-foreground">- | 2 | , | 5</code> rồi tô ô <code className="rounded bg-foreground/[0.06] px-1.5 py-0.5 text-foreground">-</code> ở cột 1, số <code className="rounded bg-foreground/[0.06] px-1.5 py-0.5 text-foreground">2</code> ở cột 2, dấu <code className="rounded bg-foreground/[0.06] px-1.5 py-0.5 text-foreground">,</code> ở cột 3 và số <code className="rounded bg-foreground/[0.06] px-1.5 py-0.5 text-foreground">5</code> ở cột 4. Lưu ý ở Việt Nam dấu thập phân dùng dấu phẩy (<code className="text-foreground">,</code>).
            </p>
          </div>
        </div>
      }
    >
      <AnswerSheetTool />
    </ToolPageShell>
  );
}
