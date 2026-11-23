"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const ELECTIVE_SUBJECTS = [
  "Vật lý",
  "Hóa học",
  "Sinh học",
  "Lịch sử",
  "Địa lý",
  "GDKT & PL",
  "Tin học",
  "Công nghệ",
  "Tiếng Anh",
];

function clampScore(val: string, max = 10): number {
  const parsed = parseFloat(val.replace(",", "."));
  if (Number.isNaN(parsed)) return 0;
  return Math.min(max, Math.max(0, parsed));
}

export function ThptScoreTool() {
  const [math, setMath] = useState<string>("8.2");
  const [literature, setLiterature] = useState<string>("7.75");
  const [elective1Name, setElective1Name] = useState<string>("Vật lý");
  const [elective1Score, setElective1Score] = useState<string>("8.5");
  const [elective2Name, setElective2Name] = useState<string>("Tiếng Anh");
  const [elective2Score, setElective2Score] = useState<string>("8.0");

  const [gpa10, setGpa10] = useState<string>("8.1");
  const [gpa11, setGpa11] = useState<string>("8.3");
  const [gpa12, setGpa12] = useState<string>("8.6");

  const [priorityPoints, setPriorityPoints] = useState<string>("0.25");
  const [bonusPoints, setBonusPoints] = useState<string>("0");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const m = clampScore(math);
    const l = clampScore(literature);
    const e1 = clampScore(elective1Score);
    const e2 = clampScore(elective2Score);

    const g10 = clampScore(gpa10);
    const g11 = clampScore(gpa11);
    const g12 = clampScore(gpa12);

    const priority = clampScore(priorityPoints, 2.0);
    const bonus = clampScore(bonusPoints, 4.0);

    const examSum = m + l + e1 + e2;
    const examPart = (examSum + bonus) / 4;
    const schoolRecordPart = (g10 * 1 + g11 * 2 + g12 * 3) / 6;
    const rawDxtn = (examPart + schoolRecordPart) / 2 + priority;
    const finalDxtn = Math.min(10, Math.round(rawDxtn * 100) / 100);

    const failingSubjects: string[] = [];
    if (m <= 1.0) failingSubjects.push(`Toán (${m})`);
    if (l <= 1.0) failingSubjects.push(`Ngữ văn (${l})`);
    if (e1 <= 1.0) failingSubjects.push(`${elective1Name} (${e1})`);
    if (e2 <= 1.0) failingSubjects.push(`${elective2Name} (${e2})`);

    const passed = failingSubjects.length === 0 && finalDxtn >= 5.0;

    return {
      m,
      l,
      e1,
      e2,
      g10,
      g11,
      g12,
      priority,
      bonus,
      examPart: Math.round(examPart * 100) / 100,
      schoolRecordPart: Math.round(schoolRecordPart * 100) / 100,
      rawDxtn: Math.round(rawDxtn * 100) / 100,
      finalDxtn,
      failingSubjects,
      passed,
    };
  }, [
    math,
    literature,
    elective1Name,
    elective1Score,
    elective2Name,
    elective2Score,
    gpa10,
    gpa11,
    gpa12,
    priorityPoints,
    bonusPoints,
  ]);

  const handleLoadExample = () => {
    setMath("8.4");
    setLiterature("7.5");
    setElective1Name("Vật lý");
    setElective1Score("8.75");
    setElective2Name("Hóa học");
    setElective2Score("8.0");
    setGpa10("7.9");
    setGpa11("8.2");
    setGpa12("8.5");
    setPriorityPoints("0.25");
    setBonusPoints("1.0");
  };

  const handleReset = () => {
    setMath("0");
    setLiterature("0");
    setElective1Score("0");
    setElective2Score("0");
    setGpa10("0");
    setGpa11("0");
    setGpa12("0");
    setPriorityPoints("0");
    setBonusPoints("0");
  };

  const handleCopyResult = async () => {
    const summary = [
      `📊 KẾT QUẢ TÍNH ĐIỂM XÉT TỐT NGHIỆP THPT 2027 (CÔNG THỨC 50/50)`,
      `• Điểm thi 4 môn: Toán ${result.m} | Ngữ văn ${result.l} | ${elective1Name} ${result.e1} | ${elective2Name} ${result.e2}`,
      `• Điểm TB 4 bài thi (+ĐKK ${result.bonus}): ${result.examPart.toFixed(2)}`,
      `• ĐTB Học bạ 3 năm (1:2:3): ${result.schoolRecordPart.toFixed(2)} (L10: ${result.g10}, L11: ${result.g11}, L12: ${result.g12})`,
      `• Điểm ưu tiên: ${result.priority.toFixed(2)}`,
      `=> ĐIỂM XÉT TỐT NGHIỆP: ${result.finalDxtn.toFixed(2)} / 10 (${result.passed ? "ĐỦ ĐIỀU KIỆN ĐỖ" : "CHƯA ĐỦ ĐIỀU KIỆN"})`,
      `Tính tại: https://www.quizken.com/cong-cu/tinh-diem-tot-nghiep-thpt-2027`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Input Form */}
      <div className="space-y-6 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
            1. Nhập điểm 4 môn thi tốt nghiệp
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadExample}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground transition-colors hover:bg-foreground/[0.1] cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Ví dụ mẫu</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-foreground/[0.1] hover:text-foreground cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="block text-xs font-semibold text-foreground sm:text-sm">
              Toán (Bắt buộc)
            </span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={10}
              step={0.05}
              value={math}
              onChange={(e) => setMath(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>

          <label className="space-y-1.5">
            <span className="block text-xs font-semibold text-foreground sm:text-sm">
              Ngữ văn (Bắt buộc)
            </span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={10}
              step={0.05}
              value={literature}
              onChange={(e) => setLiterature(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground sm:text-sm">
              Môn tự chọn 1
            </label>
            <div className="flex gap-2">
              <select
                aria-label="Chọn tên môn tự chọn 1"
                value={elective1Name}
                onChange={(e) => setElective1Name(e.target.value)}
                className="h-11 flex-1 rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {ELECTIVE_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
              <input
                type="number"
                aria-label="Điểm môn tự chọn 1"
                inputMode="decimal"
                min={0}
                max={10}
                step={0.05}
                value={elective1Score}
                onChange={(e) => setElective1Score(e.target.value)}
                className="h-11 w-24 rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground sm:text-sm">
              Môn tự chọn 2
            </label>
            <div className="flex gap-2">
              <select
                aria-label="Chọn tên môn tự chọn 2"
                value={elective2Name}
                onChange={(e) => setElective2Name(e.target.value)}
                className="h-11 flex-1 rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {ELECTIVE_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
              <input
                type="number"
                aria-label="Điểm môn tự chọn 2"
                inputMode="decimal"
                min={0}
                max={10}
                step={0.05}
                value={elective2Score}
                onChange={(e) => setElective2Score(e.target.value)}
                className="h-11 w-24 rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        <hr className="border-border/60" />

        {/* School Record Section */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              2. Điểm trung bình học bạ 3 năm (Trọng số 1:2:3)
            </h2>
            <Badge>50% tổng điểm</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Công thức chuẩn Thông tư 24/2024/TT-BGDĐT:{" "}
            <strong className="text-foreground">
              ĐTB học tập = (ĐTB Lớp 10 × 1 + ĐTB Lớp 11 × 2 + ĐTB Lớp 12 × 3) / 6
            </strong>
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="space-y-1.5">
              <span className="block text-xs font-semibold text-foreground">
                ĐTB Lớp 10 (Hệ số 1)
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={10}
                step={0.1}
                value={gpa10}
                onChange={(e) => setGpa10(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="space-y-1.5">
              <span className="block text-xs font-semibold text-foreground">
                ĐTB Lớp 11 (Hệ số 2)
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={10}
                step={0.1}
                value={gpa11}
                onChange={(e) => setGpa11(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="space-y-1.5">
              <span className="block text-xs font-semibold text-foreground">
                ĐTB Lớp 12 (Hệ số 3)
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={10}
                step={0.1}
                value={gpa12}
                onChange={(e) => setGpa12(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>
        </div>

        <hr className="border-border/60" />

        {/* Priority & Bonus */}
        <div className="space-y-3">
          <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
            3. Điểm ưu tiên &amp; Điểm khuyến khích
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block space-y-1.5">
                <span className="block text-xs font-semibold text-foreground">
                  Điểm ưu tiên (ĐƯT: 0 – 2.0)
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={2}
                  step={0.05}
                  value={priorityPoints}
                  onChange={(e) => setPriorityPoints(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "0 (KV3)", val: "0" },
                  { label: "0.25 (KV2-NT)", val: "0.25" },
                  { label: "0.5 (KV1)", val: "0.5" },
                  { label: "1.0 (ĐT1)", val: "1.0" },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setPriorityPoints(preset.val)}
                    className={cn(
                      "min-h-9 rounded-lg px-2.5 text-xs font-semibold transition-colors cursor-pointer",
                      priorityPoints === preset.val
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground/[0.05] text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block space-y-1.5">
                <span className="block text-xs font-semibold text-foreground">
                  Điểm khuyến khích (ĐKK: 0 – 4.0)
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={4}
                  step={0.25}
                  value={bonusPoints}
                  onChange={(e) => setBonusPoints(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <p className="text-xs text-muted-foreground">
                Gồm giải HSG cấp tỉnh, chứng chỉ nghề, tin học/ngoại ngữ theo quy định (cộng vào tổng 4 bài thi trước khi chia 4).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Result Card */}
      <div className="space-y-5 lg:col-span-5">
        <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Kết quả dự kiến 2027
            </span>
            {result.passed ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                <CheckCircle2 className="h-4 w-4" />
                ĐỦ ĐIỀU KIỆN ĐỖ TỐT NGHIỆP
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-3 py-1 text-xs font-bold text-destructive">
                <AlertTriangle className="h-4 w-4" />
                CHƯA ĐỦ ĐIỀU KIỆN ĐỖ
              </span>
            )}
          </div>

          <div className="rounded-2xl bg-foreground/[0.04] p-6 text-center dark:bg-foreground/[0.06]">
            <div className="text-xs font-semibold text-muted-foreground">
              Điểm xét tốt nghiệp (ĐXTN)
            </div>
            <div className="mt-1 font-heading text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              {result.finalDxtn.toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Thang điểm 10 • Ngưỡng đỗ: ≥ 5.00 và không môn nào ≤ 1.00
            </div>
          </div>

          {!result.passed && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3.5 text-xs text-destructive space-y-1">
              {result.failingSubjects.length > 0 && (
                <p>
                  <strong>Cảnh báo điểm liệt (≤ 1.0):</strong>{" "}
                  {result.failingSubjects.join(", ")}.
                </p>
              )}
              {result.finalDxtn < 5.0 && (
                <p>
                  Điểm xét tốt nghiệp ({result.finalDxtn.toFixed(2)}) đang thấp
                  hơn mức tối thiểu 5.00 điểm.
                </p>
              )}
            </div>
          )}

          {/* Breakdown */}
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-foreground/[0.04] px-4 py-3 dark:bg-foreground/[0.06]">
              <span className="text-muted-foreground">
                TB 4 môn thi (+ĐKK {result.bonus.toFixed(2)}) [50%]
              </span>
              <span className="font-heading font-bold text-foreground">
                {result.examPart.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-foreground/[0.04] px-4 py-3 dark:bg-foreground/[0.06]">
              <span className="text-muted-foreground">
                ĐTB Học bạ 3 năm (1:2:3) [50%]
              </span>
              <span className="font-heading font-bold text-foreground">
                {result.schoolRecordPart.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-foreground/[0.04] px-4 py-3 dark:bg-foreground/[0.06]">
              <span className="text-muted-foreground">Điểm ưu tiên cộng thêm</span>
              <span className="font-heading font-bold text-foreground">
                +{result.priority.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Formula Live */}
          <div className="rounded-xl border border-border/60 p-3.5 text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Phép tính trực tiếp:</strong>
            <div className="mt-1 font-mono text-[11px] text-foreground break-words">
              (({result.examPart.toFixed(2)} + {result.schoolRecordPart.toFixed(2)}) / 2) + {result.priority.toFixed(2)} = {result.rawDxtn.toFixed(2)}
              {result.rawDxtn > 10 ? " → 10.00 (tối đa)" : ""}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyResult}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-heading text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Đã sao chép bảng điểm!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Sao chép / Chia sẻ kết quả</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
