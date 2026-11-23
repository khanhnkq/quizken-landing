export interface Rational {
  n: bigint;
  d: bigint;
}

const ZERO = BigInt(0);
const ONE = BigInt(1);
const NEG_ONE = BigInt(-1);
const TEN = BigInt(10);

function absBig(v: bigint): bigint {
  return v < ZERO ? -v : v;
}

function gcdBig(a: bigint, b: bigint): bigint {
  let x = absBig(a);
  let y = absBig(b);
  while (y !== ZERO) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x === ZERO ? ONE : x;
}

export function rat(n: bigint, d: bigint = ONE): Rational {
  if (d === ZERO) throw new Error("Chia cho 0");
  if (n === ZERO) return { n: ZERO, d: ONE };
  const sign = d < ZERO ? NEG_ONE : ONE;
  const nn = n * sign;
  const dd = absBig(d);
  const g = gcdBig(nn, dd);
  return { n: nn / g, d: dd / g };
}

export function addRat(a: Rational, b: Rational): Rational {
  return rat(a.n * b.d + b.n * a.d, a.d * b.d);
}

export function subRat(a: Rational, b: Rational): Rational {
  return rat(a.n * b.d - b.n * a.d, a.d * b.d);
}

export function mulRat(a: Rational, b: Rational): Rational {
  return rat(a.n * b.n, a.d * b.d);
}

export function divRat(a: Rational, b: Rational): Rational {
  if (b.n === ZERO) throw new Error("Chia cho 0");
  return rat(a.n * b.d, a.d * b.n);
}

export function parseRationalInput(raw: string): Rational | null {
  const s = raw.trim().replace(/,/g, ".");
  if (!s) return rat(ZERO, ONE);

  if (s.includes("/")) {
    const parts = s.split("/");
    if (parts.length !== 2) return null;
    const p = parseRationalInput(parts[0]);
    const q = parseRationalInput(parts[1]);
    if (!p || !q || q.n === ZERO) return null;
    return divRat(p, q);
  }

  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(s)) return null;
  const negative = s.startsWith("-");
  const unsigned = s.replace(/^[+-]/, "");
  const [intPart, decPart = ""] = unsigned.split(".");
  const digits = `${intPart || "0"}${decPart}`;
  const num = BigInt(digits) * (negative ? NEG_ONE : ONE);
  let den = ONE;
  for (let i = 0; i < decPart.length; i++) {
    den *= TEN;
  }
  return rat(num, den);
}

export function formatRational(r: Rational, asDecimal: boolean): string {
  if (r.n === ZERO) return "0";
  if (asDecimal) {
    const val = Number(r.n) / Number(r.d);
    return Number(val.toFixed(4)).toString();
  }
  if (r.d === ONE) return r.n.toString();
  return `${r.n.toString()}/${r.d.toString()}`;
}

function formatNum(v: number): string {
  if (Math.abs(v) < 1e-10) return "0";
  return Number(v.toFixed(6)).toString();
}

export interface PolynomialResult {
  degree: 1 | 2 | 3 | 0;
  summary: string;
  roots: string[];
  steps: string[];
}

export function solveQuadratic(a: number, b: number, c: number): PolynomialResult {
  if ([a, b, c].some((v) => !Number.isFinite(v))) {
    return {
      degree: 0,
      summary: "Hệ số không hợp lệ.",
      roots: [],
      steps: ["Vui lòng nhập đầy đủ các hệ số thực a, b, c."],
    };
  }

  if (Math.abs(a) < 1e-12) {
    if (Math.abs(b) < 1e-12) {
      return {
        degree: 0,
        summary: Math.abs(c) < 1e-12 ? "Phương trình vô số nghiệm." : "Phương trình vô nghiệm.",
        roots: [],
        steps: [
          `Vì a = 0 và b = 0, phương trình suy biến thành ${formatNum(c)} = 0.`,
        ],
      };
    }
    const x = -c / b;
    return {
      degree: 1,
      summary: `Phương trình bậc nhất có nghiệm duy nhất x = ${formatNum(x)}`,
      roots: [`x = ${formatNum(x)}`],
      steps: [
        `Do a = 0, phương trình trở thành phương trình bậc nhất: ${formatNum(b)}x + (${formatNum(c)}) = 0`,
        `x = -c / b = ${formatNum(x)}`,
      ],
    };
  }

  const delta = b * b - 4 * a * c;
  const steps = [
    `Phương trình: (${formatNum(a)})x² + (${formatNum(b)})x + (${formatNum(c)}) = 0`,
    `Tính biệt thức Δ = b² - 4ac = (${formatNum(b)})² - 4·(${formatNum(a)})·(${formatNum(c)}) = ${formatNum(delta)}`,
  ];

  if (delta > 1e-12) {
    const sqrtD = Math.sqrt(delta);
    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);
    steps.push(`Vì Δ > 0, phương trình có 2 nghiệm thực phân biệt:`);
    steps.push(`x₁ = (-b + √Δ) / (2a) = ${formatNum(x1)}`);
    steps.push(`x₂ = (-b - √Δ) / (2a) = ${formatNum(x2)}`);
    steps.push(
      `Kiểm tra Vi-ét: x₁ + x₂ = ${formatNum(-b / a)}, x₁·x₂ = ${formatNum(c / a)}`
    );
    return {
      degree: 2,
      summary: "Phương trình có 2 nghiệm thực phân biệt",
      roots: [`x₁ = ${formatNum(x1)}`, `x₂ = ${formatNum(x2)}`],
      steps,
    };
  }

  if (Math.abs(delta) <= 1e-12) {
    const x = -b / (2 * a);
    steps.push(`Vì Δ = 0, phương trình có nghiệm kép: x₁ = x₂ = -b / (2a) = ${formatNum(x)}`);
    return {
      degree: 2,
      summary: "Phương trình có nghiệm kép",
      roots: [`x₁ = x₂ = ${formatNum(x)}`],
      steps,
    };
  }

  const realPart = -b / (2 * a);
  const imagPart = Math.sqrt(-delta) / (2 * Math.abs(a));
  const rStr = Math.abs(realPart) < 1e-10 ? "" : `${formatNum(realPart)} `;
  const sign1 = rStr ? "+ " : "";
  const sign2 = rStr ? "- " : "-";
  const iStr = `${formatNum(imagPart)}i`;
  steps.push(`Vì Δ < 0, phương trình vô nghiệm thực (có 2 nghiệm phức liên hợp):`);
  steps.push(`x₁ = ${rStr}${sign1}${iStr}`, `x₂ = ${rStr}${sign2}${iStr}`);

  return {
    degree: 2,
    summary: "Phương trình vô nghiệm trên R (2 nghiệm phức trên C)",
    roots: [`x₁ = ${rStr}${sign1}${iStr}`, `x₂ = ${rStr}${sign2}${iStr}`],
    steps,
  };
}

export function solveCubic(
  a: number,
  b: number,
  c: number,
  d: number
): PolynomialResult {
  if ([a, b, c, d].some((v) => !Number.isFinite(v))) {
    return {
      degree: 0,
      summary: "Hệ số không hợp lệ.",
      roots: [],
      steps: ["Vui lòng nhập đầy đủ các hệ số thực a, b, c, d."],
    };
  }

  if (Math.abs(a) < 1e-12) {
    return solveQuadratic(b, c, d);
  }

  // Depressed cubic: t³ + pt + q = 0 with x = t - b/(3a)
  const p = (3 * a * c - b * b) / (3 * a * a);
  const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
  const shift = -b / (3 * a);
  const disc = (q * q) / 4 + (p * p * p) / 27;

  const steps = [
    `Phương trình bậc 3: (${formatNum(a)})x³ + (${formatNum(b)})x² + (${formatNum(c)})x + (${formatNum(d)}) = 0`,
    `Đặt x = t - b/(3a) = t + (${formatNum(shift)}) để khử bậc 2, thu được: t³ + (${formatNum(p)})t + (${formatNum(q)}) = 0`,
    `Biệt thức Cardano Δ_c = (q/2)² + (p/3)³ = ${formatNum(disc)}`,
  ];

  if (disc > 1e-12) {
    const sqrtDisc = Math.sqrt(disc);
    const u = Math.cbrt(-q / 2 + sqrtDisc);
    const v = Math.cbrt(-q / 2 - sqrtDisc);
    const x1 = u + v + shift;
    const realComplex = -(u + v) / 2 + shift;
    const imagComplex = (Math.sqrt(3) / 2) * Math.abs(u - v);

    steps.push(`Vì Δ_c > 0, phương trình có 1 nghiệm thực và 2 nghiệm phức:`);
    steps.push(`x₁ = ${formatNum(x1)}`);
    steps.push(
      `x₂,₃ = ${formatNum(realComplex)} ± ${formatNum(imagComplex)}i`
    );

    return {
      degree: 3,
      summary: "Phương trình bậc 3 có 1 nghiệm thực và 2 nghiệm phức",
      roots: [
        `x₁ = ${formatNum(x1)}`,
        `x₂ = ${formatNum(realComplex)} + ${formatNum(imagComplex)}i`,
        `x₃ = ${formatNum(realComplex)} - ${formatNum(imagComplex)}i`,
      ],
      steps,
    };
  }

  if (Math.abs(disc) <= 1e-12) {
    if (Math.abs(p) < 1e-12 && Math.abs(q) < 1e-12) {
      const x = shift;
      steps.push(`Phương trình có nghiệm bội ba x = ${formatNum(x)}`);
      return {
        degree: 3,
        summary: "Phương trình có nghiệm bội ba",
        roots: [`x₁ = x₂ = x₃ = ${formatNum(x)}`],
        steps,
      };
    }
    const u = Math.cbrt(-q / 2);
    const x1 = 2 * u + shift;
    const x2 = -u + shift;
    steps.push(`Vì Δ_c = 0, phương trình có nghiệm thực bội: x₁ = ${formatNum(x1)}, x₂ = x₃ = ${formatNum(x2)}`);
    return {
      degree: 3,
      summary: "Phương trình có 3 nghiệm thực (có nghiệm kép)",
      roots: [`x₁ = ${formatNum(x1)}`, `x₂ = x₃ = ${formatNum(x2)}`],
      steps,
    };
  }

  // Three distinct real roots (casus irreducibilis -> trigonometric method)
  const r = 2 * Math.sqrt(-p / 3);
  const cosArg = Math.max(-1, Math.min(1, (3 * q) / (2 * p) * Math.sqrt(-3 / p)));
  const phi = Math.acos(cosArg);
  const x1 = r * Math.cos(phi / 3) + shift;
  const x2 = r * Math.cos((phi - 2 * Math.PI) / 3) + shift;
  const x3 = r * Math.cos((phi - 4 * Math.PI) / 3) + shift;
  const sorted = [x1, x2, x3].sort((m, n) => m - n);

  steps.push(`Vì Δ_c < 0, phương trình có 3 nghiệm thực phân biệt (phương pháp lượng giác):`);
  steps.push(
    `x₁ = ${formatNum(sorted[0])}`,
    `x₂ = ${formatNum(sorted[1])}`,
    `x₃ = ${formatNum(sorted[2])}`
  );

  return {
    degree: 3,
    summary: "Phương trình bậc 3 có 3 nghiệm thực phân biệt",
    roots: [
      `x₁ = ${formatNum(sorted[0])}`,
      `x₂ = ${formatNum(sorted[1])}`,
      `x₃ = ${formatNum(sorted[2])}`,
    ],
    steps,
  };
}

function det2Rat(m: Rational[][]): Rational {
  return subRat(mulRat(m[0][0], m[1][1]), mulRat(m[0][1], m[1][0]));
}

function det3Rat(m: Rational[][]): Rational {
  const t1 = mulRat(
    m[0][0],
    subRat(mulRat(m[1][1], m[2][2]), mulRat(m[1][2], m[2][1]))
  );
  const t2 = mulRat(
    m[0][1],
    subRat(mulRat(m[1][0], m[2][2]), mulRat(m[1][2], m[2][0]))
  );
  const t3 = mulRat(
    m[0][2],
    subRat(mulRat(m[1][0], m[2][1]), mulRat(m[1][1], m[2][0]))
  );
  return addRat(subRat(t1, t2), t3);
}

export interface LinearSystemResult {
  status: "unique" | "infinite" | "none" | "invalid";
  solution?: string[];
  determinant?: string;
  steps: string[];
}

export function solveLinearSystem(
  size: 2 | 3,
  aStrings: string[][],
  bStrings: string[],
  asDecimal: boolean
): LinearSystemResult {
  const A: Rational[][] = [];
  const B: Rational[] = [];

  for (let i = 0; i < size; i++) {
    const row: Rational[] = [];
    for (let j = 0; j < size; j++) {
      const val = parseRationalInput(aStrings[i]?.[j] ?? "0");
      if (!val) {
        return {
          status: "invalid",
          steps: [`Giá trị không hợp lệ tại hàng ${i + 1}, cột ${j + 1}.`],
        };
      }
      row.push(val);
    }
    const bVal = parseRationalInput(bStrings[i] ?? "0");
    if (!bVal) {
      return {
        status: "invalid",
        steps: [`Giá trị vế phải không hợp lệ tại phương trình ${i + 1}.`],
      };
    }
    A.push(row);
    B.push(bVal);
  }

  const detFn = size === 2 ? det2Rat : det3Rat;
  const D = detFn(A);

  const replaceCol = (colIdx: number): Rational[][] =>
    A.map((row, rIdx) => row.map((cell, cIdx) => (cIdx === colIdx ? B[rIdx] : cell)));

  const Di = Array.from({ length: size }, (_, idx) => detFn(replaceCol(idx)));
  const varNames = size === 2 ? ["x", "y"] : ["x", "y", "z"];

  const steps: string[] = [
    `Định thức hệ số D = det(A) = ${formatRational(D, asDecimal)}`,
    ...Di.map(
      (d, idx) => `Định thức D_${varNames[idx]} = ${formatRational(d, asDecimal)}`
    ),
  ];

  if (D.n !== ZERO) {
    const roots = Di.map((d) => divRat(d, D));
    const solution = roots.map(
      (val, idx) => `${varNames[idx]} = ${formatRational(val, asDecimal)}`
    );
    steps.push(`Vì D ≠ 0, hệ có nghiệm duy nhất theo quy tắc Cramer:`);
    steps.push(...solution);
    return {
      status: "unique",
      solution,
      determinant: formatRational(D, asDecimal),
      steps,
    };
  }

  // When D = 0, check rank(A) vs rank([A|B]) via exact RREF on augmented matrix
  const aug: Rational[][] = A.map((row, idx) => [...row, B[idx]]);
  const rows = size;
  const cols = size + 1;
  let r = 0;

  for (let c = 0; c < size && r < rows; c++) {
    let pivot = -1;
    for (let i = r; i < rows; i++) {
      if (aug[i][c].n !== ZERO) {
        pivot = i;
        break;
      }
    }
    if (pivot === -1) continue;
    if (pivot !== r) {
      const tmp = aug[r];
      aug[r] = aug[pivot];
      aug[pivot] = tmp;
    }
    const pv = aug[r][c];
    for (let j = c; j < cols; j++) aug[r][j] = divRat(aug[r][j], pv);
    for (let i = 0; i < rows; i++) {
      if (i === r || aug[i][c].n === ZERO) continue;
      const factor = aug[i][c];
      for (let j = c; j < cols; j++) {
        aug[i][j] = subRat(aug[i][j], mulRat(factor, aug[r][j]));
      }
    }
    r++;
  }

  let inconsistent = false;
  for (let i = 0; i < rows; i++) {
    const allAZero = aug[i].slice(0, size).every((cell) => cell.n === ZERO);
    if (allAZero && aug[i][size].n !== ZERO) {
      inconsistent = true;
      break;
    }
  }

  if (inconsistent || Di.some((d) => d.n !== ZERO)) {
    steps.push("Vì D = 0 và hệ phương trình mâu thuẫn sau khử Gauss, hệ VÔ NGHIỆM.");
    return {
      status: "none",
      determinant: "0",
      steps,
    };
  }

  steps.push(
    "Vì D = 0 và hạng của ma trận hệ số bằng hạng ma trận mở rộng (< số ẩn), hệ có VÔ SỐ NGHIỆM."
  );
  return {
    status: "infinite",
    determinant: "0",
    steps,
  };
}

export interface MatrixAnalysisResult {
  valid: boolean;
  determinant: string;
  invertible: boolean;
  transpose: string[][];
  inverse?: string[][];
  steps: string[];
  error?: string;
}

export function analyzeMatrix(
  size: 2 | 3,
  mStrings: string[][],
  asDecimal: boolean
): MatrixAnalysisResult {
  const M: Rational[][] = [];
  for (let i = 0; i < size; i++) {
    const row: Rational[] = [];
    for (let j = 0; j < size; j++) {
      const val = parseRationalInput(mStrings[i]?.[j] ?? "0");
      if (!val) {
        return {
          valid: false,
          determinant: "0",
          invertible: false,
          transpose: [],
          steps: [],
          error: `Giá trị không hợp lệ tại hàng ${i + 1}, cột ${j + 1}.`,
        };
      }
      row.push(val);
    }
    M.push(row);
  }

  const transpose: string[][] = Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => formatRational(M[j][i], asDecimal))
  );

  const det = size === 2 ? det2Rat(M) : det3Rat(M);
  const detStr = formatRational(det, asDecimal);
  const steps: string[] = [`Định thức det(A) = ${detStr}`];

  if (det.n === ZERO) {
    steps.push(
      "Vì det(A) = 0, ma trận A là ma trận suy biến nên KHÔNG tồn tại ma trận nghịch đảo A⁻¹."
    );
    return {
      valid: true,
      determinant: detStr,
      invertible: false,
      transpose,
      steps,
    };
  }

  let adj: Rational[][];
  if (size === 2) {
    adj = [
      [M[1][1], rat(-M[0][1].n, M[0][1].d)],
      [rat(-M[1][0].n, M[1][0].d), M[0][0]],
    ];
    steps.push("Ma trận phụ hợp adj(A) = [[d, -b], [-c, a]]");
  } else {
    const minorDet = (skipR: number, skipC: number): Rational => {
      const sub: Rational[][] = [];
      for (let r = 0; r < 3; r++) {
        if (r === skipR) continue;
        const rRow: Rational[] = [];
        for (let c = 0; c < 3; c++) {
          if (c === skipC) continue;
          rRow.push(M[r][c]);
        }
        sub.push(rRow);
      }
      return det2Rat(sub);
    };

    adj = Array.from({ length: 3 }, (_, i) =>
      Array.from({ length: 3 }, (_, j) => {
        const sign = (i + j) % 2 === 0 ? ONE : NEG_ONE;
        const mDet = minorDet(j, i); // transpose of cofactor matrix
        return mulRat(rat(sign, ONE), mDet);
      })
    );
    steps.push("Tính các phần bù đại số C_ij = (-1)^(i+j)·M_ij rồi chuyển vị thành adj(A)");
  }

  const inverse = adj.map((row) =>
    row.map((cell) => formatRational(divRat(cell, det), asDecimal))
  );
  steps.push("Ma trận nghịch đảo A⁻¹ = (1 / det(A)) · adj(A)");

  return {
    valid: true,
    determinant: detStr,
    invertible: true,
    transpose,
    inverse,
    steps,
  };
}
