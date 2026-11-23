import type { Metadata } from "next";
import { Atom, BookOpen, Layers } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { PeriodicTableTool } from "@/components/tools/PeriodicTableTool";

const SLUG = "bang-tuan-hoan-hoa-hoc-tuong-tac";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Bảng tuần hoàn này có đầy đủ cả 118 nguyên tố theo chuẩn IUPAC mới không?",
    answer:
      "Có. Bảng tuần hoàn tích hợp đầy đủ toàn bộ 118 nguyên tố từ Z = 1 (Hydrogen) đến Z = 118 (Oganesson), hiển thị song song danh pháp tiếng Anh chuẩn IUPAC theo chương trình GDPT 2018 và tên gọi quen thuộc.",
  },
  {
    question: "Tôi có thể tra cứu nhanh theo số hiệu nguyên tử Z hoặc ký hiệu không?",
    answer:
      "Có. Bạn chỉ cần gõ số hiệu nguyên tử (VD: 26), ký hiệu hóa học (Fe), hoặc tên tiếng Việt/Anh (Sắt, Iron) vào ô tìm kiếm để lọc và nhấn xem ngay cấu hình electron, độ âm điện, số oxi hóa.",
  },
  {
    question: "Quy luật biến đổi tính kim loại - phi kim trong bảng tuần hoàn là gì?",
    answer:
      "Trong một chu kỳ (từ trái sang phải), bán kính nguyên tử giảm dần, độ âm điện tăng dần nên tính phi kim tăng dần và tính kim loại giảm dần. Trong một nhóm A (từ trên xuống dưới), tính kim loại tăng dần.",
  },
];

export default function BangTuanHoanHoaHocPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Ôn thi Hóa học GDPT 2018 bằng Flashcard & Trắc nghiệm AI"
      ctaDescription="Tạo ngay bộ câu hỏi trắc nghiệm chuyên đề Bảng tuần hoàn, Cấu hình electron và Liên kết hóa học trên QuizKen App hoàn toàn miễn phí."
      ctaHref={appLink("/?subject=hoa-hoc")}
      ctaLabel="Tạo Quiz Bảng tuần hoàn AI"
      secondaryCtaHref="/cong-cu/can-bang-phuong-trinh-hoa-hoc"
      secondaryCtaLabel="Mở Cân bằng PTHH"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Cấu trúc Bảng tuần hoàn &amp; Quy luật cần nhớ
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • <strong className="text-foreground">7 Chu kỳ:</strong> Chu kỳ 1, 2, 3 là chu kỳ nhỏ; Chu kỳ 4, 5, 6, 7 là chu kỳ lớn (số thứ tự chu kỳ = số lớp electron).
              </li>
              <li>
                • <strong className="text-foreground">18 Nhóm (IA–VIIIA &amp; IB–VIIIB):</strong> Số electron lớp ngoài cùng thường bằng số thứ tự nhóm A (trừ Heli).
              </li>
              <li>
                • <strong className="text-foreground">Độ âm điện Pauling:</strong> Flo (F) có độ âm điện lớn nhất (3.98); Franci (Fr) / Xesi (Cs) nhỏ nhất.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Atom className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Ví dụ đọc thông số nguyên tố: Sắt (Fe, Z = 26)
              </h2>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-4 text-xs leading-relaxed text-muted-foreground dark:bg-foreground/[0.06] sm:text-sm space-y-1.5">
              <div>
                • <strong className="text-foreground">Vị trí:</strong> Ô số 26, Chu kỳ 4, Nhóm VIIIB (Kim loại chuyển tiếp)
              </div>
              <div>
                • <strong className="text-foreground">Cấu hình e:</strong>{" "}
                <code className="text-primary font-mono">[Ar] 3d⁶ 4s²</code>
              </div>
              <div>
                • <strong className="text-foreground">Số oxi hóa đặc trưng:</strong> +2 (trong FeO, FeSO₄) và +3 (trong Fe₂O₃, FeCl₃)
              </div>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
              Đừng quên làm thử Mini Quiz 5 câu bên dưới bảng để kiểm tra trí nhớ nguyên tử khối!
            </p>
          </div>
        </div>
      }
    >
      <PeriodicTableTool />
    </ToolPageShell>
  );
}
