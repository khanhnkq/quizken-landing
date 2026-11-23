"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Copy,
  Download,
  FileText,
  Printer,
  RefreshCw,
  Shuffle,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { appLink } from "@/lib/site";
import { cn } from "@/lib/utils";

type ParsedQuestion = {
  id: number;
  stem: string;
  options: [string, string, string, string];
  correctIndex: number; // 0..3, -1 if undetected
};

type ShuffledExam = {
  code: string;
  questions: Array<{
    number: number;
    stem: string;
    options: [string, string, string, string];
    correctLetter: "A" | "B" | "C" | "D" | "?";
  }>;
};

const SAMPLE_EXAM_TEXT = `Câu 1: Hàm số y = x^3 - 3x + 2 đạt cực đại tại điểm nào sau đây?
*A. x = -1
B. x = 1
C. x = 0
D. x = 2

Câu 2: Trong không gian Oxyz, vectơ pháp tuyến của mặt phẳng (P): 2x - y + 3z - 5 = 0 là:
A. (2; 1; 3)
*B. (2; -1; 3)
C. (2; -1; -5)
D. (-1; 3; -5)

Câu 3: Nguyên hàm của hàm số f(x) = cos(2x) là:
A. 2sin(2x) + C
B. -1/2 sin(2x) + C
*C. 1/2 sin(2x) + C
D. sin(2x) + C

Câu 4: Giá trị của giới hạn lim (2n + 1) / (n - 3) khi n tiến ra vô cực bằng:
A. 1
B. -1/3
C. 0
*D. 2

Câu 5: Tập xác định của hàm số y = log_2(x - 3) là:
A. [3; +∞)
*B. (3; +∞)
C. (-∞; 3)
D. R \\ {3}

Câu 6: Cho cấp số cộng (u_n) với u_1 = 3 và công sai d = 4. Giá trị của u_5 bằng:
A. 15
B. 23
*C. 19
D. 16`;

const EXAM_CODES = ["101", "102", "103", "104"] as const;
const LETTERS = ["A", "B", "C", "D"] as const;

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithRng<T>(arr: T[], rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function parseQuestions(raw: string): ParsedQuestion[] {
  const normalized = raw.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  // Split blocks starting with Câu X: / Câu X. / Bài X: / X.
  const lines = normalized.split("\n");
  const blocks: string[] = [];
  let current: string[] = [];

  const questionStartRe = /^(?:Câu|Bài|Question)\s*\d+\s*[:.)-]|\d+\s*[.)]\s+\S/i;

  for (const line of lines) {
    const trimmed = line.trim();
    if (questionStartRe.test(trimmed) && current.length > 0) {
      blocks.push(current.join("\n"));
      current = [trimmed];
    } else {
      current.push(trimmed);
    }
  }
  if (current.length > 0) {
    blocks.push(current.join("\n"));
  }

  const parsed: ParsedQuestion[] = [];

  blocks.forEach((block, idx) => {
    // Check explicit [Đáp án: A] or Đáp án: B inside block
    let explicitAnswerIdx = -1;
    const explicitMatch = block.match(
      /(?:\[?\s*Đáp\s*án\s*[:\-]\s*([A-D])\s*\]?)/i,
    );
    if (explicitMatch) {
      explicitAnswerIdx = LETTERS.indexOf(
        explicitMatch[1].toUpperCase() as "A" | "B" | "C" | "D",
      );
    }
    const cleanBlock = block
      .replace(/(?:\[?\s*Đáp\s*án\s*[:\-]\s*[A-D]\s*\]?)/gi, "")
      .trim();

    // Find options A. B. C. D. (either start of line or inline separated by whitespace)
    const optionMarkerRe = /(?:^|\s)(\*?[A-D]\*?)\s*[.)]\s+/g;
    const matches = [...cleanBlock.matchAll(optionMarkerRe)];

    if (matches.length < 4) return;

    // Use last 4 A/B/C/D markers in case stem mentions A. or something, or match A, B, C, D in order
    const firstFour = matches.slice(0, 4);
    const stemRaw = cleanBlock
      .slice(0, firstFour[0].index)
      .replace(/^(?:Câu|Bài|Question)\s*\d+\s*[:.)-]\s*|\d+\s*[.)]\s+/i, "")
      .trim();

    const optTexts: string[] = [];
    let starAnswerIdx = -1;

    for (let i = 0; i < 4; i++) {
      const m = firstFour[i];
      const markerText = m[1];
      const startContent = (m.index ?? 0) + m[0].length;
      const endContent =
        i < 3 ? (firstFour[i + 1].index ?? cleanBlock.length) : cleanBlock.length;
      let text = cleanBlock.slice(startContent, endContent).trim();

      const hasStar = markerText.includes("*") || text.startsWith("*");
      if (hasStar) {
        starAnswerIdx = i;
        text = text.replace(/^\*+\s*/, "").trim();
      }
      optTexts.push(text);
    }

    if (stemRaw && optTexts.length === 4) {
      parsed.push({
        id: idx + 1,
        stem: stemRaw,
        options: [optTexts[0], optTexts[1], optTexts[2], optTexts[3]],
        correctIndex: starAnswerIdx >= 0 ? starAnswerIdx : explicitAnswerIdx,
      });
    }
  });

  return parsed;
}

function formatExamAsText(exam: ShuffledExam, includeKey: boolean): string {
  const header = `ĐỀ THI TRẮC NGHIỆM - MÃ ĐỀ ${exam.code}\n${"=".repeat(42)}\n\n`;
  const body = exam.questions
    .map(
      (q) =>
        `Câu ${q.number}: ${q.stem}\nA. ${q.options[0]}\nB. ${q.options[1]}\nC. ${q.options[2]}\nD. ${q.options[3]}`,
    )
    .join("\n\n");

  if (!includeKey) return header + body;

  const keyLines = exam.questions
    .map((q) => `${q.number}.${q.correctLetter}`)
    .join("   ");

  return `${header}${body}\n\n${"-".repeat(42)}\nĐÁP ÁN MÃ ĐỀ ${exam.code}:\n${keyLines}\n`;
}

export function ExamShufflerTool() {
  const [rawText, setRawText] = useState<string>(SAMPLE_EXAM_TEXT);
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(true);
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(true);
  const [seedOffset, setSeedOffset] = useState<number>(1);
  const [activePreview, setActivePreview] = useState<string>("101");
  const [copiedMode, setCopiedMode] = useState<"none" | "exam" | "key">("none");

  const parsedQuestions = useMemo(() => parseQuestions(rawText), [rawText]);

  const missingAnswerCount = useMemo(
    () => parsedQuestions.filter((q) => q.correctIndex === -1).length,
    [parsedQuestions],
  );

  const generatedExams: ShuffledExam[] = useMemo(() => {
    if (parsedQuestions.length === 0) return [];

    return EXAM_CODES.map((code) => {
      const codeSeed = parseInt(code, 10) + seedOffset * 7919;
      const rng = mulberry32(codeSeed);

      const orderedQuestions = shuffleQuestions
        ? shuffleWithRng(parsedQuestions, rng)
        : [...parsedQuestions];

      const formattedQuestions = orderedQuestions.map((q, idx) => {
        const optionItems = q.options.map((text, optIdx) => ({
          text,
          isCorrect: optIdx === q.correctIndex,
        }));

        const finalOpts = shuffleOptions
          ? shuffleWithRng(optionItems, rng)
          : optionItems;

        const newCorrectIdx = finalOpts.findIndex((o) => o.isCorrect);

        return {
          number: idx + 1,
          stem: q.stem,
          options: [
            finalOpts[0].text,
            finalOpts[1].text,
            finalOpts[2].text,
            finalOpts[3].text,
          ] as [string, string, string, string],
          correctLetter:
            newCorrectIdx >= 0 ? LETTERS[newCorrectIdx] : ("?" as const),
        };
      });

      return {
        code,
        questions: formattedQuestions,
      };
    });
  }, [parsedQuestions, shuffleQuestions, shuffleOptions, seedOffset]);

  const currentExam =
    generatedExams.find((e) => e.code === activePreview) ?? generatedExams[0];

  const handleCopyExam = async () => {
    if (!currentExam) return;
    try {
      await navigator.clipboard.writeText(formatExamAsText(currentExam, true));
      setCopiedMode("exam");
      setTimeout(() => setCopiedMode("none"), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyMasterKey = async () => {
    if (generatedExams.length === 0) return;
    const rows = parsedQuestions.map((_, i) => {
      const cells = generatedExams.map(
        (ex) => `${ex.code}: ${ex.questions[i]?.correctLetter ?? "?"}`,
      );
      return `Câu ${i + 1}: ${cells.join(" | ")}`;
    });
    try {
      await navigator.clipboard.writeText(
        `BẢNG ĐÁP ÁN TỔNG (MÃ ĐỀ 101 - 104)\n${rows.join("\n")}`,
      );
      setCopiedMode("key");
      setTimeout(() => setCopiedMode("none"), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownloadTxt = () => {
    if (generatedExams.length === 0) return;
    const content = generatedExams
      .map((ex) => formatExamAsText(ex, true))
      .join("\n\n==========================================\n\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tron-de-4-ma-101-104-quizken.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPrintableHtml = () => {
    if (generatedExams.length === 0) return;
    const escapeHtml = (s: string) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const examSections = generatedExams
      .map(
        (ex) => `
      <section class="exam-page">
        <h2>ĐỀ KIỂM TRA TRẮC NGHIỆM — MÃ ĐỀ ${ex.code}</h2>
        <p class="meta">Họ và tên: ................................................................. Lớp: ...................... SBD: ......................</p>
        <div class="questions">
          ${ex.questions
            .map(
              (q) => `
            <div class="q">
              <div class="stem"><strong>Câu ${q.number}:</strong> ${escapeHtml(q.stem)}</div>
              <div class="opts">
                <span><strong>A.</strong> ${escapeHtml(q.options[0])}</span>
                <span><strong>B.</strong> ${escapeHtml(q.options[1])}</span>
                <span><strong>C.</strong> ${escapeHtml(q.options[2])}</span>
                <span><strong>D.</strong> ${escapeHtml(q.options[3])}</span>
              </div>
            </div>`,
            )
            .join("")}
        </div>
      </section>`,
      )
      .join("");

    const keyTableRows = parsedQuestions
      .map(
        (_, i) => `
      <tr>
        <td>Câu ${i + 1}</td>
        ${generatedExams.map((ex) => `<td>${ex.questions[i]?.correctLetter ?? "?"}</td>`).join("")}
      </tr>`,
      )
      .join("");

    const html = `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <title>Bộ 4 Mã Đề 101-104 (QuizKen)</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.45; color: #111; }
    .exam-page { page-break-after: always; }
    h2 { text-align: center; margin: 0 0 8px; font-size: 14pt; }
    .meta { border-bottom: 1px solid #333; padding-bottom: 8px; margin-bottom: 14px; font-size: 10.5pt; }
    .q { margin-bottom: 11px; break-inside: avoid; }
    .opts { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; margin-top: 4px; padding-left: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #444; padding: 6px 10px; text-align: center; }
    th { background: #f2f2f2; }
  </style>
</head>
<body>
  ${examSections}
  <section>
    <h2>BẢNG ĐÁP ÁN TỔNG (MÃ ĐỀ 101 – 104)</h2>
    <table>
      <thead><tr><th>Câu</th>${generatedExams.map((e) => `<th>Mã ${e.code}</th>`).join("")}</tr></thead>
      <tbody>${keyTableRows}</tbody>
    </table>
  </section>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tron-de-in-A4-quizken.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Raw Input & Controls */}
        <div className="space-y-4 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-bold text-foreground">
              1. Dán nội dung đề gốc
            </h2>
            <button
              type="button"
              onClick={() => setRawText(SAMPLE_EXAM_TEXT)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground transition-colors hover:bg-foreground/[0.1] cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Nạp đề mẫu</span>
            </button>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Đặt dấu <code className="rounded bg-foreground/[0.08] px-1 text-foreground">*</code> trước đáp án đúng (VD: <code className="rounded bg-foreground/[0.08] px-1 text-foreground">*A.</code>) hoặc thêm <code className="rounded bg-foreground/[0.08] px-1 text-foreground">[Đáp án: A]</code> ở cuối câu.
          </p>

          <textarea
            aria-label="Nội dung câu hỏi trắc nghiệm gốc"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={13}
            placeholder={"Câu 1: Nội dung câu hỏi...\n*A. Đáp án đúng\nB. Đáp án sai\nC. Đáp án sai\nD. Đáp án sai"}
            className="w-full rounded-xl border border-border bg-background p-3.5 font-mono text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />

          {/* Parse Status */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-foreground/[0.04] px-3.5 py-2.5 text-xs dark:bg-foreground/[0.06]">
            <span>
              Đã nhận diện:{" "}
              <strong className="text-primary">
                {parsedQuestions.length} câu hỏi hợp lệ
              </strong>
            </span>
            {missingAnswerCount > 0 && (
              <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5" />
                {missingAnswerCount} câu chưa đánh dấu *
              </span>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2.5 pt-1">
            <label className="flex min-h-11 items-center justify-between gap-3 rounded-xl bg-foreground/[0.04] px-3.5 py-2 text-sm font-medium text-foreground cursor-pointer dark:bg-foreground/[0.06]">
              <span>Đảo thứ tự câu hỏi</span>
              <input
                type="checkbox"
                checked={shuffleQuestions}
                onChange={(e) => setShuffleQuestions(e.target.checked)}
                className="h-5 w-5 accent-emerald-500 cursor-pointer"
              />
            </label>
            <label className="flex min-h-11 items-center justify-between gap-3 rounded-xl bg-foreground/[0.04] px-3.5 py-2 text-sm font-medium text-foreground cursor-pointer dark:bg-foreground/[0.06]">
              <span>Đảo thứ tự đáp án A / B / C / D</span>
              <input
                type="checkbox"
                checked={shuffleOptions}
                onChange={(e) => setShuffleOptions(e.target.checked)}
                className="h-5 w-5 accent-emerald-500 cursor-pointer"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={() => setSeedOffset((s) => s + 1)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 font-heading text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Trộn lại bộ 4 mã đề mới</span>
          </button>
        </div>

        {/* Right: Preview 4 Exam Codes + Master Key */}
        <div className="space-y-4 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Shuffle className="h-4 w-4 text-primary" />
              <h2 className="font-heading text-lg font-bold text-foreground">
                2. Xem trước 4 mã đề &amp; Bảng đáp án
              </h2>
            </div>
            <Badge className="bg-primary/15 text-primary">
              Seed #{seedOffset}
            </Badge>
          </div>

          {/* Code Tabs */}
          <div className="flex flex-wrap gap-2">
            {EXAM_CODES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setActivePreview(code)}
                className={cn(
                  "min-h-11 rounded-xl px-4 font-heading text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
                  activePreview === code
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/[0.05] text-muted-foreground hover:text-foreground",
                )}
              >
                Mã đề {code}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setActivePreview("KEY")}
              className={cn(
                "min-h-11 rounded-xl px-4 font-heading text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
                activePreview === "KEY"
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/[0.05] text-muted-foreground hover:text-foreground",
              )}
            >
              Bảng Đáp Án Tổng
            </button>
          </div>

          {/* Preview Body */}
          {parsedQuestions.length === 0 ? (
            <div className="rounded-xl bg-foreground/[0.04] p-8 text-center text-sm text-muted-foreground dark:bg-foreground/[0.06]">
              Chưa tìm thấy câu hỏi hợp lệ. Mỗi câu cần bắt đầu bằng{" "}
              <code className="text-foreground">Câu 1:</code> và có đủ 4 lựa
              chọn <code className="text-foreground">A. B. C. D.</code>
            </div>
          ) : activePreview === "KEY" ? (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-border/60">
                <table className="w-full text-center text-sm border-collapse">
                  <thead>
                    <tr className="bg-foreground/[0.04] text-xs uppercase text-muted-foreground dark:bg-foreground/[0.06]">
                      <th className="py-3 px-3 font-semibold">Câu</th>
                      {EXAM_CODES.map((c) => (
                        <th key={c} className="py-3 px-3 font-semibold text-foreground">
                          Mã {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {parsedQuestions.map((_, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-semibold text-muted-foreground">
                          Câu {idx + 1}
                        </td>
                        {generatedExams.map((ex) => (
                          <td
                            key={ex.code}
                            className="py-2.5 px-3 font-heading font-bold text-primary"
                          >
                            {ex.questions[idx]?.correctLetter ?? "?"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={handleCopyMasterKey}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-foreground/[0.06] px-4 text-xs font-semibold text-foreground transition-colors hover:bg-foreground/[0.1] cursor-pointer"
              >
                {copiedMode === "key" ? (
                  <>
                    <Check className="h-4 w-4 text-primary" />
                    <span>Đã sao chép bảng đáp án!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Sao chép bảng đáp án tổng</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="max-h-[440px] space-y-3 overflow-y-auto pr-1">
              {currentExam?.questions.map((q) => (
                <div
                  key={q.number}
                  className="rounded-xl bg-foreground/[0.04] p-4 text-sm dark:bg-foreground/[0.06] space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-foreground">
                      <span className="text-primary">Câu {q.number}:</span>{" "}
                      {q.stem}
                    </p>
                    <Badge className="shrink-0 bg-primary/15 text-primary">
                      ĐA: {q.correctLetter}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 text-xs text-muted-foreground">
                    {q.options.map((opt, i) => {
                      const letter = LETTERS[i];
                      const isCorrect = letter === q.correctLetter;
                      return (
                        <div
                          key={letter}
                          className={cn(
                            "rounded-lg px-2.5 py-1.5",
                            isCorrect
                              ? "bg-primary/10 font-semibold text-foreground"
                              : "",
                          )}
                        >
                          <strong className="text-foreground">{letter}.</strong>{" "}
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Export Buttons */}
          {parsedQuestions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5 border-t border-border/60 pt-4">
              <button
                type="button"
                onClick={handleCopyExam}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-4 text-xs font-semibold text-foreground transition-colors hover:bg-foreground/[0.1] cursor-pointer"
              >
                {copiedMode === "exam" ? (
                  <>
                    <Check className="h-4 w-4 text-primary" />
                    <span>Đã chép Mã {currentExam?.code}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Chép Mã {currentExam?.code}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadTxt}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-4 text-xs font-semibold text-foreground transition-colors hover:bg-foreground/[0.1] cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Tải 4 mã đề (.TXT)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPrintableHtml}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Tải bản in A4 (.HTML)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Prominent Teacher Tools Upgrade Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-primary/40 bg-primary/10 p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <FileText className="h-4 w-4" />
            <span>Dành cho Giáo viên chuyên nghiệp</span>
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground sm:text-xl">
            Cần trộn đề giữ nguyên công thức Toán/Hóa, hình ảnh &amp; xuất thẳng Word (.docx)?
          </h3>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Sử dụng bộ công cụ Giáo viên trên QuizKen App hỗ trợ trọn vẹn 3 phần GDPT 2018 (Nhiều lựa chọn, Đúng/Sai, Trả lời ngắn), ma trận đề và xuất file Word/PDF chuẩn A4 chỉ trong 1 click.
          </p>
        </div>
        <Link
          href={appLink("/teacher/tools")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-heading text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <span>Mở QuizKen Teacher Tools</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
