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
        "sticky top-0 z-50 w-full transition-colors duration-200 bg-card/80 backdrop-blur-xl border-b shadow-none",
        scrolled ? "border-border/70" : "border-border/50",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Điều hướng chính">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="h-10 inline-flex items-center whitespace-nowrap rounded-xl px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            href={appLink("/")}
            size="md"
            className="hidden sm:inline-flex h-10 rounded-xl px-4 font-heading font-bold border-0 shadow-none"
          >
            <Zap className="h-4 w-4 fill-current" />
            Tạo Quiz Ngay
          </Button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-border/70 bg-foreground/[0.04] hover:bg-foreground/[0.08] text-foreground shadow-none transition-colors lg:hidden cursor-pointer"
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
        <div className="bg-card/95 backdrop-blur-xl border-b border-border/70 lg:hidden">
          <Container className="flex flex-col gap-1.5 py-4">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between h-10 rounded-xl px-3.5 text-sm font-semibold text-foreground hover:bg-foreground/[0.06] transition-colors"
              >
                <span>{item.label}</span>
              </Link>
            ))}
            <Button
              href={appLink("/")}
              size="md"
              className="mt-2 w-full h-10 rounded-xl font-heading font-bold border-0 shadow-none"
              onClick={() => setOpen(false)}
            >
              <Zap className="h-4 w-4 fill-current" />
              Tạo Quiz Ngay
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
