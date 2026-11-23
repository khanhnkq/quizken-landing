"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Eraser, FileText, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "is", "are", "was", "were", "be", "been", "being", "it",
  "this", "that", "these", "those", "as", "by", "from", "which", "who",
  "have", "has", "had", "not", "can", "will", "would", "could", "should",
  "more", "most", "very", "also", "into", "about", "their", "they", "you",
  "your", "we", "our", "he", "she", "his", "her", "its", "there", "here",
]);

const SAMPLE_ESSAY = `Artificial intelligence is reshaping personalized education by giving students immediate feedback on practice quizzes and essays. When learners actively test their understanding instead of passively rereading textbooks, retention improves significantly.

Nevertheless, strong academic writing still depends on human critical thinking, clear thesis statements, and precise vocabulary. Using concise sentences and avoiding repetitive phrasing makes arguments persuasive for both college admissions essays and standardized writing exams.`;

function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!clean) return 0;
  if (clean.length <= 3) return 1;
  const trimmed = clean.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const groups = trimmed.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

export function computeFleschReadingEase(words: string[], sentenceCount: number): number {
  if (words.length === 0 || sentenceCount === 0) return 0;
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const raw =
    206.835 - 1.015 * (words.length / sentenceCount) - 84.6 * (totalSyllables / words.length);
  return Math.min(100, Math.max(0, Math.round(raw * 10) / 10));
}

function readabilityLabel(score: number): string {
  if (score === 0) return "No text";
  if (score >= 70) return "Easy to read (Plain English)";
  if (score >= 50) return "Standard Academic (High School / IELTS)";
  if (score >= 30) return "College / University Level";
  return "Very Dense / Technical";
}

function formatDuration(minutesFloat: number): string {
  const sec = Math.max(0, Math.round(minutesFloat * 60));
  if (sec === 0) return "0s";
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export function EnWordCounter() {
  const [text, setText] = useState<string>(SAMPLE_ESSAY);
  const [excludeStopWords, setExcludeStopWords] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    const normalized = text.normalize("NFC").trim();
    const words = normalized ? normalized.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? [] : [];
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

    const flesch = computeFleschReadingEase(words, Math.max(1, sentences));
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
      flesch,
      readingTime,
      speakingTime,
      topRepeated,
    };
  }, [text, excludeStopWords]);

  const targets = [
    { label: "IELTS Task 1 (≥ 150 words)", min: 150, max: null as number | null },
    { label: "IELTS Task 2 (≥ 250 words)", min: 250, max: null as number | null },
    { label: "SAT / Academic Essay (400–600)", min: 400, max: 600 },
    { label: "Common App Essay (max 650)", min: 250, max: 650 },
  ];

  const handleCopy = async () => {
    const summary = [
      "ESSAY WORD & READABILITY STATS",
      `• Words: ${stats.wordCount} | Characters: ${stats.charsWithSpaces} (${stats.charsWithoutSpaces} no spaces)`,
      `• Sentences: ${stats.sentences} | Paragraphs: ${stats.paragraphs}`,
      `• Flesch Reading Ease: ${stats.flesch} (${readabilityLabel(stats.flesch)})`,
      `• Reading time: ${stats.readingTime} | Speaking time: ${stats.speakingTime}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="space-y-4 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              Paste or type your essay
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setText(SAMPLE_ESSAY)}
              className="min-h-11 rounded-xl bg-foreground/[0.05] px-3.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
            >
              Load Sample
            </button>
            <button
              type="button"
              onClick={() => setText("")}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.05] px-3.5 text-xs font-semibold text-muted-foreground hover:bg-foreground/[0.1] hover:text-foreground cursor-pointer"
            >
              <Eraser className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
        </div>

        <textarea
          aria-label="Essay text input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={13}
          placeholder="Paste your Common App essay, IELTS Writing task, or research paragraph here..."
          className="w-full rounded-xl border border-border/70 bg-background p-4 text-sm leading-relaxed text-foreground outline-none focus:border-primary"
        />

        <div className="space-y-3 rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
          <h3 className="font-heading text-sm font-bold text-foreground">
            Essay Length Targets
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {targets.map((t) => {
              const goal = t.max ?? t.min;
              const pct = Math.min(100, Math.round((stats.wordCount / goal) * 100));
              const over = t.max !== null && stats.wordCount > t.max;
              const met =
                t.max !== null
                  ? stats.wordCount >= t.min && stats.wordCount <= t.max
                  : stats.wordCount >= t.min;
              return (
                <div key={t.label} className="space-y-1.5 rounded-xl bg-background/70 p-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-foreground">{t.label}</span>
                    <span
                      className={cn(
                        "font-bold",
                        met ? "text-primary" : over ? "text-amber-600" : "text-muted-foreground",
                      )}
                    >
                      {stats.wordCount}/{t.max ?? t.min}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
                    <div
                      className={cn("h-full rounded-full", over ? "bg-amber-500" : "bg-primary")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-5">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className="bg-primary/15 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Live Metrics</span>
            </Badge>
            <span className="text-xs font-semibold text-muted-foreground">
              Flesch Score: {stats.flesch}
            </span>
          </div>

          <div className="rounded-2xl bg-foreground/[0.04] p-5 text-center dark:bg-foreground/[0.06]">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Words
            </p>
            <p className="mt-1 font-heading text-5xl font-extrabold text-primary tabular-nums">
              {stats.wordCount}
            </p>
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              Readability: <strong className="text-foreground">{readabilityLabel(stats.flesch)}</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]">
              <p className="text-xs text-muted-foreground">Characters (with spaces)</p>
              <p className="mt-0.5 font-heading text-lg font-bold text-foreground">{stats.charsWithSpaces}</p>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]">
              <p className="text-xs text-muted-foreground">Characters (no spaces)</p>
              <p className="mt-0.5 font-heading text-lg font-bold text-foreground">{stats.charsWithoutSpaces}</p>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]">
              <p className="text-xs text-muted-foreground">Sentences / Paragraphs</p>
              <p className="mt-0.5 font-heading text-lg font-bold text-foreground">
                {stats.sentences} / {stats.paragraphs}
              </p>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]">
              <p className="text-xs text-muted-foreground">Read / Speak Time</p>
              <p className="mt-0.5 font-heading text-sm font-bold text-foreground">
                {stats.readingTime} / {stats.speakingTime}
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-border/60 bg-background/60 p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-heading text-sm font-bold text-foreground">Top 5 Repeated Words</h3>
              <button
                type="button"
                onClick={() => setExcludeStopWords((v) => !v)}
                className="min-h-9 rounded-lg bg-foreground/[0.05] px-2.5 text-[11px] font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
              >
                {excludeStopWords ? "Filtering stop words" : "Including stop words"}
              </button>
            </div>
            {stats.topRepeated.length === 0 ? (
              <p className="text-xs text-muted-foreground">Type more text to inspect keyword repetition.</p>
            ) : (
              <div className="space-y-1.5">
                {stats.topRepeated.map(([w, count]) => (
                  <div
                    key={w}
                    className="flex items-center justify-between rounded-lg bg-foreground/[0.04] px-3 py-2 text-xs dark:bg-foreground/[0.06]"
                  >
                    <span className="font-semibold text-foreground">{w}</span>
                    <span className="rounded-md bg-primary/15 px-2 py-0.5 font-bold text-primary">
                      {count}×
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-heading font-bold text-primary-foreground hover:opacity-90 cursor-pointer"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span>{copied ? "Copied Stats!" : "Copy Essay Stats"}</span>
        </button>
      </div>
    </div>
  );
}
