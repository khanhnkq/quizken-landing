import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  BookOpen,
  FileText,
  Printer,
  Layers,
  GraduationCap,
  ListOrdered,
  Calculator,
  Download,
  Flame,
  Award,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  SUBJECTS,
  GRADES,
  getQuestionsForSubjectGrade,
  isMultipleChoice,
  isTrueFalse,
  isShortAnswer,
} from "@/lib/pSEO";
import { JsonLd } from "@/components/JsonLd";
import { appLink, buildAbsoluteUrl } from "@/lib/site";
import { InteractiveQuizWidget } from "@/components/pSEO/InteractiveQuizWidget";

type RouteParams = {
  subject: string;
  grade: string;
};

// 9 subjects icon mapping for rich internal navigation
const SUBJECT_ICONS: Record<string, string> = {
  toan: "📐",
  "tieng-anh": "🌐",
  "vat-ly": "⚡",
  "hoa-hoc": "🧪",
  "sinh-hoc": "🧬",
  "lich-su": "🏛️",
  "dia-ly": "🌍",
  "gdkt-pl": "⚖️",
  "tin-hoc": "💻",
};

// Generate static params for Next.js SSG build (36 paths = 9 subjects x 4 grades)
export async function generateStaticParams(): Promise<RouteParams[]> {
  const paths: RouteParams[] = [];
  for (const sub of SUBJECTS) {
    for (const gr of GRADES) {
      paths.push({
        subject: sub.slug,
        grade: gr.slug,
      });
    }
  }
  return paths;
}

// Generate dynamic metadata for search engines & AI citation engines
export async function generateMetadata(props: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { subject, grade } = await props.params;
  const subData = SUBJECTS.find((s) => s.slug === subject);
  const grData = GRADES.find((g) => g.slug === grade);

  if (!subData || !grData) return {};

  const title = `Đề Thi Trắc Nghiệm ${subData.name} ${grData.name} Chuẩn Format 2026 Có Đáp Án`;
  const description = `Bộ đề thi trắc nghiệm ${subData.name} ${grData.name} chuẩn cấu trúc đổi mới 2026 của Bộ GD&ĐT (Phần I: 4 lựa chọn, Phần II: Đúng/Sai lũy tiến, Phần III: Trả lời ngắn). Có lời giải chi tiết và link làm bài online miễn phí trên QuizKen.`;
  const path = `/de-thi/${subject}/${grade}`;
  const keywords = [
    `đề thi ${subData.name} ${grData.name}`,
    `trắc nghiệm đúng sai`,
    `trả lời ngắn`,
    `đề minh họa 2026`,
    `giải chi tiết`,
    `đề thi thử thpt 2026`,
    `đề thi ${subData.name} 2026`,
    `trắc nghiệm ${subData.name} format mới`,
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: buildAbsoluteUrl(path),
    },
    openGraph: {
      title,
      description,
      url: buildAbsoluteUrl(path),
      type: "website",
      locale: "vi_VN",
    },
  };
}

export default async function PseoPage(props: {
  params: Promise<RouteParams>;
}) {
  const { subject, grade } = await props.params;
  const subData = SUBJECTS.find((s) => s.slug === subject);
  const grData = GRADES.find((g) => g.slug === grade);

  if (!subData || !grData) {
    notFound();
  }

  const title = `Đề Thi Trắc Nghiệm ${subData.name} ${grData.name} Chuẩn Format 2026 Có Đáp Án`;
  const ctaUrl = appLink(`/?subject=${subject}&grade=${grade}`);
  const questions = getQuestionsForSubjectGrade(subData, grade);

  // Dynamic FAQs for user knowledge & Schema.org FAQPage
  const faqs = [
    {
      q: `Cấu trúc đề thi trắc nghiệm ${subData.name} ${grData.name} năm 2026 có gì mới?`,
      a: `Đề thi ${subData.name} ${grData.name} năm 2026 bám sát Chương trình Giáo dục Phổ thông 2018 của Bộ GD&ĐT với cấu trúc 3 phần rõ rệt: Phần I gồm các câu trắc nghiệm 4 lựa chọn (0.25 điểm/câu, mức độ Nhận biết - Thông hiểu); Phần II gồm các câu trắc nghiệm Đúng/Sai với 4 ý tính điểm lũy tiến (tối đa 1.0 điểm/câu, mức độ Thông hiểu - Vận dụng); Phần III gồm các câu hỏi trả lời ngắn (0.5 điểm/câu, mức độ Vận dụng - Vận dụng cao) yêu cầu học sinh tự tính toán và điền kết quả.`,
    },
    {
      q: `Quy tắc tính điểm câu trắc nghiệm Đúng/Sai (Phần II) môn ${subData.name} được quy định như thế nào?`,
      a: `Theo barem chuẩn 2026 của Bộ GD&ĐT, điểm câu hỏi Đúng/Sai được tính lũy tiến theo số ý thí sinh chọn đúng trong mỗi câu: Đúng 1 ý được 0.1 điểm; Đúng 2 ý được 0.25 điểm; Đúng 3 ý được 0.5 điểm; và Đúng cả 4 ý đạt điểm tuyệt đối 1.0 điểm. Barem này triệt tiêu hoàn toàn thói quen chọn ngẫu nhiên hay đoán mò.`,
    },
    {
      q: `Làm thế nào để tránh mất điểm ở phần câu hỏi Trả lời ngắn (Phần III)?`,
      a: `Tại Phần III, đề thi không đưa ra phương án gợi ý. Học sinh cần rèn luyện tính toán cẩn thận từng bước nháp, chú ý đơn vị đo lường (cm, m, %, độ...), làm tròn số chính xác theo yêu cầu đề bài và kiểm tra kỹ dấu trước khi điền kết quả vào ô làm bài.`,
    },
    {
      q: `Làm sao để tạo thêm nhiều bộ đề thi ${subData.name} ${grData.name} tự động bằng AI?`,
      a: `Bạn chỉ cần click vào nút "Tạo đề bằng AI ngay" trên QuizKen. Công nghệ AI chuyên biệt cho giáo dục sẽ tự động biên soạn đề thi ${subData.name} ${grData.name} theo đúng ma trận GDPT 2018, tùy chỉnh số lượng câu theo từng phần và cung cấp đáp án chi tiết trong vòng 30 giây.`,
    },
    {
      q: `QuizKen có hỗ trợ tải file đề thi ${subData.name} ${grData.name} dạng PDF in ấn không?`,
      a: `Có. Bạn có thể xuất file đề thi kèm phiếu đáp án và hướng dẫn giải chi tiết dưới dạng PDF chuẩn trang A4 hoàn toàn miễn phí để phục vụ in ấn bài tập cho lớp học hoặc tự luyện tập tại nhà.`,
    },
    {
      q: `Luyện thi trắc nghiệm online trên QuizKen có mất phí không?`,
      a: `Trải nghiệm làm bài thi thử online có chấm điểm tự động và xem lời giải thích chi tiết trên website QuizKen là hoàn toàn miễn phí. Bạn có thể thực hành trực tiếp trên điện thoại, máy tính bảng hoặc máy tính mà không cần cài đặt ứng dụng.`,
    },
  ];

  // Generate Schema.org Quiz questions
  const quizQuestionsSchema = questions.flatMap((q, idx) => {
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
        name: `Câu ${idx + 1} (${q.context}) - Ý ${String.fromCharCode(97 + sIdx)}: ${sub.text}`,
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
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Trang chủ",
          item: buildAbsoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Đề thi",
          item: buildAbsoluteUrl("/de-thi"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: subData.name,
          item: buildAbsoluteUrl(`/de-thi/${subject}`),
        },
        {
          "@type": "ListItem",
          position: 4,
          name: `Đề thi ${subData.name} ${grData.name}`,
          item: buildAbsoluteUrl(`/de-thi/${subject}/${grade}`),
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Quiz",
      name: title,
      description: `Bộ đề thi trắc nghiệm ${subData.name} ${grData.name} bám sát cấu trúc đổi mới 2026 của Bộ GD&ĐT gồm 3 phần thi: 4 lựa chọn, Đúng/Sai lũy tiến và Trả lời ngắn có đáp án chi tiết.`,
      educationalLevel: grData.name,
      inLanguage: "vi",
      about: {
        "@type": "Thing",
        name: subData.name,
      },
      hasPart: quizQuestionsSchema,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    },
  ];

  // Other subjects for internal linking
  const otherSubjects = SUBJECTS.filter((s) => s.slug !== subject);
  // Other grades for internal linking
  const otherGrades = GRADES.filter((g) => g.slug !== grade);

  return (
    <>
      <JsonLd data={jsonLdData} />

      <section className="bg-background pt-10 pb-16 sm:pt-16 sm:pb-24">
        <Container>
          {/* Breadcrumbs Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-primary">
              Trang chủ
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link href="/de-thi" className="transition-colors hover:text-primary">
              Đề thi
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link
              href={`/de-thi/${subject}`}
              className="transition-colors hover:text-primary"
            >
              {subData.name}
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="font-medium text-foreground">
              {grData.name}
            </span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
            {/* Left Main Column */}
            <div className="space-y-10">
              {/* Hero Section */}
              <header className="space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge>
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    Format Đổi Mới GDPT 2018 (Bộ GD&amp;ĐT) • Chuẩn 2026
                  </Badge>
                  <Badge>{grData.name}</Badge>
                </div>

                <h1 className="font-heading text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  Đề Thi Trắc Nghiệm {subData.name} {grData.name} Chuẩn Format 2026{" "}
                  <span className="text-primary">Có Đáp Án &amp; Lời Giải</span>
                </h1>

                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {subData.description} Bộ đề thi bám sát chuẩn ma trận đề thi 2026
                  của Bộ GD&amp;ĐT, cung cấp phương pháp giải toàn diện cho cả 3
                  dạng thức trắc nghiệm: Nhiều lựa chọn, Đúng/Sai lũy tiến và Trả
                  lời ngắn giúp học sinh bứt phá điểm số tối đa.
                </p>

                {/* Key Topics Badges */}
                {subData.topics && subData.topics.length > 0 && (
                  <div className="pt-2">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Chuyên đề trọng tâm trong đề thi:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {subData.topics.map((topic, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1.5 rounded-lg border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] px-2.5 py-1 text-xs font-medium text-foreground"
                        >
                          <BookOpen className="h-3 w-3 text-primary" />
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </header>

              {/* Format Overview Card: Bảng Ma Trận Cấu Trúc Đề Thi 2026 */}
              <section aria-labelledby="matrix-heading">
                <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none backdrop-blur-none sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-0 shadow-none bg-foreground/[0.06] text-primary">
                      <Layers className="h-4 w-4" />
                    </span>
                    <div>
                      <h2
                        id="matrix-heading"
                        className="font-heading text-xl font-bold text-foreground sm:text-2xl"
                      >
                        Ma Trận Cấu Trúc Đề Thi THPT 2026 Chuẩn Bộ GD&amp;ĐT
                      </h2>
                      <p className="text-xs text-muted-foreground sm:text-sm">
                        Quy định định dạng đề thi mới nhất theo Chương trình GDPT 2018
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {/* Part I Card */}
                    <div className="rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                          <ListOrdered className="h-3.5 w-3.5 text-primary" />
                          PHẦN I
                        </span>
                        <span className="rounded-lg border-0 bg-foreground/[0.06] px-2 py-0.5 text-[11px] font-semibold text-foreground">
                          0.25đ / câu
                        </span>
                      </div>
                      <h3 className="mt-2.5 font-heading text-base font-bold text-foreground">
                        Nhiều Lựa Chọn
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        Gồm 4 phương án A, B, C, D (chọn duy nhất 1 đáp án đúng).
                      </p>
                      <div className="mt-3 space-y-1 pt-1 text-[11px] text-muted-foreground">
                        <div>
                          <strong>Mức độ:</strong> Nhận biết &amp; Thông hiểu
                        </div>
                        <div>
                          <strong>Trọng số:</strong> ~3.0 - 4.5 điểm
                        </div>
                      </div>
                    </div>

                    {/* Part II Card */}
                    <div className="rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                          PHẦN II
                        </span>
                        <span className="rounded-lg border-0 bg-foreground/[0.06] px-2 py-0.5 text-[11px] font-semibold text-foreground">
                          Lũy tiến 1.0đ
                        </span>
                      </div>
                      <h3 className="mt-2.5 font-heading text-base font-bold text-foreground">
                        Trắc Nghiệm Đúng/Sai
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        Mỗi câu có 4 ý a, b, c, d dựa trên tình huống / ngữ cảnh.
                      </p>
                      <div className="mt-3 space-y-1 pt-1 text-[11px] text-muted-foreground">
                        <div>
                          <strong>Thang điểm:</strong> 0.1 - 0.25 - 0.5 - 1.0đ
                        </div>
                        <div>
                          <strong>Mức độ:</strong> Thông hiểu - Vận dụng
                        </div>
                      </div>
                    </div>

                    {/* Part III Card */}
                    <div className="rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                          <Calculator className="h-3.5 w-3.5 text-primary" />
                          PHẦN III
                        </span>
                        <span className="rounded-lg border-0 bg-foreground/[0.06] px-2 py-0.5 text-[11px] font-semibold text-foreground">
                          0.5đ / câu
                        </span>
                      </div>
                      <h3 className="mt-2.5 font-heading text-base font-bold text-foreground">
                        Trả Lời Ngắn
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        Tự tính toán và điền số / kết quả vào ô, không có gợi ý.
                      </p>
                      <div className="mt-3 space-y-1 pt-1 text-[11px] text-muted-foreground">
                        <div>
                          <strong>Mức độ:</strong> Vận dụng - Vận dụng cao
                        </div>
                        <div>
                          <strong>Đặc thù:</strong> Triệt tiêu đoán mò
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Interactive Quiz Section (Trung tâm bài học) */}
              <section aria-label="Làm bài thi trắc nghiệm trực tuyến">
                <InteractiveQuizWidget
                  questions={questions}
                  subjectName={subData.name}
                  gradeName={grData.name}
                />
              </section>

              {/* SEO/GEO Crawlable Fallback Content (Trong HTML tĩnh từ Server) */}
              <section
                aria-label="Ngân hàng câu hỏi và đáp án mẫu chuẩn SEO"
                className="mt-12 space-y-6"
              >
                <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none backdrop-blur-none sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-0 shadow-none bg-foreground/[0.06] text-primary">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div>
                      <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                        Ngân Hàng Câu Hỏi &amp; Đáp Án Chi Tiết Môn {subData.name} {grData.name}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Bản văn bản tĩnh phục vụ tra cứu nhanh, tải tài liệu học tập và hỗ
                        trợ công cụ tìm kiếm, AI trích xuất lời giải chuẩn xác.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {questions.map((q, idx) => {
                    const questionNumber = idx + 1;

                    if (isMultipleChoice(q)) {
                      return (
                        <article
                          key={q.id}
                          className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-none backdrop-blur-none sm:p-6"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-heading text-base font-bold text-foreground">
                              Câu {questionNumber} (Phần I - 0.25 điểm)
                            </span>
                            <Badge className="text-[11px]">
                              4 Lựa chọn
                            </Badge>
                          </div>

                          <p className="mt-3 whitespace-pre-line text-base font-medium leading-relaxed text-foreground">
                            {q.question}
                          </p>

                          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                            {q.options.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className="flex items-start gap-2.5 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-3 text-sm"
                              >
                                <span className="shrink-0 font-bold text-muted-foreground">
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
                            <div className="mt-3 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-4 text-sm text-muted-foreground">
                              <p className="mb-1 flex items-center gap-1.5 font-bold text-primary">
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                                Đáp án chính xác:{" "}
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
                          className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-none backdrop-blur-none sm:p-6"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-heading text-base font-bold text-foreground">
                              Câu {questionNumber} (Phần II - Tối đa 1.0 điểm)
                            </span>
                            <Badge className="text-[11px]">
                              Đúng / Sai lũy tiến
                            </Badge>
                          </div>

                          <p className="mt-3 whitespace-pre-line text-base font-medium leading-relaxed text-foreground">
                            {q.context}
                          </p>

                          <div className="mt-4 space-y-2.5">
                            {q.subQuestions.map((sub, sIdx) => (
                              <div
                                key={sub.id}
                                className="flex items-start gap-3 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-3 text-sm"
                              >
                                <span className="shrink-0 font-bold text-primary">
                                  {String.fromCharCode(97 + sIdx)})
                                </span>
                                <span className="leading-relaxed text-foreground">
                                  {sub.text}
                                </span>
                              </div>
                            ))}
                          </div>

                          <details className="group mt-4 pt-1">
                            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-primary select-none hover:underline">
                              <span>Xem bảng đáp án Đúng/Sai &amp; phân tích từng ý</span>
                              <span className="transition-transform group-open:rotate-180">
                                ▼
                              </span>
                            </summary>
                            <div className="mt-3 space-y-3 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-4 text-sm text-muted-foreground">
                              {q.subQuestions.map((sub, sIdx) => (
                                <div key={sub.id} className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-foreground">
                                      Ý {String.fromCharCode(97 + sIdx)}:
                                    </span>
                                    <span
                                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-bold ${
                                        sub.isCorrect
                                          ? "bg-primary/15 text-primary"
                                          : "bg-destructive/15 text-destructive"
                                      }`}
                                    >
                                      {sub.isCorrect ? "Đúng" : "Sai"}
                                    </span>
                                  </div>
                                  <p className="text-xs leading-relaxed sm:text-sm">
                                    {sub.explanation}
                                  </p>
                                </div>
                              ))}
                              {q.explanation && (
                                <p className="pt-1 text-xs italic text-muted-foreground">
                                  {q.explanation}
                                </p>
                              )}
                            </div>
                          </details>
                        </article>
                      );
                    }

                    if (isShortAnswer(q)) {
                      return (
                        <article
                          key={q.id}
                          className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-none backdrop-blur-none sm:p-6"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-heading text-base font-bold text-foreground">
                              Câu {questionNumber} (Phần III - 0.5 điểm)
                            </span>
                            <Badge className="text-[11px]">
                              Trả lời ngắn
                            </Badge>
                          </div>

                          <p className="mt-3 whitespace-pre-line text-base font-medium leading-relaxed text-foreground">
                            {q.question}
                          </p>

                          <details className="group mt-4 pt-1">
                            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-primary select-none hover:underline">
                              <span>Xem kết quả chuẩn &amp; phương pháp tính</span>
                              <span className="transition-transform group-open:rotate-180">
                                ▼
                              </span>
                            </summary>
                            <div className="mt-3 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-4 text-sm text-muted-foreground">
                              <p className="mb-1 font-bold text-foreground">
                                Kết quả chính xác:{" "}
                                <span className="font-heading text-base text-primary">
                                  {q.answer}
                                </span>{" "}
                                {q.unit && (
                                  <span className="text-xs text-muted-foreground">
                                    ({q.unit})
                                  </span>
                                )}
                              </p>
                              {q.acceptedAnswers && q.acceptedAnswers.length > 1 && (
                                <p className="mb-2 text-xs text-muted-foreground">
                                  Biến thể chấp nhận:{" "}
                                  {q.acceptedAnswers.join(", ")}
                                </p>
                              )}
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

              {/* Internal Linking Matrix: Chuyển đổi môn học & khối lớp nhanh */}
              <section aria-labelledby="matrix-nav-heading" className="space-y-6">
                {/* 1. Other Subjects */}
                <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none backdrop-blur-none sm:p-7">
                  <div className="mb-4 flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl border-0 shadow-none bg-foreground/[0.06] text-primary">
                      <GraduationCap className="h-4 w-4" />
                    </span>
                    <h2
                      id="matrix-nav-heading"
                      className="font-heading text-lg font-bold text-foreground sm:text-xl"
                    >
                      Luyện Thi Các Môn Học Khác ({grData.name})
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {otherSubjects.map((s) => {
                      const icon = SUBJECT_ICONS[s.slug] || "📚";
                      return (
                        <Link
                          key={s.slug}
                          href={`/de-thi/${s.slug}/${grade}`}
                          className="group flex h-10 items-center justify-between gap-2 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.08]"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="shrink-0 text-base">{icon}</span>
                            <span className="truncate font-semibold transition-colors group-hover:text-primary">
                              {s.name}
                            </span>
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Other Grades for Current Subject */}
                <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none backdrop-blur-none sm:p-7">
                  <div className="mb-4 flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl border-0 shadow-none bg-foreground/[0.06] text-primary">
                      <Flame className="h-4 w-4" />
                    </span>
                    <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                      Các Khối Lớp Khác Môn {subData.name}
                    </h2>
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-3">
                    {otherGrades.map((g) => (
                      <Link
                        key={g.slug}
                        href={`/de-thi/${subject}/${g.slug}`}
                        className="group flex h-10 items-center justify-between gap-2 rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] px-4 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/[0.08]"
                      >
                        <span className="truncate font-heading transition-colors group-hover:text-primary">
                          {g.name}
                        </span>
                        <span className="inline-flex shrink-0 whitespace-nowrap items-center gap-1 text-xs font-semibold text-primary">
                          Xem đề
                          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 3. Hub Navigation: Khám phá thêm đề thi & công cụ */}
                <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none backdrop-blur-none sm:p-7">
                  <h2 className="mb-4 font-heading text-lg font-bold text-foreground sm:text-xl">
                    Khám Phá Kho Đề &amp; Công Cụ Học Tập QuizKen
                  </h2>
                  <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                    <Link
                      href="/de-thi"
                      className="group flex h-10 items-center justify-between rounded-xl bg-foreground/[0.04] dark:bg-foreground/[0.06] px-4 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/[0.08]"
                    >
                      <span className="truncate group-hover:text-primary">Tổng hợp Đề thi</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      href={`/de-thi/${subject}`}
                      className="group flex h-10 items-center justify-between rounded-xl bg-foreground/[0.04] dark:bg-foreground/[0.06] px-4 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/[0.08]"
                    >
                      <span className="truncate group-hover:text-primary">Kho đề {subData.name}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      href="/kho-de"
                      className="group flex h-10 items-center justify-between rounded-xl bg-foreground/[0.04] dark:bg-foreground/[0.06] px-4 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/[0.08]"
                    >
                      <span className="truncate group-hover:text-primary">Kho đề cộng đồng</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      href="/cong-cu"
                      className="group flex h-10 items-center justify-between rounded-xl bg-foreground/[0.04] dark:bg-foreground/[0.06] px-4 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/[0.08]"
                    >
                      <span className="truncate group-hover:text-primary">Công cụ miễn phí</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </section>

              {/* FAQs Section */}
              <section aria-labelledby="faq-heading">
                <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none backdrop-blur-none sm:p-8">
                  <div className="mb-6 flex items-center gap-2.5">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <h2
                      id="faq-heading"
                      className="font-heading text-xl font-bold text-foreground sm:text-2xl"
                    >
                      Câu Hỏi Thường Gặp Về Đề Thi {subData.name} {grData.name}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {faqs.map((f, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border-0 shadow-none bg-foreground/[0.04] dark:bg-foreground/[0.06] p-5"
                      >
                        <h3 className="mb-2 font-heading text-base font-semibold text-foreground sm:text-lg">
                          {f.q}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {f.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Right: Sticky Sidebar CTA Card */}
            <aside className="h-fit space-y-6 lg:sticky lg:top-24">
              {/* Primary AI Quiz Generator CTA */}
              <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none backdrop-blur-none sm:p-7">
                <div className="flex items-center gap-2">
                  <Badge>
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    AI Quiz Engine
                  </Badge>
                </div>

                <h3 className="mt-3 font-heading text-2xl font-bold text-foreground">
                  Tạo Đề Thi Trắc Nghiệm {subData.name} Bằng AI
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Sử dụng Trí Tuệ Nhân Tạo để tạo ngay đề thi {subData.name} {grData.name} theo ma trận chuẩn 2026 chỉ trong 30 giây.
                </p>

                <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    Chuẩn ma trận GDPT 2018 Bộ GD&amp;ĐT
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    Tự động tạo đáp án &amp; lời giải chi tiết
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    Đầy đủ 3 phần: 4 lựa chọn, Đúng/Sai, Trả lời ngắn
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    Xuất file Word &amp; PDF A4 chuẩn in ấn
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

              {/* Secondary Printable PDF CTA */}
              <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none backdrop-blur-none">
                <div className="flex items-center gap-2.5 text-foreground">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border-0 shadow-none bg-foreground/[0.06] text-foreground">
                    <Printer className="h-4 w-4" />
                  </span>
                  <h4 className="font-heading text-lg font-bold">
                    Tải Đề Thi Dạng PDF (A4)
                  </h4>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Xuất file đề thi và phiếu trả lời trắc nghiệm chuẩn khổ A4 để in
                  ấn cho học sinh làm bài hoặc giáo viên kiểm tra trên lớp.
                </p>

                <div className="mt-4">
                  <Button
                    href={ctaUrl}
                    variant="secondary"
                    size="md"
                    className="w-full justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Tải file PDF &amp; Đáp án
                  </Button>
                </div>
              </div>

              {/* Subject Information Box */}
              <div className="space-y-2 rounded-2xl border border-border/70 bg-card/85 p-5 text-xs text-muted-foreground shadow-none backdrop-blur-none">
                <div className="flex items-center gap-1.5 font-heading text-sm font-semibold text-foreground">
                  <Award className="h-4 w-4 text-primary" />
                  Bí quyết ôn thi hiệu quả 2026
                </div>
                <p>
                  Đề thi format 2026 tăng cường tính ứng dụng thực tiễn và tư duy suy
                  luận. Hãy tập trung luyện giải kỹ các câu Đúng/Sai để nắm chắc 4
                  điểm và rèn luyện kỹ năng tính toán không nhầm lẫn ở phần Trả lời
                  ngắn.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
