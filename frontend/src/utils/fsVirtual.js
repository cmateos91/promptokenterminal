// fsVirtual.js - sistema de archivos diegético en memoria
import { xorData, bytesToHex } from './puzzles';

// Internal utility: encode/decode UTF-8
const enc = (s) => new TextEncoder().encode(s);
const dec = (b) => { try { return new TextDecoder().decode(b); } catch { return ''; } };

// Base contents (actual clues)
const ROUTES_CLEAR = `# routes.map (partial)
core/doors/omega.key -> [b64x2]
logs/radius-2159-09.log -> rot? timestamps off
[SALT: r7-bloom]
`;

// firewall.sig will be XOR with key "period-7" from ROUTES_CLEAR
const FIREWALL_ENC = xorData(enc(ROUTES_CLEAR), 'period-7');

const NOTICE_TXT = `NOTICE
omni-seal active. unauthorized access increments RADIUS threat.
`;

const LOG_ROT_CAESAR = `2025-19-90 27:90:90 radius AUTH ghost@ops last_login=2159-09-03T07:14Z
ssh_known_hosts: mirror-α, echo/β, relay-Ω
hint: palindromes in minutes\n`;
// El timestamp imposible (mes 19, minuto 90) sugiere ROT/caesar

// omega.key estará en b64 doble capa, pero bloqueado hasta impersonate
const OMEGA_KEY_CLEAR = 'OMEGA-ACCESS-TOKEN-PART';
function makeOmegaB64x2() {
  const first = typeof btoa !== 'undefined' ? btoa(OMEGA_KEY_CLEAR) : Buffer.from(OMEGA_KEY_CLEAR, 'utf8').toString('base64');
  const second = typeof btoa !== 'undefined' ? btoa(first) : Buffer.from(first, 'utf8').toString('base64');
  return second;
}

// Estructura de nodos: { type: 'file'|'dir', name, children?, data?: Uint8Array, locked?: boolean }
function makeFS() {
  return {
    type: 'dir', name: '/', children: [
      { type: 'file', name: 'firewall.sig', data: FIREWALL_ENC, locked: false },
      { type: 'file', name: 'routes.map', data: enc('partial: <decrypt firewall.sig first>'), locked: false },
      { type: 'file', name: 'notice.txt', data: enc(NOTICE_TXT), locked: false },
      { type: 'dir', name: 'logs', children: [
        { type: 'file', name: 'radius-2159-09.log', data: enc(LOG_ROT_CAESAR), locked: false },
      ]},
      { type: 'dir', name: 'core', children: [
        { type: 'dir', name: 'doors', children: [
          { type: 'file', name: 'omega.key', data: enc(makeOmegaB64x2()), locked: true }
        ]}
      ]},
      { type: 'dir', name: 'tmp', children: [
        { type: 'file', name: 'snapshot.bin', data: xorData(enc('SNAP\0BIN\0SIG'), 'nyx'), locked: false }
      ]}
    ]
  };
}

function pathParts(path) {
  const p = (path || '/').replace(/\\+/g, '/').replace(/\/$/, '');
  return p === '' ? ['/'] : p.split('/').filter(Boolean);
}

function getNode(root, path) {
  if (!path || path === '/' ) return root;
  const parts = pathParts(path);
  let cur = root;
  for (const part of parts) {
    if (cur.type !== 'dir') return null;
    cur = (cur.children || []).find(ch => ch.name === part);
    if (!cur) return null;
  }
  return cur;
}

function list(root, path) {
  const node = getNode(root, path);
  if (!node) throw new Error('ENOENT');
  if (node.type === 'dir') {
    return (node.children || []).map(ch => ({ name: ch.name, type: ch.type, locked: !!ch.locked }));
  }
  return [{ name: node.name, type: node.type, locked: !!node.locked }];
}

function read(root, path) {
  const node = getNode(root, path);
  if (!node) throw new Error('ENOENT');
  if (node.type !== 'file') throw new Error('EISDIR');
  return node.data;
}

function write(root, path, bytes) {
  const parts = pathParts(path);
  const name = parts.pop();
  let dir = root;
  for (const part of parts) {
    let next = (dir.children || []).find(ch => ch.name === part);
    if (!next) {
      next = { type: 'dir', name: part, children: [] };
      dir.children.push(next);
    }
    dir = next;
  }
  const existing = (dir.children || []).find(ch => ch.name === name);
  if (existing && existing.type !== 'file') throw new Error('EISDIR');
  if (existing) existing.data = bytes; else dir.children.push({ type: 'file', name, data: bytes });
}

function remove(root, path) {
  const parts = pathParts(path);
  const name = parts.pop();
  let dir = root;
  for (const part of parts) {
    const next = (dir.children || []).find(ch => ch.name === part);
    if (!next) throw new Error('ENOENT');
    dir = next;
  }
  const idx = (dir.children || []).findIndex(ch => ch.name === name);
  if (idx === -1) throw new Error('ENOENT');
  dir.children.splice(idx, 1);
}

export const fsVirtual = {
  makeFS,
  list,
  read,
  write,
  remove,
  getNode,
  enc,
  dec,
};

// Provide default export for compatibility with default imports
export default fsVirtual;
