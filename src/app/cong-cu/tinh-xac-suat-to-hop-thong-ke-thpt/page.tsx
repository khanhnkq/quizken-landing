import type { Metadata } from "next";
import { BarChart3, Calculator } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { CombinatoricsStatsTool } from "@/components/tools/CombinatoricsStatsTool";

const SLUG = "tinh-xac-suat-to-hop-thong-ke-thpt";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Sự khác nhau giữa Tổ hợp C(n,k) và Chỉnh hợp A(n,k) là gì?",
    answer:
      "Chỉnh hợp A(n,k) dùng khi chọn k phần tử từ n phần tử VÀ CÓ SẮP XẾP THỨ TỰ (ví dụ: chọn 3 bạn làm Lớp trưởng, Lớp phó, Bí thư). Tổ hợp C(n,k) dùng khi chọn k phần tử KHÔNG PHÂN BIỆT THỨ TỰ (ví dụ: chọn 3 bạn đi trực nhật).",
  },
  {
    question: "Cách tính Tứ phân vị Q₁, Q₂, Q₃ chuẩn SGK Toán 10–12 GDPT 2018?",
    answer:
      "Sau khi sắp xếp mẫu số liệu tăng dần: Q₂ là trung vị của toàn bộ dãy. Nếu n lẻ, bỏ phần tử chính giữa ra khỏi hai nửa; Q₁ là trung vị của nửa bên trái và Q₃ là trung vị của nửa bên phải.",
  },
  {
    question: "Giá trị ngoại lệ (Outlier) trong thống kê được xác định thế nào?",
    answer:
      "Theo SGK Toán 10 GDPT 2018, một giá trị x trong mẫu số liệu là giá trị bất thường (ngoại lệ) nếu x < Q₁ − 1,5·ΔQ hoặc x > Q₃ + 1,5·ΔQ, trong đó ΔQ = Q₃ − Q₁ là khoảng tứ phân vị.",
  },
  {
    question: "Tại sao công cụ hiển thị cả Phương sai s² chia cho n và chia cho n−1?",
    answer:
      "SGK Toán 10–12 GDPT 2018 định nghĩa phương sai mẫu s² = (1/n)∑(xᵢ − x̄)². Trong khi đó ở bậc Đại học (Xác suất Thống kê), phương sai mẫu hiệu chỉnh chia cho (n − 1). Công cụ tính cả hai để bạn đối chiếu nhanh.",
  },
];

export default function TinhToHopThongKePage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Luyện đề Xác suất Tổ hợp & Thống kê Toán 10–12 chuẩn 2027"
      ctaDescription="Tạo ngay đề thi trắc nghiệm 3 phần (Nhiều lựa chọn, Đúng/Sai, Trả lời ngắn) về Tổ hợp, Nhị thức Newton, Tứ phân vị và Phương sai trên QuizKen AI."
      ctaHref={appLink("/?subject=toan")}
      ctaLabel="Tạo đề Toán Xác suất AI"
      secondaryCtaHref="/de-thi/toan/on-thi-thpt"
      secondaryCtaLabel="Làm đề thi Toán THPT"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Công thức Hoán vị, Chỉnh hợp, Tổ hợp & Nhị thức Newton
              </h2>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">Hoán vị:</strong> Pₙ = n! = 1·2·…·n (áp dụng khi sắp xếp tất cả n phần tử).
              </li>
              <li>
                <strong className="text-foreground">Chỉnh hợp chập k của n:</strong> Aₙᵏ = n! / (n − k)! (có thứ tự).
              </li>
              <li>
                <strong className="text-foreground">Tổ hợp chập k của n:</strong> Cₙᵏ = n! / [k!·(n − k)!] (không thứ tự).
              </li>
              <li>
                <strong className="text-foreground">Số hạng tổng quát (a + b)ⁿ:</strong> Tₖ₊₁ = Cₙᵏ · aⁿ⁻ᵏ · bᵏ.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Các số đặc trưng đo xu thế trung tâm & độ phân tán
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Trong đề thi THPT Quốc gia 2026–2027, chuyên đề Thống kê (Toán 10, 11, 12) thường xuất hiện ở dạng câu hỏi Đúng/Sai và Trả lời ngắn yêu cầu tính Khoảng biến thiên R, Khoảng tứ phân vị ΔQ = Q₃ − Q₁, phát hiện giá trị ngoại lệ và tính Độ lệch chuẩn s. Công cụ sử dụng số nguyên lớn BigInt và tính toán chính xác 100% trên trình duyệt.
            </p>
          </div>
        </div>
      }
    >
      <CombinatoricsStatsTool />
    </ToolPageShell>
  );
}
