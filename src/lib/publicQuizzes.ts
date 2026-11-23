export type PublicQuestionType = "mcq" | "true_false_group" | "short_answer";

export interface PublicTrueFalseSubItem {
  id?: string;
  label?: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface PublicQuizQuestion {
  id: string;
  question: string;
  questionType: PublicQuestionType;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  subItems?: PublicTrueFalseSubItem[];
  acceptedAnswers?: string[];
  answerUnit?: string;
}

export interface PublicQuizSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  tags: string[];
  questionCount: number;
  usageCount: number;
  attempts: number;
  createdAt: string;
  updatedAt: string;
}

export interface PublicQuizDetail extends PublicQuizSummary {
  questions: PublicQuizQuestion[];
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function slugifyVietnamese(input: string): string {
  const normalized = input
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72)
    .replace(/-+$/g, "");

  return normalized || "de-thi";
}

export function buildQuizSlug(title: string, id: string): string {
  return `${slugifyVietnamese(title)}--${id}`;
}

export function extractQuizIdFromSlug(slug: string): string | null {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).trim();
  const sepIndex = decoded.lastIndexOf("--");
  const candidate = sepIndex !== -1 ? decoded.slice(sepIndex + 2) : decoded;

  if (UUID_REGEX.test(candidate)) {
    return candidate;
  }
  return null;
}

function getSupabaseConfig(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

function parseQuestionsArray(raw: unknown): PublicQuizQuestion[] {
  let list: unknown = raw;
  if (typeof raw === "string") {
    try {
      list = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(list)) return [];

  const parsed: PublicQuizQuestion[] = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (!item || typeof item !== "object") continue;
    const obj = item as Record<string, unknown>;
    const qText =
      typeof obj.question === "string" && obj.question.trim()
        ? obj.question.trim()
        : "";
    if (!qText) continue;

    const rawType = obj.questionType;
    const questionType: PublicQuestionType =
      rawType === "true_false_group" || rawType === "short_answer"
        ? rawType
        : "mcq";

    const options = Array.isArray(obj.options)
      ? obj.options.filter((o): o is string => typeof o === "string")
      : [];

    const correctAnswer =
      typeof obj.correctAnswer === "number" && Number.isFinite(obj.correctAnswer)
        ? obj.correctAnswer
        : 0;

    const subItems = Array.isArray(obj.subItems)
      ? obj.subItems
          .filter(
            (s): s is Record<string, unknown> =>
              Boolean(s && typeof s === "object")
          )
          .map((s, sIdx) => ({
            id: typeof s.id === "string" ? s.id : `sub-${i}-${sIdx}`,
            label:
              typeof s.label === "string"
                ? s.label
                : String.fromCharCode(97 + sIdx),
            text: typeof s.text === "string" ? s.text : "",
            isCorrect: Boolean(s.isCorrect),
            explanation:
              typeof s.explanation === "string" ? s.explanation : undefined,
          }))
          .filter((s) => s.text.trim().length > 0)
      : undefined;

    const acceptedAnswers = Array.isArray(obj.acceptedAnswers)
      ? obj.acceptedAnswers.filter((a): a is string => typeof a === "string")
      : undefined;

    if (questionType === "mcq" && options.length < 2) {
      continue;
    }

    parsed.push({
      id: typeof obj.id === "string" && obj.id ? obj.id : `q-${i + 1}`,
      question: qText,
      questionType,
      options,
      correctAnswer,
      explanation:
        typeof obj.explanation === "string" && obj.explanation.trim()
          ? obj.explanation.trim()
          : undefined,
      subItems,
      acceptedAnswers,
      answerUnit:
        typeof obj.answerUnit === "string" && obj.answerUnit.trim()
          ? obj.answerUnit.trim()
          : undefined,
    });
  }

  return parsed;
}

interface RawSupabaseQuizRow {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: string | null;
  tags: string[] | null;
  questions: unknown;
  usage_count: number | null;
  attempts: number | null;
  created_at: string;
  updated_at: string | null;
}

const PROHIBITED_CONTENT_PATTERNS: RegExp[] = [
  // Gambling, betting, illegal finance
  /\b(nhà\s*cái|cá\s*độ|cá\s*cược|tài\s*xỉu|nổ\s*hũ|xóc\s*đĩa|lô\s*đề|xổ\s*số\s*lô|kubet|sv388|w88|fb88|fun88|m88|188bet|bk8|789bet|f8bet|hi88|new88|jun88|shbet|go88|sunwin|rikvip|b52\s*club|hitclub|casino|betting|slot\s*game|bắn\s*cá\s*đổi\s*thưởng|game\s*bài\s*đổi\s*thưởng|vay\s*tiền\s*nhanh|tín\s*dụng\s*đen)\b/i,
  // Adult / 18+ / NSFW
  /\b(phim\s*sex|web\s*sex|ảnh\s*sex|xxx|jav\s*hd|xvideos|pornhub|xnxx|hentai|18\+|onlyfans|gái\s*gọi|massage\s*kích\s*dục|sugar\s*baby)\b/i,
  // Illegal hacking, cracking, phishing, drugs, weapons
  /\b(hack\s*tài\s*khoản|crack\s*phần\s*mềm|keylog|ddos\s*attack|mua\s*bán\s*ma\s*túy|cần\s*sa|thuốc\s*lắc|vũ\s*khí\s*nóng|lừa\s*đảo\s*chiếm\s*đoạt)\b/i,
  // Severe profanity
  /\b(địt\s*mẹ|đụ\s*mẹ|vãi\s*lồn|cái\s*lồn|con\s*cặc|đầu\s*buồi)\b/i,
];

const RAW_URL_SPAM_RE = /\b(?:https?:\/\/|www\.)[^\s<>"]+/gi;

export function isSafePublicQuizContent(text: string): boolean {
  if (!text) return true;
  const normalized = text.normalize("NFC");
  for (const pattern of PROHIBITED_CONTENT_PATTERNS) {
    if (pattern.test(normalized)) {
      return false;
    }
  }
  return true;
}

export function sanitizePublicText(text: string): string {
  return text.replace(RAW_URL_SPAM_RE, "").replace(/\s{2,}/g, " ").trim();
}

function mapRowToDetail(row: RawSupabaseQuizRow): PublicQuizDetail | null {
  if (!row.id || !row.title) return null;

  const rawTitle = row.title.trim();
  const rawDescription = row.description?.trim() || "";
  if (
    !isSafePublicQuizContent(rawTitle) ||
    !isSafePublicQuizContent(rawDescription)
  ) {
    return null;
  }

  const title = sanitizePublicText(rawTitle);
  if (title.length < 3) return null;

  const questions = parseQuestionsArray(row.questions);
  if (questions.length < 5) return null;

  for (const q of questions) {
    const combinedQ = [
      q.question,
      q.explanation ?? "",
      ...q.options,
      ...(q.subItems?.map((s) => s.text) ?? []),
    ].join(" ");
    if (!isSafePublicQuizContent(combinedQ)) {
      return null;
    }
  }

  const cleanedDesc = sanitizePublicText(rawDescription);
  const updatedAt = row.updated_at || row.created_at;

  const safeTags = Array.isArray(row.tags)
    ? row.tags
        .filter(
          (t): t is string =>
            typeof t === "string" &&
            t.trim().length > 0 &&
            isSafePublicQuizContent(t)
        )
        .map((t) => sanitizePublicText(t))
        .filter((t) => t.length > 0)
    : [];

  return {
    id: row.id,
    slug: buildQuizSlug(title, row.id),
    title,
    description:
      cleanedDesc ||
      `Bộ đề thi trắc nghiệm "${title}" do cộng đồng QuizKen biên soạn và chia sẻ công khai, hỗ trợ ôn tập và thi thử trực tuyến miễn phí.`,
    category: row.category?.trim() || "general",
    difficulty: row.difficulty?.trim() || "medium",
    tags: safeTags,
    questionCount: questions.length,
    usageCount: typeof row.usage_count === "number" ? row.usage_count : 0,
    attempts: typeof row.attempts === "number" ? row.attempts : 0,
    createdAt: row.created_at,
    updatedAt,
    questions,
  };
}

const SELECT_COLUMNS =
  "id,title,description,category,difficulty,tags,questions,usage_count,attempts,created_at,updated_at";

async function supabaseRestFetch<T>(pathAndQuery: string): Promise<T | null> {
  const config = getSupabaseConfig();
  if (!config) return null;

  try {
    const res = await fetch(`${config.url}/rest/v1/${pathAndQuery}`, {
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchPublicQuizzes(
  limit: number = 60
): Promise<PublicQuizSummary[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 120);
  const query =
    `quizzes?select=${SELECT_COLUMNS}` +
    `&is_public=eq.true` +
    `&status=eq.completed` +
    `&order=updated_at.desc.nullslast,created_at.desc` +
    `&limit=${safeLimit}`;

  const rows = await supabaseRestFetch<RawSupabaseQuizRow[]>(query);
  if (!Array.isArray(rows)) return [];

  const summaries: PublicQuizSummary[] = [];
  for (const row of rows) {
    const detail = mapRowToDetail(row);
    if (!detail) continue;
    const { questions: _ignored, ...summary } = detail;
    void _ignored;
    summaries.push(summary);
  }
  return summaries;
}

export async function fetchPublicQuizBySlug(
  slug: string
): Promise<PublicQuizDetail | null> {
  const id = extractQuizIdFromSlug(slug);
  if (!id) return null;

  const query =
    `quizzes?select=${SELECT_COLUMNS}` +
    `&id=eq.${encodeURIComponent(id)}` +
    `&is_public=eq.true` +
    `&status=eq.completed` +
    `&limit=1`;

  const rows = await supabaseRestFetch<RawSupabaseQuizRow[]>(query);
  if (!Array.isArray(rows) || rows.length === 0) return null;

  return mapRowToDetail(rows[0]);
}

export async function fetchPublicQuizSlugs(): Promise<
  { slug: string; updatedAt: string }[]
> {
  const quizzes = await fetchPublicQuizzes(100);
  return quizzes.map((q) => ({
    slug: q.slug,
    updatedAt: q.updatedAt,
  }));
}
