"use client";

import { useMemo, useState } from "react";
import { Plus, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type CourseRow = {
  id: string;
  name: string;
  credits: number;
  grade: string;
};

const LETTER_TO_4: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
};

const LETTER_OPTIONS = Object.keys(LETTER_TO_4);

const INITIAL_COURSES: CourseRow[] = [
  { id: "c1", name: "Calculus II", credits: 4, grade: "A-" },
  { id: "c2", name: "Intro to Computer Science", credits: 3, grade: "A" },
  { id: "c3", name: "Academic Writing", credits: 3, grade: "B+" },
  { id: "c4", name: "General Chemistry", credits: 3, grade: "B" },
];

export function computeFinalExamNeeded(
  currentGrade: number,
  targetGrade: number,
  finalWeightPct: number,
): number | null {
  const w = finalWeightPct / 100;
  if (w <= 0 || w >= 1) return null;
  const needed = (targetGrade - currentGrade * (1 - w)) / w;
  return Math.round(needed * 100) / 100;
}

export function EnGpaFinalCalculator() {
  const [tab, setTab] = useState<"gpa" | "final">("gpa");

  // GPA State
  const [courses, setCourses] = useState<CourseRow[]>(INITIAL_COURSES);
  const [priorGpa, setPriorGpa] = useState<string>("3.45");
  const [priorCredits, setPriorCredits] = useState<string>("30");

  // Final Exam Grade State
  const [currentGrade, setCurrentGrade] = useState<string>("86.5");
  const [targetGrade, setTargetGrade] = useState<string>("90");
  const [finalWeight, setFinalWeight] = useState<string>("25");

  const gpaStats = useMemo(() => {
    let semCredits = 0;
    let semPoints = 0;
    for (const c of courses) {
      const cr = Math.max(0, Number(c.credits) || 0);
      const pts = LETTER_TO_4[c.grade] ?? 0;
      semCredits += cr;
      semPoints += cr * pts;
    }
    const semesterGpa = semCredits > 0 ? Math.round((semPoints / semCredits) * 100) / 100 : 0;

    const pCr = Math.max(0, parseFloat(priorCredits) || 0);
    const pGpa = Math.min(4.0, Math.max(0, parseFloat(priorGpa) || 0));
    const totalCredits = pCr + semCredits;
    const cumulativeGpa =
      totalCredits > 0
        ? Math.round(((pCr * pGpa + semPoints) / totalCredits) * 100) / 100
        : 0;

    const standing =
      cumulativeGpa >= 3.8
        ? "Summa Cum Laude Range"
        : cumulativeGpa >= 3.5
          ? "Dean's List / Magna Cum Laude"
          : cumulativeGpa >= 3.0
            ? "Good Academic Standing (B+ / B)"
            : cumulativeGpa >= 2.0
              ? "Satisfactory Standing"
              : "Academic Probation Warning";

    return {
      semCredits,
      semesterGpa,
      totalCredits,
      cumulativeGpa,
      standing,
    };
  }, [courses, priorGpa, priorCredits]);

  const finalStats = useMemo(() => {
    const cur = Math.min(120, Math.max(0, parseFloat(currentGrade) || 0));
    const tgt = Math.min(120, Math.max(0, parseFloat(targetGrade) || 0));
    const wt = Math.min(99, Math.max(1, parseFloat(finalWeight) || 25));
    const needed = computeFinalExamNeeded(cur, tgt, wt) ?? 0;

    const quickTargets = [
      { label: "A (93%)", score: 93 },
      { label: "A- (90%)", score: 90 },
      { label: "B+ (87%)", score: 87 },
      { label: "B (83%)", score: 83 },
      { label: "C (73%)", score: 73 },
      { label: "Pass (70%)", score: 70 },
    ].map((item) => ({
      ...item,
      needed: computeFinalExamNeeded(cur, item.score, wt) ?? 0,
    }));

    return { cur, tgt, wt, needed, quickTargets };
  }, [currentGrade, targetGrade, finalWeight]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-border/70 bg-card/85 p-4">
        <button
          type="button"
          onClick={() => setTab("gpa")}
          className={cn(
            "min-h-11 rounded-xl px-5 text-sm font-bold cursor-pointer",
            tab === "gpa"
              ? "bg-primary text-primary-foreground"
              : "bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.1]",
          )}
        >
          US 4.0 College GPA Calculator
        </button>
        <button
          type="button"
          onClick={() => setTab("final")}
          className={cn(
            "min-h-11 rounded-xl px-5 text-sm font-bold cursor-pointer",
            tab === "final"
              ? "bg-primary text-primary-foreground"
              : "bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.1]",
          )}
        >
          Final Exam Grade Calculator
        </button>
      </div>

      {tab === "gpa" ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                Current Semester Courses
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCourses((prev) => [
                      ...prev,
                      { id: `c-${Date.now()}`, name: `Course ${prev.length + 1}`, credits: 3, grade: "A" },
                    ])
                  }
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-xs font-bold text-primary-foreground hover:opacity-90 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add Course
                </button>
                <button
                  type="button"
                  onClick={() => setCourses(INITIAL_COURSES)}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="grid grid-cols-12 items-center gap-2 rounded-xl bg-foreground/[0.04] p-3 dark:bg-foreground/[0.06]"
                >
                  <input
                    type="text"
                    aria-label="Course name"
                    value={course.name}
                    onChange={(e) =>
                      setCourses((prev) =>
                        prev.map((c) => (c.id === course.id ? { ...c, name: e.target.value } : c)),
                      )
                    }
                    className="col-span-12 min-h-11 rounded-lg border border-border/70 bg-background px-3 text-sm font-medium text-foreground outline-none focus:border-primary sm:col-span-5"
                  />
                  <div className="col-span-5 sm:col-span-3">
                    <input
                      type="number"
                      aria-label="Course credits"
                      min={0.5}
                      max={12}
                      step={0.5}
                      value={course.credits}
                      onChange={(e) =>
                        setCourses((prev) =>
                          prev.map((c) =>
                            c.id === course.id
                              ? { ...c, credits: Math.max(0, parseFloat(e.target.value || "0")) }
                              : c,
                          ),
                        )
                      }
                      className="min-h-11 w-full rounded-lg border border-border/70 bg-background px-2.5 text-center text-sm font-bold text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div className="col-span-5 sm:col-span-3">
                    <select
                      aria-label="Course grade"
                      value={course.grade}
                      onChange={(e) =>
                        setCourses((prev) =>
                          prev.map((c) => (c.id === course.id ? { ...c, grade: e.target.value } : c)),
                        )
                      }
                      className="min-h-11 w-full rounded-lg border border-border/70 bg-background px-2.5 text-sm font-bold text-foreground outline-none focus:border-primary"
                    >
                      {LETTER_OPTIONS.map((g) => (
                        <option key={g} value={g}>
                          {g} ({LETTER_TO_4[g].toFixed(1)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      aria-label="Remove course"
                      onClick={() => setCourses((prev) => prev.filter((c) => c.id !== course.id))}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 rounded-xl border border-border/60 bg-background/60 p-4 sm:grid-cols-2">
              <div>
                <label htmlFor="prior-gpa" className="block text-xs font-semibold text-muted-foreground">
                  Prior Cumulative GPA (optional)
                </label>
                <input
                  id="prior-gpa"
                  type="number"
                  min={0}
                  max={4}
                  step={0.01}
                  value={priorGpa}
                  onChange={(e) => setPriorGpa(e.target.value)}
                  className="mt-1 min-h-11 w-full rounded-xl border border-border/70 bg-background px-3 font-heading font-bold text-foreground outline-none focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="prior-credits" className="block text-xs font-semibold text-muted-foreground">
                  Prior Completed Credits (optional)
                </label>
                <input
                  id="prior-credits"
                  type="number"
                  min={0}
                  max={300}
                  value={priorCredits}
                  onChange={(e) => setPriorCredits(e.target.value)}
                  className="mt-1 min-h-11 w-full rounded-xl border border-border/70 bg-background px-3 font-heading font-bold text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-4">
            <Badge className="bg-primary/15 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>4.0 Scale Results</span>
            </Badge>

            <div className="rounded-2xl bg-foreground/[0.04] p-5 text-center dark:bg-foreground/[0.06]">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Semester GPA
              </p>
              <p className="mt-1 font-heading text-5xl font-extrabold text-primary">
                {gpaStats.semesterGpa.toFixed(2)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {gpaStats.semCredits} semester credits
              </p>
            </div>

            <div className="rounded-2xl bg-foreground/[0.04] p-5 text-center dark:bg-foreground/[0.06]">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Cumulative GPA
              </p>
              <p className="mt-1 font-heading text-4xl font-extrabold text-foreground">
                {gpaStats.cumulativeGpa.toFixed(2)}
              </p>
              <p className="mt-2 text-xs font-semibold text-primary">{gpaStats.standing}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {gpaStats.totalCredits} total credits
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-7">
            <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              What Grade Do I Need on My Final Exam?
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
                <label htmlFor="f-cur" className="block text-xs font-bold text-foreground">
                  Current Grade (%)
                </label>
                <input
                  id="f-cur"
                  type="number"
                  min={0}
                  max={120}
                  step={0.5}
                  value={currentGrade}
                  onChange={(e) => setCurrentGrade(e.target.value)}
                  className="mt-2 min-h-11 w-full rounded-xl border border-border/70 bg-background px-3 font-heading text-lg font-bold text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
                <label htmlFor="f-tgt" className="block text-xs font-bold text-foreground">
                  Target Course Grade (%)
                </label>
                <input
                  id="f-tgt"
                  type="number"
                  min={0}
                  max={120}
                  step={0.5}
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(e.target.value)}
                  className="mt-2 min-h-11 w-full rounded-xl border border-border/70 bg-background px-3 font-heading text-lg font-bold text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
                <label htmlFor="f-wt" className="block text-xs font-bold text-foreground">
                  Final Exam Weight (%)
                </label>
                <input
                  id="f-wt"
                  type="number"
                  min={1}
                  max={99}
                  value={finalWeight}
                  onChange={(e) => setFinalWeight(e.target.value)}
                  className="mt-2 min-h-11 w-full rounded-xl border border-border/70 bg-background px-3 font-heading text-lg font-bold text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-heading text-sm font-bold text-foreground">
                Quick Grade Targets ({100 - finalStats.wt}% coursework / {finalStats.wt}% final)
              </h3>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {finalStats.quickTargets.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-foreground/[0.04] p-3 text-xs dark:bg-foreground/[0.06]"
                  >
                    <p className="font-bold text-foreground">{item.label}</p>
                    <p
                      className={cn(
                        "mt-1 font-heading text-base font-extrabold",
                        item.needed > 100
                          ? "text-destructive"
                          : item.needed <= 0
                            ? "text-emerald-600"
                            : "text-primary",
                      )}
                    >
                      {item.needed <= 0
                        ? "0% (Locked in!)"
                        : `${item.needed.toFixed(1)}%${item.needed > 100 ? " (Extra credit needed)" : ""}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-5">
            <Badge className="bg-primary/15 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Required Final Score</span>
            </Badge>

            <div className="rounded-2xl bg-foreground/[0.04] p-6 text-center dark:bg-foreground/[0.06]">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Minimum Score Needed on Final
              </p>
              <p className="mt-2 font-heading text-5xl font-extrabold text-primary">
                {finalStats.needed.toFixed(2)}%
              </p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {finalStats.needed <= 0 ? (
                  <strong className="text-emerald-600">
                    Your coursework alone already secures {finalStats.tgt}%!
                  </strong>
                ) : finalStats.needed > 100 ? (
                  <strong className="text-destructive">
                    Above 100% — you will need extra credit or a curve to reach {finalStats.tgt}%.
                  </strong>
                ) : finalStats.needed >= 90 ? (
                  <span>Challenging target — focus on high-yield practice exams.</span>
                ) : (
                  <span>Very achievable with consistent active recall review.</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
