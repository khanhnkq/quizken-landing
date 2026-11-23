/**
 * Pure TypeScript ISO/IEC 18004 QR Code Generator (Byte mode UTF-8, Versions 1–10, ECC L/M).
 * Zero external dependencies.
 */

export type QrEccLevel = "L" | "M";

interface VersionSpec {
  version: number;
  totalCodewords: number;
  ecPerBlock: number;
  blocksG1: number;
  dataPerBlockG1: number;
  blocksG2: number;
  dataPerBlockG2: number;
  alignments: number[];
}

// ISO/IEC 18004 Table 9 specs for Versions 1..10
const VERSION_SPECS: Record<QrEccLevel, VersionSpec[]> = {
  L: [
    { version: 1, totalCodewords: 26, ecPerBlock: 7, blocksG1: 1, dataPerBlockG1: 19, blocksG2: 0, dataPerBlockG2: 0, alignments: [] },
    { version: 2, totalCodewords: 44, ecPerBlock: 10, blocksG1: 1, dataPerBlockG1: 34, blocksG2: 0, dataPerBlockG2: 0, alignments: [6, 18] },
    { version: 3, totalCodewords: 70, ecPerBlock: 15, blocksG1: 1, dataPerBlockG1: 55, blocksG2: 0, dataPerBlockG2: 0, alignments: [6, 22] },
    { version: 4, totalCodewords: 100, ecPerBlock: 20, blocksG1: 1, dataPerBlockG1: 80, blocksG2: 0, dataPerBlockG2: 0, alignments: [6, 26] },
    { version: 5, totalCodewords: 134, ecPerBlock: 26, blocksG1: 1, dataPerBlockG1: 108, blocksG2: 0, dataPerBlockG2: 0, alignments: [6, 30] },
    { version: 6, totalCodewords: 172, ecPerBlock: 18, blocksG1: 2, dataPerBlockG1: 68, blocksG2: 0, dataPerBlockG2: 0, alignments: [6, 34] },
    { version: 7, totalCodewords: 196, ecPerBlock: 20, blocksG1: 2, dataPerBlockG1: 78, blocksG2: 0, dataPerBlockG2: 0, alignments: [6, 22, 38] },
    { version: 8, totalCodewords: 242, ecPerBlock: 24, blocksG1: 2, dataPerBlockG1: 97, blocksG2: 0, dataPerBlockG2: 0, alignments: [6, 24, 42] },
    { version: 9, totalCodewords: 292, ecPerBlock: 30, blocksG1: 2, dataPerBlockG1: 116, blocksG2: 0, dataPerBlockG2: 0, alignments: [6, 26, 46] },
    { version: 10, totalCodewords: 346, ecPerBlock: 18, blocksG1: 2, dataPerBlockG1: 68, blocksG2: 2, dataPerBlockG2: 69, alignments: [6, 28, 50] },
  ],
  M: [
    { version: 1, totalCodewords: 26, ecPerBlock: 10, blocksG1: 1, dataPerBlockG1: 16, blocksG2: 0, dataPerBlockG2: 0, alignments: [] },
    { version: 2, totalCodewords: 44, ecPerBlock: 16, blocksG1: 1, dataPerBlockG1: 28, blocksG2: 0, dataPerBlockG2: 0, alignments: [6, 18] },
    { version: 3, totalCodewords: 70, ecPerBlock: 26, blocksG1: 1, dataPerBlockG1: 44, blocksG2: 0, dataPerBlockG2: 0, alignments: [6, 22] },
    { version: 4, totalCodewords: 100, ecPerBlock: 18, blocksG1: 2, dataPerBlockG1: 32, blocksG2: 0, dataPerBlockG2: 0, alignments: [6, 26] },
    { version: 5, totalCodewords: 134, ecPerBlock: 24, blocksG1: 2, dataPerBlockG1: 43, blocksG2: 0, dataPerBlockG2: 0, alignments: [6, 30] },
    { version: 6, totalCodewords: 172, ecPerBlock: 16, blocksG1: 4, dataPerBlockG1: 27, blocksG2: 0, dataPerBlockG2: 0, alignments: [6, 34] },
    { version: 7, totalCodewords: 196, ecPerBlock: 18, blocksG1: 4, dataPerBlockG1: 31, blocksG2: 0, dataPerBlockG2: 0, alignments: [6, 22, 38] },
    { version: 8, totalCodewords: 242, ecPerBlock: 22, blocksG1: 2, dataPerBlockG1: 38, blocksG2: 2, dataPerBlockG2: 39, alignments: [6, 24, 42] },
    { version: 9, totalCodewords: 292, ecPerBlock: 22, blocksG1: 3, dataPerBlockG1: 36, blocksG2: 2, dataPerBlockG2: 37, alignments: [6, 26, 46] },
    { version: 10, totalCodewords: 346, ecPerBlock: 26, blocksG1: 4, dataPerBlockG1: 43, blocksG2: 1, dataPerBlockG2: 44, alignments: [6, 28, 50] },
  ],
};

// GF(256) with primitive polynomial 0x11d
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) {
    GF_EXP[i] = GF_EXP[i - 255];
  }
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGeneratorPoly(ecCount: number): number[] {
  let poly = [1];
  for (let i = 0; i < ecCount; i++) {
    const next = new Array<number>(poly.length + 1).fill(0);
    const root = GF_EXP[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], root);
    }
    poly = next;
  }
  return poly;
}

function rsComputeEc(data: number[], ecCount: number): number[] {
  const gen = rsGeneratorPoly(ecCount);
  const res = new Array<number>(ecCount).fill(0);
  for (const byte of data) {
    const factor = byte ^ res[0];
    res.shift();
    res.push(0);
    if (factor !== 0) {
      for (let j = 0; j < ecCount; j++) {
        res[j] ^= gfMul(gen[j + 1], factor);
      }
    }
  }
  return res;
}

function pushBits(bits: number[], val: number, count: number) {
  for (let i = count - 1; i >= 0; i--) {
    bits.push((val >>> i) & 1);
  }
}

function computeFormatBits(ecc: QrEccLevel, mask: number): number {
  // ECC format indicator: L = 01 (1), M = 00 (0)
  const eccBits = ecc === "L" ? 1 : 0;
  const data = (eccBits << 3) | mask;
  let rem = data << 10;
  const gen = 0x537;
  for (let i = 4; i >= 0; i--) {
    if ((rem >>> (i + 10)) & 1) {
      rem ^= gen << i;
    }
  }
  return ((data << 10) | rem) ^ 0x5412;
}

function computeVersionBits(version: number): number {
  let rem = version << 12;
  const gen = 0x1f25;
  for (let i = 5; i >= 0; i--) {
    if ((rem >>> (i + 12)) & 1) {
      rem ^= gen << i;
    }
  }
  return (version << 12) | rem;
}

function isMaskTrue(mask: number, r: number, c: number): boolean {
  switch (mask) {
    case 0:
      return (r + c) % 2 === 0;
    case 1:
      return r % 2 === 0;
    case 2:
      return c % 3 === 0;
    case 3:
      return (r + c) % 3 === 0;
    case 4:
      return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
    case 5:
      return ((r * c) % 2) + ((r * c) % 3) === 0;
    case 6:
      return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
    case 7:
    default:
      return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
  }
}

function evaluatePenalty(grid: boolean[][]): number {
  const n = grid.length;
  let penalty = 0;

  // Rule 1: 5+ consecutive modules in row or column
  for (let r = 0; r < n; r++) {
    let runLen = 1;
    for (let c = 1; c < n; c++) {
      if (grid[r][c] === grid[r][c - 1]) {
        runLen++;
      } else {
        if (runLen >= 5) penalty += 3 + (runLen - 5);
        runLen = 1;
      }
    }
    if (runLen >= 5) penalty += 3 + (runLen - 5);
  }
  for (let c = 0; c < n; c++) {
    let runLen = 1;
    for (let r = 1; r < n; r++) {
      if (grid[r][c] === grid[r - 1][c]) {
        runLen++;
      } else {
        if (runLen >= 5) penalty += 3 + (runLen - 5);
        runLen = 1;
      }
    }
    if (runLen >= 5) penalty += 3 + (runLen - 5);
  }

  // Rule 2: 2x2 blocks
  for (let r = 0; r < n - 1; r++) {
    for (let c = 0; c < n - 1; c++) {
      const v = grid[r][c];
      if (
        grid[r][c + 1] === v &&
        grid[r + 1][c] === v &&
        grid[r + 1][c + 1] === v
      ) {
        penalty += 3;
      }
    }
  }

  // Rule 3: 1:1:3:1:1 pattern with 4 light modules on either side
  const matchPattern = (arr: boolean[], start: number, pat: number[]) =>
    pat.every((v, idx) => (arr[start + idx] ? 1 : 0) === v);
  const p1 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
  const p2 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];

  for (let r = 0; r < n; r++) {
    for (let c = 0; c <= n - 11; c++) {
      if (matchPattern(grid[r], c, p1) || matchPattern(grid[r], c, p2)) {
        penalty += 40;
      }
    }
  }
  for (let c = 0; c < n; c++) {
    const colArr = Array.from({ length: n }, (_, r) => grid[r][c]);
    for (let r = 0; r <= n - 11; r++) {
      if (matchPattern(colArr, r, p1) || matchPattern(colArr, r, p2)) {
        penalty += 40;
      }
    }
  }

  // Rule 4: dark ratio deviation from 50%
  let darkCount = 0;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c]) darkCount++;
    }
  }
  const pct = (darkCount * 100) / (n * n);
  const prev5 = Math.floor(pct / 5) * 5;
  const next5 = Math.ceil(pct / 5) * 5;
  const d1 = Math.abs(prev5 - 50) / 5;
  const d2 = Math.abs(next5 - 50) / 5;
  penalty += Math.min(d1, d2) * 10;

  return penalty;
}

export interface QrMatrixResult {
  success: boolean;
  version: number;
  size: number;
  matrix: boolean[][];
  error?: string;
}

export function encodeQrMatrix(
  text: string,
  ecc: QrEccLevel = "M"
): QrMatrixResult {
  if (!text) {
    return {
      success: false,
      version: 0,
      size: 0,
      matrix: [],
      error: "Vui lòng nhập nội dung cần tạo mã QR.",
    };
  }

  const utf8Bytes = Array.from(new TextEncoder().encode(text));
  const specs = VERSION_SPECS[ecc];

  // Find smallest version fitting utf8Bytes
  let chosen: VersionSpec | null = null;
  for (const spec of specs) {
    const totalDataCodewords =
      spec.blocksG1 * spec.dataPerBlockG1 + spec.blocksG2 * spec.dataPerBlockG2;
    const countBits = spec.version <= 9 ? 8 : 16;
    const neededBits = 4 + countBits + utf8Bytes.length * 8;
    if (neededBits <= totalDataCodewords * 8) {
      chosen = spec;
      break;
    }
  }

  if (!chosen) {
    return {
      success: false,
      version: 0,
      size: 0,
      matrix: [],
      error:
        "Nội dung quá dài cho QR Version 1–10 (tối đa ~270 ký tự UTF-8 với mức M hoặc ~271 byte với mức L). Hãy rút gọn liên kết.",
    };
  }

  const totalDataCodewords =
    chosen.blocksG1 * chosen.dataPerBlockG1 +
    chosen.blocksG2 * chosen.dataPerBlockG2;
  const countBits = chosen.version <= 9 ? 8 : 16;

  // Build bit stream
  const bits: number[] = [];
  pushBits(bits, 0b0100, 4); // Byte mode
  pushBits(bits, utf8Bytes.length, countBits);
  for (const b of utf8Bytes) pushBits(bits, b, 8);

  const maxBits = totalDataCodewords * 8;
  const termLen = Math.min(4, maxBits - bits.length);
  for (let i = 0; i < termLen; i++) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);

  const dataBytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let val = 0;
    for (let k = 0; k < 8; k++) val = (val << 1) | bits[i + k];
    dataBytes.push(val);
  }

  const pads = [0xec, 0x11];
  let padIdx = 0;
  while (dataBytes.length < totalDataCodewords) {
    dataBytes.push(pads[padIdx % 2]);
    padIdx++;
  }

  // Split into blocks & compute Reed-Solomon EC
  const dataBlocks: number[][] = [];
  const ecBlocks: number[][] = [];
  let offset = 0;

  for (let i = 0; i < chosen.blocksG1; i++) {
    const blk = dataBytes.slice(offset, offset + chosen.dataPerBlockG1);
    offset += chosen.dataPerBlockG1;
    dataBlocks.push(blk);
    ecBlocks.push(rsComputeEc(blk, chosen.ecPerBlock));
  }
  for (let i = 0; i < chosen.blocksG2; i++) {
    const blk = dataBytes.slice(offset, offset + chosen.dataPerBlockG2);
    offset += chosen.dataPerBlockG2;
    dataBlocks.push(blk);
    ecBlocks.push(rsComputeEc(blk, chosen.ecPerBlock));
  }

  // Interleave data codewords + EC codewords
  const finalCodewords: number[] = [];
  const maxDataLen = Math.max(chosen.dataPerBlockG1, chosen.dataPerBlockG2);
  for (let c = 0; c < maxDataLen; c++) {
    for (const blk of dataBlocks) {
      if (c < blk.length) finalCodewords.push(blk[c]);
    }
  }
  for (let c = 0; c < chosen.ecPerBlock; c++) {
    for (const ecBlk of ecBlocks) {
      finalCodewords.push(ecBlk[c]);
    }
  }

  const finalBits: number[] = [];
  for (const cw of finalCodewords) pushBits(finalBits, cw, 8);
  const remainderBits =
    chosen.version >= 2 && chosen.version <= 6 ? 7 : 0;
  for (let i = 0; i < remainderBits; i++) finalBits.push(0);

  // Place function patterns
  const size = 17 + 4 * chosen.version;
  const modules: boolean[][] = Array.from({ length: size }, () =>
    new Array<boolean>(size).fill(false)
  );
  const isFunc: boolean[][] = Array.from({ length: size }, () =>
    new Array<boolean>(size).fill(false)
  );

  const setFunc = (r: number, c: number, dark: boolean) => {
    if (r < 0 || r >= size || c < 0 || c >= size) return;
    modules[r][c] = dark;
    isFunc[r][c] = true;
  };

  const drawFinder = (top: number, left: number) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const r = top + dr;
        const c = left + dc;
        if (r < 0 || r >= size || c < 0 || c >= size) continue;
        const inOuter =
          dr >= 0 &&
          dr <= 6 &&
          dc >= 0 &&
          dc <= 6 &&
          (dr === 0 || dr === 6 || dc === 0 || dc === 6);
        const inInner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        setFunc(r, c, inOuter || inInner);
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    setFunc(6, i, i % 2 === 0);
    setFunc(i, 6, i % 2 === 0);
  }

  // Alignment patterns
  const centers = chosen.alignments;
  for (const cr of centers) {
    for (const cc of centers) {
      // Skip if overlapping any finder pattern
      if (
        (cr <= 8 && cc <= 8) ||
        (cr <= 8 && cc >= size - 9) ||
        (cr >= size - 9 && cc <= 8)
      ) {
        continue;
      }
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const dark =
            Math.max(Math.abs(dr), Math.abs(dc)) === 2 ||
            (dr === 0 && dc === 0);
          setFunc(cr + dr, cc + dc, dark);
        }
      }
    }
  }

  // Reserve format info modules
  for (let i = 0; i <= 8; i++) {
    if (i !== 6) {
      setFunc(8, i, false);
      setFunc(i, 8, false);
    }
  }
  for (let i = size - 8; i < size; i++) {
    setFunc(8, i, false);
  }
  for (let i = size - 7; i < size; i++) {
    setFunc(i, 8, false);
  }
  // Dark module
  setFunc(size - 8, 8, true);

  // Version info for v >= 7
  if (chosen.version >= 7) {
    const vBits = computeVersionBits(chosen.version);
    for (let i = 0; i < 18; i++) {
      const dark = ((vBits >>> i) & 1) === 1;
      const a = Math.floor(i / 3);
      const b = size - 11 + (i % 3);
      setFunc(a, b, dark);
      setFunc(b, a, dark);
    }
  }

  // Place data bits in zig-zag order
  let bitPtr = 0;
  let upward = true;
  for (let rightCol = size - 1; rightCol >= 1; rightCol -= 2) {
    if (rightCol === 6) rightCol = 5;
    for (let step = 0; step < size; step++) {
      const r = upward ? size - 1 - step : step;
      for (let dc = 0; dc <= 1; dc++) {
        const c = rightCol - dc;
        if (!isFunc[r][c]) {
          const bit = bitPtr < finalBits.length ? finalBits[bitPtr] : 0;
          bitPtr++;
          modules[r][c] = bit === 1;
        }
      }
    }
    upward = !upward;
  }

  // Evaluate 8 masks and pick lowest penalty
  let bestPenalty = Infinity;
  let bestGrid = modules;

  for (let mask = 0; mask < 8; mask++) {
    const candidate = modules.map((row, r) =>
      row.map((val, c) => (isFunc[r][c] ? val : val !== isMaskTrue(mask, r, c)))
    );

    // Draw format bits into candidate
    const fBits = computeFormatBits(ecc, mask);
    for (let i = 0; i < 15; i++) {
      const dark = ((fBits >>> i) & 1) === 1;
      // Vertical copy (top-left + bottom-left)
      if (i < 6) candidate[i][8] = dark;
      else if (i < 8) candidate[i + 1][8] = dark;
      else candidate[size - 15 + i][8] = dark;

      // Horizontal copy (top-right + top-left)
      if (i < 8) candidate[8][size - 1 - i] = dark;
      else if (i < 9) candidate[8][15 - i] = dark;
      else candidate[8][14 - i] = dark;
    }

    const penalty = evaluatePenalty(candidate);
    if (penalty < bestPenalty) {
      bestPenalty = penalty;
      bestGrid = candidate;
    }
  }

  return {
    success: true,
    version: chosen.version,
    size,
    matrix: bestGrid,
  };
}
