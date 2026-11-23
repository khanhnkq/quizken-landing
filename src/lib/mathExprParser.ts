/**
 * Safe recursive-descent math expression parser & evaluator.
 * Never uses eval() or new Function().
 */

type Token =
  | { type: "num"; value: number }
  | { type: "ident"; value: string }
  | { type: "op"; value: "+" | "-" | "*" | "/" | "^" }
  | { type: "lparen" }
  | { type: "rparen" };

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  const s = expr.trim().replace(/\s+/g, "").replace(/,/g, ".");
  let i = 0;

  while (i < s.length) {
    const ch = s[i];

    if (/[0-9.]/.test(ch)) {
      const start = i;
      let dotCount = 0;
      while (i < s.length && /[0-9.]/.test(s[i])) {
        if (s[i] === ".") dotCount++;
        i++;
      }
      if (dotCount > 1) {
        throw new Error(`Số không hợp lệ: "${s.slice(start, i)}"`);
      }
      const val = Number(s.slice(start, i));
      if (!Number.isFinite(val)) {
        throw new Error(`Giá trị số không hợp lệ: "${s.slice(start, i)}"`);
      }
      tokens.push({ type: "num", value: val });
      continue;
    }

    if (/[a-zA-Z]/.test(ch)) {
      const start = i;
      while (i < s.length && /[a-zA-Z0-9]/.test(s[i])) i++;
      tokens.push({ type: "ident", value: s.slice(start, i).toLowerCase() });
      continue;
    }

    if (ch === "+" || ch === "-" || ch === "*" || ch === "/" || ch === "^") {
      tokens.push({ type: "op", value: ch });
      i++;
      continue;
    }

    if (ch === "(") {
      tokens.push({ type: "lparen" });
      i++;
      continue;
    }

    if (ch === ")") {
      tokens.push({ type: "rparen" });
      i++;
      continue;
    }

    throw new Error(`Ký tự không được hỗ trợ: "${ch}"`);
  }

  // Insert implicit multiplication (e.g. 2x, 3(x+1), x(x-1), (x+1)(x-1), 2sin(x))
  const out: Token[] = [];
  const isLeftMult = (t: Token) =>
    t.type === "num" ||
    t.type === "rparen" ||
    (t.type === "ident" && (t.value === "x" || t.value === "pi" || t.value === "e"));

  const isRightMult = (t: Token) =>
    t.type === "num" || t.type === "lparen" || t.type === "ident";

  for (let k = 0; k < tokens.length; k++) {
    const cur = tokens[k];
    if (out.length > 0) {
      const prev = out[out.length - 1];
      if (isLeftMult(prev) && isRightMult(cur)) {
        // Don't insert * between number and nothing, already guarded
        out.push({ type: "op", value: "*" });
      }
    }
    out.push(cur);
  }

  return out;
}

const FUNCTIONS: Record<string, (v: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  abs: Math.abs,
  sqrt: Math.sqrt,
  ln: Math.log,
  log: (v) => Math.log10(v),
  exp: Math.exp,
};

export type CompiledMathFn = (x: number) => number;

export function compileMathExpression(raw: string): {
  fn: CompiledMathFn | null;
  error?: string;
} {
  const cleaned = raw.trim().replace(/^y\s*=\s*/i, "").replace(/^f\s*\(\s*x\s*\)\s*=\s*/i, "");
  if (!cleaned) {
    return { fn: null, error: "Vui lòng nhập biểu thức hàm số theo biến x." };
  }

  try {
    const tokens = tokenize(cleaned);
    if (tokens.length === 0) {
      return { fn: null, error: "Biểu thức trống." };
    }

    // Parse into AST once, then evaluate quickly for many x points
    let pos = 0;
    const peek = () => tokens[pos];
    const consume = () => tokens[pos++];

    type EvalNode = (x: number) => number;

    function parseExpr(): EvalNode {
      let left = parseTerm();
      while (
        peek()?.type === "op" &&
        ((peek() as { type: "op"; value: string }).value === "+" ||
          (peek() as { type: "op"; value: string }).value === "-")
      ) {
        const op = (consume() as { type: "op"; value: "+" | "-" }).value;
        const right = parseTerm();
        const prevLeft = left;
        left =
          op === "+"
            ? (x) => prevLeft(x) + right(x)
            : (x) => prevLeft(x) - right(x);
      }
      return left;
    }

    function parseTerm(): EvalNode {
      let left = parseUnary();
      while (
        peek()?.type === "op" &&
        ((peek() as { type: "op"; value: string }).value === "*" ||
          (peek() as { type: "op"; value: string }).value === "/")
      ) {
        const op = (consume() as { type: "op"; value: "*" | "/" }).value;
        const right = parseUnary();
        const prevLeft = left;
        left =
          op === "*"
            ? (x) => prevLeft(x) * right(x)
            : (x) => prevLeft(x) / right(x);
      }
      return left;
    }

    function parseUnary(): EvalNode {
      if (peek()?.type === "op") {
        const val = (peek() as { type: "op"; value: string }).value;
        if (val === "+" || val === "-") {
          consume();
          const inner = parseUnary();
          return val === "-" ? (x) => -inner(x) : inner;
        }
      }
      return parsePower();
    }

    function parsePower(): EvalNode {
      const base = parsePrimary();
      if (
        peek()?.type === "op" &&
        (peek() as { type: "op"; value: string }).value === "^"
      ) {
        consume();
        const exp = parseUnary();
        return (x) => Math.pow(base(x), exp(x));
      }
      return base;
    }

    function parsePrimary(): EvalNode {
      const t = peek();
      if (!t) throw new Error("Biểu thức kết thúc đột ngột.");

      if (t.type === "num") {
        consume();
        const val = t.value;
        return () => val;
      }

      if (t.type === "lparen") {
        consume();
        const inner = parseExpr();
        const next = consume();
        if (!next || next.type !== "rparen") {
          throw new Error("Thiếu dấu đóng ngoặc ')'.");
        }
        return inner;
      }

      if (t.type === "ident") {
        consume();
        if (t.value === "x") return (x) => x;
        if (t.value === "pi") return () => Math.PI;
        if (t.value === "e") return () => Math.E;

        const fnImpl = FUNCTIONS[t.value];
        if (!fnImpl) {
          throw new Error(
            `Không nhận diện được hàm hoặc hằng số "${t.value}". Hỗ trợ: x, pi, e, sin, cos, tan, abs, sqrt, ln, log, exp.`
          );
        }
        if (peek()?.type !== "lparen") {
          throw new Error(`Hàm "${t.value}" cần có dấu ngoặc, VD: ${t.value}(x).`);
        }
        consume();
        const arg = parseExpr();
        const close = consume();
        if (!close || close.type !== "rparen") {
          throw new Error(`Thiếu dấu đóng ngoặc ')' cho hàm ${t.value}.`);
        }
        return (x) => fnImpl(arg(x));
      }

      throw new Error("Cú pháp biểu thức không hợp lệ.");
    }

    const ast = parseExpr();
    if (pos < tokens.length) {
      throw new Error("Dư ký tự không hợp lệ trong biểu thức.");
    }

    // Smoke evaluate at x=1 to ensure compilation works
    void ast(1);
    return { fn: ast };
  } catch (err) {
    return {
      fn: null,
      error: err instanceof Error ? err.message : "Biểu thức không hợp lệ.",
    };
  }
}
