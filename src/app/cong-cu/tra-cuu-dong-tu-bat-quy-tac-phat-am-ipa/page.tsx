import type { Metadata } from "next";
import { BookOpen, Languages, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { IrregularVerbsTool } from "@/components/tools/IrregularVerbsTool";

const SLUG = "tra-cuu-dong-tu-bat-quy-tac-phat-am-ipa";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Nên học động từ bất quy tắc tiếng Anh theo thứ tự ABC hay theo nhóm quy luật?",
    answer:
      "Học theo 5 nhóm quy luật biến đổi (AAA, ABB, ABA, ABC, AAB) giúp não bộ ghi nhớ nhanh hơn gấp 2 lần so với học vẹt bảng chữ cái, vì các từ cùng nhóm có âm vần tương đồng như sing-sang-sung, ring-rang-rung.",
  },
  {
    question: "Động từ 'read' viết giống nhau nhưng phát âm V2, V3 có khác V1 không?",
    answer:
      "Có. Dạng nguyên mẫu V1 'read' phát âm là /riːd/, trong khi V2 và V3 tuy viết giống hệt là 'read' nhưng phát âm thành /red/ (giống màu đỏ 'red').",
  },
  {
    question: "Khi nào cần dùng cột V2 và khi nào dùng cột V3?",
    answer:
      "V2 dùng trong câu khẳng định của thì Quá khứ đơn (Past Simple). V3 (quá khứ phân từ) dùng trong các thì hoàn thành (Present/Past Perfect), câu bị động (Passive Voice) và mệnh đề phân từ quá khứ.",
  },
  {
    question: "Nút loa phát âm US/UK hoạt động như thế nào?",
    answer:
      "Công cụ sử dụng Web Speech Synthesis API tích hợp sẵn trên trình duyệt hiện đại để đọc chuẩn cả 3 dạng V1 – V2 – V3 theo giọng Anh-Mỹ (US) hoặc Anh-Anh (UK) hoàn toàn miễn phí.",
  },
];

export default function TraCuuDongTuBatQuyTacPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Luyện ngữ pháp các thì & từ vựng CEFR siêu tốc trên QuizKen English Hub"
      ctaDescription="Kết hợp bảng động từ bất quy tắc với flashcard lặp lại ngắt quãng (Spaced Repetition) và đề thi trắc nghiệm Tiếng Anh chuẩn 2026."
      ctaHref={appLink("/english")}
      ctaLabel="Mở English Hub miễn phí"
      secondaryCtaHref="/de-thi/tieng-anh"
      secondaryCtaLabel="Làm đề Tiếng Anh THPT"
      seoContent={
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Languages className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Mẹo nhớ 150+ động từ bất quy tắc theo 5 nhóm quy luật âm vần
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Thay vì học rời rạc từng từ, bạn hãy bấm bộ lọc nhóm AAA, ABB, ABA, ABC ngay phía trên để ôn theo cụm âm giống nhau, sau đó chuyển sang tab &quot;Luyện nhớ nhanh 10 câu&quot; để kiểm tra ngay khả năng phản xạ.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Các cụm âm vần dễ nhớ nhất
                </h3>
              </div>
              <ul className="space-y-1.5 text-sm text-foreground list-disc pl-5">
                <li><strong>i – a – u:</strong> begin–began–begun, drink–drank–drunk, sing–sang–sung, swim–swam–swum.</li>
                <li><strong>-ought / -aught:</strong> bring–brought–brought, buy–bought–bought, think–thought–thought, catch–caught–caught, teach–taught–taught.</li>
                <li><strong>-ew – -own:</strong> blow–blew–blown, fly–flew–flown, grow–grew–grown, know–knew–known, throw–threw–thrown.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Phân loại 5 nhóm động từ bất quy tắc
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Nhóm</th>
                      <th className="py-2 pr-3 font-semibold">Quy luật</th>
                      <th className="py-2 font-semibold text-primary">Ví dụ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr><td className="py-2 pr-3 font-bold">AAA</td><td className="py-2 pr-3">V1 = V2 = V3</td><td className="py-2">cut – cut – cut, put – put – put</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">ABB</td><td className="py-2 pr-3">V2 = V3</td><td className="py-2">buy – bought – bought</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">ABA</td><td className="py-2 pr-3">V1 = V3</td><td className="py-2">come – came – come</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">ABC</td><td className="py-2 pr-3">3 dạng khác nhau</td><td className="py-2">write – wrote – written</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">AAB</td><td className="py-2 pr-3">V1 = V2</td><td className="py-2">beat – beat – beaten</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <IrregularVerbsTool />
    </ToolPageShell>
  );
}
