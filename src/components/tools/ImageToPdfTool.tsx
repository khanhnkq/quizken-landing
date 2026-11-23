"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Download,
  FileImage,
  ImagePlus,
  Lock,
  Printer,
  RotateCw,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type Rotation = 0 | 90 | 180 | 270;
type PageLayout = "single-margin" | "single-full" | "two-up";
type PageOrientation = "portrait" | "landscape";

type ImageItem = {
  id: string;
  name: string;
  size: number;
  url: string;
  width: number;
  height: number;
  rotation: Rotation;
};

type RenderedPdfPage = {
  jpegBytes: Uint8Array;
  pixelWidth: number;
  pixelHeight: number;
  ptWidth: number;
  ptHeight: number;
};

const ACCEPTED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const ACCEPTED_EXT = /\.(jpe?g|png|webp)$/i;

const A4_PX: Record<PageOrientation, { w: number; h: number }> = {
  portrait: { w: 1240, h: 1754 },
  landscape: { w: 1754, h: 1240 },
};

const A4_PT: Record<PageOrientation, { w: number; h: number }> = {
  portrait: { w: 595.28, h: 841.89 },
  landscape: { w: 841.89, h: 595.28 },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function loadHtmlImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Không thể đọc dữ liệu ảnh."));
    img.src = url;
  });
}

function drawRotatedImageContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  rotation: Rotation,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number,
) {
  const isQuarterTurn = rotation === 90 || rotation === 270;
  const effW = isQuarterTurn ? img.naturalHeight : img.naturalWidth;
  const effH = isQuarterTurn ? img.naturalWidth : img.naturalHeight;
  if (effW <= 0 || effH <= 0) return;

  const scale = Math.min(boxW / effW, boxH / effH);
  const drawW = img.naturalWidth * scale;
  const drawH = img.naturalHeight * scale;

  ctx.save();
  ctx.translate(boxX + boxW / 2, boxY + boxH / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
}

function dataUrlToJpegBytes(dataUrl: string): Uint8Array {
  const commaIdx = dataUrl.indexOf(",");
  const base64 = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Pure TypeScript PDF 1.4 multi-page JPEG-to-PDF binary builder (zero dependencies).
 * Wraps each rendered A4 JPEG stream in /DCTDecode XObject + exact xref offsets.
 */
function buildPdfFromJpegs(pages: RenderedPdfPage[]): Uint8Array {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  let byteLength = 0;

  const pushBytes = (bytes: Uint8Array) => {
    chunks.push(bytes);
    byteLength += bytes.length;
  };
  const pushAscii = (text: string) => pushBytes(encoder.encode(text));

  // PDF 1.4 binary header
  pushBytes(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a, 0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));

  const totalObjects = 2 + pages.length * 3;
  const offsets: number[] = new Array(totalObjects + 1).fill(0);

  const pageRefs = pages.map((_, idx) => `${3 + idx * 3} 0 R`).join(" ");

  // 1: Catalog
  offsets[1] = byteLength;
  pushAscii("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  // 2: Pages tree
  offsets[2] = byteLength;
  pushAscii(`2 0 obj\n<< /Type /Pages /Kids [${pageRefs}] /Count ${pages.length} >>\nendobj\n`);

  pages.forEach((page, idx) => {
    const pageObj = 3 + idx * 3;
    const contentObj = 4 + idx * 3;
    const imageObj = 5 + idx * 3;
    const wPt = page.ptWidth.toFixed(2);
    const hPt = page.ptHeight.toFixed(2);
    const contentStream = `q ${wPt} 0 0 ${hPt} 0 0 cm /Im0 Do Q\n`;

    offsets[pageObj] = byteLength;
    pushAscii(
      `${pageObj} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${wPt} ${hPt}] /Resources << /XObject << /Im0 ${imageObj} 0 R >> >> /Contents ${contentObj} 0 R >>\nendobj\n`,
    );

    offsets[contentObj] = byteLength;
    pushAscii(
      `${contentObj} 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\nendobj\n`,
    );

    offsets[imageObj] = byteLength;
    pushAscii(
      `${imageObj} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${page.pixelWidth} /Height ${page.pixelHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.jpegBytes.length} >>\nstream\n`,
    );
    pushBytes(page.jpegBytes);
    pushAscii("\nendstream\nendobj\n");
  });

  const xrefOffset = byteLength;
  pushAscii(`xref\n0 ${totalObjects + 1}\n0000000000 65535 f \n`);
  for (let i = 1; i <= totalObjects; i += 1) {
    pushAscii(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
  }
  pushAscii(`trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  const output = new Uint8Array(byteLength);
  let cursor = 0;
  for (const chunk of chunks) {
    output.set(chunk, cursor);
    cursor += chunk.length;
  }
  return output;
}

export function ImageToPdfTool() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [layout, setLayout] = useState<PageLayout>("single-margin");
  const [orientation, setOrientation] = useState<PageOrientation>("portrait");
  const [fileName, setFileName] = useState<string>("vo-ghi-bai-tap-a4");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const urlSet = activeUrlsRef.current;
    return () => {
      urlSet.forEach((url) => URL.revokeObjectURL(url));
      urlSet.clear();
    };
  }, []);

  const addFiles = async (fileList: FileList | File[]) => {
    setErrorMsg(null);
    setStatusMsg(null);
    const incoming = Array.from(fileList);
    if (incoming.length === 0) return;

    const validFiles = incoming.filter(
      (f) => ACCEPTED_MIME.has(f.type) || ACCEPTED_EXT.test(f.name),
    );
    const rejectedCount = incoming.length - validFiles.length;

    if (validFiles.length === 0) {
      setErrorMsg("Vui lòng chỉ chọn ảnh định dạng JPG, PNG hoặc WebP.");
      return;
    }

    const added: ImageItem[] = [];
    for (const file of validFiles) {
      const url = URL.createObjectURL(file);
      activeUrlsRef.current.add(url);
      try {
        const img = await loadHtmlImage(url);
        added.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          name: file.name,
          size: file.size,
          url,
          width: img.naturalWidth,
          height: img.naturalHeight,
          rotation: 0,
        });
      } catch {
        URL.revokeObjectURL(url);
        activeUrlsRef.current.delete(url);
      }
    }

    if (added.length > 0) {
      setImages((prev) => [...prev, ...added]);
    }
    if (rejectedCount > 0) {
      setErrorMsg(`Đã bỏ qua ${rejectedCount} tệp không phải ảnh JPG/PNG/WebP.`);
    }
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    setImages((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next;
    });
  };

  const handleRotate = (id: string) => {
    setImages((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, rotation: ((item.rotation + 90) % 360) as Rotation }
          : item,
      ),
    );
  };

  const handleRemove = (id: string) => {
    setImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
        activeUrlsRef.current.delete(target.url);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleClearAll = () => {
    images.forEach((item) => {
      URL.revokeObjectURL(item.url);
      activeUrlsRef.current.delete(item.url);
    });
    setImages([]);
    setErrorMsg(null);
    setStatusMsg(null);
  };

  const pageGroups = useMemo(() => {
    const perPage = layout === "two-up" ? 2 : 1;
    const groups: ImageItem[][] = [];
    for (let i = 0; i < images.length; i += perPage) {
      groups.push(images.slice(i, i + perPage));
    }
    return groups;
  }, [images, layout]);

  const handleDownloadPdf = async () => {
    if (images.length === 0 || isExporting) return;
    setIsExporting(true);
    setErrorMsg(null);
    setStatusMsg(null);

    try {
      const px = A4_PX[orientation];
      const pt = A4_PT[orientation];
      const renderedPages: RenderedPdfPage[] = [];

      const canvas = document.createElement("canvas");
      canvas.width = px.w;
      canvas.height = px.h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Trình duyệt không hỗ trợ Canvas 2D.");
      }

      for (const group of pageGroups) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, px.w, px.h);

        if (layout === "single-full") {
          const img = await loadHtmlImage(group[0].url);
          drawRotatedImageContain(ctx, img, group[0].rotation, 0, 0, px.w, px.h);
        } else if (layout === "single-margin") {
          const margin = 64;
          const img = await loadHtmlImage(group[0].url);
          drawRotatedImageContain(
            ctx,
            img,
            group[0].rotation,
            margin,
            margin,
            px.w - margin * 2,
            px.h - margin * 2,
          );
        } else {
          // two-up
          const margin = 56;
          const gap = 36;
          if (orientation === "portrait") {
            const slotW = px.w - margin * 2;
            const slotH = (px.h - margin * 2 - gap) / 2;
            for (let slot = 0; slot < group.length; slot += 1) {
              const img = await loadHtmlImage(group[slot].url);
              drawRotatedImageContain(
                ctx,
                img,
                group[slot].rotation,
                margin,
                margin + slot * (slotH + gap),
                slotW,
                slotH,
              );
            }
          } else {
            const slotW = (px.w - margin * 2 - gap) / 2;
            const slotH = px.h - margin * 2;
            for (let slot = 0; slot < group.length; slot += 1) {
              const img = await loadHtmlImage(group[slot].url);
              drawRotatedImageContain(
                ctx,
                img,
                group[slot].rotation,
                margin + slot * (slotW + gap),
                margin,
                slotW,
                slotH,
              );
            }
          }
        }

        const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.9);
        const jpegBytes = dataUrlToJpegBytes(jpegDataUrl);
        renderedPages.push({
          jpegBytes,
          pixelWidth: px.w,
          pixelHeight: px.h,
          ptWidth: pt.w,
          ptHeight: pt.h,
        });
      }

      const pdfBytes = buildPdfFromJpegs(renderedPages);
      const pdfCopy = new Uint8Array(pdfBytes.length);
      pdfCopy.set(pdfBytes);
      const blob = new Blob([pdfCopy.buffer], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);

      const safeName =
        fileName
          .trim()
          .replace(/\.pdf$/i, "")
          .replace(/[\\/:*?"<>|]+/g, "-") || "tai-lieu-a4";

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${safeName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 4000);

      setStatusMsg(
        `Đã xuất thành công file ${safeName}.pdf (${renderedPages.length} trang A4, ${formatFileSize(pdfBytes.length)}).`,
      );
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi tạo file PDF.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined" && images.length > 0) {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @media print {
          @page {
            size: A4 ${orientation};
            margin: 0;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
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
          #image-pdf-print-area {
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            background: transparent !important;
          }
          .a4-print-page {
            width: 100% !important;
            height: 100vh !important;
            max-width: none !important;
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            page-break-after: always;
            break-after: page;
          }
          .a4-print-page:last-child {
            page-break-after: auto;
            break-after: auto;
          }
        }
      `}</style>

      {/* Prominent Privacy Banner */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-foreground">
        <div className="flex items-center gap-2.5">
          <Lock className="h-4 w-4 text-primary shrink-0" />
          <span>
            🔒 Xử lý 100% trực tiếp trên trình duyệt — Ảnh của bạn không bao giờ tải lên máy chủ
          </span>
        </div>
        <Badge className="bg-primary text-primary-foreground">
          Zero Upload • Offline Ready
        </Badge>
      </div>

      {/* Upload Dropzone & Options */}
      <div className="no-print grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Dropzone */}
        <div className="lg:col-span-7 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              void addFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border/80 bg-foreground/[0.02] hover:border-primary/60 hover:bg-foreground/[0.04]",
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <ImagePlus className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="font-heading text-base font-bold text-foreground sm:text-lg">
                Kéo thả ảnh vào đây hoặc nhấn để chọn ảnh
              </p>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Hỗ trợ chọn nhiều ảnh JPG, PNG, WebP cùng lúc (chụp vở ghi, bài tập, tài liệu)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  void addFiles(e.target.files);
                  e.target.value = "";
                }
              }}
            />
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-xs font-medium text-destructive sm:text-sm">
              {errorMsg}
            </div>
          )}
          {statusMsg && (
            <div className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-xs font-medium text-foreground sm:text-sm">
              {statusMsg}
            </div>
          )}

          {/* Image List */}
          {images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-sm font-bold text-foreground sm:text-base">
                  Danh sách ảnh đã chọn ({images.length} ảnh → {pageGroups.length} trang A4)
                </h2>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Xóa tất cả</span>
                </button>
              </div>

              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {images.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/70 p-2.5"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-white flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.name}
                        style={{ transform: `rotate(${item.rotation}deg)` }}
                        className="max-h-full max-w-full object-contain transition-transform duration-200"
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {idx + 1}. {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.width} × {item.height}px • {formatFileSize(item.size)} • Xoay{" "}
                        {item.rotation}°
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, -1)}
                        disabled={idx === 0}
                        aria-label={`Di chuyển ảnh ${idx + 1} lên`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.12] disabled:opacity-40 cursor-pointer"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 1)}
                        disabled={idx === images.length - 1}
                        aria-label={`Di chuyển ảnh ${idx + 1} xuống`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.12] disabled:opacity-40 cursor-pointer"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRotate(item.id)}
                        aria-label={`Xoay ảnh ${idx + 1} 90 độ`}
                        title="Xoay 90°"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.12] cursor-pointer"
                      >
                        <RotateCw className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        aria-label={`Xóa ảnh ${idx + 1}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings & Export Actions */}
        <div className="lg:col-span-5 rounded-2xl border border-border/70 bg-card/85 p-5 sm:p-6 space-y-5 h-fit">
          <div className="flex items-center gap-2">
            <FileImage className="h-4 w-4 text-primary" />
            <h2 className="font-heading text-lg font-bold text-foreground">
              Cấu hình trang PDF A4
            </h2>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Bố cục trang (Layout)
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  id: "single-margin" as const,
                  title: "1 ảnh / trang A4 có lề",
                  desc: "Chừa lề trắng cân đối, dễ ghi chú và đóng tập",
                },
                {
                  id: "single-full" as const,
                  title: "Đầy trang A4",
                  desc: "Phóng tối đa vừa khít khung A4 không mất chữ",
                },
                {
                  id: "two-up" as const,
                  title: "2 ảnh / trang A4",
                  desc: "Ghép 2 trang vở lên 1 tờ A4 tiết kiệm giấy in",
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLayout(opt.id)}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left transition-colors cursor-pointer",
                    layout === opt.id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/70 bg-background/60 text-foreground hover:bg-foreground/[0.04]",
                  )}
                >
                  <p className="text-sm font-bold">{opt.title}</p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Hướng giấy A4
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "portrait" as const, label: "Khổ Dọc (Portrait)" },
                { id: "landscape" as const, label: "Khổ Ngang (Landscape)" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setOrientation(opt.id)}
                  className={cn(
                    "min-h-10 rounded-xl border px-3 text-xs font-semibold transition-colors cursor-pointer sm:text-sm",
                    orientation === opt.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/70 bg-background/60 text-foreground hover:bg-foreground/[0.04]",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="pdf-filename-input"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Tên file PDF tải về
            </label>
            <div className="flex items-center rounded-xl border border-input bg-background px-3">
              <input
                id="pdf-filename-input"
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="vo-ghi-bai-tap-a4"
                className="h-10 w-full bg-transparent text-sm text-foreground focus:outline-none"
              />
              <span className="text-xs font-mono font-semibold text-muted-foreground">
                .pdf
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={images.length === 0 || isExporting}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-heading font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>
                {isExporting
                  ? "Đang tạo file PDF..."
                  : `Tải file PDF (.pdf) — ${pageGroups.length} trang`}
              </span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={images.length === 0}
              className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-foreground/[0.06] px-4 text-sm font-semibold text-foreground hover:bg-foreground/[0.12] disabled:opacity-50 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>In / Lưu PDF qua trình duyệt (Print)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live A4 Preview & Print Area */}
      {pageGroups.length > 0 && (
        <div
          id="image-pdf-print-area"
          className="rounded-2xl border border-border/70 bg-foreground/[0.04] p-4 sm:p-6 space-y-4"
        >
          <div className="no-print flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-heading text-base font-bold text-foreground sm:text-lg">
              Xem trước các trang A4 ({pageGroups.length} trang)
            </h2>
            <span className="text-xs text-muted-foreground">
              Khổ A4 {orientation === "portrait" ? "Dọc (210×297mm)" : "Ngang (297×210mm)"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {pageGroups.map((group, pageIdx) => (
              <div
                key={`page-${pageIdx}-${group.map((g) => g.id).join("-")}`}
                className={cn(
                  "a4-print-page mx-auto w-full rounded-xl border border-border/80 bg-white overflow-hidden shadow-sm",
                  orientation === "portrait" ? "aspect-[210/297]" : "aspect-[297/210]",
                  layout === "single-full" ? "p-0" : "p-4 sm:p-6",
                )}
              >
                <div
                  className={cn(
                    "h-full w-full",
                    layout === "two-up"
                      ? orientation === "portrait"
                        ? "grid grid-rows-2 gap-3"
                        : "grid grid-cols-2 gap-3"
                      : "flex items-center justify-center",
                  )}
                >
                  {group.map((item) => (
                    <div
                      key={item.id}
                      className="relative flex h-full w-full items-center justify-center overflow-hidden"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.name}
                        style={{
                          transform: `rotate(${item.rotation}deg)`,
                          maxWidth:
                            item.rotation === 90 || item.rotation === 270 ? "70%" : "100%",
                          maxHeight:
                            item.rotation === 90 || item.rotation === 270 ? "70%" : "100%",
                        }}
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
