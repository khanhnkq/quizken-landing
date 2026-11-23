import type { Metadata } from "next";
import { BookOpen, FileText, Table2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { EnToolShell, getEnToolBySlug, type EnFaqItem } from "@/components/tools/en/EnToolShell";
import { EnWordCounter } from "@/components/tools/en/EnWordCounter";

const SLUG = "essay-word-character-counter";
const tool = getEnToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/tools/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: EnFaqItem[] = [
  {
    question: "What is the Flesch Reading Ease score and what score should I aim for?",
    answer:
      "Flesch Reading Ease rates text from 0 to 100 based on average sentence length and syllables per word. Scores between 50 and 70 are ideal for college admissions essays and IELTS Writing, balancing clear flow with academic vocabulary.",
  },
  {
    question: "What is the strict word limit for the Common App personal statement?",
    answer:
      "The Common App personal essay allows between 250 and 650 words. Most admissions counselors recommend staying between 500 and 650 words.",
  },
  {
    question: "How many words are required for IELTS Writing Task 1 and Task 2?",
    answer:
      "IELTS Writing Task 1 requires at least 150 words, while Task 2 requires at least 250 words. Aiming for 165–185 words (Task 1) and 265–295 words (Task 2) keeps you safely above the minimum without sacrificing proofreading time.",
  },
  {
    question: "Why check the Top 5 Repeated Words panel?",
    answer:
      "Overusing the same noun or verb lowers lexical variety. Filtering out common stop words highlights content words you may want to vary with synonyms.",
  },
];

export default function EnWordCounterPage() {
  return (
    <EnToolShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Build Academic Vocabulary Faster with QuizKen"
      ctaDescription="Practice high-frequency IELTS, SAT, and academic vocabulary using QuizKen's adaptive flashcards and AI-generated quizzes."
      seoContent={
        <div className="space-y-8">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2.5">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                How Flesch Reading Ease Is Calculated
              </h2>
            </div>
            <div className="rounded-xl bg-foreground/[0.04] p-4 font-mono text-xs leading-relaxed text-foreground dark:bg-foreground/[0.06] sm:text-sm">
              Flesch Reading Ease = 206.835 − 1.015 × (Total Words / Total Sentences) − 84.6 × (Total Syllables / Total Words)
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Quick Editing Checklist Before Submission
                </h3>
              </div>
              <ul className="space-y-1.5 text-sm text-foreground list-disc pl-5">
                <li>Verify your word count meets the exact prompt minimum and maximum.</li>
                <li>Check repeated words to replace vague nouns/verbs with precise alternatives.</li>
                <li>Break overly long 35+ word sentences to keep Flesch score in a readable range.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Flesch Score Reference Table
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Score</th>
                      <th className="py-2 font-semibold text-primary">Readability Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr><td className="py-2 pr-3 font-bold">70 – 100</td><td className="py-2">Plain, easy-to-read English</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">50 – 69</td><td className="py-2 font-semibold">Standard Academic / Common App / IELTS</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">30 – 49</td><td className="py-2">College / Research Paper</td></tr>
                    <tr><td className="py-2 pr-3 font-bold">0 – 29</td><td className="py-2 text-muted-foreground">Very dense / technical prose</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <EnWordCounter />
    </EnToolShell>
  );
}
