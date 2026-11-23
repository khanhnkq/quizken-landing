import { Metadata } from "next";
import {
  Sparkles,
  Bot,
  Layers,
  Users,
  Zap,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Download,
  ChevronRight,
  PenTool,
  Database,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/JsonLd";
import { appLink, buildAbsoluteUrl } from "@/lib/site";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title:
    "Hướng Dẫn Sử Dụng QuizKen Từ A-Z: Tạo Đề AI, Soạn Thủ Công, Kho Kiến Thức & Flashcard",
  description:
    "Cẩm nang hướng dẫn sử dụng toàn diện QuizKen: Tạo đề thi AI, soạn đề thủ công, quản lý kho tài liệu Knowledge Base, học Flashcard SM-2, đấu trường Multiplayer và xuất PDF in ấn.",
  path: "/howtouse",
  keywords: [
    "hướng dẫn sử dụng QuizKen",
    "cách tạo đề thi AI",
    "soạn đề trắc nghiệm thủ công",
    "kho kiến thức knowledge base",
    "cách học flashcard QuizKen",
    "hướng dẫn tổ chức thi online",
    "xuất đề thi PDF QuizKen",
  ],
});

const steps = [
  {
    id: "create-quiz",
    number: "01",
    badge: "Tính Năng Cốt Lõi",
    title: "Tạo Đề Thi Trắc Nghiệm Tự Động Bằng AI",
    description:
      "Chỉ mất 3 giây để chuyển đổi bất kỳ văn bản bài học, đề cương, file Word (.docx), PDF hoặc hình ảnh thành bộ câu hỏi trắc nghiệm chuẩn cấu trúc GDPT 2018.",
    icon: Sparkles,
    actions: [
      {
        title: "Bước 1: Nhập dữ liệu hoặc tải tài liệu",
        content:
          "Truy cập trang chủ QuizKen, dán văn bản bài học hoặc bấm nút 'Tải file' để tải lên tài liệu dạng PDF, Word (.docx) hoặc ảnh chụp sổ tay.",
      },
      {
        title: "Bước 2: Tùy chỉnh cấu trúc đề thi",
        content:
          "Chọn số lượng câu hỏi (5 - 50 câu), mức độ nhận thức Bloom (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao) và dạng thức câu hỏi (Nhiều lựa chọn, Đúng/Sai 4 ý, Trả lời ngắn).",
      },
      {
        title: "Bước 3: Nhận đề thi kèm giải thích chi tiết",
        content:
          "AI phân tích trong 3 giây và xuất ra toàn bộ câu hỏi kèm đáp án chính xác, bảng giải thích phương pháp giải và ma trận đặc tả chuẩn Bộ GD&ĐT.",
      },
    ],
    ctaText: "Thử tạo đề AI ngay",
    ctaLink: appLink("/"),
  },
  {
    id: "manual-editor",
    number: "02",
    badge: "Biên Soạn Chuyên Sâu",
    title: "Soạn Thảo Đề Thi Thủ Công (Manual Quiz Editor)",
    description:
      "Tự do sáng tạo và kiểm soát 100% nội dung với trình soạn thảo đề thi thủ công chuyên nghiệp, hỗ trợ công thức Toán LaTeX và chèn hình ảnh minh họa.",
    icon: PenTool,
    actions: [
      {
        title: "Bước 1: Vào mục Tạo Đề Thủ Công",
        content:
          "Nhấp vào nút 'Tạo đề thủ công' trên trang tạo đề (/quiz/create) hoặc bấm 'Chỉnh sửa' trên bất kỳ đề thi có sẵn nào.",
      },
      {
        title: "Bước 2: Nhập nội dung câu hỏi & đáp án",
        content:
          "Nhập câu hỏi, gắn các lựa chọn đáp án A, B, C, D, tích chọn đáp án đúng, phân loại độ khó Bloom và thêm lời giải thích chi tiết.",
      },
      {
        title: "Bước 3: Thêm công thức Toán & Lưu trữ",
        content:
          "Hỗ trợ gõ công thức LaTeX ($...$) vector sắc nét. Sau khi hoàn tất, bấm 'Lưu đề thi' để đồng bộ vào thư viện cá nhân.",
      },
    ],
    ctaText: "Mở Trình Soạn Thảo",
    ctaLink: appLink("/quiz/create"),
  },
  {
    id: "knowledge-base",
    number: "03",
    badge: "RAG AI Cá Nhân Hóa",
    title: "Quản Lý Kho Kiến Thức & Tải Lên Tài Liệu (Knowledge Base)",
    description:
      "Tải lên giáo trình, tài liệu nội bộ (PDF/TXT/DOCX) vào kho lưu trữ thông minh để AI tạo đề bám sát 100% tài liệu mà không lo bịa thông tin.",
    icon: Database,
    actions: [
      {
        title: "Bước 1: Mở Bảng Kho Kiến Thức (Knowledge Base)",
        content:
          "Trong trình tạo đề hoặc cài đặt AI, mở bảng 'Kho Kiến Thức' để xem danh sách tài liệu cá nhân đã lưu trữ.",
      },
      {
        title: "Bước 2: Tải lên tài liệu giáo trình",
        content:
          "Bấm 'Thêm tài liệu mới' và chọn tệp PDF, TXT hoặc Word từ máy tính. Hệ thống tự động phân tách và trích xuất nội dung.",
      },
      {
        title: "Bước 3: Chọn tài liệu tham chiếu khi sinh đề",
        content:
          "Tích chọn các tài liệu muốn áp dụng. Khi bấm tạo đề, AI sẽ ưu tiên trích xuất câu hỏi trực tiếp từ các đoạn văn bản trong tài liệu đã chọn.",
      },
    ],
    ctaText: "Quản lý Kho Tài Liệu",
    ctaLink: appLink("/"),
  },
  {
    id: "flashcard",
    number: "04",
    badge: "Ghi Nhớ Khoa Học",
    title: "Học Flashcard Spaced Repetition (Thuật Toán SM-2)",
    description:
      "Ghi nhớ từ vựng tiếng Anh, công thức toán lý hóa và khái niệm chuyên ngành dài hạn nhờ thuật toán lặp lại ngắt quãng SM-2 và hệ thống hộp Leitner.",
    icon: Layers,
    actions: [
      {
        title: "Bước 1: Tạo bộ thẻ tự động",
        content:
          "Chọn 'Tạo Flashcard từ văn bản' hoặc khám phá kho thẻ từ vựng CEFR (A1 - C2), TOEIC, IELTS có sẵn trên QuizKen English Hub.",
      },
      {
        title: "Bước 2: Lật thẻ và tự đánh giá",
        content:
          "Xem câu hỏi ở mặt trước, thử tự nhớ lại câu trả lời (Active Recall) rồi lật mặt sau để kiểm tra và đánh giá mức độ ghi nhớ từ 1 đến 5 sao.",
      },
      {
        title: "Bước 3: Ôn tập theo thông báo hàng ngày",
        content:
          "Thuật toán AI tự động tính toán hệ số dễ (EF) và lên lịch ôn tập ngắt quãng (sau 1 ngày, 3 ngày, 7 ngày, 14 ngày), giúp bạn nhớ vĩnh viễn với thời gian học ít nhất.",
      },
    ],
    ctaText: "Khám phá English Hub",
    ctaLink: appLink("/english"),
  },
  {
    id: "multiplayer",
    number: "05",
    badge: "Tương Tác Lớp Học",
    title: "Tổ Chức Đấu Trường Trực Tiếp (Multiplayer Arena)",
    description:
      "Biến tiết ôn tập khô khan thành trò chơi thi đua trực tiếp kịch tính cho cả lớp mà không cần cài đặt phần mềm, hỗ trợ hàng trăm học sinh cùng lúc.",
    icon: Users,
    actions: [
      {
        title: "Bước 1: Giáo viên tạo phòng chơi (Host Game)",
        content:
          "Chọn một bộ Quiz trong thư viện, bấm nút 'Tổ chức thi đấu trực tiếp' để nhận Mã PIN phòng chơi (Game PIN) và mã QR.",
      },
      {
        title: "Bước 2: Học sinh tham gia tức thì",
        content:
          "Học sinh dùng điện thoại hoặc máy tính truy cập trang Game Lobby, nhập mã PIN và họ tên để bước vào phòng chờ.",
      },
      {
        title: "Bước 3: Bắt đầu trận đấu & Theo dõi bảng xếp hạng",
        content:
          "Giáo viên bấm 'Bắt đầu'. Hệ thống tính điểm dựa trên độ chính xác và tốc độ trả lời, tự động cập nhật bảng xếp hạng vinh danh Top 3 cuối trận.",
      },
    ],
    ctaText: "Vào sảnh Game Lobby",
    ctaLink: appLink("/game/lobby"),
  },
  {
    id: "export-print",
    number: "06",
    badge: "Tiện Ích Giáo Viên",
    title: "Xuất File PDF In Ấn Chuẩn Bộ & Xuất Chuẩn LMS (Moodle/Canvas)",
    description:
      "Tự động xáo trộn 4-8 mã đề thi khác nhau, tạo phiếu trả lời trắc nghiệm chuẩn chỉnh hoặc xuất file QTI/GIFT để nhập trực tiếp vào hệ thống LMS nhà trường.",
    icon: Download,
    actions: [
      {
        title: "Bước 1: Chọn bộ đề cần xuất",
        content:
          "Mở đề thi trong kho cá nhân của bạn, bấm vào menu 'Xuất Đề & In Ấn'.",
      },
      {
        title: "Bước 2: Chọn định dạng mong muốn",
        content:
          "Chọn 'Xuất PDF in ấn' (hỗ trợ trộn 4 mã đề kèm bảng đáp án và phiếu tô trắc nghiệm) hoặc 'Xuất LMS' (Canvas QTI, Moodle XML, GIFT, Aiken format).",
      },
      {
        title: "Bước 3: Tải về và sử dụng ngay",
        content:
          "File PDF được căn chỉnh lề chuẩn khổ giấy A4 sẵn sàng in ấn; file LMS có thể nhập vào Moodle hoặc Canvas chỉ trong 5 giây.",
      },
    ],
    ctaText: "Xem thư viện đề mẫu",
    ctaLink: appLink("/quiz/library"),
  },
  {
    id: "ai-tutor",
    number: "07",
    badge: "Bot Trợ Lý Chat",
    title: "Tương Tác Với Trợ Lý AI Quít Quít Trong Phòng Chat",
    description:
      "Trò chuyện trực tiếp, hỏi bài tập, giải thích kiến thức và tạo quiz tức thì cùng trợ lý AI Quít Quít trong Phòng Chat Chung cộng đồng và phòng riêng 'Chat với Quít Quít' mà không cần tag.",
    icon: Bot,
    actions: [
      {
        title: "Bước 1: Vào mục Chat trên thanh điều hướng",
        content:
          "Truy cập trang Chat (/chat), chọn 'Phòng Chat Chung' hoặc phòng riêng 'Chat với Quít Quít' để bắt đầu trò chuyện.",
      },
      {
        title: "Bước 2: Nhắn tin trực tiếp (không cần tag @)",
        content:
          "Trong Phòng Chat Chung hoặc phòng riêng, chỉ cần gõ trực tiếp câu hỏi, yêu cầu giải thích bài tập hay tạo quiz nhanh để Quít Quít tự động trả lời tức thì (vẫn hỗ trợ tag @quitquit hoặc @quít quít khi muốn).",
      },
      {
        title: "Bước 3: Nhận phản hồi & Thảo luận cùng cộng đồng",
        content:
          "Quít Quít sẽ phân tích câu hỏi, gợi ý hướng giải và trò chuyện tiếp nối tự nhiên ngay trong luồng chat để mọi thành viên cùng thảo luận và học hỏi.",
      },
    ],
    ctaText: "Vào phòng Chat Quít Quít",
    ctaLink: appLink("/chat"),
  },
];

const quickHighlights = [
  {
    icon: Zap,
    label: "Tạo Đề Trong 3 Giây",
    desc: "AI quét tài liệu hoặc soạn thủ công",
  },
  {
    icon: Database,
    label: "Kho Kiến Thức RAG",
    desc: "Tải file PDF/Word nội bộ không bịa",
  },
  {
    icon: Users,
    label: "Đấu Trường Multiplayer",
    desc: "Không giới hạn số người chơi",
  },
  {
    icon: Download,
    label: "Xuất File Chuẩn In Ấn",
    desc: "Trộn 4 mã đề PDF & Moodle/Canvas",
  },
];

const faqs = [
  {
    q: "QuizKen có hỗ trợ tải file tài liệu của tôi lên để AI tạo đề không?",
    a: "Có! Tính năng Kho Kiến Thức (Knowledge Base) cho phép bạn tải lên các tài liệu PDF, DOCX, TXT. AI sẽ đọc trực tiếp nội dung trong tài liệu của bạn để trích xuất câu hỏi chuẩn xác 100%, không lo bịa thông tin.",
  },
  {
    q: "Tôi có thể tự tay tạo câu hỏi hoặc chỉnh sửa đề thi sau khi AI tạo không?",
    a: "Hoàn toàn được. Bạn có thể sử dụng Trình Soạn Thảo Đề Thi Thủ Công (Manual Quiz Editor) để thêm câu hỏi mới, sửa nội dung, thay đổi đáp án đúng, thêm công thức Toán LaTeX hoặc chèn ảnh minh họa.",
  },
  {
    q: "Học sinh vào làm bài kiểm tra có cần đăng ký tài khoản không?",
    a: "Không bắt buộc. Học sinh chỉ cần nhập mã PIN phòng thi hoặc nhấp vào liên kết do giáo viên chia sẻ là có thể làm bài ngay lập tức.",
  },
  {
    q: "QuizKen có hỗ trợ công thức Toán, Lý, Hóa phức tạp không?",
    a: "Hoàn toàn hỗ trợ! Hệ thống tích hợp chuẩn KaTeX/LaTeX vector sắc nét, hiển thị hoàn hảo mọi công thức phân số, tích phân, căn thức và phương trình hóa học trên cả máy tính lẫn điện thoại.",
  },
];

export default function HowToUsePage() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Hướng dẫn sử dụng nền tảng tạo đề thi và học tập thông minh QuizKen",
    description:
      "Quy trình từng bước để sử dụng QuizKen: Tạo đề trắc nghiệm bằng AI, soạn đề thủ công, quản lý kho kiến thức, học flashcard, tổ chức thi trực tuyến và xuất file in ấn.",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.description,
      url: buildAbsoluteUrl(`/howtouse#${s.id}`),
    })),
  };

  const breadcrumbs = breadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Hướng dẫn sử dụng", path: "/howtouse" },
  ]);

  return (
    <>
      <JsonLd data={[howToSchema, breadcrumbs]} />

      <div className="bg-background">
        {/* Hero Header */}
        <section className="py-14 sm:py-20">
          <Container className="text-center">
            <div className="mx-auto max-w-3xl space-y-5">
              <Badge>
                <BookOpen className="h-3.5 w-3.5" />
                Cẩm Nang Toàn Diện 2026
              </Badge>
              <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Hướng Dẫn Sử Dụng QuizKen Từ A-Z
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Khám phá trọn bộ tính năng đột phá của QuizKen: Tạo đề thi AI,
                soạn đề thủ công, kho tài liệu Knowledge Base, học Flashcard
                Spaced Repetition và đấu trường lớp học kịch tính.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button
                  href={appLink("/")}
                  variant="primary"
                  size="md"
                  className="h-10 rounded-xl border-0 shadow-none"
                >
                  Bắt Đầu Tạo Quiz Ngay
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  href="#steps-guide"
                  variant="secondary"
                  size="md"
                  className="h-10 rounded-xl border-0 shadow-none"
                >
                  Xem Chi Tiết Từng Bước
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Quick Feature Grid */}
        <section className="py-4">
          <Container>
            <div className="rounded-2xl border border-border/70 bg-card/85 p-4 shadow-none backdrop-blur-none sm:p-5">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {quickHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center rounded-xl border-0 bg-foreground/[0.04] p-4 text-center shadow-none dark:bg-foreground/[0.06]"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border-0 bg-foreground/[0.06] text-foreground shadow-none">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h2 className="font-heading text-sm font-bold text-foreground sm:text-base">
                      {item.label}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Detailed Step-by-Step Guide */}
        <section id="steps-guide" className="py-12 sm:py-16">
          <Container className="space-y-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  id={step.id}
                  className="scroll-mt-24 rounded-2xl border border-border/70 bg-card/85 p-6 shadow-none backdrop-blur-none sm:p-8"
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-0 bg-foreground/[0.04] font-heading text-lg font-bold text-foreground shadow-none dark:bg-foreground/[0.06]">
                        {step.number}
                      </div>
                      <div className="space-y-2">
                        <Badge>
                          <Icon className="h-3.5 w-3.5" />
                          {step.badge}
                        </Badge>
                        <h2 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                          {step.title}
                        </h2>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0">
                      <Button
                        href={step.ctaLink}
                        variant="secondary"
                        size="sm"
                        className="h-9 rounded-xl border-0 shadow-none"
                      >
                        {step.ctaText}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {step.actions.map((act) => (
                      <div
                        key={act.title}
                        className="flex flex-col justify-between space-y-2 rounded-xl border-0 bg-foreground/[0.04] p-4 shadow-none dark:bg-foreground/[0.06]"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <h3 className="font-heading text-sm font-semibold text-foreground">
                              {act.title}
                            </h3>
                          </div>
                          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                            {act.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </Container>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16">
          <Container>
            <div className="mx-auto max-w-3xl space-y-8">
              <div className="space-y-3 text-center">
                <Badge>
                  <HelpCircle className="h-3.5 w-3.5" />
                  Giải Đáp Thắc Mắc
                </Badge>
                <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Câu Hỏi Thường Gặp Khi Sử Dụng
                </h2>
              </div>

              <div className="space-y-3">
                {faqs.map((f) => (
                  <div
                    key={f.q}
                    className="space-y-3 rounded-2xl border border-border/70 bg-card/85 p-5 shadow-none backdrop-blur-none sm:p-6"
                  >
                    <h3 className="flex items-start gap-2.5 font-heading text-base font-semibold text-foreground">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.06] text-xs font-bold text-foreground">
                        Q
                      </span>
                      <span>{f.q}</span>
                    </h3>
                    <div className="rounded-xl border-0 bg-foreground/[0.04] p-4 text-sm leading-relaxed text-muted-foreground shadow-none dark:bg-foreground/[0.06]">
                      {f.a}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2 text-center">
                <p className="text-sm text-muted-foreground">
                  Vẫn còn câu hỏi chưa được giải đáp?
                </p>
                <Button
                  href="/faq"
                  variant="secondary"
                  size="md"
                  className="h-10 rounded-xl border-0 shadow-none"
                >
                  Xem tất cả câu hỏi tại trang FAQ
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-12 sm:py-20">
          <Container>
            <div className="rounded-2xl border border-border/70 bg-card/85 p-8 text-center shadow-none backdrop-blur-none sm:p-12">
              <div className="mx-auto max-w-2xl space-y-5">
                <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Sẵn Sàng Bứt Phá Hiệu Suất Giảng Dạy & Học Tập?
                </h2>
                <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Tham gia cùng hàng nghìn giáo viên và học sinh đang đổi mới
                  phương pháp kiểm tra đánh giá với QuizKen AI ngay hôm nay.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Button
                    href={appLink("/")}
                    variant="primary"
                    size="md"
                    className="h-10 rounded-xl border-0 shadow-none"
                  >
                    Tạo Bài Kiểm Tra Miễn Phí
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    href="/blog"
                    variant="secondary"
                    size="md"
                    className="h-10 rounded-xl border-0 shadow-none"
                  >
                    Đọc Bài Viết Hướng Dẫn
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
