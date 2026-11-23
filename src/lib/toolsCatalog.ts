import { buildAbsoluteUrl, SITE } from "@/lib/site";

export type ToolCategory = "diem-so" | "on-thi" | "giao-vien";

export type ToolCatalogItem = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  badge: string;
  category: ToolCategory;
  categoryLabel: string;
  keywords: string[];
  accentLabel?: string;
};

export const TOOL_CATEGORIES: Array<{
  id: "all" | ToolCategory;
  label: string;
}> = [
  { id: "all", label: "Tất cả công cụ" },
  { id: "diem-so", label: "Tính & Quy đổi điểm" },
  { id: "on-thi", label: "Lập kế hoạch ôn thi" },
  { id: "giao-vien", label: "Công cụ Giáo viên" },
];

export const TOOLS_CATALOG: ToolCatalogItem[] = [
  {
    slug: "tinh-diem-tot-nghiep-thpt-2027",
    title: "Tính điểm xét tốt nghiệp THPT 2027 (Công thức 50/50 mới)",
    shortTitle: "Tính điểm tốt nghiệp THPT 2027",
    description:
      "Công cụ tính điểm xét tốt nghiệp THPT 2027 miễn phí theo Thông tư mới của Bộ GD&ĐT (50% điểm 4 môn thi + 50% học bạ lớp 10-11-12 trọng số 1:2:3), kiểm tra điểm liệt và điều kiện đỗ.",
    badge: "Công thức 50/50 mới",
    category: "diem-so",
    categoryLabel: "Tính & Quy đổi điểm",
    keywords: [
      "tính điểm xét tốt nghiệp thpt 2027",
      "công thức tính điểm tốt nghiệp 50 50",
      "tính điểm tốt nghiệp thpt",
      "điểm xét tốt nghiệp 2027",
      "trọng số học bạ 1 2 3",
      "điểm liệt thpt 2027",
    ],
  },
  {
    slug: "tinh-diem-gpa-dai-hoc",
    title: "Tính điểm GPA Đại học (Hệ 10 ↔ Hệ 4 ↔ Điểm chữ)",
    shortTitle: "Tính điểm GPA Đại học",
    description:
      "Tính điểm trung bình tích lũy GPA Đại học hệ 4 và hệ 10 theo tín chỉ, tự động quy đổi điểm chữ A/B+/B/C+/C/D+/D/F, xếp loại bằng và tính GPA mục tiêu cho các kỳ còn lại.",
    badge: "Hệ 10 & Hệ 4",
    category: "diem-so",
    categoryLabel: "Tính & Quy đổi điểm",
    keywords: [
      "tính điểm gpa đại học",
      "quy đổi điểm hệ 10 sang hệ 4",
      "công cụ tính gpa tín chỉ",
      "tính gpa mục tiêu tốt nghiệp giỏi xuất sắc",
      "xếp loại bằng đại học",
    ],
  },
  {
    slug: "quy-doi-diem-ielts-dgnl-2027",
    title: "Quy đổi điểm IELTS, TOEIC, SAT & ĐGNL (HSA, V-ACT, TSA) 2027",
    shortTitle: "Quy đổi IELTS / SAT / ĐGNL",
    description:
      "Tra cứu và quy đổi nhanh điểm IELTS, TOEIC, SAT Digital, ĐGNL Hà Nội (HSA), ĐGNL TP.HCM (V-ACT) và ĐGTD Bách Khoa (TSA) sang thang điểm 10 / thang điểm 30 xét tuyển đại học.",
    badge: "IELTS • SAT • ĐGNL",
    category: "diem-so",
    categoryLabel: "Tính & Quy đổi điểm",
    keywords: [
      "quy đổi điểm ielts sang điểm thi đại học 2027",
      "quy đổi điểm đgnl hsa v-act tsa sang thang 30",
      "quy đổi điểm sat sang thang 30",
      "quy đổi toeic sang thang 10",
      "bảng quy đổi điểm xét tuyển đại học",
    ],
  },
  {
    slug: "dem-nguoc-ngay-thi-2027",
    title: "Đếm ngược ngày thi THPT Quốc gia, ĐGNL V-ACT & Lớp 10 năm 2027",
    shortTitle: "Đếm ngược ngày thi 2027",
    description:
      "Đồng hồ đếm ngược từng giây đến kỳ thi Tốt nghiệp THPT 2027, ĐGNL ĐHQG TP.HCM đợt 1 & đợt 2, thi vào lớp 10 kèm công cụ lập lịch ôn tập theo giờ học mỗi ngày.",
    badge: "Live Countdown",
    category: "on-thi",
    categoryLabel: "Lập kế hoạch ôn thi",
    keywords: [
      "đếm ngược ngày thi thpt quốc gia 2027",
      "lịch thi thpt 2027",
      "đếm ngược ngày thi đgnl 2027",
      "đếm ngược thi vào lớp 10 2027",
      "lập kế hoạch ôn thi thpt",
    ],
  },
  {
    slug: "tron-de-trac-nghiem-online",
    title: "Trộn đề trắc nghiệm online miễn phí (Tạo 4 mã đề 101–104)",
    shortTitle: "Trộn đề trắc nghiệm 4 mã đề",
    description:
      "Dán câu hỏi trắc nghiệm từ Word/Text để trộn ngẫu nhiên thứ tự câu và đáp án A/B/C/D thành 4 mã đề 101, 102, 103, 104 kèm bảng đáp án tổng, tải file TXT hoặc HTML in A4 ngay.",
    badge: "4 Mã đề miễn phí",
    category: "giao-vien",
    categoryLabel: "Công cụ Giáo viên",
    keywords: [
      "trộn đề trắc nghiệm online miễn phí",
      "phần mềm trộn đề trắc nghiệm",
      "trộn đề 4 mã đề 101 102 103 104",
      "đảo câu hỏi trắc nghiệm online",
      "tạo bảng đáp án trắc nghiệm",
    ],
  },
  {
    slug: "tao-phieu-tra-loi-trac-nghiem-2027",
    title: "Tạo phiếu trả lời trắc nghiệm chuẩn Bộ GD&ĐT 2026–2027 (In A4)",
    shortTitle: "Tạo phiếu tô đáp án A4 2027",
    description:
      "Thiết kế và in miễn phí phiếu trả lời trắc nghiệm chuẩn cấu trúc mới 3 phần của Bộ GD&ĐT (Phần I nhiều lựa chọn, Phần II Đúng/Sai a-b-c-d, Phần III Trả lời ngắn) chuẩn khổ giấy A4.",
    badge: "Chuẩn GDPT 2018",
    category: "giao-vien",
    categoryLabel: "Công cụ Giáo viên",
    keywords: [
      "tạo phiếu trả lời trắc nghiệm 2027",
      "mẫu phiếu tô đáp án bộ gd&đt mới",
      "phiếu trả lời trắc nghiệm đúng sai trả lời ngắn",
      "in phiếu trả lời trắc nghiệm a4 miễn phí",
    ],
  },
];

export function getToolBySlug(slug: string): ToolCatalogItem | undefined {
  return TOOLS_CATALOG.find((tool) => tool.slug === slug);
}

export function getToolPaths(): string[] {
  return ["/cong-cu", ...TOOLS_CATALOG.map((t) => `/cong-cu/${t.slug}`)];
}

export function toolSoftwareSchema(tool: ToolCatalogItem) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    inLanguage: "vi-VN",
    url: buildAbsoluteUrl(`/cong-cu/${tool.slug}`),
    description: tool.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "VND",
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
  };
}
