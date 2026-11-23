import mammoth from "mammoth";
import type { Question, TrueFalseSubItem } from "@/lib/teacherQuizTypes";

export interface ParsedQuizResult {
  title: string;
  questions: Question[];
  warnings: string[];
}

const BOLD_OPEN = "[[__QK_MARK__]]";
const BOLD_CLOSE = "[[/__QK_MARK__]]";

const QUESTION_HEADER_RE =
  /^(?:Câu|Bài|Question)\s+(\d+)\s*[:.)-]?[ \t]*(.*)$/i;
const PART_HEADER_RE = /^(?:PHẦN|PART)\s+(I|II|III|1|2|3)\b(.*)$/i;
const ANSWER_LINE_RE =
  /^(?:Đáp\s*án(?:\s*đúng)?|Answer|Key)\s*[:-]\s*(.+)$/i;
const EXPLANATION_LINE_RE =
  /^(?:Lời\s*giải|Giải\s*thích|Hướng\s*dẫn(?:\s*giải)?|Explanation)\s*[:-]\s*(.+)$/i;
const UNIT_LINE_RE = /^(?:Đơn\s*vị|Unit)\s*[:-]\s*(.+)$/i;
const ANSWER_SECTION_RE =
  /^(?:BẢNG\s*ĐÁP\s*ÁN|ĐÁP\s*ÁN(?:\s*THAM\s*KHẢO)?|ANSWER\s*KEY)\s*[:-]?$/i;

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    );
}

function stripMarkers(text: string): string {
  return text.split(BOLD_OPEN).join("").split(BOLD_CLOSE).join("").trim();
}

/**
 * Converts mammoth HTML output to line-oriented text while preserving bold/underline
 * hints around option markers and sub-items using internal markers.
 */
function htmlToAnnotatedText(html: string): string {
  let processed = html
    .replace(/<(strong|b|u)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, _tag, inner) => {
      const cleaned = inner.replace(/<[^>]+>/g, "");
      if (!cleaned.trim()) return inner;
      return `${BOLD_OPEN}${inner}${BOLD_CLOSE}`;
    })
    .replace(/<\/(p|h[1-6]|div|li|tr)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(td|th)>/gi, " | ")
    .replace(/<[^>]+>/g, "");

  processed = decodeHtmlEntities(processed);

  return processed
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter((line) => line.length > 0)
    .join("\n");
}

function toMammothInput(buffer: ArrayBuffer): {
  arrayBuffer: ArrayBuffer;
  buffer?: Buffer;
} {
  if (typeof Buffer !== "undefined") {
    return { arrayBuffer: buffer, buffer: Buffer.from(buffer) };
  }
  return { arrayBuffer: buffer };
}

interface ParsedOptionToken {
  letter: string;
  text: string;
  isStarred: boolean;
  isFormatted: boolean;
}

/**
 * Extracts one or more options (`A. ... B. ...`) from a single line.
 */
function extractMcqOptionsFromLine(line: string): ParsedOptionToken[] {
  // Match optional [[__QK_MARK__]] and optional * right before A./B./C./D.
  const markerPattern = String.raw`(?:\[\[__QK_MARK__\]\])?`;
  const closePattern = String.raw`(?:\[\[\/__QK_MARK__\]\])?`;
  const optionStartRe = new RegExp(
    `(?:^|\\s)(${markerPattern}\\*?${markerPattern}([A-D])${closePattern}\\s*[.)]${closePattern})\\s*`,
    "g",
  );

  const matches: Array<{
    index: number;
    end: number;
    letter: string;
    prefixRaw: string;
  }> = [];

  let m: RegExpExecArray | null;
  while ((m = optionStartRe.exec(line)) !== null) {
    const fullMatch = m[0];
    const tokenStart =
      m.index + (fullMatch.startsWith(" ") || fullMatch.startsWith("\t") ? 1 : 0);
    matches.push({
      index: tokenStart,
      end: m.index + fullMatch.length,
      letter: m[2].toUpperCase(),
      prefixRaw: m[1],
    });
  }

  if (matches.length === 0) return [];

  // Ensure the line actually starts with the first option (avoid false positives mid-sentence)
  const leading = stripMarkers(line.slice(0, matches[0].index));
  if (leading.length > 0) return [];

  const tokens: ParsedOptionToken[] = [];
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const nextStart = i + 1 < matches.length ? matches[i + 1].index : line.length;
    const rawSegment = line.slice(cur.index, nextStart);
    const bodyRaw = line.slice(cur.end, nextStart);

    const hasMark =
      rawSegment.includes(BOLD_OPEN) &&
      (cur.prefixRaw.includes(BOLD_OPEN) || bodyRaw.includes(BOLD_OPEN));
    const isStarred = cur.prefixRaw.includes("*");

    tokens.push({
      letter: cur.letter,
      text: stripMarkers(bodyRaw),
      isStarred,
      isFormatted: hasMark,
    });
  }

  return tokens;
}

interface ParsedSubItemToken {
  label: "a" | "b" | "c" | "d";
  text: string;
  explicitCorrect: boolean | null;
  isFormatted: boolean;
}

function extractSubItemFromLine(line: string): ParsedSubItemToken | null {
  const clean = stripMarkers(line);
  const match = clean.match(/^(\*)?\s*([a-d])\s*[).]\s*(.+)$/i);
  if (!match) return null;

  const label = match[2].toLowerCase() as "a" | "b" | "c" | "d";
  let text = match[3].trim();
  let explicitCorrect: boolean | null = null;

  // Detect trailing (Đ), (S), [Đúng], [Sai], -> Đúng, - Sai
  const tfSuffix = text.match(
    /(?:\(|\[|—|->|-)\s*(Đúng|Sai|Đ|S|True|False)\s*(?:\)|\])?\s*$/i,
  );
  if (tfSuffix) {
    const token = tfSuffix[1].toUpperCase();
    explicitCorrect =
      token === "Đ" || token === "ĐÚNG" || token === "TRUE";
    text = text.slice(0, tfSuffix.index).trim();
  } else if (match[1] === "*") {
    explicitCorrect = true;
  }

  const isFormatted = line.includes(BOLD_OPEN);
  return { label, text, explicitCorrect, isFormatted };
}

function inferTitleFromPreamble(preambleLines: string[]): string {
  const skipRe =
    /^(?:SỞ\s+GD|PHÒNG\s+GD|BỘ\s+GD|TRƯỜNG\s+|HỌ\s+VÀ\s+TÊN|SỐ\s+BÁO\s+DANH|MÃ\s+ĐỀ|THỜI\s+GIAN|NĂM\s+HỌC|ĐỀ\s+CHÍNH\s+THỨC)/i;
  const cleaned = preambleLines
    .map(stripMarkers)
    .filter((l) => l.length >= 4 && !skipRe.test(l) && !/^[-_=|]+$/.test(l));

  if (cleaned.length === 0) return "Đề kiểm tra nhập từ Word";
  return cleaned[0].slice(0, 120);
}

function parseAnswerKeyTable(
  lines: string[],
): Map<number, string> {
  const map = new Map<number, string>();
  const joined = lines.map(stripMarkers).join(" ");
  const pairRe = /(?:Câu\s*)?(\d+)\s*[.:\-|]\s*([A-D]|Đúng|Sai|[^\s;|]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = pairRe.exec(joined)) !== null) {
    const qNum = Number(m[1]);
    if (Number.isInteger(qNum) && qNum > 0) {
      map.set(qNum, m[2].trim());
    }
  }
  return map;
}

interface WorkingQuestion {
  number: number;
  partHint: 1 | 2 | 3 | null;
  stemLines: string[];
  options: ParsedOptionToken[];
  subItems: ParsedSubItemToken[];
  explicitAnswerRaw: string | null;
  explanationLines: string[];
  answerUnit?: string;
}

function parseLinesToQuiz(annotatedText: string): ParsedQuizResult {
  const lines = annotatedText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const warnings: string[] = [];
  const preambleLines: string[] = [];
  const workingQuestions: WorkingQuestion[] = [];
  const trailingAnswerLines: string[] = [];

  let currentPart: 1 | 2 | 3 | null = null;
  let currentQ: WorkingQuestion | null = null;
  let inAnswerSection = false;
  let inExplanation = false;

  const flushQuestion = () => {
    if (currentQ) {
      workingQuestions.push(currentQ);
      currentQ = null;
      inExplanation = false;
    }
  };

  for (const line of lines) {
    const cleanLine = stripMarkers(line);

    if (ANSWER_SECTION_RE.test(cleanLine)) {
      flushQuestion();
      inAnswerSection = true;
      continue;
    }

    if (inAnswerSection) {
      trailingAnswerLines.push(cleanLine);
      continue;
    }

    const partMatch = cleanLine.match(PART_HEADER_RE);
    if (partMatch) {
      flushQuestion();
      const numeral = partMatch[1].toUpperCase();
      if (numeral === "I" || numeral === "1") currentPart = 1;
      else if (numeral === "II" || numeral === "2") currentPart = 2;
      else if (numeral === "III" || numeral === "3") currentPart = 3;
      continue;
    }

    const qMatch = cleanLine.match(QUESTION_HEADER_RE);
    if (qMatch) {
      flushQuestion();
      const qNum = Number(qMatch[1]);
      // Keep bold-stripped clean stem text
      const stemAfterHeader = qMatch[2].trim();
      currentQ = {
        number: qNum,
        partHint: currentPart,
        stemLines: stemAfterHeader ? [stemAfterHeader] : [],
        options: [],
        subItems: [],
        explicitAnswerRaw: null,
        explanationLines: [],
      };
      continue;
    }

    if (!currentQ) {
      preambleLines.push(line);
      continue;
    }

    const expMatch = cleanLine.match(EXPLANATION_LINE_RE);
    if (expMatch) {
      inExplanation = true;
      currentQ.explanationLines.push(expMatch[1].trim());
      continue;
    }

    const ansMatch = cleanLine.match(ANSWER_LINE_RE);
    if (ansMatch) {
      inExplanation = false;
      currentQ.explicitAnswerRaw = ansMatch[1].trim();
      continue;
    }

    const unitMatch = cleanLine.match(UNIT_LINE_RE);
    if (unitMatch) {
      currentQ.answerUnit = unitMatch[1].trim();
      continue;
    }

    if (inExplanation) {
      currentQ.explanationLines.push(cleanLine);
      continue;
    }

    // Check Part I MCQ options (`A. ... B. ...`)
    const mcqOpts = extractMcqOptionsFromLine(line);
    if (mcqOpts.length > 0 && currentQ.subItems.length === 0) {
      currentQ.options.push(...mcqOpts);
      continue;
    }

    // Check Part II True/False sub-items (`a) ...`)
    const subItem = extractSubItemFromLine(line);
    if (subItem && currentQ.options.length === 0) {
      currentQ.subItems.push(subItem);
      continue;
    }

    // Continuation of option text or question stem
    if (currentQ.options.length > 0) {
      const lastOpt = currentQ.options[currentQ.options.length - 1];
      lastOpt.text = `${lastOpt.text} ${cleanLine}`.trim();
      if (line.includes(BOLD_OPEN)) lastOpt.isFormatted = true;
    } else if (currentQ.subItems.length > 0) {
      const lastSub = currentQ.subItems[currentQ.subItems.length - 1];
      lastSub.text = `${lastSub.text} ${cleanLine}`.trim();
    } else {
      currentQ.stemLines.push(cleanLine);
    }
  }

  flushQuestion();

  const bottomAnswerMap = parseAnswerKeyTable(trailingAnswerLines);
  const title = inferTitleFromPreamble(preambleLines);

  const questions: Question[] = workingQuestions.map((wq, idx) => {
    const qLabel = `Câu ${wq.number || idx + 1}`;
    const stem = wq.stemLines.join(" ").trim();
    const explanation =
      wq.explanationLines.length > 0
        ? wq.explanationLines.join(" ").trim()
        : undefined;
    const bottomAns = bottomAnswerMap.get(wq.number);
    const answerRaw = wq.explicitAnswerRaw ?? bottomAns ?? null;

    // 1. Part II: True/False group
    if (
      wq.subItems.length > 0 ||
      (wq.partHint === 2 && wq.options.length === 0)
    ) {
      // Parse answer string like "a) Đ, b) S, c) Đ, d) S" or "Đ-S-Đ-S"
      const explicitMap = new Map<string, boolean>();
      if (answerRaw) {
        const labeledMatches = [
          ...answerRaw.matchAll(/([a-d])\s*[):-]?[ \t]*(Đúng|Sai|Đ|S|T|F)/gi),
        ];
        if (labeledMatches.length > 0) {
          for (const m of labeledMatches) {
            const k = m[1].toLowerCase();
            const val = m[2].toUpperCase();
            explicitMap.set(
              k,
              val === "Đ" || val === "ĐÚNG" || val === "T",
            );
          }
        } else {
          const seqTokens = answerRaw
            .split(/[\s,;/|-]+/)
            .map((s) => s.trim().toUpperCase())
            .filter((s) => ["Đ", "S", "ĐÚNG", "SAI", "T", "F"].includes(s));
          seqTokens.forEach((tok, si) => {
            const lbl = (["a", "b", "c", "d"] as const)[si];
            if (lbl) {
              explicitMap.set(lbl, tok === "Đ" || tok === "ĐÚNG" || tok === "T");
            }
          });
        }
      }

      const formattedCount = wq.subItems.filter((s) => s.isFormatted).length;
      const useFormattedAsTrue =
        formattedCount > 0 && formattedCount < wq.subItems.length;

      let hasAnyTrueFalseMark = explicitMap.size > 0 || useFormattedAsTrue;
      const subItems: TrueFalseSubItem[] = wq.subItems.map((s) => {
        let isCorrect = false;
        if (s.explicitCorrect !== null) {
          isCorrect = s.explicitCorrect;
          hasAnyTrueFalseMark = true;
        } else if (explicitMap.has(s.label)) {
          isCorrect = explicitMap.get(s.label)!;
        } else if (useFormattedAsTrue) {
          isCorrect = s.isFormatted;
        }
        return {
          label: s.label,
          text: s.text,
          isCorrect,
        };
      });

      if (subItems.length < 4) {
        warnings.push(
          `${qLabel}: Phần Đúng/Sai hiện có ${subItems.length}/4 ý (a, b, c, d).`,
        );
      }
      if (!hasAnyTrueFalseMark && subItems.length > 0) {
        warnings.push(
          `${qLabel}: Chưa xác định được ý nào Đúng/Sai (gợi ý ghi (Đ)/(S) hoặc Đáp án: Đ-S-Đ-S).`,
        );
      }

      return {
        question: stem || qLabel,
        questionType: "true_false_group",
        options: [],
        correctAnswer: 0,
        subItems,
        ...(explanation ? { explanation } : {}),
      };
    }

    // 2. Part III: Short answer
    if (
      wq.options.length === 0 &&
      (wq.partHint === 3 || answerRaw !== null)
    ) {
      const acceptedAnswers = answerRaw
        ? answerRaw
            .split(/\s*(?:\||;|hoặc)\s*/i)
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      if (acceptedAnswers.length === 0) {
        warnings.push(`${qLabel}: Câu trả lời ngắn chưa có dòng "Đáp án: ...".`);
      }

      return {
        question: stem || qLabel,
        questionType: "short_answer",
        options: [],
        correctAnswer: 0,
        acceptedAnswers,
        ...(wq.answerUnit ? { answerUnit: wq.answerUnit } : {}),
        ...(explanation ? { explanation } : {}),
      };
    }

    // 3. Part I: MCQ
    let correctIdx = -1;

    // Priority 1: explicit Đáp án: B
    if (answerRaw) {
      const letterMatch = answerRaw.match(/^([A-D])\b/i);
      if (letterMatch) {
        const idxByLetter = wq.options.findIndex(
          (o) => o.letter === letterMatch[1].toUpperCase(),
        );
        if (idxByLetter >= 0) correctIdx = idxByLetter;
      }
    }

    // Priority 2: leading * (*A.)
    if (correctIdx < 0) {
      const starIdx = wq.options.findIndex((o) => o.isStarred);
      if (starIdx >= 0) correctIdx = starIdx;
    }

    // Priority 3: bold/underline formatting when uniquely applied (not all options)
    if (correctIdx < 0) {
      const formattedIndices = wq.options
        .map((o, i) => (o.isFormatted ? i : -1))
        .filter((i) => i >= 0);
      if (
        formattedIndices.length > 0 &&
        formattedIndices.length < wq.options.length
      ) {
        correctIdx = formattedIndices[0];
      }
    }

    if (wq.options.length < 2) {
      warnings.push(
        `${qLabel}: Chỉ nhận diện được ${wq.options.length} phương án lựa chọn.`,
      );
    }

    if (correctIdx < 0) {
      correctIdx = 0;
      if (wq.options.length >= 2) {
        warnings.push(
          `${qLabel}: Chưa tìm thấy đánh dấu đáp án đúng (in đậm, gạch chân, * hoặc "Đáp án: ..."), tạm chọn A.`,
        );
      }
    }

    return {
      question: stem || qLabel,
      questionType: "mcq",
      options: wq.options.map((o) => o.text),
      correctAnswer: correctIdx,
      ...(explanation ? { explanation } : {}),
    };
  });

  if (questions.length === 0) {
    warnings.push(
      'Không tìm thấy câu hỏi nào. Hãy đảm bảo mỗi câu bắt đầu bằng "Câu 1.", "Câu 1:" hoặc "Bài 1:".',
    );
  }

  return { title, questions, warnings };
}

/**
 * Parses raw Vietnamese exam text (with optional `*A.`, `Đáp án:`, `(Đ)`/`(S)`) into QuizKen `Question[]`.
 */
export function parseQuizRawText(text: string): ParsedQuizResult {
  const normalized = (text || "").replace(/\r\n/g, "\n");
  return parseLinesToQuiz(normalized);
}

/**
 * Parses a Word `.docx` `ArrayBuffer` client-side using `mammoth`,
 * preserving bold and underline formatting to detect correct answers.
 */
export async function parseDocxArrayBuffer(
  buffer: ArrayBuffer,
): Promise<ParsedQuizResult> {
  const result = await mammoth.convertToHtml(toMammothInput(buffer), {
    styleMap: ["u => u"],
  });
  const annotatedText = htmlToAnnotatedText(result.value);
  const parsed = parseLinesToQuiz(annotatedText);

  const mammothWarnings = result.messages
    .filter((m) => m.type === "warning" && m.message)
    .slice(0, 3)
    .map((m) => `Word format: ${m.message}`);

  return {
    title: parsed.title,
    questions: parsed.questions,
    warnings: [...parsed.warnings, ...mammothWarnings],
  };
}
