Kế hoạch Landing Page QuizKen (Next.js + Decap CMS)
Bối cảnh & quyết định
Stack: Next.js 16 (App Router, SSG) + Tailwind v4 + Decap CMS
CMS: Decap (git-based, viết bài qua UI → commit .md vào repo → auto deploy)
Blog: Migrate 5 bài HTML tĩnh cũ sang markdown (giữ slug để giữ SEO)
Domain: Dùng env NEXT_PUBLIC_SITE_URL (placeholder https://www.quizken.com, bạn đổi sau), landing riêng biệt với app React cũ
Design Read (theo design-taste-frontend)
"Reading this as: consumer EdTech landing cho giáo viên & học sinh Việt Nam, ngôn ngữ Playful/Gamification khớp brand QuizKen (Fredoka/Ubuntu, emerald + pastel), dùng Tailwind v4 + Framer Motion nhẹ."

Dials: VARIANCE 7 · MOTION 6 · DENSITY 4 Brand: emerald hsl(142 71% 45%) (primary) + pastel accents (pink/amber/sky/violet/rose) tái dùng từ Features cũ. Font Fredoka (heading) + Ubuntu (body) — self-host. Light/dark mode.

Cấu trúc thư mục

text
landing/src/
├── app/
│   ├── layout.tsx              # root: fonts, metadataBase, Navbar+Footer
│   ├── page.tsx                # trang chủ marketing (a+b+d)
│   ├── globals.css             # theme tokens, brand colors, Fredoka/Ubuntu
│   ├── sitemap.ts              # auto (trang + blog posts)
│   ├── robots.ts
│   ├── faq/page.tsx            # trang FAQ riêng (SEO long-tail)
│   └── blog/
│       ├── page.tsx            # list bài (card grid)
│       └── [slug]/page.tsx     # chi tiết (SSG, Article+Breadcrumb JSON-LD)
├── components/
│   ├── layout/   Navbar.tsx, Footer.tsx
│   ├── home/     Hero, LogoWall, Features(bento), HowItWorks, Benefits, Gamification, Testimonials, FaqSection, FinalCta
│   ├── blog/     ArticleCard, MarkdownRenderer, TableOfContents
│   └── ui/       Button, Badge, Container
├── lib/
│   ├── site.ts                 # config: SITE_NAME, SITE_URL (env), nav links
│   ├── seo.ts                  # generateMetadata helper, JSON-LD generators
│   ├── blog.ts                 # gray-matter read posts, getAllPosts, getPost
│   └── content/  faq.ts, features.ts, testimonials.ts, blog-seed.ts
├── content/blog/               # 5 file .md migrated (frontmatter + body)
public/
├── admin/        index.html + config.yml  (Decap CMS)
├── images/       screenshots (từ README), og-default.jpg, logo.svg mới
└── favicon/      copy từ quizken
A. Nội dung Marketing (phần a)
Trang chủ gồm các section (mỗi section 1 layout family khác nhau — tránh lặp):

Hero (split, không center): badge "Được tạo bởi AI", headline 4-phrase "Tạo Bài Kiểm Tra với AI" (giữ underline SVG cong của brand), subtitle VI, 2 CTA ("Tạo Bài Kiểm Tra Ngay" → app cũ, "Khám phá tính năng" → anchor). Ảnh screenshot Homepage bên phải.
LogoWall / trust strip: "Được tin dùng bởi giáo viên & học sinh tại..." + 3-4 con số (mock, có nhãn).
Features (bento 6 ô, không 3-cột đều): AI Quiz Gen, English Hub, Gamification, Multiplayer, My Notebook, Analytics — pastel gradient, icon lucide, copy VI lấy từ i18n cũ.
How It Works (3 bước ngang): Nhập chủ đề → AI tạo quiz → Làm & chấm điểm + xuất PDF.
Benefits (2 cột: Cho Giáo viên / Cho Học sinh).
Gamification showcase (full-width, nổi bật): XP/Streak/Leaderboard + ảnh dashboard.
Testimonials (d): 3 quote ngắn (≤3 dòng) + tên/role thực locale VN, số liệu "10.000+ quiz đã tạo".
FAQ section (b): accordion 8 câu, FAQPage JSON-LD.
Final CTA: "Bắt đầu tạo bài kiểm tra miễn phí".
B. FAQ SEO (phần b)
Section accordion trên trang chủ + trang riêng /faq mở rộng (15+ câu) nhắm long-tail keyword VI: "cách tạo đề kiểm tra trắc nghiệm bằng AI miễn phí", "quiz generator tiếng Việt", "công cụ tạo quiz cho giáo viên"...
JSON-LD FAQPage → tranh featured snippet Google.
C. Blog + Decap CMS (phần c)
Content layer: gray-matter + remark-gfm/react-markdown render markdown từ src/content/blog/*.md. Frontmatter: title, description, date, updated, slug, tags, cover, author.
Migrate 5 bài cũ: đọc từng public/blog/{slug}/index.html, bóc nội dung → .md giữ nguyên slug + thêm frontmatter + ngày. Không mất SEO cũ.
Trang /blog: card grid responsive, filter tag (sẵn sàng mở rộng), pagination.
Trang /blog/[slug]: SSG generateStaticParams, Article + BreadcrumbList JSON-LD, TOC tự sinh, reading time, bài liên quan.
Decap CMS (/admin): config.yml collection blog → folder src/content/blog, backend git-gateway (Netlify Identity) + local_backend cho dev. Editor đăng nhập, viết WYSIWYG, save → PR/commit → deploy tự rebuild.
D. Testimonials (phần d)
Đã gộp ở section 7 + bo số liệu trust. Tên/quote thực locale Việt Nam, không "John Doe".

SEO kỹ thuật
metadataBase từ env, generateMetadata mỗi trang (title … | QuizKen, description, canonical, OG đầy đủ, Twitter card).
JSON-LD: Organization, SoftwareApplication, FAQPage, Article, BreadcrumbList, WebPage.
sitemap.ts auto, robots.ts.
OG image mặc định + per-post cover. lang="vi".
Core Web Vitals: SSG prerender, ảnh qua next/image (LCP < 1s), font self-host display:swap.
Design guardrails (tuân thủ skill)
Không em-dash, không AI-purple, không centered hero, không 3-card đều (dùng bento), 1 accent (emerald) + pastel hỗ trợ, eyebrow tối đa 1/3 section, hero khít viewport (headline ≤2 dòng, subtext ≤20 từ), CTA 1 dòng, honor prefers-reduced-motion, dark mode song song.

Thư viện cần thêm
gray-matter, react-markdown, remark-gfm, rehype-slug, framer-motion, lucide-react (đã có sẵn lucide trong thói quen codebase gốc; cho landing tách riêng).

Thứ tự thực hiện
Foundation: globals.css (brand tokens + font), layout.tsx, lib/site.ts, lib/seo.ts, copy favicon/logo/og.
UI primitives: Button, Badge, Container, Navbar, Footer.
Trang chủ sections (Hero → FinalCTA).
FAQ section + trang /faq.
Blog: lib/blog.ts, migrate 5 bài, /blog, /blog/[slug].
Decap CMS public/admin.
sitemap.ts, robots.ts, metadata từng trang.
Build verify (npm run build) + sửa lỗi.
Lưu ý cho bạn
Tôi sẽ giả lập ảnh bằng screenshot URL từ README (github user-attachments) + next/image. Nếu muốn ảnh riêng, bạn cung cấp sau.
Domain mới: tôi set default env NEXT_PUBLIC_SITE_URL=https://www.quizken.com. Khi có domain thật, đổi 1 chỗ trong .env.local.
"Tạo Bài Kiểm Tra" CTA trỏ sang app QuizKen cũ (app.quizken.com) — bạn cho URL app chính xác để tôi link đúng.
Xác nhận để tôi bắt đầu build theo đúng kế hoạch trên.