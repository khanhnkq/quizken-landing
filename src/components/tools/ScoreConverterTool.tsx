"use client";

import { useMemo, useState } from "react";
import { AlertCircle, ArrowLeftRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type ExamKey = "ielts" | "toeic" | "sat" | "hsa" | "vact" | "tsa";

const TABS: Array<{ id: ExamKey; label: string; short: string }> = [
  { id: "ielts", label: "IELTS Academic", short: "IELTS" },
  { id: "toeic", label: "TOEIC (L&R)", short: "TOEIC" },
  { id: "sat", label: "SAT Digital", short: "SAT" },
  { id: "hsa", label: "ĐGNL Hà Nội (HSA)", short: "HSA" },
  { id: "vact", label: "ĐGNL TP.HCM (V-ACT)", short: "V-ACT" },
  { id: "tsa", label: "ĐGTD Bách Khoa (TSA)", short: "TSA" },
];

function getIeltsConversion(band: number) {
  if (band >= 7.5) return { scale10: 10.0, range: "10.0", cefr: "C1 / C2", note: "Đạt mức quy đổi tối đa 10 điểm ở hầu hết mọi trường ĐH top." };
  if (band >= 7.0) return { scale10: 10.0, range: "9.5 – 10.0", cefr: "C1", note: "Đạt 10.0 ở phần lớn trường (FTU, NEU, BKHN); một số trường quy đổi 9.5." };
  if (band >= 6.5) return { scale10: 9.5, range: "9.0 – 10.0", cefr: "B2 (Cao)", note: "Mức phổ biến quy đổi 9.0–9.5 (hoặc 10.0 tại một số ngành/trường)." };
  if (band >= 6.0) return { scale10: 9.0, range: "8.5 – 9.0", cefr: "B2", note: "Mức tối thiểu phổ biến để xét tuyển kết hợp ở nhiều trường top." };
  if (band >= 5.5) return { scale10: 8.5, range: "8.0 – 8.5", cefr: "B2 (Ngưỡng)", note: "Thường được miễn thi ngoại ngữ tốt nghiệp và quy đổi 8.0–8.5." };
  if (band >= 5.0) return { scale10: 8.0, range: "7.5 – 8.0", cefr: "B1+", note: "Phù hợp nhóm trường xét tuyển mức cơ bản hoặc miễn thi THPT." };
  return { scale10: 7.5, range: "7.0 – 7.5", cefr: "B1", note: "Đủ điều kiện miễn thi tốt nghiệp THPT môn Ngoại ngữ (≥ 4.0 theo quy định chung)." };
}

function getToeicConversion(score: number) {
  if (score >= 945) return { scale10: 10.0, cefr: "C1", ieltsEq: "~7.5 – 8.0" };
  if (score >= 850) return { scale10: 9.5, cefr: "B2+", ieltsEq: "~6.5 – 7.0" };
  if (score >= 785) return { scale10: 9.0, cefr: "B2", ieltsEq: "~6.0" };
  if (score >= 650) return { scale10: 8.5, cefr: "B1+", ieltsEq: "~5.5" };
  if (score >= 550) return { scale10: 8.0, cefr: "B1", ieltsEq: "~5.0" };
  if (score >= 450) return { scale10: 7.0, cefr: "B1 (Cơ bản)", ieltsEq: "~4.5" };
  return { scale10: 5.5, cefr: "A2", ieltsEq: "< 4.0" };
}

export function ScoreConverterTool() {
  const [activeTab, setActiveTab] = useState<ExamKey>("ielts");
  const [ielts, setIelts] = useState<number>(6.5);
  const [toeic, setToeic] = useState<number>(785);
  const [sat, setSat] = useState<number>(1380);
  const [hsa, setHsa] = useState<number>(105);
  const [vact, setVact] = useState<number>(920);
  const [tsa, setTsa] = useState<number>(72);

  const view = useMemo(() => {
    switch (activeTab) {
      case "ielts": {
        const res = getIeltsConversion(ielts);
        return {
          title: "IELTS Academic → Thang 10 Tiếng Anh",
          inputDisplay: `${ielts.toFixed(1)} IELTS`,
          primaryMetricLabel: "Điểm Tiếng Anh quy đổi tham khảo (Thang 10)",
          primaryMetricValue: res.scale10.toFixed(1),
          secondaryCards: [
            { label: "Biên độ các trường ĐH", value: res.range },
            { label: "Khung năng lực CEFR", value: res.cefr },
          ],
          note: res.note,
          min: 4.5,
          max: 9.0,
          step: 0.5,
          val: ielts,
          onChange: setIelts,
        };
      }
      case "toeic": {
        const res = getToeicConversion(toeic);
        return {
          title: "TOEIC (Nghe + Đọc) → Thang 10 & IELTS tương đương",
          inputDisplay: `${toeic} / 990`,
          primaryMetricLabel: "Điểm Tiếng Anh quy đổi tham khảo (Thang 10)",
          primaryMetricValue: res.scale10.toFixed(1),
          secondaryCards: [
            { label: "Khung CEFR tham khảo", value: res.cefr },
            { label: "Tương đương IELTS", value: res.ieltsEq },
          ],
          note: "Lưu ý: Một số trường ĐH yêu cầu TOEIC 4 kỹ năng (Listening, Reading, Speaking, Writing) khi xét tuyển chứng chỉ quốc tế.",
          min: 250,
          max: 990,
          step: 5,
          val: toeic,
          onChange: setToeic,
        };
      }
      case "sat": {
        const scale30 = (sat / 1600) * 30;
        const tier =
          sat >= 1450
            ? "Rất cạnh tranh (Top 5%)"
            : sat >= 1300
              ? "Cạnh tranh tốt (Ngành hot)"
              : sat >= 1150
                ? "Khá (Đạt ngưỡng nhiều trường)"
                : "Cơ bản";
        return {
          title: "SAT Digital (Thang 1600) → Thang 30 xét tuyển",
          inputDisplay: `${sat} / 1600`,
          primaryMetricLabel: "Điểm quy đổi tham khảo (Thang 30)",
          primaryMetricValue: scale30.toFixed(2),
          secondaryCards: [
            { label: "Độ cạnh tranh xét tuyển", value: tier },
            { label: "Tỷ lệ đạt được", value: `${((sat / 1600) * 100).toFixed(1)}%` },
          ],
          note: "Công thức tham khảo: (Điểm SAT / 1600) × 30. Một số trường cộng thêm điểm ưu tiên hoặc chia bậc điểm riêng.",
          min: 800,
          max: 1600,
          step: 10,
          val: sat,
          onChange: setSat,
        };
      }
      case "hsa": {
        const scale30 = (hsa / 150) * 30;
        const tier =
          hsa >= 110
            ? "Xuất sắc (Top đầu ĐHQG HN)"
            : hsa >= 95
              ? "Cạnh tranh cao"
              : hsa >= 80
                ? "Khá tốt"
                : "Cơ bản";
        return {
          title: "ĐGNL ĐHQG Hà Nội (HSA - Thang 150) → Thang 30",
          inputDisplay: `${hsa} / 150`,
          primaryMetricLabel: "Điểm quy đổi tham khảo (Thang 30)",
          primaryMetricValue: scale30.toFixed(2),
          secondaryCards: [
            { label: "Nhóm cạnh tranh", value: tier },
            { label: "Tỷ lệ hoàn thành", value: `${((hsa / 150) * 100).toFixed(1)}%` },
          ],
          note: "Công thức quy đổi tuyến tính tham khảo: (HSA / 150) × 30. ĐHQG Hà Nội và các trường liên kết thường xét theo điểm HSA gốc hoặc quy đổi bách phân vị.",
          min: 40,
          max: 150,
          step: 1,
          val: hsa,
          onChange: setHsa,
        };
      }
      case "vact": {
        const scale30 = (vact / 1200) * 30;
        const tier =
          vact >= 980
            ? "Rất cao (BK, KHTN, UIT...)"
            : vact >= 850
              ? "Cạnh tranh tốt"
              : vact >= 700
                ? "Khá"
                : "Cơ bản";
        return {
          title: "ĐGNL ĐHQG TP.HCM (V-ACT - Thang 1200) → Thang 30",
          inputDisplay: `${vact} / 1200`,
          primaryMetricLabel: "Điểm quy đổi tham khảo (Thang 30)",
          primaryMetricValue: scale30.toFixed(2),
          secondaryCards: [
            { label: "Nhóm cạnh tranh", value: tier },
            { label: "Tỷ lệ điểm", value: `${((vact / 1200) * 100).toFixed(1)}%` },
          ],
          note: "Từ 2025, cấu trúc V-ACT giữ thang 1200 điểm. Điểm quy đổi (V-ACT / 1200) × 30 dùng để ước lượng tương quan với tổ hợp 3 môn THPT.",
          min: 300,
          max: 1200,
          step: 5,
          val: vact,
          onChange: setVact,
        };
      }
      case "tsa": {
        const scale30 = (tsa / 100) * 30;
        const tier =
          tsa >= 75
            ? "Rất cao (IT1, IT2, Tự động hóa BKHN)"
            : tsa >= 62
              ? "Cạnh tranh tốt"
              : tsa >= 50
                ? "Khá"
                : "Cơ bản";
        return {
          title: "ĐGTD Bách Khoa Hà Nội (TSA - Thang 100) → Thang 30",
          inputDisplay: `${tsa.toFixed(1)} / 100`,
          primaryMetricLabel: "Điểm quy đổi tham khảo (Thang 30)",
          primaryMetricValue: scale30.toFixed(2),
          secondaryCards: [
            { label: "Mức cạnh tranh BKHN", value: tier },
            { label: "Phần trăm điểm", value: `${tsa.toFixed(1)}%` },
          ],
          note: "Công thức tham khảo: (TSA / 100) × 30. Thực tế ĐH BKHN thường xét trực tiếp thang 100 hoặc cộng điểm thưởng IELTS/chứng chỉ theo quy định riêng.",
          min: 20,
          max: 100,
          step: 0.5,
          val: tsa,
          onChange: setTsa,
        };
      }
    }
  }, [activeTab, ielts, toeic, sat, hsa, vact, tsa]);

  return (
    <div className="space-y-6 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-xl px-4 font-heading text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/[0.05] text-muted-foreground hover:bg-foreground/[0.09] hover:text-foreground",
              )}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Converter Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
        <div className="space-y-5 lg:col-span-7">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              {view.title}
            </h2>
            <Badge className="bg-primary/15 text-primary">
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <span>Quy đổi tức thì</span>
            </Badge>
          </div>

          <div className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06] space-y-4">
            <div className="flex items-center justify-between gap-4">
              <label className="text-xs font-semibold text-muted-foreground sm:text-sm">
                Nhập hoặc kéo thanh điểm:
              </label>
              <input
                type="number"
                aria-label="Nhập điểm cần quy đổi"
                inputMode="decimal"
                min={view.min}
                max={view.max}
                step={view.step}
                value={view.val}
                onChange={(e) => {
                  const num = parseFloat(e.target.value);
                  if (!Number.isNaN(num)) {
                    view.onChange(Math.min(view.max, Math.max(view.min, num)));
                  }
                }}
                className="h-11 w-32 rounded-xl border border-border bg-background px-3 text-right font-heading text-base font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <input
              type="range"
              aria-label="Thanh trượt chọn điểm"
              min={view.min}
              max={view.max}
              step={view.step}
              value={view.val}
              onChange={(e) => view.onChange(parseFloat(e.target.value))}
              className="h-2.5 w-full cursor-pointer accent-emerald-500"
            />

            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Tối thiểu: {view.min}</span>
              <span className="font-bold text-foreground">{view.inputDisplay}</span>
              <span>Tối đa: {view.max}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-border/60 p-3.5 text-xs leading-relaxed text-muted-foreground">
            <AlertCircle className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <div>
              <strong className="text-foreground">Lưu ý quan trọng:</strong>{" "}
              {view.note} Hệ số và bảng quy đổi chính thức phụ thuộc vào Đề án
              tuyển sinh từng năm của mỗi trường Đại học.
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-2xl bg-foreground/[0.04] p-6 text-center dark:bg-foreground/[0.06]">
            <div className="text-xs font-semibold text-muted-foreground">
              {view.primaryMetricLabel}
            </div>
            <div className="mt-2 font-heading text-5xl font-bold tracking-tight text-primary sm:text-6xl">
              {view.primaryMetricValue}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {view.secondaryCards.map((card) => (
              <div
                key={card.label}
                className="flex items-center justify-between rounded-xl bg-foreground/[0.04] px-4 py-3 dark:bg-foreground/[0.06]"
              >
                <span className="text-xs text-muted-foreground">
                  {card.label}
                </span>
                <span className="font-heading text-sm font-bold text-foreground">
                  {card.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
