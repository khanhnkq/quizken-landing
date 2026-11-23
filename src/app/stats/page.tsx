import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/JsonLd";
import { webPageSchema, buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { CATEGORIES } from "@/lib/categories";
import { StatsCharts } from "@/components/stats/StatsCharts";
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
  CheckCircle2,
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

      <div className="bg-background">
        {/* Hero */}
        <section className="py-14 sm:py-20">
          <Container className="text-center">
            <div className="mx-auto max-w-2xl space-y-5">
              <Badge>
                <Sparkles className="h-3.5 w-3.5" />
                Minh bạch & Tin cậy
              </Badge>
              <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                QuizKen trong con số
              </h1>
              <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Từ một ý tưởng nhỏ, QuizKen đã giúp hàng nghìn giáo viên và học
                sinh tiết kiệm thời gian, học tập hiệu quả hơn mỗi ngày.
              </p>
            </div>
          </Container>
        </section>

        {/* Main stats grid */}
        <section className="py-4">
          <Container>
            <div className="rounded-2xl border border-border/70 bg-card/85 p-4 shadow-none backdrop-blur-none sm:p-5">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {heroStats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border-0 bg-foreground/[0.04] p-5 text-center shadow-none dark:bg-foreground/[0.06]"
                  >
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border-0 bg-foreground/[0.06] text-foreground shadow-none">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <p className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {s.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Impact */}
        <section className="py-14 sm:py-20">
          <Container>
            <div className="space-y-3 text-center">
              <Badge>
                <TrendingUp className="h-3.5 w-3.5" />
                Tác động
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Tác động thực tế
              </h2>
              <p className="mx-auto max-w-lg text-sm text-muted-foreground sm:text-base">
                Những con số cho thấy QuizKen đang thay đổi cách giáo viên và
                học sinh tiếp cận kiểm tra, ôn tập.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {impactStats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-border/70 bg-card/85 p-5 shadow-none backdrop-blur-none"
                >
                  <div>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border-0 bg-foreground/[0.06] text-foreground shadow-none">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <p className="font-heading text-2xl font-bold tracking-tight text-foreground">
                      {s.value}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {s.label}
                    </p>
                  </div>
                  <p className="rounded-xl border-0 bg-foreground/[0.04] p-3 text-xs leading-relaxed text-muted-foreground shadow-none dark:bg-foreground/[0.06]">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Interactive Comparison Charts for SEO/GEO */}
            <StatsCharts />
          </Container>
        </section>

        {/* Blog & Content stats */}
        <section className="py-12 sm:py-16">
          <Container>
            <div className="space-y-3 text-center">
              <Badge>
                <FileText className="h-3.5 w-3.5" />
                Nội dung
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Blog & Tài nguyên
              </h2>
            </div>
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-border/70 bg-card/85 p-4 shadow-none backdrop-blur-none sm:p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border-0 bg-foreground/[0.04] p-5 text-center shadow-none dark:bg-foreground/[0.06]">
                  <p className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                    {blog.totalPosts}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Bài viết hướng dẫn
                  </p>
                </div>
                <div className="rounded-xl border-0 bg-foreground/[0.04] p-5 text-center shadow-none dark:bg-foreground/[0.06]">
                  <p className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                    {blog.totalCategories}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Danh mục chủ đề
                  </p>
                </div>
                <div className="rounded-xl border-0 bg-foreground/[0.04] p-5 text-center shadow-none dark:bg-foreground/[0.06]">
                  <p className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                    {blog.totalTags}+
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tags kiến thức
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Features list */}
        <section className="py-12 sm:py-16">
          <Container>
            <div className="space-y-3 text-center">
              <Badge>
                <GraduationCap className="h-3.5 w-3.5" />
                Tính năng
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Nền tảng toàn diện
              </h2>
            </div>
            <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-border/70 bg-card/85 p-4 shadow-none backdrop-blur-none sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-3 rounded-xl border-0 bg-foreground/[0.04] p-4 shadow-none dark:bg-foreground/[0.06]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.06]">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {f.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {f.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-20">
          <Container>
            <div className="rounded-2xl border border-border/70 bg-card/85 p-8 text-center shadow-none backdrop-blur-none sm:p-12">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                Sẵn sàng thử QuizKen?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
                Tạo bài kiểm tra AI đầu tiên của bạn hoàn toàn miễn phí. Không
                cần thẻ tín dụng, không cần cài đặt.
              </p>
              <div className="mt-6">
                <Button
                  href={appLink("/")}
                  variant="primary"
                  size="md"
                  className="h-10 rounded-xl border-0 shadow-none"
                >
                  <Sparkles className="h-4 w-4" />
                  Bắt đầu miễn phí
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
