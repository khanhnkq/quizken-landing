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
} from "@/lib/seo";
import { faqs } from "@/lib/content/faq";

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          softwareApplicationSchema(),
          webPageSchema(
            "Tạo Bài Kiểm Tra AI Miễn Phí | QuizKen",
            "QuizKen giúp giáo viên và học sinh tạo bài kiểm tra trắc nghiệm với AI trong vài giây.",
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
