/**
 * Site-wide configuration for QuizKen landing.
 * NEXT_PUBLIC_SITE_URL is the canonical domain for this landing (env-overridable).
 * APP_URL is the main QuizKen web app that CTAs link to.
 */

export const SITE = {
  name: "QuizKen",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.quizken.com",
  appUrl:
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://app.quizken.com",
  locale: "vi_VN",
  language: "vi",
  defaultDescription:
    "QuizKen giúp giáo viên và học sinh tạo bài kiểm tra trắc nghiệm với AI trong vài giây. Hỗ trợ 100+ chủ đề, tự động chấm điểm, xuất PDF miễn phí.",
  defaultOgImage: "/images/og-default.jpg",
  twitter: "@quizken",
  foundingDate: "2024",
  email: "khanhnguyenkim30825@gmail.com",
  social: {
    facebook: "https://facebook.com/quizken",
    youtube: "https://youtube.com/quizken",
    github: "https://github.com/khanhnkq/quizken",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export const NAV_LINKS: NavItem[] = [
  { label: "Tính năng", href: "/#features" },
  { label: "Cách hoạt động", href: "/#how-it-works" },
  { label: "Học tiếng Anh", href: "/#english-hub" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
];

/** Build an absolute URL from a path relative to SITE.url. */
export function buildAbsoluteUrl(path: string = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${clean}`;
}

/** QuizKen CTA target (links into the main app). */
export function appLink(path: string = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.appUrl}${clean}`;
}
