"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { appLink } from "@/lib/site";
import { cn } from "@/lib/utils";

type LangMode = "vi" | "en";

const PASSAGES: Record<LangMode, { title: string; text: string }[]> = {
  vi: [
    {
      title: "Thi tốt nghiệp THPT trên máy tính 2027",
      text: "Bộ Giáo dục và Đào tạo dự kiến triển khai thí điểm thi tốt nghiệp trung học phổ thông trên máy tính từ năm 2027 tại các địa phương đủ điều kiện. Kỹ năng gõ phím tiếng Việt có dấu nhanh và chính xác giúp thí sinh tiết kiệm nhiều thời gian làm bài phần trả lời ngắn và viết luận.",
    },
    {
      title: "An toàn thông tin & Tin học GDPT 2018",
      text: "Trong thời đại trí tuệ nhân tạo, học sinh cần rèn luyện tư duy thuật toán, kỹ năng kiểm chứng thông tin và bảo vệ dữ liệu cá nhân trên không gian mạng. Việc sử dụng mật khẩu mạnh kết hợp xác thực hai lớp là nguyên tắc cơ bản giúp bảo vệ tài khoản học tập trực tuyến.",
    },
  ],
  en: [
    {
      title: "Academic Technology & Active Recall",
      text: "Active recall and spaced repetition remain two of the most effective cognitive strategies for long term memory retention. When learners test themselves immediately after reading a chapter, neural pathways strengthen and exam anxiety drops noticeably during timed computer based assessments.",
    },
    {
      title: "IELTS Computer-Delivered Writing",
      text: "In computer delivered English proficiency tests, steady typing speed above fifty words per minute gives candidates extra minutes to plan clear topic sentences, verify grammatical accuracy, and refine academic vocabulary across both writing tasks.",
    },
  ],
};

const BEST_SCORE_KEY = "quizken_typing_best_v1";
const BEST_EVENT = "quizken-typing-best";

function subscribeBest(cb: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("storage", cb);
  window.addEventListener(BEST_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(BEST_EVENT, cb);
  };
}

function getBestWpmSnapshot(): number {
  try {
    const raw = window.localStorage.getItem(BEST_SCORE_KEY);
    const val = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(val) ? val : 0;
  } catch {
    return 0;
  }
}

export function TypingSpeedTestTool() {
  const [lang, setLang] = useState<LangMode>("vi");
  const [passageIdx, setPassageIdx] = useState<number>(0);
  const [duration, setDuration] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [typed, setTyped] = useState<string>("");

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const bestWpm = useSyncExternalStore(subscribeBest, getBestWpmSnapshot, () => 0);

  const passage = PASSAGES[lang][passageIdx] ?? PASSAGES[lang][0];
  const targetText = passage.text;

  // Compute live typing metrics
  const metrics = useMemo(() => {
    const targetChars = Array.from(targetText.normalize("NFC"));
    const typedChars = Array.from(typed.normalize("NFC"));
    let correctChars = 0;
    let errorChars = 0;

    for (let i = 0; i < typedChars.length; i++) {
      if (i < targetChars.length && typedChars[i] === targetChars[i]) {
        correctChars++;
      } else {
        errorChars++;
      }
    }

    const elapsedSeconds = Math.max(1, duration - timeLeft);
    const minutes = started ? elapsedSeconds / 60 : 1;
    const wpm = started ? Math.round(correctChars / 5 / minutes) : 0;
    const cpm = started ? Math.round(correctChars / minutes) : 0;
    const accuracy =
      typedChars.length > 0 ? Math.round((correctChars / typedChars.length) * 100) : 100;

    return {
      targetChars,
      typedChars,
      correctChars,
      errorChars,
      wpm,
      cpm,
      accuracy,
      completedPassage: typedChars.length >= targetChars.length && targetChars.length > 0,
    };
  }, [targetText, typed, duration, timeLeft, started]);

  const saveBestIfHigher = (wpmVal: number) => {
    try {
      const current = getBestWpmSnapshot();
      if (wpmVal > current) {
        window.localStorage.setItem(BEST_SCORE_KEY, String(wpmVal));
        window.dispatchEvent(new Event(BEST_EVENT));
      }
    } catch {
      // Ignore storage failure
    }
  };

  useEffect(() => {
    if (!started || finished) return;
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [started, finished]);

  // Save best score when finished
  useEffect(() => {
    if (finished && metrics.wpm > 0) {
      saveBestIfHigher(metrics.wpm);
    }
  }, [finished, metrics.wpm]);

  const handleReset = (nextDuration = duration, nextLang = lang, nextIdx = passageIdx) => {
    setStarted(false);
    setFinished(false);
    setTyped("");
    setDuration(nextDuration);
    setTimeLeft(nextDuration);
    setLang(nextLang);
    setPassageIdx(nextIdx);
    inputRef.current?.focus();
  };

  const handleTypingChange = (val: string) => {
    if (finished) return;
    if (!started && val.length > 0) {
      setStarted(true);
    }
    setTyped(val);
    if (Array.from(val.normalize("NFC")).length >= Array.from(targetText.normalize("NFC")).length) {
      setFinished(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleReset(duration, "vi", 0)}
              className={cn(
                "min-h-11 rounded-xl px-3.5 text-xs font-bold cursor-pointer",
                lang === "vi"
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.1]",
              )}
            >
              Tiếng Việt có dấu
            </button>
            <button
              type="button"
              onClick={() => handleReset(duration, "en", 0)}
              className={cn(
                "min-h-11 rounded-xl px-3.5 text-xs font-bold cursor-pointer",
                lang === "en"
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.1]",
              )}
            >
              English IELTS
            </button>
            <button
              type="button"
              onClick={() => handleReset(duration, lang, (passageIdx + 1) % PASSAGES[lang].length)}
              className="min-h-11 rounded-xl bg-foreground/[0.05] px-3.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
            >
              Đổi đoạn văn
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[30, 60, 120].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => handleReset(sec, lang, passageIdx)}
                className={cn(
                  "min-h-11 rounded-xl px-3 text-xs font-bold cursor-pointer",
                  duration === sec
                    ? "bg-primary/15 text-primary border border-primary/40"
                    : "bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.1]",
                )}
              >
                {sec}s
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleReset()}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Làm lại
            </button>
          </div>
        </div>

        {/* Live KPI Strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="rounded-xl bg-foreground/[0.04] p-3.5 text-center dark:bg-foreground/[0.06]">
            <p className="text-[11px] font-semibold text-muted-foreground">Thời gian còn</p>
            <p className="mt-0.5 font-heading text-2xl font-extrabold text-primary tabular-nums">
              {timeLeft}s
            </p>
          </div>
          <div className="rounded-xl bg-foreground/[0.04] p-3.5 text-center dark:bg-foreground/[0.06]">
            <p className="text-[11px] font-semibold text-muted-foreground">Tốc độ (WPM)</p>
            <p className="mt-0.5 font-heading text-2xl font-extrabold text-foreground tabular-nums">
              {metrics.wpm}
            </p>
          </div>
          <div className="rounded-xl bg-foreground/[0.04] p-3.5 text-center dark:bg-foreground/[0.06]">
            <p className="text-[11px] font-semibold text-muted-foreground">Ký tự/phút (CPM)</p>
            <p className="mt-0.5 font-heading text-2xl font-extrabold text-foreground tabular-nums">
              {metrics.cpm}
            </p>
          </div>
          <div className="rounded-xl bg-foreground/[0.04] p-3.5 text-center dark:bg-foreground/[0.06]">
            <p className="text-[11px] font-semibold text-muted-foreground">Độ chính xác</p>
            <p className="mt-0.5 font-heading text-2xl font-extrabold text-foreground tabular-nums">
              {metrics.accuracy}%
            </p>
          </div>
          <div className="col-span-2 rounded-xl bg-foreground/[0.04] p-3.5 text-center dark:bg-foreground/[0.06] sm:col-span-1">
            <p className="flex items-center justify-center gap-1 text-[11px] font-semibold text-muted-foreground">
              <Trophy className="h-3 w-3 text-primary" />
              Kỷ lục cá nhân
            </p>
            <p className="mt-0.5 font-heading text-2xl font-extrabold text-primary tabular-nums">
              {bestWpm} WPM
            </p>
          </div>
        </div>

        {/* Highlighted Reference Passage */}
        <div className="rounded-xl border border-border/60 bg-background/80 p-4 sm:p-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <Badge className="text-[11px]">{passage.title}</Badge>
            <span className="text-xs text-muted-foreground">
              {metrics.typedChars.length}/{metrics.targetChars.length} ký tự
            </span>
          </div>
          <p className="font-mono text-sm leading-relaxed tracking-wide sm:text-base select-none">
            {metrics.targetChars.map((ch, idx) => {
              const typedCh = metrics.typedChars[idx];
              const isCurrent = idx === metrics.typedChars.length && !finished;
              let cls = "text-muted-foreground";
              if (typedCh !== undefined) {
                cls =
                  typedCh === ch
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "bg-destructive/20 text-destructive underline";
              }
              return (
                <span
                  key={idx}
                  className={cn(cls, isCurrent && "border-b-2 border-primary text-foreground")}
                >
                  {ch}
                </span>
              );
            })}
          </p>
        </div>

        {/* Input Box */}
        <textarea
          ref={inputRef}
          aria-label="Ô gõ văn bản kiểm tra tốc độ"
          value={typed}
          disabled={finished}
          onChange={(e) => handleTypingChange(e.target.value)}
          rows={4}
          placeholder="Nhấp vào đây và bắt đầu gõ đoạn văn bản phía trên — đồng hồ sẽ tự động chạy khi bạn gõ ký tự đầu tiên..."
          className="w-full rounded-xl border border-border/70 bg-background p-4 font-mono text-sm leading-relaxed text-foreground outline-none focus:border-primary disabled:opacity-60"
        />

        {finished && (
          <div className="flex flex-col justify-between gap-3 rounded-xl border border-primary/40 bg-primary/10 p-4 sm:flex-row sm:items-center">
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-1.5 font-heading font-bold text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>
                  Hoàn thành! Tốc độ của bạn: {metrics.wpm} WPM ({metrics.accuracy}% chính xác,{" "}
                  {metrics.errorChars} lỗi)
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Thử sức ngay với phòng thi bấm giờ trực tuyến chuẩn cấu trúc thi trên máy tính tại QuizKen.
              </p>
            </div>
            <a
              href={appLink("/")}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground hover:opacity-90"
            >
              <span>Luyện thi thử trên máy</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
