import type { Metadata } from "next";
import { buildMetadata, faqSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { extendedFaqs } from "@/lib/content/faq";

export const metadata: Metadata = buildMetadata({
  title: "Câu hỏi thường gặp về QuizKen",
  description:
    "Tất cả câu hỏi phổ biến về QuizKen: cách tạo đề kiểm tra AI miễn phí, quiz generator tiếng Việt, xuất PDF, bảo mật dữ liệu, hỗ trợ tiếng Anh.",
  path: "/faq",
  keywords: [
    "FAQ QuizKen",
    "cách tạo đề kiểm tra AI",
    "quiz generator tiếng Việt",
    "tạo quiz miễn phí",
    "công cụ tạo quiz cho giáo viên",
  ],
});

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(extendedFaqs),
          breadcrumbSchema([
            { name: "Trang chủ", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
