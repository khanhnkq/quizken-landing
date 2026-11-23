import type { Metadata } from "next";
import { BookOpen, MonitorPlay, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { ExamProjectorTimerTool } from "@/components/tools/ExamProjectorTimerTool";

const SLUG = "dong-ho-bam-gio-thi-thu-may-chieu";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Đồng hồ có hiển thị rõ từ cuối lớp học khi chiếu máy chiếu không?",
    answer:
      "Có. Chế độ 'Chiếu Toàn màn hình' phóng đại chữ số đồng hồ kích thước lớn với font tabular-nums chống giật số, tương phản cao và ẩn thanh điều hướng để cả phòng thi theo dõi dễ dàng.",
  },
  {
    question: "Đồng hồ có phát âm thanh báo còn 5 phút cuối và hết giờ không?",
    answer:
      "Có. Hệ thống dùng Web Audio API tích hợp sẵn (không cần tải file âm thanh ngoài) để phát chuông nhắc nhẹ khi còn 5 phút (với bài thi > 5 phút) và chuông kết thúc khi về 00:00. Thầy cô có thể tắt chuông nếu cần phòng thi yên tĩnh.",
  },
  {
    question: "Các mốc thời gian thi chuẩn GDPT 2018 hiện nay là bao nhiêu phút?",
    answer:
      "Theo quy chế thi THPT hiện hành: Ngữ văn 120 phút, Toán 90 phút, các môn tự chọn (Vật lý, Hóa học, Sinh học, Lịch sử, Địa lý, Ngoại ngữ, Tin học...) đều 50 phút; kiểm tra định kỳ trên lớp thường 15 phút hoặc 45 phút.",
  },
];

export default function DongHoBamGioMayChieuPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Tổ chức thi thử bấm giờ trực tuyến ngay trên QuizKen!"
      ctaDescription="Không chỉ bấm giờ trên lớp — học sinh có thể tự làm bài thi thử 50 phút hoặc 90 phút chuẩn GDPT 2018 ngay tại nhà với đồng hồ đếm ngược tự động nộp bài trên QuizKen."
      ctaHref={appLink("/quiz/create")}
      ctaLabel="Mở Teacher Tools ngay"
      secondaryCtaHref="/cong-cu/tao-phieu-tra-loi-trac-nghiem-2027"
      secondaryCtaLabel="In phiếu tô đáp án A4"
      seoContent={
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Bảng thời lượng thi chuẩn theo Bộ GD&amp;ĐT
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Loại bài kiểm tra / Môn thi</th>
                      <th className="py-2 font-semibold text-primary">Thời gian chuẩn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr><td className="py-2 pr-3">Kiểm tra thường xuyên</td><td className="py-2 font-bold">15 phút</td></tr>
                    <tr><td className="py-2 pr-3">Kiểm tra 1 tiết / Giữa kỳ</td><td className="py-2 font-bold">45 phút</td></tr>
                    <tr><td className="py-2 pr-3">Môn tự chọn THPT (Lý, Hóa, Sinh, Anh, Sử, Địa...)</td><td className="py-2 font-bold">50 phút</td></tr>
                    <tr><td className="py-2 pr-3">Môn Toán THPT / Cuối kỳ</td><td className="py-2 font-bold">90 phút</td></tr>
                    <tr><td className="py-2 pr-3">Môn Ngữ văn THPT</td><td className="py-2 font-bold">120 phút</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <MonitorPlay className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Hướng dẫn sử dụng trên máy chiếu phòng thi
                </h2>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                <li>Chọn mốc thời gian (15p, 45p, 50p, 90p) hoặc tự nhập số phút mong muốn.</li>
                <li>Sửa dòng thông báo thành tên môn thi &amp; mã đề đang phát (VD: &ldquo;Môn Toán — Mã đề 101–104&rdquo;).</li>
                <li>Nhấn <strong className="text-foreground">Chiếu Toàn màn hình</strong> và bấm <strong className="text-foreground">Bắt đầu tính giờ</strong> khi phát hiệu lệnh làm bài.</li>
              </ul>
              <div className="rounded-xl bg-foreground/[0.04] p-3 text-xs text-foreground dark:bg-foreground/[0.06]">
                <BookOpen className="inline h-4 w-4 text-primary mr-1.5" />
                Mẹo: Nhấn phím <kbd className="rounded border px-1">Esc</kbd> bất cứ lúc nào để thoát chế độ toàn màn hình.
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ExamProjectorTimerTool />
    </ToolPageShell>
  );
}
