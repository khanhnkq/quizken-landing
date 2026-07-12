import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { SITE } from "@/lib/site";

export function BlogCta() {
  return (
    <aside className="my-12 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/8 to-primary/5 p-8 sm:p-10">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Sparkles className="h-7 w-7" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-xl font-600 tracking-tight">
            Tạo bài kiểm tra AI miễn phí
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Dùng QuizKen để tạo đề trắc nghiệm chất lượng cao trong 30 giây.
            Miễn phí, không cần đăng ký.
          </p>
        </div>
        <Link
          href={`${SITE.appUrl}`}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-600 text-primary-foreground transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-primary/20"
        >
          Bắt đầu ngay
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}
