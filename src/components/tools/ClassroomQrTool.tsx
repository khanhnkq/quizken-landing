"use client";

import { useMemo, useState } from "react";
import {
  QrCode,
  Download,
  Copy,
  Check,
  Wifi,
  Link2,
  FileText,
  Printer,
  AlertCircle,
} from "lucide-react";
import { encodeQrMatrix, type QrEccLevel } from "@/lib/qrEncoder";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type QrMode = "url" | "text" | "wifi";

const DANGEROUS_SCHEME_RE = /^\s*(javascript|data|vbscript|file|blob)\s*:/i;
const SAFE_HTTP_URL_RE = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
const MAX_QR_PAYLOAD_LENGTH = 500;

function escapeWifiField(val: string): string {
  return val.replace(/([\\;,:"])/g, "\\$1");
}

function validateSafeUrl(raw: string): { valid: boolean; error?: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { valid: false, error: "Vui lòng nhập đường dẫn URL (bắt đầu bằng https:// hoặc http://)." };
  }
  if (trimmed.length > MAX_QR_PAYLOAD_LENGTH) {
    return { valid: false, error: `Đường dẫn quá dài (tối đa ${MAX_QR_PAYLOAD_LENGTH} ký tự để mã QR dễ quét).` };
  }
  if (DANGEROUS_SCHEME_RE.test(trimmed)) {
    return {
      valid: false,
      error: "Không chấp nhận giao thức không an toàn (javascript:, data:, file:). Chỉ hỗ trợ đường dẫn https:// hoặc http://.",
    };
  }
  if (!SAFE_HTTP_URL_RE.test(trimmed)) {
    return {
      valid: false,
      error: "Đường dẫn không hợp lệ. Vui lòng nhập URL đầy đủ bắt đầu bằng https:// hoặc http:// (ví dụ: https://app.quizken.com).",
    };
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return {
        valid: false,
        error: "Chỉ cho phép giao thức web chuẩn https:// hoặc http://.",
      };
    }
    return { valid: true };
  } catch {
    return {
      valid: false,
      error: "Cấu trúc URL không hợp lệ. Vui lòng kiểm tra lại đường dẫn.",
    };
  }
}

export function ClassroomQrTool() {
  const [mode, setMode] = useState<QrMode>("url");
  const [ecc, setEcc] = useState<QrEccLevel>("M");

  const [urlValue, setUrlValue] = useState("https://app.quizken.com");
  const [textValue, setTextValue] = useState(
    "Bài kiểm tra 15 phút — Vật lý 12 — Hạn nộp 21:00"
  );
  const [wifiSsid, setWifiSsid] = useState("PhongThi_QuizKen");
  const [wifiPass, setWifiPass] = useState("12345678");
  const [wifiAuth, setWifiAuth] = useState<"WPA" | "WEP" | "nopass">("WPA");

  const [cardHeader, setCardHeader] = useState("ĐỀ KIỂM TRA TRẮC NGHIỆM ONLINE");
  const [cardSubtitle, setCardSubtitle] = useState(
    "Mở camera điện thoại quét mã QR để vào phòng thi ngay"
  );
  const [copied, setCopied] = useState(false);

  const urlValidation = useMemo(() => {
    if (mode !== "url") return { valid: true as const, error: undefined };
    return validateSafeUrl(urlValue);
  }, [mode, urlValue]);

  const payload = useMemo(() => {
    if (mode === "url") {
      return urlValidation.valid ? urlValue.trim() : "";
    }
    if (mode === "text") {
      const trimmed = textValue.trim().slice(0, MAX_QR_PAYLOAD_LENGTH);
      if (DANGEROUS_SCHEME_RE.test(trimmed)) return "";
      return trimmed;
    }
    const ssid = escapeWifiField(wifiSsid.trim().slice(0, 64));
    const pass = escapeWifiField(wifiPass.slice(0, 64));
    if (!ssid) return "";
    if (wifiAuth === "nopass") return `WIFI:T:nopass;S:${ssid};;`;
    return `WIFI:T:${wifiAuth};S:${ssid};P:${pass};;`;
  }, [mode, urlValue, urlValidation.valid, textValue, wifiSsid, wifiPass, wifiAuth]);

  const qr = useMemo(() => {
    if (mode === "url" && !urlValidation.valid) {
      return {
        success: false as const,
        error: urlValidation.error ?? "Đường dẫn URL không hợp lệ.",
      };
    }
    if (mode === "text" && DANGEROUS_SCHEME_RE.test(textValue.trim())) {
      return {
        success: false as const,
        error: "Nội dung văn bản không được bắt đầu bằng giao thức thực thi mã (javascript:, data:, file:).",
      };
    }
    return encodeQrMatrix(payload, ecc);
  }, [mode, urlValidation, textValue, payload, ecc]);

  const buildSvgString = () => {
    if (!qr.success) return "";
    const margin = 4;
    const total = qr.size + margin * 2;
    const paths: string[] = [];
    for (let r = 0; r < qr.size; r++) {
      for (let c = 0; c < qr.size; c++) {
        if (qr.matrix[r][c]) {
          paths.push(`M${c + margin},${r + margin}h1v1h-1z`);
        }
      }
    }
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="512" height="512" shape-rendering="crispEdges">`,
      `<rect width="${total}" height="${total}" fill="#ffffff"/>`,
      `<path d="${paths.join("")}" fill="#0f172a"/>`,
      `</svg>`,
    ].join("");
  };

  const handleDownloadSvg = () => {
    const svgStr = buildSvgString();
    if (!svgStr) return;
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quizken-qr-code.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = () => {
    if (!qr.success) return;
    const scale = 12;
    const margin = 4;
    const px = (qr.size + margin * 2) * scale;
    const canvas = document.createElement("canvas");
    canvas.width = px;
    canvas.height = px;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, px, px);
    ctx.fillStyle = "#0f172a";
    for (let r = 0; r < qr.size; r++) {
      for (let c = 0; c < qr.size; c++) {
        if (qr.matrix[r][c]) {
          ctx.fillRect((c + margin) * scale, (r + margin) * scale, scale, scale);
        }
      }
    }
    const pngUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = "quizken-qr-code.png";
    a.click();
  };

  const handleCopyPayload = async () => {
    if (!payload) return;
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      {/* Left: Controls */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-7 space-y-5">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "url" as const, label: "Liên kết (URL)", icon: Link2 },
            { id: "text" as const, label: "Văn bản / Đề bài", icon: FileText },
            { id: "wifi" as const, label: "Wi-Fi Lớp học", icon: Wifi },
          ].map((item) => {
            const Icon = item.icon;
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={cn(
                  "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/[0.05] text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {mode === "url" && (
          <div className="space-y-2">
            <label
              htmlFor="qr-url-input"
              className="block text-sm font-semibold text-foreground"
            >
              Nhập đường dẫn (Link đề thi QuizKen, Google Form, Drive...):
            </label>
            <input
              id="qr-url-input"
              type="url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              placeholder="https://app.quizken.com/quiz/play/..."
              className="h-12 w-full rounded-xl border border-border/70 bg-background px-4 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        )}

        {mode === "text" && (
          <div className="space-y-2">
            <label
              htmlFor="qr-text-input"
              className="block text-sm font-semibold text-foreground"
            >
              Nội dung văn bản hiển thị khi quét:
            </label>
            <textarea
              id="qr-text-input"
              rows={3}
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Nhập thông báo, mật khẩu phòng thi hoặc đáp án..."
              className="w-full rounded-xl border border-border/70 bg-background p-3.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        )}

        {mode === "wifi" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Tên mạng Wi-Fi (SSID)
              </label>
              <input
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                className="h-11 w-full rounded-xl border border-border/70 bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Mật khẩu Wi-Fi
              </label>
              <input
                type="text"
                disabled={wifiAuth === "nopass"}
                value={wifiPass}
                onChange={(e) => setWifiPass(e.target.value)}
                className="h-11 w-full rounded-xl border border-border/70 bg-background px-3.5 text-sm text-foreground disabled:opacity-50 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Chuẩn bảo mật
              </label>
              <select
                value={wifiAuth}
                onChange={(e) =>
                  setWifiAuth(e.target.value as "WPA" | "WEP" | "nopass")
                }
                className="h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Không mật khẩu</option>
              </select>
            </div>
          </div>
        )}

        {/* Classroom Card Labels */}
        <div className="space-y-3 border-t border-border/60 pt-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tùy chỉnh thẻ QR in ấn / chiếu máy chiếu lớp học
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Tiêu đề thẻ
              </label>
              <input
                type="text"
                value={cardHeader}
                onChange={(e) => setCardHeader(e.target.value)}
                className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Mức sửa lỗi QR (ECC)
              </label>
              <div className="flex gap-2">
                {(["M", "L"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEcc(lvl)}
                    className={cn(
                      "h-10 flex-1 cursor-pointer rounded-xl text-xs font-bold transition-colors",
                      ecc === lvl
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground/[0.05] text-foreground"
                    )}
                  >
                    {lvl === "M" ? "Mức M (15% - Khuyên dùng)" : "Mức L (7% - Dữ liệu dài)"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Hướng dẫn ngắn bên dưới mã QR
            </label>
            <input
              type="text"
              value={cardSubtitle}
              onChange={(e) => setCardSubtitle(e.target.value)}
              className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Right: Live Printable QR Card */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-7 flex flex-col items-center justify-between space-y-5">
        <div className="w-full flex items-center justify-between">
          <Badge className="bg-primary/15 text-primary">
            <QrCode className="h-3.5 w-3.5" />
            QR Tĩnh Vĩnh Viễn
          </Badge>
          {qr.success && (
            <span className="text-xs font-medium text-muted-foreground">
              Version {qr.version} ({qr.size}×{qr.size})
            </span>
          )}
        </div>

        {qr.success ? (
          <div className="w-full max-w-[320px] rounded-2xl border border-border bg-white p-5 text-center text-slate-900">
            {cardHeader && (
              <div className="mb-3 font-heading text-sm font-extrabold uppercase tracking-wide text-slate-900">
                {cardHeader}
              </div>
            )}
            <div className="mx-auto w-full max-w-[232px] aspect-square">
              <svg
                viewBox={`0 0 ${qr.size + 8} ${qr.size + 8}`}
                className="h-full w-full"
                shapeRendering="crispEdges"
                role="img"
                aria-label="Mã QR lớp học"
              >
                <rect
                  width={qr.size + 8}
                  height={qr.size + 8}
                  fill="#ffffff"
                />
                {qr.matrix.map((row, r) =>
                  row.map((dark, c) =>
                    dark ? (
                      <rect
                        key={`${r}-${c}`}
                        x={c + 4}
                        y={r + 4}
                        width={1}
                        height={1}
                        fill="#0f172a"
                      />
                    ) : null
                  )
                )}
              </svg>
            </div>
            {cardSubtitle && (
              <p className="mt-3 text-xs font-medium text-slate-600">
                {cardSubtitle}
              </p>
            )}
          </div>
        ) : (
          <div className="flex w-full items-start gap-2.5 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{qr.error}</span>
          </div>
        )}

        <div className="w-full flex flex-wrap justify-center gap-2.5">
          <Button
            type="button"
            disabled={!qr.success}
            onClick={handleDownloadPng}
            size="sm"
            className="min-h-10 gap-1.5"
          >
            <Download className="h-4 w-4" />
            Tải PNG
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={!qr.success}
            onClick={handleDownloadSvg}
            size="sm"
            className="min-h-10 gap-1.5"
          >
            <Download className="h-4 w-4" />
            Tải SVG
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={!payload}
            onClick={handleCopyPayload}
            size="sm"
            className="min-h-10 gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-primary" />
                Đã sao chép
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Chép nội dung
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => window.print()}
            size="sm"
            className="min-h-10 gap-1.5"
          >
            <Printer className="h-4 w-4" />
            In thẻ
          </Button>
        </div>
      </div>
    </div>
  );
}
