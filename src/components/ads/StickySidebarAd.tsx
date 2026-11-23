"use client";

import { useState } from "react";
import { ArrowRight, Check, Sparkles, Zap } from "lucide-react";
import {
  buildConversionUrl,
  getContextualAd,
  trackConversionClick,
} from "@/lib/conversion";

type StickySidebarAdProps = {
  category?: string;
  tags?: string[];
  slug?: string;
};

export function StickySidebarAd({
  category,
  tags,
  slug,
}: StickySidebarAdProps) {
  const [prompt, setPrompt] = useState("");
  const ad = getContextualAd({
    category,
    tags,
    pathname: slug ? `/blog/${slug}` : undefined,
  });

  const primaryCtaUrl = buildConversionUrl({
    path: ad.targetPath,
    placement: "blog_sticky_sidebar",
    campaign: ad.campaign,
  });

  const handlePromptSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = prompt.trim();
    const targetUrl = buildConversionUrl({
      path: "/quiz/create",
      placement: "blog_sticky_sidebar",
      campaign: ad.campaign,
      prompt: trimmed || undefined,
    });

    trackConversionClick({
      placement: "blog_sticky_sidebar",
      campaign: ad.campaign,
      targetUrl,
      label: slug ? `sidebar_prompt:${slug}` : "sidebar_prompt",
    });

    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      aria-label={ad.badge}
      className="no-print rounded-2xl border border-primary/25 bg-card/90 p-5"
    >
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
        <Sparkles className="h-3.5 w-3.5 shrink-0" />
        <span>{ad.badge}</span>
      </span>

      <h3 className="mt-3 font-heading text-base font-bold leading-snug tracking-tight text-foreground">
        {ad.headline}
      </h3>

      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        {ad.description}
      </p>

      <ul className="mt-3.5 space-y-2">
        {ad.bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex items-start gap-2 text-xs leading-snug text-foreground/85"
          >
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <form onSubmit={handlePromptSubmit} className="mt-4">
        <div className="flex items-center gap-1.5 rounded-xl bg-foreground/[0.04] p-1 transition-shadow focus-within:ring-2 focus-within:ring-ring/40 dark:bg-foreground/[0.06]">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Nhập chủ đề cần tạo đề..."
            aria-label="Nhập chủ đề cần tạo đề"
            className="min-w-0 flex-1 bg-transparent px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Tạo đề AI ngay"
            className="inline-flex h-7 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-lg bg-primary px-2.5 font-heading text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Zap className="h-3 w-3" />
            <span>Tạo</span>
          </button>
        </div>
      </form>

      <div className="mt-3 space-y-1.5">
        <p className="text-[11px] font-medium text-muted-foreground">
          Gợi ý nhanh:
        </p>
        <div className="flex flex-col gap-1.5">
          {ad.samplePrompts.slice(0, 2).map((sample) => {
            const sampleUrl = buildConversionUrl({
              path: "/quiz/create",
              placement: "blog_sticky_sidebar",
              campaign: ad.campaign,
              prompt: sample,
            });
            return (
              <a
                key={sample}
                href={sampleUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackConversionClick({
                    placement: "blog_sticky_sidebar",
                    campaign: ad.campaign,
                    targetUrl: sampleUrl,
                    label: `sample:${sample}`,
                  })
                }
                className="group flex items-center justify-between gap-2 rounded-lg bg-foreground/[0.04] px-2.5 py-1.5 text-[11px] font-medium text-foreground/85 transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <span className="truncate">{sample}</span>
                <ArrowRight className="h-3 w-3 shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
              </a>
            );
          })}
        </div>
      </div>

      <a
        href={primaryCtaUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackConversionClick({
            placement: "blog_sticky_sidebar",
            campaign: ad.campaign,
            targetUrl: primaryCtaUrl,
            label: ad.ctaLabel,
          })
        }
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 font-heading text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <span>{ad.ctaLabel}</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </section>
  );
}
