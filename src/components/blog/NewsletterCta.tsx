"use client";

import { useState } from "react";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";

/**
 * Newsletter signup banner for blog pages.
 * Stores subscriber emails in localStorage until a real email service is connected.
 * 
 * TODO: Connect to Brevo/Resend/EmailOctopus API endpoint.
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
      // TODO: Replace with real API call to email service
      // For now, store in localStorage as a proof of concept
      const existing = JSON.parse(localStorage.getItem("quizken_subscribers") || "[]");
      if (!existing.includes(email)) {
        existing.push(email);
        localStorage.setItem("quizken_subscribers", JSON.stringify(existing));
      }
      
      // Simulate a small delay
      await new Promise((r) => setTimeout(r, 500));

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
      <aside className="my-12 overflow-hidden rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-50/80 via-emerald-50/50 to-green-50/80 p-8 dark:from-green-950/20 dark:via-emerald-950/10 dark:to-green-950/20 sm:p-10">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500/15 text-green-600 dark:text-green-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-600 tracking-tight text-green-800 dark:text-green-300">
              Đăng ký thành công! 🎉
            </h3>
            <p className="mt-0.5 text-sm text-green-700/80 dark:text-green-400/80">
              Bạn sẽ nhận được tips học tập và đề mẫu miễn phí mỗi tuần.
            </p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="my-12 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-indigo-50/80 via-violet-50/50 to-indigo-50/80 p-8 dark:from-indigo-950/20 dark:via-violet-950/10 dark:to-indigo-950/20 sm:p-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        {/* Icon */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Mail className="h-7 w-7" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-heading text-xl font-600 tracking-tight">
            📬 Nhận tips học tập & đề mẫu miễn phí
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Mỗi tuần, QuizKen gửi bạn phương pháp ôn thi hiệu quả, mẹo học nhanh,
            và bộ đề trắc nghiệm mẫu hoàn toàn miễn phí. Hơn 1,000+ giáo viên & học sinh đã đăng ký!
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
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
                className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm transition-all placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {status === "error" && (
                <p className="mt-1.5 text-xs text-red-500">{errorMsg}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-600 text-primary-foreground transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-60"
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

          <p className="mt-3 text-xs text-muted-foreground/60">
            🔒 Không spam. Hủy đăng ký bất cứ lúc nào.
          </p>
        </div>
      </div>
    </aside>
  );
}
