"use client";

import { useMemo, useState } from "react";
import {
  BookMarked,
  Copy,
  Check,
  Plus,
  Trash2,
  ArrowDownAZ,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type SourceType = "book" | "journal" | "website" | "thesis";
type CitationStyle = "apa7" | "ieee" | "harvard" | "tcvn";

interface CitationEntry {
  id: string;
  sourceType: SourceType;
  authors: string;
  year: string;
  title: string;
  publisherOrSite: string;
  volumeIssuePages: string;
  urlOrDoi: string;
  accessDate: string;
}

function splitAuthors(raw: string): string[] {
  return raw
    .split(/[;\n]+/)
    .map((a) => a.trim())
    .filter(Boolean);
}

function formatAuthorListApa(authors: string[]): string {
  if (authors.length === 0) return "Không rõ tác giả";
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]}, & ${authors[1]}`;
  return `${authors.slice(0, -1).join(", ")}, & ${authors[authors.length - 1]}`;
}

function formatAuthorListIeee(authors: string[]): string {
  if (authors.length === 0) return "Anonymous";
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
  return `${authors.slice(0, -1).join(", ")}, and ${authors[authors.length - 1]}`;
}

function formatCitation(
  entry: CitationEntry,
  style: CitationStyle,
  index: number
): string {
  const authors = splitAuthors(entry.authors);
  const year = entry.year.trim() || "n.d.";
  const title = entry.title.trim() || "Chưa có tiêu đề";
  const pub = entry.publisherOrSite.trim();
  const vol = entry.volumeIssuePages.trim();
  const url = entry.urlOrDoi.trim();
  const access = entry.accessDate.trim();

  if (style === "apa7") {
    const authStr = formatAuthorListApa(authors);
    if (entry.sourceType === "book") {
      return `${authStr} (${year}). ${title}.${pub ? ` ${pub}.` : ""}${
        url ? ` ${url}` : ""
      }`;
    }
    if (entry.sourceType === "journal") {
      return `${authStr} (${year}). ${title}. ${pub || "Tạp chí khoa học"}${
        vol ? `, ${vol}` : ""
      }.${url ? ` ${url}` : ""}`;
    }
    if (entry.sourceType === "thesis") {
      return `${authStr} (${year}). ${title} [Luận văn/Khóa luận]. ${
        pub || "Trường Đại học"
      }.${url ? ` ${url}` : ""}`;
    }
    return `${authStr} (${year}). ${title}. ${pub || "Website"}.${
      access ? ` Truy cập ${access},` : ""
    }${url ? ` từ ${url}` : ""}`;
  }

  if (style === "ieee") {
    const authStr = formatAuthorListIeee(authors);
    const num = `[${index + 1}]`;
    if (entry.sourceType === "book") {
      return `${num} ${authStr}, ${title}. ${pub ? `${pub}, ` : ""}${year}.`;
    }
    if (entry.sourceType === "journal") {
      return `${num} ${authStr}, "${title}," ${pub || "Journal"}${
        vol ? `, ${vol}` : ""
      }, ${year}.${url ? ` doi/url: ${url}` : ""}`;
    }
    if (entry.sourceType === "thesis") {
      return `${num} ${authStr}, "${title}," Luận văn, ${
        pub || "University"
      }, ${year}.`;
    }
    return `${num} ${authStr}, "${title}," ${pub || "Website"}, ${year}. [Online].${
      url ? ` Available: ${url}.` : ""
    }${access ? ` [Accessed: ${access}].` : ""}`;
  }

  if (style === "harvard") {
    const authStr = formatAuthorListApa(authors);
    if (entry.sourceType === "website") {
      return `${authStr} (${year}) '${title}', ${pub || "Website"}.${
        url ? ` Available at: ${url}` : ""
      }${access ? ` (Accessed: ${access})` : ""}.`;
    }
    return `${authStr} (${year}) ${title}.${pub ? ` ${pub}.` : ""}${
      vol ? ` ${vol}.` : ""
    }${url ? ` ${url}` : ""}`;
  }

  // TCVN 7225 / Chuẩn Bộ GD&ĐT Việt Nam
  const authStr = authors.length > 0 ? authors.join(", ") : "Khuyết danh";
  if (entry.sourceType === "website") {
    return `${authStr} (${year}), "${title}", ${pub || "Trang điện tử"}, truy cập${
      access ? ` ngày ${access}` : ""
    }${url ? `, tại địa chỉ <${url}>` : ""}.`;
  }
  return `${authStr} (${year}), ${title},${pub ? ` ${pub},` : ""}${
    vol ? ` ${vol},` : ""
  } tr.${url ? ` ${url}` : ""}`.replace(/,\s*tr\.$/, ".");
}

const DEFAULT_SAMPLE: CitationEntry = {
  id: "sample-1",
  sourceType: "journal",
  authors: "Nguyễn Văn An; Trần Thị Bình",
  year: "2026",
  title:
    "Ứng dụng trí tuệ nhân tạo tạo sinh trong đánh giá năng lực học sinh THPT",
  publisherOrSite: "Tạp chí Khoa học Giáo dục Việt Nam",
  volumeIssuePages: "Tập 22, Số 3, tr. 45-58",
  urlOrDoi: "https://doi.org/10.1234/vjes.2026.03",
  accessDate: "24/11/2026",
};

export function CitationGeneratorTool() {
  const [style, setStyle] = useState<CitationStyle>("apa7");
  const [draft, setDraft] = useState<CitationEntry>(DEFAULT_SAMPLE);
  const [list, setList] = useState<CitationEntry[]>([DEFAULT_SAMPLE]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const previewText = useMemo(
    () => formatCitation(draft, style, list.length),
    [draft, style, list.length]
  );

  const formattedBibliography = useMemo(
    () => list.map((item, idx) => formatCitation(item, style, idx)),
    [list, style]
  );

  const handleAddToList = () => {
    if (!draft.title.trim()) return;
    setList((prev) => [
      ...prev,
      { ...draft, id: `cite-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` },
    ]);
  };

  const handleSortAlpha = () => {
    setList((prev) =>
      [...prev].sort((a, b) =>
        (a.authors || a.title).localeCompare(b.authors || b.title, "vi")
      )
    );
  };

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Citation Style Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/85 p-3">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "apa7", label: "APA 7th (Phổ biến nhất)" },
              { id: "ieee", label: "IEEE (Kỹ thuật & IT)" },
              { id: "harvard", label: "Harvard" },
              { id: "tcvn", label: "Chuẩn Việt Nam (TCVN)" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStyle(item.id)}
              className={cn(
                "min-h-10 cursor-pointer rounded-xl px-4 text-xs font-bold transition-colors sm:text-sm",
                style === item.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/[0.05] text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <Badge>Chuẩn Khóa luận &amp; NCKH</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "journal", label: "Bài báo khoa học" },
                { id: "book", label: "Sách / Giáo trình" },
                { id: "website", label: "Website / Báo mạng" },
                { id: "thesis", label: "Luận văn / Khóa luận" },
              ] as const
            ).map((src) => (
              <button
                key={src.id}
                type="button"
                onClick={() =>
                  setDraft((prev) => ({ ...prev, sourceType: src.id }))
                }
                className={cn(
                  "min-h-9 cursor-pointer rounded-lg px-3 text-xs font-semibold transition-colors",
                  draft.sourceType === src.id
                    ? "bg-primary/15 text-primary ring-1 ring-primary/40"
                    : "bg-foreground/[0.04] text-muted-foreground hover:text-foreground"
                )}
              >
                {src.label}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Tác giả (ngăn cách nhiều tác giả bằng dấu ;)
              </label>
              <input
                type="text"
                value={draft.authors}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, authors: e.target.value }))
                }
                placeholder="VD: Nguyễn Văn An; Trần Thị Bình"
                className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Năm xuất bản
              </label>
              <input
                type="text"
                value={draft.year}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, year: e.target.value }))
                }
                placeholder="2026"
                className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Tiêu đề tài liệu / bài viết
            </label>
            <input
              type="text"
              value={draft.title}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, title: e.target.value }))
              }
              className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                {draft.sourceType === "book"
                  ? "Nhà xuất bản"
                  : draft.sourceType === "website"
                  ? "Tên Website"
                  : draft.sourceType === "thesis"
                  ? "Trường Đại học"
                  : "Tên Tạp chí / Hội nghị"}
              </label>
              <input
                type="text"
                value={draft.publisherOrSite}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    publisherOrSite: e.target.value,
                  }))
                }
                className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Tập, Số, Trang (nếu có)
              </label>
              <input
                type="text"
                value={draft.volumeIssuePages}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    volumeIssuePages: e.target.value,
                  }))
                }
                placeholder="Vol. 12, No. 2, pp. 10-20"
                className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                DOI hoặc URL
              </label>
              <input
                type="text"
                value={draft.urlOrDoi}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, urlOrDoi: e.target.value }))
                }
                className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Ngày truy cập (cho Website)
              </label>
              <input
                type="text"
                value={draft.accessDate}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, accessDate: e.target.value }))
                }
                className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-xl bg-foreground/[0.04] p-4 space-y-2 dark:bg-foreground/[0.06]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-muted-foreground">
                Xem trước trích dẫn ({style.toUpperCase()})
              </span>
              <button
                type="button"
                onClick={() => handleCopy("single", previewText)}
                className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                {copiedKey === "single" ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Đã chép
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Chép nhanh
                  </>
                )}
              </button>
            </div>
            <p className="text-sm leading-relaxed text-foreground pl-6 -indent-6">
              {previewText}
            </p>
          </div>

          <Button
            type="button"
            onClick={handleAddToList}
            className="w-full justify-center gap-2 min-h-11"
          >
            <Plus className="h-4 w-4" />
            Thêm vào Danh mục Tài liệu tham khảo
          </Button>
        </div>

        {/* Bibliography List */}
        <div className="rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Danh mục Tài liệu tham khảo ({list.length})
                </h2>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleSortAlpha}
                  className="min-h-9 gap-1.5"
                >
                  <ArrowDownAZ className="h-3.5 w-3.5" />
                  Xếp A–Z
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={list.length === 0}
                  onClick={() =>
                    handleCopy("all", formattedBibliography.join("\n\n"))
                  }
                  className="min-h-9 gap-1.5"
                >
                  {copiedKey === "all" ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Đã sao chép tất cả
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Sao chép toàn bộ
                    </>
                  )}
                </Button>
              </div>
            </div>

            {list.length === 0 ? (
              <div className="rounded-xl bg-foreground/[0.04] p-6 text-center text-sm text-muted-foreground">
                Danh mục trống. Hãy điền thông tin bên trái và bấm &ldquo;Thêm
                vào Danh mục&rdquo;.
              </div>
            ) : (
              <div className="space-y-3">
                {formattedBibliography.map((text, idx) => (
                  <div
                    key={list[idx].id}
                    className="flex items-start justify-between gap-3 rounded-xl bg-foreground/[0.04] p-4 text-sm dark:bg-foreground/[0.06]"
                  >
                    <p className="flex-1 leading-relaxed text-foreground pl-5 -indent-5">
                      {text}
                    </p>
                    <button
                      type="button"
                      aria-label="Xóa trích dẫn"
                      onClick={() =>
                        setList((prev) =>
                          prev.filter((item) => item.id !== list[idx].id)
                        )
                      }
                      className="shrink-0 cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
