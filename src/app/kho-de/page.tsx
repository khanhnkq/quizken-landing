import Link from "next/link";
import { Sparkles, ArrowRight, ChevronRight, Database, Users, FileCheck2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import {
  buildMetadata,
  breadcrumbSchema,
  collectionPageSchema,
} from "@/lib/seo";
import { appLink } from "@/lib/site";
import { fetchPublicQuizzes } from "@/lib/publicQuizzes";
import { KhoDeExplorer } from "@/components/kho-de/KhoDeExplorer";

export const revalidate = 3600;

const PAGE_TITLE = "Kho Đề Thi Trắc Nghiệm Cộng Đồng Có Đáp Án Miễn Phí";
const PAGE_DESCRIPTION =
  "Khám phá kho đề thi trắc nghiệm cộng đồng từ giáo viên và học sinh trên QuizKen: tìm kiếm đề theo môn học, làm thử trực tiếp, chấm điểm tức thì và luyện phòng thi đếm ngược miễn phí.";

export const metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: "/kho-de",
  keywords: [
    "kho đề thi trắc nghiệm",
    "đề thi cộng đồng quizken",
    "làm bài trắc nghiệm online miễn phí",
    "ngân hàng đề thi trắc nghiệm có đáp án",
    "tạo đề trắc nghiệm bằng ai",
  ],
});

export default async function KhoDePage() {
  const quizzes = await fetchPublicQuizzes(60);

  const jsonLdData = [
    breadcrumbSchema([
      { name: "Trang chủ", path: "/" },
      { name: "Kho đề cộng đồng", path: "/kho-de" },
    ]),
    collectionPageSchema({
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      path: "/kho-de",
    }),
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />

      <section className="bg-background pt-10 pb-16 sm:pt-16 sm:pb-24">
        <Container className="space-y-10">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-primary">
              Trang chủ
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="font-medium text-foreground">
              Kho đề cộng đồng
            </span>
          </nav>

          {/* Hero */}
          <header className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>
                    <Database className="h-3.5 w-3.5 text-primary" />
                    Kho Đề Cộng Đồng QuizKen
                  </Badge>
                  <Badge>Cập nhật liên tục</Badge>
                </div>

                <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  Kho Đề Thi Trắc Nghiệm{" "}
                  <span className="text-primary">Cộng Đồng Chia Sẻ</span>
                </h1>

                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Tuyển tập các bộ đề trắc nghiệm công khai do cộng đồng giáo
                  viên, sinh viên và học sinh biên soạn trên QuizKen. Xem trước
                  câu hỏi chuẩn hóa, làm thử miễn phí hoặc vào phòng thi đếm
                  ngược ngay lập tức.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-medium text-muted-foreground sm:text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <FileCheck2 className="h-4 w-4 text-primary" />
                    Tối thiểu 5+ câu chất lượng/đề
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" />
                    Chấm điểm tự động &amp; giải thích AI
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                <Button href={appLink("/")} size="lg" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Tạo đề AI chia sẻ ngay
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  href="/de-thi"
                  variant="secondary"
                  size="lg"
                  className="gap-2"
                >
                  Kho đề chuẩn theo kỳ thi
                </Button>
              </div>
            </div>
          </header>

          {/* Explorer */}
          <KhoDeExplorer quizzes={quizzes} />
        </Container>
      </section>
    </>
  );
}
