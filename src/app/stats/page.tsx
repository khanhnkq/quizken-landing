import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { webPageSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { CATEGORIES } from "@/lib/categories";
import {
  BookOpen,
  Users,
  Sparkles,
  Clock,
  Globe,
  FileText,
  TrendingUp,
  Award,
  Zap,
  GraduationCap,
} from "lucide-react";

export const metadata = buildMetadata({
  title: "QuizKen trong con số",
  description:
    "Khám phá những con số ấn tượng của QuizKen: quiz đã tạo, chủ đề hỗ trợ, thời gian tiết kiệm cho giáo viên và nhiều hơn nữa.",
  path: "/stats",
});

/** Live counts derived from the blog at build time. */
function getBlogStats() {
  const posts = getAllPosts();
  const tags = new Set<string>();
  posts.forEach((p) => p.frontmatter.tags.forEach((t) => tags.add(t)));
  return {
    totalPosts: posts.length,
    totalCategories: CATEGORIES.length,
    totalTags: tags.size,
  };
}

const heroStats = [
  { value: "10.000+", label: "Quiz đã được tạo", icon: BookOpen },
  { value: "5.000+", label: "Người dùng", icon: Users },
  { value: "100+", label: "Chủ đề đa dạng", icon: Globe },
  { value: "30 giây", label: "Tạo 1 đề kiểm tra", icon: Clock },
];

const impactStats = [
  {
    value: "90%",
    label: "Tiết kiệm thời gian soạn đề",
    description: "Giáo viên giảm từ 2-3 giờ xuống còn 30 giây mỗi đề",
    icon: Clock,
  },
  {
    value: "100+",
    label: "Giờ tiết kiệm mỗi năm / GV",
    description: "Thời gian dành cho giảng dạy thay vì soạn đề",
    icon: TrendingUp,
  },
  {
    value: "4.8/5",
    label: "Đánh giá trung bình",
    description: "Từ giáo viên và học sinh trên cả nước",
    icon: Award,
  },
  {
    value: "< 1 phút",
    label: "Thời gian tạo quiz AI",
    description: "Nhập chủ đề → nhận đề hoàn chỉnh ngay lập tức",
    icon: Zap,
  },
];

const features = [
  { label: "AI Quiz Generator", detail: "Gemini AI" },
  { label: "English Hub", detail: "Flashcard + Learning Map" },
  { label: "Multiplayer Quiz", detail: "Đấu trường thời gian thực" },
  { label: "Export PDF", detail: "Unicode tiếng Việt hoàn hảo" },
  { label: "Knowledge Base", detail: "Upload tài liệu + AI chat" },
  { label: "Gamification", detail: "XP, Streak, Leaderboard" },
];

export default function StatsPage() {
  const blog = getBlogStats();

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(
            "QuizKen trong con số",
            "Những con số ấn tượng của nền tảng ôn luyện thông minh QuizKen.",
            "/stats",
          ),
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-40" />
        <Container className="relative text-center">
          <span className="eyebrow">
            <Sparkles className="h-3.5 w-3.5" />
            Minh bạch & Tin cậy
          </span>
          <h1 className="mx-auto mt-5 max-w-2xl font-heading text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            QuizKen trong{" "}
            <span className="text-gradient">con số</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Từ một ý tưởng nhỏ, QuizKen đã giúp hàng nghìn giáo viên và học
            sinh tiết kiệm thời gian, học tập hiệu quả hơn mỗi ngày.
          </p>
        </Container>
      </section>

      {/* Main stats grid */}
      <section className="border-y border-border/60 bg-secondary/40">
        <Container>
          <div className="grid grid-cols-2 divide-border/60 py-12 sm:grid-cols-4 sm:divide-x">
            {heroStats.map((s) => (
              <div key={s.label} className="px-2 py-4 text-center sm:px-6">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <p className="font-heading text-3xl font-600 tracking-tight sm:text-4xl">
                  <span className="text-gradient">{s.value}</span>
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Impact */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="text-center">
            <span className="eyebrow">
              <TrendingUp className="h-3.5 w-3.5" />
              Tác động
            </span>
            <h2 className="mt-4 font-heading text-3xl tracking-tight sm:text-4xl">
              Tác động thực tế
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Những con số cho thấy QuizKen đang thay đổi cách giáo viên và học
              sinh tiếp cận kiểm tra, ôn tập.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {impactStats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="font-heading text-2xl font-600 tracking-tight text-gradient">
                  {s.value}
                </p>
                <p className="mt-1 text-sm font-600">{s.label}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Blog & Content stats */}
      <section className="border-t border-border/60 bg-secondary/30 py-16 sm:py-20">
        <Container>
          <div className="text-center">
            <span className="eyebrow">
              <FileText className="h-3.5 w-3.5" />
              Nội dung
            </span>
            <h2 className="mt-4 font-heading text-3xl tracking-tight sm:text-4xl">
              Blog & Tài nguyên
            </h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/50 bg-card p-6 text-center">
              <p className="font-heading text-4xl font-600 text-gradient">
                {blog.totalPosts}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Bài viết hướng dẫn
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card p-6 text-center">
              <p className="font-heading text-4xl font-600 text-gradient">
                {blog.totalCategories}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Danh mục chủ đề
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card p-6 text-center">
              <p className="font-heading text-4xl font-600 text-gradient">
                {blog.totalTags}+
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tags kiến thức
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Features list */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="text-center">
            <span className="eyebrow">
              <GraduationCap className="h-3.5 w-3.5" />
              Tính năng
            </span>
            <h2 className="mt-4 font-heading text-3xl tracking-tight sm:text-4xl">
              Nền tảng toàn diện
            </h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg">
                  ✅
                </span>
                <div>
                  <p className="text-sm font-600">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 bg-gradient-to-br from-primary/5 via-primary/8 to-transparent py-16 sm:py-20">
        <Container className="text-center">
          <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
            Sẵn sàng thử QuizKen?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Tạo bài kiểm tra AI đầu tiên của bạn hoàn toàn miễn phí. Không cần
            thẻ tín dụng, không cần cài đặt.
          </p>
          <Button href={appLink("/")} size="lg" className="mt-6">
            <Sparkles className="mr-2 h-4 w-4" />
            Bắt đầu miễn phí
          </Button>
        </Container>
      </section>
    </>
  );
}
