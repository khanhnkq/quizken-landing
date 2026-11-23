"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, RotateCcw, Sparkles, Target } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

function clampSkill(raw: string): number {
  const parsed = parseFloat(raw.replace(",", "."));
  if (Number.isNaN(parsed)) return 0;
  return Math.min(10, Math.max(0, Math.round(parsed * 100) / 100));
}

export function roundVstepScore(rawAverage: number): number {
  return Math.round(rawAverage * 2) / 2;
}

type VstepLevelInfo = {
  code: string;
  label: string;
  cefr: string;
  ieltsRef: string;
  tone: "danger" | "warn" | "good" | "great";
};

function classifyVstep(officialScore: number): VstepLevelInfo {
  if (officialScore >= 8.5) {
    return {
      code: "C1",
      label: "Bậc 5 — C1",
      cefr: "CEFR C1",
      ieltsRef: "IELTS ~7.0 – 8.0",
      tone: "great",
    };
  }
  if (officialScore >= 6.0) {
    return {
      code: "B2",
      label: "Bậc 4 — B2",
      cefr: "CEFR B2",
      ieltsRef: "IELTS ~5.5 – 6.5",
      tone: "good",
    };
  }
  if (officialScore >= 4.0) {
    return {
      code: "B1",
      label: "Bậc 3 — B1",
      cefr: "CEFR B1",
      ieltsRef: "IELTS ~4.0 – 5.0",
      tone: "warn",
    };
  }
  return {
    code: "Chưa đạt",
    label: "Chưa đạt (Dưới B1)",
    cefr: "Dưới B1",
    ieltsRef: "IELTS < 4.0",
    tone: "danger",
  };
}

const TARGET_THRESHOLDS = [
  { key: "B1", label: "Mốc B1 (4.0)", requiredOfficial: 4.0, requiredMinSum: 15.0 },
  { key: "B2", label: "Mốc B2 (6.0)", requiredOfficial: 6.0, requiredMinSum: 23.0 },
  { key: "C1", label: "Mốc C1 (8.5)", requiredOfficial: 8.5, requiredMinSum: 33.0 },
];

export function VstepScoreCalculator() {
  const [listening, setListening] = useState<string>("6.0");
  const [speaking, setSpeaking] = useState<string>("5.5");
  const [reading, setReading] = useState<string>("6.5");
  const [writing, setWriting] = useState<string>("5.5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const l = clampSkill(listening);
    const s = clampSkill(speaking);
    const r = clampSkill(reading);
    const w = clampSkill(writing);

    const sum = Math.round((l + s + r + w) * 100) / 100;
    const rawAvg = sum / 4;
    const officialScore = roundVstepScore(rawAvg);
    const level = classifyVstep(officialScore);

    const skills = [
      { key: "listening", name: "Nghe (Listening)", score: l },
      { key: "reading", name: "Đọc (Reading)", score: r },
      { key: "writing", name: "Viết (Writing)", score: w },
      { key: "speaking", name: "Nói (Speaking)", score: s },
    ];
    const weakest = [...skills].sort((a, b) => a.score - b.score)[0];

    const targets = TARGET_THRESHOLDS.map((t) => {
      const gap = Math.max(0, Math.round((t.requiredMinSum - sum) * 100) / 100);
      const reached = officialScore >= t.requiredOfficial;
      return {
        ...t,
        reached,
        gap,
      };
    });

    return {
      l,
      s,
      r,
      w,
      sum,
      rawAvg: Math.round(rawAvg * 1000) / 1000,
      officialScore,
      level,
      weakest,
      targets,
    };
  }, [listening, speaking, reading, writing]);

  const handleLoadSample = (preset: "b1" | "b2" | "c1") => {
    if (preset === "b1") {
      setListening("4.5");
      setReading("5.0");
      setWriting("4.0");
      setSpeaking("4.0");
    } else if (preset === "b2") {
      setListening("6.0");
      setReading("6.5");
      setWriting("5.5");
      setSpeaking("5.5");
    } else {
      setListening("8.5");
      setReading("9.0");
      setWriting("8.0");
      setSpeaking("8.0");
    }
  };

  const handleReset = () => {
    setListening("0");
    setSpeaking("0");
    setReading("0");
    setWriting("0");
  };

  const handleCopy = async () => {
    const text = [
      "KẾT QUẢ TÍNH ĐIỂM VSTEP (B1 - B2 - C1)",
      `• Nghe: ${result.l} | Đọc: ${result.r} | Viết: ${result.w} | Nói: ${result.s}`,
      `• Trung bình cộng: ${result.rawAvg.toFixed(2)} -> Làm tròn chuẩn 0.5: ${result.officialScore.toFixed(1)} / 10`,
      `• Xếp loại năng lực: ${result.level.label} (${result.level.ieltsRef})`,
      "Tính tại: https://www.quizken.com/cong-cu/tinh-diem-thi-vstep-b1-b2-c1",
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: 4 Skills Input */}
        <div className="space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              1. Nhập điểm 4 kỹ năng VSTEP (thang 0 – 10)
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleLoadSample("b1")}
                className="min-h-11 rounded-xl bg-foreground/[0.05] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
              >
                Mẫu B1
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample("b2")}
                className="min-h-11 rounded-xl bg-foreground/[0.05] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
              >
                Mẫu B2
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample("c1")}
                className="min-h-11 rounded-xl bg-foreground/[0.05] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
              >
                Mẫu C1
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex min-h-11 items-center gap-1 rounded-xl bg-foreground/[0.05] px-3 text-xs font-semibold text-muted-foreground hover:bg-foreground/[0.1] hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Xóa
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { id: "vstep-l", label: "Nghe (Listening)", val: listening, set: setListening },
              { id: "vstep-r", label: "Đọc (Reading)", val: reading, set: setReading },
              { id: "vstep-w", label: "Viết (Writing)", val: writing, set: setWriting },
              { id: "vstep-s", label: "Nói (Speaking)", val: speaking, set: setSpeaking },
            ].map((item) => (
              <div
                key={item.id}
                className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]"
              >
                <label
                  htmlFor={item.id}
                  className="block text-sm font-bold text-foreground"
                >
                  {item.label}
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    id={item.id}
                    type="number"
                    min={0}
                    max={10}
                    step={0.5}
                    value={item.val}
                    onChange={(e) => item.set(e.target.value)}
                    className="min-h-11 w-full rounded-xl border border-border/70 bg-background px-3 font-heading text-lg font-bold text-foreground outline-none focus:border-primary"
                  />
                  <span className="shrink-0 text-xs font-semibold text-muted-foreground">/ 10</span>
                </div>
              </div>
            ))}
          </div>

          {/* Target Simulator */}
          <div className="space-y-3 rounded-xl border border-border/60 bg-background/60 p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <h3 className="font-heading text-sm font-bold text-foreground sm:text-base">
                Cần thêm tối thiểu bao nhiêu điểm kỹ năng để chạm mốc B1 / B2 / C1?
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {result.targets.map((t) => (
                <div
                  key={t.key}
                  className={cn(
                    "rounded-xl p-3 text-xs",
                    t.reached
                      ? "bg-primary/15 text-foreground"
                      : "bg-foreground/[0.04] dark:bg-foreground/[0.06] text-muted-foreground",
                  )}
                >
                  <div className="font-bold text-foreground">{t.label}</div>
                  {t.reached ? (
                    <div className="mt-1 font-semibold text-primary">Đã đạt mốc này!</div>
                  ) : (
                    <div className="mt-1 leading-relaxed">
                      Cần tăng thêm tối thiểu{" "}
                      <strong className="text-foreground">+{t.gap.toFixed(1)}</strong> tổng điểm
                      (tổng 4 kỹ năng ≥ {t.requiredMinSum.toFixed(0)}).
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Official VSTEP Output */}
        <div className="flex flex-col justify-between space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <Badge className="bg-primary/15 text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Làm tròn bước 0.5</span>
              </Badge>
              <span className="text-xs font-semibold text-muted-foreground">
                TB gốc: {result.rawAvg.toFixed(2)}
              </span>
            </div>

            <div className="rounded-2xl bg-foreground/[0.04] p-5 text-center dark:bg-foreground/[0.06]">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Điểm VSTEP chính thức
              </p>
              <p className="mt-1 font-heading text-5xl font-extrabold text-primary">
                {result.officialScore.toFixed(1)}
              </p>
              <div className="mt-3 inline-flex items-center rounded-xl bg-primary/15 px-3.5 py-1.5 text-sm font-bold text-primary">
                {result.level.label}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]">
                <p className="text-muted-foreground">Khung châu Âu</p>
                <p className="mt-0.5 font-heading font-bold text-foreground">{result.level.cefr}</p>
              </div>
              <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]">
                <p className="text-muted-foreground">Tham chiếu IELTS</p>
                <p className="mt-0.5 font-heading font-bold text-foreground">
                  {result.level.ieltsRef}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-foreground/[0.04] p-3.5 text-xs leading-relaxed text-muted-foreground dark:bg-foreground/[0.06]">
              Kỹ năng cần ưu tiên cải thiện nhất hiện tại:{" "}
              <strong className="text-foreground">
                {result.weakest.name} ({result.weakest.score} điểm)
              </strong>
              . Tổng 4 kỹ năng hiện tại: <strong className="text-foreground">{result.sum}</strong>/40.
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-heading font-bold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? "Đã sao chép bảng điểm!" : "Sao chép kết quả VSTEP"}</span>
            </button>
            <Link
              href="/de-thi/chung-chi/vstep-b1-b2"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-foreground/[0.06] px-4 text-xs font-semibold text-foreground transition-colors hover:bg-foreground/[0.1]"
            >
              <span>Làm đề thi thử VSTEP B1–B2 miễn phí</span>
              <ArrowRight className="h-3.5 w-3.5 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
