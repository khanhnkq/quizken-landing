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
        "inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
