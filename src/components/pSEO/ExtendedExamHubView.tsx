import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  Clock,
  Award,
  Layers,
  BookOpen,
  Building2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import {
  EXTENDED_HUBS,
  getExamsByHub,
  type ExtendedExamHubKey,
} from "@/lib/pseoExtended";
import { appLink } from "@/lib/site";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo";

export function ExtendedExamHubView({ hubKey }: { hubKey: ExtendedExamHubKey }) {
  const hub = EXTENDED_HUBS[hubKey];
  const entries = getExamsByHub(hubKey);
  const otherHubs = Object.values(EXTENDED_HUBS).filter(
    (h) => h.key !== hubKey
  );

  const jsonLdData = [
    breadcrumbSchema([
      { name: "Trang chủ", path: "/" },
      { name: "Đề thi", path: "/de-thi" },
      { name: hub.shortTitle, path: hub.path },
    ]),
    collectionPageSchema({
      name: hub.seoTitle,
      description: hub.seoDescription,
      path: hub.path,
    }),
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />

      <section className="bg-background pt-10 pb-16 sm:pt-16 sm:pb-24">
        <Container className="space-y-10">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
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
            <span className="font-medium text-foreground">
              {hub.shortTitle}
            </span>
          </nav>

          {/* Hero */}
          <header className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    {hub.badge}
                  </Badge>
                  <Badge>{entries.length} bộ đề chuyên sâu</Badge>
                </div>

                <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  {hub.title}
                </h1>

                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {hub.description}
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                <Button
                  href={appLink(`/?topic=${encodeURIComponent(hub.shortTitle)}`)}
                  size="lg"
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Tạo đề AI miễn phí
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  href="/kho-de"
                  variant="secondary"
                  size="lg"
                  className="gap-2"
                >
                  Kho đề cộng đồng
                </Button>
              </div>
            </div>
          </header>

          {/* Cards Grid */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <Link
                key={entry.slug}
                href={`/de-thi/${entry.hub}/${entry.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none transition-colors hover:border-primary/50"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge className="text-[11px]">{entry.badge}</Badge>
                    <span className="text-xs font-medium text-muted-foreground">
                      {entry.questions.length} câu mẫu
                    </span>
                  </div>

                  <h2 className="mt-3 font-heading text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {entry.shortName}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {entry.description}
                  </p>

                  {entry.universities && entry.universities.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-primary" />
                      {entry.universities.slice(0, 4).map((u) => (
                        <span
                          key={u}
                          className="rounded-md bg-foreground/[0.05] px-2 py-0.5 text-[11px] font-semibold text-muted-foreground"
                        >
                          {u}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 space-y-1.5 border-t border-border/50 pt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>Thời gian: {entry.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>Thang điểm: {entry.maxScore}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{entry.topics.length} chuyên đề trọng tâm</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Xem ma trận &amp; làm thử ngay
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          {/* Cross-navigation to Other Exam Hubs */}
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none sm:p-7">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/[0.06] text-primary">
                <Layers className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                  Các Hệ Thống Đề Thi Khác Trên QuizKen
                </h2>
                <p className="text-xs text-muted-foreground">
                  Chuyển nhanh sang các kỳ thi THPT, ĐGNL, Đại học &amp; Chứng chỉ
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/de-thi"
                className="group flex items-center justify-between gap-2 rounded-xl bg-foreground/[0.04] p-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/[0.08] dark:bg-foreground/[0.06]"
              >
                <span className="truncate group-hover:text-primary">
                  THPT Quốc Gia (9 môn)
                </span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
              </Link>
              {otherHubs.map((other) => (
                <Link
                  key={other.key}
                  href={other.path}
                  className="group flex items-center justify-between gap-2 rounded-xl bg-foreground/[0.04] p-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/[0.08] dark:bg-foreground/[0.06]"
                >
                  <span className="truncate group-hover:text-primary">
                    {other.shortTitle}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
