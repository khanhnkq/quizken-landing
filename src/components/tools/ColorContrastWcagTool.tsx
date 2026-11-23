"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  Check,
  CheckCircle2,
  Copy,
  Monitor,
  Palette,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type RgbColor = { r: number; g: number; b: number };
type HslColor = { h: number; s: number; l: number };

type ColorPreset = {
  name: string;
  fg: string;
  bg: string;
  note: string;
};

const SLIDE_PRESETS: ColorPreset[] = [
  {
    name: "Slide Trắng • Chữ Đen",
    fg: "#0F172A",
    bg: "#FFFFFF",
    note: "Đọc rõ nhất trên mọi máy chiếu",
  },
  {
    name: "Bảng Phấn Xanh Rêu",
    fg: "#FFFFFF",
    bg: "#14452F",
    note: "Dịu mắt, chuẩn lớp học",
  },
  {
    name: "Giấy Kem • Mực Đậm",
    fg: "#1E293B",
    bg: "#FEFCE8",
    note: "Giảm chói mắt khi đọc lâu",
  },
  {
    name: "Dark Mode Lập trình",
    fg: "#E2E8F0",
    bg: "#0F172A",
    note: "Tương phản cao cho code",
  },
  {
    name: "Navy • Trắng Tinh",
    fg: "#FFFFFF",
    bg: "#1E3A8A",
    note: "Slide tiêu đề chuyên nghiệp",
  },
  {
    name: "Vàng Nổi Bật • Đen",
    fg: "#000000",
    bg: "#FACC15",
    note: "Nhấn mạnh ghi chú quan trọng",
  },
  {
    name: "Tím Indigo • Trắng",
    fg: "#FFFFFF",
    bg: "#4338CA",
    note: "Hiện đại, đạt chuẩn AAA",
  },
  {
    name: "Cảnh báo Đỏ Đậm",
    fg: "#FFFFFF",
    bg: "#991B1B",
    note: "Chú ý / Quy chế phòng thi",
  },
];

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function normalizeHex(raw: string): string | null {
  const cleaned = raw.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(cleaned)) {
    return (
      "#" +
      cleaned
        .split("")
        .map((c) => c + c)
        .join("")
        .toUpperCase()
    );
  }
  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) {
    return "#" + cleaned.toUpperCase();
  }
  return null;
}

function hexToRgb(hex: string): RgbColor {
  const norm = normalizeHex(hex) ?? "#000000";
  return {
    r: parseInt(norm.slice(1, 3), 16),
    g: parseInt(norm.slice(3, 5), 16),
    b: parseInt(norm.slice(5, 7), 16),
  };
}

function rgbToHex({ r, g, b }: RgbColor): string {
  const to2 = (v: number) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
  return `#${to2(r)}${to2(g)}${to2(b)}`.toUpperCase();
}

function rgbToHsl({ r, g, b }: RgbColor): HslColor {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: Math.round(l * 100) };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  h /= 6;

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb({ h, s, l }: HslColor): RgbColor {
  const hn = ((h % 360) + 360) % 360 / 360;
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;

  if (sn === 0) {
    const val = Math.round(ln * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  return {
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  };
}

function relativeLuminance({ r, g, b }: RgbColor): number {
  const linearize = (channel: number) => {
    const srgb = channel / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(fg: RgbColor, bg: RgbColor): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

type ColorEditorPanelProps = {
  title: string;
  hex: string;
  onHexChange: (nextHex: string) => void;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
  keyPrefix: string;
};

function ColorEditorPanel({
  title,
  hex,
  onHexChange,
  copiedKey,
  onCopy,
  keyPrefix,
}: ColorEditorPanelProps) {
  const [hexDraft, setHexDraft] = useState(hex);
  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);

  // Keep draft synced if parent updates hex (e.g., preset or swap)
  const displayedHex =
    normalizeHex(hexDraft) === hex ? hexDraft : hex;

  const handleHexInput = (val: string) => {
    setHexDraft(val);
    const norm = normalizeHex(val);
    if (norm) onHexChange(norm);
  };

  const updateRgb = (part: keyof RgbColor, val: number) => {
    const nextRgb = { ...rgb, [part]: clamp(val || 0, 0, 255) };
    const nextHex = rgbToHex(nextRgb);
    setHexDraft(nextHex);
    onHexChange(nextHex);
  };

  const updateHsl = (part: keyof HslColor, val: number) => {
    const max = part === "h" ? 360 : 100;
    const nextHsl = { ...hsl, [part]: clamp(val || 0, 0, max) };
    const nextHex = rgbToHex(hslToRgb(nextHsl));
    setHexDraft(nextHex);
    onHexChange(nextHex);
  };

  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  return (
    <div className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <span className="font-heading text-base font-bold text-foreground">
          {title}
        </span>
        <div className="flex items-center gap-2">
          <input
            aria-label={`Chọn ${title}`}
            type="color"
            value={hex}
            onChange={(e) => {
              const next = e.target.value.toUpperCase();
              setHexDraft(next);
              onHexChange(next);
            }}
            className="h-9 w-12 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
          />
          <input
            aria-label={`Mã HEX ${title}`}
            type="text"
            value={displayedHex}
            onChange={(e) => handleHexInput(e.target.value)}
            maxLength={7}
            className="h-9 w-24 rounded-xl border border-border bg-background px-2.5 font-mono text-xs font-bold uppercase text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* RGB Inputs */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold">RGB (0–255)</span>
          <button
            type="button"
            onClick={() => onCopy(rgbString, `${keyPrefix}-rgb`)}
            className="inline-flex items-center gap-1 font-mono text-[11px] hover:text-foreground cursor-pointer"
          >
            {copiedKey === `${keyPrefix}-rgb` ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            <span>{rgbString}</span>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(["r", "g", "b"] as const).map((ch) => (
            <label key={ch} className="space-y-1">
              <span className="block text-[11px] font-bold uppercase text-muted-foreground">
                {ch}
              </span>
              <input
                type="number"
                min={0}
                max={255}
                value={rgb[ch]}
                onChange={(e) => updateRgb(ch, Number(e.target.value))}
                className="h-9 w-full rounded-xl border border-border bg-background px-2.5 font-mono text-xs text-foreground"
              />
            </label>
          ))}
        </div>
      </div>

      {/* HSL Inputs */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold">HSL (Hue / Sat / Light)</span>
          <button
            type="button"
            onClick={() => onCopy(hslString, `${keyPrefix}-hsl`)}
            className="inline-flex items-center gap-1 font-mono text-[11px] hover:text-foreground cursor-pointer"
          >
            {copiedKey === `${keyPrefix}-hsl` ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            <span>{hslString}</span>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { key: "h", label: "H (°)", max: 360 },
              { key: "s", label: "S (%)", max: 100 },
              { key: "l", label: "L (%)", max: 100 },
            ] as const
          ).map(({ key, label, max }) => (
            <label key={key} className="space-y-1">
              <span className="block text-[11px] font-bold text-muted-foreground">
                {label}
              </span>
              <input
                type="number"
                min={0}
                max={max}
                value={hsl[key]}
                onChange={(e) => updateHsl(key, Number(e.target.value))}
                className="h-9 w-full rounded-xl border border-border bg-background px-2.5 font-mono text-xs text-foreground"
              />
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onCopy(hex, `${keyPrefix}-hex`)}
        className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-background text-xs font-semibold hover:bg-foreground/[0.05] cursor-pointer"
      >
        {copiedKey === `${keyPrefix}-hex` ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        <span>{copiedKey === `${keyPrefix}-hex` ? `Đã chép ${hex}` : `Chép mã HEX (${hex})`}</span>
      </button>
    </div>
  );
}

function StatusBadge({ pass, label }: { pass: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold",
        pass
          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
          : "bg-rose-500/15 text-rose-700 dark:text-rose-300",
      )}
    >
      {pass ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <XCircle className="h-3.5 w-3.5" />
      )}
      <span>{label}</span>
    </span>
  );
}

export function ColorContrastWcagTool() {
  const [fgHex, setFgHex] = useState("#0F172A");
  const [bgHex, setBgHex] = useState("#FFFFFF");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const ratio = useMemo(
    () => contrastRatio(hexToRgb(fgHex), hexToRgb(bgHex)),
    [fgHex, bgHex],
  );

  const formattedRatio = ratio.toFixed(2);
  const aaNormal = ratio >= 4.5;
  const aaaNormal = ratio >= 7.0;
  const aaLarge = ratio >= 3.0;
  const aaaLarge = ratio >= 4.5;
  const projectorOk = ratio >= 7.0;

  const handleSwap = () => {
    setFgHex(bgHex);
    setBgHex(fgHex);
  };

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <div className="space-y-6">
      {/* Contrast Score & Live Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5 rounded-2xl border border-border/70 bg-card/85 p-6 space-y-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <span className="font-heading text-base font-bold text-foreground">
                Tỷ lệ tương phản WCAG 2.1
              </span>
            </div>
            <button
              type="button"
              onClick={handleSwap}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-semibold hover:bg-foreground/[0.05] cursor-pointer"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <span>Đảo màu</span>
            </button>
          </div>

          <div className="rounded-2xl bg-foreground/[0.04] p-5 text-center space-y-1">
            <div className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              {formattedRatio} : 1
            </div>
            <p className="text-xs font-medium text-muted-foreground">
              Thang chuẩn W3C từ 1:1 (trùng màu) đến 21:1 (đen/trắng tuyệt đối)
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2.5">
              <div>
                <p className="font-bold text-foreground">Chữ thường (Normal Text)</p>
                <p className="text-muted-foreground">Dưới 18pt / 14pt đậm</p>
              </div>
              <div className="flex gap-1.5">
                <StatusBadge pass={aaNormal} label="AA (≥4.5)" />
                <StatusBadge pass={aaaNormal} label="AAA (≥7.0)" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2.5">
              <div>
                <p className="font-bold text-foreground">Chữ lớn (Large Text)</p>
                <p className="text-muted-foreground">Từ 18pt hoặc 14pt đậm</p>
              </div>
              <div className="flex gap-1.5">
                <StatusBadge pass={aaLarge} label="AA (≥3.0)" />
                <StatusBadge pass={aaaLarge} label="AAA (≥4.5)" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-start gap-1.5">
                <Monitor className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-bold text-foreground">Slide máy chiếu lớp học</p>
                  <p className="text-muted-foreground">Khuyến nghị ≥ 7.0:1 chống lóa</p>
                </div>
              </div>
              <StatusBadge
                pass={projectorOk}
                label={projectorOk ? "Rõ nét" : aaNormal ? "Tạm ổn" : "Khó đọc"}
              />
            </div>
          </div>
        </div>

        {/* Live Classroom Slide / Web Preview */}
        <div
          className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-border/70 p-6 sm:p-8 transition-colors"
          style={{ backgroundColor: bgHex, color: fgHex }}
        >
          <div className="space-y-4">
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-bold"
              style={{
                border: `1.5px solid ${fgHex}`,
              }}
            >
              Xem trước Trình chiếu &amp; Giao diện Web
            </span>
            <h2 className="font-heading text-2xl font-extrabold leading-tight sm:text-3xl">
              Bài giảng Tin học 12: Thiết kế Giao diện Web Thân thiện
            </h2>
            <p className="text-sm leading-relaxed sm:text-base opacity-95">
              Đây là đoạn văn bản mẫu kích thước bình thường (16px). Khi chiếu
              lên màn hình lớp học có ánh sáng ban ngày, độ tương phản từ 7.0:1
              trở lên giúp học sinh ngồi cuối lớp vẫn đọc rõ từng chữ mà không bị
              mỏi mắt.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4" style={{ borderColor: `${fgHex}33` }}>
            <span className="font-mono text-xs font-bold">
              Chữ: {fgHex} • Nền: {bgHex}
            </span>
            <span
              className="rounded-xl px-4 py-2 text-xs font-bold"
              style={{ backgroundColor: fgHex, color: bgHex }}
            >
              Nút bấm đảo màu mẫu
            </span>
          </div>
        </div>
      </div>

      {/* Color Pickers */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ColorEditorPanel
          title="Màu Chữ / Tiền cảnh (Foreground)"
          hex={fgHex}
          onHexChange={setFgHex}
          copiedKey={copiedKey}
          onCopy={handleCopy}
          keyPrefix="fg"
        />
        <ColorEditorPanel
          title="Màu Nền (Background)"
          hex={bgHex}
          onHexChange={setBgHex}
          copiedKey={copiedKey}
          onCopy={handleCopy}
          keyPrefix="bg"
        />
      </div>

      {/* 8 High-Contrast Presets */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-3">
        <h3 className="font-heading text-base font-bold text-foreground">
          8 Bộ màu Slide Máy chiếu &amp; Web Độ tương phản cao
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SLIDE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                setFgHex(preset.fg);
                setBgHex(preset.bg);
              }}
              className="group flex items-center gap-3 rounded-xl border border-border/70 bg-background/80 p-3 text-left transition-colors hover:border-primary/60 cursor-pointer"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/50 text-xs font-extrabold"
                style={{ backgroundColor: preset.bg, color: preset.fg }}
              >
                Aa
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-foreground group-hover:text-primary">
                  {preset.name}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {preset.note}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
