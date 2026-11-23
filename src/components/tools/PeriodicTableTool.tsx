"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Atom,
  ArrowRight,
} from "lucide-react";
import {
  PERIODIC_ELEMENTS,
  ELEMENT_CATEGORY_META,
  type ChemicalElement,
  type ElementCategory,
} from "@/lib/periodicTableData";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { appLink } from "@/lib/site";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  element: ChemicalElement;
  promptType: "mass" | "symbol" | "z";
  questionText: string;
  options: string[];
  correctIndex: number;
}

function buildMiniQuiz(): QuizQuestion[] {
  // Prioritize commonly tested GDPT 2018 elements (Z <= 36 + Ag, Ba, Au, Hg, Pb, I, Br)
  const pool = PERIODIC_ELEMENTS.filter(
    (e) =>
      e.z <= 36 || [35, 47, 53, 56, 79, 80, 82].includes(e.z)
  );
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);

  return shuffled.map((el, idx) => {
    const mode: QuizQuestion["promptType"] =
      idx % 3 === 0 ? "mass" : idx % 3 === 1 ? "symbol" : "z";

    const distractors = pool
      .filter((other) => other.z !== el.z)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    if (mode === "mass") {
      const correct = `${Math.round(el.atomicMass)}`;
      const opts = [
        correct,
        ...distractors.map((d) => `${Math.round(d.atomicMass)}`),
      ];
      // Ensure unique option strings
      const unique = Array.from(new Set(opts));
      while (unique.length < 4) {
        unique.push(`${Math.round(el.atomicMass) + unique.length * 3}`);
      }
      const mixed = unique.slice(0, 4).sort(() => Math.random() - 0.5);
      return {
        element: el,
        promptType: mode,
        questionText: `Nguyên tử khối (làm tròn) của nguyên tố ${el.nameVi} (${el.symbol}) là bao nhiêu?`,
        options: mixed,
        correctIndex: mixed.indexOf(correct),
      };
    }

    if (mode === "symbol") {
      const correct = el.symbol;
      const opts = [correct, ...distractors.map((d) => d.symbol)].sort(
        () => Math.random() - 0.5
      );
      return {
        element: el,
        promptType: mode,
        questionText: `Ký hiệu hóa học của nguyên tố ${el.nameVi} (Z = ${el.z}) là gì?`,
        options: opts,
        correctIndex: opts.indexOf(correct),
      };
    }

    const correct = `Z = ${el.z}`;
    const opts = [correct, ...distractors.map((d) => `Z = ${d.z}`)].sort(
      () => Math.random() - 0.5
    );
    return {
      element: el,
      promptType: mode,
      questionText: `Số hiệu nguyên tử (Z) của nguyên tố ${el.nameVi} (${el.symbol}) bằng bao nhiêu?`,
      options: opts,
      correctIndex: opts.indexOf(correct),
    };
  });
}

export function PeriodicTableTool() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | ElementCategory
  >("all");
  const [selectedElement, setSelectedElement] = useState<ChemicalElement>(
    PERIODIC_ELEMENTS[25] // Fe (Iron) default highlight
  );

  // Mini quiz state (initialized lazily when opened or on first render)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() =>
    buildMiniQuiz()
  );
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const matchingZSet = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const set = new Set<number>();
    for (const el of PERIODIC_ELEMENTS) {
      const catOk =
        selectedCategory === "all" || el.category === selectedCategory;
      const searchOk =
        !q ||
        el.symbol.toLowerCase().includes(q) ||
        el.nameEn.toLowerCase().includes(q) ||
        el.nameVi.toLowerCase().includes(q) ||
        String(el.z) === q;
      if (catOk && searchOk) set.add(el.z);
    }
    return set;
  }, [searchQuery, selectedCategory]);

  const isFiltering =
    searchQuery.trim().length > 0 || selectedCategory !== "all";

  const quizCorrectCount = useMemo(() => {
    if (!quizSubmitted) return 0;
    return quizQuestions.reduce(
      (acc, q, i) => (quizAnswers[i] === q.correctIndex ? acc + 1 : acc),
      0
    );
  }, [quizSubmitted, quizQuestions, quizAnswers]);

  const handleRestartQuiz = () => {
    setQuizQuestions(buildMiniQuiz());
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const selectedCatMeta = ELEMENT_CATEGORY_META[selectedElement.category];

  return (
    <div className="space-y-8">
      {/* Search & Category Filter */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm nguyên tố theo Z (VD: 26), ký hiệu (Fe) hoặc tên (Sắt, Oxygen)..."
              aria-label="Tìm nguyên tố hóa học"
              className="h-11 w-full rounded-xl border border-border/70 bg-background pr-4 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="text-xs font-medium text-muted-foreground">
            Khớp{" "}
            <strong className="text-foreground">{matchingZSet.size}</strong> /
            118 nguyên tố
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "min-h-9 cursor-pointer rounded-xl px-3 py-1 text-xs font-semibold transition-colors",
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/[0.05] text-muted-foreground hover:text-foreground"
            )}
          >
            Tất cả (118)
          </button>
          {(
            Object.entries(ELEMENT_CATEGORY_META) as Array<
              [ElementCategory, (typeof ELEMENT_CATEGORY_META)[ElementCategory]]
            >
          ).map(([key, meta]) => (
            <button
              key={key}
              type="button"
              onClick={() =>
                setSelectedCategory((prev) => (prev === key ? "all" : key))
              }
              className={cn(
                "min-h-9 cursor-pointer rounded-xl px-2.5 py-1 text-xs font-semibold transition-all",
                meta.chipClass,
                selectedCategory === key
                  ? "ring-2 ring-primary"
                  : "opacity-85 hover:opacity-100"
              )}
            >
              {meta.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Element Inspector + 18-Column Periodic Table */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* 18-Column Interactive Table */}
        <div className="rounded-2xl border border-border/70 bg-card/85 p-4 sm:p-5 overflow-x-auto">
          <div
            className="grid min-w-[880px] gap-1.5"
            style={{
              gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
              gridTemplateRows: "repeat(10, auto)",
            }}
          >
            {PERIODIC_ELEMENTS.map((el) => {
              const meta = ELEMENT_CATEGORY_META[el.category];
              const isMatch = matchingZSet.has(el.z);
              const isSelected = selectedElement.z === el.z;

              return (
                <button
                  key={el.z}
                  type="button"
                  onClick={() => setSelectedElement(el)}
                  style={{
                    gridRowStart: el.gridRow,
                    gridColumnStart: el.gridCol,
                  }}
                  title={`${el.z} - ${el.nameVi} (${el.symbol})`}
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center rounded-lg border p-1 text-center transition-all min-h-[52px]",
                    meta.cellClass,
                    isSelected && "ring-2 ring-primary scale-[1.04] z-10",
                    isFiltering && !isMatch && "opacity-20"
                  )}
                >
                  <span className="text-[9px] font-semibold leading-none opacity-80">
                    {el.z}
                  </span>
                  <span className="mt-0.5 font-heading text-xs font-bold leading-none sm:text-sm">
                    {el.symbol}
                  </span>
                  <span className="mt-0.5 max-w-full truncate text-[8px] leading-none opacity-75">
                    {Math.round(el.atomicMass)}
                  </span>
                </button>
              );
            })}

            {/* Placeholder markers for Lanthanides / Actinides in Group 3 */}
            <div
              style={{ gridRowStart: 6, gridColumnStart: 3 }}
              className="flex min-h-[52px] items-center justify-center rounded-lg border border-dashed border-orange-500/40 bg-orange-500/5 text-[10px] font-bold text-orange-600 dark:text-orange-300"
            >
              57–71
            </div>
            <div
              style={{ gridRowStart: 7, gridColumnStart: 3 }}
              className="flex min-h-[52px] items-center justify-center rounded-lg border border-dashed border-fuchsia-500/40 bg-fuchsia-500/5 text-[10px] font-bold text-fuchsia-600 dark:text-fuchsia-300"
            >
              89–103
            </div>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Mẹo trên điện thoại: Vuốt ngang bảng để xem đầy đủ 18 nhóm nguyên tố,
            chạm vào từng ô để xem cấu hình electron và số oxi hóa.
          </p>
        </div>

        {/* Sticky Element Detail Panel */}
        <aside className="h-fit rounded-2xl border border-border/70 bg-card/85 p-5 lg:sticky lg:top-24 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div
              className={cn(
                "flex h-20 w-20 flex-col items-center justify-center rounded-2xl border p-2",
                selectedCatMeta.cellClass
              )}
            >
              <span className="text-xs font-bold opacity-80">
                Z = {selectedElement.z}
              </span>
              <span className="font-heading text-3xl font-extrabold leading-none">
                {selectedElement.symbol}
              </span>
              <span className="mt-1 text-[10px] font-semibold">
                {selectedElement.atomicMass}
              </span>
            </div>

            <div className="flex-1 space-y-1.5">
              <Badge className={cn("text-[11px]", selectedCatMeta.chipClass)}>
                {selectedCatMeta.label}
              </Badge>
              <h2 className="font-heading text-xl font-bold text-foreground">
                {selectedElement.nameVi}
              </h2>
              <p className="text-xs text-muted-foreground">
                IUPAC: {selectedElement.nameEn}
              </p>
            </div>
          </div>

          <div className="space-y-2.5 rounded-xl bg-foreground/[0.04] p-4 text-xs dark:bg-foreground/[0.06]">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Nguyên tử khối (M)</span>
              <strong className="text-foreground">
                {selectedElement.atomicMass} amu (≈{" "}
                {Math.round(selectedElement.atomicMass)})
              </strong>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Chu kỳ / Nhóm</span>
              <strong className="text-foreground">
                Chu kỳ {selectedElement.period} • Nhóm {selectedElement.group}
              </strong>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Cấu hình electron</span>
              <strong className="font-mono text-primary">
                {selectedElement.electronConfig}
              </strong>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Độ âm điện (Pauling)</span>
              <strong className="text-foreground">
                {selectedElement.electronegativity ?? "—"}
              </strong>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Số oxi hóa phổ biến</span>
              <strong className="text-foreground">
                {selectedElement.oxidationStates}
              </strong>
            </div>
          </div>

          <Button
            href={appLink(
              `/?topic=${encodeURIComponent(
                `Hóa học nguyên tố ${selectedElement.nameVi}`
              )}`
            )}
            size="sm"
            className="w-full justify-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Tạo Quiz Hóa học bằng AI
          </Button>
        </aside>
      </div>

      {/* Built-in Mini Quiz */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-7 space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Atom className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                Mini Quiz: Nhớ Nhanh Nguyên Tố &amp; Nguyên Tử Khối
              </h2>
              <p className="text-xs text-muted-foreground">
                5 câu trắc nghiệm ngẫu nhiên giúp ôn thuộc lòng ký hiệu và khối
                lượng mol thường gặp
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleRestartQuiz}
            className="min-h-10 gap-1.5 self-start sm:self-center"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Đổi 5 câu khác
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {quizQuestions.map((q, qIdx) => {
            const chosen = quizAnswers[qIdx];
            return (
              <div
                key={`${q.element.z}-${q.promptType}-${qIdx}`}
                className="rounded-xl bg-foreground/[0.04] p-4 space-y-3 dark:bg-foreground/[0.06]"
              >
                <div className="text-sm font-semibold text-foreground">
                  Câu {qIdx + 1}: {q.questionText}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = chosen === oIdx;
                    const isRight = oIdx === q.correctIndex;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={quizSubmitted}
                        onClick={() =>
                          setQuizAnswers((prev) => ({
                            ...prev,
                            [qIdx]: oIdx,
                          }))
                        }
                        className={cn(
                          "flex min-h-10 cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs font-bold transition-colors",
                          quizSubmitted && isRight
                            ? "bg-primary text-primary-foreground"
                            : quizSubmitted && isSelected && !isRight
                            ? "bg-destructive text-destructive-foreground"
                            : isSelected
                            ? "bg-primary/20 text-primary ring-1 ring-primary"
                            : "bg-background/80 text-foreground hover:bg-background",
                          quizSubmitted && "cursor-default"
                        )}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isRight && (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        {quizSubmitted && isSelected && !isRight && (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {!quizSubmitted ? (
            <Button
              type="button"
              onClick={() => setQuizSubmitted(true)}
              className="min-h-11 gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Chấm điểm Mini Quiz ({Object.keys(quizAnswers).length}/5)
            </Button>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-primary/15 px-3 py-1.5 text-sm text-primary">
                Kết quả: {quizCorrectCount}/5 câu đúng
              </Badge>
              <Button
                href="/de-thi/hoa-hoc/on-thi-thpt"
                variant="secondary"
                size="sm"
                className="min-h-10 gap-1.5"
              >
                Luyện đề Hóa học THPT
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
