// Safe, deterministic pure-TypeScript Python 3 educational subset interpreter.
// 100% AST-interpreted in memory, zero dynamic code execution, zero network calls.

export type PythonRunResult = {
  output: string[];
  error?: string;
  stepsExecuted: number;
  durationMs: number;
  variables: Record<string, string>;
};

export type RunPythonOptions = {
  maxSteps?: number;
  maxDepth?: number;
  maxOutputLines?: number;
};

const DEFAULT_MAX_STEPS = 10_000;
const DEFAULT_MAX_DEPTH = 150;
const DEFAULT_MAX_OUTPUT_LINES = 500;
const MAX_COLLECTION_SIZE = 10_000;

class InterpreterError extends Error {
  line?: number;
  constructor(message: string, line?: number) {
    super(line ? `Dòng ${line}: ${message}` : message);
    this.line = line;
  }
}

class ReturnSignal {
  value: PyValue;
  constructor(value: PyValue) {
    this.value = value;
  }
}

class BreakSignal {}
class ContinueSignal {}

// --- Runtime Value Types ---

type PyList = { __py: "list"; items: PyValue[] };
type PyTuple = { __py: "tuple"; items: PyValue[] };
type PyDict = { __py: "dict"; entries: Map<string, { key: PyValue; value: PyValue }> };
type PyFunction = {
  __py: "fn";
  name: string;
  params: { name: string; defaultExpr?: Expr }[];
  body: Stmt[];
  closure: Env;
};
type PyBuiltin = {
  __py: "builtin";
  name: string;
  fn: (args: PyValue[], kwargs: Record<string, PyValue>, line: number) => PyValue;
};
type PyModule = {
  __py: "module";
  name: string;
  members: Record<string, PyValue>;
};
type PyRange = {
  __py: "range";
  start: number;
  stop: number;
  step: number;
};

export type PyValue =
  | number
  | string
  | boolean
  | null
  | PyList
  | PyTuple
  | PyDict
  | PyFunction
  | PyBuiltin
  | PyModule
  | PyRange;

function pyList(items: PyValue[]): PyList {
  if (items.length > MAX_COLLECTION_SIZE) {
    throw new InterpreterError(`Danh sách vượt quá giới hạn an toàn (${MAX_COLLECTION_SIZE} phần tử).`);
  }
  return { __py: "list", items };
}

function pyTuple(items: PyValue[]): PyTuple {
  return { __py: "tuple", items };
}

function pyDict(): PyDict {
  return { __py: "dict", entries: new Map() };
}

function isPyObject(v: PyValue): v is PyList | PyTuple | PyDict | PyFunction | PyBuiltin | PyModule | PyRange {
  return typeof v === "object" && v !== null && "__py" in v;
}

function dictKey(k: PyValue): string {
  if (typeof k === "string") return `s:${k}`;
  if (typeof k === "number") return `n:${k}`;
  if (typeof k === "boolean") return `b:${k ? 1 : 0}`;
  if (k === null) return "none";
  if (isPyObject(k) && k.__py === "tuple") {
    return `t:(${k.items.map(dictKey).join(",")})`;
  }
  throw new InterpreterError("Khóa (key) của dict phải là kiểu bất biến (int, str, bool, tuple).");
}

function formatPyValue(v: PyValue, inContainer = false): string {
  if (v === null) return "None";
  if (typeof v === "boolean") return v ? "True" : "False";
  if (typeof v === "number") {
    if (Object.is(v, -0)) return "0";
    return String(v);
  }
  if (typeof v === "string") {
    if (!inContainer) return v;
    return `'${v.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
  }
  switch (v.__py) {
    case "list":
      return `[${v.items.map((item) => formatPyValue(item, true)).join(", ")}]`;
    case "tuple":
      if (v.items.length === 1) return `(${formatPyValue(v.items[0], true)},)`;
      return `(${v.items.map((item) => formatPyValue(item, true)).join(", ")})`;
    case "dict": {
      const parts: string[] = [];
      for (const entry of v.entries.values()) {
        parts.push(`${formatPyValue(entry.key, true)}: ${formatPyValue(entry.value, true)}`);
      }
      return `{${parts.join(", ")}}`;
    }
    case "range":
      return v.step === 1 ? `range(${v.start}, ${v.stop})` : `range(${v.start}, ${v.stop}, ${v.step})`;
    case "fn":
      return `<function ${v.name}>`;
    case "builtin":
      return `<built-in function ${v.name}>`;
    case "module":
      return `<module '${v.name}'>`;
  }
}

function isTruthy(v: PyValue): boolean {
  if (v === null || v === false) return false;
  if (v === true) return true;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") return v.length > 0;
  switch (v.__py) {
    case "list":
    case "tuple":
      return v.items.length > 0;
    case "dict":
      return v.entries.size > 0;
    case "range":
      return rangeLength(v) > 0;
    default:
      return true;
  }
}

function rangeLength(r: PyRange): number {
  if (r.step > 0) {
    return r.stop > r.start ? Math.ceil((r.stop - r.start) / r.step) : 0;
  }
  return r.stop < r.start ? Math.ceil((r.start - r.stop) / -r.step) : 0;
}

function toIterable(v: PyValue, line: number): PyValue[] {
  if (typeof v === "string") {
    return Array.from(v);
  }
  if (isPyObject(v)) {
    if (v.__py === "list" || v.__py === "tuple") return v.items;
    if (v.__py === "dict") {
      return Array.from(v.entries.values()).map((e) => e.key);
    }
    if (v.__py === "range") {
      const len = rangeLength(v);
      if (len > MAX_COLLECTION_SIZE) {
        throw new InterpreterError(`range() quá lớn (${len} phần tử, tối đa ${MAX_COLLECTION_SIZE}).`, line);
      }
      const res: number[] = [];
      if (v.step > 0) {
        for (let i = v.start; i < v.stop; i += v.step) res.push(i);
      } else {
        for (let i = v.start; i > v.stop; i += v.step) res.push(i);
      }
      return res;
    }
  }
  throw new InterpreterError(`Đối tượng kiểu '${typeofPy(v)}' không thể duyệt lặp (not iterable).`, line);
}

function typeofPy(v: PyValue): string {
  if (v === null) return "NoneType";
  if (typeof v === "boolean") return "bool";
  if (typeof v === "number") return Number.isInteger(v) ? "int" : "float";
  if (typeof v === "string") return "str";
  return v.__py;
}

function pyEquals(a: PyValue, b: PyValue): boolean {
  if (a === b) return true;
  if (typeof a === "boolean" && typeof b === "number") return (a ? 1 : 0) === b;
  if (typeof a === "number" && typeof b === "boolean") return a === (b ? 1 : 0);
  if (a === null || b === null) return false;
  if (isPyObject(a) && isPyObject(b) && a.__py === b.__py) {
    if (a.__py === "list" && b.__py === "list") {
      return a.items.length === b.items.length && a.items.every((item, i) => pyEquals(item, b.items[i]));
    }
    if (a.__py === "tuple" && b.__py === "tuple") {
      return a.items.length === b.items.length && a.items.every((item, i) => pyEquals(item, b.items[i]));
    }
    if (a.__py === "dict" && b.__py === "dict") {
      if (a.entries.size !== b.entries.size) return false;
      for (const [k, entry] of a.entries.entries()) {
        const other = b.entries.get(k);
        if (!other || !pyEquals(entry.value, other.value)) return false;
      }
      return true;
    }
  }
  return false;
}

function pyCompareOrder(a: PyValue, b: PyValue, line: number): number {
  const numA = typeof a === "boolean" ? (a ? 1 : 0) : typeof a === "number" ? a : null;
  const numB = typeof b === "boolean" ? (b ? 1 : 0) : typeof b === "number" ? b : null;
  if (numA !== null && numB !== null) {
    return numA < numB ? -1 : numA > numB ? 1 : 0;
  }
  if (typeof a === "string" && typeof b === "string") {
    return a < b ? -1 : a > b ? 1 : 0;
  }
  if (
    isPyObject(a) &&
    isPyObject(b) &&
    ((a.__py === "list" && b.__py === "list") || (a.__py === "tuple" && b.__py === "tuple"))
  ) {
    const minLen = Math.min(a.items.length, b.items.length);
    for (let i = 0; i < minLen; i++) {
      const cmp = pyCompareOrder(a.items[i], b.items[i], line);
      if (cmp !== 0) return cmp;
    }
    return a.items.length - b.items.length;
  }
  throw new InterpreterError(`Không thể so sánh giữa '${typeofPy(a)}' và '${typeofPy(b)}'.`, line);
}

// --- Lexer ---

type TokenType =
  | "NUMBER"
  | "STRING"
  | "FSTRING"
  | "IDENT"
  | "KEYWORD"
  | "OP"
  | "NEWLINE"
  | "INDENT"
  | "DEDENT"
  | "EOF";

type Token = {
  type: TokenType;
  value: string;
  line: number;
};

const KEYWORDS = new Set([
  "False",
  "None",
  "True",
  "and",
  "as",
  "break",
  "continue",
  "def",
  "elif",
  "else",
  "for",
  "from",
  "global",
  "if",
  "import",
  "in",
  "is",
  "not",
  "or",
  "pass",
  "return",
  "while",
]);

const MULTI_OPS = [
  "**=",
  "//=",
  "==",
  "!=",
  "<=",
  ">=",
  "//",
  "**",
  "+=",
  "-=",
  "*=",
  "/=",
  "%=",
  "->",
];

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  const normalized = source.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rawLines = normalized.split("\n");
  const indentStack = [0];
  let bracketDepth = 0;

  for (let lineIdx = 0; lineIdx < rawLines.length; lineIdx++) {
    const lineNum = lineIdx + 1;
    const rawLine = rawLines[lineIdx];

    // Measure leading indentation (tab = 4 spaces)
    let pos = 0;
    let indent = 0;
    while (pos < rawLine.length && (rawLine[pos] === " " || rawLine[pos] === "\t")) {
      indent += rawLine[pos] === "\t" ? 4 : 1;
      pos++;
    }

    // Blank or comment-only line
    if (pos >= rawLine.length || rawLine[pos] === "#") {
      continue;
    }

    if (bracketDepth === 0) {
      const currentIndent = indentStack[indentStack.length - 1];
      if (indent > currentIndent) {
        indentStack.push(indent);
        tokens.push({ type: "INDENT", value: "", line: lineNum });
      } else if (indent < currentIndent) {
        while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
          indentStack.pop();
          tokens.push({ type: "DEDENT", value: "", line: lineNum });
        }
        if (indent !== indentStack[indentStack.length - 1]) {
          throw new InterpreterError("Lỗi thụt lề (IndentationError): mức thụt đầu dòng không khớp.", lineNum);
        }
      }
    }

    while (pos < rawLine.length) {
      const ch = rawLine[pos];

      if (ch === " " || ch === "\t") {
        pos++;
        continue;
      }

      if (ch === "#") {
        break;
      }

      // F-string or normal string
      const isFString =
        (ch === "f" || ch === "F") &&
        pos + 1 < rawLine.length &&
        (rawLine[pos + 1] === '"' || rawLine[pos + 1] === "'");

      if (isFString || ch === '"' || ch === "'") {
        if (isFString) pos++;
        const quote = rawLine[pos];
        const isTriple = rawLine.slice(pos, pos + 3) === quote.repeat(3);
        if (isTriple) {
          pos += 3;
          let content = "";
          let closed = false;
          while (lineIdx < rawLines.length) {
            const curLine = rawLines[lineIdx];
            while (pos < curLine.length) {
              if (curLine.slice(pos, pos + 3) === quote.repeat(3)) {
                pos += 3;
                closed = true;
                break;
              }
              if (curLine[pos] === "\\" && pos + 1 < curLine.length) {
                content += decodeEscape(curLine[pos + 1]);
                pos += 2;
              } else {
                content += curLine[pos];
                pos++;
              }
            }
            if (closed) break;
            content += "\n";
            lineIdx++;
            pos = 0;
          }
          if (!closed) {
            throw new InterpreterError("Chuỗi ba dấu nháy chưa được đóng.", lineNum);
          }
          tokens.push({ type: isFString ? "FSTRING" : "STRING", value: content, line: lineNum });
          continue;
        } else {
          pos++;
          let content = "";
          let closed = false;
          while (pos < rawLine.length) {
            const c = rawLine[pos];
            if (c === quote) {
              pos++;
              closed = true;
              break;
            }
            if (c === "\\" && pos + 1 < rawLine.length) {
              content += decodeEscape(rawLine[pos + 1]);
              pos += 2;
            } else {
              content += c;
              pos++;
            }
          }
          if (!closed) {
            throw new InterpreterError("Chuỗi chưa được đóng dấu nháy.", lineNum);
          }
          tokens.push({ type: isFString ? "FSTRING" : "STRING", value: content, line: lineNum });
          continue;
        }
      }

      // Number
      if (/[0-9]/.test(ch) || (ch === "." && pos + 1 < rawLine.length && /[0-9]/.test(rawLine[pos + 1]))) {
        const start = pos;
        while (pos < rawLine.length && /[0-9_]/.test(rawLine[pos])) pos++;
        if (pos < rawLine.length && rawLine[pos] === ".") {
          pos++;
          while (pos < rawLine.length && /[0-9_]/.test(rawLine[pos])) pos++;
        }
        if (pos < rawLine.length && (rawLine[pos] === "e" || rawLine[pos] === "E")) {
          pos++;
          if (pos < rawLine.length && (rawLine[pos] === "+" || rawLine[pos] === "-")) pos++;
          while (pos < rawLine.length && /[0-9]/.test(rawLine[pos])) pos++;
        }
        const numStr = rawLine.slice(start, pos).replace(/_/g, "");
        tokens.push({ type: "NUMBER", value: numStr, line: lineNum });
        continue;
      }

      // Identifier or keyword
      if (/[A-Za-z_]/.test(ch)) {
        const start = pos;
        while (pos < rawLine.length && /[A-Za-z0-9_]/.test(rawLine[pos])) pos++;
        const word = rawLine.slice(start, pos);
        tokens.push({
          type: KEYWORDS.has(word) ? "KEYWORD" : "IDENT",
          value: word,
          line: lineNum,
        });
        continue;
      }

      // Multi-char operators
      const matchedMulti = MULTI_OPS.find((op) => rawLine.startsWith(op, pos));
      if (matchedMulti) {
        tokens.push({ type: "OP", value: matchedMulti, line: lineNum });
        pos += matchedMulti.length;
        continue;
      }

      // Single-char operators & delimiters
      if ("+-*/%<>=!()[]{}:.,;".includes(ch)) {
        if ("([{".includes(ch)) bracketDepth++;
        if (")]}".includes(ch)) bracketDepth = Math.max(0, bracketDepth - 1);
        tokens.push({ type: "OP", value: ch, line: lineNum });
        pos++;
        continue;
      }

      throw new InterpreterError(`Ký tự không hợp lệ '${ch}'.`, lineNum);
    }

    if (bracketDepth === 0) {
      tokens.push({ type: "NEWLINE", value: "\n", line: lineNum });
    }
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    tokens.push({ type: "DEDENT", value: "", line: rawLines.length });
  }

  tokens.push({ type: "EOF", value: "", line: rawLines.length });
  return tokens;
}

function decodeEscape(ch: string): string {
  switch (ch) {
    case "n":
      return "\n";
    case "t":
      return "\t";
    case "r":
      return "\r";
    case "\\":
      return "\\";
    case "'":
      return "'";
    case '"':
      return '"';
    default:
      return "\\" + ch;
  }
}

// --- AST Definitions ---

type Target =
  | { kind: "ident"; name: string; line: number }
  | { kind: "index"; object: Expr; index: Expr; line: number }
  | { kind: "tuple"; items: Target[]; line: number };

type Stmt =
  | { kind: "assign"; targets: Target[]; value: Expr; line: number }
  | { kind: "augAssign"; target: Target; op: string; value: Expr; line: number }
  | { kind: "expr"; expr: Expr; line: number }
  | { kind: "if"; branches: { test: Expr; body: Stmt[] }[]; elseBody: Stmt[]; line: number }
  | { kind: "while"; test: Expr; body: Stmt[]; line: number }
  | { kind: "for"; targets: string[]; iter: Expr; body: Stmt[]; line: number }
  | { kind: "def"; name: string; params: { name: string; defaultExpr?: Expr }[]; body: Stmt[]; line: number }
  | { kind: "return"; value?: Expr; line: number }
  | { kind: "break"; line: number }
  | { kind: "continue"; line: number }
  | { kind: "pass"; line: number }
  | { kind: "global"; names: string[]; line: number }
  | { kind: "import"; module: string; alias?: string; names?: { name: string; alias?: string }[]; line: number };

type FStringPart =
  | { kind: "text"; value: string }
  | { kind: "expr"; expr: Expr; formatSpec?: string };

type Expr =
  | { kind: "literal"; value: number | string | boolean | null; line: number }
  | { kind: "fstring"; parts: FStringPart[]; line: number }
  | { kind: "ident"; name: string; line: number }
  | { kind: "list"; elements: Expr[]; line: number }
  | { kind: "tuple"; elements: Expr[]; line: number }
  | { kind: "dict"; entries: { key: Expr; value: Expr }[]; line: number }
  | { kind: "listComp"; expr: Expr; targets: string[]; iter: Expr; cond?: Expr; line: number }
  | { kind: "unary"; op: string; operand: Expr; line: number }
  | { kind: "binary"; op: string; left: Expr; right: Expr; line: number }
  | { kind: "compare"; left: Expr; ops: string[]; comparators: Expr[]; line: number }
  | { kind: "ternary"; test: Expr; consequent: Expr; alternate: Expr; line: number }
  | { kind: "call"; callee: Expr; args: { name?: string; value: Expr }[]; line: number }
  | { kind: "attr"; object: Expr; attr: string; line: number }
  | { kind: "index"; object: Expr; start?: Expr; stop?: Expr; step?: Expr; isSlice: boolean; line: number };

// --- Parser ---

class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(offset = 0): Token {
    return this.tokens[Math.min(this.pos + offset, this.tokens.length - 1)];
  }

  private advance(): Token {
    const t = this.peek();
    if (this.pos < this.tokens.length - 1) this.pos++;
    return t;
  }

  private match(type: TokenType, value?: string): boolean {
    const t = this.peek();
    if (t.type !== type) return false;
    if (value !== undefined && t.value !== value) return false;
    this.advance();
    return true;
  }

  private expect(type: TokenType, value?: string, msg?: string): Token {
    const t = this.peek();
    if (t.type !== type || (value !== undefined && t.value !== value)) {
      throw new InterpreterError(
        msg ?? `Cú pháp không hợp lệ: mong đợi '${value ?? type}', gặp '${t.value || t.type}'.`,
        t.line,
      );
    }
    return this.advance();
  }

  private skipNewlines() {
    while (this.peek().type === "NEWLINE") this.advance();
  }

  parseProgram(): Stmt[] {
    const stmts: Stmt[] = [];
    this.skipNewlines();
    while (this.peek().type !== "EOF") {
      stmts.push(...this.parseStatement());
      this.skipNewlines();
    }
    return stmts;
  }

  private parseBlock(): Stmt[] {
    this.expect("OP", ":", "Thiếu dấu ':' trước khối lệnh.");
    // Support single-line suite e.g. `if x > 0: return x`
    if (this.peek().type !== "NEWLINE") {
      return this.parseSimpleStatements();
    }
    this.expect("NEWLINE");
    this.skipNewlines();
    this.expect("INDENT", undefined, "Thiếu thụt lề cho khối lệnh bên trong.");
    const stmts: Stmt[] = [];
    while (this.peek().type !== "DEDENT" && this.peek().type !== "EOF") {
      stmts.push(...this.parseStatement());
      this.skipNewlines();
    }
    if (this.peek().type === "DEDENT") this.advance();
    return stmts;
  }

  private parseStatement(): Stmt[] {
    const t = this.peek();
    if (t.type === "KEYWORD") {
      switch (t.value) {
        case "if":
          return [this.parseIf()];
        case "while":
          return [this.parseWhile()];
        case "for":
          return [this.parseFor()];
        case "def":
          return [this.parseDef()];
        case "import":
        case "from":
          return [this.parseImport()];
      }
    }
    return this.parseSimpleStatements();
  }

  private parseSimpleStatements(): Stmt[] {
    const stmts: Stmt[] = [];
    stmts.push(this.parseSmallStatement());
    while (this.match("OP", ";")) {
      if (this.peek().type === "NEWLINE" || this.peek().type === "EOF") break;
      stmts.push(this.parseSmallStatement());
    }
    if (this.peek().type === "NEWLINE") this.advance();
    return stmts;
  }

  private parseSmallStatement(): Stmt {
    const t = this.peek();
    if (t.type === "KEYWORD") {
      if (t.value === "return") {
        this.advance();
        if (this.peek().type === "NEWLINE" || this.peek().type === "OP" && this.peek().value === ";" || this.peek().type === "EOF") {
          return { kind: "return", line: t.line };
        }
        const value = this.parseTupleOrExpr();
        return { kind: "return", value, line: t.line };
      }
      if (t.value === "break") {
        this.advance();
        return { kind: "break", line: t.line };
      }
      if (t.value === "continue") {
        this.advance();
        return { kind: "continue", line: t.line };
      }
      if (t.value === "pass") {
        this.advance();
        return { kind: "pass", line: t.line };
      }
      if (t.value === "global") {
        this.advance();
        const names: string[] = [this.expect("IDENT").value];
        while (this.match("OP", ",")) {
          names.push(this.expect("IDENT").value);
        }
        return { kind: "global", names, line: t.line };
      }
    }

    const expr = this.parseTupleOrExpr();

    // Check augmented assignment
    const next = this.peek();
    if (next.type === "OP" && ["+=", "-=", "*=", "/=", "//=", "%=", "**="].includes(next.value)) {
      const op = this.advance().value;
      const value = this.parseTupleOrExpr();
      return { kind: "augAssign", target: exprToTarget(expr), op, value, line: t.line };
    }

    // Check chained assignment a = b = expr
    if (next.type === "OP" && next.value === "=") {
      const targets: Target[] = [exprToTarget(expr)];
      let currentExpr: Expr = expr;
      while (this.match("OP", "=")) {
        currentExpr = this.parseTupleOrExpr();
        if (this.peek().type === "OP" && this.peek().value === "=") {
          targets.push(exprToTarget(currentExpr));
        }
      }
      return { kind: "assign", targets, value: currentExpr, line: t.line };
    }

    return { kind: "expr", expr, line: t.line };
  }

  private parseIf(): Stmt {
    const line = this.expect("KEYWORD", "if").line;
    const branches: { test: Expr; body: Stmt[] }[] = [];
    const test = this.parseExpr();
    const body = this.parseBlock();
    branches.push({ test, body });

    this.skipNewlines();
    while (this.match("KEYWORD", "elif")) {
      const elifTest = this.parseExpr();
      const elifBody = this.parseBlock();
      branches.push({ test: elifTest, body: elifBody });
      this.skipNewlines();
    }

    let elseBody: Stmt[] = [];
    if (this.match("KEYWORD", "else")) {
      elseBody = this.parseBlock();
    }

    return { kind: "if", branches, elseBody, line };
  }

  private parseWhile(): Stmt {
    const line = this.expect("KEYWORD", "while").line;
    const test = this.parseExpr();
    const body = this.parseBlock();
    return { kind: "while", test, body, line };
  }

  private parseFor(): Stmt {
    const line = this.expect("KEYWORD", "for").line;
    const targets: string[] = [];
    targets.push(this.expect("IDENT", undefined, "Thiếu tên biến lặp sau 'for'.").value);
    while (this.match("OP", ",")) {
      if (this.peek().type === "KEYWORD" && this.peek().value === "in") break;
      targets.push(this.expect("IDENT").value);
    }
    this.expect("KEYWORD", "in", "Thiếu từ khóa 'in' trong vòng lặp for.");
    const iter = this.parseTupleOrExpr();
    const body = this.parseBlock();
    return { kind: "for", targets, iter, body, line };
  }

  private parseDef(): Stmt {
    const line = this.expect("KEYWORD", "def").line;
    const name = this.expect("IDENT", undefined, "Thiếu tên hàm sau 'def'.").value;
    this.expect("OP", "(", "Thiếu '(' sau tên hàm.");
    const params: { name: string; defaultExpr?: Expr }[] = [];
    while (!this.match("OP", ")")) {
      const paramName = this.expect("IDENT", undefined, "Tên tham số hàm không hợp lệ.").value;
      let defaultExpr: Expr | undefined;
      if (this.match("OP", "=")) {
        defaultExpr = this.parseExpr();
      }
      params.push({ name: paramName, defaultExpr });
      if (!this.match("OP", ",")) {
        this.expect("OP", ")", "Thiếu ')' đóng danh sách tham số.");
        break;
      }
    }
    // Optional return annotation `-> type`
    if (this.match("OP", "->")) {
      this.parseExpr();
    }
    const body = this.parseBlock();
    return { kind: "def", name, params, body, line };
  }

  private parseImport(): Stmt {
    const t = this.advance();
    if (t.value === "import") {
      const mod = this.expect("IDENT").value;
      let alias: string | undefined;
      if (this.match("KEYWORD", "as")) {
        alias = this.expect("IDENT").value;
      }
      if (this.peek().type === "NEWLINE") this.advance();
      return { kind: "import", module: mod, alias, line: t.line };
    } else {
      const mod = this.expect("IDENT").value;
      this.expect("KEYWORD", "import");
      const names: { name: string; alias?: string }[] = [];
      do {
        const name = this.expect("IDENT").value;
        let alias: string | undefined;
        if (this.match("KEYWORD", "as")) {
          alias = this.expect("IDENT").value;
        }
        names.push({ name, alias });
      } while (this.match("OP", ","));
      if (this.peek().type === "NEWLINE") this.advance();
      return { kind: "import", module: mod, names, line: t.line };
    }
  }

  private parseTupleOrExpr(): Expr {
    const first = this.parseExpr();
    if (this.peek().type !== "OP" || this.peek().value !== ",") {
      return first;
    }
    const items: Expr[] = [first];
    while (this.match("OP", ",")) {
      const next = this.peek();
      if (
        next.type === "NEWLINE" ||
        next.type === "EOF" ||
        (next.type === "OP" && ["=", "+=", "-=", "*=", "/=", "//=", "%=", "**=", ")", "]", ";"].includes(next.value)) ||
        (next.type === "KEYWORD" && next.value === "in")
      ) {
        break;
      }
      items.push(this.parseExpr());
    }
    return { kind: "tuple", elements: items, line: first.line };
  }

  private parseExpr(): Expr {
    const expr = this.parseOr();
    if (this.match("KEYWORD", "if")) {
      const test = this.parseOr();
      this.expect("KEYWORD", "else", "Biểu thức điều kiện thiếu 'else'.");
      const alternate = this.parseExpr();
      return { kind: "ternary", test, consequent: expr, alternate, line: expr.line };
    }
    return expr;
  }

  private parseOr(): Expr {
    let left = this.parseAnd();
    while (this.match("KEYWORD", "or")) {
      const right = this.parseAnd();
      left = { kind: "binary", op: "or", left, right, line: left.line };
    }
    return left;
  }

  private parseAnd(): Expr {
    let left = this.parseNot();
    while (this.match("KEYWORD", "and")) {
      const right = this.parseNot();
      left = { kind: "binary", op: "and", left, right, line: left.line };
    }
    return left;
  }

  private parseNot(): Expr {
    const t = this.peek();
    if (this.match("KEYWORD", "not")) {
      return { kind: "unary", op: "not", operand: this.parseNot(), line: t.line };
    }
    return this.parseCompare();
  }

  private parseCompare(): Expr {
    const left = this.parseAddSub();
    const ops: string[] = [];
    const comparators: Expr[] = [];

    while (true) {
      const t = this.peek();
      if (t.type === "OP" && ["==", "!=", "<", "<=", ">", ">="].includes(t.value)) {
        ops.push(this.advance().value);
        comparators.push(this.parseAddSub());
      } else if (t.type === "KEYWORD" && t.value === "in") {
        this.advance();
        ops.push("in");
        comparators.push(this.parseAddSub());
      } else if (t.type === "KEYWORD" && t.value === "not" && this.peek(1).type === "KEYWORD" && this.peek(1).value === "in") {
        this.advance();
        this.advance();
        ops.push("not in");
        comparators.push(this.parseAddSub());
      } else if (t.type === "KEYWORD" && t.value === "is") {
        this.advance();
        if (this.match("KEYWORD", "not")) {
          ops.push("is not");
        } else {
          ops.push("is");
        }
        comparators.push(this.parseAddSub());
      } else {
        break;
      }
    }

    if (ops.length === 0) return left;
    return { kind: "compare", left, ops, comparators, line: left.line };
  }

  private parseAddSub(): Expr {
    let left = this.parseMulDiv();
    while (this.peek().type === "OP" && (this.peek().value === "+" || this.peek().value === "-")) {
      const op = this.advance().value;
      const right = this.parseMulDiv();
      left = { kind: "binary", op, left, right, line: left.line };
    }
    return left;
  }

  private parseMulDiv(): Expr {
    let left = this.parseUnary();
    while (
      this.peek().type === "OP" &&
      ["*", "/", "//", "%"].includes(this.peek().value)
    ) {
      const op = this.advance().value;
      const right = this.parseUnary();
      left = { kind: "binary", op, left, right, line: left.line };
    }
    return left;
  }

  private parseUnary(): Expr {
    const t = this.peek();
    if (t.type === "OP" && (t.value === "+" || t.value === "-")) {
      this.advance();
      return { kind: "unary", op: t.value, operand: this.parseUnary(), line: t.line };
    }
    return this.parsePower();
  }

  private parsePower(): Expr {
    const base = this.parsePostfix();
    if (this.match("OP", "**")) {
      const exp = this.parseUnary();
      return { kind: "binary", op: "**", left: base, right: exp, line: base.line };
    }
    return base;
  }

  private parsePostfix(): Expr {
    let expr = this.parsePrimary();
    while (true) {
      if (this.match("OP", "(")) {
        const args: { name?: string; value: Expr }[] = [];
        while (!this.match("OP", ")")) {
          if (this.peek().type === "IDENT" && this.peek(1).type === "OP" && this.peek(1).value === "=") {
            const kwName = this.advance().value;
            this.advance();
            args.push({ name: kwName, value: this.parseExpr() });
          } else {
            args.push({ value: this.parseExpr() });
          }
          if (!this.match("OP", ",")) {
            this.expect("OP", ")", "Thiếu dấu ')' kết thúc lời gọi hàm.");
            break;
          }
        }
        expr = { kind: "call", callee: expr, args, line: expr.line };
      } else if (this.match("OP", ".")) {
        const attr = this.expect("IDENT", undefined, "Thiếu tên thuộc tính hoặc phương thức sau '.'.").value;
        expr = { kind: "attr", object: expr, attr, line: expr.line };
      } else if (this.match("OP", "[")) {
        let start: Expr | undefined;
        let stop: Expr | undefined;
        let step: Expr | undefined;
        let isSlice = false;

        if (!this.match("OP", ":")) {
          start = this.parseExpr();
          if (this.match("OP", ":")) {
            isSlice = true;
          }
        } else {
          isSlice = true;
        }

        if (isSlice) {
          if (this.peek().type !== "OP" || (this.peek().value !== ":" && this.peek().value !== "]")) {
            stop = this.parseExpr();
          }
          if (this.match("OP", ":")) {
            if (this.peek().type !== "OP" || this.peek().value !== "]") {
              step = this.parseExpr();
            }
          }
        }

        this.expect("OP", "]", "Thiếu dấu ']' đóng chỉ mục.");
        expr = { kind: "index", object: expr, start, stop, step, isSlice, line: expr.line };
      } else {
        break;
      }
    }
    return expr;
  }

  private parsePrimary(): Expr {
    const t = this.peek();

    if (t.type === "NUMBER") {
      this.advance();
      return { kind: "literal", value: Number(t.value), line: t.line };
    }
    if (t.type === "STRING") {
      this.advance();
      return { kind: "literal", value: t.value, line: t.line };
    }
    if (t.type === "FSTRING") {
      this.advance();
      return this.parseFString(t.value, t.line);
    }
    if (t.type === "KEYWORD") {
      if (t.value === "True") {
        this.advance();
        return { kind: "literal", value: true, line: t.line };
      }
      if (t.value === "False") {
        this.advance();
        return { kind: "literal", value: false, line: t.line };
      }
      if (t.value === "None") {
        this.advance();
        return { kind: "literal", value: null, line: t.line };
      }
    }
    if (t.type === "IDENT") {
      this.advance();
      return { kind: "ident", name: t.value, line: t.line };
    }

    // Parenthesized expression or tuple
    if (this.match("OP", "(")) {
      if (this.match("OP", ")")) {
        return { kind: "tuple", elements: [], line: t.line };
      }
      const first = this.parseExpr();
      if (this.match("OP", ",")) {
        const elements = [first];
        while (!this.match("OP", ")")) {
          elements.push(this.parseExpr());
          if (!this.match("OP", ",")) {
            this.expect("OP", ")");
            break;
          }
        }
        return { kind: "tuple", elements, line: t.line };
      }
      this.expect("OP", ")", "Thiếu dấu ')' đóng biểu thức.");
      return first;
    }

    // List literal or list comprehension
    if (this.match("OP", "[")) {
      if (this.match("OP", "]")) {
        return { kind: "list", elements: [], line: t.line };
      }
      const first = this.parseExpr();
      if (this.match("KEYWORD", "for")) {
        const targets: string[] = [this.expect("IDENT").value];
        while (this.match("OP", ",")) {
          if (this.peek().type === "KEYWORD" && this.peek().value === "in") break;
          targets.push(this.expect("IDENT").value);
        }
        this.expect("KEYWORD", "in");
        const iter = this.parseOr();
        let cond: Expr | undefined;
        if (this.match("KEYWORD", "if")) {
          cond = this.parseOr();
        }
        this.expect("OP", "]", "Thiếu dấu ']' đóng list comprehension.");
        return { kind: "listComp", expr: first, targets, iter, cond, line: t.line };
      }
      const elements = [first];
      while (this.match("OP", ",")) {
        if (this.peek().type === "OP" && this.peek().value === "]") break;
        elements.push(this.parseExpr());
      }
      this.expect("OP", "]", "Thiếu dấu ']' đóng danh sách.");
      return { kind: "list", elements, line: t.line };
    }

    // Dict literal
    if (this.match("OP", "{")) {
      const entries: { key: Expr; value: Expr }[] = [];
      if (!this.match("OP", "}")) {
        do {
          if (this.peek().type === "OP" && this.peek().value === "}") break;
          const key = this.parseExpr();
          this.expect("OP", ":", "Thiếu dấu ':' giữa key và value trong dict.");
          const value = this.parseExpr();
          entries.push({ key, value });
        } while (this.match("OP", ","));
        this.expect("OP", "}", "Thiếu dấu '}' đóng dict.");
      }
      return { kind: "dict", entries, line: t.line };
    }

    throw new InterpreterError(`Biểu thức không hợp lệ tại '${t.value || t.type}'.`, t.line);
  }

  private parseFString(raw: string, line: number): Expr {
    const parts: FStringPart[] = [];
    let i = 0;
    let textBuf = "";

    while (i < raw.length) {
      if (raw[i] === "{" && raw[i + 1] === "{") {
        textBuf += "{";
        i += 2;
        continue;
      }
      if (raw[i] === "}" && raw[i + 1] === "}") {
        textBuf += "}";
        i += 2;
        continue;
      }
      if (raw[i] === "{") {
        if (textBuf.length > 0) {
          parts.push({ kind: "text", value: textBuf });
          textBuf = "";
        }
        i++;
        let depth = 1;
        let inner = "";
        let inQuote: string | null = null;
        while (i < raw.length && depth > 0) {
          const c = raw[i];
          if (inQuote) {
            inner += c;
            if (c === "\\" && i + 1 < raw.length) {
              inner += raw[i + 1];
              i += 2;
              continue;
            }
            if (c === inQuote) inQuote = null;
          } else {
            if (c === '"' || c === "'") inQuote = c;
            else if (c === "{") depth++;
            else if (c === "}") {
              depth--;
              if (depth === 0) break;
            }
            inner += c;
          }
          i++;
        }
        if (depth !== 0) {
          throw new InterpreterError("Dấu '{' trong f-string chưa được đóng.", line);
        }
        i++; // skip closing }

        // Split optional format specifier e.g. `x:.2f` (top-level `:`)
        let exprSrc = inner;
        let formatSpec: string | undefined;
        let pDepth = 0;
        let qChar: string | null = null;
        for (let k = 0; k < inner.length; k++) {
          const ch = inner[k];
          if (qChar) {
            if (ch === qChar && inner[k - 1] !== "\\") qChar = null;
            continue;
          }
          if (ch === '"' || ch === "'") qChar = ch;
          else if ("([{".includes(ch)) pDepth++;
          else if (")]}".includes(ch)) pDepth--;
          else if (ch === ":" && pDepth === 0) {
            exprSrc = inner.slice(0, k);
            formatSpec = inner.slice(k + 1).trim();
            break;
          }
        }

        const subTokens = tokenize(exprSrc.trim());
        const subParser = new Parser(subTokens);
        const subExpr = subParser.parseExpr();
        parts.push({ kind: "expr", expr: subExpr, formatSpec });
        continue;
      }
      textBuf += raw[i];
      i++;
    }

    if (textBuf.length > 0) {
      parts.push({ kind: "text", value: textBuf });
    }
    return { kind: "fstring", parts, line };
  }
}

function exprToTarget(expr: Expr): Target {
  if (expr.kind === "ident") {
    return { kind: "ident", name: expr.name, line: expr.line };
  }
  if (expr.kind === "index" && !expr.isSlice && expr.start) {
    return { kind: "index", object: expr.object, index: expr.start, line: expr.line };
  }
  if (expr.kind === "tuple") {
    return { kind: "tuple", items: expr.elements.map(exprToTarget), line: expr.line };
  }
  throw new InterpreterError("Đích gán biến không hợp lệ.", expr.line);
}

// --- Environment & Evaluator ---

class Env {
  vars = new Map<string, PyValue>();
  globals = new Set<string>();
  parent: Env | null;

  constructor(parent: Env | null = null) {
    this.parent = parent;
  }

  get(name: string, line: number): PyValue {
    if (this.vars.has(name)) return this.vars.get(name)!;
    if (this.parent) return this.parent.get(name, line);
    throw new InterpreterError(`Biến hoặc hàm '${name}' chưa được định nghĩa (NameError).`, line);
  }

  set(name: string, value: PyValue, rootEnv: Env) {
    if (this.globals.has(name)) {
      rootEnv.vars.set(name, value);
    } else {
      this.vars.set(name, value);
    }
  }
}

function formatWithSpec(val: PyValue, spec?: string): string {
  if (!spec) return formatPyValue(val);
  const floatMatch = spec.match(/^([<>^]?)(\d*)\.(\d+)f$/);
  if (floatMatch && typeof val === "number") {
    const [, align, widthStr, decimalsStr] = floatMatch;
    const formatted = val.toFixed(Number(decimalsStr));
    const width = widthStr ? Number(widthStr) : 0;
    if (width > formatted.length) {
      return align === "<" ? formatted.padEnd(width, " ") : formatted.padStart(width, " ");
    }
    return formatted;
  }
  const intMatch = spec.match(/^([<>^]?)(0?)(\d+)d$/);
  if (intMatch && typeof val === "number") {
    const [, align, zeroPad, widthStr] = intMatch;
    const formatted = String(Math.trunc(val));
    const width = Number(widthStr);
    if (width > formatted.length) {
      return align === "<"
        ? formatted.padEnd(width, " ")
        : formatted.padStart(width, zeroPad ? "0" : " ");
    }
    return formatted;
  }
  return formatPyValue(val);
}

export function runPythonCode(source: string, options: RunPythonOptions = {}): PythonRunResult {
  const maxSteps = options.maxSteps ?? DEFAULT_MAX_STEPS;
  const maxDepth = options.maxDepth ?? DEFAULT_MAX_DEPTH;
  const maxOutputLines = options.maxOutputLines ?? DEFAULT_MAX_OUTPUT_LINES;

  const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();
  const output: string[] = [];
  let stepsExecuted = 0;
  let callDepth = 0;

  const tick = (line?: number) => {
    if (stepsExecuted >= maxSteps) {
      throw new InterpreterError(
        `Vượt quá giới hạn an toàn ${maxSteps.toLocaleString("vi-VN")} bước thực thi (phát hiện vòng lặp vô hạn hoặc đệ quy quá sâu). Chương trình đã dừng để bảo vệ trình duyệt.`,
        line,
      );
    }
    stepsExecuted++;
  };

  const globalEnv = new Env(null);

  const mathModule: PyModule = {
    __py: "module",
    name: "math",
    members: {
      pi: Math.PI,
      e: Math.E,
      sqrt: builtin("sqrt", ([x], _kw, line) => Math.sqrt(asNum(x, line))),
      floor: builtin("floor", ([x], _kw, line) => Math.floor(asNum(x, line))),
      ceil: builtin("ceil", ([x], _kw, line) => Math.ceil(asNum(x, line))),
      abs: builtin("fabs", ([x], _kw, line) => Math.abs(asNum(x, line))),
      fabs: builtin("fabs", ([x], _kw, line) => Math.abs(asNum(x, line))),
      pow: builtin("pow", ([a, b], _kw, line) => Math.pow(asNum(a, line), asNum(b, line))),
      log: builtin("log", ([x, base], _kw, line) =>
        base !== undefined ? Math.log(asNum(x, line)) / Math.log(asNum(base, line)) : Math.log(asNum(x, line)),
      ),
      gcd: builtin("gcd", ([a, b], _kw, line) => {
        let x = Math.abs(Math.trunc(asNum(a, line)));
        let y = Math.abs(Math.trunc(asNum(b, line)));
        while (y !== 0) {
          tick(line);
          [x, y] = [y, x % y];
        }
        return x;
      }),
      factorial: builtin("factorial", ([n], _kw, line) => {
        const k = Math.trunc(asNum(n, line));
        if (k < 0) throw new InterpreterError("factorial() không nhận số âm.", line);
        let res = 1;
        for (let i = 2; i <= k; i++) {
          tick(line);
          res *= i;
        }
        return res;
      }),
    },
  };

  function builtin(
    name: string,
    fn: (args: PyValue[], kwargs: Record<string, PyValue>, line: number) => PyValue,
  ): PyBuiltin {
    return { __py: "builtin", name, fn };
  }

  function asNum(v: PyValue, line: number): number {
    if (typeof v === "number") return v;
    if (typeof v === "boolean") return v ? 1 : 0;
    throw new InterpreterError(`Mong đợi kiểu số, nhận '${typeofPy(v)}'.`, line);
  }

  // Register Python built-ins
  const builtins: Record<string, PyValue> = {
    print: builtin("print", (args, kwargs, line) => {
      const sep = kwargs.sep !== undefined ? formatPyValue(kwargs.sep) : " ";
      const text = args.map((a) => formatPyValue(a)).join(sep);
      const lines = text.split("\n");
      for (const l of lines) {
        if (output.length >= maxOutputLines) {
          throw new InterpreterError(`Đầu ra vượt quá giới hạn ${maxOutputLines} dòng.`, line);
        }
        output.push(l);
      }
      return null;
    }),
    range: builtin("range", (args, _kw, line) => {
      if (args.length === 1) {
        return { __py: "range", start: 0, stop: Math.trunc(asNum(args[0], line)), step: 1 };
      }
      if (args.length === 2) {
        return { __py: "range", start: Math.trunc(asNum(args[0], line)), stop: Math.trunc(asNum(args[1], line)), step: 1 };
      }
      if (args.length === 3) {
        const step = Math.trunc(asNum(args[2], line));
        if (step === 0) throw new InterpreterError("Tham số step của range() phải khác 0.", line);
        return { __py: "range", start: Math.trunc(asNum(args[0], line)), stop: Math.trunc(asNum(args[1], line)), step };
      }
      throw new InterpreterError("range() nhận từ 1 đến 3 tham số.", line);
    }),
    len: builtin("len", ([v], _kw, line) => {
      if (typeof v === "string") return v.length;
      if (isPyObject(v)) {
        if (v.__py === "list" || v.__py === "tuple") return v.items.length;
        if (v.__py === "dict") return v.entries.size;
        if (v.__py === "range") return rangeLength(v);
      }
      throw new InterpreterError(`Hàm len() không hỗ trợ kiểu '${typeofPy(v)}'.`, line);
    }),
    sum: builtin("sum", (args, _kw, line) => {
      const items = toIterable(args[0], line);
      let acc = args[1] !== undefined ? asNum(args[1], line) : 0;
      for (const item of items) {
        tick(line);
        acc += asNum(item, line);
      }
      return acc;
    }),
    min: builtin("min", (args, _kw, line) => {
      const items = args.length === 1 ? toIterable(args[0], line) : args;
      if (items.length === 0) throw new InterpreterError("min() nhận tập rỗng.", line);
      let best = items[0];
      for (let i = 1; i < items.length; i++) {
        tick(line);
        if (pyCompareOrder(items[i], best, line) < 0) best = items[i];
      }
      return best;
    }),
    max: builtin("max", (args, _kw, line) => {
      const items = args.length === 1 ? toIterable(args[0], line) : args;
      if (items.length === 0) throw new InterpreterError("max() nhận tập rỗng.", line);
      let best = items[0];
      for (let i = 1; i < items.length; i++) {
        tick(line);
        if (pyCompareOrder(items[i], best, line) > 0) best = items[i];
      }
      return best;
    }),
    abs: builtin("abs", ([v], _kw, line) => Math.abs(asNum(v, line))),
    round: builtin("round", (args, _kw, line) => {
      const num = asNum(args[0], line);
      if (args.length < 2) return Math.round(num);
      const digits = Math.trunc(asNum(args[1], line));
      const factor = Math.pow(10, digits);
      return Math.round(num * factor) / factor;
    }),
    pow: builtin("pow", ([a, b], _kw, line) => Math.pow(asNum(a, line), asNum(b, line))),
    int: builtin("int", ([v], _kw, line) => {
      if (v === undefined) return 0;
      if (typeof v === "number") return Math.trunc(v);
      if (typeof v === "boolean") return v ? 1 : 0;
      if (typeof v === "string") {
        const n = Number.parseInt(v.trim(), 10);
        if (Number.isNaN(n)) throw new InterpreterError(`Không thể chuyển '${v}' sang int.`, line);
        return n;
      }
      throw new InterpreterError(`Không thể chuyển '${typeofPy(v)}' sang int.`, line);
    }),
    float: builtin("float", ([v], _kw, line) => {
      if (v === undefined) return 0.0;
      if (typeof v === "number") return v;
      if (typeof v === "boolean") return v ? 1.0 : 0.0;
      if (typeof v === "string") {
        const n = Number.parseFloat(v.trim());
        if (Number.isNaN(n)) throw new InterpreterError(`Không thể chuyển '${v}' sang float.`, line);
        return n;
      }
      throw new InterpreterError(`Không thể chuyển '${typeofPy(v)}' sang float.`, line);
    }),
    str: builtin("str", ([v]) => (v === undefined ? "" : formatPyValue(v))),
    bool: builtin("bool", ([v]) => (v === undefined ? false : isTruthy(v))),
    list: builtin("list", (args, _kw, line) =>
      args.length === 0 ? pyList([]) : pyList([...toIterable(args[0], line)]),
    ),
    tuple: builtin("tuple", (args, _kw, line) =>
      args.length === 0 ? pyTuple([]) : pyTuple([...toIterable(args[0], line)]),
    ),
    sorted: builtin("sorted", (args, kwargs, line) => {
      const copy = [...toIterable(args[0], line)];
      copy.sort((a, b) => pyCompareOrder(a, b, line));
      if (kwargs.reverse && isTruthy(kwargs.reverse)) {
        copy.reverse();
      }
      return pyList(copy);
    }),
    reversed: builtin("reversed", ([v], _kw, line) => pyList([...toIterable(v, line)].reverse())),
    enumerate: builtin("enumerate", (args, _kw, line) => {
      const items = toIterable(args[0], line);
      const start = args[1] !== undefined ? Math.trunc(asNum(args[1], line)) : 0;
      return pyList(items.map((item, idx) => pyTuple([start + idx, item])));
    }),
    zip: builtin("zip", (args, _kw, line) => {
      if (args.length === 0) return pyList([]);
      const lists = args.map((a) => toIterable(a, line));
      const minLen = Math.min(...lists.map((l) => l.length));
      const res: PyValue[] = [];
      for (let i = 0; i < minLen; i++) {
        res.push(pyTuple(lists.map((l) => l[i])));
      }
      return pyList(res);
    }),
    all: builtin("all", ([v], _kw, line) => toIterable(v, line).every((item) => isTruthy(item))),
    any: builtin("any", ([v], _kw, line) => toIterable(v, line).some((item) => isTruthy(item))),
    ord: builtin("ord", ([v], _kw, line) => {
      if (typeof v !== "string" || v.length !== 1) {
        throw new InterpreterError("ord() yêu cầu chuỗi dài đúng 1 ký tự.", line);
      }
      return v.charCodeAt(0);
    }),
    chr: builtin("chr", ([v], _kw, line) => String.fromCharCode(Math.trunc(asNum(v, line)))),
    type: builtin("type", ([v]) => `<class '${typeofPy(v)}'>`),
    math: mathModule,
  };

  for (const [k, v] of Object.entries(builtins)) {
    globalEnv.vars.set(k, v);
  }
  const builtinNames = new Set(Object.keys(builtins));

  function evalBlock(stmts: Stmt[], env: Env) {
    for (const stmt of stmts) {
      evalStmt(stmt, env);
    }
  }

  function assignTarget(target: Target, value: PyValue, env: Env) {
    if (target.kind === "ident") {
      env.set(target.name, value, globalEnv);
      return;
    }
    if (target.kind === "index") {
      const obj = evalExpr(target.object, env);
      const idxVal = evalExpr(target.index, env);
      if (isPyObject(obj) && obj.__py === "list") {
        let idx = Math.trunc(asNum(idxVal, target.line));
        if (idx < 0) idx += obj.items.length;
        if (idx < 0 || idx >= obj.items.length) {
          throw new InterpreterError(`Chỉ mục danh sách ngoài phạm vi (IndexError: ${idxVal}).`, target.line);
        }
        obj.items[idx] = value;
        return;
      }
      if (isPyObject(obj) && obj.__py === "dict") {
        obj.entries.set(dictKey(idxVal), { key: idxVal, value });
        return;
      }
      throw new InterpreterError(`Không thể gán phần tử cho kiểu '${typeofPy(obj)}'.`, target.line);
    }
    if (target.kind === "tuple") {
      const items = toIterable(value, target.line);
      if (items.length !== target.items.length) {
        throw new InterpreterError(
          `Số lượng giá trị giải nén không khớp (${items.length} so với ${target.items.length}).`,
          target.line,
        );
      }
      for (let i = 0; i < target.items.length; i++) {
        assignTarget(target.items[i], items[i], env);
      }
    }
  }

  function evalStmt(stmt: Stmt, env: Env) {
    tick(stmt.line);

    switch (stmt.kind) {
      case "pass":
        return;
      case "break":
        throw new BreakSignal();
      case "continue":
        throw new ContinueSignal();
      case "global":
        for (const name of stmt.names) env.globals.add(name);
        return;
      case "import": {
        if (stmt.module === "math") {
          if (stmt.names) {
            for (const entry of stmt.names) {
              const member = mathModule.members[entry.name];
              if (member === undefined) {
                throw new InterpreterError(`Module 'math' không có '${entry.name}'.`, stmt.line);
              }
              env.set(entry.alias ?? entry.name, member, globalEnv);
            }
          } else {
            env.set(stmt.alias ?? "math", mathModule, globalEnv);
          }
          return;
        }
        throw new InterpreterError(`Trình chạy chỉ hỗ trợ thư viện chuẩn nội bộ (như 'math'), chưa hỗ trợ '${stmt.module}'.`, stmt.line);
      }
      case "return": {
        const val = stmt.value ? evalExpr(stmt.value, env) : null;
        throw new ReturnSignal(val);
      }
      case "expr":
        evalExpr(stmt.expr, env);
        return;
      case "assign": {
        const val = evalExpr(stmt.value, env);
        for (const t of stmt.targets) {
          assignTarget(t, val, env);
        }
        return;
      }
      case "augAssign": {
        const rhs = evalExpr(stmt.value, env);
        const curExpr: Expr =
          stmt.target.kind === "ident"
            ? { kind: "ident", name: stmt.target.name, line: stmt.line }
            : stmt.target.kind === "index"
              ? { kind: "index", object: stmt.target.object, start: stmt.target.index, isSlice: false, line: stmt.line }
              : { kind: "literal", value: null, line: stmt.line };
        const curVal = evalExpr(curExpr, env);
        const binOp = stmt.op.slice(0, -1);
        const nextVal = evalBinary(binOp, curVal, rhs, stmt.line);
        assignTarget(stmt.target, nextVal, env);
        return;
      }
      case "if": {
        for (const br of stmt.branches) {
          if (isTruthy(evalExpr(br.test, env))) {
            evalBlock(br.body, env);
            return;
          }
        }
        evalBlock(stmt.elseBody, env);
        return;
      }
      case "while": {
        while (isTruthy(evalExpr(stmt.test, env))) {
          tick(stmt.line);
          try {
            evalBlock(stmt.body, env);
          } catch (sig) {
            if (sig instanceof BreakSignal) break;
            if (sig instanceof ContinueSignal) continue;
            throw sig;
          }
        }
        return;
      }
      case "for": {
        const items = toIterable(evalExpr(stmt.iter, env), stmt.line);
        for (const item of items) {
          tick(stmt.line);
          if (stmt.targets.length === 1) {
            env.set(stmt.targets[0], item, globalEnv);
          } else {
            const unpacked = toIterable(item, stmt.line);
            if (unpacked.length !== stmt.targets.length) {
              throw new InterpreterError("Số biến giải nén trong vòng lặp for không khớp.", stmt.line);
            }
            for (let i = 0; i < stmt.targets.length; i++) {
              env.set(stmt.targets[i], unpacked[i], globalEnv);
            }
          }
          try {
            evalBlock(stmt.body, env);
          } catch (sig) {
            if (sig instanceof BreakSignal) break;
            if (sig instanceof ContinueSignal) continue;
            throw sig;
          }
        }
        return;
      }
      case "def": {
        const fn: PyFunction = {
          __py: "fn",
          name: stmt.name,
          params: stmt.params,
          body: stmt.body,
          closure: env,
        };
        env.set(stmt.name, fn, globalEnv);
        return;
      }
    }
  }

  function callPyFunction(fn: PyFunction, posArgs: PyValue[], kwArgs: Record<string, PyValue>, line: number): PyValue {
    callDepth++;
    if (callDepth > maxDepth) {
      throw new InterpreterError(`Độ sâu đệ quy vượt quá giới hạn an toàn (${maxDepth} tầng).`, line);
    }
    try {
      const fnEnv = new Env(fn.closure);
      for (let i = 0; i < fn.params.length; i++) {
        const param = fn.params[i];
        if (i < posArgs.length) {
          fnEnv.vars.set(param.name, posArgs[i]);
        } else if (kwArgs[param.name] !== undefined) {
          fnEnv.vars.set(param.name, kwArgs[param.name]);
        } else if (param.defaultExpr) {
          fnEnv.vars.set(param.name, evalExpr(param.defaultExpr, fn.closure));
        } else {
          throw new InterpreterError(`Hàm '${fn.name}()' thiếu tham số bắt buộc '${param.name}'.`, line);
        }
      }
      if (posArgs.length > fn.params.length) {
        throw new InterpreterError(
          `Hàm '${fn.name}()' nhận tối đa ${fn.params.length} tham số, nhưng truyền vào ${posArgs.length}.`,
          line,
        );
      }
      try {
        evalBlock(fn.body, fnEnv);
      } catch (sig) {
        if (sig instanceof ReturnSignal) {
          return sig.value;
        }
        throw sig;
      }
      return null;
    } finally {
      callDepth--;
    }
  }

  function evalBinary(op: string, left: PyValue, right: PyValue, line: number): PyValue {
    if (op === "+") {
      if (typeof left === "string" && typeof right === "string") return left + right;
      if (isPyObject(left) && isPyObject(right)) {
        if (left.__py === "list" && right.__py === "list") return pyList([...left.items, ...right.items]);
        if (left.__py === "tuple" && right.__py === "tuple") return pyTuple([...left.items, ...right.items]);
      }
      return asNum(left, line) + asNum(right, line);
    }
    if (op === "-") return asNum(left, line) - asNum(right, line);
    if (op === "*") {
      if (typeof left === "string" && (typeof right === "number" || typeof right === "boolean")) {
        const times = Math.max(0, Math.trunc(asNum(right, line)));
        if (left.length * times > MAX_COLLECTION_SIZE * 10) {
          throw new InterpreterError("Chuỗi lặp quá dài.", line);
        }
        return left.repeat(times);
      }
      if (isPyObject(left) && left.__py === "list" && (typeof right === "number" || typeof right === "boolean")) {
        const times = Math.max(0, Math.trunc(asNum(right, line)));
        if (left.items.length * times > MAX_COLLECTION_SIZE) {
          throw new InterpreterError("Danh sách lặp quá lớn.", line);
        }
        const out: PyValue[] = [];
        for (let i = 0; i < times; i++) out.push(...left.items);
        return pyList(out);
      }
      return asNum(left, line) * asNum(right, line);
    }
    if (op === "/") {
      const denom = asNum(right, line);
      if (denom === 0) throw new InterpreterError("Lỗi chia cho 0 (ZeroDivisionError).", line);
      return asNum(left, line) / denom;
    }
    if (op === "//") {
      const denom = asNum(right, line);
      if (denom === 0) throw new InterpreterError("Lỗi chia cho 0 (ZeroDivisionError).", line);
      return Math.floor(asNum(left, line) / denom);
    }
    if (op === "%") {
      const denom = asNum(right, line);
      if (denom === 0) throw new InterpreterError("Lỗi chia lấy dư cho 0 (ZeroDivisionError).", line);
      const a = asNum(left, line);
      return ((a % denom) + denom) % denom;
    }
    if (op === "**") {
      const res = Math.pow(asNum(left, line), asNum(right, line));
      if (!Number.isFinite(res)) throw new InterpreterError("Kết quả lũy thừa vượt quá giới hạn số học.", line);
      return res;
    }
    throw new InterpreterError(`Toán tử '${op}' không được hỗ trợ.`, line);
  }

  function evalMethodCall(obj: PyValue, method: string, args: PyValue[], kwargs: Record<string, PyValue>, line: number): PyValue {
    if (typeof obj === "string") {
      switch (method) {
        case "lower":
          return obj.toLowerCase();
        case "upper":
          return obj.toUpperCase();
        case "strip":
          return obj.trim();
        case "split": {
          const sep = args[0] !== undefined ? String(args[0]) : undefined;
          const parts = sep === undefined ? obj.trim().split(/\s+/).filter(Boolean) : obj.split(sep);
          return pyList(parts);
        }
        case "join": {
          const items = toIterable(args[0], line).map((item) => {
            if (typeof item !== "string") throw new InterpreterError("join() yêu cầu phần tử kiểu str.", line);
            return item;
          });
          return items.join(obj);
        }
        case "replace":
          return obj.split(String(args[0] ?? "")).join(String(args[1] ?? ""));
        case "startswith":
          return obj.startsWith(String(args[0] ?? ""));
        case "endswith":
          return obj.endsWith(String(args[0] ?? ""));
        case "find":
          return obj.indexOf(String(args[0] ?? ""));
        case "count": {
          const sub = String(args[0] ?? "");
          if (!sub) return obj.length + 1;
          return obj.split(sub).length - 1;
        }
      }
    }

    if (isPyObject(obj) && obj.__py === "list") {
      switch (method) {
        case "append":
          if (obj.items.length >= MAX_COLLECTION_SIZE) {
            throw new InterpreterError(`Danh sách vượt quá ${MAX_COLLECTION_SIZE} phần tử.`, line);
          }
          obj.items.push(args[0] ?? null);
          return null;
        case "pop": {
          if (obj.items.length === 0) throw new InterpreterError("pop() trên danh sách rỗng.", line);
          if (args.length === 0) return obj.items.pop()!;
          let idx = Math.trunc(asNum(args[0], line));
          if (idx < 0) idx += obj.items.length;
          if (idx < 0 || idx >= obj.items.length) throw new InterpreterError("Chỉ mục pop() ngoài phạm vi.", line);
          return obj.items.splice(idx, 1)[0];
        }
        case "insert": {
          let idx = Math.trunc(asNum(args[0], line));
          if (idx < 0) idx = Math.max(0, obj.items.length + idx);
          obj.items.splice(idx, 0, args[1] ?? null);
          return null;
        }
        case "remove": {
          const i = obj.items.findIndex((item) => pyEquals(item, args[0]));
          if (i === -1) throw new InterpreterError("Giá trị cần xóa không có trong danh sách.", line);
          obj.items.splice(i, 1);
          return null;
        }
        case "sort":
          obj.items.sort((a, b) => pyCompareOrder(a, b, line));
          if (kwargs.reverse && isTruthy(kwargs.reverse)) obj.items.reverse();
          return null;
        case "reverse":
          obj.items.reverse();
          return null;
        case "clear":
          obj.items.length = 0;
          return null;
        case "count":
          return obj.items.filter((item) => pyEquals(item, args[0])).length;
        case "index": {
          const idx = obj.items.findIndex((item) => pyEquals(item, args[0]));
          if (idx === -1) throw new InterpreterError("Không tìm thấy phần tử trong danh sách.", line);
          return idx;
        }
      }
    }

    if (isPyObject(obj) && obj.__py === "dict") {
      switch (method) {
        case "get": {
          const entry = obj.entries.get(dictKey(args[0]));
          return entry ? entry.value : (args[1] ?? null);
        }
        case "keys":
          return pyList(Array.from(obj.entries.values()).map((e) => e.key));
        case "values":
          return pyList(Array.from(obj.entries.values()).map((e) => e.value));
        case "items":
          return pyList(Array.from(obj.entries.values()).map((e) => pyTuple([e.key, e.value])));
        case "clear":
          obj.entries.clear();
          return null;
      }
    }

    if (isPyObject(obj) && obj.__py === "module") {
      const fn = obj.members[method];
      if (fn && isPyObject(fn) && fn.__py === "builtin") {
        return fn.fn(args, kwargs, line);
      }
    }

    throw new InterpreterError(`Kiểu '${typeofPy(obj)}' không có phương thức '${method}()'.`, line);
  }

  function evalExpr(expr: Expr, env: Env): PyValue {
    switch (expr.kind) {
      case "literal":
        return expr.value;
      case "fstring": {
        let out = "";
        for (const part of expr.parts) {
          if (part.kind === "text") {
            out += part.value;
          } else {
            const val = evalExpr(part.expr, env);
            out += formatWithSpec(val, part.formatSpec);
          }
        }
        return out;
      }
      case "ident":
        return env.get(expr.name, expr.line);
      case "list":
        return pyList(expr.elements.map((e) => evalExpr(e, env)));
      case "tuple":
        return pyTuple(expr.elements.map((e) => evalExpr(e, env)));
      case "dict": {
        const dict = pyDict();
        for (const entry of expr.entries) {
          const k = evalExpr(entry.key, env);
          const v = evalExpr(entry.value, env);
          dict.entries.set(dictKey(k), { key: k, value: v });
        }
        return dict;
      }
      case "listComp": {
        const iterItems = toIterable(evalExpr(expr.iter, env), expr.line);
        const compEnv = new Env(env);
        const result: PyValue[] = [];
        for (const item of iterItems) {
          tick(expr.line);
          if (expr.targets.length === 1) {
            compEnv.vars.set(expr.targets[0], item);
          } else {
            const unpacked = toIterable(item, expr.line);
            for (let i = 0; i < expr.targets.length; i++) {
              compEnv.vars.set(expr.targets[i], unpacked[i] ?? null);
            }
          }
          if (!expr.cond || isTruthy(evalExpr(expr.cond, compEnv))) {
            result.push(evalExpr(expr.expr, compEnv));
          }
        }
        return pyList(result);
      }
      case "unary": {
        const val = evalExpr(expr.operand, env);
        if (expr.op === "not") return !isTruthy(val);
        if (expr.op === "-") return -asNum(val, expr.line);
        if (expr.op === "+") return +asNum(val, expr.line);
        throw new InterpreterError(`Toán tử một ngôi '${expr.op}' không hợp lệ.`, expr.line);
      }
      case "binary": {
        if (expr.op === "and") {
          const left = evalExpr(expr.left, env);
          return isTruthy(left) ? evalExpr(expr.right, env) : left;
        }
        if (expr.op === "or") {
          const left = evalExpr(expr.left, env);
          return isTruthy(left) ? left : evalExpr(expr.right, env);
        }
        const left = evalExpr(expr.left, env);
        const right = evalExpr(expr.right, env);
        return evalBinary(expr.op, left, right, expr.line);
      }
      case "compare": {
        let cur = evalExpr(expr.left, env);
        for (let i = 0; i < expr.ops.length; i++) {
          const op = expr.ops[i];
          const nxt = evalExpr(expr.comparators[i], env);
          let ok = false;
          switch (op) {
            case "==":
              ok = pyEquals(cur, nxt);
              break;
            case "!=":
              ok = !pyEquals(cur, nxt);
              break;
            case "<":
              ok = pyCompareOrder(cur, nxt, expr.line) < 0;
              break;
            case "<=":
              ok = pyCompareOrder(cur, nxt, expr.line) <= 0;
              break;
            case ">":
              ok = pyCompareOrder(cur, nxt, expr.line) > 0;
              break;
            case ">=":
              ok = pyCompareOrder(cur, nxt, expr.line) >= 0;
              break;
            case "is":
              ok = cur === nxt;
              break;
            case "is not":
              ok = cur !== nxt;
              break;
            case "in":
            case "not in": {
              let found = false;
              if (typeof nxt === "string" && typeof cur === "string") {
                found = nxt.includes(cur);
              } else if (isPyObject(nxt) && nxt.__py === "dict") {
                found = nxt.entries.has(dictKey(cur));
              } else {
                const items = toIterable(nxt, expr.line);
                found = items.some((item) => pyEquals(item, cur));
              }
              ok = op === "in" ? found : !found;
              break;
            }
          }
          if (!ok) return false;
          cur = nxt;
        }
        return true;
      }
      case "ternary":
        return isTruthy(evalExpr(expr.test, env))
          ? evalExpr(expr.consequent, env)
          : evalExpr(expr.alternate, env);
      case "attr": {
        const obj = evalExpr(expr.object, env);
        if (isPyObject(obj) && obj.__py === "module") {
          const member = obj.members[expr.attr];
          if (member === undefined) {
            throw new InterpreterError(`Module '${obj.name}' không có thuộc tính '${expr.attr}'.`, expr.line);
          }
          return member;
        }
        throw new InterpreterError(`Thuộc tính '${expr.attr}' chỉ hỗ trợ gọi dưới dạng phương thức hoặc trên module.`, expr.line);
      }
      case "call": {
        const posArgs: PyValue[] = [];
        const kwArgs: Record<string, PyValue> = {};
        for (const arg of expr.args) {
          const val = evalExpr(arg.value, env);
          if (arg.name) kwArgs[arg.name] = val;
          else posArgs.push(val);
        }

        if (expr.callee.kind === "attr") {
          const targetObj = evalExpr(expr.callee.object, env);
          return evalMethodCall(targetObj, expr.callee.attr, posArgs, kwArgs, expr.line);
        }

        const calleeVal = evalExpr(expr.callee, env);
        if (isPyObject(calleeVal) && calleeVal.__py === "builtin") {
          return calleeVal.fn(posArgs, kwArgs, expr.line);
        }
        if (isPyObject(calleeVal) && calleeVal.__py === "fn") {
          return callPyFunction(calleeVal, posArgs, kwArgs, expr.line);
        }
        throw new InterpreterError(`Đối tượng '${typeofPy(calleeVal)}' không thể gọi như hàm.`, expr.line);
      }
      case "index": {
        const obj = evalExpr(expr.object, env);
        if (!expr.isSlice) {
          const idxVal = evalExpr(expr.start!, env);
          if (isPyObject(obj) && obj.__py === "dict") {
            const entry = obj.entries.get(dictKey(idxVal));
            if (!entry) {
              throw new InterpreterError(`Không tìm thấy khóa '${formatPyValue(idxVal, true)}' trong dict (KeyError).`, expr.line);
            }
            return entry.value;
          }
          let idx = Math.trunc(asNum(idxVal, expr.line));
          if (typeof obj === "string") {
            if (idx < 0) idx += obj.length;
            if (idx < 0 || idx >= obj.length) throw new InterpreterError("Chỉ mục chuỗi ngoài phạm vi.", expr.line);
            return obj[idx];
          }
          if (isPyObject(obj) && (obj.__py === "list" || obj.__py === "tuple")) {
            if (idx < 0) idx += obj.items.length;
            if (idx < 0 || idx >= obj.items.length) throw new InterpreterError("Chỉ mục danh sách ngoài phạm vi.", expr.line);
            return obj.items[idx];
          }
          throw new InterpreterError(`Kiểu '${typeofPy(obj)}' không hỗ trợ truy cập chỉ mục [].`, expr.line);
        } else {
          // Slicing
          const isStr = typeof obj === "string";
          const seq: PyValue[] = isStr
            ? Array.from(obj)
            : isPyObject(obj) && (obj.__py === "list" || obj.__py === "tuple")
              ? obj.items
              : (() => {
                  throw new InterpreterError(`Kiểu '${typeofPy(obj)}' không hỗ trợ cắt lát (slicing).`, expr.line);
                })();
          const len = seq.length;
          const step = expr.step ? Math.trunc(asNum(evalExpr(expr.step, env), expr.line)) : 1;
          if (step === 0) throw new InterpreterError("Bước cắt lát (slice step) phải khác 0.", expr.line);

          let start: number;
          if (expr.start) {
            start = Math.trunc(asNum(evalExpr(expr.start, env), expr.line));
            if (start < 0) start += len;
            start = step > 0 ? Math.max(0, Math.min(len, start)) : Math.max(-1, Math.min(len - 1, start));
          } else {
            start = step > 0 ? 0 : len - 1;
          }

          let stop: number;
          if (expr.stop) {
            stop = Math.trunc(asNum(evalExpr(expr.stop, env), expr.line));
            if (stop < 0) stop += len;
            stop = step > 0 ? Math.max(0, Math.min(len, stop)) : Math.max(-1, Math.min(len - 1, stop));
          } else {
            stop = step > 0 ? len : -1;
          }

          const sliced: PyValue[] = [];
          if (step > 0) {
            for (let i = start; i < stop; i += step) sliced.push(seq[i]);
          } else {
            for (let i = start; i > stop; i += step) sliced.push(seq[i]);
          }
          if (isStr) return sliced.join("");
          if (isPyObject(obj) && obj.__py === "tuple") return pyTuple(sliced);
          return pyList(sliced);
        }
      }
    }
  }

  let errorMsg: string | undefined;
  try {
    const tokens = tokenize(source);
    const parser = new Parser(tokens);
    const ast = parser.parseProgram();
    evalBlock(ast, globalEnv);
  } catch (err) {
    if (err instanceof BreakSignal) {
      errorMsg = "Lỗi cú pháp: 'break' nằm ngoài vòng lặp.";
    } else if (err instanceof ContinueSignal) {
      errorMsg = "Lỗi cú pháp: 'continue' nằm ngoài vòng lặp.";
    } else if (err instanceof ReturnSignal) {
      errorMsg = "Lỗi cú pháp: 'return' nằm ngoài hàm.";
    } else if (err instanceof Error) {
      errorMsg = err.message;
    } else {
      errorMsg = "Lỗi thực thi không xác định.";
    }
  }

  const variables: Record<string, string> = {};
  for (const [k, v] of globalEnv.vars.entries()) {
    if (!builtinNames.has(k)) {
      variables[k] = formatPyValue(v, true);
    }
  }

  const endTime = typeof performance !== "undefined" ? performance.now() : Date.now();
  const durationMs = Number(Math.max(0.01, endTime - startTime).toFixed(2));

  return {
    output,
    error: errorMsg,
    stepsExecuted,
    durationMs,
    variables,
  };
}
