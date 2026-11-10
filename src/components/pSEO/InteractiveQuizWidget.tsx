"use client";

import { useState, useId, useMemo, type KeyboardEvent } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  HelpCircle,
  Award,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  ArrowRight,
  Calculator,
  ListFilter,
  Flame,
  AlertCircle,
} from "lucide-react";
import {
  type PseoQuestion,
  type MultipleChoiceQuestion,
  type TrueFalseQuestion,
  type ShortAnswerQuestion,
  isMultipleChoice,
  isTrueFalse,
  isShortAnswer,
} from "@/lib/pSEO";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { appLink } from "@/lib/site";

export interface InteractiveQuizWidgetProps {
  questions: PseoQuestion[];
  subjectName: string;
  gradeName: string;
}

type TabKey = "all" | "part1" | "part2" | "part3";

// Ministry of Education 2026 True/False progressive scoring scale
export function calculatePart2Score(correctSubCount: number): number {
  switch (correctSubCount) {
    case 4:
      return 1.0;
    case 3:
      return 0.5;
    case 2:
      return 0.25;
    case 1:
      return 0.1;
    default:
      return 0.0;
  }
}

// Normalizer for short answer matching
function normalizeShortAnswer(val: string): string {
  return val.trim().toLowerCase().replace(/\s+/g, "");
}

function checkShortAnswerMatch(userInput: string, question: ShortAnswerQuestion): boolean {
  if (!userInput || userInput.trim().length === 0) return false;
  const cleanInput = normalizeShortAnswer(userInput);
  // Support both comma and dot for decimal numbers (e.g. 3,5 vs 3.5)
  const variants = [
    cleanInput,
    cleanInput.replace(",", "."),
    cleanInput.replace(".", ","),
  ];
  const accepted = [
    question.answer,
    ...(question.acceptedAnswers || []),
  ].map(normalizeShortAnswer);

  return accepted.some((ans) => variants.includes(ans));
}

export function InteractiveQuizWidget({
  questions,
  subjectName,
  gradeName,
}: InteractiveQuizWidgetProps) {
  const resultCardId = useId();

  // Active filter tab
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  // User responses
  // Part 1: questionId -> selectedOption (0, 1, 2, 3)
  const [part1Answers, setPart1Answers] = useState<Record<string, number>>({});

  // Part 2: questionId -> subQuestionId -> boolean (true = Đúng, false = Sai)
  const [part2Answers, setPart2Answers] = useState<Record<string, Record<string, boolean>>>({});

  // Part 3: questionId -> string
  const [part3Answers, setPart3Answers] = useState<Record<string, string>>({});

  // Submission state
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Manual explanation toggles: questionId -> boolean
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});

  // Categorize questions by part
  const part1Questions = useMemo(
    () => questions.filter(isMultipleChoice),
    [questions]
  );
  const part2Questions = useMemo(
    () => questions.filter(isTrueFalse),
    [questions]
  );
  const part3Questions = useMemo(
    () => questions.filter(isShortAnswer),
    [questions]
  );

  // Filtered list based on active tab
  const displayedQuestions = useMemo(() => {
    switch (activeTab) {
      case "part1":
        return part1Questions;
      case "part2":
        return part2Questions;
      case "part3":
        return part3Questions;
      case "all":
      default:
        return questions;
    }
  }, [activeTab, questions, part1Questions, part2Questions, part3Questions]);

  // Scoring results
  const scoreReport = useMemo(() => {
    let part1Score = 0;
    let part1Max = part1Questions.length * 0.25;
    let part1CorrectCount = 0;

    for (const q of part1Questions) {
      const userChoice = part1Answers[q.id];
      if (userChoice !== undefined && userChoice === q.answer) {
        part1Score += 0.25;
        part1CorrectCount += 1;
      }
    }

    let part2Score = 0;
    let part2Max = part2Questions.length * 1.0;
    let part2FullyCorrectCount = 0;

    for (const q of part2Questions) {
      const userSubs = part2Answers[q.id] || {};
      let correctSubs = 0;
      for (const sub of q.subQuestions) {
        if (userSubs[sub.id] !== undefined && userSubs[sub.id] === sub.isCorrect) {
          correctSubs += 1;
        }
      }
      const qScore = calculatePart2Score(correctSubs);
      part2Score += qScore;
      if (correctSubs === 4) {
        part2FullyCorrectCount += 1;
      }
    }

    let part3Score = 0;
    let part3Max = part3Questions.length * 0.5;
    let part3CorrectCount = 0;

    for (const q of part3Questions) {
      const userText = part3Answers[q.id] || "";
      if (checkShortAnswerMatch(userText, q)) {
        part3Score += 0.5;
        part3CorrectCount += 1;
      }
    }

    const totalEarned = part1Score + part2Score + part3Score;
    const totalMax = part1Max + part2Max + part3Max;
    const percentage = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;

    return {
      part1: {
        score: part1Score,
        max: part1Max,
        correctCount: part1CorrectCount,
        totalCount: part1Questions.length,
      },
      part2: {
        score: part2Score,
        max: part2Max,
        fullyCorrectCount: part2FullyCorrectCount,
        totalCount: part2Questions.length,
      },
      part3: {
        score: part3Score,
        max: part3Max,
        correctCount: part3CorrectCount,
        totalCount: part3Questions.length,
      },
      totalEarned,
      totalMax,
      percentage,
    };
  }, [
    part1Questions,
    part2Questions,
    part3Questions,
    part1Answers,
    part2Answers,
    part3Answers,
  ]);

  // Answered counter
  const answeredCount = useMemo(() => {
    let count = 0;
    for (const q of part1Questions) {
      if (part1Answers[q.id] !== undefined) count += 1;
    }
    for (const q of part2Questions) {
      const userSubs = part2Answers[q.id];
      // Mark as answered if user answered at least one subquestion
      if (userSubs && Object.keys(userSubs).length > 0) count += 1;
    }
    for (const q of part3Questions) {
      if (part3Answers[q.id]?.trim()) count += 1;
    }
    return count;
  }, [part1Questions, part2Questions, part3Questions, part1Answers, part2Answers, part3Answers]);

  // Handlers
  const handleSelectPart1 = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setPart1Answers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleTogglePart2 = (
    questionId: string,
    subQuestionId: string,
    value: boolean
  ) => {
    if (isSubmitted) return;
    setPart2Answers((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        [subQuestionId]: value,
      },
    }));
  };

  const handleChangePart3 = (questionId: string, value: string) => {
    if (isSubmitted) return;
    setPart3Answers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleToggleExplanation = (questionId: string) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Smooth scroll to top of quiz / result card
    const element = document.getElementById(resultCardId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleReset = () => {
    setPart1Answers({});
    setPart2Answers({});
    setPart3Answers({});
    setIsSubmitted(false);
    setExpandedExplanations({});
    const element = document.getElementById(resultCardId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
        Chưa có câu hỏi luyện thi cho môn học này.
      </div>
    );
  }

  return (
    <div className="relative space-y-8" id={resultCardId}>
      {/* Quiz Header & Stats */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <Sparkles className="h-3.5 w-3.5" />
                Format Mới THPT 2026
              </Badge>
              <Badge className="bg-secondary text-secondary-foreground">
                {questions.length} câu hỏi
              </Badge>
            </div>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Luyện Thi Trực Tuyến: {subjectName} {gradeName}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Thực hành cấu trúc 3 phần mới nhất: Trắc nghiệm 4 lựa chọn, Đúng/Sai lũy tiến, và Trả lời ngắn.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="rounded-2xl border border-border/60 bg-muted/40 px-4 py-2.5 text-right">
              <div className="text-xs font-medium text-muted-foreground">Tiến độ bài làm</div>
              <div className="font-heading text-lg font-bold text-foreground">
                <span className="text-primary">{answeredCount}</span> / {questions.length} câu
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-border/60 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all min-h-[40px]",
              activeTab === "all"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <ListFilter className="h-4 w-4" />
            Tất cả câu hỏi
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-bold",
                activeTab === "all"
                  ? "bg-white/20 text-white"
                  : "bg-muted-foreground/10 text-muted-foreground"
              )}
            >
              {questions.length}
            </span>
          </button>

          {part1Questions.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("part1")}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all min-h-[40px]",
                activeTab === "part1"
                  ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              Phần I: 4 Lựa chọn
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-bold",
                  activeTab === "part1"
                    ? "bg-white/20 text-white"
                    : "bg-muted-foreground/10 text-muted-foreground"
                )}
              >
                {part1Questions.length}
              </span>
            </button>
          )}

          {part2Questions.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("part2")}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all min-h-[40px]",
                activeTab === "part2"
                  ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              Phần II: Đúng / Sai
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-bold",
                  activeTab === "part2"
                    ? "bg-white/20 text-white"
                    : "bg-muted-foreground/10 text-muted-foreground"
                )}
              >
                {part2Questions.length}
              </span>
            </button>
          )}

          {part3Questions.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("part3")}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all min-h-[40px]",
                activeTab === "part3"
                  ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              Phần III: Trả lời ngắn
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-bold",
                  activeTab === "part3"
                    ? "bg-white/20 text-white"
                    : "bg-muted-foreground/10 text-muted-foreground"
                )}
              >
                {part3Questions.length}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Submission Score Result Banner */}
      {isSubmitted && (
        <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-card to-card p-6 shadow-xl sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                  <Award className="h-4 w-4" />
                </span>
                <span className="font-heading font-semibold text-emerald-700 dark:text-emerald-400">
                  Kết Quả Chấm Điểm Chuẩn BGD 2026
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                  {scoreReport.totalEarned.toFixed(2)}
                </span>
                <span className="text-xl font-medium text-muted-foreground">
                  / {scoreReport.totalMax.toFixed(2)} điểm
                </span>
                <Badge
                  className={cn(
                    "ml-2 text-sm font-bold",
                    scoreReport.percentage >= 80
                      ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                      : scoreReport.percentage >= 50
                      ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30"
                      : "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30"
                  )}
                >
                  {scoreReport.percentage}%
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground sm:text-base">
                {scoreReport.percentage >= 90
                  ? "🎉 Xuất sắc! Bạn nắm rất vững kiến thức và làm chủ định dạng đề thi mới."
                  : scoreReport.percentage >= 70
                  ? "👏 Rất tốt! Bạn giải quyết tốt hầu hết các dạng bài. Hãy xem kỹ lời giải các câu sai để tối ưu điểm số."
                  : scoreReport.percentage >= 50
                  ? "💪 Khá tốt! Cần chú ý cẩn thận hơn ở phần Đúng/Sai và Trả lời ngắn để tránh mất điểm đáng tiếc."
                  : "📚 Hãy rèn luyện thêm! Đề thi 2026 đòi hỏi tư duy phân tích sâu. Đọc kỹ lời giải chi tiết bên dưới nhé!"}
              </p>
            </div>

            {/* Score Breakdown Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border/80 bg-card p-3 text-center sm:p-4">
                <div className="text-xs text-muted-foreground">Phần I (4 Lựa chọn)</div>
                <div className="mt-1 font-heading font-bold text-foreground sm:text-lg">
                  {scoreReport.part1.score.toFixed(2)}đ
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {scoreReport.part1.correctCount}/{scoreReport.part1.totalCount} câu đúng
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-3 text-center sm:p-4">
                <div className="text-xs text-muted-foreground">Phần II (Đúng/Sai)</div>
                <div className="mt-1 font-heading font-bold text-foreground sm:text-lg">
                  {scoreReport.part2.score.toFixed(2)}đ
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {scoreReport.part2.fullyCorrectCount}/{scoreReport.part2.totalCount} câu tối đa
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-3 text-center sm:p-4">
                <div className="text-xs text-muted-foreground">Phần III (Trả lời ngắn)</div>
                <div className="mt-1 font-heading font-bold text-foreground sm:text-lg">
                  {scoreReport.part3.score.toFixed(2)}đ
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {scoreReport.part3.correctCount}/{scoreReport.part3.totalCount} câu đúng
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, scoreReport.percentage))}%` }}
            />
          </div>

          {/* Action buttons inside result card */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Làm lại bài thi
            </Button>

            <Button
              href={appLink(`/?subject=${subjectName}&grade=${gradeName}`)}
              variant="primary"
              size="sm"
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Tạo thêm đề mới bằng AI trên App
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Question List */}
      <div className="space-y-6">
        {displayedQuestions.map((q, displayIndex) => {
          // Calculate global index within original questions array
          const originalIndex = questions.findIndex((item) => item.id === q.id);
          const questionNumber = originalIndex !== -1 ? originalIndex + 1 : displayIndex + 1;

          if (isMultipleChoice(q)) {
            return (
              <MultipleChoiceCard
                key={q.id}
                question={q}
                index={questionNumber}
                userAnswer={part1Answers[q.id]}
                isSubmitted={isSubmitted}
                onSelect={(optIdx) => handleSelectPart1(q.id, optIdx)}
                isExplanationExpanded={expandedExplanations[q.id] || isSubmitted}
                onToggleExplanation={() => handleToggleExplanation(q.id)}
              />
            );
          }

          if (isTrueFalse(q)) {
            return (
              <TrueFalseCard
                key={q.id}
                question={q}
                index={questionNumber}
                userAnswers={part2Answers[q.id] || {}}
                isSubmitted={isSubmitted}
                onToggle={(subId, val) => handleTogglePart2(q.id, subId, val)}
                isExplanationExpanded={expandedExplanations[q.id] || isSubmitted}
                onToggleExplanation={() => handleToggleExplanation(q.id)}
              />
            );
          }

          if (isShortAnswer(q)) {
            return (
              <ShortAnswerCard
                key={q.id}
                question={q}
                index={questionNumber}
                userAnswer={part3Answers[q.id] || ""}
                isSubmitted={isSubmitted}
                onChange={(val) => handleChangePart3(q.id, val)}
                onSubmitEnter={handleSubmit}
                isExplanationExpanded={expandedExplanations[q.id] || isSubmitted}
                onToggleExplanation={() => handleToggleExplanation(q.id)}
              />
            );
          }

          return null;
        })}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-4 z-20 rounded-2xl border border-border/80 bg-card/95 p-4 shadow-lg backdrop-blur-md sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                Đã hoàn thành {answeredCount} / {questions.length} câu hỏi
              </div>
              <div className="text-xs text-muted-foreground">
                {isSubmitted
                  ? "Bài thi đã được chấm điểm. Bạn có thể làm lại hoặc xem giải thích chi tiết."
                  : answeredCount === questions.length
                  ? "Bạn đã trả lời đầy đủ tất cả câu hỏi! Sẵn sàng nộp bài."
                  : "Hãy hoàn thành các câu hỏi để đạt điểm số tối đa."}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            {isSubmitted ? (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Làm lại từ đầu
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleSubmit}
                className="gap-2 min-h-[44px] px-6 text-base font-semibold shadow-md"
              >
                <CheckCircle2 className="h-5 w-5" />
                Nộp bài & Chấm điểm
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Sub-component: Phần I - Trắc nghiệm 4 lựa chọn
// ==========================================
interface MultipleChoiceCardProps {
  question: MultipleChoiceQuestion;
  index: number;
  userAnswer?: number;
  isSubmitted: boolean;
  onSelect: (optionIndex: number) => void;
  isExplanationExpanded: boolean;
  onToggleExplanation: () => void;
}

function MultipleChoiceCard({
  question,
  index,
  userAnswer,
  isSubmitted,
  onSelect,
  isExplanationExpanded,
  onToggleExplanation,
}: MultipleChoiceCardProps) {
  const isCorrect = isSubmitted && userAnswer === question.answer;
  const isAnswered = userAnswer !== undefined;

  return (
    <div
      className={cn(
        "rounded-3xl border bg-card p-6 shadow-sm transition-all sm:p-7",
        isSubmitted
          ? isCorrect
            ? "border-emerald-500/40 bg-emerald-500/[0.02]"
            : "border-rose-500/30 bg-rose-500/[0.01]"
          : "border-border/80 hover:border-border"
      )}
    >
      {/* Question Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-heading font-bold text-foreground text-lg">
            Câu {index}
          </span>
          <Badge className="bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20 text-xs">
            Phần I: 0.25đ / câu - Trắc nghiệm 4 lựa chọn
          </Badge>
        </div>

        {isSubmitted && (
          <div>
            {isCorrect ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <Check className="h-3.5 w-3.5" /> +0.25đ (Chính xác)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 px-3 py-1 text-xs font-bold text-rose-700 dark:text-rose-300">
                <X className="h-3.5 w-3.5" /> +0.0đ (Chưa chính xác)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Question Body */}
      <p className="mt-4 text-base font-medium leading-relaxed text-foreground sm:text-lg">
        {question.question}
      </p>

      {/* Options Grid */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {question.options.map((opt, oIdx) => {
          const isSelected = userAnswer === oIdx;
          const isThisOptionCorrect = question.answer === oIdx;

          let optionStyle = "border-border/70 bg-card hover:border-primary/50 hover:bg-muted/30 text-foreground";

          if (isSubmitted) {
            if (isThisOptionCorrect) {
              optionStyle =
                "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold ring-2 ring-emerald-500/30";
            } else if (isSelected && !isThisOptionCorrect) {
              optionStyle =
                "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/30";
            } else {
              optionStyle = "border-border/40 bg-muted/20 opacity-60 text-muted-foreground";
            }
          } else if (isSelected) {
            optionStyle =
              "border-primary bg-primary/10 text-primary font-semibold ring-2 ring-primary/30 shadow-sm";
          }

          return (
            <button
              key={oIdx}
              type="button"
              disabled={isSubmitted}
              onClick={() => onSelect(oIdx)}
              className={cn(
                "group relative flex min-h-[48px] items-center gap-3.5 rounded-2xl border p-4 text-left text-sm transition-all sm:text-base",
                optionStyle,
                isSubmitted ? "cursor-default" : "cursor-pointer active:scale-[0.99]"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors",
                  isSubmitted
                    ? isThisOptionCorrect
                      ? "bg-emerald-500 text-white"
                      : isSelected
                      ? "bg-rose-500 text-white"
                      : "bg-muted text-muted-foreground"
                    : isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/70 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                )}
              >
                {String.fromCharCode(65 + oIdx)}
              </span>
              <span className="flex-1 leading-snug">{opt}</span>
              {isSubmitted && isThisOptionCorrect && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              )}
              {isSubmitted && isSelected && !isThisOptionCorrect && (
                <XCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Accordion */}
      {(isSubmitted || isExplanationExpanded) && (
        <div className="mt-5 border-t border-border/60 pt-4">
          <button
            type="button"
            onClick={onToggleExplanation}
            className="flex w-full cursor-pointer items-center justify-between text-sm font-semibold text-primary hover:underline"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" />
              Lời giải chi tiết
            </span>
            {isExplanationExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {isExplanationExpanded && (
            <div className="mt-3 rounded-2xl border border-dashed border-border/80 bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
              <p className="mb-1.5 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Đáp án chính xác: {String.fromCharCode(65 + question.answer)}
              </p>
              <p>{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// Sub-component: Phần II - Đúng / Sai 4 ý
// ==========================================
interface TrueFalseCardProps {
  question: TrueFalseQuestion;
  index: number;
  userAnswers: Record<string, boolean>;
  isSubmitted: boolean;
  onToggle: (subId: string, val: boolean) => void;
  isExplanationExpanded: boolean;
  onToggleExplanation: () => void;
}

function TrueFalseCard({
  question,
  index,
  userAnswers,
  isSubmitted,
  onToggle,
  isExplanationExpanded,
  onToggleExplanation,
}: TrueFalseCardProps) {
  // Count how many subquestions were correctly answered
  let correctCount = 0;
  for (const sub of question.subQuestions) {
    if (userAnswers[sub.id] !== undefined && userAnswers[sub.id] === sub.isCorrect) {
      correctCount += 1;
    }
  }
  const earnedScore = calculatePart2Score(correctCount);

  return (
    <div
      className={cn(
        "rounded-3xl border bg-card p-6 shadow-sm transition-all sm:p-7",
        isSubmitted
          ? earnedScore === 1.0
            ? "border-emerald-500/40 bg-emerald-500/[0.02]"
            : earnedScore > 0
            ? "border-amber-500/30 bg-amber-500/[0.01]"
            : "border-rose-500/30 bg-rose-500/[0.01]"
          : "border-border/80 hover:border-border"
      )}
    >
      {/* Question Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-heading font-bold text-foreground text-lg">
            Câu {index}
          </span>
          <Badge className="bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20 text-xs">
            Phần II: Tối đa 1.0đ - Đúng / Sai 4 ý
          </Badge>
        </div>

        {isSubmitted && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
              earnedScore === 1.0
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : earnedScore > 0
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                : "bg-rose-500/15 text-rose-700 dark:text-rose-300"
            )}
          >
            +{earnedScore.toFixed(2)}đ ({correctCount}/4 ý đúng)
          </span>
        )}
      </div>

      {/* Context Callout */}
      <div className="mt-4 rounded-2xl border border-border/80 bg-muted/40 p-4 text-sm font-medium leading-relaxed text-foreground sm:text-base">
        {question.context}
      </div>

      {/* Subquestions Table / Rows */}
      <div className="mt-5 space-y-4">
        {question.subQuestions.map((sub, sIdx) => {
          const userVal = userAnswers[sub.id];
          const isAnswered = userVal !== undefined;
          const isSubCorrect = isSubmitted && isAnswered && userVal === sub.isCorrect;

          const letter = String.fromCharCode(97 + sIdx); // a, b, c, d

          return (
            <div
              key={sub.id}
              className={cn(
                "flex flex-col gap-3 rounded-2xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between",
                isSubmitted
                  ? isSubCorrect
                    ? "border-emerald-500/30 bg-emerald-500/[0.04]"
                    : "border-rose-500/30 bg-rose-500/[0.03]"
                  : "border-border/70 bg-card hover:border-border"
              )}
            >
              {/* Statement text */}
              <div className="flex-1 pr-2">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-foreground">
                    {letter})
                  </span>
                  <div className="text-sm sm:text-base leading-relaxed text-foreground font-normal">
                    {sub.text}
                  </div>
                </div>

                {/* Subquestion explanation post-submit */}
                {isSubmitted && (
                  <div className="mt-2 pl-8.5 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Đáp án: {sub.isCorrect ? "Đúng" : "Sai"}.{" "}
                    </span>
                    <span>{sub.explanation}</span>
                  </div>
                )}
              </div>

              {/* Toggle Buttons: Đúng / Sai */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => onToggle(sub.id, true)}
                  className={cn(
                    "flex min-h-[44px] min-w-[76px] items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition-all",
                    userVal === true
                      ? isSubmitted
                        ? sub.isCorrect
                          ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/40"
                          : "bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/40"
                        : "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30"
                      : isSubmitted && sub.isCorrect
                      ? "border border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold"
                      : "border border-border/70 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
                    isSubmitted ? "cursor-default" : "cursor-pointer active:scale-95"
                  )}
                >
                  <Check className="h-4 w-4" />
                  Đúng
                </button>

                <button
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => onToggle(sub.id, false)}
                  className={cn(
                    "flex min-h-[44px] min-w-[76px] items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition-all",
                    userVal === false
                      ? isSubmitted
                        ? !sub.isCorrect
                          ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/40"
                          : "bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/40"
                        : "bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/30"
                      : isSubmitted && !sub.isCorrect
                      ? "border border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold"
                      : "border border-border/70 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
                    isSubmitted ? "cursor-default" : "cursor-pointer active:scale-95"
                  )}
                >
                  <X className="h-4 w-4" />
                  Sai
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation Banner */}
      {(isSubmitted || isExplanationExpanded) && question.explanation && (
        <div className="mt-5 border-t border-border/60 pt-4">
          <button
            type="button"
            onClick={onToggleExplanation}
            className="flex w-full cursor-pointer items-center justify-between text-sm font-semibold text-primary hover:underline"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" />
              Tổng kết kiến thức chuyên đề
            </span>
            {isExplanationExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {isExplanationExpanded && (
            <div className="mt-3 rounded-2xl border border-dashed border-border/80 bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
              <p>{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// Sub-component: Phần III - Trả lời ngắn
// ==========================================
interface ShortAnswerCardProps {
  question: ShortAnswerQuestion;
  index: number;
  userAnswer: string;
  isSubmitted: boolean;
  onChange: (value: string) => void;
  onSubmitEnter: () => void;
  isExplanationExpanded: boolean;
  onToggleExplanation: () => void;
}

function ShortAnswerCard({
  question,
  index,
  userAnswer,
  isSubmitted,
  onChange,
  onSubmitEnter,
  isExplanationExpanded,
  onToggleExplanation,
}: ShortAnswerCardProps) {
  const isCorrect = isSubmitted && checkShortAnswerMatch(userAnswer, question);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSubmitted) {
      e.preventDefault();
      onSubmitEnter();
    }
  };

  return (
    <div
      className={cn(
        "rounded-3xl border bg-card p-6 shadow-sm transition-all sm:p-7",
        isSubmitted
          ? isCorrect
            ? "border-emerald-500/40 bg-emerald-500/[0.02]"
            : "border-rose-500/30 bg-rose-500/[0.01]"
          : "border-border/80 hover:border-border"
      )}
    >
      {/* Question Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-heading font-bold text-foreground text-lg">
            Câu {index}
          </span>
          <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 text-xs">
            Phần III: 0.5đ / câu - Trả lời ngắn
          </Badge>
        </div>

        {isSubmitted && (
          <div>
            {isCorrect ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <Check className="h-3.5 w-3.5" /> +0.5đ (Chính xác)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 px-3 py-1 text-xs font-bold text-rose-700 dark:text-rose-300">
                <X className="h-3.5 w-3.5" /> +0.0đ (Chưa chính xác)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Question Body */}
      <p className="mt-4 text-base font-medium leading-relaxed text-foreground sm:text-lg">
        {question.question}
      </p>

      {/* Input Field */}
      <div className="mt-5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Nhập kết quả tính toán hoặc đáp số ngắn gọn:
        </label>
        <div className="flex max-w-md items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={userAnswer}
              disabled={isSubmitted}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ví dụ: 12 hoặc 3.5..."
              className={cn(
                "h-12 w-full min-h-[44px] rounded-2xl border px-4 text-base font-medium outline-none transition-all placeholder:text-muted-foreground/60",
                isSubmitted
                  ? isCorrect
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/30"
                    : "border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-200 ring-2 ring-rose-500/30"
                  : "border-border/80 bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20",
                isSubmitted && "cursor-default"
              )}
            />
            {isSubmitted && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                )}
              </div>
            )}
          </div>

          {question.unit && (
            <span className="flex h-12 min-h-[44px] items-center rounded-2xl border border-border/80 bg-muted/50 px-4 text-sm font-semibold text-muted-foreground">
              {question.unit}
            </span>
          )}
        </div>
      </div>

      {/* Post-submission Result Callout */}
      {isSubmitted && (
        <div
          className={cn(
            "mt-4 rounded-2xl border p-4 text-sm",
            isCorrect
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
              : "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-200"
          )}
        >
          <div className="flex items-center gap-2 font-bold">
            {isCorrect ? (
              <>
                <Check className="h-4 w-4" />
                Kết quả chính xác!
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                Đáp số của bạn chưa đúng.
              </>
            )}
          </div>
          <div className="mt-1 text-xs sm:text-sm text-foreground/80">
            Đáp án chuẩn đề thi:{" "}
            <span className="font-extrabold text-foreground">
              {question.answer} {question.unit || ""}
            </span>
            {question.acceptedAnswers && question.acceptedAnswers.length > 1 && (
              <span className="text-muted-foreground">
                {" "}
                (chấp nhận các định dạng: {question.acceptedAnswers.join(", ")})
              </span>
            )}
          </div>
        </div>
      )}

      {/* Explanation Banner */}
      {(isSubmitted || isExplanationExpanded) && (
        <div className="mt-5 border-t border-border/60 pt-4">
          <button
            type="button"
            onClick={onToggleExplanation}
            className="flex w-full cursor-pointer items-center justify-between text-sm font-semibold text-primary hover:underline"
          >
            <span className="flex items-center gap-1.5">
              <Calculator className="h-4 w-4" />
              Phương pháp giải chi tiết từng bước
            </span>
            {isExplanationExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {isExplanationExpanded && (
            <div className="mt-3 rounded-2xl border border-dashed border-border/80 bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
              <p>{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default InteractiveQuizWidget;

