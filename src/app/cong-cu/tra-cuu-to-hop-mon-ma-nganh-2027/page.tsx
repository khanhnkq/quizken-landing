import type { Metadata } from "next";
import { BookOpen, Compass, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { SubjectComboLookupTool } from "@/components/tools/SubjectComboLookupTool";

const SLUG = "tra-cuu-to-hop-mon-ma-nganh-2027";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Theo chương trình GDPT 2018, có thêm các tổ hợp môn xét tuyển mới nào?",
    answer:
      "Từ kỳ tuyển sinh 2025–2027, nhiều trường đại học mở rộng các tổ hợp có môn Tin học, Công nghệ và Giáo dục Kinh tế & Pháp luật (như X01, X06, X07, X10, X26, X54, C14, D66) bên cạnh các khối truyền thống A00, A01, B00, C00, D01.",
  },
  {
    question: "Nếu chọn 4 môn thi tốt nghiệp THPT thì xét được tối đa bao nhiêu tổ hợp?",
    answer:
      "Với 2 môn bắt buộc (Toán, Ngữ văn) và 2 môn tự chọn, bạn có thể tạo thành tối đa 4 bộ 3 môn khác nhau nếu cả 4 môn đều có trong các tổ hợp tuyển sinh của trường đại học mục tiêu.",
  },
  {
    question: "Thí sinh không thi Tiếng Anh ở kỳ thi tốt nghiệp THPT có xét khối A01 hoặc D01 được không?",
    answer:
      "Không nếu không có điểm thi môn Tiếng Anh (trừ trường hợp trường đại học cho phép dùng chứng chỉ IELTS/VSTEP quy đổi theo quy chế tuyển sinh riêng của từng trường).",
  },
  {
    question: "Mã tổ hợp như X06, X26 có dùng chung trên toàn quốc không?",
    answer:
      "Các mã tổ hợp mở rộng từ 2025 được Bộ GD&ĐT chuẩn hóa trong hệ thống tuyển sinh chung, tuy nhiên từng trường đại học sẽ công bố danh sách tổ hợp cụ thể áp dụng cho từng ngành trong đề án tuyển sinh hàng năm.",
  },
];

export default function TraCuuToHopMonPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Ôn thi đúng trọng tâm các môn trong tổ hợp mục tiêu trên QuizKen"
      ctaDescription="Truy cập ngân hàng đề trắc nghiệm chuẩn GDPT 2018 cho cả 9 môn học (Toán, Anh, Lý, Hóa, Sinh, Sử, Địa, GDKT&PL, Tin học) để luyện đề theo đúng tổ hợp bạn chọn."
      ctaHref={appLink("/?grade=on-thi-thpt")}
      ctaLabel="Luyện đề theo môn ngay"
      secondaryCtaHref="/de-thi"
      secondaryCtaLabel="Xem đề 9 môn THPT 2026"
      seoContent={
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Compass className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Chiến lược chọn 2 môn tự chọn THPT để tối đa hóa cơ hội trúng tuyển đại học
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Do thí sinh GDPT 2018 chỉ thi 4 môn (Toán, Ngữ văn + 2 môn tự chọn), việc chọn cặp môn tự chọn hợp lý sẽ giúp bạn mở rộng đồng thời nhiều tổ hợp xét tuyển có độ cạnh tranh phù hợp.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Ví dụ chọn 4 môn tối ưu đa tổ hợp
                </h3>
              </div>
              <ul className="space-y-1.5 text-sm text-foreground list-disc pl-5">
                <li><strong>Toán + Văn + Vật lý + Tiếng Anh:</strong> Mở cùng lúc A01, D01, C01.</li>
                <li><strong>Toán + Văn + Vật lý + Tin học:</strong> Mở cùng lúc X06 (Toán-Lý-Tin) và C01.</li>
                <li><strong>Toán + Văn + GDKT&amp;PL + Tiếng Anh:</strong> Mở D01, D66, X01, X54, C14.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Một số tổ hợp mới GDPT 2018 phổ biến (2025–2027)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Mã tổ hợp</th>
                      <th className="py-2 pr-3 font-semibold">3 Môn thành phần</th>
                      <th className="py-2 font-semibold text-primary">Nhóm ngành chính</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr><td className="py-2 pr-3 font-bold">X06</td><td className="py-2 pr-3">Toán, Vật lý, Tin học</td><td className="py-2">CNTT, AI, Khoa học máy tính</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">X26</td><td className="py-2 pr-3">Toán, Tiếng Anh, Tin học</td><td className="py-2">KTPM, Thương mại điện tử</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">X54</td><td className="py-2 pr-3">Toán, GDKT&amp;PL, Tiếng Anh</td><td className="py-2">Tài chính, Quản trị kinh doanh</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">C14</td><td className="py-2 pr-3">Ngữ văn, Toán, GDKT&amp;PL</td><td className="py-2">Luật, Kinh tế, Marketing</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SubjectComboLookupTool />
    </ToolPageShell>
  );
}
