"use client";

import { useMemo, useRef, useState } from "react";
import { Copy, Check, Download, Sparkles, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface PaletteItem {
  label: string;
  snippet: string;
}

const PALETTE_GROUPS: Array<{ title: string; items: PaletteItem[] }> = [
  {
    title: "Phân số, Căn & Lũy thừa",
    items: [
      { label: "a/b", snippet: "\\frac{a}{b}" },
      { label: "√x", snippet: "\\sqrt{x}" },
      { label: "ⁿ√x", snippet: "\\sqrt[n]{x}" },
      { label: "x²", snippet: "x^{2}" },
      { label: "xₙ", snippet: "x_{n}" },
    ],
  },
  {
    title: "Giải tích (Tích phân, Lim, Tổng)",
    items: [
      { label: "∫ₐᵇ", snippet: "\\int_{a}^{b} f(x)\\,dx" },
      { label: "lim", snippet: "\\lim_{x \\to 0}" },
      { label: "∑", snippet: "\\sum_{i=1}^{n}" },
      { label: "f'(x)", snippet: "f'(x)" },
      { label: "∞", snippet: "\\infty" },
    ],
  },
  {
    title: "Ký hiệu Toán & Hy Lạp",
    items: [
      { label: "Δ", snippet: "\\Delta" },
      { label: "π", snippet: "\\pi" },
      { label: "α", snippet: "\\alpha" },
      { label: "β", snippet: "\\beta" },
      { label: "θ", snippet: "\\theta" },
      { label: "≤", snippet: "\\le" },
      { label: "≥", snippet: "\\ge" },
      { label: "≠", snippet: "\\neq" },
      { label: "±", snippet: "\\pm" },
      { label: "∈", snippet: "\\in" },
    ],
  },
  {
    title: "Hóa học & Vật lý",
    items: [
      { label: "→", snippet: "\\rightarrow" },
      { label: "⇌", snippet: "\\rightleftharpoons" },
      { label: "Ω", snippet: "\\Omega" },
      { label: "λ", snippet: "\\lambda" },
      { label: "ω", snippet: "\\omega" },
    ],
  },
];

const FORMULA_PRESETS = [
  {
    label: "Công thức nghiệm bậc 2",
    latex: "x_{1,2} = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
  },
  {
    label: "Tích phân từng phần",
    latex: "\\int_{a}^{b} u\\,dv = [u\\cdot v]_{a}^{b} - \\int_{a}^{b} v\\,du",
  },
  {
    label: "Dao động điều hòa",
    latex: "x(t) = A\\cos(\\omega t + \\varphi),\\quad T = 2\\pi\\sqrt{\\frac{m}{k}}",
  },
  {
    label: "Phản ứng Hóa học",
    latex: "2Fe + 6H_2SO_4 \\rightarrow Fe_2(SO_4)_3 + 3SO_2 + 6H_2O",
  },
];

const LATEX_SYMBOLS: Array<[RegExp, string]> = [
  [/\\rightleftharpoons/g, "⇌"],
  [/\\rightarrow|\\to/g, "→"],
  [/\\leftarrow/g, "←"],
  [/\\Leftrightarrow/g, "⇔"],
  [/\\Rightarrow/g, "⇒"],
  [/\\infty/g, "∞"],
  [/\\pm/g, "±"],
  [/\\mp/g, "∓"],
  [/\\times/g, "×"],
  [/\\cdot/g, "·"],
  [/\\div/g, "÷"],
  [/\\leq|\\le/g, "≤"],
  [/\\geq|\\ge/g, "≥"],
  [/\\neq/g, "≠"],
  [/\\approx/g, "≈"],
  [/\\equiv/g, "≡"],
  [/\\in/g, "∈"],
  [/\\notin/g, "∉"],
  [/\\subset/g, "⊂"],
  [/\\cup/g, "∪"],
  [/\\cap/g, "∩"],
  [/\\forall/g, "∀"],
  [/\\exists/g, "∃"],
  [/\\alpha/g, "α"],
  [/\\beta/g, "β"],
  [/\\gamma/g, "γ"],
  [/\\delta/g, "δ"],
  [/\\Delta/g, "Δ"],
  [/\\theta/g, "θ"],
  [/\\lambda/g, "λ"],
  [/\\mu/g, "μ"],
  [/\\pi/g, "π"],
  [/\\sigma/g, "σ"],
  [/\\varphi|\\phi/g, "φ"],
  [/\\omega/g, "ω"],
  [/\\Omega/g, "Ω"],
  [/\\int/g, "∫"],
  [/\\sum/g, "∑"],
  [/\\prod/g, "∏"],
  [/\\lim/g, "lim"],
  [/\\sin/g, "sin"],
  [/\\cos/g, "cos"],
  [/\\tan/g, "tan"],
  [/\\log/g, "log"],
  [/\\ln/g, "ln"],
  [/\\quad/g, "   "],
  [/\\,/g, " "],
  [/\\;/g, " "],
];

/**
 * Pure React JSX renderer for common LaTeX expressions (safe against XSS, zero eval).
 */
function RenderLatexNode({ expr }: { expr: string }) {
  const nodes: React.ReactNode[] = [];
  let s = expr;
  for (const [re, rep] of LATEX_SYMBOLS) {
    s = s.replace(re, rep);
  }

  let i = 0;
  let keyCounter = 0;

  const readBraced = (): string => {
    while (i < s.length && s[i] === " ") i++;
    if (s[i] === "{") {
      i++;
      let depth = 1;
      const start = i;
      while (i < s.length && depth > 0) {
        if (s[i] === "{") depth++;
        else if (s[i] === "}") depth--;
        i++;
      }
      return s.slice(start, i - 1);
    }
    if (i < s.length) {
      return s[i++];
    }
    return "";
  };

  while (i < s.length) {
    if (s.startsWith("\\frac", i)) {
      i += 5;
      const num = readBraced();
      const den = readBraced();
      nodes.push(
        <span
          key={keyCounter++}
          className="mx-1 inline-flex flex-col items-center align-middle leading-tight"
        >
          <span className="border-b border-current px-1.5 pb-0.5 text-[0.86em]">
            <RenderLatexNode expr={num} />
          </span>
          <span className="px-1.5 pt-0.5 text-[0.86em]">
            <RenderLatexNode expr={den} />
          </span>
        </span>
      );
      continue;
    }

    if (s.startsWith("\\sqrt", i)) {
      i += 5;
      let rootIdx = "";
      if (s[i] === "[") {
        i++;
        const end = s.indexOf("]", i);
        if (end !== -1) {
          rootIdx = s.slice(i, end);
          i = end + 1;
        }
      }
      const body = readBraced();
      nodes.push(
        <span key={keyCounter++} className="mx-0.5 inline-flex items-baseline">
          {rootIdx && (
            <sup className="mr-0.5 text-[0.65em] font-semibold">{rootIdx}</sup>
          )}
          <span className="text-[1.05em]">√</span>
          <span className="border-t border-current px-1 pt-0.5">
            <RenderLatexNode expr={body} />
          </span>
        </span>
      );
      continue;
    }

    if (s[i] === "^") {
      i++;
      const sup = readBraced();
      nodes.push(
        <sup key={keyCounter++} className="text-[0.72em] font-semibold">
          <RenderLatexNode expr={sup} />
        </sup>
      );
      continue;
    }

    if (s[i] === "_") {
      i++;
      const sub = readBraced();
      nodes.push(
        <sub key={keyCounter++} className="text-[0.72em] font-semibold">
          <RenderLatexNode expr={sub} />
        </sub>
      );
      continue;
    }

    if (s[i] === "{" || s[i] === "}") {
      i++;
      continue;
    }

    const start = i;
    while (
      i < s.length &&
      s[i] !== "^" &&
      s[i] !== "_" &&
      s[i] !== "{" &&
      s[i] !== "}" &&
      !s.startsWith("\\frac", i) &&
      !s.startsWith("\\sqrt", i)
    ) {
      i++;
    }
    nodes.push(<span key={keyCounter++}>{s.slice(start, i)}</span>);
  }

  return <>{nodes}</>;
}

export function LatexFormulaEditorTool() {
  const [latex, setLatex] = useState(FORMULA_PRESETS[0].latex);
  const [copiedMode, setCopiedMode] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const plainPreviewText = useMemo(() => {
    let out = latex;
    for (const [re, rep] of LATEX_SYMBOLS) out = out.replace(re, rep);
    return out.replace(/[{}]/g, "");
  }, [latex]);

  const insertSnippet = (snippet: string) => {
    const el = textareaRef.current;
    if (!el) {
      setLatex((prev) => `${prev}${prev ? " " : ""}${snippet}`);
      return;
    }
    const start = el.selectionStart ?? latex.length;
    const end = el.selectionEnd ?? latex.length;
    const next = latex.slice(0, start) + snippet + latex.slice(end);
    setLatex(next);
    setTimeout(() => {
      el.focus();
      const pos = start + snippet.length;
      el.setSelectionRange(pos, pos);
    }, 0);
  };

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMode(key);
      setTimeout(() => setCopiedMode(null), 1800);
    } catch {
      // ignore
    }
  };

  const handleDownloadSvg = () => {
    const escaped = plainPreviewText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const width = Math.max(420, escaped.length * 16 + 80);
    const svg = [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="120" viewBox="0 0 ${width} 120">`,
      `<rect width="${width}" height="120" rx="16" fill="#ffffff" stroke="#e2e8f0"/>`,
      `<text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Georgia, Cambria, serif" font-size="26" fill="#0f172a">${escaped}</text>`,
      `</svg>`,
    ].join("");
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quizken-formula.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Symbol Palette */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Bảng chèn nhanh ký hiệu Toán – Lý – Hóa
          </span>
          <div className="flex flex-wrap gap-1.5">
            {FORMULA_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setLatex(p.latex)}
                className={cn(
                  "min-h-8 cursor-pointer rounded-lg px-2.5 text-xs font-semibold transition-colors",
                  latex === p.latex
                    ? "bg-primary/15 text-primary"
                    : "bg-foreground/[0.05] text-muted-foreground hover:text-foreground"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {PALETTE_GROUPS.map((group) => (
            <div
              key={group.title}
              className="rounded-xl bg-foreground/[0.04] p-3 space-y-2 dark:bg-foreground/[0.06]"
            >
              <div className="text-[11px] font-bold text-muted-foreground">
                {group.title}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <button
                    key={item.snippet}
                    type="button"
                    onClick={() => insertSnippet(item.snippet)}
                    className="min-h-9 min-w-9 cursor-pointer rounded-lg bg-background px-2.5 text-xs font-bold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor + Live Preview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="latex-input"
              className="text-sm font-semibold text-foreground"
            >
              Mã nguồn LaTeX
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setLatex("")}
              className="gap-1.5 text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Xóa trắng
            </Button>
          </div>
          <textarea
            ref={textareaRef}
            id="latex-input"
            rows={5}
            value={latex}
            onChange={(e) => setLatex(e.target.value)}
            placeholder="Nhập LaTeX, VD: \frac{-b \pm \sqrt{\Delta}}{2a}"
            className="w-full rounded-xl border border-border/70 bg-background p-4 font-mono text-sm text-foreground focus:border-primary focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              disabled={!latex.trim()}
              onClick={() => handleCopy("inline", `$${latex.trim()}$`)}
              className="min-h-10 gap-1.5"
            >
              {copiedMode === "inline" ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Đã chép $...$
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Chép Inline ($...$)
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={!latex.trim()}
              onClick={() => handleCopy("block", `$$${latex.trim()}$$`)}
              className="min-h-10 gap-1.5"
            >
              {copiedMode === "block" ? (
                <>
                  <Check className="h-3.5 w-3.5 text-primary" /> Đã chép $$...$$
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Chép Block ($$...$$)
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/85 p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <Badge className="bg-primary/15 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Xem trước trực quan
            </Badge>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={!latex.trim()}
              onClick={handleDownloadSvg}
              className="min-h-9 gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              Tải ảnh SVG
            </Button>
          </div>

          <div className="flex min-h-[140px] items-center justify-center rounded-xl bg-foreground/[0.04] p-6 text-center font-serif text-xl text-foreground sm:text-2xl dark:bg-foreground/[0.06]">
            {latex.trim() ? (
              <RenderLatexNode expr={latex} />
            ) : (
              <span className="font-sans text-sm text-muted-foreground">
                Công thức sẽ hiển thị tại đây khi bạn nhập mã LaTeX...
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Mẹo: Bạn có thể dán trực tiếp công thức <code className="font-mono">$...$</code> vừa tạo vào đề thi trên QuizKen App hoặc tài liệu Word/Markdown.
          </p>
        </div>
      </div>
    </div>
  );
}
