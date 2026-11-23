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
  questionsByGrade?: Record<string, PseoQuestion[]>;
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
    ],
    questionsByGrade: {
      "lop-10": [
        {
          id: "toan-10-p1-01",
          part: 1,
          question: "Cho hai tập hợp A = {1; 2; 3; 5; 7} và B = {2; 3; 4; 6}. Tập hợp A ∩ B là:",
          options: ["{2; 3}", "{1; 2; 3; 4; 5; 6; 7}", "{1; 5; 7}", "{4; 6}"],
          answer: 0,
          explanation: "Giao của hai tập hợp A và B gồm các phần tử thuộc cả A và B. Ta thấy chỉ có 2 và 3 thuộc cả hai tập hợp nên A ∩ B = {2; 3}."
        },
        {
          id: "toan-10-p1-02",
          part: 1,
          question: "Parabol y = x^2 - 4x + 3 có tọa độ đỉnh I là:",
          options: ["I(2; -1)", "I(-2; 15)", "I(2; 1)", "I(4; 3)"],
          answer: 0,
          explanation: "Hoành độ đỉnh x_I = -b/(2a) = 4/2 = 2. Tung độ đỉnh y_I = 2^2 - 4*2 + 3 = -1. Vậy đỉnh parabol là I(2; -1)."
        },
        {
          id: "toan-10-p2-01",
          part: 2,
          context: "Trong mặt phẳng tọa độ Oxy, cho tam giác ABC có A(1; 2), B(4; 6), C(-2; 2). Xét tính đúng/sai của các mệnh đề sau:",
          subQuestions: [
            {
              id: "toan-10-p2-01-a",
              text: "Tọa độ của vectơ AB là (3; 4).",
              isCorrect: true,
              explanation: "Vectơ AB = (x_B - x_A; y_B - y_A) = (4 - 1; 6 - 2) = (3; 4)."
            },
            {
              id: "toan-10-p2-01-b",
              text: "Độ dài đoạn thẳng AB bằng 5.",
              isCorrect: true,
              explanation: "AB = √(3^2 + 4^2) = √25 = 5."
            },
            {
              id: "toan-10-p2-01-c",
              text: "Trọng tâm G của tam giác ABC có tọa độ là (1; 10/3).",
              isCorrect: true,
              explanation: "x_G = (1 + 4 - 2)/3 = 1; y_G = (2 + 6 + 2)/3 = 10/3. Suy ra G(1; 10/3)."
            },
            {
              id: "toan-10-p2-01-d",
              text: "Tam giác ABC là tam giác vuông tại A.",
              isCorrect: false,
              explanation: "Vectơ AC = (-3; 0). Tích vô hướng AB · AC = 3*(-3) + 4*0 = -9 ≠ 0 nên hai vectơ không vuông góc tại A."
            }
          ],
          explanation: "Vận dụng phép toán tọa độ vectơ và tích vô hướng trong mặt phẳng Oxy Toán 10."
        },
        {
          id: "toan-10-p3-01",
          part: 3,
          question: "Một câu lạc bộ Tin học có 6 học sinh nam và 4 học sinh nữ. Có bao nhiêu cách chọn một ban chấp hành gồm 3 học sinh sao cho có đúng 2 học sinh nam và 1 học sinh nữ?",
          answer: "60",
          acceptedAnswers: ["60", "60 cách"],
          unit: "cách",
          explanation: "Số cách chọn 2 nam từ 6 nam là C(6,2) = 15. Số cách chọn 1 nữ từ 4 nữ là C(4,1) = 4. Theo quy tắc nhân, số cách chọn là 15 × 4 = 60."
        }
      ],
      "lop-11": [
        {
          id: "toan-11-p1-01",
          part: 1,
          question: "Cho cấp số cộng (u_n) có số hạng đầu u_1 = 3 và công sai d = 4. Số hạng thứ 5 (u_5) bằng:",
          options: ["15", "19", "23", "12"],
          answer: 1,
          explanation: "Theo công thức số hạng tổng quát cấp số cộng: u_n = u_1 + (n - 1)d. Với n = 5: u_5 = 3 + 4 * 4 = 19."
        },
        {
          id: "toan-11-p1-02",
          part: 1,
          question: "Tập xác định của hàm số logarit y = log_2(x - 3) là:",
          options: ["(3; +∞)", "[3; +∞)", "(-∞; 3)", "R \\ {3}"],
          answer: 0,
          explanation: "Hàm số log_a(u) xác định khi biểu thức dưới dấu logarit dương: x - 3 > 0 <=> x > 3. Tập xác định là (3; +∞)."
        },
        {
          id: "toan-11-p2-01",
          part: 2,
          context: "Cho phương trình lượng giác sin(x) = 1/2 trên đoạn [0; 2π]. Xét tính đúng/sai của các mệnh đề sau:",
          subQuestions: [
            {
              id: "toan-11-p2-01-a",
              text: "Giá trị x = π/6 là một nghiệm của phương trình đã cho.",
              isCorrect: true,
              explanation: "Ta có sin(π/6) = 1/2 và π/6 ∈ [0; 2π] nên là nghiệm."
            },
            {
              id: "toan-11-p2-01-b",
              text: "Phương trình có đúng 2 nghiệm phân biệt trên đoạn [0; 2π].",
              isCorrect: true,
              explanation: "Trên [0; 2π], sin(x) = 1/2 có 2 nghiệm là x = π/6 và x = 5π/6."
            },
            {
              id: "toan-11-p2-01-c",
              text: "Tổng tất cả các nghiệm của phương trình trên đoạn [0; 2π] bằng 2π.",
              isCorrect: false,
              explanation: "Tổng hai nghiệm là π/6 + 5π/6 = π (không phải 2π)."
            },
            {
              id: "toan-11-p2-01-d",
              text: "Họ nghiệm tổng quát trên R là x = π/6 + k2π hoặc x = 5π/6 + k2π (k ∈ Z).",
              isCorrect: true,
              explanation: "Vì sin(π/6) = 1/2 nên nghiệm tổng quát của sin(x) = sin(α) là x = α + k2π hoặc x = π - α + k2π."
            }
          ],
          explanation: "Giải phương trình lượng giác cơ bản và đếm nghiệm trên đoạn cho trước (Toán 11)."
        },
        {
          id: "toan-11-p3-01",
          part: 3,
          question: "Tính giới hạn L = lim (3n^2 - 2n + 1) / (n^2 + 5) khi n tiến ra +∞.",
          answer: "3",
          acceptedAnswers: ["3", "3.0", "3,0"],
          unit: "",
          explanation: "Chia cả tử và mẫu cho n^2: L = lim (3 - 2/n + 1/n^2) / (1 + 5/n^2) = 3 / 1 = 3."
        }
      ],
      "lop-12": [
        {
          id: "toan-12-p1-01",
          part: 1,
          question: "Trong không gian Oxyz, cho mặt phẳng (P): 2x - y + 3z - 5 = 0. Vectơ nào sau đây là một vectơ pháp tuyến của (P)?",
          options: ["n = (2; -1; 3)", "n = (2; 1; 3)", "n = (-1; 3; -5)", "n = (2; -1; -5)"],
          answer: 0,
          explanation: "Mặt phẳng Ax + By + Cz + D = 0 có vectơ pháp tuyến n = (A; B; C) = (2; -1; 3)."
        },
        {
          id: "toan-12-p1-02",
          part: 1,
          question: "Giá trị của tích phân I = ∫ từ 0 đến 2 của (3x^2 + 1) dx bằng:",
          options: ["8", "10", "12", "6"],
          answer: 1,
          explanation: "Nguyên hàm của 3x^2 + 1 là F(x) = x^3 + x. Suy ra I = F(2) - F(0) = (2^3 + 2) - 0 = 10."
        },
        {
          id: "toan-12-p2-01",
          part: 2,
          context: "Cho hàm số phân thức y = (2x + 1) / (x - 1) có đồ thị (C). Xét tính đúng/sai của các mệnh đề sau:",
          subQuestions: [
            {
              id: "toan-12-p2-01-a",
              text: "Tập xác định của hàm số là D = R \\ {1}.",
              isCorrect: true,
              explanation: "Mẫu số x - 1 ≠ 0 <=> x ≠ 1, nên tập xác định là R \\ {1}."
            },
            {
              id: "toan-12-p2-01-b",
              text: "Đồ thị (C) có đường tiệm cận đứng x = 1 và đường tiệm cận ngang y = 2.",
              isCorrect: true,
              explanation: "lim_{x→1} y = ±∞ nên x = 1 là tiệm cận đứng; lim_{x→±∞} y = 2 nên y = 2 là tiệm cận ngang."
            },
            {
              id: "toan-12-p2-01-c",
              text: "Hàm số đồng biến trên từng khoảng xác định (-∞; 1) và (1; +∞).",
              isCorrect: false,
              explanation: "Đạo hàm y' = (2*(-1) - 1*1)/(x - 1)^2 = -3/(x - 1)^2 < 0 với mọi x ≠ 1. Hàm số nghịch biến trên từng khoảng xác định."
            },
            {
              id: "toan-12-p2-01-d",
              text: "Giá trị lớn nhất của hàm số trên đoạn [2; 4] bằng 5.",
              isCorrect: true,
              explanation: "Vì hàm số nghịch biến trên [2; 4] nên GTLN đạt tại x = 2: y(2) = (2*2 + 1)/(2 - 1) = 5."
            }
          ],
          explanation: "Khảo sát hàm phân thức bậc nhất trên bậc nhất, tiệm cận và GTLN-GTNN (Toán 12)."
        },
        {
          id: "toan-12-p3-01",
          part: 3,
          question: "Trong một lớp học, xác suất để một học sinh thích môn Toán là 0,6; xác suất thích môn Tin là 0,5 và xác suất thích cả hai môn là 0,3. Biết học sinh được chọn ngẫu nhiên thích môn Toán, xác suất để học sinh đó cũng thích môn Tin là bao nhiêu?",
          answer: "0.5",
          acceptedAnswers: ["0.5", "0,5", "1/2"],
          unit: "",
          explanation: "Xác suất có điều kiện P(Tin | Toán) = P(Toán ∩ Tin) / P(Toán) = 0,3 / 0,6 = 0,5."
        }
      ]
    }
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
    ],
    questionsByGrade: {
      "lop-10": [
        {
          id: "ta-10-p1-01",
          part: 1,
          question: "Choose the word that has the stress pattern different from the others:\nA. family\nB. benefit\nC. grocery\nD. volunteer",
          options: ["family", "benefit", "grocery", "volunteer"],
          answer: 3,
          explanation: "'volunteer' có trọng âm rơi vào âm tiết thứ 3 (/ˌvɒl.ənˈtɪər/), trong khi 'family', 'benefit', 'grocery' đều có trọng âm rơi vào âm tiết thứ 1."
        },
        {
          id: "ta-10-p1-02",
          part: 1,
          question: "My mother usually _____ dinner, but today my father is cooking because it is her birthday.",
          options: ["cooks", "is cooking", "cooked", "has cooked"],
          answer: 0,
          explanation: "Trạng từ 'usually' diễn tả thói quen lặp đi lặp lại nên dùng thì hiện tại đơn (Present Simple): 'cooks'."
        },
        {
          id: "ta-10-p2-01",
          part: 2,
          context: "Read the passage (Unit: For a Better Community) and decide if the statements are True (Đúng) or False (Sai):\n'Volunteering gives teenagers valuable opportunities to develop teamwork and communication skills. When students join local clean-up campaigns or tutor younger children, they learn empathy and become more confident in solving real-world problems.'",
          subQuestions: [
            {
              id: "ta-10-p2-01-a",
              text: "Volunteering helps teenagers practice teamwork and communication skills.",
              isCorrect: true,
              explanation: "The text explicitly mentions 'valuable opportunities to develop teamwork and communication skills'."
            },
            {
              id: "ta-10-p2-01-b",
              text: "Students only gain academic grades rather than empathy from tutoring younger children.",
              isCorrect: false,
              explanation: "The passage states they 'learn empathy and become more confident'."
            },
            {
              id: "ta-10-p2-01-c",
              text: "Local clean-up campaigns are mentioned as an example of community activities.",
              isCorrect: true,
              explanation: "The passage mentions 'When students join local clean-up campaigns'."
            },
            {
              id: "ta-10-p2-01-d",
              text: "Teenagers become less confident when dealing with real-world problems through volunteering.",
              isCorrect: false,
              explanation: "They actually 'become more confident in solving real-world problems'."
            }
          ],
          explanation: "Đọc hiểu chủ đề Hoạt động cộng đồng (Tiếng Anh 10 GDPT 2018)."
        },
        {
          id: "ta-10-p3-01",
          part: 3,
          question: "Complete the passive sentence with ONE word:\n'Hundreds of trees are ________ in our schoolyard every spring to protect the environment.' [PLANT]",
          answer: "planted",
          acceptedAnswers: ["planted", "Planted", "PLANTED"],
          explanation: "Câu bị động ở thì hiện tại đơn dùng cấu trúc 'are + V3/ed'. Quá khứ phân từ của 'plant' là 'planted'."
        }
      ],
      "lop-11": [
        {
          id: "ta-11-p1-01",
          part: 1,
          question: "To narrow the generation gap, parents and teenagers _____ listen to each other's viewpoints with respect.",
          options: ["should", "mustn't", "don't have to", "ought"],
          answer: 0,
          explanation: "Động từ khuyết thiếu 'should' diễn tả lời khuyên hợp lý; 'ought' phải đi kèm 'to' nên không đúng."
        },
        {
          id: "ta-11-p1-02",
          part: 1,
          question: "Vietnam _____ a member of ASEAN since July 1995 and has actively contributed to regional peace.",
          options: ["has been", "was", "is", "will be"],
          answer: 0,
          explanation: "Dấu hiệu 'since July 1995' kết hợp hành động kéo dài đến hiện tại dùng thì hiện tại hoàn thành: 'has been'."
        },
        {
          id: "ta-11-p2-01",
          part: 2,
          context: "Read the text (Unit: Cities of the Future) and decide whether each statement is True (Đúng) or False (Sai):\n'Smart cities of the future will rely on clean renewable energy and intelligent transport networks to cut carbon emissions. Sensors installed across streets will monitor air quality and automatically adjust traffic lights to prevent congestion.'",
          subQuestions: [
            {
              id: "ta-11-p2-01-a",
              text: "Future smart cities aim to reduce carbon emissions using clean energy.",
              isCorrect: true,
              explanation: "The passage states they 'rely on clean renewable energy... to cut carbon emissions'."
            },
            {
              id: "ta-11-p2-01-b",
              text: "Street sensors will only measure noise levels and cannot check air quality.",
              isCorrect: false,
              explanation: "Sensors will 'monitor air quality' according to the text."
            },
            {
              id: "ta-11-p2-01-c",
              text: "Traffic lights will be adjusted automatically to reduce traffic jams.",
              isCorrect: true,
              explanation: "The text notes sensors 'automatically adjust traffic lights to prevent congestion'."
            },
            {
              id: "ta-11-p2-01-d",
              text: "Intelligent transport networks are excluded from future smart city plans.",
              isCorrect: false,
              explanation: "The passage says smart cities will rely on 'intelligent transport networks'."
            }
          ],
          explanation: "Đọc hiểu chủ đề Thành phố tương lai (Tiếng Anh 11 GDPT 2018)."
        },
        {
          id: "ta-11-p3-01",
          part: 3,
          question: "Complete the participle clause with ONE word:\n'________ by the effects of global warming, many coastal communities are building stronger sea walls.' [THREATEN]",
          answer: "Threatened",
          acceptedAnswers: ["Threatened", "threatened", "THREATENED"],
          explanation: "Mệnh đề phân từ mang nghĩa bị động (bị đe dọa bởi) rút gọn bằng quá khứ phân từ V3/ed: 'Threatened'."
        }
      ],
      "lop-12": [
        {
          id: "ta-12-p1-01",
          part: 1,
          question: "While the students _____ a presentation on cultural diversity, the school principal walked into the hall.",
          options: ["were giving", "gave", "give", "had given"],
          answer: 0,
          explanation: "Hành động đang diễn ra (chia quá khứ tiếp diễn: 'were giving') thì có hành động khác xen vào (chia quá khứ đơn: 'walked')."
        },
        {
          id: "ta-12-p1-02",
          part: 1,
          question: "Rapid urbanisation creates many jobs in big cities, _____ it also puts heavy pressure on housing and public transport.",
          options: ["but", "so", "for", "therefore"],
          answer: 0,
          explanation: "Hai mệnh đề mang nghĩa tương phản nối bằng dấu phẩy nên dùng liên từ 'but' ('therefore' cần dấu chấm phẩy)."
        },
        {
          id: "ta-12-p2-01",
          part: 2,
          context: "Read the text (Unit: Green Living) and decide whether each statement is True (Đúng) or False (Sai):\n'Adopting a green lifestyle does not require expensive gadgets. Simple habits such as sorting household waste, bringing reusable bottles to school, and turning off unused lights significantly shrink a family's carbon footprint over time.'",
          subQuestions: [
            {
              id: "ta-12-p2-01-a",
              text: "Living green requires buying costly electronic devices.",
              isCorrect: false,
              explanation: "The passage states it 'does not require expensive gadgets'."
            },
            {
              id: "ta-12-p2-01-b",
              text: "Sorting waste at home is one practical habit of green living.",
              isCorrect: true,
              explanation: "The text lists 'sorting household waste' as a simple habit."
            },
            {
              id: "ta-12-p2-01-c",
              text: "Using reusable bottles at school helps reduce environmental impact.",
              isCorrect: true,
              explanation: "Bringing reusable bottles contributes to shrinking a family's carbon footprint."
            },
            {
              id: "ta-12-p2-01-d",
              text: "Small daily actions have no long-term effect on a family's carbon footprint.",
              isCorrect: false,
              explanation: "The text notes these habits 'significantly shrink a family's carbon footprint over time'."
            }
          ],
          explanation: "Đọc hiểu chủ đề Sống xanh (Tiếng Anh 12 GDPT 2018)."
        },
        {
          id: "ta-12-p3-01",
          part: 3,
          question: "Fill in ONE preposition to complete the phrasal verb:\n'When applying for a scholarship, make sure you look ________ the eligibility requirements carefully before submitting.'",
          answer: "up",
          acceptedAnswers: ["up", "UP", "into", "through"],
          explanation: "'look up' (tra cứu thông tin) hoặc 'look through / look into' (xem kỹ) phù hợp ngữ cảnh kiểm tra điều kiện học bổng."
        }
      ]
    }
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
    ],
    questionsByGrade: {
      "lop-10": [
        {
          id: "vl-10-p1-01",
          part: 1,
          question: "Một vật được thả rơi tự do từ độ cao h xuống đất (bỏ qua sức cản không khí, lấy g = 10 m/s^2). Sau 2 giây, tốc độ của vật là bao nhiêu?",
          options: ["10 m/s", "20 m/s", "40 m/s", "5 m/s"],
          answer: 1,
          explanation: "Vận tốc rơi tự do: v = g * t = 10 * 2 = 20 m/s."
        },
        {
          id: "vl-10-p1-02",
          part: 1,
          question: "Theo định luật II Newton, gia tốc của một vật có cùng hướng với lực tác dụng lên vật và độ lớn của gia tốc:",
          options: [
            "tỉ lệ thuận với độ lớn của lực và tỉ lệ nghịch với khối lượng của vật",
            "tỉ lệ nghịch với độ lớn của lực và tỉ lệ thuận với khối lượng của vật",
            "không phụ thuộc vào khối lượng của vật",
            "luôn bằng hằng số trọng trường g"
          ],
          answer: 0,
          explanation: "Định luật II Newton phát biểu: a = F / m, nghĩa là gia tốc tỉ lệ thuận với hợp lực F và tỉ lệ nghịch với khối lượng m."
        },
        {
          id: "vl-10-p2-01",
          part: 2,
          context: "Một ô tô có khối lượng m = 1000 kg bắt đầu khởi hành chuyển động thẳng nhanh dần đều trên đường nằm ngang, đạt vận tốc v = 10 m/s sau khi đi được quãng đường s = 25 m (bỏ qua ma sát). Xét tính đúng/sai của các phát biểu sau:",
          subQuestions: [
            {
              id: "vl-10-p2-01-a",
              text: "Gia tốc của ô tô trên đoạn đường này là a = 2 m/s^2.",
              isCorrect: true,
              explanation: "Áp dụng công thức v^2 - v0^2 = 2as => 10^2 - 0 = 2 * a * 25 => a = 100 / 50 = 2 m/s^2."
            },
            {
              id: "vl-10-p2-01-b",
              text: "Độ lớn hợp lực kéo làm ô tô tăng tốc bằng 2000 N.",
              isCorrect: true,
              explanation: "Theo định luật II Newton: F = m * a = 1000 * 2 = 2000 N."
            },
            {
              id: "vl-10-p2-01-c",
              text: "Động năng của ô tô khi đạt vận tốc 10 m/s bằng 100 kJ.",
              isCorrect: false,
              explanation: "Động năng W_đ = (1/2) * m * v^2 = 0,5 * 1000 * 10^2 = 50.000 J = 50 kJ."
            },
            {
              id: "vl-10-p2-01-d",
              text: "Thời gian ô tô đi hết quãng đường 25 m đầu tiên là 5 giây.",
              isCorrect: true,
              explanation: "Ta có v = v0 + at => 10 = 0 + 2 * t => t = 5 giây."
            }
          ],
          explanation: "Kết hợp động học, định luật II Newton và định lý động năng (Vật lý 10)."
        },
        {
          id: "vl-10-p3-01",
          part: 3,
          question: "Một cần cẩu nâng đều một kiện hàng nặng m = 500 kg lên độ cao h = 12 m trong thời gian t = 15 giây (lấy g = 10 m/s^2). Công suất trung bình của cần cẩu bằng bao nhiêu kW?",
          answer: "4",
          acceptedAnswers: ["4", "4.0", "4,0"],
          unit: "kW",
          explanation: "Công nâng vật: A = m * g * h = 500 * 10 * 12 = 60.000 J. Công suất: P = A / t = 60.000 / 15 = 4000 W = 4 kW."
        }
      ],
      "lop-11": [
        {
          id: "vl-11-p1-01",
          part: 1,
          question: "Một vật dao động điều hòa với phương trình x = 6 cos(4πt + π/3) cm. Biên độ và tần số góc của dao động lần lượt là:",
          options: ["6 cm và 4π rad/s", "4π cm và 6 rad/s", "6 cm và π/3 rad/s", "12 cm và 2π rad/s"],
          answer: 0,
          explanation: "So sánh với phương trình chuẩn x = A cos(ωt + φ), ta có biên độ A = 6 cm và tần số góc ω = 4π rad/s."
        },
        {
          id: "vl-11-p1-02",
          part: 1,
          question: "Hai điện tích điểm q1, q2 đặt cách nhau khoảng r trong chân không. Khi tăng khoảng cách giữa hai điện tích lên gấp 2 lần (giữ nguyên độ lớn điện tích) thì lực tương tác tĩnh điện giữa chúng:",
          options: ["giảm đi 4 lần", "tăng lên 4 lần", "giảm đi 2 lần", "tăng lên 2 lần"],
          answer: 0,
          explanation: "Theo định luật Coulomb: F = k * |q1*q2| / r^2. Lực F tỉ lệ nghịch với bình phương khoảng cách r, nên r tăng 2 lần thì F giảm 2^2 = 4 lần."
        },
        {
          id: "vl-11-p2-01",
          part: 2,
          context: "Một sóng cơ học hình sin truyền dọc theo trục Ox với tần số f = 20 Hz. Khoảng cách giữa hai đỉnh sóng liên tiếp trên phương truyền sóng đo được là 1,5 m. Xét tính đúng/sai của các mệnh đề sau:",
          subQuestions: [
            {
              id: "vl-11-p2-01-a",
              text: "Bước sóng của sóng cơ này bằng λ = 1,5 m.",
              isCorrect: true,
              explanation: "Khoảng cách giữa hai đỉnh sóng (ngọn sóng) liên tiếp trên cùng phương truyền sóng chính bằng một bước sóng λ = 1,5 m."
            },
            {
              id: "vl-11-p2-01-b",
              text: "Chu kỳ dao động của các phần tử môi trường là T = 0,05 giây.",
              isCorrect: true,
              explanation: "T = 1 / f = 1 / 20 = 0,05 giây."
            },
            {
              id: "vl-11-p2-01-c",
              text: "Tốc độ truyền sóng trong môi trường là v = 30 m/s.",
              isCorrect: true,
              explanation: "v = λ * f = 1,5 * 20 = 30 m/s."
            },
            {
              id: "vl-11-p2-01-d",
              text: "Hai điểm trên phương truyền sóng cách nhau 0,75 m sẽ dao động cùng pha với nhau.",
              isCorrect: false,
              explanation: "Khoảng cách d = 0,75 m = λ/2, nên hai điểm này dao động ngược pha nhau."
            }
          ],
          explanation: "Vận dụng các đại lượng đặc trưng của sóng cơ học (Vật lý 11)."
        },
        {
          id: "vl-11-p3-01",
          part: 3,
          question: "Một nguồn điện có suất điện động E = 12 V và điện trở trong r = 1 Ω được mắc với điện trở ngoài R = 5 Ω thành mạch kín. Cường độ dòng điện chạy trong mạch bằng bao nhiêu Ampe (A)?",
          answer: "2",
          acceptedAnswers: ["2", "2.0", "2,0"],
          unit: "A",
          explanation: "Áp dụng định luật Ôm cho toàn mạch: I = E / (R + r) = 12 / (5 + 1) = 2 A."
        }
      ],
      "lop-12": [
        {
          id: "vl-12-p1-01",
          part: 1,
          question: "Trong hiện tượng cảm ứng điện từ, suất điện động cảm ứng xuất hiện trong một mạch kín có độ lớn tỉ lệ thuận với:",
          options: [
            "tốc độ biến thiên từ thông qua mạch kín đó",
            "giá trị từ thông cực đại qua mạch",
            "điện trở của dây dẫn tạo thành mạch",
            "diện tích mặt phẳng khung dây"
          ],
          answer: 0,
          explanation: "Theo định luật Faraday về cảm ứng điện từ: |e_c| = |ΔΦ / Δt|, tỉ lệ thuận với tốc độ biến thiên từ thông qua mạch."
        },
        {
          id: "vl-12-p1-02",
          part: 1,
          question: "Hạt nhân nguyên tử Carbon (12_6 C) có bao nhiêu proton và bao nhiêu neutron?",
          options: ["6 proton và 6 neutron", "12 proton và 6 neutron", "6 proton và 12 neutron", "6 proton và 18 neutron"],
          answer: 0,
          explanation: "Ký hiệu A_Z X cho biết số proton Z = 6, số khối A = 12 => số neutron N = A - Z = 12 - 6 = 6."
        },
        {
          id: "vl-12-p2-01",
          part: 2,
          context: "Một khung dây dẫn phẳng có diện tích S = 0,04 m^2 gồm N = 50 vòng dây đặt trong từ trường đều có cảm ứng từ B = 0,2 T. Ban đầu mặt phẳng khung dây vuông góc với đường sức từ. Trong thời gian Δt = 0,1 giây, người ta xoay khung dây sao cho mặt phẳng khung song song với đường sức từ. Xét tính đúng/sai:",
          subQuestions: [
            {
              id: "vl-12-p2-01-a",
              text: "Từ thông ban đầu qua một vòng dây là Φ1 = 0,008 Wb.",
              isCorrect: true,
              explanation: "Khi mặt phẳng khung vuông góc với vectơ B thì góc α = 0°, Φ1 = B * S * cos(0°) = 0,2 * 0,04 * 1 = 0,008 Wb."
            },
            {
              id: "vl-12-p2-01-b",
              text: "Khi mặt phẳng khung song song với đường sức từ, từ thông qua khung bằng 0.",
              isCorrect: true,
              explanation: "Lúc này vectơ pháp tuyến vuông góc với B (α = 90°), nên cos(90°) = 0 => Φ2 = 0."
            },
            {
              id: "vl-12-p2-01-c",
              text: "Độ lớn suất điện động cảm ứng trung bình xuất hiện trong khung 50 vòng là 4 V.",
              isCorrect: true,
              explanation: "|e_c| = N * |ΔΦ| / Δt = 50 * |0 - 0,008| / 0,1 = 50 * 0,08 = 4 V."
            },
            {
              id: "vl-12-p2-01-d",
              text: "Nếu xoay khung dây chậm lại (thời gian Δt tăng gấp đôi) thì độ lớn suất điện động cảm ứng tăng gấp đôi.",
              isCorrect: false,
              explanation: "Suất điện động cảm ứng tỉ lệ nghịch với thời gian Δt, nên Δt tăng gấp đôi thì |e_c| giảm đi một nửa."
            }
          ],
          explanation: "Tính toán từ thông và suất điện động cảm ứng Faraday (Vật lý 12 GDPT 2018)."
        },
        {
          id: "vl-12-p3-01",
          part: 3,
          question: "Một chất phóng xạ có chu kỳ bán rã T = 10 ngày. Ban đầu có 160 gam chất phóng xạ nguyên chất. Sau thời gian t = 30 ngày, khối lượng chất phóng xạ còn lại chưa bị phân rã là bao nhiêu gam?",
          answer: "20",
          acceptedAnswers: ["20", "20.0", "20,0"],
          unit: "gam",
          explanation: "Số chu kỳ bán rã: k = t / T = 30 / 10 = 3. Khối lượng còn lại: m = m0 * 2^(-t/T) = 160 * 2^(-3) = 160 / 8 = 20 gam."
        }
      ]
    }
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
    ],
    questionsByGrade: {
      "lop-10": [
        {
          id: "hh-10-p1-01",
          part: 1,
          question: "Nguyên tử của nguyên tố X có số hiệu nguyên tử Z = 11 (Natri). Cấu hình electron của nguyên tử X ở trạng thái cơ bản là:",
          options: ["1s2 2s2 2p6 3s1", "1s2 2s2 2p6 3s2", "1s2 2s2 2p5 3s2", "1s2 2s2 2p6 3p1"],
          answer: 0,
          explanation: "Với Z = 11, nguyên tử có 11 electron được phân bố theo thứ tự mức năng lượng: 1s2 2s2 2p6 3s1."
        },
        {
          id: "hh-10-p1-02",
          part: 1,
          question: "Phản ứng nào sau đây là phản ứng tỏa nhiệt (Δ_r H°_298 < 0)?",
          options: [
            "Đốt cháy hoàn toàn khí methane (CH4) trong không khí",
            "Nhiệt phân đá vôi (CaCO3) tạo thành vôi sống",
            "Hòa tan viên sủi vitamin C làm lạnh cốc nước",
            "Điện phân nước tạo khí H2 và O2"
          ],
          answer: 0,
          explanation: "Các phản ứng đốt cháy nhiên liệu giải phóng nhiệt lượng ra môi trường nên có biến thiên enthalpy chuẩn Δ_r H°_298 < 0 (tỏa nhiệt)."
        },
        {
          id: "hh-10-p2-01",
          part: 2,
          context: "Cho các nguyên tố thuộc nhóm VIIA (nhóm Halogen) theo thứ tự từ trên xuống dưới trong bảng tuần hoàn: F (Z=9), Cl (Z=17), Br (Z=35), I (Z=53). Xét tính đúng/sai của các nhận định sau:",
          subQuestions: [
            {
              id: "hh-10-p2-01-a",
              text: "Các nguyên tử halogen đều có 7 electron ở lớp ngoài cùng (cấu hình ns2 np5).",
              isCorrect: true,
              explanation: "Nguyên tố nhóm VIIA có 7 electron lớp ngoài cùng, dễ nhận thêm 1 electron để đạt cấu hình bền của khí hiếm."
            },
            {
              id: "hh-10-p2-01-b",
              text: "Từ F2 đến I2, tính oxi hóa của các đơn chất halogen giảm dần.",
              isCorrect: true,
              explanation: "Khi bán kính nguyên tử tăng từ F đến I, khả năng hút electron giảm nên tính oxi hóa giảm dần (F2 mạnh nhất)."
            },
            {
              id: "hh-10-p2-01-c",
              text: "Ở điều kiện thường, Cl2 tồn tại ở thể lỏng màu nâu đỏ.",
              isCorrect: false,
              explanation: "Ở điều kiện thường, Cl2 là chất khí màu vàng lục; Br2 mới là chất lỏng màu nâu đỏ."
            },
            {
              id: "hh-10-p2-01-d",
              text: "Dung dịch HF không thể đựng trong bình thủy tinh vì có phản ứng ăn mòn thủy tinh (SiO2).",
              isCorrect: true,
              explanation: "HF phản ứng với SiO2 trong thủy tinh: SiO2 + 4HF → SiF4 + 2H2O, nên thường đựng trong bình nhựa."
            }
          ],
          explanation: "Tính chất tuần hoàn và đặc trưng nhóm Halogen (Hóa học 10 GDPT 2018)."
        },
        {
          id: "hh-10-p3-01",
          part: 3,
          question: "Trong phản ứng oxi hóa - khử: a Fe + b HNO3 → c Fe(NO3)3 + d NO + e H2O (với a, b, c, d, e là các số nguyên tối giản). Tổng hệ số cân bằng (a + b) bằng bao nhiêu?",
          answer: "5",
          acceptedAnswers: ["5", "5.0", "5,0"],
          unit: "",
          explanation: "Phương trình cân bằng: 1 Fe + 4 HNO3 → 1 Fe(NO3)3 + 1 NO + 2 H2O. Do đó a = 1, b = 4 => a + b = 5."
        }
      ],
      "lop-11": [
        {
          id: "hh-11-p1-01",
          part: 1,
          question: "Trong phản ứng tổng hợp ammonia: N2(g) + 3H2(g) ⇌ 2NH3(g) (Δ_r H° < 0). Yếu tố nào sau đây làm cân bằng chuyển dịch theo chiều thuận (tạo thêm NH3)?",
          options: [
            "Tăng áp suất chung của hệ phản ứng",
            "Tăng nhiệt độ của hệ phản ứng",
            "Giảm nồng độ khí N2 trong bình",
            "Lấy bớt khí H2 ra khỏi bình"
          ],
          answer: 0,
          explanation: "Vế trái có 4 mol khí, vế phải có 2 mol khí. Theo nguyên lý Le Chatelier, tăng áp suất làm cân bằng chuyển dịch về phía giảm số mol khí (chiều thuận)."
        },
        {
          id: "hh-11-p1-02",
          part: 1,
          question: "Hydrocarbon nào sau đây thuộc dãy đồng đẳng của alkene (chứa một liên kết đôi C=C trong phân tử)?",
          options: ["Ethylene (C2H4)", "Methane (CH4)", "Acetylene (C2H2)", "Benzene (C6H6)"],
          answer: 0,
          explanation: "Alkene mạch hở có công thức chung C_n H_2n (n ≥ 2). Ethylene (CH2=CH2) là alkene đơn giản nhất."
        },
        {
          id: "hh-11-p2-01",
          part: 2,
          context: "Trong phòng thí nghiệm, xét dung dịch nước của ba chất sau ở cùng nồng độ 0,1 M: (1) HCl, (2) CH3COOH, (3) NaOH. Xét tính đúng/sai của các phát biểu về pH và sự điện li:",
          subQuestions: [
            {
              id: "hh-11-p2-01-a",
              text: "Dung dịch HCl 0,1 M có giá trị pH = 1 ở 25°C.",
              isCorrect: true,
              explanation: "HCl là axit mạnh phân li hoàn toàn: [H+] = 0,1 M = 10^-1 M => pH = -lg(10^-1) = 1."
            },
            {
              id: "hh-11-p2-01-b",
              text: "Dung dịch CH3COOH 0,1 M là chất điện li mạnh nên có pH bằng với dung dịch HCl 0,1 M.",
              isCorrect: false,
              explanation: "CH3COOH là axit yếu, chỉ phân li một phần nên [H+] < 0,1 M và pH > 1."
            },
            {
              id: "hh-11-p2-01-c",
              text: "Dung dịch NaOH 0,1 M làm quỳ tím chuyển sang màu xanh và có pH = 13.",
              isCorrect: true,
              explanation: "NaOH là bazơ mạnh: [OH-] = 0,1 M => pOH = 1 => pH = 14 - 1 = 13."
            },
            {
              id: "hh-11-p2-01-d",
              text: "Khi trộn 100 ml dung dịch HCl 0,1 M với 100 ml dung dịch NaOH 0,1 M thu được dung dịch trung tính (pH = 7).",
              isCorrect: true,
              explanation: "Số mol H+ bằng số mol OH- (đều 0,01 mol) nên phản ứng vừa đủ tạo muối NaCl và nước, pH = 7."
            }
          ],
          explanation: "Kiến thức về sự điện li, pH dung dịch và cân bằng axit-bazơ Brønsted–Lowry (Hóa học 11)."
        },
        {
          id: "hh-11-p3-01",
          part: 3,
          question: "Đốt cháy hoàn toàn 4,4 gam một alkane X thu được 6,72 lít khí CO2 (đo ở đktc cũ: 22,4 lít/mol, tức 0,3 mol CO2) và 7,2 gam H2O (0,4 mol H2O). Số nguyên tử carbon (C) trong phân tử alkane X là bao nhiêu?",
          answer: "3",
          acceptedAnswers: ["3", "3.0", "3,0"],
          unit: "nguyên tử",
          explanation: "Số mol alkane X = n_H2O - n_CO2 = 0,4 - 0,3 = 0,1 mol. Số nguyên tử C trong X = n_CO2 / n_X = 0,3 / 0,1 = 3 (Propane C3H8)."
        }
      ],
      "lop-12": [
        {
          id: "hh-12-p1-01",
          part: 1,
          question: "Amino acid nào sau đây chứa hai nhóm cacboxyl (-COOH) và một nhóm amino (-NH2), được dùng làm nguyên liệu sản xuất mì chính (bột ngọt)?",
          options: ["Glutamic acid", "Glycine", "Alanine", "Lysine"],
          answer: 0,
          explanation: "Glutamic acid (HOOC-CH2-CH2-CH(NH2)-COOH) có 2 nhóm -COOH và 1 nhóm -NH2; muối mononatri của nó là bột ngọt."
        },
        {
          id: "hh-12-p1-02",
          part: 1,
          question: "Kim loại nào sau đây có tính khử mạnh nhất trong dãy: Fe, Cu, Mg, Ag?",
          options: ["Mg", "Fe", "Cu", "Ag"],
          answer: 0,
          explanation: "Theo dãy điện hóa chuẩn (Mg2+/Mg < Fe2+/Fe < Cu2+/Cu < Ag+/Ag), Mg đứng trước nhất nên có tính khử mạnh nhất."
        },
        {
          id: "hh-12-p2-01",
          part: 2,
          context: "Xét pin điện hóa chuẩn Zn - Cu gồm điện cực kẽm nhúng trong dung dịch ZnSO4 1M và điện cực đồng nhúng trong dung dịch CuSO4 1M, nối với nhau qua cầu muối. Cho thế điện cực chuẩn E°(Zn2+/Zn) = -0,76 V và E°(Cu2+/Cu) = +0,34 V. Xét tính đúng/sai:",
          subQuestions: [
            {
              id: "hh-12-p2-01-a",
              text: "Thanh kẽm (Zn) đóng vai trò là cực âm (anode), tại đây xảy ra quá trình oxi hóa Zn → Zn2+ + 2e.",
              isCorrect: true,
              explanation: "Kim loại có thế điện cực chuẩn nhỏ hơn (-0,76 V < +0,34 V) đóng vai trò anode và bị oxi hóa."
            },
            {
              id: "hh-12-p2-01-b",
              text: "Dòng electron di chuyển qua dây dẫn ngoài từ cực đồng (Cu) sang cực kẽm (Zn).",
              isCorrect: false,
              explanation: "Electron sinh ra tại anode (Zn) di chuyển qua mạch ngoài sang cathode (Cu)."
            },
            {
              id: "hh-12-p2-01-c",
              text: "Sức điện động chuẩn của pin điện hóa Zn - Cu là 1,10 V.",
              isCorrect: true,
              explanation: "E°_pin = E°_cathode - E°_anode = 0,34 - (-0,76) = 1,10 V."
            },
            {
              id: "hh-12-p2-01-d",
              text: "Trong quá trình pin hoạt động, khối lượng thanh đồng tăng dần do ion Cu2+ bị khử bám lên thanh đồng.",
              isCorrect: true,
              explanation: "Tại cathode xảy ra phản ứng khử: Cu2+ + 2e → Cu, làm thanh Cu tăng khối lượng."
            }
          ],
          explanation: "Cấu tạo và nguyên lý hoạt động của pin điện hóa chuẩn (Hóa học 12 GDPT 2018)."
        },
        {
          id: "hh-12-p3-01",
          part: 3,
          question: "Điện phân dung dịch CuSO4 với điện cực trơ bằng dòng điện có cường độ I = 5 A trong thời gian t = 1930 giây (biết hằng số Faraday F = 96500 C/mol, Cu = 64). Khối lượng kim loại đồng (Cu) bám trên cathode bằng bao nhiêu gam?",
          answer: "3.2",
          acceptedAnswers: ["3.2", "3,2", "3.20"],
          unit: "gam",
          explanation: "Số mol electron trao đổi: n_e = (I * t) / F = (5 * 1930) / 96500 = 0,1 mol. Do Cu2+ + 2e → Cu nên n_Cu = 0,1 / 2 = 0,05 mol. Khối lượng Cu = 0,05 * 64 = 3,2 gam."
        }
      ]
    }
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
    ],
    questionsByGrade: {
      "lop-10": [
        {
          id: "sh-10-p1-01",
          part: 1,
          question: "Bào quan nào sau đây ở tế bào nhân thực được ví như 'nhà máy năng lượng', nơi diễn ra quá trình hô hấp tế bào tạo ra phần lớn phân tử ATP?",
          options: ["Ti thể", "Lưới nội chất hạt", "Bộ máy Golgi", "Lysosome"],
          answer: 0,
          explanation: "Ti thể (Mitochondria) thực hiện chu trình Krebs và chuỗi truyền electron hô hấp tế bào để tổng hợp lượng lớn ATP."
        },
        {
          id: "sh-10-p1-02",
          part: 1,
          question: "Khi đặt tế bào hồng cầu của người vào môi trường nước cất (nhược trương), hiện tượng nào sẽ xảy ra?",
          options: [
            "Nước thẩm thấu vào trong tế bào làm tế bào trương lên và có thể bị vỡ",
            "Tế bào mất nước nhanh chóng và co nguyên sinh lại",
            "Tế bào không thay đổi thể tích do thành cellulose bảo vệ",
            "Các ion muối khoáng khuếch tán ồ ạt từ ngoài vào nhân"
          ],
          answer: 0,
          explanation: "Nước di chuyển từ nơi thế nước cao (nước cất) vào nơi thế nước thấp (trong tế bào hồng cầu). Vì tế bào động vật không có thành tế bào nên sẽ trương phồng và vỡ."
        },
        {
          id: "sh-10-p2-01",
          part: 2,
          context: "Quan sát quá trình phân bào nguyên phân và giảm phân ở một loài sinh vật lưỡng bội có bộ NST 2n = 8. Xét tính đúng/sai của các phát biểu sau:",
          subQuestions: [
            {
              id: "sh-10-p2-01-a",
              text: "Trước khi bước vào phân bào, DNA nhân đôi ở pha S của kỳ trung gian.",
              isCorrect: true,
              explanation: "Chu kỳ tế bào gồm G1, S (nhân đôi DNA và NST), G2 và pha M (phân chia)."
            },
            {
              id: "sh-10-p2-01-b",
              text: "Kết thúc một lần nguyên phân từ 1 tế bào mẹ (2n = 8) tạo ra 2 tế bào con đều có bộ NST 2n = 8.",
              isCorrect: true,
              explanation: "Nguyên phân duy trì ổn định bộ NST lưỡng bội 2n qua các thế hệ tế bào."
            },
            {
              id: "sh-10-p2-01-c",
              text: "Các NST kép xếp thành 2 hàng trên mặt phẳng xích đạo ở kỳ giữa của nguyên phân.",
              isCorrect: false,
              explanation: "Ở kỳ giữa nguyên phân, NST kép xếp thành 1 hàng; xếp thành 2 hàng là đặc trưng của kỳ giữa giảm phân I."
            },
            {
              id: "sh-10-p2-01-d",
              text: "Kết thúc giảm phân bình thường, mỗi tế bào giao tử tạo thành chứa n = 4 NST đơn.",
              isCorrect: true,
              explanation: "Giảm phân làm giảm số lượng NST đi một nửa từ 2n = 8 xuống còn n = 4 trong giao tử."
            }
          ],
          explanation: "Cơ chế chu kỳ tế bào, nguyên phân và giảm phân (Sinh học 10 GDPT 2018)."
        },
        {
          id: "sh-10-p3-01",
          part: 3,
          question: "Một quần thể vi khuẩn E. coli ban đầu có 100 tế bào, trong điều kiện nuôi cấy lý tưởng cứ 20 phút phân chia một lần. Sau 1 giờ (60 phút), số lượng tế bào vi khuẩn trong quần thể là bao nhiêu?",
          answer: "800",
          acceptedAnswers: ["800", "800 tế bào"],
          unit: "tế bào",
          explanation: "Số lần phân chia n = 60 / 20 = 3 lần. Số tế bào thu được: N = N0 * 2^n = 100 * 2^3 = 100 * 8 = 800 tế bào."
        }
      ],
      "lop-11": [
        {
          id: "sh-11-p1-01",
          part: 1,
          question: "Ở thực vật trên cạn, cơ quan nào là bộ phận chủ yếu hấp thụ nước và ion khoáng từ đất?",
          options: ["Tế bào lông hút ở rễ", "Khí khổng ở mặt dưới lá", "Mạch rây ở thân cây", "Biểu bì thân non"],
          answer: 0,
          explanation: "Các tế bào lông hút ở vùng hút của rễ có diện tích bề mặt lớn, thành mỏng giúp hấp thụ nước và khoáng hiệu quả nhất."
        },
        {
          id: "sh-11-p1-02",
          part: 1,
          question: "Ở hệ tuần hoàn của người bình thường, loại mạch máu nào có tốc độ máu chảy chậm nhất giúp trao đổi chất hiệu quả giữa máu và tế bào?",
          options: ["Mao mạch", "Động mạch chủ", "Tĩnh mạch chủ", "Động mạch phổi"],
          answer: 0,
          explanation: "Mao mạch có tổng tiết diện ngang lớn nhất nên vận tốc máu chảy chậm nhất, tạo điều kiện cho quá trình trao đổi khí và chất dinh dưỡng."
        },
        {
          id: "sh-11-p2-01",
          part: 2,
          context: "Xét quá trình quang hợp ở thực vật C3, C4 và CAM thích nghi với các điều kiện môi trường khác nhau. Xét tính đúng/sai của các nhận định sau:",
          subQuestions: [
            {
              id: "sh-11-p2-01-a",
              text: "Pha sáng của quang hợp diễn ra tại màng thylakoid trong lục lạp và giải phóng khí O2 từ phân tử nước.",
              isCorrect: true,
              explanation: "Quang phân li nước tại pha sáng cung cấp electron, H+ và giải phóng O2."
            },
            {
              id: "sh-11-p2-01-b",
              text: "Thực vật CAM (như xương rồng, dứa) mở khí khổng vào ban đêm để lấy CO2 nhằm hạn chế thoát hơi nước.",
              isCorrect: true,
              explanation: "Sống ở vùng khô hạn, thực vật CAM đóng khí khổng ban ngày và mở ban đêm để cố định tạm CO2."
            },
            {
              id: "sh-11-p2-01-c",
              text: "Sản phẩm đầu tiên ổn định của chu trình Calvin ở thực vật C3 là hợp chất có 4 nguyên tử carbon (OAA).",
              isCorrect: false,
              explanation: "Sản phẩm đầu tiên của thực vật C3 là hợp chất 3 carbon (3-PGA); hợp chất 4 carbon là ở thực vật C4."
            },
            {
              id: "sh-11-p2-01-d",
              text: "Cường độ ánh sáng, nồng độ CO2 và nhiệt độ đều là các nhân tố ngoại cảnh ảnh hưởng trực tiếp đến cường độ quang hợp.",
              isCorrect: true,
              explanation: "Ba nhân tố này tác động trực tiếp lên pha sáng và hoạt tính enzyme của pha tối."
            }
          ],
          explanation: "Sinh lý quang hợp và thích nghi của thực vật (Sinh học 11 GDPT 2018)."
        },
        {
          id: "sh-11-p3-01",
          part: 3,
          question: "Một người trưởng thành khỏe mạnh có nhịp tim trung bình là 75 nhịp/phút. Thời gian trung bình của một chu kỳ tim ở người này là bao nhiêu giây?",
          answer: "0.8",
          acceptedAnswers: ["0.8", "0,8", "0.80"],
          unit: "giây",
          explanation: "Thời gian một chu kỳ tim = 60 giây / 75 nhịp = 0,8 giây (gồm pha co tâm nhĩ 0,1s, pha co tâm thất 0,3s, pha dãn chung 0,4s)."
        }
      ],
      "lop-12": [
        {
          id: "sh-12-p1-01",
          part: 1,
          question: "Theo mô hình điều hòa biểu hiện gen ở Operon Lac của vi khuẩn E. coli (Jacob và Monod), chất cảm ứng allolactose liên kết trực tiếp với thành phần nào để kích hoạt phiên mã?",
          options: ["Protein ức chế (LacI)", "Vùng vận hành (Operator)", "Enzyme RNA polymerase", "Gen cấu trúc lacZ"],
          answer: 0,
          explanation: "Allolactose gắn vào protein ức chế làm biến đổi cấu hình không gian của nó, khiến protein ức chế không thể bám vào vùng vận hành O."
        },
        {
          id: "sh-12-p1-02",
          part: 1,
          question: "Trong quần xã sinh vật, mối quan hệ nào sau đây thuộc nhóm quan hệ đối kháng (một loài có lợi, một loài bị hại hoặc cả hai cùng bị hại)?",
          options: [
            "Cây tầm gửi sống bám trên thân cây gỗ lớn",
            "Vi khuẩn Rhizobium sống trong nốt sần rễ cây họ Đậu",
            "Cá ép bám vào thân cá lớn để di chuyển và ăn thức ăn thừa",
            "Chim sáo đậu trên lưng trâu bắt ve bét"
          ],
          answer: 0,
          explanation: "Tầm gửi ký sinh hút nước và chất dinh dưỡng từ cây chủ (quan hệ ký sinh - vật chủ). Ba trường hợp còn lại là cộng sinh hoặc hội sinh."
        },
        {
          id: "sh-12-p2-01",
          part: 2,
          context: "Xét một quần thể thực vật giao phấn ngẫu nhiên đang ở trạng thái cân bằng di truyền Hardy-Weinberg với 1 gen gồm 2 alen A (hoa đỏ) trội hoàn toàn so với a (hoa trắng). Biết tần số kiểu gen hoa trắng (aa) trong quần thể là 0,16 (16%). Xét tính đúng/sai:",
          subQuestions: [
            {
              id: "sh-12-p2-01-a",
              text: "Tần số alen lặn a trong quần thể bằng q = 0,4.",
              isCorrect: true,
              explanation: "Vì quần thể cân bằng nên q^2 = 0,16 => q(a) = √0,16 = 0,4."
            },
            {
              id: "sh-12-p2-01-b",
              text: "Tần số alen trội A trong quần thể là p = 0,6.",
              isCorrect: true,
              explanation: "Ta có p + q = 1 => p(A) = 1 - 0,4 = 0,6."
            },
            {
              id: "sh-12-p2-01-c",
              text: "Tỉ lệ cá thể hoa đỏ dị hợp tử (Aa) trong quần thể chiếm 48%.",
              isCorrect: true,
              explanation: "Tỉ lệ Aa = 2 * p * q = 2 * 0,6 * 0,4 = 0,48 (48%)."
            },
            {
              id: "sh-12-p2-01-d",
              text: "Tỉ lệ cây hoa đỏ thuần chủng (AA) lớn hơn tỉ lệ cây hoa đỏ dị hợp (Aa).",
              isCorrect: false,
              explanation: "Tỉ lệ AA = p^2 = 0,6^2 = 0,36 (36%), nhỏ hơn tỉ lệ Aa = 48%."
            }
          ],
          explanation: "Cấu trúc di truyền quần thể ngẫu phối theo định luật Hardy-Weinberg (Sinh học 12)."
        },
        {
          id: "sh-12-p3-01",
          part: 3,
          question: "Trong một chuỗi thức ăn ở hệ sinh thái đồng cỏ: Cỏ → Sâu ăn lá → Chim sẻ → Diều hâu. Nếu năng lượng tích lũy ở bậc dinh dưỡng Cỏ là 10.000 kcal và hiệu suất sinh thái qua mỗi bậc dinh dưỡng là 10%, thì năng lượng tích lũy ở bậc dinh dưỡng Diều hâu bằng bao nhiêu kcal?",
          answer: "10",
          acceptedAnswers: ["10", "10.0", "10,0"],
          unit: "kcal",
          explanation: "Cỏ (10.000) → Sâu (1.000) → Chim sẻ (100) → Diều hâu (10 kcal). Tính nhanh: 10.000 × (0,1)^3 = 10 kcal."
        }
      ]
    }
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
    ],
    questionsByGrade: {
      "lop-10": [
        {
          id: "ls-10-p1-01",
          part: 1,
          question: "Chữ viết tượng hình cổ đại được cư dân Ai Cập viết trên chất liệu nào sau đây?",
          options: ["Giấy Pa-pi-rút (Papyrus)", "Mai rùa và xương thú", "Thẻ tre và lụa tơ tằm", "Đất sét nung hình nêm"],
          answer: 0,
          explanation: "Người Ai Cập cổ đại dùng thân cây sậy Papyrus dọc sông Nin chế tạo ra giấy Pa-pi-rút để ghi chép chữ tượng hình."
        },
        {
          id: "ls-10-p1-02",
          part: 1,
          question: "Trong lịch sử Việt Nam thời kỳ phong kiến, quốc hiệu 'Đại Việt' lần đầu tiên được vua nào đặt vào năm 1054?",
          options: ["Lý Thánh Tông", "Lý Thái Tổ", "Đinh Tiên Hoàng", "Lê Thánh Tông"],
          answer: 0,
          explanation: "Năm 1054, vua Lý Thánh Tông đổi quốc hiệu từ Đại Cồ Việt thành Đại Việt, mở ra thời kỳ phát triển rực rỡ của văn minh Đại Việt."
        },
        {
          id: "ls-10-p2-01",
          part: 2,
          context: "Tìm hiểu về Cách mạng công nghiệp lần thứ nhất (nửa sau thế kỷ XVIII - giữa thế kỷ XIX) khởi phát tại nước Anh. Xét tính đúng/sai của các nhận định sau:",
          subQuestions: [
            {
              id: "ls-10-p2-01-a",
              text: "Phát minh mang tính bước ngoặt của Cách mạng công nghiệp lần thứ nhất là máy hơi nước của James Watt (1784).",
              isCorrect: true,
              explanation: "Động cơ hơi nước của James Watt giúp các nhà máy không còn phụ thuộc vào sức nước hay vị trí ven sông."
            },
            {
              id: "ls-10-p2-01-b",
              text: "Ngành công nghiệp khởi đầu cuộc cách mạng này ở nước Anh là ngành dệt.",
              isCorrect: true,
              explanation: "Các phát minh như con thoi bay, máy kéo sợi Jenny, máy dệt chạy bằng sức nước đều bắt đầu từ ngành công nghiệp nhẹ (dệt)."
            },
            {
              id: "ls-10-p2-01-c",
              text: "Cuộc cách mạng này đã thúc đẩy quá trình chuyển từ lao động thủ công sang cơ khí hóa bằng máy móc.",
              isCorrect: true,
              explanation: "Đặc trưng cốt lõi của Cách mạng công nghiệp lần thứ nhất là cơ khí hóa sản xuất."
            },
            {
              id: "ls-10-p2-01-d",
              text: "Động cơ đốt trong, điện năng và dây chuyền sản xuất hàng loạt là thành tựu đặc trưng của Cách mạng công nghiệp lần thứ nhất.",
              isCorrect: false,
              explanation: "Điện năng, động cơ đốt trong và dây chuyền hàng loạt thuộc về Cách mạng công nghiệp lần thứ hai (cuối thế kỷ XIX)."
            }
          ],
          explanation: "Thành tựu và ý nghĩa của các cuộc cách mạng công nghiệp thời cận đại (Lịch sử 10 GDPT 2018)."
        },
        {
          id: "ls-10-p3-01",
          part: 3,
          question: "Triều đại nhà Lý chọn vùng đất Đại La làm kinh đô mới và đổi tên thành Thăng Long (Hà Nội ngày nay) vào năm nào sau Công nguyên?",
          answer: "1010",
          acceptedAnswers: ["1010", "năm 1010"],
          unit: "",
          explanation: "Năm 1010, vua Lý Thái Tổ ban Chiếu dời đô, chuyển kinh đô từ Hoa Lư (Ninh Bình) ra thành Đại La và đặt tên là Thăng Long."
        }
      ],
      "lop-11": [
        {
          id: "ls-11-p1-01",
          part: 1,
          question: "Sự kiện lịch sử nào vào năm 1776 đánh dấu sự ra đời của Hợp chúng quốc Hoa Kỳ (nước Mỹ)?",
          options: [
            "Tuyên ngôn Độc lập của 13 thuộc địa Anh ở Bắc Mỹ được thông qua",
            "Hội nghị Hiến pháp tại Philadelphia ban hành Hiến pháp mới",
            "Thực dân Anh ký Hiệp ước Paris công nhận nền độc lập",
            "Sự kiện 'Tiệc trà Boston' phản đối thuế của thực dân Anh"
          ],
          answer: 0,
          explanation: "Ngày 4/7/1776, bản Tuyên ngôn Độc lập (do Thomas Jefferson soạn thảo) được thông qua, tuyên bố 13 thuộc địa tách khỏi Anh thành lập Hợp chúng quốc Hoa Kỳ."
        },
        {
          id: "ls-11-p1-02",
          part: 1,
          question: "Chiến thắng Bạch Đằng năm 938 do Ngô Quyền lãnh đạo đã đánh bại quân xâm lược nào, mở ra thời kỳ độc lập tự chủ lâu dài cho dân tộc Việt Nam?",
          options: ["Quân Nam Hán", "Quân Tống", "Quân Mông - Nguyên", "Quân Thanh"],
          answer: 0,
          explanation: "Năm 938, Ngô Quyền sử dụng trận địa cọc ngầm trên sông Bạch Đằng đánh tan thủy quân Nam Hán, chấm dứt hơn 1000 năm Bắc thuộc."
        },
        {
          id: "ls-11-p2-01",
          part: 2,
          context: "Xét cuộc kháng chiến chống quân xâm lược Mông - Nguyên của quân dân nhà Trần ở thế kỷ XIII (ba lần vào các năm 1258, 1285, 1287-1288). Xét tính đúng/sai:",
          subQuestions: [
            {
              id: "ls-11-p2-01-a",
              text: "Nhà Trần đã thực hiện kế sách 'vườn không nhà trống' để làm tiêu hao sinh lực và lương thực của quân giặc.",
              isCorrect: true,
              explanation: "Rút lui chiến lược kết hợp 'thanh dã' (vườn không nhà trống) tại kinh thành Thăng Long là nghệ thuật quân sự đặc sắc của nhà Trần."
            },
            {
              id: "ls-11-p2-01-b",
              text: "Hội nghị Diên Hồng được triệu tập năm 1285 thể hiện ý chí đoàn kết quyết tâm kháng chiến của toàn dân.",
              isCorrect: true,
              explanation: "Các bô lão đại diện cho nhân dân cả nước tại Hội nghị Diên Hồng đã đồng thanh hô 'Đánh!' trước nguy cơ xâm lược của quân Nguyên."
            },
            {
              id: "ls-11-p2-01-c",
              text: "Chiến thắng Chi Lăng - Xương Giang năm 1427 là trận quyết chiến chiến lược kết thúc cuộc kháng chiến chống quân Nguyên lần thứ ba.",
              isCorrect: false,
              explanation: "Chi Lăng - Xương Giang (1427) thuộc khởi nghĩa Lam Sơn chống quân Minh; trận quyết chiến chống quân Nguyên lần 3 là trận Bạch Đằng năm 1288."
            },
            {
              id: "ls-11-p2-01-d",
              text: "Hưng Đạo Đại Vương Trần Quốc Tuấn là người trực tiếp soạn thảo 'Hịch tướng sĩ' để khích lệ tinh thần quân đội.",
              isCorrect: true,
              explanation: "'Hịch tướng sĩ' được Trần Quốc Tuấn soạn thảo trước cuộc kháng chiến lần thứ hai (1285)."
            }
          ],
          explanation: "Lịch sử chiến tranh bảo vệ Tổ quốc thời Trần (Lịch sử 11 GDPT 2018)."
        },
        {
          id: "ls-11-p3-01",
          part: 3,
          question: "Cuộc khởi nghĩa Lam Sơn do Lê Lợi lãnh đạo giải phóng đất nước khỏi ách đô hộ của nhà Minh bùng nổ vào năm nào?",
          answer: "1418",
          acceptedAnswers: ["1418", "năm 1418"],
          unit: "",
          explanation: "Đầu năm 1418, Lê Lợi dựng cờ khởi nghĩa tại vùng núi Lam Sơn (Thanh Hóa), đến cuối năm 1427 giành thắng lợi hoàn toàn."
        }
      ],
      "lop-12": [
        {
          id: "ls-12-p1-01",
          part: 1,
          question: "Hiệp hội các quốc gia Đông Nam Á (ASEAN) được thành lập ngày 8/8/1967 tại Băng Cốc (Thái Lan) với sự tham gia của bao nhiêu nước sáng lập?",
          options: ["5 nước", "7 nước", "10 nước", "6 nước"],
          answer: 0,
          explanation: "5 quốc gia sáng lập ASEAN năm 1967 gồm: Indonesia, Malaysia, Philippines, Singapore và Thái Lan."
        },
        {
          id: "ls-12-p1-02",
          part: 1,
          question: "Đường lối Đổi mới toàn diện đất nước ở Việt Nam được Đảng Cộng sản Việt Nam chính thức đề ra tại Đại hội đại biểu toàn quốc lần thứ mấy?",
          options: ["Đại hội VI (1986)", "Đại hội V (1982)", "Đại hội VII (1991)", "Đại hội VIII (1996)"],
          answer: 0,
          explanation: "Đại hội VI (tháng 12/1986) là dấu mốc khởi xướng công cuộc Đổi mới toàn diện, chuyển từ kinh tế tập trung bao cấp sang kinh tế hàng hóa nhiều thành phần."
        },
        {
          id: "ls-12-p2-01",
          part: 2,
          context: "Xét tình hình thế giới từ sau Hội nghị Ianta (2/1945) đến khi Trật tự thế giới hai cực Ianta sụp đổ (1991). Xét tính đúng/sai:",
          subQuestions: [
            {
              id: "ls-12-p2-01-a",
              text: "Hội nghị Ianta có sự tham gia của nguyên thủ ba cường quốc: Liên Xô, Mỹ và Anh.",
              isCorrect: true,
              explanation: "Ba lãnh đạo tham dự Hội nghị Ianta là Stalin (Liên Xô), Roosevelt (Mỹ) và Churchill (Anh)."
            },
            {
              id: "ls-12-p2-01-b",
              text: "Một trong những quyết định quan trọng của Hội nghị Ianta là thành lập tổ chức Liên hợp quốc để duy trì hòa bình và an ninh thế giới.",
              isCorrect: true,
              explanation: "Liên hợp quốc được thống nhất chủ trương thành lập tại Hội nghị Ianta và chính thức thành lập năm 1945."
            },
            {
              id: "ls-12-p2-01-c",
              text: "Trong suốt thời kỳ Chiến tranh lạnh, Mỹ và Liên Xô đã trực tiếp giao chiến quân sự toàn diện với nhau tại châu Âu.",
              isCorrect: false,
              explanation: "Chiến tranh lạnh là cuộc đối đầu căng thẳng về chính trị, quân sự, kinh tế, ý thức hệ nhưng không nổ ra xung đột quân sự trực tiếp giữa Mỹ và Liên Xô."
            },
            {
              id: "ls-12-p2-01-d",
              text: "Sự tan rã của Liên Xô vào năm 1991 đã chính thức chấm dứt Trật tự hai cực Ianta.",
              isCorrect: true,
              explanation: "Cuối năm 1991, Liên Xô sụp đổ làm cực đối trọng biến mất, thế giới chuyển dần sang xu thế đa cực."
            }
          ],
          explanation: "Trật tự thế giới hai cực Ianta và Chiến tranh lạnh (Lịch sử 12 GDPT 2018)."
        },
        {
          id: "ls-12-p3-01",
          part: 3,
          question: "Việt Nam chính thức gia nhập và trở thành thành viên thứ 7 của Hiệp hội các quốc gia Đông Nam Á (ASEAN) vào năm nào?",
          answer: "1995",
          acceptedAnswers: ["1995", "năm 1995"],
          unit: "",
          explanation: "Ngày 28/7/1995, Việt Nam chính thức gia nhập ASEAN, mở ra giai đoạn hội nhập sâu rộng vào khu vực Đông Nam Á."
        }
      ]
    }
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
    ],
    questionsByGrade: {
      "lop-10": [
        {
          id: "dl-10-p1-01",
          part: 1,
          question: "Hệ quả nào sau đây sinh ra do chuyển động tự quay quanh trục của Trái Đất?",
          options: [
            "Hiện tượng ngày đêm luân phiên và giờ trên Trái Đất",
            "Hiện tượng các mùa xuân, hạ, thu, đông trong năm",
            "Hiện tượng ngày đêm dài ngắn khác nhau theo vĩ độ",
            "Hiện tượng chuyển động biểu kiến hàng năm của Mặt Trời"
          ],
          answer: 0,
          explanation: "Chuyển động tự quay quanh trục gây ra sự luân phiên ngày đêm, giờ địa phương/múi giờ và sự lệch hướng chuyển động (lực Coriolis). Ba hệ quả còn lại do chuyển động quanh Mặt Trời."
        },
        {
          id: "dl-10-p1-02",
          part: 1,
          question: "Loại gió nào thổi thường xuyên quanh năm từ vùng áp cao cận chí tuyến về vùng áp thấp xích đạo?",
          options: ["Gió Mậu dịch (Tín phong)", "Gió Tây ôn đới", "Gió Đông cực", "Gió mùa Tây Nam"],
          answer: 0,
          explanation: "Gió Mậu dịch (Tín phong) thổi đều đặn quanh năm từ hai đai áp cao cận nhiệt đới (khoảng 30° Bắc và Nam) về đai áp thấp xích đạo."
        },
        {
          id: "dl-10-p2-01",
          part: 2,
          context: "Phân tích đặc điểm khí quyển và các yếu tố thời tiết trên bề mặt Trái Đất. Xét tính đúng/sai của các phát biểu sau:",
          subQuestions: [
            {
              id: "dl-10-p2-01-a",
              text: "Tầng đối lưu là nơi tập trung khoảng 80% khối lượng không khí và diễn ra hầu hết các hiện tượng thời tiết (mây, mưa, gió).",
              isCorrect: true,
              explanation: "Tầng đối lưu sát mặt đất chứa phần lớn hơi nước và không khí nên tập trung các hiện tượng thời tiết."
            },
            {
              id: "dl-10-p2-01-b",
              text: "Trong tầng đối lưu, càng lên cao nhiệt độ không khí càng tăng nhanh.",
              isCorrect: false,
              explanation: "Trong tầng đối lưu, càng lên cao nhiệt độ càng giảm (trung bình giảm 0,6°C khi lên cao 100 m)."
            },
            {
              id: "dl-10-p2-01-c",
              text: "Gió luôn thổi từ nơi có khí áp cao về nơi có khí áp thấp.",
              isCorrect: true,
              explanation: "Sự chênh lệch khí áp (gradient khí áp) là nguyên nhân trực tiếp sinh ra gió từ áp cao đến áp thấp."
            },
            {
              id: "dl-10-p2-01-d",
              text: "Ở bán cầu Bắc, dưới tác động của lực Coriolis, vật chuyển động bị lệch về bên phải theo hướng chuyển động.",
              isCorrect: true,
              explanation: "Lực Coriolis làm lệch hướng chuyển động sang phải ở Bắc bán cầu và sang trái ở Nam bán cầu."
            }
          ],
          explanation: "Kiến thức về Khí quyển, gió và hoàn lưu khí quyển (Địa lý 10 GDPT 2018)."
        },
        {
          id: "dl-10-p3-01",
          part: 3,
          question: "Một trận đấu bóng đá diễn ra tại Luân Đôn (múi giờ số 0 - GMT) vào lúc 14 giờ 00 cùng ngày. Khi đó tại Hà Nội (Việt Nam, múi giờ số +7) là mấy giờ cùng ngày?",
          answer: "21",
          acceptedAnswers: ["21", "21h", "21 giờ", "21:00"],
          unit: "giờ",
          explanation: "Việt Nam ở phía Đông kinh tuyến gốc (múi giờ +7) nên giờ đi trước Luân Đôn 7 tiếng: 14 + 7 = 21 giờ."
        }
      ],
      "lop-11": [
        {
          id: "dl-11-p1-01",
          part: 1,
          question: "Tổ chức nào sau đây được thành lập năm 1995 nhằm thiết lập các quy tắc thương mại toàn cầu và giải quyết tranh chấp thương mại giữa các quốc gia?",
          options: ["Tổ chức Thương mại Thế giới (WTO)", "Liên minh Châu Âu (EU)", "Ngân hàng Thế giới (WB)", "Quỹ Tiền tệ Quốc tế (IMF)"],
          answer: 0,
          explanation: "WTO (World Trade Organization) thành lập năm 1995 trên cơ sở hiệp định GATT, điều phối thương mại quốc tế toàn cầu."
        },
        {
          id: "dl-11-p1-02",
          part: 1,
          question: "Đặc điểm nổi bật của vùng kinh tế phía Tây Hoa Kỳ (như bang California) so với vùng Đông Bắc truyền thống là gì?",
          options: [
            "Tập trung mạnh các ngành công nghệ cao, điện tử, hàng không vũ trụ và công nghiệp điện ảnh",
            "Chỉ phát triển khai thác than đá và luyện kim đen truyền thống",
            "Có mật độ dân số thấp nhất và hoàn toàn không có cảng biển quốc tế",
            "Nông nghiệp lạc hậu, chủ yếu du mục quảng canh"
          ],
          answer: 0,
          explanation: "Vùng phía Tây Hoa Kỳ nổi bật với Thung lũng Silicon (CNTT), công nghiệp hàng không vũ trụ và giải trí Hollywood."
        },
        {
          id: "dl-11-p2-01",
          part: 2,
          context: "Tìm hiểu về Liên minh Châu Âu (EU) và quá trình liên kết kinh tế khu vực. Xét tính đúng/sai của các nhận định sau:",
          subQuestions: [
            {
              id: "dl-11-p2-01-a",
              text: "Thị trường chung châu Âu đảm bảo 4 quyền tự do lưu thông: hàng hóa, dịch vụ, vốn và con người.",
              isCorrect: true,
              explanation: "Bốn tự do lưu thông là trụ cột kinh tế cốt lõi của Thị trường chung EU."
            },
            {
              id: "dl-11-p2-01-b",
              text: "Việc sử dụng đồng tiền chung Euro (EUR) giúp các nước thành viên xóa bỏ rủi ro chuyển đổi tiền tệ và thúc đẩy thương mại nội khối.",
              isCorrect: true,
              explanation: "Đồng Euro tạo thuận lợi cho thanh toán, so sánh giá cả và luân chuyển vốn trong khu vực Eurozone."
            },
            {
              id: "dl-11-p2-01-c",
              text: "Tất cả các quốc gia thuộc Liên minh Châu Âu đều sử dụng đồng Euro làm tiền tệ chính thức.",
              isCorrect: false,
              explanation: "Một số thành viên EU như Thụy Điển, Ba Lan, Đan Mạch vẫn giữ đồng tiền riêng."
            },
            {
              id: "dl-11-p2-01-d",
              text: "EU là một trong những trung tâm kinh tế và thương mại hàng đầu thế giới hiện nay.",
              isCorrect: true,
              explanation: "EU chiếm tỉ trọng lớn trong GDP toàn cầu và kim ngạch xuất nhập khẩu thế giới."
            }
          ],
          explanation: "Địa lý khu vực và Liên minh Châu Âu (Địa lý 11 GDPT 2018)."
        },
        {
          id: "dl-11-p3-01",
          part: 3,
          question: "Năm 2022, một quốc gia có kim ngạch xuất khẩu đạt 371,3 tỉ USD và kim ngạch nhập khẩu đạt 358,9 tỉ USD. Cán cân xuất nhập khẩu của quốc gia đó đạt xuất siêu bao nhiêu tỉ USD? (Làm tròn 1 chữ số thập phân)",
          answer: "12.4",
          acceptedAnswers: ["12.4", "12,4"],
          unit: "tỉ USD",
          explanation: "Cán cân thương mại = Xuất khẩu - Nhập khẩu = 371,3 - 358,9 = +12,4 tỉ USD (xuất siêu 12,4 tỉ USD)."
        }
      ],
      "lop-12": [
        {
          id: "dl-12-p1-01",
          part: 1,
          question: "Tính chất nhiệt đới của khí hậu nước ta được quy định chủ yếu bởi yếu tố nào sau đây?",
          options: [
            "Nước ta nằm hoàn toàn trong vùng nội chí tuyến bán cầu Bắc, nhận lượng bức xạ Mặt Trời lớn",
            "Địa hình nước ta có 3/4 diện tích là đồi núi thấp",
            "Đường bờ biển dài hình chữ S mở rộng ra Biển Đông",
            "Hoạt động của gió mùa Đông Bắc vào mùa đông"
          ],
          answer: 0,
          explanation: "Vị trí nằm trong vùng nội chí tuyến Bắc bán cầu tạo nên góc nhập xạ lớn và hai lần Mặt Trời lên thiên đỉnh trong năm, quyết định tính chất nhiệt đới."
        },
        {
          id: "dl-12-p1-02",
          part: 1,
          question: "Vùng kinh tế nào của Việt Nam dẫn đầu cả nước về sản lượng thủy sản nuôi trồng và xuất khẩu lúa gạo?",
          options: ["Đồng bằng sông Cửu Long", "Đồng bằng sông Hồng", "Tây Nguyên", "Trung du và miền núi Bắc Bộ"],
          answer: 0,
          explanation: "Đồng bằng sông Cửu Long là vựa lúa và vùng nuôi trồng, chế biến thủy sản xuất khẩu lớn nhất cả nước."
        },
        {
          id: "dl-12-p2-01",
          part: 2,
          context: "Xét đặc điểm địa hình và thiên nhiên phân hóa đa dạng của Việt Nam. Xét tính đúng/sai của các mệnh đề sau:",
          subQuestions: [
            {
              id: "dl-12-p2-01-a",
              text: "Địa hình nước ta có tính chất phân bậc rõ rệt và thấp dần theo hướng Tây Bắc - Đông Nam.",
              isCorrect: true,
              explanation: "Các dãy núi và đồng bằng lớn (như Hoàng Liên Sơn, sông Hồng) chủ yếu chạy theo hướng Tây Bắc - Đông Nam."
            },
            {
              id: "dl-12-p2-01-b",
              text: "Thiên nhiên nước ta có sự phân hóa theo chiều Bắc - Nam, trong đó ranh giới tự nhiên tiêu biểu là dãy Bạch Mã.",
              isCorrect: true,
              explanation: "Phía Bắc dãy Bạch Mã (từ 16°B trở ra) có mùa đông lạnh; phía Nam mang tính cận xích đạo nóng quanh năm."
            },
            {
              id: "dl-12-p2-01-c",
              text: "Đồi núi chiếm khoảng 3/4 diện tích phần đất liền nhưng chủ yếu là núi cao trên 2000 m.",
              isCorrect: false,
              explanation: "Địa hình đồi núi chiếm 3/4 diện tích nhưng chủ yếu là đồi núi thấp (dưới 1000 m chiếm tới 85% diện tích đồi núi)."
            },
            {
              id: "dl-12-p2-01-d",
              text: "Khí hậu vùng Tây Nguyên và Đông Nam Bộ phân hóa thành hai mùa mưa - khô rõ rệt.",
              isCorrect: true,
              explanation: "Do tác động của gió mùa Tây Nam và Tín phong bán cầu Bắc kết hợp địa hình Trường Sơn."
            }
          ],
          explanation: "Sự phân hóa thiên nhiên và đặc điểm địa hình Việt Nam (Địa lý 12 GDPT 2018)."
        },
        {
          id: "dl-12-p3-01",
          part: 3,
          question: "Tại trạm khí tượng Hà Nội (năm 2022), nhiệt độ trung bình tháng nóng nhất (tháng 7) là 29,8°C và tháng lạnh nhất (tháng 1) là 16,4°C. Biên độ nhiệt trung bình năm của Hà Nội bằng bao nhiêu °C?",
          answer: "13.4",
          acceptedAnswers: ["13.4", "13,4"],
          unit: "°C",
          explanation: "Biên độ nhiệt năm = Nhiệt độ tháng cao nhất - Nhiệt độ tháng thấp nhất = 29,8 - 16,4 = 13,4°C."
        }
      ]
    }
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
    ],
    questionsByGrade: {
      "lop-10": [
        {
          id: "gdkt-10-p1-01",
          part: 1,
          question: "Trong nền kinh tế, chủ thể nào thực hiện vai trò cầu nối giữa người sản xuất và người tiêu dùng, giúp hàng hóa lưu thông trên thị trường?",
          options: ["Chủ thể trung gian", "Chủ thể nhà nước", "Chủ thể sản xuất", "Chủ thể tiêu dùng"],
          answer: 0,
          explanation: "Chủ thể trung gian (thương nhân, đại lý, môi giới...) kết nối sản xuất với tiêu dùng, làm cho nền kinh tế vận hành linh hoạt."
        },
        {
          id: "gdkt-10-p1-02",
          part: 1,
          question: "Loại thuế nào sau đây đánh trực tiếp vào thu nhập của người có thu nhập cao theo biểu thuế lũy tiến từng phần?",
          options: ["Thuế thu nhập cá nhân", "Thuế giá trị gia tăng (VAT)", "Thuế tiêu thụ đặc biệt", "Thuế xuất nhập khẩu"],
          answer: 0,
          explanation: "Thuế thu nhập cá nhân là thuế trực thu, đánh trực tiếp vào thu nhập chịu thuế của cá nhân."
        },
        {
          id: "gdkt-10-p2-01",
          part: 2,
          context: "Bạn Minh (học sinh lớp 10) được bố mẹ cho 2.000.000 đồng tiền mừng tuổi và dự định gửi tiết kiệm hoặc lập kế hoạch tài chính cá nhân cho 6 tháng học kỳ II. Xét tính đúng/sai:",
          subQuestions: [
            {
              id: "gdkt-10-p2-01-a",
              text: "Việc xác định mục tiêu tài chính cụ thể (mua sách, dự phòng, tiết kiệm) là bước đầu tiên khi lập kế hoạch tài chính cá nhân.",
              isCorrect: true,
              explanation: "Lập kế hoạch tài chính cá nhân bắt đầu từ xác định mục tiêu tài chính rõ ràng và thực tế."
            },
            {
              id: "gdkt-10-p2-01-b",
              text: "Tín dụng là quan hệ vay mượn dựa trên sự tin tưởng, trong đó bên đi vay phải hoàn trả cả gốc và lãi đúng thời hạn.",
              isCorrect: true,
              explanation: "Đặc trưng cơ bản của tín dụng là tính tạm thời, dựa trên niềm tin và có hoàn trả kèm lãi suất (hoặc điều kiện thỏa thuận)."
            },
            {
              id: "gdkt-10-p2-01-c",
              text: "Lập kế hoạch tài chính cá nhân chỉ phù hợp với người đã đi làm có thu nhập cao, học sinh không cần thực hiện.",
              isCorrect: false,
              explanation: "Học sinh rèn luyện lập kế hoạch tài chính cá nhân từ sớm giúp kiểm soát chi tiêu và tránh bội chi."
            },
            {
              id: "gdkt-10-p2-01-d",
              text: "Gửi tiết kiệm tại ngân hàng thương mại có mức độ an toàn cao hơn so với cho vay nặng lãi không có hợp đồng.",
              isCorrect: true,
              explanation: "Ngân hàng được Nhà nước quản lý và có bảo hiểm tiền gửi, an toàn và hợp pháp."
            }
          ],
          explanation: "Kiến thức về Tín dụng và Kế hoạch tài chính cá nhân (GDKT&PL 10 GDPT 2018)."
        },
        {
          id: "gdkt-10-p3-01",
          part: 3,
          question: "Theo Hiến pháp năm 2013 nước CHXHCN Việt Nam, công dân từ đủ bao nhiêu tuổi trở lên có quyền bầu cử đại biểu Quốc hội và Hội đồng nhân dân?",
          answer: "18",
          acceptedAnswers: ["18", "18 tuổi", "đủ 18 tuổi"],
          unit: "tuổi",
          explanation: "Điều 27 Hiến pháp 2013 quy định công dân đủ 18 tuổi trở lên có quyền bầu cử và đủ 21 tuổi trở lên có quyền ứng cử."
        }
      ],
      "lop-11": [
        {
          id: "gdkt-11-p1-01",
          part: 1,
          question: "Khi mức giá chung của hàng hóa và dịch vụ trong nền kinh tế tăng lên liên tục trong một thời gian nhất định, làm giảm sức mua của đồng tiền, hiện tượng đó gọi là gì?",
          options: ["Lạm phát", "Giảm phát", "Thất nghiệp", "Cạnh tranh lành mạnh"],
          answer: 0,
          explanation: "Lạm phát là sự tăng mức giá chung một cách liên tục của hàng hóa, dịch vụ và sự mất giá của đồng tiền."
        },
        {
          id: "gdkt-11-p1-02",
          part: 1,
          question: "Hành vi nào sau đây thể hiện đạo đức kinh doanh lành mạnh của doanh nghiệp?",
          options: [
            "Công khai minh bạch thông tin thành phần và hạn sử dụng sản phẩm, nộp thuế đầy đủ",
            "Tung tin thất thiệt nhằm hạ uy tín đối thủ cạnh tranh",
            "Sản xuất hàng giả nhái thương hiệu nổi tiếng để thu lợi nhuận cao",
            "Xả thải chưa qua xử lý ra sông ngòi để tiết kiệm chi phí"
          ],
          answer: 0,
          explanation: "Đạo đức kinh doanh đòi hỏi sự trung thực, giữ chữ tín với khách hàng và tuân thủ pháp luật."
        },
        {
          id: "gdkt-11-p2-01",
          part: 2,
          context: "Chị H nộp hồ sơ ứng tuyển vào vị trí nhân viên thiết kế tại một công ty truyền thông. Công ty từ chối nhận chị H với lý do duy nhất là chị là nữ giới, dù điểm bài kiểm tra chuyên môn của chị cao nhất vòng tuyển dụng. Xét tính đúng/sai:",
          subQuestions: [
            {
              id: "gdkt-11-p2-01-a",
              text: "Công ty đã vi phạm quyền bình đẳng của công dân trong lĩnh vực lao động và bình đẳng giới.",
              isCorrect: true,
              explanation: "Mọi công dân không phân biệt nam, nữ đều có quyền bình đẳng về cơ hội tiếp cận việc làm theo năng lực."
            },
            {
              id: "gdkt-11-p2-01-b",
              text: "Quyền bình đẳng trước pháp luật nghĩa là mọi công dân đều bình đẳng về hưởng quyền và làm nghĩa vụ theo quy định pháp luật.",
              isCorrect: true,
              explanation: "Đây là nội dung cốt lõi của nguyên tắc bình đẳng trước pháp luật trong Hiến pháp và pháp luật Việt Nam."
            },
            {
              id: "gdkt-11-p2-01-c",
              text: "Doanh nghiệp tư nhân có toàn quyền phân biệt đối xử theo giới tính trong tuyển dụng mà không chịu sự điều chỉnh của Bộ luật Lao động.",
              isCorrect: false,
              explanation: "Mọi doanh nghiệp hoạt động tại Việt Nam đều phải tuân thủ quy định cấm phân biệt đối xử trong Bộ luật Lao động."
            },
            {
              id: "gdkt-11-p2-01-d",
              text: "Chị H có quyền khiếu nại hành vi phân biệt đối xử trong tuyển dụng theo quy định của pháp luật.",
              isCorrect: true,
              explanation: "Công dân có quyền khiếu nại khi quyền và lợi ích hợp pháp của mình bị xâm phạm."
            }
          ],
          explanation: "Quyền bình đẳng của công dân và bình đẳng giới (GDKT&PL 11 GDPT 2018)."
        },
        {
          id: "gdkt-11-p3-01",
          part: 3,
          question: "Nếu chỉ số giá tiêu dùng (CPI) của một quốc gia năm 2025 là 105 và năm 2026 là 109,2 thì tỉ lệ lạm phát của năm 2026 là bao nhiêu phần trăm (%)?",
          answer: "4",
          acceptedAnswers: ["4", "4%", "4.0", "4,0"],
          unit: "%",
          explanation: "Tỉ lệ lạm phát = [(CPI_2026 - CPI_2025) / CPI_2025] × 100% = [(109,2 - 105) / 105] × 100% = 4,2 / 105 × 100% = 4%."
        }
      ],
      "lop-12": [
        {
          id: "gdkt-12-p1-01",
          part: 1,
          question: "Sự gia tăng về quy mô sản lượng (GDP, GNI) của một nền kinh tế gắn liền với tiến bộ xã hội, nâng cao chất lượng sống và bảo vệ môi trường được gọi là:",
          options: ["Phát triển kinh tế", "Tăng trưởng kinh tế thuần túy", "Cán cân thanh toán", "Bảo hộ mậu dịch"],
          answer: 0,
          explanation: "Phát triển kinh tế rộng hơn tăng trưởng kinh tế: bao gồm tăng trưởng kinh tế gắn với chuyển dịch cơ cấu hợp lý và tiến bộ, công bằng xã hội."
        },
        {
          id: "gdkt-12-p1-02",
          part: 1,
          question: "Loại hình bảo hiểm nào do Nhà nước tổ chức, mang tính chất bắt buộc đối với người lao động có hợp đồng lao động từ đủ 1 tháng trở lên nhằm bù đắp thu nhập khi ốm đau, thai sản, hưu trí?",
          options: ["Bảo hiểm xã hội bắt buộc", "Bảo hiểm nhân thọ thương mại", "Bảo hiểm tài sản tự nguyện", "Bảo hiểm trách nhiệm dân sự xe cơ giới"],
          answer: 0,
          explanation: "Bảo hiểm xã hội bắt buộc là trụ cột an sinh xã hội do Nhà nước tổ chức cho người lao động."
        },
        {
          id: "gdkt-12-p2-01",
          part: 2,
          context: "Anh K là tác giả một phần mềm học tập đã được đăng ký bản quyền hợp pháp. Công ty X tự ý sao chép mã nguồn, đổi tên phần mềm của anh K để bán thu lợi nhuận mà không xin phép hay trả tiền bản quyền. Xét tính đúng/sai:",
          subQuestions: [
            {
              id: "gdkt-12-p2-01-a",
              text: "Công ty X đã xâm phạm quyền sở hữu trí tuệ (cụ thể là quyền tác giả) của anh K.",
              isCorrect: true,
              explanation: "Chương trình máy tính được pháp luật bảo hộ quyền tác giả theo Luật Sở hữu trí tuệ."
            },
            {
              id: "gdkt-12-p2-01-b",
              text: "Anh K có quyền yêu cầu cơ quan chức năng xử lý vi phạm và đòi bồi thường thiệt hại vật chất lẫn tinh thần.",
              isCorrect: true,
              explanation: "Chủ sở hữu quyền tác giả được quyền tự bảo vệ hoặc yêu cầu tòa án, cơ quan nhà nước xử lý hành vi xâm phạm."
            },
            {
              id: "gdkt-12-p2-01-c",
              text: "Chỉ cần công ty X ghi tên tác giả anh K ở phần giới thiệu thì được tự do bán phần mềm đó mà không cần xin phép.",
              isCorrect: false,
              explanation: "Quyền sao chép và phân phối thương mại thuộc quyền tài sản của tác giả/chủ sở hữu, bắt buộc phải được sự đồng ý."
            },
            {
              id: "gdkt-12-p2-01-d",
              text: "Bảo vệ quyền sở hữu trí tuệ góp phần thúc đẩy đổi mới sáng tạo và hội nhập kinh tế quốc tế.",
              isCorrect: true,
              explanation: "Thực thi nghiêm quyền sở hữu trí tuệ là cam kết quan trọng trong các FTA thế hệ mới và động lực sáng tạo."
            }
          ],
          explanation: "Quyền sở hữu tài sản trí tuệ và trách nhiệm pháp lý (GDKT&PL 12 GDPT 2018)."
        },
        {
          id: "gdkt-12-p3-01",
          part: 3,
          question: "Theo Luật Hôn nhân và Gia đình Việt Nam hiện hành, độ tuổi kết hôn tối thiểu đối với nam là từ đủ bao nhiêu tuổi trở lên?",
          answer: "20",
          acceptedAnswers: ["20", "20 tuổi", "đủ 20 tuổi"],
          unit: "tuổi",
          explanation: "Điều 8 Luật Hôn nhân và Gia đình 2014 quy định điều kiện kết hôn: Nam từ đủ 20 tuổi trở lên, nữ từ đủ 18 tuổi trở lên."
        }
      ]
    }
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
    ],
    questionsByGrade: {
      "lop-10": [
        {
          id: "th-10-p1-01",
          part: 1,
          question: "Số thập phân 13 khi biểu diễn sang hệ nhị phân (cơ số 2) có giá trị là bao nhiêu?",
          options: ["1101", "1011", "1110", "1001"],
          answer: 0,
          explanation: "13 = 8 + 4 + 0 + 1 = 1*2^3 + 1*2^2 + 0*2^1 + 1*2^0 = 1101 (hệ nhị phân)."
        },
        {
          id: "th-10-p1-02",
          part: 1,
          question: "Trong Python, câu lệnh nào dùng để nhận dữ liệu nhập vào từ bàn phím và ép kiểu sang số nguyên?",
          options: ["n = int(input())", "n = str(input())", "n = print(input())", "n = float(read())"],
          answer: 0,
          explanation: "Hàm input() luôn trả về kiểu chuỗi (str), nên cần bọc hàm int(input()) để chuyển thành số nguyên."
        },
        {
          id: "th-10-p2-01",
          part: 2,
          context: "Xét các kiến thức về an toàn thông tin và bản quyền số trong môi trường mạng (Tin học 10). Xét tính đúng/sai của các phát biểu sau:",
          subQuestions: [
            {
              id: "th-10-p2-01-a",
              text: "Mật khẩu mạnh nên kết hợp chữ hoa, chữ thường, chữ số và ký tự đặc biệt với độ dài tối thiểu từ 8-12 ký tự trở lên.",
              isCorrect: true,
              explanation: "Độ phức tạp và độ dài mật khẩu cao giúp chống lại tấn công dò mật khẩu (brute-force)."
            },
            {
              id: "th-10-p2-01-b",
              text: "Tấn công Phishing là hình thức giả mạo website/email uy tín để đánh cắp mật khẩu hoặc thông tin ngân hàng của người dùng.",
              isCorrect: true,
              explanation: "Phishing (lừa đảo trực tuyến) lợi dụng tâm lý người dùng để chiếm đoạt thông tin đăng nhập."
            },
            {
              id: "th-10-p2-01-c",
              text: "Mọi hình ảnh và tài liệu tìm thấy công khai trên Internet đều mặc định miễn phí bản quyền và được phép dùng vào mục đích thương mại.",
              isCorrect: false,
              explanation: "Nội dung công khai trên Internet vẫn thuộc quyền sở hữu trí tuệ của tác giả trừ khi có giấy phép mở (như CC0)."
            },
            {
              id: "th-10-p2-01-d",
              text: "Bật xác thực hai yếu tố (2FA) giúp tăng đáng kể mức độ an toàn cho tài khoản ngay cả khi bị lộ mật khẩu.",
              isCorrect: true,
              explanation: "2FA yêu cầu thêm mã OTP hoặc khóa bảo mật ngoài mật khẩu thông thường."
            }
          ],
          explanation: "An toàn không gian mạng và đạo đức số (Tin học 10 GDPT 2018)."
        },
        {
          id: "th-10-p3-01",
          part: 3,
          question: "Cho đoạn mã Python sau:\n```python\na = 15\nb = 4\nprint(a // b + a % b)\n```\nKết quả số nguyên in ra màn hình là bao nhiêu?",
          answer: "6",
          acceptedAnswers: ["6", "6.0", "6,0"],
          unit: "",
          explanation: "Phép chia lấy phần nguyên 15 // 4 = 3; phép chia lấy phần dư 15 % 4 = 3. Tổng 3 + 3 = 6."
        }
      ],
      "lop-11": [
        {
          id: "th-11-p1-01",
          part: 1,
          question: "Trong cơ sở dữ liệu quan hệ, 'khóa chính' (Primary Key) của một bảng có đặc điểm bắt buộc nào sau đây?",
          options: [
            "Giá trị duy nhất cho mỗi bản ghi và không được phép chứa giá trị rỗng (NULL)",
            "Có thể trùng lặp giữa các dòng để dễ phân nhóm",
            "Bắt buộc phải là kiểu dữ liệu văn bản dài",
            "Một bảng luôn phải có ít nhất 3 khóa chính độc lập"
          ],
          answer: 0,
          explanation: "Khóa chính dùng để định danh duy nhất mỗi bản ghi trong bảng nên không được trùng lặp và không được NULL."
        },
        {
          id: "th-11-p1-02",
          part: 1,
          question: "Trong SQL, mệnh đề nào được sử dụng để lọc các bản ghi thỏa mãn một điều kiện cụ thể?",
          options: ["WHERE", "ORDER BY", "GROUP", "CREATE TABLE"],
          answer: 0,
          explanation: "Mệnh đề WHERE lọc các hàng thỏa mãn điều kiện trong truy vấn SELECT, UPDATE hoặc DELETE."
        },
        {
          id: "th-11-p2-01",
          part: 2,
          context: "Cho bảng CSDL `HOCSINH(MaHS, HoTen, Lop, DiemTB)` trong hệ quản trị CSDL quan hệ. Xét câu truy vấn SQL:\n```sql\nSELECT HoTen, DiemTB FROM HOCSINH WHERE Lop = '11A1' AND DiemTB >= 8.0 ORDER BY DiemTB DESC;\n```\nXét tính đúng/sai:",
          subQuestions: [
            {
              id: "th-11-p2-01-a",
              text: "Câu lệnh chỉ lấy ra hai cột là `HoTen` và `DiemTB` thay vì toàn bộ các cột của bảng.",
              isCorrect: true,
              explanation: "Danh sách cột sau SELECT chỉ định chính xác các trường dữ liệu cần hiển thị."
            },
            {
              id: "th-11-p2-01-b",
              text: "Kết quả chỉ bao gồm học sinh lớp `11A1` có điểm trung bình từ 8.0 trở lên.",
              isCorrect: true,
              explanation: "Toán tử logic AND yêu cầu cả hai điều kiện ở mệnh đề WHERE đều phải thỏa mãn."
            },
            {
              id: "th-11-p2-01-c",
              text: "Danh sách kết quả được sắp xếp theo thứ tự `DiemTB` tăng dần (từ thấp đến cao).",
              isCorrect: false,
              explanation: "Từ khóa `DESC` (Descending) sắp xếp theo thứ tự giảm dần (từ cao xuống thấp); tăng dần là `ASC`."
            },
            {
              id: "th-11-p2-01-d",
              text: "Câu lệnh SELECT này không làm thay đổi hay xóa dữ liệu gốc trong bảng `HOCSINH`.",
              isCorrect: true,
              explanation: "SELECT là lệnh truy vấn đọc dữ liệu, không chỉnh sửa bảng."
            }
          ],
          explanation: "Kỹ năng đọc hiểu câu truy vấn SQL trên cơ sở dữ liệu quan hệ (Tin học 11 GDPT 2018)."
        },
        {
          id: "th-11-p3-01",
          part: 3,
          question: "Tìm kiếm nhị phân (Binary Search) trên một danh sách đã sắp xếp gồm 1024 phần tử cần tối đa bao nhiêu bước so sánh trong trường hợp xấu nhất? (Biết 2^10 = 1024)",
          answer: "11",
          acceptedAnswers: ["11", "10"],
          unit: "bước",
          explanation: "Với N = 1024, floor(log2(1024)) + 1 = 10 + 1 = 11 bước so sánh tối đa (hoặc xấp xỉ log2(1024) = 10 lần chia đôi)."
        }
      ],
      "lop-12": [
        {
          id: "th-12-p1-01",
          part: 1,
          question: "Trong mạng máy tính, giao thức DNS (Domain Name System) đảm nhiệm chức năng chính nào sau đây?",
          options: [
            "Phân giải tên miền (như quizken.com) thành địa chỉ IP tương ứng",
            "Mã hóa dữ liệu đường truyền bằng chứng chỉ SSL",
            "Cấp phát địa chỉ MAC vật lý cho card mạng",
            "Nén dung lượng tệp tin hình ảnh khi tải trang web"
          ],
          answer: 0,
          explanation: "DNS đóng vai trò như 'danh bạ' của Internet, chuyển tên miền dễ nhớ thành địa chỉ IP số."
        },
        {
          id: "th-12-p1-02",
          part: 1,
          question: "Trong ngôn ngữ HTML5, cặp thẻ nào được dùng để tạo một siêu liên kết (hyperlink) dẫn tới một URL khác?",
          options: ["<a href=\"...\">...</a>", "<link src=\"...\">...</link>", "<img href=\"...\" />", "<nav url=\"...\">...</nav>"],
          answer: 0,
          explanation: "Thẻ `<a>` với thuộc tính `href` dùng để tạo liên kết web trong HTML."
        },
        {
          id: "th-12-p2-01",
          part: 2,
          context: "Tìm hiểu về Trí tuệ nhân tạo (AI) tạo sinh và nguyên tắc sử dụng AI có trách nhiệm trong học tập. Xét tính đúng/sai của các nhận định sau:",
          subQuestions: [
            {
              id: "th-12-p2-01-a",
              text: "Học máy (Machine Learning) cho phép máy tính tự học từ dữ liệu mẫu để dự đoán hoặc phân loại mà không cần lập trình cứng mọi quy tắc.",
              isCorrect: true,
              explanation: "Đây là định nghĩa cốt lõi của Machine Learning trong lĩnh vực AI."
            },
            {
              id: "th-12-p2-01-b",
              text: "Các mô hình ngôn ngữ lớn (LLM) luôn cung cấp thông tin chính xác 100% và không bao giờ gặp hiện tượng 'ảo giác' (hallucination).",
              isCorrect: false,
              explanation: "LLM có thể sinh ra thông tin sai lệch hoặc bịa nguồn (hallucination), nên người học cần kiểm chứng lại."
            },
            {
              id: "th-12-p2-01-c",
              text: "Không nên nhập thông tin cá nhân nhạy cảm (CCCD, mật khẩu, dữ liệu bí mật) vào các công cụ AI công cộng.",
              isCorrect: true,
              explanation: "Bảo vệ quyền riêng tư và an toàn dữ liệu là nguyên tắc đạo đức số quan trọng khi dùng AI."
            },
            {
              id: "th-12-p2-01-d",
              text: "AI có thể hỗ trợ cá nhân hóa lộ trình ôn tập, gợi ý câu hỏi và giải thích lỗi sai cho học sinh.",
              isCorrect: true,
              explanation: "AI trong giáo dục giúp phân tích điểm yếu và tạo bài luyện tập phù hợp trình độ từng học sinh."
            }
          ],
          explanation: "Trí tuệ nhân tạo và đạo đức công nghệ số (Tin học 12 GDPT 2018)."
        },
        {
          id: "th-12-p3-01",
          part: 3,
          question: "Một địa chỉ IPv4 chuẩn gồm 4 nhóm số thập phân ngăn cách bởi dấu chấm (ví dụ 192.168.1.1). Tổng độ dài của một địa chỉ IPv4 bằng bao nhiêu bit?",
          answer: "32",
          acceptedAnswers: ["32", "32 bit", "32 bits"],
          unit: "bit",
          explanation: "Mỗi octet gồm 8 bit, 4 octet × 8 bit = 32 bit."
        }
      ]
    }
  }
];

export const GRADES: PseoGrade[] = [
  { slug: "lop-10", name: "Lớp 10", label: "tổng hợp đề kiểm tra định kỳ và ôn tập lớp 10 bám sát chương trình GDPT 2018" },
  { slug: "lop-11", name: "Lớp 11", label: "tổng hợp đề thi học kỳ 1 và học kỳ 2 lớp 11 chất lượng" },
  { slug: "lop-12", name: "Lớp 12", label: "luyện đề thi thử tốt nghiệp và các chuyên đề trọng tâm lớp 12" },
  { slug: "on-thi-thpt", name: "Ôn thi THPT Quốc gia", label: "bộ đề luyện thi THPT Quốc gia chuẩn cấu trúc minh họa mới nhất" }
];

export function getQuestionsForSubjectGrade(
  subject: PseoSubject,
  gradeSlug: string
): PseoQuestion[] {
  const gradeQuestions = subject.questionsByGrade?.[gradeSlug];
  if (gradeQuestions && gradeQuestions.length > 0) {
    return gradeQuestions;
  }
  return subject.questions;
}
