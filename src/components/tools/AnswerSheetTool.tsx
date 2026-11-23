"use client";

import { useState } from "react";
import { Printer, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const SHORT_SYMBOLS = ["-", ",", ...DIGITS];

export function AnswerSheetTool() {
  const [orgTitle, setOrgTitle] = useState<string>("TRƯỜNG THPT CHUYÊN / SỞ GD&ĐT");
  const [examTitle, setExamTitle] = useState<string>(
    "PHIẾU TRẢ LỜI TRẮC NGHIỆM CHUẨN BỘ GD&ĐT 2027",
  );
  const [part1Count, setPart1Count] = useState<number>(12);
  const [part2Count, setPart2Count] = useState<number>(4);
  const [part3Count, setPart3Count] = useState<number>(6);
  const [showStudentInfo, setShowStudentInfo] = useState<boolean>(true);
  const [showSbdGrid, setShowSbdGrid] = useState<boolean>(true);

  const handlePresetMath = () => {
    setPart1Count(12);
    setPart2Count(4);
    setPart3Count(6);
  };

  const handlePresetScience = () => {
    setPart1Count(18);
    setPart2Count(4);
    setPart3Count(6);
  };

  const handlePreset40 = () => {
    setPart1Count(40);
    setPart2Count(0);
    setPart3Count(0);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const part1Columns = part1Count > 30 ? 4 : part1Count > 20 ? 3 : 2;
  const part1PerCol = Math.ceil(part1Count / Math.max(1, part1Columns));

  return (
    <div className="space-y-6">
      {/* Global Print Styles (Zero extra npm packages) */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 6mm;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
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
          #a4-sheet-wrapper {
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            border: none !important;
            overflow: visible !important;
          }
          #a4-answer-sheet {
            width: 100% !important;
            max-width: none !important;
            min-height: auto !important;
            box-shadow: none !important;
            border: 1px solid #000 !important;
            margin: 0 !important;
            padding: 7mm !important;
          }
        }
      `}</style>

      {/* Configuration Panel */}
      <div className="no-print rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              Tùy chỉnh cấu trúc phiếu tô (Chuẩn GDPT 2018)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePresetMath}
              className="min-h-10 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
            >
              Mẫu Toán (12-4-6)
            </button>
            <button
              type="button"
              onClick={handlePresetScience}
              className="min-h-10 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
            >
              Mẫu Lý/Hóa/Sinh (18-4-6)
            </button>
            <button
              type="button"
              onClick={handlePreset40}
              className="min-h-10 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
            >
              Mẫu 40 câu MCQ
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 font-heading text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>In / Lưu PDF A4</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="block text-xs font-semibold text-foreground">
              Tên Trường / Đơn vị tổ chức
            </span>
            <input
              type="text"
              value={orgTitle}
              onChange={(e) => setOrgTitle(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="space-y-1.5">
            <span className="block text-xs font-semibold text-foreground">
              Tiêu đề phiếu / Kỳ thi
            </span>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-foreground">Phần I: Nhiều lựa chọn</span>
              <Badge className="bg-primary/15 text-primary">{part1Count} câu</Badge>
            </div>
            <input
              type="range"
              aria-label="Số câu Phần I"
              min={12}
              max={40}
              step={1}
              value={part1Count}
              onChange={(e) => setPart1Count(parseInt(e.target.value, 10))}
              className="h-2 w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-foreground">Phần II: Đúng / Sai (a-d)</span>
              <Badge className="bg-primary/15 text-primary">{part2Count} câu</Badge>
            </div>
            <input
              type="range"
              aria-label="Số câu Phần II"
              min={0}
              max={8}
              step={1}
              value={part2Count}
              onChange={(e) => setPart2Count(parseInt(e.target.value, 10))}
              className="h-2 w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-foreground">Phần III: Trả lời ngắn</span>
              <Badge className="bg-primary/15 text-primary">{part3Count} câu</Badge>
            </div>
            <input
              type="range"
              aria-label="Số câu Phần III"
              min={0}
              max={8}
              step={1}
              value={part3Count}
              onChange={(e) => setPart3Count(parseInt(e.target.value, 10))}
              className="h-2 w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <label className="inline-flex min-h-10 items-center gap-2 cursor-pointer text-foreground">
            <input
              type="checkbox"
              checked={showStudentInfo}
              onChange={(e) => setShowStudentInfo(e.target.checked)}
              className="h-4 w-4 accent-emerald-500"
            />
            <span>Hiển thị khung Họ tên / Lớp / Chữ ký</span>
          </label>
          <label className="inline-flex min-h-10 items-center gap-2 cursor-pointer text-foreground">
            <input
              type="checkbox"
              checked={showSbdGrid}
              onChange={(e) => setShowSbdGrid(e.target.checked)}
              className="h-4 w-4 accent-emerald-500"
            />
            <span>Hiển thị ô tô Số báo danh (SBD) &amp; Mã đề</span>
          </label>
          <button
            type="button"
            onClick={handlePresetMath}
            className="inline-flex min-h-10 items-center gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer ml-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Khôi phục mặc định</span>
          </button>
        </div>
      </div>

      {/* Live A4 Preview Sheet */}
      <div
        id="a4-sheet-wrapper"
        className="overflow-x-auto rounded-2xl border border-border/70 bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06] sm:p-6"
      >
        <div
          id="a4-answer-sheet"
          className="relative mx-auto w-[794px] bg-white p-6 text-black shadow-sm border border-neutral-300"
          style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          {/* 4 Corner OMR Alignment Markers */}
          <span className="absolute left-2.5 top-2.5 h-3 w-3 bg-black" aria-hidden />
          <span className="absolute right-2.5 top-2.5 h-3 w-3 bg-black" aria-hidden />
          <span className="absolute bottom-2.5 left-2.5 h-3 w-3 bg-black" aria-hidden />
          <span className="absolute bottom-2.5 right-2.5 h-3 w-3 bg-black" aria-hidden />

          {/* Header */}
          <div className="border-b-2 border-black pb-2 text-center">
            <div className="text-[11px] font-bold uppercase tracking-wide">
              {orgTitle || "TRƯỜNG THPT"}
            </div>
            <div className="mt-0.5 text-[15px] font-extrabold uppercase">
              {examTitle || "PHIẾU TRẢ LỜI TRẮC NGHIỆM"}
            </div>
          </div>

          {/* Top Row: Student Info + SBD + Exam Code */}
          {(showStudentInfo || showSbdGrid) && (
            <div className="mt-3 grid grid-cols-12 gap-3 border-b border-neutral-400 pb-3">
              {showStudentInfo && (
                <div
                  className={cn(
                    "space-y-1.5 border border-black p-2.5 text-[11px]",
                    showSbdGrid ? "col-span-6" : "col-span-12",
                  )}
                >
                  <div>1. Kỳ thi / Môn: ..............................................................</div>
                  <div>2. Ngày thi: ...................................................................</div>
                  <div>3. Họ và tên thí sinh: ....................................................</div>
                  <div>4. Lớp / Phòng thi: ........................................................</div>
                  <div className="grid grid-cols-2 gap-2 pt-1.5">
                    <div className="border border-neutral-500 p-1.5 text-center text-[10px]">
                      <div className="font-bold">ĐIỂM BÀI THI</div>
                      <div className="h-7" />
                    </div>
                    <div className="border border-neutral-500 p-1.5 text-center text-[10px]">
                      <div className="font-bold">CHỮ KÝ GIÁM THỊ</div>
                      <div className="h-7" />
                    </div>
                  </div>
                </div>
              )}

              {showSbdGrid && (
                <div
                  className={cn(
                    "grid grid-cols-12 gap-2",
                    showStudentInfo ? "col-span-6" : "col-span-12",
                  )}
                >
                  {/* SBD 6 columns */}
                  <div className="col-span-8 border border-black p-1.5">
                    <div className="text-center text-[10px] font-bold uppercase">
                      Số báo danh
                    </div>
                    <div className="mt-1 grid grid-cols-6 gap-0.5">
                      {Array.from({ length: 6 }).map((_, colIdx) => (
                        <div key={colIdx} className="flex flex-col items-center gap-[2px]">
                          <div className="mb-0.5 h-4 w-5 border border-black" />
                          {DIGITS.map((d) => (
                            <span
                              key={d}
                              className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-black text-[8px] leading-none"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mã đề 3 columns */}
                  <div className="col-span-4 border border-black p-1.5">
                    <div className="text-center text-[10px] font-bold uppercase">
                      Mã đề
                    </div>
                    <div className="mt-1 grid grid-cols-3 gap-0.5">
                      {Array.from({ length: 3 }).map((_, colIdx) => (
                        <div key={colIdx} className="flex flex-col items-center gap-[2px]">
                          <div className="mb-0.5 h-4 w-4 border border-black" />
                          {DIGITS.map((d) => (
                            <span
                              key={d}
                              className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-black text-[8px] leading-none"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PART I: MCQ */}
          {part1Count > 0 && (
            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between bg-neutral-100 px-2 py-1 text-[11px] font-bold uppercase border border-black">
                <span>PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn (A, B, C, D)</span>
                <span>{part1Count} câu</span>
              </div>
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: `repeat(${part1Columns}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: part1Columns }).map((_, colIdx) => {
                  const start = colIdx * part1PerCol;
                  const end = Math.min(part1Count, start + part1PerCol);
                  if (start >= part1Count) return null;

                  return (
                    <div
                      key={colIdx}
                      className="border border-black p-2 space-y-1"
                    >
                      <div className="grid grid-cols-5 text-center text-[9px] font-bold border-b border-neutral-300 pb-0.5">
                        <span>Câu</span>
                        <span>A</span>
                        <span>B</span>
                        <span>C</span>
                        <span>D</span>
                      </div>
                      {Array.from({ length: end - start }).map((__, rowOffset) => {
                        const qNum = start + rowOffset + 1;
                        return (
                          <div
                            key={qNum}
                            className="grid grid-cols-5 items-center text-center text-[9px]"
                          >
                            <span className="font-bold">{qNum}</span>
                            {["A", "B", "C", "D"].map((opt) => (
                              <span
                                key={opt}
                                className="mx-auto flex h-3.5 w-3.5 items-center justify-center rounded-full border border-black text-[8px]"
                              >
                                {opt}
                              </span>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PART II: TRUE / FALSE */}
          {part2Count > 0 && (
            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between bg-neutral-100 px-2 py-1 text-[11px] font-bold uppercase border border-black">
                <span>PHẦN II. Câu trắc nghiệm Đúng / Sai (Mỗi câu 4 ý a, b, c, d)</span>
                <span>{part2Count} câu</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: part2Count }).map((_, idx) => (
                  <div key={idx} className="border border-black p-1.5">
                    <div className="mb-1 flex items-center justify-between border-b border-neutral-300 pb-0.5 text-[10px] font-bold">
                      <span>Câu {idx + 1}</span>
                      <span className="flex gap-2 pr-1 text-[9px]">
                        <span>Đ</span>
                        <span>S</span>
                      </span>
                    </div>
                    <div className="space-y-1">
                      {["a", "b", "c", "d"].map((sub) => (
                        <div
                          key={sub}
                          className="flex items-center justify-between px-1 text-[9px]"
                        >
                          <span className="font-bold">{sub})</span>
                          <div className="flex gap-2">
                            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-black text-[7.5px]">
                              Đ
                            </span>
                            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-black text-[7.5px]">
                              S
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PART III: SHORT ANSWER */}
          {part3Count > 0 && (
            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between bg-neutral-100 px-2 py-1 text-[11px] font-bold uppercase border border-black">
                <span>PHẦN III. Câu trắc nghiệm trả lời ngắn (Ghi đáp số và tô ô tương ứng)</span>
                <span>{part3Count} câu</span>
              </div>
              <div
                className={cn(
                  "grid gap-2",
                  part3Count <= 4 ? "grid-cols-4" : "grid-cols-4",
                )}
              >
                {Array.from({ length: part3Count }).map((_, idx) => (
                  <div key={idx} className="border border-black p-1.5">
                    <div className="text-center text-[10px] font-bold mb-1">
                      Câu {idx + 1}
                    </div>
                    <div className="grid grid-cols-4 gap-0.5">
                      {Array.from({ length: 4 }).map((__, colIdx) => (
                        <div key={colIdx} className="flex flex-col items-center gap-[1.5px]">
                          <div className="mb-0.5 h-4 w-4 border border-black" />
                          {SHORT_SYMBOLS.map((sym) => {
                            // Standard MOET sheet: minus only in col 0, comma only in cols 1..2
                            const disabled =
                              (sym === "-" && colIdx !== 0) ||
                              (sym === "," && (colIdx === 0 || colIdx === 3));
                            return (
                              <span
                                key={sym}
                                className={cn(
                                  "flex h-3 w-3 items-center justify-center rounded-full text-[7.5px] leading-none",
                                  disabled
                                    ? "opacity-15 border border-dashed border-neutral-400"
                                    : "border border-black",
                                )}
                              >
                                {sym}
                              </span>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-2.5 flex items-center justify-between text-[9px] text-neutral-600">
            <span>Tạo miễn phí tại QuizKen (www.quizken.com/cong-cu)</span>
            <span>Lưu ý: Tô kín ô bằng bút chì đen 2B, không tẩy xóa rách giấy.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
