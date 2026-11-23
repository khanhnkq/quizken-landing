"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, CheckCircle2, Copy, RotateCcw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type WeightPreset = {
  id: string;
  label: string;
  attendance: number;
  midterm: number;
  practice: number;
  finalExam: number;
};

const WEIGHT_PRESETS: WeightPreset[] = [
  { id: "10-30-60", label: "10% – 30% – 60%", attendance: 10, midterm: 30, practice: 0, finalExam: 60 },
  { id: "10-20-20-50", label: "10% – 20% – 20% – 50%", attendance: 10, midterm: 20, practice: 20, finalExam: 50 },
  { id: "20-30-50", label: "20% – 30% – 50%", attendance: 20, midterm: 30, practice: 0, finalExam: 50 },
  { id: "custom", label: "Tùy chỉnh (%)", attendance: 10, midterm: 20, practice: 10, finalExam: 60 },
];

const GRADE_TARGETS = [
  { letter: "D (Qua môn)", minScore: 4.0 },
  { letter: "C (Trung bình)", minScore: 5.5 },
  { letter: "B (Khá)", minScore: 7.0 },
  { letter: "B+ (Khá giỏi)", minScore: 8.0 },
  { letter: "A (Giỏi)", minScore: 8.5 },
  { letter: "A+ (Xuất sắc)", minScore: 9.0 },
];

function clampNum(raw: string, min: number, max: number): number {
  const parsed = parseFloat(raw.replace(",", "."));
  if (Number.isNaN(parsed)) return min;
  return Math.min(max, Math.max(min, parsed));
}

export function classifyCourseGrade(score10: number): string {
  if (score10 >= 9.0) return "A+ (4.0)";
  if (score10 >= 8.5) return "A (4.0)";
  if (score10 >= 8.0) return "B+ (3.5)";
  if (score10 >= 7.0) return "B (3.0)";
  if (score10 >= 6.5) return "C+ (2.5)";
  if (score10 >= 5.5) return "C (2.0)";
  if (score10 >= 5.0) return "D+ (1.5)";
  if (score10 >= 4.0) return "D (1.0)";
  return "F (0.0 — Học lại)";
}

export function CoursePassCalculatorTool() {
  const [presetId, setPresetId] = useState<string>("10-30-60");
  const [wAtt, setWAtt] = useState<string>("10");
  const [wMid, setWMid] = useState<string>("30");
  const [wPrac, setWPrac] = useState<string>("0");
  const [wFinal, setWFinal] = useState<string>("60");

  const [sAtt, setSAtt] = useState<string>("9.0");
  const [sMid, setSMid] = useState<string>("7.5");
  const [sPrac, setSPrac] = useState<string>("8.0");
  const [sFinalSim, setSFinalSim] = useState<string>("7.0");
  const [minFinalHurdle, setMinFinalHurdle] = useState<string>("3.0");
  const [copied, setCopied] = useState(false);

  const handleSelectPreset = (preset: WeightPreset) => {
    setPresetId(preset.id);
    if (preset.id !== "custom") {
      setWAtt(String(preset.attendance));
      setWMid(String(preset.midterm));
      setWPrac(String(preset.practice));
      setWFinal(String(preset.finalExam));
    }
  };

  const result = useMemo(() => {
    const wa = clampNum(wAtt, 0, 100);
    const wm = clampNum(wMid, 0, 100);
    const wp = clampNum(wPrac, 0, 100);
    const wf = clampNum(wFinal, 0, 100);
    const totalWeight = wa + wm + wp + wf;

    const sa = clampNum(sAtt, 0, 10);
    const sm = clampNum(sMid, 0, 10);
    const sp = clampNum(sPrac, 0, 10);
    const sf = clampNum(sFinalSim, 0, 10);
    const hurdle = clampNum(minFinalHurdle, 0, 10);

    const processWeightedSum = (sa * wa + sm * wm + sp * wp) / 100;
    const finalWeightRatio = wf / 100;

    const simulatedTotal = Math.round((processWeightedSum + sf * finalWeightRatio) * 100) / 100;
    const hurdleFailed = sf < hurdle;
    const passedSim = simulatedTotal >= 4.0 && !hurdleFailed;

    const targetRows = GRADE_TARGETS.map((t) => {
      if (finalWeightRatio <= 0) {
        return {
          ...t,
          neededFinal: processWeightedSum >= t.minScore ? 0 : null,
          alreadySecured: processWeightedSum >= t.minScore,
          impossible: processWeightedSum < t.minScore,
          hurdleApplied: false,
        };
      }
      const rawNeeded = (t.minScore - processWeightedSum) / finalWeightRatio;
      const effectiveNeeded = Math.max(hurdle, rawNeeded);
      const rounded = Math.ceil(effectiveNeeded * 100) / 100;
      return {
        ...t,
        neededFinal: Math.max(0, rounded),
        alreadySecured: rawNeeded <= 0 && hurdle === 0,
        impossible: rounded > 10,
        hurdleApplied: rawNeeded < hurdle && rounded <= 10,
      };
    });

    return {
      totalWeight,
      wa,
      wm,
      wp,
      wf,
      processWeightedSum: Math.round(processWeightedSum * 100) / 100,
      simulatedTotal,
      hurdle,
      hurdleFailed,
      passedSim,
      targetRows,
    };
  }, [wAtt, wMid, wPrac, wFinal, sAtt, sMid, sPrac, sFinalSim, minFinalHurdle]);

  const handleReset = () => {
    handleSelectPreset(WEIGHT_PRESETS[0]);
    setSAtt("8.0");
    setSMid("6.5");
    setSPrac("0");
    setSFinalSim("6.0");
    setMinFinalHurdle("3.0");
  };

  const handleCopy = async () => {
    const passRow = result.targetRows[0];
    const lines = [
      "TÍNH ĐIỂM HỌC PHẦN TÍN CHỈ ĐẠI HỌC",
      `• Tỷ trọng: CC ${result.wa}% | GK ${result.wm}% | TH ${result.wp}% | CK ${result.wf}%`,
      `• Điểm tích lũy quá trình: ${result.processWeightedSum.toFixed(2)} / ${(10 - result.wf / 10).toFixed(1)}`,
      `• Điểm thi cuối kỳ tối thiểu để qua môn (D ≥ 4.0, điểm liệt CK < ${result.hurdle}): ${
        passRow.impossible ? "> 10 (Không đủ điều kiện)" : passRow.neededFinal?.toFixed(2)
      }`,
      `• Giả lập với điểm CK ${sFinalSim}: Tổng = ${result.simulatedTotal.toFixed(2)} (${classifyCourseGrade(result.simulatedTotal)})`,
      "Tính tại: https://www.quizken.com/cong-cu/tinh-diem-hoc-phan-tin-chi-can-dat",
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Weights & Component Scores */}
        <div className="space-y-6 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              1. Chọn tỷ trọng học phần &amp; nhập điểm thành phần
            </h2>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Đặt lại
            </button>
          </div>

          {/* Weight Presets */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cơ cấu điểm phổ biến (CC – GK – TH – CK)
            </span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {WEIGHT_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={cn(
                    "min-h-11 rounded-xl border px-3 text-xs font-bold transition-colors cursor-pointer",
                    presetId === p.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 bg-foreground/[0.03] text-foreground hover:bg-foreground/[0.06]",
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Weights row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { id: "w-att", label: "% Chuyên cần", val: wAtt, set: (v: string) => { setPresetId("custom"); setWAtt(v); } },
              { id: "w-mid", label: "% Giữa kỳ", val: wMid, set: (v: string) => { setPresetId("custom"); setWMid(v); } },
              { id: "w-prac", label: "% Thực hành", val: wPrac, set: (v: string) => { setPresetId("custom"); setWPrac(v); } },
              { id: "w-fin", label: "% Cuối kỳ", val: wFinal, set: (v: string) => { setPresetId("custom"); setWFinal(v); } },
            ].map((w) => (
              <div key={w.id} className="rounded-xl bg-foreground/[0.04] p-3 dark:bg-foreground/[0.06]">
                <label htmlFor={w.id} className="block text-[11px] font-semibold text-muted-foreground">
                  {w.label}
                </label>
                <input
                  id={w.id}
                  type="number"
                  min={0}
                  max={100}
                  value={w.val}
                  onChange={(e) => w.set(e.target.value)}
                  className="mt-1 min-h-11 w-full rounded-lg border border-border/70 bg-background px-2.5 text-center font-heading text-base font-bold text-foreground outline-none focus:border-primary"
                />
              </div>
            ))}
          </div>

          {Math.abs(result.totalWeight - 100) > 0.01 && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs font-medium text-amber-700 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>
                Tổng tỷ trọng hiện tại là <strong>{result.totalWeight}%</strong> (cần đúng{" "}
                <strong>100%</strong> để tính chính xác).
              </span>
            </div>
          )}

          {/* Component Score Inputs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { id: "s-att", label: `Điểm Chuyên cần (${result.wa}%)`, val: sAtt, set: setSAtt, disabled: result.wa === 0 },
              { id: "s-mid", label: `Điểm Giữa kỳ (${result.wm}%)`, val: sMid, set: setSMid, disabled: result.wm === 0 },
              { id: "s-prac", label: `Điểm Thực hành / Bài tập (${result.wp}%)`, val: sPrac, set: setSPrac, disabled: result.wp === 0 },
              { id: "s-hurdle", label: "Điểm liệt tối thiểu bài thi Cuối kỳ", val: minFinalHurdle, set: setMinFinalHurdle, disabled: false },
            ].map((item) => (
              <div
                key={item.id}
                className={cn(
                  "rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]",
                  item.disabled && "opacity-50",
                )}
              >
                <label htmlFor={item.id} className="block text-xs font-bold text-foreground">
                  {item.label}
                </label>
                <input
                  id={item.id}
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  disabled={item.disabled}
                  value={item.val}
                  onChange={(e) => item.set(e.target.value)}
                  className="mt-1.5 min-h-11 w-full rounded-xl border border-border/70 bg-background px-3 font-heading text-base font-bold text-foreground outline-none focus:border-primary"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Pass & Final Simulator */}
        <div className="flex flex-col justify-between space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <Badge className="bg-primary/15 text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Giả lập điểm tổng kết</span>
              </Badge>
              <span className="text-xs font-semibold text-muted-foreground">
                Quá trình: {result.processWeightedSum.toFixed(2)}đ
              </span>
            </div>

            <div className="rounded-2xl bg-foreground/[0.04] p-5 text-center dark:bg-foreground/[0.06]">
              <label htmlFor="sim-final" className="text-xs font-semibold text-muted-foreground">
                Nếu điểm thi Cuối kỳ ({result.wf}%) của bạn là:
              </label>
              <div className="mt-2 flex items-center justify-center gap-3">
                <input
                  id="sim-final"
                  type="number"
                  min={0}
                  max={10}
                  step={0.25}
                  value={sFinalSim}
                  onChange={(e) => setSFinalSim(e.target.value)}
                  className="min-h-11 w-24 rounded-xl border border-border/70 bg-background text-center font-heading text-xl font-bold text-foreground outline-none focus:border-primary"
                />
                <span className="text-sm font-bold text-muted-foreground">→ Tổng:</span>
                <span className="font-heading text-3xl font-extrabold text-primary">
                  {result.simulatedTotal.toFixed(2)}
                </span>
              </div>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-background/80 px-3.5 py-1.5 text-xs font-bold">
                {result.passedSim ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                )}
                <span className={result.passedSim ? "text-primary" : "text-destructive"}>
                  {result.hurdleFailed
                    ? `Rớt do điểm Cuối kỳ < điểm liệt (${result.hurdle})`
                    : `${classifyCourseGrade(result.simulatedTotal)}`}
                </span>
              </div>
            </div>

            {/* Required Final Score Table */}
            <div className="space-y-2">
              <h3 className="font-heading text-sm font-bold text-foreground">
                Điểm thi Cuối kỳ tối thiểu cần đạt theo mục tiêu
              </h3>
              <div className="divide-y divide-border/50 rounded-xl border border-border/60 bg-background/60">
                {result.targetRows.map((row) => (
                  <div
                    key={row.letter}
                    className="flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm"
                  >
                    <span className="font-semibold text-foreground">
                      {row.letter} (≥ {row.minScore.toFixed(1)})
                    </span>
                    {row.impossible ? (
                      <span className="font-bold text-destructive">Không thể (&gt; 10)</span>
                    ) : (
                      <span className="font-heading font-bold text-primary">
                        ≥ {row.neededFinal?.toFixed(2)} đ
                        {row.hurdleApplied && (
                          <span className="ml-1 text-[10px] text-muted-foreground">(điểm liệt)</span>
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-heading font-bold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Đã sao chép kết quả!" : "Sao chép kế hoạch điểm cuối kỳ"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
