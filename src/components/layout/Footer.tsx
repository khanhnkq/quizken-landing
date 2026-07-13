import Link from "next/link";
import { Facebook, Youtube, Github, Mail } from "lucide-react";
import { SITE, appLink } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

const footerNav: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Sản phẩm",
    links: [
      { label: "Tạo Quiz AI", href: appLink("/"), external: true },
      { label: "English Hub", href: appLink("/english"), external: true },
      { label: "Đấu trường", href: appLink("/game/lobby"), external: true },
      { label: "Thư viện quiz", href: appLink("/quiz/library"), external: true },
    ],
  },
  {
    title: "Tài nguyên",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Số liệu", href: "/stats" },
      { label: "Tính năng", href: "/#features" },
      { label: "Cách hoạt động", href: "/#how-it-works" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/40">
      <Container className="py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Nền tảng tạo bài kiểm tra bằng AI và học tiếng Anh cho giáo viên,
              học sinh Việt Nam. Tiết kiệm thời gian, tăng hứng thú học tập.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={SITE.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href={SITE.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${SITE.email}`}
                aria-label="Email"
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {footerNav.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-600 uppercase tracking-wide text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {year} {SITE.name}. Bảo lưu mọi quyền.
          </p>
          <p>Làm tại Việt Nam với ❤️</p>
        </div>
      </Container>
    </footer>
  );
}
