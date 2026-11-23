"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Eraser, FileText, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const STOP_WORDS = new Set([
  // Vietnamese common function words
  "và", "của", "là", "có", "trong", "cho", "với", "để", "các", "những",
  "một", "được", "không", "này", "khi", "về", "từ", "đã", "sẽ", "như",
  "tại", "bởi", "hay", "hoặc", "nhưng", "mà", "thì", "nên", "rằng", "vì",
  "do", "nếu", "cũng", "vào", "ra", "lên", "xuống", "theo", "trên", "dưới",
  "đó", "đây", "người", "ta", "chúng", "tôi", "bạn", "họ", "nó", "rất",
  // English common stop words
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "is", "are", "was", "were", "be", "been", "being", "it",
  "this", "that", "these", "those", "as", "by", "from", "that", "which",
  "who", "have", "has", "had", "not", "can", "will", "would", "could",
  "should", "more", "most", "very", "also", "into", "about", "their", "they",
]);

const SAMPLE_ESSAY = `Công nghệ trí tuệ nhân tạo (AI) đang thay đổi sâu sắc cách học sinh tiếp cận tri thức trong kỷ nguyên số. Thay vì học thuộc lòng máy móc, người học có thể cá nhân hóa lộ trình ôn tập thông qua các hệ thống phân tích lỗ hổng kiến thức và gợi nhớ chủ động.

Tuy nhiên, AI chỉ phát huy hiệu quả tối đa khi học sinh giữ được tư duy phản biện và tính trung thực học thuật. Việc sử dụng công cụ hỗ trợ cần đi đôi với khả năng tự tổng hợp, lập luận và kiểm chứng thông tin từ nhiều nguồn đáng tin cậy.`;

export function tokenizeWords(text: string): string[] {
  const normalized = text.normalize("NFC").trim();
  if (!normalized) return [];
  const matches = normalized.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu);
  return matches ?? [];
}

function formatDuration(minutesFloat: number): string {
  const totalSeconds = Math.max(0, Math.round(minutesFloat * 60));
  if (totalSeconds === 0) return "0 giây";
  if (totalSeconds < 60) return `${totalSeconds} giây`;
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return secs > 0 ? `${mins} phút ${secs} giây` : `${mins} phút`;
}

export function WordCounterTool() {
  const [text, setText] = useState<string>(SAMPLE_ESSAY);
  const [excludeStopWords, setExcludeStopWords] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    const words = tokenizeWords(text);
    const wordCount = words.length;
    const charsWithSpaces = text.length;
    const charsWithoutSpaces = text.replace(/\s+/g, "").length;

    const sentences = text
      .split(/[.!?…]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0).length;

    const paragraphs = text
      .split(/\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0).length;

    const readingTime = formatDuration(wordCount / 200);
    const speakingTime = formatDuration(wordCount / 130);

    const freq = new Map<string, number>();
    for (const raw of words) {
      const w = raw.toLowerCase();
      if (w.length < 2) continue;
      if (excludeStopWords && STOP_WORDS.has(w)) continue;
      freq.set(w, (freq.get(w) ?? 0) + 1);
    }

    const topRepeated = Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 5);

    return {
      wordCount,
      charsWithSpaces,
      charsWithoutSpaces,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
      topRepeated,
    };
  }, [text, excludeStopWords]);

  const targets = [
    {
      label: "IELTS Writing Task 1 (≥ 150 từ)",
      min: 150,
      max: null as number | null,
    },
    {
      label: "IELTS Task 2 / VSTEP Essay (≥ 250 từ)",
      min: 250,
      max: null as number | null,
    },
    {
      label: "Nghị luận xã hội THPT (~200 chữ)",
      min: 180,
      max: 220,
    },
    {
      label: "Bài văn nghị luận (~600 chữ)",
      min: 550,
      max: 650,
    },
  ];

  const handleCopyStats = async () => {
    const summary = [
      "THỐNG KÊ ĐỘ DÀI BÀI LUẬN",
      `• Số từ: ${stats.wordCount}`,
      `• Ký tự (có dấu cách): ${stats.charsWithSpaces} | Không dấu cách: ${stats.charsWithoutSpaces}`,
      `• Số câu: ${stats.sentences} | Số đoạn: ${stats.paragraphs}`,
      `• Thời gian đọc: ${stats.readingTime} | Thời gian nói: ${stats.speakingTime}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left: Textarea */}
      <div className="space-y-4 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              Nhập hoặc dán bài viết của bạn
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setText(SAMPLE_ESSAY)}
              className="min-h-11 rounded-xl bg-foreground/[0.05] px-3.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
            >
              Nạp bài mẫu
            </button>
            <button
              type="button"
              onClick={() => setText("")}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.05] px-3.5 text-xs font-semibold text-muted-foreground hover:bg-foreground/[0.1] hover:text-foreground cursor-pointer"
            >
              <Eraser className="h-3.5 w-3.5" />
              Xóa trắng
            </button>
          </div>
        </div>

        <textarea
          aria-label="Nội dung bài luận cần đếm từ"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={13}
          placeholder="Dán bài luận IELTS Writing, VSTEP hoặc bài văn nghị luận tiếng Việt vào đây để kiểm tra số từ và từ lặp ngay lập tức..."
          className="w-full rounded-xl border border-border/70 bg-background p-4 text-sm leading-relaxed text-foreground outline-none focus:border-primary"
        />

        {/* Target Progress Bars */}
        <div className="space-y-3 rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
          <h3 className="font-heading text-sm font-bold text-foreground">
            Kiểm tra ngưỡng độ dài bài thi chuẩn
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {targets.map((t) => {
              const goal = t.max ?? t.min;
              const pct = Math.min(100, Math.round((stats.wordCount / goal) * 100));
              const met =
                t.max !== null
                  ? stats.wordCount >= t.min && stats.wordCount <= t.max
                  : stats.wordCount >= t.min;
              const over = t.max !== null && stats.wordCount > t.max;

              return (
                <div key={t.label} className="space-y-1.5 rounded-xl bg-background/70 p-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-foreground">{t.label}</span>
                    <span
                      className={cn(
                        "font-bold",
                        met
                          ? "text-primary"
                          : over
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-muted-foreground",
                      )}
                    >
                      {stats.wordCount}/{t.max ? `${t.min}–${t.max}` : t.min}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-200",
                        over ? "bg-amber-500" : "bg-primary",
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Real-time Metrics & Top Repeated Words */}
      <div className="flex flex-col justify-between space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-5">
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-2">
            <Badge className="bg-primary/15 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Phân tích trực tiếp</span>
            </Badge>
            <span className="text-xs font-medium text-muted-foreground">Unicode Việt – Anh</span>
          </div>

          {/* Primary Count Card */}
          <div className="rounded-2xl bg-foreground/[0.04] p-5 text-center dark:bg-foreground/[0.06]">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tổng số từ (Words)
            </p>
            <p className="mt-1 font-heading text-5xl font-extrabold text-primary tabular-nums">
              {stats.wordCount}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]">
              <p className="text-xs text-muted-foreground">Ký tự (có dấu cách)</p>
              <p className="mt-0.5 font-heading text-lg font-bold text-foreground">
                {stats.charsWithSpaces}
              </p>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]">
              <p className="text-xs text-muted-foreground">Ký tự (không dấu cách)</p>
              <p className="mt-0.5 font-heading text-lg font-bold text-foreground">
                {stats.charsWithoutSpaces}
              </p>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]">
              <p className="text-xs text-muted-foreground">Số câu / Số đoạn</p>
              <p className="mt-0.5 font-heading text-lg font-bold text-foreground">
                {stats.sentences} / {stats.paragraphs}
              </p>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]">
              <p className="text-xs text-muted-foreground">Đọc / Nói ước tính</p>
              <p className="mt-0.5 font-heading text-sm font-bold text-foreground">
                {stats.readingTime} / {stats.speakingTime}
              </p>
            </div>
          </div>

          {/* Top 5 Repeated Words */}
          <div className="space-y-3 rounded-xl border border-border/60 bg-background/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-heading text-sm font-bold text-foreground">
                Top 5 từ lặp lại nhiều nhất
              </h3>
              <button
                type="button"
                onClick={() => setExcludeStopWords((v) => !v)}
                className="min-h-9 rounded-lg bg-foreground/[0.05] px-2.5 text-[11px] font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
              >
                {excludeStopWords ? "Đang lọc từ nối" : "Đang tính cả từ nối"}
              </button>
            </div>

            {stats.topRepeated.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Nhập thêm nội dung để phát hiện các từ lặp lại cần đa dạng hóa từ vựng.
              </p>
            ) : (
              <div className="space-y-2">
                {stats.topRepeated.map(([word, count]) => (
                  <div
                    key={word}
                    className="flex items-center justify-between rounded-lg bg-foreground/[0.04] px-3 py-2 text-xs dark:bg-foreground/[0.06]"
                  >
                    <span className="font-semibold text-foreground">{word}</span>
                    <span className="rounded-md bg-primary/15 px-2 py-0.5 font-bold text-primary">
                      {count} lần
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyStats}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-heading font-bold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span>{copied ? "Đã sao chép thống kê!" : "Sao chép thống kê bài viết"}</span>
        </button>
      </div>
    </div>
  );
}
