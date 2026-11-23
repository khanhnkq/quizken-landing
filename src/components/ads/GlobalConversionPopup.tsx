"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  BookOpenCheck,
  GraduationCap,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  buildConversionUrl,
  dismissPromoPopupFor24h,
  getContextualAd,
  trackConversionClick,
  useIsPromoPopupDismissed,
} from "@/lib/conversion";

const QUICK_ROLE_CARDS = [
  {
    title: "Ôn thi THPT 2027 3 phần",
    subtitle: "Trắc nghiệm, Đúng/Sai, Trả lời ngắn",
    campaign: "role_thpt_2027",
    path: "/quiz/create",
    prompt: "Đề thi thử THPT 2027 chuẩn 3 phần",
    icon: GraduationCap,
  },
  {
    title: "Luyện đề ĐGNL HSA/V-ACT",
    subtitle: "Tư duy định lượng, định tính & khoa học",
    campaign: "role_dgnl",
    path: "/quiz/create",
    prompt: "Đề luyện thi ĐGNL HSA và V-ACT mới nhất",
    icon: Target,
  },
  {
    title: "Ôn thi Đại cương Đại học",
    subtitle: "Triết học, Pháp luật, Kinh tế chính trị",
    campaign: "role_uni",
    path: "/quiz/create",
    prompt: "Trắc nghiệm ôn thi cuối kỳ môn Đại cương Đại học",
    icon: BookOpenCheck,
  },
  {
    title: "Giáo viên soạn đề & Live Game",
    subtitle: "Xuất Word/PDF 7991 & mở phòng thi lớp",
    campaign: "role_teacher",
    path: "/quiz/create",
    prompt: "Soạn đề kiểm tra 45 phút chuẩn Công văn 7991",
    icon: Users,
  },
] as const;

export function GlobalConversionPopup() {
  const pathname = usePathname() || "/";
  const dismissed = useIsPromoPopupDismissed();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const creative = getContextualAd({ pathname });

  useEffect(() => {
    if (dismissed || open) return;

    const mountedAt = Date.now();
    let triggered = false;

    const triggerPopup = () => {
      if (triggered) return;
      triggered = true;
      setOpen(true);
    };

    const getScrollDepth = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return 0;
      return scrollTop / maxScroll;
    };

    const isDesktop = () => window.innerWidth >= 1024;

    const onMouseLeave = (event: MouseEvent) => {
      if (!isDesktop()) return;
      if (event.clientY <= 12 && Date.now() - mountedAt >= 12_000) {
        triggerPopup();
      }
    };

    const onScroll = () => {
      const elapsed = Date.now() - mountedAt;
      const depth = getScrollDepth();
      if (isDesktop()) {
        if (elapsed >= 20_000 && depth >= 0.7) {
          triggerPopup();
        }
      } else if (elapsed >= 18_000 && depth >= 0.65) {
        triggerPopup();
      }
    };

    const desktopTimer = window.setTimeout(() => {
      if (isDesktop() && getScrollDepth() >= 0.7) {
        triggerPopup();
      }
    }, 20_100);

    const mobileTimer = window.setTimeout(() => {
      if (!isDesktop() && getScrollDepth() >= 0.65) {
        triggerPopup();
      }
    }, 18_100);

    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(desktopTimer);
      window.clearTimeout(mobileTimer);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [dismissed, open, pathname]);

  useEffect(() => {
    if (!open || dismissed) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        dismissPromoPopupFor24h();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, dismissed]);

  if (!open || dismissed) {
    return null;
  }

  const handleClose = () => {
    setOpen(false);
    dismissPromoPopupFor24h();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanPrompt = prompt.trim();
    const targetUrl = buildConversionUrl({
      path: "/quiz/create",
      placement: "global_exit_popup",
      campaign: creative.campaign,
      prompt: cleanPrompt || undefined,
    });

    trackConversionClick({
      placement: "global_exit_popup",
      campaign: creative.campaign,
      targetUrl,
      label: cleanPrompt ? "prompt_form_submit" : "prompt_form_empty_submit",
    });

    dismissPromoPopupFor24h();
    setOpen(false);
    window.location.assign(targetUrl);
  };

  const handleChipClick = (sample: string) => {
    setPrompt(sample);
    inputRef.current?.focus();
  };

  return (
    <div
      className="no-print print:hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="qk-global-conversion-title"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/80 bg-card/95 backdrop-blur-xl p-5 sm:p-7 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Đóng hộp thoại"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/[0.06] text-muted-foreground transition-colors hover:bg-foreground/[0.12] hover:text-foreground cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="pr-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {creative.badge}
          </span>

          <h2
            id="qk-global-conversion-title"
            className="mt-3 font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground"
          >
            {creative.headline}
          </h2>

          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {creative.description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <label
            htmlFor="qk-global-prompt-input"
            className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2"
          >
            Nhập chủ đề hoặc tên bài học muốn tạo đề
          </label>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <input
              ref={inputRef}
              id="qk-global-prompt-input"
              type="text"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder={`VD: ${creative.samplePrompts[0]}`}
              className="h-11 flex-1 rounded-xl border border-border bg-background/80 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
            <button
              type="submit"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-heading text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>Tạo đề AI ngay</span>
            </button>
          </div>
        </form>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-muted-foreground mr-1">
            Gợi ý nhanh:
          </span>
          {creative.samplePrompts.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => handleChipClick(sample)}
              className="rounded-lg bg-foreground/[0.06] px-2.5 py-1 text-left text-xs font-medium text-foreground transition-colors hover:bg-primary/15 hover:text-primary cursor-pointer"
            >
              {sample}
            </button>
          ))}
        </div>

        <div className="mt-6 border-t border-border/70 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Hoặc chọn lộ trình phù hợp với bạn
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {QUICK_ROLE_CARDS.map((card) => {
              const Icon = card.icon;
              const href = buildConversionUrl({
                path: card.path,
                placement: "global_exit_popup",
                campaign: card.campaign,
                prompt: card.prompt,
              });

              return (
                <a
                  key={card.campaign}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackConversionClick({
                      placement: "global_exit_popup",
                      campaign: card.campaign,
                      targetUrl: href,
                      label: card.title,
                    });
                    handleClose();
                  }}
                  className="group flex items-start gap-3 rounded-xl border border-border/70 bg-background/60 p-3 transition-colors hover:border-primary/50 hover:bg-primary/[0.05]"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-1 text-sm font-semibold text-foreground group-hover:text-primary">
                      <span className="truncate">{card.title}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground line-clamp-1">
                      {card.subtitle}
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
