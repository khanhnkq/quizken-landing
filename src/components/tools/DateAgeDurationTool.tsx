"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  Calendar,
  CalendarDays,
  CalendarPlus,
  Clock,
  GraduationCap,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type ActiveTab = "diff" | "age" | "addsub";
type DurationUnit = "days" | "weeks" | "months" | "years";

type SimpleDate = {
  year: number;
  month: number; // 1..12
  day: number; // 1..31
};

const VI_WEEKDAYS = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

function getTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseIsoDate(iso: string): SimpleDate | null {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (
    utc.getUTCFullYear() !== year ||
    utc.getUTCMonth() !== month - 1 ||
    utc.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

function toUtcMs(d: SimpleDate): number {
  return Date.UTC(d.year, d.month - 1, d.day);
}

function fromUtcMs(ms: number): SimpleDate {
  const u = new Date(ms);
  return {
    year: u.getUTCFullYear(),
    month: u.getUTCMonth() + 1,
    day: u.getUTCDate(),
  };
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function formatViDate(d: SimpleDate): string {
  return `${String(d.day).padStart(2, "0")}/${String(d.month).padStart(2, "0")}/${d.year}`;
}

function getViWeekday(d: SimpleDate): string {
  const idx = new Date(toUtcMs(d)).getUTCDay();
  return VI_WEEKDAYS[idx] ?? "";
}

function addCalendarMonths(d: SimpleDate, deltaMonths: number): SimpleDate {
  const zeroBasedMonth = d.year * 12 + (d.month - 1) + deltaMonths;
  const targetYear = Math.floor(zeroBasedMonth / 12);
  const targetMonth = ((zeroBasedMonth % 12) + 12) % 12 + 1;
  const maxDay = daysInMonth(targetYear, targetMonth);
  return {
    year: targetYear,
    month: targetMonth,
    day: Math.min(d.day, maxDay),
  };
}

function computeCalendarDiff(
  start: SimpleDate,
  end: SimpleDate,
): { years: number; months: number; days: number } {
  let years = end.year - start.year;
  let months = end.month - start.month;
  let days = end.day - start.day;

  if (days < 0) {
    const prevMonth = end.month === 1 ? 12 : end.month - 1;
    const prevYear = end.month === 1 ? end.year - 1 : end.year;
    days += daysInMonth(prevYear, prevMonth);
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }
  return { years, months, days };
}

/**
 * O(1) exact weekday breakdown over [startMs, endMs] (inclusive or exclusive).
 */
function countWeekdaysInSpan(
  startMs: number,
  totalDays: number,
): { monToFri: number; monToSat: number; sundays: number } {
  if (totalDays <= 0) return { monToFri: 0, monToSat: 0, sundays: 0 };
  const fullWeeks = Math.floor(totalDays / 7);
  const rem = totalDays % 7;

  let monToFri = fullWeeks * 5;
  let monToSat = fullWeeks * 6;
  let sundays = fullWeeks;

  const startDow = new Date(startMs).getUTCDay();
  for (let i = 0; i < rem; i += 1) {
    const dow = (startDow + i) % 7;
    if (dow === 0) {
      sundays += 1;
    } else {
      monToSat += 1;
      if (dow !== 6) {
        monToFri += 1;
      }
    }
  }
  return { monToFri, monToSat, sundays };
}

export function DateAgeDurationTool() {
  const todayIso = useMemo(() => getTodayIso(), []);

  const [activeTab, setActiveTab] = useState<ActiveTab>("diff");

  // Tab 1: Date Difference
  const [startDateStr, setStartDateStr] = useState<string>(todayIso);
  const [endDateStr, setEndDateStr] = useState<string>("2027-06-26");
  const [includeEndDate, setIncludeEndDate] = useState<boolean>(false);

  // Tab 2: Exact Age
  const [birthDateStr, setBirthDateStr] = useState<string>("2009-09-15");
  const [asOfDateStr, setAsOfDateStr] = useState<string>(todayIso);

  // Tab 3: Add/Subtract Date
  const [baseDateStr, setBaseDateStr] = useState<string>(todayIso);
  const [opType, setOpType] = useState<"add" | "sub">("add");
  const [amountStr, setAmountStr] = useState<string>("12");
  const [unit, setUnit] = useState<DurationUnit>("weeks");

  // Tab 1 computations
  const diffResult = useMemo(() => {
    const d1 = parseIsoDate(startDateStr);
    const d2 = parseIsoDate(endDateStr);
    if (!d1 || !d2) return null;

    const ms1 = toUtcMs(d1);
    const ms2 = toUtcMs(d2);
    const swapped = ms1 > ms2;
    const from = swapped ? d2 : d1;
    const to = swapped ? d1 : d2;
    const fromMs = Math.min(ms1, ms2);
    const toMs = Math.max(ms1, ms2);

    const rawDays = Math.round((toMs - fromMs) / 86400000);
    const totalDays = includeEndDate ? rawDays + 1 : rawDays;
    const weeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;
    const calendar = computeCalendarDiff(from, to);
    const breakdown = countWeekdaysInSpan(fromMs, totalDays);

    return {
      from,
      to,
      swapped,
      totalDays,
      weeks,
      remDays,
      calendar,
      breakdown,
    };
  }, [startDateStr, endDateStr, includeEndDate]);

  // Tab 2 computations
  const ageResult = useMemo(() => {
    const birth = parseIsoDate(birthDateStr);
    const asOf = parseIsoDate(asOfDateStr);
    if (!birth || !asOf) return null;

    const birthMs = toUtcMs(birth);
    const asOfMs = toUtcMs(asOf);
    if (birthMs > asOfMs) {
      return { invalidOrder: true as const };
    }

    const age = computeCalendarDiff(birth, asOf);
    const totalDaysLived = Math.round((asOfMs - birthMs) / 86400000);
    const totalWeeksLived = Math.floor(totalDaysLived / 7);
    const totalMonthsLived = age.years * 12 + age.months;

    // Next birthday calculation
    const buildBirthdayInYear = (yr: number): SimpleDate => ({
      year: yr,
      month: birth.month,
      day: Math.min(birth.day, daysInMonth(yr, birth.month)),
    });

    let nextBday = buildBirthdayInYear(asOf.year);
    if (toUtcMs(nextBday) <= asOfMs) {
      nextBday = buildBirthdayInYear(asOf.year + 1);
    }
    const isBirthdayToday =
      birth.month === asOf.month &&
      Math.min(birth.day, daysInMonth(asOf.year, birth.month)) === asOf.day;
    const daysToNextBirthday = isBirthdayToday
      ? 0
      : Math.round((toUtcMs(nextBday) - asOfMs) / 86400000);

    return {
      invalidOrder: false as const,
      birth,
      asOf,
      age,
      totalDaysLived,
      totalWeeksLived,
      totalMonthsLived,
      nextBday,
      isBirthdayToday,
      daysToNextBirthday,
    };
  }, [birthDateStr, asOfDateStr]);

  // Tab 3 computations
  const addSubResult = useMemo(() => {
    const base = parseIsoDate(baseDateStr);
    const rawAmt = Number(amountStr);
    if (!base || !Number.isFinite(rawAmt) || rawAmt < 0) return null;
    const amount = Math.floor(rawAmt);
    const sign = opType === "add" ? 1 : -1;

    let target: SimpleDate;
    if (unit === "days") {
      target = fromUtcMs(toUtcMs(base) + sign * amount * 86400000);
    } else if (unit === "weeks") {
      target = fromUtcMs(toUtcMs(base) + sign * amount * 7 * 86400000);
    } else if (unit === "months") {
      target = addCalendarMonths(base, sign * amount);
    } else {
      target = addCalendarMonths(base, sign * amount * 12);
    }

    const baseMs = toUtcMs(base);
    const targetMs = toUtcMs(target);
    const diffDays = Math.abs(Math.round((targetMs - baseMs) / 86400000));

    // Optional 3-phase study roadmap when adding >= 14 days
    let roadmap: Array<{ phase: string; desc: string; end: SimpleDate }> | null =
      null;
    if (opType === "add" && diffDays >= 14) {
      const p1Days = Math.max(1, Math.round(diffDays * 0.4));
      const p2Days = Math.max(p1Days + 1, Math.round(diffDays * 0.8));
      roadmap = [
        {
          phase: "Giai đoạn 1 (40% đầu)",
          desc: "Hệ thống kiến thức nền tảng & chuyên đề trọng tâm",
          end: fromUtcMs(baseMs + p1Days * 86400000),
        },
        {
          phase: "Giai đoạn 2 (40% giữa)",
          desc: "Luyện đề bấm giờ & rà soát dạng bài vận dụng cao",
          end: fromUtcMs(baseMs + p2Days * 86400000),
        },
        {
          phase: "Giai đoạn 3 (20% cuối)",
          desc: "Tổng ôn lỗi sai, củng cố tâm lý phòng thi",
          end: target,
        },
      ];
    }

    return {
      base,
      target,
      diffDays,
      roadmap,
    };
  }, [baseDateStr, opType, amountStr, unit]);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {[
          {
            id: "diff" as const,
            label: "Khoảng cách giữa 2 ngày",
            icon: CalendarDays,
          },
          {
            id: "age" as const,
            label: "Tính tuổi hồ sơ thi / tuyển sinh",
            icon: UserCheck,
          },
          {
            id: "addsub" as const,
            label: "Cộng / Trừ ngày & Lộ trình ôn thi",
            icon: CalendarPlus,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-xs font-heading font-semibold transition-colors cursor-pointer sm:text-sm",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/85 border border-border/70 text-foreground hover:bg-foreground/[0.06]",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Date Difference */}
      {activeTab === "diff" && (
        <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              Đếm số ngày, số tuần & số buổi học giữa 2 mốc thời gian
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "Đến thi THPT 2027", date: "2027-06-26" },
                { label: "Đến thi Lớp 10", date: "2027-06-02" },
                { label: "Nghỉ hè 31/05", date: "2027-05-31" },
              ].map((preset) => (
                <button
                  key={preset.date}
                  type="button"
                  onClick={() => {
                    setStartDateStr(todayIso);
                    setEndDateStr(preset.date);
                  }}
                  className="rounded-lg bg-foreground/[0.06] px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-11 md:items-end">
            <div className="md:col-span-5 space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="diff-start" className="text-xs font-semibold text-muted-foreground">
                  Từ ngày (Bắt đầu)
                </label>
                <button
                  type="button"
                  onClick={() => setStartDateStr(todayIso)}
                  className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  Hôm nay
                </button>
              </div>
              <input
                id="diff-start"
                type="date"
                value={startDateStr}
                onChange={(e) => setStartDateStr(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="md:col-span-1 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setStartDateStr(endDateStr);
                  setEndDateStr(startDateStr);
                }}
                aria-label="Đảo ngược 2 mốc ngày"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.12] cursor-pointer"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </button>
            </div>

            <div className="md:col-span-5 space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="diff-end" className="text-xs font-semibold text-muted-foreground">
                  Đến ngày (Kết thúc)
                </label>
                <button
                  type="button"
                  onClick={() => setEndDateStr(todayIso)}
                  className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  Hôm nay
                </button>
              </div>
              <input
                id="diff-end"
                type="date"
                value={endDateStr}
                onChange={(e) => setEndDateStr(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer sm:text-sm">
            <input
              type="checkbox"
              checked={includeEndDate}
              onChange={(e) => setIncludeEndDate(e.target.checked)}
              className="h-4 w-4 rounded accent-primary cursor-pointer"
            />
            <span>Tính gộp cả ngày kết thúc (+1 ngày)</span>
          </label>

          {diffResult && (
            <div className="space-y-4">
              {diffResult.swapped && (
                <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                  Lưu ý: Ngày bắt đầu đang lớn hơn ngày kết thúc — kết quả hiển thị khoảng cách tuyệt đối giữa 2 mốc.
                </p>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">Tổng số ngày</p>
                  <p className="font-heading text-3xl font-bold text-primary">
                    {diffResult.totalDays.toLocaleString("vi-VN")} ngày
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {diffResult.calendar.years > 0
                      ? `${diffResult.calendar.years} năm `
                      : ""}
                    {diffResult.calendar.months > 0
                      ? `${diffResult.calendar.months} tháng `
                      : ""}
                    {diffResult.calendar.days} ngày (theo lịch)
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/70 p-4 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">Số tuần ôn thi</p>
                  <p className="font-heading text-2xl font-bold text-foreground">
                    {diffResult.weeks} tuần {diffResult.remDays} ngày
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ≈ {(diffResult.totalDays / 7).toFixed(1)} tuần liên tục
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/70 p-4 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Số buổi học (Trừ Chủ Nhật)
                  </p>
                  <p className="font-heading text-2xl font-bold text-foreground">
                    {diffResult.breakdown.monToSat.toLocaleString("vi-VN")} ngày
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Thứ 2 – Thứ 7 (nghỉ {diffResult.breakdown.sundays} Chủ nhật)
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/70 p-4 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Ngày làm việc (Thứ 2 – Thứ 6)
                  </p>
                  <p className="font-heading text-2xl font-bold text-foreground">
                    {diffResult.breakdown.monToFri.toLocaleString("vi-VN")} ngày
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tính theo tuần hành chính 5 ngày
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Exact Age Calculator */}
      {activeTab === "age" && (
        <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                Tính tuổi chính xác theo ngày làm hồ sơ thi & tuyển sinh
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Xác định chính xác số năm, tháng, ngày tuổi và đếm ngược sinh nhật tiếp theo
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "Mốc hôm nay", date: todayIso },
                { label: "Mốc 01/06/2027", date: "2027-06-01" },
                { label: "Mốc 01/09/2027", date: "2027-09-01" },
              ].map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setAsOfDateStr(m.date)}
                  className="rounded-lg bg-foreground/[0.06] px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground">
                Ngày tháng năm sinh
              </span>
              <input
                type="date"
                value={birthDateStr}
                onChange={(e) => setBirthDateStr(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground">
                Tính đến ngày (Mốc hồ sơ)
              </span>
              <input
                type="date"
                value={asOfDateStr}
                onChange={(e) => setAsOfDateStr(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>

          {ageResult && ageResult.invalidOrder ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm font-medium text-destructive">
              Ngày sinh không thể lớn hơn ngày tính mốc hồ sơ. Vui lòng kiểm tra lại.
            </div>
          ) : (
            ageResult && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Tuổi chính xác tại mốc {formatViDate(ageResult.asOf)}
                    </p>
                    <p className="font-heading text-2xl font-bold text-primary sm:text-3xl">
                      {ageResult.age.years} tuổi {ageResult.age.months} tháng{" "}
                      {ageResult.age.days} ngày
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Sinh vào {getViWeekday(ageResult.birth)}, ngày{" "}
                      {formatViDate(ageResult.birth)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-background/70 p-5 space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Đếm ngược sinh nhật kế tiếp
                    </p>
                    <p className="font-heading text-2xl font-bold text-foreground">
                      {ageResult.isBirthdayToday
                        ? "Chúc mừng sinh nhật hôm nay!"
                        : `Còn ${ageResult.daysToNextBirthday} ngày`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Rơi vào {getViWeekday(ageResult.nextBday)},{" "}
                      {formatViDate(ageResult.nextBday)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-background/70 p-5 space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Tổng thời gian đã qua
                    </p>
                    <p className="font-heading text-xl font-bold text-foreground">
                      {ageResult.totalDaysLived.toLocaleString("vi-VN")} ngày
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ageResult.totalMonthsLived.toLocaleString("vi-VN")} tháng •{" "}
                      {ageResult.totalWeeksLived.toLocaleString("vi-VN")} tuần
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 rounded-xl bg-foreground/[0.04] px-4 py-3 text-xs text-muted-foreground">
                  <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                  <span>Kiểm tra điều kiện hồ sơ:</span>
                  <Badge
                    className={
                      ageResult.age.years >= 15
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        : "bg-foreground/[0.08] text-muted-foreground"
                    }
                  >
                    {ageResult.age.years >= 15 ? "Đủ 15 tuổi (Vào THPT)" : "Chưa đủ 15 tuổi"}
                  </Badge>
                  <Badge
                    className={
                      ageResult.age.years >= 18
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        : "bg-foreground/[0.08] text-muted-foreground"
                    }
                  >
                    {ageResult.age.years >= 18
                      ? "Đủ 18 tuổi (Đại học / Công dân)"
                      : "Chưa đủ 18 tuổi"}
                  </Badge>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Tab 3: Add / Subtract Date & Study Roadmap */}
      {activeTab === "addsub" && (
        <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                Cộng / Trừ ngày & Lập mốc lộ trình ôn thi
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Tìm nhanh ngày kết thúc khóa học, hạn nộp hồ sơ hoặc lịch tổng ôn sau N ngày / N tuần
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "+30 ngày", op: "add" as const, amt: "30", unit: "days" as const },
                { label: "+8 tuần", op: "add" as const, amt: "8", unit: "weeks" as const },
                { label: "+12 tuần", op: "add" as const, amt: "12", unit: "weeks" as const },
                { label: "+100 ngày", op: "add" as const, amt: "100", unit: "days" as const },
              ].map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => {
                    setOpType(q.op);
                    setAmountStr(q.amt);
                    setUnit(q.unit);
                  }}
                  className="rounded-lg bg-foreground/[0.06] px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground">Ngày xuất phát</span>
              <input
                type="date"
                value={baseDateStr}
                onChange={(e) => setBaseDateStr(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground">Phép tính</span>
              <div className="flex h-11 gap-1.5">
                <button
                  type="button"
                  onClick={() => setOpType("add")}
                  className={cn(
                    "flex-1 rounded-xl text-xs font-semibold cursor-pointer",
                    opType === "add"
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.12]",
                  )}
                >
                  + Cộng thêm
                </button>
                <button
                  type="button"
                  onClick={() => setOpType("sub")}
                  className={cn(
                    "flex-1 rounded-xl text-xs font-semibold cursor-pointer",
                    opType === "sub"
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.12]",
                  )}
                >
                  - Trừ lùi
                </button>
              </div>
            </div>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground">Số lượng</span>
              <input
                type="number"
                min={0}
                step={1}
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground">Đơn vị</span>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as DurationUnit)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="days">Ngày</option>
                <option value="weeks">Tuần</option>
                <option value="months">Tháng</option>
                <option value="years">Năm</option>
              </select>
            </label>
          </div>

          {addSubResult && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Ngày kết quả dự kiến
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary sm:text-3xl">
                    {getViWeekday(addSubResult.target)},{" "}
                    {formatViDate(addSubResult.target)}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>
                    Chênh lệch đúng {addSubResult.diffDays.toLocaleString("vi-VN")} ngày so với{" "}
                    {formatViDate(addSubResult.base)}
                  </span>
                </div>
              </div>

              {addSubResult.roadmap && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <h3 className="font-heading text-sm font-bold text-foreground sm:text-base">
                      Gợi ý chia 3 chặng lộ trình ôn thi ({addSubResult.diffDays} ngày)
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {addSubResult.roadmap.map((step) => (
                      <div
                        key={step.phase}
                        className="rounded-xl border border-border/70 bg-background/70 p-4 space-y-1.5"
                      >
                        <Badge className="bg-primary/15 text-primary">{step.phase}</Badge>
                        <p className="text-sm font-bold text-foreground">
                          Hoàn thành trước: {formatViDate(step.end)}
                        </p>
                        <p className="text-xs text-muted-foreground">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
