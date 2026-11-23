"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpDown,
  Atom,
  Award,
  Binary,
  BookOpenCheck,
  Calculator,
  Clock,
  Compass,
  Disc3,
  FileSpreadsheet,
  FileText,
  FlaskConical,
  GraduationCap,
  Headphones,
  Keyboard,
  Languages,
  Layers,
  LineChart,
  Percent,
  QrCode,
  Quote,
  School,
  Shuffle,
  Sigma,
  Sparkles,
  StickyNote,
  Timer,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import {
  TOOL_CATEGORIES,
  TOOLS_CATALOG,
  type ToolCategory,
} from "@/lib/toolsCatalog";
import { cn } from "@/lib/utils";

const TOOL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "tinh-diem-tot-nghiep-thpt-2027": GraduationCap,
  "tinh-diem-gpa-dai-hoc": Calculator,
  "quy-doi-diem-ielts-dgnl-2027": ArrowUpDown,
  "dem-nguoc-ngay-thi-2027": Clock,
  "tron-de-trac-nghiem-online": Shuffle,
  "tao-phieu-tra-loi-trac-nghiem-2027": FileSpreadsheet,
  "tinh-diem-trung-binh-mon-thong-tu-22": Percent,
  "tinh-diem-thi-vao-lop-10": School,
  "tinh-diem-xet-hoc-ba-thpt-2027": Layers,
  "tinh-diem-cong-uu-tien-dai-hoc-2027": Award,
  "tinh-diem-thi-vstep-b1-b2-c1": Award,
  "can-bang-phuong-trinh-hoa-hoc": FlaskConical,
  "bang-tuan-hoan-hoa-hoc-tuong-tac": Atom,
  "dong-ho-pomodoro-hoc-tap": Timer,
  "dem-tu-bai-luan-ielts-ngu-van": FileText,
  "giai-phuong-trinh-he-phuong-trinh-ma-tran": Sigma,
  // Wave 3 + Wave 5
  "vong-quay-goi-ten-hoc-sinh": Disc3,
  "chia-nhom-ngau-nhien-lop-hoc": Users,
  "dong-ho-bam-gio-thi-thu-may-chieu": Timer,
  "in-flashcard-2-mat-a4": StickyNote,
  "chuyen-doi-chu-hoa-thuong-soat-loi-van-ban": Sparkles,
  "tao-ma-qr-lop-hoc-mien-phi": QrCode,
  "tao-trich-dan-tai-lieu-apa-ieee": Quote,
  "soan-cong-thuc-toan-latex-online": Sigma,
  "tinh-diem-ren-luyen-hoc-bong-dai-hoc": GraduationCap,
  "ve-do-thi-ham-so-online": LineChart,
  "chuyen-doi-he-co-so-nhi-phan-thap-luc-phan": Binary,
  "tinh-diem-hoc-phan-tin-chi-can-dat": BookOpenCheck,
  "tinh-diem-toeic-listening-reading": Headphones,
  "kiem-tra-toc-do-go-phim-tieng-viet": Keyboard,
  "tra-cuu-to-hop-mon-ma-nganh-2027": Compass,
  "tra-cuu-dong-tu-bat-quy-tac-phat-am-ipa": Languages,
  "tinh-diem-thi-hsk-jlpt-quy-doi-cefr": Languages,
  "tao-ma-tran-de-thi-cong-van-7991": FileSpreadsheet,
  "chuyen-de-word-docx-sang-trac-nghiem": Shuffle,
};

export function ToolsHubClient() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | ToolCategory>("all");

  const filteredTools =
    selectedCategory === "all"
      ? TOOLS_CATALOG
      : TOOLS_CATALOG.filter((tool) => tool.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/85 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          {TOOL_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            const count =
              cat.id === "all"
                ? TOOLS_CATALOG.length
                : TOOLS_CATALOG.filter((t) => t.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-xl px-4 font-heading text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/[0.04] text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground dark:bg-foreground/[0.06]",
                )}
              >
                <span>{cat.label}</span>
                <span
                  className={cn(
                    "inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[11px] font-bold",
                    active
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-foreground/[0.08] text-foreground",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-xs font-medium text-muted-foreground sm:text-sm">
          100% Miễn phí • Chạy trực tiếp trên trình duyệt • Không cần đăng nhập
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => {
          const Icon = TOOL_ICONS[tool.slug] ?? Calculator;
          return (
            <Link
              key={tool.slug}
              href={`/cong-cu/${tool.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card/85 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge className="bg-primary/15 text-primary">
                    {tool.badge}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground">
                    {tool.categoryLabel}
                  </div>
                  <h2 className="font-heading text-xl font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                    {tool.shortTitle}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="text-xs font-semibold text-muted-foreground">
                  Dùng ngay miễn phí
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  <span>Mở công cụ</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
