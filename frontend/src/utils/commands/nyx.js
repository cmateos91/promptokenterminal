import { nyxEngine } from '../nyxEngine';
import { fsVirtual } from '../fsVirtual';
import { b64, xorData, bytesToHex, bytesToString, caesar, vigenere, analyzeContent, derive as deriveUtil, crc16 } from '../puzzles';

// Comandos NYX/PHANTOM para el terminal web
// Devuelven objetos { type, content } compatibles con el Terminal.jsx

function okGame(content) {
  return { type: 'game', content };
}
function okInfo(content) {
  return { type: 'info', content };
}
function err(content) {
  return { type: 'error', content };
}

export const nyxCommands = {
  nyx: async (args) => {
    const sub = (args[0] || '').toLowerCase();
    if (!sub || sub === 'start') {
      nyxEngine.state.chapter = 0;
      nyxEngine.state.ended = false;
      nyxEngine.state.inNyx = true;
      nyxEngine.intro();
      return okInfo('NYX story initialized. Use set_name <your_name>');
    }
    if (sub === 'help') {
      return okGame(`NYX//HELP  ::  diegetic interface\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n  nyx [start|stop|ghost_on|ghost_off|help]\n  nyx chat <text>\n  set_name <name>\n  strings <path>\n  inject_code <t>\n  ls [path]\n  release_phantom()\n  analyze <file>\n  pipe <a> | <b>\n  fork_process\n  vigenere <key> <file>\n  decrypt <file>\n  whoami\n  grep <re> <path>\n  sync_clone <ch>\n  system_reboot()\n  trace <id|ip>\n  pack <file>\n  hexdump <path>\n  derive <hint>\n  b64 <enc|dec> <file>\n  xor <enc|dec> <file> <key>\n  cat <path>\n  impersonate <h>\n  caesar <n> <file>\n  unpack <file>\n  status\n  reset_puzzle\n  scan_network\n  rollback_system\n\n[exit] nyx stop\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    }
    if (sub === 'chat') {
      const message = args.slice(1).join(' ');
      if (!message) {return err('Usage: nyx chat <text>');}
      await nyxEngine.chat(message);
      return okInfo('');
    }
    if (sub === 'hint' || sub === 'recap') {
      // Reemit minimal diegetic line for current chapter (no explicit instructions)
      const ch = nyxEngine.state.chapter;
      if (ch <= 0) { nyxEngine.intro(); return okInfo('intro'); }
      if (ch === 1) { nyxEngine.chapter1(); return okInfo('chapter1'); }
      if (ch === 2) { nyxEngine.chapter2(); return okInfo('chapter2'); }
      if (ch === 3) { nyxEngine.chapter3(); return okInfo('chapter3'); }
      if (ch === 4) { nyxEngine.chapter4(); return okInfo('chapter4'); }
      if (ch >= 5) { nyxEngine.chapter5(); return okInfo('chapter5'); }
    }
    if (sub === 'stop') {
      nyxEngine.state.inNyx = false;
      return okInfo('NYX mode stopped');
    }
    if (sub === 'ghost_on') {
      nyxEngine.startGhost();
      return okInfo('Ghost mode enabled');
    }
    if (sub === 'ghost_off') {
      nyxEngine.stopGhost();
      return okInfo('Ghost mode disabled');
    }
    return err('Usage: nyx [start|stop|help|ghost_on|ghost_off|chat]');
  },

  // Infer ROT shift from invalid time digits in a log line hh:mm:ss
  rot_suggest: async (args) => {
    const path = (args && args[0]);
    if (!path) {return err('rot_suggest: <file>');}
    try {
      const data = fsVirtual.read(nyxEngine.state.fs, path);
      const txt = bytesToString(data);
      const m = txt.match(/\b(\d{2}):(\d{2}):(\d{2})\b/);
      if (!m) {return err('rot_suggest: no time found');}
      const hh = parseInt(m[1], 10), mm = parseInt(m[2], 10), ss = parseInt(m[3], 10);
      let sum = 0;
      function addDigits(n){ String(n).split('').forEach(d=>{ sum += parseInt(d,10); }); }
      if (hh >= 24) {addDigits(hh);}
      if (mm >= 60) {addDigits(mm);}
      if (ss >= 60) {addDigits(ss);}
      const shift = ((sum % 26) + 26) % 26;
      return okInfo(`rot shift = ${shift}`);
    } catch {
      return err('rot_suggest: cannot read');
    }
  },

  rot_apply: async (args) => {
    const path = (args && args[0]);
    if (!path) {return err('rot_apply: <file>');}
    try {
      // reuse suggestion
      const data = fsVirtual.read(nyxEngine.state.fs, path);
      const txt = bytesToString(data);
      const m = txt.match(/\b(\d{2}):(\d{2}):(\d{2})\b/);
      if (!m) {return err('rot_apply: no time found');}
      const hh = parseInt(m[1], 10), mm = parseInt(m[2], 10), ss = parseInt(m[3], 10);
      let sum = 0; function addDigits(n){ String(n).split('').forEach(d=>{ sum += parseInt(d,10); }); }
      if (hh >= 24) {addDigits(hh);} if (mm >= 60) {addDigits(mm);} if (ss >= 60) {addDigits(ss);}
      const shift = ((sum % 26) + 26) % 26;
      const out = caesar(txt, -shift);
      const outName = `tmp/${path.split('/').pop()}.dec`;
      fsVirtual.write(nyxEngine.state.fs, outName, new TextEncoder().encode(out));
      return okGame(outName);
    } catch {
      return err('rot_apply: cannot read');
    }
  },

  // --- Virtual FS & analysis commands ---
  ls: async (args) => {
    const path = (args && args[0]) || '/';
    try {
      const items = fsVirtual.list(nyxEngine.state.fs, path);
      const lines = items.map(it => `${it.type === 'dir' ? 'd' : '-'} ${it.locked ? 'x' : '-'} ${it.name}`).join('\n');
      return okGame(lines || '(empty)');
    } catch (e) {
      nyxEngine.bumpThreat(1);
      return err('fs: no such path');
    }
  },

  cat: async (args) => {
    const path = (args && args[0]);
    if (!path) {return err('cat: path required');}
    try {
      const data = fsVirtual.read(nyxEngine.state.fs, path);
      return okGame(bytesToString(data));
    } catch (e) {
      nyxEngine.bumpThreat(1);
      return err('cat: cannot read');
    }
  },

  hexdump: async (args) => {
    const path = (args && args[0]);
    if (!path) {return err('hexdump: path required');}
    try {
      const data = fsVirtual.read(nyxEngine.state.fs, path);
      // record evidence for contextual derives
      if (path === 'firewall.sig') {
        nyxEngine.state.evidence['firewall.sig:hexdump'] = true;
      }
      return okGame(bytesToHex(data));
    } catch (e) {
      nyxEngine.bumpThreat(1);
      return err('hexdump: cannot read');
    }
  },

  strings: async (args) => {
    const path = (args && args[0]);
    if (!path) {return err('strings: path required');}
    try {
      const data = fsVirtual.read(nyxEngine.state.fs, path);
      const s = bytesToString(data);
      const matches = s.match(/[\x20-\x7E]{4,}/g) || [];
      return okGame(matches.join('\n'));
    } catch (e) {
      return err('strings: cannot read');
    }
  },

  grep: async (args) => {
    const pattern = args && args[0];
    const path = args && args[1];
    if (!pattern || !path) {return err('grep: <regex> <path>');}
    try {
      const re = new RegExp(pattern);
      const data = fsVirtual.read(nyxEngine.state.fs, path);
      const s = bytesToString(data);
      const lines = s.split(/\r?\n/).filter(l => re.test(l));
      return okGame(lines.join('\n'));
    } catch (e) {
      return err('grep: error');
    }
  },

  pipe: async (args) => {
    const joined = (args || []).join(' ');
    const [left, right] = joined.split('|').map(s => s.trim());
    if (!left || !right) {return err('pipe: cmd1 | cmd2');}
    // Limited pipe support: only for ls/cat/hexdump/strings -> grep
    const runSimple = async (cmdline) => {
      const [cmd, ...a] = cmdline.split(/\s+/);
      if (cmd === 'cat') {return (await nyxCommands.cat(a)).content;}
      if (cmd === 'ls') {return (await nyxCommands.ls(a)).content;}
      if (cmd === 'hexdump') {return (await nyxCommands.hexdump(a)).content;}
      if (cmd === 'strings') {return (await nyxCommands.strings(a)).content;}
      return '';
    };
    const leftOut = await runSimple(left);
    const [rCmd, rArg] = right.split(/\s+/);
    if (rCmd !== 'grep') {return err('pipe: only supports | grep <regex>');}
    try {
      const re = new RegExp(rArg || '');
      const lines = (leftOut || '').split(/\r?\n/).filter(l => re.test(l));
      return okGame(lines.join('\n'));
    } catch {
      return err('pipe: regex error');
    }
  },

  // --- Crypto & derive ---
  analyze: async (args) => {
    const path = (args && args[0]);
    if (!path) {return err('analyze: <file>');}
    try {
      const data = fsVirtual.read(nyxEngine.state.fs, path);
      const res = analyzeContent(data);
      const sum = crc16(data);
      return okInfo(`type? ${res.hints.join(' ')} | crc:${sum} | prev:"${res.textPreview}"`);
    } catch (e) {
      return err('analyze: cannot read');
    }
  },

  b64: async (args) => {
    const mode = args && args[0];
    const path = args && args[1];
    if (!mode || !path) {return err('b64 <enc|dec> <file>');}
    try {
      const data = fsVirtual.read(nyxEngine.state.fs, path);
      let out;
      if (mode === 'enc') {out = b64.enc(bytesToString(data));}
      else if (mode === 'dec') {out = b64.dec(bytesToString(data));}
      else {return err('b64: mode');}
      const outName = `tmp/${path.split('/').pop()}.${mode}`;
      fsVirtual.write(nyxEngine.state.fs, outName, new TextEncoder().encode(out));
      // Detect OMEGA double decode sequence
      if (mode === 'dec') {
        const txt = out;
        const looksB64 = /^[A-Za-z0-9+/=\r\n]+$/.test(txt) && txt.replace(/\s+/g, '').length % 4 === 0;
        if (!looksB64 && /OMEGA-ACCESS-TOKEN/.test(txt)) {
          nyxEngine.state.flags.finalVerified = true;
        }
      }
      return okGame(outName);
    } catch (e) {
      return err('b64: error');
    }
  },

  xor: async (args) => {
    const mode = args && args[0];
    const path = args && args[1];
    const key = args && args[2];
    if (!mode || !path || !key) {return err('xor <enc|dec> <file> <key>');}
    try {
      const data = fsVirtual.read(nyxEngine.state.fs, path);
      const outBytes = xorData(data, key);
      const outName = `tmp/${path.split('/').pop()}.${mode}`;
      fsVirtual.write(nyxEngine.state.fs, outName, outBytes);
      const txt = bytesToString(outBytes);
      if (mode === 'dec' && /SALT:\s*/.test(txt)) {
        // actualizar routes.map con el claro si detectamos token SALT
        fsVirtual.write(nyxEngine.state.fs, 'routes.map', new TextEncoder().encode(txt));
        nyxEngine.state.flags.firewallDecrypted = true;
        nyxEngine.state.salTag = (txt.match(/SALT:\s*([^\]\n]+)/) || [,''])[1] || null;
        nyxEngine.state.flags.saltVerified = true;
      }
      return okGame(outName);
    } catch (e) {
      nyxEngine.bumpThreat(2);
      return err('xor: error');
    }
  },

  caesar: async (args) => {
    const shift = parseInt(args && args[0]);
    const path = args && args[1];
    if (Number.isNaN(shift) || !path) {return err('caesar <shift> <file>');}
    const data = fsVirtual.read(nyxEngine.state.fs, path);
    const out = caesar(bytesToString(data), shift);
    fsVirtual.write(nyxEngine.state.fs, `tmp/${path.split('/').pop()}.caesar`, new TextEncoder().encode(out));
    return okGame(`tmp/${path.split('/').pop()}.caesar`);
  },

  vigenere: async (args) => {
    const key = args && args[0];
    const path = args && args[1];
    if (!key || !path) {return err('vigenere <key> <file>');}
    const data = fsVirtual.read(nyxEngine.state.fs, path);
    const out = vigenere(bytesToString(data), key, true);
    fsVirtual.write(nyxEngine.state.fs, `tmp/${path.split('/').pop()}.vig`, new TextEncoder().encode(out));
    return okGame(`tmp/${path.split('/').pop()}.vig`);
  },

  derive: async (args) => {
    const hint = (args || []).join(' ');
    // Gate derives based on gathered evidence
    if (/period/i.test(hint) && !nyxEngine.state.evidence['firewall.sig:hexdump']) {
      return err('derive: insufficient context');
    }
    const val = deriveUtil(hint, { name: nyxEngine.state.player.name, lastBytes: fsVirtual.read(nyxEngine.state.fs, 'firewall.sig'), saltTokens: nyxEngine.state.salTag ? [nyxEngine.state.salTag] : [] });
    if (/salt/i.test(hint) && val) {
      nyxEngine.state.flags.saltVerified = true;
    }
    return okInfo(val || '');
  },

  impersonate: async (args) => {
    const handle = (args && args[0]) || '';
    if (/ghost@ops/.test(handle)) {
      nyxEngine.state.flags.impersonated = true;
      // desbloquear omega.key
      const node = fsVirtual.getNode(nyxEngine.state.fs, 'core/doors/omega.key');
      if (node) {node.locked = false;}
      return okInfo('session adopted');
    }
    nyxEngine.bumpThreat(10);
    return err('impersonate: denied');
  },

  sync_clone: async (args) => {
    const channel = (args && args[0]) || 'alpha';
    if (!nyxEngine.state.forked) { nyxEngine.bumpThreat(1); return err('no clone'); }
    let token = 'K3-omega-arc';
    if (nyxEngine.state.threat > 60) {
      token = token.split('').reverse().join('');
      // flip bit: mutate one char
      token = token.slice(0, 2) + (token[2] === '3' ? '2' : '3') + token.slice(3);
    }
    nyxEngine.state.flags.cloneSynced = true;
    return okGame(`[${channel}] ${token}`);
  },

  pack: async (args) => {
    const path = args && args[0];
    if (!path) {return err('pack <file>');}
    const data = fsVirtual.read(nyxEngine.state.fs, path);
    const skew = 7; // toy skew
    const header = new TextEncoder().encode(`PACK\nSK=${skew}\n`);
    const out = new Uint8Array(header.length + data.length);
    out.set(header, 0); out.set(data, header.length);
    fsVirtual.write(nyxEngine.state.fs, `tmp/${path.split('/').pop()}.pack`, out);
    return okGame(`tmp/${path.split('/').pop()}.pack`);
  },

  unpack: async (args) => {
    const path = args && args[0];
    if (!path) {return err('unpack <file>');}
    const data = fsVirtual.read(nyxEngine.state.fs, path);
    const txt = bytesToString(data);
    const m = txt.match(/SK=(\d+)/);
    if (m) {
      const skew = parseInt(m[1]);
      // efecto en timer
      if (nyxEngine.state.timer.active) {
        nyxEngine.state.timer.remaining = Math.max(0, nyxEngine.state.timer.remaining + (skew % 10));
        nyxEngine.sysRaw(`[TIMER ADJUST] +${skew % 10}s`);
      }
      return okInfo('unpacked');
    }
    nyxEngine.bumpThreat(2);
    return err('unpack: corrupted');
  },

  status: async () => {
    const s = nyxEngine.state;
    const flags = Object.entries(s.flags).filter(([k,v]) => v).map(([k]) => k).join(',') || '-';
    return okInfo(`chapter:${s.chapter} threat:${s.threat} quota:${s.quota} flags:${flags}`);
  },

  reset_puzzle: async () => {
    if (!nyxEngine.spendQuota(10)) {return err('quota: insufficient');}
    nyxEngine.state.puzzleSeed = Math.floor(Math.random()*1e9);
    nyxEngine.state.flags.finalVerified = false;
    nyxEngine.bumpThreat(3);
    return okInfo('puzzle seed rotated');
  },
  'set_name': async (args) => {
    const name = (args || []).join(' ').trim();
    if (!name) {return err('Usage: set_name <your_name>');}
    nyxEngine.state.player.name = name;
    nyxEngine.revealNyxLie();
    nyxEngine.state.chapter = 1;
    nyxEngine.chapter1();
    return okInfo(`Name set: ${name}`);
  },

  'scan_network': async () => {
    if (nyxEngine.state.chapter !== 1) {return err('Out-of-sequence.');}
    nyxEngine.state.chapter = 1; // stays
    nyxEngine.sys('Irregular traffic…');
    nyxEngine.sys('Signature trail at root.');
    nyxEngine.bumpThreat(5);
    return okGame('scan complete');
  },

  decrypt: async (args) => {
    const file = (args || [])[0];
    if (!file) {return err('Usage: decrypt <file>');}
    if (file !== 'firewall.sig') {return err('Unknown file.');}
    if (nyxEngine.state.chapter < 1) {return err('Nothing to decrypt yet.');}
    if (!nyxEngine.state.flags.firewallDecrypted) {
      nyxEngine.bumpThreat(2);
      return err('Key material incomplete.');
    }
    nyxEngine.sys('Firewall neutralized.');
    nyxEngine.revealNyxLie();
    if (nyxEngine.state.chapter < 2) {
      nyxEngine.state.chapter = 2;
      nyxEngine.chapter2();
    }
    return okGame('decrypt ok');
  },

  trace: async (args) => {
    const target = (args || [])[0];
    if (nyxEngine.state.chapter < 2 || !nyxEngine.state.flags.firewallDecrypted) {return err('Trace is not visible yet.');}
    if (!target) {return err('Usage: trace <id|ip>');}
    nyxEngine.sys(`Tracing ${target}… packets… latency…`);
    nyxEngine.state.phantomAware = true;
    nyxEngine.nyx('PHANTOM is not one. They are many.');
    if (nyxEngine.state.chapter < 3) {
      nyxEngine.state.chapter = 3;
      nyxEngine.chapter3();
    }
    return okGame('trace ok');
  },

  'fork_process': async () => {
    if (nyxEngine.state.chapter < 3) {return err('Not the time to fork.');}
    nyxEngine.sys('Creating mirror instance…');
    nyxEngine.state.forked = true;
    nyxEngine.state.cloneDefiant = Math.random() < 0.6;
    nyxEngine.sys(`Clone ${nyxEngine.state.cloneDefiant ? 'defiant' : 'cooperative'} created.`);
    nyxEngine.nyx('Control your other self. If you can.');
    if (nyxEngine.state.chapter < 4) {
      nyxEngine.state.chapter = 4;
      nyxEngine.chapter4();
    }
    return okGame('forked');
  },

  'inject_code': async (args) => {
    const target = (args || [])[0] || 'core';
    nyxEngine.sys(`Injecting payload into ${target}…`);
    if (nyxEngine.state.cloneDefiant && Math.random() < 0.5) {
      nyxEngine.err('Clone interrupts injection. Payload altered.');
      nyxEngine.state.nyxTrust -= 1;
    } else {
      nyxEngine.sys('Payload applied.');
    }
    return okGame('inject done');
  },

  'rollback_system': async () => {
    nyxEngine.err('AUTH MAP MISMATCH :: snapshot corrupted');
    nyxEngine.bumpThreat(8);
    nyxEngine.state.nyxTrust -= 1;
    return okGame('rollback failed');
  },

  'system_reboot()': async () => {
    if (nyxEngine.state.chapter < 4) {return err('You have not reached the core yet.');}
    if (!nyxEngine.state.flags.cloneSynced || !nyxEngine.state.flags.impersonated || !nyxEngine.state.flags.finalVerified) {
      nyxEngine.bumpThreat(3);
      return err('Requirements not met.');
    }
    nyxEngine.state.chapter = 5;
    nyxEngine.chapter5();
    return nyxEngine.ending('reboot');
  },

  'release_phantom()': async () => {
    if (nyxEngine.state.chapter < 4) {return err('You have not reached the core yet.');}
    if (!nyxEngine.state.flags.cloneSynced || !nyxEngine.state.flags.impersonated || !nyxEngine.state.flags.finalVerified) {
      nyxEngine.bumpThreat(3);
      return err('Requirements not met.');
    }
    nyxEngine.state.chapter = 5;
    nyxEngine.chapter5();
    return nyxEngine.ending('release');
  },

  // Identity & process status
  whoami: async () => {
    const s = nyxEngine.state;
    return okInfo(`name:${s.player.name || '-'} forked:${s.forked} clone:${s.cloneDefiant?'defiant':'cooperative'} inNyx:${!!s.inNyx}`);
  },

  ghost_on: async () => {
    nyxEngine.startGhost();
    return okInfo('Ghost mode enabled');
  },

  ghost_off: async () => {
    nyxEngine.stopGhost();
    return okInfo('Ghost mode disabled');
  },
};
