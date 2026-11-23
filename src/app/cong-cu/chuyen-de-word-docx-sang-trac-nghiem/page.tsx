import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { DocxExamSuiteTool } from "@/components/tools/DocxExamSuiteTool";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";

const TOOL_SLUG = "chuyen-de-word-docx-sang-trac-nghiem";

const FAQS = [
  {
    question: "Công cụ hỗ trợ nhận diện đáp án đúng trong file Word (.docx) bằng những cách nào?",
    answer:
      "Bạn có thể đánh dấu đáp án đúng trong file Word bằng dấu sao ở đầu phương án (*A.), in đậm hoặc gạch chân phương án đúng, hoặc ghi dòng 'Đáp án: B' bên dưới câu hỏi. Đối với Phần II (Đúng/Sai 4 ý), bạn ghi (Đ) hoặc (S) ở cuối mỗi ý a, b, c, d.",
  },
  {
    question: "Khi trộn 4–24 mã đề thì các phần I, II, III có bị xáo trộn lẫn vào nhau không?",
    answer:
      "Không. Thuật toán trộn đề giữ nguyên cấu trúc 3 phần tách biệt chuẩn Bộ GD&ĐT (Phần I Nhiều lựa chọn, Phần II Đúng/Sai, Phần III Trả lời ngắn), chỉ xáo trộn thứ tự câu bên trong từng phần và tự động ánh xạ lại bảng đáp án chính xác 100%.",
  },
  {
    question: "File tải về gồm những gì?",
    answer:
      "Bạn nhận được 1 file .zip chứa toàn bộ các file đề thi Word (.docx) riêng cho từng mã đề (101, 102, 103, 104...) để in ấn hoặc chỉnh sửa thêm, kèm 1 file Word Bảng đáp án tổng hợp và 1 file Excel (.csv) để chấm điểm nhanh.",
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

export default function DocxExamSuitePage() {
  const tool = getToolBySlug(TOOL_SLUG);
  if (!tool) notFound();

  return (
    <ToolPageShell
      tool={tool}
      faqs={FAQS}
      ctaTitle="Muốn tổ chức thi online có đồng hồ đếm ngược, cảnh báo chuyển tab & tự chấm điểm?"
      ctaDescription="Sau khi chuẩn bị xong đề thi, bạn có thể chuyển sang QuizKen App để mở Phòng Thi Thử Online, chiếu Mã QR cho cả lớp vào làm bài hoặc tổ chức Đấu Trường Live."
      ctaHref={appLink("/quiz/create")}
      ctaLabel="Mở Phòng Thi Online trên QuizKen App"
      secondaryCtaHref="/cong-cu/tao-ma-tran-de-thi-cong-van-7991"
      secondaryCtaLabel="Tạo Ma trận đề thi CV 7991"
      seoContent={
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Quy trình chuyển file Word (.docx) & Trộn 4–24 Mã đề chuẩn GDPT 2018
          </h2>
          <p>
            Khác với các phần mềm trộn đề truyền thống chỉ hỗ trợ câu hỏi 4 lựa chọn A/B/C/D, bộ công cụ trộn đề Word trên QuizKen hỗ trợ đầy đủ <strong>3 dạng thức câu hỏi mới của Bộ GD&ĐT (2026–2027)</strong>: Phần I (Trắc nghiệm 4 phương án), Phần II (Trắc nghiệm Đúng/Sai 4 ý a, b, c, d) và Phần III (Trắc nghiệm Trả lời ngắn).
          </p>
          <p>
            Toàn bộ quá trình đọc file <code>.docx</code> và đóng gói <code>.zip</code> diễn ra trực tiếp trên trình duyệt (100% bảo mật đề thi), xuất ra các file Word định dạng A4 sạch đẹp kèm <code>Bang_Dap_An_Tong_Hop.docx</code> và <code>Bang_Dap_An_Tong_Hop.csv</code>, đồng thời kết nối trực tiếp với <strong>QuizKen App</strong> khi thầy cô muốn giao bài hoặc tổ chức thi trực tuyến.
          </p>
        </div>
      }
    >
      <DocxExamSuiteTool />
    </ToolPageShell>
  );
}
