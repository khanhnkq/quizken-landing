export type Benefit = {
  title: string;
  description: string;
  items: string[];
};

export const benefits: { audience: string; data: Benefit }[] = [
  {
    audience: "Giáo viên",
    data: {
      title: "Soạn đề nhanh, chấm điểm tự động",
      description:
        "Giảm 90% thời gian soạn đề kiểm tra. Tạo câu hỏi AI, tự động chấm điểm, thống kê kết quả lớp.",
      items: [
        "Tạo đề từ bất kỳ chủ đề nào trong vài giây",
        "Xuất PDF chuyên nghiệp để in ấn",
        "Theo dõi điểm số và tiến độ từng học sinh",
        "Dùng lại câu hỏi hoặc chỉnh sửa nhanh chóng",
      ],
    },
  },
  {
    audience: "Học sinh & Sinh viên",
    data: {
      title: "Ôn tập thú vị như chơi game",
      description:
        "Học qua quiz tương tác, giữ streak, tích XP, thi đấu với bạn bè. Học khổ nhọc thì buồn, học vui mới nhớ lâu.",
      items: [
        "English Hub: lộ trình tiếng Anh từ zero đến hero",
        "Sổ tay từ vựng cá nhân, ôn spaced repetition",
        "Đấu trường realtime thi cùng bạn bè",
        "Bảng xếp hạng và phần thưởng hàng tuần",
      ],
    },
  },
];
