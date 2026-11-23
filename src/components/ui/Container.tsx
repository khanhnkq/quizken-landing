import { type ClassValue } from "clsx";
import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { className?: ClassValue }) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4", className)} {...props}>
      {children}
    </div>
  );
}
