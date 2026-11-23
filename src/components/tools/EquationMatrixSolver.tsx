"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  Grid3X3,
  Sigma,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import {
  solveQuadratic,
  solveCubic,
  solveLinearSystem,
  analyzeMatrix,
} from "@/lib/mathMatrixSolver";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type SolverTab = "poly" | "system" | "matrix";

export function EquationMatrixSolver() {
  const [tab, setTab] = useState<SolverTab>("poly");
  const [asDecimal, setAsDecimal] = useState(false);

  // Tab 1: Polynomial
  const [degree, setDegree] = useState<2 | 3>(2);
  const [polyA, setPolyA] = useState("1");
  const [polyB, setPolyB] = useState("-5");
  const [polyC, setPolyC] = useState("6");
  const [polyD, setPolyD] = useState("-6");

  // Tab 2: Linear System
  const [sysSize, setSysSize] = useState<2 | 3>(2);
  const [sysA, setSysA] = useState<string[][]>([
    ["2", "1", "1"],
    ["1", "-1", "2"],
    ["3", "2", "-1"],
  ]);
  const [sysB, setSysB] = useState<string[]>(["5", "1", "4"]);

  // Tab 3: Matrix
  const [matSize, setMatSize] = useState<2 | 3>(2);
  const [matGrid, setMatGrid] = useState<string[][]>([
    ["4", "7", "0"],
    ["2", "6", "1"],
    ["1", "0", "2"],
  ]);

  const polyResult = useMemo(() => {
    const a = Number(polyA.replace(",", "."));
    const b = Number(polyB.replace(",", "."));
    const c = Number(polyC.replace(",", "."));
    const d = Number(polyD.replace(",", "."));
    return degree === 2 ? solveQuadratic(a, b, c) : solveCubic(a, b, c, d);
  }, [degree, polyA, polyB, polyC, polyD]);

  const systemResult = useMemo(
    () => solveLinearSystem(sysSize, sysA, sysB, asDecimal),
    [sysSize, sysA, sysB, asDecimal]
  );

  const matrixResult = useMemo(
    () => analyzeMatrix(matSize, matGrid, asDecimal),
    [matSize, matGrid, asDecimal]
  );

  const updateSysCell = (r: number, c: number, val: string) => {
    setSysA((prev) =>
      prev.map((row, rIdx) =>
        rIdx === r ? row.map((cell, cIdx) => (cIdx === c ? val : cell)) : row
      )
    );
  };

  const updateMatCell = (r: number, c: number, val: string) => {
    setMatGrid((prev) =>
      prev.map((row, rIdx) =>
        rIdx === r ? row.map((cell, cIdx) => (cIdx === c ? val : cell)) : row
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Tab Bar + Output Format Toggle */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/85 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTab("poly")}
            className={cn(
              "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors",
              tab === "poly"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
            )}
          >
            <Calculator className="h-4 w-4" />
            PT Bậc 2 &amp; Bậc 3
          </button>
          <button
            type="button"
            onClick={() => setTab("system")}
            className={cn(
              "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors",
              tab === "system"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
            )}
          >
            <Sigma className="h-4 w-4" />
            Hệ PT 2×2 &amp; 3×3
          </button>
          <button
            type="button"
            onClick={() => setTab("matrix")}
            className={cn(
              "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors",
              tab === "matrix"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
            )}
          >
            <Grid3X3 className="h-4 w-4" />
            Ma trận (det, Aᵀ, A⁻¹)
          </button>
        </div>

        {tab !== "poly" && (
          <div className="flex items-center gap-1 rounded-xl bg-foreground/[0.05] p-1 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setAsDecimal(false)}
              className={cn(
                "min-h-9 cursor-pointer rounded-lg px-3 text-xs font-semibold transition-colors",
                !asDecimal
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Phân số chính xác
            </button>
            <button
              type="button"
              onClick={() => setAsDecimal(true)}
              className={cn(
                "min-h-9 cursor-pointer rounded-lg px-3 text-xs font-semibold transition-colors",
                asDecimal
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Số thập phân
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: POLYNOMIAL */}
      {tab === "poly" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDegree(2)}
                  className={cn(
                    "min-h-10 cursor-pointer rounded-xl px-3.5 text-xs font-bold transition-colors",
                    degree === 2
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/[0.05] text-foreground"
                  )}
                >
                  Bậc 2 (ax² + bx + c = 0)
                </button>
                <button
                  type="button"
                  onClick={() => setDegree(3)}
                  className={cn(
                    "min-h-10 cursor-pointer rounded-xl px-3.5 text-xs font-bold transition-colors",
                    degree === 3
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/[0.05] text-foreground"
                  )}
                >
                  Bậc 3 (ax³ + bx² + cx + d = 0)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                  Hệ số a
                </label>
                <input
                  type="text"
                  value={polyA}
                  onChange={(e) => setPolyA(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm font-bold text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                  Hệ số b
                </label>
                <input
                  type="text"
                  value={polyB}
                  onChange={(e) => setPolyB(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm font-bold text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                  Hệ số c
                </label>
                <input
                  type="text"
                  value={polyC}
                  onChange={(e) => setPolyC(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm font-bold text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              {degree === 3 && (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                    Hệ số d
                  </label>
                  <input
                    type="text"
                    value={polyD}
                    onChange={(e) => setPolyD(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm font-bold text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setDegree(2);
                  setPolyA("1");
                  setPolyB("-5");
                  setPolyC("6");
                }}
                className="min-h-9 cursor-pointer rounded-xl bg-foreground/[0.05] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.09]"
              >
                VD: x² - 5x + 6 = 0
              </button>
              <button
                type="button"
                onClick={() => {
                  setDegree(2);
                  setPolyA("1");
                  setPolyB("2");
                  setPolyC("5");
                }}
                className="min-h-9 cursor-pointer rounded-xl bg-foreground/[0.05] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.09]"
              >
                VD Nghiệm phức: x² + 2x + 5 = 0
              </button>
              <button
                type="button"
                onClick={() => {
                  setDegree(3);
                  setPolyA("1");
                  setPolyB("-6");
                  setPolyC("11");
                  setPolyD("-6");
                }}
                className="min-h-9 cursor-pointer rounded-xl bg-foreground/[0.05] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.09]"
              >
                VD Bậc 3: x³ - 6x² + 11x - 6 = 0
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-4">
            <Badge className="bg-primary/15 text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {polyResult.summary}
            </Badge>

            {polyResult.roots.length > 0 && (
              <div className="flex flex-wrap gap-2.5">
                {polyResult.roots.map((r, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-primary/10 px-4 py-2.5 font-mono text-base font-bold text-primary"
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 rounded-xl bg-foreground/[0.04] p-4 text-xs leading-relaxed text-muted-foreground sm:text-sm dark:bg-foreground/[0.06]">
              <div className="font-bold text-foreground">Các bước giải chi tiết:</div>
              {polyResult.steps.map((step, i) => (
                <div key={i} className="font-mono">
                  {i + 1}. {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LINEAR SYSTEM */}
      {tab === "system" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSysSize(2)}
                  className={cn(
                    "min-h-10 cursor-pointer rounded-xl px-3.5 text-xs font-bold transition-colors",
                    sysSize === 2
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/[0.05] text-foreground"
                  )}
                >
                  Hệ 2 ẩn (x, y)
                </button>
                <button
                  type="button"
                  onClick={() => setSysSize(3)}
                  className={cn(
                    "min-h-10 cursor-pointer rounded-xl px-3.5 text-xs font-bold transition-colors",
                    sysSize === 3
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/[0.05] text-foreground"
                  )}
                >
                  Hệ 3 ẩn (x, y, z)
                </button>
              </div>
              <span className="text-xs text-muted-foreground">
                Hỗ trợ số nguyên, thập phân hoặc phân số (VD: 1/2)
              </span>
            </div>

            <div className="space-y-3">
              {Array.from({ length: sysSize }, (_, r) => (
                <div key={r} className="flex flex-wrap items-center gap-2">
                  {Array.from({ length: sysSize }, (__, c) => {
                    const varName = ["x", "y", "z"][c];
                    return (
                      <div key={c} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          aria-label={`Hệ số phương trình ${r + 1} ẩn ${varName}`}
                          value={sysA[r][c]}
                          onChange={(e) => updateSysCell(r, c, e.target.value)}
                          className="h-11 w-16 rounded-xl border border-border/70 bg-background px-2 text-center text-sm font-bold text-foreground focus:border-primary focus:outline-none sm:w-20"
                        />
                        <span className="text-sm font-semibold text-muted-foreground">
                          {varName} {c < sysSize - 1 ? "+" : "="}
                        </span>
                      </div>
                    );
                  })}
                  <input
                    type="text"
                    aria-label={`Vế phải phương trình ${r + 1}`}
                    value={sysB[r]}
                    onChange={(e) =>
                      setSysB((prev) =>
                        prev.map((v, idx) => (idx === r ? e.target.value : v))
                      )
                    }
                    className="h-11 w-16 rounded-xl border border-primary/40 bg-primary/5 px-2 text-center text-sm font-bold text-primary focus:border-primary focus:outline-none sm:w-20"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-4">
            <Badge
              className={cn(
                systemResult.status === "unique"
                  ? "bg-primary/15 text-primary"
                  : systemResult.status === "none" ||
                    systemResult.status === "invalid"
                  ? "bg-destructive/15 text-destructive"
                  : "bg-foreground/[0.08] text-foreground"
              )}
            >
              {systemResult.status === "unique"
                ? "Hệ có nghiệm duy nhất"
                : systemResult.status === "infinite"
                ? "Hệ có vô số nghiệm"
                : systemResult.status === "none"
                ? "Hệ vô nghiệm"
                : "Dữ liệu chưa hợp lệ"}
            </Badge>

            {systemResult.solution && (
              <div className="flex flex-wrap gap-2.5">
                {systemResult.solution.map((s, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-primary/10 px-4 py-2.5 font-mono text-base font-bold text-primary"
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 rounded-xl bg-foreground/[0.04] p-4 text-xs leading-relaxed text-muted-foreground sm:text-sm dark:bg-foreground/[0.06]">
              <div className="font-bold text-foreground">
                Chi tiết theo Quy tắc Cramer &amp; Khử Gauss:
              </div>
              {systemResult.steps.map((step, i) => (
                <div key={i} className="font-mono">
                  {i + 1}. {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MATRIX */}
      {tab === "matrix" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMatSize(2)}
                  className={cn(
                    "min-h-10 cursor-pointer rounded-xl px-3.5 text-xs font-bold transition-colors",
                    matSize === 2
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/[0.05] text-foreground"
                  )}
                >
                  Ma trận 2×2
                </button>
                <button
                  type="button"
                  onClick={() => setMatSize(3)}
                  className={cn(
                    "min-h-10 cursor-pointer rounded-xl px-3.5 text-xs font-bold transition-colors",
                    matSize === 3
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/[0.05] text-foreground"
                  )}
                >
                  Ma trận 3×3
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMatSize(2);
                  setMatGrid([
                    ["1", "2", "0"],
                    ["2", "4", "0"],
                    ["0", "0", "1"],
                  ]);
                }}
                className="min-h-9 cursor-pointer rounded-xl bg-foreground/[0.05] px-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Thử ma trận suy biến (det = 0)
              </button>
            </div>

            <div className="space-y-2.5">
              {Array.from({ length: matSize }, (_, r) => (
                <div key={r} className="flex items-center gap-2.5">
                  {Array.from({ length: matSize }, (__, c) => (
                    <input
                      key={c}
                      type="text"
                      aria-label={`Phần tử hàng ${r + 1} cột ${c + 1}`}
                      value={matGrid[r][c]}
                      onChange={(e) => updateMatCell(r, c, e.target.value)}
                      className="h-12 w-20 rounded-xl border border-border/70 bg-background px-2 text-center font-mono text-sm font-bold text-foreground focus:border-primary focus:outline-none"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
            {matrixResult.valid ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">
                      Định thức det(A)
                    </div>
                    <div className="font-heading text-3xl font-extrabold text-primary">
                      {matrixResult.determinant}
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      matrixResult.invertible
                        ? "bg-primary/15 text-primary"
                        : "bg-destructive/15 text-destructive"
                    )}
                  >
                    {matrixResult.invertible
                      ? "Khả nghịch (Tồn tại A⁻¹)"
                      : "Suy biến (Không có A⁻¹)"}
                  </Badge>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
                    <div className="mb-2 text-xs font-bold uppercase text-muted-foreground">
                      Ma trận chuyển vị Aᵀ
                    </div>
                    <div className="space-y-1.5 font-mono text-sm font-semibold text-foreground">
                      {matrixResult.transpose.map((row, rIdx) => (
                        <div key={rIdx} className="flex gap-3">
                          {row.map((val, cIdx) => (
                            <span
                              key={cIdx}
                              className="min-w-10 rounded bg-background/80 px-2 py-1 text-center"
                            >
                              {val}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
                    <div className="mb-2 text-xs font-bold uppercase text-muted-foreground">
                      Ma trận nghịch đảo A⁻¹
                    </div>
                    {matrixResult.inverse ? (
                      <div className="space-y-1.5 font-mono text-sm font-semibold text-primary">
                        {matrixResult.inverse.map((row, rIdx) => (
                          <div key={rIdx} className="flex gap-3">
                            {row.map((val, cIdx) => (
                              <span
                                key={cIdx}
                                className="min-w-10 rounded bg-primary/10 px-2 py-1 text-center"
                              >
                                {val}
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 text-xs text-destructive">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          Không tồn tại ma trận nghịch đảo vì det(A) = 0.
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 rounded-xl bg-foreground/[0.04] p-4 font-mono text-xs text-muted-foreground dark:bg-foreground/[0.06]">
                  {matrixResult.steps.map((s, idx) => (
                    <div key={idx}>
                      {idx + 1}. {s}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-start gap-2 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{matrixResult.error}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bridge to Toán THPT */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/85 p-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>
            Ôn luyện thêm trắc nghiệm Toán học THPT 2027 (3 phần GDPT 2018)?
          </span>
        </div>
        <Button
          href="/de-thi/toan/on-thi-thpt"
          variant="secondary"
          size="sm"
          className="min-h-10 gap-1.5"
        >
          Làm đề thi Toán THPT ngay
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
