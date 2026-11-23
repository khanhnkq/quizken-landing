import type { Metadata } from "next";
import { BookOpen, Clock, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { EnToolShell, getEnToolBySlug, type EnFaqItem } from "@/components/tools/en/EnToolShell";
import { EnPomodoroTimer } from "@/components/tools/en/EnPomodoroTimer";

const SLUG = "pomodoro-study-timer";
const tool = getEnToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/tools/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: EnFaqItem[] = [
  {
    question: "How does the 25/5 Pomodoro technique improve exam focus?",
    answer:
      "Working in short, distraction-free 25-minute sprints followed by a 5-minute break prevents mental fatigue and lowers the barrier to starting difficult study sessions.",
  },
  {
    question: "Do the ambient rain and brown noise sounds stream from a server?",
    answer:
      "No. All ambient soundscapes (Soft Rain, White Noise, Brown Noise) are synthesized directly in your browser using the Web Audio API with zero network streaming.",
  },
  {
    question: "When should I use 50/10 Deep Work instead of 25/5?",
    answer:
      "Use 50/10 Deep Work when solving full-length practice exams, coding assignments, or drafting long essays where a 25-minute block feels too short.",
  },
  {
    question: "Are my tasks and completed sessions saved privately?",
    answer:
      "Yes. Your daily focus session counter and task checklist are stored locally in your browser via localStorage and never leave your device.",
  },
];

export default function EnPomodoroTimerPage() {
  return (
    <EnToolShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Lock In What You Just Studied with Active Recall"
      ctaDescription="Finish your Pomodoro sprint by taking a quick 5-question AI practice quiz generated from your notes on QuizKen."
      seoContent={
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Combining Pomodoro Sprints with Active Recall
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Passive rereading creates an illusion of competence. Pair a focused 25-minute or 50-minute Pomodoro timer with a 3-minute self-test immediately afterward to maximize memory retention before midterms and finals.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Sample 2-Hour Study Block
                </h3>
              </div>
              <ul className="space-y-1.5 text-sm text-foreground list-disc pl-5">
                <li><strong>Block 1 (25/5):</strong> Read chapter summary &amp; outline key concepts.</li>
                <li><strong>Block 2 (25/5):</strong> Solve practice problems without looking at solutions.</li>
                <li><strong>Block 3 (50/10):</strong> Complete a timed mock test &amp; log mistakes.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Choosing the Right Interval
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Preset</th>
                      <th className="py-2 pr-3 font-semibold">Split</th>
                      <th className="py-2 font-semibold text-primary">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr><td className="py-2 pr-3 font-bold">Sprint</td><td className="py-2 pr-3">15m / 3m</td><td className="py-2">Flashcards &amp; beating procrastination</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">Classic</td><td className="py-2 pr-3">25m / 5m</td><td className="py-2">Reading, problem sets, lecture review</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">Deep Work</td><td className="py-2 pr-3">50m / 10m</td><td className="py-2">Full mock exams &amp; essay writing</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <EnPomodoroTimer />
    </EnToolShell>
  );
}
