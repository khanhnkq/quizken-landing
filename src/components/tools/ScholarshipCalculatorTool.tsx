"use client";

import { useMemo, useState } from "react";
import { Award, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ScholarshipTier = "xuat-sac" | "gioi" | "kha" | "khong-dat";

const TIER_INFO: Record<
  ScholarshipTier,
  {
    label: string;
    pctMin: number;
    pctMax: number;
    badgeClass: string;
    summary: string;
  }
> = {
  "xuat-sac": {
    label: "Học bổng loại Xuất sắc",
    pctMin: 120,
    pctMax: 150,
    badgeClass: "bg-primary/15 text-primary",
    summary:
      "Chúc mừng! Bạn đạt chuẩn học bổng Khuyến khích học tập mức cao nhất (GPA ≥ 3.60 và ĐRL ≥ 90).",
  },
  gioi: {
    label: "Học bổng loại Giỏi",
    pctMin: 100,
    pctMax: 110,
    badgeClass: "bg-primary/15 text-primary",
    summary:
      "Rất tốt! Bạn đủ điều kiện xét học bổng loại Giỏi (GPA ≥ 3.20 và ĐRL ≥ 80).",
  },
  kha: {
    label: "Học bổng loại Khá",
    pctMin: 70,
    pctMax: 100,
    badgeClass: "bg-foreground/[0.08] text-foreground",
    summary:
      "Bạn đạt chuẩn xét học bổng loại Khá (GPA ≥ 2.50 và ĐRL ≥ 65/70).",
  },
  "khong-dat": {
    label: "Chưa đủ điều kiện xét học bổng",
    pctMin: 0,
    pctMax: 0,
    badgeClass: "bg-destructive/15 text-destructive",
    summary:
      "Hiện chưa đạt ngưỡng xét học bổng KKHT (cần GPA ≥ 2.50, ĐRL ≥ 65, đủ tín chỉ tối thiểu và không có môn dưới chuẩn/thi lại).",
  },
};

function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(Math.round(amount)) + " đ";
}

export function ScholarshipCalculatorTool() {
  const [gpa, setGpa] = useState("3.45");
  const [drl, setDrl] = useState("86");
  const [credits, setCredits] = useState("16");
  const [minCredits, setMinCredits] = useState("15");
  const [tuitionMillion, setTuitionMillion] = useState("12");
  const [khaDrlThreshold, setKhaDrlThreshold] = useState<65 | 70>(70);
  const [noFailedOrRetake, setNoFailedOrRetake] = useState(true);
  const [noMinGradeIssue, setNoMinGradeIssue] = useState(true);

  const evaluation = useMemo(() => {
    const gpaNum = Math.min(4, Math.max(0, Number(gpa.replace(",", ".")) || 0));
    const drlNum = Math.min(100, Math.max(0, Number(drl) || 0));
    const credNum = Math.max(0, Number(credits) || 0);
    const minCredNum = Math.max(0, Number(minCredits) || 0);
    const tuitionVnd = Math.max(0, (Number(tuitionMillion.replace(",", ".")) || 0) * 1_000_000);

    const reasons: string[] = [];
    if (credNum < minCredNum) {
      reasons.push(`Số tín chỉ đăng ký (${credNum}) thấp hơn mức tối thiểu (${minCredNum} TC).`);
    }
    if (!noFailedOrRetake) {
      reasons.push("Có học phần bị điểm F hoặc phải học lại / thi lại trong kỳ.");
    }
    if (!noMinGradeIssue) {
      reasons.push("Có môn học phần dưới ngưỡng điểm chữ tối thiểu của trường (thường là < C hoặc < D).");
    }

    let tier: ScholarshipTier = "khong-dat";
    if (reasons.length === 0) {
      if (gpaNum >= 3.6 && drlNum >= 90) {
        tier = "xuat-sac";
      } else if (gpaNum >= 3.2 && drlNum >= 80) {
        tier = "gioi";
      } else if (gpaNum >= 2.5 && drlNum >= khaDrlThreshold) {
        tier = "kha";
      } else {
        if (gpaNum < 2.5) {
          reasons.push(`GPA học kỳ (${gpaNum.toFixed(2)}) dưới ngưỡng 2.50.`);
        }
        if (drlNum < khaDrlThreshold) {
          reasons.push(`Điểm rèn luyện (${drlNum}) dưới ngưỡng ${khaDrlThreshold}.`);
        }
      }
    }

    const info = TIER_INFO[tier];
    const estMin = (tuitionVnd * info.pctMin) / 100;
    const estMax = (tuitionVnd * info.pctMax) / 100;

    let drlRank = "Kém (< 35)";
    if (drlNum >= 90) drlRank = "Xuất sắc (90–100)";
    else if (drlNum >= 80) drlRank = "Tốt (80–89)";
    else if (drlNum >= 65) drlRank = "Khá (65–79)";
    else if (drlNum >= 50) drlRank = "Trung bình (50–64)";
    else if (drlNum >= 35) drlRank = "Yếu (35–49)";

    return {
      gpaNum,
      drlNum,
      drlRank,
      tier,
      info,
      reasons,
      estMin,
      estMax,
    };
  }, [
    gpa,
    drl,
    credits,
    minCredits,
    tuitionMillion,
    khaDrlThreshold,
    noFailedOrRetake,
    noMinGradeIssue,
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      {/* Inputs */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-7 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
              GPA học kỳ (Hệ 4: 0.00 – 4.00)
            </label>
            <input
              type="number"
              min="0"
              max="4"
              step="0.01"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              className="h-11 w-full rounded-xl border border-border/70 bg-background px-3.5 text-sm font-bold text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
              Điểm rèn luyện (0 – 100 điểm)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={drl}
              onChange={(e) => setDrl(e.target.value)}
              className="h-11 w-full rounded-xl border border-border/70 bg-background px-3.5 text-sm font-bold text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
              Số tín chỉ học trong kỳ
            </label>
            <input
              type="number"
              min="0"
              max="35"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              className="h-11 w-full rounded-xl border border-border/70 bg-background px-3.5 text-sm font-bold text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
              Số tín chỉ tối thiểu của trường
            </label>
            <input
              type="number"
              min="0"
              max="25"
              value={minCredits}
              onChange={(e) => setMinCredits(e.target.value)}
              className="h-11 w-full rounded-xl border border-border/70 bg-background px-3.5 text-sm font-bold text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
              Học phí 1 học kỳ (triệu VNĐ)
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={tuitionMillion}
              onChange={(e) => setTuitionMillion(e.target.value)}
              className="h-11 w-full rounded-xl border border-border/70 bg-background px-3.5 text-sm font-bold text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
              Ngưỡng ĐRL loại Khá của trường
            </label>
            <div className="flex gap-2">
              {([65, 70] as const).map((th) => (
                <button
                  key={th}
                  type="button"
                  onClick={() => setKhaDrlThreshold(th)}
                  className={cn(
                    "h-11 flex-1 cursor-pointer rounded-xl text-xs font-bold transition-colors",
                    khaDrlThreshold === th
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/[0.05] text-foreground"
                  )}
                >
                  ĐRL ≥ {th}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2.5 border-t border-border/60 pt-4">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
            <input
              type="checkbox"
              checked={noFailedOrRetake}
              onChange={(e) => setNoFailedOrRetake(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            <span>Không có môn bị điểm F, thi lại hoặc học lại trong kỳ</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
            <input
              type="checkbox"
              checked={noMinGradeIssue}
              onChange={(e) => setNoMinGradeIssue(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            <span>Tất cả học phần đều đạt ngưỡng điểm tối thiểu (thường ≥ C hoặc D)</span>
          </label>
        </div>
      </div>

      {/* Results */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-7 flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge className={cn("px-3 py-1 text-xs font-bold", evaluation.info.badgeClass)}>
              <Award className="h-3.5 w-3.5" />
              {evaluation.info.label}
            </Badge>
            <span className="text-xs font-medium text-muted-foreground">
              Xếp loại ĐRL: <strong className="text-foreground">{evaluation.drlRank}</strong>
            </span>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {evaluation.info.summary}
          </p>

          {evaluation.tier !== "khong-dat" ? (
            <div className="rounded-xl bg-primary/10 p-4 space-y-1">
              <div className="text-xs font-semibold text-primary">
                Ước tính giá trị học bổng ({evaluation.info.pctMin}–
                {evaluation.info.pctMax}% học phí):
              </div>
              <div className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
                {evaluation.estMin === evaluation.estMax
                  ? formatVnd(evaluation.estMin)
                  : `${formatVnd(evaluation.estMin)} – ${formatVnd(evaluation.estMax)}`}
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-destructive/10 p-4 space-y-1.5 text-xs text-destructive">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="h-4 w-4" />
                Lý do chưa đạt điều kiện:
              </div>
              {evaluation.reasons.map((r, i) => (
                <div key={i}>• {r}</div>
              ))}
            </div>
          )}

          {/* Threshold reference */}
          <div className="space-y-2 pt-2 text-xs">
            <div className="font-bold text-foreground">
              Bảng ngưỡng chuẩn Nghị định 84/2020/NĐ-CP:
            </div>
            {[
              { name: "Xuất sắc", cond: "GPA ≥ 3.60 & ĐRL ≥ 90", rate: "~120–150% HP" },
              { name: "Giỏi", cond: "GPA ≥ 3.20 & ĐRL ≥ 80", rate: "~100–110% HP" },
              { name: "Khá", cond: `GPA ≥ 2.50 & ĐRL ≥ ${khaDrlThreshold}`, rate: "~70–100% HP" },
            ].map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between rounded-lg bg-foreground/[0.04] px-3 py-2 dark:bg-foreground/[0.06]"
              >
                <span className="flex items-center gap-1.5 font-semibold text-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  {row.name}
                </span>
                <span className="text-muted-foreground">{row.cond}</span>
                <span className="font-bold text-primary">{row.rate}</span>
              </div>
            ))}
          </div>
        </div>

        <Button
          href="/cong-cu/tinh-diem-gpa-dai-hoc"
          variant="secondary"
          size="sm"
          className="w-full justify-center gap-1.5 min-h-10"
        >
          Tính GPA học kỳ &amp; điểm mục tiêu
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
