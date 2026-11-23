"use client";

import { useMemo, useState } from "react";
import { Binary, ArrowLeftRight, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const ZERO = BigInt(0);
const TWO = BigInt(2);
const EIGHT = BigInt(8);
const SIXTEEN = BigInt(16);

function parseBigIntRadix(raw: string, base: 2 | 8 | 10 | 16): bigint | null {
  const s = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (!s) return ZERO;
  const neg = s.startsWith("-");
  const body = neg ? s.slice(1) : s;
  if (!body) return null;

  const patterns: Record<2 | 8 | 10 | 16, RegExp> = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^[0-9]+$/,
    16: /^[0-9A-F]+$/,
  };
  if (!patterns[base].test(body)) return null;

  if (base === 10) {
    return BigInt(s);
  }
  const prefix = base === 2 ? "0b" : base === 8 ? "0o" : "0x";
  const absVal = BigInt(prefix + body);
  return neg ? -absVal : absVal;
}

function formatBigIntRadix(val: bigint, base: 2 | 8 | 10 | 16): string {
  const neg = val < ZERO;
  const abs = neg ? -val : val;
  const str = abs.toString(base).toUpperCase();
  return neg ? `-${str}` : str;
}

function buildDivisionSteps(
  val: bigint,
  base: 2 | 16
): Array<{ dividend: string; quotient: string; remainder: string }> {
  if (val < ZERO) return [];
  if (val === ZERO) {
    return [{ dividend: "0", quotient: "0", remainder: "0" }];
  }
  const divisor = base === 2 ? TWO : SIXTEEN;
  const steps: Array<{ dividend: string; quotient: string; remainder: string }> = [];
  let cur = val;
  let guard = 0;
  while (cur > ZERO && guard < 64) {
    const q = cur / divisor;
    const r = cur % divisor;
    steps.push({
      dividend: cur.toString(),
      quotient: q.toString(),
      remainder: r.toString(base).toUpperCase(),
    });
    cur = q;
    guard++;
  }
  return steps;
}

const ROMAN_PAIRS: Array<[number, string]> = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

function toRoman(num: number): string | null {
  if (!Number.isInteger(num) || num < 1 || num > 3999) return null;
  let n = num;
  let out = "";
  for (const [val, sym] of ROMAN_PAIRS) {
    while (n >= val) {
      out += sym;
      n -= val;
    }
  }
  return out;
}

function fromRoman(raw: string): number | null {
  const s = raw.trim().toUpperCase();
  if (!s) return null;
  if (!/^[IVXLCDM]+$/.test(s)) return null;
  const map: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = map[s[i]];
    const next = i + 1 < s.length ? map[s[i + 1]] : 0;
    if (cur < next) total -= cur;
    else total += cur;
  }
  // Canonical check (reject invalid sequences like IIII or VX)
  return toRoman(total) === s ? total : null;
}

export function RadixConverterTool() {
  const [decStr, setDecStr] = useState("2027");
  const [binStr, setBinStr] = useState("11111101011");
  const [octStr, setOctStr] = useState("3753");
  const [hexStr, setHexStr] = useState("7EB");
  const [radixError, setRadixError] = useState<string | null>(null);
  const [stepBase, setStepBase] = useState<2 | 16>(2);

  // Two's complement state
  const [twosInput, setTwosInput] = useState("-42");
  const [bitWidth, setBitWidth] = useState<8 | 16>(8);

  // Roman state
  const [arabicInput, setArabicInput] = useState("2027");
  const [romanInput, setRomanInput] = useState("MMXXVII");

  const syncFromBase = (raw: string, base: 2 | 8 | 10 | 16) => {
    if (base === 2) setBinStr(raw);
    if (base === 8) setOctStr(raw);
    if (base === 10) setDecStr(raw);
    if (base === 16) setHexStr(raw);

    const parsed = parseBigIntRadix(raw, base);
    if (parsed === null) {
      setRadixError(`Giá trị không hợp lệ cho hệ cơ số ${base}.`);
      return;
    }
    setRadixError(null);
    if (base !== 2) setBinStr(formatBigIntRadix(parsed, 2));
    if (base !== 8) setOctStr(formatBigIntRadix(parsed, 8));
    if (base !== 10) setDecStr(formatBigIntRadix(parsed, 10));
    if (base !== 16) setHexStr(formatBigIntRadix(parsed, 16));
  };

  const currentDecBig = useMemo(
    () => parseBigIntRadix(decStr, 10),
    [decStr]
  );

  const divisionSteps = useMemo(() => {
    if (currentDecBig === null) return [];
    return buildDivisionSteps(currentDecBig, stepBase);
  }, [currentDecBig, stepBase]);

  const twosResult = useMemo(() => {
    const n = Number(twosInput.trim());
    const min = bitWidth === 8 ? -128 : -32768;
    const max = bitWidth === 8 ? 127 : 32767;
    if (!Number.isInteger(n) || n < min || n > max) {
      return {
        error: `Nhập số nguyên trong khoảng [${min}, ${max}] cho ${bitWidth}-bit có dấu.`,
      };
    }
    const mod = 1 << bitWidth;
    const unsigned = n >= 0 ? n : mod + n;
    const bin = unsigned.toString(2).padStart(bitWidth, "0");
    const grouped = bin.replace(/(.{4})/g, "$1 ").trim();
    const hex = unsigned
      .toString(16)
      .toUpperCase()
      .padStart(bitWidth / 4, "0");
    return { bin: grouped, hex, unsigned };
  }, [twosInput, bitWidth]);

  const romanFromArabic = useMemo(
    () => toRoman(Number(arabicInput.trim())),
    [arabicInput]
  );
  const arabicFromRoman = useMemo(() => fromRoman(romanInput), [romanInput]);

  // Keep EIGHT reference used neatly if needed
  void EIGHT;

  return (
    <div className="space-y-6">
      {/* 4-Way Live Sync Converter */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge className="bg-primary/15 text-primary">
            <Binary className="h-3.5 w-3.5" />
            Chuyển đổi tức thì 4 hệ cơ số (Hỗ trợ số nguyên lớn BigInt)
          </Badge>
          <span className="text-xs text-muted-foreground">
            Nhập vào bất kỳ ô nào để đồng bộ 3 hệ còn lại
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase text-muted-foreground">
              Hệ Thập phân (Decimal — Cơ số 10)
            </label>
            <input
              type="text"
              value={decStr}
              onChange={(e) => syncFromBase(e.target.value, 10)}
              className="h-12 w-full rounded-xl border border-border/70 bg-background px-4 font-mono text-base font-bold text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase text-muted-foreground">
              Hệ Nhị phân (Binary — Cơ số 2)
            </label>
            <input
              type="text"
              value={binStr}
              onChange={(e) => syncFromBase(e.target.value, 2)}
              className="h-12 w-full rounded-xl border border-border/70 bg-background px-4 font-mono text-base font-bold text-primary focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase text-muted-foreground">
              Hệ Bát phân (Octal — Cơ số 8)
            </label>
            <input
              type="text"
              value={octStr}
              onChange={(e) => syncFromBase(e.target.value, 8)}
              className="h-12 w-full rounded-xl border border-border/70 bg-background px-4 font-mono text-base font-bold text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase text-muted-foreground">
              Hệ Thập lục phân (Hex — Cơ số 16)
            </label>
            <input
              type="text"
              value={hexStr}
              onChange={(e) => syncFromBase(e.target.value, 16)}
              className="h-12 w-full rounded-xl border border-border/70 bg-background px-4 font-mono text-base font-bold text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {radixError && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs font-semibold text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{radixError}</span>
          </div>
        )}

        {/* Step-by-step division remainder */}
        {divisionSteps.length > 0 && (
          <div className="space-y-3 border-t border-border/60 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase text-muted-foreground">
                Bảng chia lấy dư từng bước (Từ Hệ 10 sang Hệ {stepBase})
              </span>
              <div className="flex gap-1.5">
                {([2, 16] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setStepBase(b)}
                    className={cn(
                      "min-h-8 cursor-pointer rounded-lg px-3 text-xs font-bold transition-colors",
                      stepBase === b
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground/[0.05] text-foreground"
                    )}
                  >
                    Chia cho {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto rounded-xl bg-foreground/[0.04] p-3 dark:bg-foreground/[0.06]">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground">
                    <th className="py-1.5 pr-4">Phép chia</th>
                    <th className="py-1.5 pr-4">Thương</th>
                    <th className="py-1.5 text-primary">Số dư (đọc từ dưới lên)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {divisionSteps.map((s, idx) => (
                    <tr key={idx}>
                      <td className="py-1.5 pr-4">
                        {s.dividend} ÷ {stepBase}
                      </td>
                      <td className="py-1.5 pr-4">{s.quotient}</td>
                      <td className="py-1.5 font-bold text-primary">
                        {s.remainder}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Grid: Two's Complement + Roman Numerals */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Two's complement */}
        <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-bold text-foreground">
              Mã Bù 2 (Số âm trong Máy tính)
            </h2>
            <div className="flex gap-1.5">
              {([8, 16] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setBitWidth(w)}
                  className={cn(
                    "min-h-8 cursor-pointer rounded-lg px-2.5 text-xs font-bold",
                    bitWidth === w
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/[0.05] text-foreground"
                  )}
                >
                  {w}-bit
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Số nguyên có dấu (VD: -42, -128, 127)
            </label>
            <input
              type="number"
              value={twosInput}
              onChange={(e) => setTwosInput(e.target.value)}
              className="h-11 w-full rounded-xl border border-border/70 bg-background px-3.5 font-mono text-sm font-bold text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {twosResult.error ? (
            <div className="text-xs text-destructive">{twosResult.error}</div>
          ) : (
            <div className="space-y-2 rounded-xl bg-foreground/[0.04] p-4 font-mono text-sm dark:bg-foreground/[0.06]">
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Nhị phân bù 2:</span>
                <strong className="text-primary">{twosResult.bin}</strong>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Hex ({bitWidth}-bit):</span>
                <strong className="text-foreground">0x{twosResult.hex}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Roman Numerals */}
        <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-lg font-bold text-foreground">
              Chuyển đổi Số La Mã (1 – 3999)
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Số Ả Rập (1 – 3999) → La Mã
              </label>
              <input
                type="number"
                min="1"
                max="3999"
                value={arabicInput}
                onChange={(e) => setArabicInput(e.target.value)}
                className="h-11 w-full rounded-xl border border-border/70 bg-background px-3.5 font-mono text-sm font-bold text-foreground focus:border-primary focus:outline-none"
              />
              <div className="mt-2 rounded-lg bg-foreground/[0.04] px-3 py-2 font-serif text-base font-bold text-primary dark:bg-foreground/[0.06]">
                {romanFromArabic ?? "Ngoài khoảng 1–3999"}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Số La Mã → Số Ả Rập
              </label>
              <input
                type="text"
                value={romanInput}
                onChange={(e) => setRomanInput(e.target.value)}
                placeholder="VD: MMXXVII"
                className="h-11 w-full rounded-xl border border-border/70 bg-background px-3.5 font-serif text-sm font-bold uppercase text-foreground focus:border-primary focus:outline-none"
              />
              <div className="mt-2 rounded-lg bg-foreground/[0.04] px-3 py-2 font-mono text-base font-bold text-primary dark:bg-foreground/[0.06]">
                {arabicFromRoman !== null ? arabicFromRoman : "Chữ La Mã không hợp lệ"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
