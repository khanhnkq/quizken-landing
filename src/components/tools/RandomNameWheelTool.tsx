"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  RotateCcw,
  Sparkles,
  Trash2,
  Trophy,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const WHEEL_COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#6366f1",
  "#14b8a6",
  "#ef4444",
];

const SAMPLE_STUDENTS = [
  "Nguyễn Minh Anh",
  "Trần Hoàng Bảo",
  "Lê Ngọc Châu",
  "Phạm Đức Dũng",
  "Hoàng Thu Hà",
  "Vũ Quang Huy",
  "Đặng Khánh Linh",
  "Bùi Gia Minh",
  "Đỗ Thảo Nguyên",
  "Ngô Tuấn Phong",
  "Dương Bảo Quyên",
  "Lý Hải Sơn",
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeSlice(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
) {
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg <= 180 ? "0" : "1";
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export function RandomNameWheelTool() {
  const [rawText, setRawText] = useState<string>(SAMPLE_STUDENTS.join("\n"));
  const [excludeWinner, setExcludeWinner] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [excludedNames, setExcludedNames] = useState<string[]>([]);
  const [rotation, setRotation] = useState<number>(0);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        void audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const allNames = useMemo(() => {
    return rawText
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [rawText]);

  const activeNames = useMemo(() => {
    if (!excludeWinner) return allNames;
    const excludedSet = new Set(excludedNames);
    return allNames.filter((n) => !excludedSet.has(n));
  }, [allNames, excludeWinner, excludedNames]);

  const playWinChime = () => {
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

      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        const startAt = ctx.currentTime + i * 0.08;
        gain.gain.setValueAtTime(0.001, startAt);
        gain.gain.exponentialRampToValueAtTime(0.14, startAt + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startAt);
        osc.stop(startAt + 0.32);
      });
    } catch {
      // Audio blocked or unsupported
    }
  };

  const handleSpin = () => {
    if (spinning || activeNames.length === 0) return;

    const count = activeNames.length;
    const winIdx = Math.floor(Math.random() * count);
    const chosenName = activeNames[winIdx];

    const sliceAngle = 360 / count;
    const jitter = (Math.random() - 0.5) * sliceAngle * 0.55;
    // Slice 0 starts at 12 o'clock (-90deg in SVG). Center from 12 o'clock clockwise:
    const targetFromTop = (winIdx + 0.5) * sliceAngle + jitter;
    const neededMod = (360 - (targetFromTop % 360) + 360) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    const deltaMod = (neededMod - currentMod + 360) % 360;
    const nextRotation = rotation + 6 * 360 + deltaMod;

    setSpinning(true);
    setRotation(nextRotation);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSpinning(false);
      setWinner(chosenName);
      setHistory((prev) => [chosenName, ...prev]);
      if (excludeWinner) {
        setExcludedNames((prev) =>
          prev.includes(chosenName) ? prev : [...prev, chosenName],
        );
      }
      playWinChime();
    }, 4200);
  };

  const handleRestoreExcluded = () => {
    setExcludedNames([]);
    setWinner(null);
  };

  const handleLoadSample = () => {
    setRawText(SAMPLE_STUDENTS.join("\n"));
    setExcludedNames([]);
    setWinner(null);
    setHistory([]);
  };

  const displaySlices = activeNames.length > 0 ? activeNames : ["Hết tên"];
  const sliceAngle = 360 / displaySlices.length;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left: Wheel */}
      <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-7">
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/15 text-primary">
              Còn {activeNames.length} / {allNames.length} học sinh
            </Badge>
          </div>
          <button
            type="button"
            onClick={() => setSoundEnabled((s) => !s)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-4 w-4 text-primary" />
                <span>Âm thanh: Bật</span>
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 text-muted-foreground" />
                <span>Âm thanh: Tắt</span>
              </>
            )}
          </button>
        </div>

        {/* SVG Wheel + Pointer */}
        <div className="relative flex w-full max-w-[380px] items-center justify-center py-2">
          {/* Top Pointer */}
          <div
            className="absolute -top-1 left-1/2 z-20 -translate-x-1/2"
            aria-hidden
          >
            <div className="h-0 w-0 border-x-[14px] border-t-[26px] border-x-transparent border-t-foreground drop-shadow-sm" />
          </div>

          <div
            className="w-full aspect-square rounded-full border-4 border-foreground/15 overflow-hidden shadow-sm"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? "transform 4.2s cubic-bezier(0.17, 0.67, 0.14, 0.99)"
                : "none",
            }}
          >
            <svg viewBox="0 0 400 400" className="h-full w-full">
              {displaySlices.map((name, i) => {
                const startDeg = i * sliceAngle - 90;
                const endDeg = (i + 1) * sliceAngle - 90;
                const midDeg = startDeg + sliceAngle / 2;
                const color =
                  activeNames.length === 0
                    ? "#9ca3af"
                    : WHEEL_COLORS[i % WHEEL_COLORS.length];

                const textRadius = displaySlices.length > 16 ? 132 : 122;
                const labelPos = polarToCartesian(200, 200, textRadius, midDeg);
                const truncated =
                  name.length > 16 ? `${name.slice(0, 15)}…` : name;

                return (
                  <g key={`${name}-${i}`}>
                    {displaySlices.length === 1 ? (
                      <circle cx="200" cy="200" r="200" fill={color} />
                    ) : (
                      <path
                        d={describeSlice(200, 200, 200, startDeg, endDeg)}
                        fill={color}
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                    )}
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      fill="#ffffff"
                      fontSize={displaySlices.length > 20 ? "10" : "12.5"}
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midDeg}, ${labelPos.x}, ${labelPos.y})`}
                    >
                      {truncated}
                    </text>
                  </g>
                );
              })}
              <circle
                cx="200"
                cy="200"
                r="28"
                fill="#ffffff"
                stroke="#111827"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>

        {/* Result Banner + Spin Button */}
        {winner && (
          <div className="flex w-full items-center justify-between gap-3 rounded-2xl border border-primary/50 bg-primary/10 px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <Trophy className="h-5 w-5 text-primary shrink-0" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Học sinh được chọn
                </div>
                <div className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                  {winner}
                </div>
              </div>
            </div>
            {excludeWinner && (
              <Badge className="bg-primary text-primary-foreground">
                Đã tạm ẩn khỏi vòng
              </Badge>
            )}
          </div>
        )}

        <div className="flex w-full flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSpin}
            disabled={spinning || activeNames.length === 0}
            className={cn(
              "inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-heading text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 cursor-pointer",
            )}
          >
            <span>
              {spinning
                ? "Đang quay..."
                : activeNames.length === 0
                  ? "Đã gọi hết danh sách"
                  : "QUAY NGAY"}
            </span>
          </button>

          {excludedNames.length > 0 && (
            <button
              type="button"
              onClick={handleRestoreExcluded}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-foreground/[0.06] px-4 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Khôi phục ({excludedNames.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Right: Student List & Settings */}
      <div className="space-y-4 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading text-lg font-bold text-foreground">
            Danh sách học sinh
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex min-h-10 items-center gap-1 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Mẫu 12 HS</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRawText("");
                setExcludedNames([]);
                setWinner(null);
              }}
              className="inline-flex min-h-10 items-center gap-1 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Xóa</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Dán trực tiếp cột tên từ Excel hoặc nhập mỗi học sinh một dòng:
        </p>

        <textarea
          aria-label="Danh sách tên học sinh"
          rows={10}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder={"Nguyễn Văn A\nTrần Thị B\nLê Hoàng C"}
          className="w-full rounded-xl border border-border bg-background p-3.5 text-sm leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />

        <label className="flex min-h-11 items-center justify-between gap-3 rounded-xl bg-foreground/[0.04] px-3.5 py-2 text-xs font-semibold text-foreground cursor-pointer dark:bg-foreground/[0.06] sm:text-sm">
          <span>Tự động loại tên đã trúng (không trùng lặp)</span>
          <input
            type="checkbox"
            checked={excludeWinner}
            onChange={(e) => setExcludeWinner(e.target.checked)}
            className="h-5 w-5 accent-emerald-500 cursor-pointer"
          />
        </label>

        {history.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>Lịch sử đã gọi ({history.length})</span>
              <button
                type="button"
                onClick={() => setHistory([])}
                className="hover:text-foreground cursor-pointer"
              >
                Xóa lịch sử
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
              {history.map((h, i) => (
                <Badge key={`${h}-${i}`}>
                  #{history.length - i}: {h}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
