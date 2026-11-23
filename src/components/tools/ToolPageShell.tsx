import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  HelpCircle,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbSchema,
  faqSchema,
} from "@/lib/seo";
import { appLink } from "@/lib/site";
import {
  TOOLS_CATALOG,
  toolSoftwareSchema,
  type ToolCatalogItem,
} from "@/lib/toolsCatalog";

export type ToolFaqItem = {
  question: string;
  answer: string;
};

type ToolPageShellProps = {
  tool: ToolCatalogItem;
  faqs: ToolFaqItem[];
  ctaTitle?: string;
  ctaDescription?: string;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  children: React.ReactNode;
  seoContent: React.ReactNode;
};

export function ToolPageShell({
  tool,
  faqs,
  ctaTitle = "Biến lý thuyết thành điểm số thực chiến cùng QuizKen AI",
  ctaDescription = "Tải PDF tài liệu học tập hoặc nhập chủ đề bất kỳ để AI tự động tạo đề thi thử 3 phần chuẩn GDPT 2018, chấm điểm tự động và giải thích từng câu chi tiết.",
  ctaHref = appLink("/"),
  ctaLabel = "Trải nghiệm QuizKen miễn phí",
  secondaryCtaHref = "/de-thi",
  secondaryCtaLabel = "Khám phá kho đề thi 2027",
  children,
  seoContent,
}: ToolPageShellProps) {
  const relatedTools = TOOLS_CATALOG.filter((t) => t.slug !== tool.slug);

  return (
    <>
      <JsonLd
        data={[
          toolSoftwareSchema(tool),
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Trang chủ", path: "/" },
            { name: "Công cụ miễn phí", path: "/cong-cu" },
            { name: tool.shortTitle, path: `/cong-cu/${tool.slug}` },
          ]),
        ]}
      />

      <div className="bg-background py-8 sm:py-14">
        <Container className="space-y-12">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="no-print flex flex-wrap items-center gap-1.5 text-xs font-medium text-muted-foreground sm:text-sm"
          >
            <Link href="/" className="hover:text-foreground transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <Link
              href="/cong-cu"
              className="hover:text-foreground transition-colors"
            >
              Công cụ miễn phí
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="text-foreground font-semibold truncate">
              {tool.shortTitle}
            </span>
          </nav>

          {/* Header */}
          <header className="no-print max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>
                <Wrench className="h-3.5 w-3.5 text-primary" />
                <span>{tool.categoryLabel}</span>
              </Badge>
              <Badge className="bg-primary/15 text-primary">
                {tool.badge}
              </Badge>
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {tool.title}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {tool.description}
            </p>
          </header>

          {/* Above-the-fold Interactive Tool */}
          <section aria-label={tool.shortTitle}>{children}</section>

          {/* QuizKen Bridge CTA */}
          <section className="no-print rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl space-y-3">
                <Badge className="bg-primary/15 text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Hệ sinh thái ôn thi QuizKen AI</span>
                </Badge>
                <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {ctaTitle}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {ctaDescription}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button href={ctaHref} variant="primary" size="lg" className="min-h-11">
                  <span>{ctaLabel}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  href={secondaryCtaHref}
                  variant="secondary"
                  size="lg"
                  className="min-h-11"
                >
                  {secondaryCtaLabel}
                </Button>
              </div>
            </div>
          </section>

          {/* Rich SEO / GEO Guide, Tables, Examples */}
          <section className="no-print space-y-10">{seoContent}</section>

          {/* FAQ Section */}
          <section className="no-print space-y-5">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="h-5 w-5 text-primary shrink-0" />
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Câu hỏi thường gặp
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {faqs.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-2"
                >
                  <h3 className="font-heading text-base font-bold text-foreground sm:text-lg">
                    {faq.question}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Related Tools Cross-Linking */}
          <section className="no-print space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                  Công cụ học tập miễn phí khác
                </h2>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Tiện ích 100% miễn phí, chạy trực tiếp trên trình duyệt không cần đăng nhập
                </p>
              </div>
              <Link
                href="/cong-cu"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-4 text-xs font-semibold text-foreground transition-colors hover:bg-foreground/[0.1]"
              >
                <span>Xem tất cả 6 công cụ</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTools.slice(0, 3).map((item) => (
                <Link
                  key={item.slug}
                  href={`/cong-cu/${item.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card/85 p-5 transition-colors hover:border-primary/60"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <Badge>{item.categoryLabel}</Badge>
                      <span className="text-xs font-semibold text-primary">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.shortTitle}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <span>Mở công cụ</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
