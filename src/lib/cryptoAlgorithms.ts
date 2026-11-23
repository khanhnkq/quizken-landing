// 100% Client-Side Cryptography, Hashing, Encoding & Educational Math Utilities
// Uses W3C Web Crypto API (window.crypto.subtle / getRandomValues) and BigInt(...) constructor (no BigInt literals).

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder("utf-8", { fatal: true });

const ZERO = BigInt(0);
const ONE = BigInt(1);
const TWO = BigInt(2);

/* -------------------------------------------------------------------------- */
/*                     UTF-8 Base64 & Base64URL Helpers                       */
/* -------------------------------------------------------------------------- */

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

export function base64ToBytes(base64Input: string): Uint8Array {
  const cleaned = base64Input.replace(/\s+/g, "");
  let normalized = cleaned.replace(/-/g, "+").replace(/_/g, "/");
  const mod = normalized.length % 4;
  if (mod === 1) {
    throw new Error("Chuỗi Base64 không hợp lệ (độ dài dư 1 mod 4).");
  }
  if (mod > 0) {
    normalized += "=".repeat(4 - mod);
  }
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function bytesToBase64Url(bytes: Uint8Array): string {
  return bytesToBase64(bytes)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function utf8ToBase64(text: string): string {
  return bytesToBase64(utf8Encoder.encode(text));
}

export function utf8ToBase64Url(text: string): string {
  return bytesToBase64Url(utf8Encoder.encode(text));
}

export function base64ToUtf8(base64Input: string): string {
  const bytes = base64ToBytes(base64Input);
  return utf8Decoder.decode(bytes);
}

export function bytesToHex(bytes: Uint8Array): string {
  let hex = "";
  for (let i = 0; i < bytes.length; i += 1) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

/* -------------------------------------------------------------------------- */
/*                         Pure TypeScript RFC 1321 MD5                       */
/* -------------------------------------------------------------------------- */

const MD5_SHIFTS = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
] as const;

const MD5_K: number[] = Array.from({ length: 64 }, (_, i) =>
  Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0,
);

function rotLeft32(value: number, shift: number): number {
  return ((value << shift) | (value >>> (32 - shift))) >>> 0;
}

function toLittleEndianHex32(n: number): string {
  let out = "";
  for (let i = 0; i < 4; i += 1) {
    out += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, "0");
  }
  return out;
}

export function md5(text: string): string {
  const msgBytes = utf8Encoder.encode(text);
  const msgLen = msgBytes.length;
  const bitLen = msgLen * 8;

  // Pad to 56 mod 64 bytes, then append 64-bit little-endian length
  const paddedLen = (((msgLen + 8) >>> 6) + 1) * 64;
  const padded = new Uint8Array(paddedLen);
  padded.set(msgBytes);
  padded[msgLen] = 0x80;

  const view = new DataView(padded.buffer);
  view.setUint32(paddedLen - 8, bitLen >>> 0, true);
  view.setUint32(paddedLen - 4, Math.floor(bitLen / 0x100000000) >>> 0, true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  const words = new Uint32Array(16);

  for (let offset = 0; offset < paddedLen; offset += 64) {
    for (let j = 0; j < 16; j += 1) {
      words[j] = view.getUint32(offset + j * 4, true);
    }

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let i = 0; i < 64; i += 1) {
      let f = 0;
      let g = 0;

      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) % 16;
      }

      const temp = d;
      d = c;
      c = b;
      const sum = (a + (f >>> 0) + MD5_K[i] + words[g]) >>> 0;
      b = (b + rotLeft32(sum, MD5_SHIFTS[i])) >>> 0;
      a = temp;
    }

    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  return (
    toLittleEndianHex32(a0) +
    toLittleEndianHex32(b0) +
    toLittleEndianHex32(c0) +
    toLittleEndianHex32(d0)
  );
}

/* -------------------------------------------------------------------------- */
/*                     Web Crypto Hash & HMAC-SHA256                          */
/* -------------------------------------------------------------------------- */

export type WebCryptoHashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export async function webCryptoHash(
  algorithm: WebCryptoHashAlgorithm,
  text: string,
): Promise<string> {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    throw new Error("Trình duyệt không hỗ trợ Web Crypto API.");
  }
  const digest = await window.crypto.subtle.digest(
    algorithm,
    utf8Encoder.encode(text),
  );
  return bytesToHex(new Uint8Array(digest));
}

export async function signHmacSha256(
  secret: string,
  message: string,
): Promise<Uint8Array> {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    throw new Error("Trình duyệt không hỗ trợ Web Crypto API.");
  }
  const key = await window.crypto.subtle.importKey(
    "raw",
    utf8Encoder.encode(secret),
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"],
  );
  const sig = await window.crypto.subtle.sign(
    "HMAC",
    key,
    utf8Encoder.encode(message),
  );
  return new Uint8Array(sig);
}

export async function hmacSha256Hex(
  secret: string,
  message: string,
): Promise<string> {
  const bytes = await signHmacSha256(secret, message);
  return bytesToHex(bytes);
}

export async function hmacSha256Base64Url(
  secret: string,
  message: string,
): Promise<string> {
  const bytes = await signHmacSha256(secret, message);
  return bytesToBase64Url(bytes);
}

/* -------------------------------------------------------------------------- */
/*                 Web Crypto AES-256-GCM + PBKDF2 (100,000 iters)            */
/* -------------------------------------------------------------------------- */

export const AES_PBKDF2_ITERATIONS = 100_000;
const AES_SALT_BYTES = 16;
const AES_IV_BYTES = 12;

export type AesEncryptResult = {
  payloadBase64: string;
  saltBase64: string;
  ivBase64: string;
  ciphertextBase64: string;
  iterations: number;
};

export type AesDecryptResult = {
  plaintext: string;
  saltBase64: string;
  ivBase64: string;
  ciphertextBytes: number;
};

async function deriveAes256GcmKey(
  passphrase: string,
  salt: Uint8Array,
  usage: "encrypt" | "decrypt",
): Promise<CryptoKey> {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    throw new Error("Trình duyệt không hỗ trợ Web Crypto API.");
  }
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    utf8Encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const saltBuffer = new Uint8Array(salt).buffer;
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: AES_PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    [usage],
  );
}

export async function encryptAes256Gcm(
  plaintext: string,
  passphrase: string,
): Promise<AesEncryptResult> {
  if (!passphrase) {
    throw new Error("Vui lòng nhập mật khẩu (passphrase) để mã hóa.");
  }
  const salt = window.crypto.getRandomValues(new Uint8Array(AES_SALT_BYTES));
  const iv = window.crypto.getRandomValues(new Uint8Array(AES_IV_BYTES));
  const aesKey = await deriveAes256GcmKey(passphrase, salt, "encrypt");

  const ivBuffer = new Uint8Array(iv).buffer;
  const encryptedBuf = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: ivBuffer },
    aesKey,
    utf8Encoder.encode(plaintext),
  );
  const cipherBytes = new Uint8Array(encryptedBuf);
  const packed = new Uint8Array(salt.length + iv.length + cipherBytes.length);
  packed.set(salt, 0);
  packed.set(iv, salt.length);
  packed.set(cipherBytes, salt.length + iv.length);

  return {
    payloadBase64: bytesToBase64(packed),
    saltBase64: bytesToBase64(salt),
    ivBase64: bytesToBase64(iv),
    ciphertextBase64: bytesToBase64(cipherBytes),
    iterations: AES_PBKDF2_ITERATIONS,
  };
}

export async function decryptAes256Gcm(
  payloadBase64: string,
  passphrase: string,
): Promise<AesDecryptResult> {
  if (!passphrase) {
    throw new Error("Vui lòng nhập mật khẩu (passphrase) để giải mã.");
  }
  let packed: Uint8Array;
  try {
    packed = base64ToBytes(payloadBase64.trim());
  } catch {
    throw new Error("Chuỗi mã hóa Base64 không hợp lệ.");
  }

  // Minimum: 16B salt + 12B IV + 16B GCM auth tag
  if (packed.length < AES_SALT_BYTES + AES_IV_BYTES + 16) {
    throw new Error("Dữ liệu mã hóa quá ngắn hoặc không đúng cấu trúc Salt + IV + Ciphertext.");
  }

  const salt = packed.slice(0, AES_SALT_BYTES);
  const iv = packed.slice(AES_SALT_BYTES, AES_SALT_BYTES + AES_IV_BYTES);
  const cipherBytes = packed.slice(AES_SALT_BYTES + AES_IV_BYTES);

  const aesKey = await deriveAes256GcmKey(passphrase, salt, "decrypt");
  try {
    const decryptedBuf = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv).buffer },
      aesKey,
      new Uint8Array(cipherBytes).buffer,
    );
    return {
      plaintext: utf8Decoder.decode(new Uint8Array(decryptedBuf)),
      saltBase64: bytesToBase64(salt),
      ivBase64: bytesToBase64(iv),
      ciphertextBytes: cipherBytes.length,
    };
  } catch {
    throw new Error("Giải mã thất bại: sai mật khẩu hoặc dữ liệu đã bị thay đổi (xác thực GCM Tag không khớp).");
  }
}

/* -------------------------------------------------------------------------- */
/*                     Educational RSA Math (BigInt Constructor)              */
/* -------------------------------------------------------------------------- */

export function gcdBigInt(a: bigint, b: bigint): bigint {
  let x = a < ZERO ? -a : a;
  let y = b < ZERO ? -b : b;
  while (y !== ZERO) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

export function modPowBigInt(base: bigint, exp: bigint, mod: bigint): bigint {
  if (mod === ONE) return ZERO;
  let result = ONE;
  let b = ((base % mod) + mod) % mod;
  let e = exp;
  while (e > ZERO) {
    if (e % TWO === ONE) {
      result = (result * b) % mod;
    }
    e = e / TWO;
    b = (b * b) % mod;
  }
  return result;
}

export function extendedGcdBigInt(
  a: bigint,
  b: bigint,
): { gcd: bigint; x: bigint; y: bigint } {
  let oldR = a;
  let r = b;
  let oldS = ONE;
  let s = ZERO;
  let oldT = ZERO;
  let t = ONE;

  while (r !== ZERO) {
    const q = oldR / r;
    const nextR = oldR - q * r;
    oldR = r;
    r = nextR;

    const nextS = oldS - q * s;
    oldS = s;
    s = nextS;

    const nextT = oldT - q * t;
    oldT = t;
    t = nextT;
  }

  return { gcd: oldR, x: oldS, y: oldT };
}

export function modInverseBigInt(e: bigint, phi: bigint): bigint | null {
  const { gcd, x } = extendedGcdBigInt(e, phi);
  if (gcd !== ONE) return null;
  return ((x % phi) + phi) % phi;
}

export function isPrimeBigInt(n: bigint): boolean {
  if (n < TWO) return false;
  if (n === TWO || n === BigInt(3)) return true;
  if (n % TWO === ZERO || n % BigInt(3) === ZERO) return false;

  // Deterministic check for educational primes up to 10^12 via 6k +/- 1 up to sqrt(n)
  // Cap loop guard for huge user inputs with Miller-Rabin fallback
  const three = BigInt(3);
  const six = BigInt(6);
  const limit = BigInt(1_000_000);
  for (let i = BigInt(5); i * i <= n && i <= limit; i = i + six) {
    if (n % i === ZERO || n % (i + TWO) === ZERO) {
      return false;
    }
  }
  if (n <= limit * limit) {
    return true;
  }

  // Deterministic Miller-Rabin bases for 64-bit integers
  const bases = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37].map((v) =>
    BigInt(v),
  );
  let d = n - ONE;
  let s = 0;
  while (d % TWO === ZERO) {
    d = d / TWO;
    s += 1;
  }
  const nMinusOne = n - ONE;
  for (const a of bases) {
    if (a >= n) continue;
    let x = modPowBigInt(a, d, n);
    if (x === ONE || x === nMinusOne) continue;
    let composite = true;
    for (let r = 1; r < s; r += 1) {
      x = (x * x) % n;
      if (x === nMinusOne) {
        composite = false;
        break;
      }
      if (x <= three && x === ONE) {
        return false;
      }
    }
    if (composite) return false;
  }
  return true;
}

export type RsaKeyComputation =
  | {
      valid: true;
      p: string;
      q: string;
      n: string;
      phi: string;
      e: string;
      d: string;
      steps: string[];
    }
  | {
      valid: false;
      error: string;
    };

export function computeRsaParameters(
  pStr: string,
  qStr: string,
  eStr: string,
): RsaKeyComputation {
  let p: bigint;
  let q: bigint;
  let e: bigint;
  try {
    if (!/^\d+$/.test(pStr.trim()) || !/^\d+$/.test(qStr.trim()) || !/^\d+$/.test(eStr.trim())) {
      return { valid: false, error: "p, q và e phải là các số nguyên dương." };
    }
    p = BigInt(pStr.trim());
    q = BigInt(qStr.trim());
    e = BigInt(eStr.trim());
  } catch {
    return { valid: false, error: "Không thể phân tích giá trị số nguyên lớn p, q, e." };
  }

  if (!isPrimeBigInt(p)) {
    return { valid: false, error: `p = ${p.toString()} không phải là số nguyên tố.` };
  }
  if (!isPrimeBigInt(q)) {
    return { valid: false, error: `q = ${q.toString()} không phải là số nguyên tố.` };
  }
  if (p === q) {
    return { valid: false, error: "p và q phải là hai số nguyên tố phân biệt (p ≠ q)." };
  }

  const n = p * q;
  if (n <= TWO) {
    return { valid: false, error: "Tích n = p × q quá nhỏ." };
  }
  const phi = (p - ONE) * (q - ONE);

  if (e <= ONE || e >= phi) {
    return {
      valid: false,
      error: `Số mũ công khai e phải thỏa mãn 1 < e < φ(n) = ${phi.toString()}.`,
    };
  }

  const g = gcdBigInt(e, phi);
  if (g !== ONE) {
    return {
      valid: false,
      error: `gcd(e, φ(n)) = gcd(${e.toString()}, ${phi.toString()}) = ${g.toString()} ≠ 1. Hãy chọn e nguyên tố cùng nhau với φ(n).`,
    };
  }

  const d = modInverseBigInt(e, phi);
  if (d === null) {
    return { valid: false, error: "Không tìm thấy nghịch đảo modular d." };
  }

  const steps = [
    `1. Chọn hai số nguyên tố phân biệt: p = ${p.toString()}, q = ${q.toString()}`,
    `2. Tính mô-đun RSA: n = p × q = ${p.toString()} × ${q.toString()} = ${n.toString()}`,
    `3. Tính hàm phi Euler: φ(n) = (p − 1)(q − 1) = ${(p - ONE).toString()} × ${(q - ONE).toString()} = ${phi.toString()}`,
    `4. Kiểm tra nguyên tố cùng nhau: gcd(e, φ(n)) = gcd(${e.toString()}, ${phi.toString()}) = 1`,
    `5. Thuật toán Euclid mở rộng tìm d = e⁻¹ mod φ(n): d = ${d.toString()} (kiểm tra: (e × d) mod φ(n) = ${((e * d) % phi).toString()})`,
    `6. Khóa công khai (Public Key): (e = ${e.toString()}, n = ${n.toString()}) — Khóa bí mật (Private Key): (d = ${d.toString()}, n = ${n.toString()})`,
  ];

  return {
    valid: true,
    p: p.toString(),
    q: q.toString(),
    n: n.toString(),
    phi: phi.toString(),
    e: e.toString(),
    d: d.toString(),
    steps,
  };
}

export function rsaEncryptInteger(
  messageStr: string,
  eStr: string,
  nStr: string,
): { ciphertext: string; formula: string } {
  if (!/^\d+$/.test(messageStr.trim())) {
    throw new Error("Thông điệp số M phải là số nguyên không âm.");
  }
  const m = BigInt(messageStr.trim());
  const e = BigInt(eStr);
  const n = BigInt(nStr);
  if (m >= n) {
    throw new Error(`Số M = ${m.toString()} phải nhỏ hơn n = ${n.toString()} (0 ≤ M < n).`);
  }
  const c = modPowBigInt(m, e, n);
  return {
    ciphertext: c.toString(),
    formula: `C = M^e mod n = ${m.toString()}^${e.toString()} mod ${n.toString()} = ${c.toString()}`,
  };
}

export function rsaDecryptInteger(
  cipherStr: string,
  dStr: string,
  nStr: string,
): { plaintext: string; formula: string } {
  if (!/^\d+$/.test(cipherStr.trim())) {
    throw new Error("Bản mã C phải là số nguyên không âm.");
  }
  const c = BigInt(cipherStr.trim());
  const d = BigInt(dStr);
  const n = BigInt(nStr);
  if (c >= n) {
    throw new Error(`Bản mã C = ${c.toString()} phải nhỏ hơn n = ${n.toString()}.`);
  }
  const m = modPowBigInt(c, d, n);
  return {
    plaintext: m.toString(),
    formula: `M = C^d mod n = ${c.toString()}^${d.toString()} mod ${n.toString()} = ${m.toString()}`,
  };
}

export function rsaEncryptTextBytes(
  text: string,
  eStr: string,
  nStr: string,
): { blocks: string[]; byteDetails: Array<{ char: string; byte: number; cipher: string }> } {
  const e = BigInt(eStr);
  const n = BigInt(nStr);
  if (n <= BigInt(255)) {
    throw new Error(`Để mã hóa ký tự UTF-8 (byte 0..255), mô-đun n = ${n.toString()} phải lớn hơn 255.`);
  }
  const bytes = utf8Encoder.encode(text);
  const blocks: string[] = [];
  const byteDetails: Array<{ char: string; byte: number; cipher: string }> = [];
  for (let i = 0; i < bytes.length; i += 1) {
    const b = bytes[i];
    const c = modPowBigInt(BigInt(b), e, n).toString();
    blocks.push(c);
    byteDetails.push({
      char: b >= 32 && b <= 126 ? String.fromCharCode(b) : `0x${b.toString(16).toUpperCase().padStart(2, "0")}`,
      byte: b,
      cipher: c,
    });
  }
  return { blocks, byteDetails };
}

export function rsaDecryptTextBlocks(
  blocksInput: string,
  dStr: string,
  nStr: string,
): string {
  const d = BigInt(dStr);
  const n = BigInt(nStr);
  const tokens = blocksInput
    .trim()
    .split(/[\s,;]+/)
    .filter(Boolean);
  if (tokens.length === 0) return "";
  const bytes = new Uint8Array(tokens.length);
  for (let i = 0; i < tokens.length; i += 1) {
    if (!/^\d+$/.test(tokens[i])) {
      throw new Error(`Giá trị "${tokens[i]}" không phải số nguyên hợp lệ.`);
    }
    const c = BigInt(tokens[i]);
    if (c >= n) {
      throw new Error(`Giá trị bản mã ${c.toString()} vượt quá mô-đun n = ${n.toString()}.`);
    }
    const m = Number(modPowBigInt(c, d, n));
    if (m < 0 || m > 255) {
      throw new Error(`Kết quả giải mã (${m}) nằm ngoài phạm vi byte UTF-8 (0..255).`);
    }
    bytes[i] = m;
  }
  return utf8Decoder.decode(bytes);
}

/* -------------------------------------------------------------------------- */
/*                     Classical Ciphers: Caesar & Vigenere                   */
/* -------------------------------------------------------------------------- */

export function caesarTransform(
  text: string,
  shift: number,
  mode: "encode" | "decode",
): string {
  const normalizedShift = ((Math.trunc(shift) % 26) + 26) % 26;
  const k = mode === "encode" ? normalizedShift : (26 - normalizedShift) % 26;
  let out = "";
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    if (code >= 65 && code <= 90) {
      out += String.fromCharCode(((code - 65 + k) % 26) + 65);
    } else if (code >= 97 && code <= 122) {
      out += String.fromCharCode(((code - 97 + k) % 26) + 97);
    } else {
      out += text[i];
    }
  }
  return out;
}

export function caesarBruteForce(
  ciphertext: string,
): Array<{ shift: number; plaintext: string }> {
  return Array.from({ length: 25 }, (_, idx) => {
    const shift = idx + 1;
    return {
      shift,
      plaintext: caesarTransform(ciphertext, shift, "decode"),
    };
  });
}

export type VigenereStep = {
  char: string;
  keyChar: string;
  shift: number;
  out: string;
};

export function vigenereTransform(
  text: string,
  rawKey: string,
  mode: "encode" | "decode",
): {
  result: string;
  normalizedKey: string;
  steps: VigenereStep[];
} {
  const normalizedKey = rawKey.toUpperCase().replace(/[^A-Z]/g, "");
  if (!normalizedKey) {
    return { result: text, normalizedKey: "", steps: [] };
  }

  let result = "";
  let keyIndex = 0;
  const steps: VigenereStep[] = [];

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const code = text.charCodeAt(i);
    const isUpper = code >= 65 && code <= 90;
    const isLower = code >= 97 && code <= 122;

    if (!isUpper && !isLower) {
      result += ch;
      continue;
    }

    const keyChar = normalizedKey[keyIndex % normalizedKey.length];
    const shift = keyChar.charCodeAt(0) - 65;
    const base = isUpper ? 65 : 97;
    const offset = mode === "encode" ? shift : (26 - shift) % 26;
    const outChar = String.fromCharCode(((code - base + offset) % 26) + base);

    result += outChar;
    if (steps.length < 40) {
      steps.push({ char: ch, keyChar, shift, out: outChar });
    }
    keyIndex += 1;
  }

  return { result, normalizedKey, steps };
}
