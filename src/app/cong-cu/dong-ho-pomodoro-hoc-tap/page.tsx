import type { Metadata } from "next";
import { BookOpen, Clock, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { PomodoroStudyTimer } from "@/components/tools/PomodoroStudyTimer";

const SLUG = "dong-ho-pomodoro-hoc-tap";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Phương pháp Pomodoro 25/5 hoạt động như thế nào?",
    answer:
      "Bạn chia thời gian ôn thi thành các phiên tập trung sâu 25 phút hoàn toàn không chạm điện thoại, sau đó nghỉ ngơi 5 phút để não bộ phục hồi. Sau 4 phiên liên tiếp, hãy nghỉ dài 15–20 phút.",
  },
  {
    question: "Âm thanh tiếng mưa và tiếng ồn trắng trên công cụ có tốn dữ liệu 4G không?",
    answer:
      "Không tốn dữ liệu mạng. Hệ thống sử dụng Web Audio API của trình duyệt để tổng hợp sóng âm thanh trực tiếp trên thiết bị (0KB băng thông tải file MP3).",
  },
  {
    question: "Nên chọn chế độ 25/5 hay 50/10 khi luyện đề thi thử?",
    answer:
      "Chế độ 25/5 phù hợp khi học từ vựng, đọc lý thuyết hoặc làm bài tập ngắn. Chế độ 50/10 Deep Work rất lý tưởng khi giải trọn vẹn 1 đề thi thử Toán, Vật lý hoặc viết bài luận IELTS/Ngữ văn.",
  },
  {
    question: "Nhật ký số phiên hoàn thành và danh sách việc cần làm được lưu ở đâu?",
    answer:
      "Dữ liệu được lưu cục bộ ngay trên trình duyệt của bạn (localStorage), giúp bảo mật tuyệt đối và không cần đăng nhập tài khoản.",
  },
];

export default function DongHoPomodoroHocTapPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Kết thúc mỗi phiên Pomodoro bằng 5 câu test Active Recall"
      ctaDescription="Khoa học nhận thức chứng minh tự kiểm tra ngay sau khi học giúp tăng khả năng ghi nhớ dài hạn gấp 2 lần so với đọc lại ghi chú. Tạo nhanh bộ câu hỏi 5–10 câu trên QuizKen."
      ctaHref={appLink("/")}
      ctaLabel="Test nhanh trên QuizKen"
      secondaryCtaHref="/kho-de"
      secondaryCtaLabel="Làm đề từ Kho đề cộng đồng"
      seoContent={
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Quy trình học tập Pomodoro + Active Recall đạt hiệu suất cao
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Kết hợp kỹ thuật quản lý thời gian Pomodoro với Gợi nhớ chủ động (Active Recall) giúp loại bỏ trạng thái trì hoãn và cảm giác học nhiều nhưng nhanh quên:
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
                <p className="font-heading text-sm font-bold text-foreground">Bước 1: Chốt 1 mục tiêu</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Ghi rõ 1 đầu việc cụ thể (VD: Giải xong 15 câu Hàm số) vào danh sách trước khi bấm Bắt đầu.
                </p>
              </div>
              <div className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
                <p className="font-heading text-sm font-bold text-foreground">Bước 2: Tập trung sâu</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Bật chế độ toàn màn hình và âm thanh mưa nhẹ hoặc brown noise để che tiếng ồn xung quanh.
                </p>
              </div>
              <div className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
                <p className="font-heading text-sm font-bold text-foreground">Bước 3: Test Active Recall</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Khi chuông báo kết thúc vang lên, hãy tự giải 5–10 câu trắc nghiệm kiểm tra lại kiến thức vừa học.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Ví dụ lịch ôn thi buổi tối 2 tiếng với Pomodoro
                </h3>
              </div>
              <ul className="space-y-1.5 text-sm text-foreground list-disc pl-5">
                <li>
                  <strong>Phiên 1 (25/5):</strong> Ôn lý thuyết &amp; công thức chương Hóa hữu cơ.
                </li>
                <li>
                  <strong>Phiên 2 (25/5):</strong> Làm bài tập trắc nghiệm Đúng/Sai trên QuizKen.
                </li>
                <li>
                  <strong>Phiên 3 (50/10):</strong> Giải trọn 1 đề thi thử Tiếng Anh hoặc Toán bấm giờ.
                </li>
                <li>
                  <strong>Tổng kết:</strong> Đạt 100 phút tập trung thực chất không bị mạng xã hội làm gián đoạn.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Bảng chọn nhịp Pomodoro theo loại bài học
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Chế độ</th>
                      <th className="py-2 pr-3 font-semibold">Nhịp học / nghỉ</th>
                      <th className="py-2 font-semibold text-primary">Phù hợp nhất cho</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="py-2 pr-3 font-bold">Sprint</td>
                      <td className="py-2 pr-3">15p / 3p</td>
                      <td className="py-2 text-muted-foreground">Khởi động, học flashcard từ vựng</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-bold">Classic</td>
                      <td className="py-2 pr-3">25p / 5p</td>
                      <td className="py-2 text-muted-foreground">Làm bài tập, đọc tài liệu, ghi chú</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-bold">Deep Work</td>
                      <td className="py-2 pr-3">50p / 10p</td>
                      <td className="py-2 text-muted-foreground">Luyện đề thi thử, viết bài luận dài</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <PomodoroStudyTimer />
    </ToolPageShell>
  );
}
