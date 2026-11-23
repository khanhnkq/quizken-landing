import type { Metadata } from "next";
import { BookOpen, Calculator, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { EnToolShell, getEnToolBySlug, type EnFaqItem } from "@/components/tools/en/EnToolShell";
import { EnGpaFinalCalculator } from "@/components/tools/en/EnGpaFinalCalculator";

const SLUG = "gpa-grade-calculator";
const tool = getEnToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/tools/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: EnFaqItem[] = [
  {
    question: "How is US 4.0 semester and cumulative GPA calculated?",
    answer:
      "Multiply each course's credit hours by its grade point value (A = 4.0, A- = 3.7, B+ = 3.3, etc.), sum those quality points across all courses, and divide by total credit hours attempted.",
  },
  {
    question: "What is the formula for 'What grade do I need on my final exam?'",
    answer:
      "Required Final = (Target Course Grade − Current Grade × (1 − Final Weight)) / Final Weight. For example, if you have an 86.5% going into a 25% final and want a 90%, you need (90 − 86.5 × 0.75) / 0.25 = 100.5%.",
  },
  {
    question: "Can my required final exam score be over 100%?",
    answer:
      "Yes. If the calculator shows a number above 100%, reaching that target letter grade mathematically requires extra credit or a grading curve on the final exam.",
  },
  {
    question: "Do A+ and A both count as 4.0 in standard college GPA?",
    answer:
      "At most US colleges and universities, both A and A+ carry 4.00 grade points per credit hour.",
  },
];

export default function EnGpaGradeCalculatorPage() {
  return (
    <EnToolShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Ace Your Final Exam with AI-Generated Practice Tests"
      ctaDescription="Upload your syllabus or lecture slides to QuizKen to practice active-recall questions and boost your final exam score."
      seoContent={
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2.5">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Formulas for College GPA &amp; Required Final Exam Score
              </h2>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-4 font-mono text-xs leading-relaxed text-foreground dark:bg-foreground/[0.06] sm:text-sm space-y-2">
              <div><strong>Semester GPA</strong> = Σ (Course Credits × Grade Points) / Σ Course Credits</div>
              <div><strong>Final Exam Needed</strong> = [Target % − Current % × (1 − Weight)] / Weight</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Worked Final Exam Example
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Suppose your current course grade is <strong>86.5%</strong>, your final exam is worth <strong>25%</strong>, and your target for an A- is <strong>90%</strong>:
              </p>
              <ul className="space-y-1.5 text-sm text-foreground list-disc pl-5">
                <li>Coursework contribution: 86.5 × 0.75 = <strong>64.875%</strong>.</li>
                <li>Remaining needed from final: 90 − 64.875 = <strong>25.125%</strong>.</li>
                <li>Score needed on final: 25.125 / 0.25 = <strong>100.5%</strong> (would require extra credit, whereas a B+ at 87% needs only 88.5%).</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Standard US 4.0 Grade Scale
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Letter</th>
                      <th className="py-2 pr-3 font-semibold">GPA Points</th>
                      <th className="py-2 font-semibold text-primary">Typical %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr><td className="py-2 pr-3 font-bold">A / A+</td><td className="py-2 pr-3">4.0</td><td className="py-2">93 – 100%</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">A-</td><td className="py-2 pr-3">3.7</td><td className="py-2">90 – 92%</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">B+</td><td className="py-2 pr-3">3.3</td><td className="py-2">87 – 89%</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">B</td><td className="py-2 pr-3">3.0</td><td className="py-2">83 – 86%</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">C</td><td className="py-2 pr-3">2.0</td><td className="py-2">73 – 76%</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <EnGpaFinalCalculator />
    </EnToolShell>
  );
}
