import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE } from "@/lib/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { GoogleAnalytics, MicrosoftClarity } from "@/components/layout/Analytics";

const fredoka = localFont({
  src: "../../public/fonts/vn/DVN-Fredoka-Bold.ttf",
  variable: "--font-fredoka",
  display: "swap",
});

const roboto = localFont({
  src: [
    {
      path: "../../public/fonts/vn/Roboto-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/vn/Roboto-Light.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/vn/Roboto-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `Tạo Bài Kiểm Tra AI Miễn Phí | ${SITE.name}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.defaultDescription,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  keywords: [
    "tạo bài kiểm tra AI",
    "quiz generator",
    "tạo đề kiểm tra trắc nghiệm",
    "trắc nghiệm online",
    "AI giáo dục",
    "quiz maker miễn phí",
    "học tiếng Anh",
    "QuizKen",
  ],
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  alternates: {
    canonical: SITE.url,
    languages: {
      "vi-VN": SITE.url,
      "x-default": SITE.url,
    },
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} - Tạo Bài Kiểm Tra AI Miễn Phí`,
    description: SITE.defaultDescription,
    images: [
      {
        url: SITE.defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${SITE.name} - AI Quiz Generator`,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter,
    creator: SITE.twitter,
    title: `${SITE.name} - AI Quiz Generator`,
    description: "Tạo bài kiểm tra AI miễn phí trong vài giây",
    images: [SITE.defaultOgImage],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon.ico" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={SITE.language}
      suppressHydrationWarning
      className={`${fredoka.variable} ${roboto.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="QuizKen Blog RSS"
          href="/blog/rss.xml"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <GoogleAnalytics />
        <MicrosoftClarity />
      </body>
    </html>
  );
}
