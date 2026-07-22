---
name: seo-blog-post-creator
description: Quy trình bắt buộc để nghiên cứu tin tức thực tế (web search), tạo và đăng bài viết chuẩn SEO On-Page/Technical cho dự án QuizKen EdTech. Sử dụng khi tạo bài viết SEO mới, lên bài cho blog QuizKen, hoặc viết nội dung marketing giáo dục.
---

# QuizKen SEO Blog Post Creator Skill

Quy trình chuẩn hóa 6 bước để nghiên cứu, thiết kế, tạo nội dung và xuất bản bài viết blog đạt chuẩn SEO đỉnh cao cho dự án QuizKen Landing Page (`src/content/blog/`).

---

## 🛑 NGUYÊN TẮC BẮT BUỘC KHÔNG ĐƯỢC BỎ QUA

> [!CAUTION]
> 1. **BẮT BUỘC Web Search trước khi viết:** KHÔNG ĐƯỢC tưởng tượng hoặc bịa đặt số liệu/văn bản pháp lý. Phải dùng tool `search_web` tìm kiếm thông tin mới nhất (Thông tư Bộ GD&ĐT, Kỳ thi THPT 2026, chương trình GDPT 2018, xu hướng EdTech/AI mới).
> 2. **BẮT BUỘC Kiểm tra chống trùng từ khóa:** Kiểm tra danh sách file `.md` hiện có trong `src/content/blog/` để đảm bảo từ khóa chính và slug KHÔNG bị trùng lặp.
> 3. **BẮT BUỘC Tạo ảnh Cover:** Luôn dùng `generate_image` hoặc kiểm tra file cover có sẵn trong `public/images/blog/` trước khi xuất bản.
> 4. **BẮT BUỘC Build Verify:** Phải chạy `npm run build` sau khi tạo file `.md` để đảm bảo Next.js SSG prerender thành công 100%.

---

## QUY TRÌNH THỰC HIỆN 6 BƯỚC

### 📍 BƯỚC 1: Nghiên Cứu Tin Tức & Dữ Liệu Nổi Bật (Web Search)
- Gọi tool `search_web` với từ khóa liên quan đến chủ đề bài viết.
- **Dữ liệu cần thu thập:**
  - Văn bản pháp lý, quy định mới của Bộ GD&ĐT (ví dụ: Thông tư 49/2026/TT-BGDĐT, quy định liêm chính học thuật, khung ứng dụng AI).
  - Ma trận đề thi THPT 2026 (Đúng/Sai 4 ý, Trả lời ngắn).
  - Cập nhật chứng chỉ Tiếng Anh (VSTEP B1-B2, IELTS, CEFR).
  - Xu hướng EdTech & AI trong giảng dạy (Flipped Classroom, Knowledge Gap Analysis, Spaced Repetition).
- Trích dẫn chính xác tên văn bản, số liệu và xu hướng trong nội dung bài viết để nâng cao độ uy tín (E-E-A-T).

---

### 📍 BƯỚC 2: Kiểm Tra Trùng Lặp (Anti-Cannibalization Check)
- Quét danh sách các bài viết đã có trong `src/content/blog/`.
- Đảm bảo từ khóa chính (Primary Keyword) và `slug` sắp tạo hoàn toàn mới, không gây hiện tượng "ăn thịt từ khóa" (Keyword Cannibalization).

---

### 📍 BƯỚC 3: Chuẩn Hóa SEO On-Page & Technical

Mỗi bài viết phải chứa khối **Frontmatter Markdown** chuẩn chỉnh:

```yaml
---
title: "[Tiêu đề chứa từ khóa chính, 55-65 ký tự, giật gân/thu hút]"
description: "[Mô tả chứa từ khóa chính + phụ, 140-160 ký tự, thúc đẩy click]"
date: YYYY-MM-DD
slug: [url-than-thien-seo-ngan-cach-bang-dau-gach-ngang]
category: huong-dan | tin-tuc | danh-gia | meo-hoc-tap | ai-giao-duc
cover: /images/blog/[slug_name].png
tags:
  - [từ khóa chính]
  - [từ khóa phụ 1]
  - [từ khóa phụ 2]
  - [từ khóa phụ 3]
author: QuizKen Team
---
```

#### Quy chuẩn cấu trúc nội dung bài viết:
1. **TL;DR (Tóm tắt nhanh):** Đặt trong khối Blockquote ngay sau Frontmatter.
2. **Thẻ Heading:** 
   - 1 thẻ `H1` duy nhất (chủ đề chính).
   - Phân tầng hợp lý `H2` ➔ `H3`.
3. **Mật độ từ khóa:** Từ khóa chính xuất hiện ở: Tiêu đề, H1, H2 đầu tiên, 100 từ đầu bài, 100 từ cuối bài và rải rác 1-2% toàn bài.
4. **Yếu tố trực quan (Visual Elements):**
   - Bắt buộc có ít nhất 1 **Bảng so sánh Markdown** hoặc 1 **Biểu đồ Mermaid** giải thích quy trình/nguyên lý.
5. **Call-To-Action (CTA):**
   - Đặt 2-3 liên kết/CTA tự nhiên trỏ về sản phẩm QuizKen (ví dụ: *Tạo đề thi AI QuizKen*, *Flashcard Spaced Repetition*, *QuizKen Analytics*, *Đấu trường Multiplayer*).

---

### 📍 BƯỚC 4: Tạo Hình Ảnh Cover Độc Quyền

- Sử dụng tool `generate_image` với prompt thiết kế 16:9 hiện đại, màu sắc mượt mà (Emerald / Teal / Dark Modern UI background).
- **Lưu file:** Copy ảnh đã tạo vào đường dẫn `/public/images/blog/[slug_name].png`.

---

### 📍 BƯỚC 5: Xuất Bản Bài Viết

- Dùng tool `write_to_file` để lưu bài viết vào `src/content/blog/[slug_name].md`.
- Dung lượng bài viết khuyến nghị từ **800 đến 1500 từ**.

---

### 📍 BƯỚC 6: Kiểm Tra Verification Build

- Chạy lệnh build:
  ```bash
  npm run build
  ```
- Xác nhận trang static prerender thành công (`/blog/[slug]`) mà không phát sinh lỗi TypeScript hay parse Frontmatter.

---

## CHECKLIST KIỂM TRA BÀI VIẾT TRƯỚC KHI HOÀN THÀNH

- [ ] Đã thực hiện `search_web` để lấy thông tin thực tế mới nhất chưa?
- [ ] Slug có trùng với bài viết nào trong `src/content/blog/` không?
- [ ] Frontmatter có đầy đủ: title, description, date, slug, category, cover, tags, author?
- [ ] Có khối TL;DR ở đầu bài không?
- [ ] Có bảng Markdown hoặc biểu đồ Mermaid không?
- [ ] Có 2-3 CTA trỏ về QuizKen không?
- [ ] Ảnh cover đã có trong `public/images/blog/` chưa?
- [ ] Lệnh `npm run build` đã báo `Compiled successfully` chưa?
