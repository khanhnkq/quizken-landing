"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Timer,
  HelpCircle,
  Award,
} from "lucide-react";
import type { PublicQuizQuestion } from "@/lib/publicQuizzes";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { appLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export interface PublicQuizPreviewProps {
  quizId: string;
  quizTitle: string;
  questions: PublicQuizQuestion[];
  totalQuestionCount: number;
}

export function PublicQuizPreview({
  quizId,
  quizTitle,
  questions,
  totalQuestionCount,
}: PublicQuizPreviewProps) {
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [tfAnswers, setTfAnswers] = useState<
    Record<string, Record<number, boolean>>
  >({});
  const [shortAnswers, setShortAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = useMemo(() => {
    let count = 0;
    for (const q of questions) {
      if (q.questionType === "mcq" && mcqAnswers[q.id] !== undefined) {
        count += 1;
      } else if (
        q.questionType === "true_false_group" &&
        tfAnswers[q.id] &&
        Object.keys(tfAnswers[q.id]).length > 0
      ) {
        count += 1;
      } else if (
        q.questionType === "short_answer" &&
        shortAnswers[q.id]?.trim()
      ) {
        count += 1;
      }
    }
    return count;
  }, [questions, mcqAnswers, tfAnswers, shortAnswers]);

  const correctCount = useMemo(() => {
    if (!submitted) return 0;
    let correct = 0;
    for (const q of questions) {
      if (q.questionType === "mcq") {
        if (mcqAnswers[q.id] === q.correctAnswer) correct += 1;
      } else if (q.questionType === "true_false_group" && q.subItems?.length) {
        const userMap = tfAnswers[q.id] || {};
        const allRight = q.subItems.every(
          (sub, idx) => userMap[idx] === sub.isCorrect
        );
        if (allRight) correct += 1;
      } else if (q.questionType === "short_answer") {
        const val = (shortAnswers[q.id] || "").trim().toLowerCase();
        const accepted = (q.acceptedAnswers || []).map((a) =>
          a.trim().toLowerCase()
        );
        if (val && accepted.includes(val)) correct += 1;
      }
    }
    return correct;
  }, [submitted, questions, mcqAnswers, tfAnswers, shortAnswers]);

  const handleReset = () => {
    setMcqAnswers({});
    setTfAnswers({});
    setShortAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Làm thử nhanh ({questions.length}/{totalQuestionCount} câu)
              </Badge>
            </div>
            <h2 className="mt-2 font-heading text-xl font-bold text-foreground sm:text-2xl">
              Trải Nghiệm Nhanh: {quizTitle}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Chọn đáp án và chấm điểm ngay bên dưới, hoặc mở toàn bộ{" "}
              {totalQuestionCount} câu trong phòng thi QuizKen App.
            </p>
          </div>
          <div className="rounded-xl bg-foreground/[0.04] px-4 py-2.5 text-right dark:bg-foreground/[0.06]">
            <div className="text-xs text-muted-foreground">Đã trả lời</div>
            <div className="font-heading text-lg font-bold text-foreground">
              <span className="text-primary">{answeredCount}</span> /{" "}
              {questions.length}
            </div>
          </div>
        </div>

        {submitted && (
          <div className="mt-5 flex flex-col gap-4 rounded-xl bg-primary/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Award className="h-5 w-5" />
              </span>
              <div>
                <div className="font-heading text-lg font-bold text-foreground">
                  Kết quả làm thử: {correctCount}/{questions.length} câu đúng
                </div>
                <p className="text-xs text-muted-foreground">
                  Mở phiên bản đầy đủ trên QuizKen App để làm trọn bộ{" "}
                  {totalQuestionCount} câu và nhận giải thích AI chuyên sâu.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleReset}
                className="gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Làm lại
              </Button>
              <Button
                href={appLink(`/quiz/play/${quizId}`)}
                size="sm"
                className="gap-1.5"
              >
                Làm full {totalQuestionCount} câu
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Preview Questions */}
      <div className="space-y-5">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-none sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-heading text-base font-bold text-foreground sm:text-lg">
                Câu {idx + 1}
              </span>
              <Badge className="text-[11px]">
                {q.questionType === "true_false_group"
                  ? "Đúng / Sai"
                  : q.questionType === "short_answer"
                  ? "Trả lời ngắn"
                  : "Trắc nghiệm"}
              </Badge>
            </div>

            <p className="mt-3 whitespace-pre-line text-sm font-medium leading-relaxed text-foreground sm:text-base">
              {q.question}
            </p>

            {q.questionType === "mcq" && (
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {q.options.map((opt, oIdx) => {
                  const selected = mcqAnswers[q.id] === oIdx;
                  const isCorrectOpt = q.correctAnswer === oIdx;

                  let style =
                    "bg-foreground/[0.04] dark:bg-foreground/[0.06] hover:bg-foreground/[0.08] text-foreground";
                  if (submitted) {
                    if (isCorrectOpt) {
                      style =
                        "bg-primary/15 ring-2 ring-primary/50 text-foreground font-semibold";
                    } else if (selected && !isCorrectOpt) {
                      style =
                        "bg-destructive/15 ring-2 ring-destructive/40 text-destructive";
                    } else {
                      style =
                        "bg-foreground/[0.03] opacity-60 text-muted-foreground";
                    }
                  } else if (selected) {
                    style =
                      "bg-primary/15 ring-2 ring-primary/50 text-foreground font-semibold";
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() =>
                        setMcqAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                      }
                      className={cn(
                        "flex min-h-[44px] items-center gap-3 rounded-xl p-3.5 text-left text-sm transition-colors",
                        style,
                        submitted ? "cursor-default" : "cursor-pointer"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                          submitted && isCorrectOpt
                            ? "bg-primary text-primary-foreground"
                            : submitted && selected && !isCorrectOpt
                            ? "bg-destructive text-destructive-foreground"
                            : selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-foreground/[0.07] text-muted-foreground"
                        )}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {submitted && isCorrectOpt && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      )}
                      {submitted && selected && !isCorrectOpt && (
                        <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {q.questionType === "true_false_group" && q.subItems && (
              <div className="mt-4 space-y-2.5">
                {q.subItems.map((sub, sIdx) => {
                  const chosen = tfAnswers[q.id]?.[sIdx];
                  return (
                    <div
                      key={sub.id || sIdx}
                      className="flex flex-col justify-between gap-3 rounded-xl bg-foreground/[0.04] p-3.5 text-sm sm:flex-row sm:items-center dark:bg-foreground/[0.06]"
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-primary">
                          {sub.label || String.fromCharCode(97 + sIdx)})
                        </span>
                        <span className="text-foreground">{sub.text}</span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {[true, false].map((val) => {
                          const active = chosen === val;
                          const isRight = submitted && val === sub.isCorrect;
                          const isWrongChoice =
                            submitted && active && val !== sub.isCorrect;
                          return (
                            <button
                              key={String(val)}
                              type="button"
                              disabled={submitted}
                              onClick={() =>
                                setTfAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: {
                                    ...(prev[q.id] || {}),
                                    [sIdx]: val,
                                  },
                                }))
                              }
                              className={cn(
                                "rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
                                isRight
                                  ? "bg-primary text-primary-foreground"
                                  : isWrongChoice
                                  ? "bg-destructive text-destructive-foreground"
                                  : active
                                  ? "bg-primary/20 text-primary ring-1 ring-primary"
                                  : "bg-foreground/[0.06] text-muted-foreground hover:text-foreground",
                                submitted ? "cursor-default" : "cursor-pointer"
                              )}
                            >
                              {val ? "Đúng" : "Sai"}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {q.questionType === "short_answer" && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={shortAnswers[q.id] || ""}
                  onChange={(e) =>
                    setShortAnswers((prev) => ({
                      ...prev,
                      [q.id]: e.target.value,
                    }))
                  }
                  placeholder="Nhập câu trả lời ngắn của bạn..."
                  className="h-10 min-w-[220px] flex-1 rounded-xl border border-border/70 bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
                {q.answerUnit && (
                  <span className="text-xs font-semibold text-muted-foreground">
                    Đơn vị: {q.answerUnit}
                  </span>
                )}
              </div>
            )}

            {submitted && q.explanation && (
              <div className="mt-4 rounded-xl bg-foreground/[0.04] p-4 text-xs leading-relaxed text-muted-foreground sm:text-sm dark:bg-foreground/[0.06]">
                <div className="mb-1 flex items-center gap-1.5 font-semibold text-primary">
                  <HelpCircle className="h-4 w-4" />
                  Giải thích chi tiết
                </div>
                {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/85 p-5 shadow-none sm:flex-row sm:items-center sm:justify-between">
        <div>
          {!submitted ? (
            <Button
              type="button"
              onClick={() => setSubmitted(true)}
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Kiểm tra đáp án ({answeredCount}/{questions.length})
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Làm lại phần xem trước
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button
            href={appLink(`/quiz/play/${quizId}`)}
            variant="primary"
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Làm full đề + giải thích AI
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            href={appLink(`/quiz/exam/${quizId}`)}
            variant="secondary"
            className="gap-2"
          >
            <Timer className="h-4 w-4" />
            Vào phòng thi thử đếm ngược
          </Button>
        </div>
      </div>
    </div>
  );
}
