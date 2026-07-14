export type pseoSubject = {
  slug: string;
  name: string;
  description: string;
  questions: Array<{
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  }>;
};

export type pseoGrade = {
  slug: string;
  name: string;
  label: string;
};

export const SUBJECTS: pseoSubject[] = [
  {
    slug: "toan",
    name: "Toán học",
    description: "Tập hợp đề thi trắc nghiệm Toán học lớp 10, 11, 12 và đề ôn thi THPT Quốc gia bám sát chương trình mới nhất. Cung cấp đáp án và lời giải chi tiết giúp học sinh dễ dàng tự ôn tập.",
    questions: [
      {
        question: "Trong các hàm số sau, hàm số nào đồng biến trên R?",
        options: ["y = x^3 - 3x", "y = x^3 + x", "y = -x^3 + x^2", "y = (x-1)/(x+2)"],
        answer: 1,
        explanation: "Ta có y' = 3x^2 + 1 > 0 với mọi x thuộc R. Do đó hàm số y = x^3 + x đồng biến trên R."
      },
      {
        question: "Cho hình chóp S.ABCD có đáy ABCD là hình vuông cạnh a, SA vuông góc với đáy và SA = a. Tính thể tích khối chóp S.ABCD.",
        options: ["a^3/3", "a^3", "a^3/2", "a^3/6"],
        answer: 0,
        explanation: "Diện tích đáy S = a^2. Chiều cao h = SA = a. Thể tích V = (1/3) * S * h = a^3/3."
      }
    ]
  },
  {
    slug: "tieng-anh",
    name: "Tiếng Anh",
    description: "Tổng hợp các bài kiểm tra từ vựng, ngữ pháp tiếng Anh theo khung năng lực CEFR, đề ôn thi THPT Quốc gia và đề thi thử IELTS/TOEIC chuẩn hóa kèm lời giải ngữ pháp chi tiết.",
    questions: [
      {
        question: "If I _____ you, I would study harder for the upcoming exam.",
        options: ["am", "was", "were", "had been"],
        answer: 2,
        explanation: "Đây là câu điều kiện loại 2, diễn tả một giả định không có thật ở hiện tại. Ta dùng 'were' cho tất cả các ngôi."
      },
      {
        question: "By the time the teacher arrived, the students _____ the classroom.",
        options: ["cleaned", "have cleaned", "had cleaned", "were cleaning"],
        answer: 2,
        explanation: "Hành động dọn dẹp phòng học xảy ra trước hành động giáo viên đến (quá khứ đơn), nên ta dùng thì quá khứ hoàn thành (had cleaned)."
      }
    ]
  },
  {
    slug: "vat-ly",
    name: "Vật lý",
    description: "Ngân hàng đề thi trắc nghiệm Vật lý THPT, ôn tập chuyên đề Dao động cơ, Sóng cơ, Điện xoay chiều bám sát đề minh họa mới nhất kèm giải thích hiện tượng vật lý.",
    questions: [
      {
        question: "Một con lắc lò xo gồm vật nhỏ và lò xo nhẹ có độ cứng k, dao động điều hòa. Chu kỳ dao động của con lắc được tính bằng công thức nào?",
        options: ["T = 2pi * sqrt(m/k)", "T = 2pi * sqrt(k/m)", "T = 1/(2pi) * sqrt(k/m)", "T = 2pi * sqrt(g/l)"],
        answer: 0,
        explanation: "Chu kỳ dao động điều hòa của con lắc lò xo được tính bằng công thức T = 2pi * sqrt(m/k)."
      }
    ]
  },
  {
    slug: "hoa-hoc",
    name: "Hóa học",
    description: "Tài liệu ôn thi trắc nghiệm Hóa học lớp 10, 11, 12, giải bài tập Este, Lipit, Cacbohidrat, Polime có lời giải chi tiết và tóm tắt lý thuyết phản ứng hóa học quan trọng.",
    questions: [
      {
        question: "Chất nào sau đây tác dụng với dung dịch NaOH sinh ra glixerol?",
        options: ["Metyl axetat", "Triolein", "Glucozơ", "Saccarozơ"],
        answer: 1,
        explanation: "Triolein là chất béo (lipit), khi thủy phân trong môi trường kiềm (NaOH) sẽ sinh ra muối của axit béo và glixerol."
      }
    ]
  },
  {
    slug: "lich-su",
    name: "Lịch sử",
    description: "Đề ôn tập trắc nghiệm Lịch sử Việt Nam và thế giới, tổng hợp các mốc lịch sử quan trọng giúp ghi nhớ nhanh các sự kiện phục vụ kỳ thi THPT Quốc gia.",
    questions: [
      {
        question: "Hội nghị thành lập Đảng Cộng sản Việt Nam (2/1930) do ai chủ trì?",
        options: ["Trần Phú", "Nguyễn Ái Quốc", "Ngô Gia Tự", "Lê Hồng Phong"],
        answer: 1,
        explanation: "Hội nghị hợp nhất các tổ chức cộng sản thành lập Đảng Cộng sản Việt Nam họp từ ngày 6/1/1930 tại Cửu Long (Hương Cảng, Trung Quốc) do Nguyễn Ái Quốc chủ trì."
      }
    ]
  }
];

export const GRADES: pseoGrade[] = [
  { slug: "lop-10", name: "Lớp 10", label: "đề kiểm tra Toán, Lý, Hóa lớp 10 bám sát chương trình học" },
  { slug: "lop-11", name: "Lớp 11", label: "tổng hợp đề thi học kỳ 1 và học kỳ 2 lớp 11 chất lượng" },
  { slug: "lop-12", name: "Lớp 12", label: "luyện đề thi thử tốt nghiệp và các chuyên đề trọng tâm lớp 12" },
  { slug: "on-thi-thpt", name: "Ôn thi THPT Quốc gia", label: "bộ đề luyện thi THPT Quốc gia chuẩn cấu trúc minh họa mới nhất" }
];
