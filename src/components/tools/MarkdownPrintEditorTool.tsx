"use client";

import { useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bold,
  Check,
  CheckSquare,
  Code,
  Columns2,
  Copy,
  Download,
  Eye,
  FileText,
  Heading2,
  Italic,
  PenLine,
  Printer,
  Quote,
  Table2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type ViewMode = "split" | "edit" | "preview";

type AcademicTemplate = {
  id: string;
  label: string;
  fileName: string;
  content: string;
};

const ACADEMIC_TEMPLATES: AcademicTemplate[] = [
  {
    id: "study-guide",
    label: "Đề cương ôn tập môn học",
    fileName: "de-cuong-on-tap-mon-hoc",
    content: `# ĐỀ CƯƠNG ÔN TẬP KIỂM TRA GIỮA KỲ

**Môn học:** Tin học / Khoa học Tự nhiên  
**Thời gian ôn tập:** Tuần 10 – Tuần 12  
**Mục tiêu điểm số:** ≥ 8.5 / 10

---

## 1. Trọng tâm kiến thức cần nhớ

- **Chuyên đề 1:** Nắm vững khái niệm cốt lõi, phân biệt rõ các trường hợp ngoại lệ.
- **Chuyên đề 2:** Thành thạo kỹ năng giải bài tập vận dụng và đọc hiểu bảng số liệu.
- **Chuyên đề 3:** Liên hệ thực tế và trả lời câu hỏi đúng/sai có giải thích.

## 2. Checklist nhiệm vụ ôn thi

- [x] Đọc lại vở ghi và đánh dấu các định nghĩa quan trọng
- [x] Hệ thống hóa công thức ra 1 trang A4
- [ ] Làm tối thiểu 03 đề thi thử bấm giờ nghiêm túc
- [ ] Tự kiểm tra lại các lỗi sai hay gặp

## 3. Bảng phân bổ thời gian trong tuần

| Thứ | Nội dung ôn tập | Thời lượng | Trạng thái |
| :--- | :--- | :---: | :---: |
| Thứ 2 | Tổng hợp lý thuyết Chương 1–2 | 60 phút | Đã xong |
| Thứ 4 | Luyện 20 câu trắc nghiệm vận dụng | 45 phút | Đang làm |
| Thứ 6 | Giải đề tổng hợp chuẩn cấu trúc mới | 90 phút | Chưa làm |

> **Lưu ý:** Khi làm bài thi thật, đọc kỹ từng mệnh đề Đúng/Sai trước khi tô phiếu trả lời.
`,
  },
  {
    id: "formula-sheet",
    label: "Bảng tóm tắt công thức",
    fileName: "bang-tom-tat-cong-thuc",
    content: `# BẢNG TÓM TẮT CÔNG THỨC TRỌNG TÂM

**Chủ đề:** Toán Giải tích & Vật lí Đại cương  

---

## 1. Bảng công thức đạo hàm & nguyên hàm

| Hàm số $f(x)$ | Đạo hàm $f'(x)$ | Nguyên hàm $\\int f(x)dx$ | Điều kiện |
| :--- | :--- | :--- | :--- |
| \`x^n\` | \`n * x^(n-1)\` | \`x^(n+1)/(n+1) + C\` | \`n ≠ -1\` |
| \`1/x\` | \`-1 / x^2\` | \`ln|x| + C\` | \`x ≠ 0\` |
| \`e^x\` | \`e^x\` | \`e^x + C\` | Mọi \`x ∈ R\` |
| \`sin(x)\` | \`cos(x)\` | \`-cos(x) + C\` | Radian |

## 2. Công thức Vật lí thường dùng

\`\`\`text
v = v0 + a * t
s = v0 * t + 0.5 * a * t^2
v^2 - v0^2 = 2 * a * s
\`\`\`

## 3. Mẹo kiểm tra nhanh đơn vị (SI)

1. Luôn đổi vận tốc từ \`km/h\` sang \`m/s\` bằng cách chia cho \`3.6\`.
2. Thời gian tính bằng **giây (s)**, khối lượng tính bằng **kilôgam (kg)**.
3. Kiểm tra lại dấu âm/dương khi vật chuyển động chậm dần đều.
`,
  },
  {
    id: "cornell-notes",
    label: "Ghi chú Cornell",
    fileName: "ghi-chu-cornell",
    content: `# GHI CHÚ CORNELL — BÀI GIẢNG TRÊN LỚP

**Môn:** Ngữ văn / Lịch sử / Sinh học  
**Ngày ghi chép:** Hôm nay  

---

## Từ khóa & Câu hỏi gợi mở (Cues)

- Nguyên nhân sâu xa của vấn đề là gì?
- Những mốc sự kiện / khái niệm nào dễ nhầm lẫn?
- So sánh điểm giống và khác nhau giữa 2 giai đoạn?

## Nội dung ghi chép chính (Notes)

1. **Ý chính thứ nhất:** Trình bày ngắn gọn bằng gạch đầu dòng, ưu tiên từ khóa thay vì chép nguyên văn cả câu dài.
2. **Ý chính thứ hai:** Ghi kèm ví dụ minh họa thầy cô giảng trên bảng để dễ nhớ khi ôn lại.
3. **Bảng đối chiếu nhanh:**

| Tiêu chí | Mô hình A | Mô hình B |
| :--- | :--- | :--- |
| Đặc điểm chính | Tập trung cấu trúc nền tảng | Tối ưu hóa quy trình vận hành |
| Ưu điểm | Dễ áp dụng cho người mới | Hiệu suất cao ở quy mô lớn |
| Hạn chế | Tốn thời gian thiết lập đầu | Yêu cầu kiểm thử chặt chẽ |

## Tóm tắt cuối trang (Summary)

> Trong 2–3 câu ngắn, hãy tự diễn đạt lại toàn bộ bài học bằng ngôn ngữ của chính mình để kiểm tra mức độ hiểu bài ngay sau tiết học.
`,
  },
  {
    id: "group-minutes",
    label: "Biên bản họp nhóm",
    fileName: "bien-ban-hop-nhom",
    content: `# BIÊN BẢN HỌP NHÓM DỰ ÁN HỌC TẬP

**Tên đề tài:** Xây dựng sản phẩm học tập số  
**Thành viên tham gia:** Nhóm 03 (Đủ 5/5 thành viên)  
**Hình thức:** Thảo luận trực tiếp / Google Meet  

---

## 1. Mục tiêu buổi họp

- Thống nhất dàn ý báo cáo và phân chia đầu việc rõ ràng.
- Chốt mốc thời gian hoàn thành bản nháp và buổi chạy thử thuyết trình.

## 2. Phân công nhiệm vụ chi tiết

| Thành viên | Nhiệm vụ phụ trách | Hạn hoàn thành | Ghi chú |
| :--- | :--- | :---: | :--- |
| Minh Anh | Tổng hợp tài liệu & viết Chương 1 | Thứ 4 | Đã nhận việc |
| Quốc Bảo | Xử lý bảng số liệu & biểu đồ | Thứ 5 | Dùng số liệu mới |
| Thu Hà | Thiết kế slide thuyết trình | Thứ 6 | Tối đa 12 slide |
| Gia Huy | Rà soát lỗi chính tả & xuất PDF | Thứ 7 | In 2 bản A4 |

## 3. Các việc cần làm ngay

- [x] Tạo thư mục lưu trữ tài liệu chung của nhóm
- [ ] Gửi bản nháp đầu tiên trước 20:00 Thứ 5
- [ ] Họp tổng duyệt slide và phân công người trình bày

> **Kết luận:** Mọi thành viên cập nhật tiến độ vào nhóm chat trước 21:00 hằng ngày.
`,
  },
];

export function MarkdownPrintEditorTool() {
  const [markdown, setMarkdown] = useState<string>(ACADEMIC_TEMPLATES[0].content);
  const [docTitle, setDocTitle] = useState<string>("de-cuong-on-tap-mon-hoc");
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [copied, setCopied] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const stats = useMemo(() => {
    const trimmed = markdown.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const lines = markdown ? markdown.split("\n").length : 0;
    return { chars: markdown.length, words, lines };
  }, [markdown]);

  const applyInsertion = (
    prefix: string,
    suffix: string,
    placeholder: string,
    blockPrefix?: string,
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setMarkdown((prev) => `${prev}\n${prefix}${placeholder}${suffix}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.slice(start, end) || placeholder;

    let replacement = `${prefix}${selected}${suffix}`;
    if (blockPrefix) {
      const needsNewline = start > 0 && markdown[start - 1] !== "\n";
      replacement = `${needsNewline ? "\n" : ""}${blockPrefix}${selected}${suffix}`;
    }

    const updated =
      markdown.slice(0, start) + replacement + markdown.slice(end);
    setMarkdown(updated);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPos = start + replacement.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleDownloadMd = () => {
    const safeName =
      docTitle
        .trim()
        .replace(/\.md$/i, "")
        .replace(/[\\/:*?"<>|]+/g, "-") || "ghi-chu-markdown";
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeName}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  };

  const handlePrintPdf = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-5">
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 14mm 16mm;
          }
          body {
            background: #ffffff !important;
            color: #111827 !important;
          }
          body > header,
          body > footer,
          .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          #markdown-a4-preview-wrapper {
            display: block !important;
            width: 100% !important;
            border: none !important;
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
          }
          #markdown-a4-preview {
            max-height: none !important;
            overflow: visible !important;
            padding: 0 !important;
            color: #111827 !important;
          }
          #markdown-a4-preview h1,
          #markdown-a4-preview h2,
          #markdown-a4-preview h3 {
            break-after: avoid;
          }
          #markdown-a4-preview table,
          #markdown-a4-preview pre,
          #markdown-a4-preview blockquote {
            break-inside: avoid;
          }
        }
      `}</style>

      {/* Templates & Actions Header */}
      <div className="no-print rounded-2xl border border-border/70 bg-card/85 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <FileText className="h-4 w-4 text-primary" />
              <span>Mẫu học tập nhanh:</span>
            </span>
            {ACADEMIC_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => {
                  setMarkdown(tpl.content);
                  setDocTitle(tpl.fileName);
                }}
                className="min-h-8 rounded-lg bg-foreground/[0.06] px-2.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
              >
                {tpl.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {[
              { id: "split" as const, label: "Chia đôi", icon: Columns2 },
              { id: "edit" as const, label: "Soạn thảo", icon: PenLine },
              { id: "preview" as const, label: "Xem trước", icon: Eye },
            ].map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setViewMode(mode.id)}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-colors cursor-pointer",
                    viewMode === mode.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.12]",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Formatting Toolbar + Export Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => applyInsertion("", "", "Tiêu đề mục", "## ")}
              title="Tiêu đề H2"
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-foreground/[0.06] px-2.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
            >
              <Heading2 className="h-3.5 w-3.5" />
              <span>H2</span>
            </button>
            <button
              type="button"
              onClick={() => applyInsertion("**", "**", "chữ in đậm")}
              title="In đậm"
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-foreground/[0.06] px-2.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
            >
              <Bold className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Đậm</span>
            </button>
            <button
              type="button"
              onClick={() => applyInsertion("*", "*", "chữ in nghiêng")}
              title="In nghiêng"
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-foreground/[0.06] px-2.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
            >
              <Italic className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Nghiêng</span>
            </button>
            <button
              type="button"
              onClick={() =>
                applyInsertion(
                  "",
                  "",
                  "| Cột 1 | Cột 2 |\n| :--- | :--- |\n| Nội dung 1 | Nội dung 2 |",
                  "\n",
                )
              }
              title="Chèn bảng"
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-foreground/[0.06] px-2.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
            >
              <Table2 className="h-3.5 w-3.5" />
              <span>Bảng</span>
            </button>
            <button
              type="button"
              onClick={() => applyInsertion("", "", "Nhiệm vụ cần làm", "- [ ] ")}
              title="Checklist"
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-foreground/[0.06] px-2.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
            >
              <CheckSquare className="h-3.5 w-3.5" />
              <span>Checklist</span>
            </button>
            <button
              type="button"
              onClick={() => applyInsertion("\n```text\n", "\n```\n", "Nội dung code / công thức")}
              title="Khối Code"
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-foreground/[0.06] px-2.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
            >
              <Code className="h-3.5 w-3.5" />
              <span>Code</span>
            </button>
            <button
              type="button"
              onClick={() => applyInsertion("", "", "Ghi chú quan trọng", "> ")}
              title="Trích dẫn"
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-foreground/[0.06] px-2.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
            >
              <Quote className="h-3.5 w-3.5" />
              <span>Quote</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-primary" />
                  <span>Đã sao chép</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Sao chép .md</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadMd}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-foreground/[0.06] px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.12] cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Tải .md</span>
            </button>

            <button
              type="button"
              onClick={handlePrintPdf}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-heading font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>In / Xuất PDF A4</span>
            </button>
          </div>
        </div>
      </div>

      {/* Split Pane Editor & Safe Live Preview */}
      <div
        className={cn(
          "grid grid-cols-1 gap-5",
          viewMode === "split" ? "lg:grid-cols-2" : "grid-cols-1",
        )}
      >
        {viewMode !== "preview" && (
          <div className="no-print flex flex-col rounded-2xl border border-border/70 bg-card/85 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Trình soạn thảo Markdown
              </span>
              <Badge>
                {stats.words} từ • {stats.lines} dòng
              </Badge>
            </div>
            <textarea
              ref={textareaRef}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              rows={22}
              placeholder="Nhập ghi chú Markdown của bạn tại đây..."
              className="min-h-[480px] w-full flex-1 resize-y rounded-xl border border-input bg-background p-4 font-mono text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"
            />
          </div>
        )}

        {viewMode !== "edit" && (
          <div
            id="markdown-a4-preview-wrapper"
            className="flex flex-col rounded-2xl border border-border/70 bg-card/85 p-4 sm:p-6 space-y-3"
          >
            <div className="no-print flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Bản xem trước tài liệu A4 (Tắt HTML thô an toàn)
              </span>
              <Badge className="bg-primary/15 text-primary">GFM + A4 Print Ready</Badge>
            </div>

            <article
              id="markdown-a4-preview"
              className="prose prose-zinc dark:prose-invert max-w-none max-h-[540px] overflow-y-auto pr-1 prose-headings:font-heading prose-headings:tracking-tight prose-table:border-collapse prose-th:border prose-th:border-border/80 prose-th:px-3 prose-th:py-2 prose-td:border prose-td:border-border/80 prose-td:px-3 prose-td:py-2"
            >
              {/* ReactMarkdown without rehype-raw leaves raw HTML tags safely escaped */}
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </article>
          </div>
        )}
      </div>
    </div>
  );
}
