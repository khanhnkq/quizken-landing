import type { Metadata } from "next";
import { BookOpen, Table2, Wand2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { TextNormalizerTool } from "@/components/tools/TextNormalizerTool";

const SLUG = "chuyen-doi-chu-hoa-thuong-soat-loi-van-ban";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Tính năng 'Sửa ngắt dòng copy từ PDF' hoạt động như thế nào?",
    answer:
      "Khi copy văn bản từ file PDF đề thi hoặc giáo trình sang Word, các câu thường bị ngắt dòng giữa chừng. Công cụ tự động nối các dòng bị ngắt trong cùng đoạn nhưng vẫn giữ nguyên xuống dòng ở đầu 'Câu 1:', đáp án 'A. B. C. D.' và giữa các đoạn trống.",
  },
  {
    question: "Sắp xếp danh sách học sinh A–Z theo Tên có chuẩn bảng chữ cái tiếng Việt không?",
    answer:
      "Có. Nút 'Xếp tên HS A–Z (theo Tên)' tách từ cuối cùng (Tên chính) và sắp xếp theo chuẩn locale tiếng Việt ('vi'), đảm bảo thứ tự chính xác cho các chữ Đ, Ă, Â, Ê, Ô, Ơ, Ư.",
  },
  {
    question: "Nếu bấm nhầm nút chuyển đổi thì có quay lại được không?",
    answer:
      "Có. Hệ thống lưu lại tối đa 10 bước thao tác gần nhất — bạn chỉ cần bấm nút 'Hoàn tác' để khôi phục nguyên văn trước đó.",
  },
];

export default function ChuyenDoiChuHoaThuongPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Không cần copy-paste thủ công từ PDF! Tải thẳng PDF lên QuizKen AI"
      ctaDescription="Upload file PDF đề thi hoặc bài giảng trực tiếp vào QuizKen để AI tự bóc tách câu hỏi trắc nghiệm, trộn 4–24 mã đề và xuất Word (.docx) chuẩn đẹp."
      ctaHref={appLink("/teacher/tools")}
      ctaLabel="Mở Teacher Tools ngay"
      secondaryCtaHref="/cong-cu/tron-de-trac-nghiem-online"
      secondaryCtaLabel="Trộn đề trắc nghiệm 4 mã"
      seoContent={
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Các tác vụ xử lý văn bản hữu ích nhất cho Giáo viên
                </h2>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                <li><strong className="text-foreground">Sửa lỗi ngắt dòng PDF:</strong> Gom gọn câu hỏi bị gãy dòng trước khi dán vào Word hoặc công cụ trộn đề.</li>
                <li><strong className="text-foreground">Xếp tên học sinh A–Z:</strong> Sắp xếp danh sách lớp theo Tên cuối chuẩn Unicode tiếng Việt để nhập sổ điểm.</li>
                <li><strong className="text-foreground">Chuẩn hóa HOA/thường:</strong> Sửa nhanh tiêu đề bài viết hoặc danh sách tên bị bật nhầm Caps Lock.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Ví dụ sắp xếp tên tiếng Việt chuẩn
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Danh sách đầu vào <code className="text-foreground">Trần Hoàng Bảo, Nguyễn Minh Anh, Đặng Khánh Linh</code> sau khi bấm <strong className="text-foreground">Xếp tên HS A–Z (theo Tên)</strong> sẽ ra đúng thứ tự sổ điểm: <strong className="text-primary">Nguyễn Minh Anh → Trần Hoàng Bảo → Đặng Khánh Linh</strong>.
              </p>
              <div className="rounded-xl bg-foreground/[0.04] p-3 text-xs text-foreground dark:bg-foreground/[0.06]">
                <BookOpen className="inline h-4 w-4 text-primary mr-1.5" />
                Hoạt động hoàn toàn offline trên trình duyệt, không lưu văn bản của bạn.
              </div>
            </div>
          </div>
        </div>
      }
    >
      <TextNormalizerTool />
    </ToolPageShell>
  );
}
