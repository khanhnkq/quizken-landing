export type Faq = { question: string; answer: string };

/** FAQ used both for the homepage accordion and the FAQPage JSON-LD. */
export const faqs: Faq[] = [
  {
    question: "QuizKen là gì?",
    answer:
      "QuizKen là nền tảng tạo bài kiểm tra trắc nghiệm bằng AI và học tiếng Anh dành cho giáo viên, học sinh Việt Nam. Bạn nhập chủ đề, AI sẽ tạo bộ câu hỏi chất lượng trong vài giây.",
  },
  {
    question: "QuizKen có miễn phí không?",
    answer:
      "Có. Bạn có thể tạo bài kiểm tra, làm quiz và học từ vựng miễn phí. Các tính năng nâng cao có thể yêu cầu tài khoản nhưng phần lớn tính năng cốt lõi đều dùng được ngay không mất phí.",
  },
  {
    question: "Làm thế nào để tạo đề kiểm tra trắc nghiệm bằng AI?",
    answer:
      "Bạn chỉ cần nhập chủ đề (ví dụ: lịch sử Việt Nam, TOEIC Reading, sinh học lớp 10), chọn số câu và độ khó. QuizKen sẽ dùng Google Gemini AI để tạo bộ câu hỏi kèm đáp án và giải thích chi tiết.",
  },
  {
    question: "QuizKen có hỗ trợ xuất PDF để in đề không?",
    answer:
      "Có. Sau khi tạo quiz, bạn có thể xuất ra file PDF chuyên nghiệp để in ấn, gửi cho học sinh hoặc dùng trong lớp học offline.",
  },
  {
    question: "QuizKen phù hợp với đối tượng nào?",
    answer:
      "Giáo viên cần soạn đề nhanh, học sinh và sinh viên ôn tập, người tạo nội dung giáo dục, trung tâm tiếng Anh, hoặc bất kỳ ai muốn kiểm tra kiến thức bằng cách thú vị.",
  },
  {
    question: "QuizKen có hỗ trợ tiếng Việt không?",
    answer:
      "Có. QuizKen tối ưu cho người dùng Việt Nam, hỗ trợ tạo quiz bằng cả tiếng Việt và tiếng Anh. Giao diện và nội dung bài học tiếng Anh đều thân thiện với người Việt.",
  },
  {
    question: "English Hub trong QuizKen là gì?",
    answer:
      "English Hub là hệ thống bài học tiếng Anh theo lộ trình CEFR và TOEIC, gồm từ vựng, ngữ pháp, luyện nghe, nói. Có hệ thống streak, XP và sổ tay từ vựng để học hiệu quả hơn.",
  },
  {
    question: "Tôi có cần cài đặt phần mềm không?",
    answer:
      "Không cần. QuizKen là ứng dụng web chạy trên trình duyệt, hoạt động tốt trên máy tính, điện thoại và máy tính bảng. Bạn chỉ cần một tài khoản để lưu tiến độ.",
  },
];

/** Extended FAQ set for the dedicated /faq page (long-tail SEO). */
export const extendedFaqs: Faq[] = [
  ...faqs,
  {
    question: "Cách tạo đề kiểm tra trắc nghiệm bằng AI miễn phí nhanh nhất?",
    answer:
      "Truy cập QuizKen, chọn Tạo Quiz, nhập chủ đề và bấm tạo. Trong khoảng 30 giây bạn sẽ có một bộ câu hỏi trắc nghiệm hoàn chỉnh kèm đáp án, sẵn sàng để làm hoặc xuất PDF.",
  },
  {
    question: "Quiz generator tiếng Việt nào tốt nhất hiện nay?",
    answer:
      "QuizKen là một trong những quiz generator tối ưu cho tiếng Việt, dùng mô hình Google Gemini để tạo câu hỏi tự nhiên, đúng ngữ pháp và phù hợp chương trình học Việt Nam.",
  },
  {
    question: "Công cụ tạo quiz cho giáo viên có chấm điểm tự động không?",
    answer:
      "Có. Khi học sinh làm quiz trên QuizKen, hệ thống tự động chấm điểm phía server, tránh gian lận, đồng thời lưu lịch sử và thống kê cho giáo viên theo dõi.",
  },
  {
    question: "QuizKen khác gì so với Kahoot hay Quizlet?",
    answer:
      "QuizKen kết hợp AI tạo câu hỏi tự động, lộ trình học tiếng Anh CEFR và tính năng gamification. Kahoot mạnh về chơi realtime, Quizilt mạnh về flashcard. QuizKen bao phủ cả tạo đề, học tiếng Anh và chơi đấu trường.",
  },
  {
    question: "Dữ liệu và tài khoản của tôi có được bảo mật không?",
    answer:
      "Có. QuizKen dùng Supabase với chính sách RLS (Row Level Security), dữ liệu được mã hóa và phân quyền. Thông tin học tập của bạn chỉ bạn có thể truy cập.",
  },
  {
    question: "QuizKen có thể tạo quiz cho môn nào?",
    answer:
      "Mọi môn học: Toán, Lý, Hóa, Sinh, Sử, Địa, Ngữ văn, Tiếng Anh, Tin học, GDTC, và cả các chủ đề tự do như kiến thức chung, chứng chỉ nghề, ôn thi bằng lái.",
  },
];
