import type { Metadata } from "next";
import { BookOpen, Printer, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { PrintableFlashcardTool } from "@/components/tools/PrintableFlashcardTool";

const SLUG = "in-flashcard-2-mat-a4";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Tại sao phải đảo cột Trái ↔ Phải ở trang mặt sau khi in Flashcard 2 mặt?",
    answer:
      "Khi bạn in 2 mặt trên khổ A4 (lật theo cạnh dài - Flip on Long Edge), thẻ nằm ở cột bên trái của mặt trước sẽ tương ứng với vị trí bên phải ở mặt sau. Công cụ tự động đảo cột đối xứng giúp bạn cắt thẻ ra là khớp 100%.",
  },
  {
    question: "Có thể copy trực tiếp danh sách từ vựng từ Quizlet hoặc Excel sang để in không?",
    answer:
      "Có. Bạn chỉ cần copy 2 cột (Từ vựng và Nghĩa) từ Excel/Google Sheets hoặc xuất dạng Tab từ Quizlet rồi dán vào ô nhập — hệ thống tự nhận diện dấu Tab, dấu gạch đứng (|) hoặc dấu gạch ngang (-).",
  },
  {
    question: "Nên chọn chế độ 8 thẻ hay 10 thẻ mỗi trang A4?",
    answer:
      "Chọn 8 thẻ/trang (2×4) nếu nội dung có giải thích dài hoặc công thức lớn; chọn 10 thẻ/trang (2×5) để tiết kiệm giấy khi học từ vựng ngắn.",
  },
];

export default function InFlashcardHaiMatA4Page() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Học Flashcard Spaced Repetition & Phát âm AI mọi lúc trên QuizKen!"
      ctaDescription="Ngoài bản in giấy A4, hãy tải tài liệu PDF hoặc danh sách từ vựng lên QuizKen App để ôn tập theo thuật toán lặp lại ngắt quãng và tự động sinh bài test trắc nghiệm."
      ctaHref={appLink("/")}
      ctaLabel="Học Flashcard AI trên QuizKen"
      secondaryCtaHref="/cong-cu/chuyen-doi-chu-hoa-thuong-soat-loi-van-ban"
      secondaryCtaLabel="Chuẩn hóa danh sách văn bản"
      seoContent={
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Printer className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Hướng dẫn in 2 mặt A4 không bị lệch thẻ
                </h2>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                <li>Chọn khổ giấy <strong className="text-foreground">A4 Portrait</strong> và lề mặc định khi bấm <strong className="text-foreground">In / Lưu PDF A4 ngay</strong>.</li>
                <li>Nếu dùng máy in 2 mặt tự động, chọn chế độ <strong className="text-foreground">Flip on Long Edge (Lật theo cạnh dài)</strong>.</li>
                <li>Nếu in 1 mặt rồi lật giấy thủ công, in toàn bộ các trang Mặt trước, sau đó đảo mặt giấy theo chiều dọc nạp lại để in các trang Mặt sau.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Cú pháp nhập nhanh được hỗ trợ
                </h2>
              </div>
              <pre className="rounded-xl bg-foreground/[0.04] p-4 font-mono text-xs text-foreground dark:bg-foreground/[0.06]">
{`ubiquitous | có mặt khắp nơi
Đạo hàm (x^n)' | n * x^(n-1)
H2SO4 đặc nóng - oxi hóa mạnh`}
              </pre>
              <p className="text-xs text-muted-foreground">
                <BookOpen className="inline h-4 w-4 text-primary mr-1.5" />
                Mẹo: Dùng giấy bìa định lượng 160–200gsm để thẻ flashcard cứng cáp và bền hơn khi ôn thi.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <PrintableFlashcardTool />
    </ToolPageShell>
  );
}
