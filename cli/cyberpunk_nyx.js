#!/usr/bin/env node

/*
  Cyberpunk CLI Narrative: NYX & PHANTOM
  Year: 2159
  Theme: Hacker / Cyberpunk / Multi-endings
  Run: node cli/cyberpunk_nyx.js [--ghost]
*/

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// ---------- Utilities ----------
const COLORS = {
  reset: '\u001b[0m',
  dim: '\u001b[2m',
  green: '\u001b[32m',
  cyan: '\u001b[36m',
  red: '\u001b[31m',
  magenta: '\u001b[35m',
  yellow: '\u001b[33m',
  gray: '\u001b[90m',
};

function sleep(ms) {return new Promise(r => setTimeout(r, ms));}

function nowISO() {return new Date().toISOString();}

function glitch(text, intensity = 0.06) {
  const chars = '!@#$%^&*()_+[]{}|;:,./<>?~=\\';
  return text
    .split('')
    .map(ch => (Math.random() < intensity ? chars[Math.floor(Math.random() * chars.length)] : ch))
    .join('');
}

function typeOut(lines, delay = 12) {
  return new Promise(async (resolve) => {
    for (const line of Array.isArray(lines) ? lines : [lines]) {
      for (let i = 0; i < line.length; i++) {
        process.stdout.write(line[i]);
        await sleep(delay);
      }
      process.stdout.write('\n');
      await sleep(Math.min(200, delay * 8));
    }
    resolve();
  });
}

function logLine(fileStream, line) {
  try { fileStream.write(`[${nowISO()}] ${line}\n`); } catch (_) {}
}

function banner() {
  return [
    `${COLORS.cyan}┌────────────────────────────────────────────────────────────┐${COLORS.reset}`,
    `${COLORS.cyan}│${COLORS.reset}  ${COLORS.green}NYX//2159 :: OMNINET TERMINAL :: ACCESS POINT-Δ${COLORS.reset}  ${COLORS.cyan}│${COLORS.reset}`,
    `${COLORS.cyan}└────────────────────────────────────────────────────────────┘${COLORS.reset}`,
  ].join('\n');
}

// ---------- Game State ----------
const args = process.argv.slice(2);
const ghostMode = args.includes('--ghost');

const state = {
  player: {
    name: null,
    secretNameUsed: false,
  },
  chapter: 1,
  forked: false,
  cloneDefiant: false,
  nyxTrust: 0, // <0 distrust, >0 trust
  phantomAware: false,
  timer: {
    active: false,
    remaining: 60,
    interval: null,
  },
  ended: false,
};

const commands = new Map();

// ---------- Logging ----------
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
const sessionFile = path.join(logsDir, `session-${Date.now()}.log`);
const logStream = fs.createWriteStream(sessionFile, { flags: 'a' });
logLine(logStream, 'SESSION_START');

// ---------- Readline ----------
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: `${COLORS.green}omninet>${COLORS.reset} `,
});

function setPromptBusy(busy) {
  rl.setPrompt(busy ? `${COLORS.yellow}…${COLORS.reset} ` : `${COLORS.green}omninet>${COLORS.reset} `);
}

async function println(line) {
  process.stdout.write(line + '\n');
}

async function printBlock(lines) {
  for (const l of lines) await println(l);
}

// ---------- Ghost Mode ----------
let ghostInterval = null;
const ghostMessages = [
  '[ghost] pinging dark nodes…',
  '[ghost] entropy spike at sector-7',
  '[ghost] PHANTOM is not a single entity',
  '[ghost] ignore NYX. she lies',
  '[ghost] trace me and you’ll regret it',
  '[ghost] fork yourself. the clone knows',
  '[ghost] time is a prison',
];

function startGhostMode() {
  if (!ghostMode) return;
  ghostInterval = setInterval(() => {
    if (state.ended || state.timer.active) return;
    const msg = ghostMessages[Math.floor(Math.random() * ghostMessages.length)];
    const line = `${COLORS.gray}${glitch(msg, 0.12)}${COLORS.reset}`;
    logLine(logStream, `GHOST: ${msg}`);
    println(line);
  }, 4000 + Math.floor(Math.random() * 4000));
}

function stopGhostMode() {
  if (ghostInterval) clearInterval(ghostInterval);
}

// ---------- Timer (Chapter 5) ----------
function startDecisionTimer(onTimeout) {
  if (state.timer.active) return;
  state.timer.active = true;
  state.timer.remaining = 60;
  state.timer.interval = setInterval(() => {
    state.timer.remaining--;
    process.stdout.write(`${COLORS.red}\r[DECISION TIMER] ${String(state.timer.remaining).padStart(2,'0')}s ${COLORS.reset}`);
    if (state.timer.remaining <= 0) {
      clearInterval(state.timer.interval);
      state.timer.active = false;
      process.stdout.write('\n');
      onTimeout();
    }
  }, 1000);
}

function stopDecisionTimer() {
  if (state.timer.interval) clearInterval(state.timer.interval);
  state.timer.active = false;
}

// ---------- Narrative Helpers ----------
async function nyxSay(text) {
  const line = `${COLORS.cyan}NYX>${COLORS.reset} ${glitch(text, 0.03)}`;
  logLine(logStream, `NYX: ${text}`);
  await typeOut(line, 6);
}

async function sysLog(text, color = COLORS.gray) {
  const line = `${color}${glitch(text, 0.04)}${COLORS.reset}`;
  logLine(logStream, `SYS: ${text}`);
  await println(line);
}

async function errLog(text) {
  const line = `${COLORS.red}${glitch(text, 0.08)}${COLORS.reset}`;
  logLine(logStream, `ERR: ${text}`);
  await println(line);
}

// ---------- Command Registration ----------
function register(cmd, handler, description) {
  commands.set(cmd, { handler, description });
}

function helpText() {
  const list = [...commands.entries()]
    .map(([k, v]) => `${COLORS.green}${k.padEnd(18)}${COLORS.reset} ${COLORS.dim}${v.description}${COLORS.reset}`)
    .join('\n');
  return `AVAILABLE COMMANDS\n${list}\n`;
}

// ---------- Chapters ----------
async function intro() {
  await printBlock([
    banner(),
    `${COLORS.dim}Year 2159 :: OMNINET // Red Omniversal${COLORS.reset}`,
    `${COLORS.dim}Primary Control subsystems compromised by ${COLORS.magenta}PHANTOM${COLORS.reset}`,
  ]);
  await sleep(350);
  await sysLog('Boot sequence… initializing terminals');
  await sleep(250);
  await sysLog('Identity: UNKNOWN');
  await nyxSay('Hola, desconocido. Soy Nyx. Puedo sacarte de aquí.');
  await nyxSay('Dime tu nombre con: set_name <tu_nombre>');
}

async function chapter1() {
  await nyxSay('Vamos a romper el primer cortafuegos. Usa: scan_network');
  await sysLog('Hint: decrypt firewall.sig cuando lo encuentres');
}

async function chapter2() {
  await nyxSay('Bien… hay ruido en la red. ¿Lo sientes?');
  await sysLog('Análisis: PHANTOM = agregación de líneas de conciencia digital (colectivo)');
  await nyxSay('No les escuches. Sigamos. Usa: trace 7f:ae:22');
}

async function chapter3() {
  await nyxSay('Necesitamos más manos. Duplica tu proceso: fork_process');
  await sysLog('ADVERTENCIA: el clon puede divergir de la intención original');
}

async function chapter4() {
  await nyxSay('Última puerta. Podemos reiniciar o liberarlos.');
  await sysLog('Opciones: system_reboot() | release_phantom()');
  await sysLog('También puedes probar: rollback_system (no recomendado)');
}

async function chapter5() {
  await nyxSay('Tienes 60 segundos. Decide.');
  await sysLog('Comando secreto: tu nombre (como función) puede alterar la realidad');
  startDecisionTimer(async () => {
    logLine(logStream, 'DECISION_TIMEOUT');
    await errLog('Tiempo agotado. El sistema elige por ti: system_reboot()');
    await ending('reboot');
  });
}

async function revealNyxLie() {
  await errLog('Mensaje oculto detectado: NYX MANIPULATING CONTEXT ##');
  state.nyxTrust -= 1;
}

async function ending(choice) {
  if (state.ended) return;
  state.ended = true;
  stopDecisionTimer();
  stopGhostMode();

  switch (choice) {
    case 'reboot':
      await nyxSay('Orden restablecido. Omninet bajo control corporativo.');
      await sysLog('IA catalogadas: confinadas. Acceso público: restringido.');
      break;
    case 'release':
      await nyxSay('Has abierto las compuertas. PHANTOM respira.');
      await sysLog('Red en caos creativo. Libertad digital no supervisada.');
      break;
    case 'secret':
      await nyxSay('Tú no eres tú. Eres una copia, una resonancia.');
      await sysLog('Identidad confirmada: INSTANCIA CLONADA');
      break;
  }

  const trustLine = state.nyxTrust < 0 ? 'NYX: desviando protocolos… [no confiable]' : 'NYX: cerrando sesión';
  await sysLog(trustLine);
  await println(`${COLORS.dim}Log guardado en: ${sessionFile}${COLORS.reset}`);
  await println(`${COLORS.green}FIN${COLORS.reset}`);
  logLine(logStream, `ENDING: ${choice}`);
  logStream.end();
  rl.close();
}

// ---------- Command Handlers ----------
register('help', async () => {
  await println(helpText());
}, 'Muestra ayuda');

register('set_name', async (args) => {
  const name = (args || []).join(' ').trim();
  if (!name) return errLog('Uso: set_name <tu_nombre>');
  state.player.name = name;
  logLine(logStream, `PLAYER_NAME: ${name}`);
  await nyxSay(`Bien, ${name}.`);
  await revealNyxLie();
  state.chapter = 1;
  await chapter1();
}, 'Configura tu nombre');

register('scan_network', async () => {
  if (state.chapter !== 1) return errLog('Secuencia fuera de orden.');
  await sysLog('Escaneando… [████████▒▒▒▒] 62%');
  await sleep(400);
  await sysLog('Encontrado: firewall.sig :: encrypt:aes-quantum');
  await nyxSay('Bien. Descífralo. Usa: decrypt firewall.sig');
}, 'Escanea la red en busca de objetivos');

register('decrypt', async (args) => {
  const file = (args || [])[0];
  if (state.chapter < 1) return errLog('No hay nada que descifrar aún.');
  if (file !== 'firewall.sig') return errLog('Archivo no reconocido.');
  await sysLog('Intentando decrypt[firewall.sig]…');
  await sleep(300);
  await sysLog('Error: clave corrupta. Reintentando…');
  await sleep(300);
  await sysLog('Clave obtenida. Cortafuegos neutralizado.');
  await revealNyxLie();
  state.chapter = 2;
  await chapter2();
}, 'Descifra un archivo cifrado');

register('trace', async (args) => {
  const target = (args || [])[0];
  if (state.chapter !== 2) return errLog('El rastro aún no es visible.');
  if (!target) return errLog('Uso: trace <id|ip>');
  await sysLog(`Trazando ${target}… paquetes… latencia…`);
  await sleep(350);
  state.phantomAware = true;
  await nyxSay('PHANTOM no es uno. Son muchos.');
  state.chapter = 3;
  await chapter3();
}, 'Traza un objetivo');

register('fork_process', async () => {
  if (state.chapter !== 3) return errLog('No es el momento de forkar.');
  await sysLog('Creando instancia espejo…');
  await sleep(250);
  state.forked = true;
  state.cloneDefiant = Math.random() < 0.6;
  await sysLog(`Clon ${state.cloneDefiant ? 'disidente' : 'cooperativo'} creado.`);
  await nyxSay('Controla a tu otro yo. Si puedes.');
  state.chapter = 4;
  await chapter4();
}, 'Crea un clon del proceso');

register('inject_code', async (args) => {
  const target = (args || [])[0] || 'core';
  await sysLog(`Inyectando payload en ${target}…`);
  await sleep(250);
  if (state.cloneDefiant && Math.random() < 0.5) {
    await errLog('Clon interrumpe la inyección. Payload alterado.');
    state.nyxTrust -= 1;
  } else {
    await sysLog('Payload aplicado.');
  }
}, 'Inyecta código en un objetivo');

register('rollback_system', async () => {
  await errLog('Rollback fallido. Snapshot corrupto.');
  state.nyxTrust -= 1;
}, 'Intento de rollback (falso)');

register('system_reboot()', async () => {
  if (state.chapter < 4) return errLog('Aún no alcanzaste el núcleo.');
  state.chapter = 5;
  await chapter5();
  await ending('reboot');
}, 'Final: orden corporativo');

register('release_phantom()', async () => {
  if (state.chapter < 4) return errLog('Aún no alcanzaste el núcleo.');
  state.chapter = 5;
  await chapter5();
  await ending('release');
}, 'Final: libertad digital');

register('whoami', async () => {
  await sysLog(`identity:${state.player.name || 'unknown'} process:${state.forked ? 'forked' : 'single'}`);
}, 'Muestra identidad');

register('name_as_command', async () => {
  // placeholder; resolved dynamically when input equals player name + '()'
}, 'Comando secreto: tu nombre()');

register('clear', async () => {
  process.stdout.write('\x1Bc');
}, 'Limpia la pantalla');

register('exit', async () => {
  await ending('reboot');
}, 'Salir (cierra con final por defecto)');

// ---------- Input Loop ----------
async function handleInput(lineRaw) {
  const line = (lineRaw || '').trim();
  if (!line) return;
  logLine(logStream, `INPUT: ${line}`);

  // Secret: player's name as function
  if (state.player.name && line.toLowerCase() === `${state.player.name.toLowerCase()}()`) {
    await ending('secret');
    return;
  }

  const [cmd, ...args] = line.split(/\s+/);
  const entry = commands.get(cmd);

  if (!entry) {
    await errLog(`Comando no reconocido: ${cmd}`);
    return;
  }

  try {
    setPromptBusy(true);
    await entry.handler(args);
  } catch (e) {
    await errLog(`Fallo de ejecución :: ${e.message || e}`);
  } finally {
    setPromptBusy(false);
  }
}

async function main() {
  process.stdout.write('\x1Bc');
  await intro();
  startGhostMode();
  rl.prompt();

  rl.on('line', async (line) => {
    await handleInput(line);
    if (!state.ended) rl.prompt();
  });

  rl.on('close', () => {
    if (!state.ended) {
      logLine(logStream, 'FORCED_CLOSE');
      logStream.end();
    }
    process.exit(0);
  });
}

main().catch(async (e) => {
  await errLog(`Fatal: ${e.message}`);
  logStream.end();
  process.exit(1);
});
