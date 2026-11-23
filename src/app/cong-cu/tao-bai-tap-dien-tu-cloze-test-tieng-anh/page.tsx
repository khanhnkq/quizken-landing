import type { Metadata } from "next";
import { BookOpen, Sparkles } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { EnglishClozeGeneratorTool } from "@/components/tools/EnglishClozeGeneratorTool";

const SLUG = "tao-bai-tap-dien-tu-cloze-test-tieng-anh";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Tôi có thể tự chọn chính xác từ nào cần đục lỗ trong đoạn văn không?",
    answer:
      "Có. Ngoài các chế độ ẩn tự động (Giới từ & Liên từ, Mạo từ & Từ nối, hoặc mỗi từ thứ N), bạn có thể bấm trực tiếp vào từng từ trên đoạn văn để bật/tắt ô trống theo ý muốn.",
  },
  {
    question: "Công cụ có hỗ trợ tạo khung Word Bank xáo trộn và bảng Đáp án không?",
    answer:
      "Có. Hệ thống tự động gom các từ đã ẩn thành khung Word Bank đã xáo trộn ngẫu nhiên (kèm nút xáo trộn lại) và sinh Bảng Đáp Án chi tiết theo đúng thứ tự (1), (2), (3)... Bạn có thể ẩn/hiện từng phần trước khi in.",
  },
  {
    question: "Làm sao chép bài tập Cloze Test sang Microsoft Word mà không bị lỗi định dạng?",
    answer:
      "Chỉ cần nhấn nút 'Copy cho Microsoft Word', toàn bộ đề mục, đoạn văn đã đánh số (1) ________, Word Bank và Answer Key sẽ được sao chép sạch sẽ để dán trực tiếp vào Word hoặc Google Docs.",
  },
];

export default function TaoBaiTapClozeTestPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Tạo đề Đọc hiểu & Cloze Test 4 lựa chọn bằng QuizKen English Hub"
      ctaDescription="Cần đề thi thử Tiếng Anh THPT 2027 dạng Cloze Test trắc nghiệm A/B/C/D kèm giải thích từ vựng và collocation chi tiết? Dùng QuizKen AI chỉ trong 5 giây."
      ctaHref={appLink("/english")}
      ctaLabel="Mở English Hub AI"
      secondaryCtaHref="/de-thi/tieng-anh"
      secondaryCtaLabel="Kho đề Tiếng Anh THPT"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Công cụ soạn bài tập Gap-Fill / Cloze Test chuẩn giáo viên Tiếng Anh
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Trong đề thi THPT Quốc gia 2026–2027 và kỳ thi IELTS / VSTEP, dạng bài đục lỗ (Cloze Test) kiểm tra chuyên sâu giới từ, liên từ (although, however, despite), mạo từ và đại từ quan hệ. Giáo viên chỉ mất 5 giây để biến bất kỳ đoạn báo hay bài đọc SGK Global Success nào thành phiếu bài tập có Word Bank và đáp án.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                3 Bộ đề mẫu bám sát chủ đề trọng tâm THPT 2027
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tích hợp sẵn 3 đoạn đọc hiểu học thuật về Environment & Green Living, AI in Education và Cultural Heritage. Toàn bộ quá trình tách từ, đánh số và xáo trộn Word Bank chạy 100% cục bộ trên trình duyệt.
            </p>
          </div>
        </div>
      }
    >
      <EnglishClozeGeneratorTool />
    </ToolPageShell>
  );
}
