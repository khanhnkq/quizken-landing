import type { Metadata } from "next";
import { BookOpen, Keyboard, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { TypingSpeedTestTool } from "@/components/tools/TypingSpeedTestTool";

const SLUG = "kiem-tra-toc-do-go-phim-tieng-viet";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Tốc độ gõ phím WPM bao nhiêu là tốt để thi trên máy tính 2027 và IELTS Writing?",
    answer:
      "Tốc độ 40–55 WPM với độ chính xác trên 95% là đủ thoải mái cho các bài thi đánh giá năng lực, thi tốt nghiệp THPT trên máy tính hoặc IELTS Writing trên máy tính. Trên 60 WPM sẽ giúp bạn dư thêm nhiều thời gian kiểm tra lại bài.",
  },
  {
    question: "Chỉ số WPM và CPM được tính như thế nào?",
    answer:
      "Theo chuẩn quốc tế, 1 từ chuẩn tương đương 5 ký tự gõ đúng (bao gồm cả dấu cách). WPM = (Số ký tự đúng / 5) / Số phút; CPM là tổng số ký tự đúng gõ được trong 1 phút.",
  },
  {
    question: "Công cụ có hỗ trợ bộ gõ Telex/VNI tiếng Việt có dấu không?",
    answer:
      "Có. Bạn có thể bật Unikey, EVKey hoặc bộ gõ tiếng Việt mặc định trên Windows/macOS để luyện gõ tiếng Việt có dấu hoàn chỉnh và kiểm tra chính xác dấu thanh.",
  },
  {
    question: "Kỷ lục cá nhân (Best WPM) có bị mất khi tải lại trang không?",
    answer:
      "Kỷ lục cao nhất của bạn được lưu cục bộ trên trình duyệt (localStorage) nên vẫn được giữ lại cho các lần luyện tiếp theo trên cùng thiết bị.",
  },
];

export default function KiemTraTocDoGoPhimPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Làm quen giao diện thi trắc nghiệm trên máy tính cùng QuizKen"
      ctaDescription="Luyện tập các đề thi thử Đánh giá năng lực (HSA, V-ACT, TSA) và THPT 3 phần bấm giờ trực tuyến ngay trên trình duyệt để phản xạ nhanh trong phòng thi."
      ctaHref={appLink("/")}
      ctaLabel="Vào phòng thi thử QuizKen"
      secondaryCtaHref="/de-thi/dgnl"
      secondaryCtaLabel="Xem cấu trúc ĐGNL 2027"
      seoContent={
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Keyboard className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Vì sao cần luyện gõ phím tiếng Việt &amp; tiếng Anh chuẩn bị cho kỳ thi 2027?
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Từ giai đoạn 2026–2027, ngày càng nhiều kỳ thi chuyển sang hình thức làm bài trên máy tính (IELTS on Computer, ĐGNL HSA/TSA, thí điểm thi THPT trên máy tính). Việc gõ phím nhanh và ít sai chính tả giúp giảm áp lực thời gian đáng kể.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Mẹo tăng tốc WPM mà vẫn giữ độ chính xác &gt; 96%
                </h3>
              </div>
              <ul className="space-y-1.5 text-sm text-foreground list-disc pl-5">
                <li><strong>Ưu tiên độ chính xác trước:</strong> Gõ chậm hơn 10% nhưng không phải bấm Backspace sửa lỗi sẽ cho tổng WPM cao hơn.</li>
                <li><strong>Nhìn trước 1–2 từ:</strong> Đọc trước cụm từ tiếp theo thay vì nhìn từng chữ cái đơn lẻ.</li>
                <li><strong>Dùng gõ bỏ dấu cuối từ (Telex):</strong> Giúp nhịp tay đều và hạn chế gãy nhịp khi gõ tiếng Việt dài.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Bảng đánh giá tốc độ gõ phím (WPM)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Tốc độ (WPM)</th>
                      <th className="py-2 font-semibold text-primary">Đánh giá năng lực</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr><td className="py-2 pr-3 font-bold">&lt; 30 WPM</td><td className="py-2 text-muted-foreground">Cần luyện thêm phản xạ 10 ngón</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">30 – 45 WPM</td><td className="py-2">Trung bình khá (đáp ứng gõ văn bản cơ bản)</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">46 – 65 WPM</td><td className="py-2 font-semibold">Khá giỏi (tốt cho IELTS &amp; thi máy tính)</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">&gt; 65 WPM</td><td className="py-2 font-semibold text-primary">Rất nhanh (thành thạo 10 ngón)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <TypingSpeedTestTool />
    </ToolPageShell>
  );
}
