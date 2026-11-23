import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  BookOpen,
  FileText,
  Layers,
  Clock,
  Award,
  Users,
  Wrench,
  Printer,
  Download,
  Building2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/JsonLd";
import { InteractiveQuizWidget } from "@/components/pSEO/InteractiveQuizWidget";
import { isMultipleChoice, isTrueFalse, isShortAnswer } from "@/lib/pSEO";
import {
  EXTENDED_HUBS,
  getExamsByHub,
  type ExtendedExamEntry,
} from "@/lib/pseoExtended";
import { appLink, buildAbsoluteUrl } from "@/lib/site";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";

export function ExtendedExamDetailView({
  entry,
}: {
  entry: ExtendedExamEntry;
}) {
  const hubMeta = EXTENDED_HUBS[entry.hub];
  const path = `/de-thi/${entry.hub}/${entry.slug}`;
  const ctaUrl = appLink(`/?topic=${encodeURIComponent(entry.name)}`);

  const siblingExams = getExamsByHub(entry.hub).filter(
    (item) => item.slug !== entry.slug
  );
  const otherHubs = Object.values(EXTENDED_HUBS).filter(
    (h) => h.key !== entry.hub
  );

  const quizQuestionsSchema = entry.questions.flatMap((q, idx) => {
    if (isMultipleChoice(q)) {
      return [
        {
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
            position: q.answer + 1,
            text: q.options[q.answer],
          },
          comment: {
            "@type": "Comment",
            text: q.explanation,
          },
        },
      ];
    }

    if (isTrueFalse(q)) {
      return q.subQuestions.map((sub, sIdx) => ({
        "@type": "Question",
        name: `Câu ${idx + 1} (${q.context}) - Ý ${String.fromCharCode(
          97 + sIdx
        )}: ${sub.text}`,
        eduQuestionType: "Multiple choice",
        learningResourceType: "Practice problem",
        suggestedAnswer: [
          { "@type": "Answer", text: "Đúng" },
          { "@type": "Answer", text: "Sai" },
        ],
        acceptedAnswer: {
          "@type": "Answer",
          text: sub.isCorrect ? "Đúng" : "Sai",
        },
        comment: {
          "@type": "Comment",
          text: sub.explanation,
        },
      }));
    }

    if (isShortAnswer(q)) {
      return [
        {
          "@type": "Question",
          name: `Câu ${idx + 1}: ${q.question}`,
          eduQuestionType: "Short answer",
          learningResourceType: "Practice problem",
          acceptedAnswer: {
            "@type": "Answer",
            text: `${q.answer}${q.unit ? ` ${q.unit}` : ""}`,
          },
          comment: {
            "@type": "Comment",
            text: q.explanation,
          },
        },
      ];
    }

    return [];
  });

  const jsonLdData = [
    breadcrumbSchema([
      { name: "Trang chủ", path: "/" },
      { name: "Đề thi", path: "/de-thi" },
      { name: hubMeta.shortTitle, path: hubMeta.path },
      { name: entry.shortName, path },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Quiz",
      name: entry.seoTitle,
      description: entry.seoDescription,
      url: buildAbsoluteUrl(path),
      educationalLevel: entry.targetAudience,
      inLanguage: "vi-VN",
      about: {
        "@type": "Thing",
        name: entry.name,
      },
      hasPart: quizQuestionsSchema,
    },
    faqSchema(entry.faqs.map((f) => ({ question: f.q, answer: f.a }))),
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
            <Link
              href="/de-thi"
              className="transition-colors hover:text-primary"
            >
              Đề thi
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link
              href={hubMeta.path}
              className="transition-colors hover:text-primary"
            >
              {hubMeta.shortTitle}
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="font-medium text-foreground">
              {entry.shortName}
            </span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
            {/* Left Main Column */}
            <div className="space-y-10">
              {/* Hero */}
              <header className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    {entry.badge}
                  </Badge>
                  <Badge>{hubMeta.shortTitle}</Badge>
                </div>

                <h1 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  {entry.name}{" "}
                  <span className="text-primary">Có Đáp Án Chi Tiết</span>
                </h1>

                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {entry.description}
                </p>

                {/* Quick Meta Grid */}
                <div className="grid gap-3 pt-2 sm:grid-cols-3">
                  <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      Thời gian làm bài
                    </div>
                    <div className="mt-1 font-heading text-sm font-bold text-foreground">
                      {entry.duration}
                    </div>
                  </div>
                  <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Award className="h-3.5 w-3.5 text-primary" />
                      Thang điểm
                    </div>
                    <div className="mt-1 font-heading text-sm font-bold text-foreground">
                      {entry.maxScore}
                    </div>
                  </div>
                  <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      Số lượng câu
                    </div>
                    <div className="mt-1 font-heading text-sm font-bold text-foreground">
                      {entry.totalQuestionsLabel}
                    </div>
                  </div>
                </div>

                {/* University tags if available */}
                {entry.universities && entry.universities.length > 0 && (
                  <div className="pt-1">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5 text-primary" />
                      Phổ biến tại các trường đại học:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {entry.universities.map((uni) => (
                        <Badge key={uni} className="text-[11px]">
                          {uni}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Topics / Chapters */}
                {entry.topics.length > 0 && (
                  <div className="pt-1">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Nội dung &amp; Chuyên đề trọng tâm:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {entry.topics.map((topic, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-foreground/[0.04] px-2.5 py-1 text-xs font-medium text-foreground dark:bg-foreground/[0.06]"
                        >
                          <BookOpen className="h-3 w-3 text-primary" />
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </header>

              {/* Structure & Matrix Table */}
              <section aria-labelledby="structure-heading">
                <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.06] text-primary">
                      <Layers className="h-4 w-4" />
                    </span>
                    <div>
                      <h2
                        id="structure-heading"
                        className="font-heading text-xl font-bold text-foreground sm:text-2xl"
                      >
                        Cấu Trúc &amp; Ma Trận Đề Thi {entry.shortName}
                      </h2>
                      <p className="text-xs text-muted-foreground sm:text-sm">
                        Hình thức: {entry.formatLabel} • Đối tượng:{" "}
                        {entry.targetAudience}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-border/70 text-xs uppercase text-muted-foreground">
                          <th className="py-2.5 pr-4 font-semibold">Phần thi</th>
                          <th className="py-2.5 pr-4 font-semibold">
                            Nội dung trọng tâm
                          </th>
                          <th className="py-2.5 pr-4 font-semibold">Số câu</th>
                          <th className="py-2.5 font-semibold">Điểm / Thời gian</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {entry.structure.map((row, rIdx) => (
                          <tr key={rIdx}>
                            <td className="py-3 pr-4 font-semibold text-foreground">
                              {row.part}
                            </td>
                            <td className="py-3 pr-4 text-muted-foreground">
                              {row.content}
                            </td>
                            <td className="py-3 pr-4 whitespace-nowrap text-foreground">
                              {row.questionCount}
                            </td>
                            <td className="py-3 whitespace-nowrap font-medium text-primary">
                              {row.scoreWeight}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Interactive Quiz Practice Widget */}
              <section aria-label="Làm bài luyện tập trực tuyến">
                <InteractiveQuizWidget
                  questions={entry.questions}
                  subjectName={entry.shortName}
                  gradeName={entry.badge}
                />
              </section>

              {/* Crawlable SSR Fallback Question Bank */}
              <section
                aria-label="Ngân hàng câu hỏi mẫu và lời giải chi tiết"
                className="space-y-5"
              >
                <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.06] text-primary">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div>
                      <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                        Câu Hỏi Mẫu &amp; Đáp Án Chi Tiết {entry.shortName}
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                        Bản văn bản đầy đủ phục vụ ôn tập nhanh và tra cứu lời
                        giải từng bước.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {entry.questions.map((q, idx) => {
                    const num = idx + 1;
                    if (isMultipleChoice(q)) {
                      return (
                        <article
                          key={q.id}
                          className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-none sm:p-6"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-heading text-base font-bold text-foreground">
                              Câu {num}
                            </span>
                            <Badge className="text-[11px]">Trắc nghiệm</Badge>
                          </div>
                          <p className="mt-3 whitespace-pre-line text-base font-medium leading-relaxed text-foreground">
                            {q.question}
                          </p>
                          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                            {q.options.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className="flex items-start gap-2.5 rounded-xl bg-foreground/[0.04] p-3 text-sm dark:bg-foreground/[0.06]"
                              >
                                <span className="font-bold text-muted-foreground">
                                  {String.fromCharCode(65 + oIdx)}.
                                </span>
                                <span className="text-foreground">{opt}</span>
                              </div>
                            ))}
                          </div>
                          <details className="group mt-4 pt-1">
                            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-primary select-none hover:underline">
                              <span>Xem đáp án &amp; giải thích chi tiết</span>
                              <span className="transition-transform group-open:rotate-180">
                                ▼
                              </span>
                            </summary>
                            <div className="mt-3 rounded-xl bg-foreground/[0.04] p-4 text-sm text-muted-foreground dark:bg-foreground/[0.06]">
                              <p className="mb-1 flex items-center gap-1.5 font-bold text-primary">
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                                Đáp án:{" "}
                                {String.fromCharCode(65 + q.answer)}.{" "}
                                {q.options[q.answer]}
                              </p>
                              <p className="leading-relaxed">{q.explanation}</p>
                            </div>
                          </details>
                        </article>
                      );
                    }

                    if (isTrueFalse(q)) {
                      return (
                        <article
                          key={q.id}
                          className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-none sm:p-6"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-heading text-base font-bold text-foreground">
                              Câu {num}
                            </span>
                            <Badge className="text-[11px]">
                              Đúng / Sai lũy tiến
                            </Badge>
                          </div>
                          <p className="mt-3 whitespace-pre-line text-base font-medium leading-relaxed text-foreground">
                            {q.context}
                          </p>
                          <div className="mt-4 space-y-2">
                            {q.subQuestions.map((sub, sIdx) => (
                              <div
                                key={sub.id}
                                className="flex items-start gap-2.5 rounded-xl bg-foreground/[0.04] p-3 text-sm dark:bg-foreground/[0.06]"
                              >
                                <span className="font-bold text-primary">
                                  {String.fromCharCode(97 + sIdx)})
                                </span>
                                <span className="text-foreground">
                                  {sub.text}
                                </span>
                              </div>
                            ))}
                          </div>
                          <details className="group mt-4 pt-1">
                            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-primary select-none hover:underline">
                              <span>Xem đáp án Đúng/Sai &amp; phân tích</span>
                              <span className="transition-transform group-open:rotate-180">
                                ▼
                              </span>
                            </summary>
                            <div className="mt-3 space-y-2.5 rounded-xl bg-foreground/[0.04] p-4 text-sm text-muted-foreground dark:bg-foreground/[0.06]">
                              {q.subQuestions.map((sub, sIdx) => (
                                <div key={sub.id}>
                                  <span className="font-bold text-foreground">
                                    Ý {String.fromCharCode(97 + sIdx)}:{" "}
                                    {sub.isCorrect ? "Đúng" : "Sai"}
                                  </span>{" "}
                                  — {sub.explanation}
                                </div>
                              ))}
                            </div>
                          </details>
                        </article>
                      );
                    }

                    if (isShortAnswer(q)) {
                      return (
                        <article
                          key={q.id}
                          className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-none sm:p-6"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-heading text-base font-bold text-foreground">
                              Câu {num}
                            </span>
                            <Badge className="text-[11px]">Trả lời ngắn</Badge>
                          </div>
                          <p className="mt-3 whitespace-pre-line text-base font-medium leading-relaxed text-foreground">
                            {q.question}
                          </p>
                          <details className="group mt-4 pt-1">
                            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-primary select-none hover:underline">
                              <span>Xem đáp án &amp; hướng dẫn giải</span>
                              <span className="transition-transform group-open:rotate-180">
                                ▼
                              </span>
                            </summary>
                            <div className="mt-3 rounded-xl bg-foreground/[0.04] p-4 text-sm text-muted-foreground dark:bg-foreground/[0.06]">
                              <p className="mb-1 font-bold text-primary">
                                Đáp án: {q.answer}
                                {q.unit ? ` ${q.unit}` : ""}
                              </p>
                              <p className="leading-relaxed">{q.explanation}</p>
                            </div>
                          </details>
                        </article>
                      );
                    }

                    return null;
                  })}
                </div>
              </section>

              {/* Internal Links: Related Exams & Tools */}
              <section className="space-y-6">
                {siblingExams.length > 0 && (
                  <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none">
                    <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                      Các Đề Thi Khác Trong Nhóm {hubMeta.shortTitle}
                    </h2>
                    <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {siblingExams.map((item) => (
                        <Link
                          key={item.slug}
                          href={`/de-thi/${item.hub}/${item.slug}`}
                          className="group flex items-center justify-between gap-2 rounded-xl bg-foreground/[0.04] px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/[0.08] dark:bg-foreground/[0.06]"
                        >
                          <span className="truncate group-hover:text-primary">
                            {item.shortName}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                      Công Cụ Hỗ Trợ &amp; Hệ Thống Đề Thi Khác
                    </h2>
                    <Link
                      href="/cong-cu"
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Xem tất cả công cụ →
                    </Link>
                  </div>
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {entry.relatedTools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className="group flex items-center justify-between gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-primary/15"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <Wrench className="h-4 w-4 shrink-0 text-primary" />
                          <span className="truncate">{tool.label}</span>
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary" />
                      </Link>
                    ))}
                    <Link
                      href="/kho-de"
                      className="group flex items-center justify-between gap-2 rounded-xl bg-foreground/[0.04] px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/[0.08] dark:bg-foreground/[0.06]"
                    >
                      <span className="truncate group-hover:text-primary">
                        Kho đề cộng đồng QuizKen
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                    </Link>
                    {otherHubs.map((hub) => (
                      <Link
                        key={hub.key}
                        href={hub.path}
                        className="group flex items-center justify-between gap-2 rounded-xl bg-foreground/[0.04] px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/[0.08] dark:bg-foreground/[0.06]"
                      >
                        <span className="truncate group-hover:text-primary">
                          {hub.shortTitle}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                      </Link>
                    ))}
                  </div>
                </div>
              </section>

              {/* FAQs */}
              {entry.faqs.length > 0 && (
                <section aria-labelledby="faq-heading">
                  <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none sm:p-8">
                    <div className="mb-5 flex items-center gap-2.5">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      <h2
                        id="faq-heading"
                        className="font-heading text-xl font-bold text-foreground sm:text-2xl"
                      >
                        Câu Hỏi Thường Gặp Về {entry.shortName}
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {entry.faqs.map((faq, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl bg-foreground/[0.04] p-5 dark:bg-foreground/[0.06]"
                        >
                          <h3 className="mb-2 font-heading text-base font-semibold text-foreground">
                            {faq.q}
                          </h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {faq.a}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Right Sticky Sidebar */}
            <aside className="h-fit space-y-6 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none sm:p-7">
                <Badge>
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  QuizKen AI Generator
                </Badge>
                <h3 className="mt-3 font-heading text-2xl font-bold text-foreground">
                  Tạo Bộ Đề {entry.shortName} Bằng AI
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Tải lên tài liệu PDF/Word hoặc nhập chủ đề để AI tự động tạo
                  đề luyện thi {entry.shortName} kèm lời giải chi tiết trong 30
                  giây.
                </p>
                <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    Chấm điểm tức thì &amp; giải thích từng câu
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    Phòng thi thử đếm ngược theo thời gian thật
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    Xuất file PDF A4 &amp; Word miễn phí
                  </li>
                </ul>
                <div className="mt-6">
                  <Button
                    href={ctaUrl}
                    className="group w-full justify-center"
                    size="md"
                  >
                    Tạo đề bằng AI ngay
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none">
                <div className="flex items-center gap-2.5 text-foreground">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/[0.06]">
                    <Printer className="h-4 w-4" />
                  </span>
                  <h4 className="font-heading text-lg font-bold">
                    Xuất Đề PDF / Trộn Mã Đề
                  </h4>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Tạo nhiều mã đề xáo trộn tự động hoặc in phiếu trả lời trắc
                  nghiệm A4 chuẩn Bộ GD&amp;ĐT miễn phí.
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <Button
                    href={ctaUrl}
                    variant="secondary"
                    size="md"
                    className="w-full justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Mở trên QuizKen App
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
