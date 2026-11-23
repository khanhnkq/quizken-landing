"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  Play,
  RotateCcw,
  ShieldCheck,
  Terminal,
  Trash2,
  Variable,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { runPythonCode, type PythonRunResult } from "@/lib/pythonMiniInterpreter";
import { cn } from "@/lib/utils";

type PythonPreset = {
  id: string;
  label: string;
  lesson: string;
  code: string;
};

const PRESETS: PythonPreset[] = [
  {
    id: "so-nguyen-to",
    label: "1. Kiểm tra số nguyên tố",
    lesson: "Bài 20–24 Tin học 10",
    code: `# Kiểm tra số nguyên tố & liệt kê số nguyên tố <= 50
def la_so_nguyen_to(n):
    if n < 2:
        return False
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True

n = 29
print(f"{n} là số nguyên tố?" , la_so_nguyen_to(n))

cac_snt = [x for x in range(2, 51) if la_so_nguyen_to(x)]
print("Các số nguyên tố từ 2 đến 50:", cac_snt)
print("Số lượng:", len(cac_snt))`,
  },
  {
    id: "ucln-bcnn",
    label: "2. Tìm ƯCLN & BCNN Euclid",
    lesson: "Thuật toán Euclid • Tin 10",
    code: `# Tìm Ước chung lớn nhất (ƯCLN) & Bội chung nhỏ nhất (BCNN)
def ucln(a, b):
    while b != 0:
        a, b = b, a % b
    return abs(a)

def bcnn(a, b):
    return abs(a * b) // ucln(a, b)

x = 48
y = 180
u = ucln(x, y)
v = bcnn(x, y)

print(f"Hai số: {x} và {y}")
print(f"ƯCLN({x}, {y}) = {u}")
print(f"BCNN({x}, {y}) = {v}")`,
  },
  {
    id: "fib-giai-thua",
    label: "3. Fibonacci & Giai thừa đệ quy",
    lesson: "Hàm & Đệ quy • Tin 10",
    code: `# Đệ quy tính giai thừa n! và dãy Fibonacci
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

print("5! =", factorial(5))
print("7! =", factorial(7))

day_fib = [fib(i) for i in range(10)]
print("10 số Fibonacci đầu tiên:", day_fib)`,
  },
  {
    id: "diem-thi-lop",
    label: "4. Xử lý danh sách điểm thi lớp",
    lesson: "Kiểu List • Tin học 10",
    code: `# Thống kê bảng điểm môn Tin học lớp 10A1
diem_thi = [8.5, 7.0, 9.25, 6.5, 8.0, 9.5, 5.75, 10.0, 7.5, 8.75]

so_hs = len(diem_thi)
diem_tb = sum(diem_thi) / so_hs
cao_nhat = max(diem_thi)
thap_nhat = min(diem_thi)
diem_gioi = [d for d in diem_thi if d >= 8.0]

print(f"Sĩ số: {so_hs} học sinh")
print(f"Điểm trung bình lớp: {diem_tb:.2f}")
print(f"Cao nhất: {cao_nhat} | Thấp nhất: {thap_nhat}")
print(f"Số bài đạt Giỏi (>= 8.0): {len(diem_gioi)} -> {diem_gioi}")
print("Xếp hạng giảm dần:", sorted(diem_thi, reverse=True))`,
  },
  {
    id: "bubble-sort",
    label: "5. Sắp xếp nổi bọt (Bubble Sort)",
    lesson: "Thuật toán sắp xếp • Tin 10–11",
    code: `# Thuật toán Sắp xếp nổi bọt (Bubble Sort)
arr = [64, 34, 25, 12, 22, 11, 90]
print("Mảng ban đầu:", arr)

n = len(arr)
so_lan_doi = 0

for i in range(n - 1):
    for j in range(n - 1 - i):
        if arr[j] > arr[j + 1]:
            arr[j], arr[j + 1] = arr[j + 1], arr[j]
            so_lan_doi += 1

print("Mảng sau khi sắp xếp:", arr)
print("Tổng số lần hoán đổi:", so_lan_doi)`,
  },
  {
    id: "dem-tan-suat-tu",
    label: "6. Đếm tần suất từ trong chuỗi",
    lesson: "Xử lý xâu & Dict • Tin 10",
    code: `# Đếm số lần xuất hiện của mỗi từ trong câu
van_ban = "Học Python thật vui và Python giúp rèn tư duy thuật toán thật tốt"
cac_tu = van_ban.lower().split()

tan_suat = {}
for tu in cac_tu:
    tan_suat[tu] = tan_suat.get(tu, 0) + 1

print("Tổng số từ:", len(cac_tu))
for tu, dem in sorted(tan_suat.items()):
    print(f"- '{tu}': {dem} lần")`,
  },
  {
    id: "pt-bac-2",
    label: "7. Giải phương trình bậc 2",
    lesson: "Cấu trúc rẽ nhánh • Tin 10",
    code: `import math

# Giải phương trình bậc hai: a*x^2 + b*x + c = 0
a = 1
b = -5
c = 6

print(f"Phương trình: {a}x^2 + ({b})x + ({c}) = 0")

if a == 0:
    if b == 0:
        print("Phương trình vô nghiệm" if c != 0 else "Vô số nghiệm")
    else:
        print(f"Nghiệm bậc nhất: x = {-c / b:.2f}")
else:
    delta = b ** 2 - 4 * a * c
    print(f"Delta = {delta}")
    if delta < 0:
        print("Phương trình vô nghiệm thực")
    elif delta == 0:
        x = -b / (2 * a)
        print(f"Nghiệm kép: x1 = x2 = {x:.2f}")
    else:
        x1 = (-b + math.sqrt(delta)) / (2 * a)
        x2 = (-b - math.sqrt(delta)) / (2 * a)
        print(f"Hai nghiệm phân biệt: x1 = {x1:.2f}, x2 = {x2:.2f}")`,
  },
  {
    id: "bang-cuu-chuong",
    label: "8. Bảng cửu chương & Tổng dãy",
    lesson: "Vòng lặp for • Tin 10",
    code: `# In bảng cửu chương số k và tính tổng các số chẵn từ 1..100
k = 7
print(f"=== Bảng cửu chương {k} ===")
for i in range(1, 11):
    print(f"{k} x {i:2d} = {k * i:2d}")

tong_chan = sum([x for x in range(1, 101) if x % 2 == 0])
print("Tổng các số chẵn từ 1 đến 100 là:", tong_chan)`,
  },
];

export function PythonRunnerTool() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESETS[0].id);
  const [code, setCode] = useState<string>(PRESETS[0].code);
  const [result, setResult] = useState<PythonRunResult>(() => runPythonCode(PRESETS[0].code));
  const [copied, setCopied] = useState(false);

  const activePreset = useMemo(
    () => PRESETS.find((p) => p.id === selectedPresetId) ?? PRESETS[0],
    [selectedPresetId],
  );

  const handleRun = () => {
    setResult(runPythonCode(code));
  };

  const handleSelectPreset = (preset: PythonPreset) => {
    setSelectedPresetId(preset.id);
    setCode(preset.code);
    setResult(runPythonCode(preset.code));
  };

  const handleReset = () => {
    setCode(activePreset.code);
    setResult(runPythonCode(activePreset.code));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleDownloadPy = () => {
    const blob = new Blob([code], { type: "text/x-python;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedPresetId || "bai_thuc_hanh"}.py`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRun();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const next = code.slice(0, start) + "    " + code.slice(end);
      setCode(next);
      requestAnimationFrame(() => {
        target.selectionStart = start + 4;
        target.selectionEnd = start + 4;
      });
    }
  };

  const varEntries = Object.entries(result.variables);
  const lineCount = code.split("\n").length;

  return (
    <div className="space-y-6">
      {/* Safety Banner + Presets */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>100% Trình duyệt • Giới hạn an toàn 10.000 bước</span>
            </Badge>
            <span className="text-xs text-muted-foreground">
              {activePreset.lesson} • Ctrl+Enter để chạy nhanh
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRun}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Chạy code (Run)</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border/70 bg-background/70 px-3 text-xs font-semibold text-foreground transition-colors hover:bg-foreground/[0.06] cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Khôi phục mẫu</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border/70 bg-background/70 px-3 text-xs font-semibold text-foreground transition-colors hover:bg-foreground/[0.06] cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Đã chép" : "Chép code"}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPy}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border/70 bg-background/70 px-3 text-xs font-semibold text-foreground transition-colors hover:bg-foreground/[0.06] cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Tải .py</span>
            </button>
          </div>
        </div>

        {/* 8 SGK Tin hoc 10 Presets */}
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            8 Bài mẫu SGK Tin học 10 GDPT 2018:
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => {
              const active = preset.id === selectedPresetId;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={cn(
                    "min-h-9 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/[0.05] text-muted-foreground hover:bg-foreground/[0.09] hover:text-foreground",
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Split Editor + Output / Variable Inspector */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Python Code Editor */}
        <div className="lg:col-span-7 flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/85">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              <span className="font-heading text-sm font-bold text-foreground">
                Trình soạn thảo Python 3
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {lineCount} dòng • Tab = 4 dấu cách
            </span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleEditorKeyDown}
            spellCheck={false}
            aria-label="Trình soạn thảo mã nguồn Python"
            className="min-h-[380px] w-full flex-1 resize-y bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-100 outline-none sm:text-sm"
          />
        </div>

        {/* Console Output + Variable Inspector */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Console Output */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/85">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="font-heading text-sm font-bold text-foreground">
                  Kết quả Console (stdout)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-foreground/[0.06] px-2 py-0.5 font-mono text-[11px] font-semibold text-muted-foreground">
                  {result.stepsExecuted.toLocaleString("vi-VN")} bước • {result.durationMs} ms
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setResult({
                      output: [],
                      stepsExecuted: 0,
                      durationMs: 0,
                      variables: {},
                    })
                  }
                  title="Xóa console"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="min-h-[200px] max-h-[280px] overflow-auto bg-slate-950 p-4 font-mono text-xs leading-6 text-emerald-300 sm:text-sm">
              {result.output.length === 0 && !result.error ? (
                <p className="text-slate-500 italic">
                  (Chưa có dữ liệu in ra từ lệnh print(). Nhấn &quot;Chạy code&quot; để thực thi.)
                </p>
              ) : (
                result.output.map((line, idx) => (
                  <div key={`${idx}-${line}`} className="whitespace-pre-wrap break-words">
                    {line}
                  </div>
                ))
              )}

              {result.error && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-500/40 bg-rose-950/60 p-3 text-xs text-rose-200">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                  <span>{result.error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Variable Inspector */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/85">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <Variable className="h-4 w-4 text-primary" />
                <span className="font-heading text-sm font-bold text-foreground">
                  Bảng Theo Dõi Biến (Variables)
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {varEntries.length} biến toàn cục
              </span>
            </div>

            <div className="max-h-[200px] overflow-auto">
              {varEntries.length === 0 ? (
                <p className="p-4 text-xs text-muted-foreground">
                  Chưa có biến nào được khởi tạo.
                </p>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/60 bg-foreground/[0.03] text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Tên biến</th>
                      <th className="px-4 py-2 font-semibold">Giá trị cuối cùng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 font-mono">
                    {varEntries.map(([name, val]) => (
                      <tr key={name} className="hover:bg-foreground/[0.02]">
                        <td className="px-4 py-2 font-semibold text-primary">{name}</td>
                        <td className="px-4 py-2 break-all text-foreground">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
