"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Plus,
  RotateCcw,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

function clamp10(v: string): number {
  const n = parseFloat(v.replace(",", "."));
  if (Number.isNaN(n)) return 0;
  return Math.min(10, Math.max(0, n));
}

function roundTt22(val: number): number {
  return Math.round((val + Number.EPSILON) * 10) / 10;
}

function getTierBadge(score: number) {
  if (score >= 8.0) return { label: "Mức Tốt (≥ 8.0)", cls: "bg-primary/15 text-primary" };
  if (score >= 6.5) return { label: "Mức Khá (≥ 6.5)", cls: "bg-primary/15 text-primary" };
  if (score >= 5.0) return { label: "Mức Đạt (≥ 5.0)", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400" };
  return { label: "Chưa đạt (< 5.0)", cls: "bg-destructive/15 text-destructive" };
}

export function Tt22AverageCalculator() {
  const [txScores, setTxScores] = useState<string[]>(["8.5", "8.0", "9.0"]);
  const [gkScore, setGkScore] = useState<string>("8.0");
  const [ckScore, setCkScore] = useState<string>("8.5");

  // Full year calculator
  const [useCurrentAsHk2, setUseCurrentAsHk2] = useState<boolean>(true);
  const [hk1Manual, setHk1Manual] = useState<string>("7.8");
  const [hk2Manual, setHk2Manual] = useState<string>("8.3");

  // Reverse final exam target
  const [targetAvg, setTargetAvg] = useState<string>("8.0");
  const [copied, setCopied] = useState(false);

  const semStats = useMemo(() => {
    const validTx = txScores.map(clamp10);
    const n = validTx.length;
    const sumTx = validTx.reduce((acc, s) => acc + s, 0);
    const gk = clamp10(gkScore);
    const ck = clamp10(ckScore);
    const divisor = n + 5; // n*1 + 1*2 + 1*3

    const rawAvg = (sumTx + 2 * gk + 3 * ck) / divisor;
    const roundedAvg = roundTt22(rawAvg);

    const target = clamp10(targetAvg);
    const neededExact = (target * divisor - sumTx - 2 * gk) / 3;
    const minToRound = Math.max(0, target - 0.05);
    const neededRounded = (minToRound * divisor - sumTx - 2 * gk) / 3;

    return {
      n,
      sumTx,
      gk,
      ck,
      divisor,
      rawAvg,
      roundedAvg,
      tier: getTierBadge(roundedAvg),
      target,
      neededExact,
      neededRounded,
    };
  }, [txScores, gkScore, ckScore, targetAvg]);

  const yearStats = useMemo(() => {
    const hk1 = clamp10(hk1Manual);
    const hk2 = useCurrentAsHk2 ? semStats.roundedAvg : clamp10(hk2Manual);
    const rawYear = (hk1 + 2 * hk2) / 3;
    const roundedYear = roundTt22(rawYear);
    return {
      hk1,
      hk2,
      rawYear,
      roundedYear,
      tier: getTierBadge(roundedYear),
    };
  }, [hk1Manual, hk2Manual, useCurrentAsHk2, semStats.roundedAvg]);

  const addTx = () => {
    if (txScores.length >= 6) return;
    setTxScores((prev) => [...prev, "8.0"]);
  };

  const removeTx = (idx: number) => {
    if (txScores.length <= 1) return;
    setTxScores((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateTx = (idx: number, value: string) => {
    setTxScores((prev) => prev.map((v, i) => (i === idx ? value : v)));
  };

  const loadSample = () => {
    setTxScores(["8.0", "8.5", "9.0", "7.5"]);
    setGkScore("8.0");
    setCkScore("8.5");
    setHk1Manual("7.8");
    setUseCurrentAsHk2(true);
    setTargetAvg("8.0");
  };

  const resetAll = () => {
    setTxScores(["0", "0", "0"]);
    setGkScore("0");
    setCkScore("0");
    setHk1Manual("0");
    setHk2Manual("0");
  };

  const handleCopy = async () => {
    const text = [
      `📊 KẾT QUẢ TÍNH ĐIỂM TRUNG BÌNH MÔN (THÔNG TƯ 22)`,
      `• Điểm TX (${semStats.n} cột): ${txScores.map(clamp10).join(" | ")}`,
      `• Giữa kỳ (×2): ${semStats.gk} | Cuối kỳ (×3): ${semStats.ck}`,
      `=> ĐTB Học kỳ: ${semStats.roundedAvg.toFixed(1)} (${semStats.tier.label})`,
      `=> ĐTB Cả năm (HK1: ${yearStats.hk1.toFixed(1)}, HK2: ${yearStats.hk2.toFixed(1)}): ${yearStats.roundedYear.toFixed(1)}`,
      `Tính tại: https://www.quizken.com/cong-cu/tinh-diem-trung-binh-mon-thong-tu-22`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Inputs */}
        <div className="space-y-6 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              1. Nhập đầu điểm học kỳ (Thông tư 22)
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadSample}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Ví dụ mẫu</span>
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Đặt lại</span>
              </button>
            </div>
          </div>

          {/* TX Scores */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-foreground sm:text-sm">
                Điểm đánh giá thường xuyên — ĐĐGtx (Hệ số 1)
              </span>
              <button
                type="button"
                onClick={addTx}
                disabled={txScores.length >= 6}
                className="inline-flex min-h-10 items-center gap-1 rounded-xl bg-primary/15 px-3 text-xs font-semibold text-primary hover:bg-primary/20 disabled:opacity-40 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Thêm cột TX ({txScores.length}/6)</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {txScores.map((val, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className="flex-1 space-y-1">
                    <span className="block text-[11px] font-medium text-muted-foreground">
                      TX {idx + 1}
                    </span>
                    <input
                      type="number"
                      aria-label={`Điểm thường xuyên ${idx + 1}`}
                      inputMode="decimal"
                      min={0}
                      max={10}
                      step={0.1}
                      value={val}
                      onChange={(e) => updateTx(idx, e.target.value)}
                      className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  {txScores.length > 1 && (
                    <button
                      type="button"
                      aria-label={`Xóa cột TX ${idx + 1}`}
                      onClick={() => removeTx(idx)}
                      className="mt-5 inline-flex h-11 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/15 hover:text-destructive cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <hr className="border-border/60" />

          {/* GK & CK */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="block text-xs font-semibold text-foreground sm:text-sm">
                Điểm Giữa kỳ — ĐĐGgk (Hệ số 2)
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={10}
                step={0.1}
                value={gkScore}
                onChange={(e) => setGkScore(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="space-y-1.5">
              <span className="block text-xs font-semibold text-foreground sm:text-sm">
                Điểm Cuối kỳ — ĐĐGck (Hệ số 3)
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={10}
                step={0.1}
                value={ckScore}
                onChange={(e) => setCkScore(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>

          <hr className="border-border/60" />

          {/* Full Year */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-heading text-lg font-bold text-foreground">
                2. Tính ĐTB Môn Cả năm (HK1 + 2×HK2) / 3
              </h2>
              <label className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCurrentAsHk2}
                  onChange={(e) => setUseCurrentAsHk2(e.target.checked)}
                  className="h-4 w-4 accent-emerald-500"
                />
                <span>Lấy điểm trên làm HK2</span>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="block text-xs font-semibold text-foreground">
                  ĐTB Học kỳ 1 (Hệ số 1)
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={10}
                  step={0.1}
                  value={hk1Manual}
                  onChange={(e) => setHk1Manual(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>

              <label className="space-y-1.5">
                <span className="block text-xs font-semibold text-foreground">
                  ĐTB Học kỳ 2 (Hệ số 2)
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={10}
                  step={0.1}
                  disabled={useCurrentAsHk2}
                  value={useCurrentAsHk2 ? semStats.roundedAvg.toFixed(1) : hk2Manual}
                  onChange={(e) => setHk2Manual(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Result Summary */}
        <div className="space-y-5 lg:col-span-5">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Kết quả Thông tư 22
              </span>
              <Badge className={semStats.tier.cls}>{semStats.tier.label}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-foreground/[0.04] p-4 text-center dark:bg-foreground/[0.06]">
                <div className="text-xs font-semibold text-muted-foreground">
                  ĐTB Học kỳ
                </div>
                <div className="mt-1 font-heading text-4xl font-bold text-foreground sm:text-5xl">
                  {semStats.roundedAvg.toFixed(1)}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  Chính xác: {semStats.rawAvg.toFixed(2)}
                </div>
              </div>

              <div className="rounded-2xl bg-foreground/[0.04] p-4 text-center dark:bg-foreground/[0.06]">
                <div className="text-xs font-semibold text-muted-foreground">
                  ĐTB Cả năm
                </div>
                <div className="mt-1 font-heading text-4xl font-bold text-primary sm:text-5xl">
                  {yearStats.roundedYear.toFixed(1)}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {yearStats.tier.label}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 p-3.5 text-xs leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Công thức học kỳ:</strong>{" "}
              ({semStats.sumTx.toFixed(1)} + 2×{semStats.gk} + 3×{semStats.ck}) / ({semStats.n} + 5) ={" "}
              <strong className="text-foreground">{semStats.rawAvg.toFixed(2)}</strong> →{" "}
              <strong className="text-primary">{semStats.roundedAvg.toFixed(1)}</strong>
            </div>

            {/* Reverse Calculator */}
            <div className="rounded-2xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06] space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="font-heading text-sm font-bold text-foreground">
                  Cần mấy điểm Cuối kỳ để đạt mục tiêu?
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: "Đạt (5.0)", val: "5.0" },
                  { label: "Khá (6.5)", val: "6.5" },
                  { label: "Tốt (8.0)", val: "8.0" },
                  { label: "8.5", val: "8.5" },
                  { label: "9.0", val: "9.0" },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setTargetAvg(preset.val)}
                    className={cn(
                      "min-h-9 rounded-lg px-2.5 text-xs font-semibold transition-colors cursor-pointer",
                      targetAvg === preset.val
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
                <input
                  type="number"
                  aria-label="Nhập ĐTB mục tiêu tùy chỉnh"
                  inputMode="decimal"
                  min={0}
                  max={10}
                  step={0.1}
                  value={targetAvg}
                  onChange={(e) => setTargetAvg(e.target.value)}
                  className="h-9 w-20 rounded-lg border border-border bg-background px-2 text-center text-xs font-bold text-foreground"
                />
              </div>

              <div className="text-xs leading-relaxed text-foreground">
                {semStats.neededRounded <= 0 ? (
                  <span className="font-semibold text-primary">
                    Chúc mừng! Điểm TX và Giữa kỳ hiện tại đã chắc chắn đạt ĐTB ≥ {semStats.target.toFixed(1)} (ngay cả khi Cuối kỳ = 0).
                  </span>
                ) : semStats.neededRounded > 10 ? (
                  <span className="font-semibold text-destructive">
                    Không thể đạt {semStats.target.toFixed(1)} trong kỳ này (cần tối thiểu {semStats.neededRounded.toFixed(2)} &gt; 10.0 điểm Cuối kỳ).
                  </span>
                ) : (
                  <span>
                    Bạn cần đạt tối thiểu{" "}
                    <strong className="text-primary text-sm">
                      {semStats.neededRounded.toFixed(2)} điểm
                    </strong>{" "}
                    ở bài thi Cuối kỳ để làm tròn lên {semStats.target.toFixed(1)} (hoặc{" "}
                    <strong className="text-foreground">
                      {Math.min(10, semStats.neededExact).toFixed(2)} điểm
                    </strong>{" "}
                    để đạt tròn {semStats.target.toFixed(1)} trước làm tròn).
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-heading text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Đã sao chép bảng điểm!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Sao chép kết quả</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
