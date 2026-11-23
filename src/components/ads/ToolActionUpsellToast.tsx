"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Sparkles, X } from "lucide-react";
import {
  buildConversionUrl,
  getContextualAd,
  trackConversionClick,
} from "@/lib/conversion";
import type { ToolCatalogItem, ToolCategory } from "@/lib/toolsCatalog";

const CATEGORY_HOOKS: Record<ToolCategory, string> = {
  "diem-so":
    "🎯 Đã tính xong điểm! Muốn bứt phá thêm 1.5–2.0 điểm trước kỳ thi?",
  "giao-vien":
    "✨ Công cụ sẵn sàng! Thầy cô muốn mở Phòng Thi Online / Đấu Trường Live cho lớp?",
  "hoc-tap-stem":
    "⚡ Đã giải xong! Luyện ngay 10 câu trắc nghiệm vận dụng chủ đề này?",
  "on-thi":
    "🔥 Sẵn sàng vào guồng! Tạo ngay đề chẩn đoán lỗ hổng kiến thức 15 phút?",
};

type ToolActionUpsellToastProps = {
  tool: ToolCatalogItem;
};

export function ToolActionUpsellToast({ tool }: ToolActionUpsellToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [topic, setTopic] = useState(() => `Ôn tập ${tool.shortTitle}`);
  const hasTriggeredRef = useRef(false);
  const clickTimerRef = useRef<number | null>(null);
  const inputTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[aria-label]");
    const workspace = Array.from(sections).find(
      (section) => section.getAttribute("aria-label") === tool.shortTitle,
    );

    if (!workspace) return;

    const clearTimers = () => {
      if (clickTimerRef.current !== null) {
        window.clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
      if (inputTimerRef.current !== null) {
        window.clearTimeout(inputTimerRef.current);
        inputTimerRef.current = null;
      }
    };

    const reveal = () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;
      clearTimers();
      setIsVisible(true);
    };

    const handleClick = (event: MouseEvent) => {
      if (hasTriggeredRef.current) return;
      const target = event.target as Element | null;
      if (!target) return;
      const actionEl = target.closest(
        'button, [role="button"], input[type="submit"], input[type="button"]',
      );
      if (!actionEl) return;

      if (inputTimerRef.current !== null) {
        window.clearTimeout(inputTimerRef.current);
        inputTimerRef.current = null;
      }
      if (clickTimerRef.current === null) {
        clickTimerRef.current = window.setTimeout(reveal, 1200);
      }
    };

    const handleInputOrChange = (event: Event) => {
      if (hasTriggeredRef.current || clickTimerRef.current !== null) return;
      const target = event.target as Element | null;
      if (!target || !target.closest("input, select, textarea")) return;

      if (inputTimerRef.current !== null) {
        window.clearTimeout(inputTimerRef.current);
      }
      inputTimerRef.current = window.setTimeout(reveal, 4000);
    };

    workspace.addEventListener("click", handleClick);
    workspace.addEventListener("input", handleInputOrChange);
    workspace.addEventListener("change", handleInputOrChange);

    return () => {
      workspace.removeEventListener("click", handleClick);
      workspace.removeEventListener("input", handleInputOrChange);
      workspace.removeEventListener("change", handleInputOrChange);
      clearTimers();
    };
  }, [tool.shortTitle]);

  if (!isVisible) return null;

  const ad = getContextualAd({
    category: tool.category,
    tags: [tool.slug, tool.categoryLabel, ...tool.keywords],
    pathname: `/cong-cu/${tool.slug}`,
  });

  const targetUrl = buildConversionUrl({
    path: ad.targetPath,
    placement: "tool_action_toast",
    campaign: tool.slug,
    prompt: topic.trim() || tool.shortTitle,
  });

  const hookHeadline = CATEGORY_HOOKS[tool.category];

  const handleTrackClick = () => {
    trackConversionClick({
      placement: "tool_action_toast",
      campaign: tool.slug,
      targetUrl,
      label: ad.ctaLabel,
    });
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleTrackClick();
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  const handleClose = () => {
    hasTriggeredRef.current = true;
    setIsVisible(false);
  };

  return (
    <aside
      aria-label="Gợi ý luyện tập QuizKen AI"
      className="no-print fixed bottom-5 right-5 z-40 w-[calc(100vw-2.5rem)] max-w-sm rounded-2xl border border-primary/30 bg-card/95 p-5 shadow-xl backdrop-blur-md transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary">
          <Sparkles className="h-3 w-3" />
          <span>{ad.badge}</span>
        </span>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Đóng gợi ý"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/[0.08] hover:text-foreground cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-3 font-heading text-sm font-bold leading-snug text-foreground sm:text-base">
        {hookHeadline}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        {ad.description}
      </p>

      <form onSubmit={handleFormSubmit} className="mt-3.5 space-y-2.5">
        <label className="block">
          <span className="sr-only">Chủ đề tạo đề AI</span>
          <input
            type="text"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder={`Chủ đề (VD: ${tool.shortTitle})`}
            className="h-9 w-full rounded-xl border border-border bg-background/90 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleTrackClick}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 font-heading text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:text-sm"
        >
          <span>{ad.ctaLabel}</span>
          <ArrowRight className="h-4 w-4 shrink-0" />
        </a>
      </form>
    </aside>
  );
}
