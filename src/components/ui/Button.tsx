import Link from "next/link";
import { type ClassValue } from "clsx";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-heading font-semibold rounded-xl border-0 shadow-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap cursor-pointer";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary:
    "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.10]",
  outline:
    "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.10]",
  ghost: "text-foreground hover:bg-foreground/[0.06]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-11 px-6 text-sm sm:text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: ClassValue;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps &
  ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">);

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    ...rest
  } = props as ButtonAsLink & ButtonAsButton;

  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const { href, ...anchorRest } = rest as ButtonAsLink;
    const external = /^(https?:|mailto:|tel:)/i.test(href);
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          {...(anchorRest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...(anchorRest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
