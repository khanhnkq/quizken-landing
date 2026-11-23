import { User } from "lucide-react";

type AuthorCardProps = {
  name: string;
  bio?: string;
};

const AUTHORS: Record<string, { bio: string }> = {
  "QuizKen Team": {
    bio: "Đội ngũ phát triển QuizKen — nền tảng tạo bài kiểm tra AI miễn phí hàng đầu Việt Nam. Chúng tôi tin rằng AI sẽ cách mạng hóa giáo dục.",
  },
};

export function AuthorCard({ name, bio }: AuthorCardProps) {
  const authorData = AUTHORS[name];
  const displayBio = bio || authorData?.bio || "";

  return (
    <div className="flex items-start gap-4 rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none p-5 sm:p-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-0 shadow-none bg-foreground/[0.06] text-foreground">
        <User className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Tác giả
        </p>
        <p className="mt-0.5 font-heading text-base font-bold text-foreground">{name}</p>
        {displayBio && (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {displayBio}
          </p>
        )}
      </div>
    </div>
  );
}
