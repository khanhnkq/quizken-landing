"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, CheckCircle2, Copy, RotateCcw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type ModeKey = "hanoi" | "hcm" | "chuyen" | "custom";

const MODES: Array<{ id: ModeKey; label: string; badge: string }> = [
  { id: "hanoi", label: "Hà Nội (TT30 mới)", badge: "Thang 30" },
  { id: "hcm", label: "TP. Hồ Chí Minh", badge: "Thang 30" },
  { id: "chuyen", label: "Hệ Chuyên", badge: "Thang 50" },
  { id: "custom", label: "Tùy chỉnh tỉnh/thành", badge: "Linh hoạt" },
];

function clamp10(v: string): number {
  const n = parseFloat(v.replace(",", "."));
  if (Number.isNaN(n)) return 0;
  return Math.min(10, Math.max(0, n));
}

function clampPriority(v: string): number {
  const n = parseFloat(v.replace(",", "."));
  if (Number.isNaN(n)) return 0;
  return Math.min(4, Math.max(0, n));
}

export function Grade10ScoreCalculator() {
  const [mode, setMode] = useState<ModeKey>("hanoi");
  const [math, setMath] = useState<string>("8.5");
  const [literature, setLiterature] = useState<string>("7.75");
  const [thirdSubjectName, setThirdSubjectName] = useState<string>("Tiếng Anh (Môn 3)");
  const [thirdSubject, setThirdSubject] = useState<string>("8.75");
  const [specialized, setSpecialized] = useState<string>("7.5");
  const [priority, setPriority] = useState<string>("0");

  // Custom weights (only used in custom mode, or Hanoi legacy comparison)
  const [wMath, setWMath] = useState<number>(2);
  const [wLit, setWLit] = useState<number>(2);
  const [wThird, setWThird] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  const calc = useMemo(() => {
    const m = clamp10(math);
    const l = clamp10(literature);
    const t = clamp10(thirdSubject);
    const sp = clamp10(specialized);
    const pr = clampPriority(priority);

    let effectiveWM = 1;
    let effectiveWL = 1;
    let effectiveWT = 1;
    let maxScale = 30;
    let total = 0;

    if (mode === "hanoi" || mode === "hcm") {
      total = m + l + t + pr;
      maxScale = 30;
    } else if (mode === "chuyen") {
      total = m + l + t + sp * 2 + pr;
      maxScale = 50;
    } else {
      effectiveWM = wMath;
      effectiveWL = wLit;
      effectiveWT = wThird;
      maxScale = (effectiveWM + effectiveWL + effectiveWT) * 10;
      total = m * effectiveWM + l * effectiveWL + t * effectiveWT + pr;
    }

    const avgPer10 = maxScale > 0 ? (total / maxScale) * 10 : 0;
    const hanoiLegacy50 = m * 2 + l * 2 + t + pr;

    const zeroSubjects: string[] = [];
    if (m === 0) zeroSubjects.push("Toán");
    if (l === 0) zeroSubjects.push("Ngữ văn");
    if (t === 0) zeroSubjects.push(thirdSubjectName);
    if (mode === "chuyen" && sp <= 2) zeroSubjects.push("Môn chuyên (≤ 2.0)");

    let tierNote = "";
    if (mode === "chuyen") {
      tierNote =
        total >= 37
          ? "Mức rất cạnh tranh cho các lớp chuyên top (Toán, Tin, Anh, Lý, Hóa)."
          : total >= 31
            ? "Mức khá — có cơ hội ở nhiều lớp chuyên/cận chuyên tùy năm."
            : "Cần bứt phá thêm điểm môn Chuyên (hệ số 2) hoặc 3 môn điều kiện.";
    } else if (maxScale === 30) {
      tierNote =
        total >= 25.0
          ? "Nhóm Trường Top đầu (Tương đương TB ≥ 8.33/môn)."
          : total >= 21.0
            ? "Nhóm Trường Khá / Top giữa (Tương đương TB 7.0 – 8.3/môn)."
            : total >= 16.5
              ? "Nhóm Trường Công lập tiêu chuẩn (Tương đương TB 5.5 – 7.0/môn)."
              : "Cần nâng thêm điểm để an toàn vào công lập khu vực nội thành.";
    } else {
      tierNote = `Trung bình quy đổi đạt ${avgPer10.toFixed(2)}/10 mỗi môn theo hệ số bạn đã chọn.`;
    }

    return {
      m,
      l,
      t,
      sp,
      pr,
      total: Math.round(total * 100) / 100,
      maxScale,
      avgPer10,
      hanoiLegacy50: Math.round(hanoiLegacy50 * 100) / 100,
      zeroSubjects,
      tierNote,
      effectiveWM,
      effectiveWL,
      effectiveWT,
    };
  }, [mode, math, literature, thirdSubject, thirdSubjectName, specialized, priority, wMath, wLit, wThird]);

  const loadSample = () => {
    setMath("8.75");
    setLiterature("7.75");
    setThirdSubject("9.0");
    setSpecialized("7.5");
    setPriority("0.5");
  };

  const resetAll = () => {
    setMath("0");
    setLiterature("0");
    setThirdSubject("0");
    setSpecialized("0");
    setPriority("0");
  };

  const handleCopy = async () => {
    const modeName = MODES.find((x) => x.id === mode)?.label ?? mode;
    const lines = [
      `🎯 KẾT QUẢ TÍNH ĐIỂM THI VÀO LỚP 10 (${modeName})`,
      `• Toán: ${calc.m} | Ngữ văn: ${calc.l} | ${thirdSubjectName}: ${calc.t}`,
      ...(mode === "chuyen" ? [`• Môn Chuyên (×2): ${calc.sp}`] : []),
      `• Điểm ưu tiên / khuyến khích: +${calc.pr}`,
      `=> TỔNG ĐIỂM XÉT TUYỂN: ${calc.total.toFixed(2)} / ${calc.maxScale}`,
      `Tính tại: https://www.quizken.com/cong-cu/tinh-diem-thi-vao-lop-10`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-xl px-4 font-heading text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/85 border border-border/70 text-muted-foreground hover:text-foreground",
              )}
            >
              <span>{m.label}</span>
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                  active
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-foreground/[0.06] text-foreground",
                )}
              >
                {m.badge}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Form */}
        <div className="space-y-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              Nhập điểm các môn thi tuyển sinh lớp 10
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadSample}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Ví dụ mẫu</span>
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Đặt lại</span>
              </button>
            </div>
          </div>

          {mode === "hanoi" && (
            <div className="rounded-xl bg-primary/10 px-4 py-3 text-xs leading-relaxed text-foreground">
              <strong>Cập nhật Thông tư 30/2024/TT-BGDĐT (áp dụng từ 2025–2027):</strong> Hà Nội và các địa phương áp dụng thống nhất <strong>3 môn đều hệ số 1 (thang 30)</strong>, bỏ nhân đôi Toán &amp; Ngữ văn ở hệ đại trà.
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="block text-xs font-semibold text-foreground sm:text-sm">
                Điểm Toán {mode === "custom" ? `(Hệ số ${wMath})` : "(Hệ số 1)"}
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={10}
                step={0.25}
                value={math}
                onChange={(e) => setMath(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="space-y-1.5">
              <span className="block text-xs font-semibold text-foreground sm:text-sm">
                Điểm Ngữ văn {mode === "custom" ? `(Hệ số ${wLit})` : "(Hệ số 1)"}
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={10}
                step={0.25}
                value={literature}
                onChange={(e) => setLiterature(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground sm:text-sm">
                {thirdSubjectName} {mode === "custom" ? `(Hệ số ${wThird})` : "(Hệ số 1)"}
              </label>
              <div className="flex gap-2">
                {mode === "custom" && (
                  <input
                    type="text"
                    aria-label="Tên môn thi thứ 3"
                    value={thirdSubjectName}
                    onChange={(e) => setThirdSubjectName(e.target.value)}
                    className="h-11 flex-1 rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground"
                  />
                )}
                <input
                  type="number"
                  aria-label="Điểm môn thi thứ 3"
                  inputMode="decimal"
                  min={0}
                  max={10}
                  step={0.25}
                  value={thirdSubject}
                  onChange={(e) => setThirdSubject(e.target.value)}
                  className={cn(
                    "h-11 rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                    mode === "custom" ? "w-24" : "w-full",
                  )}
                />
              </div>
            </div>

            {mode === "chuyen" ? (
              <label className="space-y-1.5">
                <span className="block text-xs font-semibold text-foreground sm:text-sm">
                  Điểm Môn Chuyên (Hệ số 2)
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={10}
                  step={0.25}
                  value={specialized}
                  onChange={(e) => setSpecialized(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            ) : (
              <label className="space-y-1.5">
                <span className="block text-xs font-semibold text-foreground sm:text-sm">
                  Điểm Ưu tiên / Khuyến khích (0 – 4.0)
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={4}
                  step={0.25}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            )}
          </div>

          {mode === "chuyen" && (
            <label className="block space-y-1.5">
              <span className="block text-xs font-semibold text-foreground">
                Điểm Ưu tiên / Khuyến khích (nếu có)
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={4}
                step={0.25}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          )}

          {mode === "custom" && (
            <div className="rounded-xl bg-foreground/[0.04] p-4 dark:bg-foreground/[0.06] space-y-2.5">
              <span className="block text-xs font-semibold text-foreground">
                Tùy chỉnh hệ số từng môn theo quy định địa phương:
              </span>
              <div className="grid grid-cols-3 gap-3 text-xs">
                {[
                  { label: "HS Toán", val: wMath, set: setWMath },
                  { label: "HS Văn", val: wLit, set: setWLit },
                  { label: "HS Môn 3", val: wThird, set: setWThird },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <span className="text-muted-foreground">{item.label}</span>
                    <div className="flex gap-1">
                      {[1, 2].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => item.set(w)}
                          className={cn(
                            "min-h-9 flex-1 rounded-lg font-bold cursor-pointer",
                            item.val === w
                              ? "bg-primary text-primary-foreground"
                              : "bg-background text-muted-foreground",
                          )}
                        >
                          ×{w}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "Không ưu tiên (0)", val: "0" },
              { label: "+0.5 điểm", val: "0.5" },
              { label: "+1.0 điểm", val: "1.0" },
              { label: "+1.5 điểm", val: "1.5" },
              { label: "+2.0 điểm", val: "2.0" },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => setPriority(p.val)}
                className={cn(
                  "min-h-9 rounded-lg px-2.5 text-xs font-semibold cursor-pointer",
                  priority === p.val
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/[0.05] text-muted-foreground hover:text-foreground",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Result */}
        <div className="space-y-5 lg:col-span-5">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tổng điểm xét tuyển
              </span>
              <Badge className="bg-primary/15 text-primary">
                Thang {calc.maxScale}
              </Badge>
            </div>

            <div className="rounded-2xl bg-foreground/[0.04] p-6 text-center dark:bg-foreground/[0.06]">
              <div className="text-xs font-semibold text-muted-foreground">
                Điểm tuyển sinh lớp 10
              </div>
              <div className="mt-1 font-heading text-5xl font-bold text-primary sm:text-6xl">
                {calc.total.toFixed(2)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Trung bình quy đổi: {calc.avgPer10.toFixed(2)} / 10 điểm mỗi môn
              </div>
            </div>

            {calc.zeroSubjects.length > 0 ? (
              <div className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3.5 text-xs text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Lưu ý điều kiện điểm liệt:</strong>{" "}
                  {calc.zeroSubjects.join(", ")} đang ở mức điểm liệt (0 điểm đại trà hoặc ≤ 2.0 môn chuyên).
                </span>
              </div>
            ) : (
              <div className="flex items-start gap-2 rounded-xl bg-primary/10 p-3.5 text-xs text-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span>{calc.tierNote}</span>
              </div>
            )}

            {mode === "hanoi" && (
              <div className="rounded-xl border border-border/60 p-3.5 text-xs text-muted-foreground">
                <strong className="text-foreground">Tham chiếu đối chiếu thang 50 (trước 2025):</strong>{" "}
                Nếu nhân hệ số 2 Toán + Văn như các năm trước, điểm tương ứng là{" "}
                <strong className="text-foreground">{calc.hanoiLegacy50.toFixed(2)} / 50</strong>.
              </div>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-heading text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Đã sao chép kết quả!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Sao chép kết quả dự kiến</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
