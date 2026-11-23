import type { Metadata } from "next";
import { BookOpen, Calendar, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { ExamCountdownTool } from "@/components/tools/ExamCountdownTool";

const SLUG = "dem-nguoc-ngay-thi-2027";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Kỳ thi Tốt nghiệp THPT 2027 dự kiến diễn ra vào ngày nào?",
    answer:
      "Theo khung kế hoạch thời gian năm học của Bộ GD&ĐT (thường tổ chức vào tuần thứ 2 của tháng 6 hằng năm), kỳ thi Tốt nghiệp THPT 2027 dự kiến diễn ra quanh mốc 11/06/2027. Đồng hồ sẽ được cập nhật ngay khi Bộ ban hành công văn chính thức.",
  },
  {
    question: "Kỳ thi ĐGNL ĐHQG TP.HCM (V-ACT) năm 2027 có mấy đợt?",
    answer:
      "Thông thường kỳ thi V-ACT gồm 2 đợt: Đợt 1 vào cuối tháng 3 (mốc tham chiếu 28/03/2027) và Đợt 2 vào cuối tháng 5 (mốc tham chiếu 23/05/2027). Thí sinh có thể dự thi cả 2 đợt và dùng điểm đợt cao nhất để xét tuyển.",
  },
  {
    question: "Mỗi ngày nên tự học bao nhiêu giờ để đạt 25+ điểm THPT?",
    answer:
      "Nếu bắt đầu sớm từ đầu năm lớp 12, duy trì đều đặn 2.5 – 3.5 giờ tự học chất lượng mỗi ngày (kết hợp học lý thuyết và luyện đề bấm giờ trên QuizKen) sẽ tích lũy hơn 600–800 giờ ôn tập hiệu quả — đủ vững vàng cho mục tiêu 25–27 điểm.",
  },
  {
    question: "Nên ôn thi theo giai đoạn như thế nào trong 6 tháng cuối?",
    answer:
      "Giai đoạn 1 (6–4 tháng cuối): hoàn thiện kiến thức nền & chuyên đề. Giai đoạn 2 (4–1.5 tháng cuối): tăng tốc luyện đề tổng hợp 3 phần chuẩn GDPT 2018 và chữa lỗi sai. Giai đoạn 3 (1 tháng cuối): thi thử đúng khung giờ thi thật và rà soát mẹo tránh mất điểm Phần II & III.",
  },
];

export default function DemNguocNgayThiPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Bắt đầu kế hoạch luyện đề mỗi tuần ngay hôm nay cùng QuizKen"
      ctaDescription="Đừng chỉ đếm ngược ngày thi — hãy biến từng tuần ôn tập thành điểm số thật với bộ đề thi thử 3 phần chuẩn Bộ GD&ĐT và phân tích lỗ hổng kiến thức tự động."
      ctaHref={appLink("/")}
      ctaLabel="Tạo đề luyện tập ngay"
      secondaryCtaHref="/de-thi"
      secondaryCtaLabel="Khám phá đề thi các môn 2027"
      seoContent={
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Lộ trình mốc thời gian các kỳ thi quan trọng năm 2027
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[580px] text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/70 text-muted-foreground">
                    <th className="py-2.5 pr-4 font-semibold">Kỳ thi</th>
                    <th className="py-2.5 pr-4 font-semibold">Ngày dự kiến</th>
                    <th className="py-2.5 pr-4 font-semibold">Đối tượng</th>
                    <th className="py-2.5 font-semibold">Mục tiêu chính</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr>
                    <td className="py-2.5 pr-4 font-bold">ĐGNL V-ACT Đợt 1</td>
                    <td className="py-2.5 pr-4 text-primary font-semibold">28/03/2027</td>
                    <td className="py-2.5 pr-4">Học sinh lớp 12</td>
                    <td className="py-2.5 text-muted-foreground">Lấy điểm xét tuyển sớm vào ĐHQG TP.HCM &amp; hơn 100 trường ĐH</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-bold">ĐGNL V-ACT Đợt 2</td>
                    <td className="py-2.5 pr-4 text-primary font-semibold">23/05/2027</td>
                    <td className="py-2.5 pr-4">Học sinh lớp 12</td>
                    <td className="py-2.5 text-muted-foreground">Cải thiện kết quả ĐGNL sau khi hoàn tất chương trình lớp 12</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-bold">Tuyển sinh vào lớp 10</td>
                    <td className="py-2.5 pr-4 text-primary font-semibold">01/06/2027</td>
                    <td className="py-2.5 pr-4">Học sinh lớp 9</td>
                    <td className="py-2.5 text-muted-foreground">Xét tuyển THPT công lập &amp; trường chuyên</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-bold">Tốt nghiệp THPT Quốc gia</td>
                    <td className="py-2.5 pr-4 text-primary font-semibold">11/06/2027</td>
                    <td className="py-2.5 pr-4">Học sinh lớp 12</td>
                    <td className="py-2.5 text-muted-foreground">Xét công nhận tốt nghiệp (50/50) &amp; xét tuyển Đại học</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Ví dụ phân bổ lịch ôn 2.5 giờ/ngày
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Với mục tiêu 24–27 điểm và quỹ thời gian 17.5 giờ tự học/tuần:
              </p>
              <ul className="space-y-1.5 text-sm text-foreground list-disc pl-5">
                <li><strong>Thứ 2, 4, 6 (mỗi tối 2.5h):</strong> Làm 1 đề thi thử bấm giờ + chữa kỹ câu sai bằng sổ tay Active Recall.</li>
                <li><strong>Thứ 3, 5 (mỗi tối 2.5h):</strong> Học chuyên đề Phần II (Đúng/Sai) và Phần III (Trả lời ngắn) môn trọng tâm.</li>
                <li><strong>Cuối tuần (5h):</strong> Tổng ôn công thức, từ vựng và thi thử toàn phần để đo tiến độ.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Chiến lược 3 chặng ôn thi hiệu quả
                </h3>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="rounded-xl bg-foreground/[0.04] p-3 dark:bg-foreground/[0.06]">
                  <strong className="text-primary">Chặng 1 — Xây nền (50% thời gian):</strong> Chắc chắn kiến thức SGK GDPT 2018, làm chủ 100% câu Nhận biết &amp; Thông hiểu.
                </div>
                <div className="rounded-xl bg-foreground/[0.04] p-3 dark:bg-foreground/[0.06]">
                  <strong className="text-primary">Chặng 2 — Tăng tốc luyện đề (35%):</strong> Làm đề bấm giờ thực tế, rèn phản xạ giải nhanh câu Đúng/Sai &amp; Trả lời ngắn.
                </div>
                <div className="rounded-xl bg-foreground/[0.04] p-3 dark:bg-foreground/[0.06]">
                  <strong className="text-primary">Chặng 3 — Nước rút (15%):</strong> Chỉ ôn lại lỗi sai thường gặp, giữ nhịp sinh học và tâm lý ổn định trước ngày G.
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ExamCountdownTool />
    </ToolPageShell>
  );
}
