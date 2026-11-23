"use client";

import { useState, useId, useMemo, type FormEvent, type KeyboardEvent } from "react";
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
import { buildConversionUrl, trackConversionClick } from "@/lib/conversion";

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

  // Quick topic input for Post-Quiz AI Conversion Card
  const defaultQuizPrompt = `Đề thi thử ${subjectName} ${gradeName} chuẩn 3 phần`;
  const [quizPrompt, setQuizPrompt] = useState<string>(defaultQuizPrompt);

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
    const part1Max = part1Questions.length * 0.25;
    let part1CorrectCount = 0;

    for (const q of part1Questions) {
      const userChoice = part1Answers[q.id];
      if (userChoice !== undefined && userChoice === q.answer) {
        part1Score += 0.25;
        part1CorrectCount += 1;
      }
    }

    let part2Score = 0;
    const part2Max = part2Questions.length * 1.0;
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
    const part3Max = part3Questions.length * 0.5;
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
    setQuizPrompt(defaultQuizPrompt);
    const element = document.getElementById(resultCardId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card/85 p-8 text-center text-muted-foreground shadow-none backdrop-blur-none">
        Chưa có câu hỏi luyện thi cho môn học này.
      </div>
    );
  }

  return (
    <div className="relative space-y-6" id={resultCardId}>
      {/* Quiz Header & Stats */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none backdrop-blur-none sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Format Mới THPT 2026
              </Badge>
              <Badge>{questions.length} câu hỏi</Badge>
            </div>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Luyện Thi Trực Tuyến: {subjectName} {gradeName}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Thực hành cấu trúc 3 phần mới nhất: Trắc nghiệm 4 lựa chọn, Đúng/Sai lũy tiến, và Trả lời ngắn.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] px-4 py-2.5 text-right">
              <div className="text-xs font-medium text-muted-foreground">Tiến độ bài làm</div>
              <div className="font-heading text-lg font-bold text-foreground">
                <span className="text-primary">{answeredCount}</span> / {questions.length} câu
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-1.5 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-xl border-0 shadow-none px-3.5 text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
              activeTab === "all"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
            )}
          >
            <ListFilter className="h-4 w-4" />
            Tất cả câu hỏi
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[11px] font-bold",
                activeTab === "all"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-foreground/[0.06] text-muted-foreground"
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
                "inline-flex h-9 items-center gap-2 rounded-xl border-0 shadow-none px-3.5 text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
                activeTab === "part1"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
              )}
            >
              Phần I: 4 Lựa chọn
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[11px] font-bold",
                  activeTab === "part1"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-foreground/[0.06] text-muted-foreground"
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
                "inline-flex h-9 items-center gap-2 rounded-xl border-0 shadow-none px-3.5 text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
                activeTab === "part2"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
              )}
            >
              Phần II: Đúng / Sai
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[11px] font-bold",
                  activeTab === "part2"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-foreground/[0.06] text-muted-foreground"
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
                "inline-flex h-9 items-center gap-2 rounded-xl border-0 shadow-none px-3.5 text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
                activeTab === "part3"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
              )}
            >
              Phần III: Trả lời ngắn
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[11px] font-bold",
                  activeTab === "part3"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-foreground/[0.06] text-muted-foreground"
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
        <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none backdrop-blur-none sm:p-7">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border-0 shadow-none bg-primary text-primary-foreground">
                  <Award className="h-4 w-4" />
                </span>
                <span className="font-heading font-semibold text-primary">
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
                      ? "bg-primary/15 text-primary"
                      : scoreReport.percentage >= 50
                      ? "bg-foreground/[0.06] text-foreground"
                      : "bg-destructive/15 text-destructive"
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
              <div className="rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-3 text-center sm:p-4">
                <div className="text-xs text-muted-foreground">Phần I (4 Lựa chọn)</div>
                <div className="mt-1 font-heading font-bold text-foreground sm:text-lg">
                  {scoreReport.part1.score.toFixed(2)}đ
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {scoreReport.part1.correctCount}/{scoreReport.part1.totalCount} câu đúng
                </div>
              </div>

              <div className="rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-3 text-center sm:p-4">
                <div className="text-xs text-muted-foreground">Phần II (Đúng/Sai)</div>
                <div className="mt-1 font-heading font-bold text-foreground sm:text-lg">
                  {scoreReport.part2.score.toFixed(2)}đ
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {scoreReport.part2.fullyCorrectCount}/{scoreReport.part2.totalCount} câu tối đa
                </div>
              </div>

              <div className="rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-3 text-center sm:p-4">
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
          <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, scoreReport.percentage))}%` }}
            />
          </div>

          {/* Action buttons inside result card */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Làm lại bài thi
            </Button>
          </div>

          {/* Post-Quiz AI Conversion Card */}
          {(() => {
            const hasMissedQuestions =
              Math.round(scoreReport.totalEarned * 100) <
              Math.round(scoreReport.totalMax * 100);
            const activePrompt = quizPrompt.trim() || defaultQuizPrompt;
            const conversionUrl = buildConversionUrl({
              path: "/quiz/create",
              placement: "pseo_quiz_result",
              campaign: subjectName,
              prompt: activePrompt,
            });
            const ctaLabel = hasMissedQuestions
              ? "Luyện Lại 10 Câu Tương Tự"
              : "Thi Thử Full 50 Câu Ngay";

            const handleConversionTrack = () => {
              trackConversionClick({
                placement: "pseo_quiz_result",
                campaign: subjectName,
                targetUrl: conversionUrl,
                label: ctaLabel,
              });
            };

            const handleConversionFormSubmit = (
              event: FormEvent<HTMLFormElement>,
            ) => {
              event.preventDefault();
              handleConversionTrack();
              window.open(conversionUrl, "_blank", "noopener,noreferrer");
            };

            return (
              <div className="no-print mt-6 rounded-2xl border border-primary/30 bg-primary/[0.06] p-5 sm:p-6">
                <div className="flex flex-col gap-4">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Gia sư AI QuizKen • Chẩn đoán sau bài làm</span>
                    </div>
                    <p className="font-heading text-base font-bold leading-snug text-foreground sm:text-lg">
                      {hasMissedQuestions
                        ? "Bạn còn mất điểm ở đề mẫu này! Mở QuizKen App để Gia sư AI giải thích chi tiết từng ý Đúng/Sai và sinh 10 câu tương tự để luyện lại."
                        : "Xuất sắc đạt điểm tuyệt đối! Thử sức ngay với Đề Thi Thử Full 50 câu có đồng hồ đếm ngược & bảng xếp hạng trên QuizKen App."}
                    </p>
                  </div>

                  <form
                    onSubmit={handleConversionFormSubmit}
                    className="flex flex-col gap-3 sm:flex-row sm:items-center"
                  >
                    <label className="flex-1">
                      <span className="sr-only">Chủ đề tạo đề AI trên QuizKen</span>
                      <input
                        type="text"
                        value={quizPrompt}
                        onChange={(event) => setQuizPrompt(event.target.value)}
                        placeholder={defaultQuizPrompt}
                        className="h-11 w-full rounded-xl border border-border bg-background/95 px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </label>
                    <Button
                      href={conversionUrl}
                      variant="primary"
                      size="lg"
                      onClick={handleConversionTrack}
                      className="h-11 shrink-0 gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>{ctaLabel}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            );
          })()}
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
      <div className="sticky bottom-4 z-20 rounded-2xl border border-border/70 bg-card/95 p-4 shadow-none backdrop-blur-none sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-0 shadow-none bg-foreground/[0.06] text-primary">
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
                variant="secondary"
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
                className="gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
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

  return (
    <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none backdrop-blur-none sm:p-7">
      {/* Question Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-heading text-lg font-bold text-foreground">
            Câu {index}
          </span>
          <Badge className="text-xs">
            Phần I: 0.25đ / câu - Trắc nghiệm 4 lựa chọn
          </Badge>
        </div>

        {isSubmitted && (
          <div>
            {isCorrect ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary">
                <Check className="h-3.5 w-3.5" /> +0.25đ (Chính xác)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-destructive/15 px-2.5 py-1 text-xs font-bold text-destructive">
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

          let optionStyle =
            "bg-foreground/[0.04] dark:bg-foreground/[0.06] hover:bg-foreground/[0.08] text-foreground";

          if (isSubmitted) {
            if (isThisOptionCorrect) {
              optionStyle =
                "bg-primary/15 ring-2 ring-primary/50 text-foreground font-semibold";
            } else if (isSelected && !isThisOptionCorrect) {
              optionStyle =
                "bg-destructive/15 ring-2 ring-destructive/40 text-destructive";
            } else {
              optionStyle =
                "bg-foreground/[0.03] dark:bg-foreground/[0.04] opacity-60 text-muted-foreground";
            }
          } else if (isSelected) {
            optionStyle =
              "bg-primary/15 ring-2 ring-primary/50 text-foreground font-semibold";
          }

          return (
            <button
              key={oIdx}
              type="button"
              disabled={isSubmitted}
              onClick={() => onSelect(oIdx)}
              className={cn(
                "group relative flex min-h-[48px] items-center gap-3.5 rounded-xl border-0 shadow-none p-4 text-left text-sm transition-colors sm:text-base",
                optionStyle,
                isSubmitted ? "cursor-default" : "cursor-pointer"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                  isSubmitted
                    ? isThisOptionCorrect
                      ? "bg-primary text-primary-foreground"
                      : isSelected
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-foreground/[0.06] text-muted-foreground"
                    : isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/[0.06] text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                )}
              >
                {String.fromCharCode(65 + oIdx)}
              </span>
              <span className="flex-1 leading-snug">{opt}</span>
              {isSubmitted && isThisOptionCorrect && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
              )}
              {isSubmitted && isSelected && !isThisOptionCorrect && (
                <XCircle className="h-5 w-5 shrink-0 text-destructive" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Accordion */}
      {(isSubmitted || isExplanationExpanded) && (
        <div className="mt-5 pt-2">
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
            <div className="mt-3 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-4 text-sm leading-relaxed text-muted-foreground">
              <p className="mb-1.5 flex items-center gap-1.5 font-bold text-primary">
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
    <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none backdrop-blur-none sm:p-7">
      {/* Question Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-heading text-lg font-bold text-foreground">
            Câu {index}
          </span>
          <Badge className="text-xs">
            Phần II: Tối đa 1.0đ - Đúng / Sai 4 ý
          </Badge>
        </div>

        {isSubmitted && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold",
              earnedScore === 1.0
                ? "bg-primary/15 text-primary"
                : earnedScore > 0
                ? "bg-foreground/[0.06] text-foreground"
                : "bg-destructive/15 text-destructive"
            )}
          >
            +{earnedScore.toFixed(2)}đ ({correctCount}/4 ý đúng)
          </span>
        )}
      </div>

      {/* Context Callout */}
      <div className="mt-4 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-4 text-sm font-medium leading-relaxed text-foreground sm:text-base">
        {question.context}
      </div>

      {/* Subquestions Table / Rows */}
      <div className="mt-5 space-y-3">
        {question.subQuestions.map((sub, sIdx) => {
          const userVal = userAnswers[sub.id];
          const letter = String.fromCharCode(97 + sIdx); // a, b, c, d

          return (
            <div
              key={sub.id}
              className="flex flex-col gap-3 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Statement text */}
              <div className="flex-1 pr-2">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.06] text-xs font-bold text-foreground">
                    {letter})
                  </span>
                  <div className="text-sm font-normal leading-relaxed text-foreground sm:text-base">
                    {sub.text}
                  </div>
                </div>

                {/* Subquestion explanation post-submit */}
                {isSubmitted && (
                  <div className="mt-2 pl-8 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Đáp án: {sub.isCorrect ? "Đúng" : "Sai"}.{" "}
                    </span>
                    <span>{sub.explanation}</span>
                  </div>
                )}
              </div>

              {/* Toggle Buttons: Đúng / Sai */}
              <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => onToggle(sub.id, true)}
                  className={cn(
                    "inline-flex h-9 min-w-[76px] items-center justify-center gap-1.5 rounded-xl border-0 shadow-none px-3.5 text-sm font-semibold transition-colors",
                    userVal === true
                      ? isSubmitted
                        ? sub.isCorrect
                          ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
                          : "bg-destructive/15 text-destructive ring-2 ring-destructive/40"
                        : "bg-primary text-primary-foreground"
                      : isSubmitted && sub.isCorrect
                      ? "bg-primary/15 text-primary ring-2 ring-primary/50"
                      : "bg-foreground/[0.06] text-muted-foreground hover:bg-foreground/[0.10] hover:text-foreground",
                    isSubmitted ? "cursor-default" : "cursor-pointer"
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
                    "inline-flex h-9 min-w-[76px] items-center justify-center gap-1.5 rounded-xl border-0 shadow-none px-3.5 text-sm font-semibold transition-colors",
                    userVal === false
                      ? isSubmitted
                        ? !sub.isCorrect
                          ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
                          : "bg-destructive/15 text-destructive ring-2 ring-destructive/40"
                        : "bg-primary text-primary-foreground"
                      : isSubmitted && !sub.isCorrect
                      ? "bg-primary/15 text-primary ring-2 ring-primary/50"
                      : "bg-foreground/[0.06] text-muted-foreground hover:bg-foreground/[0.10] hover:text-foreground",
                    isSubmitted ? "cursor-default" : "cursor-pointer"
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
        <div className="mt-5 pt-2">
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
            <div className="mt-3 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-4 text-sm leading-relaxed text-muted-foreground">
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
    <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none backdrop-blur-none sm:p-7">
      {/* Question Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-heading text-lg font-bold text-foreground">
            Câu {index}
          </span>
          <Badge className="text-xs">
            Phần III: 0.5đ / câu - Trả lời ngắn
          </Badge>
        </div>

        {isSubmitted && (
          <div>
            {isCorrect ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary">
                <Check className="h-3.5 w-3.5" /> +0.5đ (Chính xác)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-destructive/15 px-2.5 py-1 text-xs font-bold text-destructive">
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
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                "h-10 w-full rounded-xl border-0 shadow-none px-4 text-base font-medium outline-none transition-colors placeholder:text-muted-foreground/60",
                isSubmitted
                  ? isCorrect
                    ? "bg-primary/15 pr-10 text-foreground ring-2 ring-primary/50"
                    : "bg-destructive/15 pr-10 text-destructive ring-2 ring-destructive/40"
                  : "bg-foreground/[0.04] dark:bg-foreground/[0.06] text-foreground focus:ring-2 focus:ring-primary/50",
                isSubmitted && "cursor-default"
              )}
            />
            {isSubmitted && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
            )}
          </div>

          {question.unit && (
            <span className="flex h-10 items-center rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] px-4 text-sm font-semibold text-muted-foreground">
              {question.unit}
            </span>
          )}
        </div>
      </div>

      {/* Post-submission Result Callout */}
      {isSubmitted && (
        <div
          className={cn(
            "mt-4 rounded-xl border-0 shadow-none p-4 text-sm",
            isCorrect
              ? "bg-primary/15 text-foreground"
              : "bg-destructive/15 text-foreground"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2 font-bold",
              isCorrect ? "text-primary" : "text-destructive"
            )}
          >
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
          <div className="mt-1 text-xs text-foreground/80 sm:text-sm">
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
        <div className="mt-5 pt-2">
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
            <div className="mt-3 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-4 text-sm leading-relaxed text-muted-foreground">
              <p>{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default InteractiveQuizWidget;

