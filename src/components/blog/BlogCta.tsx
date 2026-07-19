import Link from "next/link";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { SITE } from "@/lib/site";

export function BlogCta() {
  return (
    <aside className="my-12 overflow-hidden rounded-3xl border-4 border-emerald-300 dark:border-emerald-800 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white p-8 sm:p-10 shadow-2xl relative">
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-yellow-300/20 blur-2xl" />

      <div className="relative z-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-yellow-300 border border-white/30 shadow-lg animate-bounce-slow">
          <Sparkles className="h-8 w-8 fill-yellow-300" />
        </div>

        <div className="flex-1 space-y-1">
          <h3 className="font-heading text-2xl font-bold tracking-tight text-white">
            Tạo Bài Kiểm Tra AI Miễn Phí Ngay
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-emerald-100 font-medium">
            Dùng QuizKen để tạo đề thi trắc nghiệm chuẩn giáo dục chỉ trong 3 giây. Miễn phí 100%, không cần cài đặt.
          </p>
        </div>

        <Link
          href={`${SITE.appUrl}`}
          className="inline-flex shrink-0 items-center gap-2 rounded-[2rem] bg-yellow-400 text-slate-900 px-7 py-3.5 text-base font-heading font-extrabold shadow-xl hover:bg-yellow-300 border-4 border-white/30 transition-all hover:scale-105"
        >
          <span>Tạo Quiz Ngay</span>
          <Zap className="h-4.5 w-4.5 fill-current" />
        </Link>
      </div>
    </aside>
  );
}
