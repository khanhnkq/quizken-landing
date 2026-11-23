"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  CalendarDays,
  Check,
  Download,
  Plus,
  Printer,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const DAYS = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ nhật",
] as const;

type ColorTagId =
  | "none"
  | "blue"
  | "indigo"
  | "emerald"
  | "amber"
  | "rose"
  | "cyan"
  | "violet";

type ColorTagDef = {
  id: ColorTagId;
  label: string;
  cellClass: string;
  dotClass: string;
  canvasBg: string;
  canvasBorder: string;
  canvasText: string;
};

const COLOR_TAGS: ColorTagDef[] = [
  {
    id: "none",
    label: "Mặc định",
    cellClass: "bg-background/70 border-border/60 text-foreground",
    dotClass: "bg-muted-foreground/40",
    canvasBg: "#ffffff",
    canvasBorder: "#e2e8f0",
    canvasText: "#0f172a",
  },
  {
    id: "blue",
    label: "Toán / KHTN",
    cellClass: "bg-blue-500/10 border-blue-500/35 text-blue-700 dark:text-blue-300",
    dotClass: "bg-blue-500",
    canvasBg: "#eff6ff",
    canvasBorder: "#93c5fd",
    canvasText: "#1e3a8a",
  },
  {
    id: "violet",
    label: "Lý / Hóa / Sinh",
    cellClass: "bg-violet-500/10 border-violet-500/35 text-violet-700 dark:text-violet-300",
    dotClass: "bg-violet-500",
    canvasBg: "#f5f3ff",
    canvasBorder: "#c4b5fd",
    canvasText: "#4c1d95",
  },
  {
    id: "emerald",
    label: "Tiếng Anh",
    cellClass: "bg-emerald-500/10 border-emerald-500/35 text-emerald-700 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
    canvasBg: "#ecfdf5",
    canvasBorder: "#6ee7b7",
    canvasText: "#065f46",
  },
  {
    id: "amber",
    label: "Ngữ văn / KHXH",
    cellClass: "bg-amber-500/10 border-amber-500/35 text-amber-800 dark:text-amber-300",
    dotClass: "bg-amber-500",
    canvasBg: "#fffbeb",
    canvasBorder: "#fcd34d",
    canvasText: "#78350f",
  },
  {
    id: "cyan",
    label: "Tin học / ĐGNL",
    cellClass: "bg-cyan-500/10 border-cyan-500/35 text-cyan-800 dark:text-cyan-300",
    dotClass: "bg-cyan-500",
    canvasBg: "#ecfeff",
    canvasBorder: "#67e8f9",
    canvasText: "#164e63",
  },
  {
    id: "rose",
    label: "Luyện đề / Kiểm tra",
    cellClass: "bg-rose-500/10 border-rose-500/35 text-rose-700 dark:text-rose-300",
    dotClass: "bg-rose-500",
    canvasBg: "#fff1f2",
    canvasBorder: "#fda4af",
    canvasText: "#881337",
  },
  {
    id: "indigo",
    label: "Tự học / CLB",
    cellClass: "bg-indigo-500/10 border-indigo-500/35 text-indigo-700 dark:text-indigo-300",
    dotClass: "bg-indigo-500",
    canvasBg: "#eef2ff",
    canvasBorder: "#a5b4fc",
    canvasText: "#312e81",
  },
];

type ScheduleCell = {
  subject: string;
  note: string;
  color: ColorTagId;
};

type ScheduleSlot = {
  id: string;
  label: string;
  time: string;
  cells: ScheduleCell[];
};

type ScheduleData = {
  title: string;
  subtitle: string;
  slots: ScheduleSlot[];
};

function makeEmptyCell(): ScheduleCell {
  return { subject: "", note: "", color: "none" };
}

function c(subject: string, color: ColorTagId, note = ""): ScheduleCell {
  return { subject, note, color };
}

const PRESET_THPT: ScheduleData = {
  title: "THỜI KHÓA BIỂU & LỊCH ÔN THI TUẦN",
  subtitle: "Học kỳ II • Chương trình GDPT 2018 (Ca Sáng + Chiều + Tối)",
  slots: [
    {
      id: "t1",
      label: "Tiết 1–2 Sáng",
      time: "07:00 – 08:35",
      cells: [
        c("Chào cờ / Toán", "blue", "P.201"),
        c("Ngữ văn", "amber", "P.201"),
        c("Tiếng Anh", "emerald", "P.201"),
        c("Vật lý", "violet", "P.Lab"),
        c("Toán", "blue", "P.201"),
        c("Hóa học", "violet", "P.201"),
        c("Đề thi thử THPT", "rose", "90 phút"),
      ],
    },
    {
      id: "t2",
      label: "Tiết 3–4 Sáng",
      time: "08:50 – 10:25",
      cells: [
        c("Tiếng Anh", "emerald", "P.201"),
        c("Toán", "blue", "P.201"),
        c("Tin học", "cyan", "P.Máy 1"),
        c("Ngữ văn", "amber", "P.201"),
        c("Hóa học", "violet", "P.201"),
        c("Tiếng Anh", "emerald", "P.201"),
        c("Chữa lỗi sai", "indigo", "Sổ tay"),
      ],
    },
    {
      id: "t3",
      label: "Tiết 5 Sáng",
      time: "10:30 – 11:15",
      cells: [
        c("Lịch sử", "amber"),
        c("GDKT&PL", "amber"),
        c("Vật lý", "violet"),
        c("Tin học", "cyan"),
        c("Ngữ văn", "amber"),
        c("SHCN", "indigo"),
        makeEmptyCell(),
      ],
    },
    {
      id: "c1",
      label: "Ca Chiều",
      time: "14:00 – 16:45",
      cells: [
        c("Ôn Toán Chuyên đề", "blue"),
        c("Luyện Đề Anh", "emerald"),
        c("Ôn Vật lý / Hóa", "violet"),
        c("Luyện Viết Văn", "amber"),
        c("Luyện ĐGNL HSA/V-ACT", "cyan"),
        c("Thể thao / Nghỉ", "indigo"),
        c("Tổng hợp tuần", "indigo"),
      ],
    },
    {
      id: "to1",
      label: "Ca Tối Tự học",
      time: "19:30 – 21:45",
      cells: [
        c("Toán: Hàm số & XS", "blue", "25 câu"),
        c("Từ vựng & Cloze", "emerald", "Flashcard"),
        c("Lý/Hóa: Đúng-Sai", "violet", "4 ý"),
        c("Nghị luận Xã hội", "amber", "600 chữ"),
        c("Tin học & Công thức", "cyan"),
        c("Nghỉ ngơi", "none"),
        c("Chuẩn bị tuần mới", "indigo"),
      ],
    },
  ],
};

const PRESET_UNI: ScheduleData = {
  title: "LỊCH HỌC TÍN CHỈ ĐẠI HỌC & TỰ HỌC",
  subtitle: "Học kỳ 2026–2027 • Mục tiêu GPA ≥ 3.6/4.0",
  slots: [
    {
      id: "u1",
      label: "Ca 1 (Sáng)",
      time: "07:00 – 09:30",
      cells: [
        c("Giải tích 2", "blue", "B1-302"),
        c("Cấu trúc dữ liệu", "cyan", "C2-104"),
        c("Tiếng Anh B2", "emerald", "A2-201"),
        c("Xác suất Thống kê", "blue", "B1-305"),
        c("Triết học Mác-Lênin", "amber", "Hội trường A"),
        c("Lab Lập trình", "cyan", "P.Lab 3"),
        makeEmptyCell(),
      ],
    },
    {
      id: "u2",
      label: "Ca 2 (Sáng)",
      time: "09:45 – 12:15",
      cells: [
        c("Tự học Thư viện", "indigo"),
        c("Kinh tế vi mô", "amber", "B2-401"),
        makeEmptyCell(),
        c("Cơ sở dữ liệu", "cyan", "C2-202"),
        makeEmptyCell(),
        c("CLB Học thuật", "indigo"),
        makeEmptyCell(),
      ],
    },
    {
      id: "u3",
      label: "Ca 3 (Chiều)",
      time: "13:00 – 15:30",
      cells: [
        c("Vật lý đại cương", "violet", "B3-101"),
        makeEmptyCell(),
        c("Pháp luật đại cương", "amber", "A1-404"),
        makeEmptyCell(),
        c("Đồ án nhóm", "rose", "Online"),
        makeEmptyCell(),
        c("Ôn QuizKen AI", "rose", "30 câu"),
      ],
    },
    {
      id: "u4",
      label: "Ca 4 (Chiều)",
      time: "15:45 – 18:15",
      cells: [
        makeEmptyCell(),
        c("Thể chất / Gym", "emerald"),
        c("Làm bài tập tuần", "indigo"),
        c("Thể chất / Gym", "emerald"),
        makeEmptyCell(),
        makeEmptyCell(),
        makeEmptyCell(),
      ],
    },
    {
      id: "u5",
      label: "Tối Tự học",
      time: "19:30 – 22:00",
      cells: [
        c("Code & LeetCode", "cyan"),
        c("IELTS / TOEIC", "emerald"),
        c("Đọc giáo trình", "amber"),
        c("Ôn giữa kỳ / cuối kỳ", "rose"),
        c("Part-time / Dự án", "indigo"),
        c("Thư giãn", "none"),
        c("Lên kế hoạch tuần", "indigo"),
      ],
    },
  ],
};

const STORAGE_KEY = "quizken_weekly_schedule_v1";
const SCHEDULE_EVENT = "quizken-schedule-updated";

let cachedRaw: string | null = null;
let cachedSnapshot: ScheduleData = PRESET_THPT;

function isValidSchedule(data: unknown): data is ScheduleData {
  if (!data || typeof data !== "object") return false;
  const obj = data as Partial<ScheduleData>;
  return (
    typeof obj.title === "string" &&
    typeof obj.subtitle === "string" &&
    Array.isArray(obj.slots) &&
    obj.slots.length > 0
  );
}

function getScheduleSnapshot(): ScheduleData {
  if (typeof window === "undefined") return PRESET_THPT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return PRESET_THPT;
    if (raw === cachedRaw) return cachedSnapshot;
    const parsed: unknown = JSON.parse(raw);
    if (isValidSchedule(parsed)) {
      cachedRaw = raw;
      cachedSnapshot = parsed;
      return cachedSnapshot;
    }
  } catch {
    // ignore corrupted storage
  }
  return PRESET_THPT;
}

function getServerScheduleSnapshot(): ScheduleData {
  return PRESET_THPT;
}

function subscribeSchedule(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(SCHEDULE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(SCHEDULE_EVENT, handler);
  };
}

function persistSchedule(next: ScheduleData) {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(next);
    cachedRaw = serialized;
    cachedSnapshot = next;
    window.localStorage.setItem(STORAGE_KEY, serialized);
    window.dispatchEvent(new Event(SCHEDULE_EVENT));
  } catch {
    // ignore storage quota errors
  }
}

function getTagDef(id: ColorTagId): ColorTagDef {
  return COLOR_TAGS.find((t) => t.id === id) ?? COLOR_TAGS[0];
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = words[0];
  for (let i = 1; i < words.length; i++) {
    const test = `${current} ${words[i]}`;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  return lines;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function WeeklyScheduleMakerTool() {
  const schedule = useSyncExternalStore(
    subscribeSchedule,
    getScheduleSnapshot,
    getServerScheduleSnapshot
  );

  const [selectedCell, setSelectedCell] = useState<{
    slotIdx: number;
    dayIdx: number;
  } | null>(null);
  const [exportedPng, setExportedPng] = useState(false);

  const activeCellData = useMemo(() => {
    if (!selectedCell) return null;
    const slot = schedule.slots[selectedCell.slotIdx];
    const cell = slot?.cells[selectedCell.dayIdx];
    if (!slot || !cell) return null;
    return { slot, cell, ...selectedCell };
  }, [schedule, selectedCell]);

  const updateCell = (
    slotIdx: number,
    dayIdx: number,
    patch: Partial<ScheduleCell>
  ) => {
    const nextSlots = schedule.slots.map((slot, sIdx) => {
      if (sIdx !== slotIdx) return slot;
      return {
        ...slot,
        cells: slot.cells.map((cell, dIdx) =>
          dIdx === dayIdx ? { ...cell, ...patch } : cell
        ),
      };
    });
    persistSchedule({ ...schedule, slots: nextSlots });
  };

  const updateSlotMeta = (
    slotIdx: number,
    patch: Partial<Pick<ScheduleSlot, "label" | "time">>
  ) => {
    const nextSlots = schedule.slots.map((slot, sIdx) =>
      sIdx === slotIdx ? { ...slot, ...patch } : slot
    );
    persistSchedule({ ...schedule, slots: nextSlots });
  };

  const addSlot = () => {
    const newId = `slot-${Date.now()}`;
    persistSchedule({
      ...schedule,
      slots: [
        ...schedule.slots,
        {
          id: newId,
          label: `Ca ${schedule.slots.length + 1}`,
          time: "21:45 – 22:30",
          cells: DAYS.map(() => makeEmptyCell()),
        },
      ],
    });
  };

  const removeSlot = (slotIdx: number) => {
    if (schedule.slots.length <= 1) return;
    setSelectedCell(null);
    persistSchedule({
      ...schedule,
      slots: schedule.slots.filter((_, idx) => idx !== slotIdx),
    });
  };

  const handleExportPng = () => {
    const width = 2480;
    const height = 1754;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // White A4 background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    const padX = 90;
    const headerTop = 76;

    // Header Title & Subtitle
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 54px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(schedule.title || "THỜI KHÓA BIỂU TUẦN", padX, headerTop + 44);

    ctx.fillStyle = "#475569";
    ctx.font = "500 28px system-ui, -apple-system, sans-serif";
    ctx.fillText(
      schedule.subtitle || "Tạo tại www.quizken.com/cong-cu",
      padX,
      headerTop + 92
    );

    // Table geometry
    const tableTop = 215;
    const tableBottom = height - 95;
    const tableWidth = width - padX * 2;
    const timeColW = 290;
    const dayColW = (tableWidth - timeColW) / 7;
    const headerH = 74;
    const rowCount = schedule.slots.length;
    const rowH = Math.min(260, (tableBottom - tableTop - headerH) / rowCount);

    // Header row
    drawRoundedRect(ctx, padX, tableTop, tableWidth, headerH, 14);
    ctx.fillStyle = "#0f172a";
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("CA / GIỜ HỌC", padX + timeColW / 2, tableTop + headerH / 2);

    DAYS.forEach((day, dIdx) => {
      const x = padX + timeColW + dIdx * dayColW;
      ctx.fillText(day.toUpperCase(), x + dayColW / 2, tableTop + headerH / 2);
    });

    // Body rows
    schedule.slots.forEach((slot, sIdx) => {
      const y = tableTop + headerH + sIdx * rowH;

      // Time cell
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(padX, y, timeColW, rowH);
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2;
      ctx.strokeRect(padX, y, timeColW, rowH);

      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 25px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(slot.label, padX + timeColW / 2, y + rowH / 2 - 18);

      ctx.fillStyle = "#64748b";
      ctx.font = "500 22px system-ui, -apple-system, sans-serif";
      ctx.fillText(slot.time, padX + timeColW / 2, y + rowH / 2 + 20);

      // Day cells
      DAYS.forEach((_, dIdx) => {
        const cell = slot.cells[dIdx] ?? makeEmptyCell();
        const tag = getTagDef(cell.color);
        const x = padX + timeColW + dIdx * dayColW;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x, y, dayColW, rowH);
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, dayColW, rowH);

        if (cell.subject.trim()) {
          const inset = 10;
          drawRoundedRect(
            ctx,
            x + inset,
            y + inset,
            dayColW - inset * 2,
            rowH - inset * 2,
            12
          );
          ctx.fillStyle = tag.canvasBg;
          ctx.fill();
          ctx.strokeStyle = tag.canvasBorder;
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.fillStyle = tag.canvasText;
          ctx.font = "bold 24px system-ui, -apple-system, sans-serif";
          ctx.textAlign = "center";
          const lines = wrapCanvasText(ctx, cell.subject, dayColW - 44).slice(0, 3);
          const lineHeight = 30;
          const totalTextH =
            lines.length * lineHeight + (cell.note.trim() ? 30 : 0);
          let textY = y + (rowH - totalTextH) / 2 + 16;

          lines.forEach((line) => {
            ctx.fillText(line, x + dayColW / 2, textY);
            textY += lineHeight;
          });

          if (cell.note.trim()) {
            ctx.fillStyle = "#475569";
            ctx.font = "500 20px system-ui, -apple-system, sans-serif";
            ctx.fillText(cell.note.trim().slice(0, 22), x + dayColW / 2, textY + 6);
          }
        }
      });
    });

    // Footer
    ctx.fillStyle = "#64748b";
    ctx.font = "500 22px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(
      "QuizKen.com • Công cụ tạo Thời khóa biểu & Lịch ôn thi miễn phí",
      width - padX,
      height - 40
    );

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "thoi-khoa-bieu-tuan-quizken.png";
    link.click();

    setExportedPng(true);
    window.setTimeout(() => setExportedPng(false), 2000);
  };

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 8mm;
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
          #schedule-print-sheet {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            background: #ffffff !important;
          }
        }
      `}</style>

      {/* Toolbar & Presets */}
      <div className="no-print rounded-2xl border border-border/70 bg-card/85 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/15 text-primary">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Tự động lưu trên trình duyệt</span>
            </Badge>
            <button
              type="button"
              onClick={() => {
                setSelectedCell(null);
                persistSchedule(PRESET_THPT);
              }}
              className="rounded-xl border border-border/70 bg-background/70 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/60 cursor-pointer"
            >
              Mẫu THPT (Sáng + Chiều + Tối)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedCell(null);
                persistSchedule(PRESET_UNI);
              }}
              className="rounded-xl border border-border/70 bg-background/70 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/60 cursor-pointer"
            >
              Mẫu Tín chỉ Đại học
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportPng}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 text-xs font-bold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
            >
              {exportedPng ? (
                <Check className="h-4 w-4" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>{exportedPng ? "Đã tải ảnh PNG!" : "Tải ảnh PNG sắc nét"}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>In A4 Ngang</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label
              htmlFor="schedule-title"
              className="text-xs font-semibold text-muted-foreground"
            >
              Tiêu đề Thời khóa biểu
            </label>
            <input
              id="schedule-title"
              type="text"
              value={schedule.title}
              onChange={(e) =>
                persistSchedule({ ...schedule, title: e.target.value })
              }
              className="w-full min-h-10 rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="schedule-subtitle"
              className="text-xs font-semibold text-muted-foreground"
            >
              Lớp / Mục tiêu / Ghi chú phụ
            </label>
            <input
              id="schedule-subtitle"
              type="text"
              value={schedule.subtitle}
              onChange={(e) =>
                persistSchedule({ ...schedule, subtitle: e.target.value })
              }
              className="w-full min-h-10 rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Selected Cell Editor */}
      {activeCellData && (
        <div className="no-print rounded-2xl border border-primary/35 bg-primary/5 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-heading text-sm font-bold text-foreground">
              Chỉnh sửa ô:{" "}
              <span className="text-primary">
                {DAYS[activeCellData.dayIdx]} • {activeCellData.slot.label}
              </span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  updateCell(activeCellData.slotIdx, activeCellData.dayIdx, makeEmptyCell())
                }
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Xóa ô</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedCell(null)}
                className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground cursor-pointer"
              >
                Xong
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={activeCellData.cell.subject}
              onChange={(e) =>
                updateCell(activeCellData.slotIdx, activeCellData.dayIdx, {
                  subject: e.target.value,
                })
              }
              placeholder="Tên môn học / Nội dung ôn tập..."
              className="w-full min-h-10 rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground outline-none focus:border-primary"
            />
            <input
              type="text"
              value={activeCellData.cell.note}
              onChange={(e) =>
                updateCell(activeCellData.slotIdx, activeCellData.dayIdx, {
                  note: e.target.value,
                })
              }
              placeholder="Phòng học / Ghi chú (VD: P.201, 30 câu)..."
              className="w-full min-h-10 rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">
              Thẻ màu môn:
            </span>
            {COLOR_TAGS.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() =>
                  updateCell(activeCellData.slotIdx, activeCellData.dayIdx, {
                    color: tag.id,
                  })
                }
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                  activeCellData.cell.color === tag.id
                    ? "border-primary bg-primary/15 text-foreground"
                    : "border-border/70 bg-background/70 text-muted-foreground hover:text-foreground"
                )}
              >
                <span className={cn("h-2.5 w-2.5 rounded-full", tag.dotClass)} />
                <span>{tag.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Printable Timetable Sheet */}
      <div
        id="schedule-print-sheet"
        className="rounded-2xl border border-border/70 bg-card/85 p-4 sm:p-6 space-y-4 overflow-x-auto"
      >
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
              {schedule.title}
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {schedule.subtitle}
            </p>
          </div>
          <p className="no-print text-xs text-muted-foreground">
            Nhấn vào ô bất kỳ để sửa môn học & màu sắc
          </p>
        </div>

        <table className="w-full min-w-[760px] border-collapse text-xs">
          <thead>
            <tr className="bg-foreground text-background">
              <th className="w-36 rounded-tl-xl px-3 py-2.5 text-left font-bold">
                Ca / Giờ học
              </th>
              {DAYS.map((day, idx) => (
                <th
                  key={day}
                  className={cn(
                    "px-2 py-2.5 text-center font-bold",
                    idx === DAYS.length - 1 && "rounded-tr-xl"
                  )}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedule.slots.map((slot, sIdx) => (
              <tr key={slot.id} className="border-b border-border/60 align-top">
                <td className="bg-foreground/[0.03] p-2 border-r border-border/60">
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={slot.label}
                      onChange={(e) =>
                        updateSlotMeta(sIdx, { label: e.target.value })
                      }
                      aria-label={`Tên ca ${sIdx + 1}`}
                      className="w-full bg-transparent font-bold text-foreground outline-none focus:underline"
                    />
                    <input
                      type="text"
                      value={slot.time}
                      onChange={(e) =>
                        updateSlotMeta(sIdx, { time: e.target.value })
                      }
                      aria-label={`Giờ học ca ${sIdx + 1}`}
                      className="w-full bg-transparent font-mono text-[11px] text-muted-foreground outline-none focus:underline"
                    />
                    {schedule.slots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSlot(sIdx)}
                        className="no-print inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Xóa hàng</span>
                      </button>
                    )}
                  </div>
                </td>

                {DAYS.map((_, dIdx) => {
                  const cell = slot.cells[dIdx] ?? makeEmptyCell();
                  const tag = getTagDef(cell.color);
                  const isSelected =
                    selectedCell?.slotIdx === sIdx &&
                    selectedCell?.dayIdx === dIdx;

                  return (
                    <td key={dIdx} className="p-1.5 border-r border-border/40 last:border-r-0">
                      <button
                        type="button"
                        onClick={() => setSelectedCell({ slotIdx: sIdx, dayIdx: dIdx })}
                        className={cn(
                          "w-full min-h-[62px] rounded-xl border p-2 text-center transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer",
                          cell.subject.trim()
                            ? tag.cellClass
                            : "border-dashed border-border/50 bg-transparent text-muted-foreground/50 hover:border-primary/50",
                          isSelected && "ring-2 ring-primary ring-offset-1"
                        )}
                      >
                        {cell.subject.trim() ? (
                          <>
                            <span className="font-semibold leading-snug">
                              {cell.subject}
                            </span>
                            {cell.note.trim() && (
                              <span className="text-[10px] opacity-80">
                                {cell.note}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="no-print text-[11px]">+ Thêm</span>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="no-print flex justify-start pt-1">
          <button
            type="button"
            onClick={addSlot}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-background/70 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/60 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm ca học mới</span>
          </button>
        </div>
      </div>
    </div>
  );
}
