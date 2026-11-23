"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Calculator,
  Check,
  Copy,
  Sigma,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type TabId = "combinatorics" | "statistics";

const BIGINT_ZERO = BigInt(0);
const BIGINT_ONE = BigInt(1);

function factorialBigInt(n: number): bigint {
  let res = BIGINT_ONE;
  for (let i = 2; i <= n; i++) {
    res *= BigInt(i);
  }
  return res;
}

function permutationBigInt(n: number, k: number): bigint {
  if (k < 0 || k > n) return BIGINT_ZERO;
  let res = BIGINT_ONE;
  for (let i = n - k + 1; i <= n; i++) {
    res *= BigInt(i);
  }
  return res;
}

function combinationBigInt(n: number, k: number): bigint {
  if (k < 0 || k > n) return BIGINT_ZERO;
  const kk = Math.min(k, n - k);
  let num = BIGINT_ONE;
  let den = BIGINT_ONE;
  for (let i = 1; i <= kk; i++) {
    num *= BigInt(n - kk + i);
    den *= BigInt(i);
  }
  return num / den;
}

function formatBigIntDisplay(val: bigint): string {
  const s = val.toString();
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatBigIntApprox(val: bigint): string | null {
  const s = val.toString();
  if (s.length <= 15) return null;
  const lead = `${s[0]}.${s.slice(1, 6)}`;
  return `≈ ${lead} × 10^${s.length - 1} (${s.length} chữ số)`;
}

function buildNewtonExpansion(n: number): string {
  if (n === 0) return "1";
  const terms: string[] = [];
  for (let k = 0; k <= n; k++) {
    const coeff = combinationBigInt(n, k);
    const powA = n - k;
    const powB = k;
    const cStr = coeff === BIGINT_ONE && (powA > 0 || powB > 0) ? "" : coeff.toString();
    const aStr = powA === 0 ? "" : powA === 1 ? "a" : `a^${powA}`;
    const bStr = powB === 0 ? "" : powB === 1 ? "b" : `b^${powB}`;
    terms.push(`${cStr}${aStr}${bStr}` || "1");
  }
  return terms.join(" + ");
}

function medianOfSorted(arr: number[]): number {
  const m = arr.length;
  if (m === 0) return Number.NaN;
  const mid = Math.floor(m / 2);
  if (m % 2 === 1) return arr[mid];
  return (arr[mid - 1] + arr[mid]) / 2;
}

function fmtNum(val: number, digits = 4): string {
  if (!Number.isFinite(val)) return "—";
  const rounded = Number(val.toFixed(digits));
  return rounded.toString();
}

const SAMPLE_DATASETS: Array<{ label: string; data: string }> = [
  {
    label: "Điểm Toán 12A1 (11 HS)",
    data: "6.5, 7, 7.5, 7.5, 8, 8, 8.5, 8.5, 9, 9.5, 10",
  },
  {
    label: "Mẫu có Ngoại lệ (Outlier)",
    data: "12, 14, 15, 16, 16, 17, 18, 19, 20, 42",
  },
  {
    label: "Mẫu chẵn phần tử (10 số)",
    data: "10 12 15 15 18 20 22 24 25 30",
  },
];

function computeStats(rawData: string) {
  const tokens = rawData
    .trim()
    .split(/[\s,;|\n\t]+/)
    .filter(Boolean);

  if (tokens.length === 0) {
    return { error: "Hãy nhập ít nhất 1 giá trị số." as string | null };
  }

  const parsed: number[] = [];
  for (const token of tokens) {
    const val = Number(token);
    if (!Number.isFinite(val)) {
      return { error: `Giá trị "${token}" không phải là số hợp lệ.` as string | null };
    }
    parsed.push(val);
  }

  const n = parsed.length;
  const sorted = [...parsed].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;

  const freqMap = new Map<number, number>();
  let maxFreq = 0;
  for (const v of sorted) {
    const f = (freqMap.get(v) ?? 0) + 1;
    freqMap.set(v, f);
    if (f > maxFreq) maxFreq = f;
  }
  const modes =
    maxFreq <= 1
      ? []
      : Array.from(freqMap.entries())
          .filter(([, f]) => f === maxFreq)
          .map(([v]) => v);

  const q2 = medianOfSorted(sorted);
  let q1 = sorted[0];
  let q3 = sorted[n - 1];
  if (n >= 2) {
    const halfLen = Math.floor(n / 2);
    const lowerHalf = sorted.slice(0, halfLen);
    const upperHalf = sorted.slice(n % 2 === 1 ? halfLen + 1 : halfLen);
    q1 = medianOfSorted(lowerHalf);
    q3 = medianOfSorted(upperHalf);
  }
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;
  const outliers = sorted.filter((x) => x < lowerFence || x > upperFence);

  const sqDiffSum = sorted.reduce((acc, x) => acc + (x - mean) ** 2, 0);
  const variancePop = sqDiffSum / n;
  const stdPop = Math.sqrt(variancePop);
  const varianceSample = n > 1 ? sqDiffSum / (n - 1) : Number.NaN;
  const stdSample = n > 1 ? Math.sqrt(varianceSample) : Number.NaN;

  return {
    error: null as string | null,
    n,
    sorted,
    min,
    max,
    range,
    sum,
    mean,
    q1,
    q2,
    q3,
    iqr,
    lowerFence,
    upperFence,
    outliers,
    modes,
    maxFreq,
    variancePop,
    stdPop,
    varianceSample,
    stdSample,
  };
}

export function CombinatoricsStatsTool() {
  const [activeTab, setActiveTab] = useState<TabId>("combinatorics");

  // Combinatorics State
  const [nInput, setNInput] = useState<string>("10");
  const [kInput, setKInput] = useState<string>("3");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Statistics State
  const [rawData, setRawData] = useState<string>(SAMPLE_DATASETS[0].data);

  const combCalc = useMemo(() => {
    const n = Number.parseInt(nInput.trim(), 10);
    const k = Number.parseInt(kInput.trim(), 10);
    if (!Number.isInteger(n) || !Number.isInteger(k)) {
      return { error: "Vui lòng nhập n và k là số nguyên không âm." };
    }
    if (n < 0 || n > 200) {
      return { error: "Giá trị n hỗ trợ từ 0 đến 200." };
    }
    if (k < 0 || k > n) {
      return { error: "Điều kiện hợp lệ là 0 ≤ k ≤ n." };
    }

    const pn = factorialBigInt(n);
    const ank = permutationBigInt(n, k);
    const cnk = combinationBigInt(n, k);
    const expansion = n <= 10 ? buildNewtonExpansion(n) : null;

    return {
      error: null,
      n,
      k,
      pn,
      ank,
      cnk,
      expansion,
    };
  }, [nInput, kInput]);

  const statsCalc = useMemo(() => computeStats(rawData), [rawData]);

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((c) => (c === key ? null : c)), 1600);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("combinatorics")}
          className={cn(
            "flex-1 min-w-[200px] min-h-11 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer",
            activeTab === "combinatorics"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
          )}
        >
          <Calculator className="h-4 w-4" />
          <span>Tổ hợp, Chỉnh hợp & Nhị thức Newton</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("statistics")}
          className={cn(
            "flex-1 min-w-[200px] min-h-11 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer",
            activeTab === "statistics"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
          )}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Thống kê Tứ phân vị & Độ lệch chuẩn</span>
        </button>
      </div>

      {/* TAB 1: COMBINATORICS */}
      {activeTab === "combinatorics" && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                  Tính chính xác với số lớn (BigInt)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Hỗ trợ n từ 0 đến 200 không bị tràn số hay sai số dấu phẩy động
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "n=5, k=2", n: "5", k: "2" },
                  { label: "n=10, k=3", n: "10", k: "3" },
                  { label: "n=52, k=5 (Bộ bài)", n: "52", k: "5" },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setNInput(preset.n);
                      setKInput(preset.k);
                    }}
                    className="rounded-lg border border-border/70 bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground hover:border-primary/60 cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="comb-n"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Tổng số phần tử (n ∈ [0..200])
                </label>
                <input
                  id="comb-n"
                  type="number"
                  min={0}
                  max={200}
                  value={nInput}
                  onChange={(e) => setNInput(e.target.value)}
                  className="w-full min-h-12 rounded-xl border border-border bg-background px-4 font-mono text-lg font-bold text-foreground outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="comb-k"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Số phần tử chọn (0 ≤ k ≤ n)
                </label>
                <input
                  id="comb-k"
                  type="number"
                  min={0}
                  max={200}
                  value={kInput}
                  onChange={(e) => setKInput(e.target.value)}
                  className="w-full min-h-12 rounded-xl border border-border bg-background px-4 font-mono text-lg font-bold text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            {combCalc.error && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{combCalc.error}</span>
              </div>
            )}
          </div>

          {!combCalc.error && (
            <>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {[
                  {
                    key: "pn",
                    title: `Hoán vị P(${combCalc.n})`,
                    formula: `${combCalc.n}! = 1 × 2 × ... × ${combCalc.n}`,
                    meaning: `Số cách sắp xếp thứ tự ${combCalc.n} phần tử khác nhau`,
                    val: combCalc.pn!,
                  },
                  {
                    key: "ank",
                    title: `Chỉnh hợp A(${combCalc.n}, ${combCalc.k})`,
                    formula: `${combCalc.n}! / (${combCalc.n} − ${combCalc.k})! = ${combCalc.n}! / ${combCalc.n! - combCalc.k!}!`,
                    meaning: `Chọn ${combCalc.k} phần tử từ ${combCalc.n} phần tử CÓ kể thứ tự`,
                    val: combCalc.ank!,
                  },
                  {
                    key: "cnk",
                    title: `Tổ hợp C(${combCalc.n}, ${combCalc.k})`,
                    formula: `${combCalc.n}! / (${combCalc.k}! × ${combCalc.n! - combCalc.k!}!)`,
                    meaning: `Chọn ${combCalc.k} phần tử từ ${combCalc.n} phần tử KHÔNG kể thứ tự`,
                    val: combCalc.cnk!,
                  },
                ].map((item) => {
                  const rawStr = item.val.toString();
                  const approx = formatBigIntApprox(item.val);
                  return (
                    <div
                      key={item.key}
                      className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <Badge className="bg-primary/15 text-primary">
                            {item.title}
                          </Badge>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.key, rawStr)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-background/70 text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Sao chép kết quả chính xác"
                          >
                            {copiedKey === item.key ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="font-mono text-xs text-muted-foreground">
                          {item.formula}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="font-mono text-xl font-bold text-foreground break-all">
                          {formatBigIntDisplay(item.val)}
                        </div>
                        {approx && (
                          <p className="font-mono text-xs text-primary">{approx}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{item.meaning}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Newton Binomial Card */}
              <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sigma className="h-5 w-5 text-primary" />
                    <h3 className="font-heading text-base font-bold text-foreground sm:text-lg">
                      Hệ số & Khai triển Nhị thức Newton (a + b)^{combCalc.n}
                    </h3>
                  </div>
                  <Badge>Số hạng thứ k+1 (k = {combCalc.k})</Badge>
                </div>

                <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 font-mono text-sm text-foreground">
                  T_{combCalc.k! + 1} = C({combCalc.n}, {combCalc.k}) · a^{combCalc.n! - combCalc.k!} · b^{combCalc.k} ={" "}
                  <strong className="text-primary">
                    {formatBigIntDisplay(combCalc.cnk!)}
                  </strong>
                  {combCalc.n! - combCalc.k! > 0 ? `·a^${combCalc.n! - combCalc.k!}` : ""}
                  {combCalc.k! > 0 ? `·b^${combCalc.k}` : ""}
                </div>

                {combCalc.expansion ? (
                  <div className="rounded-xl border border-border/60 bg-background/70 p-4 font-mono text-xs leading-relaxed text-muted-foreground break-words">
                    <span className="font-semibold text-foreground">
                      (a + b)^{combCalc.n} ={" "}
                    </span>
                    {combCalc.expansion}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Khai triển đầy đủ hiển thị trực tiếp cho n ≤ 10 (hiện đang tính chính xác hệ số T_{combCalc.k! + 1} cho n = {combCalc.n}).
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: STATISTICS */}
      {activeTab === "statistics" && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                  Nhập dãy số liệu mẫu (Toán 10, 11, 12 GDPT 2018)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Ngăn cách các số bằng dấu phẩy, khoảng trắng hoặc xuống dòng (dùng dấu chấm cho số thập phân, ví dụ 7.5)
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_DATASETS.map((ds) => (
                  <button
                    key={ds.label}
                    type="button"
                    onClick={() => setRawData(ds.data)}
                    className="rounded-lg border border-border/70 bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground hover:border-primary/60 cursor-pointer"
                  >
                    {ds.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              value={rawData}
              onChange={(e) => setRawData(e.target.value)}
              placeholder="Ví dụ: 6.5, 7, 7.5, 8, 8, 9, 10"
              className="w-full rounded-xl border border-border bg-background p-4 font-mono text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            {statsCalc.error && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{statsCalc.error}</span>
              </div>
            )}
          </div>

          {!statsCalc.error && (
            <>
              {/* Sorted Sequence & Copy */}
              <div className="rounded-2xl border border-border/70 bg-card/85 p-4 sm:p-5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Dãy sắp xếp tăng dần (n = {statsCalc.n})
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        "stats-summary",
                        `n=${statsCalc.n}; x̄=${fmtNum(statsCalc.mean!)}; Q1=${fmtNum(statsCalc.q1!)}; Q2=${fmtNum(statsCalc.q2!)}; Q3=${fmtNum(statsCalc.q3!)}; ΔQ=${fmtNum(statsCalc.iqr!)}; R=${fmtNum(statsCalc.range!)}; s²=${fmtNum(statsCalc.variancePop!)}; s=${fmtNum(statsCalc.stdPop!)}`
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-background/70 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/60 cursor-pointer"
                  >
                    {copiedKey === "stats-summary" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>Sao chép bảng kết quả</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {statsCalc.sorted!.map((val, idx) => {
                    const isOutlier =
                      val < statsCalc.lowerFence! || val > statsCalc.upperFence!;
                    return (
                      <span
                        key={`${idx}-${val}`}
                        className={cn(
                          "rounded-lg px-2.5 py-1 font-mono text-xs font-semibold border",
                          isOutlier
                            ? "border-amber-500/50 bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            : "border-border/60 bg-background/70 text-foreground"
                        )}
                      >
                        {val}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {[
                  { label: "Số trung bình (x̄)", val: fmtNum(statsCalc.mean!), sub: `Tổng = ${fmtNum(statsCalc.sum!)}` },
                  { label: "Trung vị (Me = Q₂)", val: fmtNum(statsCalc.q2!), sub: "Phân vị thứ 50%" },
                  { label: "Tứ phân vị Q₁", val: fmtNum(statsCalc.q1!), sub: "Trung vị nửa dưới" },
                  { label: "Tứ phân vị Q₃", val: fmtNum(statsCalc.q3!), sub: "Trung vị nửa trên" },
                  { label: "Khoảng tứ phân vị (ΔQ)", val: fmtNum(statsCalc.iqr!), sub: "ΔQ = Q₃ − Q₁" },
                  { label: "Khoảng biến thiên (R)", val: fmtNum(statsCalc.range!), sub: `${statsCalc.min} → ${statsCalc.max}` },
                  {
                    label: "Phương sai (s²)",
                    val: fmtNum(statsCalc.variancePop!),
                    sub:
                      statsCalc.n! > 1
                        ? `Hiệu chỉnh (n−1): ${fmtNum(statsCalc.varianceSample!)}`
                        : "Cỡ mẫu n = 1",
                  },
                  {
                    label: "Độ lệch chuẩn (s)",
                    val: fmtNum(statsCalc.stdPop!),
                    sub:
                      statsCalc.n! > 1
                        ? `Hiệu chỉnh (n−1): ${fmtNum(statsCalc.stdSample!)}`
                        : "Cỡ mẫu n = 1",
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="rounded-2xl border border-border/70 bg-card/85 p-4 space-y-1"
                  >
                    <p className="text-xs font-medium text-muted-foreground">
                      {m.label}
                    </p>
                    <p className="font-mono text-xl font-bold text-foreground">
                      {m.val}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{m.sub}</p>
                  </div>
                ))}
              </div>

              {/* Mode & Outliers Box */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-2">
                  <h3 className="font-heading text-sm font-bold text-foreground">
                    Mốt của mẫu số liệu (Mo)
                  </h3>
                  <p className="font-mono text-base font-bold text-primary">
                    {statsCalc.modes!.length > 0
                      ? `${statsCalc.modes!.join(", ")} (tần số = ${statsCalc.maxFreq})`
                      : "Không có mốt (các giá trị xuất hiện 1 lần)"}
                  </p>
                </div>

                <div
                  className={cn(
                    "rounded-2xl border p-5 space-y-2",
                    statsCalc.outliers!.length > 0
                      ? "border-amber-500/40 bg-amber-500/10"
                      : "border-border/70 bg-card/85"
                  )}
                >
                  <h3 className="font-heading text-sm font-bold text-foreground">
                    Giá trị ngoại lệ (Outliers)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Ngưỡng hợp lệ [Q₁ − 1,5·ΔQ ; Q₃ + 1,5·ΔQ] = [
                    {fmtNum(statsCalc.lowerFence!)} ; {fmtNum(statsCalc.upperFence!)}]
                  </p>
                  <p className="font-mono text-base font-bold text-foreground">
                    {statsCalc.outliers!.length > 0
                      ? `Phát hiện ${statsCalc.outliers!.length} giá trị ngoại lệ: ${statsCalc.outliers!.join(", ")}`
                      : "Không có giá trị ngoại lệ"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
