"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Sparkles,
  ArrowRight,
  Users,
  FileCheck2,
  Layers,
  GraduationCap,
  Award,
  Compass,
} from "lucide-react";
import type { PublicQuizSummary } from "@/lib/publicQuizzes";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { appLink } from "@/lib/site";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  all: "Tất cả",
  general: "Tổng hợp",
  education: "Giáo dục",
  science: "Khoa học",
  research: "Nghiên cứu",
  math: "Toán học",
  language: "Ngoại ngữ",
  history: "Lịch sử",
  geography: "Địa lý",
  literature: "Ngữ văn",
  technology: "Công nghệ & IT",
  business: "Kinh tế & Quản trị",
  health: "Y tế & Sức khỏe",
  arts: "Nghệ thuật",
  trivia: "Kiến thức chung",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Cơ bản",
  medium: "Trung bình",
  hard: "Nâng cao",
};

function getCategoryLabel(cat: string): string {
  const key = cat.toLowerCase();
  return CATEGORY_LABELS[key] || cat.charAt(0).toUpperCase() + cat.slice(1);
}

function getDifficultyLabel(diff: string): string {
  const key = diff.toLowerCase();
  return DIFFICULTY_LABELS[key] || diff;
}

const CURATED_EXAM_HUBS = [
  {
    title: "Đề thi THPT Quốc Gia (9 Môn)",
    description:
      "Hệ thống đề thi thử THPT chuẩn format GDPT 2018 với 3 phần: Trắc nghiệm, Đúng/Sai lũy tiến, Trả lời ngắn.",
    href: "/de-thi",
    badge: "THPT 2026–2027",
  },
  {
    title: "Đánh Giá Năng Lực (HSA, V-ACT, TSA)",
    description:
      "Luyện đề ĐGNL ĐHQG Hà Nội, ĐHQG TP.HCM, Tư duy Bách Khoa, Sư phạm & V-SAT sát ma trận thực tế.",
    href: "/de-thi/dgnl",
    badge: "ĐGNL 2027",
  },
  {
    title: "Môn Đại Cương Đại Học",
    description:
      "Ôn thi Triết học Mác-Lênin, Kinh tế chính trị, Pháp luật đại cương, Tư tưởng HCM, Xác suất thống kê.",
    href: "/de-thi/dai-hoc",
    badge: "NEU • VNU • UEH • HUST",
  },
  {
    title: "Tuyển Sinh Vào Lớp 10",
    description:
      "Đề thi thử Toán, Tiếng Anh, Ngữ văn vào lớp 10 tại Hà Nội, TP.HCM và các trường chuyên trên toàn quốc.",
    href: "/de-thi/vao-10",
    badge: "Lớp 9 → 10",
  },
  {
    title: "Chứng Chỉ Ngoại Ngữ & Nghề Nghiệp",
    description:
      "Luyện thi TOEIC, VSTEP B1-B2, HSK, JLPT, Digital SAT, 600 câu GPLX, MOS & Thi công chức.",
    href: "/de-thi/chung-chi",
    badge: "8 Chứng chỉ Hot",
  },
];

export function KhoDeExplorer({ quizzes }: { quizzes: PublicQuizSummary[] }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const q of quizzes) {
      const cat = (q.category || "general").toLowerCase();
      counts.set(cat, (counts.get(cat) || 0) + 1);
    }
    const sorted = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => ({ key: cat, label: getCategoryLabel(cat), count }));
    return [{ key: "all", label: "Tất cả", count: quizzes.length }, ...sorted];
  }, [quizzes]);

  const filteredQuizzes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return quizzes.filter((item) => {
      const catMatch =
        selectedCategory === "all" ||
        item.category.toLowerCase() === selectedCategory;
      if (!catMatch) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [quizzes, query, selectedCategory]);

  if (quizzes.length === 0) {
    return (
      <div className="space-y-8">
        <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Badge>
                <Compass className="h-3.5 w-3.5 text-primary" />
                Bộ Đề Tuyển Chọn Từ QuizKen
              </Badge>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Khám Phá Hệ Thống Đề Thi Chuẩn Hóa
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Kho đề cộng đồng đang được đồng bộ thêm đề mới. Trong lúc đó, bạn
                có thể luyện ngay các bộ đề mẫu chuẩn cấu trúc 2026–2027 dưới đây
                hoặc tự tạo đề bằng AI trong 30 giây.
              </p>
            </div>
            <Button href={appLink("/")} size="md" className="shrink-0 gap-2">
              <Sparkles className="h-4 w-4" />
              Tạo đề AI miễn phí
            </Button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CURATED_EXAM_HUBS.map((hub) => (
            <Link
              key={hub.href}
              href={hub.href}
              className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none transition-colors hover:border-primary/50"
            >
              <div>
                <Badge className="text-[11px]">{hub.badge}</Badge>
                <h3 className="mt-3 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                  {hub.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {hub.description}
                </p>
              </div>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Khám phá ngay
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Bar */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-none sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm đề thi theo tên môn, chủ đề, từ khóa (VD: Triết học, TOEIC, Toán 12...)"
              aria-label="Tìm kiếm đề thi trong kho đề"
              className="h-11 w-full rounded-xl border border-border/70 bg-background/80 pr-4 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Layers className="h-4 w-4 text-primary" />
            <span>
              Hiển thị{" "}
              <strong className="text-foreground">{filteredQuizzes.length}</strong>{" "}
              / {quizzes.length} đề thi công khai
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/[0.05] text-muted-foreground hover:bg-foreground/[0.09] hover:text-foreground"
                )}
              >
                <span>{cat.label}</span>
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[10px]",
                    active
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-foreground/[0.06] text-muted-foreground"
                  )}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Grid */}
      {filteredQuizzes.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card/85 p-8 text-center shadow-none">
          <p className="font-heading text-lg font-bold text-foreground">
            Không tìm thấy đề thi phù hợp với &ldquo;{query}&rdquo;
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Thử từ khóa khác hoặc tạo ngay đề thi đúng chủ đề bạn cần bằng AI
            chỉ trong 30 giây.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setQuery("");
                setSelectedCategory("all");
              }}
            >
              Xóa bộ lọc
            </Button>
            <Button
              href={appLink(
                query.trim()
                  ? `/?prompt=${encodeURIComponent(query.trim())}`
                  : "/"
              )}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Tạo đề &ldquo;{query.trim() || "theo chủ đề"}&rdquo; bằng AI
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quiz) => (
            <article
              key={quiz.id}
              className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none transition-colors hover:border-primary/40"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge className="text-[11px]">
                    <BookOpen className="h-3 w-3 text-primary" />
                    {getCategoryLabel(quiz.category)}
                  </Badge>
                  <span className="rounded-lg bg-foreground/[0.05] px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    {getDifficultyLabel(quiz.difficulty)}
                  </span>
                </div>

                <h3 className="mt-3 line-clamp-2 font-heading text-lg font-bold leading-snug text-foreground">
                  <Link
                    href={`/kho-de/${quiz.slug}`}
                    className="transition-colors hover:text-primary"
                  >
                    {quiz.title}
                  </Link>
                </h3>

                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {quiz.description}
                </p>

                {quiz.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {quiz.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-foreground/[0.04] px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-4 pt-3">
                <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                    <FileCheck2 className="h-3.5 w-3.5 text-primary" />
                    {quiz.questionCount} câu hỏi
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    {Math.max(quiz.attempts, quiz.usageCount, 1)} lượt làm
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <Button
                    href={`/kho-de/${quiz.slug}`}
                    variant="secondary"
                    size="sm"
                    className="w-full justify-center"
                  >
                    Xem &amp; làm thử
                  </Button>
                  <Button
                    href={appLink(`/quiz/play/${quiz.id}`)}
                    variant="primary"
                    size="sm"
                    className="w-full justify-center gap-1"
                  >
                    Làm full đề
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Cross-links to Structured Exam Hubs */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/[0.06] text-primary">
              <GraduationCap className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground">
                Bộ Đề Chuẩn Ma Trận Theo Kỳ Thi Quốc Gia
              </h2>
              <p className="text-xs text-muted-foreground">
                Khám phá thêm lộ trình đề thi chuyên sâu có chấm điểm lũy tiến
              </p>
            </div>
          </div>
          <Button href="/de-thi" variant="ghost" size="sm" className="gap-1">
            Xem tất cả 9 môn THPT
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CURATED_EXAM_HUBS.slice(1).map((hub) => (
            <Link
              key={hub.href}
              href={hub.href}
              className="group flex items-center justify-between gap-2 rounded-xl bg-foreground/[0.04] p-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/[0.08] dark:bg-foreground/[0.06]"
            >
              <span className="flex min-w-0 items-center gap-2">
                <Award className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate group-hover:text-primary">
                  {hub.title}
                </span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
