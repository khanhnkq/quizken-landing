import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * QuizKen wordmark. Icon mark is a rounded emerald speech-check glyph.
 * The "Ken" half is tinted primary, matching the brand treatment in the main app.
 */
export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2", className)}
      aria-label="QuizKen - Trang chủ"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_6px_16px_-6px_hsl(var(--primary)/0.7)]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 4.5h14a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 15.5H9.5l-4 3.2v-3.2H5A1.5 1.5 0 0 1 3.5 14V6A1.5 1.5 0 0 1 5 4.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="m8.6 9.2 2.1 2.1 4.2-4.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showText && (
        <span className="font-heading text-xl font-600 tracking-tight">
          Quiz<span className="text-primary">Ken</span>
        </span>
      )}
    </Link>
  );
}
