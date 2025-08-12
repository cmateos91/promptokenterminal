// puzzles.js - utilidades de cifrado/derivación/análisis sin dependencias

// Base64 (ASCII-safe)
export const b64 = {
  enc: (s) => typeof btoa !== 'undefined' ? btoa(s) : Buffer.from(s, 'utf8').toString('base64'),
  dec: (s) => typeof atob !== 'undefined' ? atob(s) : Buffer.from(s, 'base64').toString('utf8')
};

// XOR con clave (se repite)
export function xorData(dataStr, key) {
  const data = typeof dataStr === 'string' ? new TextEncoder().encode(dataStr) : dataStr;
  const keyBytes = new TextEncoder().encode(key);
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    out[i] = data[i] ^ keyBytes[i % keyBytes.length];
  }
  return out;
}

export function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

export function hexToBytes(hex) {
  const clean = hex.replace(/[^0-9a-fA-F]/g, '');
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    out[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return out;
}

export function bytesToString(bytes) {
  try { return new TextDecoder().decode(bytes); } catch { return ''; }
}

// Caesar / ROT parametrizable
export function caesar(text, shift) {
  const a = 'abcdefghijklmnopqrstuvwxyz';
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const mod = (n, m) => ((n % m) + m) % m;
  return text.split('').map(ch => {
    const i = a.indexOf(ch);
    if (i >= 0) return a[mod(i + shift, 26)];
    const j = A.indexOf(ch);
    if (j >= 0) return A[mod(j + shift, 26)];
    return ch;
  }).join('');
}

// Vigenere simple (solo letras)
export function vigenere(text, key, decode = false) {
  const a = 'abcdefghijklmnopqrstuvwxyz';
  const mod = (n, m) => ((n % m) + m) % m;
  const k = key.toLowerCase().replace(/[^a-z]/g, '') || 'a';
  let ki = 0;
  return text.split('').map(ch => {
    const ci = a.indexOf(ch.toLowerCase());
    if (ci === -1) return ch;
    const ks = a.indexOf(k[ki % k.length]);
    const val = decode ? mod(ci - ks, 26) : mod(ci + ks, 26);
    const out = a[val];
    ki++;
    return ch === ch.toUpperCase() ? out.toUpperCase() : out;
  }).join('');
}

// Checksums simples
export function asciiSum(s) { return s.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0); }
export function sumMod(bytes, mod = 256) { return bytes.reduce((a, b) => (a + b) % mod, 0); }

// CRC16 simplificado (no estándar, suficiente para puzzle)
export function crc16(bytes) {
  let crc = 0xFFFF;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j++) {
      const carry = crc & 1;
      crc >>= 1;
      if (carry) crc ^= 0xA001; // polinomio típico modbus
    }
  }
  return crc & 0xFFFF;
}

// Derivaciones
export function derive(rule, ctx) {
  // ctx: { name, lastHexDump, anomalies, saltTokens }
  const r = String(rule || '').toLowerCase();
  if (r.includes('period')) {
    // Ej.: periodicity -> "period-7" (fijo intencionalmente para puzzle 1)
    return 'period-7';
  }
  if (r.includes('name.len')) {
    return String((ctx.name || '').length);
  }
  if (r.includes('name.ascii')) {
    return String(asciiSum(ctx.name || ''));
  }
  if (r.includes('salt')) {
    return (ctx.saltTokens || []).join('');
  }
  if (r.includes('crc')) {
    return String(crc16(ctx.lastBytes || new Uint8Array()));
  }
  return '';
}

// Analyzer ligero
export function analyzeContent(bytes) {
  const text = bytesToString(bytes);
  const printable = /[\x20-\x7E\n\r\t]/.test(text);
  const looksB64 = /^[A-Za-z0-9+/=\n\r]+$/.test(text) && text.replace(/\s+/g, '').length % 4 === 0;
  const zeros = bytes.filter(b => b === 0).length;
  const entropyish = sumMod(bytes, 997);

  const hints = [];
  if (looksB64) hints.push('b64?');
  if (!printable && zeros < bytes.length / 4) hints.push('xor?');
  if (/\d{4}-\d{2}-\d{2}/.test(text) && /25\d{2}/.test(text)) hints.push('rot/caesar? timestamp off');
  if (/SALT:/.test(text)) hints.push('salt token present');

  return { printable, looksB64, zeros, entropyish, textPreview: text.slice(0, 200), hints };
}

// Semilla por sesión (determinista opcional)
export function makeSeed() {
  // podemos usar Math.random() y congelarla en nyxEngine.state.puzzleSeed
  return Math.floor(Math.random() * 1e9);
}
