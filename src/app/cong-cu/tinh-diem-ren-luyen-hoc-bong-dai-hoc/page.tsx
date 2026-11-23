import type { Metadata } from "next";
import { Award, GraduationCap } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { ScholarshipCalculatorTool } from "@/components/tools/ScholarshipCalculatorTool";

const SLUG = "tinh-diem-ren-luyen-hoc-bong-dai-hoc";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Điều kiện cơ bản để được xét Học bổng Khuyến khích học tập (KKHT) là gì?",
    answer:
      "Theo Nghị định 84/2020/NĐ-CP và quy chế hầu hết các trường ĐH (NEU, VNU, UEH, HUST...), sinh viên cần: (1) GPA học kỳ và Điểm rèn luyện (ĐRL) đạt từ Khá trở lên (GPA ≥ 2.50, ĐRL ≥ 65 hoặc 70 tùy trường); (2) Đăng ký đủ số tín chỉ tối thiểu trong kỳ (thường ≥ 14–15 TC); (3) Không bị kỷ luật và không có môn thi lại/điểm F trong kỳ xét.",
  },
  {
    question: "Học bổng loại Khá, Giỏi, Xuất sắc thường nhận được bao nhiêu tiền?",
    answer:
      "Theo quy định tối thiểu cho trường công lập: Loại Khá bằng mức trần học phí (hoặc 100% học phí học kỳ tại trường); Loại Giỏi cao hơn mức Khá (thường 110%); Loại Xuất sắc cao hơn mức Giỏi (thường 120–150%). Mức cụ thể phụ thuộc vào quỹ học bổng 8% học phí của từng trường và chỉ tiêu từng ngành.",
  },
  {
    question: "GPA đạt 3.65 nhưng Điểm rèn luyện chỉ đạt 78 thì có được học bổng Xuất sắc không?",
    answer:
      "Không. Học bổng KKHT xét theo nguyên tắc mức thấp hơn giữa học lực và rèn luyện: với GPA 3.65 (Xuất sắc) và ĐRL 78 (Khá), mức xếp loại học bổng tối đa của bạn là loại Khá.",
  },
];

export default function TinhDiemHocBongDaiHocPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Giữ vững GPA 3.6+ săn học bổng Đại học cùng QuizKen AI"
      ctaDescription="Biến slide bài giảng PDF môn Đại cương và Chuyên ngành thành câu hỏi trắc nghiệm ôn tập thông minh để không bỏ lỡ điểm A/A+."
      ctaHref={appLink("/")}
      ctaLabel="Ôn thi Đại học với QuizKen"
      secondaryCtaHref="/de-thi/dai-hoc"
      secondaryCtaLabel="Kho đề môn Đại cương ĐH"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Thang phân loại Điểm rèn luyện (ĐRL) chuẩn Bộ GD&amp;ĐT
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              {[
                ["90 – 100 điểm", "Xuất sắc"],
                ["80 – 89 điểm", "Tốt"],
                ["65 – 79 điểm", "Khá"],
                ["50 – 64 điểm", "Trung bình"],
                ["35 – 49 điểm", "Yếu"],
                ["Dưới 35 điểm", "Kém"],
              ].map(([range, label]) => (
                <div
                  key={range}
                  className="flex justify-between rounded-xl bg-foreground/[0.04] px-3 py-2 dark:bg-foreground/[0.06]"
                >
                  <span className="font-semibold text-foreground">{range}</span>
                  <span className="font-bold text-primary">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Ví dụ thực tế tính xét học bổng học kỳ
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Sinh viên học 16 tín chỉ (mức tối thiểu 15 TC), học phí 12 triệu/kỳ, không có môn nào dưới C hay thi lại. Nếu đạt <strong className="text-foreground">GPA = 3.45</strong> (Giỏi) và <strong className="text-foreground">ĐRL = 86</strong> (Tốt), sinh viên đạt <strong className="text-primary">Học bổng loại Giỏi</strong>, ước tính nhận khoảng 12 – 13,2 triệu đồng/kỳ.
            </p>
          </div>
        </div>
      }
    >
      <ScholarshipCalculatorTool />
    </ToolPageShell>
  );
}
