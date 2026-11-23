import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { ExamMatrix7991Tool } from "@/components/tools/ExamMatrix7991Tool";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";

const TOOL_SLUG = "tao-ma-tran-de-thi-cong-van-7991";

const FAQS = [
  {
    question: "Cấu trúc đề kiểm tra định kỳ theo Công văn 7991/BGDĐT-GDTrH gồm những phần nào?",
    answer:
      "Theo hướng dẫn kiểm tra đánh giá cấp THCS và THPT của Bộ GD&ĐT, đề kiểm tra định kỳ kết hợp Trắc nghiệm khách quan (7,0 điểm — gồm Phần I Nhiều lựa chọn, Phần II Đúng/Sai 4 ý, Phần III Trả lời ngắn) và Tự luận (3,0 điểm), hoặc 100% trắc nghiệm 3 phần đối với đề luyện thi tốt nghiệp THPT 2027.",
  },
  {
    question: "4 mức độ nhận thức trong Ma trận và Bản đặc tả được phân bổ tỷ lệ ra sao?",
    answer:
      "Công cụ phân bổ chuẩn theo 4 mức độ nhận thức: Nhận biết (40% = 4,0 điểm), Thông hiểu (30% = 3,0 điểm), Vận dụng (20% = 2,0 điểm) và Vận dụng cao (10% = 1,0 điểm), tự động cân bằng tổng điểm đúng 10,00 điểm.",
  },
  {
    question: "Tôi có thể tải Ma trận về file Word (.docx) và dùng AI tạo đề ngay được không?",
    answer:
      "Có. Bạn nhấn nút 'Tải Ma trận & Đặc tả (.docx)' để lấy file Word chuẩn bảng biểu nộp tổ chuyên môn, hoặc nhấn 'Sinh đề AI đúng Ma trận này trên App' để chuyển thẳng cấu trúc sang ứng dụng QuizKen tạo bộ câu hỏi hoàn chỉnh.",
  },
];

export function generateMetadata(): Metadata {
  const tool = getToolBySlug(TOOL_SLUG);
  if (!tool) return {};
  return buildMetadata({
    title: tool.title,
    description: tool.description,
    path: `/cong-cu/${tool.slug}`,
    keywords: tool.keywords,
  });
}

export default function ExamMatrix7991Page() {
  const tool = getToolBySlug(TOOL_SLUG);
  if (!tool) notFound();

  return (
    <ToolPageShell
      tool={tool}
      faqs={FAQS}
      ctaTitle="Đã có Ma trận chuẩn? Để AI QuizKen tự động biên soạn bộ đề trong 30 giây"
      ctaDescription="Chuyển trực tiếp thông số ma trận sang QuizKen App để AI sinh đủ câu hỏi Phần I (ABCD), Phần II (Đúng/Sai 4 ý) và Phần III (Trả lời ngắn) kèm lời giải chi tiết."
      ctaHref={appLink("/quiz/create")}
      ctaLabel="Tạo đề thi AI trên QuizKen App"
      secondaryCtaHref="/cong-cu/chuyen-de-word-docx-sang-trac-nghiem"
      secondaryCtaLabel="Trộn 4–24 mã đề Word (.docx)"
      seoContent={
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Hướng dẫn xây dựng Ma trận & Bản đặc tả theo Công văn 7991/BGDĐT-GDTrH
          </h2>
          <p>
            Công văn 7991/BGDĐT-GDTrH quy định khung kiểm tra, đánh giá định kỳ đối với học sinh THCS và THPT theo Chương trình GDPT 2018. Trong đó, bài kiểm tra trên giấy được thiết kế theo thang điểm 10,0 với 4 mức độ nhận thức: <strong>Nhận biết (40%)</strong>, <strong>Thông hiểu (30%)</strong>, <strong>Vận dụng (20%)</strong> và <strong>Vận dụng cao (10%)</strong>.
          </p>
          <p>
            Công cụ trên trang này tự động tính toán số câu hỏi từng phần (Phần I Trắc nghiệm 4 lựa chọn, Phần II Đúng/Sai 4 ý, Phần III Trả lời ngắn và Tự luận), xuất trực tiếp ra file Word (<code>.docx</code>) chuẩn bảng biểu hành chính và cho phép chuyển tiếp 1-click sang <strong>QuizKen App</strong> để AI tự động sinh đề thi khớp 100% với ma trận.
          </p>
        </div>
      }
    >
      <ExamMatrix7991Tool />
    </ToolPageShell>
  );
}
