import * as React from "react";
import { SITE } from "@/lib/site";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type ConversionPlacement =
  | "global_exit_popup"
  | "mobile_floating_bar"
  | "blog_sticky_sidebar"
  | "blog_inline_cta"
  | "tool_action_toast"
  | "pseo_quiz_result";

export type ContextualAdCreative = {
  id: string;
  campaign: string;
  badge: string;
  headline: string;
  description: string;
  ctaLabel: string;
  targetPath: string;
  bullets: string[];
  samplePrompts: string[];
};

const CREATIVES: Record<
  "teacher" | "exam_2027" | "language" | "uni_student" | "general",
  ContextualAdCreative
> = {
  teacher: {
    id: "teacher",
    campaign: "teacher_suite",
    badge: "Dành cho Giáo viên",
    headline: "Soạn Đề Chuẩn 7991 & Xuất Word/PDF Chỉ 10 Giây",
    description:
      "AI tự tạo đề 3 phần chuẩn Công văn 7991, trộn mã đề tự động, xuất Word/PDF có đáp án và mở Live Game cho cả lớp.",
    ctaLabel: "Tạo Đề Cho Lớp Ngay",
    targetPath: "/quiz/create",
    bullets: [
      "Chuẩn 3 phần: Nhiều lựa chọn, Đúng/Sai, Trả lời ngắn",
      "Xuất file Word (.docx) & PDF sắc nét kèm ma trận",
      "Mở Phòng Thi Online & Đấu Trường Live miễn phí",
    ],
    samplePrompts: [
      "Đề kiểm tra Toán 12 Chương 1 chuẩn 3 phần",
      "Trắc nghiệm Vật lý 11 Điện trường 45 phút",
      "Đề ôn tập Lịch sử 12 có Đúng/Sai",
    ],
  },
  exam_2027: {
    id: "exam_2027",
    campaign: "exam_2027",
    badge: "Ôn Thi THPT 2027 & ĐGNL",
    headline: "Luyện Đề Chuẩn 3 Phần & Chẩn Đoán Lỗ Hổng AI",
    description:
      "Sinh đề thi thử bám sát cấu trúc THPT 2027, ĐGNL HSA/V-ACT/TSA, chấm điểm tức thì và giải thích chi tiết từng câu.",
    ctaLabel: "Luyện Đề AI Miễn Phí",
    targetPath: "/quiz/create",
    bullets: [
      "Đúng chuẩn 3 phần mới & cấu trúc ĐGNL 2026–2027",
      "Gia sư AI giải thích từng ý Đúng/Sai khi làm nhầm",
      "Đồng hồ đếm ngược & thống kê điểm mục tiêu",
    ],
    samplePrompts: [
      "Đề thi thử Toán THPT 2027 chuẩn 3 phần",
      "Luyện đề ĐGNL HSA Tư duy định lượng",
      "Đề ôn thi vào lớp 10 môn Tiếng Anh",
    ],
  },
  language: {
    id: "language",
    campaign: "language_hub",
    badge: "Ngoại ngữ & Chứng chỉ",
    headline: "Luyện Từ Vựng & Đề Thi IELTS, TOEIC, VSTEP Thông Minh",
    description:
      "Tạo bộ đề từ vựng, ngữ pháp và đọc hiểu theo band điểm mục tiêu kèm giải thích bẫy chi tiết và flashcard ghi nhớ.",
    ctaLabel: "Mở English Hub Ngay",
    targetPath: "/english",
    bullets: [
      "Hỗ trợ VSTEP, IELTS, TOEIC, HSK, JLPT & Tiếng Anh THPT",
      "Flashcard & quiz trắc nghiệm theo ngữ cảnh thực tế",
      "Phân tích bẫy ngữ pháp & collocation dễ mất điểm",
    ],
    samplePrompts: [
      "30 câu từ vựng VSTEP B1-B2 Reading",
      "Ngữ pháp IELTS Academic Band 7.0+",
      "Từ vựng TOEIC Part 5 hay bẫy",
    ],
  },
  uni_student: {
    id: "uni_student",
    campaign: "uni_pass",
    badge: "Sinh viên Đại học",
    headline: "Ôn Cấp Tốc Đại Cương & Chuyên Ngành Giữ Vững GPA",
    description:
      "Nhập tên học phần hoặc dán slide bài giảng để AI tạo ngay ngân hàng trắc nghiệm sát đề cuối kỳ và giải thích từng câu.",
    ctaLabel: "Tạo Đề Ôn Cuối Kỳ",
    targetPath: "/quiz/create",
    bullets: [
      "Triết học, Pháp luật đại cương, Kinh tế chính trị",
      "Tạo quiz trực tiếp từ file PDF, Word hoặc ghi chú",
      "Ôn nhanh trọng tâm trước kỳ thi tín chỉ cuối kỳ",
    ],
    samplePrompts: [
      "Trắc nghiệm Triết học Mác-Lênin Chương 1",
      "Pháp luật đại cương câu hỏi tình huống",
      "Kinh tế chính trị Mác-Lênin ôn cuối kỳ",
    ],
  },
  general: {
    id: "general",
    campaign: "ai_quiz_general",
    badge: "QuizKen AI Studio",
    headline: "Biến Mọi Chủ Đề Thành Đề Trắc Nghiệm Trong 3 Giây",
    description:
      "Chỉ cần gõ chủ đề hoặc dán tài liệu — AI tự động tạo câu hỏi, đáp án chuẩn, lời giải chi tiết và xuất file miễn phí.",
    ctaLabel: "Tạo Quiz AI Miễn Phí",
    targetPath: "/quiz/create",
    bullets: [
      "Hỗ trợ 100+ môn học & kỳ thi tại Việt Nam",
      "Tự động chấm điểm & giải thích chi tiết bằng AI",
      "Miễn phí bắt đầu ngay, không cần cài đặt",
    ],
    samplePrompts: [
      "Tóm tắt & tạo 15 câu trắc nghiệm Sinh học 12",
      "Kiến thức chung Tin học GDPT 2018 Python",
      "Ôn tập Địa lý 12 Vùng kinh tế trọng điểm",
    ],
  },
};

const MATCH_RULES: Array<{
  key: keyof typeof CREATIVES;
  keywords: string[];
}> = [
  {
    key: "teacher",
    keywords: [
      "giao-vien",
      "7991",
      "tron-de",
      "word",
      "docx",
      "pdf",
      "pptx",
      "slide",
      "qr",
      "lop-hoc",
      "day-them",
      "nha-giao",
      "azota",
      "eduquiz",
    ],
  },
  {
    key: "exam_2027",
    keywords: [
      "thpt",
      "2027",
      "2026",
      "dgnl",
      "hsa",
      "v-act",
      "tsa",
      "vao-10",
      "lop-10",
      "lop-11",
      "lop-12",
      "de-thi",
      "tot-nghiep",
      "hoc-ba",
      "thong-tu-22",
    ],
  },
  {
    key: "language",
    keywords: [
      "tieng-anh",
      "ielts",
      "toeic",
      "vstep",
      "hsk",
      "jlpt",
      "tu-vung",
      "flashcard",
      "anki",
      "quizlet",
      "ipa",
    ],
  },
  {
    key: "uni_student",
    keywords: [
      "dai-hoc",
      "triet-hoc",
      "kinh-te",
      "phap-luat",
      "tin-chi",
      "gpa",
      "hoc-bong",
      "apa",
      "ma-tran",
      "cuoi-ky",
    ],
  },
];

const SHORT_BOUNDARY_KEYWORDS = new Set([
  "qr",
  "pdf",
  "hsa",
  "tsa",
  "hsk",
  "ipa",
  "gpa",
  "apa",
]);

function normalizeContextText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function matchesKeyword(normalizedHaystack: string, keyword: string): boolean {
  if (!normalizedHaystack) return false;
  if (SHORT_BOUNDARY_KEYWORDS.has(keyword)) {
    return new RegExp(`(?:^|-)${keyword}(?:-|$)`).test(normalizedHaystack);
  }
  return normalizedHaystack.includes(keyword);
}

/**
 * Select a tailored Vietnamese ad creative based on page category, tags, and pathname.
 */
export function getContextualAd(ctx?: {
  category?: string;
  tags?: string[];
  pathname?: string;
}): ContextualAdCreative {
  const rawParts = [
    ctx?.category ?? "",
    ...(ctx?.tags ?? []),
    ctx?.pathname ?? "",
  ].filter(Boolean);

  if (rawParts.length === 0) {
    return CREATIVES.general;
  }

  const normalizedHaystack = normalizeContextText(rawParts.join(" "));

  for (const rule of MATCH_RULES) {
    if (rule.keywords.some((kw) => matchesKeyword(normalizedHaystack, kw))) {
      return CREATIVES[rule.key];
    }
  }

  return CREATIVES.general;
}

/**
 * Build an app conversion URL with UTM attribution and optional pre-filled AI prompt.
 */
export function buildConversionUrl(opts: {
  path?: string;
  placement: ConversionPlacement;
  campaign?: string;
  prompt?: string;
}): string {
  const rawPath = opts.path?.trim() || "/quiz/create";
  const cleanPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  const url = new URL(cleanPath, SITE.appUrl);

  url.searchParams.set("utm_source", "quizken_landing");
  url.searchParams.set("utm_medium", opts.placement);
  url.searchParams.set("utm_campaign", opts.campaign || "general");

  if (opts.prompt && opts.prompt.trim()) {
    url.searchParams.set("prompt", opts.prompt.trim());
  }

  return url.toString();
}

/**
 * Safely fire a GA4 conversion_cta_click event if window.gtag is available.
 */
export function trackConversionClick(opts: {
  placement: ConversionPlacement;
  campaign: string;
  targetUrl: string;
  label?: string;
}): void {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", "conversion_cta_click", {
      placement: opts.placement,
      campaign: opts.campaign,
      target_url: opts.targetUrl,
      ...(opts.label ? { label: opts.label } : {}),
    });
  } catch {
    // Ignore analytics errors
  }
}

// ---------------------------------------------------------------------------
// React 19 useSyncExternalStore frequency-cap stores (SSR-safe, 0 hydration drift)
// ---------------------------------------------------------------------------

const PROMO_DISMISS_KEY = "qk_promo_dismissed_until";
const PROMO_DISMISS_TTL_MS = 24 * 60 * 60 * 1000;
const MOBILE_BAR_DISMISS_KEY = "qk_mobile_bar_dismissed";

const promoListeners = new Set<() => void>();
const mobileBarListeners = new Set<() => void>();

let memoryPromoDismissedUntil = 0;
let memoryMobileBarDismissed = false;

function notifyPromoListeners() {
  for (const listener of promoListeners) {
    listener();
  }
}

function notifyMobileBarListeners() {
  for (const listener of mobileBarListeners) {
    listener();
  }
}

function subscribePromo(callback: () => void): () => void {
  promoListeners.add(callback);
  const onStorage = (event: StorageEvent) => {
    if (event.key === PROMO_DISMISS_KEY || event.key === null) {
      callback();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    promoListeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function getPromoDismissedSnapshot(): boolean {
  if (typeof window === "undefined") return true;
  if (memoryPromoDismissedUntil > Date.now()) return true;
  try {
    const raw = window.localStorage.getItem(PROMO_DISMISS_KEY);
    if (!raw) return false;
    const until = Number(raw);
    return Number.isFinite(until) && until > Date.now();
  } catch {
    return false;
  }
}

function getServerDismissedSnapshot(): boolean {
  return true;
}

/**
 * Returns true on the server (so SSR never renders popups) and reflects
 * the 24-hour localStorage dismissal state on the client.
 */
export function useIsPromoPopupDismissed(): boolean {
  return React.useSyncExternalStore(
    subscribePromo,
    getPromoDismissedSnapshot,
    getServerDismissedSnapshot,
  );
}

/**
 * Persist a 24-hour dismissal for the global conversion popup and notify subscribers.
 */
export function dismissPromoPopupFor24h(): void {
  const until = Date.now() + PROMO_DISMISS_TTL_MS;
  memoryPromoDismissedUntil = until;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(PROMO_DISMISS_KEY, String(until));
    } catch {
      // Fall back to in-memory dismissal when storage is unavailable
    }
  }
  notifyPromoListeners();
}

function subscribeMobileBar(callback: () => void): () => void {
  mobileBarListeners.add(callback);
  return () => {
    mobileBarListeners.delete(callback);
  };
}

function getMobileBarDismissedSnapshot(): boolean {
  if (typeof window === "undefined") return true;
  if (memoryMobileBarDismissed) return true;
  try {
    return window.sessionStorage.getItem(MOBILE_BAR_DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Returns true on the server and reflects the current sessionStorage dismissal
 * state for the mobile floating bar on the client.
 */
export function useIsMobileBarDismissed(): boolean {
  return React.useSyncExternalStore(
    subscribeMobileBar,
    getMobileBarDismissedSnapshot,
    getServerDismissedSnapshot,
  );
}

/**
 * Dismiss the mobile floating CTA bar for the current browser session.
 */
export function dismissMobileBarForSession(): void {
  memoryMobileBarDismissed = true;
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(MOBILE_BAR_DISMISS_KEY, "1");
    } catch {
      // Fall back to in-memory dismissal when storage is unavailable
    }
  }
  notifyMobileBarListeners();
}
