"use client";

import { useMemo, useState } from "react";
import {
  Award,
  Plus,
  RotateCcw,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type LetterGrade = "A" | "B+" | "B" | "C+" | "C" | "D+" | "D" | "F";

type CourseRow = {
  id: string;
  name: string;
  credits: number;
  mode: "scale10" | "letter";
  score10: number;
  letter: LetterGrade;
};

const LETTER_MAP: Record<
  LetterGrade,
  { gpa4: number; min10: number; range: string; equiv10: number }
> = {
  A: { gpa4: 4.0, min10: 8.5, range: "8.5 – 10.0", equiv10: 9.0 },
  "B+": { gpa4: 3.5, min10: 8.0, range: "8.0 – 8.4", equiv10: 8.2 },
  B: { gpa4: 3.0, min10: 7.0, range: "7.0 – 7.9", equiv10: 7.5 },
  "C+": { gpa4: 2.5, min10: 6.5, range: "6.5 – 6.9", equiv10: 6.7 },
  C: { gpa4: 2.0, min10: 5.5, range: "5.5 – 6.4", equiv10: 6.0 },
  "D+": { gpa4: 1.5, min10: 5.0, range: "5.0 – 5.4", equiv10: 5.2 },
  D: { gpa4: 1.0, min10: 4.0, range: "4.0 – 4.9", equiv10: 4.5 },
  F: { gpa4: 0.0, min10: 0, range: "< 4.0", equiv10: 3.0 },
};

const LETTER_OPTIONS: LetterGrade[] = ["A", "B+", "B", "C+", "C", "D+", "D", "F"];

function score10ToLetter(score: number): LetterGrade {
  if (score >= 8.5) return "A";
  if (score >= 8.0) return "B+";
  if (score >= 7.0) return "B";
  if (score >= 6.5) return "C+";
  if (score >= 5.5) return "C";
  if (score >= 5.0) return "D+";
  if (score >= 4.0) return "D";
  return "F";
}

function getDegreeClassification(gpa4: number): {
  label: string;
  colorClass: string;
} {
  if (gpa4 >= 3.6) return { label: "Xuất sắc", colorClass: "text-primary bg-primary/15" };
  if (gpa4 >= 3.2) return { label: "Giỏi", colorClass: "text-primary bg-primary/15" };
  if (gpa4 >= 2.5) return { label: "Khá", colorClass: "text-amber-600 dark:text-amber-400 bg-amber-500/15" };
  if (gpa4 >= 2.0) return { label: "Trung bình", colorClass: "text-muted-foreground bg-foreground/[0.08]" };
  return { label: "Yếu / Kém", colorClass: "text-destructive bg-destructive/15" };
}

const INITIAL_COURSES: CourseRow[] = [
  { id: "c1", name: "Giải tích 1", credits: 4, mode: "scale10", score10: 8.6, letter: "A" },
  { id: "c2", name: "Cấu trúc dữ liệu & Giải thuật", credits: 3, mode: "scale10", score10: 8.2, letter: "B+" },
  { id: "c3", name: "Xác suất thống kê", credits: 3, mode: "scale10", score10: 7.5, letter: "B" },
  { id: "c4", name: "Tiếng Anh chuyên ngành", credits: 2, mode: "letter", score10: 9.0, letter: "A" },
];

export function GpaCalculatorTool() {
  const [courses, setCourses] = useState<CourseRow[]>(INITIAL_COURSES);

  // Target calculator states
  const [totalProgramCredits, setTotalProgramCredits] = useState<string>("130");
  const [earnedCredits, setEarnedCredits] = useState<string>("60");
  const [currentAccumGpa, setCurrentAccumGpa] = useState<string>("3.15");
  const [targetGpa, setTargetGpa] = useState<string>("3.20");

  const stats = useMemo(() => {
    let totalCredits = 0;
    let passedCredits = 0;
    let sumWeighted4 = 0;
    let sumWeighted10 = 0;

    for (const c of courses) {
      const cr = Math.max(0, Number(c.credits) || 0);
      if (cr <= 0) continue;
      const letter = c.mode === "scale10" ? score10ToLetter(c.score10) : c.letter;
      const gpa4 = LETTER_MAP[letter].gpa4;
      const val10 = c.mode === "scale10" ? c.score10 : LETTER_MAP[letter].equiv10;

      totalCredits += cr;
      if (letter !== "F") passedCredits += cr;
      sumWeighted4 += gpa4 * cr;
      sumWeighted10 += val10 * cr;
    }

    const gpa4 = totalCredits > 0 ? sumWeighted4 / totalCredits : 0;
    const gpa10 = totalCredits > 0 ? sumWeighted10 / totalCredits : 0;
    const classification = getDegreeClassification(gpa4);

    return {
      totalCredits,
      passedCredits,
      gpa4,
      gpa10,
      classification,
    };
  }, [courses]);

  const targetAnalysis = useMemo(() => {
    const total = Math.max(1, parseFloat(totalProgramCredits) || 130);
    const earned = Math.min(total, Math.max(0, parseFloat(earnedCredits) || 0));
    const current = Math.min(4, Math.max(0, parseFloat(currentAccumGpa) || 0));
    const target = Math.min(4, Math.max(0, parseFloat(targetGpa) || 3.2));
    const remaining = total - earned;

    if (remaining <= 0) {
      return {
        remaining: 0,
        neededGpa: 0,
        status: current >= target ? ("achieved" as const) : ("finished" as const),
      };
    }

    const needed = (target * total - current * earned) / remaining;
    let status: "achieved" | "feasible" | "hard" | "impossible" = "feasible";
    if (needed <= 0) status = "achieved";
    else if (needed > 4.0) status = "impossible";
    else if (needed >= 3.6) status = "hard";

    return {
      remaining,
      neededGpa: Math.round(needed * 100) / 100,
      status,
    };
  }, [totalProgramCredits, earnedCredits, currentAccumGpa, targetGpa]);

  const addCourse = () => {
    const nextId = `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setCourses((prev) => [
      ...prev,
      {
        id: nextId,
        name: `Môn học ${prev.length + 1}`,
        credits: 3,
        mode: "scale10",
        score10: 8.0,
        letter: "B+",
      },
    ]);
  };

  const removeCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCourse = (id: string, patch: Partial<CourseRow>) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updated = { ...c, ...patch };
        if (patch.score10 !== undefined) {
          const clamped = Math.min(10, Math.max(0, patch.score10));
          updated.score10 = clamped;
          updated.letter = score10ToLetter(clamped);
        }
        if (patch.letter !== undefined && updated.mode === "letter") {
          updated.score10 = LETTER_MAP[patch.letter].equiv10;
        }
        return updated;
      }),
    );
  };

  const syncFromTable = () => {
    setEarnedCredits(String(stats.totalCredits));
    setCurrentAccumGpa(stats.gpa4.toFixed(2));
  };

  return (
    <div className="space-y-8">
      {/* Main GPA Calculator */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                Bảng điểm các môn học
              </h2>
              <p className="text-xs text-muted-foreground">
                Nhập điểm hệ 10 hoặc chuyển sang chọn điểm chữ (A → F) cho từng môn
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCourses(INITIAL_COURSES)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground transition-colors hover:bg-foreground/[0.1] cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Dữ liệu mẫu</span>
              </button>
              <button
                type="button"
                onClick={() => setCourses([])}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-foreground/[0.1] hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Xóa hết</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {courses.length === 0 ? (
              <div className="rounded-xl bg-foreground/[0.04] p-6 text-center text-sm text-muted-foreground dark:bg-foreground/[0.06]">
                Chưa có môn học nào. Nhấn &ldquo;Thêm môn học&rdquo; bên dưới để bắt đầu tính GPA.
              </div>
            ) : (
              courses.map((course, idx) => {
                const effectiveLetter =
                  course.mode === "scale10"
                    ? score10ToLetter(course.score10)
                    : course.letter;
                const gpa4Val = LETTER_MAP[effectiveLetter].gpa4;

                return (
                  <div
                    key={course.id}
                    className="grid grid-cols-1 gap-3 rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06] sm:grid-cols-12 sm:items-center"
                  >
                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-semibold text-muted-foreground sm:hidden">
                        Tên môn #{idx + 1}
                      </label>
                      <input
                        type="text"
                        aria-label={`Tên môn học ${idx + 1}`}
                        value={course.name}
                        onChange={(e) =>
                          updateCourse(course.id, { name: e.target.value })
                        }
                        placeholder="Tên học phần..."
                        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:col-span-5">
                      <div>
                        <label className="block text-[11px] font-semibold text-muted-foreground sm:hidden">
                          Tín chỉ
                        </label>
                        <input
                          type="number"
                          aria-label={`Số tín chỉ môn ${idx + 1}`}
                          min={1}
                          max={15}
                          value={course.credits}
                          onChange={(e) =>
                            updateCourse(course.id, {
                              credits: Math.max(1, parseInt(e.target.value || "1", 10)),
                            })
                          }
                          className="h-11 w-full rounded-xl border border-border bg-background px-2.5 text-center text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>

                      <div className="col-span-2 flex gap-1.5">
                        {course.mode === "scale10" ? (
                          <input
                            type="number"
                            aria-label={`Điểm hệ 10 môn ${idx + 1}`}
                            inputMode="decimal"
                            min={0}
                            max={10}
                            step={0.1}
                            value={course.score10}
                            onChange={(e) =>
                              updateCourse(course.id, {
                                score10: parseFloat(e.target.value || "0"),
                              })
                            }
                            className="h-11 flex-1 rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        ) : (
                          <select
                            aria-label={`Điểm chữ môn ${idx + 1}`}
                            value={course.letter}
                            onChange={(e) =>
                              updateCourse(course.id, {
                                letter: e.target.value as LetterGrade,
                              })
                            }
                            className="h-11 flex-1 rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            {LETTER_OPTIONS.map((lg) => (
                              <option key={lg} value={lg}>
                                {lg} ({LETTER_MAP[lg].gpa4.toFixed(1)})
                              </option>
                            ))}
                          </select>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            updateCourse(course.id, {
                              mode: course.mode === "scale10" ? "letter" : "scale10",
                            })
                          }
                          title="Đổi kiểu nhập (Hệ 10 / Điểm chữ)"
                          className="h-11 shrink-0 rounded-xl border border-border bg-background px-2.5 text-[11px] font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {course.mode === "scale10" ? "Hệ 10" : "Chữ"}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 sm:col-span-3 sm:justify-end">
                      <div className="flex items-center gap-1.5">
                        <Badge
                          className={cn(
                            effectiveLetter === "F"
                              ? "bg-destructive/15 text-destructive"
                              : "bg-primary/15 text-primary",
                          )}
                        >
                          {effectiveLetter}
                        </Badge>
                        <span className="text-xs font-bold text-foreground">
                          {gpa4Val.toFixed(1)}
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label={`Xóa môn ${course.name}`}
                        onClick={() => removeCourse(course.id)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button
            type="button"
            onClick={addCourse}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/50 bg-primary/5 px-4 font-heading text-sm font-semibold text-primary transition-colors hover:bg-primary/10 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm môn học</span>
          </button>
        </div>

        {/* Right Live GPA Summary */}
        <div className="space-y-5 lg:col-span-4">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                GPA Tích lũy
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
                  stats.classification.colorClass,
                )}
              >
                <Award className="h-3.5 w-3.5" />
                {stats.classification.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-foreground/[0.04] p-4 text-center dark:bg-foreground/[0.06]">
                <div className="text-xs font-semibold text-muted-foreground">
                  Hệ 4.0
                </div>
                <div className="mt-1 font-heading text-4xl font-bold text-foreground">
                  {stats.gpa4.toFixed(2)}
                </div>
              </div>
              <div className="rounded-2xl bg-foreground/[0.04] p-4 text-center dark:bg-foreground/[0.06]">
                <div className="text-xs font-semibold text-muted-foreground">
                  Hệ 10
                </div>
                <div className="mt-1 font-heading text-4xl font-bold text-foreground">
                  {stats.gpa10.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-foreground/[0.04] px-4 py-3 dark:bg-foreground/[0.06]">
                <span className="text-muted-foreground">Tổng tín chỉ đã nhập</span>
                <span className="font-heading font-bold text-foreground">
                  {stats.totalCredits} TC
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-foreground/[0.04] px-4 py-3 dark:bg-foreground/[0.06]">
                <span className="text-muted-foreground">Tín chỉ tích lũy (đạt)</span>
                <span className="font-heading font-bold text-primary">
                  {stats.passedCredits} TC
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Graduation Calculator */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                Tính mục tiêu bằng tốt nghiệp (GPA các kỳ còn lại)
              </h2>
              <p className="text-xs text-muted-foreground">
                Ước tính GPA tối thiểu cần đạt ở số tín chỉ còn lại để chạm mốc Xuất sắc / Giỏi / Khá
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={syncFromTable}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3.5 text-xs font-semibold text-foreground transition-colors hover:bg-foreground/[0.1] cursor-pointer"
          >
            Lấy từ bảng trên ({stats.gpa4.toFixed(2)} / {stats.totalCredits} TC)
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-1.5">
            <span className="block text-xs font-semibold text-foreground">
              Tổng tín chỉ toàn khóa
            </span>
            <input
              type="number"
              min={30}
              max={250}
              value={totalProgramCredits}
              onChange={(e) => setTotalProgramCredits(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="space-y-1.5">
            <span className="block text-xs font-semibold text-foreground">
              Tín chỉ đã tích lũy
            </span>
            <input
              type="number"
              min={0}
              max={250}
              value={earnedCredits}
              onChange={(e) => setEarnedCredits(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="space-y-1.5">
            <span className="block text-xs font-semibold text-foreground">
              GPA tích lũy hiện tại (Hệ 4)
            </span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={4}
              step={0.01}
              value={currentAccumGpa}
              onChange={(e) => setCurrentAccumGpa(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              GPA mục tiêu tốt nghiệp
            </label>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={4}
              step={0.05}
              value={targetGpa}
              onChange={(e) => setTargetGpa(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: "Khá 2.5", val: "2.50" },
                { label: "Giỏi 3.2", val: "3.20" },
                { label: "Xuất sắc 3.6", val: "3.60" },
              ].map((preset) => (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => setTargetGpa(preset.val)}
                  className={cn(
                    "min-h-8 rounded-lg px-2 text-[11px] font-semibold transition-colors cursor-pointer",
                    targetGpa === preset.val
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/[0.05] text-muted-foreground hover:text-foreground",
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Target Output Banner */}
        <div className="flex flex-col justify-between gap-4 rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06] sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">
              Số tín chỉ còn lại:{" "}
              <strong className="text-foreground">
                {targetAnalysis.remaining} TC
              </strong>
            </div>
            <p className="text-sm font-medium text-foreground">
              {targetAnalysis.status === "achieved" &&
                "Bạn đã vượt hoặc đang giữ mức an toàn cho mục tiêu này!"}
              {targetAnalysis.status === "feasible" &&
                `Bạn cần duy trì trung bình tối thiểu ${targetAnalysis.neededGpa.toFixed(2)} / 4.00 cho ${targetAnalysis.remaining} tín chỉ còn lại.`}
              {targetAnalysis.status === "hard" &&
                `Mục tiêu khá thách thức: cần đạt trung bình ${targetAnalysis.neededGpa.toFixed(2)} / 4.00 (tương đương hầu hết các môn còn lại đạt A/B+).`}
              {targetAnalysis.status === "impossible" &&
                `Cần tới ${targetAnalysis.neededGpa.toFixed(2)} / 4.00 (> 4.0 nên không thể đạt chỉ bằng môn mới). Hãy cân nhắc đăng ký học cải thiện các môn điểm C/D!`}
              {targetAnalysis.status === "finished" &&
                "Số tín chỉ tích lũy đã bằng tổng số tín chỉ khóa học."}
            </p>
          </div>
          <div className="shrink-0 text-left sm:text-right">
            <div className="text-xs font-semibold text-muted-foreground">
              GPA tối thiểu cần đạt
            </div>
            <div
              className={cn(
                "font-heading text-3xl font-bold",
                targetAnalysis.status === "impossible"
                  ? "text-destructive"
                  : "text-primary",
              )}
            >
              {targetAnalysis.remaining === 0
                ? "—"
                : Math.max(0, targetAnalysis.neededGpa).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
