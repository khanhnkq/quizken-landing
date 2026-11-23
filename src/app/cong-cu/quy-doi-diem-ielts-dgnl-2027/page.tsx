import type { Metadata } from "next";
import { BookOpen, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { ScoreConverterTool } from "@/components/tools/ScoreConverterTool";

const SLUG = "quy-doi-diem-ielts-dgnl-2027";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "IELTS 6.5 quy đổi được bao nhiêu điểm khi xét tuyển đại học 2027?",
    answer:
      "Mức quy đổi phổ biến cho IELTS 6.5 hiện nay là từ 9.0 đến 9.5 điểm trên thang 10 môn Tiếng Anh (một số trường hoặc ngành kinh tế top quy đổi 9.5 hoặc 10.0). Tuy nhiên, mỗi trường quy định bảng quy đổi riêng trong Đề án tuyển sinh hàng năm.",
  },
  {
    question: "Điểm ĐGNL HSA (150), V-ACT (1200) và TSA (100) quy đổi sang thang 30 như thế nào?",
    answer:
      "Theo quy tắc bách phân vị hoặc tuyến tính tham khảo từ Bộ GD&ĐT (bắt đầu áp dụng thống nhất từ 2025–2027), điểm tham chiếu thường ước lượng theo tỷ lệ thuận sang thang 30 (ví dụ V-ACT 960/1200 ≈ 24.0/30, HSA 105/150 ≈ 21.0/30), sau đó hiệu chỉnh theo phân bố phổ điểm từng năm.",
  },
  {
    question: "Chứng chỉ IELTS có được miễn thi tốt nghiệp môn Tiếng Anh năm 2027 không?",
    answer:
      "Theo quy chế thi tốt nghiệp THPT, thí sinh có chứng chỉ IELTS từ 4.0 trở lên (hoặc tương đương) được miễn thi bài thi môn Ngoại ngữ nếu chọn môn này, nhưng lưu ý nếu muốn dùng điểm quy đổi xét tuyển đại học, bạn vẫn nên kiểm tra điều kiện riêng của từng trường.",
  },
  {
    question: "Chứng chỉ SAT Digital bao nhiêu điểm thì có lợi thế xét tuyển tại Việt Nam?",
    answer:
      "Đa số các trường top tại Việt Nam (BKHN, NEU, FTU, UEH...) đặt ngưỡng nhận hồ sơ SAT từ 1100–1250/1600 trở lên. Mức điểm từ 1350+ (tương đương ~25.3/30) thường mang lại lợi thế cạnh tranh rất cao cho các ngành hot.",
  },
];

export default function QuyDoiDiemIeltsDgnlPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Luyện đề Tiếng Anh THPT, IELTS Reading & ĐGNL trên QuizKen"
      ctaDescription="Khám phá kho đề thi thử Tiếng Anh GDPT 2018 và Đánh giá năng lực chuẩn format mới, có giải thích ngữ pháp – từ vựng chi tiết giúp bứt phá điểm số 2027."
      ctaHref={appLink("/?subject=tieng-anh&grade=on-thi-thpt")}
      ctaLabel="Luyện Tiếng Anh & ĐGNL ngay"
      secondaryCtaHref="/de-thi/dgnl"
      secondaryCtaLabel="Xem đề ĐGNL HSA & V-ACT"
      seoContent={
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Table2 className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Bảng quy đổi điểm IELTS tham khảo tại các trường Đại học Top Việt Nam
              </h2>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Dưới đây là khung quy đổi mang tính tham khảo dựa trên đề án tuyển sinh phổ biến gần đây của các trường đại học lớn. Thí sinh cần đối chiếu thông báo chính thức năm 2027 của từng trường trước khi đặt nguyện vọng.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/70 text-muted-foreground">
                    <th className="py-2.5 pr-4 font-semibold">IELTS Band</th>
                    <th className="py-2.5 pr-4 font-semibold">ĐH Kinh tế Quốc dân (NEU)</th>
                    <th className="py-2.5 pr-4 font-semibold">ĐH Ngoại thương (FTU)</th>
                    <th className="py-2.5 pr-4 font-semibold">ĐH Bách khoa HN (HUST)</th>
                    <th className="py-2.5 font-semibold">Khung CEFR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr>
                    <td className="py-2.5 pr-4 font-bold text-primary">5.5</td>
                    <td className="py-2.5 pr-4">~10 / thang 15 (hoặc 8.5/10)</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">Chưa đủ ngưỡng (từ 6.5)</td>
                    <td className="py-2.5 pr-4">8.5 / 10</td>
                    <td className="py-2.5">B2 (Ngưỡng)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-bold text-primary">6.0</td>
                    <td className="py-2.5 pr-4">~9.0 / 10</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">Tùy ngành (từ 6.5 phổ biến)</td>
                    <td className="py-2.5 pr-4">9.0 / 10</td>
                    <td className="py-2.5">B2</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-bold text-primary">6.5</td>
                    <td className="py-2.5 pr-4">~9.5 / 10</td>
                    <td className="py-2.5 pr-4">9.0 – 9.5 / 10</td>
                    <td className="py-2.5 pr-4">9.5 / 10</td>
                    <td className="py-2.5">B2 (Cao)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-bold text-primary">7.0</td>
                    <td className="py-2.5 pr-4 font-semibold">10.0 / 10</td>
                    <td className="py-2.5 pr-4">9.5 / 10</td>
                    <td className="py-2.5 pr-4 font-semibold">10.0 / 10</td>
                    <td className="py-2.5">C1</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-bold text-primary">7.5 – 9.0</td>
                    <td className="py-2.5 pr-4 font-semibold">10.0 / 10</td>
                    <td className="py-2.5 pr-4 font-semibold">10.0 / 10</td>
                    <td className="py-2.5 pr-4 font-semibold">10.0 / 10</td>
                    <td className="py-2.5">C1 / C2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="font-heading text-xl font-bold text-foreground">
                Ví dụ quy đổi điểm ĐGNL V-ACT &amp; HSA sang thang 30
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Nếu bạn đạt <strong className="text-foreground">930/1200</strong> điểm V-ACT (ĐHQG TP.HCM), mức quy đổi tuyến tính tham khảo sang thang 30 là <strong className="text-foreground">(930 / 1200) × 30 = 23.25 điểm</strong>. Nếu bạn đạt <strong className="text-foreground">108/150</strong> điểm HSA (ĐHQG Hà Nội), mức quy đổi tham khảo là <strong className="text-foreground">(108 / 150) × 30 = 21.60 điểm</strong> (tuy nhiên xét theo phổ điểm thực tế HSA thường có độ khó cao nên giá trị bách phân vị thường tương đương mức 24–25+ điểm tổ hợp THPT).
            </p>
          </div>
        </div>
      }
    >
      <ScoreConverterTool />
    </ToolPageShell>
  );
}
