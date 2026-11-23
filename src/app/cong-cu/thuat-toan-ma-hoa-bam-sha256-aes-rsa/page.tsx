import type { Metadata } from "next";
import { Calculator, ShieldCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { CryptoHashCipherTool } from "@/components/tools/CryptoHashCipherTool";

const SLUG = "thuat-toan-ma-hoa-bam-sha256-aes-rsa";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Sự khác nhau cốt lõi giữa Hàm băm (SHA-256, MD5) và Mã hóa (AES-256, RSA) là gì?",
    answer:
      "Hàm băm (Hashing) là biến đổi một chiều — từ dữ liệu đầu vào bất kỳ tạo ra chuỗi tóm tắt cố định (ví dụ 256 bit với SHA-256) và KHÔNG thể giải mã ngược lại dữ liệu gốc. Ngược lại, Mã hóa (Encryption) như AES hay RSA là hai chiều: có thể giải mã về bản rõ ban đầu khi sở hữu đúng khóa bí mật.",
  },
  {
    question: "Tại sao cùng một mật khẩu và văn bản nhưng mỗi lần bấm mã hóa AES-256-GCM lại ra chuỗi Base64 khác nhau?",
    answer:
      "Vì công cụ sinh ngẫu nhiên một Salt 16 byte (cho hàm dẫn xuất khóa PBKDF2 100.000 vòng) và một IV / Nonce 12 byte (cho AES-GCM) ở mỗi lần mã hóa. Điều này ngăn chặn tấn công so sánh bản mã (pattern analysis) và bảo vệ chống bảng cầu vồng (Rainbow Table).",
  },
  {
    question: "Mô phỏng RSA trên công cụ dùng phép tính nào và có chính xác với số lớn không?",
    answer:
      "Module RSA sử dụng hàm BigInt(...) chuẩn JavaScript nên tính toán chính xác tuyệt đối số nguyên lớn: tính n = p × q, hàm phi Euler φ(n) = (p−1)(q−1), kiểm tra gcd(e, φ(n)) = 1, tìm khóa bí mật d = e⁻¹ mod φ(n) bằng thuật toán Euclid mở rộng và lũy thừa nhanh (Modular Exponentiation).",
  },
  {
    question: "Tại sao MD5 và SHA-1 không còn được dùng để lưu mật khẩu hoặc ký số hiện đại?",
    answer:
      "Cả MD5 (128 bit) và SHA-1 (160 bit) đều đã bị tìm thấy lỗ hổng va chạm (collision attack) trong thực tế, tức hai dữ liệu khác nhau có thể cho cùng một mã băm. Hiện nay cần dùng SHA-256/SHA-512 để kiểm tra toàn vẹn tệp, và Argon2/Bcrypt/PBKDF2 để lưu mật khẩu.",
  },
];

export default function ThuatToanMaHoaBamPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Chinh phục môn An toàn thông tin & Toán rời rạc cùng QuizKen AI"
      ctaDescription="Tạo nhanh bộ câu hỏi ôn tập về hàm băm mật mã học, thuật toán RSA, mật mã đối xứng AES, chữ ký số và bảo mật mạng bằng trợ lý QuizKen AI."
      ctaHref={appLink("/?subject=tin-hoc")}
      ctaLabel="Tạo đề Mật mã học AI"
      secondaryCtaHref="/de-thi/tin-hoc/on-thi-thpt"
      secondaryCtaLabel="Khám phá đề Tin học"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Phân biệt Mã hóa Đối xứng (AES) &amp; Bất đối xứng (RSA)
              </h2>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">AES-256-GCM (Đối xứng):</strong>{" "}
                Dùng chung một khóa bí mật để mã hóa và giải mã; tốc độ cực nhanh, phù hợp mã hóa dữ liệu lớn và giao tiếp HTTPS sau khi bắt tay TLS.
              </li>
              <li>
                <strong className="text-foreground">RSA (Bất đối xứng):</strong>{" "}
                Dùng Khóa công khai <code>(e, n)</code> để mã hóa và Khóa bí mật <code>(d, n)</code> để giải mã; giải quyết bài toán trao đổi khóa trên kênh truyền không an toàn.
              </li>
              <li>
                <strong className="text-foreground">HMAC-SHA256:</strong>{" "}
                Kết hợp hàm băm SHA-256 với Secret Key để chứng minh thông điệp không bị thay đổi và đến từ đúng người gửi.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                5 bước Toán học cốt lõi của Thuật toán RSA
              </h2>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-sm leading-relaxed text-muted-foreground">
              <li>Chọn hai số nguyên tố phân biệt <code>p</code> và <code>q</code>.</li>
              <li>Tính mô-đun <code>n = p × q</code> và hàm Euler <code>φ(n) = (p − 1)(q − 1)</code>.</li>
              <li>Chọn <code>e</code> sao cho <code>1 &lt; e &lt; φ(n)</code> và <code>gcd(e, φ(n)) = 1</code>.</li>
              <li>Tìm khóa bí mật <code>d = e⁻¹ mod φ(n)</code> bằng thuật toán Euclid mở rộng.</li>
              <li>Mã hóa <code>C = M^e mod n</code>; giải mã <code>M = C^d mod n</code>.</li>
            </ol>
          </div>
        </div>
      }
    >
      <CryptoHashCipherTool />
    </ToolPageShell>
  );
}
