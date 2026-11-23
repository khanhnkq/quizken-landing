"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, Search, Sparkles, Volume2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import {
  IRREGULAR_VERBS,
  IRREGULAR_VERB_GROUPS,
  type IrregularVerbGroup,
  type IrregularVerbItem,
} from "@/lib/irregularVerbsData";
import { cn } from "@/lib/utils";

type Accent = "en-US" | "en-GB";

const QUIZ_POOL = IRREGULAR_VERBS.filter((v) => v.group !== "AAA" && v.v1 !== "be").slice(0, 40);

function buildQuizSet(seedOffset: number): IrregularVerbItem[] {
  const result: IrregularVerbItem[] = [];
  for (let i = 0; i < 10; i++) {
    const idx = (i * 4 + seedOffset) % QUIZ_POOL.length;
    result.push(QUIZ_POOL[idx]);
  }
  return result;
}

export function IrregularVerbsTool() {
  const [tab, setTab] = useState<"lookup" | "quiz">("lookup");
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState<"ALL" | IrregularVerbGroup>("ALL");
  const [accent, setAccent] = useState<Accent>("en-US");

  // Quick 10-question recall quiz state
  const [quizSeed, setQuizSeed] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { v2: string; v3: string }>>({});
  const [checkedQuiz, setCheckedQuiz] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return IRREGULAR_VERBS.filter((item) => {
      if (groupFilter !== "ALL" && item.group !== groupFilter) return false;
      if (!q) return true;
      return (
        item.v1.toLowerCase().includes(q) ||
        item.v2.toLowerCase().includes(q) ||
        item.v3.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q)
      );
    });
  }, [query, groupFilter]);

  const quizItems = useMemo(() => buildQuizSet(quizSeed), [quizSeed]);

  const quizScore = useMemo(() => {
    if (!checkedQuiz) return 0;
    let count = 0;
    for (const item of quizItems) {
      const a = answers[item.v1];
      if (
        a &&
        a.v2.trim().toLowerCase() === item.v2.toLowerCase() &&
        a.v3.trim().toLowerCase() === item.v3.toLowerCase()
      ) {
        count++;
      }
    }
    return count;
  }, [checkedQuiz, quizItems, answers]);

  const speakForms = (item: IrregularVerbItem) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const text = `${item.v1}, ${item.v2.replace("/", " or ")}, ${item.v3}`;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = accent;
      utter.rate = 0.88;
      window.speechSynthesis.speak(utter);
    } catch {
      // Ignore speech synthesis errors on unsupported browsers
    }
  };

  const handleRestartQuiz = () => {
    setQuizSeed((s) => (s + 3) % QUIZ_POOL.length);
    setAnswers({});
    setCheckedQuiz(false);
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/85 p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTab("lookup")}
            className={cn(
              "min-h-11 rounded-xl px-4 text-sm font-bold transition-colors cursor-pointer",
              tab === "lookup"
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.1]",
            )}
          >
            Tra cứu {IRREGULAR_VERBS.length} động từ + Phát âm IPA
          </button>
          <button
            type="button"
            onClick={() => setTab("quiz")}
            className={cn(
              "min-h-11 rounded-xl px-4 text-sm font-bold transition-colors cursor-pointer",
              tab === "quiz"
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.1]",
            )}
          >
            Luyện nhớ nhanh 10 câu (Active Recall)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Giọng đọc:</span>
          {(["en-US", "en-GB"] as Accent[]).map((acc) => (
            <button
              key={acc}
              type="button"
              onClick={() => setAccent(acc)}
              className={cn(
                "min-h-11 rounded-xl px-3 text-xs font-bold cursor-pointer",
                accent === acc
                  ? "bg-primary/15 text-primary border border-primary/40"
                  : "bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.1]",
              )}
            >
              {acc === "en-US" ? "US" : "UK"}
            </button>
          ))}
        </div>
      </div>

      {tab === "lookup" ? (
        <div className="space-y-4 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                aria-label="Tìm kiếm động từ bất quy tắc"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm theo V1, V2, V3 hoặc nghĩa tiếng Việt (VD: write, brought, mua...)"
                className="min-h-11 w-full rounded-xl border border-border/70 bg-background pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(["ALL", "AAA", "ABB", "ABA", "ABC", "AAB"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGroupFilter(g)}
                  className={cn(
                    "min-h-11 rounded-xl px-3 text-xs font-bold cursor-pointer",
                    groupFilter === g
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.1]",
                  )}
                >
                  {g === "ALL" ? `Tất cả (${IRREGULAR_VERBS.length})` : g}
                </button>
              ))}
            </div>
          </div>

          {groupFilter !== "ALL" && (
            <p className="text-xs font-medium text-primary">
              Nhóm {groupFilter}: {IRREGULAR_VERB_GROUPS[groupFilter]}
            </p>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/70 text-muted-foreground">
                  <th className="py-2.5 pr-3 font-semibold">V1 (Nguyên mẫu)</th>
                  <th className="py-2.5 pr-3 font-semibold">V2 (Quá khứ đơn)</th>
                  <th className="py-2.5 pr-3 font-semibold">V3 (Quá khứ phân từ)</th>
                  <th className="py-2.5 pr-3 font-semibold">Phiên âm IPA</th>
                  <th className="py-2.5 pr-3 font-semibold">Nghĩa tiếng Việt</th>
                  <th className="py-2.5 font-semibold text-right">Nghe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((item) => (
                  <tr key={item.v1} className="hover:bg-foreground/[0.02]">
                    <td className="py-2.5 pr-3 font-heading font-bold text-primary">{item.v1}</td>
                    <td className="py-2.5 pr-3 font-semibold text-foreground">{item.v2}</td>
                    <td className="py-2.5 pr-3 font-semibold text-foreground">{item.v3}</td>
                    <td className="py-2.5 pr-3 font-mono text-xs text-muted-foreground">{item.ipa}</td>
                    <td className="py-2.5 pr-3 text-foreground">{item.meaning}</td>
                    <td className="py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => speakForms(item)}
                        aria-label={`Phát âm ${item.v1}`}
                        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl bg-foreground/[0.05] text-primary hover:bg-primary/15 cursor-pointer"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Không tìm thấy động từ phù hợp. Hãy thử từ khóa khác.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <Badge className="bg-primary/15 text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Điền V2 &amp; V3 của 10 động từ ngẫu nhiên</span>
              </Badge>
            </div>
            <button
              type="button"
              onClick={handleRestartQuiz}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Đổi bộ 10 câu mới
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {quizItems.map((item, idx) => {
              const userAns = answers[item.v1] ?? { v2: "", v3: "" };
              const v2Ok = userAns.v2.trim().toLowerCase() === item.v2.toLowerCase();
              const v3Ok = userAns.v3.trim().toLowerCase() === item.v3.toLowerCase();
              const allOk = v2Ok && v3Ok;

              return (
                <div
                  key={item.v1}
                  className={cn(
                    "rounded-xl border p-4 space-y-2.5",
                    checkedQuiz
                      ? allOk
                        ? "border-emerald-500/40 bg-emerald-500/10"
                        : "border-destructive/40 bg-destructive/5"
                      : "border-border/60 bg-foreground/[0.03]",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading text-base font-bold text-foreground">
                      {idx + 1}. {item.v1}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        ({item.meaning})
                      </span>
                    </span>
                    {checkedQuiz &&
                      (allOk ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive shrink-0" />
                      ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      aria-label={`V2 của ${item.v1}`}
                      placeholder="Nhập V2..."
                      value={userAns.v2}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [item.v1]: { v2: e.target.value, v3: prev[item.v1]?.v3 ?? "" },
                        }))
                      }
                      className="min-h-11 rounded-lg border border-border/70 bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      aria-label={`V3 của ${item.v1}`}
                      placeholder="Nhập V3..."
                      value={userAns.v3}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [item.v1]: { v2: prev[item.v1]?.v2 ?? "", v3: e.target.value },
                        }))
                      }
                      className="min-h-11 rounded-lg border border-border/70 bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  {checkedQuiz && !allOk && (
                    <p className="text-xs font-semibold text-primary">
                      Đáp án chuẩn: {item.v1} – {item.v2} – {item.v3} ({item.ipa})
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCheckedQuiz(true)}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-heading font-bold text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              Chấm điểm 10 câu
            </button>
            {checkedQuiz && (
              <p className="font-heading text-lg font-bold text-primary">
                Kết quả: {quizScore} / 10 câu đúng hoàn toàn
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
