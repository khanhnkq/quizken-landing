import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { buildMetadata, breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { appLink } from "@/lib/site";
import { TOOLS_CATALOG } from "@/lib/toolsCatalog";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { ToolsHubClient } from "@/components/tools/ToolsHubClient";

export const metadata: Metadata = buildMetadata({
  title: "Kho Công Cụ Học Tập & Giáo Viên Miễn Phí 2027",
  description:
    "Bộ 6 công cụ trực tuyến miễn phí cho học sinh, sinh viên & giáo viên: Tính điểm xét tốt nghiệp THPT 2027 (50/50), Tính GPA Đại học, Quy đổi IELTS/ĐGNL, Đếm ngược ngày thi, Trộn đề 4 mã đề và Tạo phiếu tô đáp án A4.",
  path: "/cong-cu",
  keywords: [
    "công cụ học tập miễn phí",
    "tính điểm tốt nghiệp thpt 2027",
    "tính điểm gpa đại học",
    "quy đổi điểm ielts đgnl",
    "đếm ngược ngày thi 2027",
    "trộn đề trắc nghiệm online",
    "tạo phiếu trả lời trắc nghiệm a4",
  ],
});

const hubHighlights = [
  "Chuẩn quy chế GDPT 2018 & Bộ GD&ĐT 2026–2027",
  "Xử lý 100% trên trình duyệt, không thu thập dữ liệu",
  "Giao diện thân thiện trên cả điện thoại & máy tính",
  "Không cần đăng nhập, xuất/in kết quả tức thì",
];

export default function CongCuHubPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema(
            "Kho Công Cụ Học Tập & Giáo Viên Miễn Phí 2027 | QuizKen",
            "Bộ 6 công cụ trực tuyến miễn phí: Tính điểm tốt nghiệp THPT 2027, tính GPA Đại học, quy đổi IELTS/SAT/ĐGNL, đếm ngược ngày thi, trộn đề 4 mã đề và tạo phiếu tô đáp án A4.",
            "/cong-cu",
          ),
          breadcrumbSchema([
            { name: "Trang chủ", path: "/" },
            { name: "Công cụ miễn phí", path: "/cong-cu" },
          ]),
        ]}
      />

      <div className="bg-background py-12 sm:py-20">
        <Container className="space-y-14">
          {/* Hero Header */}
          <header className="mx-auto max-w-3xl space-y-5 text-center">
            <Badge className="bg-primary/15 text-primary">
              <Wrench className="h-3.5 w-3.5" />
              <span>6 Tiện ích Giáo dục Miễn phí • Chuẩn 2027</span>
            </Badge>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Công Cụ Học Tập &amp; Giảng Dạy Miễn Phí
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Tính điểm xét tốt nghiệp THPT 50/50 mới, GPA Đại học, quy đổi
              IELTS/ĐGNL, đếm ngược ngày thi, trộn đề 4 mã đề và tạo phiếu tô
              đáp án chuẩn Bộ GD&amp;ĐT ngay lập tức — không cần cài đặt hay
              đăng ký tài khoản.
            </p>
            <div className="grid grid-cols-1 gap-2.5 pt-2 text-left sm:grid-cols-2">
              {hubHighlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 rounded-xl bg-foreground/[0.04] p-3 text-xs font-medium text-foreground dark:bg-foreground/[0.06] sm:text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </header>

          {/* Interactive Filter & Cards Grid */}
          <ToolsHubClient />

          {/* Quick Directory Table for SEO/GEO clarity */}
          <section className="rounded-2xl border border-border/70 bg-card/85 p-6 sm:p-8 space-y-5">
            <div className="space-y-1.5">
              <Badge>
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>Danh mục tổng hợp</span>
              </Badge>
              <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                Bảng tóm tắt 6 công cụ trên QuizKen
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/70 text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-3 pr-4 font-semibold">Công cụ</th>
                    <th className="py-3 pr-4 font-semibold">Nhóm</th>
                    <th className="py-3 pr-4 font-semibold">Điểm nổi bật</th>
                    <th className="py-3 font-semibold text-right">Truy cập</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {TOOLS_CATALOG.map((tool) => (
                    <tr key={tool.slug} className="hover:bg-foreground/[0.02]">
                      <td className="py-3.5 pr-4 font-semibold text-foreground">
                        <Link
                          href={`/cong-cu/${tool.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {tool.shortTitle}
                        </Link>
                      </td>
                      <td className="py-3.5 pr-4 text-muted-foreground">
                        {tool.categoryLabel}
                      </td>
                      <td className="py-3.5 pr-4 text-muted-foreground">
                        {tool.badge}
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={`/cong-cu/${tool.slug}`}
                          className="inline-flex min-h-11 items-center gap-1 font-semibold text-primary hover:underline"
                        >
                          <span>Sử dụng</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* QuizKen App CTA */}
          <section className="rounded-2xl border border-border/70 bg-card/85 p-8 sm:p-10">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl space-y-4">
                <Badge className="bg-primary/15 text-primary">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Tạo đề &amp; Luyện thi AI toàn diện</span>
                </Badge>
                <h2 className="font-heading text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                  Cần Tạo Đề Thi Tự Động Từ PDF Hoặc Thi Thử Chuẩn GDPT 2018?
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Mở <strong className="text-foreground">QuizKen App</strong> để
                  tải lên tài liệu bài giảng, tự động sinh đề trắc nghiệm 3 phần
                  (Nhiều lựa chọn, Đúng/Sai, Trả lời ngắn), trộn đề xuất file
                  Word <code className="text-foreground">.docx</code> và thi thử
                  tính giờ miễn phí.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button href={appLink("/")} variant="primary" size="lg" className="min-h-11">
                  <Sparkles className="h-4 w-4" />
                  <span>Mở QuizKen App</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/de-thi" variant="secondary" size="lg" className="min-h-11">
                  Xem đề thi mẫu 2027
                </Button>
              </div>
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
