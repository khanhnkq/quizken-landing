import type { Metadata } from "next";
import { Binary, ArrowLeftRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { RadixConverterTool } from "@/components/tools/RadixConverterTool";

const SLUG = "chuyen-doi-he-co-so-nhi-phan-thap-luc-phan";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Cách chuyển từ hệ thập phân (cơ số 10) sang nhị phân (cơ số 2) thủ công?",
    answer:
      "Chia liên tiếp số thập phân cho 2 và ghi lại phần dư (0 hoặc 1) cho đến khi thương bằng 0, sau đó đọc ngược chuỗi số dư từ dưới lên trên. Công cụ tự động hiển thị toàn bộ bảng chia lấy dư này để bạn đối chiếu.",
  },
  {
    question: "Số bù 2 (Two's Complement) dùng để làm gì trong Tin học?",
    answer:
      "Số bù 2 là phương pháp chuẩn để biểu diễn số nguyên có dấu (âm và dương) trong CPU máy tính. Để tìm bù 2 của số âm -N trên 8 bit: biểu diễn N dưới dạng 8 bit, đảo toàn bộ bit (0↔1) rồi cộng thêm 1.",
  },
  {
    question: "Tại sao hệ Hex (cơ số 16) lại dùng các chữ cái A, B, C, D, E, F?",
    answer:
      "Hệ thập lục phân có 16 ký tự từ 0 đến 15, nên các giá trị 10, 11, 12, 13, 14, 15 được ký hiệu lần lượt là A, B, C, D, E, F. Mỗi chữ số Hex tương ứng chính xác với một nhóm 4 bit nhị phân.",
  },
];

export default function ChuyenDoiHeCoSoPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Ôn thi Tin học THPT & Nhập môn Lập trình cùng QuizKen AI"
      ctaDescription="Luyện ngay bộ câu hỏi trắc nghiệm Tin học GDPT 2018 (Python, SQL, Mạng máy tính, Biểu diễn dữ liệu nhị phân) trên QuizKen."
      ctaHref={appLink("/?subject=tin-hoc")}
      ctaLabel="Tạo đề Tin học bằng AI"
      secondaryCtaHref="/de-thi/tin-hoc/on-thi-thpt"
      secondaryCtaLabel="Làm đề thi Tin học THPT"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Binary className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Bảng quy đổi nhanh 4 bit Nhị phân ↔ Thập phân ↔ Hex
              </h2>
            </div>
            <div className="grid grid-cols-4 gap-2 font-mono text-xs">
              {[
                ["0 = 0000 = 0", "1 = 0001 = 1", "2 = 0010 = 2", "3 = 0011 = 3"],
                ["4 = 0100 = 4", "5 = 0101 = 5", "6 = 0110 = 6", "7 = 0111 = 7"],
                ["8 = 1000 = 8", "9 = 1001 = 9", "10 = 1010 = A", "11 = 1011 = B"],
                ["12 = 1100 = C", "13 = 1101 = D", "14 = 1110 = E", "15 = 1111 = F"],
              ]
                .flat()
                .map((item) => (
                  <div
                    key={item}
                    className="rounded-lg bg-foreground/[0.04] px-2 py-1.5 text-center font-semibold text-foreground dark:bg-foreground/[0.06]"
                  >
                    {item}
                  </div>
                ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Quy tắc đọc số La Mã chuẩn (1 – 3999)
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Các ký tự cơ bản gồm <strong className="text-foreground">I (1), V (5), X (10), L (50), C (100), D (500), M (1000)</strong>. Khi chữ số nhỏ đứng ngay trước chữ số lớn (như IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900) ta lấy giá trị lớn trừ nhỏ; ngược lại thì cộng dồn.
            </p>
          </div>
        </div>
      }
    >
      <RadixConverterTool />
    </ToolPageShell>
  );
}
