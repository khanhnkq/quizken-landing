"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  Copy,
  Eye,
  EyeOff,
  Printer,
  RotateCcw,
  Shuffle,
  Wand2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type PresetId = "environment" | "ai" | "heritage";
type RuleId = "prepositions" | "articles_connectors" | "every_n" | "manual";

type Token = {
  id: number;
  raw: string;
  prefix: string;
  word: string;
  suffix: string;
  isWord: boolean;
  isNewline: boolean;
};

const PREPOSITIONS_CONJUNCTIONS = new Set([
  "in",
  "on",
  "at",
  "for",
  "with",
  "by",
  "from",
  "to",
  "of",
  "about",
  "into",
  "onto",
  "through",
  "between",
  "among",
  "during",
  "without",
  "within",
  "under",
  "over",
  "across",
  "against",
  "although",
  "though",
  "because",
  "since",
  "while",
  "whereas",
  "despite",
  "unless",
  "until",
  "before",
  "after",
  "however",
  "therefore",
  "moreover",
]);

const ARTICLES_CONNECTORS = new Set([
  "a",
  "an",
  "the",
  "and",
  "but",
  "or",
  "so",
  "yet",
  "which",
  "that",
  "who",
  "whom",
  "whose",
  "where",
  "when",
  "however",
  "therefore",
  "furthermore",
  "additionally",
  "consequently",
  "meanwhile",
  "instead",
  "otherwise",
]);

const PRESETS: Array<{ id: PresetId; label: string; title: string; text: string }> = [
  {
    id: "environment",
    label: "Environment & Green Living",
    title: "Read the following passage and fill in each blank with a suitable word.",
    text: `Transitioning to green living is no longer a passing trend, but an essential responsibility for every citizen. Simple daily habits, such as bringing reusable bags to the supermarket, turning off unused lights, and sorting household waste, can significantly reduce our carbon footprint. Moreover, many schools now encourage students to participate in tree-planting campaigns and recycle plastic bottles into useful items. Although individual actions may seem small, their collective impact on protecting ecosystems and slowing climate change is truly remarkable.`,
  },
  {
    id: "ai",
    label: "AI in Education",
    title: "Read the following passage and fill in each blank with a suitable word.",
    text: `Artificial intelligence is rapidly transforming modern classrooms around the world. Through adaptive learning platforms, teachers can analyze student performance in real time and design personalized exercises for each learner. However, educators also emphasize that technology cannot replace human empathy, mentorship, and critical thinking. Students should view AI tools as helpful assistants for practicing vocabulary or checking grammar, rather than relying on them to complete assignments without genuine effort.`,
  },
  {
    id: "heritage",
    label: "Cultural Heritage",
    title: "Read the following passage and fill in each blank with a suitable word.",
    text: `Preserving cultural heritage connects younger generations with the history and identity of their ancestors. Across Vietnam, ancient citadels, traditional craft villages, and folk music performances attract thousands of visitors every year. Because rapid urbanization can threaten fragile historic sites, local communities must balance tourism development with strict conservation rules. When young people actively learn about traditional values and share them through digital media, heritage remains vibrant and meaningful in modern society.`,
  },
];

function tokenizePassage(text: string): Token[] {
  const tokens: Token[] = [];
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  let id = 0;

  lines.forEach((line, lineIdx) => {
    const parts = line.split(/(\s+)/);
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        tokens.push({
          id: id++,
          raw: part,
          prefix: "",
          word: "",
          suffix: "",
          isWord: false,
          isNewline: false,
        });
      } else {
        const match = part.match(
          /^([^A-Za-z']*)([A-Za-z]+(?:[-'][A-Za-z]+)*)([^A-Za-z']*)$/
        );
        if (match) {
          tokens.push({
            id: id++,
            raw: part,
            prefix: match[1],
            word: match[2],
            suffix: match[3],
            isWord: true,
            isNewline: false,
          });
        } else {
          tokens.push({
            id: id++,
            raw: part,
            prefix: "",
            word: "",
            suffix: "",
            isWord: false,
            isNewline: false,
          });
        }
      }
    }
    if (lineIdx < lines.length - 1) {
      tokens.push({
        id: id++,
        raw: "\n",
        prefix: "",
        word: "",
        suffix: "",
        isWord: false,
        isNewline: true,
      });
    }
  });

  return tokens;
}

function computeAutoBlankIds(
  tokens: Token[],
  rule: RuleId,
  everyN: number
): Set<number> {
  const result = new Set<number>();
  if (rule === "manual") return result;

  const wordTokens = tokens.filter((t) => t.isWord);
  if (rule === "every_n") {
    const step = Math.max(2, Math.min(15, everyN));
    wordTokens.forEach((t, idx) => {
      if ((idx + 1) % step === 0) {
        result.add(t.id);
      }
    });
    return result;
  }

  const targetSet =
    rule === "prepositions" ? PREPOSITIONS_CONJUNCTIONS : ARTICLES_CONNECTORS;
  let lastWordIdx = -10;
  wordTokens.forEach((t, idx) => {
    const lower = t.word.toLowerCase();
    // Avoid two consecutive blanks right next to each other
    if (targetSet.has(lower) && idx - lastWordIdx >= 3 && result.size < 18) {
      result.add(t.id);
      lastWordIdx = idx;
    }
  });
  return result;
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed >>> 0;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

export function EnglishClozeGeneratorTool() {
  const [passage, setPassage] = useState<string>(PRESETS[0].text);
  const [exerciseTitle, setExerciseTitle] = useState<string>(PRESETS[0].title);
  const [rule, setRule] = useState<RuleId>("prepositions");
  const [everyN, setEveryN] = useState<number>(6);
  const [shuffleSeed, setShuffleSeed] = useState<number>(101);
  const [showWordBank, setShowWordBank] = useState<boolean>(true);
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(true);
  const [copiedWord, setCopiedWord] = useState<boolean>(false);

  const tokens = useMemo(() => tokenizePassage(passage), [passage]);

  const [blankIds, setBlankIds] = useState<Set<number>>(() =>
    computeAutoBlankIds(tokenizePassage(PRESETS[0].text), "prepositions", 6)
  );

  const applyRule = (nextPassage: string, nextRule: RuleId, nextN: number) => {
    const nextTokens = tokenizePassage(nextPassage);
    setBlankIds(computeAutoBlankIds(nextTokens, nextRule, nextN));
  };

  const handlePassageChange = (nextText: string) => {
    setPassage(nextText);
    if (rule !== "manual") {
      applyRule(nextText, rule, everyN);
    }
  };

  const handleSelectPreset = (preset: (typeof PRESETS)[number]) => {
    setPassage(preset.text);
    setExerciseTitle(preset.title);
    const nextRule: RuleId = rule === "manual" ? "prepositions" : rule;
    setRule(nextRule);
    applyRule(preset.text, nextRule, everyN);
  };

  const toggleTokenBlank = (tokenId: number) => {
    setBlankIds((prev) => {
      const next = new Set(prev);
      if (next.has(tokenId)) next.delete(tokenId);
      else next.add(tokenId);
      return next;
    });
  };

  const { blanks, numberedMap, renderedPassageText, wordBank } = useMemo(() => {
    const orderedBlanks: Array<{ num: number; tokenId: number; answer: string }> = [];
    const map = new Map<number, number>();

    for (const t of tokens) {
      if (t.isWord && blankIds.has(t.id)) {
        const num = orderedBlanks.length + 1;
        orderedBlanks.push({ num, tokenId: t.id, answer: t.word });
        map.set(t.id, num);
      }
    }

    const plainText = tokens
      .map((t) => {
        if (t.isNewline) return "\n";
        const num = map.get(t.id);
        if (num !== undefined) {
          return `${t.prefix}(${num}) ________${t.suffix}`;
        }
        return t.raw;
      })
      .join("");

    const bank = seededShuffle(
      orderedBlanks.map((b) => b.answer),
      shuffleSeed
    );

    return {
      blanks: orderedBlanks,
      numberedMap: map,
      renderedPassageText: plainText,
      wordBank: bank,
    };
  }, [tokens, blankIds, shuffleSeed]);

  const handleCopyForWord = async () => {
    const sections: string[] = [
      exerciseTitle,
      "",
      renderedPassageText,
    ];
    if (showWordBank && wordBank.length > 0) {
      sections.push("", `Word Bank: ${wordBank.join("   |   ")}`);
    }
    if (showAnswerKey && blanks.length > 0) {
      sections.push(
        "",
        "Answer Key:",
        blanks.map((b) => `${b.num}. ${b.answer}`).join("   ")
      );
    }
    try {
      await navigator.clipboard.writeText(sections.join("\n"));
      setCopiedWord(true);
      window.setTimeout(() => setCopiedWord(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 14mm;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          body > header,
          body > footer,
          .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          #cloze-print-sheet {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}</style>

      {/* Passage & Presets Input */}
      <div className="no-print rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/15 text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Chủ đề mẫu THPT 2027</span>
            </Badge>
            <span className="text-xs text-muted-foreground">
              Đã tạo <strong className="text-foreground">{blanks.length}</strong> ô trống
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className="rounded-lg border border-border/70 bg-background/70 px-2.5 py-1 text-xs font-semibold text-foreground hover:border-primary/60 cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="cloze-title"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Đề mục câu hỏi (Tiếng Anh)
          </label>
          <input
            id="cloze-title"
            type="text"
            value={exerciseTitle}
            onChange={(e) => setExerciseTitle(e.target.value)}
            className="w-full min-h-10 rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="cloze-passage"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Dán đoạn văn Tiếng Anh gốc
          </label>
          <textarea
            id="cloze-passage"
            rows={5}
            value={passage}
            onChange={(e) => handlePassageChange(e.target.value)}
            placeholder="Dán đoạn văn tiếng Anh tại đây..."
            className="w-full rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Auto-Blank Rules */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-muted-foreground inline-flex items-center gap-1">
            <Wand2 className="h-3.5 w-3.5 text-primary" />
            Quy tắc ẩn từ:
          </span>
          {(
            [
              { id: "prepositions", label: "Giới từ & Liên từ" },
              { id: "articles_connectors", label: "Mạo từ & Từ nối" },
              { id: "every_n", label: "Mỗi từ thứ N" },
              { id: "manual", label: "Chọn thủ công" },
            ] as Array<{ id: RuleId; label: string }>
          ).map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setRule(r.id);
                if (r.id !== "manual") {
                  applyRule(passage, r.id, everyN);
                }
              }}
              className={cn(
                "rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                rule === r.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/70 bg-background/70 text-foreground hover:border-primary/50"
              )}
            >
              {r.label}
            </button>
          ))}

          {rule === "every_n" && (
            <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground ml-1">
              <span>N =</span>
              <input
                type="number"
                min={3}
                max={15}
                value={everyN}
                onChange={(e) => {
                  const val = Math.max(3, Math.min(15, Number(e.target.value) || 6));
                  setEveryN(val);
                  applyRule(passage, "every_n", val);
                }}
                className="w-14 rounded-lg border border-border bg-background px-2 py-1 text-center font-mono text-xs"
              />
            </label>
          )}

          <button
            type="button"
            onClick={() => {
              setRule("manual");
              setBlankIds(new Set());
            }}
            className="ml-auto inline-flex items-center gap-1 rounded-lg border border-border/70 bg-background/70 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Bỏ chọn tất cả</span>
          </button>
        </div>
      </div>

      {/* Interactive Word Chips Editor */}
      <div className="no-print rounded-2xl border border-border/70 bg-card/85 p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-heading text-sm font-bold text-foreground">
            Bấm trực tiếp vào từng từ bên dưới để bật / tắt đục lỗ:
          </h3>
          <span className="text-xs text-muted-foreground">
            Từ được đánh dấu tím sẽ chuyển thành ô trống có số thứ tự
          </span>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/70 p-4 leading-loose flex flex-wrap items-baseline gap-y-1.5">
          {tokens.map((t) => {
            if (t.isNewline) {
              return <div key={t.id} className="basis-full h-2" />;
            }
            if (!t.isWord) {
              return (
                <span key={t.id} className="whitespace-pre text-sm text-muted-foreground">
                  {t.raw}
                </span>
              );
            }
            const blankNum = numberedMap.get(t.id);
            const isBlank = blankNum !== undefined;
            return (
              <span key={t.id} className="inline-flex items-baseline">
                {t.prefix && (
                  <span className="text-sm text-muted-foreground">{t.prefix}</span>
                )}
                <button
                  type="button"
                  onClick={() => toggleTokenBlank(t.id)}
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-sm font-medium transition-all cursor-pointer",
                    isBlank
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "hover:bg-primary/15 text-foreground"
                  )}
                >
                  {isBlank ? `(${blankNum}) ${t.word}` : t.word}
                </button>
                {t.suffix && (
                  <span className="text-sm text-muted-foreground">{t.suffix}</span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Actions Bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowWordBank((v) => !v)}
            className={cn(
              "inline-flex min-h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold cursor-pointer",
              showWordBank
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground"
            )}
          >
            {showWordBank ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            <span>Word Bank</span>
          </button>

          <button
            type="button"
            onClick={() => setShuffleSeed((s) => s + 17)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-border/70 bg-background/70 px-3 text-xs font-semibold text-foreground hover:border-primary/60 cursor-pointer"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span>Xáo trộn Word Bank</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAnswerKey((v) => !v)}
            className={cn(
              "inline-flex min-h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold cursor-pointer",
              showAnswerKey
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-border bg-background text-muted-foreground"
            )}
          >
            {showAnswerKey ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            <span>Bảng Đáp án</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyForWord}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border/70 bg-card px-4 text-xs font-bold text-foreground hover:border-primary/60 cursor-pointer"
          >
            {copiedWord ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span>{copiedWord ? "Đã copy sang Word!" : "Copy cho Microsoft Word"}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground hover:opacity-90 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>In Phiếu A4</span>
          </button>
        </div>
      </div>

      {/* Printable Output Preview */}
      <div
        id="cloze-print-sheet"
        className="rounded-2xl border border-border/70 bg-white p-6 sm:p-10 text-slate-900 shadow-sm space-y-6"
      >
        <div className="space-y-1 border-b border-slate-300 pb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            ENGLISH PRACTICE WORKSHEET • CLOZE TEST ({blanks.length} GAPS)
          </p>
          <h2 className="font-heading text-lg font-bold text-slate-950">
            {exerciseTitle}
          </h2>
        </div>

        <div className="whitespace-pre-wrap text-base leading-8 text-slate-900">
          {renderedPassageText || "Hãy nhập đoạn văn tiếng Anh ở trên."}
        </div>

        {showWordBank && wordBank.length > 0 && (
          <div className="rounded-xl border-2 border-slate-800 bg-slate-50 p-4 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Word Bank (Shuffled)
            </h3>
            <div className="flex flex-wrap gap-2">
              {wordBank.map((word, idx) => (
                <span
                  key={`${idx}-${word}`}
                  className="rounded-md border border-slate-300 bg-white px-2.5 py-1 font-medium text-sm text-slate-900"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {showAnswerKey && blanks.length > 0 && (
          <div className="border-t border-dashed border-slate-300 pt-4 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Answer Key
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
              {blanks.map((b) => (
                <div
                  key={b.num}
                  className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-900"
                >
                  <strong>{b.num}.</strong> {b.answer}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
