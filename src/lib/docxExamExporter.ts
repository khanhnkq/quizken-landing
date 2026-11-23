import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import JSZip from "jszip";
import {
  getQuestionType,
  type Question,
  type Quiz,
} from "@/lib/teacherQuizTypes";

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const ZIP_MIME = "application/zip";

export interface MultiCodeExamOptions {
  examCodes: string[];
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  schoolName?: string;
  departmentName?: string;
  examTitle?: string;
  subject?: string;
  durationMinutes?: number;
}

export interface AnswerKeyEntry {
  questionNumber: number;
  part: "part1" | "part2" | "part3";
  partLabel: string;
  answerCode: string;
  originalIndex: number;
}

export interface ShuffledExamVersion {
  examCode: string;
  part1: Question[];
  part2: Question[];
  part3: Question[];
  orderedQuestions: Question[];
  answerEntries: AnswerKeyEntry[];
}

export interface MasterAnswerKeyData {
  examCodes: string[];
  versions: ShuffledExamVersion[];
  csvContent: string;
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function createMulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: T[], rng: () => number): T[] {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

/**
 * Generates sequential exam codes (e.g., ["101", "102", ...]) clamped to 1..24 codes.
 */
export function generateExamCodesList(
  startCode: number | string = 101,
  count = 4,
): string[] {
  const safeCount = Math.max(1, Math.min(24, Math.floor(count)));
  const numericStart = Number.parseInt(String(startCode), 10);
  const base = Number.isFinite(numericStart) ? numericStart : 101;
  return Array.from({ length: safeCount }, (_, i) => String(base + i));
}

function formatQuestionAnswerCode(question: Question): string {
  const qType = getQuestionType(question);
  if (qType === "true_false_group") {
    const subs = Array.isArray(question.subItems) ? question.subItems : [];
    return subs.map((s) => (s.isCorrect ? "Đ" : "S")).join("-");
  }
  if (qType === "short_answer") {
    const accepted = Array.isArray(question.acceptedAnswers)
      ? question.acceptedAnswers.filter(Boolean)
      : [];
    return accepted[0] ?? "";
  }
  const idx =
    typeof question.correctAnswer === "number" && question.correctAnswer >= 0
      ? question.correctAnswer
      : 0;
  return String.fromCharCode(65 + idx);
}

/**
 * Deterministically shuffles a quiz for a specific exam code while preserving Part I / II / III grouping
 * and accurately remapping every answer key.
 */
export function shuffleQuizForExamCode(
  quiz: Quiz,
  examCode: string,
  options: { shuffleQuestions: boolean; shuffleOptions: boolean },
): ShuffledExamVersion {
  const rng = createMulberry32(hashSeed(`${quiz.title}::${examCode}`));

  const indexed = (quiz.questions ?? []).map((q, originalIndex) => ({
    question: q,
    originalIndex,
    type: getQuestionType(q),
  }));

  const p1Raw = indexed.filter((item) => item.type === "mcq");
  const p2Raw = indexed.filter((item) => item.type === "true_false_group");
  const p3Raw = indexed.filter((item) => item.type === "short_answer");

  const p1Ordered = options.shuffleQuestions ? seededShuffle(p1Raw, rng) : p1Raw;
  const p2Ordered = options.shuffleQuestions ? seededShuffle(p2Raw, rng) : p2Raw;
  const p3Ordered = options.shuffleQuestions ? seededShuffle(p3Raw, rng) : p3Raw;

  const transformMcq = (q: Question): Question => {
    const opts = Array.isArray(q.options) ? q.options : [];
    if (!options.shuffleOptions || opts.length <= 1) {
      return { ...q, options: opts.slice() };
    }
    const perm = seededShuffle(
      opts.map((_, idx) => idx),
      rng,
    );
    const newOptions = perm.map((oldIdx) => opts[oldIdx]);
    const newCorrect = perm.findIndex((oldIdx) => oldIdx === q.correctAnswer);
    return {
      ...q,
      options: newOptions,
      correctAnswer: newCorrect >= 0 ? newCorrect : 0,
    };
  };

  const part1Items = p1Ordered.map((item) => ({
    ...item,
    question: transformMcq(item.question),
  }));
  const part2Items = p2Ordered.map((item) => ({
    ...item,
    question: {
      ...item.question,
      subItems: Array.isArray(item.question.subItems)
        ? item.question.subItems.map((s) => ({ ...s }))
        : [],
    },
  }));
  const part3Items = p3Ordered.map((item) => ({
    ...item,
    question: {
      ...item.question,
      acceptedAnswers: Array.isArray(item.question.acceptedAnswers)
        ? item.question.acceptedAnswers.slice()
        : [],
    },
  }));

  const orderedQuestions: Question[] = [];
  const answerEntries: AnswerKeyEntry[] = [];

  let qNum = 1;
  for (const item of part1Items) {
    orderedQuestions.push(item.question);
    answerEntries.push({
      questionNumber: qNum++,
      part: "part1",
      partLabel: "Phần I",
      answerCode: formatQuestionAnswerCode(item.question),
      originalIndex: item.originalIndex,
    });
  }
  for (const item of part2Items) {
    orderedQuestions.push(item.question);
    answerEntries.push({
      questionNumber: qNum++,
      part: "part2",
      partLabel: "Phần II",
      answerCode: formatQuestionAnswerCode(item.question),
      originalIndex: item.originalIndex,
    });
  }
  for (const item of part3Items) {
    orderedQuestions.push(item.question);
    answerEntries.push({
      questionNumber: qNum++,
      part: "part3",
      partLabel: "Phần III",
      answerCode: formatQuestionAnswerCode(item.question),
      originalIndex: item.originalIndex,
    });
  }

  return {
    examCode,
    part1: part1Items.map((i) => i.question),
    part2: part2Items.map((i) => i.question),
    part3: part3Items.map((i) => i.question),
    orderedQuestions,
    answerEntries,
  };
}

function escapeCsvCell(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Computes deterministic shuffled exam versions and master answer keys across all exam codes.
 */
export function buildMasterAnswerKey(
  quiz: Quiz,
  options: MultiCodeExamOptions,
): MasterAnswerKeyData {
  const rawCodes =
    options.examCodes && options.examCodes.length > 0
      ? options.examCodes
      : ["101", "102", "103", "104"];
  const examCodes = rawCodes.slice(0, 24);

  const versions = examCodes.map((code) =>
    shuffleQuizForExamCode(quiz, code, {
      shuffleQuestions: options.shuffleQuestions,
      shuffleOptions: options.shuffleOptions,
    }),
  );

  const maxRows = versions[0]?.answerEntries.length ?? 0;
  const header = ["Câu", "Phần", ...examCodes.map((c) => `Mã ${c}`)];
  const csvRows: string[] = [header.map(escapeCsvCell).join(",")];

  for (let i = 0; i < maxRows; i++) {
    const firstEntry = versions[0].answerEntries[i];
    const row = [
      String(firstEntry.questionNumber),
      firstEntry.partLabel,
      ...versions.map((v) => v.answerEntries[i]?.answerCode ?? ""),
    ];
    csvRows.push(row.map(escapeCsvCell).join(","));
  }

  const csvContent = "\uFEFF" + csvRows.join("\r\n");

  return { examCodes, versions, csvContent };
}

const NO_BORDER = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

const SOLID_BORDER = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "334155" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "334155" },
  left: { style: BorderStyle.SINGLE, size: 4, color: "334155" },
  right: { style: BorderStyle.SINGLE, size: 4, color: "334155" },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "64748B" },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "64748B" },
};

function makeTextRun(
  text: string,
  opts?: { bold?: boolean; italics?: boolean; size?: number },
): TextRun {
  return new TextRun({
    text,
    bold: opts?.bold ?? false,
    italics: opts?.italics ?? false,
    size: opts?.size ?? 24, // 12pt
    font: "Times New Roman",
  });
}

function buildExamPaperDocument(
  version: ShuffledExamVersion,
  quizTitle: string,
  options: MultiCodeExamOptions,
): Document {
  const departmentName = (
    options.departmentName || "SỞ GIÁO DỤC VÀ ĐÀO TẠO"
  ).toUpperCase();
  const schoolName = (
    options.schoolName || "TRƯỜNG THPT / THCS"
  ).toUpperCase();
  const examTitle = (
    options.examTitle || quizTitle || "ĐỀ KIỂM TRA ĐỊNH KỲ"
  ).toUpperCase();
  const subject = options.subject || "Tổng hợp";
  const duration = options.durationMinutes ?? 45;

  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDER,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 44, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [makeTextRun(departmentName, { size: 22 })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  makeTextRun(schoolName, { bold: true, size: 22 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [makeTextRun("ĐỀ CHÍNH THỨC", { italics: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 56, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [makeTextRun(examTitle, { bold: true, size: 22 })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  makeTextRun(`Môn: ${subject} — Thời gian làm bài: ${duration} phút`, {
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  makeTextRun(`MÃ ĐỀ: ${version.examCode}`, {
                    bold: true,
                    size: 24,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const candidateBox = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: SOLID_BORDER,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 62, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [
              new Paragraph({
                children: [
                  makeTextRun("Họ và tên thí sinh: ....................................................", {
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 38, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [
              new Paragraph({
                children: [
                  makeTextRun("Số báo danh: .......................", {
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const children: Array<Paragraph | Table> = [
    headerTable,
    new Paragraph({ spacing: { after: 120 }, children: [] }),
    candidateBox,
    new Paragraph({ spacing: { after: 180 }, children: [] }),
  ];

  let questionNumber = 1;

  if (version.part1.length > 0) {
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 100 },
        children: [
          makeTextRun(
            "PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn.",
            { bold: true, size: 24 },
          ),
          makeTextRun(
            " Thí sinh trả lời từ câu 1 đến câu " +
              version.part1.length +
              ". Mỗi câu hỏi thí sinh chỉ chọn một phương án.",
            { italics: true, size: 22 },
          ),
        ],
      }),
    );

    for (const q of version.part1) {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 60 },
          children: [
            makeTextRun(`Câu ${questionNumber++}: `, { bold: true }),
            makeTextRun(q.question),
          ],
        }),
      );
      const opts = Array.isArray(q.options) ? q.options : [];
      opts.forEach((opt, idx) => {
        const letter = String.fromCharCode(65 + idx);
        children.push(
          new Paragraph({
            indent: { left: 360 },
            spacing: { after: 40 },
            children: [
              makeTextRun(`${letter}. `, { bold: true }),
              makeTextRun(opt),
            ],
          }),
        );
      });
    }
  }

  if (version.part2.length > 0) {
    const startNum = questionNumber;
    const endNum = startNum + version.part2.length - 1;
    children.push(
      new Paragraph({
        spacing: { before: 200, after: 100 },
        children: [
          makeTextRun("PHẦN II. Câu trắc nghiệm đúng sai.", {
            bold: true,
            size: 24,
          }),
          makeTextRun(
            ` Thí sinh trả lời từ câu ${startNum} đến câu ${endNum}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.`,
            { italics: true, size: 22 },
          ),
        ],
      }),
    );

    for (const q of version.part2) {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 60 },
          children: [
            makeTextRun(`Câu ${questionNumber++}: `, { bold: true }),
            makeTextRun(q.question),
          ],
        }),
      );
      const subItems = Array.isArray(q.subItems) ? q.subItems : [];
      subItems.forEach((sub, idx) => {
        const label =
          sub.label ?? (["a", "b", "c", "d"][idx] || String(idx + 1));
        children.push(
          new Paragraph({
            indent: { left: 360 },
            spacing: { after: 40 },
            children: [
              makeTextRun(`${label}) `, { bold: true }),
              makeTextRun(sub.text),
            ],
          }),
        );
      });
    }
  }

  if (version.part3.length > 0) {
    const startNum = questionNumber;
    const endNum = startNum + version.part3.length - 1;
    children.push(
      new Paragraph({
        spacing: { before: 200, after: 100 },
        children: [
          makeTextRun("PHẦN III. Câu trắc nghiệm trả lời ngắn.", {
            bold: true,
            size: 24,
          }),
          makeTextRun(
            ` Thí sinh trả lời từ câu ${startNum} đến câu ${endNum}.`,
            { italics: true, size: 22 },
          ),
        ],
      }),
    );

    for (const q of version.part3) {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 60 },
          children: [
            makeTextRun(`Câu ${questionNumber++}: `, { bold: true }),
            makeTextRun(q.question),
          ],
        }),
      );
      children.push(
        new Paragraph({
          indent: { left: 360 },
          spacing: { after: 60 },
          children: [
            makeTextRun(
              `Trả lời: ........................................${
                q.answerUnit ? ` (${q.answerUnit})` : ""
              }`,
              { italics: true, size: 22 },
            ),
          ],
        }),
      );
    }
  }

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 280 },
      children: [makeTextRun("---------- HẾT ----------", { bold: true })],
    }),
  );

  return new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4
            margin: { top: 850, bottom: 850, left: 1000, right: 850 },
          },
        },
        children,
      },
    ],
  });
}

function buildMasterAnswerKeyDocument(
  masterKey: MasterAnswerKeyData,
  quizTitle: string,
  options: MultiCodeExamOptions,
): Document {
  const headerCells = [
    new TableCell({
      shading: { fill: "E2E8F0" },
      margins: { top: 70, bottom: 70, left: 80, right: 80 },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [makeTextRun("Câu", { bold: true, size: 20 })],
        }),
      ],
    }),
    new TableCell({
      shading: { fill: "E2E8F0" },
      margins: { top: 70, bottom: 70, left: 80, right: 80 },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [makeTextRun("Phần", { bold: true, size: 20 })],
        }),
      ],
    }),
    ...masterKey.examCodes.map(
      (code) =>
        new TableCell({
          shading: { fill: "E2E8F0" },
          margins: { top: 70, bottom: 70, left: 80, right: 80 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [makeTextRun(`Mã ${code}`, { bold: true, size: 20 })],
            }),
          ],
        }),
    ),
  ];

  const rowCount = masterKey.versions[0]?.answerEntries.length ?? 0;
  const bodyRows: TableRow[] = [];

  for (let i = 0; i < rowCount; i++) {
    const baseEntry = masterKey.versions[0].answerEntries[i];
    bodyRows.push(
      new TableRow({
        children: [
          new TableCell({
            margins: { top: 60, bottom: 60, left: 80, right: 80 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  makeTextRun(String(baseEntry.questionNumber), {
                    bold: true,
                    size: 20,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            margins: { top: 60, bottom: 60, left: 80, right: 80 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [makeTextRun(baseEntry.partLabel, { size: 18 })],
              }),
            ],
          }),
          ...masterKey.versions.map(
            (v) =>
              new TableCell({
                margins: { top: 60, bottom: 60, left: 80, right: 80 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      makeTextRun(v.answerEntries[i]?.answerCode ?? "", {
                        bold: true,
                        size: 20,
                      }),
                    ],
                  }),
                ],
              }),
          ),
        ],
      }),
    );
  }

  return new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              makeTextRun(
                `BẢNG ĐÁP ÁN TỔNG HỢP — ${(
                  options.examTitle ||
                  quizTitle ||
                  "ĐỀ KIỂM TRA"
                ).toUpperCase()}`,
                { bold: true, size: 26 },
              ),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              makeTextRun(
                `Số lượng mã đề: ${masterKey.examCodes.length} (${masterKey.examCodes.join(
                  ", ",
                )})`,
                { italics: true, size: 20 },
              ),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: SOLID_BORDER,
            rows: [
              new TableRow({ tableHeader: true, children: headerCells }),
              ...bodyRows,
            ],
          }),
        ],
      },
    ],
  });
}

async function packDocToUint8Array(doc: Document): Promise<Uint8Array> {
  return Packer.pack(doc, "uint8array");
}

/**
 * Exports a single exam paper version as an A4 `.docx` Blob.
 */
export async function exportSingleExamToDocx(
  version: ShuffledExamVersion,
  quizTitle: string,
  options: MultiCodeExamOptions,
): Promise<Blob> {
  const doc = buildExamPaperDocument(version, quizTitle, options);
  const bytes = await packDocToUint8Array(doc);
  return new Blob([bytes as BlobPart], { type: DOCX_MIME });
}

/**
 * Generates a `.zip` Blob containing 1–24 deterministically shuffled Word `.docx` exam papers
 * (`De_thi_Ma_<code>.docx`), `Bang_Dap_An_Tong_Hop.docx`, and `Bang_Dap_An_Tong_Hop.csv`.
 */
export async function generateMultiCodeExamBundle(
  quiz: Quiz,
  options: MultiCodeExamOptions,
): Promise<Blob> {
  const masterKey = buildMasterAnswerKey(quiz, options);
  const zip = new JSZip();

  for (const version of masterKey.versions) {
    const doc = buildExamPaperDocument(version, quiz.title, options);
    const bytes = await packDocToUint8Array(doc);
    zip.file(`De_thi_Ma_${version.examCode}.docx`, bytes);
  }

  const masterDoc = buildMasterAnswerKeyDocument(
    masterKey,
    quiz.title,
    options,
  );
  const masterBytes = await packDocToUint8Array(masterDoc);
  zip.file("Bang_Dap_An_Tong_Hop.docx", masterBytes);
  zip.file("Bang_Dap_An_Tong_Hop.csv", masterKey.csvContent);

  const zipBytes = await zip.generateAsync({ type: "uint8array" });
  return new Blob([zipBytes as BlobPart], { type: ZIP_MIME });
}
