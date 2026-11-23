"use client";

import { useMemo, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Check,
  Code2,
  Copy,
  Download,
  FileSpreadsheet,
  Table2,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type ColAlign = "left" | "center" | "right";
type OutputFormat = "markdown" | "html" | "latex" | "json";

const SAMPLE_GRADE_TSV = [
  "STT\tHọ và tên\tToán\tNgữ văn\tTiếng Anh\tĐiểm TB\tXếp loại",
  "1\tNguyễn Minh Anh\t9.2\t8.5\t9.0\t8.90\tTốt",
  "2\tTrần Quốc Bảo\t8.4\t7.8\t8.2\t8.13\tTốt",
  "3\tLê Thu Hà\t7.5\t8.0\t7.6\t7.70\tKhá",
  "4\tPhạm Gia Huy\t6.8\t6.5\t7.0\t6.77\tĐạt",
  "5\tHoàng Thảo My\t9.6\t8.8\t9.4\t9.27\tTốt",
].join("\n");

const SAMPLE_CSV = [
  '"Môn học","Số tiết/tuần","Hình thức kiểm tra","Hệ số"',
  '"Toán học",4,"Trắc nghiệm + Tự luận",1',
  '"Vật lí",3,"Thực hành & Trắc nghiệm",1',
  '"Tin học",2,"Dự án HTML/CSS, SQL",1',
].join("\n");

function parseDelimitedGrid(raw: string): { rows: string[][]; delimiter: "TSV" | "CSV" } {
  const normalized = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (!normalized.trim()) return { rows: [], delimiter: "TSV" };

  // Prefer TSV whenever tab character appears in raw text (standard Excel/Google Sheets clipboard)
  const hasTabs = normalized.includes("\t");
  if (hasTabs) {
    const rows = normalized
      .split("\n")
      .filter((line) => line.length > 0)
      .map((line) => line.split("\t").map((cell) => cell.trim()));
    return { rows, delimiter: "TSV" };
  }

  // RFC-4180 CSV parser supporting quoted fields & escaped quotes
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < normalized.length; i += 1) {
    const ch = normalized[i];
    const next = normalized[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        currentCell += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        currentCell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      currentRow.push(currentCell.trim());
      currentCell = "";
    } else if (ch === "\n") {
      currentRow.push(currentCell.trim());
      if (currentRow.some((c) => c !== "")) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += ch;
    }
  }

  currentRow.push(currentCell.trim());
  if (currentRow.some((c) => c !== "")) {
    rows.push(currentRow);
  }

  return { rows, delimiter: "CSV" };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeMarkdownCell(text: string): string {
  return text.replace(/\|/g, "\\|").replace(/\n+/g, " ");
}

function escapeLatexCell(text: string): string {
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([&%$#_{}])/g, "\\$1")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/\n+/g, " ");
}

function toMarkdownTable(
  grid: string[][],
  alignments: ColAlign[],
  hasHeader: boolean,
): string {
  if (grid.length === 0) return "";
  const colCount = grid[0].length;
  const alignToken = (align: ColAlign) => {
    if (align === "center") return ":---:";
    if (align === "right") return "---:";
    return ":---";
  };

  const formatRow = (row: string[]) =>
    `| ${row.map((cell) => escapeMarkdownCell(cell)).join(" | ")} |`;

  const headerRow = hasHeader
    ? grid[0]
    : Array.from({ length: colCount }, (_, idx) => `Cột ${idx + 1}`);
  const bodyRows = hasHeader ? grid.slice(1) : grid;

  const sepRow = `| ${Array.from({ length: colCount }, (_, idx) =>
    alignToken(alignments[idx] ?? "left"),
  ).join(" | ")} |`;

  return [formatRow(headerRow), sepRow, ...bodyRows.map(formatRow)].join("\n");
}

function toHtmlTable(
  grid: string[][],
  alignments: ColAlign[],
  hasHeader: boolean,
): string {
  if (grid.length === 0) return "";

  const renderCells = (row: string[], tag: "th" | "td", indent: string) =>
    row
      .map((cell, idx) => {
        const align = alignments[idx] ?? "left";
        const alignAttr = align === "left" ? "" : ` style="text-align: ${align};"`;
        return `${indent}<${tag}${alignAttr}>${escapeHtml(cell)}</${tag}>`;
      })
      .join("\n");

  const lines: string[] = ["<table>"];
  if (hasHeader && grid.length > 0) {
    lines.push("  <thead>");
    lines.push("    <tr>");
    lines.push(renderCells(grid[0], "th", "      "));
    lines.push("    </tr>");
    lines.push("  </thead>");
  }

  const bodyRows = hasHeader ? grid.slice(1) : grid;
  if (bodyRows.length > 0) {
    lines.push("  <tbody>");
    for (const row of bodyRows) {
      lines.push("    <tr>");
      lines.push(renderCells(row, "td", "      "));
      lines.push("    </tr>");
    }
    lines.push("  </tbody>");
  }
  lines.push("</table>");
  return lines.join("\n");
}

function toLatexTable(
  grid: string[][],
  alignments: ColAlign[],
  hasHeader: boolean,
): string {
  if (grid.length === 0) return "";
  const colCount = grid[0].length;
  const colSpec = Array.from({ length: colCount }, (_, idx) => {
    const a = alignments[idx] ?? "left";
    return a === "center" ? "c" : a === "right" ? "r" : "l";
  }).join("|");

  const lines: string[] = [
    `\\begin{tabular}{|${colSpec}|}`,
    "  \\hline",
  ];

  grid.forEach((row, rIdx) => {
    const escaped = row.map((cell) => escapeLatexCell(cell));
    const formatted =
      hasHeader && rIdx === 0
        ? escaped.map((c) => `\\textbf{${c}}`).join(" & ")
        : escaped.join(" & ");
    lines.push(`  ${formatted} \\\\`);
    if (hasHeader && rIdx === 0) {
      lines.push("  \\hline");
    }
  });

  lines.push("  \\hline");
  lines.push("\\end{tabular}");
  return lines.join("\n");
}

function toJsonArray(grid: string[][], hasHeader: boolean): string {
  if (grid.length === 0) return "[]";
  if (!hasHeader) {
    return JSON.stringify(grid, null, 2);
  }

  const rawHeaders = grid[0];
  const usedKeys = new Map<string, number>();
  const keys = rawHeaders.map((h, idx) => {
    const base = h.trim() || `column_${idx + 1}`;
    const count = usedKeys.get(base) ?? 0;
    usedKeys.set(base, count + 1);
    return count === 0 ? base : `${base}_${count + 1}`;
  });

  const objects = grid.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    keys.forEach((key, idx) => {
      obj[key] = row[idx] ?? "";
    });
    return obj;
  });

  return JSON.stringify(objects, null, 2);
}

const FORMAT_META: Record<
  OutputFormat,
  { label: string; ext: string; mime: string }
> = {
  markdown: { label: "Markdown (GFM)", ext: "md", mime: "text/markdown" },
  html: { label: "HTML <table>", ext: "html", mime: "text/html" },
  latex: { label: "LaTeX tabular", ext: "tex", mime: "text/plain" },
  json: { label: "JSON Array", ext: "json", mime: "application/json" },
};

export function ExcelTableConverterTool() {
  const [rawInput, setRawInput] = useState<string>(SAMPLE_GRADE_TSV);
  const [hasHeader, setHasHeader] = useState<boolean>(true);
  const [colAligns, setColAligns] = useState<ColAlign[]>([
    "center",
    "left",
    "right",
    "right",
    "right",
    "right",
    "center",
  ]);
  const [activeTab, setActiveTab] = useState<OutputFormat>("markdown");
  const [copied, setCopied] = useState<boolean>(false);

  const parsed = useMemo(() => parseDelimitedGrid(rawInput), [rawInput]);

  const normalizedGrid = useMemo(() => {
    if (parsed.rows.length === 0) return [];
    const maxCols = Math.max(...parsed.rows.map((r) => r.length));
    return parsed.rows.map((row) => {
      if (row.length === maxCols) return row;
      return [...row, ...Array(maxCols - row.length).fill("")];
    });
  }, [parsed.rows]);

  const colCount = normalizedGrid[0]?.length ?? 0;

  const effectiveAligns = useMemo<ColAlign[]>(
    () =>
      Array.from({ length: colCount }, (_, idx) => colAligns[idx] ?? "left"),
    [colAligns, colCount],
  );

  const outputCode = useMemo(() => {
    if (normalizedGrid.length === 0) return "";
    if (activeTab === "markdown") {
      return toMarkdownTable(normalizedGrid, effectiveAligns, hasHeader);
    }
    if (activeTab === "html") {
      return toHtmlTable(normalizedGrid, effectiveAligns, hasHeader);
    }
    if (activeTab === "latex") {
      return toLatexTable(normalizedGrid, effectiveAligns, hasHeader);
    }
    return toJsonArray(normalizedGrid, hasHeader);
  }, [normalizedGrid, effectiveAligns, hasHeader, activeTab]);

  const cycleColumnAlign = (colIdx: number) => {
    const order: ColAlign[] = ["left", "center", "right"];
    const current = effectiveAligns[colIdx] ?? "left";
    const nextAlign = order[(order.indexOf(current) + 1) % order.length];
    setColAligns((prev) => {
      const next = Array.from(
        { length: Math.max(colCount, prev.length) },
        (_, i) => prev[i] ?? "left",
      );
      next[colIdx] = nextAlign;
      return next;
    });
  };

  const setAllAlign = (align: ColAlign) => {
    setColAligns(Array(Math.max(colCount, 1)).fill(align));
  };

  const handleCopy = async () => {
    if (!outputCode) return;
    try {
      await navigator.clipboard.writeText(outputCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleDownload = () => {
    if (!outputCode) return;
    const meta = FORMAT_META[activeTab];
    const blob = new Blob([outputCode], { type: `${meta.mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bang-du-lieu.${meta.ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Input & Controls */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              Dán dữ liệu từ Excel / Google Sheets hoặc CSV
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setRawInput(SAMPLE_GRADE_TSV);
                setHasHeader(true);
                setColAligns([
                  "center",
                  "left",
                  "right",
                  "right",
                  "right",
                  "right",
                  "center",
                ]);
              }}
              className="min-h-9 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
            >
              Mẫu Bảng điểm (TSV)
            </button>
            <button
              type="button"
              onClick={() => {
                setRawInput(SAMPLE_CSV);
                setHasHeader(true);
                setColAligns(["left", "center", "left", "center"]);
              }}
              className="min-h-9 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
            >
              Mẫu CSV
            </button>
            <button
              type="button"
              onClick={() => setRawInput("")}
              className="inline-flex min-h-9 items-center gap-1 rounded-xl bg-destructive/10 px-3 text-xs font-semibold text-destructive hover:bg-destructive/20 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Xóa</span>
            </button>
          </div>
        </div>

        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          rows={6}
          placeholder="Copy vùng ô từ Excel hoặc Google Sheets (Ctrl+C / Cmd+C) rồi dán vào đây..."
          className="w-full rounded-xl border border-input bg-background p-3.5 font-mono text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer sm:text-sm">
              <input
                type="checkbox"
                checked={hasHeader}
                onChange={(e) => setHasHeader(e.target.checked)}
                className="h-4 w-4 rounded accent-primary cursor-pointer"
              />
              <span>Dòng đầu tiên là tiêu đề bảng</span>
            </label>

            {normalizedGrid.length > 0 && (
              <Badge>
                {parsed.delimiter} • {normalizedGrid.length} dòng × {colCount} cột
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground mr-1">Căn toàn bộ:</span>
            <button
              type="button"
              onClick={() => setAllAlign("left")}
              aria-label="Căn trái toàn bộ cột"
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-foreground/[0.06] px-2.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
            >
              <AlignLeft className="h-3.5 w-3.5" />
              <span>Trái</span>
            </button>
            <button
              type="button"
              onClick={() => setAllAlign("center")}
              aria-label="Căn giữa toàn bộ cột"
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-foreground/[0.06] px-2.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
            >
              <AlignCenter className="h-3.5 w-3.5" />
              <span>Giữa</span>
            </button>
            <button
              type="button"
              onClick={() => setAllAlign("right")}
              aria-label="Căn phải toàn bộ cột"
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-foreground/[0.06] px-2.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
            >
              <AlignRight className="h-3.5 w-3.5" />
              <span>Phải</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview + Output Tabs */}
      {normalizedGrid.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Live Table Preview */}
          <div className="xl:col-span-6 rounded-2xl border border-border/70 bg-card/85 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Table2 className="h-4 w-4 text-primary" />
                <h2 className="font-heading text-base font-bold text-foreground sm:text-lg">
                  Xem trước bảng (Nhấn vào tiêu đề cột để đổi căn lề)
                </h2>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border/70">
              <table className="w-full border-collapse text-xs sm:text-sm">
                {hasHeader && (
                  <thead className="bg-foreground/[0.05]">
                    <tr>
                      {normalizedGrid[0].map((cell, cIdx) => {
                        const align = effectiveAligns[cIdx] ?? "left";
                        return (
                          <th
                            key={`h-${cIdx}`}
                            style={{ textAlign: align }}
                            className="border-b border-border/70 px-3 py-2.5 font-bold text-foreground whitespace-nowrap"
                          >
                            <button
                              type="button"
                              onClick={() => cycleColumnAlign(cIdx)}
                              title="Nhấn để chuyển căn Trái / Giữa / Phải"
                              className="inline-flex items-center gap-1.5 hover:text-primary cursor-pointer"
                            >
                              <span>{cell || `Cột ${cIdx + 1}`}</span>
                              <span className="rounded bg-foreground/[0.08] px-1 py-0.5 text-[10px] font-mono text-muted-foreground">
                                {align === "left" ? "L" : align === "center" ? "C" : "R"}
                              </span>
                            </button>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {(hasHeader ? normalizedGrid.slice(1) : normalizedGrid).map(
                    (row, rIdx) => (
                      <tr
                        key={`r-${rIdx}`}
                        className="border-b border-border/50 last:border-b-0 hover:bg-foreground/[0.02]"
                      >
                        {row.map((cell, cIdx) => (
                          <td
                            key={`c-${rIdx}-${cIdx}`}
                            style={{ textAlign: effectiveAligns[cIdx] ?? "left" }}
                            className="px-3 py-2 text-foreground/90"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Code Output Panel */}
          <div className="xl:col-span-6 rounded-2xl border border-border/70 bg-card/85 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" />
                <h2 className="font-heading text-base font-bold text-foreground sm:text-lg">
                  Mã xuất ra
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>.{FORMAT_META[activeTab].ext}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(FORMAT_META) as OutputFormat[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "min-h-9 rounded-xl px-3 text-xs font-semibold transition-colors cursor-pointer",
                    activeTab === key
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.12]",
                  )}
                >
                  {FORMAT_META[key].label}
                </button>
              ))}
            </div>

            <pre className="max-h-[380px] overflow-auto rounded-xl border border-border/70 bg-foreground/[0.04] p-4 font-mono text-xs leading-relaxed text-foreground">
              <code>{outputCode}</code>
            </pre>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/70 bg-card/50 p-8 text-center text-sm text-muted-foreground">
          Dán dữ liệu bảng vào ô phía trên hoặc chọn <strong className="text-foreground">Mẫu Bảng điểm (TSV)</strong> để xem kết quả chuyển đổi tức thì.
        </div>
      )}
    </div>
  );
}
