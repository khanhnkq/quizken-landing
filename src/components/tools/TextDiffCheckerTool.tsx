"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  Check,
  Columns2,
  Copy,
  FileDiff,
  Rows3,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SAMPLE_A = `ĐỀ ÔN TẬP TIN HỌC 12 — CHƯƠNG 4
Câu 1: Thuộc tính CSS nào dùng để đổi màu chữ?
A. background-color
B. color
C. font-size
D. border-color

Câu 2: Thẻ HTML nào tạo liên kết siêu văn bản?
A. <link>
B. <a>
C. <href>`;

const SAMPLE_B = `ĐỀ ÔN TẬP TIN HỌC 12 — CHƯƠNG 4 (CẬP NHẬT)
Câu 1: Thuộc tính CSS nào dùng để đổi màu chữ của phần tử?
A. background-color
B. color
C. font-size
D. text-align

Câu 2: Thẻ HTML nào tạo liên kết siêu văn bản (hyperlink)?
A. <link>
B. <a>
C. <url>
D. <nav>`;

type DiffOp = {
  type: "equal" | "remove" | "add";
  value: string;
};

const MAX_LCS_CELLS = 400_000;

/**
 * Pure client-side LCS diff with common prefix/suffix trimming and matrix cap.
 */
function computeLcsDiff(aItems: string[], bItems: string[]): DiffOp[] {
  let start = 0;
  while (
    start < aItems.length &&
    start < bItems.length &&
    aItems[start] === bItems[start]
  ) {
    start++;
  }

  let endA = aItems.length - 1;
  let endB = bItems.length - 1;
  while (
    endA >= start &&
    endB >= start &&
    aItems[endA] === bItems[endB]
  ) {
    endA--;
    endB--;
  }

  const prefix: DiffOp[] = aItems
    .slice(0, start)
    .map((value) => ({ type: "equal", value }));
  const suffix: DiffOp[] = aItems
    .slice(endA + 1)
    .map((value) => ({ type: "equal", value }));

  const midA = aItems.slice(start, endA + 1);
  const midB = bItems.slice(start, endB + 1);
  const m = midA.length;
  const n = midB.length;

  if (m === 0 && n === 0) return prefix;
  if (m === 0) {
    return [
      ...prefix,
      ...midB.map((value): DiffOp => ({ type: "add", value })),
      ...suffix,
    ];
  }
  if (n === 0) {
    return [
      ...prefix,
      ...midA.map((value): DiffOp => ({ type: "remove", value })),
      ...suffix,
    ];
  }

  // Fallback for very large inputs to avoid excessive memory allocation
  if (m * n > MAX_LCS_CELLS) {
    const middle: DiffOp[] = [
      ...midA.map((value): DiffOp => ({ type: "remove", value })),
      ...midB.map((value): DiffOp => ({ type: "add", value })),
    ];
    return [...prefix, ...middle, ...suffix];
  }

  const cols = n + 1;
  const dp = new Int32Array((m + 1) * cols);

  for (let i = m - 1; i >= 0; i--) {
    const rowOffset = i * cols;
    const nextRowOffset = (i + 1) * cols;
    for (let j = n - 1; j >= 0; j--) {
      if (midA[i] === midB[j]) {
        dp[rowOffset + j] = dp[nextRowOffset + j + 1] + 1;
      } else {
        const down = dp[nextRowOffset + j];
        const right = dp[rowOffset + j + 1];
        dp[rowOffset + j] = down >= right ? down : right;
      }
    }
  }

  const middle: DiffOp[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (midA[i] === midB[j]) {
      middle.push({ type: "equal", value: midA[i] });
      i++;
      j++;
    } else if (dp[(i + 1) * cols + j] >= dp[i * cols + j + 1]) {
      middle.push({ type: "remove", value: midA[i] });
      i++;
    } else {
      middle.push({ type: "add", value: midB[j] });
      j++;
    }
  }
  while (i < m) {
    middle.push({ type: "remove", value: midA[i] });
    i++;
  }
  while (j < n) {
    middle.push({ type: "add", value: midB[j] });
    j++;
  }

  return [...prefix, ...middle, ...suffix];
}

function normalizeToken(
  token: string,
  ignoreWhitespace: boolean,
  ignoreCase: boolean,
): string {
  let out = token;
  if (ignoreWhitespace) {
    out = out.trim().replace(/\s+/g, " ");
  }
  if (ignoreCase) {
    out = out.toLowerCase();
  }
  return out;
}

type SideBySideRow = {
  leftNum: number | null;
  leftText: string | null;
  leftType: "equal" | "remove" | "empty";
  rightNum: number | null;
  rightText: string | null;
  rightType: "equal" | "add" | "empty";
};

export function TextDiffCheckerTool() {
  const [textA, setTextA] = useState<string>(SAMPLE_A);
  const [textB, setTextB] = useState<string>(SAMPLE_B);
  const [granularity, setGranularity] = useState<"line" | "word">("line");
  const [viewMode, setViewMode] = useState<"side-by-side" | "unified">("side-by-side");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [copiedDiff, setCopiedDiff] = useState(false);

  const analysis = useMemo(() => {
    if (granularity === "line") {
      const rawA = textA.split(/\r?\n/);
      const rawB = textB.split(/\r?\n/);
      const normA = rawA.map((l) => normalizeToken(l, ignoreWhitespace, ignoreCase));
      const normB = rawB.map((l) => normalizeToken(l, ignoreWhitespace, ignoreCase));
      const normOps = computeLcsDiff(normA, normB);

      // Reconstruct original text lines alongside diff ops
      let idxA = 0;
      let idxB = 0;
      const ops: DiffOp[] = normOps.map((op) => {
        if (op.type === "equal") {
          const val = rawA[idxA] ?? "";
          idxA++;
          idxB++;
          return { type: "equal", value: val };
        }
        if (op.type === "remove") {
          const val = rawA[idxA] ?? "";
          idxA++;
          return { type: "remove", value: val };
        }
        const val = rawB[idxB] ?? "";
        idxB++;
        return { type: "add", value: val };
      });

      let added = 0;
      let removed = 0;
      let equal = 0;
      for (const op of ops) {
        if (op.type === "add") added++;
        else if (op.type === "remove") removed++;
        else equal++;
      }
      const total = equal * 2 + added + removed;
      const similarity = total === 0 ? 100 : Math.round(((equal * 2) / total) * 100);

      // Build aligned side-by-side rows pairing adjacent removes + adds
      const sideRows: SideBySideRow[] = [];
      let lineNumA = 1;
      let lineNumB = 1;
      let k = 0;
      while (k < ops.length) {
        if (ops[k].type === "equal") {
          sideRows.push({
            leftNum: lineNumA++,
            leftText: ops[k].value,
            leftType: "equal",
            rightNum: lineNumB++,
            rightText: ops[k].value,
            rightType: "equal",
          });
          k++;
        } else {
          const removes: string[] = [];
          const adds: string[] = [];
          while (k < ops.length && ops[k].type === "remove") {
            removes.push(ops[k].value);
            k++;
          }
          while (k < ops.length && ops[k].type === "add") {
            adds.push(ops[k].value);
            k++;
          }
          const maxLen = Math.max(removes.length, adds.length);
          for (let r = 0; r < maxLen; r++) {
            const hasL = r < removes.length;
            const hasR = r < adds.length;
            sideRows.push({
              leftNum: hasL ? lineNumA++ : null,
              leftText: hasL ? removes[r] : null,
              leftType: hasL ? "remove" : "empty",
              rightNum: hasR ? lineNumB++ : null,
              rightText: hasR ? adds[r] : null,
              rightType: hasR ? "add" : "empty",
            });
          }
        }
      }

      return { ops, sideRows, added, removed, equal, similarity };
    }

    // Word-by-word mode
    const rawA = textA.trim() ? textA.trim().split(/\s+/) : [];
    const rawB = textB.trim() ? textB.trim().split(/\s+/) : [];
    const normA = rawA.map((w) => normalizeToken(w, ignoreWhitespace, ignoreCase));
    const normB = rawB.map((w) => normalizeToken(w, ignoreWhitespace, ignoreCase));
    const normOps = computeLcsDiff(normA, normB);

    let idxA = 0;
    let idxB = 0;
    const ops: DiffOp[] = normOps.map((op) => {
      if (op.type === "equal") {
        const val = rawA[idxA] ?? "";
        idxA++;
        idxB++;
        return { type: "equal", value: val };
      }
      if (op.type === "remove") {
        const val = rawA[idxA] ?? "";
        idxA++;
        return { type: "remove", value: val };
      }
      const val = rawB[idxB] ?? "";
      idxB++;
      return { type: "add", value: val };
    });

    let added = 0;
    let removed = 0;
    let equal = 0;
    for (const op of ops) {
      if (op.type === "add") added++;
      else if (op.type === "remove") removed++;
      else equal++;
    }
    const total = equal * 2 + added + removed;
    const similarity = total === 0 ? 100 : Math.round(((equal * 2) / total) * 100);

    return { ops, sideRows: [] as SideBySideRow[], added, removed, equal, similarity };
  }, [textA, textB, granularity, ignoreWhitespace, ignoreCase]);

  const handleSwap = () => {
    setTextA(textB);
    setTextB(textA);
  };

  const handleCopyUnified = async () => {
    const unified = analysis.ops
      .map((op) => {
        const prefix = op.type === "add" ? "+ " : op.type === "remove" ? "- " : "  ";
        return `${prefix}${op.value}`;
      })
      .join(granularity === "line" ? "\n" : " ");
    try {
      await navigator.clipboard.writeText(unified);
      setCopiedDiff(true);
      window.setTimeout(() => setCopiedDiff(false), 1800);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/85 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl bg-foreground/[0.05] p-1">
            <button
              type="button"
              onClick={() => setGranularity("line")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer",
                granularity === "line"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Theo dòng (Line)
            </button>
            <button
              type="button"
              onClick={() => setGranularity("word")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer",
                granularity === "word"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Theo từ (Word)
            </button>
          </div>

          {granularity === "line" && (
            <div className="inline-flex rounded-xl bg-foreground/[0.05] p-1">
              <button
                type="button"
                onClick={() => setViewMode("side-by-side")}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer",
                  viewMode === "side-by-side"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Columns2 className="h-3.5 w-3.5" />
                <span>Song song</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("unified")}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer",
                  viewMode === "unified"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Rows3 className="h-3.5 w-3.5" />
                <span>Gộp 1 cột</span>
              </button>
            </div>
          )}

          <label className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="accent-primary"
            />
            <span>Bỏ khoảng trắng thừa</span>
          </label>
          <label className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={(e) => setIgnoreCase(e.target.checked)}
              className="accent-primary"
            />
            <span>Bỏ qua HOA/thường</span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSwap}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-semibold hover:bg-foreground/[0.05] cursor-pointer"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            <span>Đổi A ↔ B</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTextA(SAMPLE_A);
              setTextB(SAMPLE_B);
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-semibold hover:bg-foreground/[0.05] cursor-pointer"
          >
            <FileDiff className="h-3.5 w-3.5" />
            <span>Nạp mẫu</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTextA("");
              setTextB("");
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Xóa hết</span>
          </button>
        </div>
      </div>

      {/* Text Inputs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card/85 p-4 space-y-2">
          <label
            htmlFor="diff-text-a"
            className="flex items-center justify-between text-xs font-bold text-foreground"
          >
            <span>Văn bản A (Bản gốc)</span>
            <span className="font-mono text-muted-foreground">
              {textA.split(/\r?\n/).length} dòng
            </span>
          </label>
          <textarea
            id="diff-text-a"
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            rows={10}
            spellCheck={false}
            placeholder="Dán văn bản hoặc mã nguồn gốc (A)..."
            className="w-full rounded-xl border border-border bg-background/90 p-3 font-mono text-xs leading-relaxed text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/85 p-4 space-y-2">
          <label
            htmlFor="diff-text-b"
            className="flex items-center justify-between text-xs font-bold text-foreground"
          >
            <span>Văn bản B (Bản chỉnh sửa)</span>
            <span className="font-mono text-muted-foreground">
              {textB.split(/\r?\n/).length} dòng
            </span>
          </label>
          <textarea
            id="diff-text-b"
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            rows={10}
            spellCheck={false}
            placeholder="Dán văn bản hoặc mã nguồn mới (B)..."
            className="w-full rounded-xl border border-border bg-background/90 p-3 font-mono text-xs leading-relaxed text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Diff Summary + Output */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="rounded-lg bg-primary/15 px-2.5 py-1.5 text-primary">
              Giống nhau: {analysis.similarity}%
            </span>
            <span className="rounded-lg bg-emerald-500/15 px-2.5 py-1.5 text-emerald-700 dark:text-emerald-300">
              + {analysis.added} {granularity === "line" ? "dòng" : "từ"} thêm
            </span>
            <span className="rounded-lg bg-rose-500/15 px-2.5 py-1.5 text-rose-700 dark:text-rose-300">
              - {analysis.removed} {granularity === "line" ? "dòng" : "từ"} xóa
            </span>
            <span className="rounded-lg bg-foreground/[0.06] px-2.5 py-1.5 text-muted-foreground">
              = {analysis.equal} giữ nguyên
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyUnified}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-semibold hover:bg-foreground/[0.05] cursor-pointer"
          >
            {copiedDiff ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span>{copiedDiff ? "Đã chép Diff" : "Chép kết quả Diff"}</span>
          </button>
        </div>

        {granularity === "line" && viewMode === "side-by-side" ? (
          <div className="overflow-x-auto rounded-xl border border-border/70 bg-background/90">
            <table className="w-full min-w-[680px] border-collapse font-mono text-xs">
              <thead className="bg-foreground/[0.04] text-left text-muted-foreground">
                <tr>
                  <th className="w-10 border-b border-r border-border/60 px-2 py-2 text-center">#</th>
                  <th className="w-1/2 border-b border-r border-border/60 px-3 py-2">Bản A (Gốc)</th>
                  <th className="w-10 border-b border-r border-border/60 px-2 py-2 text-center">#</th>
                  <th className="w-1/2 border-b border-border/60 px-3 py-2">Bản B (Mới)</th>
                </tr>
              </thead>
              <tbody>
                {analysis.sideRows.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/40 last:border-b-0">
                    <td className="border-r border-border/60 px-2 py-1 text-center text-muted-foreground select-none">
                      {row.leftNum ?? ""}
                    </td>
                    <td
                      className={cn(
                        "border-r border-border/60 px-3 py-1 whitespace-pre-wrap break-words",
                        row.leftType === "remove" &&
                          "bg-rose-500/15 text-rose-900 dark:text-rose-200",
                        row.leftType === "empty" && "bg-foreground/[0.02]",
                      )}
                    >
                      {row.leftType === "remove" ? `- ${row.leftText}` : row.leftText ?? ""}
                    </td>
                    <td className="border-r border-border/60 px-2 py-1 text-center text-muted-foreground select-none">
                      {row.rightNum ?? ""}
                    </td>
                    <td
                      className={cn(
                        "px-3 py-1 whitespace-pre-wrap break-words",
                        row.rightType === "add" &&
                          "bg-emerald-500/15 text-emerald-900 dark:text-emerald-200",
                        row.rightType === "empty" && "bg-foreground/[0.02]",
                      )}
                    >
                      {row.rightType === "add" ? `+ ${row.rightText}` : row.rightText ?? ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : granularity === "line" ? (
          <div className="max-h-[420px] overflow-auto rounded-xl border border-border/70 bg-background/90 font-mono text-xs">
            {analysis.ops.map((op, idx) => (
              <div
                key={idx}
                className={cn(
                  "border-b border-border/40 px-3 py-1 whitespace-pre-wrap break-words last:border-b-0",
                  op.type === "add" &&
                    "bg-emerald-500/15 text-emerald-900 dark:text-emerald-200",
                  op.type === "remove" &&
                    "bg-rose-500/15 text-rose-900 dark:text-rose-200",
                )}
              >
                <span className="mr-2 inline-block w-3 font-bold select-none">
                  {op.type === "add" ? "+" : op.type === "remove" ? "-" : " "}
                </span>
                {op.value || " "}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border/70 bg-background/90 p-4 font-mono text-xs leading-loose">
            {analysis.ops.map((op, idx) => (
              <span
                key={idx}
                className={cn(
                  "mr-1.5 inline-block rounded px-1 py-0.5",
                  op.type === "add" &&
                    "bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 font-semibold",
                  op.type === "remove" &&
                    "bg-rose-500/20 text-rose-900 dark:text-rose-200 line-through",
                )}
              >
                {op.value}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
