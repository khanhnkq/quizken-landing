"use client";

import { useMemo, useState } from "react";
import { Printer, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type FlashcardItem = {
  id: number;
  front: string;
  back: string;
};

const SAMPLE_CARDS = [
  "ubiquitous | có mặt ở khắp mọi nơi",
  "resilient | kiên cường, phục hồi nhanh",
  "mitigate | giảm nhẹ, làm dịu bớt",
  "profound | sâu sắc, uyên thâm",
  "ambiguous | mơ hồ, hai nghĩa",
  "pragmatic | thực tế, thực dụng",
  "coherent | mạch lạc, chặt chẽ",
  "inevitable | tất yếu, không thể tránh khỏi",
  "scrutinize | xem xét kỹ lưỡng",
  "sustainable | bền vững, lâu dài",
].join("\n");

function parseCards(raw: string): FlashcardItem[] {
  return raw
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, idx) => {
      const sepMatch = line.match(/^(.+?)(?:\t|\s*\|\s*|\s+-\s+)(.+)$/);
      if (sepMatch) {
        return {
          id: idx + 1,
          front: sepMatch[1].trim(),
          back: sepMatch[2].trim(),
        };
      }
      return { id: idx + 1, front: line, back: "(Chưa có mặt sau)" };
    });
}

function mirrorRowsForBack<T>(items: T[], cols = 2): Array<T | null> {
  const padded: Array<T | null> = [...items];
  while (padded.length % cols !== 0) padded.push(null);

  const mirrored: Array<T | null> = [];
  for (let i = 0; i < padded.length; i += cols) {
    const row = padded.slice(i, i + cols).reverse();
    mirrored.push(...row);
  }
  return mirrored;
}

export function PrintableFlashcardTool() {
  const [rawText, setRawText] = useState<string>(SAMPLE_CARDS);
  const [perPage, setPerPage] = useState<8 | 10>(8);
  const [includeBackPage, setIncludeBackPage] = useState<boolean>(true);
  const [deckTitle, setDeckTitle] = useState<string>("Bộ Flashcard Ôn Thi");

  const cards = useMemo(() => parseCards(rawText), [rawText]);

  const pages = useMemo(() => {
    const out: FlashcardItem[][] = [];
    for (let i = 0; i < cards.length; i += perPage) {
      out.push(cards.slice(i, i + perPage));
    }
    return out;
  }, [cards, perPage]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Clean A4 Print Rules */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
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
          #flashcard-print-area {
            padding: 0 !important;
            border: none !important;
            background: transparent !important;
          }
          .a4-flashcard-page {
            width: 100% !important;
            max-width: none !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            page-break-after: always;
            break-after: page;
          }
          .a4-flashcard-page:last-child {
            page-break-after: auto;
            break-after: auto;
          }
        }
      `}</style>

      {/* Input & Config */}
      <div className="no-print grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-bold text-foreground">
              1. Dán danh sách thẻ (Mặt trước | Mặt sau)
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRawText(SAMPLE_CARDS)}
                className="inline-flex min-h-10 items-center gap-1 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Mẫu 10 thẻ IELTS</span>
              </button>
              <button
                type="button"
                onClick={() => setRawText("")}
                className="inline-flex min-h-10 items-center gap-1 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Xóa</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Mỗi thẻ 1 dòng, ngăn cách mặt trước &amp; mặt sau bằng dấu{" "}
            <code className="rounded bg-foreground/[0.08] px-1 text-foreground">|</code>,{" "}
            <code className="rounded bg-foreground/[0.08] px-1 text-foreground">Tab</code> (copy từ Excel/Quizlet), hoặc{" "}
            <code className="rounded bg-foreground/[0.08] px-1 text-foreground">-</code>.
          </p>

          <textarea
            aria-label="Danh sách flashcard"
            rows={9}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={"từ vựng | nghĩa tiếng Việt"}
            className="w-full rounded-xl border border-border bg-background p-3.5 font-mono text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">
                2. Tùy chọn dàn trang A4
              </h2>
              <Badge className="bg-primary/15 text-primary">
                {cards.length} thẻ • {pages.length * (includeBackPage ? 2 : 1)} trang A4
              </Badge>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-foreground">
                Tên bộ thẻ (hiển thị nhỏ ở đầu trang)
              </span>
              <input
                type="text"
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground"
              />
            </label>

            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-foreground">
                Số thẻ trên mỗi trang A4
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPerPage(8)}
                  className={cn(
                    "min-h-11 rounded-xl px-3 text-xs font-semibold cursor-pointer",
                    perPage === 8
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/[0.05] text-muted-foreground hover:text-foreground",
                  )}
                >
                  8 thẻ / trang (2×4 lớn)
                </button>
                <button
                  type="button"
                  onClick={() => setPerPage(10)}
                  className={cn(
                    "min-h-11 rounded-xl px-3 text-xs font-semibold cursor-pointer",
                    perPage === 10
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/[0.05] text-muted-foreground hover:text-foreground",
                  )}
                >
                  10 thẻ / trang (2×5 vừa)
                </button>
              </div>
            </div>

            <label className="flex min-h-11 items-center justify-between gap-3 rounded-xl bg-foreground/[0.04] px-3.5 py-2 text-xs font-semibold text-foreground cursor-pointer dark:bg-foreground/[0.06]">
              <span>In kèm trang Mặt sau (tự đảo cột Trái ↔ Phải)</span>
              <input
                type="checkbox"
                checked={includeBackPage}
                onChange={(e) => setIncludeBackPage(e.target.checked)}
                className="h-5 w-5 accent-emerald-500 cursor-pointer"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            disabled={cards.length === 0}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-heading text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>In / Lưu PDF A4 ngay</span>
          </button>
        </div>
      </div>

      {/* Live A4 Pages Preview */}
      <div
        id="flashcard-print-area"
        className="overflow-x-auto rounded-2xl border border-border/70 bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06] sm:p-6 space-y-6"
      >
        {pages.length === 0 ? (
          <div className="rounded-xl bg-card p-8 text-center text-sm text-muted-foreground">
            Nhập ít nhất 1 dòng thẻ để xem trước bản in A4.
          </div>
        ) : (
          pages.map((pageCards, pageIdx) => {
            const backSlots = mirrorRowsForBack(pageCards, 2);
            const paddedFront: Array<FlashcardItem | null> = [...pageCards];
            while (paddedFront.length < perPage) paddedFront.push(null);

            while (backSlots.length < perPage) {
              backSlots.push(null);
            }

            return (
              <div key={pageIdx} className="space-y-6">
                {/* Front Sheet */}
                <div className="a4-flashcard-page mx-auto w-[760px] bg-white p-6 text-black border border-neutral-300 shadow-sm">
                  <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase text-neutral-500">
                    <span>{deckTitle} — MẶT TRƯỚC (Trang {pageIdx + 1})</span>
                    <span>Cắt theo đường nét đứt</span>
                  </div>
                  <div
                    className={cn(
                      "grid grid-cols-2 border-t border-l border-dashed border-neutral-400",
                    )}
                  >
                    {paddedFront.map((card, slotIdx) => (
                      <div
                        key={`f-${pageIdx}-${slotIdx}`}
                        className={cn(
                          "flex flex-col items-center justify-center border-r border-b border-dashed border-neutral-400 p-4 text-center",
                          perPage === 8 ? "h-[235px]" : "h-[188px]",
                        )}
                      >
                        {card && (
                          <>
                            <span className="mb-1 text-[10px] font-bold text-neutral-400">
                              #{card.id}
                            </span>
                            <div className="text-lg font-extrabold leading-snug text-black break-words">
                              {card.front}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Back Sheet (Mirrored Columns) */}
                {includeBackPage && (
                  <div className="a4-flashcard-page mx-auto w-[760px] bg-white p-6 text-black border border-neutral-300 shadow-sm">
                    <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase text-neutral-500">
                      <span>
                        {deckTitle} — MẶT SAU ĐÃ ĐẢO CỘT (Trang {pageIdx + 1})
                      </span>
                      <span>In lật cạnh dài (Flip on Long Edge)</span>
                    </div>
                    <div className="grid grid-cols-2 border-t border-l border-dashed border-neutral-400">
                      {backSlots.map((card, slotIdx) => (
                        <div
                          key={`b-${pageIdx}-${slotIdx}`}
                          className={cn(
                            "flex flex-col items-center justify-center border-r border-b border-dashed border-neutral-400 p-4 text-center",
                            perPage === 8 ? "h-[235px]" : "h-[188px]",
                          )}
                        >
                          {card && (
                            <>
                              <span className="mb-1 text-[10px] font-bold text-neutral-400">
                                #{card.id} (Đáp án)
                              </span>
                              <div className="text-base font-semibold leading-snug text-neutral-800 break-words">
                                {card.back}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
