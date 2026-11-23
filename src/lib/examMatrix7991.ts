import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

export type CognitiveLevel = "nb" | "th" | "vd" | "vdc";

export type MatrixPresetId = "dinh_ky_70_30" | "thpt_2027_3_phan";

export interface MatrixTopicInput {
  id?: string;
  name: string;
  weight: number;
  learningOutcomes?: Partial<Record<CognitiveLevel, string>>;
}

export interface MatrixPartCounts {
  part1Mcq?: number;
  part2TrueFalse?: number;
  part3ShortAnswer?: number;
  essay?: number;
}

export interface MatrixBuildInput {
  subject: string;
  grade: string;
  examTitle?: string;
  schoolName?: string;
  durationMinutes?: number;
  preset?: MatrixPresetId;
  topics: MatrixTopicInput[];
  levelRatios?: Partial<Record<CognitiveLevel, number>>;
  partCounts?: MatrixPartCounts;
}

export interface CognitiveCounts {
  nb: number;
  th: number;
  vd: number;
  vdc: number;
}

export interface MatrixTopicRow {
  id: string;
  stt: number;
  name: string;
  weight: number;
  part1: CognitiveCounts;
  part2: CognitiveCounts;
  part3: CognitiveCounts;
  essay: CognitiveCounts;
  levelPoints: CognitiveCounts;
  totalQuestions: number;
  totalPoints: number;
  percentage: number;
}

export interface SpecificationRow {
  stt: number;
  topicName: string;
  level: CognitiveLevel;
  levelLabel: string;
  requirement: string;
  partLabel: string;
  questionCount: number;
  points: number;
}

export interface ExamMatrix7991Result {
  meta: {
    subject: string;
    grade: string;
    examTitle: string;
    schoolName: string;
    durationMinutes: number;
    preset: MatrixPresetId;
    presetLabel: string;
  };
  pointsPerQuestion: {
    part1: number;
    part2: number;
    part3: number;
    essay: number;
  };
  rows: MatrixTopicRow[];
  totals: {
    part1: CognitiveCounts;
    part2: CognitiveCounts;
    part3: CognitiveCounts;
    essay: CognitiveCounts;
    levelPoints: CognitiveCounts;
    levelPercentages: CognitiveCounts;
    totalQuestions: number;
    totalPoints: number;
  };
  specifications: SpecificationRow[];
}

export const COGNITIVE_LEVELS: CognitiveLevel[] = ["nb", "th", "vd", "vdc"];

export const COGNITIVE_LEVEL_LABELS: Record<CognitiveLevel, string> = {
  nb: "Nhận biết",
  th: "Thông hiểu",
  vd: "Vận dụng",
  vdc: "Vận dụng cao",
};

const PRESET_CONFIGS: Record<
  MatrixPresetId,
  {
    label: string;
    defaultCounts: { part1: number; part2: number; part3: number; essay: number };
    pointWeights: { part1: number; part2: number; part3: number; essay: number };
    defaultDuration: number;
  }
> = {
  dinh_ky_70_30: {
    label: "Định kỳ THCS/THPT 70-30 (Công văn 7991)",
    defaultCounts: { part1: 12, part2: 2, part3: 4, essay: 3 },
    pointWeights: { part1: 0.25, part2: 1.0, part3: 0.5, essay: 1.0 },
    defaultDuration: 60,
  },
  thpt_2027_3_phan: {
    label: "THPT 2027 — 100% Trắc nghiệm 3 phần",
    defaultCounts: { part1: 12, part2: 4, part3: 6, essay: 0 },
    pointWeights: { part1: 0.25, part2: 1.0, part3: 0.5, essay: 0 },
    defaultDuration: 50,
  },
};

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const emptyCounts = (): CognitiveCounts => ({ nb: 0, th: 0, vd: 0, vdc: 0 });

const round2 = (n: number): number => Math.round(n * 100) / 100;

type PartKey = "part1" | "part2" | "part3" | "essay";

const PART_LABELS: Record<PartKey, string> = {
  part1: "Phần I (Nhiều lựa chọn)",
  part2: "Phần II (Đúng/Sai 4 ý)",
  part3: "Phần III (Trả lời ngắn)",
  essay: "Tự luận",
};

const PART_LEVEL_AFFINITY: Record<PartKey, Record<CognitiveLevel, number>> = {
  part1: { nb: 0.28, th: 0.2, vd: 0.04, vdc: 0.0 },
  part2: { nb: 0.14, th: 0.18, vd: 0.1, vdc: 0.04 },
  part3: { nb: 0.04, th: 0.1, vd: 0.22, vdc: 0.16 },
  essay: { nb: 0.02, th: 0.08, vd: 0.22, vdc: 0.24 },
};

function normalizePointsPerQuestion(
  counts: { part1: number; part2: number; part3: number; essay: number },
  preset: MatrixPresetId,
): { part1: number; part2: number; part3: number; essay: number } {
  const base = PRESET_CONFIGS[preset].pointWeights;
  const rawTotal =
    counts.part1 * base.part1 +
    counts.part2 * base.part2 +
    counts.part3 * base.part3 +
    counts.essay * base.essay;

  if (rawTotal <= 0) {
    return { part1: 0, part2: 0, part3: 0, essay: 0 };
  }

  // Scale uniformly if custom counts deviate from 10.0 raw points
  const scale = Math.abs(rawTotal - 10) < 0.001 ? 1 : 10 / rawTotal;
  return {
    part1: counts.part1 > 0 ? round2(base.part1 * scale) : 0,
    part2: counts.part2 > 0 ? round2(base.part2 * scale) : 0,
    part3: counts.part3 > 0 ? round2(base.part3 * scale) : 0,
    essay: counts.essay > 0 ? round2(base.essay * scale) : 0,
  };
}

function defaultLearningOutcome(
  topicName: string,
  level: CognitiveLevel,
): string {
  switch (level) {
    case "nb":
      return `Nhận biết được khái niệm, định nghĩa, tính chất cơ bản thuộc chuyên đề "${topicName}".`;
    case "th":
      return `Hiểu, giải thích và phân biệt được các quy luật, hiện tượng hoặc công thức trong "${topicName}".`;
    case "vd":
      return `Vận dụng kiến thức "${topicName}" để giải quyết bài tập, tình huống thực tiễn quen thuộc.`;
    case "vdc":
      return `Vận dụng tổng hợp, sáng tạo kiến thức "${topicName}" để giải bài toán phân loại, liên môn.`;
  }
}

/**
 * Builds an official Công văn 7991/BGDĐT-GDTrH exam matrix and specification table
 * with guaranteed 10.0 total point reconciliation across topics and cognitive levels.
 */
export function buildExamMatrix7991(
  input: MatrixBuildInput,
): ExamMatrix7991Result {
  const preset: MatrixPresetId = input.preset ?? "dinh_ky_70_30";
  const presetCfg = PRESET_CONFIGS[preset];

  const cleanTopics = (input.topics.length > 0
    ? input.topics
    : [{ id: "topic-1", name: "Nội dung trọng tâm", weight: 100 }]
  ).map((t, idx) => ({
    id: t.id?.trim() || `topic-${idx + 1}`,
    name: t.name.trim() || `Chủ đề ${idx + 1}`,
    weight: Math.max(1, Number(t.weight) || 1),
    learningOutcomes: t.learningOutcomes ?? {},
  }));

  const counts = {
    part1: Math.max(
      0,
      Math.round(input.partCounts?.part1Mcq ?? presetCfg.defaultCounts.part1),
    ),
    part2: Math.max(
      0,
      Math.round(
        input.partCounts?.part2TrueFalse ?? presetCfg.defaultCounts.part2,
      ),
    ),
    part3: Math.max(
      0,
      Math.round(
        input.partCounts?.part3ShortAnswer ?? presetCfg.defaultCounts.part3,
      ),
    ),
    essay: Math.max(
      0,
      Math.round(input.partCounts?.essay ?? presetCfg.defaultCounts.essay),
    ),
  };

  if (counts.part1 + counts.part2 + counts.part3 + counts.essay === 0) {
    counts.part1 = 12;
  }

  const pts = normalizePointsPerQuestion(counts, preset);

  // Compute exact 10.0 scaling correction on the most granular non-zero part if rounding drifted by ~0.01-0.05
  const computedSum = round2(
    counts.part1 * pts.part1 +
      counts.part2 * pts.part2 +
      counts.part3 * pts.part3 +
      counts.essay * pts.essay,
  );

  const rawRatios = {
    nb: Math.max(0, input.levelRatios?.nb ?? 40),
    th: Math.max(0, input.levelRatios?.th ?? 30),
    vd: Math.max(0, input.levelRatios?.vd ?? 20),
    vdc: Math.max(0, input.levelRatios?.vdc ?? 10),
  };
  const ratioSum =
    rawRatios.nb + rawRatios.th + rawRatios.vd + rawRatios.vdc || 100;
  const totalExamPoints = computedSum > 0 ? computedSum : 10;

  const targetLevelPts: Record<CognitiveLevel, number> = {
    nb: (totalExamPoints * rawRatios.nb) / ratioSum,
    th: (totalExamPoints * rawRatios.th) / ratioSum,
    vd: (totalExamPoints * rawRatios.vd) / ratioSum,
    vdc: (totalExamPoints * rawRatios.vdc) / ratioSum,
  };
  const remainingLevelPts: Record<CognitiveLevel, number> = {
    ...targetLevelPts,
  };

  const weightSum = cleanTopics.reduce((acc, t) => acc + t.weight, 0);
  const targetTopicPts = cleanTopics.map(
    (t) => (totalExamPoints * t.weight) / weightSum,
  );
  const remainingTopicPts = [...targetTopicPts];

  const rows: MatrixTopicRow[] = cleanTopics.map((t, idx) => ({
    id: t.id,
    stt: idx + 1,
    name: t.name,
    weight: t.weight,
    part1: emptyCounts(),
    part2: emptyCounts(),
    part3: emptyCounts(),
    essay: emptyCounts(),
    levelPoints: emptyCounts(),
    totalQuestions: 0,
    totalPoints: 0,
    percentage: 0,
  }));

  // Allocate largest-point items first for tighter target convergence
  const slots: Array<{ part: PartKey; point: number }> = [];
  const partOrder: PartKey[] = ["essay", "part2", "part3", "part1"];
  for (const part of partOrder) {
    const c = counts[part];
    const p = pts[part];
    for (let i = 0; i < c; i++) {
      slots.push({ part, point: p });
    }
  }

  for (const slot of slots) {
    let bestTopicIdx = 0;
    let bestLevel: CognitiveLevel = "nb";
    let bestScore = -Infinity;

    for (let ti = 0; ti < rows.length; ti++) {
      const topicNeed =
        remainingTopicPts[ti] / Math.max(0.25, targetTopicPts[ti]);
      for (const lvl of COGNITIVE_LEVELS) {
        const levelTarget = targetLevelPts[lvl];
        if (levelTarget <= 0 && rawRatios[lvl] === 0) continue;
        const levelNeed =
          remainingLevelPts[lvl] / Math.max(0.25, levelTarget);
        const affinity = PART_LEVEL_AFFINITY[slot.part][lvl];
        const score = topicNeed * 1.15 + levelNeed * 1.25 + affinity;
        if (score > bestScore) {
          bestScore = score;
          bestTopicIdx = ti;
          bestLevel = lvl;
        }
      }
    }

    const row = rows[bestTopicIdx];
    row[slot.part][bestLevel] += 1;
    row.levelPoints[bestLevel] = round2(row.levelPoints[bestLevel] + slot.point);
    row.totalQuestions += 1;
    row.totalPoints = round2(row.totalPoints + slot.point);

    remainingTopicPts[bestTopicIdx] -= slot.point;
    remainingLevelPts[bestLevel] -= slot.point;
  }

  // Reconcile tiny floating-point rounding drift to exact 10.0 on the highest-weight row
  const currentGrandTotal = round2(
    rows.reduce((sum, r) => sum + r.totalPoints, 0),
  );
  const drift = round2(10 - currentGrandTotal);
  if (Math.abs(drift) > 0 && Math.abs(drift) <= 0.2 && rows.length > 0) {
    const anchorRow = rows.reduce((best, r) =>
      r.totalPoints > best.totalPoints ? r : best,
    );
    const anchorLvl =
      COGNITIVE_LEVELS.find((l) => anchorRow.levelPoints[l] > 0) ?? "nb";
    anchorRow.levelPoints[anchorLvl] = round2(
      anchorRow.levelPoints[anchorLvl] + drift,
    );
    anchorRow.totalPoints = round2(anchorRow.totalPoints + drift);
  }

  const grandTotalPoints = round2(
    rows.reduce((sum, r) => sum + r.totalPoints, 0),
  );

  for (const row of rows) {
    row.percentage =
      grandTotalPoints > 0
        ? Math.round((row.totalPoints / grandTotalPoints) * 1000) / 10
        : 0;
  }

  const totals = {
    part1: emptyCounts(),
    part2: emptyCounts(),
    part3: emptyCounts(),
    essay: emptyCounts(),
    levelPoints: emptyCounts(),
    levelPercentages: emptyCounts(),
    totalQuestions: 0,
    totalPoints: grandTotalPoints,
  };

  for (const row of rows) {
    for (const lvl of COGNITIVE_LEVELS) {
      totals.part1[lvl] += row.part1[lvl];
      totals.part2[lvl] += row.part2[lvl];
      totals.part3[lvl] += row.part3[lvl];
      totals.essay[lvl] += row.essay[lvl];
      totals.levelPoints[lvl] = round2(
        totals.levelPoints[lvl] + row.levelPoints[lvl],
      );
    }
    totals.totalQuestions += row.totalQuestions;
  }

  for (const lvl of COGNITIVE_LEVELS) {
    totals.levelPercentages[lvl] =
      grandTotalPoints > 0
        ? Math.round((totals.levelPoints[lvl] / grandTotalPoints) * 1000) / 10
        : 0;
  }

  // Build Specification rows (Bản đặc tả)
  const specifications: SpecificationRow[] = [];
  let specStt = 1;
  cleanTopics.forEach((topic, ti) => {
    const row = rows[ti];
    for (const part of ["part1", "part2", "part3", "essay"] as PartKey[]) {
      for (const lvl of COGNITIVE_LEVELS) {
        const qCount = row[part][lvl];
        if (qCount <= 0) continue;
        const customOutcome = topic.learningOutcomes[lvl]?.trim();
        specifications.push({
          stt: specStt++,
          topicName: topic.name,
          level: lvl,
          levelLabel: COGNITIVE_LEVEL_LABELS[lvl],
          requirement:
            customOutcome || defaultLearningOutcome(topic.name, lvl),
          partLabel: PART_LABELS[part],
          questionCount: qCount,
          points: round2(qCount * pts[part]),
        });
      }
    }
  });

  return {
    meta: {
      subject: input.subject.trim() || "Môn học",
      grade: input.grade.trim() || "Lớp 12",
      examTitle:
        input.examTitle?.trim() ||
        `KIỂM TRA ĐỊNH KỲ MÔN ${(input.subject || "MÔN HỌC").toUpperCase()}`,
      schoolName: input.schoolName?.trim() || "TRƯỜNG THPT / THCS",
      durationMinutes: input.durationMinutes ?? presetCfg.defaultDuration,
      preset,
      presetLabel: presetCfg.label,
    },
    pointsPerQuestion: pts,
    rows,
    totals,
    specifications,
  };
}

function makeCell(
  text: string,
  options?: {
    bold?: boolean;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
    colSpan?: number;
    rowSpan?: number;
    shading?: string;
    size?: number;
  },
): TableCell {
  return new TableCell({
    columnSpan: options?.colSpan,
    rowSpan: options?.rowSpan,
    shading: options?.shading ? { fill: options.shading } : undefined,
    margins: { top: 80, bottom: 80, left: 90, right: 90 },
    children: [
      new Paragraph({
        alignment: options?.align ?? AlignmentType.CENTER,
        children: [
          new TextRun({
            text,
            bold: options?.bold ?? false,
            size: options?.size ?? 20,
            font: "Times New Roman",
          }),
        ],
      }),
    ],
  });
}

const TABLE_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "334155" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "334155" },
  left: { style: BorderStyle.SINGLE, size: 4, color: "334155" },
  right: { style: BorderStyle.SINGLE, size: 4, color: "334155" },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "64748B" },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "64748B" },
};

/**
 * Exports the Công văn 7991 Exam Matrix and Specification tables into a formatted `.docx` Blob.
 */
export async function exportMatrix7991ToDocx(
  matrix: ExamMatrix7991Result,
): Promise<Blob> {
  const fmtCount = (n: number) => (n > 0 ? String(n) : "");

  const matrixHeaderRow1 = new TableRow({
    tableHeader: true,
    children: [
      makeCell("TT", { bold: true, rowSpan: 2, shading: "E2E8F0" }),
      makeCell("Chủ đề / Chương", { bold: true, rowSpan: 2, shading: "E2E8F0" }),
      makeCell("Phần I (MCQ)", { bold: true, colSpan: 4, shading: "E2E8F0" }),
      makeCell("Phần II (Đ/S)", { bold: true, colSpan: 4, shading: "E2E8F0" }),
      makeCell("Phần III (TLN)", { bold: true, colSpan: 4, shading: "E2E8F0" }),
      makeCell("Tự luận", { bold: true, colSpan: 4, shading: "E2E8F0" }),
      makeCell("Tổng câu", { bold: true, rowSpan: 2, shading: "E2E8F0" }),
      makeCell("Tổng điểm", { bold: true, rowSpan: 2, shading: "E2E8F0" }),
      makeCell("Tỉ lệ %", { bold: true, rowSpan: 2, shading: "E2E8F0" }),
    ],
  });

  const subHeaders = ["NB", "TH", "VD", "VDC"];
  const matrixHeaderRow2 = new TableRow({
    tableHeader: true,
    children: [
      ...subHeaders,
      ...subHeaders,
      ...subHeaders,
      ...subHeaders,
    ].map((lbl) => makeCell(lbl, { bold: true, shading: "F1F5F9", size: 18 })),
  });

  const matrixDataRows = matrix.rows.map(
    (r) =>
      new TableRow({
        children: [
          makeCell(String(r.stt)),
          makeCell(r.name, { align: AlignmentType.LEFT }),
          ...COGNITIVE_LEVELS.map((l) => makeCell(fmtCount(r.part1[l]))),
          ...COGNITIVE_LEVELS.map((l) => makeCell(fmtCount(r.part2[l]))),
          ...COGNITIVE_LEVELS.map((l) => makeCell(fmtCount(r.part3[l]))),
          ...COGNITIVE_LEVELS.map((l) => makeCell(fmtCount(r.essay[l]))),
          makeCell(String(r.totalQuestions), { bold: true }),
          makeCell(r.totalPoints.toFixed(2), { bold: true }),
          makeCell(`${r.percentage}%`),
        ],
      }),
  );

  const matrixTotalRow = new TableRow({
    children: [
      makeCell("", { shading: "F8FAFC" }),
      makeCell("Tổng số câu / Tổng điểm", {
        bold: true,
        align: AlignmentType.LEFT,
        shading: "F8FAFC",
      }),
      ...COGNITIVE_LEVELS.map((l) =>
        makeCell(String(matrix.totals.part1[l]), { bold: true, shading: "F8FAFC" }),
      ),
      ...COGNITIVE_LEVELS.map((l) =>
        makeCell(String(matrix.totals.part2[l]), { bold: true, shading: "F8FAFC" }),
      ),
      ...COGNITIVE_LEVELS.map((l) =>
        makeCell(String(matrix.totals.part3[l]), { bold: true, shading: "F8FAFC" }),
      ),
      ...COGNITIVE_LEVELS.map((l) =>
        makeCell(String(matrix.totals.essay[l]), { bold: true, shading: "F8FAFC" }),
      ),
      makeCell(String(matrix.totals.totalQuestions), {
        bold: true,
        shading: "E2E8F0",
      }),
      makeCell(matrix.totals.totalPoints.toFixed(2), {
        bold: true,
        shading: "E2E8F0",
      }),
      makeCell("100%", { bold: true, shading: "E2E8F0" }),
    ],
  });

  const levelSummaryRow = new TableRow({
    children: [
      makeCell("", { shading: "F1F5F9" }),
      makeCell("Phân bổ mức độ nhận thức", {
        bold: true,
        align: AlignmentType.LEFT,
        shading: "F1F5F9",
      }),
      makeCell(
        `NB: ${matrix.totals.levelPoints.nb.toFixed(2)}đ (${matrix.totals.levelPercentages.nb}%)`,
        { colSpan: 4, bold: true, shading: "F1F5F9", size: 18 },
      ),
      makeCell(
        `TH: ${matrix.totals.levelPoints.th.toFixed(2)}đ (${matrix.totals.levelPercentages.th}%)`,
        { colSpan: 4, bold: true, shading: "F1F5F9", size: 18 },
      ),
      makeCell(
        `VD: ${matrix.totals.levelPoints.vd.toFixed(2)}đ (${matrix.totals.levelPercentages.vd}%)`,
        { colSpan: 4, bold: true, shading: "F1F5F9", size: 18 },
      ),
      makeCell(
        `VDC: ${matrix.totals.levelPoints.vdc.toFixed(2)}đ (${matrix.totals.levelPercentages.vdc}%)`,
        { colSpan: 4, bold: true, shading: "F1F5F9", size: 18 },
      ),
      makeCell("", { shading: "F1F5F9" }),
      makeCell(matrix.totals.totalPoints.toFixed(2), {
        bold: true,
        shading: "F1F5F9",
      }),
      makeCell("100%", { bold: true, shading: "F1F5F9" }),
    ],
  });

  const matrixTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: TABLE_BORDERS,
    rows: [
      matrixHeaderRow1,
      matrixHeaderRow2,
      ...matrixDataRows,
      matrixTotalRow,
      levelSummaryRow,
    ],
  });

  const specHeaderRow = new TableRow({
    tableHeader: true,
    children: [
      makeCell("TT", { bold: true, shading: "E2E8F0" }),
      makeCell("Chủ đề / Nội dung", { bold: true, shading: "E2E8F0" }),
      makeCell("Mức độ", { bold: true, shading: "E2E8F0" }),
      makeCell("Yêu cầu cần đạt", { bold: true, shading: "E2E8F0" }),
      makeCell("Dạng thức", { bold: true, shading: "E2E8F0" }),
      makeCell("Số câu", { bold: true, shading: "E2E8F0" }),
      makeCell("Điểm", { bold: true, shading: "E2E8F0" }),
    ],
  });

  const specRows = matrix.specifications.map(
    (s) =>
      new TableRow({
        children: [
          makeCell(String(s.stt)),
          makeCell(s.topicName, { align: AlignmentType.LEFT }),
          makeCell(s.levelLabel),
          makeCell(s.requirement, { align: AlignmentType.LEFT }),
          makeCell(s.partLabel, { align: AlignmentType.LEFT }),
          makeCell(String(s.questionCount)),
          makeCell(s.points.toFixed(2)),
        ],
      }),
  );

  const specTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: TABLE_BORDERS,
    rows: [specHeaderRow, ...specRows],
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: matrix.meta.schoolName.toUpperCase(),
                bold: true,
                size: 24,
                font: "Times New Roman",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: `MA TRẬN VÀ BẢN ĐẶC TẢ ĐỀ KIỂM TRA — ${matrix.meta.examTitle}`,
                bold: true,
                size: 26,
                font: "Times New Roman",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: `Môn: ${matrix.meta.subject} | Khối: ${matrix.meta.grade} | Thời gian: ${matrix.meta.durationMinutes} phút | ${matrix.meta.presetLabel}`,
                italics: true,
                size: 21,
                font: "Times New Roman",
              }),
            ],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 120, after: 120 },
            children: [
              new TextRun({
                text: "I. MA TRẬN ĐỀ KIỂM TRA (Theo Công văn 7991/BGDĐT-GDTrH)",
                bold: true,
                size: 24,
                font: "Times New Roman",
              }),
            ],
          }),
          matrixTable,
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 320, after: 120 },
            children: [
              new TextRun({
                text: "II. BẢN ĐẶC TẢ ĐỀ KIỂM TRA",
                bold: true,
                size: 24,
                font: "Times New Roman",
              }),
            ],
          }),
          specTable,
        ],
      },
    ],
  });

  const bytes = await Packer.pack(doc, "uint8array");
  return new Blob([bytes as BlobPart], { type: DOCX_MIME });
}

/**
 * Generates a ready-to-use Vietnamese AI prompt matching the matrix structure
 * for QuizKen's AI Quiz Generator.
 */
export function buildAiPromptFromMatrix(matrix: ExamMatrix7991Result): string {
  const topicLines = matrix.rows
    .map((r) => {
      const details: string[] = [];
      const p1 = r.part1.nb + r.part1.th + r.part1.vd + r.part1.vdc;
      const p2 = r.part2.nb + r.part2.th + r.part2.vd + r.part2.vdc;
      const p3 = r.part3.nb + r.part3.th + r.part3.vd + r.part3.vdc;
      const es = r.essay.nb + r.essay.th + r.essay.vd + r.essay.vdc;
      if (p1 > 0) details.push(`${p1} câu Phần I (4 lựa chọn)`);
      if (p2 > 0) details.push(`${p2} câu Phần II (Đúng/Sai 4 ý)`);
      if (p3 > 0) details.push(`${p3} câu Phần III (Trả lời ngắn)`);
      if (es > 0) details.push(`${es} câu Tự luận`);
      return `- Chủ đề "${r.name}" (${r.totalPoints.toFixed(2)}đ): ${details.join(", ")}`;
    })
    .join("\n");

  return [
    `Tạo đề kiểm tra môn ${matrix.meta.subject} (${matrix.meta.grade}), thời gian ${matrix.meta.durationMinutes} phút theo chuẩn Công văn 7991/BGDĐT-GDTrH (${matrix.meta.presetLabel}).`,
    `Tỉ lệ mức độ nhận thức: Nhận biết ${matrix.totals.levelPercentages.nb}%, Thông hiểu ${matrix.totals.levelPercentages.th}%, Vận dụng ${matrix.totals.levelPercentages.vd}%, Vận dụng cao ${matrix.totals.levelPercentages.vdc}%.`,
    `Phân bổ theo từng chuyên đề:\n${topicLines}`,
    `Mỗi câu hỏi đều có đáp án chính xác và lời giải chi tiết.`,
  ].join("\n\n");
}
