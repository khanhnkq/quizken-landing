import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * QuizKen wordmark. Icon mark is the mascot-happy.png image.
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
      <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-primary/10 p-0.5">
        <Image
          src="/images/mascot-happy.png"
          alt="QuizKen Logo Icon"
          width={36}
          height={36}
          className="h-full w-full object-contain"
        />
      </div>
      {showText && (
        <span className="font-heading text-xl font-600 tracking-tight">
          Quiz<span className="text-primary">Ken</span>
        </span>
      )}
    </Link>
  );
}
