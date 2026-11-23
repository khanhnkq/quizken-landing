"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownAZ,
  Check,
  Copy,
  RotateCcw,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const SAMPLE_DIRTY_TEXT = `Câu 1: Trong không gian Oxyz,   vectơ nào dưới đây
là một vectơ pháp tuyến của mặt phẳng
(P): 2x - y + 3z - 1 = 0?
A. (2; 1; 3)     B. (2; -1; 3)

Nguyễn Minh Anh
Trần Hoàng Bảo
Lê Ngọc Châu
Đặng Khánh Linh
Bùi Gia Minh`;

function fixPdfLineBreaks(input: string): string {
  const blocks = input.replace(/\r\n/g, "\n").split(/\n\s*\n/);
  return blocks
    .map((block) => {
      const lines = block
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      const merged: string[] = [];
      for (const line of lines) {
        const isListOrQuestion =
          /^(?:Câu|Bài|[A-D]\.|[a-d]\)|[-*•]|\d+[.)])\s+/i.test(line);
        if (merged.length === 0 || isListOrQuestion) {
          merged.push(line);
        } else {
          merged[merged.length - 1] += " " + line;
        }
      }
      return merged.join("\n");
    })
    .join("\n\n");
}

function cleanSpaces(input: string): string {
  return input
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function toTitleCaseVi(input: string): string {
  return input
    .toLowerCase()
    .replace(/(^|[\s(\["'])(\p{L})/gu, (_, prefix: string, ch: string) => {
      return prefix + ch.toLocaleUpperCase("vi-VN");
    });
}

function toSentenceCaseVi(input: string): string {
  return input
    .toLowerCase()
    .replace(/(^\s*|[.!?]\s+|\n\s*)(\p{L})/gu, (_, prefix: string, ch: string) => {
      return prefix + ch.toLocaleUpperCase("vi-VN");
    });
}

function sortVietnameseLines(input: string, byLastName: boolean): string {
  const lines = input
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const getKey = (line: string) => {
    if (!byLastName) return line;
    const parts = line.split(/\s+/);
    const last = parts[parts.length - 1] || line;
    return `${last} ${line}`;
  };

  return lines.sort((a, b) => getKey(a).localeCompare(getKey(b), "vi")).join("\n");
}

function dedupeLines(input: string): string {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const rawLine of input.replace(/\r\n/g, "\n").split("\n")) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      out.push("");
      continue;
    }
    if (!seen.has(trimmed)) {
      seen.add(trimmed);
      out.push(rawLine);
    }
  }
  return out.join("\n");
}

export function TextNormalizerTool() {
  const [text, setText] = useState<string>(SAMPLE_DIRTY_TEXT);
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const lines = text ? text.split(/\r?\n/).length : 0;
    return { words, chars, lines };
  }, [text]);

  const applyTransform = (fn: (src: string) => string) => {
    setHistory((prev) => [text, ...prev.slice(0, 9)]);
    setText(fn(text));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const [last, ...rest] = history;
    setText(last);
    setHistory(rest);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-primary/15 text-primary">{stats.words} từ</Badge>
          <Badge>{stats.chars} ký tự</Badge>
          <Badge>{stats.lines} dòng</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] disabled:opacity-40 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Hoàn tác</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setHistory([]);
              setText(SAMPLE_DIRTY_TEXT);
            }}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Văn bản mẫu</span>
          </button>
          <button
            type="button"
            onClick={() => applyTransform(() => "")}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Xóa hết</span>
          </button>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => applyTransform(fixPdfLineBreaks)}
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-primary/15 px-3 text-xs font-bold text-primary hover:bg-primary/25 cursor-pointer"
        >
          <Wand2 className="h-3.5 w-3.5 shrink-0" />
          <span>Sửa ngắt dòng copy từ PDF</span>
        </button>
        <button
          type="button"
          onClick={() => applyTransform(cleanSpaces)}
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
        >
          <span>Xóa khoảng trắng &amp; dòng thừa</span>
        </button>
        <button
          type="button"
          onClick={() => applyTransform((s) => sortVietnameseLines(s, true))}
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
        >
          <ArrowDownAZ className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span>Xếp tên HS A–Z (theo Tên)</span>
        </button>
        <button
          type="button"
          onClick={() => applyTransform((s) => sortVietnameseLines(s, false))}
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
        >
          <span>Xếp dòng A–Z (theo ký tự đầu)</span>
        </button>

        <button
          type="button"
          onClick={() => applyTransform((s) => s.toLocaleUpperCase("vi-VN"))}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
        >
          CHỮ HOA TẤT CẢ
        </button>
        <button
          type="button"
          onClick={() => applyTransform((s) => s.toLocaleLowerCase("vi-VN"))}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
        >
          chữ thường tất cả
        </button>
        <button
          type="button"
          onClick={() => applyTransform(toTitleCaseVi)}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
        >
          Viết Hoa Đầu Mỗi Từ
        </button>
        <button
          type="button"
          onClick={() => applyTransform((s) => dedupeLines(toSentenceCaseVi(s)))}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
        >
          Viết hoa đầu câu + Xóa trùng
        </button>
      </div>

      <textarea
        aria-label="Nội dung văn bản cần chuẩn hóa"
        rows={12}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Dán đoạn văn bản copy từ PDF, danh sách lớp học hoặc đề thi vào đây..."
        className="w-full rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          Xử lý trực tiếp trên trình duyệt, giữ nguyên dấu tiếng Việt Unicode chuẩn NFC.
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 font-heading text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>Đã sao chép văn bản!</span>
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
  );
}
