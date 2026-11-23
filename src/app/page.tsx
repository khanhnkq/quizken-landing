import Link from "next/link";
import { ArrowRight, BookOpenCheck, FolderKanban, GraduationCap, Wrench } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { StatsBar } from "@/components/home/StatsBar";
import { Features } from "@/components/home/Features";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Benefits } from "@/components/home/Benefits";
import { EnglishHub } from "@/components/home/EnglishHub";
import { Testimonials } from "@/components/home/Testimonials";
import { FaqSection } from "@/components/home/FaqSection";
import { FinalCta } from "@/components/home/FinalCta";
import { JsonLd } from "@/components/JsonLd";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import {
  organizationSchema,
  softwareApplicationSchema,
  webPageSchema,
  faqSchema,
  buildMetadata,
} from "@/lib/seo";
import { faqs } from "@/lib/content/faq";

export const metadata = buildMetadata({
  title: "Tạo Đề Trắc Nghiệm Bằng AI Miễn Phí | QuizKen",
  description:
    "QuizKen giúp giáo viên và học sinh tạo đề thi trắc nghiệm bằng AI trong 3 giây. Hỗ trợ 100+ môn học, tự động chấm điểm, xuất đề PDF miễn phí.",
  path: "/",
});

const RESOURCE_HUBS = [
  {
    href: "/de-thi",
    badge: "Đề thi chuẩn 2026",
    title: "Trung Tâm Đề Thi THPT & Kỳ Thi Lớn",
    description:
      "Luyện trắc nghiệm 9 môn THPT (lớp 10, 11, 12) chuẩn 3 phần mới, Đánh giá năng lực (HSA, V-ACT, TSA), Đại học, Vào 10 và Chứng chỉ.",
    cta: "Xem tất cả đề thi",
    icon: GraduationCap,
    quickLinks: [
      { label: "Đề thi Toán", href: "/de-thi/toan" },
      { label: "ĐGNL HSA / V-ACT", href: "/de-thi/dgnl" },
      { label: "Đại cương ĐH", href: "/de-thi/dai-hoc" },
      { label: "Tuyển sinh vào 10", href: "/de-thi/vao-10" },
    ],
  },
  {
    href: "/kho-de",
    badge: "Cộng đồng chia sẻ",
    title: "Kho Đề Thi Trắc Nghiệm Công Khai",
    description:
      "Khám phá hàng trăm bộ đề thi công khai được tạo và chia sẻ bởi cộng đồng giáo viên, sinh viên Việt Nam. Làm thử ngay không cần cài app.",
    cta: "Khám phá Kho đề",
    icon: FolderKanban,
    quickLinks: [
      { label: "Làm đề công khai", href: "/kho-de" },
      { label: "Chứng chỉ TOEIC / GPLX", href: "/de-thi/chung-chi" },
    ],
  },
  {
    href: "/cong-cu",
    badge: "Miễn phí 100%",
    title: "Bộ Công Cụ Học Tập & Ôn Thi Nhanh",
    description:
      "Công cụ tính điểm tốt nghiệp THPT 2026, quy đổi điểm, trộn đề trắc nghiệm, đếm từ & tạo flashcard chạy trực tiếp trên trình duyệt.",
    cta: "Mở bộ Công cụ",
    icon: Wrench,
    quickLinks: [
      { label: "Tất cả công cụ", href: "/cong-cu" },
      { label: "Mẹo học tập", href: "/meo" },
    ],
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          softwareApplicationSchema(),
          webPageSchema(
            "Tạo Đề Trắc Nghiệm Bằng AI Miễn Phí | QuizKen",
            "QuizKen giúp giáo viên và học sinh tạo đề thi trắc nghiệm bằng AI trong 3 giây.",
            "/",
          ),
          faqSchema(faqs),
        ]}
      />

      <Hero />
      <StatsBar />
      <Features />
      <HowItWorks />
      <Benefits />
      <EnglishHub />

      {/* Exam & Tools Hub Section */}
      <section id="exam-tools-hub" className="py-16 sm:py-24 bg-background">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <Badge>
              <BookOpenCheck className="w-3.5 h-3.5 text-primary" />
              <span>Hệ sinh thái ôn thi &amp; công cụ</span>
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Kho Đề Thi &amp; Công Cụ Học Tập Miễn Phí
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Truy cập nhanh hệ thống đề thi chuẩn GDPT 2018, kho đề cộng đồng và các công cụ hỗ trợ học sinh, giáo viên ôn luyện hiệu quả.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {RESOURCE_HUBS.map((hub) => {
              const Icon = hub.icon;
              return (
                <div
                  key={hub.href}
                  className="flex flex-col justify-between rounded-2xl bg-card/85 border border-border/70 shadow-none p-6 space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.06] text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <Badge className="text-xs">{hub.badge}</Badge>
                    </div>

                    <h3 className="font-heading text-xl font-bold text-foreground">
                      <Link href={hub.href} className="hover:text-primary transition-colors">
                        {hub.title}
                      </Link>
                    </h3>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {hub.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {hub.quickLinks.map((ql) => (
                        <Link
                          key={ql.href}
                          href={ql.href}
                          className="rounded-lg bg-foreground/[0.04] dark:bg-foreground/[0.06] px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-foreground/[0.08] hover:text-primary"
                        >
                          {ql.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={hub.href}
                    className="group inline-flex items-center justify-between rounded-xl bg-foreground/[0.04] dark:bg-foreground/[0.06] px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-foreground/[0.08]"
                  >
                    <span>{hub.cta}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <Testimonials />
      <FaqSection />
      <FinalCta />
    </>
  );
}
