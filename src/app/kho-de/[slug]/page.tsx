import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Sparkles,
  ArrowRight,
  Timer,
  FileText,
  CheckCircle2,
  BookOpen,
  Users,
  Layers,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { appLink, buildAbsoluteUrl } from "@/lib/site";
import { fetchPublicQuizBySlug } from "@/lib/publicQuizzes";
import { PublicQuizPreview } from "@/components/kho-de/PublicQuizPreview";

export const revalidate = 3600;
export const dynamicParams = true;

type RouteParams = {
  slug: string;
};

export async function generateMetadata(props: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const quiz = await fetchPublicQuizBySlug(slug);

  if (!quiz) {
    return buildMetadata({
      title: "Không tìm thấy đề thi",
      path: `/kho-de/${slug}`,
      noIndex: true,
    });
  }

  const title = `${quiz.title} — Đề Trắc Nghiệm Online Có Đáp Án`;
  const description = `${quiz.description} Bộ gồm ${quiz.questionCount} câu hỏi kèm đáp án, làm thử trực tiếp và thi thử đếm ngược trên QuizKen.`;

  return buildMetadata({
    title,
    description,
    path: `/kho-de/${quiz.slug}`,
    keywords: [
      quiz.title,
      `đề thi ${quiz.title}`,
      `trắc nghiệm ${quiz.category}`,
      "làm bài trắc nghiệm online",
      "quizken kho đề",
      ...quiz.tags.slice(0, 5),
    ],
  });
}

export default async function PublicQuizDetailPage(props: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await props.params;
  const quiz = await fetchPublicQuizBySlug(slug);

  if (!quiz) {
    notFound();
  }

  const previewQuestions = quiz.questions.slice(0, Math.min(quiz.questions.length, 8));
  const playUrl = appLink(`/quiz/play/${quiz.id}`);
  const examUrl = appLink(`/quiz/exam/${quiz.id}`);
  const canonicalUrl = buildAbsoluteUrl(`/kho-de/${quiz.slug}`);

  const quizSchemaQuestions = previewQuestions.map((q, idx) => {
    if (q.questionType === "true_false_group" && q.subItems?.length) {
      return {
        "@type": "Question",
        name: `Câu ${idx + 1}: ${q.question}`,
        eduQuestionType: "Multiple choice",
        learningResourceType: "Practice problem",
        acceptedAnswer: {
          "@type": "Answer",
          text: q.subItems
            .map(
              (s, sIdx) =>
                `${s.label || String.fromCharCode(97 + sIdx)}) ${
                  s.isCorrect ? "Đúng" : "Sai"
                }`
            )
            .join("; "),
        },
      };
    }

    if (q.questionType === "short_answer") {
      return {
        "@type": "Question",
        name: `Câu ${idx + 1}: ${q.question}`,
        eduQuestionType: "Short answer",
        learningResourceType: "Practice problem",
        acceptedAnswer: {
          "@type": "Answer",
          text: (q.acceptedAnswers && q.acceptedAnswers[0]) || "Xem trên QuizKen",
        },
      };
    }

    return {
      "@type": "Question",
      name: `Câu ${idx + 1}: ${q.question}`,
      eduQuestionType: "Multiple choice",
      learningResourceType: "Practice problem",
      suggestedAnswer: q.options.map((opt, oIdx) => ({
        "@type": "Answer",
        position: oIdx + 1,
        text: opt,
      })),
      acceptedAnswer: {
        "@type": "Answer",
        position: q.correctAnswer + 1,
        text: q.options[q.correctAnswer] || q.options[0] || "",
      },
      ...(q.explanation
        ? {
            comment: {
              "@type": "Comment",
              text: q.explanation,
            },
          }
        : {}),
    };
  });

  const jsonLdData = [
    breadcrumbSchema([
      { name: "Trang chủ", path: "/" },
      { name: "Kho đề cộng đồng", path: "/kho-de" },
      { name: quiz.title, path: `/kho-de/${quiz.slug}` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Quiz",
      name: quiz.title,
      description: quiz.description,
      url: canonicalUrl,
      inLanguage: "vi-VN",
      numberOfQuestions: quiz.questionCount,
      hasPart: quizSchemaQuestions,
    },
    {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      name: quiz.title,
      description: quiz.description,
      url: canonicalUrl,
      inLanguage: "vi-VN",
      learningResourceType: "Quiz",
      isAccessibleForFree: true,
      dateModified: quiz.updatedAt,
      provider: {
        "@type": "Organization",
        name: "QuizKen",
        url: buildAbsoluteUrl("/"),
      },
    },
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />

      <section className="bg-background pt-10 pb-16 sm:pt-16 sm:pb-24">
        <Container>
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-primary">
              Trang chủ
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link href="/kho-de" className="transition-colors hover:text-primary">
              Kho đề cộng đồng
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="line-clamp-1 font-medium text-foreground">
              {quiz.title}
            </span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
            {/* Main Column */}
            <div className="space-y-10">
              <header className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                    {quiz.category}
                  </Badge>
                  <Badge>{quiz.questionCount} câu hỏi</Badge>
                  <Badge>Độ khó: {quiz.difficulty}</Badge>
                </div>

                <h1 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
                  {quiz.title}
                </h1>

                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {quiz.description}
                </p>

                {quiz.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {quiz.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-foreground/[0.05] px-2.5 py-1 text-xs font-medium text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button href={playUrl} size="lg" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Làm full đề + giải thích AI
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    href={examUrl}
                    variant="secondary"
                    size="lg"
                    className="gap-2"
                  >
                    <Timer className="h-4 w-4" />
                    Vào phòng thi thử đếm ngược
                  </Button>
                </div>
              </header>

              {/* Interactive Preview */}
              <section aria-label="Làm thử đề thi trực tuyến">
                <PublicQuizPreview
                  quizId={quiz.id}
                  quizTitle={quiz.title}
                  questions={previewQuestions}
                  totalQuestionCount={quiz.questionCount}
                />
              </section>

              {/* Crawlable SSR HTML Preview of Questions */}
              <section
                aria-label="Nội dung câu hỏi và đáp án xem trước"
                className="space-y-5"
              >
                <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.06] text-primary">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div>
                      <h2 className="font-heading text-xl font-bold text-foreground">
                        Xem Trước Nội Dung &amp; Đáp Án ({previewQuestions.length}{" "}
                        Câu Đầu)
                      </h2>
                      <p className="text-xs text-muted-foreground sm:text-sm">
                        Bản xem trước đầy đủ hỗ trợ tra cứu nhanh. Tổng số câu
                        trong bộ đề gốc: {quiz.questionCount} câu.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {previewQuestions.map((q, idx) => (
                    <article
                      key={q.id}
                      className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-none sm:p-6"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-heading text-base font-bold text-foreground">
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

                      {q.questionType === "mcq" && q.options.length > 0 && (
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className="flex items-start gap-2 rounded-xl bg-foreground/[0.04] p-3 text-sm dark:bg-foreground/[0.06]"
                            >
                              <span className="font-bold text-muted-foreground">
                                {String.fromCharCode(65 + oIdx)}.
                              </span>
                              <span className="text-foreground">{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {q.questionType === "true_false_group" &&
                        q.subItems &&
                        q.subItems.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {q.subItems.map((sub, sIdx) => (
                              <div
                                key={sub.id || sIdx}
                                className="flex items-start gap-2 rounded-xl bg-foreground/[0.04] p-3 text-sm dark:bg-foreground/[0.06]"
                              >
                                <span className="font-bold text-primary">
                                  {sub.label || String.fromCharCode(97 + sIdx)})
                                </span>
                                <span className="text-foreground">
                                  {sub.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                      <details className="group mt-4">
                        <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-primary select-none hover:underline">
                          <span>Xem đáp án &amp; lời giải</span>
                          <span className="transition-transform group-open:rotate-180">
                            ▼
                          </span>
                        </summary>
                        <div className="mt-3 rounded-xl bg-foreground/[0.04] p-4 text-sm text-muted-foreground dark:bg-foreground/[0.06]">
                          {q.questionType === "mcq" && (
                            <p className="mb-1 flex items-center gap-1.5 font-bold text-primary">
                              <CheckCircle2 className="h-4 w-4 shrink-0" />
                              Đáp án:{" "}
                              {String.fromCharCode(65 + q.correctAnswer)}.{" "}
                              {q.options[q.correctAnswer]}
                            </p>
                          )}
                          {q.questionType === "short_answer" &&
                            q.acceptedAnswers?.length && (
                              <p className="mb-1 font-bold text-primary">
                                Đáp án: {q.acceptedAnswers[0]}
                                {q.answerUnit ? ` ${q.answerUnit}` : ""}
                              </p>
                            )}
                          {q.questionType === "true_false_group" &&
                            q.subItems && (
                              <ul className="mb-2 space-y-1">
                                {q.subItems.map((sub, sIdx) => (
                                  <li key={sIdx}>
                                    <strong>
                                      Ý{" "}
                                      {sub.label ||
                                        String.fromCharCode(97 + sIdx)}
                                      :
                                    </strong>{" "}
                                    {sub.isCorrect ? "Đúng" : "Sai"}
                                    {sub.explanation
                                      ? ` — ${sub.explanation}`
                                      : ""}
                                  </li>
                                ))}
                              </ul>
                            )}
                          {q.explanation && (
                            <p className="leading-relaxed">{q.explanation}</p>
                          )}
                        </div>
                      </details>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            {/* Sticky Sidebar */}
            <aside className="h-fit space-y-6 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none">
                <Badge>
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  QuizKen Full Mode
                </Badge>
                <h2 className="mt-3 font-heading text-xl font-bold text-foreground">
                  Làm Trọn Bộ {quiz.questionCount} Câu Hỏi
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Chuyển sang ứng dụng QuizKen để làm full đề không giới hạn,
                  lưu lịch sử điểm số, đảo câu hỏi và nhận phân tích AI từng câu.
                </p>

                <div className="mt-4 space-y-2 rounded-xl bg-foreground/[0.04] p-4 text-xs text-muted-foreground dark:bg-foreground/[0.06]">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-primary" />
                      Số câu hỏi
                    </span>
                    <strong className="text-foreground">
                      {quiz.questionCount} câu
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      Lượt tham gia
                    </span>
                    <strong className="text-foreground">
                      {Math.max(quiz.attempts, quiz.usageCount, 1)} lượt
                    </strong>
                  </div>
                </div>

                <div className="mt-5 space-y-2.5">
                  <Button
                    href={playUrl}
                    className="w-full justify-center gap-2"
                    size="md"
                  >
                    <Sparkles className="h-4 w-4" />
                    Làm full đề + giải thích AI
                  </Button>
                  <Button
                    href={examUrl}
                    variant="secondary"
                    className="w-full justify-center gap-2"
                    size="md"
                  >
                    <Timer className="h-4 w-4" />
                    Vào phòng thi thử đếm ngược
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none">
                <h3 className="font-heading text-base font-bold text-foreground">
                  Khám phá thêm
                </h3>
                <div className="mt-3 flex flex-col gap-2 text-sm">
                  <Link
                    href="/kho-de"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    ← Quay lại Kho đề cộng đồng
                  </Link>
                  <Link
                    href="/de-thi"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    Đề thi THPT Quốc gia 9 môn →
                  </Link>
                  <Link
                    href="/de-thi/dgnl"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    Đề thi Đánh giá năng lực 2027 →
                  </Link>
                  <Link
                    href="/de-thi/dai-hoc"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    Môn Đại cương Đại học →
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
