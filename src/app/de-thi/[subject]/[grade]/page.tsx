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
  Check,
  X,
  Layers,
  GraduationCap,
  ListOrdered,
  Calculator,
  Download,
  Flame,
  Award,
  Share2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  SUBJECTS,
  GRADES,
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
  const quizQuestionsSchema = subData.questions.flatMap((q, idx) => {
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
          item: buildAbsoluteUrl(`/de-thi/${subject}/${grade}`),
        },
        {
          "@type": "ListItem",
          position: 3,
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

      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24">
        {/* Glow Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <span className="absolute left-[10%] top-[5%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />
          <span className="absolute right-[8%] top-[10%] h-[350px] w-[350px] rounded-full bg-emerald-500/15 blur-[100px]" />
        </div>

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
            <Link
              href={`/de-thi/${subject}/${grade}`}
              className="transition-colors hover:text-primary"
            >
              Đề thi
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="font-medium text-foreground">
              Đề thi {subData.name} {grData.name}
            </span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.7fr_1fr]">
            {/* Left Main Column */}
            <div className="space-y-10">
              {/* Hero Section */}
              <header className="space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Format Đổi Mới GDPT 2018 (Bộ GD&ĐT) • Chuẩn 2026
                  </Badge>
                  <Badge className="bg-secondary text-secondary-foreground">
                    {grData.name}
                  </Badge>
                </div>

                <h1 className="font-heading text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  Đề Thi Trắc Nghiệm {subData.name} {grData.name} Chuẩn Format 2026{" "}
                  <span className="text-gradient">Có Đáp Án &amp; Lời Giải</span>
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
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Chuyên đề trọng tâm trong đề thi:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {subData.topics.map((topic, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground"
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
                <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm backdrop-blur-sm sm:p-7">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
                    <div className="rounded-2xl border border-sky-500/20 bg-sky-500/[0.03] p-4.5 sm:p-5">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 dark:text-sky-300">
                          <ListOrdered className="h-3.5 w-3.5" />
                          PHẦN I
                        </span>
                        <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[11px] font-bold text-sky-700 dark:text-sky-300">
                          0.25đ / câu
                        </span>
                      </div>
                      <h3 className="mt-2.5 font-heading text-base font-bold text-foreground">
                        Nhiều Lựa Chọn
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Gồm 4 phương án A, B, C, D (chọn duy nhất 1 đáp án đúng).
                      </p>
                      <div className="mt-3 border-t border-sky-500/10 pt-2.5 text-[11px] text-muted-foreground space-y-1">
                        <div>
                          <strong>Mức độ:</strong> Nhận biết &amp; Thông hiểu
                        </div>
                        <div>
                          <strong>Trọng số:</strong> ~3.0 - 4.5 điểm
                        </div>
                      </div>
                    </div>

                    {/* Part II Card */}
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4.5 sm:p-5">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          PHẦN II
                        </span>
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                          Lũy tiến 1.0đ / câu
                        </span>
                      </div>
                      <h3 className="mt-2.5 font-heading text-base font-bold text-foreground">
                        Trắc Nghiệm Đúng/Sai
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Mỗi câu có 4 ý a, b, c, d dựa trên tình huống / ngữ cảnh.
                      </p>
                      <div className="mt-3 border-t border-emerald-500/10 pt-2.5 text-[11px] text-muted-foreground space-y-1">
                        <div>
                          <strong>Thang điểm:</strong> 0.1 - 0.25 - 0.5 - 1.0đ
                        </div>
                        <div>
                          <strong>Mức độ:</strong> Thông hiểu - Vận dụng
                        </div>
                      </div>
                    </div>

                    {/* Part III Card */}
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-4.5 sm:p-5">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                          <Calculator className="h-3.5 w-3.5" />
                          PHẦN III
                        </span>
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                          0.5đ / câu
                        </span>
                      </div>
                      <h3 className="mt-2.5 font-heading text-base font-bold text-foreground">
                        Trả Lời Ngắn
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Tự tính toán và điền số / kết quả vào ô, không có gợi ý.
                      </p>
                      <div className="mt-3 border-t border-amber-500/10 pt-2.5 text-[11px] text-muted-foreground space-y-1">
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
                  questions={subData.questions}
                  subjectName={subData.name}
                  gradeName={grData.name}
                />
              </section>

              {/* SEO/GEO Crawlable Fallback Content (Trong HTML tĩnh từ Server) */}
              <section
                aria-label="Ngân hàng câu hỏi và đáp án mẫu chuẩn SEO"
                className="mt-12 rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8"
              >
                <div className="border-b border-border/60 pb-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-4 w-4" />
                    </span>
                    <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                      Ngân Hàng Câu Hỏi &amp; Đáp Án Chi Tiết Môn {subData.name} {grData.name}
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Bản văn bản tĩnh phục vụ tra cứu nhanh, tải tài liệu học tập và hỗ
                    trợ công cụ tìm kiếm, AI trích xuất lời giải chuẩn xác.
                  </p>
                </div>

                <div className="mt-6 space-y-6">
                  {subData.questions.map((q, idx) => {
                    const questionNumber = idx + 1;

                    if (isMultipleChoice(q)) {
                      return (
                        <article
                          key={q.id}
                          className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-heading text-base font-bold text-foreground">
                              Câu {questionNumber} (Phần I - 0.25 điểm)
                            </span>
                            <Badge className="bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20 text-[11px]">
                              4 Lựa chọn
                            </Badge>
                          </div>

                          <p className="mt-3 font-medium text-foreground text-base leading-relaxed whitespace-pre-line">
                            {q.question}
                          </p>

                          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                            {q.options.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3 text-sm"
                              >
                                <span className="font-bold text-muted-foreground shrink-0">
                                  {String.fromCharCode(65 + oIdx)}.
                                </span>
                                <span className="text-foreground">{opt}</span>
                              </div>
                            ))}
                          </div>

                          <details className="group mt-4 border-t border-border/60 pt-3">
                            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-primary select-none hover:underline">
                              <span>Xem đáp án &amp; giải thích chi tiết</span>
                              <span className="transition-transform group-open:rotate-180">
                                ▼
                              </span>
                            </summary>
                            <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4 text-sm text-muted-foreground">
                              <p className="font-bold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
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
                          className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-heading text-base font-bold text-foreground">
                              Câu {questionNumber} (Phần II - Tối đa 1.0 điểm)
                            </span>
                            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-[11px]">
                              Đúng / Sai lũy tiến
                            </Badge>
                          </div>

                          <p className="mt-3 font-medium text-foreground text-base leading-relaxed whitespace-pre-line">
                            {q.context}
                          </p>

                          <div className="mt-4 space-y-2.5">
                            {q.subQuestions.map((sub, sIdx) => (
                              <div
                                key={sub.id}
                                className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-3 text-sm"
                              >
                                <span className="font-bold text-primary shrink-0">
                                  {String.fromCharCode(97 + sIdx)})
                                </span>
                                <span className="text-foreground leading-relaxed">
                                  {sub.text}
                                </span>
                              </div>
                            ))}
                          </div>

                          <details className="group mt-4 border-t border-border/60 pt-3">
                            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-primary select-none hover:underline">
                              <span>Xem bảng đáp án Đúng/Sai &amp; phân tích từng ý</span>
                              <span className="transition-transform group-open:rotate-180">
                                ▼
                              </span>
                            </summary>
                            <div className="mt-3 space-y-2.5 rounded-xl border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground">
                              {q.subQuestions.map((sub, sIdx) => (
                                <div
                                  key={sub.id}
                                  className="border-b border-border/40 pb-2.5 last:border-0 last:pb-0"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-foreground">
                                      Ý {String.fromCharCode(97 + sIdx)}:
                                    </span>
                                    <span
                                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${
                                        sub.isCorrect
                                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                          : "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                                      }`}
                                    >
                                      {sub.isCorrect ? "Đúng" : "Sai"}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs sm:text-sm leading-relaxed">
                                    {sub.explanation}
                                  </p>
                                </div>
                              ))}
                              {q.explanation && (
                                <p className="mt-2 text-xs italic text-muted-foreground pt-2 border-t border-border/40">
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
                          className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-heading text-base font-bold text-foreground">
                              Câu {questionNumber} (Phần III - 0.5 điểm)
                            </span>
                            <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 text-[11px]">
                              Trả lời ngắn
                            </Badge>
                          </div>

                          <p className="mt-3 font-medium text-foreground text-base leading-relaxed whitespace-pre-line">
                            {q.question}
                          </p>

                          <details className="group mt-4 border-t border-border/60 pt-3">
                            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-primary select-none hover:underline">
                              <span>Xem kết quả chuẩn &amp; phương pháp tính</span>
                              <span className="transition-transform group-open:rotate-180">
                                ▼
                              </span>
                            </summary>
                            <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4 text-sm text-muted-foreground">
                              <p className="font-bold text-foreground mb-1">
                                Kết quả chính xác:{" "}
                                <span className="text-primary font-heading text-base">
                                  {q.answer}
                                </span>{" "}
                                {q.unit && (
                                  <span className="text-xs text-muted-foreground">
                                    ({q.unit})
                                  </span>
                                )}
                              </p>
                              {q.acceptedAnswers && q.acceptedAnswers.length > 1 && (
                                <p className="text-xs text-muted-foreground mb-2">
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
                <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-7">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <GraduationCap className="h-4 w-4" />
                    </span>
                    <h2
                      id="matrix-nav-heading"
                      className="font-heading text-lg font-bold text-foreground sm:text-xl"
                    >
                      Luyện Thi Các Môn Học Khác ({grData.name})
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {otherSubjects.map((s) => {
                      const icon = SUBJECT_ICONS[s.slug] || "📚";
                      return (
                        <Link
                          key={s.slug}
                          href={`/de-thi/${s.slug}/${grade}`}
                          className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-muted/20 p-3.5 transition-all hover:border-primary/50 hover:bg-muted/50 hover:shadow-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{icon}</span>
                            <span className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                              {s.name}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>{s.questions.length} câu mẫu</span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Other Grades for Current Subject */}
                <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-7">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Flame className="h-4 w-4" />
                    </span>
                    <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                      Các Khối Lớp Khác Môn {subData.name}
                    </h2>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {otherGrades.map((g) => (
                      <Link
                        key={g.slug}
                        href={`/de-thi/${subject}/${g.slug}`}
                        className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-muted/20 p-4 transition-all hover:border-primary/50 hover:bg-muted/50 hover:shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                              {g.name}
                            </span>
                            <Badge className="bg-primary/10 text-primary text-[10px]">
                              Format 2026
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {g.label}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center text-xs font-semibold text-primary">
                          <span>Xem đề thi</span>
                          <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>

              {/* FAQs Section */}
              <section aria-labelledby="faq-heading">
                <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <h2
                      id="faq-heading"
                      className="font-heading text-xl font-bold text-foreground sm:text-2xl"
                    >
                      Câu Hỏi Thường Gặp Về Đề Thi {subData.name} {grData.name}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {faqs.map((f, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-border/60 bg-muted/20 p-5 transition-colors"
                      >
                        <h3 className="font-heading font-semibold text-foreground text-base sm:text-lg mb-2">
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
            <aside className="lg:sticky lg:top-24 h-fit space-y-6">
              {/* Primary AI Quiz Generator CTA */}
              <div className="glass relative overflow-hidden rounded-3xl border border-border p-6 shadow-xl sm:p-8">
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />

                <div className="flex items-center gap-2">
                  <Badge className="border-primary/20 bg-primary/10 text-primary">
                    <Sparkles className="h-3 w-3" />
                    AI Quiz Engine
                  </Badge>
                </div>

                <h3 className="mt-3 font-heading text-2xl font-bold text-foreground">
                  Tạo Đề Thi Trắc Nghiệm {subData.name} Bằng AI
                </h3>

                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
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
                    className="w-full justify-center group shadow-md"
                    size="lg"
                  >
                    Tạo đề bằng AI ngay
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>

              {/* Secondary Printable PDF CTA */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2.5 text-foreground">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-foreground">
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
                    variant="outline"
                    size="sm"
                    className="w-full justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Tải file PDF &amp; Đáp án
                  </Button>
                </div>
              </div>

              {/* Subject Information Box */}
              <div className="rounded-3xl border border-border/60 bg-muted/20 p-5 text-xs text-muted-foreground space-y-2">
                <div className="font-heading font-semibold text-foreground text-sm flex items-center gap-1.5">
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
