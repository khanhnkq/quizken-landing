"use client";

import { useMemo, useState } from "react";
import {
  Atom,
  Check,
  Copy,
  Gauge,
  HardDrive,
  RotateCcw,
  Ruler,
  Scale,
  Thermometer,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type CategoryId =
  | "pressure"
  | "temperature"
  | "energy"
  | "speed"
  | "data"
  | "length"
  | "mass";

type UnitDef = {
  id: string;
  symbol: string;
  name: string;
  note?: string;
  /** Multiply value in this unit by factorToBase to get base unit (linear categories). */
  factorToBase?: number;
  toBase?: (value: number) => number;
  fromBase?: (base: number) => number;
};

type CategoryDef = {
  id: CategoryId;
  label: string;
  shortLabel: string;
  subjectTag: string;
  baseSymbol: string;
  defaultUnitId: string;
  defaultValue: string;
  presets: Array<{ label: string; value: string; unitId: string }>;
  examTip: string;
  units: UnitDef[];
};

const CATEGORIES: CategoryDef[] = [
  {
    id: "pressure",
    label: "Áp suất (Hóa / Lý)",
    shortLabel: "Áp suất",
    subjectTag: "Hóa học • Vật lý",
    baseSymbol: "Pa",
    defaultUnitId: "atm",
    defaultValue: "1",
    presets: [
      { label: "1 atm (ĐKT cũ)", value: "1", unitId: "atm" },
      { label: "1 bar (ĐKC 2018)", value: "1", unitId: "bar" },
      { label: "760 mmHg", value: "760", unitId: "mmhg" },
      { label: "101.325 kPa", value: "101.325", unitId: "kpa" },
    ],
    examTip:
      "Chương trình GDPT 2018 (Hóa học): Điều kiện chuẩn mới là 25 °C (298,15 K) và áp suất 1 bar = 100.000 Pa = 10⁵ Pa (1 mol khí chiếm 24,79 lít). Trong Vật lý khí lý tưởng: 1 atm = 101.325 Pa = 760 mmHg.",
    units: [
      { id: "pa", symbol: "Pa", name: "Pascal (SI)", factorToBase: 1 },
      { id: "kpa", symbol: "kPa", name: "Kilopascal", factorToBase: 1e3 },
      { id: "mpa", symbol: "MPa", name: "Megapascal", factorToBase: 1e6 },
      {
        id: "atm",
        symbol: "atm",
        name: "Atmosphere chuẩn",
        note: "1 atm = 101.325 Pa",
        factorToBase: 101325,
      },
      {
        id: "mmhg",
        symbol: "mmHg (Torr)",
        name: "Milimét thủy ngân",
        note: "760 mmHg = 1 atm",
        factorToBase: 101325 / 760,
      },
      {
        id: "bar",
        symbol: "bar",
        name: "Bar (ĐKC GDPT 2018)",
        note: "1 bar = 10⁵ Pa",
        factorToBase: 1e5,
      },
      { id: "mbar", symbol: "mbar", name: "Milibar (= hPa)", factorToBase: 100 },
      {
        id: "psi",
        symbol: "psi",
        name: "Pound / inch²",
        factorToBase: 6894.757293168361,
      },
    ],
  },
  {
    id: "temperature",
    label: "Nhiệt độ",
    shortLabel: "Nhiệt độ",
    subjectTag: "Vật lý 12 • Hóa học",
    baseSymbol: "K",
    defaultUnitId: "c",
    defaultValue: "25",
    presets: [
      { label: "0 °C (Đóng băng)", value: "0", unitId: "c" },
      { label: "25 °C (ĐKC)", value: "25", unitId: "c" },
      { label: "100 °C (Sôi)", value: "100", unitId: "c" },
      { label: "0 K (Không tuyệt đối)", value: "0", unitId: "k" },
    ],
    examTip:
      "Công thức chuẩn: T(K) = t(°C) + 273,15 (trong nhiều bài thi THPT Vật lý/Hóa học có thể làm tròn +273) và T(°F) = t(°C) × 9/5 + 32. Lưu ý: Độ biến thiên ΔT(K) = Δt(°C).",
    units: [
      {
        id: "c",
        symbol: "°C",
        name: "Độ Celsius",
        note: "t(°C) = T(K) − 273,15",
        toBase: (v) => v + 273.15,
        fromBase: (k) => k - 273.15,
      },
      {
        id: "k",
        symbol: "K",
        name: "Độ Kelvin (SI)",
        note: "T(K) = t(°C) + 273,15",
        toBase: (v) => v,
        fromBase: (k) => k,
      },
      {
        id: "f",
        symbol: "°F",
        name: "Độ Fahrenheit",
        note: "T(°F) = t(°C) × 1,8 + 32",
        toBase: (v) => ((v - 32) * 5) / 9 + 273.15,
        fromBase: (k) => ((k - 273.15) * 9) / 5 + 32,
      },
    ],
  },
  {
    id: "energy",
    label: "Năng lượng & Công",
    shortLabel: "Năng lượng",
    subjectTag: "Vật lý 10–12 • Hóa học",
    baseSymbol: "J",
    defaultUnitId: "ev",
    defaultValue: "1",
    presets: [
      { label: "1 eV", value: "1", unitId: "ev" },
      { label: "1 MeV (Hạt nhân)", value: "1", unitId: "mev" },
      { label: "1 kWh (Số điện)", value: "1", unitId: "kwh" },
      { label: "1 kcal (Nhiệt)", value: "1", unitId: "kcal" },
    ],
    examTip:
      "Trong Vật lý hạt nhân & Quang lượng tử: 1 eV = 1,602176634 × 10⁻¹⁹ J (thường làm tròn 1,6 × 10⁻¹⁹ J); 1 MeV = 10⁶ eV. Trong Hóa nhiệt học: 1 cal = 4,184 J; 1 kWh = 3,6 × 10⁶ J.",
    units: [
      { id: "j", symbol: "J", name: "Joule (SI)", factorToBase: 1 },
      { id: "kj", symbol: "kJ", name: "Kilojoule", factorToBase: 1e3 },
      {
        id: "cal",
        symbol: "cal",
        name: "Calorie (nhiệt hóa)",
        note: "1 cal = 4,184 J",
        factorToBase: 4.184,
      },
      { id: "kcal", symbol: "kcal", name: "Kilocalorie", factorToBase: 4184 },
      {
        id: "kwh",
        symbol: "kWh",
        name: "Kilowatt-giờ",
        note: "1 kWh = 3,6 × 10⁶ J",
        factorToBase: 3.6e6,
      },
      {
        id: "ev",
        symbol: "eV",
        name: "Electron-volt",
        note: "1 eV ≈ 1,602 × 10⁻¹⁹ J",
        factorToBase: 1.602176634e-19,
      },
      {
        id: "mev",
        symbol: "MeV",
        name: "Mega electron-volt",
        note: "1 MeV = 10⁶ eV",
        factorToBase: 1.602176634e-13,
      },
    ],
  },
  {
    id: "speed",
    label: "Tốc độ & Chuyển động",
    shortLabel: "Tốc độ",
    subjectTag: "Vật lý 10",
    baseSymbol: "m/s",
    defaultUnitId: "kmh",
    defaultValue: "36",
    presets: [
      { label: "36 km/h", value: "36", unitId: "kmh" },
      { label: "72 km/h", value: "72", unitId: "kmh" },
      { label: "340 m/s (Âm thanh)", value: "340", unitId: "ms" },
      { label: "60 mph", value: "60", unitId: "mph" },
    ],
    examTip:
      "Mẹo đổi nhanh trong bài toán Cơ học: từ km/h sang m/s chia cho 3,6 (ví dụ 36 km/h = 10 m/s; 54 km/h = 15 m/s; 72 km/h = 20 m/s). Ngược lại từ m/s sang km/h nhân với 3,6.",
    units: [
      { id: "ms", symbol: "m/s", name: "Mét trên giây (SI)", factorToBase: 1 },
      {
        id: "kmh",
        symbol: "km/h",
        name: "Kilômét trên giờ",
        note: "÷ 3,6 ra m/s",
        factorToBase: 1 / 3.6,
      },
      { id: "cms", symbol: "cm/s", name: "Xentimét trên giây", factorToBase: 0.01 },
      {
        id: "mph",
        symbol: "mph",
        name: "Dặm trên giờ",
        note: "1 mph = 0,44704 m/s",
        factorToBase: 0.44704,
      },
    ],
  },
  {
    id: "data",
    label: "Dung lượng Dữ liệu (Tin học)",
    shortLabel: "Dữ liệu",
    subjectTag: "Tin học THPT • ĐH",
    baseSymbol: "bit",
    defaultUnitId: "gib",
    defaultValue: "1",
    presets: [
      { label: "1 Byte = 8 bit", value: "1", unitId: "byte" },
      { label: "1 KiB (1024 B)", value: "1", unitId: "kib" },
      { label: "1 GiB (RAM/HĐH)", value: "1", unitId: "gib" },
      { label: "100 Mbps (bit/s)", value: "100", unitId: "mb" },
    ],
    examTip:
      "Phân biệt chuẩn thập phân SI (KB = 10³ Byte, MB = 10⁶ Byte, GB = 10⁹ Byte dùng cho ổ cứng & tốc độ mạng) với chuẩn nhị phân IEC (KiB = 2¹⁰ = 1.024 Byte, MiB = 2²⁰ Byte, GiB = 2³⁰ Byte dùng trong SGK Tin học & RAM).",
    units: [
      { id: "bit", symbol: "bit", name: "Bit (b)", factorToBase: 1 },
      {
        id: "byte",
        symbol: "Byte",
        name: "Byte (B = 8 bit)",
        factorToBase: 8,
      },
      {
        id: "kb",
        symbol: "KB (10³)",
        name: "Kilobyte (SI)",
        note: "1.000 Byte",
        factorToBase: 8e3,
      },
      {
        id: "kib",
        symbol: "KiB (2¹⁰)",
        name: "Kibibyte (IEC)",
        note: "1.024 Byte",
        factorToBase: 8 * 1024,
      },
      {
        id: "mb",
        symbol: "MB",
        name: "Megabyte (10⁶ B)",
        factorToBase: 8e6,
      },
      {
        id: "mib",
        symbol: "MiB",
        name: "Mebibyte (2²⁰ B)",
        factorToBase: 8 * 1024 * 1024,
      },
      {
        id: "gb",
        symbol: "GB",
        name: "Gigabyte (10⁹ B)",
        factorToBase: 8e9,
      },
      {
        id: "gib",
        symbol: "GiB",
        name: "Gibibyte (2³⁰ B)",
        factorToBase: 8 * 1024 * 1024 * 1024,
      },
      {
        id: "tb",
        symbol: "TB",
        name: "Terabyte (10¹² B)",
        factorToBase: 8e12,
      },
    ],
  },
  {
    id: "length",
    label: "Chiều dài & Bước sóng",
    shortLabel: "Bước sóng",
    subjectTag: "Vật lý Sóng • Sinh học",
    baseSymbol: "m",
    defaultUnitId: "nm",
    defaultValue: "500",
    presets: [
      { label: "500 nm (Ánh sáng lục)", value: "500", unitId: "nm" },
      { label: "0.5 μm", value: "0.5", unitId: "um" },
      { label: "3.4 Å (Cặp nu ADN)", value: "3.4", unitId: "angstrom" },
      { label: "1 km", value: "1", unitId: "km" },
    ],
    examTip:
      "Trong Quang học & Sinh học phân tử: 1 μm = 10⁻⁶ m, 1 nm = 10⁻⁹ m, 1 Å = 10⁻¹⁰ m = 0,1 nm. Ví dụ chiều dài 1 cặp nucleotide của phân tử ADN là 3,4 Å = 0,34 nm.",
    units: [
      { id: "km", symbol: "km", name: "Kilômét", factorToBase: 1e3 },
      { id: "m", symbol: "m", name: "Mét (SI)", factorToBase: 1 },
      { id: "dm", symbol: "dm", name: "Đềximét", factorToBase: 0.1 },
      { id: "cm", symbol: "cm", name: "Xentimét", factorToBase: 0.01 },
      { id: "mm", symbol: "mm", name: "Milimét", factorToBase: 1e-3 },
      {
        id: "um",
        symbol: "μm",
        name: "Micrômét",
        note: "10⁻⁶ m",
        factorToBase: 1e-6,
      },
      {
        id: "nm",
        symbol: "nm",
        name: "Nanômét",
        note: "10⁻⁹ m",
        factorToBase: 1e-9,
      },
      {
        id: "angstrom",
        symbol: "Å",
        name: "Angstrom",
        note: "10⁻¹⁰ m = 0,1 nm",
        factorToBase: 1e-10,
      },
    ],
  },
  {
    id: "mass",
    label: "Khối lượng & Nguyên tử",
    shortLabel: "Khối lượng",
    subjectTag: "Vật lý • Hóa học",
    baseSymbol: "kg",
    defaultUnitId: "u",
    defaultValue: "12",
    presets: [
      { label: "12 u (Cacbon-12)", value: "12", unitId: "u" },
      { label: "1 tấn", value: "1", unitId: "tan" },
      { label: "250 g", value: "250", unitId: "g" },
      { label: "1 mg", value: "1", unitId: "mg" },
    ],
    examTip:
      "Đơn vị khối lượng nguyên tử (u / amu / đvC): 1 u = 1/12 khối lượng nguyên tử ¹²C ≈ 1,66054 × 10⁻²⁷ kg. Quy đổi nông nghiệp/đời sống: 1 tấn = 10 tạ = 100 yến = 1.000 kg.",
    units: [
      { id: "tan", symbol: "tấn", name: "Tấn (t)", factorToBase: 1000 },
      { id: "ta", symbol: "tạ", name: "Tạ", factorToBase: 100 },
      { id: "yen", symbol: "yến", name: "Yến", factorToBase: 10 },
      { id: "kg", symbol: "kg", name: "Kilôgam (SI)", factorToBase: 1 },
      { id: "g", symbol: "g", name: "Gam", factorToBase: 1e-3 },
      { id: "mg", symbol: "mg", name: "Miligam", factorToBase: 1e-6 },
      {
        id: "u",
        symbol: "u (amu)",
        name: "Đơn vị khối lượng nguyên tử",
        note: "≈ 1,6605 × 10⁻²⁷ kg",
        factorToBase: 1.6605390666e-27,
      },
    ],
  },
];

function CategoryIcon({ id, className }: { id: CategoryId; className?: string }) {
  switch (id) {
    case "pressure":
      return <Gauge className={className} />;
    case "temperature":
      return <Thermometer className={className} />;
    case "energy":
      return <Zap className={className} />;
    case "speed":
      return <Atom className={className} />;
    case "data":
      return <HardDrive className={className} />;
    case "length":
      return <Ruler className={className} />;
    case "mass":
      return <Scale className={className} />;
  }
}

function formatConvertedValue(num: number): string {
  if (!Number.isFinite(num)) return "—";
  if (Math.abs(num) === 0) return "0";
  const abs = Math.abs(num);
  if (abs >= 1e12 || abs < 1e-6) {
    return num.toExponential(6).replace(/\.?0+e/, "e");
  }
  const rounded = Number(num.toPrecision(10));
  return rounded.toLocaleString("en-US", {
    maximumFractionDigits: 8,
  });
}

function convertUnit(
  value: number,
  fromUnit: UnitDef,
  toUnit: UnitDef
): number {
  if (!Number.isFinite(value)) return Number.NaN;
  if (fromUnit.id === toUnit.id) return value;

  if (fromUnit.toBase && toUnit.fromBase) {
    return toUnit.fromBase(fromUnit.toBase(value));
  }
  const baseVal = value * (fromUnit.factorToBase ?? 1);
  return baseVal / (toUnit.factorToBase ?? 1);
}

export function UnitConverterSiTool() {
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>("pressure");
  const [sourceUnitId, setSourceUnitId] = useState<string>("atm");
  const [rawValue, setRawValue] = useState<string>("1");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const category = useMemo(
    () => CATEGORIES.find((c) => c.id === activeCategoryId) ?? CATEGORIES[0],
    [activeCategoryId]
  );

  const sourceUnit = useMemo(
    () => category.units.find((u) => u.id === sourceUnitId) ?? category.units[0],
    [category, sourceUnitId]
  );

  const parsedValue = useMemo(() => {
    const normalized = rawValue.trim().replace(/,/g, ".");
    if (!normalized) return Number.NaN;
    const n = Number(normalized);
    return Number.isFinite(n) ? n : Number.NaN;
  }, [rawValue]);

  const results = useMemo(() => {
    return category.units.map((unit) => {
      const numeric = convertUnit(parsedValue, sourceUnit, unit);
      return {
        unit,
        numeric,
        formatted: formatConvertedValue(numeric),
      };
    });
  }, [category, parsedValue, sourceUnit]);

  const handleSelectCategory = (cat: CategoryDef) => {
    setActiveCategoryId(cat.id);
    setSourceUnitId(cat.defaultUnitId);
    setRawValue(cat.defaultValue);
    setCopiedId(null);
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1600);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Selector Tabs */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-3 sm:p-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {CATEGORIES.map((cat) => {
            const active = cat.id === category.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat)}
                className={cn(
                  "flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border/60 bg-background/60 text-foreground hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                <CategoryIcon id={cat.id} className="h-4 w-4 shrink-0" />
                <span className="truncate">{cat.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input & Presets Card */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                {category.label}
              </h2>
              <Badge className="bg-primary/15 text-primary">
                {category.subjectTag}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Nhập giá trị ở một đơn vị bất kỳ — toàn bộ đơn vị còn lại tự động quy đổi đồng thời
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSourceUnitId(category.defaultUnitId);
              setRawValue(category.defaultValue);
            }}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border/70 bg-background/70 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Đặt lại mặc định</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-7 space-y-1.5">
            <label
              htmlFor="si-input-value"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Giá trị cần quy đổi
            </label>
            <input
              id="si-input-value"
              type="text"
              inputMode="decimal"
              value={rawValue}
              onChange={(e) => setRawValue(e.target.value)}
              placeholder="Ví dụ: 1, 25, 1.5e-3..."
              className="w-full min-h-12 rounded-xl border border-border bg-background px-4 font-mono text-lg font-bold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="md:col-span-5 space-y-1.5">
            <label
              htmlFor="si-source-unit"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Đơn vị nguồn
            </label>
            <select
              id="si-source-unit"
              value={sourceUnit.id}
              onChange={(e) => setSourceUnitId(e.target.value)}
              className="w-full min-h-12 rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {category.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.symbol} — {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">
            Mẫu thi nhanh:
          </span>
          {category.presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setSourceUnitId(preset.unitId);
                setRawValue(preset.value);
              }}
              className="rounded-lg border border-border/70 bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground hover:border-primary/60 hover:bg-primary/5 transition-colors cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* All-at-once Results Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map(({ unit, formatted }) => {
          const isSource = unit.id === sourceUnit.id;
          const isCopied = copiedId === unit.id;
          return (
            <div
              key={unit.id}
              className={cn(
                "flex flex-col justify-between rounded-2xl border p-4 transition-all",
                isSource
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border/70 bg-card/85 hover:border-primary/40"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSourceUnitId(unit.id);
                    if (formatted !== "—") {
                      setRawValue(formatted.replace(/,/g, ""));
                    }
                  }}
                  className="text-left cursor-pointer group"
                  title="Đặt làm đơn vị nguồn"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {unit.symbol}
                    </span>
                    {isSource && (
                      <span className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                        Nguồn
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{unit.name}</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(unit.id, `${formatted} ${unit.symbol}`)}
                  disabled={formatted === "—"}
                  aria-label={`Sao chép kết quả ${unit.symbol}`}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-background/70 text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer"
                >
                  {isCopied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              <div className="mt-3 space-y-1">
                <div className="font-mono text-xl font-bold tracking-tight text-foreground break-all">
                  {formatted}
                </div>
                {unit.note && (
                  <p className="text-[11px] font-medium text-muted-foreground">
                    {unit.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Temperature Formula Callout when on temperature */}
      {category.id === "temperature" && Number.isFinite(parsedValue) && (
        <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5 space-y-2">
          <h3 className="font-heading text-sm font-bold text-foreground">
            Công thức biến đổi trực tiếp từ {formatConvertedValue(parsedValue)} {sourceUnit.symbol}
          </h3>
          <div className="grid grid-cols-1 gap-2 font-mono text-xs sm:grid-cols-3 text-muted-foreground">
            <div className="rounded-xl bg-background/80 p-3 border border-border/60">
              <span className="font-semibold text-foreground">°C ↔ K:</span>{" "}
              T(K) = t(°C) + 273,15
            </div>
            <div className="rounded-xl bg-background/80 p-3 border border-border/60">
              <span className="font-semibold text-foreground">°C ↔ °F:</span>{" "}
              T(°F) = t(°C) × 9/5 + 32
            </div>
            <div className="rounded-xl bg-background/80 p-3 border border-border/60">
              <span className="font-semibold text-foreground">°F ↔ °C:</span>{" "}
              t(°C) = (T(°F) − 32) × 5/9
            </div>
          </div>
        </div>
      )}

      {/* Exam Tip Box */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
          <Atom className="h-4 w-4" />
          <span>Lưu ý ôn thi THPT & GDPT 2018</span>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {category.examTip}
        </p>
      </div>
    </div>
  );
}
