"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Calculator,
  Check,
  Copy,
  Percent,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Type,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const VI_DIGITS = [
  "không",
  "một",
  "hai",
  "ba",
  "bốn",
  "năm",
  "sáu",
  "bảy",
  "tám",
  "chín",
];

type LeVariant = "lẻ" | "linh";
type TuVariant = "tư" | "bốn";
type NumberMode = "currency" | "number";

function readThreeDigits(
  h: number,
  t: number,
  o: number,
  showZeroHundred: boolean,
  leWord: LeVariant,
  tuWord: TuVariant,
): string {
  if (h === 0 && t === 0 && o === 0) return "";
  const parts: string[] = [];

  if (h > 0 || showZeroHundred) {
    parts.push(`${VI_DIGITS[h]} trăm`);
  }

  if (t === 0) {
    if (o > 0 && (h > 0 || showZeroHundred)) {
      parts.push(leWord);
    }
  } else if (t === 1) {
    parts.push("mười");
  } else {
    parts.push(`${VI_DIGITS[t]} mươi`);
  }

  if (o > 0) {
    if (o === 1 && t >= 2) {
      parts.push("mốt");
    } else if (o === 4 && t >= 2) {
      parts.push(tuWord);
    } else if (o === 5 && t >= 1) {
      parts.push("lăm");
    } else {
      parts.push(VI_DIGITS[o]);
    }
  }

  return parts.join(" ");
}

function readIntegerVietnamese(
  rawDigits: string,
  leWord: LeVariant,
  tuWord: TuVariant,
): string {
  const cleaned = rawDigits.replace(/^0+/, "") || "0";
  if (cleaned === "0") return "không";

  // Split into 9-digit blocks from right to left so "tỷ" nests cleanly (nghìn tỷ, triệu tỷ)
  const blocks: string[] = [];
  for (let end = cleaned.length; end > 0; end -= 9) {
    const start = Math.max(0, end - 9);
    blocks.unshift(cleaned.slice(start, end));
  }

  const blockResults: string[] = [];
  let hasPrintedHigher = false;

  for (let bIdx = 0; bIdx < blocks.length; bIdx += 1) {
    const block = blocks[bIdx];
    const groups: string[] = [];
    for (let end = block.length; end > 0; end -= 3) {
      const start = Math.max(0, end - 3);
      groups.unshift(block.slice(start, end).padStart(3, "0"));
    }

    const groupNames = ["", "nghìn", "triệu"];
    const innerParts: string[] = [];

    for (let gIdx = 0; gIdx < groups.length; gIdx += 1) {
      const g = groups[gIdx];
      const h = Number(g[0]);
      const t = Number(g[1]);
      const o = Number(g[2]);
      if (h === 0 && t === 0 && o === 0) continue;

      const text = readThreeDigits(h, t, o, hasPrintedHigher, leWord, tuWord);
      const unitIndex = groups.length - 1 - gIdx;
      const unit = groupNames[unitIndex] ?? "";
      innerParts.push(unit ? `${text} ${unit}` : text);
      hasPrintedHigher = true;
    }

    if (innerParts.length > 0) {
      const billionPower = blocks.length - 1 - bIdx;
      const billionSuffix =
        billionPower > 0 ? ` ${Array(billionPower).fill("tỷ").join(" ")}` : "";
      blockResults.push(`${innerParts.join(" ")}${billionSuffix}`);
    }
  }

  return blockResults.join(" ");
}

function formatVietnameseNumberWords(
  rawInput: string,
  mode: NumberMode,
  leWord: LeVariant,
  tuWord: TuVariant,
): { valid: boolean; formattedDigits: string; words: string; error?: string } {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { valid: false, formattedDigits: "", words: "" };
  }

  const isNegative = trimmed.startsWith("-");
  const unsigned = trimmed.replace(/^[+-]/, "").replace(/\s+/g, "");

  // Normalize user input:
  // In VN, people often type 1.250.000 (dots as thousands) or 8,75 (comma as decimal) or 8.75.
  let integerPart = "";
  let decimalPart = "";

  if (mode === "currency") {
    const digitsOnly = unsigned.replace(/[.,_]/g, "");
    if (!/^\d+$/.test(digitsOnly)) {
      return {
        valid: false,
        formattedDigits: "",
        words: "",
        error: "Vui lòng chỉ nhập chữ số (ví dụ: 1250000 hoặc 1.250.000).",
      };
    }
    integerPart = digitsOnly;
  } else {
    // Number/score mode: support decimal with ',' or single '.' (when <=2 decimals or single separator not matching thousands grouping)
    const commaCount = (unsigned.match(/,/g) || []).length;
    const dotCount = (unsigned.match(/\./g) || []).length;

    if (commaCount > 1) {
      return {
        valid: false,
        formattedDigits: "",
        words: "",
        error: "Số thập phân chỉ được có một dấu phẩy (,).",
      };
    }

    if (commaCount === 1) {
      const [left, right] = unsigned.split(",");
      integerPart = left.replace(/\./g, "");
      decimalPart = right.replace(/\./g, "");
    } else if (dotCount === 1) {
      const [left, right] = unsigned.split(".");
      // If right has exactly 3 digits and left is non-empty (e.g. 1.250), check user intent:
      // Usually 1.250 in VN could be 1250 or 1.25; treat single dot with !=3 digits or leading 0 as decimal, and 3 digits as thousands unless left==="0".
      if (right.length === 3 && left !== "0" && left.length >= 1) {
        integerPart = `${left}${right}`;
      } else {
        integerPart = left;
        decimalPart = right;
      }
    } else {
      integerPart = unsigned.replace(/\./g, "");
    }

    if (!/^\d+$/.test(integerPart) || (decimalPart && !/^\d+$/.test(decimalPart))) {
      return {
        valid: false,
        formattedDigits: "",
        words: "",
        error: "Định dạng số chưa hợp lệ. Hãy nhập số tự nhiên hoặc số thập phân (vd: 8,75).",
      };
    }
  }

  if (integerPart.length > 24) {
    return {
      valid: false,
      formattedDigits: "",
      words: "",
      error: "Hỗ trợ tối đa 24 chữ số (đến hàng trăm nghìn tỷ tỷ).",
    };
  }

  const intClean = integerPart.replace(/^0+/, "") || "0";
  const formattedInt = intClean.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const formattedDigits =
    (isNegative && intClean !== "0" ? "-" : "") +
    formattedInt +
    (decimalPart ? `,${decimalPart}` : "");

  const intWords = readIntegerVietnamese(intClean, leWord, tuWord);
  let fullWords = intWords;

  if (mode === "number" && decimalPart) {
    const leadingZeros = decimalPart.match(/^0+/)?.[0].length ?? 0;
    const decTrimmed = decimalPart.replace(/^0+/, "");
    let decWords = "";
    if (!decTrimmed) {
      decWords = Array(decimalPart.length).fill("không").join(" ");
    } else if (leadingZeros > 0 || decimalPart.length > 3) {
      decWords = decimalPart
        .split("")
        .map((d) => VI_DIGITS[Number(d)])
        .join(" ");
    } else {
      decWords = readIntegerVietnamese(decTrimmed, leWord, tuWord);
    }
    fullWords = `${intWords} phẩy ${decWords}`;
  }

  if (isNegative && (intClean !== "0" || decimalPart)) {
    fullWords = `âm ${fullWords}`;
  }

  if (mode === "currency") {
    fullWords = `${fullWords} đồng`;
  }

  const capitalized = fullWords.charAt(0).toUpperCase() + fullWords.slice(1);
  return { valid: true, formattedDigits, words: capitalized };
}

function formatNum(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "—";
  return Number(value.toFixed(digits)).toLocaleString("vi-VN", {
    maximumFractionDigits: digits,
  });
}

export function PercentageNumberWordsTool() {
  // Calculator 1: A is what % of B
  const [valA, setValA] = useState<string>("34");
  const [valB, setValB] = useState<string>("40");

  // Calculator 2: % change from old to new
  const [oldVal, setOldVal] = useState<string>("7.5");
  const [newVal, setNewVal] = useState<string>("8.75");

  // Calculator 3: Value after +/- X%
  const [baseVal, setBaseVal] = useState<string>("250000");
  const [deltaPct, setDeltaPct] = useState<string>("15");
  const [deltaOp, setDeltaOp] = useState<"inc" | "dec">("dec");

  // Calculator 4: Class grading distribution
  const [countTot, setCountTot] = useState<string>("16");
  const [countKha, setCountKha] = useState<string>("18");
  const [countDat, setCountDat] = useState<string>("6");
  const [countChuaDat, setCountChuaDat] = useState<string>("2");

  // Section 2: Number to Vietnamese words
  const [numInput, setNumInput] = useState<string>("1250000");
  const [numMode, setNumMode] = useState<NumberMode>("currency");
  const [leWord, setLeWord] = useState<LeVariant>("lẻ");
  const [tuWord, setTuWord] = useState<TuVariant>("tư");
  const [copiedWords, setCopiedWords] = useState<boolean>(false);

  // Calc 1 result
  const pctOfB = useMemo(() => {
    const a = Number(valA);
    const b = Number(valB);
    if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return null;
    return (a / b) * 100;
  }, [valA, valB]);

  // Calc 2 result
  const pctChange = useMemo(() => {
    const prev = Number(oldVal);
    const next = Number(newVal);
    if (!Number.isFinite(prev) || !Number.isFinite(next) || prev === 0) return null;
    const diff = next - prev;
    const rate = (diff / Math.abs(prev)) * 100;
    return { diff, rate };
  }, [oldVal, newVal]);

  // Calc 3 result
  const adjustedResult = useMemo(() => {
    const base = Number(baseVal);
    const pct = Number(deltaPct);
    if (!Number.isFinite(base) || !Number.isFinite(pct)) return null;
    const delta = (base * pct) / 100;
    const finalVal = deltaOp === "inc" ? base + delta : base - delta;
    return { delta, finalVal };
  }, [baseVal, deltaPct, deltaOp]);

  // Calc 4: Class stats
  const classStats = useMemo(() => {
    const rows = [
      {
        key: "tot",
        label: "Tốt",
        count: Math.max(0, Math.floor(Number(countTot) || 0)),
        barColor: "bg-emerald-500",
        badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
      },
      {
        key: "kha",
        label: "Khá",
        count: Math.max(0, Math.floor(Number(countKha) || 0)),
        barColor: "bg-sky-500",
        badgeClass: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
      },
      {
        key: "dat",
        label: "Đạt",
        count: Math.max(0, Math.floor(Number(countDat) || 0)),
        barColor: "bg-amber-500",
        badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
      },
      {
        key: "chuadat",
        label: "Chưa đạt",
        count: Math.max(0, Math.floor(Number(countChuaDat) || 0)),
        barColor: "bg-rose-500",
        badgeClass: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
      },
    ];
    const total = rows.reduce((sum, r) => sum + r.count, 0);
    return {
      total,
      rows: rows.map((r) => ({
        ...r,
        pct: total > 0 ? (r.count / total) * 100 : 0,
      })),
    };
  }, [countTot, countKha, countDat, countChuaDat]);

  const wordsResult = useMemo(
    () => formatVietnameseNumberWords(numInput, numMode, leWord, tuWord),
    [numInput, numMode, leWord, tuWord],
  );

  const handleCopyWords = async () => {
    if (!wordsResult.valid || !wordsResult.words) return;
    try {
      await navigator.clipboard.writeText(wordsResult.words);
      setCopiedWords(true);
      setTimeout(() => setCopiedWords(false), 1800);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="space-y-8">
      {/* Section 1: 4 Percentage Calculators */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
              1. Bộ 4 công cụ tính phần trăm (%) nhanh
            </h2>
          </div>
          <Badge>Chính xác tức thì</Badge>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Card 1: A is what % of B */}
          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-4">
            <div className="space-y-1">
              <h3 className="font-heading text-base font-bold text-foreground">
                A là bao nhiêu % của B?
              </h3>
              <p className="text-xs text-muted-foreground">
                Tính tỷ lệ câu đúng, tỷ lệ hoàn thành bài tập
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground">Giá trị A</span>
                <input
                  type="number"
                  step="any"
                  value={valA}
                  onChange={(e) => setValA(e.target.value)}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground">Tổng số B</span>
                <input
                  type="number"
                  step="any"
                  value={valB}
                  onChange={(e) => setValB(e.target.value)}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-3.5">
              <p className="text-xs text-muted-foreground">Kết quả tỷ lệ</p>
              <p className="font-heading text-2xl font-bold text-primary">
                {pctOfB === null ? "—" : `${formatNum(pctOfB, 2)}%`}
              </p>
            </div>
          </div>

          {/* Card 2: % Change between 2 exams */}
          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-4">
            <div className="space-y-1">
              <h3 className="font-heading text-base font-bold text-foreground">
                Tăng / giảm % giữa 2 kỳ kiểm tra
              </h3>
              <p className="text-xs text-muted-foreground">
                So sánh tiến bộ điểm số Kỳ 1 → Kỳ 2
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground">Kỳ 1 (Cũ)</span>
                <input
                  type="number"
                  step="any"
                  value={oldVal}
                  onChange={(e) => setOldVal(e.target.value)}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground">Kỳ 2 (Mới)</span>
                <input
                  type="number"
                  step="any"
                  value={newVal}
                  onChange={(e) => setNewVal(e.target.value)}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-3.5 flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Biến động</p>
                <p
                  className={cn(
                    "font-heading text-2xl font-bold",
                    pctChange === null
                      ? "text-muted-foreground"
                      : pctChange.diff >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400",
                  )}
                >
                  {pctChange === null
                    ? "—"
                    : `${pctChange.rate >= 0 ? "+" : ""}${formatNum(pctChange.rate, 2)}%`}
                </p>
              </div>
              {pctChange !== null && (
                <Badge
                  className={
                    pctChange.diff >= 0
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                  }
                >
                  {pctChange.diff >= 0 ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  <span>
                    {pctChange.diff >= 0 ? "+" : ""}
                    {formatNum(pctChange.diff, 2)}
                  </span>
                </Badge>
              )}
            </div>
          </div>

          {/* Card 3: Find value after +/- X% */}
          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-4">
            <div className="space-y-1">
              <h3 className="font-heading text-base font-bold text-foreground">
                Tìm giá trị sau khi tăng / giảm X%
              </h3>
              <p className="text-xs text-muted-foreground">
                Tính giảm giá sách, học phí hoặc cộng % điểm thưởng
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground">Giá trị gốc</span>
                <input
                  type="number"
                  step="any"
                  value={baseVal}
                  onChange={(e) => setBaseVal(e.target.value)}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground">Mức %</span>
                <input
                  type="number"
                  step="any"
                  value={deltaPct}
                  onChange={(e) => setDeltaPct(e.target.value)}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDeltaOp("inc")}
                className={cn(
                  "flex-1 h-9 rounded-xl text-xs font-semibold transition-colors cursor-pointer",
                  deltaOp === "inc"
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.1]",
                )}
              >
                + Tăng {deltaPct || 0}%
              </button>
              <button
                type="button"
                onClick={() => setDeltaOp("dec")}
                className={cn(
                  "flex-1 h-9 rounded-xl text-xs font-semibold transition-colors cursor-pointer",
                  deltaOp === "dec"
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.1]",
                )}
              >
                - Giảm {deltaPct || 0}%
              </button>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-3.5">
              <p className="text-xs text-muted-foreground">
                Giá trị mới (chênh {adjustedResult ? formatNum(adjustedResult.delta, 2) : "—"})
              </p>
              <p className="font-heading text-2xl font-bold text-primary">
                {adjustedResult === null ? "—" : formatNum(adjustedResult.finalVal, 2)}
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Class Grading Distribution */}
        <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Bảng tính % Xếp loại Học lực / Rèn luyện Lớp học
                </h3>
                <p className="text-xs text-muted-foreground">
                  Theo Thông tư 22/2021/TT-BGDĐT (Tốt, Khá, Đạt, Chưa đạt)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/15 text-primary">
                Tổng sĩ số: {classStats.total} học sinh
              </Badge>
              <button
                type="button"
                onClick={() => {
                  setCountTot("16");
                  setCountKha("18");
                  setCountDat("6");
                  setCountChuaDat("2");
                }}
                className="inline-flex h-8 items-center gap-1 rounded-lg bg-foreground/[0.06] px-2.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Mẫu lớp 42 HS</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Mức Tốt (HS)", val: countTot, set: setCountTot },
              { label: "Mức Khá (HS)", val: countKha, set: setCountKha },
              { label: "Mức Đạt (HS)", val: countDat, set: setCountDat },
              { label: "Chưa đạt (HS)", val: countChuaDat, set: setCountChuaDat },
            ].map((field) => (
              <label key={field.label} className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground">
                  {field.label}
                </span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={field.val}
                  onChange={(e) => field.set(e.target.value)}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            ))}
          </div>

          {/* Stacked visual bar */}
          <div className="space-y-2">
            <div className="flex h-4 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
              {classStats.rows.map((row) =>
                row.pct > 0 ? (
                  <div
                    key={row.key}
                    style={{ width: `${row.pct}%` }}
                    title={`${row.label}: ${row.count} HS (${formatNum(row.pct, 2)}%)`}
                    className={cn("h-full transition-all duration-300", row.barColor)}
                  />
                ) : null,
              )}
            </div>
          </div>

          {/* Breakdown rows */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {classStats.rows.map((row) => (
              <div
                key={row.key}
                className="rounded-xl border border-border/60 bg-background/70 p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Badge className={row.badgeClass}>{row.label}</Badge>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {row.count} / {classStats.total} HS
                  </span>
                </div>
                <p className="font-heading text-2xl font-bold text-foreground">
                  {formatNum(row.pct, 2)}%
                </p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
                  <div
                    style={{ width: `${row.pct}%` }}
                    className={cn("h-full rounded-full transition-all duration-300", row.barColor)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Vietnamese Number & Currency to Words */}
      <section className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                2. Đọc Số & Số Tiền Thành Chữ Tiếng Việt Chuẩn Chính Tả
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Xử lý chính xác quy tắc lẻ/linh, mười/mươi, mốt, tư, lăm lên tới hàng nghìn tỷ
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setNumMode("currency")}
              className={cn(
                "min-h-9 rounded-xl px-3.5 text-xs font-semibold transition-colors cursor-pointer",
                numMode === "currency"
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.1]",
              )}
            >
              Số tiền (VNĐ)
            </button>
            <button
              type="button"
              onClick={() => setNumMode("number")}
              className={cn(
                "min-h-9 rounded-xl px-3.5 text-xs font-semibold transition-colors cursor-pointer",
                numMode === "number"
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.1]",
              )}
            >
              Số tự nhiên / Điểm số
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-3">
            <label htmlFor="vi-number-input" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nhập số cần đọc
            </label>
            <input
              id="vi-number-input"
              type="text"
              inputMode="decimal"
              value={numInput}
              onChange={(e) => setNumInput(e.target.value)}
              placeholder={
                numMode === "currency"
                  ? "Ví dụ: 1250000 hoặc 1.250.000"
                  : "Ví dụ: 8,75 hoặc 105024015"
              }
              className="h-12 w-full rounded-xl border border-input bg-background px-4 font-mono text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Ví dụ nhanh:</span>
              {(numMode === "currency"
                ? ["1250000", "105024015", "9500000000", "1002500000000"]
                : ["8,75", "105", "2024", "1002050015"]
              ).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setNumInput(preset)}
                  className="rounded-lg bg-foreground/[0.06] px-2.5 py-1 font-mono text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-xl bg-foreground/[0.04] p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tùy chọn vùng miền
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground">Hàng chục = 0</span>
                <div className="flex gap-1.5">
                  {(["lẻ", "linh"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setLeWord(opt)}
                      className={cn(
                        "flex-1 h-8 rounded-lg text-xs font-semibold cursor-pointer",
                        leWord === opt
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-foreground border border-border/60",
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground">Số 4 (24, 34...)</span>
                <div className="flex gap-1.5">
                  {(["tư", "bốn"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setTuWord(opt)}
                      className={cn(
                        "flex-1 h-8 rounded-lg text-xs font-semibold cursor-pointer",
                        tuWord === opt
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-foreground border border-border/60",
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Output Card */}
        <div className="rounded-2xl border border-primary/30 bg-primary/[0.06] p-5 space-y-3">
          {wordsResult.error ? (
            <p className="text-sm font-medium text-destructive">{wordsResult.error}</p>
          ) : wordsResult.valid ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <Calculator className="h-4 w-4 text-primary" />
                  <span>Định dạng chuẩn:</span>
                  <span className="font-mono text-foreground font-bold">
                    {wordsResult.formattedDigits}
                    {numMode === "currency" ? " VNĐ" : ""}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyWords}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  {copiedWords ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Sao chép chữ</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <ArrowRight className="mt-1 h-4 w-4 text-primary shrink-0" />
                <p className="font-heading text-lg font-bold leading-snug text-foreground sm:text-xl">
                  {wordsResult.words}
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nhập dãy số bất kỳ để xem cách đọc chuẩn tiếng Việt.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
