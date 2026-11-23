"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  Braces,
  Check,
  CheckCircle2,
  Copy,
  Database,
  Download,
  FileSpreadsheet,
  Minimize2,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const SAMPLE_JSON_STUDENTS = `[
  {
    "ma_hs": "HS2027-01",
    "ho_ten": "Nguyễn Minh Anh",
    "lop": "12A1",
    "diem_tin": 9.5,
    "dat_chuan": true
  },
  {
    "ma_hs": "HS2027-02",
    "ho_ten": "Trần Quốc Bảo",
    "lop": "12A1",
    "diem_tin": 8.75,
    "dat_chuan": true
  },
  {
    "ma_hs": "HS2027-03",
    "ho_ten": "Lê Thảo Vy",
    "lop": "12A2",
    "diem_tin": 9.0,
    "dat_chuan": true
  }
]`;

const SAMPLE_JSON_CONFIG = `{"ky_thi":"THPT 2027","mon":"Tin học","cau_truc":{"phan_1":24,"phan_2":4,"thoi_gian_phut":50},"cong_khai":true}`;

const SQL_SAMPLES = [
  {
    label: "SELECT + JOIN (Thư viện)",
    sql: `select hs.ho_ten, s.ten_sach, ms.ngay_muon, ms.han_tra from muon_sach as ms inner join hoc_sinh as hs on ms.ma_hs = hs.ma_hs left join sach as s on ms.ma_sach = s.ma_sach where ms.trang_thai = 'dang_muon' and hs.lop = '11A1' order by ms.ngay_muon desc limit 20;`,
  },
  {
    label: "GROUP BY + HAVING (Điểm)",
    sql: `select lop, count(ma_hs) as si_so, avg(diem_tb) as diem_trung_binh from bang_diem where nam_hoc = '2026-2027' group by lop having avg(diem_tb) >= 8.0 order by diem_trung_binh desc;`,
  },
  {
    label: "INSERT / UPDATE CSDL",
    sql: `insert into hoc_sinh (ma_hs, ho_ten, lop, ngay_sinh) values ('HS1101', 'Phạm Gia Huy', '11A3', '2010-05-14'); update hoc_sinh set lop = '11A1' where ma_hs = 'HS1101';`,
  },
];

type JsonParseResult =
  | {
      ok: true;
      parsed: unknown;
      formatted: string;
      minified: string;
      csvRows: string[][] | null;
      csvText: string | null;
      stats: { type: string; topKeys: number; bytes: number };
    }
  | {
      ok: false;
      errorMessage: string;
    };

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const raw =
    typeof value === "object" ? JSON.stringify(value) : String(value);
  if (/[",\r\n]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

function jsonArrayToCsv(data: unknown): { rows: string[][]; text: string } | null {
  if (!Array.isArray(data) || data.length === 0) return null;
  const objects = data.filter(
    (item): item is Record<string, unknown> =>
      typeof item === "object" && item !== null && !Array.isArray(item),
  );
  if (objects.length !== data.length) return null;

  const headers: string[] = [];
  const headerSet = new Set<string>();
  for (const obj of objects) {
    for (const key of Object.keys(obj)) {
      if (!headerSet.has(key)) {
        headerSet.add(key);
        headers.push(key);
      }
    }
  }
  if (headers.length === 0) return null;

  const rows: string[][] = [headers];
  for (const obj of objects) {
    rows.push(
      headers.map((h) => {
        const val = obj[h];
        if (val === null || val === undefined) return "";
        return typeof val === "object" ? JSON.stringify(val) : String(val);
      }),
    );
  }

  const csvLines = [
    headers.map(escapeCsvCell).join(","),
    ...objects.map((obj) => headers.map((h) => escapeCsvCell(obj[h])).join(",")),
  ];

  return { rows, text: csvLines.join("\r\n") };
}

function analyzeJson(raw: string, indent: number | "\t"): JsonParseResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, errorMessage: "Vui lòng nhập chuỗi JSON để kiểm tra." };
  }
  try {
    const parsed: unknown = JSON.parse(trimmed);
    const formatted = JSON.stringify(parsed, null, indent);
    const minified = JSON.stringify(parsed);
    const csv = jsonArrayToCsv(parsed);
    const type = Array.isArray(parsed)
      ? `Array (${parsed.length} phần tử)`
      : parsed === null
        ? "null"
        : typeof parsed === "object"
          ? `Object (${Object.keys(parsed as Record<string, unknown>).length} khóa)`
          : typeof parsed;
    const topKeys = Array.isArray(parsed)
      ? parsed.length
      : parsed && typeof parsed === "object"
        ? Object.keys(parsed as Record<string, unknown>).length
        : 0;
    const bytes = new TextEncoder().encode(trimmed).length;
    return {
      ok: true,
      parsed,
      formatted,
      minified,
      csvRows: csv?.rows ?? null,
      csvText: csv?.text ?? null,
      stats: { type, topKeys, bytes },
    };
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Cú pháp JSON không hợp lệ.";
    return { ok: false, errorMessage: msg };
  }
}

type SqlToken =
  | { type: "string" | "comment" | "ident" | "word" | "punct" | "ws"; value: string };

const SQL_KEYWORDS = new Set([
  "SELECT",
  "DISTINCT",
  "FROM",
  "WHERE",
  "JOIN",
  "INNER",
  "LEFT",
  "RIGHT",
  "FULL",
  "OUTER",
  "CROSS",
  "ON",
  "AS",
  "AND",
  "OR",
  "NOT",
  "IN",
  "IS",
  "NULL",
  "LIKE",
  "BETWEEN",
  "GROUP",
  "BY",
  "HAVING",
  "ORDER",
  "ASC",
  "DESC",
  "LIMIT",
  "OFFSET",
  "INSERT",
  "INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE",
  "CREATE",
  "TABLE",
  "PRIMARY",
  "KEY",
  "FOREIGN",
  "REFERENCES",
  "ALTER",
  "ADD",
  "DROP",
  "UNION",
  "ALL",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
  "COUNT",
  "SUM",
  "AVG",
  "MIN",
  "MAX",
]);

const MAJOR_CLAUSES = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "JOIN",
  "INNER JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "FULL JOIN",
  "CROSS JOIN",
  "GROUP BY",
  "HAVING",
  "ORDER BY",
  "LIMIT",
  "OFFSET",
  "INSERT INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE FROM",
  "UNION",
  "UNION ALL",
]);

function tokenizeSql(sql: string): SqlToken[] {
  const tokens: SqlToken[] = [];
  let i = 0;
  const len = sql.length;

  while (i < len) {
    const ch = sql[i];
    const next = sql[i + 1] ?? "";

    // Whitespace
    if (/\s/.test(ch)) {
      let j = i + 1;
      while (j < len && /\s/.test(sql[j])) j++;
      tokens.push({ type: "ws", value: sql.slice(i, j) });
      i = j;
      continue;
    }

    // Line comment --
    if (ch === "-" && next === "-") {
      let j = i + 2;
      while (j < len && sql[j] !== "\n") j++;
      tokens.push({ type: "comment", value: sql.slice(i, j) });
      i = j;
      continue;
    }

    // Block comment /* ... */
    if (ch === "/" && next === "*") {
      const end = sql.indexOf("*/", i + 2);
      const j = end === -1 ? len : end + 2;
      tokens.push({ type: "comment", value: sql.slice(i, j) });
      i = j;
      continue;
    }

    // Single or double quoted string
    if (ch === "'" || ch === '"') {
      const quote = ch;
      let j = i + 1;
      while (j < len) {
        if (sql[j] === "\\" && j + 1 < len) {
          j += 2;
          continue;
        }
        if (sql[j] === quote) {
          if (sql[j + 1] === quote) {
            j += 2;
            continue;
          }
          j++;
          break;
        }
        j++;
      }
      tokens.push({ type: "string", value: sql.slice(i, j) });
      i = j;
      continue;
    }

    // Backtick identifier
    if (ch === "`") {
      const end = sql.indexOf("`", i + 1);
      const j = end === -1 ? len : end + 1;
      tokens.push({ type: "ident", value: sql.slice(i, j) });
      i = j;
      continue;
    }

    // Word / identifier / number
    if (/[A-Za-z0-9_.]/.test(ch)) {
      let j = i + 1;
      while (j < len && /[A-Za-z0-9_.]/.test(sql[j])) j++;
      tokens.push({ type: "word", value: sql.slice(i, j) });
      i = j;
      continue;
    }

    // Punctuation or operators
    tokens.push({ type: "punct", value: ch });
    i++;
  }

  return tokens;
}

function formatSql(raw: string): string {
  const tokens = tokenizeSql(raw).filter((t) => t.type !== "ws");
  if (tokens.length === 0) return "";

  const wordsUpper = tokens.map((t) =>
    t.type === "word" && SQL_KEYWORDS.has(t.value.toUpperCase())
      ? { ...t, value: t.value.toUpperCase(), isKeyword: true }
      : { ...t, isKeyword: false },
  );

  const lines: string[] = [];
  let current = "";
  let parenDepth = 0;

  const pushCurrent = () => {
    const trimmed = current.trim();
    if (trimmed) lines.push(trimmed);
    current = "";
  };

  for (let i = 0; i < wordsUpper.length; i++) {
    const tok = wordsUpper[i];
    const nextTok = wordsUpper[i + 1];

    if (tok.type === "punct" && tok.value === ";") {
      current = current.trimEnd() + ";";
      pushCurrent();
      lines.push("");
      continue;
    }

    if (tok.type === "punct" && tok.value === "(") {
      parenDepth++;
      current = current.trimEnd() + (current.endsWith(" ") || !current ? "(" : " (");
      continue;
    }

    if (tok.type === "punct" && tok.value === ")") {
      parenDepth = Math.max(0, parenDepth - 1);
      current = current.trimEnd() + ")";
      continue;
    }

    if (tok.type === "punct" && tok.value === ",") {
      current = current.trimEnd() + ",";
      if (parenDepth === 0) {
        pushCurrent();
        current = "  ";
      } else {
        current += " ";
      }
      continue;
    }

    // Check two-word major clauses at top level
    if (parenDepth === 0 && tok.isKeyword && nextTok?.isKeyword) {
      const pair = `${tok.value} ${nextTok.value}`;
      if (MAJOR_CLAUSES.has(pair)) {
        pushCurrent();
        current = pair + " ";
        i++;
        continue;
      }
    }

    if (parenDepth === 0 && tok.isKeyword && MAJOR_CLAUSES.has(tok.value)) {
      pushCurrent();
      current = tok.value + " ";
      continue;
    }

    if (
      parenDepth === 0 &&
      tok.isKeyword &&
      (tok.value === "AND" || tok.value === "OR" || tok.value === "ON")
    ) {
      pushCurrent();
      current = "  " + tok.value + " ";
      continue;
    }

    if (tok.type === "punct") {
      const noSpaceBefore = [".", ","].includes(tok.value);
      if (noSpaceBefore) {
        current = current.trimEnd() + tok.value + " ";
      } else {
        current += (current && !current.endsWith(" ") && !current.endsWith("(") ? " " : "") + tok.value + " ";
      }
    } else {
      const needsSpace =
        current.length > 0 &&
        !current.endsWith(" ") &&
        !current.endsWith("(");
      current += (needsSpace ? " " : "") + tok.value;
    }
  }

  pushCurrent();
  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function minifySql(raw: string): string {
  const tokens = tokenizeSql(raw).filter((t) => t.type !== "comment");
  const out: string[] = [];
  for (const t of tokens) {
    if (t.type === "ws") {
      if (out.length > 0 && out[out.length - 1] !== " ") out.push(" ");
    } else if (t.type === "word" && SQL_KEYWORDS.has(t.value.toUpperCase())) {
      out.push(t.value.toUpperCase());
    } else {
      out.push(t.value);
    }
  }
  return out.join("").replace(/\s*([(),;])\s*/g, "$1 ").trim();
}

export function JsonSqlFormatterTool() {
  const [activeTab, setActiveTab] = useState<"json" | "sql">("json");

  // JSON State
  const [jsonInput, setJsonInput] = useState<string>(SAMPLE_JSON_STUDENTS);
  const [indent, setIndent] = useState<2 | 4 | "\t">(2);
  const [jsonMode, setJsonMode] = useState<"beautify" | "minify">("beautify");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // SQL State
  const [sqlInput, setSqlInput] = useState<string>(SQL_SAMPLES[0].sql);
  const [sqlMode, setSqlMode] = useState<"beautify" | "minify">("beautify");

  const jsonResult = useMemo(
    () => analyzeJson(jsonInput, indent),
    [jsonInput, indent],
  );

  const sqlOutput = useMemo(
    () => (sqlMode === "beautify" ? formatSql(sqlInput) : minifySql(sqlInput)),
    [sqlInput, sqlMode],
  );

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      // Clipboard unavailable
    }
  };

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/85 p-4">
        <div className="inline-flex rounded-xl bg-foreground/[0.05] p-1">
          <button
            type="button"
            onClick={() => setActiveTab("json")}
            className={cn(
              "inline-flex min-h-10 items-center gap-2 rounded-lg px-4 text-xs font-bold transition-colors cursor-pointer sm:text-sm",
              activeTab === "json"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Braces className="h-4 w-4" />
            <span>JSON Validator &amp; CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sql")}
            className={cn(
              "inline-flex min-h-10 items-center gap-2 rounded-lg px-4 text-xs font-bold transition-colors cursor-pointer sm:text-sm",
              activeTab === "sql"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Database className="h-4 w-4" />
            <span>SQL Formatter (Tin học 11)</span>
          </button>
        </div>

        <Badge className="bg-primary/15 text-primary">
          <span>100% Client-Side • Không gửi dữ liệu lên Server</span>
        </Badge>
      </div>

      {activeTab === "json" ? (
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/85 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Mẫu nhanh:
              </span>
              <button
                type="button"
                onClick={() => setJsonInput(SAMPLE_JSON_STUDENTS)}
                className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-semibold hover:border-primary/50 cursor-pointer"
              >
                Bảng Học sinh (Array)
              </button>
              <button
                type="button"
                onClick={() => setJsonInput(SAMPLE_JSON_CONFIG)}
                className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-semibold hover:border-primary/50 cursor-pointer"
              >
                JSON Thu gọn (1 dòng)
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label="Khoảng thụt lề JSON"
                value={indent === "\t" ? "tab" : String(indent)}
                onChange={(e) =>
                  setIndent(
                    e.target.value === "tab"
                      ? "\t"
                      : e.target.value === "4"
                        ? 4
                        : 2,
                  )
                }
                className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground"
              >
                <option value="2">Thụt lề: 2 dấu cách</option>
                <option value="4">Thụt lề: 4 dấu cách</option>
                <option value="tab">Thụt lề: Tab</option>
              </select>

              <button
                type="button"
                onClick={() => setJsonMode("beautify")}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold cursor-pointer",
                  jsonMode === "beautify"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-foreground",
                )}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Beautify</span>
              </button>
              <button
                type="button"
                onClick={() => setJsonMode("minify")}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold cursor-pointer",
                  jsonMode === "minify"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-foreground",
                )}
              >
                <Minimize2 className="h-3.5 w-3.5" />
                <span>Minify</span>
              </button>
            </div>
          </div>

          {/* Input & Output Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="json-raw-input"
                  className="text-sm font-bold text-foreground"
                >
                  Dữ liệu JSON đầu vào
                </label>
                <button
                  type="button"
                  onClick={() => setJsonInput("")}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Xóa trắng
                </button>
              </div>
              <textarea
                id="json-raw-input"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={15}
                spellCheck={false}
                placeholder='Dán chuỗi JSON vào đây, ví dụ: {"name": "QuizKen"}'
                className="w-full rounded-xl border border-border bg-background/90 p-3 font-mono text-xs leading-relaxed text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-foreground">
                  Kết quả kiểm tra &amp; định dạng
                </span>

                {jsonResult.ok && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        copyText(
                          jsonMode === "beautify"
                            ? jsonResult.formatted
                            : jsonResult.minified,
                          "json-out",
                        )
                      }
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-background px-2.5 text-xs font-semibold hover:bg-foreground/[0.05] cursor-pointer"
                    >
                      {copiedKey === "json-out" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copiedKey === "json-out" ? "Đã chép" : "Chép JSON"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        downloadFile(
                          jsonMode === "beautify"
                            ? jsonResult.formatted
                            : jsonResult.minified,
                          "data.json",
                          "application/json;charset=utf-8",
                        )
                      }
                      className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary px-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Tải .json</span>
                    </button>
                  </div>
                )}
              </div>

              {jsonResult.ok ? (
                <>
                  <div className="flex flex-wrap items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span className="font-semibold">JSON hợp lệ</span>
                    <span>• {jsonResult.stats.type}</span>
                    <span>• {jsonResult.stats.bytes} bytes</span>
                  </div>
                  <pre className="max-h-[340px] overflow-auto rounded-xl border border-border bg-background/90 p-3 font-mono text-xs leading-relaxed text-foreground">
                    {jsonMode === "beautify"
                      ? jsonResult.formatted
                      : jsonResult.minified}
                  </pre>
                </>
              ) : (
                <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs text-rose-800 dark:text-rose-300">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-bold">Lỗi cú pháp JSON</p>
                    <p className="font-mono break-all">{jsonResult.errorMessage}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* JSON Array to CSV Table */}
          {jsonResult.ok && jsonResult.csvRows && jsonResult.csvText && (
            <div className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-heading text-base font-bold text-foreground">
                      Chuyển đổi Mảng JSON sang Bảng CSV ({jsonResult.csvRows.length - 1} dòng)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Tự động phát hiện mảng đối tượng JSON để xuất sang Excel (.csv chuẩn UTF-8 BOM).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyText(jsonResult.csvText!, "csv-out")}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-semibold hover:bg-foreground/[0.05] cursor-pointer"
                  >
                    {copiedKey === "csv-out" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedKey === "csv-out" ? "Đã chép CSV" : "Chép CSV"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      downloadFile(
                        "\uFEFF" + jsonResult.csvText!,
                        "export.csv",
                        "text/csv;charset=utf-8",
                      )
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Tải bảng .csv</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border/70">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-foreground/[0.04]">
                    <tr>
                      {jsonResult.csvRows[0].map((col) => (
                        <th
                          key={col}
                          className="border-b border-border/70 px-3 py-2.5 font-bold text-foreground"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {jsonResult.csvRows.slice(1, 51).map((row, idx) => (
                      <tr key={idx} className="hover:bg-foreground/[0.02]">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className="px-3 py-2 font-mono text-muted-foreground"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {jsonResult.csvRows.length > 51 && (
                <p className="text-xs text-muted-foreground">
                  Đang hiển thị 50 dòng đầu tiên; file tải xuống sẽ bao gồm đầy đủ{" "}
                  {jsonResult.csvRows.length - 1} dòng.
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        /* SQL Formatter Tab */
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/85 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Mẫu SQL Tin học 11:
              </span>
              {SQL_SAMPLES.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => setSqlInput(sample.sql)}
                  className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-semibold hover:border-primary/50 cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSqlMode("beautify")}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold cursor-pointer",
                  sqlMode === "beautify"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-foreground",
                )}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Làm đẹp SQL</span>
              </button>
              <button
                type="button"
                onClick={() => setSqlMode("minify")}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold cursor-pointer",
                  sqlMode === "minify"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-foreground",
                )}
              >
                <Minimize2 className="h-3.5 w-3.5" />
                <span>Thu gọn 1 dòng</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-4 space-y-3">
              <label
                htmlFor="sql-raw-input"
                className="block text-sm font-bold text-foreground"
              >
                Câu truy vấn SQL gốc
              </label>
              <textarea
                id="sql-raw-input"
                value={sqlInput}
                onChange={(e) => setSqlInput(e.target.value)}
                rows={14}
                spellCheck={false}
                placeholder="Nhập câu lệnh SELECT, FROM, WHERE, JOIN, GROUP BY..."
                className="w-full rounded-xl border border-border bg-background/90 p-3 font-mono text-xs leading-relaxed text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-foreground">
                  SQL đã chuẩn hóa từ khóa &amp; thụt lề
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyText(sqlOutput, "sql-out")}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-background px-2.5 text-xs font-semibold hover:bg-foreground/[0.05] cursor-pointer"
                  >
                    {copiedKey === "sql-out" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedKey === "sql-out" ? "Đã chép" : "Chép SQL"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      downloadFile(sqlOutput, "query.sql", "text/sql;charset=utf-8")
                    }
                    className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary px-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Tải .sql</span>
                  </button>
                </div>
              </div>
              <pre className="min-h-[308px] max-h-[360px] overflow-auto rounded-xl border border-border bg-background/90 p-3 font-mono text-xs leading-relaxed text-foreground">
                {sqlOutput || "-- Nhập câu lệnh SQL ở khung bên trái"}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
