import {
  Sparkles,
  Zap,
  BookOpen,
  Trophy,
  Users,
  BarChart3,
  LayoutGrid,
  NotebookPen,
  Globe2,
  type LucideIcon,
} from "lucide-react";

export type Accent = "emerald" | "amber" | "sky" | "pink" | "violet" | "rose";

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: Accent;
};

/** Map accent name to tailwind classes (light + dark). */
export const accentStyles: Record<Accent, { bg: string; icon: string; ring: string }> = {
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    icon: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-200/60 dark:ring-emerald-800/40",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    icon: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-200/60 dark:ring-amber-800/40",
  },
  sky: {
    bg: "bg-sky-50 dark:bg-sky-950/40",
    icon: "text-sky-600 dark:text-sky-400",
    ring: "ring-sky-200/60 dark:ring-sky-800/40",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-950/40",
    icon: "text-pink-600 dark:text-pink-400",
    ring: "ring-pink-200/60 dark:ring-pink-800/40",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-950/40",
    icon: "text-violet-600 dark:text-violet-400",
    ring: "ring-violet-200/60 dark:ring-violet-800/40",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    icon: "text-rose-600 dark:text-rose-400",
    ring: "ring-rose-200/60 dark:ring-rose-800/40",
  },
};

export const features: Feature[] = [
  {
    icon: Sparkles,
    title: "Tạo quiz bằng AI",
    description:
      "Chỉ cần nhập chủ đề, AI tạo câu hỏi thông minh, đúng ngữ cảnh trong vài giây.",
    accent: "emerald",
  },
  {
    icon: Zap,
    title: "Kết quả tức thì",
    description:
      "Tạo trọn bộ bài kiểm tra trong vài giây thay vì hàng giờ. Tự động chấm điểm ngay lập tức.",
    accent: "amber",
  },
  {
    icon: BookOpen,
    title: "English Hub",
    description:
      "Hệ thống bài học tiếng Anh theo lộ trình CEFR, TOEIC. Luyện từ vựng, ngữ pháp, nghe và nói.",
    accent: "sky",
  },
  {
    icon: Trophy,
    title: "Gamification",
    description:
      "Tích XP, giữ chuỗi ngày học (streak), làm nhiệm vụ hàng ngày, vinh danh trên bảng xếp hạng.",
    accent: "rose",
  },
  {
    icon: Users,
    title: "Đấu trường nhiều người",
    description:
      "Tạo phòng chơi, mời bạn cùng thi đấu realtime. Căng thẳng và hồi hộp như một game show.",
    accent: "violet",
  },
  {
    icon: NotebookPen,
    title: "Sổ tay thông minh",
    description:
      "Lưu lại từ khó, ôn tập theo lịch spaced repetition. Học ít nhưng nhớ lâu.",
    accent: "pink",
  },
  {
    icon: BarChart3,
    title: "Phân tích tiến độ",
    description:
      "Dashboard theo dõi điểm số, biểu đồ 30 ngày, lịch sử làm bài và điểm mạnh, yếu.",
    accent: "emerald",
  },
  {
    icon: LayoutGrid,
    title: "Đa dạng chủ đề",
    description:
      "Tạo quiz cho mọi lĩnh vực: khoa học, lịch sử, toán, ngôn ngữ hoặc chủ đề tự chọn.",
    accent: "amber",
  },
  {
    icon: Globe2,
    title: "Đa ngôn ngữ",
    description:
      "Hỗ trợ tiếng Việt và tiếng Anh. Giao diện thân thiện, tối ưu cho người học Việt Nam.",
    accent: "sky",
  },
];
