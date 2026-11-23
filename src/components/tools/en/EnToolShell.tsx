import Link from "next/link";
import { ArrowRight, ChevronRight, HelpCircle, Sparkles, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";
import { appLink, buildAbsoluteUrl, SITE } from "@/lib/site";

export type EnToolMeta = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  badge: string;
  categoryLabel: string;
  keywords: string[];
};

export const EN_TOOLS_CATALOG: EnToolMeta[] = [
  {
    slug: "pomodoro-study-timer",
    title: "Pomodoro Study Timer with Ambient Rain & White Noise",
    shortTitle: "Pomodoro Study Timer",
    description:
      "Free distraction-free Pomodoro study timer (25/5, 50/10, 15/3, custom), fullscreen focus mode, zero-bandwidth Web Audio rain & brown noise, and daily task tracker.",
    badge: "Focus + Web Audio",
    categoryLabel: "Study Productivity",
    keywords: [
      "pomodoro study timer online",
      "25 5 study timer with rain noise",
      "free focus timer for students",
      "deep work pomodoro timer",
    ],
  },
  {
    slug: "essay-word-character-counter",
    title: "Essay Word, Character & Flesch Readability Counter",
    shortTitle: "Essay Word & Readability Counter",
    description:
      "Count words, characters, sentences, paragraphs, Flesch Reading Ease score, and check Common App (650 words), IELTS (150/250), and SAT essay length targets instantly.",
    badge: "Readability + Targets",
    categoryLabel: "Academic Writing",
    keywords: [
      "essay word counter online",
      "flesch reading ease calculator",
      "common app essay word counter 650",
      "ielts writing word counter",
    ],
  },
  {
    slug: "gpa-grade-calculator",
    title: "College 4.0 GPA & Final Exam Grade Calculator",
    shortTitle: "GPA & Final Exam Calculator",
    description:
      "Calculate your US 4.0 semester and cumulative college GPA, plus find the exact score you need on your final exam to earn an A, B, or pass any weighted course.",
    badge: "4.0 GPA + Final Needed",
    categoryLabel: "Grades & GPA",
    keywords: [
      "college gpa calculator 4.0 scale",
      "what grade do i need on my final exam calculator",
      "weighted final grade calculator",
      "cumulative gpa calculator",
    ],
  },
];

export function getEnToolBySlug(slug: string): EnToolMeta | undefined {
  return EN_TOOLS_CATALOG.find((t) => t.slug === slug);
}

export type EnFaqItem = {
  question: string;
  answer: string;
};

type EnToolShellProps = {
  tool: EnToolMeta;
  faqs: EnFaqItem[];
  ctaTitle?: string;
  ctaDescription?: string;
  children: React.ReactNode;
  seoContent: React.ReactNode;
};

export function EnToolShell({
  tool,
  faqs,
  ctaTitle = "Turn Your Study Notes into Interactive AI Quizzes in Seconds",
  ctaDescription = "Upload a PDF, paste lecture notes, or enter any topic on QuizKen to generate practice questions with instant grading and step-by-step AI explanations.",
  children,
  seoContent,
}: EnToolShellProps) {
  const related = EN_TOOLS_CATALOG.filter((t) => t.slug !== tool.slug);

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    inLanguage: "en-US",
    url: buildAbsoluteUrl(`/tools/${tool.slug}`),
    description: tool.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
  };

  return (
    <>
      <JsonLd
        data={[
          softwareSchema,
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Free Study Tools", path: "/tools" },
            { name: tool.shortTitle, path: `/tools/${tool.slug}` },
          ]),
        ]}
      />

      <div className="bg-background py-8 sm:py-14">
        <Container className="space-y-12">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-muted-foreground sm:text-sm"
          >
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <Link href="/tools" className="hover:text-foreground transition-colors">
              Free Study Tools
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="text-foreground font-semibold truncate">{tool.shortTitle}</span>
          </nav>

          <header className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>
                <Wrench className="h-3.5 w-3.5 text-primary" />
                <span>{tool.categoryLabel}</span>
              </Badge>
              <Badge className="bg-primary/15 text-primary">{tool.badge}</Badge>
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {tool.title}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {tool.description}
            </p>
          </header>

          <section aria-label={tool.shortTitle}>{children}</section>

          <section className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl space-y-3">
                <Badge className="bg-primary/15 text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>QuizKen AI Study Ecosystem</span>
                </Badge>
                <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {ctaTitle}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {ctaDescription}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button href={appLink("/")} variant="primary" size="lg" className="min-h-11">
                  <span>Try QuizKen Free</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/tools" variant="secondary" size="lg" className="min-h-11">
                  All Free Tools
                </Button>
              </div>
            </div>
          </section>

          <section className="space-y-10">{seoContent}</section>

          <section className="space-y-5">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="h-5 w-5 text-primary shrink-0" />
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {faqs.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-2"
                >
                  <h3 className="font-heading text-base font-bold text-foreground sm:text-lg">
                    {faq.question}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
              More Free Study Tools
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/tools/${item.slug}`}
                  className="group rounded-2xl border border-border/70 bg-card/85 p-5 transition-colors hover:border-primary/50 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-primary">{item.categoryLabel}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition-transform" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.shortTitle}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
