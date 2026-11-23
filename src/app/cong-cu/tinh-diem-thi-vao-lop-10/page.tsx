import type { Metadata } from "next";
import { BookOpen, Calculator, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { Grade10ScoreCalculator } from "@/components/tools/Grade10ScoreCalculator";

const SLUG = "tinh-diem-thi-vao-lop-10";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Cách tính điểm thi vào lớp 10 Hà Nội hiện nay có còn nhân hệ số 2 Toán và Văn không?",
    answer:
      "Theo Thông tư 30/2024/TT-BGDĐT (Quy chế tuyển sinh THCS và THPT áp dụng từ năm 2025 trở đi), điểm xét tuyển vào lớp 10 THPT công lập là tổng điểm 3 môn thi đều tính hệ số 1 (thang điểm 30) cộng với điểm ưu tiên/khuyến khích nếu có, không còn nhân đôi Toán và Văn ở hệ đại trà.",
  },
  {
    question: "Cách tính điểm thi vào lớp 10 tại TP.HCM như thế nào?",
    answer:
      "Tại TP.HCM, thí sinh thi 3 môn Toán, Ngữ văn và Ngoại ngữ (tất cả hệ số 1, tổng thang 30) cộng điểm ưu tiên. Với hệ Chuyên, điểm xét tuyển bằng tổng 3 môn hệ số 1 cộng (Điểm môn Chuyên × 2), tổng thang điểm 50.",
  },
  {
    question: "Điều kiện không bị điểm liệt khi thi vào lớp 10 là bao nhiêu?",
    answer:
      "Ở hầu hết các Sở GD&ĐT (như Hà Nội, TP.HCM), thí sinh dự thi hệ công lập phải dự thi đủ 3 bài thi và không có bài thi nào bị 0 điểm. Với hệ Chuyên, điểm môn Chuyên thường phải đạt trên 2.0 (thậm chí ≥ 5.0 ở một số trường chuyên) mới được xét tuyển.",
  },
  {
    question: "Làm sao ước lượng điểm chuẩn vào trường công lập từ thang 50 sang thang 30?",
    answer:
      "Bạn có thể lấy mức điểm chuẩn cũ thang 50 chia cho 5 rồi nhân với 3 để tham khảo tương đối (ví dụ 40/50 tương đương khoảng 24.0/30, tức trung bình 8.0 điểm/môn). Công cụ đã tích hợp sẵn phần quy đổi tham chiếu ngay trong thẻ kết quả.",
  },
];

export default function TinhDiemThiVaoLop10Page() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Luyện ngay bộ đề ôn thi vào lớp 10 Toán, Văn, Tiếng Anh chuẩn GDPT 2018"
      ctaDescription="Tổng hợp cấu trúc đề thi tuyển sinh lớp 10 mới nhất của Hà Nội, TP.HCM và các tỉnh thành. Làm bài trực tuyến có chấm điểm & giải thích chi tiết."
      ctaHref={appLink("/?grade=lop-10")}
      ctaLabel="Luyện đề thi vào lớp 10 ngay"
      secondaryCtaHref="/de-thi/vao-10"
      secondaryCtaLabel="Xem chuyên mục Đề vào lớp 10"
      seoContent={
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Công thức tính điểm xét tuyển lớp 10 theo Thông tư 30/2024/TT-BGDĐT
              </h2>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-4 font-mono text-xs leading-relaxed text-foreground dark:bg-foreground/[0.06] sm:text-sm space-y-2">
              <div>
                <strong>1. Hệ Công lập đại trà (Hà Nội, TP.HCM &amp; Đa số tỉnh thành):</strong> Điểm xét tuyển = Toán + Ngữ văn + Môn 3 (Ngoại ngữ) + Điểm ưu tiên/khuyến khích (Thang 30)
              </div>
              <div>
                <strong>2. Hệ Chuyên (THPT Chuyên):</strong> Điểm xét tuyển chuyên = Toán + Ngữ văn + Ngoại ngữ + (Môn Chuyên × 2) + Điểm ưu tiên (Thang 50)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Khung đối chiếu nhóm trường tham khảo (Thang 30)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Phân nhóm trường</th>
                      <th className="py-2 pr-3 font-semibold">Ngưỡng điểm</th>
                      <th className="py-2 font-semibold">TB mỗi môn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="py-2.5 pr-3 font-bold">Nhóm Top 1 (Chu Văn An, Nguyễn Thị Minh Khai...)</td>
                      <td className="py-2.5 pr-3 font-bold text-primary">24.5 – 27.0+</td>
                      <td className="py-2.5">8.2 – 9.0+</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-bold">Nhóm Khá / Top 2</td>
                      <td className="py-2.5 pr-3 font-semibold">20.5 – 24.25</td>
                      <td className="py-2.5">6.8 – 8.1</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-3 font-bold">Nhóm Công lập tiêu chuẩn</td>
                      <td className="py-2.5 pr-3 font-semibold">16.5 – 20.25</td>
                      <td className="py-2.5">5.5 – 6.75</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Ví dụ tính điểm vào lớp 10 (Hệ đại trà &amp; Hệ Chuyên)
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Thí sinh đạt Toán <strong className="text-foreground">8.5</strong>, Ngữ văn <strong className="text-foreground">7.75</strong>, Tiếng Anh <strong className="text-foreground">9.0</strong>, không có điểm ưu tiên:
              </p>
              <ul className="space-y-1.5 text-sm text-foreground list-disc pl-5">
                <li>
                  <strong>Hệ Công lập (Thang 30):</strong> 8.5 + 7.75 + 9.0 = <strong>25.25 điểm</strong> (thuộc nhóm Top đầu).
                </li>
                <li>
                  <strong>Hệ Chuyên (nếu thi thêm môn Chuyên được 7.5):</strong> 8.5 + 7.75 + 9.0 + (7.5 × 2) = <strong>40.25 / 50 điểm</strong>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      }
    >
      <Grade10ScoreCalculator />
    </ToolPageShell>
  );
}
