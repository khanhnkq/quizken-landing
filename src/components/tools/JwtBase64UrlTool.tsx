"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeftRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  KeyRound,
  Link2,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
  base64ToUtf8,
  hmacSha256Base64Url,
  utf8ToBase64,
  utf8ToBase64Url,
} from "@/lib/cryptoAlgorithms";

type TabId = "jwt" | "base64" | "url";

const SAMPLE_SECRET = "quizken-edu-secret-2027";

type ParsedJwtResult =
  | {
      status: "empty";
    }
  | {
      status: "error";
      error: string;
      parts?: string[];
    }
  | {
      status: "ok";
      rawParts: [string, string, string];
      headerObj: Record<string, unknown>;
      payloadObj: Record<string, unknown>;
      headerPretty: string;
      payloadPretty: string;
    };

type StandardClaimRow = {
  key: string;
  label: string;
  rawValue: string;
  formattedValue: string;
  isTimestamp: boolean;
};

const CLAIM_LABELS: Record<string, string> = {
  iss: "Issuer (Đơn vị phát hành)",
  sub: "Subject (Chủ thể / User ID)",
  aud: "Audience (Đối tượng nhận)",
  exp: "Expiration Time (Thời điểm hết hạn)",
  nbf: "Not Before (Có hiệu lực từ)",
  iat: "Issued At (Thời điểm cấp)",
  jti: "JWT ID (Mã định danh token)",
};

function formatVietnamDateTime(unixSeconds: number): string {
  if (!Number.isFinite(unixSeconds)) return "Không hợp lệ";
  try {
    const date = new Date(unixSeconds * 1000);
    return new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      dateStyle: "medium",
      timeStyle: "medium",
      hour12: false,
    }).format(date);
  } catch {
    return new Date(unixSeconds * 1000).toISOString();
  }
}

function formatDurationSeconds(diffSec: number): string {
  const abs = Math.abs(Math.round(diffSec));
  if (abs < 60) return `${abs} giây`;
  const mins = Math.floor(abs / 60);
  if (mins < 60) return `${mins} phút ${abs % 60} giây`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ ${mins % 60} phút`;
  const days = Math.floor(hours / 24);
  return `${days} ngày ${hours % 24} giờ`;
}

function safeCopyText(
  text: string,
  key: string,
  setCopiedKey: (val: string | null) => void,
) {
  if (typeof navigator === "undefined" || !navigator.clipboard) return;
  navigator.clipboard.writeText(text).then(() => {
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey(null);
    }, 1800);
  }).catch(() => {});
}

export function JwtBase64UrlTool() {
  const [activeTab, setActiveTab] = useState<TabId>("jwt");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Tab 1: JWT state
  const [jwtInput, setJwtInput] = useState<string>("");
  const [hmacSecret, setHmacSecret] = useState<string>("");
  const [hs256Status, setHs256Status] = useState<
    "idle" | "verifying" | "valid" | "invalid" | "unsupported_alg" | "error"
  >("idle");
  const [hs256Message, setHs256Message] = useState<string>("");
  const [nowSeconds, setNowSeconds] = useState<number | null>(null);

  // Tab 2: Base64 UTF-8 state
  const [b64Mode, setB64Mode] = useState<"encode" | "decode">("encode");
  const [b64Variant, setB64Variant] = useState<"standard" | "base64url">("standard");
  const [b64Input, setB64Input] = useState<string>(
    "Xin chào QuizKen! Chúc bạn ôn thi Tin học & An toàn thông tin đạt 10 điểm.",
  );

  // Tab 3: URL Encode/Decode & Query Parser state
  const [urlMode, setUrlMode] = useState<"encode" | "decode">("decode");
  const [urlInput, setUrlInput] = useState<string>(
    "https://quizken.vn/cong-cu?mon=Tin%20h%E1%BB%8Dc%2012&chu_de=M%E1%BA%ADt%20m%C3%A3%20%26%20JWT&nam=2027",
  );

  // Keep current client time in sync for exp/nbf checks without SSR hydration mismatch
  useEffect(() => {
    const syncTimer = window.setTimeout(() => {
      setNowSeconds(Math.floor(Date.now() / 1000));
    }, 0);
    const interval = window.setInterval(() => {
      setNowSeconds(Math.floor(Date.now() / 1000));
    }, 15_000);
    return () => {
      window.clearTimeout(syncTimer);
      window.clearInterval(interval);
    };
  }, []);

  const parsedJwt: ParsedJwtResult = useMemo(() => {
    const trimmed = jwtInput.trim();
    if (!trimmed) return { status: "empty" };
    const cleanToken = trimmed.replace(/^Bearer\s+/i, "").trim();
    const parts = cleanToken.split(".");
    if (parts.length !== 3) {
      return {
        status: "error",
        error: `JWT chuẩn phải gồm đúng 3 phần cách nhau bởi dấu chấm (Header.Payload.Signature). Hiện tại phát hiện ${parts.length} phần.`,
        parts,
      };
    }

    const [headerRaw, payloadRaw, signatureRaw] = parts;
    if (!headerRaw || !payloadRaw) {
      return {
        status: "error",
        error: "Phần Header hoặc Payload của JWT đang bị trống.",
        parts,
      };
    }

    try {
      const headerStr = base64ToUtf8(headerRaw);
      const headerParsed = JSON.parse(headerStr) as unknown;
      if (!headerParsed || typeof headerParsed !== "object" || Array.isArray(headerParsed)) {
        return {
          status: "error",
          error: "JWT Header giải mã được nhưng không phải là một JSON Object hợp lệ.",
          parts,
        };
      }

      const payloadStr = base64ToUtf8(payloadRaw);
      const payloadParsed = JSON.parse(payloadStr) as unknown;
      if (!payloadParsed || typeof payloadParsed !== "object" || Array.isArray(payloadParsed)) {
        return {
          status: "error",
          error: "JWT Payload giải mã được nhưng không phải là một JSON Object hợp lệ.",
          parts,
        };
      }

      return {
        status: "ok",
        rawParts: [headerRaw, payloadRaw, signatureRaw],
        headerObj: headerParsed as Record<string, unknown>,
        payloadObj: payloadParsed as Record<string, unknown>,
        headerPretty: JSON.stringify(headerParsed, null, 2),
        payloadPretty: JSON.stringify(payloadParsed, null, 2),
      };
    } catch (err) {
      return {
        status: "error",
        error:
          err instanceof Error
            ? `Không thể giải mã Base64URL/JSON: ${err.message}`
            : "Token JWT không đúng định dạng Base64URL hoặc JSON.",
        parts,
      };
    }
  }, [jwtInput]);

  // Verify HS256 locally via Web Crypto whenever token or secret changes
  useEffect(() => {
    if (parsedJwt.status !== "ok" || !hmacSecret) {
      const resetId = window.setTimeout(() => {
        setHs256Status("idle");
        setHs256Message("");
      }, 0);
      return () => window.clearTimeout(resetId);
    }

    const alg = String(parsedJwt.headerObj.alg ?? "").toUpperCase();
    if (alg !== "HS256") {
      const unsupportedId = window.setTimeout(() => {
        setHs256Status("unsupported_alg");
        setHs256Message(
          `Header khai báo alg = "${alg || "không rõ"}". Kiểm tra HMAC tại máy chỉ áp dụng cho thuật toán HS256.`,
        );
      }, 0);
      return () => window.clearTimeout(unsupportedId);
    }

    let cancelled = false;
    const verifyStartId = window.setTimeout(() => {
      if (!cancelled) setHs256Status("verifying");
    }, 0);

    const signingInput = `${parsedJwt.rawParts[0]}.${parsedJwt.rawParts[1]}`;
    hmacSha256Base64Url(hmacSecret, signingInput)
      .then((expectedSig) => {
        if (cancelled) return;
        const providedSig = parsedJwt.rawParts[2];
        if (!providedSig) {
          setHs256Status("invalid");
          setHs256Message("Token không có phần Signature (chữ ký trống).");
          return;
        }
        // Constant-length comparison
        let diff = expectedSig.length ^ providedSig.length;
        const maxLen = Math.max(expectedSig.length, providedSig.length);
        for (let i = 0; i < maxLen; i += 1) {
          diff |= (expectedSig.charCodeAt(i) || 0) ^ (providedSig.charCodeAt(i) || 0);
        }
        if (diff === 0) {
          setHs256Status("valid");
          setHs256Message("Chữ ký HMAC-SHA256 khớp 100% — Token nguyên vẹn và đúng khóa bí mật.");
        } else {
          setHs256Status("invalid");
          setHs256Message("Chữ ký KHÔNG khớp — Secret sai hoặc nội dung Header/Payload đã bị sửa đổi.");
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setHs256Status("error");
        setHs256Message(
          err instanceof Error ? err.message : "Lỗi Web Crypto khi tính HMAC-SHA256.",
        );
      });

    return () => {
      cancelled = true;
      window.clearTimeout(verifyStartId);
    };
  }, [parsedJwt, hmacSecret]);

  const standardClaims: StandardClaimRow[] = useMemo(() => {
    if (parsedJwt.status !== "ok") return [];
    const order = ["iss", "sub", "aud", "iat", "nbf", "exp", "jti"];
    const rows: StandardClaimRow[] = [];
    for (const key of order) {
      if (!(key in parsedJwt.payloadObj)) continue;
      const val = parsedJwt.payloadObj[key];
      const isTs = (key === "iat" || key === "nbf" || key === "exp") && typeof val === "number";
      rows.push({
        key,
        label: CLAIM_LABELS[key] ?? key,
        rawValue: typeof val === "string" ? val : JSON.stringify(val),
        formattedValue: isTs
          ? `${formatVietnamDateTime(val as number)} (GMT+7)`
          : typeof val === "string"
            ? val
            : JSON.stringify(val),
        isTimestamp: isTs,
      });
    }
    return rows;
  }, [parsedJwt]);

  const tokenTimeValidity = useMemo(() => {
    if (parsedJwt.status !== "ok" || nowSeconds === null) return null;
    const expVal = parsedJwt.payloadObj.exp;
    const nbfVal = parsedJwt.payloadObj.nbf;

    if (typeof expVal !== "number") {
      return {
        state: "no_exp" as const,
        label: "Không có claim exp",
        detail: "Payload không chứa trường exp nên không xác định thời điểm hết hạn.",
      };
    }

    if (typeof nbfVal === "number" && nowSeconds < nbfVal) {
      return {
        state: "not_yet" as const,
        label: "Chưa đến hiệu lực (nbf)",
        detail: `Có hiệu lực sau ${formatDurationSeconds(nbfVal - nowSeconds)} nữa.`,
      };
    }

    if (nowSeconds >= expVal) {
      return {
        state: "expired" as const,
        label: "Expired (Đã hết hạn)",
        detail: `Đã hết hạn cách đây ${formatDurationSeconds(nowSeconds - expVal)}.`,
      };
    }

    return {
      state: "active" as const,
      label: "Active (Còn hạn)",
      detail: `Còn hiệu lực thêm ${formatDurationSeconds(expVal - nowSeconds)}.`,
    };
  }, [parsedJwt, nowSeconds]);

  async function handleLoadSampleJwt() {
    const iat = Math.floor(Date.now() / 1000);
    setNowSeconds(iat);
    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
      iss: "https://quizken.vn",
      sub: "HS2027-0042",
      aud: "quizken-student-portal",
      name: "Nguyễn Minh Anh (Lớp 12A1)",
      role: "student",
      iat,
      nbf: iat,
      exp: iat + 7200,
    };
    const encodedHeader = utf8ToBase64Url(JSON.stringify(header));
    const encodedPayload = utf8ToBase64Url(JSON.stringify(payload));
    const signature = await hmacSha256Base64Url(
      SAMPLE_SECRET,
      `${encodedHeader}.${encodedPayload}`,
    );
    setJwtInput(`${encodedHeader}.${encodedPayload}.${signature}`);
    setHmacSecret(SAMPLE_SECRET);
  }

  // Tab 2: Base64 computation
  const b64Output = useMemo(() => {
    if (!b64Input) return { ok: true as const, value: "", inputBytes: 0, outputBytes: 0 };
    try {
      if (b64Mode === "encode") {
        const inputBytes = new TextEncoder().encode(b64Input).length;
        const encoded =
          b64Variant === "base64url"
            ? utf8ToBase64Url(b64Input)
            : utf8ToBase64(b64Input);
        return {
          ok: true as const,
          value: encoded,
          inputBytes,
          outputBytes: encoded.length,
        };
      }
      const decoded = base64ToUtf8(b64Input);
      return {
        ok: true as const,
        value: decoded,
        inputBytes: b64Input.trim().length,
        outputBytes: new TextEncoder().encode(decoded).length,
      };
    } catch (err) {
      return {
        ok: false as const,
        error:
          err instanceof Error
            ? `Lỗi giải mã Base64 UTF-8: ${err.message}`
            : "Chuỗi Base64 không hợp lệ hoặc không phải mã hóa UTF-8.",
      };
    }
  }, [b64Input, b64Mode, b64Variant]);

  // Tab 3: URL Encode/Decode & Query Parser
  const urlTransform = useMemo(() => {
    if (!urlInput) return { ok: true as const, value: "" };
    try {
      if (urlMode === "encode") {
        return { ok: true as const, value: encodeURIComponent(urlInput) };
      }
      return {
        ok: true as const,
        value: decodeURIComponent(urlInput.replace(/\+/g, " ")),
      };
    } catch {
      return {
        ok: false as const,
        error: "Chuỗi URL chứa ký tự phần trăm (%XX) không hợp lệ khi decode.",
      };
    }
  }, [urlInput, urlMode]);

  const parsedQueryParams = useMemo(() => {
    const raw = urlInput.trim();
    if (!raw) return { baseUrl: "", params: [] as Array<{ key: string; value: string; rawPair: string }> };

    let queryPart = "";
    let baseUrl = "";
    const qIdx = raw.indexOf("?");
    if (qIdx !== -1) {
      baseUrl = raw.slice(0, qIdx);
      queryPart = raw.slice(qIdx + 1).split("#")[0];
    } else if (raw.includes("=")) {
      queryPart = raw.replace(/^\?/, "").split("#")[0];
    } else {
      return { baseUrl: raw, params: [] };
    }

    if (!queryPart) return { baseUrl, params: [] };
    const searchParams = new URLSearchParams(queryPart);
    const rawPairs = queryPart.split("&").filter(Boolean);
    const params: Array<{ key: string; value: string; rawPair: string }> = [];
    let idx = 0;
    searchParams.forEach((value, key) => {
      params.push({
        key,
        value,
        rawPair: rawPairs[idx] ?? `${key}=${value}`,
      });
      idx += 1;
    });
    return { baseUrl, params };
  }, [urlInput]);

  return (
    <div className="space-y-6">
      {/* Prominent Privacy Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
        <div className="flex items-center gap-2.5 font-semibold">
          <Lock className="h-4 w-4 shrink-0" />
          <span>
            🔒 Giải mã 100% cục bộ trong RAM trình duyệt — Token của bạn không bao giờ gửi qua mạng
          </span>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
          Zero Network • Web Crypto API
        </Badge>
      </div>

      {/* Mode Tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-border/70 bg-card/85 p-2">
        {(
          [
            { id: "jwt", label: "1. Giải mã JWT & Kiểm tra HS256", icon: KeyRound },
            { id: "base64", label: "2. Base64 & Base64URL (UTF-8)", icon: Sparkles },
            { id: "url", label: "3. URL Encode & Query Parser", icon: Link2 },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-heading font-semibold transition-colors sm:text-sm cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: JWT DECODER, CLAIM INSPECTOR & HS256 VERIFIER */}
      {activeTab === "jwt" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Dán chuỗi JSON Web Token (JWT)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Hỗ trợ tự động loại bỏ tiền tố <code className="text-foreground">Bearer </code> và tách màu 3 phần Header.Payload.Signature.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    void handleLoadSampleJwt();
                  }}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-primary/15 px-3.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/25 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Nạp JWT mẫu (HS256)</span>
                </button>
                {jwtInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setJwtInput("");
                      setHmacSecret("");
                    }}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Xóa token</span>
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={jwtInput}
              onChange={(e) => setJwtInput(e.target.value)}
              rows={4}
              spellCheck={false}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJIUzIwMjctMDAxIiwibmFtZSI6Ik5ndXnhu4VuIFbEg24gQW4iLCJpYXQiOjE3NzAwMDAwMDB9...."
              className="w-full rounded-xl border border-border bg-background/80 p-3.5 font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none sm:text-sm"
            />

            {/* Color-coded 3-part breakdown */}
            {parsedJwt.status === "ok" && (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-500/15 px-2 py-0.5 text-rose-600 dark:text-rose-400">
                    Header ({parsedJwt.rawParts[0].length} ký tự)
                  </span>
                  <span className="text-muted-foreground">.</span>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-violet-500/15 px-2 py-0.5 text-violet-600 dark:text-violet-400">
                    Payload ({parsedJwt.rawParts[1].length} ký tự)
                  </span>
                  <span className="text-muted-foreground">.</span>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-500/15 px-2 py-0.5 text-sky-600 dark:text-sky-400">
                    Signature ({parsedJwt.rawParts[2].length} ký tự)
                  </span>
                </div>
                <div className="break-all rounded-xl border border-border/60 bg-background/60 p-3 font-mono text-xs leading-relaxed">
                  <span className="text-rose-600 dark:text-rose-400">{parsedJwt.rawParts[0]}</span>
                  <span className="font-bold text-foreground">.</span>
                  <span className="text-violet-600 dark:text-violet-400">{parsedJwt.rawParts[1]}</span>
                  <span className="font-bold text-foreground">.</span>
                  <span className="text-sky-600 dark:text-sky-400">
                    {parsedJwt.rawParts[2] || "(trống)"}
                  </span>
                </div>
              </div>
            )}

            {parsedJwt.status === "error" && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-700 dark:text-rose-300 sm:text-sm">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{parsedJwt.error}</span>
              </div>
            )}
          </div>

          {parsedJwt.status === "ok" && (
            <>
              {/* Decoded Header & Payload */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-rose-500/30 bg-card/85 p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                        HEADER — Thuật toán &amp; Loại Token
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        safeCopyText(parsedJwt.headerPretty, "jwt-header", setCopiedKey)
                      }
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
                    >
                      {copiedKey === "jwt-header" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copiedKey === "jwt-header" ? "Đã chép" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="overflow-x-auto rounded-xl bg-background/80 p-3.5 font-mono text-xs leading-relaxed text-rose-700 dark:text-rose-300">
                    {parsedJwt.headerPretty}
                  </pre>
                </div>

                <div className="rounded-2xl border border-violet-500/30 bg-card/85 p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                        PAYLOAD — Dữ liệu &amp; Claims
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        safeCopyText(parsedJwt.payloadPretty, "jwt-payload", setCopiedKey)
                      }
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
                    >
                      {copiedKey === "jwt-payload" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copiedKey === "jwt-payload" ? "Đã chép" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="overflow-x-auto rounded-xl bg-background/80 p-3.5 font-mono text-xs leading-relaxed text-violet-700 dark:text-violet-300">
                    {parsedJwt.payloadPretty}
                  </pre>
                </div>
              </div>

              {/* Standard Claims & Expiration Status */}
              <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      Kiểm tra Claims chuẩn &amp; Thời hạn (Giờ Việt Nam GMT+7)
                    </h3>
                  </div>

                  {tokenTimeValidity && (
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold",
                        tokenTimeValidity.state === "active" &&
                          "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
                        tokenTimeValidity.state === "expired" &&
                          "bg-rose-500/15 text-rose-700 dark:text-rose-300",
                        tokenTimeValidity.state === "not_yet" &&
                          "bg-amber-500/15 text-amber-700 dark:text-amber-300",
                        tokenTimeValidity.state === "no_exp" &&
                          "bg-foreground/[0.08] text-muted-foreground",
                      )}
                    >
                      {tokenTimeValidity.state === "active" && (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      {tokenTimeValidity.state === "expired" && (
                        <XCircle className="h-4 w-4" />
                      )}
                      <span>{tokenTimeValidity.label}</span>
                      <span className="font-normal opacity-90">
                        — {tokenTimeValidity.detail}
                      </span>
                    </div>
                  )}
                </div>

                {standardClaims.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-border/60">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-foreground/[0.04] text-muted-foreground">
                        <tr>
                          <th className="px-4 py-2.5 font-semibold">Claim</th>
                          <th className="px-4 py-2.5 font-semibold">Ý nghĩa</th>
                          <th className="px-4 py-2.5 font-semibold">Giá trị gốc</th>
                          <th className="px-4 py-2.5 font-semibold">Diễn giải</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {standardClaims.map((row) => (
                          <tr key={row.key}>
                            <td className="px-4 py-2.5 font-mono font-bold text-primary">
                              {row.key}
                            </td>
                            <td className="px-4 py-2.5 text-muted-foreground">
                              {row.label}
                            </td>
                            <td className="px-4 py-2.5 font-mono text-foreground">
                              {row.rawValue}
                            </td>
                            <td className="px-4 py-2.5 font-medium text-foreground">
                              {row.formattedValue}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Payload không chứa các claim chuẩn RFC 7519 (iss, sub, aud, iat, nbf, exp, jti).
                  </p>
                )}
              </div>

              {/* Local HS256 Verifier */}
              <div className="rounded-2xl border border-sky-500/30 bg-card/85 p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-sky-600 dark:text-sky-400">
                      Kiểm tra chữ ký HMAC-SHA256 (HS256) tại máy
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Nhập khóa bí mật (Secret Key) để trình duyệt tính lại chữ ký bằng Web Crypto{" "}
                      <code>subtle.sign</code>. Khóa chỉ lưu trong RAM khi bạn đang mở trang.
                    </p>
                  </div>
                  <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-300">
                    alg: {String(parsedJwt.headerObj.alg ?? "N/A")}
                  </Badge>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={hmacSecret}
                    onChange={(e) => setHmacSecret(e.target.value)}
                    placeholder="Nhập secret key (ví dụ: quizken-edu-secret-2027)..."
                    className="min-h-11 flex-1 rounded-xl border border-border bg-background/80 px-3.5 font-mono text-xs text-foreground focus:border-sky-500 focus:outline-none sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setHmacSecret(SAMPLE_SECRET)}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-foreground/[0.06] px-4 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
                  >
                    Dùng secret mẫu
                  </button>
                </div>

                {hs256Status === "valid" && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 sm:text-sm">
                    <ShieldCheck className="h-5 w-5 shrink-0" />
                    <span>{hs256Message}</span>
                  </div>
                )}
                {hs256Status === "invalid" && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-700 dark:text-rose-300 sm:text-sm">
                    <ShieldAlert className="h-5 w-5 shrink-0" />
                    <span>{hs256Message}</span>
                  </div>
                )}
                {(hs256Status === "unsupported_alg" || hs256Status === "error") && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs font-medium text-amber-700 dark:text-amber-300 sm:text-sm">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <span>{hs256Message}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: BASE64 & BASE64URL UTF-8 */}
      {activeTab === "base64" && (
        <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setB64Mode("encode")}
                className={cn(
                  "min-h-10 rounded-xl px-4 text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
                  b64Mode === "encode"
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.1]",
                )}
              >
                Mã hóa (Text → Base64)
              </button>
              <button
                type="button"
                onClick={() => setB64Mode("decode")}
                className={cn(
                  "min-h-10 rounded-xl px-4 text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
                  b64Mode === "decode"
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.1]",
                )}
              >
                Giải mã (Base64 → Text)
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setB64Variant((v) => (v === "standard" ? "base64url" : "standard"))
                }
                className="min-h-10 rounded-xl border border-border bg-background/70 px-3.5 text-xs font-semibold text-foreground hover:border-primary/60 cursor-pointer"
              >
                Chuẩn:{" "}
                <span className="text-primary">
                  {b64Variant === "standard" ? "Base64 (+ / =)" : "Base64URL (- _ không =)"}
                </span>
              </button>

              {b64Output.ok && b64Output.value && (
                <button
                  type="button"
                  onClick={() => {
                    const nextInput = b64Output.value;
                    setB64Mode((m) => (m === "encode" ? "decode" : "encode"));
                    setB64Input(nextInput);
                  }}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                  <span>Đảo chiều</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>{b64Mode === "encode" ? "Văn bản gốc (UTF-8 Tiếng Việt)" : "Chuỗi Base64 / Base64URL"}</span>
                <span>{b64Input.length} ký tự</span>
              </div>
              <textarea
                value={b64Input}
                onChange={(e) => setB64Input(e.target.value)}
                rows={7}
                spellCheck={false}
                placeholder={
                  b64Mode === "encode"
                    ? "Nhập văn bản tiếng Việt có dấu, JSON hoặc emoji..."
                    : "Dán chuỗi Base64 hoặc Base64URL..."
                }
                className="w-full rounded-xl border border-border bg-background/80 p-3.5 font-mono text-xs leading-relaxed text-foreground focus:border-primary focus:outline-none sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>
                  {b64Mode === "encode"
                    ? `Kết quả ${b64Variant === "base64url" ? "Base64URL" : "Base64"}`
                    : "Văn bản UTF-8 đã giải mã"}
                </span>
                {b64Output.ok && (
                  <button
                    type="button"
                    onClick={() => safeCopyText(b64Output.value, "b64-out", setCopiedKey)}
                    className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer"
                  >
                    {copiedKey === "b64-out" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedKey === "b64-out" ? "Đã chép" : "Copy kết quả"}</span>
                  </button>
                )}
              </div>

              {b64Output.ok ? (
                <>
                  <textarea
                    readOnly
                    value={b64Output.value}
                    rows={7}
                    className="w-full rounded-xl border border-border bg-background/60 p-3.5 font-mono text-xs leading-relaxed text-foreground focus:outline-none sm:text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Dùng <code className="text-foreground">TextEncoder / TextDecoder (UTF-8)</code> nên tiếng Việt có dấu luôn chính xác tuyệt đối ({b64Output.inputBytes} bytes đầu vào → {b64Output.outputBytes} bytes đầu ra).
                  </p>
                </>
              ) : (
                <div className="flex min-h-[170px] items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-700 dark:text-rose-300 sm:text-sm">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{b64Output.error}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: URL ENCODE / DECODE & QUERY STRING PARSER */}
      {activeTab === "url" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUrlMode("decode")}
                  className={cn(
                    "min-h-10 rounded-xl px-4 text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
                    urlMode === "decode"
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.1]",
                  )}
                >
                  Giải mã URL (Decode)
                </button>
                <button
                  type="button"
                  onClick={() => setUrlMode("encode")}
                  className={cn(
                    "min-h-10 rounded-xl px-4 text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
                    urlMode === "encode"
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.1]",
                  )}
                >
                  Mã hóa Thành phần (Encode)
                </button>
              </div>

              {urlTransform.ok && urlTransform.value && (
                <button
                  type="button"
                  onClick={() => {
                    const next = urlTransform.value;
                    setUrlMode((m) => (m === "encode" ? "decode" : "encode"));
                    setUrlInput(next);
                  }}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                  <span>Đảo chiều</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  Chuỗi URL hoặc văn bản đầu vào
                </span>
                <textarea
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  rows={5}
                  spellCheck={false}
                  placeholder="Dán đường dẫn URL có tham số ?key=value hoặc chuỗi cần encodeURIComponent..."
                  className="w-full rounded-xl border border-border bg-background/80 p-3.5 font-mono text-xs leading-relaxed text-foreground focus:border-primary focus:outline-none sm:text-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>
                    {urlMode === "encode"
                      ? "Kết quả encodeURIComponent"
                      : "Kết quả decodeURIComponent"}
                  </span>
                  {urlTransform.ok && (
                    <button
                      type="button"
                      onClick={() => safeCopyText(urlTransform.value, "url-out", setCopiedKey)}
                      className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer"
                    >
                      {copiedKey === "url-out" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copiedKey === "url-out" ? "Đã chép" : "Copy"}</span>
                    </button>
                  )}
                </div>

                {urlTransform.ok ? (
                  <textarea
                    readOnly
                    value={urlTransform.value}
                    rows={5}
                    className="w-full rounded-xl border border-border bg-background/60 p-3.5 font-mono text-xs leading-relaxed text-foreground focus:outline-none sm:text-sm"
                  />
                ) : (
                  <div className="flex min-h-[130px] items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-700 dark:text-rose-300 sm:text-sm">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{urlTransform.error}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Query String Key-Value Parser */}
          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-heading text-lg font-bold text-foreground">
                Bảng Bóc tách Tham số Query String ({parsedQueryParams.params.length} tham số)
              </h3>
              {parsedQueryParams.baseUrl && (
                <span className="max-w-full truncate rounded-lg bg-foreground/[0.06] px-3 py-1 font-mono text-xs text-muted-foreground">
                  Base: {parsedQueryParams.baseUrl}
                </span>
              )}
            </div>

            {parsedQueryParams.params.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-border/60">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-foreground/[0.04] text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">#</th>
                      <th className="px-4 py-2.5 font-semibold">Tham số (Key)</th>
                      <th className="px-4 py-2.5 font-semibold">Giá trị đã giải mã</th>
                      <th className="px-4 py-2.5 font-semibold">Cặp gốc trên URL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {parsedQueryParams.params.map((item, index) => (
                      <tr key={`${item.key}-${index}`}>
                        <td className="px-4 py-2.5 text-muted-foreground">{index + 1}</td>
                        <td className="px-4 py-2.5 font-mono font-bold text-primary">
                          {item.key}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-foreground">
                          {item.value}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                          {item.rawPair}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground sm:text-sm">
                Chưa phát hiện tham số query (dạng <code>?key=value&amp;...</code>) trong ô nhập liệu phía trên.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
