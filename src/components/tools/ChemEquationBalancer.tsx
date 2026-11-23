"use client";

import { useMemo, useState } from "react";
import {
  FlaskConical,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Scale,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import {
  balanceChemicalEquation,
  calculateMolarMass,
  CHEM_PRESETS,
} from "@/lib/chemBalancer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ModeTab = "balance" | "molar";

const MOLAR_PRESETS = [
  "Fe2(SO4)3",
  "Ca(OH)2",
  "KMnO4",
  "CuSO4.5H2O",
  "Al2(SO4)3",
  "C6H12O6",
];

function FormulaSubscripts({ formula }: { formula: string }) {
  // Split digits after letters/closing brackets vs leading hydrate multipliers
  const tokens: Array<{ text: string; sub: boolean }> = [];
  let i = 0;
  while (i < formula.length) {
    const ch = formula[i];
    if (/[0-9]/.test(ch)) {
      const prev = i > 0 ? formula[i - 1] : "";
      const isHydrateMult =
        i === 0 || prev === "." || prev === "·" || prev === "*" || prev === "•";
      let j = i;
      while (j < formula.length && /[0-9]/.test(formula[j])) j++;
      tokens.push({ text: formula.slice(i, j), sub: !isHydrateMult });
      i = j;
    } else {
      tokens.push({ text: ch, sub: false });
      i++;
    }
  }

  return (
    <span>
      {tokens.map((t, idx) =>
        t.sub ? (
          <sub key={idx} className="text-[0.72em] font-semibold">
            {t.text}
          </sub>
        ) : (
          <span key={idx}>{t.text}</span>
        )
      )}
    </span>
  );
}

export function ChemEquationBalancer() {
  const [tab, setTab] = useState<ModeTab>("balance");
  const [equationInput, setEquationInput] = useState(
    "Fe + H2SO4 -> Fe2(SO4)3 + SO2 + H2O"
  );
  const [molarInput, setMolarInput] = useState("Fe2(SO4)3");
  const [copied, setCopied] = useState(false);

  const balanceResult = useMemo(
    () => balanceChemicalEquation(equationInput),
    [equationInput]
  );

  const molarResult = useMemo(
    () => calculateMolarMass(molarInput),
    [molarInput]
  );

  const handleCopyEquation = async () => {
    if (!balanceResult.success) return;
    try {
      await navigator.clipboard.writeText(balanceResult.balancedEquationText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard restrictions
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-border/70 bg-card/85 p-2">
        <button
          type="button"
          onClick={() => setTab("balance")}
          className={cn(
            "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors",
            tab === "balance"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
          )}
        >
          <Scale className="h-4 w-4" />
          Cân bằng Phương trình Hóa học
        </button>
        <button
          type="button"
          onClick={() => setTab("molar")}
          className={cn(
            "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors",
            tab === "molar"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
          )}
        >
          <FlaskConical className="h-4 w-4" />
          Tính Phân tử khối (M) &amp; % Khối lượng
        </button>
      </div>

      {tab === "balance" ? (
        <div className="space-y-6">
          {/* Input & Presets */}
          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-7 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="chem-equation-input"
                className="block text-sm font-semibold text-foreground"
              >
                Nhập phương trình hóa học cần cân bằng (dùng{" "}
                <code className="rounded bg-foreground/[0.06] px-1.5 py-0.5 text-xs">
                  -&gt;
                </code>{" "}
                hoặc{" "}
                <code className="rounded bg-foreground/[0.06] px-1.5 py-0.5 text-xs">
                  =
                </code>
                ):
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="chem-equation-input"
                  type="text"
                  value={equationInput}
                  onChange={(e) => setEquationInput(e.target.value)}
                  placeholder="VD: Cu + HNO3 -> Cu(NO3)2 + NO + H2O"
                  className="h-12 flex-1 rounded-xl border border-border/70 bg-background px-4 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => setEquationInput("")}
                  className="min-h-12 gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Xóa
                </Button>
              </div>
            </div>

            {/* Quick Exam Presets */}
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Phản ứng kinh điển hay ra thi THPT (bấm để thử ngay):
              </div>
              <div className="flex flex-wrap gap-2">
                {CHEM_PRESETS.map((preset) => (
                  <button
                    key={preset.equation}
                    type="button"
                    onClick={() => setEquationInput(preset.equation)}
                    className={cn(
                      "inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors",
                      equationInput.trim() === preset.equation
                        ? "bg-primary/15 text-primary ring-1 ring-primary/40"
                        : "bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.09]"
                    )}
                  >
                    <Sparkles className="h-3 w-3 text-primary" />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Balanced Result Card */}
          {balanceResult.success ? (
            <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-7 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/15 text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Đã cân bằng chính xác
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Thuật toán khử Gauss phân số chính xác tuyệt đối
                  </span>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyEquation}
                  className="min-h-10 gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-primary" />
                      Đã sao chép
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Sao chép PTHH
                    </>
                  )}
                </Button>
              </div>

              {/* Pretty Equation Display */}
              <div className="rounded-xl bg-foreground/[0.04] p-5 text-center dark:bg-foreground/[0.06]">
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 font-heading text-xl font-bold text-foreground sm:text-2xl">
                  {balanceResult.reactants.map((term, idx) => (
                    <span
                      key={`r-${idx}`}
                      className="inline-flex items-baseline gap-0.5"
                    >
                      {idx > 0 && (
                        <span className="mx-1.5 text-muted-foreground">+</span>
                      )}
                      {term.coefficient > 1 && (
                        <span className="text-primary">{term.coefficient}</span>
                      )}
                      <FormulaSubscripts formula={term.formula} />
                    </span>
                  ))}
                  <span className="mx-2 text-primary">→</span>
                  {balanceResult.products.map((term, idx) => (
                    <span
                      key={`p-${idx}`}
                      className="inline-flex items-baseline gap-0.5"
                    >
                      {idx > 0 && (
                        <span className="mx-1.5 text-muted-foreground">+</span>
                      )}
                      {term.coefficient > 1 && (
                        <span className="text-primary">{term.coefficient}</span>
                      )}
                      <FormulaSubscripts formula={term.formula} />
                    </span>
                  ))}
                </div>
                <div className="mt-3 font-mono text-xs text-muted-foreground">
                  Hệ số tỉ lệ:{" "}
                  {[...balanceResult.reactants, ...balanceResult.products]
                    .map((t) => t.coefficient)
                    .join(" : ")}
                </div>
              </div>

              {/* Atom Balance Verification Table */}
              <div>
                <h3 className="mb-3 font-heading text-base font-bold text-foreground">
                  Bảng kiểm tra bảo toàn số nguyên tử hai vế
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-border/70 text-xs uppercase text-muted-foreground">
                        <th className="py-2 pr-4 font-semibold">Nguyên tố</th>
                        <th className="py-2 pr-4 font-semibold">
                          Số nguyên tử Vế trái
                        </th>
                        <th className="py-2 pr-4 font-semibold">
                          Số nguyên tử Vế phải
                        </th>
                        <th className="py-2 font-semibold">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {balanceResult.atomVerification.map((row) => (
                        <tr key={row.element}>
                          <td className="py-2.5 pr-4 font-bold text-foreground">
                            {row.element}
                          </td>
                          <td className="py-2.5 pr-4 text-foreground">
                            {row.leftCount}
                          </td>
                          <td className="py-2.5 pr-4 text-foreground">
                            {row.rightCount}
                          </td>
                          <td className="py-2.5">
                            <span className="inline-flex items-center gap-1 rounded-lg bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Bằng nhau
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <div className="font-bold">Chưa thể cân bằng phương trình</div>
                <p className="mt-1 opacity-90">{balanceResult.error}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Molar Mass Input */}
          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-7 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="molar-mass-input"
                className="block text-sm font-semibold text-foreground"
              >
                Nhập công thức hóa học cần tính Phân tử khối M (hỗ trợ ngoặc &amp;
                tinh thể ngậm nước như{" "}
                <code className="rounded bg-foreground/[0.06] px-1.5 py-0.5 text-xs">
                  CuSO4.5H2O
                </code>
                ):
              </label>
              <input
                id="molar-mass-input"
                type="text"
                value={molarInput}
                onChange={(e) => setMolarInput(e.target.value)}
                placeholder="VD: Fe2(SO4)3, Ca(OH)2, CuSO4.5H2O"
                className="h-12 w-full rounded-xl border border-border/70 bg-background px-4 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {MOLAR_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMolarInput(preset)}
                  className={cn(
                    "inline-flex min-h-10 cursor-pointer items-center rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors",
                    molarInput.trim() === preset
                      ? "bg-primary/15 text-primary ring-1 ring-primary/40"
                      : "bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.09]"
                  )}
                >
                  <FormulaSubscripts formula={preset} />
                </button>
              ))}
            </div>
          </div>

          {!molarResult.error ? (
            <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-7 space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Phân tử khối (M) của{" "}
                    <FormulaSubscripts formula={molarResult.formula} />
                  </div>
                  <div className="mt-1 font-heading text-4xl font-extrabold text-primary">
                    {molarResult.molarMass}{" "}
                    <span className="text-lg font-semibold text-muted-foreground">
                      g/mol (amu)
                    </span>
                  </div>
                </div>
                <Badge>Chuẩn nguyên tử khối GDPT 2018</Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-xs uppercase text-muted-foreground">
                      <th className="py-2 pr-4 font-semibold">Nguyên tố</th>
                      <th className="py-2 pr-4 font-semibold">Số nguyên tử</th>
                      <th className="py-2 pr-4 font-semibold">
                        Nguyên tử khối (M)
                      </th>
                      <th className="py-2 pr-4 font-semibold">Tổng khối lượng</th>
                      <th className="py-2 font-semibold">% Thành phần</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {molarResult.breakdown.map((item) => {
                      const pct =
                        molarResult.molarMass > 0
                          ? ((item.subtotal / molarResult.molarMass) * 100).toFixed(
                              2
                            )
                          : "0";
                      return (
                        <tr key={item.element}>
                          <td className="py-2.5 pr-4 font-bold text-foreground">
                            {item.element}
                          </td>
                          <td className="py-2.5 pr-4 text-foreground">
                            {item.count}
                          </td>
                          <td className="py-2.5 pr-4 text-muted-foreground">
                            {item.atomicMass}
                          </td>
                          <td className="py-2.5 pr-4 font-semibold text-foreground">
                            {item.subtotal}
                          </td>
                          <td className="py-2.5 font-semibold text-primary">
                            {pct}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <div className="font-bold">Công thức chưa hợp lệ</div>
                <p className="mt-1 opacity-90">{molarResult.error}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
