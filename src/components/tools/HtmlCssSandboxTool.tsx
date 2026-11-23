"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Code2,
  Copy,
  Download,
  Monitor,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Tablet,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type HtmlCssPreset = {
  id: string;
  label: string;
  lesson: string;
  html: string;
  css: string;
};

const PRESETS: HtmlCssPreset[] = [
  {
    id: "text-list",
    label: "Định dạng văn bản & Danh sách",
    lesson: "Bài 8–9 Tin học 12",
    html: `<header class="hero">
  <h1>Giới thiệu Câu lạc bộ Tin học THPT</h1>
  <p class="subtitle">Nơi rèn luyện tư duy thuật toán, thiết kế web và kỹ năng số GDPT 2018.</p>
</header>

<section class="content">
  <h2>1. Các ban chuyên môn chính</h2>
  <ul>
    <li><strong>Ban Lập trình:</strong> Ôn luyện Python, C++ và giải thuật.</li>
    <li><strong>Ban Thiết kế Web:</strong> Thực hành HTML5, CSS3 chuẩn W3C.</li>
    <li><em>Ban Truyền thông:</em> Thiết kế ấn phẩm số &amp; kỹ năng trình bày.</li>
  </ul>

  <h2>2. Lộ trình học kỳ I</h2>
  <ol>
    <li>Làm quen cấu trúc tài liệu HTML5 cơ bản</li>
    <li>Tạo danh sách, bảng biểu và siêu liên kết</li>
    <li>Định dạng giao diện bằng CSS Selector &amp; Box Model</li>
  </ol>
</section>`,
    css: `body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: #1e293b;
  margin: 0;
  padding: 24px;
  background: #f8fafc;
}
.hero {
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: #ffffff;
  padding: 24px;
  border-radius: 14px;
  margin-bottom: 20px;
}
.hero h1 {
  margin: 0 0 8px;
  font-size: 24px;
}
.subtitle {
  margin: 0;
  opacity: 0.92;
}
.content {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px 24px;
}
h2 {
  color: #1d4ed8;
  font-size: 18px;
  margin-top: 16px;
}
ul, ol {
  padding-left: 22px;
}
li {
  margin-bottom: 6px;
}`,
  },
  {
    id: "timetable",
    label: "Bảng Thời khóa biểu HTML",
    lesson: "Bài 10 Tin học 12",
    html: `<h2>Thời khóa biểu lớp 12A1 — Học kỳ I</h2>
<table>
  <thead>
    <tr>
      <th>Tiết</th>
      <th>Thứ 2</th>
      <th>Thứ 3</th>
      <th>Thứ 4</th>
      <th>Thứ 5</th>
      <th>Thứ 6</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="period">Tiết 1</td>
      <td>Chào cờ</td>
      <td>Toán học</td>
      <td>Ngữ văn</td>
      <td class="highlight">Tin học</td>
      <td>Vật lý</td>
    </tr>
    <tr>
      <td class="period">Tiết 2</td>
      <td>Toán học</td>
      <td>Tiếng Anh</td>
      <td>Hóa học</td>
      <td class="highlight">Tin học</td>
      <td>Tiếng Anh</td>
    </tr>
    <tr>
      <td class="period">Tiết 3</td>
      <td>Ngữ văn</td>
      <td>Vật lý</td>
      <td>Toán học</td>
      <td>Lịch sử</td>
      <td>GDTC</td>
    </tr>
  </tbody>
</table>`,
    css: `body {
  font-family: system-ui, sans-serif;
  padding: 24px;
  background: #ffffff;
  color: #0f172a;
}
h2 {
  margin-top: 0;
  color: #0f172a;
}
table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.06);
}
th, td {
  border: 1px solid #cbd5e1;
  padding: 10px 12px;
  text-align: center;
  font-size: 14px;
}
thead th {
  background: #1e40af;
  color: #ffffff;
  font-weight: 600;
}
tbody tr:nth-child(even) {
  background: #f8fafc;
}
.period {
  font-weight: 700;
  background: #eff6ff;
  color: #1e3a8a;
}
.highlight {
  background: #dcfce7;
  color: #166534;
  font-weight: 700;
}`,
  },
  {
    id: "club-form",
    label: "Biểu mẫu Đăng ký CLB tĩnh",
    lesson: "Bài 12 Tin học 12",
    html: `<div class="card">
  <h2>Phiếu Đăng ký Thành viên CLB STEM</h2>
  <p class="note">Mẫu giao diện nhập liệu tĩnh (input, select, radio, textarea) chuẩn HTML5.</p>

  <fieldset>
    <legend>Thông tin học sinh</legend>
    <label for="fullname">Họ và tên:</label>
    <input id="fullname" type="text" placeholder="Ví dụ: Nguyễn Minh Anh" />

    <label for="grade">Khối lớp:</label>
    <select id="grade">
      <option value="10">Lớp 10</option>
      <option value="11">Lớp 11</option>
      <option value="12" selected>Lớp 12</option>
    </select>

    <span class="group-label">Phân ban mong muốn:</span>
    <div class="radio-row">
      <label><input type="radio" name="track" checked /> Lập trình Web</label>
      <label><input type="radio" name="track" /> Robotics &amp; IoT</label>
    </div>

    <label for="goal">Mục tiêu tham gia:</label>
    <textarea id="goal" rows="3" placeholder="Chia sẻ ngắn gọn sở thích của bạn..."></textarea>

    <button type="button" class="btn-submit">Xem trước Nút Gửi (Tĩnh)</button>
  </fieldset>
</div>`,
    css: `body {
  font-family: system-ui, sans-serif;
  background: #f1f5f9;
  padding: 24px;
  color: #0f172a;
}
.card {
  max-width: 480px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 14px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}
h2 {
  margin: 0 0 6px;
  font-size: 20px;
  color: #1e293b;
}
.note {
  margin: 0 0 16px;
  font-size: 13px;
  color: #64748b;
}
fieldset {
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 16px;
}
legend {
  font-weight: 700;
  color: #2563eb;
  padding: 0 8px;
}
label, .group-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin: 12px 0 6px;
}
input[type="text"], select, textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
}
.radio-row {
  display: flex;
  gap: 16px;
}
.radio-row label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  margin: 4px 0;
}
.btn-submit {
  margin-top: 16px;
  width: 100%;
  padding: 11px 16px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}`,
  },
  {
    id: "box-model",
    label: "CSS Box Model & Card",
    lesson: "Bài 15–16 Tin học 12",
    html: `<div class="wrapper">
  <article class="course-card">
    <span class="tag">Tin học 12 • GDPT 2018</span>
    <h3>Chuyên đề CSS Box Model</h3>
    <p>Mỗi phần tử HTML là một hình hộp gồm 4 lớp từ trong ra ngoài: <strong>Content → Padding → Border → Margin</strong>.</p>
    <div class="box-demo">
      Content (Nội dung) + Padding 16px + Border 3px dashed
    </div>
  </article>
</div>`,
    css: `body {
  font-family: system-ui, sans-serif;
  background: #f8fafc;
  padding: 28px;
  color: #0f172a;
}
.wrapper {
  max-width: 520px;
  margin: 0 auto;
  background: #fef3c7;
  padding: 20px;
  border: 2px dashed #f59e0b;
  border-radius: 16px;
}
.course-card {
  background: #ffffff;
  padding: 24px;
  border: 2px solid #2563eb;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.12);
}
.tag {
  display: inline-block;
  background: #dbeafe;
  color: #1e40af;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
}
h3 {
  margin: 12px 0 8px;
  font-size: 20px;
}
p {
  margin: 0 0 16px;
  color: #475569;
  line-height: 1.55;
}
.box-demo {
  background: #ecfdf5;
  border: 3px dashed #10b981;
  padding: 16px;
  border-radius: 8px;
  color: #065f46;
  font-weight: 600;
  text-align: center;
}`,
  },
  {
    id: "flexbox-2col",
    label: "Bố cục Flexbox 2 cột",
    lesson: "Bài 17–18 Tin học 12",
    html: `<div class="layout">
  <aside class="sidebar">
    <h3>Mục lục Ôn tập</h3>
    <ul>
      <li class="active">1. Thẻ HTML cơ bản</li>
      <li>2. CSS Bộ chọn &amp; Lớp giả</li>
      <li>3. Bố cục Flexbox</li>
      <li>4. Thiết kế đáp ứng</li>
    </ul>
  </aside>
  <main class="main">
    <h2>Thực hành Bố cục Flexbox 2 Cột</h2>
    <p>Thuộc tính <code>display: flex</code> giúp sắp xếp các khối nội dung theo hàng ngang hoặc cột dọc linh hoạt trên mọi màn hình.</p>
    <div class="stat-grid">
      <div class="stat"><strong>12+</strong><span>Thẻ HTML cốt lõi</span></div>
      <div class="stat"><strong>100%</strong><span>Chuẩn CSS3</span></div>
    </div>
  </main>
</div>`,
    css: `body {
  font-family: system-ui, sans-serif;
  margin: 0;
  padding: 20px;
  background: #f1f5f9;
  color: #0f172a;
}
.layout {
  display: flex;
  gap: 16px;
  align-items: stretch;
  flex-wrap: wrap;
}
.sidebar {
  flex: 1 1 180px;
  background: #1e293b;
  color: #e2e8f0;
  padding: 18px;
  border-radius: 12px;
}
.sidebar h3 {
  margin: 0 0 12px;
  font-size: 16px;
  color: #ffffff;
}
.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar li {
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 4px;
}
.sidebar li.active {
  background: #2563eb;
  color: #ffffff;
  font-weight: 600;
}
.main {
  flex: 2 1 320px;
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
}
.main h2 {
  margin: 0 0 10px;
}
.stat-grid {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}
.stat {
  flex: 1;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  padding: 12px;
  text-align: center;
}
.stat strong {
  display: block;
  font-size: 22px;
  color: #1d4ed8;
}
.stat span {
  font-size: 12px;
  color: #475569;
}`,
  },
  {
    id: "portfolio",
    label: "Trang Hồ sơ học tập cá nhân",
    lesson: "Dự án cuối kỳ Tin học 12",
    html: `<div class="profile">
  <div class="banner"></div>
  <div class="profile-body">
    <div class="avatar">MA</div>
    <h1>Trần Minh Anh</h1>
    <p class="role">Học sinh lớp 12A2 • Định hướng Khoa học Máy tính</p>
    <p class="bio">Yêu thích giải thuật, phân tích dữ liệu và xây dựng website học tập thân thiện cho học sinh THPT.</p>
    <div class="skills">
      <span>HTML5</span>
      <span>CSS3</span>
      <span>Python</span>
      <span>SQL CSDL</span>
    </div>
  </div>
</div>`,
    css: `body {
  font-family: system-ui, sans-serif;
  background: #eef2ff;
  padding: 24px;
  margin: 0;
  color: #0f172a;
}
.profile {
  max-width: 500px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #c7d2fe;
  box-shadow: 0 10px 24px rgba(79, 70, 229, 0.12);
}
.banner {
  height: 88px;
  background: linear-gradient(120deg, #4338ca, #0ea5e9);
}
.profile-body {
  padding: 0 24px 24px;
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 999px;
  background: #1e293b;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 20px;
  border: 4px solid #ffffff;
  margin-top: -32px;
}
h1 {
  margin: 12px 0 4px;
  font-size: 22px;
}
.role {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 600;
  color: #4f46e5;
}
.bio {
  margin: 0 0 16px;
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
}
.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.skills span {
  background: #f1f5f9;
  color: #1e293b;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid #cbd5e1;
}`,
  },
];

type SanitizeResult = {
  cleanHtml: string;
  cleanCss: string;
  strippedItems: string[];
};

/**
 * Strictly sanitizes HTML & CSS so only static markup/styles reach the sandboxed iframe.
 */
function sanitizeStaticHtmlCss(rawHtml: string, rawCss: string): SanitizeResult {
  const stripped = new Set<string>();

  let html = rawHtml;
  const checkAndStrip = (pattern: RegExp, label: string, replacement = "") => {
    html = html.replace(pattern, () => {
      stripped.add(label);
      return replacement;
    });
  };

  checkAndStrip(/<script[\s\S]*?<\/script>/gi, "<script>");
  checkAndStrip(/<script[^>]*>/gi, "<script>");
  checkAndStrip(/<\/script>/gi, "</script>");
  checkAndStrip(/<iframe[\s\S]*?<\/iframe>/gi, "<iframe>");
  checkAndStrip(/<iframe[^>]*>/gi, "<iframe>");
  checkAndStrip(/<\/iframe>/gi, "</iframe>");
  checkAndStrip(/<object[\s\S]*?<\/object>/gi, "<object>");
  checkAndStrip(/<object[^>]*>/gi, "<object>");
  checkAndStrip(/<\/object>/gi, "</object>");
  checkAndStrip(/<embed[^>]*>/gi, "<embed>");
  checkAndStrip(/<\/embed>/gi, "</embed>");
  checkAndStrip(/<form[^>]*>/gi, "<form>");
  checkAndStrip(/<\/form>/gi, "</form>");
  checkAndStrip(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "thuộc tính on*");
  checkAndStrip(/javascript\s*:/gi, "javascript:");
  checkAndStrip(/data\s*:\s*text\/html/gi, "data:text/html");

  let css = rawCss;
  const cssCheckAndStrip = (pattern: RegExp, label: string) => {
    css = css.replace(pattern, () => {
      stripped.add(label);
      return "";
    });
  };
  cssCheckAndStrip(/<\/?script[^>]*>/gi, "<script>");
  cssCheckAndStrip(/javascript\s*:/gi, "javascript:");
  cssCheckAndStrip(/data\s*:\s*text\/html/gi, "data:text/html");
  cssCheckAndStrip(/expression\s*\([^)]*\)/gi, "CSS expression()");

  return {
    cleanHtml: html,
    cleanCss: css,
    strippedItems: Array.from(stripped),
  };
}

type ViewportMode = "desktop" | "tablet" | "mobile";

export function HtmlCssSandboxTool() {
  const [activePresetId, setActivePresetId] = useState<string>(PRESETS[0].id);
  const [htmlCode, setHtmlCode] = useState<string>(PRESETS[0].html);
  const [cssCode, setCssCode] = useState<string>(PRESETS[0].css);
  const [editorTab, setEditorTab] = useState<"split" | "html" | "css">("split");
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [copied, setCopied] = useState(false);

  const { cleanHtml, cleanCss, strippedItems } = useMemo(
    () => sanitizeStaticHtmlCss(htmlCode, cssCode),
    [htmlCode, cssCode],
  );

  const fullDocument = useMemo(
    () => `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thực hành HTML & CSS — QuizKen</title>
  <style>
${cleanCss}
  </style>
</head>
<body>
${cleanHtml}
</body>
</html>`,
    [cleanHtml, cleanCss],
  );

  const handleSelectPreset = (preset: HtmlCssPreset) => {
    setActivePresetId(preset.id);
    setHtmlCode(preset.html);
    setCssCode(preset.css);
  };

  const handleReset = () => {
    const found = PRESETS.find((p) => p.id === activePresetId) ?? PRESETS[0];
    setHtmlCode(found.html);
    setCssCode(found.css);
  };

  const handleCopyFullHtml = async () => {
    try {
      await navigator.clipboard.writeText(fullDocument);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard fallback not needed in unsupported contexts
    }
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([fullDocument], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `thuc-hanh-${activePresetId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const viewportWidthClass =
    viewport === "mobile"
      ? "max-w-[375px]"
      : viewport === "tablet"
        ? "max-w-[768px]"
        : "w-full";

  return (
    <div className="space-y-6">
      {/* Safety notice + Preset bar */}
      <div className="rounded-2xl border border-border/70 bg-card/85 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>🔒 Chế độ học tập HTML/CSS tĩnh an toàn (Tắt thực thi Script)</span>
          </Badge>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.05] cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Khôi phục mẫu</span>
            </button>
            <button
              type="button"
              onClick={handleCopyFullHtml}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground hover:bg-foreground/[0.05] cursor-pointer"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>{copied ? "Đã chép HTML" : "Chép file HTML"}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Tải .html</span>
            </button>
          </div>
        </div>

        {/* 6 SGK Tin học 12 Presets */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            6 Bài thực hành mẫu chuẩn SGK Tin học 12 GDPT 2018
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => {
              const active = preset.id === activePresetId;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={cn(
                    "inline-flex flex-col items-start rounded-xl border px-3 py-2 text-left transition-colors cursor-pointer",
                    active
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/70 bg-background/70 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  <span className="text-xs font-bold">{preset.label}</span>
                  <span className="text-[11px] opacity-80">{preset.lesson}</span>
                </button>
              );
            })}
          </div>
        </div>

        {strippedItems.length > 0 && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Chế độ sandbox đã tự động loại bỏ thành phần không được phép:{" "}
              <strong>{strippedItems.join(", ")}</strong>. Công cụ chỉ hỗ trợ
              HTML5 &amp; CSS3 tĩnh.
            </span>
          </div>
        )}
      </div>

      {/* Main Split Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Code Editors */}
        <div className="rounded-2xl border border-border/70 bg-card/85 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
              <Code2 className="h-4 w-4 text-primary" />
              <span>Trình soạn thảo HTML5 &amp; CSS3</span>
            </div>
            <div className="inline-flex rounded-xl bg-foreground/[0.05] p-1">
              {(
                [
                  { id: "split", label: "HTML + CSS" },
                  { id: "html", label: "Chỉ HTML" },
                  { id: "css", label: "Chỉ CSS" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setEditorTab(tab.id)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer",
                    editorTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {(editorTab === "split" || editorTab === "html") && (
              <div className="space-y-1.5">
                <label
                  htmlFor="html-editor"
                  className="flex items-center justify-between text-xs font-semibold text-muted-foreground"
                >
                  <span>HTML (Nội dung trong &lt;body&gt;)</span>
                  <span className="font-mono">{htmlCode.length} ký tự</span>
                </label>
                <textarea
                  id="html-editor"
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  spellCheck={false}
                  rows={editorTab === "split" ? 11 : 20}
                  className="w-full rounded-xl border border-border bg-background/90 p-3 font-mono text-xs leading-relaxed text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}

            {(editorTab === "split" || editorTab === "css") && (
              <div className="space-y-1.5">
                <label
                  htmlFor="css-editor"
                  className="flex items-center justify-between text-xs font-semibold text-muted-foreground"
                >
                  <span>CSS (Định dạng giao diện)</span>
                  <span className="font-mono">{cssCode.length} ký tự</span>
                </label>
                <textarea
                  id="css-editor"
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  spellCheck={false}
                  rows={editorTab === "split" ? 11 : 20}
                  className="w-full rounded-xl border border-border bg-background/90 p-3 font-mono text-xs leading-relaxed text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}
          </div>
        </div>

        {/* Live Sandboxed Preview */}
        <div className="flex flex-col rounded-2xl border border-border/70 bg-card/85 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-foreground">
              Xem trước trực tiếp (Sandbox)
            </span>
            <div className="inline-flex rounded-xl bg-foreground/[0.05] p-1">
              {(
                [
                  { id: "desktop", label: "Máy tính", Icon: Monitor },
                  { id: "tablet", label: "Tablet", Icon: Tablet },
                  { id: "mobile", label: "Điện thoại", Icon: Smartphone },
                ] as const
              ).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setViewport(id)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer",
                    viewport === id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-1 justify-center rounded-xl border border-border/70 bg-slate-100 p-2 dark:bg-slate-900/60">
            <iframe
              sandbox=""
              srcDoc={fullDocument}
              title="Xem trước HTML & CSS tĩnh"
              className={cn(
                "min-h-[460px] w-full rounded-lg border border-border/60 bg-white transition-all duration-200",
                viewportWidthClass,
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
