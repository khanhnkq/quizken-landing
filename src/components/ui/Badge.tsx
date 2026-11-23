import { type ClassValue } from "clsx";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { className?: ClassValue }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border-0 shadow-none bg-foreground/[0.06] px-2.5 py-1 text-xs font-semibold text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
