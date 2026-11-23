import type { Metadata } from "next";
import { KeyRound, ShieldCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { getToolBySlug } from "@/lib/toolsCatalog";
import { ToolPageShell, type ToolFaqItem } from "@/components/tools/ToolPageShell";
import { JwtBase64UrlTool } from "@/components/tools/JwtBase64UrlTool";

const SLUG = "giai-ma-jwt-base64-url-online";
const tool = getToolBySlug(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/cong-cu/${SLUG}`,
  keywords: tool.keywords,
});

const faqs: ToolFaqItem[] = [
  {
    question: "Dán JWT Token lên công cụ này có bị rò rỉ ra máy chủ không?",
    answer:
      "Tuyệt đối không. Mọi thao tác tách 3 phần Header.Payload.Signature, giải mã Base64URL sang JSON và xác thực chữ ký HMAC-SHA256 đều chạy hoàn toàn trong RAM trình duyệt bằng API chuẩn W3C Web Crypto (window.crypto.subtle), không phát sinh bất kỳ request mạng nào.",
  },
  {
    question: "Giải mã được Payload của JWT có nghĩa là JWT không an toàn?",
    answer:
      "Không hẳn. JWT mặc định (JWS) chỉ ký để chống giả mạo chứ KHÔNG mã hóa nội dung Payload — bất kỳ ai có chuỗi token đều đọc được Base64URL của Header và Payload. Vì vậy không bao giờ lưu mật khẩu hay dữ liệu nhạy cảm thô trong Payload, và server luôn phải kiểm tra chữ ký bằng Secret Key / Public Key.",
  },
  {
    question: "Tại sao dùng hàm atob() thông thường lại bị lỗi với tiếng Việt có dấu trong Base64?",
    answer:
      "Hàm atob/btoa mặc định của JavaScript chỉ xử lý chuỗi Latin-1 (1 byte/ký tự) nên sẽ văng lỗi InvalidCharacterError hoặc sai font với ký tự UTF-8 tiếng Việt. Công cụ của QuizKen sử dụng TextEncoder và TextDecoder chuẩn UTF-8 nên hỗ trợ tiếng Việt có dấu và emoji chính xác 100%.",
  },
  {
    question: "Base64 chuẩn và Base64URL khác nhau ở điểm nào?",
    answer:
      "Base64 chuẩn dùng các ký tự +, / và dấu đệm = ở cuối, dễ gây lỗi khi đặt trực tiếp trên URL. Base64URL (dùng trong JWT) thay + thành -, thay / thành _ và bỏ dấu = ở cuối để an toàn tuyệt đối trên đường dẫn HTTP.",
  },
];

export default function GiaiMaJwtBase64UrlPage() {
  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      ctaTitle="Ôn thi An toàn thông tin, Mạng máy tính & Lập trình Web với QuizKen AI"
      ctaDescription="Tạo nhanh bộ câu hỏi trắc nghiệm về xác thực JWT, OAuth2, mã hóa Base64, giao thức HTTP và bảo mật ứng dụng Web bằng trợ lý QuizKen AI."
      ctaHref={appLink("/?subject=tin-hoc")}
      ctaLabel="Tạo đề An toàn thông tin AI"
      secondaryCtaHref="/de-thi/tin-hoc/on-thi-thpt"
      secondaryCtaLabel="Khám phá đề Tin học"
      seoContent={
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Cấu trúc 3 phần của một JSON Web Token (RFC 7519)
              </h2>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-rose-600 dark:text-rose-400">1. Header:</strong>{" "}
                Chứa loại token (<code>typ: &quot;JWT&quot;</code>) và thuật toán ký (ví dụ <code>HS256</code> hoặc <code>RS256</code>), được mã hóa Base64URL.
              </li>
              <li>
                <strong className="text-violet-600 dark:text-violet-400">2. Payload:</strong>{" "}
                Chứa các tuyên bố (Claims) như <code>iss</code>, <code>sub</code>, <code>iat</code>, <code>exp</code> và thông tin người dùng.
              </li>
              <li>
                <strong className="text-sky-600 dark:text-sky-400">3. Signature:</strong>{" "}
                Giá trị băm có khóa <code>HMACSHA256(base64Url(header) + &quot;.&quot; + base64Url(payload), secret)</code> giúp máy chủ xác minh token không bị chỉnh sửa.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/85 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Ý nghĩa các mốc thời gian chuẩn trong JWT (Unix Timestamp)
              </h2>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">iat (Issued At):</strong>{" "}
                Thời điểm token được phát hành (tính theo số giây kể từ 00:00:00 UTC ngày 01/01/1970).
              </li>
              <li>
                <strong className="text-foreground">nbf (Not Before):</strong>{" "}
                Mốc thời gian sớm nhất mà token bắt đầu có hiệu lực sử dụng.
              </li>
              <li>
                <strong className="text-foreground">exp (Expiration Time):</strong>{" "}
                Thời điểm token hết hạn; hệ thống sẽ từ chối truy cập nếu thời gian hiện tại vượt quá <code>exp</code>.
              </li>
            </ul>
          </div>
        </div>
      }
    >
      <JwtBase64UrlTool />
    </ToolPageShell>
  );
}
