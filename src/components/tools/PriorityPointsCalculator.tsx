"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Info, RotateCcw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const REGION_OPTIONS = [
  { id: "kv1", label: "Khu vực 1 (KV1)", points: 0.75, note: "Miền núi, hải đảo, vùng ĐBKK" },
  { id: "kv2-nt", label: "Khu vực 2 Nông thôn (KV2-NT)", points: 0.5, note: "Các xã nông thôn ngoài KV1" },
  { id: "kv2", label: "Khu vực 2 (KV2)", points: 0.25, note: "Thị xã, TP trực thuộc tỉnh" },
  { id: "kv3", label: "Khu vực 3 (KV3)", points: 0, note: "Quận nội thành TP trực thuộc TW" },
] as const;

const GROUP_OPTIONS = [
  { id: "ut1", label: "Nhóm ƯT1 (Đối tượng 01–04)", points: 2.0, note: "Con liệt sĩ, thương binh, dân tộc thiểu số KV1..." },
  { id: "ut2", label: "Nhóm ƯT2 (Đối tượng 05–07)", points: 1.0, note: "Quân nhân xuất ngũ, con bệnh binh, người khuyết tật..." },
  { id: "none", label: "Không thuộc diện ưu tiên", points: 0, note: "Mặc định 0 điểm đối tượng" },
] as const;

const MILESTONE_SCORES = [22.5, 24.0, 25.0, 26.0, 27.0, 28.0, 29.0];

export function calculateEffectivePriority(totalScore: number, basePriority: number): number {
  if (basePriority <= 0 || totalScore >= 30) return 0;
  if (totalScore < 22.5) return Math.round(basePriority * 100) / 100;
  const raw = ((30 - totalScore) / 7.5) * basePriority;
  return Math.max(0, Math.round(raw * 100) / 100);
}

function clampTotalScore(raw: string): number {
  const parsed = parseFloat(raw.replace(",", "."));
  if (Number.isNaN(parsed)) return 0;
  return Math.min(30, Math.max(15, Math.round(parsed * 100) / 100));
}

export function PriorityPointsCalculator() {
  const [regionId, setRegionId] = useState<(typeof REGION_OPTIONS)[number]["id"]>("kv2-nt");
  const [groupId, setGroupId] = useState<(typeof GROUP_OPTIONS)[number]["id"]>("none");
  const [totalScore, setTotalScore] = useState<number>(25.5);
  const [scoreInput, setScoreInput] = useState<string>("25.5");
  const [copied, setCopied] = useState(false);

  const region = REGION_OPTIONS.find((r) => r.id === regionId) ?? REGION_OPTIONS[1];
  const group = GROUP_OPTIONS.find((g) => g.id === groupId) ?? GROUP_OPTIONS[2];

  const calc = useMemo(() => {
    const basePriority = Math.round((region.points + group.points) * 100) / 100;
    const effectivePriority = calculateEffectivePriority(totalScore, basePriority);
    const reductionAmount = Math.round((basePriority - effectivePriority) * 100) / 100;
    const retentionPercent =
      basePriority > 0 ? Math.round((effectivePriority / basePriority) * 100) : 100;
    const finalScore = Math.round((totalScore + effectivePriority) * 100) / 100;
    const isDecaying = totalScore >= 22.5 && totalScore < 30 && basePriority > 0;

    return {
      basePriority,
      effectivePriority,
      reductionAmount,
      retentionPercent,
      finalScore,
      isDecaying,
    };
  }, [region.points, group.points, totalScore]);

  const handleSliderChange = (val: number) => {
    const rounded = Math.round(val * 100) / 100;
    setTotalScore(rounded);
    setScoreInput(rounded.toString());
  };

  const handleInputChange = (val: string) => {
    setScoreInput(val);
    const parsed = parseFloat(val.replace(",", "."));
    if (!Number.isNaN(parsed)) {
      setTotalScore(Math.min(30, Math.max(15, Math.round(parsed * 100) / 100)));
    }
  };

  const handleInputBlur = () => {
    const clamped = clampTotalScore(scoreInput);
    setTotalScore(clamped);
    setScoreInput(clamped.toString());
  };

  const handleReset = () => {
    setRegionId("kv2-nt");
    setGroupId("none");
    setTotalScore(25.5);
    setScoreInput("25.5");
  };

  const handleCopy = async () => {
    const text = [
      "KẾT QUẢ TÍNH ĐIỂM ƯU TIÊN XÉT TUYỂN ĐẠI HỌC 2027",
      `• Tổng điểm 3 môn: ${totalScore.toFixed(2)} / 30`,
      `• Khu vực: ${region.label} (+${region.points.toFixed(2)})`,
      `• Đối tượng: ${group.label} (+${group.points.toFixed(2)})`,
      `• Mức ưu tiên gốc: +${calc.basePriority.toFixed(2)}`,
      `• Điểm ưu tiên thực tế: +${calc.effectivePriority.toFixed(2)} (giữ lại ${calc.retentionPercent}%)`,
      `• Tổng điểm xét tuyển: ${calc.finalScore.toFixed(2)} / 30`,
      "Tính tại: https://www.quizken.com/cong-cu/tinh-diem-cong-uu-tien-dai-hoc-2027",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Controls */}
        <div className="space-y-6 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              1. Chọn khu vực, đối tượng &amp; tổng điểm 3 môn
            </h2>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3.5 text-xs font-semibold text-foreground transition-colors hover:bg-foreground/[0.1] cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Đặt lại
            </button>
          </div>

          {/* Region Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Điểm ưu tiên Khu vực
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {REGION_OPTIONS.map((opt) => {
                const active = opt.id === regionId;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setRegionId(opt.id)}
                    className={cn(
                      "flex min-h-11 flex-col items-start rounded-xl border p-3 text-left transition-colors cursor-pointer",
                      active
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border/60 bg-foreground/[0.03] text-foreground hover:bg-foreground/[0.06]",
                    )}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-sm font-bold">{opt.label}</span>
                      <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
                        +{opt.points.toFixed(2)}
                      </span>
                    </div>
                    <span className="mt-1 text-xs text-muted-foreground">{opt.note}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Group Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Điểm ưu tiên Đối tượng
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {GROUP_OPTIONS.map((opt) => {
                const active = opt.id === groupId;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGroupId(opt.id)}
                    className={cn(
                      "flex min-h-11 flex-col items-start rounded-xl border p-3 text-left transition-colors cursor-pointer",
                      active
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border/60 bg-foreground/[0.03] text-foreground hover:bg-foreground/[0.06]",
                    )}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-xs font-bold sm:text-sm">{opt.label}</span>
                      <span className="shrink-0 rounded-md bg-primary/15 px-1.5 py-0.5 text-xs font-bold text-primary">
                        +{opt.points.toFixed(1)}
                      </span>
                    </div>
                    <span className="mt-1 text-[11px] leading-snug text-muted-foreground">
                      {opt.note}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Score Slider */}
          <div className="space-y-3 rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <label
                  htmlFor="total-score-input"
                  className="text-sm font-bold text-foreground"
                >
                  Tổng điểm 3 môn chưa cộng ưu tiên (15.0 – 30.0)
                </label>
                <p className="text-xs text-muted-foreground">
                  Kéo thanh trượt hoặc nhập chính xác tổng điểm tổ hợp xét tuyển
                </p>
              </div>
              <input
                id="total-score-input"
                type="number"
                min={15}
                max={30}
                step={0.05}
                value={scoreInput}
                onChange={(e) => handleInputChange(e.target.value)}
                onBlur={handleInputBlur}
                className="min-h-11 w-24 rounded-xl border border-border/70 bg-background px-3 text-center font-heading text-lg font-bold text-primary outline-none focus:border-primary"
              />
            </div>

            <input
              type="range"
              aria-label="Thanh trượt tổng điểm 3 môn"
              min={15}
              max={30}
              step={0.05}
              value={totalScore}
              onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
              className="h-2.5 w-full cursor-pointer accent-primary"
            />

            <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
              <span>15.0</span>
              <span className="font-bold text-primary">22.5 (Mốc bắt đầu giảm)</span>
              <span>26.0</span>
              <span>30.0</span>
            </div>
          </div>
        </div>

        {/* Right: Live Result */}
        <div className="flex flex-col justify-between space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <Badge className="bg-primary/15 text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Quy chế Bộ GD&amp;ĐT</span>
              </Badge>
              <span className="text-xs font-semibold text-muted-foreground">
                Giữ lại {calc.retentionPercent}% mức gốc
              </span>
            </div>

            <div className="rounded-2xl bg-foreground/[0.04] p-5 text-center dark:bg-foreground/[0.06]">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tổng điểm xét tuyển sau ưu tiên
              </p>
              <p className="mt-1 font-heading text-4xl font-extrabold text-primary sm:text-5xl">
                {calc.finalScore.toFixed(2)}
              </p>
              <p className="mt-2 text-sm text-foreground">
                Điểm gốc <strong>{totalScore.toFixed(2)}</strong> + Ưu tiên thực tế{" "}
                <strong className="text-primary">+{calc.effectivePriority.toFixed(2)}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]">
                <p className="text-xs text-muted-foreground">Mức ưu tiên gốc</p>
                <p className="mt-0.5 font-heading text-lg font-bold text-foreground">
                  +{calc.basePriority.toFixed(2)}
                </p>
              </div>
              <div className="rounded-xl bg-foreground/[0.04] p-3.5 dark:bg-foreground/[0.06]">
                <p className="text-xs text-muted-foreground">Mức bị giảm trừ</p>
                <p className="mt-0.5 font-heading text-lg font-bold text-foreground">
                  -{calc.reductionAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-background/60 p-3.5 text-xs leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                {totalScore < 22.5 ? (
                  <span>
                    Tổng điểm nhỏ hơn 22.5 nên bạn được hưởng <strong>100% điểm ưu tiên gốc</strong> (+
                    {calc.basePriority.toFixed(2)}).
                  </span>
                ) : totalScore >= 30 ? (
                  <span>
                    Tổng điểm đạt 30.0 nên điểm ưu tiên cộng thêm giảm về <strong>0.00</strong>.
                  </span>
                ) : (
                  <span>
                    Từ mốc 22.5 trở lên, ưu tiên giảm tuyến tính: [(30 − {totalScore.toFixed(2)}) /
                    7.5] × {calc.basePriority.toFixed(2)} ={" "}
                    <strong className="text-foreground">+{calc.effectivePriority.toFixed(2)}</strong>.
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-heading font-bold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Đã sao chép kết quả!" : "Sao chép kết quả ưu tiên"}</span>
          </button>
        </div>
      </div>

      {/* Live Milestone Comparison Table */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              Bảng đối chiếu điểm ưu tiên thực tế theo mức điểm (Mức gốc: +{calc.basePriority.toFixed(2)})
            </h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Cập nhật tự động theo Khu vực ({region.label}) và Đối tượng ({group.label}) bạn đang chọn
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border/70 text-muted-foreground">
                <th className="py-2.5 pr-4 font-semibold">Tổng điểm 3 môn</th>
                <th className="py-2.5 pr-4 font-semibold">Ưu tiên gốc</th>
                <th className="py-2.5 pr-4 font-semibold text-primary">Ưu tiên thực tế</th>
                <th className="py-2.5 pr-4 font-semibold">Bị giảm trừ</th>
                <th className="py-2.5 font-semibold">Tổng điểm xét tuyển</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {MILESTONE_SCORES.map((m) => {
                const eff = calculateEffectivePriority(m, calc.basePriority);
                const red = Math.round((calc.basePriority - eff) * 100) / 100;
                const tot = Math.round((m + eff) * 100) / 100;
                const isNear = Math.abs(totalScore - m) < 0.26;
                return (
                  <tr
                    key={m}
                    className={cn(isNear && "bg-primary/10 font-semibold")}
                  >
                    <td className="py-2.5 pr-4 font-bold">{m.toFixed(1)}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">+{calc.basePriority.toFixed(2)}</td>
                    <td className="py-2.5 pr-4 font-bold text-primary">+{eff.toFixed(2)}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">-{red.toFixed(2)}</td>
                    <td className="py-2.5 font-bold">{tot.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
