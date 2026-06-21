export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initial: string;
  accent: string; // tailwind bg class for avatar
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Tôi soạn một đề kiểm tra 30 câu chỉ trong đúng 1 phút. Trước đây phải mất cả buổi tối. Học sinh cũng thích làm quiz trên QuizKen hơn đề giấy.",
    name: "Cô Nguyễn Thị Mai",
    role: "Giáo viên Tiếng Anh, THPT Nguyễn Trãi, Hà Nội",
    initial: "M",
    accent: "bg-emerald-500",
  },
  {
    quote:
      "Phần English Hub giúp tôi giữ được chuỗi học 47 ngày liên tiếp. Học từ vựng TOEIC qua flashcard và sổ tay rất dễ nhớ.",
    name: "Phạm Tuấn Kiệt",
    role: "Sinh viên năm 3, ĐH Bách Khoa TP.HCM",
    initial: "K",
    accent: "bg-sky-500",
  },
  {
    quote:
      "Bọn tôi hay mở đấu trường cuối tuần thi đấu với nhau. Vừa ôn bài vừa vui, ai cũng tranh giành hạng nhất trên bảng xếp hạng.",
    name: "Trần Bảo Ngọc",
    role: "Học sinh lớp 11, THCS-THPT Trần Đại Nghĩa",
    initial: "N",
    accent: "bg-rose-500",
  },
];

export const stats: { value: string; label: string }[] = [
  { value: "10.000+", label: "Quiz đã được tạo" },
  { value: "100+", label: "Chủ đề đa dạng" },
  { value: "4.8/5", label: "Đánh giá người dùng" },
  { value: "30 giây", label: "Để tạo một đề" },
];
