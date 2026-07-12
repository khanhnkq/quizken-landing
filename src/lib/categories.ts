/**
 * Blog category definitions for topical authority SEO.
 * Each category forms a "topic cluster" in the Pillar-Cluster content model.
 */

export type BlogCategory = {
  slug: string;
  label: string;
  description: string;
  /** SEO meta description for the category page */
  metaDescription: string;
  /** Icon name from Lucide (used in UI) */
  icon: string;
};

export const CATEGORIES: BlogCategory[] = [
  {
    slug: "huong-dan",
    label: "Hướng dẫn",
    description: "Hướng dẫn sử dụng QuizKen chi tiết từ A-Z",
    metaDescription:
      "Hướng dẫn sử dụng QuizKen: tạo đề kiểm tra AI, xuất PDF, chơi multiplayer, và tất cả tính năng của QuizKen.",
    icon: "BookOpen",
  },
  {
    slug: "meo-hoc-tap",
    label: "Mẹo học tập",
    description: "Phương pháp học tập hiệu quả và mẹo ôn thi",
    metaDescription:
      "Mẹo học tập hiệu quả, phương pháp ôn thi, spaced repetition, gamification và các kỹ thuật ghi nhớ khoa học.",
    icon: "Lightbulb",
  },
  {
    slug: "ai-giao-duc",
    label: "AI giáo dục",
    description: "Xu hướng ứng dụng AI trong giáo dục và EdTech",
    metaDescription:
      "Ứng dụng AI trong giáo dục: tự động tạo đề, cá nhân hóa học tập, chấm điểm thông minh, và tương lai EdTech Việt Nam.",
    icon: "Bot",
  },
  {
    slug: "tieng-anh",
    label: "Tiếng Anh",
    description: "Học tiếng Anh hiệu quả với AI và công nghệ",
    metaDescription:
      "Học tiếng Anh hiệu quả: từ vựng CEFR, luyện thi IELTS/TOEIC, flashcard thông minh, và phương pháp học với AI.",
    icon: "Languages",
  },
  {
    slug: "so-sanh",
    label: "So sánh",
    description: "So sánh các công cụ giáo dục và nền tảng quiz",
    metaDescription:
      "So sánh chi tiết các nền tảng tạo quiz: QuizKen vs Quizlet vs Kahoot vs Google Forms. Ưu nhược điểm và đánh giá.",
    icon: "GitCompare",
  },
  {
    slug: "tin-tuc",
    label: "Tin tức",
    description: "Cập nhật tính năng mới và tin tức từ QuizKen",
    metaDescription:
      "Tin tức, cập nhật tính năng mới, changelog và roadmap từ QuizKen. Theo dõi những thay đổi mới nhất.",
    icon: "Newspaper",
  },
] as const;

/** Get a category by slug. Returns undefined if not found. */
export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** Get all category slugs for generateStaticParams. */
export function getAllCategorySlugs(): string[] {
  return CATEGORIES.map((c) => c.slug);
}
