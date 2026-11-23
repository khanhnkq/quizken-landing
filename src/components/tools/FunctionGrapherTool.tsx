"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  AlertCircle,
  LineChart,
} from "lucide-react";
import { compileMathExpression } from "@/lib/mathExprParser";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface CurveItem {
  id: string;
  expr: string;
  color: string;
  visible: boolean;
}

const CURVE_COLORS = ["#16a34a", "#2563eb", "#ea580c", "#9333ea"];

const PRESETS: Array<{ label: string; curves: string[]; range?: [number, number, number, number] }> = [
  {
    label: "Hàm bậc 3 (x³ - 3x + 1)",
    curves: ["x^3 - 3x + 1", "3x^2 - 3"],
    range: [-4, 4, -5, 5],
  },
  {
    label: "Phân thức (2x+1)/(x-1)",
    curves: ["(2x+1)/(x-1)", "2"],
    range: [-6, 8, -6, 10],
  },
  {
    label: "Parabol & Đường thẳng",
    curves: ["x^2 - 2x - 3", "x + 1"],
    range: [-4, 6, -5, 8],
  },
  {
    label: "Lượng giác sin / cos",
    curves: ["2*sin(x)", "cos(2x)"],
    range: [-6.5, 6.5, -3.5, 3.5],
  },
];

const SVG_W = 640;
const SVG_H = 420;

export function FunctionGrapherTool() {
  const [curves, setCurves] = useState<CurveItem[]>([
    { id: "c1", expr: "x^3 - 3x + 1", color: CURVE_COLORS[0], visible: true },
    { id: "c2", expr: "3x^2 - 3", color: CURVE_COLORS[1], visible: true },
  ]);

  const [xMin, setXMin] = useState(-5);
  const [xMax, setXMax] = useState(5);
  const [yMin, setYMin] = useState(-5);
  const [yMax, setYMax] = useState(5);
  const [hoverX, setHoverX] = useState<number | null>(null);

  const compiled = useMemo(
    () =>
      curves.map((c) => ({
        ...c,
        compiled: compileMathExpression(c.expr),
      })),
    [curves]
  );

  const safeBounds = useMemo(() => {
    const lxMin = Number.isFinite(xMin) ? xMin : -5;
    const lxMax = Number.isFinite(xMax) && xMax > lxMin ? xMax : lxMin + 10;
    const lyMin = Number.isFinite(yMin) ? yMin : -5;
    const lyMax = Number.isFinite(yMax) && yMax > lyMin ? yMax : lyMin + 10;
    return { xMin: lxMin, xMax: lxMax, yMin: lyMin, yMax: lyMax };
  }, [xMin, xMax, yMin, yMax]);

  const toSvgX = (x: number) =>
    ((x - safeBounds.xMin) / (safeBounds.xMax - safeBounds.xMin)) * SVG_W;
  const toSvgY = (y: number) =>
    SVG_H - ((y - safeBounds.yMin) / (safeBounds.yMax - safeBounds.yMin)) * SVG_H;

  const gridTicks = useMemo(() => {
    const calcStep = (span: number) => {
      const raw = span / 10;
      const pow = Math.pow(10, Math.floor(Math.log10(raw)));
      const norm = raw / pow;
      if (norm <= 1) return pow;
      if (norm <= 2) return 2 * pow;
      if (norm <= 5) return 5 * pow;
      return 10 * pow;
    };

    const xStep = calcStep(safeBounds.xMax - safeBounds.xMin);
    const yStep = calcStep(safeBounds.yMax - safeBounds.yMin);

    const xs: number[] = [];
    for (
      let x = Math.ceil(safeBounds.xMin / xStep) * xStep;
      x <= safeBounds.xMax;
      x += xStep
    ) {
      xs.push(Number(x.toFixed(6)));
    }

    const ys: number[] = [];
    for (
      let y = Math.ceil(safeBounds.yMin / yStep) * yStep;
      y <= safeBounds.yMax;
      y += yStep
    ) {
      ys.push(Number(y.toFixed(6)));
    }

    return { xs, ys };
  }, [safeBounds]);

  const curvePaths = useMemo(() => {
    const samples = 420;
    const spanX = safeBounds.xMax - safeBounds.xMin;
    const spanY = safeBounds.yMax - safeBounds.yMin;
    const mapX = (x: number) =>
      ((x - safeBounds.xMin) / spanX) * SVG_W;
    const mapY = (y: number) =>
      SVG_H - ((y - safeBounds.yMin) / spanY) * SVG_H;

    return compiled.map((item) => {
      if (!item.visible || !item.compiled.fn) return { ...item, d: "" };
      const fn = item.compiled.fn;
      const segments: string[] = [];
      let penDown = false;
      let prevY = 0;

      for (let i = 0; i <= samples; i++) {
        const x = safeBounds.xMin + (i / samples) * spanX;
        const y = fn(x);
        if (!Number.isFinite(y) || Math.abs(y) > 1e6) {
          penDown = false;
          continue;
        }
        // Guard against vertical asymptote jump (e.g. 1/(x-1) or tan(x))
        if (penDown && Math.abs(y - prevY) > spanY * 1.4) {
          penDown = false;
        }
        const sx = mapX(x);
        const sy = mapY(y);
        if (sy < -SVG_H || sy > SVG_H * 2) {
          penDown = false;
          prevY = y;
          continue;
        }
        segments.push(
          `${penDown ? "L" : "M"}${sx.toFixed(2)},${sy.toFixed(2)}`
        );
        penDown = true;
        prevY = y;
      }

      return { ...item, d: segments.join(" ") };
    });
  }, [compiled, safeBounds]);

  const handleZoom = (factor: number) => {
    const cx = (safeBounds.xMin + safeBounds.xMax) / 2;
    const cy = (safeBounds.yMin + safeBounds.yMax) / 2;
    const hx = ((safeBounds.xMax - safeBounds.xMin) / 2) * factor;
    const hy = ((safeBounds.yMax - safeBounds.yMin) / 2) * factor;
    setXMin(Number((cx - hx).toFixed(2)));
    setXMax(Number((cx + hx).toFixed(2)));
    setYMin(Number((cy - hy).toFixed(2)));
    setYMax(Number((cy + hy).toFixed(2)));
  };

  const handleResetView = () => {
    setXMin(-5);
    setXMax(5);
    setYMin(-5);
    setYMax(5);
  };

  const handleAddCurve = () => {
    if (curves.length >= 4) return;
    const color = CURVE_COLORS[curves.length % CURVE_COLORS.length];
    setCurves((prev) => [
      ...prev,
      { id: `c-${Date.now()}`, expr: "x", color, visible: true },
    ]);
  };

  const handleDownloadSvg = () => {
    const svgEl = document.getElementById("quizken-function-graph-svg");
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    const str = serializer.serializeToString(svgEl);
    const blob = new Blob([str], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "do-thi-ham-so-quizken.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const axisX = toSvgY(0);
  const axisY = toSvgX(0);

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {/* Left Controls */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-5">
        <div className="flex items-center justify-between">
          <Badge className="bg-primary/15 text-primary">
            <LineChart className="h-3.5 w-3.5" />
            Danh sách hàm số (tối đa 4)
          </Badge>
          {curves.length < 4 && (
            <button
              type="button"
              onClick={handleAddCurve}
              className="inline-flex min-h-8 cursor-pointer items-center gap-1 rounded-lg bg-foreground/[0.06] px-2.5 text-xs font-bold text-foreground hover:bg-foreground/[0.1]"
            >
              <Plus className="h-3.5 w-3.5" />
              Thêm hàm
            </button>
          )}
        </div>

        <div className="space-y-3">
          {compiled.map((c, idx) => (
            <div key={c.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="h-3.5 w-3.5 shrink-0 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                <span className="text-xs font-bold text-muted-foreground">
                  y{idx + 1} =
                </span>
                <input
                  type="text"
                  aria-label={`Biểu thức hàm số ${idx + 1}`}
                  value={c.expr}
                  onChange={(e) =>
                    setCurves((prev) =>
                      prev.map((item) =>
                        item.id === c.id ? { ...item, expr: e.target.value } : item
                      )
                    )
                  }
                  placeholder="VD: x^3 - 3x + 1"
                  className="h-10 flex-1 rounded-xl border border-border/70 bg-background px-3 font-mono text-sm text-foreground focus:border-primary focus:outline-none"
                />
                {curves.length > 1 && (
                  <button
                    type="button"
                    aria-label="Xóa hàm"
                    onClick={() =>
                      setCurves((prev) => prev.filter((item) => item.id !== c.id))
                    }
                    className="cursor-pointer rounded-lg p-2 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              {c.compiled.error && (
                <div className="flex items-center gap-1 pl-6 text-[11px] text-destructive">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{c.compiled.error}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Presets */}
        <div className="space-y-2 border-t border-border/60 pt-4">
          <div className="text-xs font-bold uppercase text-muted-foreground">
            Hàm số THPT hay gặp:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setCurves(
                    p.curves.map((expr, idx) => ({
                      id: `p-${idx}-${Date.now()}`,
                      expr,
                      color: CURVE_COLORS[idx % CURVE_COLORS.length],
                      visible: true,
                    }))
                  );
                  if (p.range) {
                    setXMin(p.range[0]);
                    setXMax(p.range[1]);
                    setYMin(p.range[2]);
                    setYMax(p.range[3]);
                  }
                }}
                className="min-h-8 cursor-pointer rounded-lg bg-foreground/[0.05] px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-foreground/[0.09]"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Viewport Ranges */}
        <div className="space-y-2 border-t border-border/60 pt-4">
          <div className="text-xs font-bold uppercase text-muted-foreground">
            Phạm vi trục tọa độ
          </div>
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div>
              <label className="text-muted-foreground">x từ</label>
              <input
                type="number"
                value={xMin}
                onChange={(e) => setXMin(Number(e.target.value))}
                className="mt-1 h-9 w-full rounded-lg border border-border/70 bg-background px-2.5 font-mono text-foreground"
              />
            </div>
            <div>
              <label className="text-muted-foreground">x đến</label>
              <input
                type="number"
                value={xMax}
                onChange={(e) => setXMax(Number(e.target.value))}
                className="mt-1 h-9 w-full rounded-lg border border-border/70 bg-background px-2.5 font-mono text-foreground"
              />
            </div>
            <div>
              <label className="text-muted-foreground">y từ</label>
              <input
                type="number"
                value={yMin}
                onChange={(e) => setYMin(Number(e.target.value))}
                className="mt-1 h-9 w-full rounded-lg border border-border/70 bg-background px-2.5 font-mono text-foreground"
              />
            </div>
            <div>
              <label className="text-muted-foreground">y đến</label>
              <input
                type="number"
                value={yMax}
                onChange={(e) => setYMax(Number(e.target.value))}
                className="mt-1 h-9 w-full rounded-lg border border-border/70 bg-background px-2.5 font-mono text-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Graph Canvas */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleZoom(0.75)}
              className="min-h-9 gap-1"
            >
              <ZoomIn className="h-3.5 w-3.5" />
              Phóng to
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleZoom(1.33)}
              className="min-h-9 gap-1"
            >
              <ZoomOut className="h-3.5 w-3.5" />
              Thu nhỏ
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetView}
              className="min-h-9 gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Mặc định
            </Button>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleDownloadSvg}
            className="min-h-9 gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Tải SVG
          </Button>
        </div>

        {/* Interactive SVG Plot */}
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <svg
            id="quizken-function-graph-svg"
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full h-auto block cursor-crosshair select-none"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              const xVal =
                safeBounds.xMin +
                ratio * (safeBounds.xMax - safeBounds.xMin);
              setHoverX(xVal);
            }}
            onMouseLeave={() => setHoverX(null)}
          >
            <rect width={SVG_W} height={SVG_H} fill="#ffffff" />

            {/* Grid Lines */}
            {gridTicks.xs.map((x) => {
              const sx = toSvgX(x);
              return (
                <g key={`gx-${x}`}>
                  <line
                    x1={sx}
                    y1={0}
                    x2={sx}
                    y2={SVG_H}
                    stroke="#e2e8f0"
                    strokeWidth={1}
                  />
                  {Math.abs(x) > 1e-6 && (
                    <text
                      x={sx + 3}
                      y={
                        axisX >= 14 && axisX <= SVG_H - 12
                          ? axisX + 12
                          : SVG_H - 6
                      }
                      fontSize="10"
                      fill="#64748b"
                    >
                      {x}
                    </text>
                  )}
                </g>
              );
            })}
            {gridTicks.ys.map((y) => {
              const sy = toSvgY(y);
              return (
                <g key={`gy-${y}`}>
                  <line
                    x1={0}
                    y1={sy}
                    x2={SVG_W}
                    y2={sy}
                    stroke="#e2e8f0"
                    strokeWidth={1}
                  />
                  {Math.abs(y) > 1e-6 && (
                    <text
                      x={
                        axisY >= 8 && axisY <= SVG_W - 28 ? axisY + 5 : 6
                      }
                      y={sy - 3}
                      fontSize="10"
                      fill="#64748b"
                    >
                      {y}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Axes */}
            {axisX >= 0 && axisX <= SVG_H && (
              <line
                x1={0}
                y1={axisX}
                x2={SVG_W}
                y2={axisX}
                stroke="#334155"
                strokeWidth={1.6}
              />
            )}
            {axisY >= 0 && axisY <= SVG_W && (
              <line
                x1={axisY}
                y1={0}
                x2={axisY}
                y2={SVG_H}
                stroke="#334155"
                strokeWidth={1.6}
              />
            )}

            {/* Plotted Curves */}
            {curvePaths.map(
              (c) =>
                c.d && (
                  <path
                    key={c.id}
                    d={c.d}
                    fill="none"
                    stroke={c.color}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )
            )}

            {/* Hover Guide */}
            {hoverX !== null && (
              <g>
                <line
                  x1={toSvgX(hoverX)}
                  y1={0}
                  x2={toSvgX(hoverX)}
                  y2={SVG_H}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />
                {compiled.map((c) => {
                  if (!c.visible || !c.compiled.fn) return null;
                  const yVal = c.compiled.fn(hoverX);
                  if (!Number.isFinite(yVal)) return null;
                  const sy = toSvgY(yVal);
                  if (sy < 0 || sy > SVG_H) return null;
                  return (
                    <circle
                      key={`pt-${c.id}`}
                      cx={toSvgX(hoverX)}
                      cy={sy}
                      r={4.5}
                      fill={c.color}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                    />
                  );
                })}
              </g>
            )}
          </svg>
        </div>

        {/* Live Coordinate Readout */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-foreground/[0.04] px-4 py-2.5 text-xs dark:bg-foreground/[0.06]">
          {hoverX !== null ? (
            <>
              <span className="font-mono font-bold text-foreground">
                x = {hoverX.toFixed(2)}
              </span>
              {compiled.map((c, idx) => {
                if (!c.compiled.fn) return null;
                const yVal = c.compiled.fn(hoverX);
                return (
                  <span
                    key={c.id}
                    className="font-mono font-semibold"
                    style={{ color: c.color }}
                  >
                    y{idx + 1} ={" "}
                    {Number.isFinite(yVal) ? yVal.toFixed(3) : "Không XĐ"}
                  </span>
                );
              })}
            </>
          ) : (
            <span className="text-muted-foreground">
              Rê chuột lên đồ thị để dò tọa độ giao điểm (x, y) trực tiếp.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
