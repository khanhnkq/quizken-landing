"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  BellOff,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const PRESETS = [
  { label: "15 phút", mins: 15, sub: "Kiểm tra nhanh" },
  { label: "45 phút", mins: 45, sub: "Kiểm tra 1 tiết" },
  { label: "50 phút", mins: 50, sub: "Môn Tổ hợp GDPT 2018" },
  { label: "90 phút", mins: 90, sub: "Toán THPT / Học kỳ" },
  { label: "120 phút", mins: 120, sub: "Ngữ văn THPT" },
];

function formatTime(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hrs > 0
    ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
    : `${pad(mins)}:${pad(secs)}`;
}

export function ExamProjectorTimerTool() {
  const [durationMins, setDurationMins] = useState<number>(50);
  const [customMins, setCustomMins] = useState<string>("50");
  const [secondsLeft, setSecondsLeft] = useState<number>(50 * 60);
  const [running, setRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [warnFiveMin, setWarnFiveMin] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [examTitle, setExamTitle] = useState<string>(
    "KIỂM TRA ĐỊNH KỲ / THI THỬ THPT 2027",
  );
  const [roomNotice, setRoomNotice] = useState<string>(
    "Thí sinh kiểm tra kỹ số trang đề thi • Không sử dụng tài liệu • Chỉ dùng bút chì 2B tô phiếu đáp án.",
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const warnedRef = useRef<boolean>(false);

  const playBell = (type: "warning" | "finish") => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") void ctx.resume();

      const freqs = type === "warning" ? [587.33, 587.33] : [659.25, 783.99, 1046.5];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = f;
        const start = ctx.currentTime + idx * 0.22;
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.exponentialRampToValueAtTime(0.18, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.48);
      });
    } catch {
      // ignore audio blocks
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        void audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          playBell("finish");
          return 0;
        }
        const next = prev - 1;
        if (warnFiveMin && !warnedRef.current && durationMins > 5 && next === 300) {
          warnedRef.current = true;
          playBell("warning");
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, warnFiveMin, durationMins, soundEnabled]);

  const applyDuration = (mins: number) => {
    const safe = Math.min(300, Math.max(1, mins));
    setRunning(false);
    setDurationMins(safe);
    setCustomMins(String(safe));
    setSecondsLeft(safe * 60);
    warnedRef.current = false;
  };

  const handleReset = () => {
    setRunning(false);
    setSecondsLeft(durationMins * 60);
    warnedRef.current = false;
  };

  const toggleFullscreen = async () => {
    if (typeof document === "undefined") return;
    try {
      if (!document.fullscreenElement && containerRef.current) {
        await containerRef.current.requestFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // Fallback: ignored if fullscreen API blocked
    }
  };

  const totalSec = durationMins * 60;
  const pctLeft = totalSec > 0 ? Math.max(0, (secondsLeft / totalSec) * 100) : 0;
  const isFinalWarning = secondsLeft > 0 && secondsLeft <= 300;
  const isFinished = secondsLeft === 0;

  return (
    <div className="space-y-6">
      {/* Projector Stage */}
      <div
        ref={containerRef}
        className={cn(
          "flex flex-col justify-between rounded-2xl border border-border/70 bg-card/95 p-6 sm:p-10 space-y-6",
          isFullscreen && "min-h-screen rounded-none border-0 justify-center bg-background",
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/15 text-primary">
              Thời lượng: {durationMins} phút
            </Badge>
            {isFinalWarning && (
              <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400">
                Còn dưới 5 phút!
              </Badge>
            )}
            {isFinished && (
              <Badge className="bg-destructive/15 text-destructive">
                HẾT GIỜ LÀM BÀI
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled((s) => !s)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
            >
              {soundEnabled ? (
                <>
                  <Bell className="h-4 w-4 text-primary" />
                  <span>Chuông: Bật</span>
                </>
              ) : (
                <>
                  <BellOff className="h-4 w-4 text-muted-foreground" />
                  <span>Chuông: Tắt</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-4 w-4" />
                  <span>Thu nhỏ</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-4 w-4" />
                  <span>Chiếu Toàn màn hình</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Title & Giant Clock */}
        <div className="py-4 text-center space-y-4">
          <h2 className="font-heading text-xl font-bold uppercase tracking-wide text-foreground sm:text-3xl">
            {examTitle}
          </h2>

          <div
            className={cn(
              "font-heading text-7xl font-bold tabular-nums tracking-tight sm:text-8xl lg:text-9xl",
              isFinished
                ? "text-destructive"
                : isFinalWarning
                  ? "text-amber-500"
                  : "text-foreground",
            )}
          >
            {formatTime(secondsLeft)}
          </div>

          <div className="mx-auto h-3 w-full max-w-2xl overflow-hidden rounded-full bg-foreground/[0.08]">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isFinished
                  ? "bg-destructive"
                  : isFinalWarning
                    ? "bg-amber-500"
                    : "bg-primary",
              )}
              style={{ width: `${pctLeft}%` }}
            />
          </div>

          {roomNotice && (
            <p className="mx-auto max-w-2xl rounded-xl bg-foreground/[0.04] px-4 py-3 text-sm font-medium text-muted-foreground dark:bg-foreground/[0.06] sm:text-base">
              {roomNotice}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (secondsLeft === 0) handleReset();
              setRunning((r) => !r);
            }}
            className="inline-flex min-h-12 min-w-[160px] items-center justify-center gap-2 rounded-xl bg-primary px-6 font-heading text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
          >
            {running ? (
              <>
                <Pause className="h-5 w-5" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>{secondsLeft === durationMins * 60 ? "Bắt đầu tính giờ" : "Tiếp tục"}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-foreground/[0.06] px-5 font-heading text-sm font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Đặt lại ({durationMins}p)</span>
          </button>
        </div>
      </div>

      {/* Presets & Room Notice Editor */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-7">
          <h3 className="font-heading text-lg font-bold text-foreground">
            Chọn nhanh mốc thời gian phòng thi
          </h3>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {PRESETS.map((p) => {
              const active = durationMins === p.mins;
              return (
                <button
                  key={p.mins}
                  type="button"
                  onClick={() => applyDuration(p.mins)}
                  className={cn(
                    "flex min-h-14 flex-col justify-center rounded-xl border px-3.5 py-2 text-left transition-colors cursor-pointer",
                    active
                      ? "border-primary bg-primary/10"
                      : "border-border/70 bg-background hover:border-primary/50",
                  )}
                >
                  <span className="font-heading text-sm font-bold text-foreground">
                    {p.label}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{p.sub}</span>
                </button>
              );
            })}
            <div className="flex flex-col justify-center rounded-xl border border-border/70 bg-background px-3 py-2 space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Tùy chỉnh (phút)
              </span>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  aria-label="Số phút tùy chỉnh"
                  min={1}
                  max={300}
                  value={customMins}
                  onChange={(e) => setCustomMins(e.target.value)}
                  className="h-8 w-full rounded-lg border border-border bg-card px-2 text-xs font-bold text-foreground"
                />
                <button
                  type="button"
                  onClick={() => applyDuration(parseInt(customMins || "45", 10))}
                  className="h-8 rounded-lg bg-primary px-2.5 text-xs font-bold text-primary-foreground cursor-pointer"
                >
                  Đặt
                </button>
              </div>
            </div>
          </div>

          <label className="flex min-h-11 items-center justify-between gap-3 rounded-xl bg-foreground/[0.04] px-3.5 py-2 text-xs font-semibold text-foreground cursor-pointer dark:bg-foreground/[0.06] sm:text-sm">
            <span>Phát chuông nhắc nhở khi còn đúng 5 phút cuối</span>
            <input
              type="checkbox"
              checked={warnFiveMin}
              onChange={(e) => setWarnFiveMin(e.target.checked)}
              className="h-5 w-5 accent-emerald-500 cursor-pointer"
            />
          </label>
        </div>

        <div className="space-y-3 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-5">
          <h3 className="font-heading text-lg font-bold text-foreground">
            Nội quy &amp; Tiêu đề hiển thị trên máy chiếu
          </h3>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">
              Tiêu đề ca thi / Môn thi
            </span>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">
              Thông báo / Lưu ý phòng thi
            </span>
            <textarea
              rows={3}
              value={roomNotice}
              onChange={(e) => setRoomNotice(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-3 text-xs leading-relaxed text-foreground"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
