"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, Sparkles, Zap } from "lucide-react";
import {
  buildConversionUrl,
  getContextualAd,
  trackConversionClick,
} from "@/lib/conversion";

type BlogCtaProps = {
  category?: string;
  tags?: string[];
};

export function BlogCta({ category, tags }: BlogCtaProps = {}) {
  const [prompt, setPrompt] = useState("");
  const ad = getContextualAd({ category, tags });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = prompt.trim();
    const targetUrl = buildConversionUrl({
      path: "/quiz/create",
      placement: "blog_inline_cta",
      campaign: ad.campaign,
      prompt: trimmed || undefined,
    });

    trackConversionClick({
      placement: "blog_inline_cta",
      campaign: ad.campaign,
      targetUrl,
      label: "blog_inline_prompt",
    });

    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <aside className="no-print my-12 rounded-2xl border border-primary/25 bg-card/90 p-6 shadow-none backdrop-blur-none sm:p-8">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>{ad.badge}</span>
          </span>

          <Link
            href="/cong-cu"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary sm:text-sm"
          >
            <Calculator className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span>38 Công cụ tính điểm &amp; ôn thi 0đ</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {ad.headline}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {ad.description}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2.5 sm:flex-row"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Nhập chủ đề hoặc môn học để AI tạo đề ngay..."
            aria-label="Nhập chủ đề hoặc môn học để AI tạo đề ngay"
            className="h-11 flex-1 rounded-xl border-0 bg-foreground/[0.04] px-4 text-sm text-foreground shadow-none placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring/40 dark:bg-foreground/[0.06]"
          />
          <button
            type="submit"
            className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 font-heading text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Zap className="h-4 w-4" />
            <span>Tạo Đề AI Ngay</span>
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Thử nhanh:
          </span>
          {ad.samplePrompts.map((sample) => {
            const sampleUrl = buildConversionUrl({
              path: "/quiz/create",
              placement: "blog_inline_cta",
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
                    placement: "blog_inline_cta",
                    campaign: ad.campaign,
                    targetUrl: sampleUrl,
                    label: `sample:${sample}`,
                  })
                }
                className="inline-flex items-center gap-1 rounded-lg bg-foreground/[0.05] px-2.5 py-1 text-xs font-medium text-foreground/85 transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <span>{sample}</span>
                <ArrowRight className="h-3 w-3 opacity-60" />
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
