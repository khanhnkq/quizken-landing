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
    <div className="flex items-start gap-4 rounded-xl border border-border/50 bg-card p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <User className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Tác giả
        </p>
        <p className="mt-0.5 font-heading text-base font-600">{name}</p>
        {displayBio && (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {displayBio}
          </p>
        )}
      </div>
    </div>
  );
}
