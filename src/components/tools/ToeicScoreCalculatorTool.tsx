"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, RotateCcw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

// ETS-calibrated TOEIC raw-to-scaled lookup interpolation (0-100 raw -> 5-495 scaled)
export function rawListeningToScaled(raw: number): number {
  const r = Math.min(100, Math.max(0, Math.round(raw)));
  if (r <= 6) return 5;
  if (r >= 93) return 495;
  // Standard ETS Listening curve: linear ~5 pts per raw item with slight high-end cushion
  const scaled = Math.round(((r - 6) * (490 / 87) + 5) / 5) * 5;
  return Math.min(495, Math.max(5, scaled));
}

export function rawReadingToScaled(raw: number): number {
  const r = Math.min(100, Math.max(0, Math.round(raw)));
  if (r <= 9) return 5;
  if (r >= 97) return 495;
  // Reading curve is slightly stricter than Listening at the same raw count
  const scaled = Math.round(((r - 9) * (490 / 88) + 5) / 5) * 5;
  return Math.min(495, Math.max(5, scaled));
}

function classifyToeic(total: number): { cefr: string; ielts: string; summary: string } {
  if (total >= 945) {
    return {
      cefr: "C1 (Thành thạo)",
      ielts: "IELTS ~7.5 – 8.5",
      summary: "Thông thạo tiếng Anh thương mại quốc tế, đáp ứng mọi yêu cầu doanh nghiệp đa quốc gia.",
    };
  }
  if (total >= 785) {
    return {
      cefr: "B2+ (Khá giỏi)",
      ielts: "IELTS ~6.5 – 7.0",
      summary: "Đủ điều kiện làm việc chuyên nghiệp và vượt chuẩn đầu ra hầu hết đại học top.",
    };
  }
  if (total >= 550) {
    return {
      cefr: "B1+ – B2 (Trung cao)",
      ielts: "IELTS ~5.0 – 6.0",
      summary: "Đạt chuẩn đầu ra phổ biến (550–650) của nhiều trường đại học và khối văn phòng.",
    };
  }
  if (total >= 450) {
    return {
      cefr: "B1 (Cơ bản vững)",
      ielts: "IELTS ~4.5",
      summary: "Đáp ứng chuẩn đầu ra cơ bản 450 điểm tại một số trường đại học, cao đẳng.",
    };
  }
  return {
    cefr: "A1 – A2 (Sơ cấp)",
    ielts: "IELTS < 4.5",
    summary: "Cần củng cố nền tảng từ vựng TOEIC Part 1–5 và luyện nghe phản xạ hàng ngày.",
  };
}

export function ToeicScoreCalculatorTool() {
  const [rawL, setRawL] = useState<number>(72);
  const [rawR, setRawR] = useState<number>(68);
  const [targetScore, setTargetScore] = useState<number>(650);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const lScore = rawListeningToScaled(rawL);
    const rScore = rawReadingToScaled(rawR);
    const total = lScore + rScore;
    const info = classifyToeic(total);
    const gap = Math.max(0, targetScore - total);
    const estQuestionsNeeded = Math.ceil(gap / 5);

    return {
      lScore,
      rScore,
      total,
      info,
      gap,
      estQuestionsNeeded,
    };
  }, [rawL, rawR, targetScore]);

  const handleReset = () => {
    setRawL(60);
    setRawR(60);
    setTargetScore(650);
  };

  const handleCopy = async () => {
    const text = [
      "KẾT QUẢ QUY ĐỔI ĐIỂM TOEIC LISTENING & READING",
      `• Listening: ${rawL}/100 câu đúng → ${result.lScore} / 495`,
      `• Reading: ${rawR}/100 câu đúng → ${result.rScore} / 495`,
      `• TỔNG ĐIỂM ƯỚC TÍNH: ${result.total} / 990 (${result.info.cefr}, ${result.info.ielts})`,
      "Tính tại: https://www.quizken.com/cong-cu/tinh-diem-toeic-listening-reading",
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Inputs */}
      <div className="space-y-6 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
            1. Nhập số câu làm đúng (Listening &amp; Reading)
          </h2>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Đặt lại
          </button>
        </div>

        {/* Listening Slider + Input */}
        <div className="space-y-3 rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <label htmlFor="toeic-l" className="text-sm font-bold text-foreground">
                Phần Listening (Part 1–4): {rawL} / 100 câu đúng
              </label>
              <p className="text-xs text-muted-foreground">Điểm quy đổi: {result.lScore} / 495</p>
            </div>
            <input
              id="toeic-l"
              type="number"
              min={0}
              max={100}
              value={rawL}
              onChange={(e) => setRawL(Math.min(100, Math.max(0, parseInt(e.target.value || "0", 10))))}
              className="min-h-11 w-20 rounded-xl border border-border/70 bg-background text-center font-heading text-lg font-bold text-primary outline-none focus:border-primary"
            />
          </div>
          <input
            type="range"
            aria-label="Thanh trượt số câu đúng Listening"
            min={0}
            max={100}
            value={rawL}
            onChange={(e) => setRawL(parseInt(e.target.value, 10))}
            className="h-2.5 w-full cursor-pointer accent-primary"
          />
        </div>

        {/* Reading Slider + Input */}
        <div className="space-y-3 rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <label htmlFor="toeic-r" className="text-sm font-bold text-foreground">
                Phần Reading (Part 5–7): {rawR} / 100 câu đúng
              </label>
              <p className="text-xs text-muted-foreground">Điểm quy đổi: {result.rScore} / 495</p>
            </div>
            <input
              id="toeic-r"
              type="number"
              min={0}
              max={100}
              value={rawR}
              onChange={(e) => setRawR(Math.min(100, Math.max(0, parseInt(e.target.value || "0", 10))))}
              className="min-h-11 w-20 rounded-xl border border-border/70 bg-background text-center font-heading text-lg font-bold text-primary outline-none focus:border-primary"
            />
          </div>
          <input
            type="range"
            aria-label="Thanh trượt số câu đúng Reading"
            min={0}
            max={100}
            value={rawR}
            onChange={(e) => setRawR(parseInt(e.target.value, 10))}
            className="h-2.5 w-full cursor-pointer accent-primary"
          />
        </div>

        {/* Target Selector */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Chọn mục tiêu đầu ra của bạn
          </span>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {[450, 550, 650, 750, 850].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTargetScore(t)}
                className={`min-h-11 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                  targetScore === t
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 bg-foreground/[0.03] text-foreground hover:bg-foreground/[0.06]"
                }`}
              >
                {t}+
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Result */}
      <div className="flex flex-col justify-between space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-5">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <Badge className="bg-primary/15 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Thang quy đổi ETS</span>
            </Badge>
            <span className="text-xs font-semibold text-muted-foreground">
              Tổng đúng: {rawL + rawR}/200
            </span>
          </div>

          <div className="rounded-2xl bg-foreground/[0.04] p-5 text-center dark:bg-foreground/[0.06]">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tổng điểm TOEIC ước tính
            </p>
            <p className="mt-1 font-heading text-5xl font-extrabold text-primary">
              {result.total}
            </p>
            <p className="mt-2 text-xs font-semibold text-foreground sm:text-sm">
              L: <strong>{result.lScore}</strong> + R: <strong>{result.rScore}</strong> / 990
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]">
              <p className="text-muted-foreground">Khung CEFR</p>
              <p className="mt-0.5 font-heading font-bold text-foreground">{result.info.cefr}</p>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]">
              <p className="text-muted-foreground">Tham chiếu IELTS</p>
              <p className="mt-0.5 font-heading font-bold text-foreground">{result.info.ielts}</p>
            </div>
          </div>

          <div className="rounded-xl bg-foreground/[0.04] p-3.5 text-xs leading-relaxed text-muted-foreground dark:bg-foreground/[0.06]">
            <p className="text-foreground font-medium">{result.info.summary}</p>
            <p className="mt-1.5">
              {result.gap === 0 ? (
                <strong className="text-primary">Bạn đã đạt mục tiêu {targetScore}+ TOEIC!</strong>
              ) : (
                <span>
                  Để đạt mốc <strong>{targetScore}</strong>, bạn cần tăng thêm{" "}
                  <strong className="text-foreground">+{result.gap} điểm</strong> (tương đương
                  khoảng <strong>+{result.estQuestionsNeeded} câu đúng</strong>).
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-heading font-bold text-primary-foreground hover:opacity-90 cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Đã sao chép điểm TOEIC!" : "Sao chép bảng điểm TOEIC"}</span>
          </button>
          <Link
            href="/de-thi/chung-chi/toeic"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-foreground/[0.06] px-4 text-xs font-semibold text-foreground hover:bg-foreground/[0.1]"
          >
            <span>Làm đề thi thử TOEIC miễn phí</span>
            <ArrowRight className="h-3.5 w-3.5 text-primary" />
          </Link>
        </div>
      </div>
    </div>
  );
}
