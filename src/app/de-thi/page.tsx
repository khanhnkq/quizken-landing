import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  ChevronRight,
  Compass,
  FileCheck2,
  FolderKanban,
  GraduationCap,
  Layers,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { SUBJECTS, GRADES } from "@/lib/pSEO";
import { buildMetadata, breadcrumbSchema, collectionPageSchema } from "@/lib/seo";
import { appLink } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Kho Đề Thi Trắc Nghiệm 2026: THPT, ĐGNL, Đại Học, Vào 10 & Chứng Chỉ",
  description:
    "Tổng hợp kho đề thi trắc nghiệm online miễn phí chuẩn format 2026 của Bộ GD&ĐT: 9 môn THPT (lớp 10, 11, 12), Đánh giá năng lực (HSA, V-ACT, TSA), Đại cương Đại học, Tuyển sinh vào 10 và Chứng chỉ TOEIC, VSTEP, HSK, JLPT.",
  path: "/de-thi",
  keywords: [
    "đề thi trắc nghiệm 2026",
    "đề thi thử thpt quốc gia 2026",
    "đề thi đánh giá năng lực",
    "đề thi vào 10",
    "đề thi đại cương đại học",
    "luyện thi chứng chỉ online",
  ],
});

const SUBJECT_ICONS: Record<string, string> = {
  toan: "📐",
  "tieng-anh": "🌐",
  "vat-ly": "⚡",
  "hoa-hoc": "🧪",
  "sinh-hoc": "🧬",
  "lich-su": "🏛️",
  "dia-ly": "🌍",
  "gdkt-pl": "⚖️",
  "tin-hoc": "💻",
};

const EXTENDED_HUBS = [
  {
    href: "/de-thi/dgnl",
    badge: "Đánh giá năng lực 2027",
    title: "Đề Thi ĐGNL & Tư Duy (HSA, V-ACT, TSA)",
    description:
      "Luyện đề Đánh giá năng lực ĐHQG Hà Nội (HSA), ĐHQG TP.HCM (V-ACT), Tư duy Bách Khoa (TSA), SPT Sư Phạm và V-SAT có chấm điểm & giải thích chi tiết.",
    tags: ["HSA ĐHQGHN", "V-ACT ĐHQG-HCM", "TSA Bách Khoa", "SPT", "V-SAT"],
  },
  {
    href: "/de-thi/dai-hoc",
    badge: "Sinh viên Đại học",
    title: "Đề Thi Đại Cương & Chuyên Ngành Đại Học",
    description:
      "Ngân hàng trắc nghiệm Triết học Mác - Lênin, Kinh tế chính trị, Pháp luật đại cương, Tư tưởng HCM, Lịch sử Đảng, Xác suất thống kê, Kinh tế vi mô.",
    tags: ["Triết học Mác-Lênin", "Pháp luật đại cương", "Xác suất thống kê", "NEU / VNU / UEH"],
  },
  {
    href: "/de-thi/vao-10",
    badge: "Tuyển sinh lớp 10",
    title: "Đề Thi Tuyển Sinh Vào Lớp 10",
    description:
      "Tổng hợp đề ôn thi vào 10 môn Toán, Tiếng Anh, Ngữ văn cùng bộ đề thi thử Sở GD&ĐT Hà Nội, TP.HCM bám sát cấu trúc tuyển sinh mới nhất.",
    tags: ["Toán vào 10", "Tiếng Anh vào 10", "Đề Hà Nội", "Đề TP.HCM"],
  },
  {
    href: "/de-thi/chung-chi",
    badge: "Chứng chỉ & Sát hạch",
    title: "Luyện Thi Chứng Chỉ Quốc Tế & Sát Hạch",
    description:
      "Bộ đề thi thử TOEIC, VSTEP B1-B2, HSK, JLPT, Digital SAT, 600 câu lý thuyết GPLX, Tin học MOS/CNTT và Ôn thi Công chức.",
    tags: ["TOEIC", "VSTEP B1-B2", "HSK / JLPT", "600 câu GPLX"],
  },
];

export default function ExamHubPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Trang chủ", path: "/" },
            { name: "Đề thi", path: "/de-thi" },
          ]),
          collectionPageSchema({
            name: "Hệ Thống Đề Thi Trắc Nghiệm QuizKen 2026",
            description:
              "Trung tâm luyện thi trắc nghiệm online chuẩn GDPT 2018 cho 9 môn THPT, Đánh giá năng lực, Đại học, Vào 10 và Chứng chỉ.",
            path: "/de-thi",
          }),
        ]}
      />

      <section className="bg-background pt-10 pb-16 sm:pt-16 sm:pb-24">
        <Container className="space-y-12">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-primary">
              Trang chủ
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="font-medium text-foreground">Đề thi</span>
          </nav>

          {/* Hero */}
          <header className="max-w-3xl space-y-5">
            <Badge>
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Hệ thống luyện thi chuẩn 2026 • GDPT 2018
            </Badge>

            <h1 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Trung Tâm Đề Thi Trắc Nghiệm{" "}
              <span className="text-primary">THPT, ĐGNL, Đại Học &amp; Chứng Chỉ</span>
            </h1>

            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Luyện tập trực tiếp bộ câu hỏi mẫu chuẩn cấu trúc 3 phần (Nhiều lựa chọn,
              Đúng/Sai lũy tiến, Trả lời ngắn) cho 9 môn THPT cùng các kỳ thi Đánh giá năng lực,
              tuyển sinh vào 10, đại cương đại học và chứng chỉ nghề nghiệp.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button href={appLink("/")} size="lg" className="h-11 rounded-xl font-heading font-bold">
                <span>Tạo Đề Thi AI Mới</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                href="/kho-de"
                variant="secondary"
                size="lg"
                className="h-11 rounded-xl font-heading font-semibold"
              >
                <FolderKanban className="h-4 w-4" />
                <span>Khám phá Kho đề cộng đồng</span>
              </Button>
              <Button
                href="/cong-cu"
                variant="outline"
                size="lg"
                className="h-11 rounded-xl font-heading font-semibold"
              >
                <Wrench className="h-4 w-4" />
                <span>Bộ Công Cụ Học Tập</span>
              </Button>
            </div>
          </header>

          {/* 4 Extended pSEO 2.0 Hubs */}
          <section aria-labelledby="extended-hubs-heading" className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  id="extended-hubs-heading"
                  className="font-heading text-2xl font-bold text-foreground sm:text-3xl"
                >
                  Các Kỳ Thi Trọng Điểm &amp; Chuyên Sâu
                </h2>
                <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                  Chọn nhóm kỳ thi mục tiêu để luyện đề mẫu kèm đáp án chi tiết
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {EXTENDED_HUBS.map((hub) => (
                <Link
                  key={hub.href}
                  href={hub.href}
                  className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none backdrop-blur-none transition-colors hover:border-primary/50"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <Badge className="text-xs">
                        <Award className="h-3.5 w-3.5 text-primary" />
                        {hub.badge}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </div>

                    <h3 className="font-heading text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                      {hub.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {hub.description}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {hub.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-foreground/[0.04] dark:bg-foreground/[0.06] px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 9 THPT Subjects × 4 Grades Matrix */}
          <section aria-labelledby="thpt-matrix-heading" className="space-y-6">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/[0.06] text-primary">
                  <GraduationCap className="h-4 w-4" />
                </span>
                <div>
                  <h2
                    id="thpt-matrix-heading"
                    className="font-heading text-2xl font-bold text-foreground sm:text-3xl"
                  >
                    Đề Thi 9 Môn THPT Chuẩn GDPT 2018 (Lớp 10, 11, 12 &amp; THPT Quốc Gia)
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Mỗi khối lớp có bộ câu hỏi riêng biệt bám sát chương trình học và cấu trúc 3 phần mới
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {SUBJECTS.map((sub) => {
                const icon = SUBJECT_ICONS[sub.slug] || "📚";
                return (
                  <div
                    key={sub.slug}
                    className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none backdrop-blur-none"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          href={`/de-thi/${sub.slug}`}
                          className="group flex items-center gap-2.5"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.05] text-xl">
                            {icon}
                          </span>
                          <h3 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                            {sub.name}
                          </h3>
                        </Link>
                        <Link
                          href={`/de-thi/${sub.slug}`}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Xem môn →
                        </Link>
                      </div>

                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {sub.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {sub.topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic}
                            className="inline-flex items-center gap-1 rounded-lg bg-foreground/[0.04] dark:bg-foreground/[0.06] px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                          >
                            <BookOpen className="h-3 w-3 text-primary" />
                            <span className="truncate max-w-[200px]">{topic}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2 pt-3 border-t border-border/50">
                      {GRADES.map((gr) => (
                        <Link
                          key={gr.slug}
                          href={`/de-thi/${sub.slug}/${gr.slug}`}
                          className="group flex items-center justify-between rounded-xl bg-foreground/[0.04] dark:bg-foreground/[0.06] px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-foreground/[0.08]"
                        >
                          <span className="truncate group-hover:text-primary">
                            {gr.slug === "on-thi-thpt" ? "Ôn THPT" : gr.name}
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Bottom Cross-links to Kho De & Cong Cu */}
          <section className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none sm:p-7">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/[0.06] text-primary">
                  <Layers className="h-4 w-4" />
                </span>
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Kho Đề Thi Cộng Đồng QuizKen
                </h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Truy cập hàng trăm bộ đề thi công khai được giáo viên và học sinh chia sẻ trên hệ thống. Làm thử trực tiếp hoặc vào phòng thi đếm ngược thời gian thực.
              </p>
              <div className="mt-5">
                <Button href="/kho-de" variant="secondary" size="md" className="rounded-xl font-semibold">
                  <Compass className="h-4 w-4" />
                  <span>Mở Kho Đề Cộng Đồng</span>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none sm:p-7">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/[0.06] text-primary">
                  <FileCheck2 className="h-4 w-4" />
                </span>
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Bộ Công Cụ Hỗ Trợ Ôn Thi Miễn Phí
                </h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Tính điểm xét tốt nghiệp THPT 2026, quy đổi điểm ĐGNL, trộn đề trắc nghiệm, đếm từ &amp; tạo flashcard học tập trực tiếp trên trình duyệt không cần đăng nhập.
              </p>
              <div className="mt-5">
                <Button href="/cong-cu" variant="secondary" size="md" className="rounded-xl font-semibold">
                  <Wrench className="h-4 w-4" />
                  <span>Khám Phá Công Cụ Miễn Phí</span>
                </Button>
              </div>
            </div>
          </section>
        </Container>
      </section>
    </>
  );
}
