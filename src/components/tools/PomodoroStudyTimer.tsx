"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { appLink } from "@/lib/site";
import { cn } from "@/lib/utils";

type PresetId = "classic" | "deep" | "sprint" | "custom";
type TimerPhase = "focus" | "break";
type SoundType = "off" | "rain" | "white" | "brown";

type StudyTask = {
  id: string;
  text: string;
  done: boolean;
};

const PRESETS: Record<Exclude<PresetId, "custom">, { label: string; focus: number; breakMin: number }> = {
  classic: { label: "25/5 Classic", focus: 25, breakMin: 5 },
  deep: { label: "50/10 Deep Work", focus: 50, breakMin: 10 },
  sprint: { label: "15/3 Sprint", focus: 15, breakMin: 3 },
};

const SOUND_OPTIONS: { id: SoundType; label: string }[] = [
  { id: "off", label: "Tắt âm" },
  { id: "rain", label: "Tiếng mưa nhẹ" },
  { id: "white", label: "Tiếng ồn trắng" },
  { id: "brown", label: "Tiếng ồn nâu" },
];

const STORAGE_SESSIONS_KEY = "quizken_pomodoro_daily_v1";
const STORAGE_TASKS_KEY = "quizken_pomodoro_tasks_v1";
const STORAGE_CHANGE_EVENT = "quizken-pomodoro-storage";
const EMPTY_TASKS: StudyTask[] = [];

let cachedTasksRaw: string | null = null;
let cachedTasksParsed: StudyTask[] = EMPTY_TASKS;

function subscribeLocalStore(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_CHANGE_EVENT, callback);
  };
}

function getTodaySessionsSnapshot(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_SESSIONS_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { date?: string; count?: number };
    return parsed.date === getTodayKey() && typeof parsed.count === "number" ? parsed.count : 0;
  } catch {
    return 0;
  }
}

function getTasksSnapshot(): StudyTask[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_TASKS_KEY);
    if (raw === cachedTasksRaw) return cachedTasksParsed;
    cachedTasksRaw = raw;
    if (!raw) {
      cachedTasksParsed = EMPTY_TASKS;
      return EMPTY_TASKS;
    }
    const parsed = JSON.parse(raw);
    cachedTasksParsed = Array.isArray(parsed) ? parsed.slice(0, 20) : EMPTY_TASKS;
    return cachedTasksParsed;
  } catch {
    return EMPTY_TASKS;
  }
}

function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatMMSS(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function clampMinutes(val: number, fallback: number): number {
  if (!Number.isFinite(val)) return fallback;
  return Math.min(120, Math.max(1, Math.round(val)));
}

export function PomodoroStudyTimer() {
  const [preset, setPreset] = useState<PresetId>("classic");
  const [customFocus, setCustomFocus] = useState<number>(30);
  const [customBreak, setCustomBreak] = useState<number>(5);
  const [phase, setPhase] = useState<TimerPhase>("focus");
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const [soundType, setSoundType] = useState<SoundType>("off");
  const [volume, setVolume] = useState<number>(0.35);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [lastCompletedBanner, setLastCompletedBanner] = useState<boolean>(false);
  const [taskInput, setTaskInput] = useState<string>("");

  const todaySessions = useSyncExternalStore(
    subscribeLocalStore,
    getTodaySessionsSnapshot,
    () => 0,
  );
  const tasks = useSyncExternalStore(
    subscribeLocalStore,
    getTasksSnapshot,
    () => EMPTY_TASKS,
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const focusMinutes = preset === "custom" ? customFocus : PRESETS[preset].focus;
  const breakMinutes = preset === "custom" ? customBreak : PRESETS[preset].breakMin;
  const totalPhaseSeconds = (phase === "focus" ? focusMinutes : breakMinutes) * 60;

  const persistTasks = useCallback((next: StudyTask[]) => {
    try {
      window.localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const incrementTodaySession = useCallback(() => {
    try {
      const current = getTodaySessionsSnapshot();
      window.localStorage.setItem(
        STORAGE_SESSIONS_KEY,
        JSON.stringify({ date: getTodayKey(), count: current + 1 }),
      );
      window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const ensureAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => undefined);
    }
    return audioCtxRef.current;
  }, []);

  const stopAmbientSound = useCallback(() => {
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
        noiseSourceRef.current.disconnect();
      } catch {
        // Already stopped
      }
      noiseSourceRef.current = null;
    }
    if (gainNodeRef.current) {
      try {
        gainNodeRef.current.disconnect();
      } catch {
        // Already disconnected
      }
      gainNodeRef.current = null;
    }
  }, []);

  const startAmbientSound = useCallback(
    (type: SoundType, vol: number) => {
      stopAmbientSound();
      if (type === "off") return;

      const ctx = ensureAudioContext();
      if (!ctx) return;

      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      if (type === "white") {
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.35;
        }
      } else if (type === "brown") {
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 2.6;
        }
      } else {
        // Gentle rain: pink-ish noise with subtle droplet shimmer
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.997 * b0 + white * 0.029;
          b1 = 0.985 * b1 + white * 0.032;
          b2 = 0.95 * b2 + white * 0.048;
          const droplet = Math.random() > 0.9985 ? (Math.random() * 2 - 1) * 0.35 : 0;
          data[i] = (b0 + b1 + b2 + white * 0.08) * 0.55 + droplet;
        }
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const gain = ctx.createGain();
      gain.gain.value = Math.max(0.02, Math.min(0.8, vol * 0.6));

      if (type === "rain") {
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 1100;
        filter.Q.value = 0.7;
        source.connect(filter);
        filter.connect(gain);
      } else if (type === "brown") {
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 420;
        source.connect(filter);
        filter.connect(gain);
      } else {
        source.connect(gain);
      }

      gain.connect(ctx.destination);
      source.start(0);

      noiseSourceRef.current = source;
      gainNodeRef.current = gain;
    },
    [ensureAudioContext, stopAmbientSound],
  );

  const playGentleChime = useCallback(() => {
    const ctx = ensureAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);

      gain.gain.setValueAtTime(0.001, now + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.14, now + idx * 0.14 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.14);
      osc.stop(now + idx * 0.14 + 0.95);
    });
  }, [ensureAudioContext]);

  // Sync volume slider with active gain node
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        Math.max(0.02, Math.min(0.8, volume * 0.6)),
        audioCtxRef.current.currentTime,
      );
    }
  }, [volume]);

  // Clean up Web Audio completely on unmount
  useEffect(() => {
    return () => {
      stopAmbientSound();
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => undefined);
        audioCtxRef.current = null;
      }
    };
  }, [stopAmbientSound]);

  // Listen for browser fullscreen changes
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Countdown tick
  useEffect(() => {
    if (!isRunning) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          playGentleChime();
          if (phase === "focus") {
            incrementTodaySession();
            setLastCompletedBanner(true);
            setPhase("break");
            setIsRunning(false);
            return breakMinutes * 60;
          } else {
            setPhase("focus");
            setIsRunning(false);
            return focusMinutes * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, phase, focusMinutes, breakMinutes, incrementTodaySession, playGentleChime]);

  const handleSelectPreset = (nextPreset: PresetId) => {
    setPreset(nextPreset);
    setIsRunning(false);
    setPhase("focus");
    const mins = nextPreset === "custom" ? customFocus : PRESETS[nextPreset].focus;
    setSecondsLeft(mins * 60);
  };

  const handleSwitchPhase = (nextPhase: TimerPhase) => {
    setIsRunning(false);
    setPhase(nextPhase);
    setSecondsLeft((nextPhase === "focus" ? focusMinutes : breakMinutes) * 60);
  };

  const handleToggleRun = () => {
    ensureAudioContext();
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft((phase === "focus" ? focusMinutes : breakMinutes) * 60);
  };

  const handleSoundSelect = (nextSound: SoundType) => {
    setSoundType(nextSound);
    startAmbientSound(nextSound, volume);
  };

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && containerRef.current) {
        await containerRef.current.requestFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // Fallback visual focus state
      setIsFullscreen((v) => !v);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = taskInput.trim();
    if (!trimmed) return;
    const next: StudyTask[] = [
      { id: `${Date.now()}`, text: trimmed, done: false },
      ...tasks,
    ];
    persistTasks(next);
    setTaskInput("");
  };

  const handleToggleTask = (id: string) => {
    persistTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const handleDeleteTask = (id: string) => {
    persistTasks(tasks.filter((t) => t.id !== id));
  };

  const progressPct = useMemo(() => {
    if (totalPhaseSeconds <= 0) return 0;
    return Math.min(100, Math.max(0, ((totalPhaseSeconds - secondsLeft) / totalPhaseSeconds) * 100));
  }, [secondsLeft, totalPhaseSeconds]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "grid grid-cols-1 gap-6 lg:grid-cols-12",
        isFullscreen && "bg-background p-6 sm:p-10 overflow-y-auto",
      )}
    >
      {/* Left: Main Pomodoro Clock & Ambient Audio */}
      <div className="space-y-6 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-7 lg:col-span-7">
        {/* Preset Switcher & Fullscreen */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PRESETS) as Array<Exclude<PresetId, "custom">>).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => handleSelectPreset(id)}
                className={cn(
                  "min-h-11 rounded-xl px-3.5 text-xs font-bold transition-colors cursor-pointer sm:text-sm",
                  preset === id
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.1]",
                )}
              >
                {PRESETS[id].label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleSelectPreset("custom")}
              className={cn(
                "min-h-11 rounded-xl px-3.5 text-xs font-bold transition-colors cursor-pointer sm:text-sm",
                preset === "custom"
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.1]",
              )}
            >
              Tùy chỉnh
            </button>
          </div>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            aria-label={isFullscreen ? "Thoát toàn màn hình" : "Chế độ tập trung toàn màn hình"}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-foreground/[0.05] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>

        {/* Custom Minutes Inputs */}
        {preset === "custom" && (
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]">
            <div>
              <label htmlFor="custom-focus" className="text-xs font-semibold text-muted-foreground">
                Phút tập trung (1–120)
              </label>
              <input
                id="custom-focus"
                type="number"
                min={1}
                max={120}
                value={customFocus}
                onChange={(e) => {
                  const val = clampMinutes(parseInt(e.target.value, 10), 25);
                  setCustomFocus(val);
                  if (phase === "focus" && !isRunning) setSecondsLeft(val * 60);
                }}
                className="mt-1 min-h-11 w-full rounded-xl border border-border/70 bg-background px-3 font-heading font-bold text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="custom-break" className="text-xs font-semibold text-muted-foreground">
                Phút nghỉ ngơi (1–120)
              </label>
              <input
                id="custom-break"
                type="number"
                min={1}
                max={120}
                value={customBreak}
                onChange={(e) => {
                  const val = clampMinutes(parseInt(e.target.value, 10), 5);
                  setCustomBreak(val);
                  if (phase === "break" && !isRunning) setSecondsLeft(val * 60);
                }}
                className="mt-1 min-h-11 w-full rounded-xl border border-border/70 bg-background px-3 font-heading font-bold text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>
        )}

        {/* Phase Tabs */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-foreground/[0.04] p-1.5 dark:bg-foreground/[0.06]">
          <button
            type="button"
            onClick={() => handleSwitchPhase("focus")}
            className={cn(
              "min-h-11 rounded-lg text-sm font-bold transition-colors cursor-pointer",
              phase === "focus"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Tập trung ({focusMinutes}p)
          </button>
          <button
            type="button"
            onClick={() => handleSwitchPhase("break")}
            className={cn(
              "min-h-11 rounded-lg text-sm font-bold transition-colors cursor-pointer",
              phase === "break"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Nghỉ ngơi ({breakMinutes}p)
          </button>
        </div>

        {/* Clock Display */}
        <div className="rounded-2xl bg-foreground/[0.04] p-6 text-center dark:bg-foreground/[0.06] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            {phase === "focus" ? "Phiên học tập sâu (Focus)" : "Thời gian thư giãn não bộ (Break)"}
          </p>
          <div className="mt-2 font-heading text-6xl font-extrabold tracking-tight text-foreground sm:text-7xl tabular-nums">
            {formatMMSS(secondsLeft)}
          </div>
          <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleToggleRun}
              className="inline-flex min-h-12 min-w-40 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-heading text-base font-bold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer"
            >
              {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              <span>{isRunning ? "Tạm dừng" : "Bắt đầu"}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-foreground/[0.06] px-5 font-heading text-sm font-bold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Đặt lại</span>
            </button>
          </div>
        </div>

        {/* Post-Session Active Recall Banner */}
        {(lastCompletedBanner || todaySessions > 0) && (
          <div className="flex flex-col justify-between gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4 sm:flex-row sm:items-center">
            <div className="text-xs sm:text-sm">
              <p className="font-bold text-foreground">
                {lastCompletedBanner
                  ? "Chúc mừng bạn vừa hoàn thành 1 phiên Pomodoro!"
                  : `Hôm nay bạn đã hoàn thành ${todaySessions} phiên tập trung.`}
              </p>
              <p className="text-muted-foreground">
                Củng cố trí nhớ ngay bằng phương pháp gợi nhớ chủ động (Active Recall).
              </p>
            </div>
            <a
              href={appLink("/")}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground hover:opacity-90"
            >
              <span>Test nhanh 5 câu Active Recall trên QuizKen</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        {/* Zero-bandwidth Web Audio Ambient Sound */}
        <div className="space-y-3 rounded-xl border border-border/60 bg-background/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {soundType === "off" ? (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Volume2 className="h-4 w-4 text-primary" />
              )}
              <span className="text-sm font-bold text-foreground">
                Âm thanh tập trung (Web Audio 0KB băng thông)
              </span>
            </div>
            {soundType !== "off" && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Âm lượng</span>
                <input
                  type="range"
                  aria-label="Âm lượng âm thanh nền"
                  min={0.05}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-24 cursor-pointer accent-primary"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SOUND_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSoundSelect(opt.id)}
                className={cn(
                  "min-h-11 rounded-xl px-3 text-xs font-semibold transition-colors cursor-pointer",
                  soundType === opt.id
                    ? "bg-primary/15 text-primary border border-primary/40"
                    : "bg-foreground/[0.04] text-foreground hover:bg-foreground/[0.08]",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Daily Stats & Study Task List */}
      <div className="flex flex-col justify-between space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-5">
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-2">
            <Badge className="bg-primary/15 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Nhật ký học hôm nay</span>
            </Badge>
            <span className="text-xs font-semibold text-muted-foreground">Lưu trên trình duyệt</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
              <p className="text-xs text-muted-foreground">Phiên hoàn thành</p>
              <p className="mt-1 font-heading text-3xl font-extrabold text-primary">
                {todaySessions}
              </p>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
              <p className="text-xs text-muted-foreground">Tổng phút tập trung</p>
              <p className="mt-1 font-heading text-3xl font-extrabold text-foreground">
                {todaySessions * focusMinutes}p
              </p>
            </div>
          </div>

          {/* Quick Task Checklist */}
          <div className="space-y-3">
            <h2 className="font-heading text-base font-bold text-foreground">
              Danh sách mục tiêu phiên học
            </h2>

            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="VD: Làm 20 câu Đúng/Sai môn Toán..."
                className="min-h-11 flex-1 rounded-xl border border-border/70 bg-background px-3.5 text-sm text-foreground outline-none focus:border-primary"
              />
              <button
                type="submit"
                aria-label="Thêm mục tiêu"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-primary px-3 text-primary-foreground hover:opacity-90 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </form>

            {tasks.length === 0 ? (
              <p className="rounded-xl bg-foreground/[0.03] p-4 text-center text-xs text-muted-foreground">
                Chưa có đầu việc nào. Thêm 1–3 mục tiêu nhỏ để tập trung giải quyết trong phiên này.
              </p>
            ) : (
              <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-foreground/[0.04] px-3 py-2 dark:bg-foreground/[0.06]"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id)}
                      className="flex min-h-10 flex-1 items-center gap-2.5 text-left text-sm cursor-pointer"
                    >
                      <CheckCircle2
                        className={cn(
                          "h-4 w-4 shrink-0",
                          task.done ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      <span
                        className={cn(
                          "break-words",
                          task.done && "line-through text-muted-foreground",
                        )}
                      >
                        {task.text}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      aria-label="Xóa mục tiêu"
                      className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
