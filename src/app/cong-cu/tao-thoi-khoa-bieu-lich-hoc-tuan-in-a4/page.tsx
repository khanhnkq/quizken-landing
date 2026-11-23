import type { Metadata } from "next";
import { CalendarDays, Printer } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { WeeklyScheduleMakerTool } from "@/components/tools/WeeklyScheduleMakerTool";

const SLUG = "tao-thoi-khoa-bieu-lich-hoc-tuan-in-a4";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Thời khóa biểu vừa tạo có tự động lưu lại khi tôi đóng trình duyệt không?",
    answer:
      "Có. Toàn bộ lịch học, tên ca và màu sắc bạn chỉnh sửa được lưu trực tiếp trong bộ nhớ trình duyệt (localStorage) trên thiết bị của bạn, không gửi dữ liệu lên máy chủ.",
  },
  {
    question: "Tôi có thể tải Thời khóa biểu về điện thoại hoặc máy tính dưới dạng ảnh không?",
    answer:
      "Có. Nhấn nút 'Tải ảnh PNG sắc nét' để xuất ngay file ảnh độ phân giải cao (2480×1754 px tỷ lệ A4 ngang) làm hình nền máy tính, gửi Zalo hoặc chèn vào báo cáo.",
  },
  {
    question: "Làm sao để in Thời khóa biểu vừa khít 1 trang giấy A4 ngang?",
    answer:
      "Nhấn nút 'In A4 Ngang' ngay trên thanh công cụ. Hệ thống đã cấu hình sẵn CSS @media print (khổ A4 landscape, ẩn menu điều hướng) để bạn in trực tiếp hoặc lưu thành file PDF.",
  },
];

export default function TaoThoiKhoaBieuPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Lấp đầy lịch ôn thi bằng đề luyện tập AI cá nhân hóa"
      ctaDescription="Kết hợp thời khóa biểu tuần với lộ trình tạo đề thi thử mỗi ngày trên QuizKen AI để theo dõi điểm yếu từng chuyên đề."
      ctaHref={appLink("/quiz/create")}
      ctaLabel="Tạo đề ôn tập hàng ngày"
      secondaryCtaHref="/cong-cu/dem-nguoc-ngay-thi-2027"
      secondaryCtaLabel="Xem đếm ngược ngày thi 2027"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Mẹo sắp xếp Thời khóa biểu ôn thi THPT & Đại học hiệu quả
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Hãy phân bổ các môn cần tư duy logic cao (Toán, Vật lý, Tin học, Giải tích) vào khung giờ sáng 07:00–10:30 khi não bộ tỉnh táo nhất; dành buổi chiều cho luyện đề bấm giờ 50–90 phút và buổi tối cho ghi nhớ từ vựng Tiếng Anh hoặc hệ thống công thức.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Printer className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Xuất ảnh PNG độ phân giải 2K & In A4 tức thì
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Công cụ hỗ trợ sẵn 2 bộ mẫu: Thời khóa biểu THPT (Ca Sáng + Chiều + Tối) và Lịch Tín chỉ Đại học, phân loại bằng 7 thẻ màu trực quan. Mọi thao tác vẽ PNG bằng HTML5 Canvas đều xử lý 100% tại trình duyệt.
            </p>
          </div>
        </div>
      }
    >
      <WeeklyScheduleMakerTool />
    </ToolPageShell>
  );
}
