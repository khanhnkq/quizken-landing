"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Calendar, Clock, Flame, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type ExamTarget = {
  id: string;
  name: string;
  shortName: string;
  dateLabel: string;
  isoDate: string;
  badge: string;
  note: string;
};

const EXAM_TARGETS: ExamTarget[] = [
  {
    id: "thpt-2027",
    name: "Kỳ thi Tốt nghiệp THPT Quốc gia 2027",
    shortName: "THPT Quốc gia 2027",
    dateLabel: "11/06/2027",
    isoDate: "2027-06-11T07:30:00+07:00",
    badge: "Trọng điểm",
    note: "Mốc dự kiến kỳ thi Tốt nghiệp THPT theo khung kế hoạch năm học (giữa tháng 6).",
  },
  {
    id: "vact-1",
    name: "ĐGNL ĐHQG TP.HCM (V-ACT) Đợt 1 - 2027",
    shortName: "ĐGNL V-ACT Đợt 1",
    dateLabel: "28/03/2027",
    isoDate: "2027-03-28T08:00:00+07:00",
    badge: "Đợt 1",
    note: "Đợt thi sớm giúp thí sinh có kết quả xét tuyển đại học từ cuối tháng 4.",
  },
  {
    id: "vact-2",
    name: "ĐGNL ĐHQG TP.HCM (V-ACT) Đợt 2 - 2027",
    shortName: "ĐGNL V-ACT Đợt 2",
    dateLabel: "23/05/2027",
    isoDate: "2027-05-23T08:00:00+07:00",
    badge: "Đợt 2",
    note: "Cơ hội cải thiện điểm ĐGNL lần 2 trước kỳ thi tốt nghiệp THPT khoảng 3 tuần.",
  },
  {
    id: "lop-10",
    name: "Kỳ thi Tuyển sinh vào lớp 10 năm 2027",
    shortName: "Thi vào lớp 10",
    dateLabel: "01/06/2027",
    isoDate: "2027-06-01T08:00:00+07:00",
    badge: "Tuyển sinh 10",
    note: "Mốc dự kiến đầu tháng 6 tại phần lớn tỉnh/thành phố (Toán, Ngữ văn, Tiếng Anh/Môn 3).",
  },
];

type ScoreGoalTier = "medium" | "high" | "top";

const SCORE_GOALS: Record<
  ScoreGoalTier,
  {
    label: string;
    desc: string;
    split: Array<{ name: string; pct: number; tip: string }>;
  }
> = {
  medium: {
    label: "Mục tiêu 21 – 24 điểm (V-ACT 750+)",
    desc: "Ưu tiên chắc chắn kiến thức nền tảng (Nhận biết + Thông hiểu) và không mất điểm đáng tiếc.",
    split: [
      { name: "Ôn kiến thức nền & Công thức cốt lõi", pct: 45, tip: "Nắm chắc 70% câu Phần I & ý a-b Phần II" },
      { name: "Luyện đề trắc nghiệm theo chuyên đề", pct: 30, tip: "Làm 2–3 đề nhỏ mỗi tuần" },
      { name: "Chữa lỗi sai & Sổ tay Active Recall", pct: 15, tip: "Ghi chú lỗi sai hay lặp lại" },
      { name: "Làm quen câu Đúng/Sai & Trả lời ngắn", pct: 10, tip: "Tránh sai đơn vị & làm tròn số" },
    ],
  },
  high: {
    label: "Mục tiêu 24 – 27 điểm (V-ACT 900+)",
    desc: "Cân bằng giữa tốc độ xử lý Phần I và chiến thuật ăn trọn điểm Phần II, III.",
    split: [
      { name: "Luyện đề tổng hợp bấm giờ 50–90 phút", pct: 35, tip: "Tối thiểu 2 đề chuẩn GDPT 2018/tuần" },
      { name: "Chuyên đề Vận dụng (Phần II & III)", pct: 30, tip: "Tối ưu điểm lũy tiến 0.5 → 1.0" },
      { name: "Hệ thống & lấp lỗ hổng kiến thức", pct: 20, tip: "Ôn sâu các chương hay mất điểm" },
      { name: "Phân tích lỗi sai & Tối ưu tốc độ", pct: 15, tip: "Kiểm soát thời gian dưới 1 phút/câu I" },
    ],
  },
  top: {
    label: "Mục tiêu 27+ điểm (V-ACT 1020+)",
    desc: "Tập trung cường độ cao vào câu phân hóa, bài toán thực tế và độ chính xác tuyệt đối.",
    split: [
      { name: "Thực chiến đề thi thử & đề trường chuyên", pct: 40, tip: "3–4 đề/tuần, siết chặt thời gian" },
      { name: "Chinh phục Vận dụng cao & Trả lời ngắn", pct: 30, tip: "Không để rơi điểm câu 0.5đ Phần III" },
      { name: "Rà soát bẫy câu hỏi Đúng/Sai", pct: 20, tip: "Đạt tối đa 4/4 ý để giữ 1.0 điểm" },
      { name: "Tổng hợp mẹo bấm máy & kiểm tra chéo", pct: 10, tip: "Giữ phong độ ổn định, tránh sai sót" },
    ],
  },
};

function getTimeRemaining(targetIso: string, nowMs: number) {
  const targetMs = new Date(targetIso).getTime();
  const diff = targetMs - nowMs;
  if (diff <= 0) {
    return {
      isPast: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalHours: 0,
      weeks: 0,
    };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    isPast: false,
    days,
    hours,
    minutes,
    seconds,
    totalHours: Math.floor(diff / 3600000),
    weeks: Math.max(1, Math.round(days / 7)),
  };
}

function subscribeSecondClock(callback: () => void) {
  const timer = setInterval(callback, 1000);
  return () => clearInterval(timer);
}

function getClientSecondSnapshot() {
  return Math.floor(Date.now() / 1000) * 1000;
}

function getServerSecondSnapshot() {
  return null;
}

export function ExamCountdownTool() {
  const [selectedId, setSelectedId] = useState<string>("thpt-2027");
  const nowMs = useSyncExternalStore(
    subscribeSecondClock,
    getClientSecondSnapshot,
    getServerSecondSnapshot,
  );
  const [goalTier, setGoalTier] = useState<ScoreGoalTier>("high");
  const [dailyHours, setDailyHours] = useState<number>(2.5);

  const selectedExam =
    EXAM_TARGETS.find((e) => e.id === selectedId) ?? EXAM_TARGETS[0];

  const remaining = useMemo(() => {
    if (nowMs === null) return null;
    return getTimeRemaining(selectedExam.isoDate, nowMs);
  }, [selectedExam.isoDate, nowMs]);

  const studyPlan = useMemo(() => {
    const goal = SCORE_GOALS[goalTier];
    const weeklyHours = dailyHours * 7;
    const daysLeft = remaining ? remaining.days : 180;
    const totalStudyHours = Math.round(daysLeft * dailyHours);

    return {
      goal,
      weeklyHours,
      totalStudyHours,
      daysLeft,
      breakdown: goal.split.map((item) => ({
        ...item,
        hoursPerWeek: Math.round(((weeklyHours * item.pct) / 100) * 10) / 10,
      })),
    };
  }, [goalTier, dailyHours, remaining]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="space-y-6">
      {/* Exam Switcher Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {EXAM_TARGETS.map((exam) => {
          const active = exam.id === selectedId;
          return (
            <button
              key={exam.id}
              type="button"
              onClick={() => setSelectedId(exam.id)}
              className={cn(
                "flex min-h-11 flex-col items-start justify-between rounded-2xl border p-4 text-left transition-all cursor-pointer",
                active
                  ? "border-primary bg-primary/10"
                  : "border-border/70 bg-card/85 hover:border-primary/50",
              )}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  {exam.dateLabel}
                </span>
                <Badge className={active ? "bg-primary text-primary-foreground" : ""}>
                  {exam.badge}
                </Badge>
              </div>
              <div className="mt-2 font-heading text-base font-bold text-foreground">
                {exam.shortName}
              </div>
            </button>
          );
        })}
      </div>

      {/* Live Countdown Box */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <Badge className="bg-primary/15 text-primary">
              <Clock className="h-3.5 w-3.5" />
              <span>Đếm ngược thời gian thực • Ngày thi: {selectedExam.dateLabel}</span>
            </Badge>
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              {selectedExam.name}
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {selectedExam.note}
            </p>
          </div>
          {remaining && !remaining.isPast && (
            <div className="rounded-xl bg-foreground/[0.04] px-4 py-2.5 text-right dark:bg-foreground/[0.06]">
              <div className="text-[11px] font-semibold text-muted-foreground">
                Ước tính còn lại
              </div>
              <div className="font-heading text-lg font-bold text-primary">
                ~{remaining.weeks} tuần ôn thi
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            { label: "Ngày", value: remaining ? String(remaining.days) : "--" },
            { label: "Giờ", value: remaining ? pad(remaining.hours) : "--" },
            { label: "Phút", value: remaining ? pad(remaining.minutes) : "--" },
            { label: "Giây", value: remaining ? pad(remaining.seconds) : "--" },
          ].map((unit) => (
            <div
              key={unit.label}
              className="rounded-2xl bg-foreground/[0.04] p-4 text-center dark:bg-foreground/[0.06] sm:p-6"
            >
              <div className="font-heading text-4xl font-bold tabular-nums text-foreground sm:text-5xl lg:text-6xl">
                {unit.value}
              </div>
              <div className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:text-sm">
                {unit.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Study Plan Generator */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                Tạo nhanh kế hoạch ôn tập mỗi tuần
              </h2>
              <p className="text-xs text-muted-foreground">
                Chọn mục tiêu điểm số và quỹ thời gian học mỗi ngày để xem phân bổ giờ ôn tối ưu
              </p>
            </div>
          </div>
          <Badge>
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Quỹ thời gian còn lại: ~{studyPlan.totalStudyHours} giờ tự học</span>
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-foreground">
              1. Chọn mục tiêu điểm số
            </span>
            <div className="space-y-2">
              {(Object.keys(SCORE_GOALS) as ScoreGoalTier[]).map((tier) => {
                const active = goalTier === tier;
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setGoalTier(tier)}
                    className={cn(
                      "flex min-h-11 w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
                      active
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border/70 bg-background text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span>{SCORE_GOALS[tier].label}</span>
                    {active && <span className="text-primary">Đang chọn</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-semibold text-foreground">
              2. Thời gian tự học trung bình mỗi ngày
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "1.5 giờ / ngày", val: 1.5, sub: "10.5 giờ/tuần" },
                { label: "2.5 giờ / ngày", val: 2.5, sub: "17.5 giờ/tuần" },
                { label: "4.0 giờ / ngày", val: 4.0, sub: "28 giờ/tuần" },
                { label: "6.0 giờ / ngày", val: 6.0, sub: "42 giờ/tuần" },
              ].map((opt) => {
                const active = dailyHours === opt.val;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setDailyHours(opt.val)}
                    className={cn(
                      "flex min-h-14 flex-col justify-center rounded-xl border px-3.5 py-2 text-left transition-colors cursor-pointer",
                      active
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border/70 bg-background text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="font-heading text-sm font-bold text-foreground">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {opt.sub}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="pt-1 text-xs leading-relaxed text-muted-foreground">
              {studyPlan.goal.desc}
            </p>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {studyPlan.breakdown.map((item) => (
            <div
              key={item.name}
              className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06] space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-heading text-sm font-bold text-foreground">
                  {item.name}
                </span>
                <span className="shrink-0 font-heading text-sm font-bold text-primary">
                  {item.hoursPerWeek}h / tuần ({item.pct}%)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
