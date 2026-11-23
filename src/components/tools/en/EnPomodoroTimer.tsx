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
  { id: "off", label: "Off" },
  { id: "rain", label: "Soft Rain" },
  { id: "white", label: "White Noise" },
  { id: "brown", label: "Brown Noise" },
];

const STORAGE_SESSIONS_KEY = "quizken_en_pomodoro_daily_v1";
const STORAGE_TASKS_KEY = "quizken_en_pomodoro_tasks_v1";
const STORAGE_EVENT = "quizken-en-pomodoro-storage";
const EMPTY_TASKS: StudyTask[] = [];

let cachedRaw: string | null = null;
let cachedTasks: StudyTask[] = EMPTY_TASKS;

function subscribeStore(cb: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("storage", cb);
  window.addEventListener(STORAGE_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(STORAGE_EVENT, cb);
  };
}

function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;
}

function getSessionsSnapshot(): number {
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
    if (raw === cachedRaw) return cachedTasks;
    cachedRaw = raw;
    if (!raw) {
      cachedTasks = EMPTY_TASKS;
      return EMPTY_TASKS;
    }
    const parsed = JSON.parse(raw);
    cachedTasks = Array.isArray(parsed) ? parsed.slice(0, 20) : EMPTY_TASKS;
    return cachedTasks;
  } catch {
    return EMPTY_TASKS;
  }
}

function formatMMSS(totalSeconds: number): string {
  return `${String(Math.floor(totalSeconds / 60)).padStart(2, "0")}:${String(
    totalSeconds % 60,
  ).padStart(2, "0")}`;
}

export function EnPomodoroTimer() {
  const [preset, setPreset] = useState<PresetId>("classic");
  const [customFocus, setCustomFocus] = useState<number>(30);
  const [customBreak, setCustomBreak] = useState<number>(5);
  const [phase, setPhase] = useState<TimerPhase>("focus");
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundType, setSoundType] = useState<SoundType>("off");
  const [volume, setVolume] = useState<number>(0.35);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [completedBanner, setCompletedBanner] = useState<boolean>(false);
  const [taskInput, setTaskInput] = useState<string>("");

  const todaySessions = useSyncExternalStore(subscribeStore, getSessionsSnapshot, () => 0);
  const tasks = useSyncExternalStore(subscribeStore, getTasksSnapshot, () => EMPTY_TASKS);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const focusMinutes = preset === "custom" ? customFocus : PRESETS[preset].focus;
  const breakMinutes = preset === "custom" ? customBreak : PRESETS[preset].breakMin;
  const totalPhaseSeconds = (phase === "focus" ? focusMinutes : breakMinutes) * 60;

  const persistTasks = useCallback((next: StudyTask[]) => {
    try {
      window.localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(STORAGE_EVENT));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const incrementSessions = useCallback(() => {
    try {
      const current = getSessionsSnapshot();
      window.localStorage.setItem(
        STORAGE_SESSIONS_KEY,
        JSON.stringify({ date: getTodayKey(), count: current + 1 }),
      );
      window.dispatchEvent(new Event(STORAGE_EVENT));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const ensureAudioCtx = useCallback((): AudioContext | null => {
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

  const stopAudio = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      } catch {
        // Ignore
      }
      sourceRef.current = null;
    }
    if (gainRef.current) {
      try {
        gainRef.current.disconnect();
      } catch {
        // Ignore
      }
      gainRef.current = null;
    }
  }, []);

  const startSound = useCallback(
    (type: SoundType, vol: number) => {
      stopAudio();
      if (type === "off") return;
      const ctx = ensureAudioCtx();
      if (!ctx) return;

      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      if (type === "white") {
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.35;
      } else if (type === "brown") {
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 2.6;
        }
      } else {
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.997 * b0 + white * 0.029;
          b1 = 0.985 * b1 + white * 0.032;
          b2 = 0.95 * b2 + white * 0.048;
          const drop = Math.random() > 0.9985 ? (Math.random() * 2 - 1) * 0.35 : 0;
          data[i] = (b0 + b1 + b2 + white * 0.08) * 0.55 + drop;
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
      sourceRef.current = source;
      gainRef.current = gain;
    },
    [ensureAudioCtx, stopAudio],
  );

  const playChime = useCallback(() => {
    const ctx = ensureAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
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
  }, [ensureAudioCtx]);

  useEffect(() => {
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.setValueAtTime(
        Math.max(0.02, Math.min(0.8, volume * 0.6)),
        audioCtxRef.current.currentTime,
      );
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => undefined);
        audioCtxRef.current = null;
      }
    };
  }, [stopAudio]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          playChime();
          if (phase === "focus") {
            incrementSessions();
            setCompletedBanner(true);
            setPhase("break");
            setIsRunning(false);
            return breakMinutes * 60;
          }
          setPhase("focus");
          setIsRunning(false);
          return focusMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRunning, phase, focusMinutes, breakMinutes, incrementSessions, playChime]);

  const progressPct = useMemo(
    () =>
      totalPhaseSeconds > 0
        ? Math.min(100, Math.max(0, ((totalPhaseSeconds - secondsLeft) / totalPhaseSeconds) * 100))
        : 0,
    [secondsLeft, totalPhaseSeconds],
  );

  const handleToggleFs = async () => {
    try {
      if (!document.fullscreenElement && containerRef.current) {
        await containerRef.current.requestFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      setIsFullscreen((v) => !v);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "grid grid-cols-1 gap-6 lg:grid-cols-12",
        isFullscreen && "bg-background p-6 sm:p-10 overflow-y-auto",
      )}
    >
      <div className="space-y-6 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-7 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PRESETS) as Array<Exclude<PresetId, "custom">>).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setPreset(id);
                  setIsRunning(false);
                  setPhase("focus");
                  setSecondsLeft(PRESETS[id].focus * 60);
                }}
                className={cn(
                  "min-h-11 rounded-xl px-3.5 text-xs font-bold cursor-pointer sm:text-sm",
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
              onClick={() => {
                setPreset("custom");
                setIsRunning(false);
                setPhase("focus");
                setSecondsLeft(customFocus * 60);
              }}
              className={cn(
                "min-h-11 rounded-xl px-3.5 text-xs font-bold cursor-pointer sm:text-sm",
                preset === "custom"
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.1]",
              )}
            >
              Custom
            </button>
          </div>

          <button
            type="button"
            onClick={handleToggleFs}
            aria-label="Toggle fullscreen focus mode"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-foreground/[0.05] px-3 text-foreground hover:bg-foreground/[0.1] cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>

        {preset === "custom" && (
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]">
            <div>
              <label htmlFor="en-c-focus" className="text-xs font-semibold text-muted-foreground">
                Focus (minutes)
              </label>
              <input
                id="en-c-focus"
                type="number"
                min={1}
                max={120}
                value={customFocus}
                onChange={(e) => {
                  const val = Math.min(120, Math.max(1, parseInt(e.target.value || "25", 10)));
                  setCustomFocus(val);
                  if (phase === "focus" && !isRunning) setSecondsLeft(val * 60);
                }}
                className="mt-1 min-h-11 w-full rounded-xl border border-border/70 bg-background px-3 font-heading font-bold text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="en-c-break" className="text-xs font-semibold text-muted-foreground">
                Break (minutes)
              </label>
              <input
                id="en-c-break"
                type="number"
                min={1}
                max={60}
                value={customBreak}
                onChange={(e) => {
                  const val = Math.min(60, Math.max(1, parseInt(e.target.value || "5", 10)));
                  setCustomBreak(val);
                  if (phase === "break" && !isRunning) setSecondsLeft(val * 60);
                }}
                className="mt-1 min-h-11 w-full rounded-xl border border-border/70 bg-background px-3 font-heading font-bold text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 rounded-xl bg-foreground/[0.04] p-1.5 dark:bg-foreground/[0.06]">
          <button
            type="button"
            onClick={() => {
              setIsRunning(false);
              setPhase("focus");
              setSecondsLeft(focusMinutes * 60);
            }}
            className={cn(
              "min-h-11 rounded-lg text-sm font-bold cursor-pointer",
              phase === "focus" ? "bg-background text-primary shadow-sm" : "text-muted-foreground",
            )}
          >
            Focus ({focusMinutes}m)
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRunning(false);
              setPhase("break");
              setSecondsLeft(breakMinutes * 60);
            }}
            className={cn(
              "min-h-11 rounded-lg text-sm font-bold cursor-pointer",
              phase === "break" ? "bg-background text-primary shadow-sm" : "text-muted-foreground",
            )}
          >
            Break ({breakMinutes}m)
          </button>
        </div>

        <div className="rounded-2xl bg-foreground/[0.04] p-6 text-center dark:bg-foreground/[0.06] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            {phase === "focus" ? "Deep Focus Session" : "Rest & Recharge"}
          </p>
          <div className="mt-2 font-heading text-6xl font-extrabold tracking-tight text-foreground sm:text-7xl tabular-nums">
            {formatMMSS(secondsLeft)}
          </div>
          <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
            <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                ensureAudioCtx();
                setIsRunning((v) => !v);
              }}
              className="inline-flex min-h-12 min-w-40 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-heading text-base font-bold text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              <span>{isRunning ? "Pause" : "Start"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRunning(false);
                setSecondsLeft((phase === "focus" ? focusMinutes : breakMinutes) * 60);
              }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-foreground/[0.06] px-5 font-heading text-sm font-bold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {(completedBanner || todaySessions > 0) && (
          <div className="flex flex-col justify-between gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4 sm:flex-row sm:items-center">
            <div className="text-xs sm:text-sm">
              <p className="font-bold text-foreground">
                {completedBanner
                  ? "Focus session complete! Reinforce what you studied."
                  : `You completed ${todaySessions} focus session(s) today.`}
              </p>
              <p className="text-muted-foreground">
                Active recall right after studying doubles long-term retention.
              </p>
            </div>
            <a
              href={appLink("/")}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground hover:opacity-90"
            >
              <span>5-Question Active Recall Quiz</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        <div className="space-y-3 rounded-xl border border-border/60 bg-background/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {soundType === "off" ? (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Volume2 className="h-4 w-4 text-primary" />
              )}
              <span className="text-sm font-bold text-foreground">
                Ambient Sound (0KB Web Audio Generator)
              </span>
            </div>
            {soundType !== "off" && (
              <input
                type="range"
                aria-label="Ambient volume"
                min={0.05}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 cursor-pointer accent-primary"
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SOUND_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setSoundType(opt.id);
                  startSound(opt.id, volume);
                }}
                className={cn(
                  "min-h-11 rounded-xl px-3 text-xs font-semibold cursor-pointer",
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

      {/* Right: Daily Stats & Tasks */}
      <div className="space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-5">
        <div className="flex items-center justify-between">
          <Badge className="bg-primary/15 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Today&apos;s Study Log</span>
          </Badge>
          <span className="text-xs text-muted-foreground">Saved locally</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
            <p className="text-xs text-muted-foreground">Completed Sessions</p>
            <p className="mt-1 font-heading text-3xl font-extrabold text-primary">{todaySessions}</p>
          </div>
          <div className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
            <p className="text-xs text-muted-foreground">Focus Minutes</p>
            <p className="mt-1 font-heading text-3xl font-extrabold text-foreground">
              {todaySessions * focusMinutes}m
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-heading text-base font-bold text-foreground">Session Checklist</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const t = taskInput.trim();
              if (!t) return;
              persistTasks([{ id: `${Date.now()}`, text: t, done: false }, ...tasks]);
              setTaskInput("");
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="e.g. Review Chapter 4 Biology flashcards..."
              className="min-h-11 flex-1 rounded-xl border border-border/70 bg-background px-3.5 text-sm text-foreground outline-none focus:border-primary"
            />
            <button
              type="submit"
              aria-label="Add study task"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-primary px-3 text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </button>
          </form>

          {tasks.length === 0 ? (
            <p className="rounded-xl bg-foreground/[0.03] p-4 text-center text-xs text-muted-foreground">
              Add 1–3 focused tasks to tackle during this session.
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
                    onClick={() =>
                      persistTasks(
                        tasks.map((x) => (x.id === task.id ? { ...x, done: !x.done } : x)),
                      )
                    }
                    className="flex min-h-10 flex-1 items-center gap-2.5 text-left text-sm cursor-pointer"
                  >
                    <CheckCircle2
                      className={cn(
                        "h-4 w-4 shrink-0",
                        task.done ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    <span className={cn(task.done && "line-through text-muted-foreground")}>
                      {task.text}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => persistTasks(tasks.filter((x) => x.id !== task.id))}
                    aria-label="Delete task"
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
  );
}
