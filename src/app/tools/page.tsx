import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, Globe, Sparkles, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, breadcrumbSchema, collectionPageSchema } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { EN_TOOLS_CATALOG } from "@/components/tools/en/EnToolShell";

export const metadata: Metadata = buildMetadata({
  title: "Free Online Study Tools for Students: Pomodoro, GPA & Essay Counter",
  description:
    "100% free browser-based student study tools by QuizKen: Pomodoro study timer with rain/white noise, essay word & Flesch readability counter, and US 4.0 GPA & final exam grade calculator.",
  path: "/tools",
  keywords: [
    "free online study tools for students",
    "pomodoro timer online",
    "essay word counter readability",
    "college gpa final exam grade calculator",
  ],
});

export default function EnglishToolsHubPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Free Study Tools", path: "/tools" },
          ]),
          collectionPageSchema({
            name: "QuizKen Free Online Study Tools",
            description:
              "Client-side Pomodoro timer, Essay Word & Readability Counter, and 4.0 GPA & Final Exam Grade Calculator.",
            path: "/tools",
          }),
        ]}
      />

      <div className="bg-background py-10 sm:py-16">
        <Container className="space-y-12">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-muted-foreground sm:text-sm"
          >
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="font-semibold text-foreground">Free Study Tools</span>
          </nav>

          <header className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>
                <Wrench className="h-3.5 w-3.5 text-primary" />
                <span>No Sign-Up Required • 100% Free</span>
              </Badge>
              <Badge className="bg-primary/15 text-primary">
                <Globe className="h-3.5 w-3.5" />
                <span>English Edition</span>
              </Badge>
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Free Online Study &amp; Productivity Tools for Students
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Fast, zero-clutter study utilities running right in your browser: stay focused with a Pomodoro timer, check essay readability &amp; word limits, and calculate your GPA or required final exam grade.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button href={appLink("/")} size="lg" className="min-h-11 font-heading font-bold">
                <Sparkles className="h-4 w-4" />
                <span>Create AI Quizzes Free</span>
              </Button>
              <Button href="/cong-cu" variant="secondary" size="lg" className="min-h-11">
                <span>Vietnamese Tools Hub (/cong-cu)</span>
              </Button>
            </div>
          </header>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {EN_TOOLS_CATALOG.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card/85 p-6 transition-colors hover:border-primary/50"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge className="text-xs">{tool.categoryLabel}</Badge>
                    <span className="text-xs font-semibold text-primary">{tool.badge}</span>
                  </div>
                  <h2 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {tool.shortTitle}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3 text-sm font-semibold text-primary">
                  <span>Open Tool</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </section>
        </Container>
      </div>
    </>
  );
}
