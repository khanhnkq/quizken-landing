import { type ClassValue } from "clsx";
import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { className?: ClassValue }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </div>
  );
}
