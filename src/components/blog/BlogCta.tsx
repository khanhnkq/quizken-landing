import { Sparkles, Zap } from "lucide-react";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/Button";

export function BlogCta() {
  return (
    <aside className="my-12 rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none p-6 sm:p-8">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-0 shadow-none bg-foreground/[0.06] text-primary">
          <Sparkles className="h-6 w-6" />
        </div>

        <div className="flex-1 space-y-1">
          <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Tạo Bài Kiểm Tra AI Miễn Phí Ngay
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            Dùng QuizKen để tạo đề thi trắc nghiệm chuẩn giáo dục chỉ trong 3 giây. Miễn phí 100%, không cần cài đặt.
          </p>
        </div>

        <Button href={SITE.appUrl} size="md" className="shrink-0">
          <span>Tạo Quiz Ngay</span>
          <Zap className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
