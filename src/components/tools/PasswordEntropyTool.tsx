"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type ToolMode = "generator" | "analyzer";
type GenSubMode = "random" | "passphrase";

const UPPER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER_CHARS = "abcdefghijklmnopqrstuvwxyz";
const DIGIT_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*()-_=+[]{};:,.?";
const AMBIGUOUS_SET = new Set(["0", "O", "1", "l", "I"]);

const DICEWARE_WORDS = [
  "Solar", "Quantum", "Bamboo", "Nebula", "Vector", "Cipher", "Lotus", "Glacier",
  "Photon", "Beacon", "Matrix", "Summit", "Prism", "Horizon", "Vertex", "Cactus",
  "Aurora", "Compass", "Cobalt", "Orbit", "Falcon", "Lantern", "Breeze", "Timber",
  "Anchor", "Marble", "Kinetic", "Signal", "Zenith", "Harbor", "Quartz", "Ripple",
  "Spark", "Cedar", "Velvet", "Pulse", "Meadow", "Canyon", "Meteor", "Bridge",
  "Mosaic", "Saffron", "Binary", "Kernel", "Socket", "Tundra", "Mirage", "Dynamo",
  "Voyage", "Amber", "Fossil", "Delta", "Echo", "Nimbus", "Siren", "Grove",
  "Copper", "Willow", "Titan", "Coral", "Flame", "Frost", "Silver", "Maple",
  "Pebble", "Shadow", "Pixel", "Radar", "Stream", "Cloud", "Tower", "Crown",
  "Shield", "Sword", "Arrow", "Helmet", "Castle", "Dragon", "Phoenix", "Tiger",
  "Eagle", "Dolphin", "Panther", "Lynx", "Otter", "Badger", "Raven", "Robin",
  "Orchid", "Jasmine", "Bonsai", "Acorn", "Clover", "Fern", "Moss", "River",
  "Ocean", "Lagoon", "Island", "Valley", "Desert", "Forest", "Jungle", "Prairie",
  "Comet", "Galaxy", "Planet", "Saturn", "Jupiter", "Mercury", "Lunar", "Eclipse",
  "Rocket", "Shuttle", "Capsule", "Module", "Engine", "Turbine", "Piston", "Dynamo",
  "Laser", "Sensor", "Router", "Server", "Packet", "Buffer", "Stream", "Thread",
  "Lambda", "Tensor", "Scalar", "Factor", "Prime", "Modulo", "Axiom", "Lemma",
  "Chord", "Tempo", "Rhythm", "Melody", "Sonnet", "Canvas", "Sketch", "Studio",
  "Pepper", "Ginger", "Cocoa", "Mango", "Papaya", "Lychee", "Pomelo", "Almond",
  "Cashew", "Walnut", "Nutmeg", "Cinnamon", "Vanilla", "Honey", "Nectar", "Citrus",
  "Ruby", "Topaz", "Emerald", "Sapphire", "Opal", "Garnet", "Jade", "Pearl",
  "Bronze", "Nickel", "Titanium", "Carbon", "Silicon", "Helium", "Neon", "Argon",
  "Crystal", "Diamond", "Granite", "Basalt", "Obsidian", "Velvet", "Satin", "Linen",
  "Atlas", "Chrono", "Helix", "Vortex", "Cyclone", "Monsoon", "Zephyr", "Blizzard",
  "Thunder", "Lightning", "Rainbow", "Sunrise", "Twilight", "Midnight", "Solstice", "Equinox",
  "Voyager", "Pioneer", "Ranger", "Scout", "Keeper", "Guardian", "Watcher", "Mentor",
  "Scholar", "Syntax", "Logic", "Theory", "Method", "Pattern", "Filter", "Branch",
  "Commit", "Deploy", "Docker", "Script", "Studio", "Portal", "Gateway", "Tunnel",
  "Bridge", "Cipher", "Hash", "Token", "Keyring", "Vault", "Bunker", "Fortress",
  "Bastion", "Citadel", "Beacon", "Signal", "Pulse", "Wave", "Beacon", "North",
  "South", "Summit", "Zenith", "Apex", "Core", "Node", "Link", "Mesh",
];

const COMMON_WEAK_PATTERNS = [
  "password",
  "123456",
  "12345678",
  "123456789",
  "qwerty",
  "asdfgh",
  "zxcvbn",
  "admin",
  "letmein",
  "welcome",
  "iloveyou",
  "monkey",
  "dragon",
  "matkhau",
  "vietnam",
  "anhyeuem",
  "emyeuanh",
  "sinhvien",
  "hocsinh",
  "abc123",
  "111111",
  "000000",
  "654321",
];

const SEQUENCES = [
  "0123456789",
  "9876543210",
  "abcdefghijklmnopqrstuvwxyz",
  "zyxwvutsrqponmlkjihgfedcba",
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
  "1qaz2wsx3edc",
];

const EMPTY_BATCH: string[] = [];
const emptySubscribe = () => () => {};
let cachedInitialBatch: string[] | null = null;

function secureRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 1) return 0;
  if (typeof window === "undefined" || !window.crypto?.getRandomValues) {
    return 0;
  }
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - ((maxUint32 + 1) % maxExclusive);
  const buf = new Uint32Array(1);
  let value = 0;
  do {
    window.crypto.getRandomValues(buf);
    value = buf[0];
  } while (value > limit);
  return value % maxExclusive;
}

function secureShuffle(items: string[]): string[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = secureRandomInt(i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

type RandomOptions = {
  length: number;
  upper: boolean;
  lower: boolean;
  digits: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
};

type PassphraseOptions = {
  wordCount: number;
  separator: string;
  capitalize: boolean;
  includeSuffix: boolean;
};

function filterAmbiguous(chars: string, exclude: boolean): string {
  if (!exclude) return chars;
  return chars
    .split("")
    .filter((ch) => !AMBIGUOUS_SET.has(ch))
    .join("");
}

function generateOneRandomPassword(opts: RandomOptions): string {
  const pools: string[] = [];
  if (opts.upper) pools.push(filterAmbiguous(UPPER_CHARS, opts.excludeAmbiguous));
  if (opts.lower) pools.push(filterAmbiguous(LOWER_CHARS, opts.excludeAmbiguous));
  if (opts.digits) pools.push(filterAmbiguous(DIGIT_CHARS, opts.excludeAmbiguous));
  if (opts.symbols) pools.push(SYMBOL_CHARS);

  if (pools.length === 0) return "";
  const combined = pools.join("");
  const chars: string[] = [];

  for (const pool of pools) {
    if (chars.length < opts.length && pool.length > 0) {
      chars.push(pool[secureRandomInt(pool.length)]);
    }
  }
  while (chars.length < opts.length) {
    chars.push(combined[secureRandomInt(combined.length)]);
  }
  return secureShuffle(chars).join("");
}

function generateOnePassphrase(opts: PassphraseOptions): string {
  const words: string[] = [];
  for (let i = 0; i < opts.wordCount; i += 1) {
    const raw = DICEWARE_WORDS[secureRandomInt(DICEWARE_WORDS.length)];
    words.push(opts.capitalize ? raw : raw.toLowerCase());
  }
  let phrase = words.join(opts.separator);
  if (opts.includeSuffix) {
    const num = 100 + secureRandomInt(900);
    const specialChoices = "!@#$%&*?";
    const sym = specialChoices[secureRandomInt(specialChoices.length)];
    phrase = `${phrase}${opts.separator}${num}${sym}`;
  }
  return phrase;
}

function generateFivePasswords(
  subMode: GenSubMode,
  randomOpts: RandomOptions,
  passphraseOpts: PassphraseOptions,
): string[] {
  const results: string[] = [];
  for (let i = 0; i < 5; i += 1) {
    results.push(
      subMode === "random"
        ? generateOneRandomPassword(randomOpts)
        : generateOnePassphrase(passphraseOpts),
    );
  }
  return results;
}

function getInitialBatchSnapshot(): string[] {
  if (typeof window === "undefined" || !window.crypto?.getRandomValues) {
    return EMPTY_BATCH;
  }
  if (!cachedInitialBatch) {
    cachedInitialBatch = generateFivePasswords(
      "random",
      {
        length: 16,
        upper: true,
        lower: true,
        digits: true,
        symbols: true,
        excludeAmbiguous: false,
      },
      {
        wordCount: 4,
        separator: "-",
        capitalize: true,
        includeSuffix: true,
      },
    );
  }
  return cachedInitialBatch;
}

type SecurityTier = {
  label: string;
  badgeClass: string;
  barClass: string;
  percent: number;
  advice: string;
};

function getSecurityTier(bits: number): SecurityTier {
  if (bits < 35) {
    return {
      label: "Rất yếu",
      badgeClass: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
      barClass: "bg-rose-500",
      percent: Math.max(8, Math.min(20, (bits / 35) * 20)),
      advice: "Có thể bị bẻ khóa gần như tức thì. Không nên dùng cho bất kỳ tài khoản nào.",
    };
  }
  if (bits < 60) {
    return {
      label: "Trung bình",
      badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
      barClass: "bg-amber-500",
      percent: 20 + ((bits - 35) / 25) * 22,
      advice: "Chấp nhận được với hệ thống giới hạn số lần nhập, nhưng dễ bị crack nếu lộ hash MD5/SHA-256.",
    };
  }
  if (bits < 80) {
    return {
      label: "Mạnh",
      badgeClass: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
      barClass: "bg-sky-500",
      percent: 42 + ((bits - 60) / 20) * 22,
      advice: "An toàn tốt cho tài khoản cá nhân, email, học tập và mạng xã hội.",
    };
  }
  if (bits < 128) {
    return {
      label: "Rất mạnh",
      badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
      barClass: "bg-emerald-500",
      percent: 64 + ((bits - 80) / 48) * 24,
      advice: "Rất khó bị tấn công vét cạn ngay cả với cụm GPU mạnh. Lý tưởng cho tài khoản quan trọng.",
    };
  }
  return {
    label: "Chuẩn Quân sự",
    badgeClass: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
    barClass: "bg-teal-500",
    percent: 100,
    advice: "Đạt chuẩn mã hóa ≥ 128 bit: bất khả thi để vét cạn với công nghệ hiện tại.",
  };
}

function formatBruteForceDuration(entropyBits: number, guessesPerSecond: number): string {
  if (entropyBits <= 1) return "Tức thì (< 0.01 giây)";
  const log10Seconds =
    Math.max(0, entropyBits - 1) * Math.LOG10E * Math.LN2 - Math.log10(guessesPerSecond);

  if (log10Seconds < -2) return "Tức thì (< 0.01 giây)";
  if (log10Seconds < 0) return "< 1 giây";

  if (log10Seconds >= 18) {
    const expYears = Math.floor(log10Seconds - Math.log10(31_536_000));
    return `> Tuổi thọ vũ trụ (~10^${expYears} năm)`;
  }

  const seconds = Math.pow(10, log10Seconds);
  if (seconds < 60) return `${seconds.toFixed(seconds < 10 ? 1 : 0)} giây`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${minutes.toFixed(minutes < 10 ? 1 : 0)} phút`;
  const hours = minutes / 60;
  if (hours < 24) return `${hours.toFixed(hours < 10 ? 1 : 0)} giờ`;
  const days = hours / 24;
  if (days < 30) return `${days.toFixed(days < 10 ? 1 : 0)} ngày`;
  const months = days / 30.4375;
  if (months < 12) return `${months.toFixed(months < 10 ? 1 : 0)} tháng`;
  const years = days / 365.25;
  if (years < 1_000) return `${years.toFixed(years < 10 ? 1 : 0)} năm`;
  if (years < 1_000_000) return `${(years / 1_000).toFixed(1)} nghìn năm`;
  if (years < 1_000_000_000) return `${(years / 1_000_000).toFixed(1)} triệu năm`;
  if (years < 13_800_000_000) return `${(years / 1_000_000_000).toFixed(1)} tỷ năm`;
  return "> Tuổi thọ vũ trụ (> 13.8 tỷ năm)";
}

type EntropyAnalysis = {
  length: number;
  poolSize: number;
  hasLower: boolean;
  hasUpper: boolean;
  hasDigits: boolean;
  hasSymbols: boolean;
  hasUnicode: boolean;
  rawEntropy: number;
  effectiveEntropy: number;
  warnings: string[];
  tier: SecurityTier;
};

function analyzePasswordEntropy(password: string): EntropyAnalysis {
  const length = password.length;
  if (length === 0) {
    return {
      length: 0,
      poolSize: 0,
      hasLower: false,
      hasUpper: false,
      hasDigits: false,
      hasSymbols: false,
      hasUnicode: false,
      rawEntropy: 0,
      effectiveEntropy: 0,
      warnings: [],
      tier: getSecurityTier(0),
    };
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigits = /[0-9]/.test(password);
  const hasSymbols = /[^a-zA-Z0-9\u0080-\uFFFF]/.test(password);
  const hasUnicode = /[^\x00-\x7F]/.test(password);

  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasDigits) poolSize += 10;
  if (hasSymbols) poolSize += 32;
  if (hasUnicode) poolSize += 64;

  const rawEntropy = poolSize > 0 ? length * Math.log2(poolSize) : 0;
  const warnings: string[] = [];
  let penaltyBits = 0;

  // Check unique character ratio
  const uniqueChars = new Set(password.split("")).size;
  const uniqueRatio = uniqueChars / length;
  if (length >= 4 && uniqueRatio < 0.5) {
    const ratioPenalty = (1 - uniqueRatio) * rawEntropy * 0.45;
    penaltyBits += ratioPenalty;
    warnings.push(
      `Tỷ lệ ký tự duy nhất thấp (${uniqueChars}/${length} ký tự khác nhau).`,
    );
  }

  // Consecutive identical chars (e.g. "aaa", "111")
  if (/(.)\1{2,}/.test(password)) {
    penaltyBits += 12;
    warnings.push("Chứa 3+ ký tự giống hệt nhau đứng liên tiếp.");
  }

  // Sequential patterns (length >= 3)
  const lowerPwd = password.toLowerCase();
  let foundSequence: string | null = null;
  for (const seq of SEQUENCES) {
    for (let i = 0; i <= seq.length - 3; i += 1) {
      const sub3 = seq.slice(i, i + 3);
      if (lowerPwd.includes(sub3)) {
        // Find longest match in this sequence
        let end = i + 3;
        while (end < seq.length && lowerPwd.includes(seq.slice(i, end + 1))) {
          end += 1;
        }
        const matched = seq.slice(i, end);
        if (!foundSequence || matched.length > foundSequence.length) {
          foundSequence = matched;
        }
      }
    }
  }
  if (foundSequence) {
    penaltyBits += Math.min(35, foundSequence.length * 6);
    warnings.push(
      `Chứa chuỗi tuần tự hoặc phím liền kề dễ đoán ("${foundSequence}").`,
    );
  }

  // Common weak words / dictionary patterns
  const matchedCommon = COMMON_WEAK_PATTERNS.find((w) => lowerPwd.includes(w));
  if (matchedCommon) {
    penaltyBits += Math.max(18, matchedCommon.length * 4);
    warnings.push(
      `Chứa từ khóa hoặc mật khẩu phổ biến dễ bị từ điển dò ("${matchedCommon}").`,
    );
  }

  // Year patterns (1950-2039)
  if (/(?:19[5-9]\d|20[0-3]\d)/.test(password)) {
    penaltyBits += 8;
    warnings.push("Chứa năm sinh hoặc mốc năm (19xx/20xx) dễ đoán.");
  }

  // Single character class warning
  const classCount = [hasLower, hasUpper, hasDigits, hasSymbols].filter(Boolean).length;
  if (classCount === 1 && length < 14) {
    warnings.push("Chỉ dùng 1 nhóm ký tự — nên kết hợp chữ hoa, thường, số và ký hiệu.");
  }

  const effectiveEntropy = Math.max(
    uniqueChars <= 1 ? 0 : 4,
    rawEntropy - penaltyBits,
  );
  const finalEffective = Math.min(rawEntropy, effectiveEntropy);

  return {
    length,
    poolSize,
    hasLower,
    hasUpper,
    hasDigits,
    hasSymbols,
    hasUnicode,
    rawEntropy,
    effectiveEntropy: finalEffective,
    warnings,
    tier: getSecurityTier(finalEffective),
  };
}

function renderColoredPassword(pwd: string) {
  return pwd.split("").map((ch, idx) => {
    if (/[0-9]/.test(ch)) {
      return (
        <span key={idx} className="text-sky-600 dark:text-sky-400">
          {ch}
        </span>
      );
    }
    if (/[^a-zA-Z0-9]/.test(ch)) {
      return (
        <span key={idx} className="text-amber-600 dark:text-amber-400">
          {ch}
        </span>
      );
    }
    return <span key={idx}>{ch}</span>;
  });
}

export function PasswordEntropyTool() {
  const [activeMode, setActiveMode] = useState<ToolMode>("generator");
  const [genSubMode, setGenSubMode] = useState<GenSubMode>("random");

  // Random password options
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);

  // Passphrase options
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState("-");
  const [capitalize, setCapitalize] = useState(true);
  const [includeSuffix, setIncludeSuffix] = useState(true);

  // Client-safe initial batch via useSyncExternalStore + user-driven regenerations
  const initialBatch = useSyncExternalStore(
    emptySubscribe,
    getInitialBatchSnapshot,
    () => EMPTY_BATCH,
  );
  const [customBatch, setCustomBatch] = useState<string[] | null>(null);
  const displayedBatch = customBatch ?? initialBatch;

  const [copiedIdx, setCopiedIdx] = useState<number | "all" | null>(null);

  // Mode 2: Analyzer state
  const [inspectInput, setInspectInput] = useState("QuizKen@2027!");
  const [showInspectText, setShowInspectText] = useState(true);

  const analysis = useMemo(
    () => analyzePasswordEntropy(inspectInput),
    [inspectInput],
  );

  const regenerate = (
    nextSubMode = genSubMode,
    nextRandom = { length, upper, lower, digits, symbols, excludeAmbiguous },
    nextPass = { wordCount, separator, capitalize, includeSuffix },
  ) => {
    setCustomBatch(generateFivePasswords(nextSubMode, nextRandom, nextPass));
    setCopiedIdx(null);
  };

  const toggleCharset = (key: "upper" | "lower" | "digits" | "symbols") => {
    const next = { upper, lower, digits, symbols };
    next[key] = !next[key];
    // Prevent disabling all 4 charsets
    if (!next.upper && !next.lower && !next.digits && !next.symbols) return;
    if (key === "upper") setUpper(next.upper);
    if (key === "lower") setLower(next.lower);
    if (key === "digits") setDigits(next.digits);
    if (key === "symbols") setSymbols(next.symbols);
    regenerate("random", {
      length,
      ...next,
      excludeAmbiguous,
    });
  };

  const handleCopy = async (text: string, idx: number | "all") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      window.setTimeout(() => {
        setCopiedIdx((prev) => (prev === idx ? null : prev));
      }, 1800);
    } catch {
      // Clipboard API fallback ignored if restricted
    }
  };

  const handleSendToAnalyzer = (pwd: string) => {
    setInspectInput(pwd);
    setShowInspectText(true);
    setActiveMode("analyzer");
  };

  const passphraseTheoreticalBits = useMemo(() => {
    const base = wordCount * Math.log2(DICEWARE_WORDS.length);
    const suffixBits = includeSuffix ? Math.log2(900 * 8) : 0;
    return base + suffixBits;
  }, [wordCount, includeSuffix]);

  const attackScenarios = useMemo(() => {
    const eff = analysis.effectiveEntropy;
    return [
      {
        name: "Online Rate-Limited",
        rateLabel: "100 thử / giây",
        desc: "Hệ thống đăng nhập có giới hạn tốc độ / khóa tạm thời.",
        time: formatBruteForceDuration(eff, 100),
      },
      {
        name: "Offline Fast Hash (GPU)",
        rateLabel: "10 tỷ thử / giây",
        desc: "Lộ CSDL băm nhanh (MD5 / SHA-256 không salt) chạy trên cụm GPU.",
        time: formatBruteForceDuration(eff, 10_000_000_000),
      },
      {
        name: "Offline Slow Hash (Bcrypt / Argon2)",
        rateLabel: "10.000 thử / giây",
        desc: "CSDL băm chậm chuẩn an toàn (Bcrypt / Argon2id có salt & cost factor).",
        time: formatBruteForceDuration(eff, 10_000),
      },
    ];
  }, [analysis.effectiveEntropy]);

  return (
    <div className="space-y-6">
      {/* Prominent CSPRNG Privacy Banner */}
      <div className="flex flex-col gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground">
              🔒 Sinh &amp; kiểm tra mật khẩu 100% trên trình duyệt bằng bộ sinh số ngẫu nhiên mật mã học (Web Crypto CSPRNG)
            </p>
            <p className="text-xs text-muted-foreground">
              Dùng <code className="font-mono text-foreground">window.crypto.getRandomValues()</code> với lọc lấy mẫu không thiên lệch (Rejection Sampling). Không gửi dữ liệu qua mạng, không lưu lịch sử.
            </p>
          </div>
        </div>
        <Badge className="self-start shrink-0 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 sm:self-center">
          <Lock className="h-3.5 w-3.5" />
          <span>0 Network Calls</span>
        </Badge>
      </div>

      {/* Primary Mode Switcher */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/70 bg-card/85 p-2">
        <button
          type="button"
          onClick={() => setActiveMode("generator")}
          className={cn(
            "flex flex-1 min-w-[200px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer",
            activeMode === "generator"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground",
          )}
        >
          <KeyRound className="h-4 w-4" />
          <span>1. Tạo Mật Khẩu &amp; Passphrase</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveMode("analyzer")}
          className={cn(
            "flex flex-1 min-w-[200px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer",
            activeMode === "analyzer"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground",
          )}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>2. Phân Tích Entropy &amp; Brute-Force</span>
        </button>
      </div>

      {activeMode === "generator" ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Controls */}
          <div className="lg:col-span-5 rounded-2xl border border-border/70 bg-card/85 p-5 space-y-5">
            {/* Sub-mode tabs */}
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-foreground/[0.04] p-1">
              <button
                type="button"
                onClick={() => {
                  setGenSubMode("random");
                  regenerate("random");
                }}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs font-bold transition-colors cursor-pointer",
                  genSubMode === "random"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Ký tự Ngẫu nhiên
              </button>
              <button
                type="button"
                onClick={() => {
                  setGenSubMode("passphrase");
                  regenerate("passphrase");
                }}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs font-bold transition-colors cursor-pointer",
                  genSubMode === "passphrase"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Passphrase (Diceware)
              </button>
            </div>

            {genSubMode === "random" ? (
              <div className="space-y-5">
                {/* Length Slider */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="pwd-length-slider"
                      className="text-sm font-bold text-foreground"
                    >
                      Độ dài mật khẩu
                    </label>
                    <span className="rounded-lg bg-primary/15 px-2.5 py-0.5 font-mono text-sm font-bold text-primary">
                      {length} ký tự
                    </span>
                  </div>
                  <input
                    id="pwd-length-slider"
                    type="range"
                    min={8}
                    max={64}
                    value={length}
                    onChange={(e) => {
                      const nextLen = Number(e.target.value);
                      setLength(nextLen);
                      regenerate("random", {
                        length: nextLen,
                        upper,
                        lower,
                        digits,
                        symbols,
                        excludeAmbiguous,
                      });
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>8</span>
                    <div className="flex gap-1.5">
                      {[12, 16, 24, 32].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setLength(preset);
                            regenerate("random", {
                              length: preset,
                              upper,
                              lower,
                              digits,
                              symbols,
                              excludeAmbiguous,
                            });
                          }}
                          className={cn(
                            "rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold transition-colors cursor-pointer",
                            length === preset
                              ? "bg-primary text-primary-foreground"
                              : "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.12]",
                          )}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    <span>64</span>
                  </div>
                </div>

                {/* Charset Checkboxes */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Tập ký tự sử dụng
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                    {[
                      {
                        key: "upper" as const,
                        label: "Chữ HOA (A–Z)",
                        checked: upper,
                      },
                      {
                        key: "lower" as const,
                        label: "Chữ thường (a–z)",
                        checked: lower,
                      },
                      {
                        key: "digits" as const,
                        label: "Chữ số (0–9)",
                        checked: digits,
                      },
                      {
                        key: "symbols" as const,
                        label: "Ký tự đặc biệt (!@#$%^&*...)",
                        checked: symbols,
                      },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-3.5 py-2.5 text-sm font-medium text-foreground cursor-pointer hover:border-primary/40"
                      >
                        <span>{item.label}</span>
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleCharset(item.key)}
                          className="h-4 w-4 accent-primary cursor-pointer"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Ambiguous Characters Option */}
                <label className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-foreground/[0.03] px-3.5 py-3 text-xs font-medium text-foreground cursor-pointer hover:border-primary/40">
                  <div className="space-y-0.5">
                    <span className="font-semibold">
                      Loại bỏ ký tự dễ nhầm lẫn (0, O, 1, l, I)
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Hữu ích khi cần đọc hoặc nhập mật khẩu thủ công trên điện thoại.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={excludeAmbiguous}
                    onChange={(e) => {
                      const nextExcl = e.target.checked;
                      setExcludeAmbiguous(nextExcl);
                      regenerate("random", {
                        length,
                        upper,
                        lower,
                        digits,
                        symbols,
                        excludeAmbiguous: nextExcl,
                      });
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-primary cursor-pointer"
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">
                      Số lượng từ (Diceware/XKCD)
                    </span>
                    <span className="rounded-lg bg-primary/15 px-2.5 py-0.5 font-mono text-xs font-bold text-primary">
                      ~{passphraseTheoreticalBits.toFixed(1)} bits
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[4, 5, 6].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => {
                          setWordCount(cnt);
                          regenerate("passphrase", undefined, {
                            wordCount: cnt,
                            separator,
                            capitalize,
                            includeSuffix,
                          });
                        }}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-sm font-bold transition-colors cursor-pointer",
                          wordCount === cnt
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border/70 bg-background/70 text-foreground hover:bg-foreground/[0.05]",
                        )}
                      >
                        {cnt} từ
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Ký tự phân cách
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { val: "-", label: "Gạch (-)" },
                      { val: "_", label: "Dưới (_)" },
                      { val: ".", label: "Chấm (.)" },
                      { val: " ", label: "Cách ( )" },
                    ].map((sep) => (
                      <button
                        key={sep.val}
                        type="button"
                        onClick={() => {
                          setSeparator(sep.val);
                          regenerate("passphrase", undefined, {
                            wordCount,
                            separator: sep.val,
                            capitalize,
                            includeSuffix,
                          });
                        }}
                        className={cn(
                          "rounded-xl border px-2 py-2 text-xs font-semibold transition-colors cursor-pointer",
                          separator === sep.val
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border/70 bg-background/70 text-foreground hover:bg-foreground/[0.05]",
                        )}
                      >
                        {sep.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-3.5 py-2.5 text-sm font-medium text-foreground cursor-pointer">
                    <span>Viết hoa chữ cái đầu (Title Case)</span>
                    <input
                      type="checkbox"
                      checked={capitalize}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setCapitalize(val);
                        regenerate("passphrase", undefined, {
                          wordCount,
                          separator,
                          capitalize: val,
                          includeSuffix,
                        });
                      }}
                      className="h-4 w-4 accent-primary cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-3.5 py-2.5 text-sm font-medium text-foreground cursor-pointer">
                    <span>Thêm hậu tố Số + Ký tự đặc biệt (vd: 742!)</span>
                    <input
                      type="checkbox"
                      checked={includeSuffix}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setIncludeSuffix(val);
                        regenerate("passphrase", undefined, {
                          wordCount,
                          separator,
                          capitalize,
                          includeSuffix: val,
                        });
                      }}
                      className="h-4 w-4 accent-primary cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => regenerate()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>
                Tạo 5 {genSubMode === "random" ? "Mật khẩu" : "Passphrase"} Mới (CSPRNG)
              </span>
            </button>
          </div>

          {/* Right Batch Results (5 passwords at once) */}
          <div className="lg:col-span-7 rounded-2xl border border-border/70 bg-card/85 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Danh sách 5 gợi ý ngẫu nhiên vừa sinh
                </h2>
                <p className="text-xs text-muted-foreground">
                  Mỗi dòng được sinh độc lập bằng CSPRNG. Bấm &quot;Phân tích&quot; để kiểm tra thời gian chống Brute-Force.
                </p>
              </div>
              {displayedBatch.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleCopy(displayedBatch.join("\n"), "all")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] transition-colors cursor-pointer"
                >
                  {copiedIdx === "all" ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Đã chép cả 5</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Sao chép cả 5</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="space-y-3">
              {displayedBatch.length === 0 ? (
                <div className="rounded-xl border border-border/60 bg-background/70 p-6 text-center text-sm text-muted-foreground">
                  Đang khởi tạo mật khẩu bằng Web Crypto CSPRNG...
                </div>
              ) : (
                displayedBatch.map((pwd, idx) => {
                  const info = analyzePasswordEntropy(pwd);
                  return (
                    <div
                      key={`${idx}-${pwd}`}
                      className="rounded-xl border border-border/70 bg-background/90 p-3.5 space-y-2.5 transition-colors hover:border-primary/40"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex-1 overflow-x-auto">
                          <code className="block font-mono text-sm sm:text-base font-semibold tracking-wide text-foreground break-all">
                            {renderColoredPassword(pwd)}
                          </code>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleSendToAnalyzer(pwd)}
                            className="rounded-lg bg-foreground/[0.06] px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] transition-colors cursor-pointer"
                          >
                            Phân tích
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy(pwd, idx)}
                            className={cn(
                              "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer",
                              copiedIdx === idx
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                : "bg-primary text-primary-foreground hover:bg-primary/90",
                            )}
                          >
                            {copiedIdx === idx ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span>Đã chép</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span
                          className={cn(
                            "rounded-md px-2 py-0.5 font-bold",
                            info.tier.badgeClass,
                          )}
                        >
                          {info.tier.label}
                        </span>
                        <span className="font-mono text-muted-foreground">
                          {info.effectiveEntropy.toFixed(1)} bits Entropy
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          Độ dài: <strong className="text-foreground">{info.length}</strong>
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          GPU 10 tỷ/s:{" "}
                          <strong className="text-foreground">
                            {formatBruteForceDuration(info.effectiveEntropy, 10_000_000_000)}
                          </strong>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-foreground" /> Chữ cái
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-500" /> Chữ số
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Ký tự đặc biệt
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Password Strength & Entropy Analyzer */
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="entropy-password-input"
                className="font-heading text-base font-bold text-foreground"
              >
                Nhập mật khẩu cần kiểm tra độ mạnh &amp; Entropy (Bits)
              </label>
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-muted-foreground">Thử nhanh:</span>
                {[
                  { label: "123456", val: "123456" },
                  { label: "Qwerty2026", val: "Qwerty2026" },
                  { label: "SinhVien@2027", val: "SinhVien@2027" },
                  { label: "Solar-Quantum-Bamboo-742!", val: "Solar-Quantum-Bamboo-742!" },
                ].map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => setInspectInput(sample.val)}
                    className="rounded-lg bg-foreground/[0.06] px-2.5 py-1 font-mono text-[11px] font-semibold text-foreground hover:bg-foreground/[0.12] transition-colors cursor-pointer"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <input
                id="entropy-password-input"
                type={showInspectText ? "text" : "password"}
                value={inspectInput}
                onChange={(e) => setInspectInput(e.target.value)}
                spellCheck={false}
                autoComplete="off"
                placeholder="Gõ hoặc dán mật khẩu tại đây (chạy 100% cục bộ trên trình duyệt)..."
                className="w-full rounded-xl border border-border bg-background/90 py-3.5 pl-4 pr-24 font-mono text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
                {inspectInput.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setInspectInput("")}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground cursor-pointer"
                  >
                    Xóa
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowInspectText((v) => !v)}
                  aria-label={showInspectText ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground cursor-pointer"
                >
                  {showInspectText ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Visual Security Meter */}
            <div className="space-y-2.5 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-lg px-3 py-1 text-xs font-bold",
                      analysis.tier.badgeClass,
                    )}
                  >
                    {analysis.length === 0 ? "Chưa nhập mật khẩu" : analysis.tier.label}
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    {analysis.effectiveEntropy.toFixed(1)} bits Entropy thực tế
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Lý thuyết: <strong className="font-mono text-foreground">{analysis.rawEntropy.toFixed(1)} bits</strong>
                </span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    analysis.length === 0 ? "bg-transparent" : analysis.tier.barClass,
                  )}
                  style={{
                    width: `${analysis.length === 0 ? 0 : analysis.tier.percent}%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-5 gap-1 text-[10px] font-medium text-muted-foreground sm:text-[11px]">
                <span>Rất yếu &lt;35</span>
                <span className="text-center">Trung bình 35–59</span>
                <span className="text-center">Mạnh 60–79</span>
                <span className="text-center">Rất mạnh 80–127</span>
                <span className="text-right">Quân sự ≥128</span>
              </div>

              {analysis.length > 0 && (
                <p className="text-xs text-muted-foreground">{analysis.tier.advice}</p>
              )}
            </div>
          </div>

          {/* Metrics & Warnings */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5 rounded-2xl border border-border/70 bg-card/85 p-5 space-y-4">
              <h3 className="font-heading text-base font-bold text-foreground">
                Thông số Toán học Entropy: E = L · log₂(R)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-foreground/[0.04] p-3">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Độ dài (L)
                  </p>
                  <p className="font-mono text-xl font-bold text-foreground">
                    {analysis.length} <span className="text-xs font-normal">ký tự</span>
                  </p>
                </div>
                <div className="rounded-xl bg-foreground/[0.04] p-3">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Không gian ký tự (R)
                  </p>
                  <p className="font-mono text-xl font-bold text-foreground">
                    {analysis.poolSize} <span className="text-xs font-normal">ký tự</span>
                  </p>
                </div>
                <div className="rounded-xl bg-foreground/[0.04] p-3">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Entropy lý thuyết
                  </p>
                  <p className="font-mono text-xl font-bold text-foreground">
                    {analysis.rawEntropy.toFixed(1)}{" "}
                    <span className="text-xs font-normal">bits</span>
                  </p>
                </div>
                <div className="rounded-xl bg-primary/10 p-3">
                  <p className="text-[11px] font-medium text-primary">
                    Entropy hiệu dụng
                  </p>
                  <p className="font-mono text-xl font-bold text-primary">
                    {analysis.effectiveEntropy.toFixed(1)}{" "}
                    <span className="text-xs font-normal">bits</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  { label: "a–z (26)", active: analysis.hasLower },
                  { label: "A–Z (26)", active: analysis.hasUpper },
                  { label: "0–9 (10)", active: analysis.hasDigits },
                  { label: "Ký tự đặc biệt (32)", active: analysis.hasSymbols },
                  ...(analysis.hasUnicode
                    ? [{ label: "Unicode / Tiếng Việt (+64)", active: true }]
                    : []),
                ].map((chip) => (
                  <span
                    key={chip.label}
                    className={cn(
                      "rounded-lg px-2.5 py-1 font-medium",
                      chip.active
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        : "bg-foreground/[0.05] text-muted-foreground line-through",
                    )}
                  >
                    {chip.label}
                  </span>
                ))}
              </div>

              {analysis.warnings.length > 0 && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.08] p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>Điểm yếu mẫu ký tự phát hiện được (trừ Entropy):</span>
                  </div>
                  <ul className="list-disc pl-5 text-xs text-amber-800 dark:text-amber-200 space-y-1">
                    {analysis.warnings.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 3 Attack Scenarios Brute-Force Table */}
            <div className="lg:col-span-7 rounded-2xl border border-border/70 bg-card/85 p-5 space-y-4">
              <div className="space-y-1">
                <h3 className="font-heading text-base font-bold text-foreground">
                  Ước tính Thời gian Bẻ khóa (Brute-Force) qua 3 Kịch bản Tấn công
                </h3>
                <p className="text-xs text-muted-foreground">
                  Tính theo trung bình số lần thử (50% không gian tìm kiếm: 2^(E−1) lần thử).
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border/70">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-foreground/[0.04]">
                    <tr>
                      <th className="border-b border-border/70 px-3.5 py-2.5 font-bold text-foreground">
                        Kịch bản tấn công
                      </th>
                      <th className="border-b border-border/70 px-3.5 py-2.5 font-bold text-foreground">
                        Tốc độ dò
                      </th>
                      <th className="border-b border-border/70 px-3.5 py-2.5 font-bold text-foreground">
                        Thời gian ước tính
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {attackScenarios.map((row) => (
                      <tr key={row.name} className="hover:bg-foreground/[0.02]">
                        <td className="px-3.5 py-3">
                          <p className="font-semibold text-foreground">{row.name}</p>
                          <p className="text-[11px] text-muted-foreground">{row.desc}</p>
                        </td>
                        <td className="px-3.5 py-3 font-mono font-semibold text-muted-foreground whitespace-nowrap">
                          {row.rateLabel}
                        </td>
                        <td className="px-3.5 py-3 font-mono font-bold text-primary whitespace-nowrap">
                          {analysis.length === 0 ? "—" : row.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/[0.06] p-3.5 text-xs leading-relaxed text-muted-foreground">
                <div className="flex items-center gap-1.5 font-bold text-foreground mb-1">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Bài học An toàn thông tin: Vì sao Bcrypt / Argon2id quan trọng?</span>
                </div>
                Cùng một mật khẩu, nếu máy chủ chỉ lưu bằng hàm băm nhanh (MD5, SHA-256), cụm GPU hiện đại thử được <strong>10 tỷ mật khẩu/giây</strong> (gấp <strong>1 triệu lần</strong> so với Bcrypt/Argon2 chỉ ~10.000 thử/giây). Kết hợp mật khẩu Entropy cao (≥ 80 bits) với thuật toán băm chậm có Salt giúp hệ thống an toàn trước cả tấn công ngoại tuyến.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
