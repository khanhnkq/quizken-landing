import type { Metadata } from "next";
import { BookOpen, Calculator, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { ThptScoreTool } from "@/components/tools/ThptScoreTool";

const SLUG = "tinh-diem-tot-nghiep-thpt-2027";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Công thức tính điểm xét tốt nghiệp THPT 2027 khác gì so với trước đây?",
    answer:
      "Từ kỳ thi 2025 trở đi (áp dụng cho 2026–2027 theo Thông tư 24/2024/TT-BGDĐT), tỷ trọng điểm thi tốt nghiệp và điểm học bạ là 50% – 50% thay vì 70% – 30% như giai đoạn 2019–2024. Đồng thời học bạ tính cả 3 năm lớp 10, 11, 12 với trọng số lần lượt là 1:2:3.",
  },
  {
    question: "Điểm liệt xét tốt nghiệp THPT 2027 là bao nhiêu?",
    answer:
      "Thí sinh phải không có bài thi hoặc môn thi nào bị điểm từ 1.0 trở xuống (≤ 1.0 điểm). Nếu có dù chỉ 1 môn trong 4 môn thi đạt ≤ 1.0 điểm, thí sinh không đủ điều kiện công nhận tốt nghiệp dù tổng ĐXTN ≥ 5.0.",
  },
  {
    question: "Điểm khuyến khích và điểm ưu tiên được cộng vào đâu trong công thức 50/50?",
    answer:
      "Điểm khuyến khích (chứng chỉ nghề, giải HSG, tin học/ngoại ngữ theo quy định) được cộng trực tiếp vào tổng điểm 4 bài thi trước khi chia 4. Trong khi đó, điểm ưu tiên (theo khu vực và đối tượng) được cộng sau cùng vào giá trị trung bình giữa điểm thi và điểm học bạ.",
  },
  {
    question: "Có bắt buộc phải thi Ngoại ngữ để xét tốt nghiệp THPT 2027 không?",
    answer:
      "Không bắt buộc. Theo chương trình GDPT 2018, thí sinh thi 2 môn bắt buộc là Toán và Ngữ văn, cùng 2 môn tự chọn trong số các môn đã học (Vật lý, Hóa học, Sinh học, Lịch sử, Địa lý, GDKT&PL, Tin học, Công nghệ, Ngoại ngữ).",
  },
];

export default function TinhDiemTotNghiepThptPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Ôn luyện 4 môn thi THPT 2027 chuẩn cấu trúc 3 phần cùng QuizKen"
      ctaDescription="Thực hành ngay bộ đề thi thử GDPT 2018 có đủ Phần I (Trắc nghiệm 4 lựa chọn), Phần II (Đúng/Sai lũy tiến 0.1–1.0đ) và Phần III (Trả lời ngắn) kèm AI giải thích từng câu."
      ctaHref={appLink("/?grade=on-thi-thpt")}
      ctaLabel="Luyện đề thi thử THPT ngay"
      secondaryCtaHref="/de-thi"
      secondaryCtaLabel="Xem đề minh họa 9 môn"
      seoContent={
        <div className="space-y-8">
          {/* Formula Section */}
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Công thức tính điểm xét tốt nghiệp THPT 2027 (Thông tư 24/2024/TT-BGDĐT)
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Điểm xét tốt nghiệp (ĐXTN) được tính theo thang điểm 10, làm tròn đến 2 chữ số thập phân, kết hợp đồng đều giữa kết quả 4 môn thi tốt nghiệp (50%) và điểm trung bình học bạ 3 năm THPT (50%):
            </p>
            <div className="rounded-xl bg-foreground/[0.04] p-4 font-mono text-xs leading-relaxed text-foreground dark:bg-foreground/[0.06] sm:text-sm space-y-2">
              <div>
                <strong>1. ĐTB các năm học (50%):</strong> ĐTB_học_tập = (ĐTB_Lớp_10 × 1 + ĐTB_Lớp_11 × 2 + ĐTB_Lớp_12 × 3) / 6
              </div>
              <div>
                <strong>2. Điểm xét tốt nghiệp (ĐXTN):</strong> ĐXTN = [ ( (Tổng điểm 4 bài thi + ĐKK) / 4 + ĐTB_học_tập ) / 2 ] + Điểm ưu tiên
              </div>
            </div>
          </div>

          {/* Worked Example + Comparison Table */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Ví dụ tính điểm minh họa
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Giả sử thí sinh đạt điểm thi: Toán 8.4, Ngữ văn 7.5, Vật lý 8.75, Hóa học 8.0; điểm khuyến khích (ĐKK) = 1.0; ĐTB học bạ lớp 10 = 7.9, lớp 11 = 8.2, lớp 12 = 8.5; điểm ưu tiên KV2-NT = 0.25:
              </p>
              <ul className="space-y-1.5 text-sm text-foreground list-disc pl-5">
                <li>
                  Phần điểm thi: (8.4 + 7.5 + 8.75 + 8.0 + 1.0) / 4 = <strong>8.41</strong>
                </li>
                <li>
                  ĐTB học bạ 3 năm: (7.9×1 + 8.2×2 + 8.5×3) / 6 = <strong>8.30</strong>
                </li>
                <li>
                  ĐXTN = (8.41 + 8.30) / 2 + 0.25 = <strong>8.61 điểm</strong> (Đậu tốt nghiệp).
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  So sánh quy chế cũ và quy chế mới 2025–2027
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Tiêu chí</th>
                      <th className="py-2 pr-3 font-semibold">Trước 2025</th>
                      <th className="py-2 font-semibold text-primary">2025 – 2027</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="py-2.5 pr-3 font-medium">Số môn thi</td>
                      <td className="py-2.5 pr-3 text-muted-foreground">6 môn (3 bắt buộc + 1 tổ hợp)</td>
                      <td className="py-2.5 font-semibold">4 môn (2 bắt buộc + 2 tự chọn)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-medium">Tỷ lệ Thi / Học bạ</td>
                      <td className="py-2.5 pr-3 text-muted-foreground">70% Thi / 30% Lớp 12</td>
                      <td className="py-2.5 font-semibold">50% Thi / 50% (L10:11:12)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-medium">Trọng số học bạ</td>
                      <td className="py-2.5 pr-3 text-muted-foreground">Chỉ dùng ĐTB lớp 12</td>
                      <td className="py-2.5 font-semibold">1 : 2 : 3 (Lớp 10, 11, 12)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-medium">Điểm đạt</td>
                      <td className="py-2.5 pr-3 text-muted-foreground">≥ 5.0 và không ≤ 1.0</td>
                      <td className="py-2.5 font-semibold">≥ 5.0 và không ≤ 1.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ThptScoreTool />
    </ToolPageShell>
  );
}
