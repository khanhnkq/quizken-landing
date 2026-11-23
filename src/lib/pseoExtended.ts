import type { PseoQuestion } from "./pSEO";

export type ExtendedExamHubKey = "dgnl" | "dai-hoc" | "vao-10" | "chung-chi";

export interface ExamStructureRow {
  part: string;
  content: string;
  questionCount: string;
  scoreWeight: string;
}

export interface ExamFaqItem {
  q: string;
  a: string;
}

export interface ExtendedExamToolLink {
  label: string;
  href: string;
}

export interface ExtendedExamEntry {
  slug: string;
  hub: ExtendedExamHubKey;
  name: string;
  shortName: string;
  badge: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  description: string;
  duration: string;
  maxScore: string;
  totalQuestionsLabel: string;
  formatLabel: string;
  targetAudience: string;
  topics: string[];
  universities?: string[];
  structure: ExamStructureRow[];
  questions: PseoQuestion[];
  faqs: ExamFaqItem[];
  relatedTools: ExtendedExamToolLink[];
}

export interface ExtendedExamHubMeta {
  key: ExtendedExamHubKey;
  path: string;
  title: string;
  shortTitle: string;
  badge: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
}

export const EXTENDED_HUBS: Record<ExtendedExamHubKey, ExtendedExamHubMeta> = {
  dgnl: {
    key: "dgnl",
    path: "/de-thi/dgnl",
    title: "Đề Thi Đánh Giá Năng Lực & Tư Duy 2027 (HSA, V-ACT, TSA, SPT, V-SAT)",
    shortTitle: "Đánh Giá Năng Lực 2027",
    badge: "ĐGNL & ĐGTD 2027",
    description:
      "Tổng hợp cấu trúc ma trận mới nhất 2027 và bộ đề luyện thi thử Đánh giá năng lực ĐHQG Hà Nội (HSA), ĐHQG TP.HCM (V-ACT), Đánh giá tư duy Bách khoa (TSA), ĐH Sư phạm (SPT) và V-SAT có chấm điểm & giải thích chi tiết.",
    seoTitle: "Bộ Đề Thi Đánh Giá Năng Lực 2027 (HSA, V-ACT, TSA, SPT, V-SAT) Có Đáp Án",
    seoDescription:
      "Luyện đề thi Đánh giá năng lực 2027 chuẩn ma trận HSA ĐHQG Hà Nội, V-ACT ĐHQG TP.HCM, TSA Bách Khoa, SPT Sư Phạm và V-SAT kèm bài tập tương tác và giải thích chi tiết.",
    keywords: [
      "đề thi đánh giá năng lực 2027",
      "đề thi hsa đhqg hà nội",
      "đề thi v-act đhqg tphcm",
      "đề thi tsa bách khoa",
      "đề thi spt sư phạm",
      "đề thi v-sat",
    ],
  },
  "dai-hoc": {
    key: "dai-hoc",
    path: "/de-thi/dai-hoc",
    title: "Đề Thi Trắc Nghiệm Các Môn Đại Cương Đại Học Có Đáp Án",
    shortTitle: "Môn Đại Cương Đại Học",
    badge: "Đại học • Tín chỉ",
    description:
      "Ngân hàng câu hỏi ôn thi giữa kỳ và cuối kỳ các môn đại cương phổ biến tại NEU, VNU, UEH, HUST, AOF, HUBT, FPT: Triết học Mác-Lênin, Kinh tế chính trị, Pháp luật đại cương, Tư tưởng HCM, Lịch sử Đảng, CNXHKH, Xác suất thống kê, Kinh tế vi mô.",
    seoTitle: "Ngân Hàng Đề Thi Môn Đại Cương Đại Học Có Đáp Án Chi Tiết",
    seoDescription:
      "Ôn thi trắc nghiệm các môn đại cương Đại học (Triết học Mác-Lênin, Kinh tế chính trị, Pháp luật đại cương, Xác suất thống kê, Kinh tế vi mô) cho sinh viên NEU, VNU, UEH, HUST, FPT.",
    keywords: [
      "đề thi môn đại cương đại học",
      "trắc nghiệm triết học mác lênin",
      "trắc nghiệm kinh tế chính trị",
      "trắc nghiệm pháp luật đại cương",
      "trắc nghiệm tư tưởng hồ chí minh",
      "trắc nghiệm xác suất thống kê",
    ],
  },
  "vao-10": {
    key: "vao-10",
    path: "/de-thi/vao-10",
    title: "Đề Thi Tuyển Sinh Vào Lớp 10 (Toán, Văn, Anh, Hà Nội & TP.HCM)",
    shortTitle: "Tuyển Sinh Vào Lớp 10",
    badge: "Lớp 9 → Lớp 10",
    description:
      "Tuyển tập đề thi thử tuyển sinh vào lớp 10 bám sát chương trình GDPT 2018 và cấu trúc sở GD&ĐT Hà Nội, TP.HCM cùng chuyên đề Toán, Tiếng Anh, Ngữ văn kèm đáp án chuẩn.",
    seoTitle: "Bộ Đề Thi Tuyển Sinh Vào Lớp 10 Có Đáp Án (Toán, Anh, Văn, Hà Nội, TP.HCM)",
    seoDescription:
      "Luyện đề thi tuyển sinh vào lớp 10 chuẩn cấu trúc mới: Toán vào 10, Tiếng Anh vào 10, Ngữ văn vào 10, đề thi thử Sở GD&ĐT Hà Nội và TP.HCM có lời giải chi tiết.",
    keywords: [
      "đề thi vào lớp 10",
      "đề thi toán vào 10",
      "đề thi tiếng anh vào 10",
      "đề thi vào 10 hà nội",
      "đề thi vào 10 tphcm",
    ],
  },
  "chung-chi": {
    key: "chung-chi",
    path: "/de-thi/chung-chi",
    title: "Đề Thi Thử Chứng Chỉ Ngoại Ngữ, Tin Học, GPLX & Công Chức",
    shortTitle: "Chứng Chỉ & Nghề Nghiệp",
    badge: "Chứng chỉ Quốc tế & Quốc gia",
    description:
      "Luyện thi trắc nghiệm online miễn phí cho các chứng chỉ phổ biến nhất: TOEIC, VSTEP B1-B2, HSK, JLPT, Digital SAT, 600 câu lý thuyết GPLX, Tin học văn phòng MOS/CNTT và Thi công chức.",
    seoTitle: "Đề Thi Thử Chứng Chỉ TOEIC, VSTEP, HSK, JLPT, SAT, 600 Câu GPLX & Công Chức",
    seoDescription:
      "Kho đề luyện thi trắc nghiệm online cho chứng chỉ ngoại ngữ (TOEIC, VSTEP, HSK, JLPT, Digital SAT), 600 câu GPLX, Tin học MOS/CNTT và kiến thức chung thi công chức.",
    keywords: [
      "đề thi thử toeic",
      "đề thi vstep b1 b2",
      "luyện thi hsk",
      "luyện thi jlpt",
      "đề thi digital sat",
      "600 câu gplx",
      "thi công chức trắc nghiệm",
    ],
  },
};

/* ============================================================================
 * 1. ĐÁNH GIÁ NĂNG LỰC 2027 (5 PAGES)
 * ========================================================================== */
export const DGNL_EXAMS: ExtendedExamEntry[] = [
  {
    slug: "hsa-dhqg-ha-noi",
    hub: "dgnl",
    name: "Đánh Giá Năng Lực ĐHQG Hà Nội (HSA) 2027",
    shortName: "HSA ĐHQG Hà Nội",
    badge: "ĐHQG Hà Nội • Thang 150",
    seoTitle: "Đề Thi Đánh Giá Năng Lực HSA ĐHQG Hà Nội 2027 Có Đáp Án Chi Tiết",
    seoDescription:
      "Cấu trúc đề thi ĐGNL HSA ĐHQG Hà Nội 2027 (150 điểm, 195 phút): Toán học & Xử lý số liệu, Ngôn ngữ - Văn học và phần Tự chọn Khoa học/Tiếng Anh kèm câu hỏi luyện tập có đáp án.",
    keywords: [
      "đề thi hsa 2027",
      "đánh giá năng lực đhqg hà nội",
      "cấu trúc đề thi hsa",
      "ôn thi hsa miễn phí",
    ],
    description:
      "Kỳ thi Đánh giá năng lực (HSA) do Trung tâm Khảo thí ĐHQG Hà Nội tổ chức trên máy tính, đánh giá toàn diện năng lực Toán học & Xử lý số liệu, Ngôn ngữ - Văn học cùng phần thi tự chọn Khoa học hoặc Tiếng Anh theo chương trình GDPT 2018.",
    duration: "195 phút (3 phần)",
    maxScore: "150 điểm",
    totalQuestionsLabel: "150 câu (kèm câu thử nghiệm không tính điểm)",
    formatLabel: "Thi trên máy tính (MCQ 4 lựa chọn + Điền đáp án ngắn)",
    targetAudience: "Học sinh lớp 12 xét tuyển ĐHQG Hà Nội & hơn 90 trường ĐH",
    topics: [
      "Toán học & Xử lý số liệu (50 câu — 75 phút)",
      "Ngôn ngữ - Văn học (50 câu — 60 phút)",
      "Tự chọn 1: Khoa học Lý, Hóa, Sinh, Sử, Địa (50 câu — 60 phút)",
      "Tự chọn 2: Tiếng Anh học thuật & Đọc hiểu (50 câu — 60 phút)",
      "Kỹ năng phân tích bảng biểu, suy luận logic & câu hỏi điền số",
    ],
    structure: [
      {
        part: "Phần 1: Tư duy định lượng",
        content: "Toán học và Xử lý số liệu (Đại số, Giải tích, Hình học, Thống kê)",
        questionCount: "50 câu (35 MCQ + 15 điền đáp án)",
        scoreWeight: "50 điểm (75 phút)",
      },
      {
        part: "Phần 2: Tư duy định tính",
        content: "Ngôn ngữ - Văn học (Ngữ văn, đọc hiểu văn bản, dùng từ, logic ngôn ngữ)",
        questionCount: "50 câu MCQ",
        scoreWeight: "50 điểm (60 phút)",
      },
      {
        part: "Phần 3: Tự chọn",
        content: "Chọn 1 trong 2: Khoa học (3 chủ đề Lý/Hóa/Sinh/Sử/Địa) hoặc Tiếng Anh",
        questionCount: "50 câu MCQ / điền đáp án",
        scoreWeight: "50 điểm (60 phút)",
      },
    ],
    questions: [
      {
        id: "hsa-q1",
        part: 1,
        question:
          "[Tư duy định lượng] Một hộp chứa 5 bi xanh và 7 bi đỏ. Lấy ngẫu nhiên đồng thời 3 bi từ hộp. Xác suất để 3 bi lấy ra có ít nhất 2 bi xanh là bao nhiêu?",
        options: ["3/11", "4/11", "17/44", "5/22"],
        answer: 1,
        explanation:
          "Số cách chọn 3 bi bất kỳ là C(12,3) = 220. Số cách chọn ít nhất 2 bi xanh = C(5,2)·C(7,1) + C(5,3) = 10·7 + 10 = 80. Xác suất = 80/220 = 4/11.",
      },
      {
        id: "hsa-q2",
        part: 1,
        question:
          "[Ngôn ngữ - Văn học] Chọn từ viết ĐÚNG chính tả và phù hợp ngữ cảnh trong câu sau: 'Trước những biến động của thị trường, ban lãnh đạo cần giữ thái độ _____ để đưa ra quyết sách sáng suốt.'",
        options: ["điềm tĩnh", "điềm tỉnh", "đềm tĩnh", "điểm tĩnh"],
        answer: 0,
        explanation:
          "'Điềm tĩnh' (thanh huyền + thanh ngã) là từ láy/ghép chuẩn chính tả tiếng Việt chỉ sự bình tĩnh, chín chắn trước tình huống khó khăn.",
      },
      {
        id: "hsa-q3",
        part: 3,
        question:
          "[Điền đáp án HSA] Cho hàm số f(x) = x^3 - 3x^2 - 9x + 5. Giá trị cực tiểu của hàm số f(x) trên tập số thực R bằng bao nhiêu?",
        answer: "-22",
        acceptedAnswers: ["-22", "-22.0", "-22,0"],
        explanation:
          "Đạo hàm f'(x) = 3x^2 - 6x - 9 = 0 <=> x = -1 hoặc x = 3. Xét dấu f'(x): đổi dấu từ âm sang dương qua x = 3 nên hàm số đạt cực tiểu tại x = 3. Giá trị cực tiểu f(3) = 27 - 27 - 27 + 5 = -22.",
      },
    ],
    faqs: [
      {
        q: "Cấu trúc bài thi HSA ĐHQG Hà Nội năm 2027 có điểm nào đáng chú ý?",
        a: "Bài thi HSA gồm 3 phần với tổng thời gian 195 phút, tổng điểm tối đa 150 điểm. Điểm mới theo GDPT 2018 là Phần 3 cho phép thí sinh chọn tổ hợp Khoa học (chọn 3 trong 5 môn Lý, Hóa, Sinh, Sử, Địa) hoặc chọn Tiếng Anh tùy theo tổ hợp xét tuyển ngành.",
      },
      {
        q: "Một thí sinh được thi HSA tối đa mấy lượt mỗi năm?",
        a: "Thí sinh thường được đăng ký tối đa 2 lượt thi HSA trong một năm và khoảng cách giữa hai lượt thi liên tiếp tối thiểu 28 ngày. Thí sinh được sử dụng kết quả lượt thi cao nhất để xét tuyển.",
      },
      {
        q: "Điểm HSA bao nhiêu thì có cơ hội đỗ các ngành top ĐHQG Hà Nội?",
        a: "Với thang điểm 150, mức điểm từ 95–110+ thường có lợi thế cạnh tranh cao vào các ngành hot của ĐH Công nghệ (UET), ĐH Kinh tế (UEB), ĐH Ngoại ngữ (ULIS) hoặc ĐH Kinh tế Quốc dân (NEU).",
      },
    ],
    relatedTools: [
      { label: "Quy đổi điểm HSA ↔ THPT 2027", href: "/cong-cu/quy-doi-diem-ielts-dgnl-2027" },
      { label: "Đếm ngược ngày thi ĐGNL 2027", href: "/cong-cu/dem-nguoc-ngay-thi-2027" },
    ],
  },
  {
    slug: "v-act-dhqg-tphcm",
    hub: "dgnl",
    name: "Đánh Giá Năng Lực ĐHQG TP.HCM (V-ACT) 2027",
    shortName: "V-ACT ĐHQG TP.HCM",
    badge: "ĐHQG TP.HCM • Thang 1200",
    seoTitle: "Đề Thi Đánh Giá Năng Lực V-ACT ĐHQG TP.HCM 2027 Có Đáp Án",
    seoDescription:
      "Luyện đề thi ĐGNL ĐHQG TP.HCM (V-ACT) chuẩn cấu trúc mới 120 câu trắc nghiệm (150 phút, thang 1200 điểm): Sử dụng ngôn ngữ, Toán học, Tư duy khoa học & Suy luận logic.",
    keywords: [
      "đề thi v-act 2027",
      "đánh giá năng lực đhqg tphcm",
      "cấu trúc đề thi đgnl hcm",
      "luyện thi v-act",
    ],
    description:
      "Kỳ thi Đánh giá năng lực ĐHQG TP.HCM (V-ACT) thi trên giấy trong 150 phút với 120 câu hỏi trắc nghiệm khách quan, sử dụng kết quả xét tuyển tại hơn 100 trường đại học khu vực phía Nam và cả nước.",
    duration: "150 phút",
    maxScore: "1.200 điểm",
    totalQuestionsLabel: "120 câu trắc nghiệm khách quan 4 lựa chọn",
    formatLabel: "Thi trên giấy (chấm theo lý thuyết ứng đáp câu hỏi IRT)",
    targetAudience: "Thí sinh xét tuyển ĐH Bách Khoa, KHTN, KHXH&NV, CNTT, Kinh tế - Luật...",
    topics: [
      "Phần 1: Sử dụng ngôn ngữ (Tiếng Việt 30 câu + Tiếng Anh 30 câu)",
      "Phần 2: Toán học (30 câu Tư duy & Giải quyết vấn đề)",
      "Phần 3: Tư duy khoa học (Logic - Phân tích số liệu 12 câu + Suy luận khoa học 18 câu)",
      "Đọc hiểu ngữ liệu khoa học xã hội & tự nhiên tích hợp",
    ],
    structure: [
      {
        part: "Phần 1: Sử dụng ngôn ngữ",
        content: "Tiếng Việt (30 câu) & Tiếng Anh (30 câu)",
        questionCount: "60 câu",
        scoreWeight: "600 điểm",
      },
      {
        part: "Phần 2: Toán học",
        content: "Toán ứng dụng, hàm số, xác suất, hình học & bài toán thực tế",
        questionCount: "30 câu",
        scoreWeight: "300 điểm",
      },
      {
        part: "Phần 3: Tư duy khoa học",
        content: "Logic, phân tích số liệu (12 câu) & Suy luận khoa học đa lĩnh vực (18 câu)",
        questionCount: "30 câu",
        scoreWeight: "300 điểm",
      },
    ],
    questions: [
      {
        id: "vact-q1",
        part: 1,
        question:
          "[Logic - V-ACT] Trong một cuộc thi chạy có 5 vận động viên A, B, C, D, E về đích ở 5 thứ hạng khác nhau. Biết: A về trước B; C về ngay sau D; E về ngay sau A; B về trước D. Thứ tự về đích từ nhất đến năm là:",
        options: [
          "A - E - B - D - C",
          "A - B - E - D - C",
          "E - A - B - D - C",
          "A - B - D - C - E",
        ],
        answer: 0,
        explanation:
          "Vì E về ngay sau A ta có cặp (A, E); vì C về ngay sau D ta có cặp (D, C). Kết hợp A về trước B và B về trước D, thứ tự duy nhất thỏa mãn là: A - E - B - D - C.",
      },
      {
        id: "vact-q2",
        part: 1,
        question:
          "[Tiếng Anh - V-ACT] Mark the letter A, B, C, or D to indicate the underlined part that needs correction:\n'Neither the students nor their homeroom teacher were informed about the sudden schedule change yesterday.'",
        options: ["Neither", "were", "about", "change"],
        answer: 1,
        explanation:
          "Với cấu trúc 'Neither S1 nor S2', động từ chia theo chủ ngữ gần nhất (S2 = 'their homeroom teacher' - số ít). Vì vậy 'were' phải sửa thành 'was'.",
      },
      {
        id: "vact-q3",
        part: 1,
        question:
          "[Toán học - V-ACT] Một công ty giảm giá sản phẩm 20% vào dịp lễ, sau đó tiếp tục giảm thêm 10% trên giá đã giảm. Tổng cộng sản phẩm đã được giảm bao nhiêu phần trăm so với giá ban đầu?",
        options: ["30%", "28%", "25%", "32%"],
        answer: 1,
        explanation:
          "Giá sau giảm lần 1 còn 80% = 0,8 lần giá gốc. Giảm thêm 10% trên 0,8 còn 0,8 × 0,9 = 0,72 = 72% giá gốc. Vậy tổng mức giảm là 100% - 72% = 28%.",
      },
    ],
    faqs: [
      {
        q: "Cấu trúc V-ACT từ năm 2025–2027 thay đổi thế nào ở Phần 3?",
        a: "Phần 3 chuyển thành 'Tư duy khoa học' (30 câu) thay cho phần Giải quyết vấn đề cũ, tập trung vào Logic - Phân tích số liệu và Suy luận khoa học dựa trên ngữ liệu cung cấp sẵn, giúp thí sinh không học tủ vẫn suy luận được.",
      },
      {
        q: "Cách tính điểm theo lý thuyết IRT trong V-ACT có nghĩa là gì?",
        a: "Mỗi câu hỏi trong bài thi V-ACT có trọng số độ khó khác nhau tùy vào tỷ lệ thí sinh trả lời đúng. Vì vậy không nên bỏ trống câu nào (không bị trừ điểm câu sai) và ưu tiên làm chắc các câu dễ đến trung bình.",
      },
      {
        q: "Nên thi V-ACT Đợt 1 hay Đợt 2 năm 2027?",
        a: "Thí sinh nên thi cả hai đợt (thường vào cuối tháng 3 và cuối tháng 5) để làm quen áp lực phòng thi ở Đợt 1 và tối ưu điểm số ở Đợt 2.",
      },
    ],
    relatedTools: [
      { label: "Quy đổi điểm V-ACT ↔ Thang 30", href: "/cong-cu/quy-doi-diem-ielts-dgnl-2027" },
      { label: "Đếm ngược V-ACT Đợt 1 & 2", href: "/cong-cu/dem-nguoc-ngay-thi-2027" },
    ],
  },
  {
    slug: "tsa-bach-khoa",
    hub: "dgnl",
    name: "Đánh Giá Tư Duy ĐH Bách Khoa Hà Nội (TSA) 2027",
    shortName: "TSA Bách Khoa",
    badge: "ĐH Bách Khoa HN • Thang 100",
    seoTitle: "Đề Thi Đánh Giá Tư Duy TSA Bách Khoa Hà Nội 2027 Có Đáp Án",
    seoDescription:
      "Ôn thi Đánh giá tư duy TSA ĐH Bách Khoa Hà Nội (150 phút, thang 100 điểm) gồm 3 phần: Tư duy Toán học, Tư duy Đọc hiểu và Tư duy Khoa học / Giải quyết vấn đề.",
    keywords: [
      "đề thi tsa bách khoa 2027",
      "đánh giá tư duy bách khoa hà nội",
      "cấu trúc đề thi tsa",
      "ôn thi tsa",
    ],
    description:
      "Bài thi Đánh giá tư duy (TSA) của Đại học Bách Khoa Hà Nội kiểm tra 3 năng lực cốt lõi: Tư duy Toán học, Tư duy Đọc hiểu và Tư duy Khoa học / Giải quyết vấn đề với nhiều dạng câu hỏi kéo thả, đúng/sai, điền đáp án hiện đại trên máy tính.",
    duration: "150 phút",
    maxScore: "100 điểm",
    totalQuestionsLabel: "100 câu (40 Toán + 20 Đọc hiểu + 40 Khoa học)",
    formatLabel: "Thi trên máy tính (Trắc nghiệm, Đúng/Sai, Kéo thả, Điền đáp án)",
    targetAudience: "Thí sinh xét tuyển khối Kỹ thuật, CNTT, Bán dẫn, Kinh tế kỹ thuật (HUST & ~40 trường)",
    topics: [
      "Tư duy Toán học (60 phút — 40 câu)",
      "Tư duy Đọc hiểu văn bản khoa học/báo chí (30 phút — 20 câu)",
      "Tư duy Khoa học / Giải quyết vấn đề (60 phút — 40 câu)",
      "Kỹ năng xử lý dạng bài kéo thả & điền số nhanh trên máy",
    ],
    structure: [
      {
        part: "Phần 1: Tư duy Toán học",
        content: "Mô hình hóa toán học, suy luận logic, ước lượng, xác suất & tối ưu",
        questionCount: "40 câu",
        scoreWeight: "40 điểm (60 phút)",
      },
      {
        part: "Phần 2: Tư duy Đọc hiểu",
        content: "Đọc hiểu văn bản KHTN, công nghệ, kinh tế - xã hội",
        questionCount: "20 câu",
        scoreWeight: "20 điểm (30 phút)",
      },
      {
        part: "Phần 3: Tư duy Khoa học",
        content: "Đọc dữ liệu thí nghiệm, đồ thị vật lý - hóa học - sinh học - công nghệ",
        questionCount: "40 câu",
        scoreWeight: "40 điểm (60 phút)",
      },
    ],
    questions: [
      {
        id: "tsa-q1",
        part: 1,
        question:
          "[Tư duy Toán học - TSA] Một cảm biến nhiệt độ ghi nhận nhiệt độ T(t) (°C) theo thời gian t (giờ) tuân theo hàm T(t) = 24 + 6*sin(πt/12) với 0 ≤ t ≤ 24. Trong khoảng thời gian này, nhiệt độ đạt cực đại bằng bao nhiêu °C?",
        options: ["24°C", "30°C", "28°C", "32°C"],
        answer: 1,
        explanation:
          "Vì sin(πt/12) đạt giá trị lớn nhất bằng 1 khi πt/12 = π/2 (tức t = 6 giờ), nên nhiệt độ cực đại T_max = 24 + 6×1 = 30°C.",
      },
      {
        id: "tsa-q2",
        part: 2,
        context:
          "[Tư duy Đọc hiểu - TSA] Đọc nhận định về công nghệ bán dẫn: 'Việc thu nhỏ kích thước bóng bán dẫn xuống tiến trình 2nm giúp tăng mật độ linh kiện và giảm điện năng tiêu thụ, nhưng đồng thời làm gia tăng hiệu ứng đường hầm lượng tử gây rò rỉ dòng điện.' Xét tính đúng/sai:",
        subQuestions: [
          {
            id: "tsa-q2-a",
            text: "Tiến trình 2nm cho phép đóng gói nhiều bóng bán dẫn hơn trên cùng diện tích chip.",
            isCorrect: true,
            explanation: "Đoạn văn nêu rõ 'giúp tăng mật độ linh kiện'.",
          },
          {
            id: "tsa-q2-b",
            text: "Thu nhỏ kích thước xuống 2nm hoàn toàn loại bỏ hiện tượng rò rỉ dòng điện.",
            isCorrect: false,
            explanation: "Ngược lại, nó 'làm gia tăng hiệu ứng đường hầm lượng tử gây rò rỉ dòng điện'.",
          },
          {
            id: "tsa-q2-c",
            text: "Chip 2nm tiêu thụ điện năng hiệu quả hơn so với tiến trình kích thước lớn hơn.",
            isCorrect: true,
            explanation: "Văn bản đề cập trực tiếp việc 'giảm điện năng tiêu thụ'.",
          },
          {
            id: "tsa-q2-d",
            text: "Hiệu ứng đường hầm lượng tử là thách thức vật lý khi thu nhỏ bóng bán dẫn.",
            isCorrect: true,
            explanation: "Rò rỉ dòng điện do hiệu ứng đường hầm lượng tử là hệ quả trực tiếp của việc thu nhỏ xuống 2nm.",
          },
        ],
      },
      {
        id: "tsa-q3",
        part: 3,
        question:
          "[Tư duy Khoa học - Điền số] Một động cơ nhiệt nhận 2000 J nhiệt lượng từ nguồn nóng và nhả 1200 J cho nguồn lạnh trong một chu trình. Hiệu suất của động cơ nhiệt này bằng bao nhiêu phần trăm (%)?",
        answer: "40",
        acceptedAnswers: ["40", "40%", "40.0"],
        unit: "%",
        explanation:
          "Công sinh ra A = Q1 - Q2 = 2000 - 1200 = 800 J. Hiệu suất H = (A / Q1) × 100% = (800 / 2000) × 100% = 40%.",
      },
    ],
    faqs: [
      {
        q: "Thi TSA có cần học thuộc nhiều công thức nặng như thi THPT không?",
        a: "Bài thi TSA thiên về tư duy logic, đọc hiểu dữ liệu và mô hình hóa bài toán thực tế hơn là đánh đố mẹo tính toán phức tạp. Dữ liệu thí nghiệm thường được cung cấp ngay trong câu hỏi.",
      },
      {
        q: "Chứng nhận điểm TSA có thời hạn bao lâu?",
        a: "Giấy chứng nhận kết quả thi TSA của ĐH Bách Khoa Hà Nội thường có giá trị trong 2 năm kể từ ngày thi để đăng ký xét tuyển đại học.",
      },
      {
        q: "Điểm TSA bao nhiêu là mức an toàn để đỗ ngành Khoa học Máy tính (IT1) Bách Khoa?",
        a: "Thang điểm TSA là 100; các ngành CNTT/Khoa học máy tính top đầu thường yêu cầu mức từ 70–80+ điểm trở lên tùy năm.",
      },
    ],
    relatedTools: [
      { label: "Quy đổi điểm TSA ↔ Thang 30", href: "/cong-cu/quy-doi-diem-ielts-dgnl-2027" },
      { label: "Đếm ngược ngày thi 2027", href: "/cong-cu/dem-nguoc-ngay-thi-2027" },
    ],
  },
  {
    slug: "spt-su-pham",
    hub: "dgnl",
    name: "Đánh Giá Năng Lực ĐH Sư Phạm Hà Nội (SPT) 2027",
    shortName: "SPT ĐH Sư Phạm HN",
    badge: "ĐH Sư Phạm • 8 Môn Độc Lập",
    seoTitle: "Đề Thi Đánh Giá Năng Lực SPT ĐH Sư Phạm Hà Nội 2027 Có Đáp Án",
    seoDescription:
      "Cấu trúc đề thi SPT ĐH Sư phạm Hà Nội (HNUE) 2027 thi theo từng môn độc lập (Toán, Văn, Anh, Lý, Hóa, Sinh, Sử, Địa), kết hợp trắc nghiệm khách quan và tự luận.",
    keywords: [
      "đề thi spt sư phạm hà nội",
      "đánh giá năng lực hnue 2027",
      "cấu trúc đề thi spt",
    ],
    description:
      "Kỳ thi Đánh giá năng lực chuyên biệt (SPT) của Trường ĐH Sư phạm Hà Nội tổ chức thi theo từng môn độc lập, kết hợp trắc nghiệm (70%) và tự luận (30%), được nhiều trường ĐH Sư phạm và đại học lớn sử dụng xét tuyển.",
    duration: "60–90 phút / môn",
    maxScore: "10 điểm / môn",
    totalQuestionsLabel: "Thi từng môn độc lập theo tổ hợp xét tuyển",
    formatLabel: "Thi trên giấy (70% Trắc nghiệm + 30% Tự luận / Đúng-Sai)",
    targetAudience: "Thí sinh xét tuyển khối ngành Sư phạm (HNUE, ĐHSP TP.HCM, ĐH Vinh, ĐHSP Huế...)",
    topics: [
      "Toán học SPT (90 phút): Trắc nghiệm 4 lựa chọn, Đúng/Sai & Tự luận giải toán",
      "Ngữ văn SPT (90 phút): Đọc hiểu trắc nghiệm + Nghị luận xã hội/văn học",
      "Tiếng Anh SPT (60 phút): Ngữ âm, ngữ pháp, đọc hiểu & viết luận ngắn",
      "Các môn KHTN & KHXH: Vật lý, Hóa học, Sinh học, Lịch sử, Địa lý (60 phút/môn)",
    ],
    structure: [
      {
        part: "Phần Trắc nghiệm (70%)",
        content: "Câu hỏi 4 lựa chọn & Đúng/Sai kiểm tra kiến thức chuẩn GDPT 2018",
        questionCount: "20–30 câu tùy môn",
        scoreWeight: "7.0 điểm",
      },
      {
        part: "Phần Tự luận (30%)",
        content: "Bài toán chứng minh / phân tích hiện tượng / viết đoạn văn nghị luận",
        questionCount: "2–4 câu tự luận",
        scoreWeight: "3.0 điểm",
      },
    ],
    questions: [
      {
        id: "spt-q1",
        part: 1,
        question:
          "[Toán SPT] Tìm tập nghiệm của bất phương trình log_2(x - 1) < 3.",
        options: ["(1; 9)", "(-∞; 9)", "(1; 7)", "(0; 9)"],
        answer: 0,
        explanation:
          "Điều kiện xác định: x - 1 > 0 <=> x > 1. Bất phương trình tương đương x - 1 < 2^3 = 8 <=> x < 9. Kết hợp điều kiện ta được tập nghiệm (1; 9).",
      },
      {
        id: "spt-q2",
        part: 1,
        question:
          "[Tiếng Anh SPT] Hardly _____ the classroom when the bell rang to signal the start of the exam.",
        options: [
          "had the students entered",
          "the students had entered",
          "did the students entered",
          "have the students entered",
        ],
        answer: 0,
        explanation:
          "Cấu trúc đảo ngữ với 'Hardly ... when ...' diễn tả hành động vừa mới xảy ra thì hành động khác ập tới: Hardly + had + S + V3/ed + when + S + V2/ed.",
      },
      {
        id: "spt-q3",
        part: 3,
        question:
          "[Lý SPT - Trả lời ngắn] Một sóng cơ hình sin lan truyền trên dây với tần số f = 20 Hz và bước sóng λ = 0,4 m. Tốc độ truyền sóng trên dây bằng bao nhiêu m/s?",
        answer: "8",
        acceptedAnswers: ["8", "8.0", "8,0"],
        unit: "m/s",
        explanation: "Tốc độ truyền sóng v = λ × f = 0,4 × 20 = 8 m/s.",
      },
    ],
    faqs: [
      {
        q: "Thi SPT khác gì so với HSA hay V-ACT?",
        a: "HSA và V-ACT là bài thi tổng hợp nhiều môn cùng lúc, còn SPT thi từng môn riêng lẻ theo đúng tổ hợp ngành bạn đăng ký (ví dụ A00 chọn Toán, Lý, Hóa) và có 30% tự luận.",
      },
      {
        q: "Ngành Sư phạm có điểm cộng hay ngưỡng đảm bảo chất lượng từ SPT không?",
        a: "Theo quy định Bộ GD&ĐT, nhóm ngành đào tạo giáo viên có ngưỡng đảm bảo chất lượng đầu vào dựa trên học lực lớp 12 và điểm thi; điểm SPT càng cao càng dễ cạnh tranh học bổng và chỉ tiêu.",
      },
    ],
    relatedTools: [
      { label: "Tính điểm xét tốt nghiệp THPT 2027", href: "/cong-cu/tinh-diem-tot-nghiep-thpt-2027" },
      { label: "Đếm ngược ngày thi 2027", href: "/cong-cu/dem-nguoc-ngay-thi-2027" },
    ],
  },
  {
    slug: "v-sat",
    hub: "dgnl",
    name: "Kỳ Thi Đánh Giá Đầu Vào Đại Học V-SAT 2027",
    shortName: "V-SAT 2027",
    badge: "Thi trên máy • Ngân hàng đề chuẩn hóa",
    seoTitle: "Đề Thi V-SAT 2027 Có Đáp Án — Luyện Thi Đánh Giá Đầu Vào Đại Học",
    seoDescription:
      "Luyện đề thi V-SAT 2027 (Trung tâm Khảo thí Quốc gia phối hợp các trường ĐH Ngân hàng, Cần Thơ, Sài Gòn, Tài chính - Marketing): cấu trúc 4 dạng câu hỏi trên máy tính.",
    keywords: [
      "đề thi v-sat 2027",
      "kỳ thi v-sat",
      "cấu trúc đề thi vsat",
      "luyện thi vsat",
    ],
    description:
      "Kỳ thi Đánh giá đầu vào đại học trên máy tính (V-SAT) gồm 8 môn độc lập (Toán, Lý, Hóa, Sinh, Văn, Sử, Địa, Tiếng Anh) với 4 định dạng câu hỏi trắc nghiệm khách quan đa dạng (Đúng/Sai, 4 lựa chọn, Ghép đôi, Trả lời ngắn).",
    duration: "60–90 phút / môn",
    maxScore: "150 điểm / môn",
    totalQuestionsLabel: "25–45 câu hỏi đa định dạng trên máy tính",
    formatLabel: "Thi trên máy tính (4 dạng: Đúng/Sai, 4 lựa chọn, Nối cặp, Trả lời ngắn)",
    targetAudience: "Thí sinh xét tuyển ĐH Ngân hàng TP.HCM, ĐH Cần Thơ, ĐH Tài chính - Marketing, ĐH Sài Gòn...",
    topics: [
      "Dạng 1: Trắc nghiệm Đúng / Sai (mỗi câu 4 nhận định)",
      "Dạng 2: Trắc nghiệm 4 lựa chọn (1 đáp án đúng)",
      "Dạng 3: Câu hỏi ghép đôi (Matching câu hỏi - phương án)",
      "Dạng 4: Câu hỏi trả lời ngắn / điền khuyết",
    ],
    structure: [
      {
        part: "Phần Đúng / Sai",
        content: "Kiểm tra khả năng đánh giá tính chính xác của từng mệnh đề khoa học",
        questionCount: "9–10 câu",
        scoreWeight: "Thang quy đổi 150đ",
      },
      {
        part: "Phần 4 Lựa chọn & Ghép đôi",
        content: "Liên kết kiến thức liên chuyên đề theo chương trình GDPT 2018",
        questionCount: "10–15 câu",
        scoreWeight: "Thang quy đổi 150đ",
      },
      {
        part: "Phần Trả lời ngắn",
        content: "Nhập trực tiếp giá trị số hoặc từ khóa ngắn",
        questionCount: "5–6 câu",
        scoreWeight: "Thang quy đổi 150đ",
      },
    ],
    questions: [
      {
        id: "vsat-q1",
        part: 1,
        question:
          "[Toán V-SAT] Một khoản tiền 100 triệu đồng được gửi tiết kiệm với lãi suất kép 6%/năm. Sau đúng 2 năm, tổng số tiền (cả gốc và lãi) thu được là bao nhiêu triệu đồng?",
        options: ["112,00 triệu", "112,36 triệu", "112,60 triệu", "113,00 triệu"],
        answer: 1,
        explanation:
          "Theo công thức lãi kép: T = P(1 + r)^n = 100 × (1 + 0,06)^2 = 100 × 1,1236 = 112,36 triệu đồng.",
      },
      {
        id: "vsat-q2",
        part: 2,
        context:
          "[Hóa học V-SAT] Xét tính chất của kim loại Nhôm (Al, Z = 13) và hợp chất của nó:",
        subQuestions: [
          {
            id: "vsat-q2-a",
            text: "Nhôm là kim loại nhẹ, dẫn điện và dẫn nhiệt tốt, được dùng làm dây dẫn điện cao thế.",
            isCorrect: true,
            explanation: "Al có khối lượng riêng nhỏ (2,7 g/cm³) và độ dẫn điện cao.",
          },
          {
            id: "vsat-q2-b",
            text: "Al2O3 và Al(OH)3 đều là các hợp chất lưỡng tính, tan được trong cả dung dịch HCl và NaOH.",
            isCorrect: true,
            explanation: "Cả oxit và hidroxit của nhôm đều thể hiện tính lưỡng tính.",
          },
          {
            id: "vsat-q2-c",
            text: "Nhôm tác dụng mãnh liệt với dung dịch HNO3 đặc, nguội giải phóng khí NO2.",
            isCorrect: false,
            explanation: "Al bị thụ động hóa trong dung dịch HNO3 đặc nguội và H2SO4 đặc nguội.",
          },
          {
            id: "vsat-q2-d",
            text: "Trong công nghiệp, nhôm được điều chế bằng cách điện phân nóng chảy Al2O3 có mặt criolit.",
            isCorrect: true,
            explanation: "Criolit giúp hạ nhiệt độ nóng chảy của Al2O3 từ ~2050°C xuống ~900°C.",
          },
        ],
      },
      {
        id: "vsat-q3",
        part: 3,
        question:
          "[Toán V-SAT - Trả lời ngắn] Cho cấp số cộng (u_n) có số hạng đầu u_1 = 3 và công sai d = 4. Giá trị của số hạng thứ 10 (u_10) bằng bao nhiêu?",
        answer: "39",
        acceptedAnswers: ["39", "39.0"],
        explanation: "u_10 = u_1 + 9d = 3 + 9 × 4 = 3 + 36 = 39.",
      },
    ],
    faqs: [
      {
        q: "Thi V-SAT có thể đăng ký bao nhiêu môn?",
        a: "Thí sinh có thể chọn thi 3 môn theo tổ hợp xét tuyển (như A00, A01, D01) hoặc thi thêm các môn khác để mở rộng cơ hội xét tuyển vào nhiều trường trong liên minh V-SAT.",
      },
      {
        q: "Điểm V-SAT có được bảo lưu giữa các đợt thi trong năm không?",
        a: "Có. Thí sinh có thể thi nhiều đợt V-SAT trong năm và chọn điểm cao nhất của từng môn để gộp thành tổ hợp 3 môn xét tuyển đại học.",
      },
    ],
    relatedTools: [
      { label: "Quy đổi điểm ĐGNL ↔ THPT", href: "/cong-cu/quy-doi-diem-ielts-dgnl-2027" },
      { label: "Đếm ngược ngày thi 2027", href: "/cong-cu/dem-nguoc-ngay-thi-2027" },
    ],
  },
];

/* ============================================================================
 * 2. MÔN ĐẠI CƯƠNG ĐẠI HỌC (8 PAGES)
 * ========================================================================== */
export const UNIVERSITY_SUBJECTS: ExtendedExamEntry[] = [
  {
    slug: "triet-hoc-mac-lenin",
    hub: "dai-hoc",
    name: "Triết Học Mác - Lênin (Đại Học)",
    shortName: "Triết học Mác - Lênin",
    badge: "3 Tín chỉ • Đại cương bắt buộc",
    seoTitle: "Đề Thi Trắc Nghiệm Triết Học Mác - Lênin Có Đáp Án (NEU, VNU, UEH, HUST)",
    seoDescription:
      "Tổng hợp câu hỏi trắc nghiệm ôn thi Triết học Mác - Lênin đầy đủ 3 chương kèm đáp án và giải thích chi tiết dành cho sinh viên các trường NEU, VNU, UEH, AOF, HUST, FPT.",
    keywords: [
      "trắc nghiệm triết học mác lênin",
      "đề thi triết học mác lênin có đáp án",
      "ôn thi triết học đại học",
    ],
    description:
      "Học phần lý luận chính trị nền tảng (3 tín chỉ) trang bị thế giới quan duy vật biện chứng và phương pháp luận duy vật lịch sử. Bộ câu hỏi bao phủ toàn bộ 3 chương chuẩn giáo trình Bộ GD&ĐT.",
    duration: "60 phút",
    maxScore: "10 điểm",
    totalQuestionsLabel: "40–60 câu trắc nghiệm / đề thi kết thúc học phần",
    formatLabel: "Trắc nghiệm khách quan 4 lựa chọn (thi máy hoặc giấy)",
    targetAudience: "Sinh viên năm 1 tất cả các trường Đại học tại Việt Nam",
    universities: ["NEU", "VNU", "UEH", "AOF", "HUBT", "HUST", "FPT"],
    topics: [
      "Chương 1: Khái luận về Triết học và Triết học Mác - Lênin",
      "Chương 2: Chủ nghĩa duy vật biện chứng (Vật chất, Ý thức, 2 nguyên lý, 3 quy luật, 6 cặp phạm trù)",
      "Chương 3: Chủ nghĩa duy vật lịch sử (Hình thái KT-XH, Giai cấp, Nhà nước, Ý thức xã hội)",
      "Lý luận nhận thức & Vai trò của thực tiễn",
    ],
    structure: [
      {
        part: "Chương 1: Khái luận",
        content: "Vấn đề cơ bản của triết học, nguồn gốc và chức năng thế giới quan",
        questionCount: "~20% đề thi",
        scoreWeight: "2.0 điểm",
      },
      {
        part: "Chương 2: Duy vật biện chứng",
        content: "Vật chất - Ý thức, 3 quy luật cơ bản, 6 cặp phạm trù, lý luận nhận thức",
        questionCount: "~45% đề thi",
        scoreWeight: "4.5 điểm",
      },
      {
        part: "Chương 3: Duy vật lịch sử",
        content: "Lực lượng sản xuất - Quan hệ sản xuất, Cơ sở hạ tầng - Kiến trúc thượng tầng",
        questionCount: "~35% đề thi",
        scoreWeight: "3.5 điểm",
      },
    ],
    questions: [
      {
        id: "triet-q1",
        part: 1,
        question:
          "Theo quan điểm của chủ nghĩa duy vật biện chứng, thuộc tính cơ bản nhất, phổ biến nhất của mọi dạng vật chất là gì?",
        options: [
          "Tồn tại khách quan",
          "Có khối lượng và quảng tính",
          "Vận động không ngừng",
          "Có thể cảm giác trực tiếp được",
        ],
        answer: 0,
        explanation:
          "Theo định nghĩa vật chất của V.I. Lênin: 'Vật chất là một phạm trù triết học dùng để chỉ thực tại khách quan...'. Thuộc tính chung nhất của mọi dạng vật chất là tồn tại khách quan (tồn tại bên ngoài, độc lập với ý thức con người).",
      },
      {
        id: "triet-q2",
        part: 1,
        question:
          "Quy luật nào của phép biện chứng duy vật chỉ ra NGUỒN GỐC và ĐỘNG LỰC của mọi sự vận động, phát triển?",
        options: [
          "Quy luật chuyển hóa từ những thay đổi về lượng dẫn đến thay đổi về chất",
          "Quy luật thống nhất và đấu tranh của các mặt đối lập",
          "Quy luật phủ định của phủ định",
          "Quy luật quan hệ sản xuất phù hợp với trình độ lực lượng sản xuất",
        ],
        answer: 1,
        explanation:
          "Ba quy luật cơ bản trả lời 3 câu hỏi khác nhau: Quy luật mâu thuẫn (thống nhất và đấu tranh giữa các mặt đối lập) chỉ ra nguồn gốc/động lực; Quy luật lượng - chất chỉ ra cách thức; Quy luật phủ định của phủ định chỉ ra khuynh hướng phát triển.",
      },
      {
        id: "triet-q3",
        part: 1,
        question:
          "Trong mối quan hệ biện chứng giữa lực lượng sản xuất (LLSX) và quan hệ sản xuất (QHSX), yếu tố nào giữ vai trò quyết định và thường xuyên biến đổi nhanh nhất?",
        options: [
          "Quan hệ sản xuất",
          "Lực lượng sản xuất (đặc biệt là công cụ lao động)",
          "Kiến trúc thượng tầng",
          "Quan hệ phân phối sản phẩm",
        ],
        answer: 1,
        explanation:
          "Lực lượng sản xuất (trong đó công cụ lao động là yếu tố cách mạng nhất) luôn vận động, phát triển trước, quyết định sự hình thành và biến đổi của quan hệ sản xuất.",
      },
    ],
    faqs: [
      {
        q: "Làm sao nhớ nhanh 3 quy luật và 6 cặp phạm trù Triết học Mác - Lênin?",
        a: "Hãy học theo trục từ khóa: Mâu thuẫn -> Động lực; Lượng/Chất -> Cách thức (Độ, Điểm nút, Bước nhảy); Phủ định -> Khuynh hướng (Xoáy ốc). Kết hợp làm trắc nghiệm lặp lại trên QuizKen để ghi nhớ câu bẫy.",
      },
      {
        q: "Môn Triết học Mác - Lênin thường hay bẫy sinh viên ở phần nào?",
        a: "Đề thi thường đảo giữa 'tồn tại khách quan' và 'vận động', giữa vai trò của 'cơ sở hạ tầng' với 'kiến trúc thượng tầng', hoặc nhầm lẫn các giai đoạn của nhận thức (cảm tính vs lý tính).",
      },
    ],
    relatedTools: [
      { label: "Tính điểm GPA Đại học (Hệ 4 & 10)", href: "/cong-cu/tinh-diem-gpa-dai-hoc" },
      { label: "Trộn đề trắc nghiệm cho lớp", href: "/cong-cu/tron-de-trac-nghiem-online" },
    ],
  },
  {
    slug: "kinh-te-chinh-tri",
    hub: "dai-hoc",
    name: "Kinh Tế Chính Trị Mác - Lênin (Đại Học)",
    shortName: "Kinh tế chính trị",
    badge: "2 Tín chỉ • Đại cương",
    seoTitle: "Đề Thi Trắc Nghiệm Kinh Tế Chính Trị Mác - Lênin Có Đáp Án",
    seoDescription:
      "Bộ câu hỏi trắc nghiệm Kinh tế chính trị Mác - Lênin (6 chương): Hàng hóa, Tiền tệ, Giá trị thặng dư, Cạnh tranh độc quyền và Kinh tế thị trường định hướng XHCN.",
    keywords: [
      "trắc nghiệm kinh tế chính trị",
      "đề thi kinh tế chính trị mác lênin",
      "ôn thi ktct có đáp án",
    ],
    description:
      "Học phần nghiên cứu các quy luật kinh tế cơ bản của phương thức sản xuất tư bản chủ nghĩa và thời kỳ quá độ lên chủ nghĩa xã hội tại Việt Nam, trọng tâm là học thuyết giá trị và giá trị thặng dư.",
    duration: "50–60 phút",
    maxScore: "10 điểm",
    totalQuestionsLabel: "40–50 câu trắc nghiệm (lý thuyết + bài tập tính m', M, p')",
    formatLabel: "Trắc nghiệm khách quan trên máy / giấy",
    targetAudience: "Sinh viên đại học năm 1–2 các khối ngành Kinh tế, Kỹ thuật, Xã hội",
    universities: ["NEU", "UEH", "AOF", "VNU", "FTU", "TMU"],
    topics: [
      "Chương 1: Đối tượng, phương pháp nghiên cứu của Kinh tế chính trị",
      "Chương 2: Hàng hóa, thị trường và vai trò của các chủ thể",
      "Chương 3: Giá trị thặng dư trong nền kinh tế thị trường (tư bản bất biến c, khả biến v)",
      "Chương 4: Cạnh tranh và độc quyền trong nền kinh tế thị trường",
      "Chương 5 & 6: Kinh tế thị trường định hướng XHCN & Công nghiệp hóa, hội nhập",
    ],
    structure: [
      {
        part: "Chương 1–2: Hàng hóa & Thị trường",
        content: "Hai thuộc tính hàng hóa, lượng giá trị, quy luật giá trị, tiền tệ",
        questionCount: "~35% đề thi",
        scoreWeight: "3.5 điểm",
      },
      {
        part: "Chương 3: Giá trị thặng dư",
        content: "Công thức chung tư bản, sức lao động, tỷ suất m' và khối lượng M",
        questionCount: "~35% đề thi",
        scoreWeight: "3.5 điểm",
      },
      {
        part: "Chương 4–6: Độc quyền & Hội nhập",
        content: "5 đặc điểm độc quyền, sở hữu và thành phần kinh tế ở Việt Nam",
        questionCount: "~30% đề thi",
        scoreWeight: "3.0 điểm",
      },
    ],
    questions: [
      {
        id: "ktct-q1",
        part: 1,
        question:
          "Hai thuộc tính cơ bản của hàng hóa là gì?",
        options: [
          "Giá trị sử dụng và Giá trị trao đổi",
          "Giá trị sử dụng và Giá trị",
          "Lao động cụ thể và Lao động trừu tượng",
          "Giá cả và Lợi nhuận",
        ],
        answer: 1,
        explanation:
          "Hàng hóa có hai thuộc tính là Giá trị sử dụng (công dụng thỏa mãn nhu cầu) và Giá trị (lao động xã hội của người sản xuất kết tinh trong hàng hóa). Giá trị trao đổi chỉ là hình thức biểu hiện của giá trị.",
      },
      {
        id: "ktct-q2",
        part: 1,
        question:
          "Khi năng suất lao động xã hội tăng lên (các yếu tố khác không đổi), lượng giá trị của một đơn vị hàng hóa sẽ thay đổi như thế nào?",
        options: [
          "Tăng lên tỷ lệ thuận với năng suất",
          "Giảm xuống (tỷ lệ nghịch với năng suất lao động)",
          "Không thay đổi",
          "Tăng gấp đôi rồi giảm dần",
        ],
        answer: 1,
        explanation:
          "Tăng năng suất lao động làm giảm thời gian lao động xã hội cần thiết để sản xuất ra một đơn vị sản phẩm, do đó lượng giá trị của một đơn vị hàng hóa giảm xuống (tổng giá trị trong một đơn vị thời gian không đổi).",
      },
      {
        id: "ktct-q3",
        part: 3,
        question:
          "[Bài tập KTCT] Một doanh nghiệp ứng ra tư bản khả biến v = 200 triệu đồng, thu được giá trị thặng dư m = 300 triệu đồng. Tỷ suất giá trị thặng dư (m') bằng bao nhiêu phần trăm (%)?",
        answer: "150",
        acceptedAnswers: ["150", "150%", "150.0"],
        unit: "%",
        explanation:
          "Công thức tính tỷ suất giá trị thặng dư: m' = (m / v) × 100% = (300 / 200) × 100% = 150%.",
      },
    ],
    faqs: [
      {
        q: "Khác biệt giữa 'Tăng năng suất lao động' và 'Tăng cường độ lao động' là gì?",
        a: "Tăng năng suất làm giảm giá trị 1 đơn vị sản phẩm (tổng giá trị không đổi). Tăng cường độ lao động làm tăng tổng số sản phẩm và tổng giá trị tạo ra, nhưng giá trị 1 đơn vị sản phẩm vẫn giữ nguyên.",
      },
      {
        q: "Công thức tính tỷ suất giá trị thặng dư m' và tỷ suất lợi nhuận p' khác nhau thế nào?",
        a: "m' = (m / v) × 100% (so sánh m với tư bản khả biến v). Còn p' = (p / (c + v)) × 100% (so sánh lợi nhuận với toàn bộ tư bản ứng trước c + v).",
      },
    ],
    relatedTools: [
      { label: "Tính điểm GPA Đại học", href: "/cong-cu/tinh-diem-gpa-dai-hoc" },
    ],
  },
  {
    slug: "phap-luat-dai-cuong",
    hub: "dai-hoc",
    name: "Pháp Luật Đại Cương (Đại Học)",
    shortName: "Pháp luật đại cương",
    badge: "2 Tín chỉ • Đại cương",
    seoTitle: "Đề Thi Trắc Nghiệm Pháp Luật Đại Cương Có Đáp Án Chi Tiết",
    seoDescription:
      "Kho câu hỏi trắc nghiệm Pháp luật đại cương (Nhà nước, Hệ thống pháp luật, Quy phạm & Quan hệ pháp luật, Luật Hiến pháp, Dân sự, Hình sự, Lao động, Phòng chống tham nhũng).",
    keywords: [
      "trắc nghiệm pháp luật đại cương",
      "đề thi pháp luật đại cương có đáp án",
      "ôn thi pldc đại học",
    ],
    description:
      "Môn học cung cấp kiến thức nền tảng về nguồn gốc, bản chất Nhà nước và Pháp luật, cấu trúc quy phạm pháp luật, quan hệ pháp luật và các ngành luật cơ bản trong hệ thống pháp luật Việt Nam hiện hành.",
    duration: "60 phút",
    maxScore: "10 điểm",
    totalQuestionsLabel: "40–50 câu trắc nghiệm lý thuyết + tình huống",
    formatLabel: "Trắc nghiệm 4 lựa chọn",
    targetAudience: "Sinh viên đại học các khối ngành (VNU, NEU, UEH, HUST, FPT, HUBT...)",
    universities: ["VNU", "NEU", "UEH", "HUBT", "FPT", "HUST"],
    topics: [
      "Nguồn gốc, bản chất, chức năng và bộ máy Nhà nước CHXHCN Việt Nam",
      "Quy phạm pháp luật (Giả định - Quy định - Chế tài) & Văn bản QPPL",
      "Quan hệ pháp luật, Sự kiện pháp lý & Vi phạm pháp luật",
      "Cơ bản về Luật Dân sự (Thừa kế, Hợp đồng), Hình sự & Lao động",
      "Pháp luật về phòng, chống tham nhũng",
    ],
    structure: [
      {
        part: "Lý luận chung về Nhà nước",
        content: "Hình thức chính thể, cấu trúc nhà nước, bộ máy cơ quan Việt Nam",
        questionCount: "~25% đề thi",
        scoreWeight: "2.5 điểm",
      },
      {
        part: "Quy phạm & Vi phạm pháp luật",
        content: "Cấu trúc QPPL, 4 dấu hiệu vi phạm pháp luật, lỗi cố ý/vô ý",
        questionCount: "~40% đề thi",
        scoreWeight: "4.0 điểm",
      },
      {
        part: "Các ngành luật thực định",
        content: "Hiến pháp, Dân sự (thừa kế), Hình sự (tuổi chịu TNHS), Lao động",
        questionCount: "~35% đề thi",
        scoreWeight: "3.5 điểm",
      },
    ],
    questions: [
      {
        id: "pldc-q1",
        part: 1,
        question:
          "Một quy phạm pháp luật đầy đủ thường gồm ba bộ phận cấu thành nào sau đây?",
        options: [
          "Chủ thể, Khách thể và Nội dung",
          "Giả định, Quy định và Chế tài",
          "Hành vi, Lỗi và Thiệt hại",
          "Hiến pháp, Luật và Nghị định",
        ],
        answer: 1,
        explanation:
          "Cấu trúc của quy phạm pháp luật gồm: Giả định (nêu hoàn cảnh, điều kiện, chủ thể), Quy định (nêu quy tắc xử sự được phép/bắt buộc/cấm) và Chế tài (nêu biện pháp tác động bất lợi khi vi phạm). Lưu ý: Chủ thể, Khách thể, Nội dung là 3 yếu tố của Quan hệ pháp luật.",
      },
      {
        id: "pldc-q2",
        part: 1,
        question:
          "Theo Hiến pháp 2013, cơ quan nào là cơ quan đại biểu cao nhất của Nhân dân, cơ quan quyền lực nhà nước cao nhất của nước CHXHCN Việt Nam?",
        options: [
          "Chính phủ",
          "Quốc hội",
          "Chủ tịch nước",
          "Tòa án nhân dân tối cao",
        ],
        answer: 1,
        explanation:
          "Điều 69 Hiến pháp 2013 quy định: Quốc hội là cơ quan đại biểu cao nhất của Nhân dân, cơ quan quyền lực nhà nước cao nhất, thực hiện quyền lập hiến, lập pháp.",
      },
      {
        id: "pldc-q3",
        part: 1,
        question:
          "Theo Bộ luật Dân sự 2015, những người nào sau đây thuộc HÀNG THỪA KẾ THỨ NHẤT theo pháp luật?",
        options: [
          "Vợ/chồng, cha đẻ, mẹ đẻ, cha nuôi, mẹ nuôi, con đẻ, con nuôi của người chết",
          "Ông bà nội, ông bà ngoại, anh chị em ruột",
          "Cô, dì, chú, bác, cậu ruột của người chết",
          "Cháu ruột gọi người chết là ông, bà",
        ],
        answer: 0,
        explanation:
          "Điều 651 Bộ luật Dân sự 2015 quy định hàng thừa kế thứ nhất gồm: vợ, chồng, cha đẻ, mẹ đẻ, cha nuôi, mẹ nuôi, con đẻ, con nuôi của người chết (con dâu/con rể không thuộc hàng thừa kế thứ nhất).",
      },
    ],
    faqs: [
      {
        q: "Làm thế nào phân biệt giữa 'Năng lực pháp luật' và 'Năng lực hành vi'?",
        a: "Năng lực pháp luật của cá nhân có từ khi sinh ra và chấm dứt khi chết. Năng lực hành vi dân sự phát triển theo độ tuổi và khả năng nhận thức, điều khiển hành vi (đầy đủ từ đủ 18 tuổi).",
      },
      {
        q: "Văn bản nào có hiệu lực pháp lý cao nhất trong hệ thống pháp luật Việt Nam?",
        a: "Hiến pháp là luật cơ bản, có hiệu lực pháp lý cao nhất; mọi văn bản quy phạm pháp luật khác phải phù hợp với Hiến pháp.",
      },
    ],
    relatedTools: [
      { label: "Tính điểm GPA Đại học", href: "/cong-cu/tinh-diem-gpa-dai-hoc" },
    ],
  },
  {
    slug: "tu-tuong-ho-chi-minh",
    hub: "dai-hoc",
    name: "Tư Tưởng Hồ Chí Minh (Đại Học)",
    shortName: "Tư tưởng Hồ Chí Minh",
    badge: "2 Tín chỉ • Lý luận chính trị",
    seoTitle: "Đề Thi Trắc Nghiệm Tư Tưởng Hồ Chí Minh Có Đáp Án Mới Nhất",
    seoDescription:
      "Ngân hàng câu hỏi trắc nghiệm Tư tưởng Hồ Chí Minh (6 chương chuẩn Bộ GD&ĐT): Cơ sở hình thành, Độc lập dân tộc & CNXH, Đảng Cộng sản, Đại đoàn kết, Văn hóa & Đạo đức.",
    keywords: [
      "trắc nghiệm tư tưởng hồ chí minh",
      "đề thi tư tưởng hồ chí minh",
      "ôn thi tthcm có đáp án",
    ],
    description:
      "Học phần giúp sinh viên nắm vững hệ thống quan điểm toàn diện và sâu sắc của Chủ tịch Hồ Chí Minh về những vấn đề cơ bản của cách mạng Việt Nam, từ nguồn gốc tư tưởng đến đạo đức và văn hóa con người mới.",
    duration: "50–60 phút",
    maxScore: "10 điểm",
    totalQuestionsLabel: "40–50 câu trắc nghiệm",
    formatLabel: "Trắc nghiệm 4 lựa chọn",
    targetAudience: "Sinh viên đại học năm 2–3 các trường trên toàn quốc",
    universities: ["NEU", "VNU", "UEH", "AOF", "HUBT", "HUST"],
    topics: [
      "Chương 1–2: Khái niệm, cơ sở hình thành & quá trình phát triển TTHCM",
      "Chương 3: Tư tưởng về Độc lập dân tộc và Chủ nghĩa xã hội",
      "Chương 4: Tư tưởng về Đảng Cộng sản Việt Nam & Nhà nước của dân, do dân, vì dân",
      "Chương 5: Tư tưởng về Đại đoàn kết toàn dân tộc & Đoàn kết quốc tế",
      "Chương 6: Tư tưởng về Văn hóa, Đạo đức và Con người",
    ],
    structure: [
      {
        part: "Chương 1–2: Cơ sở & Quá trình",
        content: "3 nguồn gốc lý luận, giai đoạn 1911–1920, 1921–1930",
        questionCount: "~30% đề thi",
        scoreWeight: "3.0 điểm",
      },
      {
        part: "Chương 3–4: Độc lập, Đảng & Nhà nước",
        content: "Chân lý 'Không có gì quý hơn độc lập tự do', Nhà nước pháp quyền",
        questionCount: "~40% đề thi",
        scoreWeight: "4.0 điểm",
      },
      {
        part: "Chương 5–6: Đoàn kết & Đạo đức",
        content: "Lực lượng đại đoàn kết, 4 chuẩn mực đạo đức cách mạng (Cần, Kiệm, Liêm, Chính)",
        questionCount: "~30% đề thi",
        scoreWeight: "3.0 điểm",
      },
    ],
    questions: [
      {
        id: "tthcm-q1",
        part: 1,
        question:
          "Trong các tiền đề tư tưởng lý luận hình thành Tư tưởng Hồ Chí Minh, tiền đề nào giữ vai trò quyết định bản chất cách mạng và khoa học của tư tưởng Người?",
        options: [
          "Giá trị truyền thống tốt đẹp của dân tộc Việt Nam",
          "Tinh hoa văn hóa nhân loại (Nho giáo, Phật giáo, Tôn Trung Sơn, Khai sáng)",
          "Chủ nghĩa Mác - Lênin",
          "Phẩm chất cá nhân và năng lực tư duy độc lập của Hồ Chí Minh",
        ],
        answer: 2,
        explanation:
          "Chủ nghĩa Mác - Lênin là cơ sở thế giới quan và phương pháp luận, giữ vai trò quyết định bước phát triển về chất trong tư tưởng Hồ Chí Minh (bên cạnh truyền thống dân tộc và tinh hoa văn hóa nhân loại).",
      },
      {
        id: "tthcm-q2",
        part: 1,
        question:
          "Theo Hồ Chí Minh, động lực chủ yếu nhất, quan trọng nhất trong công cuộc xây dựng chủ nghĩa xã hội là gì?",
        options: [
          "Viện trợ từ các nước xã hội chủ nghĩa",
          "Tài nguyên thiên nhiên phong phú",
          "Con người xã hội chủ nghĩa (nội lực nhân dân lao động)",
          "Khoa học kỹ thuật nhập khẩu",
        ],
        answer: 2,
        explanation:
          "Hồ Chí Minh khẳng định muốn xây dựng chủ nghĩa xã hội, trước hết cần có những con người xã hội chủ nghĩa — con người vừa là mục tiêu, vừa là động lực quyết định nhất.",
      },
      {
        id: "tthcm-q3",
        part: 1,
        question:
          "Nguyễn Ái Quốc đã đọc 'Sơ thảo lần thứ nhất những luận cương về vấn đề dân tộc và vấn đề thuộc địa' của V.I. Lênin vào thời gian và địa điểm nào?",
        options: [
          "Tháng 6/1919 tại Véc-xây (Pháp)",
          "Tháng 7/1920 tại Paris (Pháp)",
          "Tháng 12/1920 tại Đại hội Tua",
          "Tháng 6/1923 tại Mátxcơva (Liên Xô)",
        ],
        answer: 1,
        explanation:
          "Tháng 7/1920, trên báo L'Humanité tại Paris, Nguyễn Ái Quốc đọc Luận cương của Lênin và tìm thấy con đường cứu nước đúng đắn: cách mạng vô sản.",
      },
    ],
    faqs: [
      {
        q: "Cần chú ý mốc thời gian nào nhất khi ôn Tư tưởng Hồ Chí Minh?",
        a: "Giai đoạn 1911–1920 (tìm đường cứu nước), 7/1920 (đọc Luận cương Lênin), 12/1920 (tham gia sáng lập ĐCS Pháp), 1921–1930 (hình thành tư tưởng cơ bản qua Đường Kách mệnh & Cương lĩnh đầu tiên).",
      },
      {
        q: "Câu nói nổi tiếng 'Đoàn kết, đoàn kết, đại đoàn kết...' của Bác nhấn mạnh điều gì?",
        a: "Nhấn mạnh đại đoàn kết toàn dân tộc là chiến lược lâu dài, quyết định thành công của cách mạng ('Thành công, thành công, đại thành công').",
      },
    ],
    relatedTools: [
      { label: "Tính điểm GPA Đại học", href: "/cong-cu/tinh-diem-gpa-dai-hoc" },
    ],
  },
  {
    slug: "lich-su-dang",
    hub: "dai-hoc",
    name: "Lịch Sử Đảng Cộng Sản Việt Nam (Đại Học)",
    shortName: "Lịch sử Đảng CSVN",
    badge: "2 Tín chỉ • Lý luận chính trị",
    seoTitle: "Đề Thi Trắc Nghiệm Lịch Sử Đảng Cộng Sản Việt Nam Có Đáp Án",
    seoDescription:
      "Ôn tập trắc nghiệm Lịch sử Đảng Cộng sản Việt Nam (1930 đến nay): Các kỳ Đại hội Đảng, Cao trào 1930–1945, Kháng chiến 1945–1975 và Công cuộc Đổi mới từ 1986.",
    keywords: [
      "trắc nghiệm lịch sử đảng",
      "đề thi lịch sử đảng cộng sản việt nam",
      "ôn thi lịch sử đảng đại học",
    ],
    description:
      "Học phần hệ thống hóa sự ra đời của Đảng Cộng sản Việt Nam (1930) và quá trình Đảng lãnh đạo cách mạng qua các giai đoạn đấu tranh giải phóng dân tộc, thống nhất đất nước và Đổi mới toàn diện.",
    duration: "50–60 phút",
    maxScore: "10 điểm",
    totalQuestionsLabel: "40–50 câu trắc nghiệm mốc sự kiện & nghị quyết",
    formatLabel: "Trắc nghiệm 4 lựa chọn",
    targetAudience: "Sinh viên đại học năm 2–4 các trường khối ngành kinh tế, kỹ thuật, xã hội",
    universities: ["NEU", "VNU", "UEH", "AOF", "HUST", "FPT"],
    topics: [
      "Chương 1: Đảng ra đời & Lãnh đạo đấu tranh giành chính quyền (1930–1945)",
      "Chương 2: Lãnh đạo hai cuộc kháng chiến chống Pháp và chống Mỹ (1945–1975)",
      "Chương 3: Lãnh đạo cả nước quá độ lên CNXH & Công cuộc Đổi mới (1975 đến nay)",
      "So sánh nội dung Cương lĩnh tháng 2/1930 và Luận cương tháng 10/1930",
    ],
    structure: [
      {
        part: "Chương 1 (1930–1945)",
        content: "Cương lĩnh 2/1930, Luận cương 10/1930, các cao trào 30-31, 36-39, 39-45",
        questionCount: "~35% đề thi",
        scoreWeight: "3.5 điểm",
      },
      {
        part: "Chương 2 (1945–1975)",
        content: "Chỉ thị Kháng chiến kiến quốc, Đại hội II, Đại hội III, Nghị quyết 15",
        questionCount: "~35% đề thi",
        scoreWeight: "3.5 điểm",
      },
      {
        part: "Chương 3 (1975–nay)",
        content: "Đại hội VI (Đổi mới 1986), Cương lĩnh 1991, Cương lĩnh 2011, các Đại hội gần đây",
        questionCount: "~30% đề thi",
        scoreWeight: "3.0 điểm",
      },
    ],
    questions: [
      {
        id: "lsd-q1",
        part: 1,
        question:
          "Văn kiện nào sau đây được coi là Cương lĩnh chính trị đầu tiên của Đảng Cộng sản Việt Nam?",
        options: [
          "Luận cương chính trị tháng 10/1930",
          "Chính cương vắn tắt, Sách lược vắn tắt và Chương trình tóm tắt (2/1930)",
          "Nghị quyết Hội nghị Trung ương 8 (5/1941)",
          "Chỉ thị 'Nhật - Pháp bắn nhau và hành động của chúng ta' (3/1945)",
        ],
        answer: 1,
        explanation:
          "Tại Hội nghị thành lập Đảng đầu năm 1930, các văn kiện Chính cương vắn tắt, Sách lược vắn tắt, Chương trình tóm tắt do Nguyễn Ái Quốc soạn thảo hợp thành Cương lĩnh chính trị đầu tiên của Đảng.",
      },
      {
        id: "lsd-q2",
        part: 1,
        question:
          "Đại hội nào của Đảng Cộng sản Việt Nam được đánh dấu là Đại hội khởi xướng đường lối Đổi mới toàn diện đất nước?",
        options: [
          "Đại hội lần thứ V (1982)",
          "Đại hội lần thứ VI (12/1986)",
          "Đại hội lần thứ VII (1991)",
          "Đại hội lần thứ VIII (1996)",
        ],
        answer: 1,
        explanation:
          "Đại hội đại biểu toàn quốc lần thứ VI (tháng 12/1986) đã nhìn thẳng vào sự thật, xóa bỏ cơ chế tập trung quan liêu bao cấp và đề ra đường lối Đổi mới toàn diện.",
      },
      {
        id: "lsd-q3",
        part: 1,
        question:
          "Trong Chỉ thị 'Kháng chiến kiến quốc' (25/11/1945), Đảng ta xác định kẻ thù chính trước mắt của nhân dân Việt Nam lúc bấy giờ là ai?",
        options: [
          "Quân đội Tưởng Giới Thạch",
          "Thực dân Pháp xâm lược",
          "Phát xít Nhật chưa giải giáp",
          "Đế quốc Mỹ",
        ],
        answer: 1,
        explanation:
          "Chỉ thị Kháng chiến kiến quốc xác định rõ: 'Kẻ thù chính của ta lúc này là thực dân Pháp xâm lược, phải tập trung ngọn lửa đấu tranh vào chúng'.",
      },
    ],
    faqs: [
      {
        q: "Làm sao phân biệt các kỳ Đại hội Đảng từ Đại hội I đến XIII?",
        a: "Gắn mỗi Đại hội với 1 từ khóa cốt lõi: Đại hội I (1935 - khôi phục), II (1951 - kháng chiến thắng lợi, ra hoạt động công khai), III (1960 - 2 chiến lược hai miền), IV (1976 - cả nước đi lên CNXH), VI (1986 - Đổi mới), VII (1991 - Cương lĩnh 91).",
      },
      {
        q: "Điểm khác biệt lớn nhất giữa Cương lĩnh 2/1930 và Luận cương 10/1930 là gì?",
        a: "Cương lĩnh 2/1930 đặt nhiệm vụ giải phóng dân tộc lên hàng đầu và đoàn kết rộng rãi các giai cấp yêu nước; Luận cương 10/1930 nặng về đấu tranh giai cấp và cách mạng ruộng đất.",
      },
    ],
    relatedTools: [
      { label: "Tính điểm GPA Đại học", href: "/cong-cu/tinh-diem-gpa-dai-hoc" },
    ],
  },
  {
    slug: "chu-nghia-xa-hoi-khoa-hoc",
    hub: "dai-hoc",
    name: "Chủ Nghĩa Xã Hội Khoa Học (Đại Học)",
    shortName: "CNXH Khoa học",
    badge: "2 Tín chỉ • Lý luận chính trị",
    seoTitle: "Đề Thi Trắc Nghiệm Chủ Nghĩa Xã Hội Khoa Học Có Đáp Án",
    seoDescription:
      "Bộ đề trắc nghiệm Chủ nghĩa xã hội khoa học (7 chương): Sứ mệnh lịch sử của giai cấp công nhân, Thời kỳ quá độ, Dân chủ XHCN, Cơ cấu xã hội giai cấp, Dân tộc & Tôn giáo, Gia đình.",
    keywords: [
      "trắc nghiệm chủ nghĩa xã hội khoa học",
      "đề thi cnxhkh có đáp án",
      "ôn thi cnxhkh đại học",
    ],
    description:
      "Môn học trang bị những luận điểm khoa học về sứ mệnh lịch sử của giai cấp công nhân, quy luật hình thành chủ nghĩa xã hội, nền dân chủ XHCN và chính sách dân tộc, tôn giáo, gia đình ở Việt Nam.",
    duration: "50 phút",
    maxScore: "10 điểm",
    totalQuestionsLabel: "40–50 câu trắc nghiệm",
    formatLabel: "Trắc nghiệm 4 lựa chọn",
    targetAudience: "Sinh viên đại học năm 2 các trường trên toàn quốc",
    universities: ["NEU", "VNU", "UEH", "AOF", "HUBT", "HUST"],
    topics: [
      "Chương 1–2: Nhập môn & Sứ mệnh lịch sử của giai cấp công nhân",
      "Chương 3: Chủ nghĩa xã hội và thời kỳ quá độ lên CNXH",
      "Chương 4: Dân chủ xã hội chủ nghĩa và Nhà nước XHCN",
      "Chương 5: Cơ cấu xã hội - giai cấp và liên minh giai cấp, tầng lớp",
      "Chương 6–7: Vấn đề dân tộc, tôn giáo và gia đình trong thời kỳ quá độ",
    ],
    structure: [
      {
        part: "Chương 1–3: Giai cấp công nhân & CNXH",
        content: "Đặc điểm giai cấp công nhân, điều kiện ra đời CNXH, đặc trưng thời kỳ quá độ",
        questionCount: "~40% đề thi",
        scoreWeight: "4.0 điểm",
      },
      {
        part: "Chương 4–5: Dân chủ & Liên minh giai cấp",
        content: "Bản chất dân chủ XHCN, liên minh Công - Nông - Trí thức",
        questionCount: "~30% đề thi",
        scoreWeight: "3.0 điểm",
      },
      {
        part: "Chương 6–7: Dân tộc, Tôn giáo & Gia đình",
        content: "Cương lĩnh dân tộc Lênin, nguyên tắc giải quyết tôn giáo, chức năng gia đình",
        questionCount: "~30% đề thi",
        scoreWeight: "3.0 điểm",
      },
    ],
    questions: [
      {
        id: "cnxh-q1",
        part: 1,
        question:
          "Theo quan điểm của Chủ nghĩa Mác - Lênin, nguyên nhân sâu xa quy định sứ mệnh lịch sử của giai cấp công nhân là do đâu?",
        options: [
          "Giai cấp công nhân có số lượng đông đảo nhất trong xã hội",
          "Địa vị kinh tế - xã hội của giai cấp công nhân gắn với nền đại công nghiệp hiện đại",
          "Giai cấp công nhân bị bóc lột nặng nề nhất trong lịch sử",
          "Giai cấp công nhân có trình độ học vấn cao nhất",
        ],
        answer: 1,
        explanation:
          "Giai cấp công nhân là sản phẩm của nền đại công nghiệp, đại diện cho phương thức sản xuất tiên tiến và lực lượng sản xuất hiện đại nhất — đây là điều kiện khách quan quy định sứ mệnh lịch sử của họ.",
      },
      {
        id: "cnxh-q2",
        part: 1,
        question:
          "Trong Cương lĩnh dân tộc của V.I. Lênin, ba nguyên tắc cơ bản về vấn đề dân tộc bao gồm:",
        options: [
          "Các dân tộc hoàn toàn bình đẳng; được quyền tự quyết; liên hiệp công nhân tất cả các dân tộc",
          "Các dân tộc tự do kinh doanh; tự trị lãnh thổ; giữ gìn bản sắc văn hóa",
          "Đoàn kết dân tộc; bình đẳng tôn giáo; hội nhập quốc tế",
          "Ưu tiên dân tộc đa số; tự quyết văn hóa; hòa hợp giai cấp",
        ],
        answer: 0,
        explanation:
          "Cương lĩnh dân tộc của Lênin gồm 3 nội dung kinh điển: (1) Các dân tộc hoàn toàn bình đẳng; (2) Các dân tộc được quyền tự quyết; (3) Liên hiệp công nhân tất cả các dân tộc.",
      },
      {
        id: "cnxh-q3",
        part: 1,
        question:
          "Ở Việt Nam hiện nay, khối liên minh nền tảng trong thời kỳ quá độ lên CNXH bao gồm những giai cấp, tầng lớp nào?",
        options: [
          "Giai cấp công nhân, giai cấp nông dân và đội ngũ doanh nhân",
          "Giai cấp công nhân, giai cấp nông dân và đội ngũ trí thức",
          "Giai cấp nông dân, tầng lớp tiểu tư sản và thanh niên",
          "Giai cấp công nhân và tầng lớp tư sản dân tộc",
        ],
        answer: 1,
        explanation:
          "Liên minh giữa giai cấp công nhân với giai cấp nông dân và đội ngũ trí thức dưới sự lãnh đạo của Đảng là nền tảng của khối đại đoàn kết toàn dân tộc.",
      },
    ],
    faqs: [
      {
        q: "Nên học CNXHKH theo trọng tâm nào để đạt điểm A?",
        a: "Nắm chắc 3 phát kiến vĩ đại của Mác-Ăngghen (trong đó có Sứ mệnh lịch sử giai cấp công nhân), 6 đặc trưng cơ bản của CNXH Việt Nam, bản chất của Nhà nước XHCN và Cương lĩnh dân tộc Lênin.",
      },
    ],
    relatedTools: [
      { label: "Tính điểm GPA Đại học", href: "/cong-cu/tinh-diem-gpa-dai-hoc" },
    ],
  },
  {
    slug: "xac-suat-thong-ke",
    hub: "dai-hoc",
    name: "Xác Suất Thống Kê (Đại Học)",
    shortName: "Xác suất thống kê",
    badge: "3 Tín chỉ • Toán ứng dụng",
    seoTitle: "Đề Thi Trắc Nghiệm Xác Suất Thống Kê Đại Học Có Đáp Án & Công Thức",
    seoDescription:
      "Ôn thi Xác suất thống kê đại học (NEU, HUST, UEH, VNU, FPT): Công thức Bayes, Biến ngẫu nhiên rời rạc & liên tục, Phân phối chuẩn/Nhị thức/Poisson, Ước lượng khoảng và Kiểm định giả thuyết.",
    keywords: [
      "trắc nghiệm xác suất thống kê",
      "đề thi xác suất thống kê đại học",
      "bài tập xác suất thống kê có đáp án",
    ],
    description:
      "Môn toán nền tảng bắt buộc cho sinh viên Kinh tế, Kỹ thuật, Khoa học Dữ liệu và Y Dược. Bộ đề kết hợp câu hỏi lý thuyết phân phối và bài tập tính toán xác suất, khoảng tin cậy, kiểm định giả thuyết.",
    duration: "60–90 phút",
    maxScore: "10 điểm",
    totalQuestionsLabel: "25–40 câu trắc nghiệm tính toán & lý thuyết",
    formatLabel: "Trắc nghiệm + Điền đáp số làm tròn",
    targetAudience: "Sinh viên khối Kinh tế, CNTT, Kỹ thuật, Tài chính - Ngân hàng",
    universities: ["NEU", "HUST", "UEH", "AOF", "VNU", "FPT"],
    topics: [
      "Biến cố ngẫu nhiên, Công thức xác suất đầy đủ & Công thức Bayes",
      "Biến ngẫu nhiên, Kỳ vọng E(X), Phương sai Var(X)",
      "Các quy luật phân phối thông dụng (Nhị thức B(n,p), Poisson P(λ), Chuẩn N(μ,σ²))",
      "Lý thuyết mẫu, Ước lượng điểm & Khoảng tin cậy",
      "Kiểm định giả thuyết thống kê (Kiểm định Z, t-test, Chi-square)",
    ],
    structure: [
      {
        part: "Phần 1: Xác suất cơ bản",
        content: "Giải tích tổ hợp, xác suất có điều kiện, công thức Bayes",
        questionCount: "~30% đề thi",
        scoreWeight: "3.0 điểm",
      },
      {
        part: "Phần 2: Biến ngẫu nhiên & Phân phối",
        content: "E(X), Var(X), phân phối Nhị thức, Poisson, Chuẩn tắc",
        questionCount: "~35% đề thi",
        scoreWeight: "3.5 điểm",
      },
      {
        part: "Phần 3: Thống kê suy diễn",
        content: "Ước lượng trung bình/tỷ lệ và Kiểm định giả thuyết H0/H1",
        questionCount: "~35% đề thi",
        scoreWeight: "3.5 điểm",
      },
    ],
    questions: [
      {
        id: "xstk-q1",
        part: 1,
        question:
          "Cho biến ngẫu nhiên X tuân theo phân phối nhị thức B(n = 20; p = 0,4). Kỳ vọng E(X) và phương sai Var(X) lần lượt bằng bao nhiêu?",
        options: [
          "E(X) = 8; Var(X) = 4,8",
          "E(X) = 8; Var(X) = 3,2",
          "E(X) = 12; Var(X) = 4,8",
          "E(X) = 0,4; Var(X) = 0,24",
        ],
        answer: 0,
        explanation:
          "Với X ~ B(n, p), ta có E(X) = n·p = 20 × 0,4 = 8; và Var(X) = n·p·(1 - p) = 20 × 0,4 × 0,6 = 4,8.",
      },
      {
        id: "xstk-q2",
        part: 1,
        question:
          "Khi kiểm định giả thuyết thống kê với mức ý nghĩa α = 0,05 và giá trị quan sát p-value = 0,018, kết luận nào sau đây là chính xác?",
        options: [
          "Chưa đủ cơ sở bác bỏ giả thuyết H0",
          "Bác bỏ giả thuyết H0, chấp nhận đối thuyết H1",
          "Giả thuyết H0 đúng với xác suất 95%",
          "Cần tăng mức ý nghĩa α lên 0,10 để kiểm định lại",
        ],
        answer: 1,
        explanation:
          "Quy tắc p-value: Nếu p-value < α (ở đây 0,018 < 0,05), ta bác bỏ giả thuyết không H0 ở mức ý nghĩa 5%.",
      },
      {
        id: "xstk-q3",
        part: 3,
        question:
          "[Bài tập tính nhanh] Một nhà máy có 2 phân xưởng I và II sản xuất lần lượt 60% và 40% tổng sản phẩm. Tỷ lệ phế phẩm của phân xưởng I là 2%, của phân xưởng II là 5%. Chọn ngẫu nhiên 1 sản phẩm của nhà máy. Xác suất để sản phẩm đó là phế phẩm bằng bao nhiêu? (Viết dạng số thập phân)",
        answer: "0.032",
        acceptedAnswers: ["0.032", "0,032", "3.2%", "3,2%"],
        explanation:
          "Áp dụng công thức xác suất đầy đủ: P(A) = 0,6 × 0,02 + 0,4 × 0,05 = 0,012 + 0,020 = 0,032 (tức 3,2%).",
      },
    ],
    faqs: [
      {
        q: "Làm sao nhớ nhanh khi nào dùng phân phối Student (t) thay vì phân phối Chuẩn (Z) khi ước lượng trung bình?",
        a: "Dùng Z khi đã biết phương sai tổng thể σ² hoặc cỡ mẫu lớn (n ≥ 30). Dùng t(n-1) khi chưa biết σ² (chỉ có độ lệch chuẩn mẫu s) và cỡ mẫu nhỏ (n < 30) với tổng thể phân phối chuẩn.",
      },
    ],
    relatedTools: [
      { label: "Tính điểm GPA Đại học", href: "/cong-cu/tinh-diem-gpa-dai-hoc" },
    ],
  },
  {
    slug: "kinh-te-vi-mo",
    hub: "dai-hoc",
    name: "Kinh Tế Vi Mô (Đại Học)",
    shortName: "Kinh tế vi mô",
    badge: "3 Tín chỉ • Nền tảng Kinh tế",
    seoTitle: "Đề Thi Trắc Nghiệm Kinh Tế Vi Mô Có Đáp Án (NEU, UEH, FTU, AOF)",
    seoDescription:
      "Luyện thi trắc nghiệm Kinh tế vi mô (Microeconomics) đầy đủ lý thuyết & bài tập tính toán: Cung - Cầu, Độ co giãn, Lựa chọn người tiêu dùng, Chi phí sản xuất và Cấu trúc thị trường.",
    keywords: [
      "trắc nghiệm kinh tế vi mô",
      "đề thi kinh tế vi mô có đáp án",
      "bài tập kinh tế vi mô neu ueh",
    ],
    description:
      "Học phần cốt lõi của khối ngành Kinh tế - Quản trị, phân tích hành vi ra quyết định của người tiêu dùng, doanh nghiệp và cơ chế cân bằng trên các loại hình thị trường cạnh tranh hoàn hảo, độc quyền.",
    duration: "60–75 phút",
    maxScore: "10 điểm",
    totalQuestionsLabel: "40–50 câu trắc nghiệm lý thuyết & bài tập đồ thị/hàm số",
    formatLabel: "Trắc nghiệm 4 lựa chọn + Tính toán",
    targetAudience: "Sinh viên khối Kinh tế, Tài chính, Marketing, Quản trị kinh doanh",
    universities: ["NEU", "UEH", "FTU", "AOF", "TMU", "VNU"],
    topics: [
      "Cung, Cầu, Cân bằng thị trường & Chính sách giá trần/giá sàn",
      "Độ co giãn của cầu theo giá (ED), theo thu nhập (EI) & chéo (EXY)",
      "Lý thuyết hành vi người tiêu dùng (Lợi ích cận biên MU, Đường bàng quan)",
      "Lý thuyết sản xuất, Chi phí ngắn hạn (MC, ATC, AVC) & Cực đại hóa lợi nhuận",
      "Thị trường Cạnh tranh hoàn hảo vs Độc quyền thuần túy (MR = MC)",
    ],
    structure: [
      {
        part: "Cung - Cầu & Độ co giãn",
        content: "Cân bằng thị trường, thuế/trợ cấp, độ co giãn điểm & khoảng",
        questionCount: "~35% đề thi",
        scoreWeight: "3.5 điểm",
      },
      {
        part: "Người tiêu dùng & Chi phí SX",
        content: "Tối đa hóa độ thỏa dụng MUx/Px = MUy/Py, chi phí MC cắt ATC tại min",
        questionCount: "~35% đề thi",
        scoreWeight: "3.5 điểm",
      },
      {
        part: "Cấu trúc thị trường",
        content: "Quy tắc tối đa hóa lợi nhuận P = MC (CTHH) và MR = MC (Độc quyền)",
        questionCount: "~30% đề thi",
        scoreWeight: "3.0 điểm",
      },
    ],
    questions: [
      {
        id: "vimo-q1",
        part: 1,
        question:
          "Nếu độ co giãn của cầu theo giá đối với một mặt hàng có trị tuyệt đối |ED| = 2,5 (cầu co giãn nhiều), doanh nghiệp muốn tăng tổng doanh thu (TR) thì nên làm gì?",
        options: [
          "Tăng giá bán sản phẩm",
          "Giảm giá bán sản phẩm",
          "Giữ nguyên giá bán",
          "Giảm sản lượng cung ứng",
        ],
        answer: 1,
        explanation:
          "Khi |ED| > 1 (cầu co giãn nhiều theo giá), phần trăm tăng lượng cầu lớn hơn phần trăm giảm giá, nên giảm giá bán sẽ làm tổng doanh thu TR = P × Q tăng lên.",
      },
      {
        id: "vimo-q2",
        part: 1,
        question:
          "Trong ngắn hạn, đường chi phí cận biên (MC) luôn cắt đường tổng chi phí bình quân (ATC) tại điểm nào?",
        options: [
          "Tại điểm cực đại của ATC",
          "Tại điểm cực tiểu (giá trị nhỏ nhất) của ATC",
          "Tại gốc tọa độ",
          "Luôn nằm dưới đường ATC",
        ],
        answer: 1,
        explanation:
          "Theo quy luật toán học của hàm bình quân và hàm cận biên: Khi MC < ATC thì ATC đang giảm; khi MC > ATC thì ATC đang tăng; do đó MC cắt ATC đúng tại điểm cực tiểu của ATC.",
      },
      {
        id: "vimo-q3",
        part: 3,
        question:
          "[Bài tập Vi mô] Cho hàm cầu thị trường là Q_D = 100 - 2P và hàm cung thị trường là Q_S = 20 + 2P. Mức giá cân bằng P* trên thị trường bằng bao nhiêu?",
        answer: "20",
        acceptedAnswers: ["20", "20.0", "20,0"],
        explanation:
          "Tại trạng thái cân bằng thị trường: Q_D = Q_S <=> 100 - 2P = 20 + 2P <=> 4P = 80 <=> P* = 20 (lượng cân bằng Q* = 60).",
      },
    ],
    faqs: [
      {
        q: "Điều kiện tối đa hóa lợi nhuận chung cho mọi doanh nghiệp là gì?",
        a: "Doanh thu cận biên bằng chi phí cận biên (MR = MC). Riêng trên thị trường cạnh tranh hoàn hảo, vì giá P không đổi nên MR = P, suy ra quy tắc P = MC.",
      },
    ],
    relatedTools: [
      { label: "Tính điểm GPA Đại học", href: "/cong-cu/tinh-diem-gpa-dai-hoc" },
    ],
  },
];

/* ============================================================================
 * 3. TUYỂN SINH VÀO LỚP 10 (5 PAGES)
 * ========================================================================== */
export const GRADE10_EXAMS: ExtendedExamEntry[] = [
  {
    slug: "toan-vao-10",
    hub: "vao-10",
    name: "Đề Thi Tuyển Sinh Toán Vào Lớp 10",
    shortName: "Toán vào lớp 10",
    badge: "GDPT 2018 • Toán lớp 9",
    seoTitle: "Đề Thi Thử Toán Vào Lớp 10 Chuẩn GDPT 2018 Có Đáp Án Chi Tiết",
    seoDescription:
      "Bộ đề ôn thi Toán vào lớp 10 (từ lớp 9 lên 10) bám sát chương trình GDPT 2018: Rút gọn biểu thức, Giải bài toán bằng cách lập phương trình, Xác suất thống kê, Hàm số bậc hai và Hình học đường tròn.",
    keywords: [
      "đề thi toán vào lớp 10",
      "ôn thi toán vào 10 có đáp án",
      "đề thi thử toán 9 lên 10",
    ],
    description:
      "Tổng hợp các dạng bài trọng tâm môn Toán thi tuyển sinh vào lớp 10 theo chương trình GDPT 2018: bổ sung mạnh các bài toán thực tế, thống kê - xác suất bên cạnh Đại số và Hình học phẳng truyền thống.",
    duration: "120 phút",
    maxScore: "10 điểm",
    totalQuestionsLabel: "5 bài toán lớn (hoặc kết hợp trắc nghiệm + tự luận tùy tỉnh)",
    formatLabel: "Tự luận / Trắc nghiệm kết hợp Tự luận",
    targetAudience: "Học sinh lớp 9 ôn thi vào lớp 10 THPT công lập và trường chuyên",
    topics: [
      "Thống kê mô tả, Tần số tương đối & Xác suất biến cố thực nghiệm",
      "Căn thức bậc hai, Rút gọn biểu thức & Hệ phương trình bậc nhất hai ẩn",
      "Phương trình bậc hai, Hệ thức Vi-ét & Giải bài toán thực tế",
      "Hình học không gian thực tế (Hình trụ, Hình nón, Hình cầu)",
      "Đường tròn, Góc nội tiếp, Tứ giác nội tiếp & Chứng minh tiếp tuyến",
    ],
    structure: [
      {
        part: "Bài 1: Thống kê - Xác suất & Căn thức",
        content: "Tính tần số tương đối, xác suất đơn giản và rút gọn biểu thức chứa căn",
        questionCount: "2–3 ý",
        scoreWeight: "2.0–2.5 điểm",
      },
      {
        part: "Bài 2 & 3: Lập phương trình & Vi-ét",
        content: "Bài toán năng suất/chuyển động/lãi suất và ứng dụng định lý Vi-ét",
        questionCount: "2 bài",
        scoreWeight: "3.5–4.0 điểm",
      },
      {
        part: "Bài 4 & 5: Hình học & Vận dụng cao",
        content: "Thể tích hình trụ/nón/cầu, chứng minh tứ giác nội tiếp và bài toán cực trị",
        questionCount: "2 bài",
        scoreWeight: "3.5–4.0 điểm",
      },
    ],
    questions: [
      {
        id: "t10-q1",
        part: 1,
        question:
          "Cho phương trình bậc hai x^2 - 5x + 6 = 0 có hai nghiệm phân biệt x_1, x_2. Giá trị của biểu thức x_1^2 + x_2^2 bằng bao nhiêu?",
        options: ["13", "25", "19", "11"],
        answer: 0,
        explanation:
          "Theo hệ thức Vi-ét: x_1 + x_2 = 5 và x_1·x_2 = 6. Suy ra x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1x_2 = 5^2 - 2·6 = 25 - 12 = 13.",
      },
      {
        id: "t10-q2",
        part: 1,
        question:
          "Một hình trụ có bán kính đáy R = 3 cm và chiều cao h = 5 cm. Thể tích của hình trụ đó bằng bao nhiêu (tính theo π)?",
        options: ["15π cm³", "30π cm³", "45π cm³", "75π cm³"],
        answer: 2,
        explanation:
          "Thể tích hình trụ V = π·R^2·h = π × 3^2 × 5 = 45π (cm³).",
      },
      {
        id: "t10-q3",
        part: 3,
        question:
          "[Bài toán thực tế] Một đội xe theo kế hoạch chở hết 120 tấn hàng trong một số ngày quy định. Thực tế mỗi ngày đội chở vượt mức 5 tấn nên đã hoàn thành sớm hơn kế hoạch 2 ngày. Theo kế hoạch, mỗi ngày đội xe chở bao nhiêu tấn hàng?",
        answer: "15",
        acceptedAnswers: ["15", "15 tấn", "15.0"],
        unit: "tấn",
        explanation:
          "Gọi x (tấn/ngày, x > 0) là số hàng chở theo kế hoạch. Ta có phương trình: 120/x - 120/(x + 5) = 2 <=> 120(x + 5) - 120x = 2x(x + 5) <=> x^2 + 5x - 300 = 0 <=> (x - 15)(x + 20) = 0. Vì x > 0 nên x = 15 tấn/ngày.",
      },
    ],
    faqs: [
      {
        q: "Chương trình GDPT 2018 có điểm mới nào trong đề Toán vào lớp 10?",
        a: "Đề thi đưa thêm nội dung Thống kê - Xác suất (tần số, biểu đồ, xác suất cổ điển) và các bài toán thực tế gắn với đời sống như tính lãi suất, cước taxi, thể tích vật thể.",
      },
    ],
    relatedTools: [
      { label: "Đếm ngược ngày thi vào 10", href: "/cong-cu/dem-nguoc-ngay-thi-2027" },
    ],
  },
  {
    slug: "tieng-anh-vao-10",
    hub: "vao-10",
    name: "Đề Thi Tuyển Sinh Tiếng Anh Vào Lớp 10",
    shortName: "Tiếng Anh vào lớp 10",
    badge: "40 Câu • Chuẩn GDPT 2018",
    seoTitle: "Đề Thi Tuyển Sinh Tiếng Anh Vào Lớp 10 Có Đáp Án & Giải Thích",
    seoDescription:
      "Luyện đề thi Tiếng Anh vào lớp 10 mới nhất: Ngữ âm, Trọng âm, Ngữ pháp, Giao tiếp, Đọc hiểu biển báo/đoạn văn, Sắp xếp đoạn hội thoại và Viết lại câu.",
    keywords: [
      "đề thi tiếng anh vào lớp 10",
      "ôn thi tiếng anh vào 10 có đáp án",
      "trắc nghiệm tiếng anh lớp 9",
    ],
    description:
      "Bộ đề ôn thi Tiếng Anh vào lớp 10 cập nhật các dạng bài mới nhất theo chương trình Global Success / Friends Plus: phát âm, tìm lỗi sai, đọc hiểu biển báo, điền từ đoạn văn và sắp xếp câu.",
    duration: "60 phút",
    maxScore: "10 điểm",
    totalQuestionsLabel: "40 câu (0.25 điểm/câu)",
    formatLabel: "Trắc nghiệm khách quan 4 lựa chọn",
    targetAudience: "Học sinh lớp 9 ôn thi vào lớp 10 THPT trên cả nước",
    topics: [
      "Phát âm (-ed, -s/es, nguyên âm/phụ âm) & Trọng âm từ 2–3 âm tiết",
      "Các thì động từ, Câu điều kiện, Câu ước (Wish) & Câu bị động",
      "Mệnh đề quan hệ, Liên từ (Although/Despite) & Cụm động từ (Phrasal verbs)",
      "Đọc hiểu biển báo/thông báo ngắn & Đọc hiểu điền từ (Cloze test)",
      "Viết lại câu đồng nghĩa & Sắp xếp trật tự đoạn văn/hội thoại",
    ],
    structure: [
      {
        part: "Ngữ âm & Trọng âm",
        content: "Phân biệt cách phát âm và dấu nhấn trọng âm",
        questionCount: "4 câu",
        scoreWeight: "1.0 điểm",
      },
      {
        part: "Từ vựng - Ngữ pháp - Giao tiếp",
        content: "Hoàn thành câu, tìm từ đồng nghĩa/trái nghĩa, hội thoại ngắn",
        questionCount: "14–16 câu",
        scoreWeight: "3.5–4.0 điểm",
      },
      {
        part: "Đọc hiểu & Biển báo",
        content: "Đọc biển báo thực tế, điền từ vào đoạn văn & trả lời câu hỏi đọc hiểu",
        questionCount: "14–16 câu",
        scoreWeight: "3.5–4.0 điểm",
      },
      {
        part: "Viết câu & Sắp xếp",
        content: "Viết lại câu giữ nguyên nghĩa hoặc ghép câu",
        questionCount: "4–6 câu",
        scoreWeight: "1.0–1.5 điểm",
      },
    ],
    questions: [
      {
        id: "ta10-q1",
        part: 1,
        question:
          "Choose the word whose stress pattern differs from the other three:\nA. environment\nB. traditional\nC. community\nD. generation",
        options: ["environment", "traditional", "community", "generation"],
        answer: 3,
        explanation:
          "Các từ 'environment', 'traditional', 'community' đều nhấn âm tiết thứ 2; riêng 'generation' (đuôi -tion, có âm phụ trước đó) nhấn âm tiết thứ 3 (/ˌdʒen.əˈreɪ.ʃən/).",
      },
      {
        id: "ta10-q2",
        part: 1,
        question:
          "My younger brother wishes he _____ fluently in English so he could talk to foreign tourists.",
        options: ["speaks", "could speak", "has spoken", "will speak"],
        answer: 1,
        explanation:
          "Câu ước ở hiện tại (Wish + S + V2/ed hoặc could + V_inf) diễn tả điều ước không có thật ở hiện tại.",
      },
      {
        id: "ta10-q3",
        part: 1,
        question:
          "_____ the heavy rain, the students arrived at the exam venue on time.",
        options: ["Although", "Because", "Despite", "Because of"],
        answer: 2,
        explanation:
          "'the heavy rain' là một cụm danh từ (không phải mệnh đề), và hai vế mang nghĩa nhượng bộ trái ngược nhau nên dùng 'Despite' (hoặc 'In spite of'). 'Although' phải đi với mệnh đề S + V.",
      },
    ],
    faqs: [
      {
        q: "Cấu trúc đề Tiếng Anh vào 10 năm 2026–2027 có xuất hiện dạng bài mới nào?",
        a: "Nhiều Sở GD&ĐT (như Hà Nội, TP.HCM) đã đưa thêm dạng câu hỏi đọc hiểu biển báo/thông báo thực tế, sắp xếp câu thành đoạn văn/lá thư hoàn chỉnh và câu hỏi đọc hiểu ghép câu vào chỗ trống.",
      },
    ],
    relatedTools: [
      { label: "Đếm ngược ngày thi vào 10", href: "/cong-cu/dem-nguoc-ngay-thi-2027" },
    ],
  },
  {
    slug: "ngu-van-vao-10",
    hub: "vao-10",
    name: "Đề Thi Tuyển Sinh Ngữ Văn Vào Lớp 10",
    shortName: "Ngữ văn vào lớp 10",
    badge: "Ngữ liệu ngoài SGK • GDPT 2018",
    seoTitle: "Đề Thi Ngữ Văn Vào Lớp 10 Chuẩn Ngữ Liệu Mới Có Hướng Dẫn Giải",
    seoDescription:
      "Cấu trúc đề thi Ngữ văn vào lớp 10 theo chương trình GDPT 2018 sử dụng 100% ngữ liệu ngoài sách giáo khoa: Đọc hiểu văn bản (4đ) và Viết đoạn/bài nghị luận (6đ).",
    keywords: [
      "đề thi ngữ văn vào lớp 10",
      "đọc hiểu ngữ văn lớp 9",
      "nghị luận văn học vào 10 gdpt 2018",
    ],
    description:
      "Theo quy định đổi mới của Bộ GD&ĐT, đề thi Ngữ văn vào lớp 10 dùng 100% ngữ liệu ngoài sách giáo khoa (thơ, truyện ngắn, văn bản thông tin/nghị luận) để đánh giá thực chất năng lực đọc hiểu và viết sáng tạo của học sinh.",
    duration: "120 phút",
    maxScore: "10 điểm",
    totalQuestionsLabel: "Phần I Đọc hiểu (4.0đ) + Phần II Viết (6.0đ)",
    formatLabel: "Đọc hiểu ngắn + Viết đoạn văn & Bài văn nghị luận",
    targetAudience: "Học sinh lớp 9 ôn thi vào lớp 10 theo chương trình GDPT 2018",
    topics: [
      "Nhận diện thể thơ, ngôi kể, biện pháp tu từ & phương thức biểu đạt",
      "Kỹ năng viết đoạn văn nghị luận văn học (200 chữ) phân tích thơ/truyện ngoài SGK",
      "Kỹ năng viết bài văn nghị luận xã hội (400–600 chữ) giải quyết vấn đề đời sống",
      "Phân tích đặc điểm văn bản thông tin & văn bản nghị luận",
    ],
    structure: [
      {
        part: "Phần I: Đọc hiểu văn bản",
        content: "4–5 câu hỏi nhận biết, thông hiểu, vận dụng từ ngữ liệu ngoài SGK",
        questionCount: "4–5 câu",
        scoreWeight: "4.0 điểm",
      },
      {
        part: "Phần II: Viết (Nghị luận)",
        content: "Câu 1: Viết đoạn văn (~200 chữ, 2.0đ); Câu 2: Viết bài văn (~400–600 chữ, 4.0đ)",
        questionCount: "2 câu viết",
        scoreWeight: "6.0 điểm",
      },
    ],
    questions: [
      {
        id: "van10-q1",
        part: 1,
        question:
          "Trong câu thơ: 'Tre xanh xanh tự bao giờ / Chuyện ngày xưa đã có bờ tre xanh' (Nguyễn Duy), biện pháp tu từ nào được sử dụng nổi bật qua cách dùng từ 'xanh' lặp lại và gắn với hình ảnh lịch sử?",
        options: [
          "Điệp từ và Nhân hóa / Ẩn dụ biểu tượng",
          "Nói quá và Chơi chữ",
          "Liệt kê và Đảo ngữ",
          "So sánh ngang bằng",
        ],
        answer: 0,
        explanation:
          "Từ 'xanh' được điệp lại 3 lần gợi sức sống trường tồn bất diệt; hình ảnh 'bờ tre xanh' ẩn dụ/biểu tượng cho làng quê và lịch sử bền bỉ của dân tộc Việt Nam.",
      },
      {
        id: "van10-q2",
        part: 2,
        context:
          "Xét kỹ năng làm bài Đọc hiểu & Viết Ngữ văn vào lớp 10 theo Chương trình GDPT 2018:",
        subQuestions: [
          {
            id: "van10-q2-a",
            text: "Ngữ liệu đưa vào đề thi chính thức sẽ không trùng lặp với các văn bản đã học trong 3 bộ sách giáo khoa.",
            isCorrect: true,
            explanation: "Bộ GD&ĐT quy định dùng ngữ liệu ngoài SGK để chống học vẹt, chép văn mẫu.",
          },
          {
            id: "van10-q2-b",
            text: "Khi viết đoạn văn 200 chữ, thí sinh không được xuống dòng giữa chừng và phải đảm bảo đúng dung lượng.",
            isCorrect: true,
            explanation: "Đoạn văn bắt đầu bằng chữ cái viết hoa lùi đầu dòng và kết thúc bằng dấu chấm xuống dòng.",
          },
          {
            id: "van10-q2-c",
            text: "Trong bài nghị luận xã hội, thí sinh chỉ cần nêu ý kiến cá nhân mà không cần dẫn chứng thực tế.",
            isCorrect: false,
            explanation: "Dẫn chứng xác thực, tiêu biểu là yêu cầu bắt buộc giúp bài nghị luận xã hội có sức thuyết phục.",
          },
          {
            id: "van10-q2-d",
            text: "Khi nêu tác dụng của biện pháp tu từ, cần chỉ rõ cả hai mặt: giá trị gợi hình/gợi cảm (nghệ thuật) và thông điệp tư tưởng (nội dung).",
            isCorrect: true,
            explanation: "Trả lời đủ 3 ý (gọi tên + chỉ ra từ ngữ + nêu tác dụng nghệ thuật/nội dung) mới đạt điểm tối đa.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Làm sao ôn Ngữ văn vào 10 hiệu quả khi đề ra ngữ liệu ngoài SGK?",
        a: "Thay vì học thuộc lòng văn mẫu, hãy rèn chắc công thức đọc hiểu theo thể loại (thơ tự do, thơ song thất lục bát, truyện ngắn, văn bản thông tin) và nắm vững khung dàn ý đoạn văn/bài văn nghị luận.",
      },
    ],
    relatedTools: [
      { label: "Đếm ngược ngày thi vào 10", href: "/cong-cu/dem-nguoc-ngay-thi-2027" },
    ],
  },
  {
    slug: "de-thi-vao-10-ha-noi",
    hub: "vao-10",
    name: "Đề Thi Tuyển Sinh Vào Lớp 10 Hà Nội",
    shortName: "Vào lớp 10 Hà Nội",
    badge: "Sở GD&ĐT Hà Nội • 3 Môn",
    seoTitle: "Đề Thi Tuyển Sinh Vào Lớp 10 Hà Nội (Toán, Văn, Anh) Có Đáp Án",
    seoDescription:
      "Cập nhật cấu trúc đề minh họa tuyển sinh lớp 10 Sở GD&ĐT Hà Nội (Toán, Ngữ văn, Tiếng Anh): cách tính điểm xét tuyển hệ số 1 đều nhau, dạng bài mới và đề thi thử.",
    keywords: [
      "đề thi vào 10 hà nội",
      "cấu trúc đề thi vào 10 sở hà nội",
      "điểm chuẩn lớp 10 hà nội",
    ],
    description:
      "Kỳ thi tuyển sinh lớp 10 THPT công lập tại Hà Nội gồm 3 môn bắt buộc: Toán, Ngữ văn và Ngoại ngữ (Tiếng Anh), tất cả đều tính hệ số 1 (tổng điểm tối đa 30 điểm) theo quy chế mới.",
    duration: "Toán 120' • Văn 120' • Anh 60'",
    maxScore: "30 điểm (3 môn hệ số 1)",
    totalQuestionsLabel: "Toán & Văn tự luận • Tiếng Anh 40 câu trắc nghiệm",
    formatLabel: "Sở GD&ĐT Hà Nội",
    targetAudience: "Học sinh lớp 9 dự thi vào các trường THPT công lập & chuyên tại Hà Nội",
    topics: [
      "Toán Hà Nội: Thống kê - Xác suất, Rút gọn căn thức, Giải bài toán thực tế, Hình đường tròn",
      "Tiếng Anh Hà Nội: Dạng mới Biển báo, Sắp xếp đoạn văn & Đọc hiểu ghép câu",
      "Ngữ văn Hà Nội: Đọc hiểu (4đ) + Viết đoạn NLVH (2đ) + Bài văn NLXH (4đ)",
      "Cách tính điểm xét tuyển 3 môn hệ số 1 (tối đa 30 điểm)",
    ],
    structure: [
      {
        part: "Môn Toán (120 phút)",
        content: "5 bài tự luận: Thống kê/Xác suất, Rút gọn, Thực tế/Vi-ét, Hình không gian & Đường tròn",
        questionCount: "5 bài",
        scoreWeight: "10 điểm (Hệ số 1)",
      },
      {
        part: "Môn Ngữ văn (120 phút)",
        content: "Đọc hiểu ngữ liệu ngoài SGK + Viết đoạn văn & Bài văn nghị luận",
        questionCount: "2 phần",
        scoreWeight: "10 điểm (Hệ số 1)",
      },
      {
        part: "Môn Tiếng Anh (60 phút)",
        content: "40 câu trắc nghiệm (bổ sung sắp xếp câu, biển báo, điền đoạn văn)",
        questionCount: "40 câu",
        scoreWeight: "10 điểm (Hệ số 1)",
      },
    ],
    questions: [
      {
        id: "hn10-q1",
        part: 1,
        question:
          "[Tiếng Anh Hà Nội - Biển báo] You see a sign at a school library saying: 'QUIET ZONE — Please switch all mobile devices to silent mode.' What does the sign mean?",
        options: [
          "Students are not allowed to bring any books into the library.",
          "Visitors must turn off or mute their phones to keep the library quiet.",
          "Mobile phones can be used for loud voice calls inside the room.",
          "The library is temporarily closed for device maintenance.",
        ],
        answer: 1,
        explanation:
          "Biển báo yêu cầu chuyển thiết bị di động sang chế độ im lặng ('silent mode') để giữ trật tự trong khu vực thư viện.",
      },
      {
        id: "hn10-q2",
        part: 3,
        question:
          "[Toán Hà Nội - Xác suất] Gieo ngẫu nhiên một con xúc xắc cân đối đồng chất 1 lần. Xác suất để mặt xuất hiện có số chấm là số nguyên tố bằng bao nhiêu? (Nhập phân số tối giản dạng a/b hoặc số thập phân)",
        answer: "0.5",
        acceptedAnswers: ["0.5", "0,5", "1/2"],
        explanation:
          "Không gian mẫu có 6 kết quả {1, 2, 3, 4, 5, 6}. Các số nguyên tố gồm {2, 3, 5} (3 kết quả). Xác suất P = 3/6 = 1/2 = 0,5.",
      },
    ],
    faqs: [
      {
        q: "Hà Nội còn nhân hệ số 2 môn Toán và Văn khi thi vào lớp 10 không?",
        a: "Theo quy chế tuyển sinh THCS và THPT mới của Bộ GD&ĐT áp dụng từ 2025, cả 3 môn Toán, Văn, Ngoại ngữ đều tính hệ số 1 trên thang điểm 30 (không nhân đôi).",
      },
    ],
    relatedTools: [
      { label: "Đếm ngược ngày thi vào 10", href: "/cong-cu/dem-nguoc-ngay-thi-2027" },
    ],
  },
  {
    slug: "de-thi-vao-10-tphcm",
    hub: "vao-10",
    name: "Đề Thi Tuyển Sinh Vào Lớp 10 TP.HCM",
    shortName: "Vào lớp 10 TP.HCM",
    badge: "Sở GD&ĐT TP.HCM • Toán thực tế",
    seoTitle: "Đề Thi Tuyển Sinh Vào Lớp 10 TP.HCM (Toán Thực Tế, Anh, Văn) Có Đáp Án",
    seoDescription:
      "Luyện đề thi tuyển sinh vào lớp 10 TP.HCM nổi tiếng với các bài Toán thực tế đa dạng, đề Tiếng Anh 40 câu có Word Form/Viết câu và Ngữ văn mở.",
    keywords: [
      "đề thi vào 10 tphcm",
      "toán thực tế vào 10 tphcm",
      "đề thi tiếng anh vào 10 tphcm",
    ],
    description:
      "Đề thi tuyển sinh lớp 10 Sở GD&ĐT TP.HCM đặc trưng bởi tính ứng dụng thực tiễn cao: môn Toán có 4–5 bài toán thực tế, môn Tiếng Anh có phần Word Form & Dictionary Entry, và môn Ngữ văn chú trọng tư duy phản biện.",
    duration: "Toán 120' • Văn 120' • Anh 90'",
    maxScore: "30 điểm (3 môn hệ số 1)",
    totalQuestionsLabel: "Toán 7 bài • Anh 40 câu (90 phút) • Văn 2 phần",
    formatLabel: "Sở GD&ĐT TP.HCM",
    targetAudience: "Học sinh lớp 9 dự thi vào lớp 10 các trường THPT tại TP.HCM",
    topics: [
      "Toán TP.HCM: Parabol, Vi-ét, 4–5 bài toán thực tế (tính tiền điện/nước, khuyến mãi, phần trăm, hình không gian)",
      "Tiếng Anh TP.HCM: 90 phút gồm Trắc nghiệm, Biển báo, Word Form, Dictionary Entry & Viết lại câu",
      "Ngữ văn TP.HCM: Đọc hiểu văn bản tích hợp & Bài nghị luận giàu tính thời sự",
    ],
    structure: [
      {
        part: "Môn Toán (120 phút)",
        content: "7 bài toán (Parabol, Vi-ét, 4 bài toán thực tế, Hình học phẳng)",
        questionCount: "7 bài",
        scoreWeight: "10 điểm",
      },
      {
        part: "Môn Tiếng Anh (90 phút)",
        content: "40 câu: Phát âm, Ngữ pháp, Biển báo, Đọc hiểu, Word Form (6 câu), Tra từ điển (2 câu), Viết câu (4 câu)",
        questionCount: "40 câu",
        scoreWeight: "10 điểm",
      },
      {
        part: "Môn Ngữ văn (120 phút)",
        content: "Đọc hiểu (3–4đ) + Nghị luận xã hội & Nghị luận văn học",
        questionCount: "2 phần",
        scoreWeight: "10 điểm",
      },
    ],
    questions: [
      {
        id: "hcm10-q1",
        part: 3,
        question:
          "[Tiếng Anh TP.HCM - Word Form] Complete the sentence with the correct form of the word in brackets:\n'The city government is investing heavily in ________ public transport to reduce air pollution.' [SUSTAIN]",
        answer: "sustainable",
        acceptedAnswers: ["sustainable", "Sustainable"],
        explanation:
          "Trước cụm danh từ 'public transport' cần một tính từ bổ nghĩa. Danh từ/động từ 'sustain' biến đổi thành tính từ 'sustainable' (bền vững, thân thiện môi trường).",
      },
      {
        id: "hcm10-q2",
        part: 3,
        question:
          "[Toán thực tế TP.HCM] Một cửa hàng niêm yết giá chiếc máy tính cầm tay là 600.000 đồng. Nhân dịp khai giảng, cửa hàng giảm giá 15% cho tất cả học sinh. Bạn An mua chiếc máy tính đó hết bao nhiêu nghìn đồng?",
        answer: "510",
        acceptedAnswers: ["510", "510000", "510.000"],
        unit: "nghìn đồng",
        explanation:
          "Số tiền phải trả = 600 × (100% - 15%) = 600 × 0,85 = 510 nghìn đồng (510.000 đồng).",
      },
    ],
    faqs: [
      {
        q: "Điểm đặc trưng nhất của đề Tiếng Anh vào 10 TP.HCM là gì?",
        a: "Thời gian thi 90 phút và thí sinh phải tự viết phần Word Form (biến đổi từ loại), tự tra mục từ điển (Dictionary Entry) để điền cụm từ phù hợp và viết lại 4 câu tự luận.",
      },
    ],
    relatedTools: [
      { label: "Đếm ngược ngày thi vào 10", href: "/cong-cu/dem-nguoc-ngay-thi-2027" },
    ],
  },
];

/* ============================================================================
 * 4. CHỨNG CHỈ NGOẠI NGỮ & NGHỀ NGHIỆP (8 PAGES)
 * ========================================================================== */
export const CERT_EXAMS: ExtendedExamEntry[] = [
  {
    slug: "toeic",
    hub: "chung-chi",
    name: "Luyện Thi Chứng Chỉ TOEIC (Listening & Reading)",
    shortName: "TOEIC 990",
    badge: "IIG Việt Nam • Thang 990",
    seoTitle: "Đề Thi Thử TOEIC Online Có Đáp Án & Giải Thích Ngữ Pháp Chi Tiết",
    seoDescription:
      "Luyện thi TOEIC chuẩn format ETS mới nhất (Part 5 & Part 6, Part 7): ngữ pháp thương mại, cụm từ cố định (collocations), đọc hiểu email/hợp đồng kèm giải thích chi tiết.",
    keywords: [
      "đề thi thử toeic",
      "luyện thi toeic part 5 6 7",
      "quy đổi điểm toeic",
    ],
    description:
      "Chứng chỉ tiếng Anh giao tiếp quốc tế TOEIC (Test of English for International Communication) chuẩn ETS gồm 200 câu Listening & Reading (120 phút, thang 990), là chuẩn đầu ra bắt buộc tại hầu hết trường đại học và doanh nghiệp.",
    duration: "120 phút (45' Nghe + 75' Đọc)",
    maxScore: "990 điểm",
    totalQuestionsLabel: "200 câu (100 Listening + 100 Reading)",
    formatLabel: "Trắc nghiệm 4 lựa chọn (Part 1–7)",
    targetAudience: "Sinh viên xét chuẩn đầu ra đại học (450–650+) & người đi làm",
    topics: [
      "Part 5 (30 câu): Ngữ pháp câu đơn, từ loại (Word Form), thì, giới từ, liên từ",
      "Part 6 (16 câu): Điền khuyết văn bản thông báo, email công sở (có câu điền cả mệnh đề)",
      "Part 7 (54 câu): Đọc hiểu đơn, đọc hiểu kép & đọc hiểu ba đoạn văn bản",
      "Từ vựng chủ điểm: Văn phòng, Nhân sự, Tài chính, Chuỗi cung ứng, Tiếp thị",
    ],
    structure: [
      {
        part: "Listening (Part 1–4)",
        content: "Mô tả tranh (6), Hỏi-Đáp (25), Hội thoại (39), Bài nói ngắn (30)",
        questionCount: "100 câu",
        scoreWeight: "495 điểm (45 phút)",
      },
      {
        part: "Reading Part 5 & 6",
        content: "Hoàn thành câu & Hoàn thành đoạn văn thương mại",
        questionCount: "46 câu",
        scoreWeight: "Nằm trong 495 điểm Đọc",
      },
      {
        part: "Reading Part 7",
        content: "Đọc hiểu đoạn đơn (29), đoạn đôi (10), đoạn ba (15)",
        questionCount: "54 câu",
        scoreWeight: "Nằm trong 495 điểm Đọc",
      },
    ],
    questions: [
      {
        id: "toeic-q1",
        part: 1,
        question:
          "[TOEIC Part 5] All reimbursement requests must be submitted to the accounting department _____ 14 business days of the travel return date.",
        options: ["within", "during", "between", "among"],
        answer: 0,
        explanation:
          "'within + khoảng thời gian' mang nghĩa 'trong vòng bao lâu' (trong vòng 14 ngày làm việc). 'During' đi với một khoảng/dịp xác định (during the meeting), không đi với số ngày đếm.",
      },
      {
        id: "toeic-q2",
        part: 1,
        question:
          "[TOEIC Part 5] Ms. Tanaka was promoted to Senior Operations Director due to her _____ leadership throughout the factory expansion project.",
        options: ["exception", "except", "exceptional", "exceptionally"],
        answer: 2,
        explanation:
          "Sau tính từ sở hữu 'her' và trước danh từ 'leadership' cần một tính từ bổ nghĩa: 'exceptional' (xuất sắc, vượt trội).",
      },
      {
        id: "toeic-q3",
        part: 1,
        question:
          "[TOEIC Part 5] Should any technical difficulties _____ during the webinar, please contact our IT support desk immediately.",
        options: ["arise", "arose", "arisen", "arising"],
        answer: 0,
        explanation:
          "Đảo ngữ câu điều kiện loại 1: 'Should + S + V_bare_infinitve, ...'. Vì vậy động từ sau chủ ngữ 'any technical difficulties' phải ở dạng nguyên mẫu 'arise'.",
      },
    ],
    faqs: [
      {
        q: "Làm sao tối ưu thời gian 75 phút cho 100 câu TOEIC Reading?",
        a: "Phân bổ thời gian chuẩn: Part 5 tối đa 10–12 phút (20 giây/câu), Part 6 tối đa 8 phút, dành trọn 55 phút còn lại cho Part 7 và không dừng quá lâu ở một câu từ vựng khó.",
      },
      {
        q: "Bằng TOEIC bao nhiêu điểm tương đương bậc B1/B2 khung 6 bậc?",
        a: "Tham chiếu phổ biến: TOEIC 450–500 tương đương B1; TOEIC 600–785 tương đương B2 (tùy quy định từng trường đại học có yêu cầu thêm kỹ năng Speaking & Writing hay không).",
      },
    ],
    relatedTools: [
      { label: "Quy đổi điểm TOEIC ↔ IELTS / THPT", href: "/cong-cu/quy-doi-diem-ielts-dgnl-2027" },
    ],
  },
  {
    slug: "vstep-b1-b2",
    hub: "chung-chi",
    name: "Luyện Thi Chứng Chỉ VSTEP B1 - B2 (Khung 6 Bậc VN)",
    shortName: "VSTEP B1 - B2",
    badge: "Bộ GD&ĐT • 4 Kỹ năng",
    seoTitle: "Đề Thi Thử VSTEP B1 B2 Online (Reading & Use of English) Có Đáp Án",
    seoDescription:
      "Hướng dẫn cấu trúc bài thi VSTEP B1-B2-C1 (30 điểm quy đổi thang 10): Nghe, Đọc hiểu 40 câu, Viết thư & Luận, Nói 3 phần kèm bài tập Đọc hiểu có đáp án.",
    keywords: [
      "đề thi thử vstep b1 b2",
      "cấu trúc đề thi vstep",
      "luyện đọc hiểu vstep",
    ],
    description:
      "VSTEP (Vietnamese Standardized Test of English Proficiency) là kỳ thi đánh giá năng lực tiếng Anh theo Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam (A2, B1, B2, C1), được sử dụng rộng rãi để tốt nghiệp đại học, thi cao học và công chức.",
    duration: "172 phút (4 kỹ năng)",
    maxScore: "10.0 điểm (làm tròn 0.5)",
    totalQuestionsLabel: "Nghe 35 câu • Đọc 40 câu • Viết 2 bài • Nói 3 phần",
    formatLabel: "Thi trên máy tính tại các trường ĐH được Bộ GD&ĐT cấp phép",
    targetAudience: "Sinh viên chuẩn đầu ra B1/B2, học viên cao học, nghiên cứu sinh, viên chức",
    topics: [
      "Listening (40 phút — 35 câu): Thông báo ngắn, Hội thoại & Bài giảng học thuật",
      "Reading (60 phút — 40 câu): 4 bài đọc học thuật (10 câu/bài, tìm ý chính, suy luận, từ vựng)",
      "Writing (60 phút): Task 1 Viết thư/Email (1/3 điểm) + Task 2 Viết bài luận 250 từ (2/3 điểm)",
      "Speaking (12 phút): Tương tác xã hội, Thảo luận giải pháp & Phát triển chủ đề",
    ],
    structure: [
      {
        part: "Reading (Đọc hiểu)",
        content: "4 đoạn văn ~500 từ với câu hỏi chi tiết, tham chiếu, từ đồng nghĩa, suy luận",
        questionCount: "40 câu (60 phút)",
        scoreWeight: "25% tổng điểm (thang 10)",
      },
      {
        part: "Listening (Nghe hiểu)",
        content: "Part 1 (8 câu), Part 2 (12 câu), Part 3 (15 câu)",
        questionCount: "35 câu (40 phút)",
        scoreWeight: "25% tổng điểm (thang 10)",
      },
      {
        part: "Writing & Speaking",
        content: "Viết 2 bài (thư + luận 250 từ) & Nói 3 phần trên máy",
        questionCount: "2 bài + 3 phần",
        scoreWeight: "50% tổng điểm",
      },
    ],
    questions: [
      {
        id: "vstep-q1",
        part: 1,
        question:
          "[VSTEP Reading Strategy] Read the excerpt: 'Urban vertical farms use up to 95% less water than traditional open-field agriculture because nutrient solutions are recirculated in closed-loop hydroponic systems.'\nThe word 'recirculated' is closest in meaning to:",
        options: [
          "wasted completely",
          "cycled and reused continuously",
          "evaporated rapidly",
          "contaminated artificially",
        ],
        answer: 1,
        explanation:
          "'recirculated' trong hệ thống thủy canh khép kín ('closed-loop') có nghĩa là được tuần hoàn, tái sử dụng liên tục.",
      },
      {
        id: "vstep-q2",
        part: 2,
        context:
          "Đọc đoạn thông tin về quy tắc tính điểm VSTEP 3-5 bậc (B1-B2-C1):",
        subQuestions: [
          {
            id: "vstep-q2-a",
            text: "Điểm tổng của VSTEP là trung bình cộng của cả 4 kỹ năng Nghe, Nói, Đọc, Viết (mỗi kỹ năng thang 10) và làm tròn đến 0.5.",
            isCorrect: true,
            explanation: "Mỗi kỹ năng chiếm 25% tổng điểm. Ví dụ trung bình 5.75 làm tròn thành 6.0 (đạt B2).",
          },
          {
            id: "vstep-q2-b",
            text: "Đạt từ 4.0 đến 5.5 điểm trên thang 10 tương ứng với chứng chỉ bậc 3 (B1).",
            isCorrect: true,
            explanation: "B1: 4.0–5.5; B2: 6.0–8.0; C1: 8.5–10.0.",
          },
          {
            id: "vstep-q2-c",
            text: "Trong bài VSTEP Writing, Task 1 (Viết thư) chiếm trọng số điểm cao gấp đôi Task 2 (Viết luận).",
            isCorrect: false,
            explanation: "Ngược lại, Task 2 (Bài luận 250 từ) chiếm 2/3 số điểm Writing, còn Task 1 chiếm 1/3.",
          },
          {
            id: "vstep-q2-d",
            text: "Ở phần Đọc hiểu VSTEP, thí sinh không bị trừ điểm nếu chọn sai nên hãy điền đủ cả 40 câu.",
            isCorrect: true,
            explanation: "VSTEP không áp dụng trừ điểm câu trả lời sai.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Điểm VSTEP bao nhiêu thì đạt B1 và B2?",
        a: "Tính trung bình cộng 4 kỹ năng (làm tròn đến 0.5): từ 4.0–5.5 điểm đạt B1; từ 6.0–8.0 điểm đạt B2; từ 8.5–10.0 điểm đạt C1.",
      },
    ],
    relatedTools: [
      { label: "Quy đổi chứng chỉ Ngoại ngữ", href: "/cong-cu/quy-doi-diem-ielts-dgnl-2027" },
    ],
  },
  {
    slug: "hsk",
    hub: "chung-chi",
    name: "Luyện Thi Chứng Chỉ Tiếng Trung HSK (HSK 1 - HSK 5)",
    shortName: "Tiếng Trung HSK",
    badge: "HSK 1–6 • Hán ngữ Quốc tế",
    seoTitle: "Đề Thi Thử Tiếng Trung HSK Có Đáp Án & Giải Thích Ngữ Pháp Pinyin",
    seoDescription:
      "Ôn thi chứng chỉ HSK (Hanyu Shuiping Kaoshi) cấp độ HSK 3, HSK 4, HSK 5: câu hỏi từ vựng, ngữ pháp trật tự từ, điền từ vào câu và đọc hiểu kèm Pinyin và nghĩa tiếng Việt.",
    keywords: [
      "đề thi thử hsk",
      "luyện thi hsk 3 hsk 4",
      "trắc nghiệm tiếng trung hsk",
    ],
    description:
      "Kỳ thi năng lực Hán ngữ Quốc tế (HSK) đánh giá khả năng sử dụng tiếng Trung trong đời sống, học tập và công việc. Chứng chỉ HSK 4–5 giúp miễn thi ngoại ngữ tốt nghiệp THPT hoặc xin học bổng du học Trung Quốc.",
    duration: "90–125 phút (tùy cấp độ)",
    maxScore: "300 điểm (Đạt ≥ 180/300 từ HSK 3+)",
    totalQuestionsLabel: "80–100 câu (Nghe + Đọc + Viết)",
    formatLabel: "Thi máy tính (IBT) hoặc thi giấy",
    targetAudience: "Học sinh miễn thi THPT (HSK 3+), sinh viên xét học bổng CSC & người đi làm",
    topics: [
      "Ngữ pháp trọng tâm: Chữ 把 (bǎ), 被 (bèi), Bổ ngữ kết quả & Bổ ngữ xu hướng",
      "Phân biệt cặp từ dễ nhầm (还是 vs 或者, 刚才 vs 刚, 一边...一边...)",
      "Sắp xếp từ thành câu hoàn chỉnh (HSK 4 Phần Viết)",
      "Từ vựng HSK 3 (600 từ), HSK 4 (1.200 từ), HSK 5 (2.500 từ)",
    ],
    structure: [
      {
        part: "Phần 1: Nghe hiểu (听力)",
        content: "Nghe câu ngắn, hội thoại và đoạn văn trả lời câu hỏi",
        questionCount: "40–45 câu",
        scoreWeight: "100 điểm",
      },
      {
        part: "Phần 2: Đọc hiểu (阅读)",
        content: "Chọn từ điền vào chỗ trống, sắp xếp trật tự A/B/C và đọc hiểu đoạn văn",
        questionCount: "40–45 câu",
        scoreWeight: "100 điểm",
      },
      {
        part: "Phần 3: Viết (书写 - HSK 3+)",
        content: "Sắp xếp từ thành câu, đặt câu với từ gợi ý kèm tranh",
        questionCount: "10–15 câu",
        scoreWeight: "100 điểm",
      },
    ],
    questions: [
      {
        id: "hsk-q1",
        part: 1,
        question:
          "[HSK 4 - Chọn từ điền chỗ trống] 你今天想喝茶_____喝咖啡？(Nǐ jīntiān xiǎng hē chá _____ hē kāfēi?)",
        options: ["或者 (huòzhě)", "还是 (háishi)", "而且 (érqiě)", "虽然 (suīrán)"],
        answer: 1,
        explanation:
          "Trong câu nghi vấn lựa chọn ('hay là'), tiếng Trung dùng '还是 (háishi)'. '或者 (huòzhě)' chỉ dùng trong câu trần thuật (trừ một số câu gián tiếp).",
      },
      {
        id: "hsk-q2",
        part: 1,
        question:
          "[HSK 4 - Ngữ pháp câu chữ 把] Chọn câu sắp xếp ĐÚNG ngữ pháp từ các cụm từ: 把 (bǎ) / 护照 (hùzhào) / 放进 (fàng jìn) / 他 (tā) / 包里了 (bāo lǐ le).",
        options: [
          "他把护照放进包里了。",
          "他放进把护照包里了。",
          "把护照他放进包里了。",
          "他护照把放进包里了。",
        ],
        answer: 0,
        explanation:
          "Cấu trúc chuẩn câu chữ 把: Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần khác (tại đây là bổ ngữ kết quả '进包里了'). Câu đúng: '他把护照放进包里了。' (Anh ấy đã bỏ hộ chiếu vào trong túi rồi.)",
      },
    ],
    faqs: [
      {
        q: "Cần thi HSK mấy để được miễn thi môn Ngoại ngữ tốt nghiệp THPT?",
        a: "Theo quy định miễn thi bài thi Ngoại ngữ kỳ thi tốt nghiệp THPT của Bộ GD&ĐT (khi còn áp dụng miễn thi), thí sinh cần chứng chỉ HSK cấp độ 3 trở lên còn hạn 2 năm (nên kiểm tra hướng dẫn từng năm của Bộ).",
      },
    ],
    relatedTools: [
      { label: "Tính điểm GPA Đại học", href: "/cong-cu/tinh-diem-gpa-dai-hoc" },
    ],
  },
  {
    slug: "jlpt",
    hub: "chung-chi",
    name: "Luyện Thi Chứng Chỉ Tiếng Nhật JLPT (N5 - N2)",
    shortName: "Tiếng Nhật JLPT",
    badge: "JEES • 2 Kỳ/Năm (T7 & T12)",
    seoTitle: "Đề Thi Thử Tiếng Nhật JLPT (N5, N4, N3, N2) Có Đáp Án & Giải Thích",
    seoDescription:
      "Ôn thi năng lực tiếng Nhật JLPT N5–N2: Kanji (Chữ Hán), Từ vựng (Goi), Ngữ pháp (Bunpou), Đọc hiểu (Dokkai) có giải thích chi tiết bằng tiếng Việt.",
    keywords: [
      "đề thi thử jlpt",
      "luyện thi jlpt n3 n4 n5",
      "trắc nghiệm ngữ pháp tiếng nhật jlpt",
    ],
    description:
      "JLPT (Japanese-Language Proficiency Test) là kỳ thi chứng chỉ tiếng Nhật uy tín nhất thế giới với 5 cấp độ từ N5 (cơ bản) đến N1 (cao cấp), tổ chức 2 đợt mỗi năm vào tháng 7 và tháng 12.",
    duration: "90–170 phút (tùy cấp N5–N1)",
    maxScore: "180 điểm (Đạt theo ngưỡng từng cấp + không liệt phần)",
    totalQuestionsLabel: "Từ vựng/Chữ Hán + Ngữ pháp/Đọc hiểu + Nghe hiểu",
    formatLabel: "Trắc nghiệm 4 lựa chọn trên giấy",
    targetAudience: "Sinh viên ngôn ngữ Nhật, kỹ sư IT BrSE, thực tập sinh & du học sinh Nhật Bản",
    topics: [
      "Moji-Goi (文字・語彙): Cách đọc Kanji, chọn chữ Hán đúng, từ đồng nghĩa",
      "Bunpou (文法): Trợ từ, Chia thể động từ, Kính ngữ (Keigo), Câu ghép dấu sao (★)",
      "Dokkai (読解): Đọc hiểu đoạn ngắn, trung bình, tìm kiếm thông tin",
      "Choukai (聴解): Nghe hiểu phản xạ & hiểu tình huống",
    ],
    structure: [
      {
        part: "Kiến thức ngôn ngữ (Chữ Hán, Từ vựng)",
        content: "Đọc/viết Kanji, nghĩa từ vựng trong ngữ cảnh",
        questionCount: "25–35 câu",
        scoreWeight: "60 điểm (N3–N1)",
      },
      {
        part: "Ngữ pháp & Đọc hiểu",
        content: "Ngữ pháp chọn đáp án, sắp xếp dấu sao ★ và Đọc hiểu",
        questionCount: "30–40 câu",
        scoreWeight: "60 điểm (N3–N1)",
      },
      {
        part: "Nghe hiểu (聴解)",
        content: "Nghe hiểu nhiệm vụ, điểm chính, hội thoại nhanh",
        questionCount: "24–32 câu",
        scoreWeight: "60 điểm",
      },
    ],
    questions: [
      {
        id: "jlpt-q1",
        part: 1,
        question:
          "[JLPT N4/N3 - Ngữ pháp] 日本へ来てから、もう半年（　　）なります。(Nihon e kite kara, mou hantoshi ( ) narimasu.)",
        options: ["に (ni)", "で (de)", "を (o)", "が (ga)"],
        answer: 0,
        explanation:
          "Mẫu câu chỉ sự biến đổi trạng thái thời gian: '[Danh từ thời gian] + に + なります' (đã được/trở thành nửa năm rồi). Do đó chọn trợ từ に.",
      },
      {
        id: "jlpt-q2",
        part: 1,
        question:
          "[JLPT N3 - Kính ngữ] 先生、お忙しいところ、お時間を（　　）いただき、本当にありがとうございました。",
        options: ["作って (tsukutte)", "見て (mite)", "聞いて (kiite)", "行って (itte)"],
        answer: 0,
        explanation:
          "Cụm cố định trong tiếng Nhật lịch sự: 'お時間を作っていただく' (nhận được việc thầy/cô dành thời gian cho mình).",
      },
    ],
    faqs: [
      {
        q: "Điểm liệt trong kỳ thi JLPT được tính như thế nào?",
        a: "Dù tổng điểm vượt qua mức đỗ (ví dụ N3 cần 95/180, N2 cần 90/180), thí sinh vẫn trượt nếu bất kỳ phần thi thành phần nào (Kiến thức ngôn ngữ, Đọc hiểu, Nghe hiểu) đạt dưới điểm liệt tối thiểu (thường là 19/60 điểm).",
      },
    ],
    relatedTools: [
      { label: "Tính điểm GPA Đại học", href: "/cong-cu/tinh-diem-gpa-dai-hoc" },
    ],
  },
  {
    slug: "digital-sat",
    hub: "chung-chi",
    name: "Luyện Thi Digital SAT (College Board) 2027",
    shortName: "Digital SAT 1600",
    badge: "College Board • Adaptive Testing",
    seoTitle: "Đề Thi Thử Digital SAT (Reading & Writing + Math) Có Giải Thích",
    seoDescription:
      "Ôn luyện Digital SAT chuẩn College Board (thang 1600): Reading & Writing (Grammar, Transitions, Craft & Structure) và Math (Algebra, Advanced Math, Desmos tricks).",
    keywords: [
      "đề thi thử digital sat",
      "luyện thi sat 1600",
      "quy đổi điểm sat 2027",
    ],
    description:
      "Digital SAT là bài thi chuẩn hóa thích ứng theo module (Multistage Adaptive Testing) trên ứng dụng Bluebook của College Board, gồm Reading & Writing (800đ) và Math (800đ), được nhiều trường đại học Việt Nam (NEU, FTU, HUST, VNU) và quốc tế xét tuyển thẳng.",
    duration: "134 phút (2 tiếng 14 phút)",
    maxScore: "1.600 điểm (400–1600)",
    totalQuestionsLabel: "98 câu (54 Reading & Writing + 44 Math)",
    formatLabel: "Thi trên máy tính Bluebook (Adaptive 2 Modules mỗi phần)",
    targetAudience: "Học sinh THPT săn học bổng du học Mỹ/Quốc tế & xét tuyển ĐH top đầu VN",
    topics: [
      "Reading & Writing (64 phút — 54 câu): Craft & Structure, Information & Ideas, Standard English Conventions",
      "Math (70 phút — 44 câu): Algebra, Advanced Math, Problem-Solving & Data Analysis, Geometry",
      "Chiến thuật sử dụng máy tính đồ thị Desmos tích hợp giải nhanh hệ & cực trị",
    ],
    structure: [
      {
        part: "Reading & Writing (2 Modules)",
        content: "27 câu × 2 Modules (32 phút/module), đoạn văn ngắn độc lập mỗi câu",
        questionCount: "54 câu",
        scoreWeight: "200–800 điểm",
      },
      {
        part: "Math (2 Modules)",
        content: "22 câu × 2 Modules (35 phút/module), được dùng Desmos suốt bài",
        questionCount: "44 câu",
        scoreWeight: "200–800 điểm",
      },
    ],
    questions: [
      {
        id: "sat-q1",
        part: 1,
        question:
          "[Digital SAT - Standard English Conventions] The bioluminescent fungi discovered in the rainforest emit a faint green glow; _____, researchers believe this light attracts nocturnal insects that help disperse the fungi's spores.",
        options: ["moreover", "however", "nevertheless", "instead"],
        answer: 0,
        explanation:
          "Vế sau bổ sung thêm thông tin mở rộng về chức năng sinh học của ánh sáng xanh vừa nêu ở vế trước, nên dùng từ nối bổ sung 'moreover' (hơn thế nữa).",
      },
      {
        id: "sat-q2",
        part: 3,
        question:
          "[Digital SAT Math - Student-Produced Response] In the xy-plane, the line y = 3x + k passes through the point (4, 17). What is the value of k?",
        answer: "5",
        acceptedAnswers: ["5", "5.0"],
        explanation:
          "Thay x = 4 và y = 17 vào phương trình đường thẳng: 17 = 3(4) + k => 17 = 12 + k => k = 5.",
      },
    ],
    faqs: [
      {
        q: "Cơ chế Adaptive Testing trên Digital SAT hoạt động thế nào?",
        a: "Kết quả làm bài ở Module 1 sẽ quyết định độ khó của Module 2 (Harder hoặc Easier). Để đạt mức điểm cao (1400–1600), thí sinh cần làm rất chắc Module 1 để được phân vào Module 2 nâng cao.",
      },
      {
        q: "SAT bao nhiêu điểm thì có lợi thế xét tuyển tại các đại học Việt Nam?",
        a: "Các trường như NEU, FTU, HUST thường xét tuyển kết hợp từ mức SAT ≥ 1200–1350+; để cạnh tranh các ngành top hoặc học bổng quốc tế, mức mục tiêu thường là 1450–1550+.",
      },
    ],
    relatedTools: [
      { label: "Quy đổi điểm SAT ↔ Thang 30 ĐH", href: "/cong-cu/quy-doi-diem-ielts-dgnl-2027" },
    ],
  },
  {
    slug: "600-cau-gplx",
    hub: "chung-chi",
    name: "Thi Thử 600 Câu Lý Thuyết GPLX (Ô Tô B1, B2, C & Xe Máy A1)",
    shortName: "600 Câu GPLX",
    badge: "Bộ 600 Câu • Có Câu Điểm Liệt",
    seoTitle: "Thi Thử 600 Câu Lý Thuyết Bằng Lái Xe Ô Tô B1 B2 C Có Đáp Án & Mẹo Nhớ",
    seoDescription:
      "Ôn luyện 600 câu hỏi lý thuyết sát hạch giấy phép lái xe (GPLX) hạng B, C, A1 kèm 60 câu điểm liệt, biển báo giao thông đường bộ và giải thích luật mới nhất.",
    keywords: [
      "600 câu hỏi lý thuyết gplx",
      "thi thử bằng lái xe b2",
      "60 câu điểm liệt gplx",
    ],
    description:
      "Bộ đề 600 câu hỏi dùng cho sát hạch cấp giấy phép lái xe cơ giới đường bộ (bao gồm 60 câu hỏi về tình huống mất an toàn giao thông nghiêm trọng — câu điểm liệt). Chỉ cần sai 1 câu điểm liệt sẽ không đạt phần thi lý thuyết.",
    duration: "19–24 phút (tùy hạng A1/B/C)",
    maxScore: "25–40 câu (Đạt ≥ 27/30 với hạng B cũ / theo quy định mới)",
    totalQuestionsLabel: "Bộ chuẩn 600 câu (gồm 60 câu điểm liệt)",
    formatLabel: "Trắc nghiệm trên máy tính tại trung tâm sát hạch",
    targetAudience: "Học viên thi bằng lái xe máy A1, A và ô tô hạng B, C1, C",
    topics: [
      "Khái niệm và Quy tắc giao thông đường bộ (Câu 1–166)",
      "60 câu điểm liệt về tình huống mất an toàn giao thông nghiêm trọng",
      "Hệ thống biển báo hiệu đường bộ: Biển cấm, Biển nguy hiểm, Hiệu lệnh, Chỉ dẫn",
      "Giải các thế sa hình & Thứ tự quyền ưu tiên tại ngã tư (Xe ưu tiên, đường ưu tiên, bên phải trống)",
      "Văn hóa giao thông, Kỹ thuật lái xe & Cấu tạo sửa chữa thông thường",
    ],
    structure: [
      {
        part: "Hạng B (Số tự động / Số sàn)",
        content: "30–35 câu ngẫu nhiên theo cơ cấu 600 câu (bao gồm 1 câu điểm liệt)",
        questionCount: "30–35 câu",
        scoreWeight: "Không sai câu điểm liệt",
      },
      {
        part: "Hạng A1 / A (Xe mô tô)",
        content: "25 câu trong bộ 200–250 câu cơ bản",
        questionCount: "25 câu",
        scoreWeight: "Đạt ≥ 21/25 câu",
      },
    ],
    questions: [
      {
        id: "gplx-q1",
        part: 1,
        question:
          "[Câu điểm liệt] Hành vi điều khiển xe cơ giới chạy quá tốc độ quy định, giành đường, vượt ẩu có bị nghiêm cấm hay không?",
        options: [
          "Bị nghiêm cấm tùy từng tuyến đường",
          "Không bị nghiêm cấm nếu đường vắng",
          "Bị nghiêm cấm",
          "Chỉ bị cấm vào ban đêm",
        ],
        answer: 2,
        explanation:
          "Theo Luật Trật tự, an toàn giao thông đường bộ: Mọi hành vi chạy quá tốc độ quy định, giành đường, vượt ẩu đều bị nghiêm cấm tuyệt đối.",
      },
      {
        id: "gplx-q2",
        part: 1,
        question:
          "Thứ tự các xe đi như thế nào là đúng quy tắc giao thông khi cùng đi vào nơi giao nhau không có vòng xuyến?",
        options: [
          "Xe con → Xe ưu tiên → Xe trên đường ưu tiên",
          "Xe đã vào giao lộ trước → Xe ưu tiên → Xe trên đường ưu tiên → Xe bên phải không vướng",
          "Xe rẽ phải → Xe đi thẳng → Xe rẽ trái",
          "Xe tải → Xe khách → Xe con",
        ],
        answer: 1,
        explanation:
          "Quy tắc 5 bước giải sa hình kinh điển ('Nhất chớm, nhì ưu, tam đường, tứ hướng'): (1) Xe đã vào ngã tư trước; (2) Xe ưu tiên (Chữa cháy, Quân sự, Công an, Cứu thương); (3) Xe trên đường ưu tiên; (4) Bên phải không vướng; (5) Rẽ phải → Đi thẳng → Rẽ trái.",
      },
      {
        id: "gplx-q3",
        part: 1,
        question:
          "Biển báo hình tròn, viền đỏ, nền trắng, trên nền có hình vẽ màu đen là nhóm biển báo nào?",
        options: [
          "Biển báo nguy hiểm",
          "Biển báo cấm",
          "Biển hiệu lệnh",
          "Biển chỉ dẫn",
        ],
        answer: 1,
        explanation:
          "Biển báo cấm có dạng hình tròn (trừ biển Stop hình bát giác), viền đỏ nền trắng hình vẽ đen. Tam giác đều viền đỏ nền vàng là biển nguy hiểm; hình tròn nền xanh lam là biển hiệu lệnh.",
      },
    ],
    faqs: [
      {
        q: "Quy tắc nhớ nhanh 5 bước giải câu hỏi sa hình là gì?",
        a: "Ghi nhớ câu thần chú 'Nhất chớm - Nhì ưu - Tam đường - Tứ hướng': Xe đã chớm vào giao lộ -> Xe ưu tiên (Hỏa - Sự - An - Thương) -> Đường ưu tiên -> Bên phải không vướng -> Hướng đi (Phải - Thẳng - Trái).",
      },
    ],
    relatedTools: [
      { label: "Trộn đề luyện tập 600 câu", href: "/cong-cu/tron-de-trac-nghiem-online" },
    ],
  },
  {
    slug: "tin-hoc-van-phong-mos-cntt",
    hub: "chung-chi",
    name: "Luyện Thi Tin Học Văn Phòng (MOS & Chuẩn Kỹ Năng CNTT)",
    shortName: "Tin học MOS / CNTT",
    badge: "MOS • Chuẩn Thông tư 03",
    seoTitle: "Đề Thi Trắc Nghiệm Tin Học Văn Phòng (Word, Excel, PowerPoint, CNTT Cơ Bản)",
    seoDescription:
      "Bộ câu hỏi trắc nghiệm Tin học văn phòng chuẩn kỹ năng CNTT cơ bản (Thông tư 03) và chứng chỉ MOS Word, Excel, PowerPoint có đáp án và giải thích chi tiết.",
    keywords: [
      "trắc nghiệm tin học văn phòng",
      "đề thi chuẩn kỹ năng cntt cơ bản",
      "ôn thi mos word excel",
    ],
    description:
      "Hệ thống câu hỏi trắc nghiệm chuẩn đầu ra Tin học cho sinh viên và thi viên chức/công chức: kiến thức máy tính cơ bản, sử dụng mạng an toàn, Microsoft Word, hàm Excel (VLOOKUP, INDEX-MATCH, IF, COUNTIF) và PowerPoint.",
    duration: "30–50 phút",
    maxScore: "10 điểm (hoặc 1000 điểm MOS, đạt ≥ 700)",
    totalQuestionsLabel: "30–50 câu trắc nghiệm + thực hành",
    formatLabel: "Trắc nghiệm lý thuyết & thao tác trên máy",
    targetAudience: "Sinh viên xét chuẩn đầu ra Tin học, nhân viên văn phòng & thí sinh thi công chức",
    topics: [
      "Microsoft Word: Styles, Mục lục tự động, Mail Merge, Header/Footer, Ngắt trang/Section Break",
      "Microsoft Excel: Tham chiếu tuyệt đối ($A$1), Hàm IF, SUMIF, COUNTIF, VLOOKUP, PivotTable",
      "Microsoft PowerPoint: Slide Master, Animation, Transition, Trình chiếu chuyên nghiệp",
      "Kiến thức máy tính, Hệ điều hành & An toàn bảo mật Internet",
    ],
    structure: [
      {
        part: "CNTT Cơ bản & Internet",
        content: "Phần cứng, hệ điều hành Windows, lưu trữ đám mây, bảo mật mạng",
        questionCount: "10–15 câu",
        scoreWeight: "30% bài lý thuyết",
      },
      {
        part: "Microsoft Word & PowerPoint",
        content: "Định dạng văn bản hành chính, Mail Merge, Slide Master",
        questionCount: "10–15 câu",
        scoreWeight: "35% bài lý thuyết",
      },
      {
        part: "Microsoft Excel",
        content: "Cú pháp hàm logic, thống kê, tra cứu và xử lý lỗi công thức (#REF!, #N/A, #VALUE!)",
        questionCount: "10–15 câu",
        scoreWeight: "35% bài lý thuyết",
      },
    ],
    questions: [
      {
        id: "mos-q1",
        part: 1,
        question:
          "Trong Microsoft Excel, công thức `=VLOOKUP(A2, $D$2:$F$10, 3, FALSE)` sẽ trả về kết quả như thế nào?",
        options: [
          "Tìm giá trị gần đúng của A2 ở cột F và trả về giá trị ở cột D",
          "Tìm chính xác giá trị A2 ở cột đầu tiên (cột D) của bảng D2:F10 và trả về giá trị tương ứng ở cột thứ 3 (cột F)",
          "Đếm số lần xuất hiện của A2 trong vùng D2:F10",
          "Tính tổng các giá trị ở cột thứ 3 nếu thỏa mãn điều kiện A2",
        ],
        answer: 1,
        explanation:
          "Tham số thứ 4 là `FALSE` (hoặc `0`) yêu cầu tìm kiếm chính xác (exact match) ở cột đầu tiên của vùng tra cứu (`$D$2:$F$10`) và lấy giá trị tại cột thứ `3` (tức cột F).",
      },
      {
        id: "mos-q2",
        part: 1,
        question:
          "Trong Microsoft Word, để một trang nằm giữa tài liệu xoay ngang (Landscape) trong khi các trang khác vẫn giữ hướng dọc (Portrait), bạn cần sử dụng loại ngắt nào?",
        options: [
          "Page Break (Ctrl + Enter)",
          "Section Break (Next Page)",
          "Line Break (Shift + Enter)",
          "Column Break",
        ],
        answer: 1,
        explanation:
          "Hướng giấy (Orientation) và lề trang thuộc về thiết lập Section. Phải dùng Section Break (Next Page) trước và sau trang đó để thay đổi hướng giấy độc lập.",
      },
      {
        id: "mos-q3",
        part: 1,
        question:
          "Trong Excel, lỗi `#N/A` khi dùng hàm `VLOOKUP` hoặc `MATCH` thường có ý nghĩa gì?",
        options: [
          "Chia cho số 0",
          "Công thức chứa tên hàm bị sai chính tả",
          "Không tìm thấy giá trị cần tra cứu trong bảng dữ liệu",
          "Độ rộng cột quá hẹp không hiển thị hết số",
        ],
        answer: 2,
        explanation:
          "`#N/A` (Not Available) báo hiệu giá trị dò tìm (lookup_value) không tồn tại trong cột tìm kiếm. Lỗi `####` là cột quá hẹp; `#DIV/0!` là chia cho 0; `#NAME?` là sai tên hàm.",
      },
    ],
    faqs: [
      {
        q: "Thi chứng chỉ MOS cần đạt tối thiểu bao nhiêu điểm?",
        a: "Thang điểm tối đa của mỗi bài thi MOS (Word, Excel, PowerPoint) là 1000 điểm, thí sinh cần đạt từ 700/1000 điểm trở lên để được cấp chứng chỉ quốc tế của Microsoft.",
      },
    ],
    relatedTools: [
      { label: "Tính điểm GPA Đại học", href: "/cong-cu/tinh-diem-gpa-dai-hoc" },
    ],
  },
  {
    slug: "thi-cong-chuc",
    hub: "chung-chi",
    name: "Ôn Thi Công Chức & Viên Chức (Kiến Thức Chung 60 Câu)",
    shortName: "Thi Công Chức",
    badge: "Vòng 1 • Trắc nghiệm 60 câu",
    seoTitle: "Đề Thi Thử Công Chức Kiến Thức Chung (60 Câu) Có Đáp Án & Căn Cứ Luật",
    seoDescription:
      "Luyện đề trắc nghiệm Vòng 1 Thi tuyển Công chức, Viên chức phần Kiến thức chung: Hiến pháp 2013, Luật Cán bộ Công chức, Luật Viên chức, Cải cách hành chính & Tổ chức bộ máy.",
    keywords: [
      "đề thi công chức kiến thức chung",
      "60 câu trắc nghiệm thi công chức",
      "luật cán bộ công chức trắc nghiệm",
    ],
    description:
      "Bộ câu hỏi ôn thi Vòng 1 (Phần Kiến thức chung — 60 câu trong 60 phút, yêu cầu trả lời đúng từ 30/60 câu trở lên) cho kỳ thi tuyển công chức, viên chức hành chính nhà nước và các bộ ngành.",
    duration: "60 phút",
    maxScore: "60 câu (Đạt ≥ 30/60 câu)",
    totalQuestionsLabel: "60 câu trắc nghiệm kiến thức chung",
    formatLabel: "Trắc nghiệm 4 lựa chọn trên máy tính hoặc giấy",
    targetAudience: "Ứng viên dự thi tuyển Công chức hành chính, Thuế, Hải quan, Kho bạc, Viên chức",
    topics: [
      "Hiến pháp nước CHXHCN Việt Nam năm 2013",
      "Luật Cán bộ, công chức & Luật sửa đổi, bổ sung một số điều",
      "Luật Viên chức & Nghị định về tuyển dụng, sử dụng, quản lý công chức/viên chức",
      "Luật Tổ chức Chính phủ & Luật Tổ chức chính quyền địa phương",
      "Chương trình tổng thể Cải cách hành chính nhà nước giai đoạn 2021–2030",
    ],
    structure: [
      {
        part: "Hệ thống chính trị & Hiến pháp",
        content: "Tổ chức bộ máy Đảng, Quốc hội, Chính phủ, Chính quyền địa phương",
        questionCount: "15–20 câu",
        scoreWeight: "Chiếm ~30% đề",
      },
      {
        part: "Luật Cán bộ, Công chức / Viên chức",
        content: "Nghĩa vụ, quyền, phân loại đánh giá, kỷ luật & thời hiệu xử lý",
        questionCount: "25–30 câu",
        scoreWeight: "Chiếm ~45% đề",
      },
      {
        part: "Cải cách hành chính & Chuyên ngành",
        content: "6 nội dung cải cách hành chính, văn hóa công sở, chuyển đổi số",
        questionCount: "10–15 câu",
        scoreWeight: "Chiếm ~25% đề",
      },
    ],
    questions: [
      {
        id: "cc-q1",
        part: 1,
        question:
          "Theo Luật Cán bộ, công chức (và Luật sửa đổi 2019), công chức được xếp loại chất lượng hàng năm ở mấy mức độ?",
        options: [
          "3 mức độ",
          "4 mức độ",
          "5 mức độ",
          "2 mức độ",
        ],
        answer: 1,
        explanation:
          "Công chức được đánh giá, xếp loại chất lượng theo 4 mức: (1) Hoàn thành xuất sắc nhiệm vụ; (2) Hoàn thành tốt nhiệm vụ; (3) Hoàn thành nhiệm vụ; (4) Không hoàn thành nhiệm vụ.",
      },
      {
        id: "cc-q2",
        part: 1,
        question:
          "Trong Chương trình tổng thể cải cách hành chính nhà nước giai đoạn 2021–2030 (Nghị quyết 76/NQ-CP), cải cách hành chính gồm bao nhiêu nội dung trọng tâm?",
        options: [
          "4 nội dung",
          "5 nội dung",
          "6 nội dung",
          "7 nội dung",
        ],
        answer: 2,
        explanation:
          "Cải cách hành chính gồm 6 nội dung: (1) Cải cách thể chế; (2) Cải cách thủ tục hành chính; (3) Cải cách tổ chức bộ máy hành chính nhà nước; (4) Cải cách chế độ công vụ; (5) Cải cách tài chính công; (6) Xây dựng và phát triển Chính phủ điện tử, Chính phủ số.",
      },
      {
        id: "cc-q3",
        part: 1,
        question:
          "Theo Hiến pháp 2013, nhiệm kỳ của Quốc hội nước CHXHCN Việt Nam là bao nhiêu năm?",
        options: ["4 năm", "5 năm", "6 năm", "3 năm"],
        answer: 1,
        explanation:
          "Điều 71 Hiến pháp 2013 quy định nhiệm kỳ của mỗi khóa Quốc hội là 5 năm (tương tự nhiệm kỳ của Hội đồng nhân dân các cấp cũng là 5 năm).",
      },
    ],
    faqs: [
      {
        q: "Vòng 1 thi tuyển công chức cần đạt bao nhiêu câu để được vào Vòng 2?",
        a: "Thí sinh phải trả lời đúng từ 50% số câu hỏi trở lên ở mỗi phần thi (tức từ 30/60 câu phần Kiến thức chung và từ 15/30 câu phần Ngoại ngữ nếu không thuộc diện miễn) mới đủ điều kiện dự thi Vòng 2.",
      },
    ],
    relatedTools: [
      { label: "Trộn đề luyện thi công chức", href: "/cong-cu/tron-de-trac-nghiem-online" },
    ],
  },
];

export const ALL_EXTENDED_EXAMS: ExtendedExamEntry[] = [
  ...DGNL_EXAMS,
  ...UNIVERSITY_SUBJECTS,
  ...GRADE10_EXAMS,
  ...CERT_EXAMS,
];

export function getExamsByHub(hub: ExtendedExamHubKey): ExtendedExamEntry[] {
  return ALL_EXTENDED_EXAMS.filter((e) => e.hub === hub);
}

export function getExamByHubAndSlug(
  hub: ExtendedExamHubKey,
  slug: string
): ExtendedExamEntry | undefined {
  return ALL_EXTENDED_EXAMS.find((e) => e.hub === hub && e.slug === slug);
}

export function getExtendedPseoPaths(): string[] {
  const hubPaths = Object.values(EXTENDED_HUBS).map((h) => h.path);
  const detailPaths = ALL_EXTENDED_EXAMS.map(
    (entry) => `/de-thi/${entry.hub}/${entry.slug}`
  );
  return [...hubPaths, ...detailPaths];
}
