"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";

type JlptRule = {
  level: JlptLevel;
  totalPass: number;
  cefr: string;
  sections: { id: string; label: string; minPass: number }[];
};

const JLPT_RULES: Record<JlptLevel, JlptRule> = {
  N5: {
    level: "N5",
    totalPass: 80,
    cefr: "CEFR A1",
    sections: [
      { id: "vocab_grammar_reading", label: "Từ vựng, Ngữ pháp & Đọc hiểu (0–120)", minPass: 38 },
      { id: "listening", label: "Nghe hiểu (0–60)", minPass: 19 },
    ],
  },
  N4: {
    level: "N4",
    totalPass: 90,
    cefr: "CEFR A2",
    sections: [
      { id: "vocab_grammar_reading", label: "Từ vựng, Ngữ pháp & Đọc hiểu (0–120)", minPass: 38 },
      { id: "listening", label: "Nghe hiểu (0–60)", minPass: 19 },
    ],
  },
  N3: {
    level: "N3",
    totalPass: 95,
    cefr: "CEFR B1",
    sections: [
      { id: "vocab_grammar", label: "Kiến thức ngôn ngữ: Từ vựng & Ngữ pháp (0–60)", minPass: 19 },
      { id: "reading", label: "Đọc hiểu (0–60)", minPass: 19 },
      { id: "listening", label: "Nghe hiểu (0–60)", minPass: 19 },
    ],
  },
  N2: {
    level: "N2",
    totalPass: 90,
    cefr: "CEFR B2",
    sections: [
      { id: "vocab_grammar", label: "Kiến thức ngôn ngữ: Từ vựng & Ngữ pháp (0–60)", minPass: 19 },
      { id: "reading", label: "Đọc hiểu (0–60)", minPass: 19 },
      { id: "listening", label: "Nghe hiểu (0–60)", minPass: 19 },
    ],
  },
  N1: {
    level: "N1",
    totalPass: 100,
    cefr: "CEFR C1",
    sections: [
      { id: "vocab_grammar", label: "Kiến thức ngôn ngữ: Từ vựng & Ngữ pháp (0–60)", minPass: 19 },
      { id: "reading", label: "Đọc hiểu (0–60)", minPass: 19 },
      { id: "listening", label: "Nghe hiểu (0–60)", minPass: 19 },
    ],
  },
};

type HskLevelInfo = {
  hsk2: string;
  hsk3: string;
  band: string;
  cefr: string;
  vocab: string;
  passRule: string;
};

const HSK_MAPPING: HskLevelInfo[] = [
  { hsk2: "HSK 1 (150 từ)", hsk3: "HSK 3.0 Bậc 1 (Sơ cấp)", band: "Sơ cấp", cefr: "A1", vocab: "~300–500 từ (HSK 3.0)", passRule: "HSK 2.0: ≥ 120 / 200" },
  { hsk2: "HSK 2 (300 từ)", hsk3: "HSK 3.0 Bậc 2 (Sơ cấp)", band: "Sơ cấp", cefr: "A2", vocab: "~772 từ (HSK 3.0)", passRule: "HSK 2.0: ≥ 120 / 200" },
  { hsk2: "HSK 3 (600 từ)", hsk3: "HSK 3.0 Bậc 3 (Sơ cấp)", band: "Sơ cấp", cefr: "B1-", vocab: "~1.272–2.245 từ", passRule: "HSK 2.0/3.0: ≥ 180 / 300" },
  { hsk2: "HSK 4 (1.200 từ)", hsk3: "HSK 3.0 Bậc 4 (Trung cấp)", band: "Trung cấp", cefr: "B1+ – B2", vocab: "~3.245 từ (HSK 3.0)", passRule: "≥ 180 / 300" },
  { hsk2: "HSK 5 (2.500 từ)", hsk3: "HSK 3.0 Bậc 5 (Trung cấp)", band: "Trung cấp", cefr: "B2+", vocab: "~4.316 từ (HSK 3.0)", passRule: "≥ 180 / 300 (tham chiếu đạt)" },
  { hsk2: "HSK 6 (5.000 từ)", hsk3: "HSK 3.0 Bậc 6 (Trung cấp)", band: "Trung cấp", cefr: "C1-", vocab: "~5.456 từ (HSK 3.0)", passRule: "≥ 180 / 300 (tham chiếu đạt)" },
  { hsk2: "Vượt HSK 6", hsk3: "HSK 3.0 Bậc 7–9 (Cao cấp)", band: "Cao cấp", cefr: "C1 – C2", vocab: "~11.092 từ (HSK 3.0)", passRule: "Thi tổng hợp 5 kỹ năng" },
];

export function evaluateJlptPass(
  level: JlptLevel,
  sec1: number,
  sec2: number,
  sec3: number,
) {
  const rule = JLPT_RULES[level];
  const isTwoSection = rule.sections.length === 2;
  const total = isTwoSection ? sec1 + sec2 : sec1 + sec2 + sec3;
  const failedSections: string[] = [];

  if (isTwoSection) {
    if (sec1 < rule.sections[0].minPass) failedSections.push(rule.sections[0].label);
    if (sec2 < rule.sections[1].minPass) failedSections.push(rule.sections[1].label);
  } else {
    if (sec1 < rule.sections[0].minPass) failedSections.push(rule.sections[0].label);
    if (sec2 < rule.sections[1].minPass) failedSections.push(rule.sections[1].label);
    if (sec3 < rule.sections[2].minPass) failedSections.push(rule.sections[2].label);
  }

  const passedTotal = total >= rule.totalPass;
  const passed = passedTotal && failedSections.length === 0;
  return {
    total,
    totalPass: rule.totalPass,
    cefr: rule.cefr,
    passedTotal,
    failedSections,
    passed,
  };
}

export function HskJlptCalculatorTool() {
  const [tab, setTab] = useState<"jlpt" | "hsk">("jlpt");

  // JLPT state
  const [jlptLevel, setJlptLevel] = useState<JlptLevel>("N3");
  const [s1, setS1] = useState<number>(36);
  const [s2, setS2] = useState<number>(34);
  const [s3, setS3] = useState<number>(32);

  // HSK state
  const [hskLevelIdx, setHskLevelIdx] = useState<number>(3); // HSK 4 default
  const [hskL, setHskL] = useState<number>(68);
  const [hskR, setHskR] = useState<number>(64);
  const [hskW, setHskW] = useState<number>(62);

  const rule = JLPT_RULES[jlptLevel];
  const isTwoSection = rule.sections.length === 2;

  const jlptResult = useMemo(
    () => evaluateJlptPass(jlptLevel, s1, s2, s3),
    [jlptLevel, s1, s2, s3],
  );

  const hskResult = useMemo(() => {
    const isHsk12 = hskLevelIdx <= 1;
    const maxTotal = isHsk12 ? 200 : 300;
    const passThreshold = isHsk12 ? 120 : 180;
    const total = isHsk12 ? hskL + hskR : hskL + hskR + hskW;
    const passed = total >= passThreshold;
    const mapping = HSK_MAPPING[hskLevelIdx] ?? HSK_MAPPING[3];
    return {
      isHsk12,
      maxTotal,
      passThreshold,
      total,
      passed,
      mapping,
    };
  }, [hskLevelIdx, hskL, hskR, hskW]);

  const handleSelectJlpt = (lvl: JlptLevel) => {
    setJlptLevel(lvl);
    if (lvl === "N5" || lvl === "N4") {
      setS1(64);
      setS2(32);
    } else {
      setS1(36);
      setS2(34);
      setS3(32);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-border/70 bg-card/85 p-4">
        <button
          type="button"
          onClick={() => setTab("jlpt")}
          className={cn(
            "min-h-11 rounded-xl px-5 text-sm font-bold transition-colors cursor-pointer",
            tab === "jlpt"
              ? "bg-primary text-primary-foreground"
              : "bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.1]",
          )}
        >
          JLPT Tiếng Nhật (N5 – N1)
        </button>
        <button
          type="button"
          onClick={() => setTab("hsk")}
          className={cn(
            "min-h-11 rounded-xl px-5 text-sm font-bold transition-colors cursor-pointer",
            tab === "hsk"
              ? "bg-primary text-primary-foreground"
              : "bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.1]",
          )}
        >
          HSK Tiếng Trung (HSK 2.0 ↔ HSK 3.0)
        </button>
      </div>

      {tab === "jlpt" ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left JLPT inputs */}
          <div className="space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                1. Chọn cấp độ JLPT &amp; nhập điểm thành phần
              </h2>
              <button
                type="button"
                onClick={() => handleSelectJlpt(jlptLevel)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Mẫu chuẩn
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {(["N5", "N4", "N3", "N2", "N1"] as JlptLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleSelectJlpt(lvl)}
                  className={cn(
                    "min-h-11 rounded-xl border text-sm font-bold cursor-pointer",
                    jlptLevel === lvl
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 bg-foreground/[0.03] text-foreground hover:bg-foreground/[0.07]",
                  )}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {/* Section 1 */}
              <div className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="jlpt-s1" className="text-sm font-bold text-foreground">
                    {rule.sections[0].label}
                  </label>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Liệt &lt; {rule.sections[0].minPass}
                  </span>
                </div>
                <input
                  id="jlpt-s1"
                  type="number"
                  min={0}
                  max={isTwoSection ? 120 : 60}
                  value={s1}
                  onChange={(e) =>
                    setS1(
                      Math.min(
                        isTwoSection ? 120 : 60,
                        Math.max(0, parseInt(e.target.value || "0", 10)),
                      ),
                    )
                  }
                  className="mt-2 min-h-11 w-full rounded-xl border border-border/70 bg-background px-3 font-heading text-lg font-bold text-foreground outline-none focus:border-primary"
                />
              </div>

              {/* Section 2 */}
              <div className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="jlpt-s2" className="text-sm font-bold text-foreground">
                    {rule.sections[1].label}
                  </label>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Liệt &lt; {rule.sections[1].minPass}
                  </span>
                </div>
                <input
                  id="jlpt-s2"
                  type="number"
                  min={0}
                  max={60}
                  value={s2}
                  onChange={(e) =>
                    setS2(Math.min(60, Math.max(0, parseInt(e.target.value || "0", 10))))
                  }
                  className="mt-2 min-h-11 w-full rounded-xl border border-border/70 bg-background px-3 font-heading text-lg font-bold text-foreground outline-none focus:border-primary"
                />
              </div>

              {/* Section 3 (N3/N2/N1 only) */}
              {!isTwoSection && rule.sections[2] && (
                <div className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="jlpt-s3" className="text-sm font-bold text-foreground">
                      {rule.sections[2].label}
                    </label>
                    <span className="text-xs font-semibold text-muted-foreground">
                      Liệt &lt; {rule.sections[2].minPass}
                    </span>
                  </div>
                  <input
                    id="jlpt-s3"
                    type="number"
                    min={0}
                    max={60}
                    value={s3}
                    onChange={(e) =>
                      setS3(Math.min(60, Math.max(0, parseInt(e.target.value || "0", 10))))
                    }
                    className="mt-2 min-h-11 w-full rounded-xl border border-border/70 bg-background px-3 font-heading text-lg font-bold text-foreground outline-none focus:border-primary"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right JLPT Result */}
          <div className="flex flex-col justify-between space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <Badge className="bg-primary/15 text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>JLPT {jlptLevel} • {jlptResult.cefr}</span>
                </Badge>
                <span className="text-xs font-semibold text-muted-foreground">
                  Điểm đỗ: ≥ {jlptResult.totalPass}/180
                </span>
              </div>

              <div className="rounded-2xl bg-foreground/[0.04] p-5 text-center dark:bg-foreground/[0.06]">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tổng điểm JLPT {jlptLevel}
                </p>
                <p className="mt-1 font-heading text-5xl font-extrabold text-primary">
                  {jlptResult.total} <span className="text-xl text-muted-foreground">/ 180</span>
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-background/80 px-3.5 py-1.5 text-sm font-bold">
                  {jlptResult.passed ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-primary">ĐẠT CHỨNG CHỈ {jlptLevel}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="text-destructive">CHƯA ĐẠT {jlptLevel}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-foreground/[0.04] p-4 text-xs leading-relaxed text-muted-foreground dark:bg-foreground/[0.06] space-y-1.5">
                <p>
                  • Điều kiện tổng điểm: <strong>{jlptResult.total}</strong> / {jlptResult.totalPass}{" "}
                  ({jlptResult.passedTotal ? "Đạt" : `Thiếu ${jlptResult.totalPass - jlptResult.total}đ`})
                </p>
                <p>
                  • Điều kiện điểm liệt thành phần:{" "}
                  {jlptResult.failedSections.length === 0 ? (
                    <strong className="text-primary">Không có phần thi bị điểm liệt</strong>
                  ) : (
                    <strong className="text-destructive">
                      Bị liệt ở: {jlptResult.failedSections.join("; ")}
                    </strong>
                  )}
                </p>
              </div>
            </div>

            <Link
              href="/de-thi/chung-chi/jlpt"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-heading font-bold text-primary-foreground hover:opacity-90"
            >
              <span>Luyện đề thi thử JLPT miễn phí</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left HSK inputs */}
          <div className="space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-7">
            <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              1. Chọn cấp độ HSK &amp; nhập điểm các kỹ năng
            </h2>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setHskLevelIdx(idx)}
                  className={cn(
                    "min-h-11 rounded-xl border text-xs font-bold cursor-pointer sm:text-sm",
                    hskLevelIdx === idx
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 bg-foreground/[0.03] text-foreground hover:bg-foreground/[0.07]",
                  )}
                >
                  HSK {idx + 1}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
                <label htmlFor="hsk-l" className="block text-xs font-bold text-foreground">
                  Nghe (0–100)
                </label>
                <input
                  id="hsk-l"
                  type="number"
                  min={0}
                  max={100}
                  value={hskL}
                  onChange={(e) => setHskL(Math.min(100, Math.max(0, parseInt(e.target.value || "0", 10))))}
                  className="mt-2 min-h-11 w-full rounded-xl border border-border/70 bg-background px-3 font-heading text-lg font-bold text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
                <label htmlFor="hsk-r" className="block text-xs font-bold text-foreground">
                  Đọc hiểu (0–100)
                </label>
                <input
                  id="hsk-r"
                  type="number"
                  min={0}
                  max={100}
                  value={hskR}
                  onChange={(e) => setHskR(Math.min(100, Math.max(0, parseInt(e.target.value || "0", 10))))}
                  className="mt-2 min-h-11 w-full rounded-xl border border-border/70 bg-background px-3 font-heading text-lg font-bold text-foreground outline-none focus:border-primary"
                />
              </div>

              <div
                className={cn(
                  "rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]",
                  hskResult.isHsk12 && "opacity-50",
                )}
              >
                <label htmlFor="hsk-w" className="block text-xs font-bold text-foreground">
                  Viết (0–100) {hskResult.isHsk12 ? "(Không thi)" : ""}
                </label>
                <input
                  id="hsk-w"
                  type="number"
                  min={0}
                  max={100}
                  disabled={hskResult.isHsk12}
                  value={hskResult.isHsk12 ? 0 : hskW}
                  onChange={(e) => setHskW(Math.min(100, Math.max(0, parseInt(e.target.value || "0", 10))))}
                  className="mt-2 min-h-11 w-full rounded-xl border border-border/70 bg-background px-3 font-heading text-lg font-bold text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* HSK 2.0 <-> 3.0 Mapping Table */}
            <div className="overflow-x-auto rounded-xl border border-border/60 bg-background/60 p-3">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-border/70 text-muted-foreground">
                    <th className="py-2 pr-3 font-semibold">HSK 2.0</th>
                    <th className="py-2 pr-3 font-semibold text-primary">HSK 3.0 (3 Bậc 9 Cấp)</th>
                    <th className="py-2 pr-3 font-semibold">CEFR</th>
                    <th className="py-2 font-semibold">Lượng từ vựng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {HSK_MAPPING.map((row, idx) => (
                    <tr key={row.hsk3} className={cn(idx === hskLevelIdx && "bg-primary/10 font-bold")}>
                      <td className="py-2 pr-3">{row.hsk2}</td>
                      <td className="py-2 pr-3 text-primary">{row.hsk3}</td>
                      <td className="py-2 pr-3">{row.cefr}</td>
                      <td className="py-2 text-muted-foreground">{row.vocab}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right HSK Result */}
          <div className="flex flex-col justify-between space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-5">
            <div className="space-y-4">
              <Badge className="bg-primary/15 text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>HSK {hskLevelIdx + 1} • CEFR {hskResult.mapping.cefr}</span>
              </Badge>

              <div className="rounded-2xl bg-foreground/[0.04] p-5 text-center dark:bg-foreground/[0.06]">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tổng điểm HSK {hskLevelIdx + 1}
                </p>
                <p className="mt-1 font-heading text-5xl font-extrabold text-primary">
                  {hskResult.total}{" "}
                  <span className="text-xl text-muted-foreground">/ {hskResult.maxTotal}</span>
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-background/80 px-3.5 py-1.5 text-sm font-bold">
                  {hskResult.passed ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-primary">ĐẠT HSK {hskLevelIdx + 1} (≥ {hskResult.passThreshold})</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="text-destructive">CHƯA ĐẠT (&lt; {hskResult.passThreshold})</span>
                    </>
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-foreground/[0.04] p-4 text-xs leading-relaxed text-muted-foreground dark:bg-foreground/[0.06] space-y-1.5">
                <p>
                  • Quy đổi HSK 3.0 tương ứng:{" "}
                  <strong className="text-foreground">{hskResult.mapping.hsk3}</strong>
                </p>
                <p>
                  • Quy mô từ vựng yêu cầu:{" "}
                  <strong className="text-foreground">{hskResult.mapping.vocab}</strong>
                </p>
                <p>
                  • Tham chiếu khung châu Âu:{" "}
                  <strong className="text-foreground">CEFR {hskResult.mapping.cefr}</strong>
                </p>
              </div>
            </div>

            <Link
              href="/de-thi/chung-chi/hsk"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-heading font-bold text-primary-foreground hover:opacity-90"
            >
              <span>Làm đề thi thử HSK miễn phí</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
