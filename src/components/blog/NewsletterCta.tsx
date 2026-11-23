"use client";

import { useState } from "react";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";

/**
 * Newsletter signup banner for blog pages.
 * Integrates with Supabase Edge Function to store subscribers.
 */
export function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Vui lòng nhập email hợp lệ");
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.warn("Supabase credentials missing, falling back to mock");
        // Fallback for development if env vars are missing
        await new Promise((r) => setTimeout(r, 500));
      } else {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/subscribe-newsletter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email, source: "landing_blog" }),
        });

        if (!response.ok) {
          throw new Error("Failed to subscribe");
        }
      }

      setStatus("success");
      setEmail("");

      // Track event if GA4 is available
      if (typeof window !== "undefined") {
        const w = window as unknown as { gtag?: (...args: unknown[]) => void };
        if (typeof w.gtag === "function") {
          w.gtag("event", "newsletter_signup", {
            event_category: "engagement",
            event_label: "blog_newsletter",
          });
        }
      }
    } catch {
      setErrorMsg("Có lỗi xảy ra, vui lòng thử lại");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <aside className="my-12 rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-0 shadow-none bg-primary/15 text-primary">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold tracking-tight text-foreground">
              Đăng ký thành công!
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Bạn sẽ nhận được tips học tập và đề mẫu miễn phí mỗi tuần.
            </p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="my-12 rounded-2xl bg-card/85 border border-border/70 shadow-none backdrop-blur-none p-6 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        {/* Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-0 shadow-none bg-foreground/[0.06] text-primary">
          <Mail className="h-6 w-6" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
            Nhận tips học tập &amp; đề mẫu miễn phí
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Mỗi tuần, QuizKen gửi bạn phương pháp ôn thi hiệu quả, mẹo học nhanh,
            và bộ đề trắc nghiệm mẫu hoàn toàn miễn phí. Hơn 1,000+ giáo viên &amp; học sinh đã đăng ký!
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="Nhập email của bạn..."
                required
                className="w-full h-10 rounded-xl border-0 shadow-none bg-foreground/[0.04] px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition-colors"
              />
              {status === "error" && (
                <p className="mt-1.5 text-xs text-destructive">{errorMsg}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border-0 shadow-none bg-primary px-5 text-sm font-heading font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60 cursor-pointer"
            >
              {status === "loading" ? (
                "Đang gửi..."
              ) : (
                <>
                  Đăng ký miễn phí
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-3 text-xs text-muted-foreground">
            Không spam. Hủy đăng ký bất cứ lúc nào.
          </p>
        </div>
      </div>
    </aside>
  );
}
