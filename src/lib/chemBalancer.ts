export interface Fraction {
  num: bigint;
  den: bigint;
}

const ZERO = BigInt(0);
const ONE = BigInt(1);
const NEG_ONE = BigInt(-1);

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

function lcmBig(a: bigint, b: bigint): bigint {
  if (a === ZERO || b === ZERO) return ONE;
  return absBig(a * b) / gcdBig(a, b);
}

function makeFrac(num: bigint, den: bigint = ONE): Fraction {
  if (den === ZERO) throw new Error("Division by zero");
  if (num === ZERO) return { num: ZERO, den: ONE };
  const sign = den < ZERO ? NEG_ONE : ONE;
  const n = num * sign;
  const d = absBig(den);
  const g = gcdBig(n, d);
  return { num: n / g, den: d / g };
}

function subFrac(a: Fraction, b: Fraction): Fraction {
  return makeFrac(a.num * b.den - b.num * a.den, a.den * b.den);
}

function mulFrac(a: Fraction, b: Fraction): Fraction {
  return makeFrac(a.num * b.num, a.den * b.den);
}

function divFrac(a: Fraction, b: Fraction): Fraction {
  if (b.num === ZERO) throw new Error("Division by zero");
  return makeFrac(a.num * b.den, a.den * b.num);
}

// Standard atomic masses (rounded per Vietnamese GDPT 2018 & IUPAC conventions)
export const ATOMIC_MASSES: Record<string, number> = {
  H: 1,
  He: 4,
  Li: 7,
  Be: 9,
  B: 11,
  C: 12,
  N: 14,
  O: 16,
  F: 19,
  Ne: 20,
  Na: 23,
  Mg: 24,
  Al: 27,
  Si: 28,
  P: 31,
  S: 32,
  Cl: 35.5,
  Ar: 40,
  K: 39,
  Ca: 40,
  Sc: 45,
  Ti: 48,
  V: 51,
  Cr: 52,
  Mn: 55,
  Fe: 56,
  Co: 59,
  Ni: 59,
  Cu: 64,
  Zn: 65,
  Ga: 70,
  Ge: 73,
  As: 75,
  Se: 79,
  Br: 80,
  Kr: 84,
  Rb: 85.5,
  Sr: 88,
  Y: 89,
  Zr: 91,
  Nb: 93,
  Mo: 96,
  Tc: 98,
  Ru: 101,
  Rh: 103,
  Pd: 106,
  Ag: 108,
  Cd: 112,
  In: 115,
  Sn: 119,
  Sb: 122,
  Te: 128,
  I: 127,
  Xe: 131,
  Cs: 133,
  Ba: 137,
  La: 139,
  Ce: 140,
  Pr: 141,
  Nd: 144,
  Pm: 145,
  Sm: 150,
  Eu: 152,
  Gd: 157,
  Tb: 159,
  Dy: 162.5,
  Ho: 165,
  Er: 167,
  Tm: 169,
  Yb: 173,
  Lu: 175,
  Hf: 178.5,
  Ta: 181,
  W: 184,
  Re: 186,
  Os: 190,
  Ir: 192,
  Pt: 195,
  Au: 197,
  Hg: 201,
  Tl: 204,
  Pb: 207,
  Bi: 209,
  Po: 209,
  At: 210,
  Rn: 222,
  Fr: 223,
  Ra: 226,
  Ac: 227,
  Th: 232,
  Pa: 231,
  U: 238,
};

export interface FormulaParseResult {
  atoms: Record<string, number>;
  error?: string;
}

function mergeAtomMaps(
  target: Record<string, number>,
  source: Record<string, number>,
  multiplier: number
) {
  for (const [el, count] of Object.entries(source)) {
    target[el] = (target[el] || 0) + count * multiplier;
  }
}

function parseFormulaSegment(raw: string): FormulaParseResult {
  const cleaned = raw.trim().replace(/\s+/g, "");
  if (!cleaned) {
    return { atoms: {}, error: "Công thức hóa học không được để trống." };
  }

  let idx = 0;
  const len = cleaned.length;

  function parseGroup(closingChar: string | null): FormulaParseResult {
    const map: Record<string, number> = {};

    while (idx < len) {
      const ch = cleaned[idx];

      if (closingChar && ch === closingChar) {
        idx++;
        return { atoms: map };
      }

      if (ch === "(" || ch === "[" || ch === "{") {
        const expectedClose = ch === "(" ? ")" : ch === "[" ? "]" : "}";
        idx++;
        const inner = parseGroup(expectedClose);
        if (inner.error) return inner;
        if (Object.keys(inner.atoms).length === 0) {
          return {
            atoms: {},
            error: `Cặp ngoặc trống trong công thức "${cleaned}".`,
          };
        }
        const mult = readNumber();
        mergeAtomMaps(map, inner.atoms, mult);
        continue;
      }

      if (ch === ")" || ch === "]" || ch === "}") {
        return {
          atoms: {},
          error: `Dấu ngoặc "${ch}" không khớp trong công thức "${cleaned}".`,
        };
      }

      if (/[A-Z]/.test(ch)) {
        let symbol = ch;
        idx++;
        while (idx < len && /[a-z]/.test(cleaned[idx])) {
          symbol += cleaned[idx];
          idx++;
        }
        const count = readNumber();
        map[symbol] = (map[symbol] || 0) + count;
        continue;
      }

      return {
        atoms: {},
        error: `Ký tự không hợp lệ "${ch}" trong công thức "${cleaned}".`,
      };
    }

    if (closingChar) {
      return {
        atoms: {},
        error: `Thiếu dấu đóng ngoặc "${closingChar}" trong công thức "${cleaned}".`,
      };
    }

    return { atoms: map };
  }

  function readNumber(): number {
    const start = idx;
    while (idx < len && /[0-9]/.test(cleaned[idx])) {
      idx++;
    }
    if (idx === start) return 1;
    const val = parseInt(cleaned.slice(start, idx), 10);
    return Number.isFinite(val) && val > 0 ? val : 1;
  }

  return parseGroup(null);
}

/**
 * Parse a chemical formula including optional hydrates like CuSO4.5H2O or CuSO4*5H2O
 * and nested brackets like K4[Fe(CN)6] or Fe2(SO4)3.
 */
export function parseChemicalFormula(formula: string): FormulaParseResult {
  const trimmed = formula.trim();
  if (!trimmed) {
    return { atoms: {}, error: "Vui lòng nhập công thức hóa học." };
  }

  // Strip optional leading stoichiometric coefficient if user enters e.g. "2H2O" in molar mass? No, handle hydrate dot/middle dot
  const parts = trimmed.split(/[·.•*]/);
  const total: Record<string, number> = {};

  for (const part of parts) {
    const seg = part.trim();
    if (!seg) {
      return { atoms: {}, error: `Công thức "${trimmed}" có dấu chấm thừa.` };
    }
    const match = seg.match(/^(\d+)(.+)$/);
    const mult = match ? parseInt(match[1], 10) : 1;
    const body = match ? match[2] : seg;
    const parsed = parseFormulaSegment(body);
    if (parsed.error) return parsed;
    mergeAtomMaps(total, parsed.atoms, mult);
  }

  return { atoms: total };
}

export interface MolarMassBreakdownItem {
  element: string;
  count: number;
  atomicMass: number;
  subtotal: number;
}

export interface MolarMassResult {
  formula: string;
  molarMass: number;
  breakdown: MolarMassBreakdownItem[];
  error?: string;
}

export function calculateMolarMass(formula: string): MolarMassResult {
  const parsed = parseChemicalFormula(formula);
  if (parsed.error) {
    return { formula, molarMass: 0, breakdown: [], error: parsed.error };
  }

  const breakdown: MolarMassBreakdownItem[] = [];
  let sum = 0;

  for (const [el, count] of Object.entries(parsed.atoms)) {
    const mass = ATOMIC_MASSES[el];
    if (mass === undefined) {
      return {
        formula,
        molarMass: 0,
        breakdown: [],
        error: `Không tìm thấy nguyên tử khối cho ký hiệu nguyên tố "${el}". Hãy kiểm tra chữ hoa/thường (VD: Fe, Cl, Na).`,
      };
    }
    const subtotal = Number((mass * count).toFixed(4));
    sum += subtotal;
    breakdown.push({ element: el, count, atomicMass: mass, subtotal });
  }

  return {
    formula: formula.trim(),
    molarMass: Number(sum.toFixed(4)),
    breakdown,
  };
}

export interface BalancedTerm {
  formula: string;
  coefficient: number;
  atoms: Record<string, number>;
}

export interface AtomVerificationRow {
  element: string;
  leftCount: number;
  rightCount: number;
  balanced: boolean;
}

export interface BalanceResult {
  success: boolean;
  reactants: BalancedTerm[];
  products: BalancedTerm[];
  balancedEquationText: string;
  atomVerification: AtomVerificationRow[];
  error?: string;
}

function stripLeadingCoefficient(term: string): string {
  return term.trim().replace(/^\d+\s*/, "");
}

export function balanceChemicalEquation(rawEquation: string): BalanceResult {
  const emptyFail = (error: string): BalanceResult => ({
    success: false,
    reactants: [],
    products: [],
    balancedEquationText: "",
    atomVerification: [],
    error,
  });

  const normalized = rawEquation
    .trim()
    .replace(/→|⟶|==>|<=>|=/g, "->")
    .replace(/\s+/g, " ");

  if (!normalized) {
    return emptyFail("Vui lòng nhập phương trình hóa học (VD: Fe + H2SO4 -> Fe2(SO4)3 + SO2 + H2O).");
  }

  const sides = normalized.split("->");
  if (sides.length !== 2) {
    return emptyFail("Phương trình cần có đúng 1 mũi tên '->' hoặc dấu '=' ngăn cách chất tham gia và sản phẩm.");
  }

  const leftRaw = sides[0]
    .split("+")
    .map(stripLeadingCoefficient)
    .filter(Boolean);
  const rightRaw = sides[1]
    .split("+")
    .map(stripLeadingCoefficient)
    .filter(Boolean);

  if (leftRaw.length === 0 || rightRaw.length === 0) {
    return emptyFail("Cần có ít nhất 1 chất tham gia ở vế trái và 1 sản phẩm ở vế phải.");
  }

  const allFormulas = [...leftRaw, ...rightRaw];
  const parsedTerms: Array<{ formula: string; atoms: Record<string, number>; isProduct: boolean }> = [];
  const elementSet = new Set<string>();

  for (let i = 0; i < allFormulas.length; i++) {
    const formula = allFormulas[i];
    const parsed = parseChemicalFormula(formula);
    if (parsed.error) {
      return emptyFail(parsed.error);
    }
    for (const el of Object.keys(parsed.atoms)) {
      elementSet.add(el);
    }
    parsedTerms.push({
      formula,
      atoms: parsed.atoms,
      isProduct: i >= leftRaw.length,
    });
  }

  const elements = Array.from(elementSet);
  const rows = elements.length;
  const cols = parsedTerms.length;

  // Build matrix over exact BigInt fractions: reactants positive, products negative
  const matrix: Fraction[][] = elements.map((el) =>
    parsedTerms.map((term) => {
      const count = BigInt(term.atoms[el] || 0);
      return makeFrac(term.isProduct ? -count : count, ONE);
    })
  );

  // RREF over Q
  const pivotCols: number[] = [];
  let pivotRow = 0;

  for (let col = 0; col < cols && pivotRow < rows; col++) {
    let found = -1;
    for (let r = pivotRow; r < rows; r++) {
      if (matrix[r][col].num !== ZERO) {
        found = r;
        break;
      }
    }
    if (found === -1) continue;

    if (found !== pivotRow) {
      const tmp = matrix[pivotRow];
      matrix[pivotRow] = matrix[found];
      matrix[found] = tmp;
    }

    const pivotVal = matrix[pivotRow][col];
    for (let c = col; c < cols; c++) {
      matrix[pivotRow][c] = divFrac(matrix[pivotRow][c], pivotVal);
    }

    for (let r = 0; r < rows; r++) {
      if (r === pivotRow || matrix[r][col].num === ZERO) continue;
      const factor = matrix[r][col];
      for (let c = col; c < cols; c++) {
        matrix[r][c] = subFrac(matrix[r][c], mulFrac(factor, matrix[pivotRow][c]));
      }
    }

    pivotCols.push(col);
    pivotRow++;
  }

  const freeCols: number[] = [];
  for (let c = 0; c < cols; c++) {
    if (!pivotCols.includes(c)) freeCols.push(c);
  }

  if (freeCols.length === 0) {
    return emptyFail(
      "Phương trình không có nghiệm cân bằng hợp lệ. Hãy kiểm tra lại công thức chất ở hai vế (có thể thiếu chất hoặc sai nguyên tố)."
    );
  }

  if (freeCols.length > 1) {
    return emptyFail(
      "Phương trình có nhiều hơn 1 hệ số tự do (có thể là tổ hợp nhiều phản ứng độc lập), không có bộ hệ số duy nhất."
    );
  }

  // Solve nullspace vector with single free variable = 1
  const freeCol = freeCols[0];
  const vec: Fraction[] = Array.from({ length: cols }, () => makeFrac(ZERO, ONE));
  vec[freeCol] = makeFrac(ONE, ONE);

  for (let r = 0; r < pivotCols.length; r++) {
    const pCol = pivotCols[r];
    vec[pCol] = makeFrac(-matrix[r][freeCol].num, matrix[r][freeCol].den);
  }

  // Scale fractions to smallest integers
  let commonDen = ONE;
  for (const v of vec) {
    commonDen = lcmBig(commonDen, v.den);
  }

  let ints = vec.map((v) => v.num * (commonDen / v.den));

  if (ints[0] < ZERO) {
    ints = ints.map((x) => -x);
  }

  if (ints.some((x) => x <= ZERO)) {
    return emptyFail(
      "Không thể cân bằng với toàn bộ hệ số dương. Hãy kiểm tra lại chất tham gia và sản phẩm ở hai vế."
    );
  }

  let g = ints[0];
  for (let i = 1; i < ints.length; i++) {
    g = gcdBig(g, ints[i]);
  }
  const coefficients = ints.map((x) => Number(x / g));

  const reactants: BalancedTerm[] = [];
  const products: BalancedTerm[] = [];

  for (let i = 0; i < parsedTerms.length; i++) {
    const term: BalancedTerm = {
      formula: parsedTerms[i].formula,
      coefficient: coefficients[i],
      atoms: parsedTerms[i].atoms,
    };
    if (parsedTerms[i].isProduct) {
      products.push(term);
    } else {
      reactants.push(term);
    }
  }

  const atomVerification: AtomVerificationRow[] = elements.map((el) => {
    const leftCount = reactants.reduce(
      (sum, t) => sum + t.coefficient * (t.atoms[el] || 0),
      0
    );
    const rightCount = products.reduce(
      (sum, t) => sum + t.coefficient * (t.atoms[el] || 0),
      0
    );
    return {
      element: el,
      leftCount,
      rightCount,
      balanced: leftCount === rightCount && leftCount > 0,
    };
  });

  if (atomVerification.some((row) => !row.balanced)) {
    return emptyFail("Không thể cân bằng chính xác tất cả nguyên tố.");
  }

  const fmtSide = (terms: BalancedTerm[]) =>
    terms
      .map((t) => (t.coefficient === 1 ? t.formula : `${t.coefficient}${t.formula}`))
      .join(" + ");

  return {
    success: true,
    reactants,
    products,
    balancedEquationText: `${fmtSide(reactants)} -> ${fmtSide(products)}`,
    atomVerification,
  };
}

export interface ChemPreset {
  label: string;
  equation: string;
  tag: string;
}

export const CHEM_PRESETS: ChemPreset[] = [
  {
    label: "Fe + H2SO4 đặc, nóng",
    equation: "Fe + H2SO4 -> Fe2(SO4)3 + SO2 + H2O",
    tag: "Oxi hóa - Khử kinh điển",
  },
  {
    label: "Cu + HNO3 loãng",
    equation: "Cu + HNO3 -> Cu(NO3)2 + NO + H2O",
    tag: "Lớp 11 • Nitơ",
  },
  {
    label: "KMnO4 + HCl đặc",
    equation: "KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O",
    tag: "Điều chế Clo",
  },
  {
    label: "Phản ứng nhiệt nhôm",
    equation: "Al + Fe2O3 -> Al2O3 + Fe",
    tag: "Kim loại Al",
  },
  {
    label: "Đốt quặng Pirit sắt",
    equation: "FeS2 + O2 -> Fe2O3 + SO2",
    tag: "Sản xuất H2SO4",
  },
  {
    label: "Al + HNO3 -> N2O",
    equation: "Al + HNO3 -> Al(NO3)3 + N2O + H2O",
    tag: "Hệ số lớn",
  },
  {
    label: "Trung hòa Ca(OH)2 + H3PO4",
    equation: "Ca(OH)2 + H3PO4 -> Ca3(PO4)2 + H2O",
    tag: "Ngoặc kép",
  },
];
