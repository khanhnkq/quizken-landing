import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FolderKanban,
  GraduationCap,
  Layers,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import {
  SUBJECTS,
  GRADES,
  getQuestionsForSubjectGrade,
} from "@/lib/pSEO";
import { buildMetadata, breadcrumbSchema, collectionPageSchema } from "@/lib/seo";
import { appLink } from "@/lib/site";

type RouteParams = {
  subject: string;
};

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

export async function generateStaticParams(): Promise<RouteParams[]> {
  return SUBJECTS.map((s) => ({ subject: s.slug }));
}

export async function generateMetadata(props: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { subject } = await props.params;
  const subData = SUBJECTS.find((s) => s.slug === subject);
  if (!subData) return {};

  return buildMetadata({
    title: `Kho Đề Thi Trắc Nghiệm Môn ${subData.name} (Lớp 10, 11, 12 & THPT 2026)`,
    description: `${subData.description} Chọn khối lớp 10, 11, 12 hoặc ôn thi THPT Quốc gia để luyện đề tương tác miễn phí có đáp án chi tiết.`,
    path: `/de-thi/${subject}`,
    keywords: [
      `đề thi ${subData.name}`,
      `trắc nghiệm ${subData.name} lớp 10`,
      `trắc nghiệm ${subData.name} lớp 11`,
      `trắc nghiệm ${subData.name} lớp 12`,
      `ôn thi thpt ${subData.name} 2026`,
    ],
  });
}

export default async function SubjectHubPage(props: {
  params: Promise<RouteParams>;
}) {
  const { subject } = await props.params;
  const subData = SUBJECTS.find((s) => s.slug === subject);

  if (!subData) {
    notFound();
  }

  const icon = SUBJECT_ICONS[subData.slug] || "📚";
  const otherSubjects = SUBJECTS.filter((s) => s.slug !== subject);
  const ctaUrl = appLink(`/?subject=${subject}`);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Trang chủ", path: "/" },
            { name: "Đề thi", path: "/de-thi" },
            { name: subData.name, path: `/de-thi/${subject}` },
          ]),
          collectionPageSchema({
            name: `Kho Đề Thi Trắc Nghiệm Môn ${subData.name} 2026`,
            description: subData.description,
            path: `/de-thi/${subject}`,
          }),
        ]}
      />

      <section className="bg-background pt-10 pb-16 sm:pt-16 sm:pb-24">
        <Container className="space-y-12">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-primary">
              Trang chủ
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link href="/de-thi" className="transition-colors hover:text-primary">
              Đề thi
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="font-medium text-foreground">{subData.name}</span>
          </nav>

          {/* Hero + Primary CTA */}
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            <header className="space-y-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge>
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Chuẩn GDPT 2018 • Format Bộ GD&amp;ĐT 2026
                </Badge>
              </div>

              <h1 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                <span className="mr-2">{icon}</span>
                Đề Thi Trắc Nghiệm Môn{" "}
                <span className="text-primary">{subData.name}</span>
              </h1>

              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {subData.description}
              </p>

              {/* Topics List */}
              <div className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-none sm:p-6">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>Chuyên đề trọng tâm môn {subData.name}</span>
                </div>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {subData.topics.map((topic) => (
                    <li
                      key={topic}
                      className="flex items-start gap-2 rounded-xl bg-foreground/[0.04] dark:bg-foreground/[0.06] p-3 text-sm font-medium text-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </header>

            {/* Sidebar CTA */}
            <aside className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none sm:p-7 space-y-5">
              <Badge>
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                AI Quiz Generator
              </Badge>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Tạo Đề {subData.name} Bằng AI Trong 30 Giây
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Nhập chủ đề, tài liệu PDF hoặc chọn ma trận chương trình GDPT 2018 để AI tự động biên soạn đề thi {subData.name} kèm đáp án chi tiết và xuất PDF A4.
              </p>
              <div className="space-y-2.5">
                <Button href={ctaUrl} size="md" className="w-full justify-center rounded-xl font-bold">
                  <span>Tạo đề {subData.name} ngay</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  href="/kho-de"
                  variant="secondary"
                  size="md"
                  className="w-full justify-center rounded-xl font-semibold"
                >
                  <FolderKanban className="h-4 w-4" />
                  <span>Xem Kho Đề Cộng Đồng</span>
                </Button>
                <Button
                  href="/cong-cu"
                  variant="outline"
                  size="md"
                  className="w-full justify-center rounded-xl font-semibold"
                >
                  <Wrench className="h-4 w-4" />
                  <span>Công Cụ Ôn Thi Miễn Phí</span>
                </Button>
              </div>
            </aside>
          </div>

          {/* 4 Grade Cards */}
          <section aria-labelledby="grades-heading" className="space-y-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/[0.06] text-primary">
                <Layers className="h-4 w-4" />
              </span>
              <div>
                <h2
                  id="grades-heading"
                  className="font-heading text-2xl font-bold text-foreground"
                >
                  Chọn Khối Lớp Môn {subData.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Mỗi khối lớp cung cấp bộ câu hỏi tương tác 3 phần riêng biệt sát chương trình học
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {GRADES.map((gr) => {
                const gradeQuestions = getQuestionsForSubjectGrade(subData, gr.slug);
                return (
                  <Link
                    key={gr.slug}
                    href={`/de-thi/${subData.slug}/${gr.slug}`}
                    className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none transition-colors hover:border-primary/50"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <Badge className="text-xs">{gr.name}</Badge>
                        <span className="text-xs font-medium text-muted-foreground">
                          {gradeQuestions.length} câu mẫu tương tác (3 phần)
                        </span>
                      </div>
                      <h3 className="font-heading text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                        Đề Thi {subData.name} {gr.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Bộ {gr.label} môn {subData.name}, đầy đủ trắc nghiệm 4 lựa chọn, Đúng/Sai lũy tiến và Trả lời ngắn.
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3 text-sm font-semibold text-primary">
                      <span>Vào làm bài &amp; xem đáp án chi tiết</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Other Subjects */}
          <section aria-labelledby="other-subjects-heading" className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground/[0.06] text-primary">
                <GraduationCap className="h-4 w-4" />
              </span>
              <h2
                id="other-subjects-heading"
                className="font-heading text-xl font-bold text-foreground"
              >
                Khám Phá Các Môn Học Khác
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {otherSubjects.map((s) => (
                <Link
                  key={s.slug}
                  href={`/de-thi/${s.slug}`}
                  className="group flex h-11 items-center justify-between gap-2 rounded-xl bg-foreground/[0.04] dark:bg-foreground/[0.06] px-4 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/[0.08]"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="shrink-0">{SUBJECT_ICONS[s.slug] || "📚"}</span>
                    <span className="truncate group-hover:text-primary">{s.name}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </section>
        </Container>
      </section>
    </>
  );
}
