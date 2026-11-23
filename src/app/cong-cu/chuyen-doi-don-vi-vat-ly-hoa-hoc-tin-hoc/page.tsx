import type { Metadata } from "next";
import { Atom, Scale } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { UnitConverterSiTool } from "@/components/tools/UnitConverterSiTool";

const SLUG = "chuyen-doi-don-vi-vat-ly-hoa-hoc-tin-hoc";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "1 bar bằng bao nhiêu Pa và khác gì với 1 atm trong Hóa học GDPT 2018?",
    answer:
      "Theo chuẩn IUPAC và SGK Hóa học GDPT 2018, Điều kiện chuẩn (ĐKC) mới là 25 °C (298,15 K) và áp suất 1 bar = 100.000 Pa = 10⁵ Pa (1 mol khí chiếm 24,79 lít). Trong khi đó 1 atm = 101.325 Pa = 760 mmHg.",
  },
  {
    question: "Sự khác nhau giữa KB (10³) và KiB (2¹⁰) trong môn Tin học là gì?",
    answer:
      "KB, MB, GB theo chuẩn thập phân SI dùng lũy thừa của 10 (1 KB = 1.000 Byte), thường in trên vỏ ổ cứng và tốc độ mạng. Còn KiB, MiB, GiB theo chuẩn nhị phân IEC dùng lũy thừa của 2 (1 KiB = 1.024 Byte), dùng để tính dung lượng RAM và địa chỉ bộ nhớ trong Tin học.",
  },
  {
    question: "Cách đổi nhanh eV, MeV sang Joule và Å (Angstrom) sang mét?",
    answer:
      "Trong Vật lý hạt nhân và Quang lượng tử: 1 eV ≈ 1,602 × 10⁻¹⁹ J và 1 MeV = 10⁶ eV ≈ 1,602 × 10⁻¹³ J. Với bước sóng và kích thước phân tử ADN: 1 Å = 10⁻¹⁰ m = 0,1 nm; 1 μm = 10⁻⁶ m.",
  },
  {
    question: "Đơn vị khối lượng nguyên tử u (amu / đvC) quy đổi ra kg như thế nào?",
    answer:
      "1 u được định nghĩa bằng 1/12 khối lượng của nguyên tử đồng vị Carbon-12, có giá trị xấp xỉ 1,66054 × 10⁻²⁷ kg. Công cụ hỗ trợ nhập trực tiếp số nguyên tử khối (ví dụ 12 u hoặc 235 u) để quy đổi tức thì.",
  },
];

export default function ChuyenDoiDonViSiPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Luyện giải bài tập Vật lý, Hóa học & Tin học chuẩn GDPT 2018"
      ctaDescription="Nhập chủ đề như Khí lý tưởng, Hạt nhân nguyên tử, Nhiệt hóa học hoặc Biểu diễn dữ liệu để QuizKen AI tạo đề thi thử 3 phần có giải chi tiết."
      ctaHref={appLink("/?subject=vat-ly")}
      ctaLabel="Tạo đề Lý / Hóa bằng AI"
      secondaryCtaHref="/de-thi/vat-ly"
      secondaryCtaLabel="Kho đề Vật lý THPT"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Atom className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Bảng quy đổi Hằng số & Đơn vị hay gặp trong Đề thi THPT
              </h2>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">Áp suất khí:</strong> 1 atm = 760 mmHg = 101.325 Pa; 1 bar = 10⁵ Pa = 100 kPa.
              </li>
              <li>
                <strong className="text-foreground">Nhiệt độ tuyệt đối:</strong> T(K) = t(°C) + 273,15; ΔT(K) = Δt(°C).
              </li>
              <li>
                <strong className="text-foreground">Năng lượng lượng tử:</strong> 1 eV ≈ 1,602 × 10⁻¹⁹ J; 1 kWh = 3,6 × 10⁶ J.
              </li>
              <li>
                <strong className="text-foreground">Bước sóng & ADN:</strong> 1 μm = 10⁻⁶ m; 1 nm = 10⁻⁹ m; 1 Å = 10⁻¹⁰ m.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                7 Nhóm đại lượng chuẩn SI chạy 100% trên trình duyệt
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Công cụ tổng hợp đầy đủ 7 nhóm đơn vị cốt lõi của chương trình Toán – Lý – Hóa – Sinh – Tin học: Áp suất, Nhiệt độ, Năng lượng & Công, Tốc độ, Dung lượng Dữ liệu (bit/Byte/KB/KiB), Chiều dài & Bước sóng, và Khối lượng nguyên tử (u / amu). Kết quả cập nhật tức thì không cần tải lại trang.
            </p>
          </div>
        </div>
      }
    >
      <UnitConverterSiTool />
    </ToolPageShell>
  );
}
