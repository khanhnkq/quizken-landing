"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Eye, EyeOff, FileText, Printer, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type TopicId = "integers" | "fractions" | "linear" | "quadratic" | "system";
type QuestionCount = 10 | 20 | 30 | 40;

type MathQuestion = {
  index: number;
  prompt: string;
  answer: string;
};

const TOPICS: Array<{ id: TopicId; label: string; grade: string }> = [
  { id: "integers", label: "Số nguyên âm / dương", grade: "Lớp 6" },
  { id: "fractions", label: "Phân số tối giản", grade: "Lớp 6–7" },
  { id: "linear", label: "Tìm x & PT bậc nhất", grade: "Lớp 7–8" },
  { id: "quadratic", label: "PT bậc hai nghiệm nguyên", grade: "Lớp 9–10" },
  { id: "system", label: "Hệ PT bậc nhất 2 ẩn", grade: "Lớp 9–10" },
];

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function randNonZero(rng: () => number, min: number, max: number): number {
  let v = 0;
  while (v === 0) v = randInt(rng, min, max);
  return v;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const tmp = x % y;
    x = y;
    y = tmp;
  }
  return x || 1;
}

function formatFrac(num: number, den: number): string {
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den);
  const n = num / g;
  const d = den / g;
  if (d === 1) return `${n}`;
  return `${n}/${d}`;
}

function wrapNeg(n: number): string {
  return n < 0 ? `(${n})` : `${n}`;
}

function formatSignedTerm(coeff: number, variable: string, isFirst = false): string {
  if (coeff === 0) return "";
  const abs = Math.abs(coeff);
  const sign = coeff < 0 ? (isFirst ? "−" : " − ") : isFirst ? "" : " + ";
  const numPart = variable && abs === 1 ? "" : `${abs}`;
  return `${sign}${numPart}${variable}`;
}

function generateQuestions(
  topic: TopicId,
  count: QuestionCount,
  seed: number
): MathQuestion[] {
  const rng = mulberry32(seed + topic.length * 997);
  const list: MathQuestion[] = [];

  for (let i = 1; i <= count; i++) {
    if (topic === "integers") {
      const variant = i % 4;
      if (variant === 1) {
        const a = randNonZero(rng, -45, 45);
        const b = randNonZero(rng, -45, 45);
        const c = randNonZero(rng, -25, 25);
        list.push({
          index: i,
          prompt: `Tính: ${a} + ${wrapNeg(b)} − ${wrapNeg(c)}`,
          answer: `${a + b - c}`,
        });
      } else if (variant === 2) {
        const a = randNonZero(rng, -15, 15);
        const b = randNonZero(rng, -12, 12);
        const c = randNonZero(rng, -30, 30);
        list.push({
          index: i,
          prompt: `Tính: ${wrapNeg(a)} · ${wrapNeg(b)} + ${wrapNeg(c)}`,
          answer: `${a * b + c}`,
        });
      } else if (variant === 3) {
        const a = randNonZero(rng, -12, 12);
        const b = randInt(rng, -15, 15);
        const c = randInt(rng, -15, 15);
        list.push({
          index: i,
          prompt: `Tính hợp lý: ${wrapNeg(a)} · (${b} − ${wrapNeg(c)})`,
          answer: `${a * (b - c)}`,
        });
      } else {
        const base = randNonZero(rng, -5, 5);
        const exp = randInt(rng, 2, 3);
        const k = randNonZero(rng, -20, 20);
        const p = Math.pow(base, exp);
        list.push({
          index: i,
          prompt: `Tính: ${wrapNeg(base)}^${exp} + ${wrapNeg(k)}`,
          answer: `${p + k}`,
        });
      }
    } else if (topic === "fractions") {
      const d1 = randInt(rng, 2, 12);
      const d2 = randInt(rng, 2, 12);
      const n1 = randNonZero(rng, -11, 11);
      const n2 = randNonZero(rng, -11, 11);
      const op = i % 4;
      if (op === 1) {
        const num = n1 * d2 + n2 * d1;
        const den = d1 * d2;
        list.push({
          index: i,
          prompt: `Tính: (${formatFrac(n1, d1)}) + (${formatFrac(n2, d2)})`,
          answer: formatFrac(num, den),
        });
      } else if (op === 2) {
        const num = n1 * d2 - n2 * d1;
        const den = d1 * d2;
        list.push({
          index: i,
          prompt: `Tính: (${formatFrac(n1, d1)}) − (${formatFrac(n2, d2)})`,
          answer: formatFrac(num, den),
        });
      } else if (op === 3) {
        const num = n1 * n2;
        const den = d1 * d2;
        list.push({
          index: i,
          prompt: `Tính: (${formatFrac(n1, d1)}) · (${formatFrac(n2, d2)})`,
          answer: formatFrac(num, den),
        });
      } else {
        const num = n1 * d2;
        const den = d1 * n2;
        list.push({
          index: i,
          prompt: `Tính: (${formatFrac(n1, d1)}) : (${formatFrac(n2, d2)})`,
          answer: formatFrac(num, den),
        });
      }
    } else if (topic === "linear") {
      const xAns = randInt(rng, -12, 12);
      const a = randNonZero(rng, -8, 9);
      if (i % 2 === 1) {
        const b = randNonZero(rng, -20, 20);
        const c = a * xAns + b;
        list.push({
          index: i,
          prompt: `Tìm x: ${formatSignedTerm(a, "x", true)}${formatSignedTerm(b, "")} = ${c}`,
          answer: `x = ${xAns}`,
        });
      } else {
        let c = randNonZero(rng, -6, 6);
        if (c === a) c = a + 2;
        const b = randNonZero(rng, -15, 15);
        const d = (a - c) * xAns + b;
        list.push({
          index: i,
          prompt: `Giải PT: ${formatSignedTerm(a, "x", true)}${formatSignedTerm(b, "")} = ${formatSignedTerm(c, "x", true)}${formatSignedTerm(d, "")}`,
          answer: `x = ${xAns}`,
        });
      }
    } else if (topic === "quadratic") {
      // a(x - r1)(x - r2) = a x^2 - a(r1+r2)x + a*r1*r2 = 0
      const a = randInt(rng, 1, 2);
      const r1 = randInt(rng, -8, 8);
      const r2 = randInt(rng, -8, 8);
      const b = -a * (r1 + r2);
      const c = a * r1 * r2;
      const lhs = `${formatSignedTerm(a, "x²", true)}${formatSignedTerm(b, "x")}${formatSignedTerm(c, "")}`;
      const sorted = [r1, r2].sort((u, v) => u - v);
      const ans =
        sorted[0] === sorted[1]
          ? `x = ${sorted[0]} (nghiệm kép)`
          : `x ∈ {${sorted[0]}; ${sorted[1]}}`;
      list.push({
        index: i,
        prompt: `Giải PT: ${lhs} = 0`,
        answer: ans,
      });
    } else {
      // System of 2 linear equations with integer solution (x0, y0)
      const x0 = randInt(rng, -6, 6);
      const y0 = randInt(rng, -6, 6);
      const a1 = randNonZero(rng, -4, 4);
      const b1 = randNonZero(rng, -4, 4);
      let a2 = randNonZero(rng, -4, 4);
      let b2 = randNonZero(rng, -4, 4);
      if (a1 * b2 - a2 * b1 === 0) {
        a2 += 1;
        if (a2 === 0) a2 = 2;
        if (a1 * b2 - a2 * b1 === 0) b2 += 1;
      }
      const c1 = a1 * x0 + b1 * y0;
      const c2 = a2 * x0 + b2 * y0;
      const eq1 = `${formatSignedTerm(a1, "x", true)}${formatSignedTerm(b1, "y")} = ${c1}`;
      const eq2 = `${formatSignedTerm(a2, "x", true)}${formatSignedTerm(b2, "y")} = ${c2}`;
      list.push({
        index: i,
        prompt: `Giải hệ: { ${eq1} ; ${eq2} }`,
        answer: `(x; y) = (${x0}; ${y0})`,
      });
    }
  }

  return list;
}

export function MathWorksheetGeneratorTool() {
  const [topic, setTopic] = useState<TopicId>("quadratic");
  const [count, setCount] = useState<QuestionCount>(20);
  const [seed, setSeed] = useState<number>(2027);
  const [schoolTitle, setSchoolTitle] = useState<string>(
    "TRƯỜNG THCS / THPT QUIZKEN • TỔ TOÁN HỌC"
  );
  const [worksheetTitle, setWorksheetTitle] = useState<string>(
    "PHIẾU BÀI TẬP RÈN KỸ NĂNG TÍNH TOÁN"
  );
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const questions = useMemo(
    () => generateQuestions(topic, count, seed),
    [topic, count, seed]
  );

  const activeTopicMeta = useMemo(
    () => TOPICS.find((t) => t.id === topic) ?? TOPICS[0],
    [topic]
  );

  const handleCopyText = async () => {
    const lines = [
      schoolTitle,
      `${worksheetTitle} — Chuyên đề: ${activeTopicMeta.label} (Mã phiếu #${seed})`,
      "",
      ...questions.map((q) => `Câu ${q.index}. ${q.prompt}`),
    ];
    if (showAnswerKey) {
      lines.push("", "--- BẢNG ĐÁP ÁN ---");
      lines.push(...questions.map((q) => `Câu ${q.index}: ${q.answer}`));
    }
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          body > header,
          body > footer,
          .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          #math-worksheet-sheet {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            background: #ffffff !important;
          }
          .worksheet-answer-break {
            break-before: page;
            page-break-before: always;
          }
        }
      `}</style>

      {/* Controls Card */}
      <div className="no-print rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/15 text-primary">
              <FileText className="h-3.5 w-3.5" />
              <span>Sinh đề có đáp án chuẩn xác</span>
            </Badge>
            <Badge>Mã phiếu #{seed}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSeed((s) => ((s * 37 + 13) % 9000) + 1000)}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border/70 bg-background/70 px-3.5 text-xs font-semibold text-foreground hover:border-primary/60 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Đổi bộ số mới</span>
            </button>
            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border/70 bg-background/70 px-3.5 text-xs font-semibold text-foreground hover:border-primary/60 cursor-pointer"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>{copied ? "Đã sao chép!" : "Copy nội dung"}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>In / Xuất PDF A4</span>
            </button>
          </div>
        </div>

        {/* Topic Selector */}
        <div className="space-y-2">
          <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Chọn dạng bài tập
          </span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {TOPICS.map((t) => {
              const active = t.id === topic;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTopic(t.id)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-left transition-all cursor-pointer",
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border/70 bg-background/70 text-foreground hover:border-primary/50"
                  )}
                >
                  <div className="text-xs font-bold">{t.label}</div>
                  <div
                    className={cn(
                      "text-[11px]",
                      active ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}
                  >
                    {t.grade}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Options Row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-4 space-y-1">
            <label
              htmlFor="ws-school"
              className="text-xs font-semibold text-muted-foreground"
            >
              Tên trường / Lớp / Tổ chuyên môn
            </label>
            <input
              id="ws-school"
              type="text"
              value={schoolTitle}
              onChange={(e) => setSchoolTitle(e.target.value)}
              className="w-full min-h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="md:col-span-4 space-y-1">
            <label
              htmlFor="ws-title"
              className="text-xs font-semibold text-muted-foreground"
            >
              Tiêu đề Phiếu bài tập
            </label>
            <input
              id="ws-title"
              type="text"
              value={worksheetTitle}
              onChange={(e) => setWorksheetTitle(e.target.value)}
              className="w-full min-h-10 rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <span className="block text-xs font-semibold text-muted-foreground">
              Số câu hỏi
            </span>
            <div className="flex gap-1">
              {([10, 20, 30, 40] as QuestionCount[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCount(c)}
                  className={cn(
                    "flex-1 min-h-10 rounded-lg border text-xs font-bold cursor-pointer",
                    count === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-1">
            <span className="block text-xs font-semibold text-muted-foreground">
              Đáp án
            </span>
            <button
              type="button"
              onClick={() => setShowAnswerKey((v) => !v)}
              className={cn(
                "w-full min-h-10 inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 text-xs font-semibold cursor-pointer",
                showAnswerKey
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-border bg-background text-muted-foreground"
              )}
            >
              {showAnswerKey ? (
                <Eye className="h-3.5 w-3.5" />
              ) : (
                <EyeOff className="h-3.5 w-3.5" />
              )}
              <span>{showAnswerKey ? "Hiện đáp án" : "Đang ẩn"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable A4 Worksheet Preview */}
      <div
        id="math-worksheet-sheet"
        className="rounded-2xl border border-border/70 bg-white p-6 sm:p-10 text-slate-900 shadow-sm space-y-6"
      >
        {/* Header */}
        <div className="border-b-2 border-slate-800 pb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {schoolTitle}
            </p>
            <h2 className="font-heading text-xl font-extrabold text-slate-950 sm:text-2xl">
              {worksheetTitle}
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              Chuyên đề: {activeTopicMeta.label} ({activeTopicMeta.grade}) • Mã phiếu #{seed} • {count} bài
            </p>
          </div>
          <div className="border border-slate-400 rounded-lg px-4 py-2 text-xs space-y-1 min-w-[220px]">
            <div>Họ và tên: ........................................</div>
            <div>Lớp: ................... Điểm: ....................</div>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          {questions.map((q) => (
            <div
              key={q.index}
              className="rounded-lg border border-slate-200 p-3 space-y-5"
            >
              <div className="text-sm font-semibold text-slate-900">
                <span className="font-bold">Câu {q.index}.</span>{" "}
                <span className="font-mono">{q.prompt}</span>
              </div>
              <div className="border-b border-dashed border-slate-300 pt-2" />
              <div className="border-b border-dashed border-slate-300 pt-1" />
            </div>
          ))}
        </div>

        {/* Optional Answer Key */}
        {showAnswerKey && (
          <div className="worksheet-answer-break border-t-2 border-slate-800 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-extrabold uppercase text-slate-950">
                Bảng Đáp Án Tham Khảo — Mã phiếu #{seed}
              </h3>
              <span className="text-xs text-slate-500">
                Tạo miễn phí tại QuizKen.com
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
              {questions.map((q) => (
                <div
                  key={q.index}
                  className="rounded border border-slate-300 bg-slate-50 px-2.5 py-1.5 font-mono text-xs text-slate-900"
                >
                  <strong>{q.index}.</strong> {q.answer}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
