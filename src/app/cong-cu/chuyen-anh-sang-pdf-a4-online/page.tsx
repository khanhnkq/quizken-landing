import type { Metadata } from "next";
import { FileCheck2, Lock, Printer } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { ImageToPdfTool } from "@/components/tools/ImageToPdfTool";

const SLUG = "chuyen-anh-sang-pdf-a4-online";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Ảnh chụp vở ghi hay bài tập của tôi có bị tải lên máy chủ không?",
    answer:
      "Tuyệt đối không. Toàn bộ quá trình đọc ảnh, xoay chiều, sắp xếp trang và đóng gói thành tệp PDF chuẩn A4 đều chạy 100% cục bộ bằng Canvas và JavaScript ngay trên trình duyệt của bạn.",
  },
  {
    question: "Nên chọn bố cục 1 ảnh/trang hay 2 ảnh/trang A4 khi nộp bài?",
    answer:
      "Nếu ảnh là trang bài tập dài, chữ nhỏ hoặc cần nộp file chấm bài rõ nét, bạn nên chọn 1 ảnh / trang A4 có lề. Nếu muốn in đề cương hoặc vở ghi chép tiết kiệm giấy, chế độ 2 ảnh / trang A4 là lựa chọn tối ưu.",
  },
  {
    question: "Tôi có thể kết hợp nhiều định dạng ảnh JPG, PNG và WebP trong cùng 1 file PDF không?",
    answer:
      "Có. Bạn có thể chọn trộn lẫn ảnh chụp điện thoại (JPG), ảnh chụp màn hình (PNG) và ảnh WebP, sau đó kéo lên/xuống để sắp xếp đúng thứ tự trước khi xuất PDF.",
  },
  {
    question: "File PDF tải về có mở được trên điện thoại, Zalo và trình duyệt không?",
    answer:
      "Có. Công cụ tạo file PDF 1.4 tiêu chuẩn tương thích hoàn toàn với Chrome, Safari, Adobe Acrobat, Zalo, Google Classroom và Azota để nộp bài trực tuyến.",
  },
];

export default function ChuyenAnhSangPdfA4Page() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Tải PDF tài liệu vừa gộp lên QuizKen để tạo đề ôn tập AI ngay!"
      ctaDescription="Sau khi chuyển ảnh chụp vở ghi thành file PDF A4 gọn gàng, hãy đưa lên QuizKen App để AI đọc hiểu nội dung, tóm tắt ý chính và tự động sinh câu hỏi trắc nghiệm ôn thi."
      ctaHref={appLink("/")}
      ctaLabel="Mở QuizKen AI ngay"
      secondaryCtaHref="/cong-cu/soan-thao-markdown-xuat-pdf-a4"
      secondaryCtaLabel="Soạn ghi chú xuất PDF A4"
      seoContent={
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Bảo mật tuyệt đối 0 Upload
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Khác với các trang web chuyển đổi truyền thống buộc bạn tải ảnh lên server nước ngoài, công cụ của QuizKen xử lý hoàn toàn trong bộ nhớ trình duyệt. An toàn cho bài kiểm tra, giấy tờ cá nhân và đề cương nội bộ.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Chuẩn khổ A4 150 DPI sắc nét
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Mỗi trang ảnh được căn giữa thông minh trên nền trắng tinh khiết khổ A4 (595×842 pt), hỗ trợ xoay 90° nhanh cho các ảnh chụp dọc/ngang bị ngược chiều trước khi đóng gói.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Printer className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  2 cách xuất linh hoạt
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Bạn có thể bấm <strong className="text-foreground">Tải file PDF (.pdf)</strong> để lưu ngay tệp PDF hoàn chỉnh về máy tính/điện thoại, hoặc dùng nút <strong className="text-foreground">In trực tiếp</strong> ra máy in A4.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <ImageToPdfTool />
    </ToolPageShell>
  );
}
