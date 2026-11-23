"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  Check,
  Copy,
  Eye,
  EyeOff,
  Hash,
  KeyRound,
  Lock,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Unlock,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
  AES_PBKDF2_ITERATIONS,
  caesarBruteForce,
  caesarTransform,
  computeRsaParameters,
  decryptAes256Gcm,
  encryptAes256Gcm,
  hmacSha256Hex,
  md5,
  rsaDecryptInteger,
  rsaDecryptTextBlocks,
  rsaEncryptInteger,
  rsaEncryptTextBytes,
  vigenereTransform,
  webCryptoHash,
  type AesDecryptResult,
  type AesEncryptResult,
} from "@/lib/cryptoAlgorithms";

type TabId = "hash" | "aes" | "rsa" | "classical";

type HashRow = {
  id: string;
  name: string;
  bits: number;
  value: string;
  statusLabel: string;
  statusTone: "warn" | "good";
};

const RSA_PRESETS = [
  { label: "Nhỏ (p=17, q=11, e=7)", p: "17", q: "11", e: "7", sampleM: "88" },
  { label: "Kinh điển SGK (p=61, q=53, e=17)", p: "61", q: "53", e: "17", sampleM: "65" },
  { label: "Hỗ trợ UTF-8 (p=257, q=263, e=65537)", p: "257", q: "263", e: "65537", sampleM: "2027" },
  { label: "Số lớn (p=1009, q=1013, e=65537)", p: "1009", q: "1013", e: "65537", sampleM: "12345" },
] as const;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function copyWithFeedback(
  value: string,
  key: string,
  setCopiedKey: (k: string | null) => void,
) {
  if (!value || typeof navigator === "undefined" || !navigator.clipboard) return;
  navigator.clipboard
    .writeText(value)
    .then(() => {
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1600);
    })
    .catch(() => {});
}

export function CryptoHashCipherTool() {
  const [activeTab, setActiveTab] = useState<TabId>("hash");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  /* ----------------------------- TAB 1: HASHING ---------------------------- */
  const [hashInput, setHashInput] = useState<string>("QuizKen An toàn thông tin 2027");
  const [hmacSecret, setHmacSecret] = useState<string>("quizken-secret-key");
  const [uppercaseHex, setUppercaseHex] = useState<boolean>(false);
  const [shaResults, setShaResults] = useState<{
    sha1: string;
    sha256: string;
    sha384: string;
    sha512: string;
    hmac256: string;
  }>({
    sha1: "",
    sha256: "",
    sha384: "",
    sha512: "",
    hmac256: "",
  });

  const md5Digest = useMemo(() => md5(hashInput), [hashInput]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      webCryptoHash("SHA-1", hashInput),
      webCryptoHash("SHA-256", hashInput),
      webCryptoHash("SHA-384", hashInput),
      webCryptoHash("SHA-512", hashInput),
      hmacSecret ? hmacSha256Hex(hmacSecret, hashInput) : Promise.resolve(""),
    ])
      .then(([sha1, sha256, sha384, sha512, hmac256]) => {
        if (cancelled) return;
        setShaResults({ sha1, sha256, sha384, sha512, hmac256 });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [hashInput, hmacSecret]);

  const hashRows: HashRow[] = useMemo(() => {
    const fmt = (val: string) => (uppercaseHex ? val.toUpperCase() : val);
    return [
      {
        id: "md5",
        name: "MD5 (RFC 1321)",
        bits: 128,
        value: fmt(md5Digest),
        statusLabel: "Lỗi thời — chỉ dùng kiểm tra checksum",
        statusTone: "warn",
      },
      {
        id: "sha1",
        name: "SHA-1",
        bits: 160,
        value: fmt(shaResults.sha1),
        statusLabel: "Không khuyến nghị cho bảo mật mới",
        statusTone: "warn",
      },
      {
        id: "sha256",
        name: "SHA-256",
        bits: 256,
        value: fmt(shaResults.sha256),
        statusLabel: "Chuẩn công nghiệp phổ biến",
        statusTone: "good",
      },
      {
        id: "sha384",
        name: "SHA-384",
        bits: 384,
        value: fmt(shaResults.sha384),
        statusLabel: "Độ an toàn cao (SHA-2)",
        statusTone: "good",
      },
      {
        id: "sha512",
        name: "SHA-512",
        bits: 512,
        value: fmt(shaResults.sha512),
        statusLabel: "Độ an toàn rất cao (SHA-2)",
        statusTone: "good",
      },
    ];
  }, [md5Digest, shaResults, uppercaseHex]);

  /* ---------------------------- TAB 2: AES-256-GCM ------------------------- */
  const [aesMode, setAesMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [aesPlaintext, setAesPlaintext] = useState<string>(
    "Mật khẩu bài thi Tin học 12: QuizKen@2027!",
  );
  const [aesCipherInput, setAesCipherInput] = useState<string>("");
  const [aesPassphrase, setAesPassphrase] = useState<string>("KhoaBiMat#2027");
  const [showAesPass, setShowAesPass] = useState<boolean>(false);
  const [aesBusy, setAesBusy] = useState<boolean>(false);
  const [aesError, setAesError] = useState<string | null>(null);
  const [aesEncryptOut, setAesEncryptOut] = useState<AesEncryptResult | null>(null);
  const [aesDecryptOut, setAesDecryptOut] = useState<AesDecryptResult | null>(null);

  async function handleRunAes() {
    setAesError(null);
    setAesBusy(true);
    try {
      if (aesMode === "encrypt") {
        const res = await encryptAes256Gcm(aesPlaintext, aesPassphrase);
        setAesEncryptOut(res);
      } else {
        const res = await decryptAes256Gcm(aesCipherInput, aesPassphrase);
        setAesDecryptOut(res);
      }
    } catch (err) {
      setAesError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi xử lý AES-256-GCM.");
    } finally {
      setAesBusy(false);
    }
  }

  /* ------------------------------- TAB 3: RSA ------------------------------ */
  const [rsaP, setRsaP] = useState<string>("61");
  const [rsaQ, setRsaQ] = useState<string>("53");
  const [rsaE, setRsaE] = useState<string>("17");
  const [rsaSubMode, setRsaSubMode] = useState<"number" | "text">("number");
  const [rsaNumM, setRsaNumM] = useState<string>("65");
  const [rsaNumC, setRsaNumC] = useState<string>("2790");
  const [rsaTextInput, setRsaTextInput] = useState<string>("Hi!");
  const [rsaBlocksInput, setRsaBlocksInput] = useState<string>("");

  const rsaKey = useMemo(() => computeRsaParameters(rsaP, rsaQ, rsaE), [rsaP, rsaQ, rsaE]);

  const rsaNumberEncrypt = useMemo(() => {
    if (!rsaKey.valid || !rsaNumM.trim()) return null;
    try {
      return { ok: true as const, ...rsaEncryptInteger(rsaNumM, rsaKey.e, rsaKey.n) };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Lỗi mã hóa số M.",
      };
    }
  }, [rsaKey, rsaNumM]);

  const rsaNumberDecrypt = useMemo(() => {
    if (!rsaKey.valid || !rsaNumC.trim()) return null;
    try {
      return { ok: true as const, ...rsaDecryptInteger(rsaNumC, rsaKey.d, rsaKey.n) };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Lỗi giải mã số C.",
      };
    }
  }, [rsaKey, rsaNumC]);

  const rsaTextEncrypt = useMemo(() => {
    if (!rsaKey.valid || rsaSubMode !== "text" || !rsaTextInput) return null;
    try {
      return { ok: true as const, ...rsaEncryptTextBytes(rsaTextInput, rsaKey.e, rsaKey.n) };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Không thể mã hóa văn bản.",
      };
    }
  }, [rsaKey, rsaSubMode, rsaTextInput]);

  const rsaTextDecrypt = useMemo(() => {
    if (!rsaKey.valid || rsaSubMode !== "text" || !rsaBlocksInput.trim()) return null;
    try {
      return {
        ok: true as const,
        plaintext: rsaDecryptTextBlocks(rsaBlocksInput, rsaKey.d, rsaKey.n),
      };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Không thể giải mã khối số.",
      };
    }
  }, [rsaKey, rsaSubMode, rsaBlocksInput]);

  /* ------------------------ TAB 4: CLASSICAL CIPHERS ----------------------- */
  const [classicalType, setClassicalType] = useState<"caesar" | "vigenere">("caesar");
  const [caesarMode, setCaesarMode] = useState<"encode" | "decode">("encode");
  const [caesarShift, setCaesarShift] = useState<number>(3);
  const [caesarText, setCaesarText] = useState<string>("HELLO QUIZKEN TIN HOC 12");
  const [showBruteForce, setShowBruteForce] = useState<boolean>(true);

  const caesarResult = useMemo(
    () => caesarTransform(caesarText, caesarShift, caesarMode),
    [caesarText, caesarShift, caesarMode],
  );

  const caesarAllShifts = useMemo(
    () => (showBruteForce ? caesarBruteForce(caesarText) : []),
    [caesarText, showBruteForce],
  );

  const [vigMode, setVigMode] = useState<"encode" | "decode">("encode");
  const [vigKey, setVigKey] = useState<string>("QUIZKEN");
  const [vigText, setVigText] = useState<string>("AN TOAN THONG TIN");

  const vigResult = useMemo(
    () => vigenereTransform(vigText, vigKey, vigMode),
    [vigText, vigKey, vigMode],
  );

  return (
    <div className="space-y-6">
      {/* Privacy & Engine Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
        <div className="flex items-center gap-2.5 font-semibold">
          <Lock className="h-4 w-4 shrink-0" />
          <span>
            🔒 Thực thi 100% cục bộ bằng Web Crypto API &amp; Toán học BigInt — Không gửi dữ liệu hay khóa bí mật qua mạng
          </span>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
          Client-Side Cryptography
        </Badge>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border/70 bg-card/85 p-2 lg:grid-cols-4">
        {(
          [
            { id: "hash", label: "1. Hàm Băm & HMAC", icon: Hash },
            { id: "aes", label: "2. AES-256-GCM", icon: ShieldCheck },
            { id: "rsa", label: "3. Mô phỏng RSA", icon: Calculator },
            { id: "classical", label: "4. Caesar & Vigenère", icon: KeyRound },
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
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-heading font-semibold transition-colors sm:text-sm cursor-pointer",
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

      {/* ===================================================================== */}
      {/* TAB 1: ONE-WAY HASHES & HMAC-SHA256                                   */}
      {/* ===================================================================== */}
      {activeTab === "hash" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Nhập văn bản cần băm (Hỗ trợ đầy đủ UTF-8 Tiếng Việt)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Tất cả mã băm MD5, SHA-1, SHA-256, SHA-384, SHA-512 được tính tức thì theo từng phím gõ (hiệu ứng Avalanche).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUppercaseHex((v) => !v)}
                className="min-h-10 rounded-xl border border-border bg-background/80 px-3.5 text-xs font-semibold text-foreground hover:border-primary/60 cursor-pointer"
              >
                Định dạng Hex: <span className="text-primary">{uppercaseHex ? "CHỮ HOA" : "chữ thường"}</span>
              </button>
            </div>

            <textarea
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              rows={3}
              spellCheck={false}
              placeholder="Nhập chuỗi bất kỳ để quan sát hiệu ứng tuyết lở (Avalanche Effect)..."
              className="w-full rounded-xl border border-border bg-background/80 p-3.5 font-mono text-xs leading-relaxed text-foreground focus:border-primary focus:outline-none sm:text-sm"
            />

            <div className="space-y-3">
              {hashRows.map((row) => (
                <div
                  key={row.id}
                  className="rounded-xl border border-border/60 bg-background/60 p-3.5 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-heading text-sm font-bold text-foreground">
                        {row.name}
                      </span>
                      <Badge>{row.bits} bit</Badge>
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[11px] font-semibold",
                          row.statusTone === "good"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                            : "bg-amber-500/15 text-amber-700 dark:text-amber-300",
                        )}
                      >
                        {row.statusLabel}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyWithFeedback(row.value, row.id, setCopiedKey)}
                      className="inline-flex h-8 items-center gap-1 rounded-lg bg-foreground/[0.06] px-2.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
                    >
                      {copiedKey === row.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copiedKey === row.id ? "Đã chép" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="break-all rounded-lg bg-card/90 px-3 py-2 font-mono text-xs text-foreground select-all">
                    {row.value || "Đang tính..."}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HMAC-SHA256 */}
          <div className="rounded-2xl border border-sky-500/30 bg-card/85 p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-heading text-lg font-bold text-sky-600 dark:text-sky-400">
                  HMAC-SHA256 (Mã xác thực thông điệp có khóa bí mật)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Kết hợp thông điệp phía trên với Secret Key bằng Web Crypto API để chống giả mạo dữ liệu (ví dụ Webhook, API Signature).
                </p>
              </div>
              <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-300">256 bit</Badge>
            </div>

            <input
              type="text"
              value={hmacSecret}
              onChange={(e) => setHmacSecret(e.target.value)}
              placeholder="Nhập khóa bí mật (Secret Key) cho HMAC-SHA256..."
              className="min-h-11 w-full rounded-xl border border-border bg-background/80 px-3.5 font-mono text-xs text-foreground focus:border-sky-500 focus:outline-none sm:text-sm"
            />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex-1 break-all rounded-xl border border-border/60 bg-background/70 px-3.5 py-2.5 font-mono text-xs text-foreground select-all">
                {hmacSecret
                  ? uppercaseHex
                    ? shaResults.hmac256.toUpperCase()
                    : shaResults.hmac256
                  : "(Nhập Secret Key để tính HMAC-SHA256)"}
              </div>
              <button
                type="button"
                disabled={!hmacSecret || !shaResults.hmac256}
                onClick={() =>
                  copyWithFeedback(
                    uppercaseHex ? shaResults.hmac256.toUpperCase() : shaResults.hmac256,
                    "hmac256",
                    setCopiedKey,
                  )
                }
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-sky-500/15 px-4 text-xs font-semibold text-sky-700 dark:text-sky-300 hover:bg-sky-500/25 disabled:opacity-50 cursor-pointer"
              >
                {copiedKey === "hmac256" ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copiedKey === "hmac256" ? "Đã chép" : "Copy HMAC"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: AES-256-GCM AUTHENTICATED ENCRYPTION                           */}
      {/* ===================================================================== */}
      {activeTab === "aes" && (
        <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setAesMode("encrypt");
                  setAesError(null);
                }}
                className={cn(
                  "inline-flex min-h-10 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
                  aesMode === "encrypt"
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.1]",
                )}
              >
                <Lock className="h-4 w-4" />
                <span>Mã hóa (Encrypt)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAesMode("decrypt");
                  setAesError(null);
                }}
                className={cn(
                  "inline-flex min-h-10 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
                  aesMode === "decrypt"
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.1]",
                )}
              >
                <Unlock className="h-4 w-4" />
                <span>Giải mã (Decrypt)</span>
              </button>
            </div>

            <Badge className="bg-primary/15 text-primary">
              AES-256-GCM • PBKDF2 ({AES_PBKDF2_ITERATIONS.toLocaleString("vi-VN")} vòng SHA-256)
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Mật khẩu mã hóa (Passphrase)
              </label>
              <div className="relative flex items-center">
                <input
                  type={showAesPass ? "text" : "password"}
                  value={aesPassphrase}
                  onChange={(e) => setAesPassphrase(e.target.value)}
                  placeholder="Nhập mật khẩu để dẫn xuất khóa 256-bit bằng PBKDF2..."
                  className="min-h-11 w-full rounded-xl border border-border bg-background/80 pr-11 pl-3.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowAesPass((v) => !v)}
                  aria-label={showAesPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  className="absolute right-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showAesPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {aesMode === "encrypt" ? (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Văn bản gốc cần mã hóa (Plaintext UTF-8)
                </label>
                <textarea
                  value={aesPlaintext}
                  onChange={(e) => setAesPlaintext(e.target.value)}
                  rows={4}
                  placeholder="Nhập thông điệp bí mật cần bảo vệ bằng AES-256-GCM..."
                  className="w-full rounded-xl border border-border bg-background/80 p-3.5 font-mono text-xs leading-relaxed text-foreground focus:border-primary focus:outline-none sm:text-sm"
                />
              </div>
            ) : (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Chuỗi đã mã hóa Base64 (Gói Salt 16B + IV 12B + Ciphertext &amp; Auth Tag)
                </label>
                <textarea
                  value={aesCipherInput}
                  onChange={(e) => setAesCipherInput(e.target.value)}
                  rows={4}
                  spellCheck={false}
                  placeholder="Dán chuỗi Base64 sinh ra từ chế độ Mã hóa..."
                  className="w-full rounded-xl border border-border bg-background/80 p-3.5 font-mono text-xs leading-relaxed text-foreground focus:border-primary focus:outline-none sm:text-sm"
                />
              </div>
            )}

            <button
              type="button"
              disabled={aesBusy}
              onClick={() => {
                void handleRunAes();
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-heading font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
            >
              {aesBusy ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : aesMode === "encrypt" ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Unlock className="h-4 w-4" />
              )}
              <span>
                {aesBusy
                  ? "Đang dẫn xuất khóa PBKDF2..."
                  : aesMode === "encrypt"
                    ? "Mã hóa AES-256-GCM ngay"
                    : "Giải mã AES-256-GCM ngay"}
              </span>
            </button>

            {aesError && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-700 dark:text-rose-300 sm:text-sm">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{aesError}</span>
              </div>
            )}

            {aesMode === "encrypt" && aesEncryptOut && (
              <div className="space-y-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Kết quả Gói Mã hóa Base64 (Salt + IV + Ciphertext)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        copyWithFeedback(aesEncryptOut.payloadBase64, "aes-out", setCopiedKey)
                      }
                      className="inline-flex h-8 items-center gap-1 rounded-lg bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
                    >
                      {copiedKey === "aes-out" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copiedKey === "aes-out" ? "Đã chép" : "Copy Base64"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAesCipherInput(aesEncryptOut.payloadBase64);
                        setAesDecryptOut(null);
                        setAesError(null);
                        setAesMode("decrypt");
                      }}
                      className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary/15 px-3 text-xs font-semibold text-primary hover:bg-primary/25 cursor-pointer"
                    >
                      <span>Thử giải mã gói này</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="break-all rounded-lg bg-background/80 p-3 font-mono text-xs text-foreground select-all">
                  {aesEncryptOut.payloadBase64}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
                  <div className="rounded-lg border border-border/50 bg-background/60 p-2.5">
                    <div className="font-semibold text-muted-foreground">Salt ngẫu nhiên (16 bytes)</div>
                    <div className="mt-1 break-all font-mono text-foreground">
                      {aesEncryptOut.saltBase64}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-background/60 p-2.5">
                    <div className="font-semibold text-muted-foreground">IV / Nonce (12 bytes)</div>
                    <div className="mt-1 break-all font-mono text-foreground">
                      {aesEncryptOut.ivBase64}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-background/60 p-2.5">
                    <div className="font-semibold text-muted-foreground">Ciphertext + GCM Tag</div>
                    <div className="mt-1 break-all font-mono text-foreground line-clamp-2">
                      {aesEncryptOut.ciphertextBase64}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {aesMode === "decrypt" && aesDecryptOut && (
              <div className="space-y-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Giải mã thành công &amp; Xác thực GCM Tag hợp lệ
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyWithFeedback(aesDecryptOut.plaintext, "aes-plain", setCopiedKey)
                    }
                    className="inline-flex h-8 items-center gap-1 rounded-lg bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.1] cursor-pointer"
                  >
                    {copiedKey === "aes-plain" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedKey === "aes-plain" ? "Đã chép" : "Copy"}</span>
                  </button>
                </div>
                <pre className="whitespace-pre-wrap break-words rounded-lg bg-background/80 p-3.5 font-mono text-xs text-foreground sm:text-sm">
                  {aesDecryptOut.plaintext}
                </pre>
                <p className="text-xs text-muted-foreground">
                  Salt trích xuất: <code className="text-foreground">{aesDecryptOut.saltBase64}</code> • IV:{" "}
                  <code className="text-foreground">{aesDecryptOut.ivBase64}</code> • Độ dài Ciphertext+Tag:{" "}
                  <code className="text-foreground">{aesDecryptOut.ciphertextBytes} bytes</code>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: INTERACTIVE RSA MATH SIMULATOR                                 */}
      {/* ===================================================================== */}
      {activeTab === "rsa" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Bước 1: Sinh cặp khóa RSA từ hai số nguyên tố (p, q) và số mũ e
                </h2>
                <p className="text-xs text-muted-foreground">
                  Tính bằng số nguyên lớn <code>BigInt</code> chính xác tuyệt đối, không làm tròn dấu phẩy động.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {RSA_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setRsaP(preset.p);
                      setRsaQ(preset.q);
                      setRsaE(preset.e);
                      setRsaNumM(preset.sampleM);
                    }}
                    className="min-h-9 rounded-lg bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-primary/15 hover:text-primary cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                  Số nguyên tố p
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={rsaP}
                  onChange={(e) => setRsaP(e.target.value)}
                  className="min-h-11 w-full rounded-xl border border-border bg-background/80 px-3.5 font-mono text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                  Số nguyên tố q (q ≠ p)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={rsaQ}
                  onChange={(e) => setRsaQ(e.target.value)}
                  className="min-h-11 w-full rounded-xl border border-border bg-background/80 px-3.5 font-mono text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                  Số mũ công khai e (gcd(e, φ(n)) = 1)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={rsaE}
                  onChange={(e) => setRsaE(e.target.value)}
                  className="min-h-11 w-full rounded-xl border border-border bg-background/80 px-3.5 font-mono text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {!rsaKey.valid ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-700 dark:text-rose-300 sm:text-sm">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{rsaKey.error}</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-border/60 bg-background/70 p-3">
                    <div className="text-xs text-muted-foreground">Mô-đun n = p × q</div>
                    <div className="mt-1 font-mono text-base font-bold text-foreground">
                      {rsaKey.n}
                    </div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/70 p-3">
                    <div className="text-xs text-muted-foreground">Hàm Euler φ(n)</div>
                    <div className="mt-1 font-mono text-base font-bold text-foreground">
                      {rsaKey.phi}
                    </div>
                  </div>
                  <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3">
                    <div className="text-xs font-semibold text-sky-700 dark:text-sky-300">
                      Public Key (e, n)
                    </div>
                    <div className="mt-1 font-mono text-sm font-bold text-foreground">
                      ({rsaKey.e}, {rsaKey.n})
                    </div>
                  </div>
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                    <div className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                      Private Key (d, n)
                    </div>
                    <div className="mt-1 font-mono text-sm font-bold text-foreground">
                      ({rsaKey.d}, {rsaKey.n})
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary">
                    Lời giải từng bước (Toán rời rạc)
                  </div>
                  {rsaKey.steps.map((step) => (
                    <p key={step} className="font-mono text-xs leading-relaxed text-muted-foreground">
                      {step}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {rsaKey.valid && (
            <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Bước 2: Thực hành Mã hóa C = M^e mod n &amp; Giải mã M = C^d mod n
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRsaSubMode("number")}
                    className={cn(
                      "min-h-9 rounded-lg px-3.5 text-xs font-semibold cursor-pointer",
                      rsaSubMode === "number"
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground/[0.06] text-foreground",
                    )}
                  >
                    Thử với Số nguyên M
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsaSubMode("text")}
                    className={cn(
                      "min-h-9 rounded-lg px-3.5 text-xs font-semibold cursor-pointer",
                      rsaSubMode === "text"
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground/[0.06] text-foreground",
                    )}
                  >
                    Thử với Chuỗi ký tự (n &gt; 255)
                  </button>
                </div>
              </div>

              {rsaSubMode === "number" ? (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {/* Encrypt M -> C */}
                  <div className="rounded-xl border border-sky-500/30 bg-background/60 p-4 space-y-3">
                    <div className="text-xs font-bold uppercase text-sky-600 dark:text-sky-400">
                      Mã hóa bằng Khóa công khai (e = {rsaKey.e}, n = {rsaKey.n})
                    </div>
                    <label className="block text-xs text-muted-foreground">
                      Nhập bản rõ số M (0 ≤ M &lt; {rsaKey.n}):
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={rsaNumM}
                      onChange={(e) => setRsaNumM(e.target.value)}
                      className="min-h-10 w-full rounded-lg border border-border bg-card px-3 font-mono text-sm text-foreground focus:border-sky-500 focus:outline-none"
                    />
                    {rsaNumberEncrypt && rsaNumberEncrypt.ok ? (
                      <div className="space-y-2">
                        <div className="rounded-lg bg-sky-500/10 p-2.5 font-mono text-xs text-foreground">
                          {rsaNumberEncrypt.formula}
                        </div>
                        <button
                          type="button"
                          onClick={() => setRsaNumC(rsaNumberEncrypt.ciphertext)}
                          className="inline-flex h-8 items-center gap-1 rounded-lg bg-sky-500/15 px-3 text-xs font-semibold text-sky-700 dark:text-sky-300 hover:bg-sky-500/25 cursor-pointer"
                        >
                          <span>Đẩy C = {rsaNumberEncrypt.ciphertext} sang ô Giải mã</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : rsaNumberEncrypt && !rsaNumberEncrypt.ok ? (
                      <p className="text-xs text-rose-500">{rsaNumberEncrypt.error}</p>
                    ) : null}
                  </div>

                  {/* Decrypt C -> M */}
                  <div className="rounded-xl border border-amber-500/30 bg-background/60 p-4 space-y-3">
                    <div className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400">
                      Giải mã bằng Khóa bí mật (d = {rsaKey.d}, n = {rsaKey.n})
                    </div>
                    <label className="block text-xs text-muted-foreground">
                      Nhập bản mã số C (0 ≤ C &lt; {rsaKey.n}):
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={rsaNumC}
                      onChange={(e) => setRsaNumC(e.target.value)}
                      className="min-h-10 w-full rounded-lg border border-border bg-card px-3 font-mono text-sm text-foreground focus:border-amber-500 focus:outline-none"
                    />
                    {rsaNumberDecrypt && rsaNumberDecrypt.ok ? (
                      <div className="rounded-lg bg-amber-500/10 p-2.5 font-mono text-xs text-foreground">
                        {rsaNumberDecrypt.formula}
                      </div>
                    ) : rsaNumberDecrypt && !rsaNumberDecrypt.ok ? (
                      <p className="text-xs text-rose-500">{rsaNumberDecrypt.error}</p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div className="space-y-2.5">
                      <label className="block text-xs font-semibold text-muted-foreground">
                        Văn bản ngắn cần mã hóa từng byte UTF-8
                      </label>
                      <input
                        type="text"
                        value={rsaTextInput}
                        onChange={(e) => setRsaTextInput(e.target.value)}
                        className="min-h-10 w-full rounded-xl border border-border bg-background/80 px-3.5 font-mono text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                      {rsaTextEncrypt && rsaTextEncrypt.ok ? (
                        <div className="space-y-2 rounded-xl border border-border/60 bg-background/60 p-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-sky-600 dark:text-sky-400">
                              Chuỗi khối số bản mã (C₁ C₂ ...)
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setRsaBlocksInput(rsaTextEncrypt.blocks.join(" "))
                              }
                              className="font-semibold text-primary hover:underline cursor-pointer"
                            >
                              Đẩy sang giải mã →
                            </button>
                          </div>
                          <div className="break-all font-mono text-xs text-foreground">
                            {rsaTextEncrypt.blocks.join(" ")}
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {rsaTextEncrypt.byteDetails.slice(0, 16).map((item, idx) => (
                              <span
                                key={`${item.byte}-${idx}`}
                                className="rounded-md bg-card px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                              >
                                &apos;{item.char}&apos; ({item.byte}) → {item.cipher}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : rsaTextEncrypt && !rsaTextEncrypt.ok ? (
                        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
                          {rsaTextEncrypt.error}
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-2.5">
                      <label className="block text-xs font-semibold text-muted-foreground">
                        Dán dãy số bản mã (cách nhau bằng dấu cách) để giải mã
                      </label>
                      <input
                        type="text"
                        value={rsaBlocksInput}
                        onChange={(e) => setRsaBlocksInput(e.target.value)}
                        placeholder="Ví dụ: 2790 1234 ..."
                        className="min-h-10 w-full rounded-xl border border-border bg-background/80 px-3.5 font-mono text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                      {rsaTextDecrypt && rsaTextDecrypt.ok ? (
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                          <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                            Văn bản giải mã được:
                          </div>
                          <div className="mt-1 font-mono text-sm font-bold text-foreground">
                            {rsaTextDecrypt.plaintext}
                          </div>
                        </div>
                      ) : rsaTextDecrypt && !rsaTextDecrypt.ok ? (
                        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-300">
                          {rsaTextDecrypt.error}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: CLASSICAL CAESAR & VIGENERE CIPHERS                            */}
      {/* ===================================================================== */}
      {activeTab === "classical" && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setClassicalType("caesar")}
              className={cn(
                "min-h-10 rounded-xl px-4 text-xs font-semibold cursor-pointer sm:text-sm",
                classicalType === "caesar"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/85 border border-border/70 text-foreground",
              )}
            >
              Mật mã Caesar (Dịch chuyển k = 1..25 &amp; Brute-Force)
            </button>
            <button
              type="button"
              onClick={() => setClassicalType("vigenere")}
              className={cn(
                "min-h-10 rounded-xl px-4 text-xs font-semibold cursor-pointer sm:text-sm",
                classicalType === "vigenere"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/85 border border-border/70 text-foreground",
              )}
            >
              Mật mã Vigenère (Đa bảng chữ cái theo Từ khóa)
            </button>
          </div>

          {classicalType === "caesar" ? (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCaesarMode("encode")}
                      className={cn(
                        "min-h-10 rounded-xl px-4 text-xs font-semibold cursor-pointer sm:text-sm",
                        caesarMode === "encode"
                          ? "bg-primary text-primary-foreground"
                          : "bg-foreground/[0.06] text-foreground",
                      )}
                    >
                      Mã hóa (+k)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCaesarMode("decode")}
                      className={cn(
                        "min-h-10 rounded-xl px-4 text-xs font-semibold cursor-pointer sm:text-sm",
                        caesarMode === "decode"
                          ? "bg-primary text-primary-foreground"
                          : "bg-foreground/[0.06] text-foreground",
                      )}
                    >
                      Giải mã (-k)
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold text-muted-foreground sm:text-sm">
                      Độ dịch k = <span className="font-mono text-primary">{caesarShift}</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={25}
                      value={caesarShift}
                      onChange={(e) => setCaesarShift(Number(e.target.value))}
                      className="w-32 accent-primary cursor-pointer sm:w-44"
                    />
                  </div>
                </div>

                {/* Interactive Alphabet Substitution Mapping */}
                <div className="overflow-x-auto rounded-xl border border-border/60 bg-background/60 p-3">
                  <div className="mb-1.5 text-[11px] font-semibold uppercase text-muted-foreground">
                    Bảng ánh xạ chữ cái (Shift k = {caesarShift})
                  </div>
                  <div className="grid min-w-[540px] grid-cols-26 gap-1 text-center font-mono text-xs">
                    {ALPHABET.map((ch) => (
                      <div key={`plain-${ch}`} className="rounded bg-foreground/[0.05] py-1 font-bold text-foreground">
                        {ch}
                      </div>
                    ))}
                    {ALPHABET.map((ch, idx) => {
                      const mappedIdx =
                        caesarMode === "encode"
                          ? (idx + caesarShift) % 26
                          : (idx - caesarShift + 26) % 26;
                      return (
                        <div
                          key={`cipher-${ch}`}
                          className="rounded bg-primary/15 py-1 font-bold text-primary"
                        >
                          {ALPHABET[mappedIdx]}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Văn bản đầu vào (A–Z)
                    </span>
                    <textarea
                      value={caesarText}
                      onChange={(e) => setCaesarText(e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-border bg-background/80 p-3.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none sm:text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                      <span>Kết quả Caesar (k = {caesarShift})</span>
                      <button
                        type="button"
                        onClick={() => copyWithFeedback(caesarResult, "caesar-out", setCopiedKey)}
                        className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer"
                      >
                        {copiedKey === "caesar-out" ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        <span>{copiedKey === "caesar-out" ? "Đã chép" : "Copy"}</span>
                      </button>
                    </div>
                    <textarea
                      readOnly
                      value={caesarResult}
                      rows={4}
                      className="w-full rounded-xl border border-border bg-background/60 p-3.5 font-mono text-xs text-foreground focus:outline-none sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Caesar 25-shift Brute-Force Table */}
              <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-heading text-base font-bold text-foreground sm:text-lg">
                      Thử vét cạn (Brute-Force) tất cả 25 khóa dịch Caesar
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Vì không gian khóa Caesar chỉ có 25 khả năng, kẻ tấn công dễ dàng thử hết toàn bộ bảng chữ cái trong tích tắc.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBruteForce((v) => !v)}
                    className="min-h-9 rounded-lg bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground cursor-pointer"
                  >
                    {showBruteForce ? "Thu gọn" : "Hiện bảng Brute-Force"}
                  </button>
                </div>

                {showBruteForce && (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {caesarAllShifts.map((row) => (
                      <div
                        key={row.shift}
                        className={cn(
                          "flex items-center gap-2.5 rounded-xl border px-3 py-2 font-mono text-xs",
                          row.shift === caesarShift
                            ? "border-primary/50 bg-primary/10 text-foreground"
                            : "border-border/50 bg-background/60 text-muted-foreground",
                        )}
                      >
                        <span className="shrink-0 rounded bg-foreground/[0.08] px-1.5 py-0.5 font-bold text-foreground">
                          k={row.shift.toString().padStart(2, "0")}
                        </span>
                        <span className="truncate">{row.plaintext}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setVigMode("encode")}
                    className={cn(
                      "min-h-10 rounded-xl px-4 text-xs font-semibold cursor-pointer sm:text-sm",
                      vigMode === "encode"
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground/[0.06] text-foreground",
                    )}
                  >
                    Mã hóa Vigenère
                  </button>
                  <button
                    type="button"
                    onClick={() => setVigMode("decode")}
                    className={cn(
                      "min-h-10 rounded-xl px-4 text-xs font-semibold cursor-pointer sm:text-sm",
                      vigMode === "decode"
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground/[0.06] text-foreground",
                    )}
                  >
                    Giải mã Vigenère
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">Từ khóa (A–Z):</span>
                  <input
                    type="text"
                    value={vigKey}
                    onChange={(e) => setVigKey(e.target.value)}
                    placeholder="QUIZKEN"
                    className="min-h-10 w-40 rounded-xl border border-border bg-background/80 px-3 font-mono text-xs font-bold uppercase text-primary focus:border-primary focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              {!vigResult.normalizedKey && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span>Vui lòng nhập từ khóa chứa ít nhất một chữ cái A–Z.</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Văn bản đầu vào
                  </span>
                  <textarea
                    value={vigText}
                    onChange={(e) => setVigText(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-border bg-background/80 p-3.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none sm:text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span>
                      Kết quả Vigenère (Khóa chuẩn hóa: {vigResult.normalizedKey || "trống"})
                    </span>
                    <button
                      type="button"
                      onClick={() => copyWithFeedback(vigResult.result, "vig-out", setCopiedKey)}
                      className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer"
                    >
                      {copiedKey === "vig-out" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copiedKey === "vig-out" ? "Đã chép" : "Copy"}</span>
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={vigResult.result}
                    rows={4}
                    className="w-full rounded-xl border border-border bg-background/60 p-3.5 font-mono text-xs text-foreground focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              {vigResult.steps.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-border/60 bg-background/60 p-3">
                  <div className="mb-2 text-xs font-semibold text-muted-foreground">
                    Minh họa ánh xạ từng chữ cái (tối đa 40 chữ cái đầu)
                  </div>
                  <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                    {vigResult.steps.map((s, idx) => (
                      <div
                        key={`${s.char}-${idx}`}
                        className="flex flex-col items-center rounded-lg border border-border/50 bg-card px-2 py-1"
                      >
                        <span className="text-muted-foreground">{s.char}</span>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400">
                          {s.keyChar}(+{s.shift})
                        </span>
                        <span className="font-bold text-primary">{s.out}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
