"use client";

import { useState } from "react";
import { Facebook, Linkedin, Link2, Check, Twitter } from "lucide-react";

type ShareButtonsProps = {
  url: string;
  title: string;
  description?: string;
};

export function ShareButtons({ url, title, description: _description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "X (Twitter)",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="mr-1.5 text-sm font-medium text-muted-foreground">Chia sẻ:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chia sẻ lên ${link.name}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border-0 shadow-none bg-foreground/[0.06] text-muted-foreground transition-colors hover:bg-foreground/[0.10] hover:text-foreground"
        >
          <link.icon className="h-4 w-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Sao chép liên kết"
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border-0 shadow-none bg-foreground/[0.06] text-muted-foreground transition-colors hover:bg-foreground/[0.10] hover:text-foreground cursor-pointer"
      >
        {copied ? (
          <Check className="h-4 w-4 text-primary" />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
