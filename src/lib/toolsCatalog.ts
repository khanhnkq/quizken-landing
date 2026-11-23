import { buildAbsoluteUrl, SITE } from "@/lib/site";

export type ToolCategory =
  | "diem-so"
  | "on-thi"
  | "giao-vien"
  | "hoc-tap-stem"
  | "code-van-phong";

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
  { id: "hoc-tap-stem", label: "Học tập & STEM" },
  { id: "code-van-phong", label: "Tin học & Văn phòng" },
  { id: "on-thi", label: "Lập kế hoạch ôn thi" },
  { id: "giao-vien", label: "Công cụ Giáo viên" },
];

export const TOOLS_CATALOG: ToolCatalogItem[] = [
  // Wave 1 (6 tools)
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

  // Wave 2 (10 tools)
  {
    slug: "tinh-diem-trung-binh-mon-thong-tu-22",
    title: "Tính điểm Trung bình môn & Cả năm chuẩn Thông tư 22",
    shortTitle: "Tính điểm TB môn Thông tư 22",
    description:
      "Tính nhanh điểm trung bình môn học kỳ (ĐTBmhk), điểm cả năm (ĐTBmcn) theo Thông tư 22/2021/TT-BGDĐT, xếp loại học lực Tốt/Khá/Đạt và tính ngược điểm Cuối kỳ cần đạt.",
    badge: "Chuẩn Thông tư 22",
    category: "diem-so",
    categoryLabel: "Tính & Quy đổi điểm",
    keywords: [
      "tính điểm trung bình môn thông tư 22",
      "công thức tính điểm trung bình môn cả năm",
      "tính điểm cuối kỳ cần đạt 8.0",
      "xếp loại học lực thông tư 22",
      "tính điểm hk1 hk2 thcs thpt",
    ],
  },
  {
    slug: "tinh-diem-thi-vao-lop-10",
    title: "Tính điểm Thi tuyển sinh vào lớp 10 (Hà Nội, TP.HCM & Toàn quốc)",
    shortTitle: "Tính điểm thi vào lớp 10",
    description:
      "Công cụ tính điểm xét tuyển vào lớp 10 công lập và trường chuyên tại Hà Nội, TP.HCM và các tỉnh thành theo Thông tư 30/2024/TT-BGDĐT, hỗ trợ hệ số tùy chỉnh và điểm ưu tiên.",
    badge: "Tuyển sinh lớp 10",
    category: "diem-so",
    categoryLabel: "Tính & Quy đổi điểm",
    keywords: [
      "tính điểm thi vào lớp 10",
      "tính điểm thi vào lớp 10 hà nội",
      "tính điểm thi vào lớp 10 tphcm",
      "tính điểm thi trường chuyên lớp 10",
      "cách tính điểm xét tuyển lớp 10",
    ],
  },
  {
    slug: "tinh-diem-xet-hoc-ba-thpt-2027",
    title: "Tính điểm Xét Học bạ THPT 2027 theo Tổ hợp khối (A00, A01, D01...)",
    shortTitle: "Tính điểm Xét học bạ THPT 2027",
    description:
      "Nhập điểm học bạ 6 học kỳ hoặc 3 năm lớp 10–11–12 để tự động tính và xếp hạng các tổ hợp xét tuyển đại học lợi điểm nhất (A00, A01, B00, C00, D01, D07, C01) kèm điểm ưu tiên.",
    badge: "Xếp hạng tổ hợp khối",
    category: "diem-so",
    categoryLabel: "Tính & Quy đổi điểm",
    keywords: [
      "tính điểm xét học bạ thpt 2027",
      "tính điểm học bạ 6 học kỳ",
      "tính điểm học bạ khối d01 a00 a01",
      "xếp hạng khối xét học bạ",
    ],
  },
  {
    slug: "tinh-diem-cong-uu-tien-dai-hoc-2027",
    title: "Tính điểm Cộng & Giảm trừ Ưu tiên Xét tuyển Đại học 2027",
    shortTitle: "Tính điểm ưu tiên Đại học 2027",
    description:
      "Tính chính xác điểm ưu tiên khu vực (KV1, KV2-NT, KV2, KV3) và đối tượng (ƯT1, ƯT2) theo công thức giảm tuyến tính từ mức 22.5 điểm của Bộ GD&ĐT.",
    badge: "Quy chế ≥ 22.5đ",
    category: "diem-so",
    categoryLabel: "Tính & Quy đổi điểm",
    keywords: [
      "tính điểm ưu tiên xét tuyển đại học 2027",
      "công thức giảm điểm ưu tiên từ 22.5",
      "điểm ưu tiên khu vực kv1 kv2-nt",
      "tính điểm cộng đối tượng ưu tiên",
    ],
  },
  {
    slug: "tinh-diem-thi-vstep-b1-b2-c1",
    title: "Tính & Quy đổi điểm thi VSTEP (B1, B2, C1) chuẩn Bộ GD&ĐT",
    shortTitle: "Tính điểm thi VSTEP B1/B2/C1",
    description:
      "Tính điểm tổng kết 4 kỹ năng Nghe - Nói - Đọc - Viết VSTEP theo quy tắc làm tròn 0.5 chính thức, xác định bậc B1/B2/C1 và quy đổi tương đương CEFR / IELTS.",
    badge: "VSTEP B1 • B2 • C1",
    category: "diem-so",
    categoryLabel: "Tính & Quy đổi điểm",
    keywords: [
      "tính điểm thi vstep",
      "vstep bao nhiêu điểm đậu b1 b2",
      "quy tắc làm tròn 0.5 điểm vstep",
      "quy đổi vstep sang ielts cefr",
    ],
  },
  {
    slug: "can-bang-phuong-trinh-hoa-hoc",
    title: "Cân bằng Phương trình Hóa học & Tính Phân tử khối (M) Online",
    shortTitle: "Cân bằng Phương trình Hóa học",
    description:
      "Tự động cân bằng phương trình phản ứng hóa học bằng thuật toán đại số chính xác, tính ngay khối lượng mol (M) cho từng chất và hỗ trợ dấu ngoặc phức tạp như Fe2(SO4)3, Ca(OH)2.",
    badge: "Hóa học 8–12",
    category: "hoc-tap-stem",
    categoryLabel: "Học tập & STEM",
    keywords: [
      "cân bằng phương trình hóa học online",
      "tính phân tử khối m online",
      "cân bằng phản ứng oxi hóa khử",
      "công cụ giải hóa học miễn phí",
    ],
  },
  {
    slug: "bang-tuan-hoan-hoa-hoc-tuong-tac",
    title: "Bảng tuần hoàn các Nguyên tố Hóa học Tương tác (118 Nguyên tố)",
    shortTitle: "Bảng tuần hoàn 118 nguyên tố",
    description:
      "Tra cứu nhanh 118 nguyên tố hóa học theo danh pháp tiếng Việt & IUPAC GDPT 2018: số hiệu Z, nguyên tử khối, cấu hình electron, độ âm điện, số oxi hóa và mini-quiz ghi nhớ.",
    badge: "118 Nguyên tố IUPAC",
    category: "hoc-tap-stem",
    categoryLabel: "Học tập & STEM",
    keywords: [
      "bảng tuần hoàn hóa học online",
      "bảng tuần hoàn 118 nguyên tố tiếng việt",
      "tra cứu nguyên tử khối cấu hình electron",
      "bảng tuần hoàn iupac gdpt 2018",
    ],
  },
  {
    slug: "dong-ho-pomodoro-hoc-tap",
    title: "Đồng hồ Pomodoro & Âm thanh Tập trung Ôn thi Miễn phí",
    shortTitle: "Đồng hồ Pomodoro học bài",
    description:
      "Đồng hồ học tập Pomodoro 25/5, 50/10, chế độ toàn màn hình, trình tạo âm thanh mưa/white noise không tốn băng thông và danh sách việc cần làm giúp ôn thi tập trung tối đa.",
    badge: "Focus + Audio",
    category: "on-thi",
    categoryLabel: "Lập kế hoạch ôn thi",
    keywords: [
      "đồng hồ pomodoro online",
      "đồng hồ học bài 25 5 miễn phí",
      "pomodoro timer tiếng mưa tập trung",
      "công cụ học tập chống xao nhãng",
    ],
  },
  {
    slug: "dem-tu-bai-luan-ielts-ngu-van",
    title: "Đếm từ Bài luận & Kiểm tra Độ dài (IELTS, VSTEP, Ngữ văn)",
    shortTitle: "Đếm từ bài luận & Kiểm tra độ dài",
    description:
      "Đếm chính xác số từ tiếng Việt/tiếng Anh, ký tự, câu, đoạn văn, thời gian đọc và kiểm tra ngưỡng độ dài chuẩn IELTS Task 1/2, VSTEP Writing và Nghị luận 200/600 chữ.",
    badge: "IELTS • Ngữ văn",
    category: "hoc-tap-stem",
    categoryLabel: "Học tập & STEM",
    keywords: [
      "đếm từ online",
      "đếm số từ bài luận tiếng anh ielts",
      "đếm chữ đoạn văn nghị luận 200 chữ",
      "kiểm tra lặp từ bài viết",
    ],
  },
  {
    slug: "giai-phuong-trinh-he-phuong-trinh-ma-tran",
    title: "Giải Phương trình, Hệ phương trình & Tính Định thức Ma trận",
    shortTitle: "Giải PT, Hệ PT & Ma trận",
    description:
      "Giải nhanh phương trình bậc 2/bậc 3, hệ phương trình 2–3 ẩn, tính định thức (det) và ma trận nghịch đảo 2×2, 3×3 kèm các bước giải rõ ràng cho học sinh THPT và sinh viên.",
    badge: "Toán & Đại số",
    category: "hoc-tap-stem",
    categoryLabel: "Học tập & STEM",
    keywords: [
      "giải phương trình bậc 2 bậc 3 online",
      "giải hệ phương trình 2 ẩn 3 ẩn online",
      "tính định thức ma trận nghịch đảo online",
      "máy tính đại số tuyến tính",
    ],
  },

  // Wave 3 + Wave 5 (17 new Vietnamese tools -> total 33)
  {
    slug: "vong-quay-goi-ten-hoc-sinh",
    title: "Vòng quay Gọi tên Học sinh Ngẫu nhiên Online (Không trùng lặp)",
    shortTitle: "Vòng quay gọi tên học sinh",
    description:
      "Vòng quay may mắn gọi tên học sinh kiểm tra bài cũ hoặc chia lượt phát biểu trên lớp học: dán danh sách Excel, quay mượt 60fps, tự động loại tên đã trúng và lưu danh sách lớp.",
    badge: "Classroom Random",
    category: "giao-vien",
    categoryLabel: "Công cụ Giáo viên",
    keywords: [
      "vòng quay gọi tên học sinh online",
      "vòng quay random tên miễn phí",
      "vòng quay kiểm tra bài cũ không trùng lặp",
      "vòng quay lớp học cho giáo viên",
    ],
  },
  {
    slug: "chia-nhom-ngau-nhien-lop-hoc",
    title: "Chia nhóm & Chọn Nhóm trưởng Ngẫu nhiên cho Lớp học Online",
    shortTitle: "Chia nhóm ngẫu nhiên lớp học",
    description:
      "Dán danh sách học sinh từ Excel để chia nhanh thành các nhóm thảo luận công bằng theo số nhóm hoặc sĩ số mỗi nhóm, tự động bốc nhóm trưởng và copy bảng đẹp gửi Zalo.",
    badge: "Chia đội 1-Click",
    category: "giao-vien",
    categoryLabel: "Công cụ Giáo viên",
    keywords: [
      "chia nhóm ngẫu nhiên online",
      "chia tổ đội lớp học miễn phí",
      "bốc thăm nhóm trưởng ngẫu nhiên",
      "công cụ chia nhóm từ danh sách excel",
    ],
  },
  {
    slug: "dong-ho-bam-gio-thi-thu-may-chieu",
    title: "Đồng hồ Bấm giờ Thi thử Toàn màn hình Máy chiếu (15p / 45p / 90p)",
    shortTitle: "Đồng hồ bấm giờ phòng thi",
    description:
      "Đồng hồ đếm ngược chữ siêu lớn chuyên dụng chiếu máy chiếu khi kiểm tra 15 phút, 45 phút, 50 phút GDPT 2018 hoặc 90 phút; có chuông báo 5 phút cuối và bảng nội quy phòng thi.",
    badge: "Full-Screen Projector",
    category: "giao-vien",
    categoryLabel: "Công cụ Giáo viên",
    keywords: [
      "đồng hồ bấm giờ thi thử online",
      "đồng hồ đếm ngược 45 phút 90 phút máy chiếu",
      "đồng hồ kiểm tra 15 phút lớp học",
      "bấm giờ phòng thi có chuông báo",
    ],
  },
  {
    slug: "in-flashcard-2-mat-a4",
    title: "Tạo & In Flashcard 2 mặt Chuẩn Khổ A4 Miễn phí (Từ vựng & Công thức)",
    shortTitle: "In Flashcard 2 mặt A4",
    description:
      "Dán danh sách từ vựng hoặc công thức để tự động dàn trang Flashcard 8–10 thẻ/trang A4, tự động đảo cột đối xứng trang mặt sau giúp in 2 mặt khớp 100% không bị lệch lề.",
    badge: "In 2 mặt khớp A4",
    category: "giao-vien",
    categoryLabel: "Công cụ Giáo viên",
    keywords: [
      "tạo flashcard in a4 online",
      "in flashcard 2 mặt từ vựng",
      "mẫu in thẻ flashcard tiếng anh pdf",
      "in flashcard không cần phần mềm",
    ],
  },
  {
    slug: "chuyen-doi-chu-hoa-thuong-soat-loi-van-ban",
    title: "Chuẩn hóa Văn bản Soạn đề, Xóa ngắt dòng PDF & Sắp xếp Tên A–Z",
    shortTitle: "Chuẩn hóa văn bản & Sắp xếp tên",
    description:
      "Công cụ xử lý văn bản tức thì cho giáo viên và sinh viên: sửa lỗi xuống dòng khi copy từ PDF, xóa khoảng trắng thừa, đổi chữ HOA/thường/Tiêu đề và sắp xếp danh sách học sinh A–Z chuẩn tiếng Việt.",
    badge: "Fix copy PDF",
    category: "giao-vien",
    categoryLabel: "Công cụ Giáo viên",
    keywords: [
      "chuyển chữ hoa sang chữ thường online",
      "xóa dấu xuống dòng khi copy từ pdf",
      "sắp xếp danh sách tên học sinh theo bảng chữ cái",
      "chuẩn hóa văn bản xóa khoảng trắng thừa",
    ],
  },
  {
    slug: "tao-ma-qr-lop-hoc-mien-phi",
    title: "Tạo Mã QR Lớp học & Tài liệu Học tập Vĩnh viễn (SVG / PNG)",
    shortTitle: "Tạo mã QR lớp học miễn phí",
    description:
      "Tạo mã QR tĩnh miễn phí không bao giờ hết hạn cho link đề thi, tài liệu Google Drive hoặc WiFi lớp học; hỗ trợ thiết kế thẻ QR có tiêu đề in đẹp và tải file SVG/PNG sắc nét.",
    badge: "QR Vĩnh viễn",
    category: "giao-vien",
    categoryLabel: "Công cụ Giáo viên",
    keywords: [
      "tạo mã qr miễn phí không hết hạn",
      "tạo qr code link tài liệu bài giảng",
      "tạo mã qr wifi lớp học",
      "tải qr code png svg miễn phí",
    ],
  },
  {
    slug: "tao-trich-dan-tai-lieu-apa-ieee",
    title: "Tạo Trích dẫn Tài liệu Tham khảo APA 7, IEEE, Harvard & TCVN Tự động",
    shortTitle: "Tạo trích dẫn APA 7 / IEEE",
    description:
      "Tạo nhanh trích dẫn sách, bài báo khoa học, website và luận văn theo chuẩn APA 7, IEEE, Harvard, TCVN; tự động sắp xếp danh mục tham khảo A–Z và copy kèm định dạng thụt đầu dòng.",
    badge: "APA 7 • IEEE • TCVN",
    category: "hoc-tap-stem",
    categoryLabel: "Học tập & STEM",
    keywords: [
      "tạo trích dẫn tài liệu tham khảo apa ieee",
      "công cụ trích dẫn nguồn khóa luận",
      "cách viết tài liệu tham khảo chuẩn apa 7",
      "tạo danh mục tài liệu tham khảo tự động",
    ],
  },
  {
    slug: "soan-cong-thuc-toan-latex-online",
    title: "Trình Soạn thảo Công thức Toán – Lý – Hóa LaTeX Trực quan Online",
    shortTitle: "Soạn công thức Toán LaTeX",
    description:
      "Gõ công thức Toán học, Vật lý, Hóa học bằng bảng nút ký hiệu LaTeX 1-click (phân số, tích phân, giới hạn, ma trận, mũi tên phản ứng), xem trước trực quan và tải ảnh SVG.",
    badge: "LaTeX Editor",
    category: "hoc-tap-stem",
    categoryLabel: "Học tập & STEM",
    keywords: [
      "gõ công thức toán online",
      "latex editor online miễn phí",
      "soạn công thức toán lý hóa chèn word",
      "chuyển latex sang svg miễn phí",
    ],
  },
  {
    slug: "tinh-diem-ren-luyen-hoc-bong-dai-hoc",
    title: "Tính điểm Rèn luyện & Xét Học bổng Khuyến khích Học tập Đại học",
    shortTitle: "Tính điểm xét Học bổng ĐH",
    description:
      "Kiểm tra nhanh điều kiện đạt học bổng khuyến khích học tập (Xuất sắc, Giỏi, Khá) theo GPA học kỳ, điểm rèn luyện (ĐRL), số tín chỉ và ước tính mức học bổng theo % học phí.",
    badge: "Xét Học bổng ĐH",
    category: "diem-so",
    categoryLabel: "Tính & Quy đổi điểm",
    keywords: [
      "tính điểm xét học bổng đại học",
      "điều kiện xét học bổng khuyến khích học tập",
      "bao nhiêu điểm gpa và rèn luyện được học bổng",
      "tính mức học bổng xuất sắc giỏi khá",
    ],
  },
  {
    slug: "ve-do-thi-ham-so-online",
    title: "Vẽ Đồ thị Hàm số 2D Trực quan Online (Toán THPT & Đại học)",
    shortTitle: "Vẽ đồ thị hàm số 2D online",
    description:
      "Vẽ cùng lúc nhiều đồ thị hàm số bậc 3, phân thức, lượng giác, mũ/logarit với hệ trục tọa độ trực quan, phóng to/thu nhỏ, dò tọa độ điểm cực trị và tải ảnh SVG/PNG.",
    badge: "Đồ thị Toán 12",
    category: "hoc-tap-stem",
    categoryLabel: "Học tập & STEM",
    keywords: [
      "vẽ đồ thị hàm số online",
      "vẽ đồ thị hàm bậc 3 phân thức",
      "đồ thị hàm số toán 12 trực quan",
      "tải ảnh đồ thị hàm số png svg",
    ],
  },
  {
    slug: "chuyen-doi-he-co-so-nhi-phan-thap-luc-phan",
    title: "Chuyển đổi Hệ cơ số Tin học (BIN/OCT/DEC/HEX) & Số La Mã",
    shortTitle: "Chuyển đổi hệ cơ số & Số La Mã",
    description:
      "Đồng bộ chuyển đổi tức thì Nhị phân (Base 2), Bát phân (Base 8), Thập phân (Base 10), Thập lục phân (Base 16), bù 2 số âm 8/16-bit kèm từng bước chia lấy dư và đổi Số La Mã 1–3999.",
    badge: "Tin học • Bù 2 • La Mã",
    category: "hoc-tap-stem",
    categoryLabel: "Học tập & STEM",
    keywords: [
      "chuyển đổi hệ nhị phân sang thập phân",
      "đổi hệ cơ số bin oct dec hex online",
      "chuyển số âm sang nhị phân bù 2",
      "đổi số la mã sang số tự nhiên online",
    ],
  },
  {
    slug: "tinh-diem-hoc-phan-tin-chi-can-dat",
    title: "Tính điểm Học phần Tín chỉ & Điểm Cuối kỳ Cần đạt để Qua môn",
    shortTitle: "Tính điểm qua môn & Học phần ĐH",
    description:
      "Nhập điểm chuyên cần, giữa kỳ, thực hành theo tỷ trọng môn học (10-30-60, 10-20-20-50, 20-30-50...) để biết chính xác cần bao nhiêu điểm thi cuối kỳ để qua môn D (4.0) hay đạt C/B/A.",
    badge: "Qua môn • Săn A+",
    category: "diem-so",
    categoryLabel: "Tính & Quy đổi điểm",
    keywords: [
      "tính điểm qua môn đại học",
      "cần mấy điểm cuối kỳ để qua môn",
      "tính điểm học phần tín chỉ 30 70 20 30 50",
      "cách tính điểm tổng kết môn đại học",
    ],
  },
  {
    slug: "tinh-diem-toeic-listening-reading",
    title: "Tính điểm TOEIC Listening & Reading (Raw to Scaled 10–990)",
    shortTitle: "Tính điểm TOEIC L&R 10–990",
    description:
      "Quy đổi nhanh số câu làm đúng phần Listening (0–100) và Reading (0–100) sang thang điểm TOEIC 10–990 theo bảng chuẩn ETS, đánh giá trình độ CEFR và khoảng cách tới mục tiêu 650/800+.",
    badge: "TOEIC 10–990",
    category: "diem-so",
    categoryLabel: "Tính & Quy đổi điểm",
    keywords: [
      "tính điểm toeic listening reading",
      "bảng quy đổi điểm toeic theo số câu đúng",
      "bao nhiêu câu đúng được 550 650 toeic",
      "quy đổi điểm toeic sang cefr ielts",
    ],
  },
  {
    slug: "kiem-tra-toc-do-go-phim-tieng-viet",
    title: "Kiểm tra Tốc độ Gõ phím Tiếng Việt có dấu & Tiếng Anh (WPM Test)",
    shortTitle: "Kiểm tra tốc độ gõ phím WPM",
    description:
      "Đo tốc độ gõ phím WPM, CPM và độ chính xác (%) với đoạn văn Tiếng Việt có dấu (ôn thi Tin học / thi trên máy tính) và Tiếng Anh học thuật IELTS trong 30s / 60s / 120s.",
    badge: "WPM Tiếng Việt",
    category: "on-thi",
    categoryLabel: "Lập kế hoạch ôn thi",
    keywords: [
      "kiểm tra tốc độ gõ phím tiếng việt",
      "test tốc độ đánh máy wpm có dấu",
      "luyện gõ 10 ngón tiếng việt online",
      "đo tốc độ gõ phím thi tin học",
    ],
  },
  {
    slug: "tra-cuu-to-hop-mon-ma-nganh-2027",
    title: "Tra cứu Tổ hợp môn & Nhóm ngành Xét tuyển Đại học 2027 (GDPT 2018)",
    shortTitle: "Tra cứu tổ hợp môn 2027",
    description:
      "Chọn 2–4 môn học THPT GDPT 2018 (bao gồm Tin học, Công nghệ, GDKT&PL) hoặc tìm theo mã tổ hợp (A00, A01, D01, X01, X06...) để xem tất cả khối xét tuyển và nhóm ngành đại học tương ứng.",
    badge: "Tổ hợp GDPT 2018",
    category: "diem-so",
    categoryLabel: "Tính & Quy đổi điểm",
    keywords: [
      "tra cứu tổ hợp môn xét tuyển đại học 2027",
      "tổ hợp môn mới có tin học công nghệ x01 x06",
      "tìm khối thi theo môn học thpt",
      "danh sách mã tổ hợp xét tuyển đại học",
    ],
  },
  {
    slug: "tra-cuu-dong-tu-bat-quy-tac-phat-am-ipa",
    title: "Tra cứu 150+ Động từ Bất quy tắc, Phiên âm IPA & Nghe phát âm",
    shortTitle: "150+ Động từ bất quy tắc & IPA",
    description:
      "Tra cứu nhanh 150+ động từ bất quy tắc tiếng Anh thông dụng nhất (V1 – V2 – V3, phiên âm IPA, nghĩa tiếng Việt), nghe phát âm chuẩn Anh/Mỹ 1-click và luyện Mini-Quiz 10 câu.",
    badge: "IPA + Phát âm + Quiz",
    category: "hoc-tap-stem",
    categoryLabel: "Học tập & STEM",
    keywords: [
      "bảng động từ bất quy tắc tiếng anh đầy đủ",
      "tra cứu v1 v2 v3 phát âm ipa",
      "ôn tập động từ bất quy tắc thi thpt",
      "nghe phát âm động từ bất quy tắc",
    ],
  },
  {
    slug: "tinh-diem-thi-hsk-jlpt-quy-doi-cefr",
    title: "Tính điểm thi JLPT (N5–N1) & Quy đổi HSK 2.0 ↔ HSK 3.0 (CEFR)",
    shortTitle: "Tính điểm JLPT & HSK 3.0",
    description:
      "Kiểm tra điểm đậu/liệt từng phần kỳ thi tiếng Nhật JLPT (N5–N1, tối đa 180 điểm) và tra cứu quy đổi chuẩn HSK 2.0 sang HSK 3.0 (3 Bậc 9 Cấp) áp dụng từ cuối 2026–2027.",
    badge: "JLPT • HSK 3.0",
    category: "diem-so",
    categoryLabel: "Tính & Quy đổi điểm",
    keywords: [
      "tính điểm thi jlpt n5 n4 n3 n2 n1",
      "điểm liệt từng phần jlpt là bao nhiêu",
      "quy đổi hsk 2.0 sang hsk 3.0 mới 2026",
      "bảng quy đổi hsk jlpt sang cefr",
    ],
  },
  {
    slug: "tao-ma-tran-de-thi-cong-van-7991",
    title: "Tạo Ma trận & Bản đặc tả Đề kiểm tra chuẩn Công văn 7991 (Xuất Word .docx)",
    shortTitle: "Tạo Ma trận đề thi CV 7991",
    description:
      "Tự động lập bảng Ma trận và Bản đặc tả đề kiểm tra định kỳ THCS/THPT chuẩn Công văn 7991/BGDĐT-GDTrH (4 mức độ nhận thức, tỷ lệ 70-30 hoặc 100% trắc nghiệm 3 phần), tải file Word .docx và chuyển sang AI tạo đề.",
    badge: "Chuẩn CV 7991 • .docx",
    category: "giao-vien",
    categoryLabel: "Công cụ Giáo viên",
    keywords: [
      "tạo ma trận đề thi công văn 7991",
      "mẫu ma trận bản đặc tả đề kiểm tra 7991",
      "phần mềm tạo ma trận đề thi miễn phí",
      "xuất ma trận đề thi ra file word docx",
      "ma trận đề kiểm tra giữa kỳ cuối kỳ gdpt 2018",
    ],
  },
  {
    slug: "chuyen-de-word-docx-sang-trac-nghiem",
    title: "Chuyển File Word (.docx) sang Đề Trắc nghiệm & Trộn 4–24 Mã đề (.docx ZIP)",
    shortTitle: "Trộn mã đề Word (.docx ZIP)",
    description:
      "Tải file đề thi Word (.docx) hoặc dán văn bản chuẩn 3 phần GDPT 2018 để bóc tách câu hỏi tự động, trộn thành 4–24 mã đề Word (.docx) kèm bảng đáp án tổng hợp (.docx & .csv) nén ZIP hoặc chuyển sang App mở phòng thi.",
    badge: "Word .docx • 4–24 Mã đề",
    category: "giao-vien",
    categoryLabel: "Công cụ Giáo viên",
    keywords: [
      "trộn đề trắc nghiệm file word online",
      "chuyển file word sang đề thi trắc nghiệm",
      "trộn đề 4 mã đề xuất file word docx",
      "phần mềm trộn đề thi thpt 2027 đúng sai trả lời ngắn",
      "tải bảng đáp án tổng hợp nhiều mã đề",
    ],
  },

  // Wave 6 (15 new tools -> total 50)
  // Cluster A: Safe Client-Side IT & Data Tools
  {
    slug: "thuc-hanh-html-css-tin-hoc-12",
    title: "Thực hành HTML5 & CSS3 Trực tiếp Online (Chuẩn SGK Tin học 12)",
    shortTitle: "Thực hành HTML & CSS Tin học 12",
    description:
      "Môi trường thực hành viết mã HTML5 và CSS3 an toàn trực tiếp trên trình duyệt theo chương trình Tin học 12 GDPT 2018: kèm 6 bài mẫu chuẩn SGK, xem trước tức thì trong sandbox tắt script và tải file .html.",
    badge: "Tin học 12 • Sandbox",
    category: "code-van-phong",
    categoryLabel: "Tin học & Văn phòng",
    keywords: [
      "thực hành html css online tin học 12",
      "soạn thảo html trực tuyến miễn phí",
      "bài thực hành html css sgk tin học 12 gdpt 2018",
      "học html css cơ bản trực quan",
    ],
  },
  {
    slug: "dinh-dang-kiem-tra-json-sql-online",
    title: "Định dạng & Kiểm tra JSON, Xuất CSV và Làm đẹp Câu lệnh SQL Online",
    shortTitle: "Format JSON, xuất CSV & SQL",
    description:
      "Làm đẹp (Beautify), thu gọn (Minify), kiểm tra lỗi cú pháp JSON kèm chuyển mảng JSON sang bảng CSV, và trình định dạng câu lệnh SQL chuẩn CSDL Tin học 11 ngay trên trình duyệt.",
    badge: "JSON • CSV • SQL",
    category: "code-van-phong",
    categoryLabel: "Tin học & Văn phòng",
    keywords: [
      "format json online",
      "kiểm tra lỗi json beautify minify",
      "chuyển json sang csv online",
      "định dạng câu lệnh sql tin học 11",
    ],
  },
  {
    slug: "so-sanh-hai-van-ban-diff-checker",
    title: "So sánh Hai Văn bản & Mã nguồn Trực tuyến (Diff Checker)",
    shortTitle: "So sánh 2 văn bản (Diff)",
    description:
      "Tìm kiếm tức thì từng dòng và từng từ thêm mới hoặc bị xóa giữa hai phiên bản văn bản, đề thi hoặc đoạn mã với thuật toán LCS 100% client-side, hiển thị tỷ lệ giống nhau (%) và xem song song.",
    badge: "Diff Checker LCS",
    category: "code-van-phong",
    categoryLabel: "Tin học & Văn phòng",
    keywords: [
      "so sánh hai văn bản online",
      "diff checker tiếng việt miễn phí",
      "tìm điểm khác nhau giữa 2 đoạn văn bản",
      "so sánh code online không cần cài đặt",
    ],
  },
  {
    slug: "kiem-tra-bieu-thuc-chinh-quy-regex",
    title: "Kiểm tra Biểu thức Chính quy (Regex Tester) & Mẫu Học thuật VN",
    shortTitle: "Kiểm tra Regex Online",
    description:
      "Kiểm tra biểu thức chính quy (Regular Expression) an toàn trực tiếp trên trình duyệt: tô màu kết quả khớp, bảng Capture Groups và 10 mẫu Regex chuẩn Việt Nam (ngày DD/MM/YYYY, email .edu.vn, mã học sinh, mã màu HEX).",
    badge: "Regex Safe Tester",
    category: "code-van-phong",
    categoryLabel: "Tin học & Văn phòng",
    keywords: [
      "kiểm tra regex online",
      "regex tester tiếng việt",
      "mẫu regex ngày tháng email số điện thoại việt nam",
      "học biểu thức chính quy trực quan",
    ],
  },
  {
    slug: "bang-ma-mau-hex-rgb-do-tuong-phan-wcag",
    title: "Chuyển đổi Mã màu HEX/RGB/HSL & Kiểm tra Độ tương phản WCAG 2.1",
    shortTitle: "Mã màu & Độ tương phản WCAG",
    description:
      "Chọn và chuyển đổi qua lại tức thì giữa HEX, RGB và HSL; tính tỷ lệ tương phản WCAG 2.1 (1:1–21:1) kèm nhãn AA/AAA cho chữ thường, chữ lớn và slide máy chiếu lớp học.",
    badge: "HEX/RGB • WCAG 2.1",
    category: "code-van-phong",
    categoryLabel: "Tin học & Văn phòng",
    keywords: [
      "chuyển đổi mã màu hex sang rgb hsl",
      "kiểm tra độ tương phản màu wcag",
      "chọn màu chữ dễ đọc trên máy chiếu",
      "bảng mã màu thiết kế web tin học 12",
    ],
  },

  // Cluster B: Office & Document Productivity Tools
  {
    slug: "chuyen-anh-sang-pdf-a4-online",
    title: "Ghép Nhiều Ảnh (JPG/PNG/WebP) thành File PDF Khổ A4 Miễn phí",
    shortTitle: "Chuyển Ảnh sang PDF A4",
    description:
      "Nén và ghép nhiều ảnh chụp bài tập, phiếu bài làm hoặc ghi chú viết tay thành 1 file PDF chuẩn khổ A4 (Dọc/Ngang, căn lề sạch sẽ) hoàn toàn trên trình duyệt, không tải ảnh lên máy chủ.",
    badge: "Ảnh → PDF A4",
    category: "code-van-phong",
    categoryLabel: "Tin học & Văn phòng",
    keywords: [
      "chuyển ảnh sang pdf online miễn phí",
      "ghép nhiều ảnh jpg png thành pdf a4",
      "nộp bài tập ảnh chụp thành pdf",
      "image to pdf không giới hạn không watermark",
    ],
  },
  {
    slug: "tinh-phan-tram-doc-so-thanh-chu",
    title: "Máy tính Phần trăm (%) Nhanh & Đọc Số Tiền Thành Chữ Tiếng Việt",
    shortTitle: "Tính % & Đọc số thành chữ",
    description:
      "Tính nhanh X% của Y, X chiếm bao nhiêu % của Y, % tăng giảm và chuyển đổi tức thì các con số hàng tỷ/nghìn tỷ thành chữ tiếng Việt chuẩn dấu phẩy để viết hóa đơn, báo cáo, bài giảng.",
    badge: "Tính % • Đọc số VN",
    category: "code-van-phong",
    categoryLabel: "Tin học & Văn phòng",
    keywords: [
      "tính phần trăm online",
      "đọc số thành chữ tiếng việt",
      "cách tính phần trăm tăng giảm",
      "chuyển số tiền thành chữ viết hóa đơn",
    ],
  },
  {
    slug: "chuyen-bang-excel-sang-markdown-html-latex",
    title: "Chuyển Bảng Excel / Google Sheets sang Markdown, HTML & LaTeX",
    shortTitle: "Excel → Markdown / HTML / LaTeX",
    description:
      "Dán trực tiếp vùng dữ liệu copy từ Excel, Google Sheets hoặc CSV để chuyển đổi tức thì thành bảng Markdown, thẻ HTML <table> hoặc bảng LaTeX dùng cho báo cáo khoa học và tài liệu học tập.",
    badge: "Excel → MD/HTML/TeX",
    category: "code-van-phong",
    categoryLabel: "Tin học & Văn phòng",
    keywords: [
      "chuyển bảng excel sang markdown",
      "excel sang html table online",
      "tạo bảng latex từ excel",
      "chuyển csv sang markdown table",
    ],
  },
  {
    slug: "soan-thao-markdown-xuat-pdf-a4",
    title: "Trình Soạn thảo Markdown Trực tiếp (Live Preview) & In PDF A4",
    shortTitle: "Soạn Markdown & Xuất PDF",
    description:
      "Soạn thảo tài liệu học tập, đề cương ôn thi bằng Markdown song song với khung xem trước trực tiếp (GFM bảng, checklist, code block), tải file .md hoặc in PDF A4 sạch sẽ 1-click.",
    badge: "Markdown + PDF A4",
    category: "code-van-phong",
    categoryLabel: "Tin học & Văn phòng",
    keywords: [
      "soạn thảo markdown online",
      "markdown live preview tiếng việt",
      "chuyển markdown sang pdf a4",
      "trình viết ghi chú học tập markdown",
    ],
  },
  {
    slug: "tinh-khoang-cach-ngay-tuoi-lich-on-thi",
    title: "Tính Khoảng cách Ngày, Ngày làm việc & Đếm ngày đến Mục tiêu",
    shortTitle: "Tính khoảng cách ngày & Tuổi",
    description:
      "Tính chính xác số ngày, tuần, tháng và số ngày làm việc (trừ Thứ 7, Chủ nhật) giữa hai mốc thời gian; cộng/trừ ngày lập tiến độ ôn thi và tính tuổi chi tiết theo ngày sinh.",
    badge: "Date & Countdown",
    category: "on-thi",
    categoryLabel: "Lập kế hoạch ôn thi",
    keywords: [
      "tính khoảng cách giữa hai ngày online",
      "đếm số ngày làm việc trừ cuối tuần",
      "công cụ tính tuổi chính xác theo ngày sinh",
      "cộng trừ ngày lập kế hoạch ôn thi",
    ],
  },

  // Cluster C: Academic, STEM & Teacher Practice Tools
  {
    slug: "chuyen-doi-don-vi-vat-ly-hoa-hoc-tin-hoc",
    title: "Chuyển đổi Đơn vị Chuẩn SI (Vật lý, Hóa học & Tin học) Đầy đủ",
    shortTitle: "Đổi đơn vị Lý • Hóa • Tin",
    description:
      "Chuyển đổi tức thì cùng lúc mọi đơn vị thường gặp trong đề thi Vật lý, Hóa học và Tin học: Áp suất (atm, mmHg, bar, Pa), Nhiệt độ (°C, K, °F), Năng lượng (J, cal, eV, kWh), Tốc độ, Dữ liệu (bit, Byte, KiB, GB), Bước sóng và Khối lượng nguyên tử.",
    badge: "SI Lý • Hóa • Tin",
    category: "hoc-tap-stem",
    categoryLabel: "Học tập & STEM",
    keywords: [
      "chuyển đổi đơn vị vật lý hóa học online",
      "đổi đơn vị áp suất atm mmhg pa bar",
      "đổi đơn vị dữ liệu bit byte kb kib mb gb",
      "đổi độ c sang kelvin eV sang joule",
    ],
  },
  {
    slug: "tinh-xac-suat-to-hop-thong-ke-thpt",
    title: "Tính Hoán vị, Chỉnh hợp, Tổ hợp & Thống kê Tứ phân vị (Toán 10–12)",
    shortTitle: "Tổ hợp & Thống kê Tứ phân vị",
    description:
      "Tính chính xác số lớn Pn, Ank, Cnk, hệ số Nhị thức Newton và phân tích toàn bộ mẫu số liệu chuẩn Toán 10–12 GDPT 2018: Số trung bình, Trung vị, Mốt, Tứ phân vị Q1–Q2–Q3, khoảng tứ phân vị, giá trị ngoại lệ, phương sai và độ lệch chuẩn.",
    badge: "Toán 10–12 GDPT 2018",
    category: "hoc-tap-stem",
    categoryLabel: "Học tập & STEM",
    keywords: [
      "tính tổ hợp chỉnh hợp hoán vị online",
      "tính tứ phân vị q1 q2 q3 online",
      "tính phương sai độ lệch chuẩn mẫu số liệu",
      "tìm giá trị ngoại lệ outlier thống kê toán 10 12",
    ],
  },
  {
    slug: "tao-thoi-khoa-bieu-lich-hoc-tuan-in-a4",
    title: "Tạo Thời khóa biểu & Lịch Ôn thi Tuần Tự động (In A4 / Tải PNG)",
    shortTitle: "Tạo Thời khóa biểu & Lịch tuần",
    description:
      "Thiết kế Thời khóa biểu 7 ngày (Thứ 2 – Chủ nhật) theo ca Sáng/Chiều/Tối với mẫu sẵn cho học sinh THPT & sinh viên Đại học, gắn nhãn màu môn học, lưu cục bộ trên máy, xuất ảnh PNG sắc nét hoặc in A4.",
    badge: "Xuất PNG • In A4",
    category: "on-thi",
    categoryLabel: "Lập kế hoạch ôn thi",
    keywords: [
      "tạo thời khóa biểu online miễn phí",
      "mẫu thời khóa biểu tuần in a4",
      "lập lịch ôn thi đại học theo tuần",
      "tải ảnh thời khóa biểu đẹp png",
    ],
  },
  {
    slug: "tao-phieu-bai-tap-toan-tu-luan-in-pdf",
    title: "Tạo Phiếu Bài tập Toán Rèn Kỹ năng Tính toán In A4 (Kèm Đáp án)",
    shortTitle: "Tạo phiếu bài tập Toán A4",
    description:
      "Sinh ngẫu nhiên có kiểm soát 10–40 bài tập Toán tự luận theo 5 chuyên đề (Số nguyên, Phân số tối giản, Tìm x, Phương trình bậc hai, Hệ phương trình nghiệm nguyên đẹp), tùy chỉnh tiêu đề lớp và in A4 kèm bảng đáp án.",
    badge: "Phiếu Toán + Đáp án",
    category: "giao-vien",
    categoryLabel: "Công cụ Giáo viên",
    keywords: [
      "tạo phiếu bài tập toán in pdf a4",
      "sinh bài tập toán tự luận có đáp án",
      "phiếu luyện tập số nguyên phân số phương trình",
      "công cụ ra bài tập toán cho giáo viên",
    ],
  },
  {
    slug: "tao-bai-tap-dien-tu-cloze-test-tieng-anh",
    title: "Tạo Bài tập Điền từ Tiếng Anh (Cloze Test / Gap-Fill) Từ Đoạn Văn",
    shortTitle: "Tạo bài tập Cloze Test Anh",
    description:
      "Dán đoạn văn Tiếng Anh bất kỳ để tự động đục lỗ (ẩn giới từ, liên từ, mạo từ, mỗi từ thứ N hoặc bấm trực tiếp chọn từ cần ẩn), tạo khung Word Bank xáo trộn và bảng Đáp án chuẩn in A4 / copy sang Word.",
    badge: "Cloze Test • Word Bank",
    category: "giao-vien",
    categoryLabel: "Công cụ Giáo viên",
    keywords: [
      "tạo bài tập điền từ tiếng anh online",
      "công cụ tạo cloze test gap fill miễn phí",
      "tạo đề đọc điền từ thpt tiếng anh",
      "tạo word bank bài tập tiếng anh cho giáo viên",
    ],
  },

  // Wave 7 (5 new Informatics & Cybersecurity tools -> total 55)
  {
    slug: "chay-code-python-online-tin-hoc-10",
    title: "Chạy Code Python Online & Thực hành Thuật toán Tin học 10 (Trên Trình duyệt)",
    shortTitle: "Chạy Code Python Online (Tin 10)",
    description:
      "Trình chạy Python 3 an toàn 100% trên trình duyệt dành cho học sinh Tin học 10 GDPT 2018: hỗ trợ biến, vòng lặp for/while, hàm đệ quy, list comprehension, bảng theo dõi biến trực quan và 8 bài mẫu SGK.",
    badge: "Python 3 • Tin học 10",
    category: "code-van-phong",
    categoryLabel: "Tin học & Văn phòng",
    keywords: [
      "chạy code python online miễn phí",
      "thực hành python tin học 10 gdpt 2018",
      "trình biên dịch python trên trình duyệt",
      "học lập trình python cơ bản online",
      "bài tập thuật toán python lớp 10",
    ],
  },
  {
    slug: "giai-ma-jwt-base64-url-online",
    title: "Giải mã JWT Token (Header/Payload/HS256), Base64 UTF-8 & URL Encode/Decode",
    shortTitle: "Giải mã JWT, Base64 & URL",
    description:
      "Phân tích tức thì JWT (JSON Web Token) tách phần Header, Payload, kiểm tra thời hạn exp/iat, xác thực chữ ký HMAC-SHA256 bằng Web Crypto và mã hóa/giải mã Base64 UTF-8 tiếng Việt, URL Percent-Encoding.",
    badge: "JWT • Base64 • URL",
    category: "code-van-phong",
    categoryLabel: "Tin học & Văn phòng",
    keywords: [
      "giải mã jwt token online",
      "kiểm tra chữ ký jwt hs256",
      "mã hóa giải mã base64 utf8 tiếng việt",
      "url encode decode online",
      "jwt debugger client side",
    ],
  },
  {
    slug: "thuat-toan-ma-hoa-bam-sha256-aes-rsa",
    title: "Thuật toán Mã hóa & Băm Mật mã học (SHA-256, MD5, AES-256, RSA & Caesar)",
    shortTitle: "Mã hóa & Băm SHA-256 / AES / RSA",
    description:
      "Thực hành mật mã học và An toàn thông tin trực tiếp trên trình duyệt: tính hàm băm MD5, SHA-1, SHA-256, SHA-512, HMAC; mã hóa đối xứng AES-256-GCM; mô phỏng từng bước toán học RSA (p, q, e, d) và mật mã Caesar/Vigenère.",
    badge: "SHA-256 • AES • RSA",
    category: "code-van-phong",
    categoryLabel: "Tin học & Văn phòng",
    keywords: [
      "tính mã băm sha256 md5 online",
      "mã hóa giải mã aes 256 gcm",
      "mô phỏng thuật toán rsa từng bước",
      "mật mã caesar vigenere online",
      "thực hành an toàn thông tin sinh viên it",
    ],
  },
  {
    slug: "mo-phong-thuat-toan-sap-xep-tim-kiem",
    title: "Mô phỏng Thuật toán Sắp xếp & Tìm kiếm Trực quan (Tin học 11 — Python & C++)",
    shortTitle: "Mô phỏng Thuật toán Sắp xếp & Tìm kiếm",
    description:
      "Trực quan hóa từng bước 6 thuật toán cốt lõi Tin học 11 GDPT 2018: Bubble Sort, Selection Sort, Insertion Sort, Quick Sort, Linear Search và Binary Search kèm bộ đếm so sánh/hoán đổi, độ phức tạp O(n) và code mẫu Python/C++.",
    badge: "Thuật toán Tin 11",
    category: "code-van-phong",
    categoryLabel: "Tin học & Văn phòng",
    keywords: [
      "mô phỏng thuật toán sắp xếp trực quan",
      "bubble sort selection sort insertion sort quick sort",
      "tìm kiếm nhị phân tuần tự tin học 11",
      "trực quan hóa thuật toán sorting visualizer",
      "code mẫu sắp xếp python c++",
    ],
  },
  {
    slug: "tao-mat-khau-manh-kiem-tra-entropy",
    title: "Tạo Mật khẩu Mạnh (Web Crypto) & Kiểm tra Độ An toàn Entropy (Bit)",
    shortTitle: "Tạo Mật khẩu & Đo Entropy (Bit)",
    description:
      "Sinh mật khẩu ngẫu nhiên chuẩn mật mã học Web Crypto (CSPRNG) và cụm từ khóa Diceware dễ nhớ, đo chính xác số bit Entropy, phát hiện mẫu yếu và ước tính thời gian bẻ khóa brute-force theo tốc độ GPU/Bcrypt.",
    badge: "CSPRNG • Entropy Bit",
    category: "code-van-phong",
    categoryLabel: "Tin học & Văn phòng",
    keywords: [
      "tạo mật khẩu mạnh ngẫu nhiên web crypto",
      "kiểm tra độ mạnh mật khẩu entropy bit",
      "tạo passphrase dễ nhớ an toàn",
      "ước tính thời gian bẻ khóa mật khẩu",
      "bảo mật thông tin cá nhân",
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
