"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import { NAV_LINKS, appLink } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/85 backdrop-blur-xl shadow-sm"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-18 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1.5 lg:flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-heading font-bold text-foreground/80 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Button
            href={appLink("/")}
            size="md"
            className="hidden sm:inline-flex rounded-full px-6 font-heading font-extrabold shadow-md hover:shadow-lg border-2 border-white/20"
          >
            <Zap className="h-4 w-4 mr-1.5 fill-current" />
            Tạo Quiz Ngay
          </Button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-lg lg:hidden">
          <Container className="flex flex-col gap-2 py-4">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-heading font-bold text-foreground/90 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              >
                {item.label}
              </Link>
            ))}
            <Button
              href={appLink("/")}
              size="md"
              className="mt-2 w-full rounded-2xl font-heading font-bold"
              onClick={() => setOpen(false)}
            >
              <Zap className="h-4 w-4 mr-1.5 fill-current" />
              Tạo Quiz Ngay
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
