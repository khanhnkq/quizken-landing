import { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  Layers,
  FileText,
  Users,
  Award,
  Zap,
  CheckCircle2,
  ArrowRight,
  Upload,
  BookOpen,
  HelpCircle,
  BarChart3,
  Download,
  Share2,
  Cpu,
  GraduationCap,
  ChevronRight,
  FileSpreadsheet,
  PenTool,
  FolderArchive,
  Database,
  Printer,
  Gamepad2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { BackgroundDecorations } from "@/components/ui/BackgroundDecorations";
import { appLink, buildAbsoluteUrl } from "@/lib/site";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Hướng Dẫn Sử Dụng QuizKen Từ A-Z: Tạo Đề AI, Soạn Thủ Công, Kho Kiến Thức & Flashcard",
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
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
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
    color: "from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
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
    color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400",
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
    color: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
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
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
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
    color: "from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400",
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
    title: "Tương Tác Với Bot @quitquit Trong Phòng Chat",
    description:
      "Trò chuyện, hỏi bài tập, giải thích kiến thức và tương tác vui vẻ cùng bot thông minh @quitquit (Quít Quít) trong phòng chat cộng đồng QuizKen.",
    icon: Bot,
    color: "from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400",
    actions: [
      {
        title: "Bước 1: Vào mục Chat trên thanh điều hướng",
        content:
          "Truy cập trang Chat (/chat), chọn phòng 'Chat Chung' hoặc phòng riêng 'Chat với Quít Quít' để bắt đầu trò chuyện.",
      },
      {
        title: "Bước 2: Tag @quitquit trong tin nhắn",
        content:
          "Trong phòng chat chung, gõ @quitquit (hoặc @quít quít) kèm câu hỏi, yêu cầu giải thích bài tập hoặc tạo quiz nhanh để bot trả lời tức thì.",
      },
      {
        title: "Bước 3: Nhận phản hồi & Thảo luận cùng cộng đồng",
        content:
          "Quít Quít sẽ phân tích câu hỏi, đưa ra hướng giải và phản hồi trực tiếp ngay trong luồng chat để mọi thành viên cùng học hỏi.",
      },
    ],
    ctaText: "Vào phòng Chat Quít Quít",
    ctaLink: appLink("/chat"),
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

      {/* Hero Header */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <BackgroundDecorations />
        <Container className="relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-6">
            <BookOpen className="h-4 w-4" />
            Cẩm Nang Toàn Diện 2026
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
            Hướng Dẫn Sử Dụng{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              QuizKen Từ A-Z
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Khám phá trọn bộ tính năng đột phá của QuizKen: Tạo đề thi AI, soạn đề thủ công, kho tài liệu Knowledge Base, học Flashcard Spaced Repetition và đấu trường lớp học kịch tính.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              href={appLink("/")}
              size="lg"
              className="rounded-full px-8 font-heading font-extrabold shadow-lg shadow-emerald-500/20"
            >
              Bắt Đầu Tạo Quiz Ngay
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              href="#steps-guide"
              variant="outline"
              size="lg"
              className="rounded-full px-8 font-heading font-bold"
            >
              Xem Chi Tiết Từng Bước
            </Button>
          </div>
        </Container>
      </section>

      {/* Quick Feature Grid */}
      <section className="py-12 border-y border-border/40 bg-muted/20">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Zap, label: "Tạo Đề Trong 3 Giây", desc: "AI quét tài liệu hoặc soạn thủ công" },
              { icon: Database, label: "Kho Kiến Thức RAG", desc: "Tải file PDF/Word nội bộ không bịa" },
              { icon: Users, label: "Đấu Trường Multiplayer", desc: "Không giới hạn số người chơi" },
              { icon: Download, label: "Xuất File Chuẩn In Ấn", desc: "Trộn 4 mã đề PDF & Moodle/Canvas" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-4 rounded-2xl bg-card border border-border/50 shadow-sm">
                <div className="p-3 rounded-xl bg-primary/10 text-primary mb-3">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-sm sm:text-base">{item.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Detailed Step-by-Step Guide */}
      <section id="steps-guide" className="py-20 sm:py-28">
        <Container className="max-w-5xl space-y-16">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                id={step.id}
                className="scroll-mt-24 rounded-3xl border border-border/60 bg-card p-6 sm:p-10 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-border/40">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-inner border font-heading font-black text-xl text-foreground">
                      {step.number}
                    </div>
                    <div>
                      <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-primary mb-1">
                        {step.badge}
                      </span>
                      <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        {step.title}
                      </h2>
                      <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0">
                    <Button
                      href={step.ctaLink}
                      variant="outline"
                      size="sm"
                      className="rounded-full px-5 font-heading font-bold text-xs"
                    >
                      {step.ctaText}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {step.actions.map((act, aIdx) => (
                    <div
                      key={aIdx}
                      className="rounded-2xl border border-border/40 bg-muted/30 p-5 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          <h4 className="font-heading font-bold text-sm text-foreground">
                            {act.title}
                          </h4>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
      <section className="py-16 sm:py-24 bg-muted/20 border-t border-border/40">
        <Container className="max-w-3xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-bold text-primary mb-3">
              <HelpCircle className="h-4 w-4" />
              Giải Đáp Thắc Mắc
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
              Câu Hỏi Thường Gặp Khi Sử Dụng
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
              >
                <h3 className="font-heading font-bold text-base text-foreground flex items-start gap-3">
                  <span className="text-primary font-black">Q:</span>
                  {f.q}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground pl-7 leading-relaxed">
                  {f.a}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Vẫn còn câu hỏi chưa được giải đáp?
            </p>
            <Button href="/faq" variant="outline" className="rounded-full px-6">
              Xem tất cả câu hỏi tại trang FAQ
            </Button>
          </div>
        </Container>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 sm:py-28">
        <Container className="max-w-4xl">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-8 sm:p-14 text-white text-center shadow-2xl">
            <div className="relative z-10 space-y-6">
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                Sẵn Sàng Bứt Phá Hiệu Suất Giảng Dạy & Học Tập?
              </h2>
              <p className="text-white/90 text-base sm:text-lg max-w-xl mx-auto">
                Tham gia cùng hàng nghìn giáo viên và học sinh đang đổi mới phương pháp kiểm tra đánh giá với QuizKen AI ngay hôm nay.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Button
                  href={appLink("/")}
                  size="lg"
                  className="rounded-full bg-white text-emerald-800 hover:bg-emerald-50 px-8 font-heading font-extrabold shadow-lg"
                >
                  Tạo Bài Kiểm Tra Miễn Phí
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  href="/blog"
                  variant="outline"
                  size="lg"
                  className="rounded-full border-white/40 text-white hover:bg-white/10 px-8 font-heading font-bold"
                >
                  Đọc Bài Viết Hướng Dẫn
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
