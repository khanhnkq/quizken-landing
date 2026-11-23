"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Download,
  FileSpreadsheet,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  buildAiPromptFromMatrix,
  buildExamMatrix7991,
  COGNITIVE_LEVEL_LABELS,
  exportMatrix7991ToDocx,
  type MatrixPresetId,
  type MatrixTopicInput,
} from "@/lib/examMatrix7991";
import { appLink } from "@/lib/site";

const DEFAULT_TOPICS: MatrixTopicInput[] = [
  { id: "t1", name: "Chuyên đề 1: Hàm số & Đạo hàm", weight: 40 },
  { id: "t2", name: "Chuyên đề 2: Nguyên hàm & Tích phân", weight: 35 },
  { id: "t3", name: "Chuyên đề 3: Hình học không gian Oxyz", weight: 25 },
];

export function ExamMatrix7991Tool() {
  const [schoolName, setSchoolName] = useState("TRƯỜNG THPT CHUYÊN QUIZKEN");
  const [examTitle, setExamTitle] = useState("ĐỀ KIỂM TRA ĐỊNH KỲ HỌC KỲ I");
  const [subject, setSubject] = useState("Toán học");
  const [grade, setGrade] = useState("Lớp 12");
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [preset, setPreset] = useState<MatrixPresetId>("dinh_ky_70_30");
  const [topics, setTopics] = useState<MatrixTopicInput[]>(DEFAULT_TOPICS);
  const [isExporting, setIsExporting] = useState(false);

  const matrix = useMemo(
    () =>
      buildExamMatrix7991({
        subject,
        grade,
        examTitle,
        schoolName,
        durationMinutes,
        preset,
        topics:
          topics.length > 0
            ? topics
            : [{ id: "fallback", name: "Chuyên đề trọng tâm", weight: 100 }],
      }),
    [subject, grade, examTitle, schoolName, durationMinutes, preset, topics],
  );

  const aiPrompt = useMemo(() => buildAiPromptFromMatrix(matrix), [matrix]);

  const handleAddTopic = () => {
    setTopics((prev) => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        name: `Chuyên đề ${prev.length + 1}`,
        weight: 20,
      },
    ]);
  };

  const handleRemoveTopic = (index: number) => {
    if (topics.length <= 1) return;
    setTopics((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateTopic = (
    index: number,
    patch: Partial<MatrixTopicInput>,
  ) => {
    setTopics((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item)),
    );
  };

  const handleExportDocx = async () => {
    try {
      setIsExporting(true);
      const blob = await exportMatrix7991ToDocx(matrix);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Ma_Tran_Dac_Ta_7991_${subject.replace(/\s+/g, "_")}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const createInAppHref = `${appLink("/quiz/create")}?prompt=${encodeURIComponent(aiPrompt)}`;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-2xl border border-border/70 bg-card/90 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
          <span>Trường / Đơn vị</span>
          <input
            type="text"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </label>
        <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
          <span>Tên kỳ kiểm tra</span>
          <input
            type="text"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </label>
        <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
          <span>Cấu trúc chuẩn Bộ GD&ĐT</span>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value as MatrixPresetId)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="dinh_ky_70_30">
              Công văn 7991 (70% Trắc nghiệm 3 phần + 30% Tự luận)
            </option>
            <option value="thpt_2027_3_phan">
              THPT 2027 (100% Trắc nghiệm 3 phần: ABCD + Đúng/Sai + Trả lời ngắn)
            </option>
          </select>
        </label>
        <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
          <span>Môn học</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </label>
        <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
          <span>Khối lớp</span>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </label>
        <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
          <span>Thời gian làm bài (phút)</span>
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
      </div>

      {/* Topics Editor */}
      <div className="space-y-3 rounded-2xl border border-border/70 bg-card/90 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">
              Danh sách Chương / Chủ đề & Trọng số (%)
            </h3>
            <p className="text-xs text-muted-foreground">
              Hệ thống tự động chuẩn hóa tỷ lệ điểm và phân bổ số câu hỏi theo 4 mức độ nhận thức (Biết 40% – Hiểu 30% – Vận dụng 20% – Vận dụng cao 10%).
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddTopic}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary hover:bg-primary/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Thêm chủ đề
          </button>
        </div>

        <div className="space-y-2.5">
          {topics.map((topic, idx) => (
            <div
              key={topic.id ?? idx}
              className="grid gap-2.5 sm:grid-cols-[1fr_130px_44px]"
            >
              <input
                type="text"
                value={topic.name}
                onChange={(e) =>
                  handleUpdateTopic(idx, { name: e.target.value })
                }
                placeholder={`Tên chương / chủ đề ${idx + 1}`}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
              <div className="flex items-center rounded-xl border border-border bg-background px-3 py-2">
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={topic.weight}
                  onChange={(e) =>
                    handleUpdateTopic(idx, {
                      weight: Math.max(1, Number(e.target.value) || 10),
                    })
                  }
                  className="w-full bg-transparent text-sm font-semibold text-foreground outline-none"
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
              <button
                type="button"
                disabled={topics.length <= 1}
                onClick={() => handleRemoveTopic(idx)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 text-muted-foreground hover:text-red-500 disabled:opacity-40 cursor-pointer"
                title="Xóa chủ đề"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Bar: Export Word .docx + Direct Navigation to QuizKen App */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/25 bg-primary/[0.06] p-4 sm:p-5">
        <div className="space-y-0.5">
          <p className="font-heading text-sm font-bold text-foreground">
            Tổng kết Ma trận: {matrix.totals.totalQuestions} câu •{" "}
            {matrix.totals.totalPoints.toFixed(2)} điểm ({matrix.meta.presetLabel})
          </p>
          <p className="text-xs text-muted-foreground">
            Tải file Word (.docx) đính kèm hồ sơ chuyên môn tổ bộ môn hoặc chuyển thẳng sang QuizKen App để AI sinh đề theo đúng ma trận này.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportDocx}
            disabled={isExporting}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground shadow-xs hover:bg-muted/70 cursor-pointer sm:text-sm"
          >
            <Download className="h-4 w-4 text-primary" />
            {isExporting
              ? "Đang xuất file .docx..."
              : "Tải Ma trận & Đặc tả (.docx)"}
          </button>
          <a
            href={createInAppHref}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-95 sm:text-sm"
          >
            <Sparkles className="h-4 w-4" />
            Sinh đề AI đúng Ma trận này trên App
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Live Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card/90 p-4">
        <div className="mb-3 flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-primary" />
          <h4 className="font-heading text-sm font-bold text-foreground">
            Bảng 1: Khung Ma trận Đề kiểm tra ({matrix.meta.subject} —{" "}
            {matrix.meta.grade})
          </h4>
        </div>
        <table className="w-full min-w-[680px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-foreground">
              <th className="p-2.5 font-semibold">TT</th>
              <th className="p-2.5 font-semibold">Chương / Chủ đề</th>
              <th className="p-2.5 text-center font-semibold">Phần I (ABCD)</th>
              <th className="p-2.5 text-center font-semibold">
                Phần II (Đúng/Sai)
              </th>
              <th className="p-2.5 text-center font-semibold">
                Phần III (Trả lời ngắn)
              </th>
              <th className="p-2.5 text-center font-semibold">Tự luận</th>
              <th className="p-2.5 text-center font-semibold">Tổng câu</th>
              <th className="p-2.5 text-right font-semibold">Điểm (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {matrix.rows.map((row) => {
              const sumCounts = (c: {
                nb: number;
                th: number;
                vd: number;
                vdc: number;
              }) => c.nb + c.th + c.vd + c.vdc;
              return (
                <tr key={row.id}>
                  <td className="p-2.5 font-medium">{row.stt}</td>
                  <td className="p-2.5 font-medium text-foreground">
                    {row.name}
                  </td>
                  <td className="p-2.5 text-center">{sumCounts(row.part1)}</td>
                  <td className="p-2.5 text-center">{sumCounts(row.part2)}</td>
                  <td className="p-2.5 text-center">{sumCounts(row.part3)}</td>
                  <td className="p-2.5 text-center">{sumCounts(row.essay)}</td>
                  <td className="p-2.5 text-center font-semibold">
                    {row.totalQuestions}
                  </td>
                  <td className="p-2.5 text-right font-semibold text-primary">
                    {row.totalPoints.toFixed(2)}đ ({row.percentage}%)
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Specification Table */}
      <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card/90 p-4">
        <h4 className="mb-3 font-heading text-sm font-bold text-foreground">
          Bảng 2: Bản Đặc tả Yêu cầu cần đạt theo 4 mức độ nhận thức (
          {Object.values(COGNITIVE_LEVEL_LABELS).join(" • ")})
        </h4>
        <table className="w-full min-w-[680px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-foreground">
              <th className="p-2.5 font-semibold">Chủ đề</th>
              <th className="p-2.5 font-semibold">Mức độ</th>
              <th className="p-2.5 font-semibold">Yêu cầu cần đạt</th>
              <th className="p-2.5 font-semibold">Dạng thức</th>
              <th className="p-2.5 text-right font-semibold">Số câu / Điểm</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {matrix.specifications.map((spec, idx) => (
              <tr key={`${spec.stt}-${spec.level}-${idx}`}>
                <td className="p-2.5 font-medium text-foreground">
                  {spec.topicName}
                </td>
                <td className="p-2.5">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                    {spec.levelLabel}
                  </span>
                </td>
                <td className="p-2.5 text-muted-foreground">
                  {spec.requirement}
                </td>
                <td className="p-2.5">{spec.partLabel}</td>
                <td className="p-2.5 text-right font-semibold">
                  {spec.questionCount} câu ({spec.points.toFixed(2)}đ)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
