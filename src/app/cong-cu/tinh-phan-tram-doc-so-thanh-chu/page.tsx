import type { Metadata } from "next";
import { BookOpen, Calculator, Percent } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { PercentageNumberWordsTool } from "@/components/tools/PercentageNumberWordsTool";

const SLUG = "tinh-phan-tram-doc-so-thanh-chu";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Công thức tính tỷ lệ phần trăm (%) xếp loại lớp học hoạt động như thế nào?",
    answer:
      "Công cụ lấy số học sinh từng mức (Tốt, Khá, Đạt, Chưa đạt) chia cho tổng sĩ số lớp và nhân với 100%, hiển thị làm tròn 2 chữ số thập phân kèm thanh biểu đồ trực quan phục vụ báo cáo sơ kết, tổng kết.",
  },
  {
    question: "Khi nào đọc là 'lăm', 'mốt', 'tư' và 'lẻ/linh' trong tiếng Việt?",
    answer:
      "Chữ số 5 đọc là 'lăm' khi đứng sau hàng chục từ 1 trở lên (15 -> mười lăm, 25 -> hai mươi lăm). Chữ số 1 đọc là 'mốt' và 4 đọc là 'tư' khi hàng chục từ 2 trở lên (21 -> hai mươi mốt, 24 -> hai mươi tư). Hàng chục bằng 0 đọc là 'lẻ' hoặc 'linh' (105 -> một trăm lẻ năm).",
  },
  {
    question: "Công cụ đọc số hỗ trợ tối đa bao nhiêu chữ số?",
    answer:
      "Công cụ xử lý bằng chuỗi ký tự chính xác tuyệt đối nên không bị sai số dấu phẩy động, hỗ trợ lên tới 24 chữ số (vượt quá hàng nghìn tỷ) và hỗ trợ đọc cả số thập phân (ví dụ điểm 8,75).",
  },
];

export default function TinhPhanTramDocSoThanhChuPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Tổng hợp kết quả học tập & tạo đề kiểm tra nhanh với QuizKen AI!"
      ctaDescription="Giáo viên có thể đưa tài liệu ôn tập lên QuizKen để tạo bài kiểm tra trắc nghiệm tự động, xuất bảng điểm Excel và thống kê tỷ lệ % đạt chuẩn chỉ trong 1 phút."
      ctaHref={appLink("/")}
      ctaLabel="Dùng thử QuizKen miễn phí"
      secondaryCtaHref="/cong-cu/tinh-diem-trung-binh-mon-thong-tu-22"
      secondaryCtaLabel="Tính điểm TB môn Thông tư 22"
      seoContent={
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  4 bài toán phần trăm phổ biến
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Tính nhanh tỷ lệ câu trả lời đúng, mức độ tăng/giảm điểm số qua các đợt thi thử, tính giá trị sau khi tăng hoặc giảm X%, và thống kê tỷ lệ xếp loại học lực cả lớp.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Chuẩn chính tả hóa đơn & hồ sơ
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Phù hợp cho giáo viên chủ nhiệm thu chi quỹ lớp, sinh viên làm chứng từ thực tập kế toán, viết giấy biên nhận hoặc đọc chính xác điểm số bằng chữ khi làm học bạ.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Linh hoạt phương ngữ Bắc – Nam
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Cho phép chuyển đổi nhanh giữa cách đọc <strong className="text-foreground">lẻ / linh</strong> và <strong className="text-foreground">tư / bốn</strong> tùy theo chuẩn văn bản hành chính của từng địa phương.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <PercentageNumberWordsTool />
    </ToolPageShell>
  );
}
