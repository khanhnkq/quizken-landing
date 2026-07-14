import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles, ArrowRight, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SUBJECTS, GRADES } from "@/lib/pSEO";
import { JsonLd } from "@/components/JsonLd";
import { appLink, buildAbsoluteUrl } from "@/lib/site";

type RouteParams = {
  subject: string;
  grade: string;
};

// Generate static params for Next.js SSG build
export async function generateStaticParams() {
  const paths: RouteParams[] = [];
  for (const sub of SUBJECTS) {
    for (const gr of GRADES) {
      paths.push({
        subject: sub.slug,
        grade: gr.slug,
      });
    }
  }
  return paths;
}

// Generate dynamic metadata for search engines
export async function generateMetadata(props: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { subject, grade } = await props.params;
  const subData = SUBJECTS.find((s) => s.slug === subject);
  const grData = GRADES.find((g) => g.slug === grade);

  if (!subData || !grData) return {};

  const title = `Đề Thi Trắc Nghiệm ${subData.name} ${grData.name} Có Đáp Án`;
  const description = `Tổng hợp bộ đề thi trắc nghiệm ${subData.name} ${grData.name} tự động bằng AI. Tải tài liệu đề thi PDF kèm đáp án chi tiết và ôn luyện trắc nghiệm online miễn phí.`;
  const path = `/de-thi/${subject}/${grade}`;

  return {
    title,
    description,
    alternates: {
      canonical: buildAbsoluteUrl(path),
    },
    openGraph: {
      title,
      description,
      url: buildAbsoluteUrl(path),
      type: "website",
    },
  };
}

export default async function PseoPage(props: {
  params: Promise<RouteParams>;
}) {
  const { subject, grade } = await props.params;
  const subData = SUBJECTS.find((s) => s.slug === subject);
  const grData = GRADES.find((g) => g.slug === grade);

  if (!subData || !grData) {
    notFound();
  }

  const title = `Đề Thi Trắc Nghiệm ${subData.name} ${grData.name}`;
  const ctaUrl = appLink(`/?subject=${subject}&grade=${grade}`);

  // Dynamic FAQs for the schemas
  const faqs = [
    {
      q: `Làm sao để tạo đề thi trắc nghiệm ${subData.name} ${grData.name} tự động?`,
      a: `Bạn chỉ cần click vào nút "Tạo đề thi bằng AI" trên QuizKen, hệ thống sẽ tự động tổng hợp ngân hàng câu hỏi chuẩn cấu trúc dành riêng cho môn ${subData.name} ${grData.name} trong 30 giây.`
    },
    {
      q: `QuizKen có hỗ trợ tải đề thi ${subData.name} dưới dạng PDF không?`,
      a: "Có. Sau khi tạo đề thi xong, bạn có thể dễ dàng nhấn nút Xuất PDF để lưu file đề thi và phiếu đáp án được định dạng chuẩn A4 sạch đẹp để in ấn."
    },
    {
      q: "Tôi có thể tổ chức thi trực tuyến cho lớp học bằng đề thi này không?",
      a: "Hoàn toàn được. QuizKen hỗ trợ tạo phòng thi đấu Multiplayer trực tuyến thời gian thực, học sinh tham gia trả lời bằng điện thoại mà không cần đăng ký tài khoản."
    }
  ];

  // Render dynamic page
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Trang chủ",
                "item": buildAbsoluteUrl("/")
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": `Đề thi ${subData.name}`,
                "item": buildAbsoluteUrl(`/de-thi/${subject}/${grade}`)
              }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((f) => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": f.a
              }
            }))
          }
        ]}
      />

      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
        {/* Glow Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <span className="absolute left-[10%] top-[5%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />
          <span className="absolute right-[8%] top-[10%] h-[350px] w-[350px] rounded-full bg-amber-300/15 blur-[100px]" />
        </div>

        <Container>
          {/* Breadcrumbs */}
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{title}</span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            {/* Left Content */}
            <div>
              <span className="eyebrow">
                <Sparkles className="h-3.5 w-3.5" />
                Tạo tự động bằng AI
              </span>

              <h1 className="mt-4 font-heading text-4xl leading-tight tracking-tight sm:text-5xl">
                {title} <span className="text-gradient">Có Đáp Án</span> Chi Tiết
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                {subData.description} Bạn có thể ôn tập trực tuyến ngay tại đây hoặc tạo đề thi mới bằng công nghệ AI của QuizKen chỉ với một cú click chuột.
              </p>

              {/* Sample Questions (Crawlable helpful content) */}
              <div className="mt-10">
                <h2 className="font-heading text-2xl mb-6 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Câu Hỏi Trắc Nghiệm Mẫu ({subData.name} {grData.name})
                </h2>

                <div className="space-y-6">
                  {subData.questions.map((q, idx) => (
                    <div key={idx} className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                      <p className="font-medium text-foreground text-lg mb-4">
                        Câu {idx + 1}: {q.question}
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-muted/40 text-sm`}
                          >
                            <span className="font-bold text-muted-foreground">
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Interactive details tag for answers */}
                      <details className="group mt-5 border-t border-border/60 pt-4">
                        <summary className="flex cursor-pointer items-center justify-between font-semibold text-primary select-none hover:underline">
                          <span>Xem đáp án &amp; lời giải chi tiết</span>
                          <span className="transition-transform group-open:rotate-180">👇</span>
                        </summary>
                        <div className="mt-3 text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl border border-dashed border-border/80">
                          <p className="font-bold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            Đáp án đúng: {String.fromCharCode(65 + q.answer)}
                          </p>
                          <p>{q.explanation}</p>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs section */}
              <div className="mt-12">
                <h2 className="font-heading text-2xl mb-6">Câu hỏi thường gặp</h2>
                <div className="space-y-4">
                  {faqs.map((f, idx) => (
                    <div key={idx} className="border-b border-border/60 pb-4">
                      <h3 className="font-semibold text-foreground text-lg mb-1">{f.q}</h3>
                      <p className="text-muted-foreground">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: CTA Card */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="glass relative overflow-hidden rounded-3xl border border-border p-8 shadow-2xl">
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
                
                <h3 className="font-heading text-2xl text-foreground">
                  Tạo Đề Thi Trắc Nghiệm {subData.name} Miễn Phí
                </h3>
                
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Sử dụng Trí Tuệ Nhân Tạo để soạn đề thi trắc nghiệm {subData.name} {grData.name} theo yêu cầu riêng của bạn chỉ trong 30 giây.
                </p>

                <ul className="mt-6 space-y-3.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Không giới hạn số lượng câu hỏi
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Tự động tạo đáp án & lời giải chi tiết
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Xuất bản file PDF A4 cực kỳ nhanh
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Hỗ trợ 100% tiếng Việt
                  </li>
                </ul>

                <div className="mt-8">
                  <Button href={ctaUrl} className="w-full justify-center group" size="lg">
                    Tạo đề bằng AI ngay
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
