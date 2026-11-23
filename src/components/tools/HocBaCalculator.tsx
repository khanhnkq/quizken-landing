"use client";

import { useMemo, useState } from "react";
import { Award, Check, Copy, RotateCcw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type SubjectKey =
  | "toan"
  | "van"
  | "anh"
  | "ly"
  | "hoa"
  | "sinh"
  | "su"
  | "dia";

const SUBJECT_META: Array<{ key: SubjectKey; label: string }> = [
  { key: "toan", label: "Toán học" },
  { key: "van", label: "Ngữ văn" },
  { key: "anh", label: "Tiếng Anh" },
  { key: "ly", label: "Vật lý" },
  { key: "hoa", label: "Hóa học" },
  { key: "sinh", label: "Sinh học" },
  { key: "su", label: "Lịch sử" },
  { key: "dia", label: "Địa lý" },
];

const COMBINATIONS: Array<{
  code: string;
  name: string;
  subjects: [SubjectKey, SubjectKey, SubjectKey];
}> = [
  { code: "A00", name: "Toán – Vật lý – Hóa học", subjects: ["toan", "ly", "hoa"] },
  { code: "A01", name: "Toán – Vật lý – Tiếng Anh", subjects: ["toan", "ly", "anh"] },
  { code: "B00", name: "Toán – Hóa học – Sinh học", subjects: ["toan", "hoa", "sinh"] },
  { code: "C00", name: "Ngữ văn – Lịch sử – Địa lý", subjects: ["van", "su", "dia"] },
  { code: "D01", name: "Toán – Ngữ văn – Tiếng Anh", subjects: ["toan", "van", "anh"] },
  { code: "D07", name: "Toán – Hóa học – Tiếng Anh", subjects: ["toan", "hoa", "anh"] },
  { code: "C01", name: "Toán – Ngữ văn – Vật lý", subjects: ["toan", "van", "ly"] },
];

type ScoreMatrix = Record<SubjectKey, number[]>; // 6 semesters OR 3 years (first 3 items)

const INITIAL_SCORES: ScoreMatrix = {
  toan: [8.4, 8.6, 8.5, 8.8, 8.9, 9.0],
  van: [7.5, 7.8, 7.7, 8.0, 8.1, 8.2],
  anh: [8.6, 8.7, 8.8, 9.0, 9.1, 9.2],
  ly: [8.2, 8.4, 8.5, 8.6, 8.8, 8.9],
  hoa: [7.9, 8.0, 8.1, 8.2, 8.4, 8.5],
  sinh: [7.6, 7.7, 7.8, 7.9, 8.0, 8.1],
  su: [7.8, 7.9, 8.0, 8.1, 8.2, 8.3],
  dia: [8.0, 8.1, 8.2, 8.3, 8.4, 8.5],
};

function clampScore(raw: string): number {
  const n = parseFloat(raw.replace(",", "."));
  if (Number.isNaN(n)) return 0;
  return Math.min(10, Math.max(0, n));
}

function calcEffectivePriority(base30: number, rawPriority: number, applyDecay: boolean): number {
  if (rawPriority <= 0) return 0;
  if (!applyDecay || base30 < 22.5) return rawPriority;
  if (base30 >= 30) return 0;
  return Math.round(((30 - base30) / 7.5) * rawPriority * 100) / 100;
}

export function HocBaCalculator() {
  const [mode, setMode] = useState<"6hk" | "3nam">("6hk");
  const [scores, setScores] = useState<ScoreMatrix>(INITIAL_SCORES);
  const [priority, setPriority] = useState<string>("0.25");
  const [applyMoetDecay, setApplyMoetDecay] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);

  const subjectAverages = useMemo(() => {
    const len = mode === "6hk" ? 6 : 3;
    const out = {} as Record<SubjectKey, number>;
    for (const s of SUBJECT_META) {
      const slice = scores[s.key].slice(0, len);
      const sum = slice.reduce((a, b) => a + b, 0);
      out[s.key] = Math.round((sum / len) * 100) / 100;
    }
    return out;
  }, [scores, mode]);

  const rankedCombos = useMemo(() => {
    const rawPr = Math.min(2.75, Math.max(0, parseFloat(priority.replace(",", ".")) || 0));

    return COMBINATIONS.map((combo) => {
      const s1 = subjectAverages[combo.subjects[0]];
      const s2 = subjectAverages[combo.subjects[1]];
      const s3 = subjectAverages[combo.subjects[2]];
      const baseTotal = Math.round((s1 + s2 + s3) * 100) / 100;
      const effPriority = calcEffectivePriority(baseTotal, rawPr, applyMoetDecay);
      const finalTotal = Math.min(30, Math.round((baseTotal + effPriority) * 100) / 100);

      return {
        ...combo,
        partScores: [s1, s2, s3] as [number, number, number],
        baseTotal,
        effPriority,
        finalTotal,
      };
    }).sort((a, b) => b.finalTotal - a.finalTotal);
  }, [subjectAverages, priority, applyMoetDecay]);

  const topCombo = rankedCombos[0];

  const updateCell = (subject: SubjectKey, index: number, value: string) => {
    const num = clampScore(value);
    setScores((prev) => ({
      ...prev,
      [subject]: prev[subject].map((v, i) => (i === index ? num : v)),
    }));
  };

  const resetAll = () => {
    const zeroed = {} as ScoreMatrix;
    for (const s of SUBJECT_META) {
      zeroed[s.key] = [0, 0, 0, 0, 0, 0];
    }
    setScores(zeroed);
    setPriority("0");
  };

  const handleCopy = async () => {
    const lines = [
      `📊 XẾP HẠNG ĐIỂM XÉT HỌC BẠ THPT 2027 (${mode === "6hk" ? "6 học kỳ" : "3 năm"})`,
      ...rankedCombos.map(
        (c, idx) =>
          `${idx + 1}. Khối ${c.code} (${c.name}): ${c.finalTotal.toFixed(2)} đ (Gốc ${c.baseTotal.toFixed(2)} + ƯT ${c.effPriority.toFixed(2)})`,
      ),
      `Tính tại: https://www.quizken.com/cong-cu/tinh-diem-xet-hoc-ba-thpt-2027`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const colHeaders =
    mode === "6hk"
      ? ["L10 HK1", "L10 HK2", "L11 HK1", "L11 HK2", "L12 HK1", "L12 HK2"]
      : ["Cả năm 10", "Cả năm 11", "Cả năm 12"];

  return (
    <div className="space-y-6">
      {/* Mode & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/85 p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("6hk")}
            className={cn(
              "min-h-11 rounded-xl px-4 font-heading text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
              mode === "6hk"
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/[0.05] text-muted-foreground hover:text-foreground",
            )}
          >
            Tính theo 6 Học kỳ (Lớp 10–11–12)
          </button>
          <button
            type="button"
            onClick={() => setMode("3nam")}
            className={cn(
              "min-h-11 rounded-xl px-4 font-heading text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
              mode === "3nam"
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/[0.05] text-muted-foreground hover:text-foreground",
            )}
          >
            Tính theo 3 Năm (ĐTB Cả năm)
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setScores(INITIAL_SCORES);
              setPriority("0.25");
            }}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Dữ liệu mẫu</span>
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Đặt lại 0</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Subject Score Matrix */}
        <div className="space-y-4 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-7">
          <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
            1. Nhập điểm học bạ các môn
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/70 text-muted-foreground">
                  <th className="py-2 pr-2 font-semibold">Môn học</th>
                  {colHeaders.map((h) => (
                    <th key={h} className="py-2 px-1 text-center font-semibold">
                      {h}
                    </th>
                  ))}
                  <th className="py-2 pl-2 text-right font-semibold text-primary">
                    ĐTB
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {SUBJECT_META.map((sub) => (
                  <tr key={sub.key}>
                    <td className="py-2 pr-2 font-semibold text-foreground whitespace-nowrap">
                      {sub.label}
                    </td>
                    {colHeaders.map((_, idx) => (
                      <td key={idx} className="py-1.5 px-1">
                        <input
                          type="number"
                          aria-label={`${sub.label} ${colHeaders[idx]}`}
                          inputMode="decimal"
                          min={0}
                          max={10}
                          step={0.1}
                          value={scores[sub.key][idx]}
                          onChange={(e) => updateCell(sub.key, idx, e.target.value)}
                          className="h-10 w-full min-w-[54px] rounded-lg border border-border bg-background px-1.5 text-center text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </td>
                    ))}
                    <td className="py-2 pl-2 text-right font-heading text-sm font-bold text-primary">
                      {subjectAverages[sub.key].toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 sm:items-center">
            <label className="space-y-1">
              <span className="block text-xs font-semibold text-foreground">
                Điểm ưu tiên KV / Đối tượng (0 – 2.75)
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={2.75}
                step={0.05}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="flex min-h-11 items-center gap-2.5 rounded-xl bg-foreground/[0.04] px-3.5 py-2 text-xs font-medium text-foreground cursor-pointer dark:bg-foreground/[0.06] sm:mt-5">
              <input
                type="checkbox"
                checked={applyMoetDecay}
                onChange={(e) => setApplyMoetDecay(e.target.checked)}
                className="h-4 w-4 accent-emerald-500"
              />
              <span>Áp dụng giảm trừ điểm ưu tiên khi tổng ≥ 22.5đ</span>
            </label>
          </div>
        </div>

        {/* Right Ranked Combinations */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-heading text-lg font-bold text-foreground">
                2. Xếp hạng tổ hợp lợi điểm nhất
              </h2>
              <Badge className="bg-primary/15 text-primary">
                <Award className="h-3.5 w-3.5" />
                <span>Best: {topCombo.code}</span>
              </Badge>
            </div>

            <div className="rounded-2xl bg-primary/10 p-4 text-center space-y-1">
              <div className="text-xs font-semibold text-primary">
                Tổ hợp cao điểm nhất: Khối {topCombo.code} ({topCombo.name})
              </div>
              <div className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
                {topCombo.finalTotal.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                Điểm gốc 3 môn: {topCombo.baseTotal.toFixed(2)} + Ưu tiên thực tế:{" "}
                {topCombo.effPriority.toFixed(2)}
              </div>
            </div>

            <div className="space-y-2">
              {rankedCombos.map((combo, idx) => (
                <div
                  key={combo.code}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-xs sm:text-sm",
                    idx === 0
                      ? "border border-primary/50 bg-primary/5"
                      : "bg-foreground/[0.04] dark:bg-foreground/[0.06]",
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-foreground">
                        #{idx + 1} Khối {combo.code}
                      </span>
                      {idx === 0 && (
                        <Badge className="bg-primary text-primary-foreground text-[10px]">
                          Cao nhất
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {combo.name} ({combo.partScores.map((s) => s.toFixed(1)).join(" + ")})
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-heading text-base font-bold text-primary">
                      {combo.finalTotal.toFixed(2)}
                    </div>
                    {combo.effPriority > 0 && (
                      <div className="text-[10px] text-muted-foreground">
                        +{combo.effPriority.toFixed(2)} ƯT
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-heading text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Đã sao chép bảng xếp hạng khối!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Sao chép kết quả 7 tổ hợp</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
