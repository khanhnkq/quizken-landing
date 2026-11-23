"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X, Zap } from "lucide-react";
import {
  buildConversionUrl,
  dismissMobileBarForSession,
  getContextualAd,
  trackConversionClick,
  useIsMobileBarDismissed,
} from "@/lib/conversion";

function subscribeScrollPast320(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("scroll", callback, { passive: true });
  return () => {
    window.removeEventListener("scroll", callback);
  };
}

function getScrollPast320Snapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.scrollY > 320;
}

function getServerScrollPast320Snapshot(): boolean {
  return false;
}

export function MobileFloatingCta() {
  const pathname = usePathname() || "/";
  const dismissed = useIsMobileBarDismissed();
  const scrolledPast = useSyncExternalStore(
    subscribeScrollPast320,
    getScrollPast320Snapshot,
    getServerScrollPast320Snapshot,
  );

  if (dismissed || !scrolledPast) {
    return null;
  }

  const creative = getContextualAd({ pathname });
  const targetUrl = buildConversionUrl({
    path: creative.targetPath,
    placement: "mobile_floating_bar",
    campaign: creative.campaign,
  });

  return (
    <div
      role="region"
      aria-label="Thanh tạo đề AI nhanh"
      className="lg:hidden no-print print:hidden fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-xl px-3.5 py-2.5 shadow-xl transition-all duration-200"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
          <Sparkles className="h-4 w-4" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
            {creative.badge}
          </p>
          <p className="truncate font-heading text-xs sm:text-sm font-bold text-foreground">
            {creative.headline}
          </p>
        </div>

        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackConversionClick({
              placement: "mobile_floating_bar",
              campaign: creative.campaign,
              targetUrl,
              label: "Tạo Đề AI",
            });
          }}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3 font-heading text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Zap className="h-3.5 w-3.5 fill-current" />
          <span>Tạo Đề AI</span>
        </a>

        <button
          type="button"
          onClick={() => dismissMobileBarForSession()}
          aria-label="Ẩn thanh tạo đề"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/[0.08] hover:text-foreground cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
