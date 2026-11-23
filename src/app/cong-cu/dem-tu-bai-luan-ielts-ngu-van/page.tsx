import type { Metadata } from "next";
import { BookOpen, FileText, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { WordCounterTool } from "@/components/tools/WordCounterTool";

const SLUG = "dem-tu-bai-luan-ielts-ngu-van";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Công cụ đếm từ này có xử lý chính xác tiếng Việt có dấu không?",
    answer:
      "Có. Thuật toán tách từ chuẩn hóa Unicode NFC và nhận diện đầy đủ các ký tự tiếng Việt có dấu (như chữ đ, dấu thanh) lẫn từ viết tắt/nối gạch ngang tiếng Anh như don't hay well-known.",
  },
  {
    question: "IELTS Writing Task 1 và Task 2 yêu cầu tối thiểu bao nhiêu từ?",
    answer:
      "IELTS Writing Task 1 yêu cầu viết tối thiểu 150 từ (nên viết khoảng 160–190 từ) và Task 2 yêu cầu tối thiểu 250 từ (nên viết khoảng 265–300 từ) để tránh bị trừ điểm độ dài.",
  },
  {
    question: "Đoạn văn nghị luận xã hội 200 chữ trong đề thi Ngữ văn THPT nên dài bao nhiêu?",
    answer:
      "Đoạn văn nghị luận xã hội khoảng 200 chữ thường đạt hiệu quả tốt nhất trong biên độ 180 đến 220 từ (tương đương khoảng 2/3 trang giấy thi), trình bày gọn thành một đoạn duy nhất.",
  },
  {
    question: "Tính năng Top 5 từ lặp lại giúp ích gì khi viết luận?",
    answer:
      "Việc lặp lại quá nhiều một từ vựng khóa khiến bài viết đơn điệu và dễ mất điểm tiêu chí Lexical Resource trong IELTS/VSTEP. Bảng thống kê Top 5 từ lặp (tự động lọc từ nối cơ bản) giúp bạn nhận ra ngay các từ cần thay bằng từ đồng nghĩa.",
  },
];

export default function DemTuBaiLuanPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Ôn tập từ vựng học thuật & ngữ pháp IELTS/VSTEP cùng QuizKen"
      ctaDescription="Kết hợp kiểm tra độ dài bài luận với kho đề luyện từ vựng, cụm từ cố định (Collocations) và flashcard Spaced Repetition trên QuizKen English Hub."
      ctaHref={appLink("/english")}
      ctaLabel="Luyện tiếng Anh ngay"
      secondaryCtaHref="/de-thi/tieng-anh"
      secondaryCtaLabel="Xem đề thi Tiếng Anh 2026"
      seoContent={
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Hướng dẫn kiểm soát độ dài &amp; tránh lặp từ khi viết bài luận
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Dù thi IELTS Writing, VSTEP hay Ngữ văn THPT, viết thiếu từ làm mất điểm cấu trúc và ý triển khai, trong khi viết quá dài lại khiến bạn thiếu thời gian rà soát lỗi chính tả, ngữ pháp.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Ví dụ phân tích nhanh bài viết
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Khi dán đoạn văn mẫu mặc định gồm 2 đoạn trên công cụ:
              </p>
              <ul className="space-y-1.5 text-sm text-foreground list-disc pl-5">
                <li>
                  <strong>Tốc độ đọc / nói:</strong> Giúp bạn căn chuẩn thời gian cho bài thuyết trình hoặc phần thi IELTS/VSTEP Speaking (~130 từ/phút).
                </li>
                <li>
                  <strong>Lọc từ lặp thông minh:</strong> Bỏ qua các từ nối phổ biến như <em>và, của, là, the, and</em> để làm nổi bật chính xác các danh từ/động từ nội dung bị lặp lại nhiều lần.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Bảng ngưỡng độ dài chuẩn các kỳ thi phổ biến
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Dạng bài thi</th>
                      <th className="py-2 pr-3 font-semibold">Ngưỡng yêu cầu</th>
                      <th className="py-2 font-semibold text-primary">Biên độ khuyên viết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="py-2 pr-3 font-bold">IELTS Writing Task 1</td>
                      <td className="py-2 pr-3">≥ 150 từ</td>
                      <td className="py-2 font-semibold">160 – 190 từ</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-bold">IELTS Task 2 / VSTEP</td>
                      <td className="py-2 pr-3">≥ 250 từ</td>
                      <td className="py-2 font-semibold">265 – 300 từ</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-bold">Nghị luận xã hội THPT</td>
                      <td className="py-2 pr-3">~200 chữ</td>
                      <td className="py-2 font-semibold">180 – 220 chữ</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-bold">Bài văn nghị luận THPT</td>
                      <td className="py-2 pr-3">~600 chữ</td>
                      <td className="py-2 font-semibold">550 – 650 chữ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <WordCounterTool />
    </ToolPageShell>
  );
}
