---
title: "Quy Trình Dùng AI Tạo Đề Trắc Nghiệm Đúng/Sai 4 Ý Chuẩn Cấu Trúc Đề Thi Tốt Nghiệp THPT Mới"
description: "Hướng dẫn giáo viên từng bước ứng dụng AI để tạo câu hỏi trắc nghiệm Đúng/Sai 4 ý chuẩn cấu trúc định dạng GDPT 2018, bám sát quy chế tính điểm lũy tiến của Bộ GD&ĐT."
date: 2026-08-24
slug: quy-trinh-dung-ai-tao-de-trac-nghiem-dung-sai-4-y-gdpt-2018
category: huong-dan
cover: /images/blog/cover_dung_sai_4y_ai.jpg
tags:
  - trắc nghiệm đúng sai 4 ý
  - đề thi tốt nghiệp THPT 2026
  - AI tạo đề thi
  - GDPT 2018
  - quy tắc tính điểm
author: QuizKen Team
---

Cấu trúc đề thi tốt nghiệp THPT theo Chương trình Giáo dục Phổ thông 2018 (căn cứ theo **Quyết định số 764/QĐ-BGDĐT** của Bộ GD&ĐT) đã đưa dạng câu hỏi **Trắc nghiệm Đúng/Sai (Part II)** thành trọng tâm phân hóa năng lực thí sinh.

Khác với trắc nghiệm 4 lựa chọn truyền thống (xác suất đoán mò 25%), dạng thức Đúng/Sai gồm một đoạn dữ liệu/ngữ cảnh và 4 ý lệnh $a, b, c, d$. Việc biên soạn thủ công dạng bài này đòi hỏi công sức rất lớn để đảm bảo tính độc lập và logic giữa 4 ý. Dưới đây là quy trình chuẩn hóa giúp giáo viên tạo đề thi Đúng/Sai hoàn hảo chỉ trong vài giây bằng AI.

![Quy trình tạo đề thi trắc nghiệm Đúng/Sai 4 ý bằng AI](/images/blog/cover_dung_sai_4y_ai.jpg)

---

## 1. Cơ Chế Tính Điểm Lũy Tiến Dạng Câu Hỏi Đúng/Sai 4 Ý

Quy định chấm điểm của Bộ GD&ĐT đối với dạng câu hỏi này được thiết kế để triệt tiêu hoàn toàn hiện tượng khoanh bừa:

* **Đúng 1 ý trong 1 câu:** Đạt $0.1$ điểm.
* **Đúng 2 ý trong 1 câu:** Đạt $0.25$ điểm.
* **Đúng 3 ý trong 1 câu:** Đạt $0.5$ điểm.
* **Đúng cả 4 ý trong 1 câu:** Đạt trọn vẹn $1.0$ điểm.

$$\text{Xác suất đạt 1.0 điểm khi chọn ngẫu nhiên} = \left(\frac{1}{2}\right)^4 = \frac{1}{16} = 6.25\%$$

Điều này đòi hỏi các câu lệnh $a, b, c, d$ phải bao quát từ mức **Nhận biết - Thông hiểu** (ý a, b) đến **Vận dụng - Vận dụng cao** (ý c, d).

---

## 2. Tiêu Chuẩn Sư Phạm Khi Xây Dựng 4 Lệnh Hỏi

Để tạo ra một câu hỏi Đúng/Sai đạt chuẩn khảo thí, 4 ý lệnh cần tuân thủ ma trận sau:

| Ý Lệnh | Cấp Độ Bloom | Mục Đích Khảo Thí | Yêu Cầu Thiết Kế |
| :--- | :--- | :--- | :--- |
| **Ý (a)** | Nhận biết | Kiểm tra khả năng nhận diện khái niệm, định nghĩa gốc | Trích xuất trực tiếp từ dữ kiện đề bài |
| **Ý (b)** | Thông hiểu | Kiểm tra khả năng giải thích, so sánh, phân loại dữ liệu | Yêu cầu suy luận 1 bước từ bảng số liệu |
| **Ý (c)** | Vận dụng | Áp dụng công thức, quy luật vào bài toán cụ thể | Cần tính toán trung gian hoặc liên hệ thực tế |
| **Ý (d)** | Vận dụng cao | Đánh giá tổng hợp, phản biện, dự báo xu hướng | Đòi hỏi tư duy phản biện và tổng hợp đa chiều |

---

## 3. Quy Trình 3 Bước Dùng QuizKen Tạo Đề Đúng/Sai 4 Ý Tự Động

Với nền tảng [QuizKen](https://www.quizken.com), giáo viên không cần phải tự viết các chuỗi Prompt phức tạp:

### Bước 1: Nạp Ngữ Liệu / Bài Đọc
Dán đoạn văn bản khoa học, bài đọc hiểu tiếng Anh, hoặc tải lên file Word/PDF tài liệu ôn tập.

### Bước 2: Chọn Định Dạng "Trắc Nghiệm Đúng/Sai GDPT 2018"
Trong mục cài đặt cấu trúc đề, tích chọn định dạng **Đúng/Sai 4 ý**. Hệ thống sẽ tự động cấu hình bộ phân tích ngữ nghĩa theo đúng ma trận khảo thí 4 cấp độ.

### Bước 3: Kiểm Duyệt & Xuất Đề Thi Kèm Bảng Đáp Án
Chỉ sau 3 giây, AI sẽ trả về toàn bộ các câu hỏi kèm bảng phân tích logic chi tiết:
* Xác định rõ ý nào **Đúng (True)**, ý nào **Sai (False)**.
* Giải thích cặn kẽ tại sao sai và dẫn chứng đoạn trích chứng minh.

---

## 4. Mẫu Câu Hỏi Thực Tế Do QuizKen Tạo Ra

> **Đề bài:** Cho bảng số liệu về GDP và cơ cấu kinh tế của một quốc gia trong giai đoạn 2020 - 2025...
> * **a)** Tốc độ tăng trưởng GDP của quốc gia này liên tục dương qua các năm. $\rightarrow$ **[ĐÚNG]** *(Căn cứ cột tốc độ tăng trưởng).*
> * **b)** Ngành nông nghiệp luôn chiếm tỷ trọng cao nhất trong cơ cấu kinh tế. $\rightarrow$ **[SAI]** *(Ngành dịch vụ chiếm 52% năm 2025).*
> * **c)** Quy mô GDP năm 2025 tăng gấp 1.45 lần so với năm 2020. $\rightarrow$ **[ĐÚNG]** *(Tính toán: $450\text{ tỷ} / 310\text{ tỷ} \approx 1.45$).*
> * **d)** Xu hướng chuyển dịch kinh tế của quốc gia này đang đi ngược lại quá trình công nghiệp hóa. $\rightarrow$ **[SAI]** *(Tỷ trọng công nghiệp và dịch vụ tăng cho thấy xu hướng đúng hướng).*

---

## 5. Kết Luận

Nắm vững quy trình tạo đề trắc nghiệm Đúng/Sai 4 ý bằng AI giúp giáo viên tiết kiệm 90% thời gian biên soạn, đồng thời trang bị cho học sinh ngân hàng đề thi bám sát 100% cấu trúc thi tốt nghiệp THPT mới. Bắt đầu biên soạn đề ngay tại [Trang Tạo Đề QuizKen](https://www.quizken.com)!
