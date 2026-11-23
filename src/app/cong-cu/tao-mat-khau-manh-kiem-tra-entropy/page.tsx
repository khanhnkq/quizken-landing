import type { Metadata } from "next";
import { KeyRound, ShieldCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { PasswordEntropyTool } from "@/components/tools/PasswordEntropyTool";

const SLUG = "tao-mat-khau-manh-kiem-tra-entropy";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Web Crypto CSPRNG (crypto.getRandomValues) khác gì so với Math.random()?",
    answer:
      "Math.random() chỉ là bộ sinh số giả ngẫu nhiên thông thường (PRNG), có thể dự đoán được chuỗi sinh tiếp theo nếu biết trạng thái nội tại. Ngược lại, window.crypto.getRandomValues() là bộ sinh số ngẫu nhiên an toàn mật mã học (CSPRNG) lấy entropy từ phần cứng hệ điều hành, đảm bảo tính ngẫu nhiên không thể dự đoán.",
  },
  {
    question: "Entropy mật khẩu (Bit) được tính như thế nào và bao nhiêu bit là an toàn?",
    answer:
      "Entropy lý thuyết được tính theo công thức E = L × log₂(R), trong đó L là độ dài mật khẩu và R là kích thước tập ký tự sử dụng. Mức < 35 bits là rất yếu, 60–79 bits đủ mạnh cho tài khoản cá nhân, 80–127 bits là rất mạnh, và ≥ 128 bits đạt chuẩn an toàn quân sự trước tấn công vét cạn.",
  },
  {
    question: "Passphrase (cụm từ khóa Diceware/XKCD) có ưu điểm gì so với mật khẩu ký tự phức tạp?",
    answer:
      "Passphrase ghép 4–6 từ ngẫu nhiên (ví dụ: Solar-Quantum-Bamboo-742!) giúp con người cực kỳ dễ nhớ và gõ nhanh trên điện thoại nhưng vẫn đạt độ dài lớn và mức Entropy cao (trên 50–70+ bits), hạn chế rủi ro đặt mật khẩu ngắn hoặc dùng chung một mật khẩu cho nhiều dịch vụ.",
  },
  {
    question: "Tại sao thời gian bẻ khóa giữa GPU Fast Hash và Bcrypt/Argon2 lại chênh lệch hàng triệu lần?",
    answer:
      "Các hàm băm nhanh như MD5 hoặc SHA-256 được thiết kế để tính toán cực nhanh, khiến cụm GPU có thể thử tới hàng chục tỷ mật khẩu mỗi giây nếu cơ sở dữ liệu bị rò rỉ. Trong khi đó, Bcrypt và Argon2id là hàm băm chậm tiêu tốn nhiều bộ nhớ và CPU (kèm Salt ngẫu nhiên), làm giảm tốc độ dò xuống chỉ vài nghìn lần/giây.",
  },
];

export default function TaoMatKhauManhKiemTraEntropyPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Ôn luyện An toàn thông tin & Tin học THPT cùng QuizKen AI"
      ctaDescription="Tạo ngay đề thi trắc nghiệm về Mật mã học, Bảo mật tài khoản, Mạng máy tính và Tin học ứng dụng kèm giải thích chi tiết trên QuizKen."
      ctaHref={appLink("/?subject=tin-hoc")}
      ctaLabel="Tạo đề Tin học bằng AI"
      secondaryCtaHref="/cong-cu/thuat-toan-ma-hoa-bam-sha256-aes-rsa"
      secondaryCtaLabel="Mở Mô phỏng SHA-256 / AES / RSA"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Thang đo Entropy &amp; Công thức E = L · log₂(R)
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Khi kết hợp chữ thường (26), chữ HOA (26), chữ số (10) và ký tự đặc biệt (32), tập ký tự đạt{" "}
              <strong className="text-foreground">R = 94</strong> (≈ 6.55 bit/ký tự). Một mật khẩu ngẫu nhiên 16 ký tự cho Entropy{" "}
              <strong className="text-foreground">16 × log₂(94) ≈ 104.9 bits</strong>, gấp hàng tỷ lần mật khẩu 8 ký tự thông thường.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ["< 35 bits", "Rất yếu — Dễ lộ tức thì"],
                ["35 – 59 bits", "Trung bình — Dùng tạm thời"],
                ["60 – 79 bits", "Mạnh — Tài khoản cá nhân"],
                ["≥ 80 – 128+ bits", "Rất mạnh / Chuẩn Quân sự"],
              ].map(([range, label]) => (
                <div
                  key={range}
                  className="rounded-lg bg-foreground/[0.04] px-3 py-2"
                >
                  <strong className="block font-mono text-primary">{range}</strong>
                  <span className="text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Bảo mật 100% Client-Side &amp; Lưu trữ Băm An toàn
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Toàn bộ quá trình tạo mật khẩu ngẫu nhiên và phân tích chuỗi lặp, dãy số tuần tự hay từ điển phổ biến diễn ra ngay trong bộ nhớ trình duyệt của bạn. Bảng so sánh 3 kịch bản tấn công (<em>Online Rate-Limited</em>, <em>GPU Fast Hash</em> và <em>Bcrypt/Argon2</em>) giúp học sinh, sinh viên ngành CNTT hiểu rõ vai trò của Salt và Key Derivation Function trong bảo mật hệ thống.
            </p>
          </div>
        </div>
      }
    >
      <PasswordEntropyTool />
    </ToolPageShell>
  );
}
