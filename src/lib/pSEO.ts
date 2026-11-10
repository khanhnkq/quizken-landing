export interface MultipleChoiceQuestion {
  id: string;
  part: 1;
  question: string;
  options: string[]; // Đúng 4 lựa chọn A, B, C, D
  answer: number; // Chỉ số 0, 1, 2, 3
  explanation: string;
}

export interface TrueFalseSubQuestion {
  id: string;
  text: string;
  isCorrect: boolean; // true = Đúng, false = Sai
  explanation: string;
}

export interface TrueFalseQuestion {
  id: string;
  part: 2;
  context: string;
  subQuestions: TrueFalseSubQuestion[]; // Đúng 4 mệnh đề a, b, c, d
  explanation?: string;
}

export interface ShortAnswerQuestion {
  id: string;
  part: 3;
  question: string;
  answer: string; // Ví dụ "4", "3,5", "12"
  acceptedAnswers: string[]; // Các biến thể chấp nhận: ["4", "4.0", "4,0"]
  unit?: string;
  explanation: string;
}

export type PseoQuestion =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | ShortAnswerQuestion;

export interface PseoSubject {
  slug: string;
  name: string;
  description: string;
  topics: string[]; // Danh sách 3-5 chuyên đề trọng tâm
  questions: PseoQuestion[];
}

// Backward compatibility alias
export type pseoSubject = PseoSubject;

export interface PseoGrade {
  slug: string;
  name: string;
  label: string;
}

// Backward compatibility alias
export type pseoGrade = PseoGrade;

// Type Guard Helpers
export function isMultipleChoice(q: PseoQuestion): q is MultipleChoiceQuestion {
  return q.part === 1;
}

export function isTrueFalse(q: PseoQuestion): q is TrueFalseQuestion {
  return q.part === 2;
}

export function isShortAnswer(q: PseoQuestion): q is ShortAnswerQuestion {
  return q.part === 3;
}

export const SUBJECTS: PseoSubject[] = [
  {
    slug: "toan",
    name: "Toán học",
    description: "Tập hợp đề thi trắc nghiệm Toán học lớp 10, 11, 12 và đề ôn thi tốt nghiệp THPT chuẩn format mới 2026 của Bộ GD&ĐT. Cung cấp đầy đủ 3 phần: Trắc nghiệm 4 lựa chọn, Đúng/Sai lũy tiến và Trả lời ngắn kèm lời giải chi tiết từng bước.",
    topics: [
      "Hàm số, đạo hàm & Khảo sát sự biến thiên",
      "Hình học không gian & Phương pháp tọa độ Oxyz",
      "Nguyên hàm, tích phân và ứng dụng thực tiễn",
      "Xác suất có điều kiện và biến ngẫu nhiên",
      "Khối đa diện và bài toán cực trị thể tích"
    ],
    questions: [
      {
        id: "toan-p1-01",
        part: 1,
        question: "Trong các hàm số sau, hàm số nào đồng biến trên tập số thực R?",
        options: ["y = x^3 - 3x", "y = x^3 + x", "y = -x^3 + x^2", "y = (x - 1)/(x + 2)"],
        answer: 1,
        explanation: "Ta có y' = 3x^2 + 1 > 0 với mọi x thuộc R. Do đó hàm số y = x^3 + x luôn đồng biến trên R."
      },
      {
        id: "toan-p1-02",
        part: 1,
        question: "Cho hình chóp S.ABCD có đáy ABCD là hình vuông cạnh a, cạnh bên SA vuông góc với mặt phẳng đáy và SA = a. Tính thể tích V của khối chóp S.ABCD.",
        options: ["V = a^3 / 3", "V = a^3", "V = a^3 / 2", "V = a^3 / 6"],
        answer: 0,
        explanation: "Diện tích đáy hình vuông S = a^2. Chiều cao h = SA = a. Thể tích khối chóp: V = (1/3) * S * h = (1/3) * a^2 * a = a^3 / 3."
      },
      {
        id: "toan-p2-01",
        part: 2,
        context: "Cho hàm số bậc ba y = f(x) = x^3 - 3x^2 + 2 có đồ thị là (C). Xét tính đúng/sai của các mệnh đề sau:",
        subQuestions: [
          {
            id: "toan-p2-01-a",
            text: "Hàm số đã cho đồng biến trên các khoảng (-∞; 0) và (2; +∞).",
            isCorrect: true,
            explanation: "Ta có đạo hàm y' = 3x^2 - 6x = 3x(x - 2). y' > 0 <=> x < 0 hoặc x > 2. Do đó hàm số đồng biến trên (-∞; 0) và (2; +∞)."
          },
          {
            id: "toan-p2-01-b",
            text: "Điểm cực tiểu của đồ thị hàm số (C) là tọa độ (2; -2).",
            isCorrect: true,
            explanation: "Tại x = 2, ta có y(2) = 2^3 - 3*(2^2) + 2 = 8 - 12 + 2 = -2. Điểm cực tiểu của đồ thị là (2; -2)."
          },
          {
            id: "toan-p2-01-c",
            text: "Đồ thị hàm số (C) nhận điểm I(1; 0) làm tâm đối xứng.",
            isCorrect: true,
            explanation: "Đạo hàm cấp hai y'' = 6x - 6 = 0 <=> x = 1. Khi x = 1 thì y = 0. Đồ thị hàm số bậc ba luôn nhận điểm uốn I(1; 0) làm tâm đối xứng."
          },
          {
            id: "toan-p2-01-d",
            text: "Đường thẳng d: y = -2 cắt đồ thị (C) tại đúng 3 điểm phân biệt.",
            isCorrect: false,
            explanation: "Phương trình hoành độ giao điểm: x^3 - 3x^2 + 2 = -2 <=> (x - 2)^2(x + 1) = 0. Phương trình chỉ có 2 nghiệm phân biệt x = 2 (tiếp xúc) và x = -1 (cắt)."
          }
        ],
        explanation: "Khảo sát sự biến thiên, cực trị, tâm đối xứng và tương giao đồ thị hàm số bậc ba."
      },
      {
        id: "toan-p3-01",
        part: 3,
        question: "Cho hình lăng trụ đứng ABC.A'B'C' có đáy ABC là tam giác vuông cân tại A, AB = AC = 4 cm. Góc giữa đường thẳng A'B và mặt phẳng đáy (ABC) bằng 45 độ. Thể tích khối lăng trụ ABC.A'B'C' bằng bao nhiêu cm^3?",
        answer: "32",
        acceptedAnswers: ["32", "32.0", "32,0"],
        unit: "cm^3",
        explanation: "Diện tích đáy S_ABC = (1/2) * AB * AC = (1/2) * 4 * 4 = 8 cm^2. Vì AA' vuông góc với đáy nên hình chiếu của A'B lên (ABC) là AB, suy ra góc A'BA = 45°. Do đó chiều cao h = AA' = AB * tan(45°) = 4 cm. Thể tích khối lăng trụ: V = S_ABC * AA' = 8 * 4 = 32 cm^3."
      }
    ]
  },
  {
    slug: "tieng-anh",
    name: "Tiếng Anh",
    description: "Tổng hợp bài tập trắc nghiệm Tiếng Anh THPT theo khung năng lực chuẩn 2026: Trắc nghiệm ngữ âm - từ vựng, Đọc hiểu Đúng/Sai đa tầng và Điền từ trả lời ngắn kèm phân tích ngữ pháp chuyên sâu.",
    topics: [
      "Ngữ âm, trọng âm & Quy tắc biến âm",
      "Ngữ pháp ứng dụng & Cấu trúc thì nâng cao",
      "Kỹ năng đọc hiểu & Suy luận thông tin",
      "Từ vựng chủ điểm & Cụm từ cố định (Collocations)",
      "Điền từ & Biến đổi từ loại (Word Formation)"
    ],
    questions: [
      {
        id: "ta-p1-01",
        part: 1,
        question: "Choose the word whose underlined part differs from the other three in pronunciation:\nA. booked\nB. pushed\nC. reached\nD. wanted",
        options: ["booked", "pushed", "reached", "wanted"],
        answer: 3,
        explanation: "Quy tắc phát âm đuôi -ed: 'wanted' phát âm là /ɪd/ (sau âm /t/), trong khi 'booked' (/t/), 'pushed' (/t/), 'reached' (/t/) đều phát âm là /t/ do đi sau phụ âm vô thanh."
      },
      {
        id: "ta-p1-02",
        part: 1,
        question: "If I _____ you, I would take advantage of modern AI learning tools to boost exam scores.",
        options: ["am", "was", "were", "had been"],
        answer: 2,
        explanation: "Câu điều kiện loại 2 diễn tả giả định không có thật ở hiện tại. Động từ 'to be' trong mệnh đề If chuẩn ngữ pháp trang trọng dùng 'were' cho mọi ngôi."
      },
      {
        id: "ta-p2-01",
        part: 2,
        context: "Read the passage and determine whether each statement is True (Đúng) or False (Sai):\n'Artificial Intelligence (AI) is transforming personalized education worldwide. By analyzing individual learning patterns, adaptive algorithms can recommend customized practice sets tailored to each student's pace. However, leading researchers emphasize that AI will complement rather than replace empathetic human teachers, who inspire creativity and cultivate critical thinking.'",
        subQuestions: [
          {
            id: "ta-p2-01-a",
            text: "Adaptive AI algorithms can customize practice exercises to match each student's learning speed.",
            isCorrect: true,
            explanation: "The passage states: 'adaptive algorithms can recommend customized practice sets tailored to each student's pace'."
          },
          {
            id: "ta-p2-01-b",
            text: "Researchers predict that AI will completely replace human classroom instructors in the future.",
            isCorrect: false,
            explanation: "The passage clearly states that 'AI will complement rather than replace empathetic human teachers'."
          },
          {
            id: "ta-p2-01-c",
            text: "Human teachers remain essential for inspiring creativity and cultivating critical thinking.",
            isCorrect: true,
            explanation: "The passage mentions teachers 'who inspire creativity and cultivate critical thinking'."
          },
          {
            id: "ta-p2-01-d",
            text: "The adaptive algorithms mentioned rely solely on standardized tests without analyzing student patterns.",
            isCorrect: false,
            explanation: "The text indicates that the algorithms operate 'By analyzing individual learning patterns'."
          }
        ],
        explanation: "Đoạn văn phân tích vai trò bổ trợ đắc lực của công nghệ AI đối với người học trong khi khẳng định vị thế không thể thay thế của người thầy truyền cảm hứng."
      },
      {
        id: "ta-p3-01",
        part: 3,
        question: "Complete the sentence with the correct form of the word in brackets (write only ONE word):\n'Solar panels and wind turbines provide ________ energy that helps reduce reliance on fossil fuels.' [RENEW]",
        answer: "renewable",
        acceptedAnswers: ["renewable", "Renewable", "RENEWABLE"],
        explanation: "Trước danh từ 'energy' cần một tính từ bổ nghĩa. Từ gốc 'renew' (v) biến đổi thành tính từ là 'renewable' mang nghĩa 'tái tạo được' (renewable energy: năng lượng tái tạo)."
      }
    ]
  },
  {
    slug: "vat-ly",
    name: "Vật lý",
    description: "Bộ đề trắc nghiệm Vật lý THPT định dạng mới bám sát chương trình GDPT 2018: Vật lý nhiệt, Khí lý tưởng, Từ trường và Vật lý hạt nhân với đầy đủ bài tập thực hành, câu hỏi định tính và định lượng.",
    topics: [
      "Vật lý nhiệt & Định luật I Nhiệt động lực học",
      "Khí lý tưởng & Mô hình động học phân tử",
      "Từ trường, cảm ứng điện từ & Sóng điện từ",
      "Vật lý hạt nhân & Năng lượng phân hạch",
      "Thí nghiệm thực hành & Đo lường sai số"
    ],
    questions: [
      {
        id: "vl-p1-01",
        part: 1,
        question: "Hệ thức nào sau đây diễn tả đúng định luật I Nhiệt động lực học theo quy ước dấu về công và nhiệt lượng mà hệ nhận được?",
        options: ["ΔU = A + Q", "ΔU = A - Q", "ΔU = Q - A", "A = ΔU + Q"],
        answer: 0,
        explanation: "Theo định luật I Nhiệt động lực học: Độ biến thiên nội năng ΔU của hệ bằng tổng đại số của công A và nhiệt lượng Q trao đổi: ΔU = A + Q."
      },
      {
        id: "vl-p1-02",
        part: 1,
        question: "Một con lắc lò xo gồm vật nhỏ có khối lượng m và lò xo nhẹ có độ cứng k dao động điều hòa. Chu kỳ dao động T của con lắc được tính theo công thức nào?",
        options: ["T = 2π * √(m/k)", "T = 2π * √(k/m)", "T = (1/2π) * √(m/k)", "T = 2π * √(l/g)"],
        answer: 0,
        explanation: "Chu kỳ dao động điều hòa của con lắc lò xo được xác định bởi công thức T = 2π * √(m/k)."
      },
      {
        id: "vl-p2-01",
        part: 2,
        context: "Một khối khí lý tưởng đơn nguyên tử chứa trong một xilanh kín có pít-tông di động không ma sát. Ban đầu khối khí ở trạng thái 1 có thể tích V1 = 2 lít, áp suất p1 = 10^5 Pa và nhiệt độ T1 = 300 K. Khối khí được đun nóng đẳng áp đến trạng thái 2 có thể tích V2 = 6 lít. Xét tính đúng/sai của các mệnh đề sau:",
        subQuestions: [
          {
            id: "vl-p2-01-a",
            text: "Nhiệt độ tuyệt đối của khối khí ở trạng thái 2 là T2 = 900 K.",
            isCorrect: true,
            explanation: "Quá trình đẳng áp tuân theo định luật Gay-Lussac: V1 / T1 = V2 / T2 => T2 = T1 * (V2 / V1) = 300 * (6 / 2) = 900 K."
          },
          {
            id: "vl-p2-01-b",
            text: "Trong quá trình giãn nở đẳng áp từ trạng thái 1 sang 2, mật độ phân tử khí tăng lên gấp 3 lần.",
            isCorrect: false,
            explanation: "Số lượng phân tử khí N là không đổi. Thể tích tăng từ 2 lít lên 6 lít (gấp 3 lần), do đó mật độ phân tử n = N/V phải giảm đi 3 lần."
          },
          {
            id: "vl-p2-01-c",
            text: "Công do khối khí sinh ra khi đẩy pít-tông giãn nở đẳng áp bằng 400 J.",
            isCorrect: true,
            explanation: "Công chất khí sinh ra trong quá trình đẳng áp: A' = p * ΔV = 10^5 * (6 - 2) * 10^-3 m^3 = 400 J."
          },
          {
            id: "vl-p2-01-d",
            text: "Nếu tiếp tục giữ nguyên thể tích 6 lít và làm nguội khối khí về 300 K thì áp suất cuối cùng là 0,5.10^5 Pa.",
            isCorrect: false,
            explanation: "Biến đổi đẳng tích từ trạng thái 2 (p2 = 10^5 Pa, T2 = 900 K) về T3 = 300 K: p3 / T3 = p2 / T2 => p3 = 10^5 * (300 / 900) = (1/3).10^5 Pa ≈ 0,33.10^5 Pa."
          }
        ],
        explanation: "Vận dụng các định luật chất khí lý tưởng trong quá trình đẳng áp và đẳng tích."
      },
      {
        id: "vl-p3-01",
        part: 3,
        question: "Một ấm điện có công suất tiêu thụ P = 1000 W được dùng để đun sôi 0,8 kg nước từ nhiệt độ 20 °C đến 100 °C. Biết nhiệt dung riêng của nước là c = 4180 J/(kg.K) và hiệu suất nhiệt của ấm là 80%. Thời gian cần thiết để đun sôi lượng nước trên (lấy tròn đến hàng đơn vị theo giây) là bao nhiêu?",
        answer: "334",
        acceptedAnswers: ["334", "334.0", "334,0", "334.4"],
        unit: "giây",
        explanation: "Nhiệt lượng có ích làm nước sôi: Q_ich = m * c * Δt = 0,8 * 4180 * (100 - 20) = 267.520 J. Với hiệu suất H = 80%, nhiệt lượng toàn phần ấm cần cấp: Q_tp = Q_ich / 0,8 = 267.520 / 0,8 = 334.400 J. Thời gian đun: t = Q_tp / P = 334.400 / 1000 = 334,4 giây ≈ 334 giây."
      }
    ]
  },
  {
    slug: "hoa-hoc",
    name: "Hóa học",
    description: "Ngân hàng đề thi Hóa học THPT 2026 cấu trúc cải cách: Este - Lipit, Cacbohidrat, Polime, Pin điện hóa và Hóa học phức chất với hệ thống câu hỏi lý thuyết, thí nghiệm trực quan và bài toán định lượng.",
    topics: [
      "Este - Lipit & Chất giặt rửa tổng hợp",
      "Cacbohidrat & Hợp chất hữu cơ chứa Nitơ",
      "Đại cương kim loại & Cấu tạo phức chất",
      "Pin điện hóa & Hiện tượng điện phân",
      "Polime & Vật liệu tổng hợp hiện đại"
    ],
    questions: [
      {
        id: "hh-p1-01",
        part: 1,
        question: "Chất nào sau đây tác dụng với dung dịch kiềm NaOH đun nóng sinh ra ancol đa chức glixerol?",
        options: ["Metyl axetat", "Triolein", "Glucozơ", "Etyl fomat"],
        answer: 1,
        explanation: "Triolein là chất béo trieste của glixerol và axit oleic. Khi thủy phân trong môi trường kiềm (phản ứng xà phòng hóa) thu được muối natri oleat và glixerol C3H5(OH)3."
      },
      {
        id: "hh-p1-02",
        part: 1,
        question: "Ở điều kiện thường, chất béo nào sau đây tồn tại ở trạng thái lỏng do chứa gốc axit béo không no?",
        options: ["Tripanmitin", "Tristearin", "Triolein", "Axit panmitic"],
        answer: 2,
        explanation: "Triolein (C17H33COO)3C3H5 chứa gốc axit oleic có một liên kết đôi C=C không no nên có nhiệt độ nóng chảy thấp, tồn tại ở thể lỏng (dầu thực vật). Tripanmitin và tristearin là chất béo no thể rắn."
      },
      {
        id: "hh-p2-01",
        part: 2,
        context: "Tiến hành thí nghiệm xà phòng hóa chất béo theo quy trình chuẩn sau:\n- Bước 1: Cho vào bát sứ khoảng 2 ml dầu thực vật và 5 ml dung dịch NaOH 40%.\n- Bước 2: Đun sôi nhẹ hỗn hợp trong khoảng 30 phút, khuấy đều liên tục bằng đũa thủy tinh (thỉnh thoảng thêm vài giọt nước cất để giữ thể tích không đổi).\n- Bước 3: Rót thêm 10 ml dung dịch NaCl bão hòa nóng vào bát sứ, khuấy nhẹ rồi để nguội.\nXét tính đúng/sai của các phát biểu sau:",
        subQuestions: [
          {
            id: "hh-p2-01-a",
            text: "Sau bước 1, hỗn hợp trong bát sứ tách thành hai lớp chất lỏng do dầu thực vật không tan trong dung dịch NaOH.",
            isCorrect: true,
            explanation: "Dầu thực vật nhẹ hơn nước và không tan trong dung dịch NaOH ở nhiệt độ phòng nên phân thành hai lớp rõ rệt."
          },
          {
            id: "hh-p2-01-b",
            text: "Ở bước 2, việc thêm nước cất định kỳ nhằm duy trì thể tích để phản ứng thủy phân diễn ra liên tục và không bị cháy khét.",
            isCorrect: true,
            explanation: "Nước bay hơi trong quá trình đun sôi, việc bù nước cất giúp môi trường phản ứng ổn định và tránh cạn khô chất béo."
          },
          {
            id: "hh-p2-01-c",
            text: "Sau bước 3, lớp chất rắn màu trắng nổi lên trên bề mặt bát sứ chứa chủ yếu là glixerol tinh khiết.",
            isCorrect: false,
            explanation: "Lớp chất rắn màu trắng nổi lên là muối natri của axit béo (xà phòng). Glixerol tan tốt trong nước và dung dịch NaCl nên nằm ở lớp chất lỏng phía dưới."
          },
          {
            id: "hh-p2-01-d",
            text: "Mục đích của việc thêm dung dịch NaCl bão hòa là làm tăng khối lượng riêng của dung dịch giúp xà phòng tách lớp nổi lên hoàn toàn.",
            isCorrect: true,
            explanation: "NaCl bão hòa làm giảm độ tan của muối axit béo (hiệu ứng ion chung) và tăng tỉ trọng dung dịch, khiến xà phòng đông tụ và nổi lên."
          }
        ],
        explanation: "Thực hành thí nghiệm xà phòng hóa chất béo trong chương trình Hóa học 12."
      },
      {
        id: "hh-p3-01",
        part: 3,
        question: "Đun nóng 18 gam glucozơ (C6H12O6) với lượng dư dung dịch AgNO3 trong NH3 đến phản ứng hoàn toàn. Khối lượng bạc kim loại (Ag) tối đa thu được bằng bao nhiêu gam? (Cho H = 1, C = 12, O = 16, Ag = 108)",
        answer: "21.6",
        acceptedAnswers: ["21.6", "21,6", "21.60"],
        unit: "gam",
        explanation: "Số mol glucozơ: n = 18 / 180 = 0,1 mol. Phản ứng tráng bạc: 1 phân tử C6H12O6 tạo ra 2 nguyên tử Ag. Số mol Ag = 2 * 0,1 = 0,2 mol. Khối lượng Ag = 0,2 * 108 = 21,6 gam."
      }
    ]
  },
  {
    slug: "sinh-hoc",
    name: "Sinh học",
    description: "Bộ đề trắc nghiệm Sinh học THPT 2026: Di truyền học phân tử, Đột biến gen, Công nghệ tế bào, Hệ sinh thái và Quy luật tiến hóa sinh học bám sát cấu trúc đề thi tốt nghiệp mới nhất.",
    topics: [
      "Di truyền phân tử & Mã di truyền sinh học",
      "Quy luật di truyền Menđen & Di truyền liên kết",
      "Đột biến gen & Đột biến nhiễm sắc thể",
      "Sinh thái học quần thể & Bảo vệ sinh quyển",
      "Tiến hóa sinh học & Bằng chứng tiến hóa"
    ],
    questions: [
      {
        id: "sh-p1-01",
        part: 1,
        question: "Bộ ba (codon) nào sau đây trên phân tử mARN đóng vai trò khởi đầu dịch mã và mã hóa axit amin Mêtiônin ở sinh vật nhân thực?",
        options: ["5'-AUG-3'", "5'-UAA-3'", "5'-UAG-3'", "5'-UGA-3'"],
        answer: 0,
        explanation: "Codon 5'-AUG-3' là mã mở đầu cho quá trình dịch mã tổng hợp protein ở sinh vật nhân thực (mã hóa Methionine). Các bộ ba UAA, UAG, UGA là mã kết thúc."
      },
      {
        id: "sh-p2-01",
        part: 2,
        context: "Ở một loài thực vật lưỡng bội, xét 2 cặp gen A, a và B, b nằm trên 2 cặp nhiễm sắc thể tương đồng khác nhau. Cho cây P thân cao, hoa đỏ tự thụ phấn, đời F1 thu được tỉ lệ kiểu hình: 9 cây thân cao, hoa đỏ : 3 cây thân cao, hoa trắng : 3 cây thân thấp, hoa đỏ : 1 cây thân thấp, hoa trắng. Xét tính đúng/sai của các mệnh đề sau:",
        subQuestions: [
          {
            id: "sh-p2-01-a",
            text: "Cây thân cao, hoa đỏ ở thế hệ bố mẹ P có kiểu gen dị hợp tử về cả hai cặp gen (AaBb).",
            isCorrect: true,
            explanation: "F1 phân li theo tỉ lệ 9:3:3:1 = 16 tổ hợp = 4 x 4 loại giao tử, chứng tỏ P dị hợp 2 cặp gen phân li độc lập (AaBb)."
          },
          {
            id: "sh-p2-01-b",
            text: "Trong tổng số cây thân cao, hoa đỏ ở thế hệ F1, số cây có kiểu gen đồng hợp chiếm tỉ lệ 1/9.",
            isCorrect: true,
            explanation: "Kiểu hình thân cao, hoa đỏ (A-B-) chiếm 9/16, trong đó cá thể thuần chủng đồng hợp AABB chiếm 1/16. Tỉ lệ thuần chủng trong nhóm này là (1/16) / (9/16) = 1/9."
          },
          {
            id: "sh-p2-01-c",
            text: "Số lượng kiểu gen khác nhau quy định kiểu hình thân cao, hoa trắng ở đời F1 là 4 kiểu gen.",
            isCorrect: false,
            explanation: "Kiểu hình thân cao, hoa trắng có dạng A-bb, chỉ bao gồm 2 kiểu gen là AAbb và Aabb."
          },
          {
            id: "sh-p2-01-d",
            text: "Cho cây thân thấp, hoa đỏ F1 giao phấn với cây thân thấp, hoa trắng, đời con có thể thu được tỉ lệ phân li kiểu hình 1:1.",
            isCorrect: true,
            explanation: "Cây thân thấp hoa đỏ F1 có thể có kiểu gen aaBb. Khi lai phân tích với cây thân thấp hoa trắng (aabb) sẽ tạo ra đời con có tỉ lệ: 1 aaBb : 1 aabb (1 thân thấp, hoa đỏ : 1 thân thấp, hoa trắng)."
          }
        ],
        explanation: "Phân tích quy luật phân li độc lập Menđen và tính toán xác suất con lai thế hệ F1."
      },
      {
        id: "sh-p3-01",
        part: 3,
        question: "Một gen cấu trúc của vi khuẩn có chiều dài L = 4080 Ångström (Å). Biết số nuclêôtit loại Ađênin (A) chiếm 20% tổng số nuclêôtit của gen. Số liên kết hiđrô (H) của gen này bằng bao nhiêu?",
        answer: "3120",
        acceptedAnswers: ["3120", "3120.0", "3120,0"],
        unit: "liên kết",
        explanation: "Tổng số nuclêôtit của gen: N = (2 * L) / 3,4 = (2 * 4080) / 3,4 = 2400 nu. Số nu loại A = T = 20% * 2400 = 480 nu. Số nu loại G = X = 30% * 2400 = 720 nu. Số liên kết hiđrô: H = 2A + 3G = 2 * 480 + 3 * 720 = 960 + 2160 = 3120 liên kết."
      }
    ]
  },
  {
    slug: "lich-su",
    name: "Lịch sử",
    description: "Hệ thống câu hỏi trắc nghiệm Lịch sử Việt Nam và Lịch sử Thế giới hiện đại theo chương trình mới 2026. Bao gồm trắc nghiệm sự kiện, phân tích tư liệu lịch sử Đúng/Sai và xác định mốc thời gian trả lời ngắn.",
    topics: [
      "Lịch sử Việt Nam giai đoạn 1930 - 1945",
      "Kháng chiến chống thực dân Pháp (1945 - 1954)",
      "Kháng chiến chống Mỹ cứu nước (1954 - 1975)",
      "Công cuộc Đổi mới & Hội nhập quốc tế từ 1986",
      "Quan hệ quốc tế và Trật tự thế giới đa cực"
    ],
    questions: [
      {
        id: "ls-p1-01",
        part: 1,
        question: "Hội nghị hợp nhất các tổ chức cộng sản thành lập Đảng Cộng sản Việt Nam (đầu năm 1930) do ai chủ trì?",
        options: ["Trần Phú", "Nguyễn Ái Quốc", "Ngô Gia Tự", "Lê Hồng Phong"],
        answer: 1,
        explanation: "Hội nghị hợp nhất các tổ chức cộng sản họp từ ngày 6/1/1930 tại Cửu Long (Hương Cảng, Trung Quốc) dưới sự chủ trì của lãnh tụ Nguyễn Ái Quốc với tư cách phái viên Quốc tế Cộng sản."
      },
      {
        id: "ls-p1-02",
        part: 1,
        question: "Sự kiện lịch sử nào vào mùa thu năm 1945 đánh dấu sự sụp đổ hoàn toàn của chế độ quân chủ phong kiến tồn tại hàng nghìn năm tại Việt Nam?",
        options: [
          "Khởi nghĩa giành chính quyền thắng lợi ở Hà Nội (19/8/1945)",
          "Vua Bảo Đại đọc Chiếu thoái vị và trao ấn kiếm tại Huế (30/8/1945)",
          "Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Ba Đình (2/9/1945)",
          "Tổng tuyển cử bầu Quốc hội khóa I thành công (6/1/1946)"
        ],
        answer: 1,
        explanation: "Chiều ngày 30/8/1945, trước hàng vạn người dân tại Ngọ Môn (Huế), vua Bảo Đại thoái vị và trao ấn vàng, kiếm bạc cho đại diện Chính phủ Cách mạng, chấm dứt hoàn toàn chế độ phong kiến Việt Nam."
      },
      {
        id: "ls-p2-01",
        part: 2,
        context: "Đọc đoạn trích Nghị quyết Hội nghị lần thứ 8 Ban Chấp hành Trung ương Đảng Cộng sản Đông Dương (tháng 5/1941):\n'Trong lúc này nếu không giải quyết được vấn đề dân tộc giải phóng, không đòi được độc lập, tự do cho toàn thể dân tộc, thì chẳng những toàn thể quốc gia dân tộc còn chịu mãi kiếp ngựa trâu, mà quyền lợi của bộ phận, giai cấp đến vạn năm cũng không đòi lại được.'\nXét tính đúng/sai của các nhận định lịch sử sau:",
        subQuestions: [
          {
            id: "ls-p2-01-a",
            text: "Hội nghị Trung ương 8 (5/1941) do lãnh tụ Nguyễn Ái Quốc trực tiếp chủ trì tại căn cứ Pác Bó (Cao Bằng).",
            isCorrect: true,
            explanation: "Hội nghị họp từ ngày 10 đến ngày 19/5/1941 tại lán Khuổi Nặm, Pác Bó (Hà Quảng, Cao Bằng) do Nguyễn Ái Quốc chủ trì."
          },
          {
            id: "ls-p2-01-b",
            text: "Hội nghị đã hoàn chỉnh chủ trương chuyển hướng chỉ đạo chiến lược: đặt nhiệm vụ giải phóng dân tộc lên hàng đầu.",
            isCorrect: true,
            explanation: "Hội nghị chủ trương tạm gác khẩu hiệu cách mạng ruộng đất, tập trung mũi nhọn chống đế quốc phát xít vì quyền lợi tối cao của toàn dân tộc."
          },
          {
            id: "ls-p2-01-c",
            text: "Hội nghị quyết định thành lập Mặt trận Việt Nam Độc lập Đồng minh (Mặt trận Việt Minh).",
            isCorrect: true,
            explanation: "Mặt trận Việt Minh được thành lập ngày 19/5/1941 để tập hợp mọi tầng lớp nhân dân yêu nước cứu quốc."
          },
          {
            id: "ls-p2-01-d",
            text: "Nghị quyết nhận định thời cơ khởi nghĩa đã chín muồi và ra lệnh phát động Tổng khởi nghĩa vũ trang trên toàn quốc ngay trong năm 1941.",
            isCorrect: false,
            explanation: "Hội nghị xác định khởi nghĩa vũ trang là nhiệm vụ trung tâm nhưng phải đi từ khởi nghĩa từng phần chuẩn bị lực lượng, chưa phát động tổng khởi nghĩa trong năm 1941."
          }
        ],
        explanation: "Ý nghĩa chiến lược của Hội nghị BCH Trung ương Đảng lần thứ 8 trong tiến trình chuẩn bị Cách mạng Tháng Tám."
      },
      {
        id: "ls-p3-01",
        part: 3,
        question: "Chiến dịch Điện Biên Phủ lịch sử kết thúc thắng lợi cuộc kháng chiến chống thực dân Pháp diễn ra liên tục trong bao nhiêu ngày đêm? (Ghi chữ số)",
        answer: "56",
        acceptedAnswers: ["56", "56 ngày", "56 ngày đêm"],
        unit: "ngày đêm",
        explanation: "Chiến dịch Điện Biên Phủ diễn ra từ ngày 13/3/1954 đến ngày 7/5/1954, kéo dài đúng 56 ngày đêm 'khoét núi, ngủ hầm, mưa dầm, cơm vắt' toàn thắng."
      }
    ]
  },
  {
    slug: "dia-ly",
    name: "Địa lý",
    description: "Đề thi trắc nghiệm Địa lý THPT chuẩn ma trận 2026: Phân tích tự nhiên nhiệt đới gió mùa, Địa lý dân cư đô thị, Chuyển dịch cơ cấu ngành kinh tế và Chủ quyền không gian biển đảo Việt Nam.",
    topics: [
      "Địa lý tự nhiên & Thiên nhiên nhiệt đới ẩm gió mùa",
      "Địa lý dân cư, nguồn lao động & Đô thị hóa",
      "Địa lý các ngành nông nghiệp, công nghiệp, dịch vụ",
      "Phát triển kinh tế - xã hội các vùng kinh tế trọng điểm",
      "Khai thác tổng hợp kinh tế biển & An ninh biển đảo"
    ],
    questions: [
      {
        id: "dl-p1-01",
        part: 1,
        question: "Gió mùa Đông Bắc (gió mùa mùa đông) hoạt động ở miền Bắc nước ta có đặc điểm thời tiết điển hình nào sau đây?",
        options: [
          "Nửa đầu mùa lạnh khô, nửa cuối mùa lạnh ẩm có mưa phùn",
          "Nóng ẩm quanh năm kèm mưa rào nhiệt đới diện rộng",
          "Khô nóng gay gắt do tác động của hiệu ứng phơn Tây Nam",
          "Thời tiết ẩm ướt liên tục từ tháng 11 đến hết tháng 4 năm sau"
        ],
        answer: 0,
        explanation: "Nửa đầu mùa đông (tháng 11 - 1), gió đi qua lục địa Trung Hoa khô lạnh. Nửa cuối mùa đông (tháng 2 - 4), khối khí lệch đông qua vịnh Bắc Bộ tích ẩm gây thời tiết lạnh ẩm và mưa phùn ven biển và đồng bằng Bắc Bộ."
      },
      {
        id: "dl-p2-01",
        part: 2,
        context: "Cho bảng số liệu về Quy mô và cơ cấu GDP theo giá hiện hành của Việt Nam (đơn vị: %):\n- Nông, lâm nghiệp, thủy sản: năm 2010 là 18,9%; năm 2022 là 11,9%\n- Công nghiệp và xây dựng: năm 2010 là 38,2%; năm 2022 là 38,3%\n- Dịch vụ: năm 2010 là 42,9%; năm 2022 là 41,3%\n- Thuế sản phẩm trừ trợ cấp sản phẩm: năm 2010 là 0%; năm 2022 là 8,5%\nXét tính đúng/sai của các nhận xét sau về chuyển dịch cơ cấu kinh tế:",
        subQuestions: [
          {
            id: "dl-p2-01-a",
            text: "Tỉ trọng khu vực nông, lâm nghiệp và thủy sản có xu hướng giảm liên tục qua các giai đoạn.",
            isCorrect: true,
            explanation: "Tỉ trọng nông - lâm - thủy sản giảm từ 18,9% (2010) xuống 11,9% (2022), phù hợp với xu thế công nghiệp hóa."
          },
          {
            id: "dl-p2-01-b",
            text: "Khu vực dịch vụ luôn duy trì tỉ trọng lớn nhất trong các ngành kinh tế qua các năm thống kê.",
            isCorrect: true,
            explanation: "Khu vực dịch vụ đạt 42,9% (2010) và 41,3% (2022), luôn là ngành chiếm tỉ lệ cao nhất trong GDP."
          },
          {
            id: "dl-p2-01-c",
            text: "Tỉ trọng nông nghiệp sụt giảm phản ánh giá trị sản xuất tuyệt đối của ngành nông nghiệp nước ta bị giảm sút.",
            isCorrect: false,
            explanation: "Tỉ trọng cơ cấu giảm do công nghiệp và dịch vụ tăng trưởng với tốc độ cao hơn, trong khi giá trị sản lượng tuyệt đối của nông nghiệp Việt Nam vẫn tăng trưởng liên tục."
          },
          {
            id: "dl-p2-01-d",
            text: "Để thể hiện quy mô và cơ cấu GDP của nước ta giữa hai năm 2010 và 2022, biểu đồ thích hợp nhất là biểu đồ tròn có bán kính khác nhau.",
            isCorrect: true,
            explanation: "Quy mô GDP có sự tăng trưởng lớn và cấu trúc gồm các ngành chiếm 100%, do đó biểu đồ tròn có bán kính mở rộng theo quy mô là tối ưu nhất."
          }
        ],
        explanation: "Kỹ năng phân tích bảng số liệu thống kê kinh tế và lựa chọn biểu đồ địa lý chuẩn xác."
      },
      {
        id: "dl-p3-01",
        part: 3,
        question: "Năm 2022, diện tích đất tự nhiên của vùng Đồng bằng sông Hồng là 21.278 km² và dân số là 23,4 triệu người. Hãy tính mật độ dân số của vùng Đồng bằng sông Hồng năm 2022 (làm tròn kết quả đến hàng đơn vị theo người/km²).",
        answer: "1100",
        acceptedAnswers: ["1100", "1100.0", "1100,0"],
        unit: "người/km²",
        explanation: "Mật độ dân số = Số dân / Diện tích = 23.400.000 / 21.278 ≈ 1099,7 người/km². Làm tròn đến hàng đơn vị là 1100 người/km²."
      }
    ]
  },
  {
    slug: "gdkt-pl",
    name: "Giáo dục Kinh tế và Pháp luật",
    description: "Đề thi trắc nghiệm Giáo dục Kinh tế & Pháp luật (GDKT&PL) đổi mới 2026: Vận dụng kiến thức thị trường, cung cầu, lạm phát và giải quyết tình huống pháp luật công dân, quyền lao động và hôn nhân gia đình.",
    topics: [
      "Thị trường, cơ chế giá cả & Quy luật cung - cầu",
      "Lạm phát, thất nghiệp & Chính sách điều tiết kinh tế",
      "Hiến pháp & Hệ thống cơ quan nhà nước CHXHCN Việt Nam",
      "Quyền và nghĩa vụ của công dân về kinh tế & lao động",
      "Pháp luật về bình đẳng giới & Trách nhiệm pháp lý"
    ],
    questions: [
      {
        id: "gdkt-p1-01",
        part: 1,
        question: "Trong nền kinh tế thị trường, khi lượng cung hàng hóa vượt quá lượng cầu hàng hóa (Cung > Cầu), giá cả thị trường thường có xu hướng biến động như thế nào?",
        options: [
          "Giá cả thị trường có xu hướng giảm xuống",
          "Giá cả thị trường có xu hướng tăng đột biến",
          "Giá cả luôn giữ nguyên cố định",
          "Giá cả biến động không phụ thuộc vào cung cầu"
        ],
        answer: 0,
        explanation: "Theo quy luật cung - cầu: Khi lượng cung lớn hơn lượng cầu, người bán cạnh tranh tìm người mua nên giá cả thị trường có xu hướng giảm xuống để kích cầu."
      },
      {
        id: "gdkt-p2-01",
        part: 2,
        context: "Anh Nam (26 tuổi) ký hợp đồng lao động không xác định thời hạn với Công ty sản xuất linh kiện T. Do khó khăn về nguồn linh kiện nhập khẩu, Giám đốc công ty ra quyết định miệng thông báo sa thải anh Nam sau 3 ngày mà không có thỏa thuận hay bồi thường trợ cấp thôi việc. Xét tính đúng/sai của các nhận định pháp luật sau:",
        subQuestions: [
          {
            id: "gdkt-p2-01-a",
            text: "Công ty T đã vi phạm thời hạn báo trước theo quy định của Bộ luật Lao động khi đơn phương chấm dứt hợp đồng.",
            isCorrect: true,
            explanation: "Người sử dụng lao động khi đơn phương chấm dứt hợp đồng không xác định thời hạn phải báo trước ít nhất 45 ngày theo luật định. Thông báo miệng 3 ngày là vi phạm pháp luật."
          },
          {
            id: "gdkt-p2-01-b",
            text: "Hành vi của Giám đốc công ty T được xác định là đơn phương chấm dứt hợp đồng lao động trái pháp luật.",
            isCorrect: true,
            explanation: "Chấm dứt hợp đồng khi không có căn cứ pháp lý và không tuân thủ thủ tục báo trước cấu thành hành vi chấm dứt hợp đồng trái pháp luật."
          },
          {
            id: "gdkt-p2-01-c",
            text: "Anh Nam bắt buộc phải qua bước hòa giải của Hòa giải viên lao động trước khi được quyền nộp đơn khởi kiện ra Tòa án.",
            isCorrect: false,
            explanation: "Theo Điều 188 Bộ luật Lao động 2019, tranh chấp lao động cá nhân về trường hợp bị đơn phương chấm dứt hợp đồng trái luật không bắt buộc phải qua hòa giải cơ sở."
          },
          {
            id: "gdkt-p2-01-d",
            text: "Công ty T có nghĩa vụ phải nhận anh Nam trở lại làm việc và bồi thường khoản tiền tương đương ít nhất 02 tháng tiền lương.",
            isCorrect: true,
            explanation: "Theo Điều 41 Bộ luật Lao động, người sử dụng lao động khi chấm dứt hợp đồng trái pháp luật phải nhận người lao động trở lại làm việc và bồi thường thêm tối thiểu 02 tháng tiền lương theo hợp đồng."
          }
        ],
        explanation: "Áp dụng các quy phạm pháp luật lao động về hợp đồng lao động và trách nhiệm bồi thường thiệt hại."
      },
      {
        id: "gdkt-p3-01",
        part: 3,
        question: "Theo quy định của Bộ luật Hình sự Việt Nam, người từ đủ bao nhiêu tuổi trở lên phải chịu trách nhiệm hình sự về mọi tội phạm do mình thực hiện? (Điền số tuổi)",
        answer: "16",
        acceptedAnswers: ["16", "16 tuổi", "đủ 16 tuổi"],
        unit: "tuổi",
        explanation: "Điều 12 Bộ luật Hình sự 2015 quy định: Người từ đủ 16 tuổi trở lên phải chịu trách nhiệm hình sự về mọi tội phạm, trừ những tội phạm mà Bộ luật này có quy định khác."
      }
    ]
  },
  {
    slug: "tin-hoc",
    name: "Tin học",
    description: "Bộ đề trắc nghiệm Tin học định dạng mới 2026: Lập trình Python ứng dụng, Cơ sở dữ liệu quan hệ và ngôn ngữ truy vấn SQL, Kỹ thuật an toàn thông tin số và Nhận diện mô hình Trí tuệ nhân tạo (AI).",
    topics: [
      "Lập trình Python & Cấu trúc dữ liệu danh sách/từ điển",
      "Cơ sở dữ liệu quan hệ & Ngôn ngữ truy vấn SQL",
      "Mạng máy tính, Internet vạn vật & An toàn thông tin số",
      "Trí tuệ nhân tạo (AI), Học máy & Đạo đức công nghệ",
      "Thiết kế thuật toán & Đánh giá độ phức tạp tính toán"
    ],
    questions: [
      {
        id: "th-p1-01",
        part: 1,
        question: "Trong ngôn ngữ lập trình Python, cho danh sách numbers = [10, 20, 30, 40, 50]. Giá trị của biểu thức lát cắt numbers[1:4] là gì?",
        options: ["[20, 30, 40]", "[10, 20, 30]", "[20, 30, 40, 50]", "[10, 20, 30, 40]"],
        answer: 0,
        explanation: "Cú pháp cắt danh sách list[start:stop] lấy các phần tử từ chỉ số start (1 ứng với 20) đến trước chỉ số stop (4 ứng với 50, không lấy vị trí 4), do đó kết quả là [20, 30, 40]."
      },
      {
        id: "th-p2-01",
        part: 2,
        context: "Quan sát đoạn mã nguồn Python định nghĩa hàm đệ quy tính toán sau:\n```python\ndef mystery(n):\n    if n <= 1:\n        return 1\n    return n * mystery(n - 1)\n```\nXét tính đúng/sai của các nhận định kỹ thuật sau:",
        subQuestions: [
          {
            id: "th-p2-01-a",
            text: "Điều kiện dừng (base case) của hàm đệ quy trên là biểu thức `if n <= 1: return 1`.",
            isCorrect: true,
            explanation: "Khi tham số n giảm về giá trị n <= 1, hàm trả về trực tiếp giá trị 1 và không gọi tiếp đệ quy, giúp hàm kết thúc."
          },
          {
            id: "th-p2-01-b",
            text: "Hàm `mystery(n)` cài đặt thuật toán tính giai thừa của một số nguyên dương n (n!).",
            isCorrect: true,
            explanation: "Hàm nhân n với giá trị của (n-1)!, tương ứng chính xác công thức đệ quy của giai thừa n! = n * (n-1)!."
          },
          {
            id: "th-p2-01-c",
            text: "Giá trị trả về khi thực thi lệnh gọi hàm `mystery(5)` là 120.",
            isCorrect: true,
            explanation: "5! = 5 * 4 * 3 * 2 * 1 = 120."
          },
          {
            id: "th-p2-01-d",
            text: "Đoạn mã trên sẽ gặp lỗi lặp vô hạn `RecursionError` nếu truyền vào đối số n = 0.",
            isCorrect: false,
            explanation: "Khi n = 0, điều kiện `n <= 1` là Đúng (True) ngay từ đầu nên hàm trả về ngay giá trị 1 mà không xảy ra đệ quy vô hạn."
          }
        ],
        explanation: "Phân tích cấu trúc hàm đệ quy và đánh giá trường hợp biên trong lập trình Python."
      },
      {
        id: "th-p3-01",
        part: 3,
        question: "Cho đoạn mã nguồn Python sau:\n```python\ntotal = 0\nfor i in range(1, 10, 2):\n    total += i\nprint(total)\n```\nGiá trị số nguyên in ra màn hình của biến `total` là bao nhiêu?",
        answer: "25",
        acceptedAnswers: ["25", "25.0", "25,0"],
        unit: "",
        explanation: "Hàm range(1, 10, 2) tạo dãy số lẻ bắt đầu từ 1 với bước nhảy 2 nhỏ hơn 10: 1, 3, 5, 7, 9. Tổng cộng dồn: total = 1 + 3 + 5 + 7 + 9 = 25."
      }
    ]
  }
];

export const GRADES: PseoGrade[] = [
  { slug: "lop-10", name: "Lớp 10", label: "đề kiểm tra Toán, Lý, Hóa lớp 10 bám sát chương trình học" },
  { slug: "lop-11", name: "Lớp 11", label: "tổng hợp đề thi học kỳ 1 và học kỳ 2 lớp 11 chất lượng" },
  { slug: "lop-12", name: "Lớp 12", label: "luyện đề thi thử tốt nghiệp và các chuyên đề trọng tâm lớp 12" },
  { slug: "on-thi-thpt", name: "Ôn thi THPT Quốc gia", label: "bộ đề luyện thi THPT Quốc gia chuẩn cấu trúc minh họa mới nhất" }
];
