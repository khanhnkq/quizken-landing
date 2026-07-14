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
import {
  organizationSchema,
  softwareApplicationSchema,
  webPageSchema,
  faqSchema,
  buildMetadata,
} from "@/lib/seo";
import { faqs } from "@/lib/content/faq";

export const metadata = buildMetadata({
  title: "Tạo Đề Trắc Nghiệm Bằng AI Miễn Phí | Phần Mềm Soạn Đề Thi",
  description:
    "QuizKen giúp giáo viên và học sinh tạo đề thi trắc nghiệm bằng AI trong 30 giây. Hỗ trợ 100+ môn học, tự động chấm điểm, xuất đề PDF tiếng Việt miễn phí.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          softwareApplicationSchema(),
          webPageSchema(
            "Tạo Đề Trắc Nghiệm Bằng AI Miễn Phí | QuizKen",
            "QuizKen giúp giáo viên và học sinh tạo đề thi trắc nghiệm bằng AI trong 30 giây.",
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
      <Testimonials />
      <FaqSection />
      <FinalCta />
    </>
  );
}
