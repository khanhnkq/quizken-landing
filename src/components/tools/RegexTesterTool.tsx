"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  SearchCode,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const MAX_TEXT_LENGTH = 10_000;
const MAX_PATTERN_LENGTH = 500;
const MAX_MATCHES = 500;

type RegexPreset = {
  id: string;
  label: string;
  pattern: string;
  flags: string;
  sampleText: string;
  description: string;
};

const REGEX_PRESETS: RegexPreset[] = [
  {
    id: "date-vn",
    label: "Ngày DD/MM/YYYY",
    pattern: "\\b(0?[1-9]|[12][0-9]|3[01])/(0?[1-9]|1[0-2])/(\\d{4})\\b",
    flags: "g",
    sampleText:
      "Lịch thi thử: 15/03/2027, hạn nộp hồ sơ 02/04/2027. Ngày không hợp lệ: 35/13/2027 hoặc 00/05/2027.",
    description: "Bắt ngày tháng định dạng Việt Nam và tách nhóm Ngày / Tháng / Năm.",
  },
  {
    id: "email-edu",
    label: "Email .edu.vn",
    pattern: "\\b([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.edu\\.vn)\\b",
    flags: "gi",
    sampleText:
      "Liên hệ GV: minhanh@thptchuyen.edu.vn hoặc phongdaotao@hust.edu.vn. Email cá nhân: user@gmail.com sẽ không khớp.",
    description: "Kiểm tra email học đường kết thúc bằng .edu.vn.",
  },
  {
    id: "student-id",
    label: "Mã học sinh",
    pattern: "\\b(HS|SV)(20\\d{2})-(\\d{3,5})\\b",
    flags: "g",
    sampleText:
      "Danh sách trúng tuyển: HS2027-001, HS2027-0142, SV2026-1024. Mã sai định dạng: HS27-01, AB2027-999.",
    description: "Bắt mã học sinh/sinh viên dạng HS2027-001 và tách tiền tố, năm, số thứ tự.",
  },
  {
    id: "decimal",
    label: "Số thập phân",
    pattern: "(?<![\\w.,])-?\\d+(?:[.,]\\d+)?(?![\\w.,])",
    flags: "g",
    sampleText:
      "Điểm thi: 9.75, 8,5, -12.5 và 10 điểm tuyệt đối. Bỏ qua mã 1.2.3.",
    description: "Tìm số nguyên hoặc số thập phân (dấu chấm hoặc dấu phẩy).",
  },
  {
    id: "hex-color",
    label: "Mã màu HEX",
    pattern: "#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\\b",
    flags: "g",
    sampleText:
      "Bảng màu giao diện: #2563EB (Primary), #10B981 (Success), #FFF (Trắng). Mã sai: #12345G.",
    description: "Nhận diện mã màu CSS HEX 3 ký tự hoặc 6 ký tự.",
  },
  {
    id: "phone-vn",
    label: "SĐT Việt Nam",
    pattern: "\\b(0(?:3|5|7|8|9)\\d{8})\\b",
    flags: "g",
    sampleText:
      "Hotline tư vấn: 0912345678, 0387654321, 0865112233. Số cũ 11 số hoặc sai: 01234567890, 0243123456.",
    description: "Khớp số điện thoại di động 10 số Việt Nam (đầu 03, 05, 07, 08, 09).",
  },
  {
    id: "cccd",
    label: "Số CCCD (12 số)",
    pattern: "\\b(0\\d{2}[0-3]\\d{8})\\b",
    flags: "g",
    sampleText:
      "Hồ sơ hợp lệ: 001209012345, 079308004567. Không hợp lệ: 123456789012 hoặc 0012090123.",
    description: "Kiểm tra định dạng 12 chữ số Căn cước công dân Việt Nam.",
  },
  {
    id: "url-https",
    label: "URL HTTPS",
    pattern: "https://([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}(?:/[^\\s]*)?",
    flags: "g",
    sampleText:
      "Truy cập https://quizken.vn/cong-cu hoặc https://moet.gov.vn/tin-tuc. Không khớp http://example.com.",
    description: "Tìm các đường dẫn bảo mật giao thức HTTPS.",
  },
  {
    id: "html-tag",
    label: "Thẻ HTML mở",
    pattern: "<([a-zA-Z][a-zA-Z0-9]*)(\\s[^<>]*?)?>",
    flags: "g",
    sampleText:
      '<section class="card"><h1>Xin chào</h1><img src="logo.png" alt="Logo" /></section>',
    description: "Tách tên thẻ HTML và chuỗi thuộc tính đi kèm.",
  },
  {
    id: "quiz-question",
    label: "Tiêu đề Câu hỏi",
    pattern: "^(Câu\\s+\\d+)[:.]\\s*(.+)$",
    flags: "gm",
    sampleText:
      "Câu 1: Thủ đô của Việt Nam là gì?\nA. Hà Nội\nCâu 2. Hệ cơ số nhị phân dùng những chữ số nào?\nA. 0 và 1",
    description: "Bóc tách số thứ tự câu hỏi và nội dung đề thi trắc nghiệm.",
  },
];

/**
 * Checks for nested unbounded quantifiers or unsafe constructs that can cause catastrophic backtracking (ReDoS).
 */
function checkRegexSafety(pattern: string): { safe: boolean; reason?: string } {
  if (pattern.length > MAX_PATTERN_LENGTH) {
    return {
      safe: false,
      reason: `Biểu thức quá dài (tối đa ${MAX_PATTERN_LENGTH} ký tự để đảm bảo an toàn trình duyệt).`,
    };
  }

  type GroupInfo = { hasUnboundedQuantifier: boolean; hasAlternation: boolean };
  const stack: GroupInfo[] = [];
  let inCharClass = false;
  let lastWasGroupEnd = false;
  let lastGroupInfo: GroupInfo | null = null;

  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];

    if (ch === "\\") {
      i++; // skip escaped character
      lastWasGroupEnd = false;
      continue;
    }

    if (inCharClass) {
      if (ch === "]") {
        inCharClass = false;
      }
      lastWasGroupEnd = false;
      continue;
    }

    if (ch === "[") {
      inCharClass = true;
      lastWasGroupEnd = false;
      continue;
    }

    if (ch === "(") {
      stack.push({ hasUnboundedQuantifier: false, hasAlternation: false });
      lastWasGroupEnd = false;
      continue;
    }

    if (ch === ")") {
      const closed = stack.pop() ?? {
        hasUnboundedQuantifier: false,
        hasAlternation: false,
      };
      lastWasGroupEnd = true;
      lastGroupInfo = closed;
      if (stack.length > 0 && closed.hasUnboundedQuantifier) {
        stack[stack.length - 1].hasUnboundedQuantifier = true;
      }
      continue;
    }

    if (ch === "|" && stack.length > 0) {
      stack[stack.length - 1].hasAlternation = true;
      lastWasGroupEnd = false;
      continue;
    }

    // Check quantifier tokens: +, *, {m,}
    let isUnboundedQuantifier = false;
    if (ch === "+" || ch === "*") {
      isUnboundedQuantifier = true;
    } else if (ch === "{") {
      const closeIdx = pattern.indexOf("}", i + 1);
      if (closeIdx !== -1) {
        const body = pattern.slice(i + 1, closeIdx);
        const unboundedMatch = /^\d+,\s*$/.exec(body);
        const largeUpperMatch = /^\d+,(\d+)$/.exec(body);
        if (unboundedMatch) {
          isUnboundedQuantifier = true;
          i = closeIdx;
        } else if (largeUpperMatch && Number(largeUpperMatch[1]) > 20) {
          isUnboundedQuantifier = true;
          i = closeIdx;
        } else if (/^\d+(,\d+)?$/.test(body)) {
          i = closeIdx;
        }
      }
    }

    if (isUnboundedQuantifier) {
      if (lastWasGroupEnd && lastGroupInfo) {
        if (lastGroupInfo.hasUnboundedQuantifier) {
          return {
            safe: false,
            reason:
              "Phát hiện lượng từ lồng nhau không giới hạn (như (a+)+ hoặc (.*)*) dễ gây treo trình duyệt (ReDoS). Hãy bỏ bớt dấu + / * lồng nhau.",
          };
        }
        if (lastGroupInfo.hasAlternation) {
          // Warn only if alternation branches look ambiguous? Allow simple ones unless nested quantifier.
        }
      }
      for (const frame of stack) {
        frame.hasUnboundedQuantifier = true;
      }
    }

    if (ch !== "?") {
      lastWasGroupEnd = false;
    }
  }

  return { safe: true };
}

type MatchRecord = {
  index: number;
  end: number;
  text: string;
  groups: Array<string | undefined>;
};

export function RegexTesterTool() {
  const [activePresetId, setActivePresetId] = useState<string>(REGEX_PRESETS[0].id);
  const [pattern, setPattern] = useState<string>(REGEX_PRESETS[0].pattern);
  const [flags, setFlags] = useState<string>(REGEX_PRESETS[0].flags);
  const [testText, setTestText] = useState<string>(REGEX_PRESETS[0].sampleText);
  const [copiedPattern, setCopiedPattern] = useState(false);

  const handleFlagToggle = (flag: "g" | "i" | "m" | "u") => {
    setFlags((prev) =>
      prev.includes(flag) ? prev.replace(flag, "") : prev + flag,
    );
  };

  const handleSelectPreset = (preset: RegexPreset) => {
    setActivePresetId(preset.id);
    setPattern(preset.pattern);
    setFlags(preset.flags);
    setTestText(preset.sampleText.slice(0, MAX_TEXT_LENGTH));
  };

  const evaluation = useMemo(() => {
    if (!pattern) {
      return {
        ok: false as const,
        error: "Hãy nhập biểu thức chính quy (Pattern) để bắt đầu kiểm tra.",
      };
    }

    const safety = checkRegexSafety(pattern);
    if (!safety.safe) {
      return {
        ok: false as const,
        error: safety.reason ?? "Biểu thức không an toàn.",
        isSecurityBlock: true,
      };
    }

    let regex: RegExp;
    try {
      regex = new RegExp(pattern, flags);
    } catch (err) {
      return {
        ok: false as const,
        error:
          err instanceof Error
            ? `Cú pháp Regex không hợp lệ: ${err.message}`
            : "Cú pháp Regex không hợp lệ.",
      };
    }

    const matches: MatchRecord[] = [];
    const safeInput = testText.slice(0, MAX_TEXT_LENGTH);

    if (flags.includes("g")) {
      let guard = 0;
      let m: RegExpExecArray | null;
      while ((m = regex.exec(safeInput)) !== null && guard < MAX_MATCHES) {
        const matchStr = m[0];
        matches.push({
          index: m.index,
          end: m.index + matchStr.length,
          text: matchStr,
          groups: m.slice(1),
        });
        if (matchStr.length === 0) {
          regex.lastIndex++;
        }
        guard++;
      }
    } else {
      const m = regex.exec(safeInput);
      if (m) {
        matches.push({
          index: m.index,
          end: m.index + m[0].length,
          text: m[0],
          groups: m.slice(1),
        });
      }
    }

    // Build highlighted text segments safely
    const segments: Array<{ text: string; matchIdx: number | null }> = [];
    let cursor = 0;
    matches.forEach((m, idx) => {
      if (m.index > cursor) {
        segments.push({ text: safeInput.slice(cursor, m.index), matchIdx: null });
      }
      if (m.end > m.index) {
        segments.push({ text: safeInput.slice(m.index, m.end), matchIdx: idx });
      }
      cursor = Math.max(cursor, m.end);
    });
    if (cursor < safeInput.length) {
      segments.push({ text: safeInput.slice(cursor), matchIdx: null });
    }

    return {
      ok: true as const,
      matches,
      segments,
      truncatedMatches: matches.length >= MAX_MATCHES,
    };
  }, [pattern, flags, testText]);

  const handleCopyPattern = async () => {
    try {
      await navigator.clipboard.writeText(`/${pattern}/${flags}`);
      setCopiedPattern(true);
      window.setTimeout(() => setCopiedPattern(false), 1800);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <div className="space-y-6">
      {/* Presets & Safety Bar */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Chống treo trình duyệt ReDoS • Giới hạn 10.000 ký tự đầu vào</span>
          </Badge>

          <button
            type="button"
            onClick={handleCopyPattern}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-semibold hover:bg-foreground/[0.05] cursor-pointer"
          >
            {copiedPattern ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span>{copiedPattern ? "Đã chép /regex/" : "Chép biểu thức"}</span>
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            10 Mẫu Regex Học thuật &amp; Thực tế Việt Nam
          </p>
          <div className="flex flex-wrap gap-2">
            {REGEX_PRESETS.map((preset) => {
              const active = preset.id === activePresetId;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={cn(
                    "rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/70 bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pattern + Flags Input */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
          <div className="space-y-1.5">
            <label
              htmlFor="regex-pattern-input"
              className="flex items-center gap-1.5 text-xs font-bold text-foreground"
            >
              <SearchCode className="h-4 w-4 text-primary" />
              <span>Biểu thức chính quy (Pattern)</span>
            </label>
            <div className="flex items-center rounded-xl border border-border bg-background/90 px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <span className="font-mono text-sm font-bold text-muted-foreground">/</span>
              <input
                id="regex-pattern-input"
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                spellCheck={false}
                placeholder="Nhập pattern, ví dụ: \b\d{4}\b"
                className="h-11 w-full bg-transparent px-2 font-mono text-sm text-foreground focus:outline-none"
              />
              <span className="font-mono text-sm font-bold text-muted-foreground">
                /{flags}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="block text-xs font-bold text-foreground">
              Cờ (Flags)
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { flag: "g", label: "g (Toàn bộ)" },
                  { flag: "i", label: "i (Bỏ HOA/thường)" },
                  { flag: "m", label: "m (Đa dòng)" },
                  { flag: "u", label: "u (Unicode)" },
                ] as const
              ).map(({ flag, label }) => {
                const active = flags.includes(flag);
                return (
                  <button
                    key={flag}
                    type="button"
                    onClick={() => handleFlagToggle(flag)}
                    className={cn(
                      "h-11 rounded-xl border px-3 font-mono text-xs font-semibold transition-colors cursor-pointer",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {!evaluation.ok && (
          <div
            className={cn(
              "flex items-start gap-2 rounded-xl border p-3 text-xs",
              evaluation.isSecurityBlock
                ? "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                : "border-rose-500/40 bg-rose-500/10 text-rose-800 dark:text-rose-300",
            )}
          >
            {evaluation.isSecurityBlock ? (
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{evaluation.error}</span>
          </div>
        )}
      </div>

      {/* Test String + Live Highlighter */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card/85 p-4 space-y-2">
          <label
            htmlFor="regex-test-string"
            className="flex items-center justify-between text-xs font-bold text-foreground"
          >
            <span>Văn bản kiểm tra (Test String)</span>
            <span className="font-mono text-muted-foreground">
              {testText.length.toLocaleString("vi-VN")} /{" "}
              {MAX_TEXT_LENGTH.toLocaleString("vi-VN")} ký tự
            </span>
          </label>
          <textarea
            id="regex-test-string"
            value={testText}
            onChange={(e) => setTestText(e.target.value.slice(0, MAX_TEXT_LENGTH))}
            rows={10}
            spellCheck={false}
            placeholder="Dán đoạn văn bản cần kiểm tra Regex (tối đa 10.000 ký tự)..."
            className="w-full rounded-xl border border-border bg-background/90 p-3 font-mono text-xs leading-relaxed text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/85 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-foreground">
            <span>Tô sáng kết quả khớp (Live Highlight)</span>
            <span className="rounded-md bg-primary/15 px-2 py-0.5 text-primary">
              {evaluation.ok ? `${evaluation.matches.length} kết quả` : "0 kết quả"}
            </span>
          </div>
          <div className="min-h-[218px] max-h-[280px] overflow-auto rounded-xl border border-border bg-background/90 p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words text-foreground">
            {evaluation.ok ? (
              evaluation.segments.length > 0 ? (
                evaluation.segments.map((seg, idx) =>
                  seg.matchIdx === null ? (
                    <span key={idx}>{seg.text}</span>
                  ) : (
                    <mark
                      key={idx}
                      className={cn(
                        "rounded px-0.5 font-semibold text-foreground",
                        seg.matchIdx % 2 === 0
                          ? "bg-amber-300/60 dark:bg-amber-500/40"
                          : "bg-sky-300/60 dark:bg-sky-500/40",
                      )}
                    >
                      {seg.text}
                    </mark>
                  ),
                )
              ) : (
                <span className="text-muted-foreground">Không có nội dung.</span>
              )
            ) : (
              <span className="text-muted-foreground">
                Sửa lỗi biểu thức để xem kết quả tô sáng.
              </span>
            )}
          </div>
          {evaluation.ok && evaluation.truncatedMatches && (
            <p className="text-[11px] text-amber-700 dark:text-amber-300">
              Hiển thị tối đa {MAX_MATCHES} kết quả đầu tiên để giữ trình duyệt mượt mà.
            </p>
          )}
        </div>
      </div>

      {/* Capture Groups Table */}
      {evaluation.ok && evaluation.matches.length > 0 && (
        <div className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-3">
          <h3 className="font-heading text-base font-bold text-foreground">
            Bảng chi tiết Match &amp; Capture Groups
          </h3>
          <div className="overflow-x-auto rounded-xl border border-border/70">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-foreground/[0.04]">
                <tr>
                  <th className="border-b border-border/70 px-3 py-2 font-bold">#</th>
                  <th className="border-b border-border/70 px-3 py-2 font-bold">Vị trí (Index)</th>
                  <th className="border-b border-border/70 px-3 py-2 font-bold">Chuỗi khớp (Full Match)</th>
                  <th className="border-b border-border/70 px-3 py-2 font-bold">Nhóm con (Capture Groups)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 font-mono">
                {evaluation.matches.slice(0, 50).map((m, idx) => (
                  <tr key={`${m.index}-${idx}`} className="hover:bg-foreground/[0.02]">
                    <td className="px-3 py-2 text-muted-foreground">{idx + 1}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      [{m.index}..{m.end}]
                    </td>
                    <td className="px-3 py-2 font-semibold text-foreground">
                      {m.text || '"" (chuỗi rỗng)'}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {m.groups.length === 0 ? (
                        <span>—</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {m.groups.map((g, gIdx) => (
                            <span
                              key={gIdx}
                              className="rounded bg-foreground/[0.06] px-1.5 py-0.5 text-[11px] text-foreground"
                            >
                              ${gIdx + 1}: {g ?? "undefined"}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
