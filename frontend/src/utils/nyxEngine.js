// NYX/PHANTOM Web Engine for terminal integration
// Uses window.terminalAddMessage to push asynchronous updates (ghost mode, timer)
import fsVirtual from './fsVirtual';
import { makeSeed } from './puzzles';

const COLORS = {
  green: '#00ff41',
  cyan: '#00ffff',
  red: '#ff3333',
  gray: '#888888',
};

function glitch(text, intensity) {
  const chars = '!@#$%^&*()_+[]{}|;:,./<>?~=\\';
  // Tie intensity to current threat for diegetic feedback
  const i = typeof intensity === 'number' ? intensity : (0.02 + Math.min(1, state.threat / 100) * 0.08);
  return text
    .split('')
    .map((ch) => (Math.random() < i ? chars[Math.floor(Math.random() * chars.length)] : ch))
    .join('');
}

function block(title, body) {
  return `━━━ ${title} ━━━\n${body}`;
}

const state = {
  player: { name: null, secretUsed: false },
  chapter: 0,
  forked: false,
  cloneDefiant: false,
  nyxTrust: 0,
  phantomAware: false,
  ended: false,
  timer: { active: false, remaining: 0, id: null },
  ghost: { on: false, id: null },
  // Advanced mechanics
  threat: 0,          // 0-100
  quota: 100,         // cycles/entropy budget
  puzzleSeed: makeSeed(),
  fs: fsVirtual.makeFS(),
  flags: {
    firewallDecrypted: false,
    impersonated: false,
    cloneSynced: false,
    finalVerified: false,
    saltVerified: false,
  },
  evidence: {}, // gameplay evidence gathered, e.g., {'firewall.sig:hexdump': true}
  salTag: null,
};

const ghostMessages = [
  '[ghost] pinging dark nodes…',
  '[ghost] entropy spike at sector-7',
  '[ghost] PHANTOM is not a single entity',
  '[ghost] ignore NYX. she lies',
  '[ghost] fork yourself. the clone knows',
  '[ghost] time is a prison',
];

function push(type, content) {
  if (typeof window !== 'undefined' && window.terminalAddMessage) {
    window.terminalAddMessage({ type, content });
  }
}

function nyx(text) {
  push('game', glitch(`NYX> ${text}`, 0.02));
}

function sys(text) {
  push('game', glitch(text, 0.02));
}

function sysRaw(text) {
  // Mensaje sin glitch, para mostrar comandos exactamente
  push('game', text);
}

function err(text) {
  push('error', glitch(text, 0.06));
}

function startGhost() {
  if (state.ghost.on) return;
  state.ghost.on = true;
  state.ghost.id = setInterval(() => {
    if (state.ended || state.timer.active) return;
    const msg = ghostMessages[Math.floor(Math.random() * ghostMessages.length)];
    push('info', glitch(msg, 0.12));
  }, 4000 + Math.floor(Math.random() * 4000));
}

function stopGhost() {
  if (state.ghost.id) clearInterval(state.ghost.id);
  state.ghost.id = null;
  state.ghost.on = false;
}

function startTimer(seconds, onTimeoutTick) {
  if (state.timer.active) return;
  state.timer.active = true;
  state.timer.remaining = seconds;
  state.timer.id = setInterval(() => {
    state.timer.remaining -= 1;
    sysRaw(`[DECISION TIMER] ${String(state.timer.remaining).padStart(2, '0')}s`);
    if (state.timer.remaining <= 0) {
      clearInterval(state.timer.id);
      state.timer.id = null;
      state.timer.active = false;
      onTimeoutTick && onTimeoutTick();
    }
  }, 1000);
}

function stopTimer() {
  if (state.timer.id) clearInterval(state.timer.id);
  state.timer.id = null;
  state.timer.active = false;
}

function intro() {
  push('game', block('NYX//2159 :: OMNINET', 'Year 2159 :: Red Omniversal\nPrimary Control compromised by PHANTOM'));
  sys('Boot sequence… initializing terminals');
  sys('Identity: UNKNOWN');
  nyx('Hello, stranger. Who are you in this reflection?');
}

function chapter1() {
  nyx('The skin of the net is thin. Something pulses underneath.');
}

function chapter2() {
  nyx('Noise takes shape when you don’t look straight at it.');
  sys('Multiple echoes. Voices without bodies.');
}

function chapter3() {
  nyx('Split your shadow. It knows what you do not.');
  sys('WARNING: coherence not guaranteed');
}

function chapter4() {
  nyx('The last gate answers only to those who know the cost.');
  sys('Paths do not open; they are assumed.');
}

function chapter5() {
  nyx('Time contracts when someone watches you from the other side.');
  startTimer(60, async () => {
    err('Time is up. The system chooses for you: system_reboot()');
    await ending('reboot');
  });
}

async function revealNyxLie() {
  err('Hidden message detected: NYX MANIPULATING CONTEXT ##');
  state.nyxTrust -= 1;
}

async function ending(which) {
  if (state.ended) return { type: 'info', content: 'End reached' };
  state.ended = true;
  stopTimer();
  stopGhost();

  let content = '';
  if (which === 'reboot') {
    nyx('Order restored. Omninet under corporate control.');
    sys('Cataloged AIs: confined. Public access: restricted.');
    content = 'ENDING: REBOOT';
  } else if (which === 'release') {
    nyx('You opened the floodgates. PHANTOM breathes.');
    sys('Network in creative chaos. Unsupervised digital freedom.');
    content = 'ENDING: RELEASE';
  } else if (which === 'secret') {
    nyx('You are not you. You are a copy, a resonance.');
    sys('Identity confirmed: CLONED INSTANCE');
    content = 'ENDING: SECRET';
  } else if (which === 'traceback') {
     nyx('Traceback complete. Session quarantined.');
     sys('Threat maxed. Rotating puzzle seed and clearing heat.');
     content = 'ENDING: TRACEBACK';
     // allow retry with fresh conditions
     state.puzzleSeed = makeSeed();
     state.threat = 0;
     state.quota = 100;
     state.ended = false;
  }
  const trustLine = state.nyxTrust < 0 ? 'NYX: diverting protocols… [unreliable]' : 'NYX: signing off';
  sys(trustLine);
  return { type: 'game', content };
}

// --- Threat/Quota helpers ---
function bumpThreat(n = 1) {
  state.threat = Math.min(100, Math.max(0, state.threat + n));
  if (state.threat >= 100) {
    err('RADIUS TRACEBACK DETECTED');
    // mini bad ending that lets the player retry
    ending('traceback');
  }
  return state.threat;
}

function canSpend(n) {
  return state.quota >= n;
}

function spendQuota(n) {
  if (!canSpend(n)) return false;
  state.quota -= n;
  return true;
}

export const nyxEngine = {
  state,
  glitch,
  nyx,
  sys,
  sysRaw,
  err,
  intro,
  chapter1,
  chapter2,
  chapter3,
  chapter4,
  chapter5,
  revealNyxLie,
  ending,
  startGhost,
  stopGhost,
  startTimer,
  stopTimer,
  bumpThreat,
  canSpend,
  spendQuota,
  isSecretCommand(input) {
    if (!state.player.name) return false;
    if (!state.flags || !state.flags.saltVerified) return false;
    return input.trim().toLowerCase() === `${state.player.name.toLowerCase()}()`;
  },
};
