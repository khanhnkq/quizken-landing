"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Shuffle,
  Sparkles,
  Upload,
} from "lucide-react";
import {
  parseDocxArrayBuffer,
  parseQuizRawText,
} from "@/lib/docxQuizParser";
import {
  buildMasterAnswerKey,
  generateExamCodesList,
  generateMultiCodeExamBundle,
} from "@/lib/docxExamExporter";
import { getQuestionType } from "@/lib/teacherQuizTypes";
import { appLink } from "@/lib/site";

const SAMPLE_RAW_EXAM = `PHẦN I. Câu trắc nghiệm nhiều lựa chọn
Câu 1: Hàm số nào sau đây đồng biến trên R?
A. y = x^3 - 3x
*B. y = x^3 + x
C. y = -x^2 + 1
D. y = (x - 1)/(x + 1)

Câu 2: Đạo hàm của hàm số y = e^(2x) là:
*A. y' = 2e^(2x)
B. y' = e^(2x)
C. y' = 2x.e^(2x-1)
D. y' = e^(2x)/2

PHẦN II. Câu trắc nghiệm đúng sai
Câu 3: Cho hàm số y = f(x) = x^3 - 3x^2 + 2. Xét tính đúng sai của các mệnh đề sau:
a) Đạo hàm của hàm số là f'(x) = 3x^2 - 6x. (Đ)
b) Hàm số đạt cực đại tại x = 2. (S)
c) Giá trị cực đại của hàm số bằng 2. (Đ)
d) Đồ thị hàm số cắt trục tung tại điểm (0; -2). (S)

PHẦN III. Câu trắc nghiệm trả lời ngắn
Câu 4: Tính diện tích hình phẳng giới hạn bởi y = x^2 và y = x trên đoạn [0; 1] (làm tròn 2 chữ số thập phân hoặc điền giá trị khi nhân với 6).
Đáp án: 1`;

export function DocxExamSuiteTool() {
  const [rawText, setRawText] = useState(SAMPLE_RAW_EXAM);
  const [schoolName, setSchoolName] = useState("TRƯỜNG THPT QUIZKEN");
  const [examTitle, setExamTitle] = useState("ĐỀ KIỂM TRA ĐỊNH KỲ NĂM 2027");
  const [subject, setSubject] = useState("Toán học");
  const [durationMinutes, setDurationMinutes] = useState(50);
  const [codeCount, setCodeCount] = useState(4);
  const [startCode, setStartCode] = useState(101);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);

  const parsed = useMemo(() => parseQuizRawText(rawText), [rawText]);

  const examCodes = useMemo(
    () => generateExamCodesList(startCode, codeCount),
    [startCode, codeCount],
  );

  const masterKey = useMemo(
    () =>
      buildMasterAnswerKey(
        {
          title: examTitle,
          questions: parsed.questions,
        },
        {
          examCodes,
          shuffleQuestions,
          shuffleOptions,
          schoolName,
          examTitle,
          subject,
          durationMinutes,
        },
      ),
    [
      examTitle,
      parsed.questions,
      examCodes,
      shuffleQuestions,
      shuffleOptions,
      schoolName,
      subject,
      durationMinutes,
    ],
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    if (file.name.toLowerCase().endsWith(".docx")) {
      const buf = await file.arrayBuffer();
      const res = await parseDocxArrayBuffer(buf);
      if (res.questions.length > 0) {
        const reconstructed = res.questions
          .map((q, idx) => {
            const qType = getQuestionType(q);
            if (qType === "true_false_group") {
              const subs = (q.subItems ?? [])
                .map(
                  (s, sIdx) =>
                    `${s.label ?? String.fromCharCode(97 + sIdx)}) ${s.text} (${s.isCorrect ? "Đ" : "S"})`,
                )
                .join("\n");
              return `Câu ${idx + 1}: ${q.question}\n${subs}`;
            }
            if (qType === "short_answer") {
              return `Câu ${idx + 1}: ${q.question}\nĐáp án: ${q.acceptedAnswers?.[0] ?? ""}`;
            }
            const opts = q.options
              .map(
                (opt, oIdx) =>
                  `${oIdx === q.correctAnswer ? "*" : ""}${String.fromCharCode(65 + oIdx)}. ${opt}`,
              )
              .join("\n");
            return `Câu ${idx + 1}: ${q.question}\n${opts}`;
          })
          .join("\n\n");
        setRawText(reconstructed);
      }
    } else {
      const txt = await file.text();
      setRawText(txt);
    }
  };

  const handleDownloadZip = async () => {
    if (parsed.questions.length === 0) return;
    try {
      setIsGeneratingZip(true);
      const blob = await generateMultiCodeExamBundle(
        {
          title: examTitle,
          questions: parsed.questions,
        },
        {
          examCodes,
          shuffleQuestions,
          shuffleOptions,
          schoolName,
          examTitle,
          subject,
          durationMinutes,
        },
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Bo_De_Tron_${examCodes.length}_Ma_De_${subject.replace(/\s+/g, "_")}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Upload Word .docx or Paste Exam Text */}
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-3 rounded-2xl border border-border/70 bg-card/90 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-heading text-base font-bold text-foreground">
                1. Tải file Word (.docx) hoặc dán nội dung đề gốc
              </h3>
              <p className="text-xs text-muted-foreground">
                Hỗ trợ tự nhận diện cả 3 phần chuẩn GDPT 2018: Phần I (đánh dấu * hoặc in đậm/gạch chân đáp án đúng), Phần II (Đúng/Sai 4 ý a-b-c-d), Phần III (Đáp án: ...).
              </p>
            </div>
            <label className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary hover:bg-primary/20 cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>
                {uploadedFileName ? uploadedFileName : "Chọn file .docx / .txt"}
              </span>
              <input
                type="file"
                accept=".docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
          <textarea
            rows={12}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="w-full rounded-xl border border-border bg-background p-3 font-mono text-xs leading-relaxed text-foreground"
            placeholder="Dán nội dung đề thi hoặc tải file .docx lên..."
          />
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Đã nhận diện: {parsed.questions.length} câu hỏi hợp lệ
            </span>
            <button
              type="button"
              onClick={() => {
                setRawText(SAMPLE_RAW_EXAM);
                setUploadedFileName(null);
              }}
              className="text-primary underline hover:opacity-80 cursor-pointer"
            >
              Khôi phục đề mẫu 3 phần
            </button>
          </div>
        </div>

        {/* Step 2: Configure Exam Codes & Header */}
        <div className="space-y-4 rounded-2xl border border-border/70 bg-card/90 p-5">
          <h3 className="font-heading text-base font-bold text-foreground">
            2. Cấu hình Tiêu đề & Số lượng Mã đề (.docx ZIP)
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-xs font-medium text-muted-foreground sm:col-span-2">
              <span>Tên trường / Đơn vị</span>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
            <label className="space-y-1 text-xs font-medium text-muted-foreground sm:col-span-2">
              <span>Tiêu đề kỳ thi</span>
              <input
                type="text"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
            <label className="space-y-1 text-xs font-medium text-muted-foreground">
              <span>Môn thi</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
            <label className="space-y-1 text-xs font-medium text-muted-foreground">
              <span>Thời gian (phút)</span>
              <input
                type="number"
                min={15}
                max={180}
                value={durationMinutes}
                onChange={(e) =>
                  setDurationMinutes(Math.max(15, Number(e.target.value) || 45))
                }
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
            <label className="space-y-1 text-xs font-medium text-muted-foreground">
              <span>Số lượng mã đề (1–24)</span>
              <select
                value={codeCount}
                onChange={(e) => setCodeCount(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value={4}>4 mã đề chuẩn (101–104)</option>
                <option value={6}>6 mã đề (101–106)</option>
                <option value={8}>8 mã đề (101–108)</option>
                <option value={12}>12 mã đề (101–112)</option>
                <option value={24}>24 mã đề phòng thi lớn</option>
              </select>
            </label>
            <label className="space-y-1 text-xs font-medium text-muted-foreground">
              <span>Mã đề bắt đầu</span>
              <input
                type="number"
                min={100}
                max={900}
                value={startCode}
                onChange={(e) =>
                  setStartCode(Math.max(1, Number(e.target.value) || 101))
                }
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-4 pt-1 text-xs font-medium text-foreground">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={shuffleQuestions}
                onChange={(e) => setShuffleQuestions(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Trộn thứ tự câu trong từng phần (I, II, III)
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={shuffleOptions}
                onChange={(e) => setShuffleOptions(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Đảo vị trí đáp án A / B / C / D
            </label>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isGeneratingZip || parsed.questions.length === 0}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 disabled:opacity-50 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              {isGeneratingZip
                ? "Đang đóng gói bộ đề Word (.zip)..."
                : `Tải ${examCodes.length} Mã đề Word (.docx) + Bảng đáp án (.zip)`}
            </button>
            <a
              href={appLink("/quiz/create")}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs font-semibold text-primary hover:bg-primary/15 sm:text-sm"
            >
              <Sparkles className="h-4 w-4" />
              Mở Phòng Thi ThửOnline / Đấu Trường Live trên QuizKen App
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Step 3: Live Master Answer Key Preview across Exam Codes */}
      <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card/90 p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shuffle className="h-4 w-4 text-primary" />
            <h4 className="font-heading text-sm font-bold text-foreground">
              Bảng Đáp Án Tổng Hợp ({examCodes.length} Mã đề:{" "}
              {examCodes.slice(0, 6).join(", ")}
              {examCodes.length > 6 ? "..." : ""})
            </h4>
          </div>
          <span className="text-xs text-muted-foreground">
            Tự động đính kèm file Word `Bang_Dap_An_Tong_Hop.docx` và Excel `Bang_Dap_An_Tong_Hop.csv` trong gói `.zip`
          </span>
        </div>
        <table className="w-full min-w-[520px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-foreground">
              <th className="p-2.5 font-semibold">Câu</th>
              {masterKey.versions.slice(0, 8).map((v) => (
                <th key={v.examCode} className="p-2.5 text-center font-semibold">
                  Mã {v.examCode}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {parsed.questions.map((_, qIdx) => (
              <tr key={qIdx}>
                <td className="p-2.5 font-semibold text-foreground">
                  Câu {qIdx + 1}
                </td>
                {masterKey.versions.slice(0, 8).map((v) => (
                  <td
                    key={v.examCode}
                    className="p-2.5 text-center font-mono font-semibold text-primary"
                  >
                    {v.answerEntries[qIdx]?.answerCode ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
