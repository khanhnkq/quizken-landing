import type { Metadata } from "next";
import { CalendarDays, Clock, UserCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { DateAgeDurationTool } from "@/components/tools/DateAgeDurationTool";

const SLUG = "tinh-khoang-cach-ngay-tuoi-lich-on-thi";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Công cụ đếm số ngày có tính chính xác năm nhuận (29/02) không?",
    answer:
      "Có. Toàn bộ phép tính ngày tháng đều sử dụng chuẩn lịch dương UTC (bao gồm các năm nhuận như 2024, 2028) nên không bị sai lệch múi giờ hoặc thiếu ngày.",
  },
  {
    question: "Vì sao cần đếm 'số buổi học trừ Chủ Nhật' khi lập kế hoạch ôn thi?",
    answer:
      "Nếu từ hôm nay đến ngày thi còn 70 ngày nhưng bạn dành ngày Chủ Nhật để nghỉ ngơi phục hồi, số ngày học thực chiến sẽ là 60 ngày. Biết chính xác con số này giúp bạn phân bổ số đề thi thử mỗi tuần thực tế hơn.",
  },
  {
    question: "Tính tuổi hồ sơ tuyển sinh theo mốc ngày cụ thể dùng để làm gì?",
    answer:
      "Nhiều kỳ thi tuyển sinh lớp 10, xét tuyển trường công an/quân đội hoặc làm giấy tờ hành chính yêu cầu xác định tuổi chính xác (năm, tháng, ngày) tính đến một mốc quy định như 01/06 hoặc 01/09.",
  },
];

export default function TinhKhoangCachNgayTuoiLichOnThiPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Đã chốt xong lộ trình ngày ôn thi? Luyện đề ngay trên QuizKen!"
      ctaDescription="Kết hợp kế hoạch ôn tập vừa chia chặng với kho đề thi thử 3 phần chuẩn GDPT 2018 và chế độ tạo đề AI từ PDF tài liệu trên QuizKen."
      ctaHref={appLink("/")}
      ctaLabel="Bắt đầu luyện đề miễn phí"
      secondaryCtaHref="/cong-cu/dem-nguoc-ngay-thi-2027"
      secondaryCtaLabel="Xem đồng hồ đếm ngược thi 2027"
      seoContent={
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Đếm ngày & tuần ôn thi
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Tính tổng số ngày giữa 2 mốc thời gian, tách rõ số tuần + ngày lẻ, số ngày học Thứ 2–Thứ 7 và số ngày làm việc Thứ 2–Thứ 6.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Tính tuổi làm hồ sơ chuẩn xác
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Hiển thị chính xác số năm, tháng, ngày tuổi tính đến bất kỳ mốc ngày nào, kèm đếm ngược ngày sinh nhật tiếp theo và kiểm tra mốc 15/18 tuổi.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Chia 3 giai đoạn ôn tập
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Khi cộng thêm từ 14 ngày trở lên ở tab Cộng/Trừ ngày, công cụ tự động gợi ý các mốc hạn chót cho 3 chặng: Nền tảng (40%), Luyện đề (40%) và Tổng ôn (20%).
              </p>
            </div>
          </div>
        </div>
      }
    >
      <DateAgeDurationTool />
    </ToolPageShell>
  );
}
