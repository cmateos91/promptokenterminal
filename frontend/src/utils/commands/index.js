import { walletCommands } from "./wallet";
import { stakingCommands } from "./staking";
import { infoCommands } from "./info";
import { funCommands } from "./fun";
import { systemCommands } from "./system";
import { easterEggCommands } from "./easterEggs";
import { diagnosticCommands, userDiagnosticCommands } from "./diagnostics";
import { adminCommands } from "./admin";
import { gameCommands } from "./games";
import { nyxCommands } from "./nyx";
import { nyxEngine } from "../nyxEngine";
import { userProgress, checkLevelUp, getUserStatus } from "../userState";
import { hasRequiredBalance } from "../tokenGate";
import { MIN_TOKEN_BALANCE, TOKEN_MINT } from "../config";
import { getTokenMetadata, formatTokenDisplay } from "../tokenMetadata";

// Validation for development commands - only allow on localhost:3000
const isDevelopmentEnvironment = () => {
  return (
    window.location.hostname === "localhost" && window.location.port === "3000"
  );
};

const requireDevelopmentEnvironment = (commandName) => {
  if (!isDevelopmentEnvironment()) {
    return {
      type: "error",
      content: `🚫 DEVELOPMENT COMMAND RESTRICTED\n\nThe "${commandName}" command is only available in development environment.\n\nRequired: http://localhost\nCurrent: ${window.location.href}\n\n🔒 This command is restricted for security reasons.`,
    };
  }
  return null;
};

// Conditionally add diagnostics based on environment
const isDevelopment = window.location.hostname === "localhost" && window.location.port === "3000";
const diagnostics = isDevelopment ? diagnosticCommands : userDiagnosticCommands;

const commands = {
  ...walletCommands,
  ...stakingCommands,
  ...infoCommands,
  ...funCommands,
  ...systemCommands,
  ...easterEggCommands,
  ...diagnostics,
  ...adminCommands,
  ...gameCommands,
  ...nyxCommands,
};

const aliases = {
  h: "help",
  c: "clear",
  r: "reset",
  p: "profile",
  st: "status",
  bal: "balance",
  conn: "connect",
  disc: "disconnect",
  winfo: "walletinfo",
  tinfo: "tokeninfo",
  ti: "tokeninfo",
  pr: "price",
  sol: "price",
  sl: "slot",
  coin: "flip",
  roll: "dice",
  game: "play",
  games: "play",
  // Diagnostic aliases
  diag: "debug",
  healthcheck: "health",
  perf: "performance",
  // Staking aliases
  gvault: "globalvault",
  vault: "globalvault",
  stats: "stakingstats",
  tvl: "stakingstats",
  // Development aliases
  lvl: "levelup",
  maxlevel: "levelup",
  unlock: "levelup",
  // Hidden commands
  "???": "easter",
  "👻": "ghost",
  debug: "dev",
};

commands.help = () => {
  // Context-aware help: if inside NYX mode, show story-styled help only
  try {
    if (nyxEngine && nyxEngine.state && nyxEngine.state.inNyx) {
      return {
        type: 'game',
        content: `NYX//HELP  ::  diegetic interface\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n  nyx [start|stop|ghost_on|ghost_off]
  nyx chat <text>\n
  set_name <name>\n  strings <path>\n  inject_code <t>\n  ls [path]\n  release_phantom()\n  analyze <file>\n  pipe <a> | <b>\n  fork_process\n  vigenere <key> <file>\n  decrypt <file>\n  whoami\n  grep <re> <path>\n  sync_clone <ch>\n  system_reboot()\n  trace <id|ip>\n  pack <file>\n  hexdump <path>\n  derive <hint>\n  b64 <enc|dec> <file>\n  xor <enc|dec> <file> <key>\n  cat <path>\n  impersonate <h>\n  caesar <n> <file>\n  unpack <file>\n  status\n  reset_puzzle\n  scan_network\n  rollback_system\n\n[exit] nyx stop\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      };
    }
  } catch (_) {}

  const aliasList = Object.keys(aliases)
    .filter(
      (a) => !["???", "👻", "debug", "lvl", "maxlevel", "unlock"].includes(a)
    )
    .join(", ");
  return {
    type: "result",
    content: `AVAILABLE COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WALLET OPERATIONS
  connect <wallet> │ Connect wallet (phantom | solflare)
  disconnect       │ Disconnect current wallet
  balance          │ Display wallet balances
  walletinfo       │ Detailed connection information
  tokeninfo <addr> │ Get token metadata and details

STAKING OPERATIONS
  stake <amount>   │ Stake PROMPT tokens
  unstake <amount> │ Withdraw staked tokens
  claim            │ Claim pending rewards
  staked           │ View your staked tokens

TRANSPARENCY & STATS
  globalvault [details] │ View global staking vault (all users)
  stakingstats     │ Protocol statistics and TVL

INFORMATION
  status           │ Current staking status
  rewards          │ Available reward tokens
  apy              │ Pool statistics and APY
  pools            │ Available staking pools
  price            │ Current SOL price
  slot             │ Latest network slot
  profile          │ View user progression

GAMES & STORIES
  nyx [start|help] │ Begin the NYX interactive narrative.

DIAGNOSTICS
  logs <filter>    │ System logs (wallet|command|errors)
  health           │ System health check
  performance      │ Performance metrics
  cache <action>   │ Cache management (status|stats|clear)

FUN
  flip             │ Flip a coin
  dice             │ Roll a six-sided die
  play <game>      │ Play mini-games (snake, arkanoid, pong)

SYSTEM
  about            │ Protocol information
  version          │ System version details
  banner           │ Display PROMPT logo
  clear            │ Clear terminal output
  reset            │ Full system reset

DEVELOPMENT
  levelup <0-4>    │ Jump to specific access level (dev only)
  debug <component>│ Debug info (system|wallet|user|network)
  export <type>    │ Export data (logs|debug)
  ai <action>      │ AI development helper (status|export|logs|debug)

ADMIN (TESTING)
  setup-pool       │ Initialize new staking pool (devnet)
  contract-info    │ Display deployed contract information
  test-connection  │ Test connection to deployed contract

HIDDEN
  ??????           │ ??????

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TAB: autocomplete │ UP/DOWN: command history │ ALIASES: ${aliasList}`,
  };
};

export async function executeCommand(input) {
  const userStatus = getUserStatus();
  // const userAddress = userProgress.walletAddress || mockWalletState.address || 'anonymous';

  // console.log('🎮 Executing command:', input);

  const [command, ...args] = input.split(" ");
  const resolvedCommand = aliases[command.toLowerCase()] || command.toLowerCase();

  // Secret command: player's name as function e.g. "carlos()"
  try {
    if (nyxEngine && nyxEngine.isSecretCommand && nyxEngine.isSecretCommand(input)) {
      return await nyxEngine.ending('secret');
    }
  } catch (_) {}

  // Check if command exists
  if (!commands[resolvedCommand]) {
    // console.warn('Command not found:', command);
    return {
      type: "error",
      content: `❌ Command not found: ${command}\nType "help" for available commands`,
    };
  }

  // If NYX mode is active, only allow NYX-related commands (plus help/clear)
  try {
    const nyxMode = nyxEngine && nyxEngine.state && nyxEngine.state.inNyx;
    if (nyxMode) {
      const nyxAllowed = new Set([
        'help','clear',
        'nyx','set_name','scan_network','decrypt','trace','fork_process','inject_code','rollback_system',
        'system_reboot()','release_phantom()','whoami',
        'ls','cat','grep','hexdump','strings','pipe','analyze','b64','xor','caesar','vigenere','derive',
        'impersonate','sync_clone','pack','unpack','status','reset_puzzle',
      ]);
      if (!nyxAllowed.has(resolvedCommand)) {
        return {
          type: 'error',
          content: `NYX mode is active. Only NYX commands are allowed.\nType 'nyx stop' to exit NYX mode.`,
        };
      }
    }
  } catch (_) {}

  // Unrestricted commands (bypass unlock + token gate)
  const unrestricted = new Set([
    'help',
    'connect',
    'disconnect',
    'clear',
    'banner',
    'version',
    'about',
    'ping',
    'time',
    'whoami',
    'nyx',
    'set_name',
    'scan_network',
    'decrypt',
    'trace',
    'fork_process',
    'inject_code',
    'rollback_system',
    'system_reboot()',
    'release_phantom()',
    // NYX FS & puzzles
    'ls','cat','grep','hexdump','strings','pipe',
    'analyze','b64','xor','caesar','vigenere','derive',
    'impersonate','sync_clone','pack','unpack','status','reset_puzzle',
    // Safe diagnostic commands available to all users
    'logs',
    'health',
    'performance',
    'cache',
    // Development-only commands
    'debug',
    'export',
    'ai',
  ]);

  // Check if user has access to this command
  if (!userProgress.unlockedCommands.has(resolvedCommand) && !unrestricted.has(resolvedCommand)) {
    // console.warn('Command access denied - not unlocked:', resolvedCommand);
    return {
      type: "error",
      content: `🔒 Command "${resolvedCommand}" not unlocked at your current level\nCurrent: [${userStatus.level}] ${userStatus.name}`,
    };
  }

  // Development environment validation for restricted commands
  const developmentCommands = new Set([
    "setup-pool",
    "contract-info",
    "test-connection", // Admin commands
    "debug",
    "logs",
    "export",
    "ai",
    "cache",
    "health",
    "performance", // Diagnostic commands
    "levelup", // System development command
  ]);

  if (developmentCommands.has(resolvedCommand)) {
    const devEnvCheck = requireDevelopmentEnvironment(resolvedCommand);
    if (devEnvCheck) {
      return devEnvCheck;
    }
  }

  // Token gating for restricted commands - safe diagnostics are unrestricted

  if (!unrestricted.has(resolvedCommand)) {
    try {
      const allowed = await hasRequiredBalance();

      if (!allowed) {
        // console.warn('Token gate check failed:', resolvedCommand);

        const tokenData = await getTokenMetadata(TOKEN_MINT);
        const tokenDisplay = formatTokenDisplay(tokenData);
        return {
          type: "error",
          content: `🚫 ACCESS DENIED\nRequires at least ${MIN_TOKEN_BALANCE} ${tokenData.symbol} tokens\n\nToken: ${tokenDisplay}`,
        };
      }
    } catch (error) {
      // console.error('Token verification failed:', error.message);
      return {
        type: "error",
        content: `🚫 ACCESS DENIED\nToken verification failed: ${error.message}`,
      };
    }
  }

  userProgress.commandCount++;

  try {
    // console.log('Executing command:', resolvedCommand, 'with args:', args);

    const result = await commands[resolvedCommand](args);

    // console.log('Command executed successfully:', resolvedCommand);

    const leveledUp = checkLevelUp(resolvedCommand);
    if (leveledUp) {
      const newStatus = getUserStatus();
      // console.log('User leveled up:', newStatus.level);

      const levelUpMsg = `\n\n━━━ 🎉 LEVEL UP! 🎉 ━━━\nAccess Level: [${newStatus.level}] ${newStatus.name}\nNew commands unlocked! Use 'help' to see them.`;
      result.content += levelUpMsg;
    }

    return result;
  } catch (error) {
    // console.error('Command execution failed:', error);

    return {
      type: "error",
      content: `💥 Command execution failed: ${error.message}\nPlease try again or contact support.`,
    };
  }
}

export function getCommandSuggestions(input) {
  const allCommands = [...Object.keys(commands), ...Object.keys(aliases)];
  // Context-aware suggestions: restrict to NYX commands in NYX mode
  try {
    if (nyxEngine && nyxEngine.state && nyxEngine.state.inNyx) {
      const nyxAllowed = new Set([
        'nyx','set_name','scan_network','decrypt','trace','fork_process','inject_code','rollback_system',
        'system_reboot()','release_phantom()','whoami',
        'ls','cat','grep','hexdump','strings','pipe','analyze','b64','xor','caesar','vigenere','derive',
        'impersonate','sync_clone','pack','unpack','status','reset_puzzle',
        'help','clear',
      ]);
      const nyxOnly = allCommands.filter((cmd) => nyxAllowed.has(aliases[cmd] || cmd));
      return nyxOnly.filter((cmd) => cmd.startsWith(input.toLowerCase()));
    }
  } catch (_) {}
  const hiddenCommands = new Set([
    "easter",
    "matrix",
    "ghost",
    "dev",
    "prompt",
    "???",
    "👻",
    "debug",
    "hack",
    "override",
    "decrypt",
  ]);

  const availableCommands = allCommands.filter(
    (cmd) =>
      userProgress.unlockedCommands.has(aliases[cmd] || cmd) &&
      !hiddenCommands.has(cmd)
  );

  return availableCommands.filter((cmd) => cmd.startsWith(input.toLowerCase()));
}

export function getRandomTip() {
  const tips = [
    "TIP: Use TAB for command autocompletion",
    "TIP: Use UP/DOWN arrows to navigate command history",
    "TIP: Type 'apy' to see current staking rewards",
    "TIP: You can stake any amount of PROMPT tokens",
    "TIP: Rewards can be claimed in any SPL token",
    "TIP: Type 'banner' for ASCII art display",
    "TIP: Jupiter Aggregator ensures optimal swap rates",
    "TIP: Use aliases like 'h' for help, 'c' for clear",
    "TIP: Commands are case-insensitive for convenience",
    "TIP: Type 'profile' to check your progression",
    "TIP: Type 'price' to check the current SOL price",
    "TIP: Use 'flip' or 'dice' for a bit of fun",
    "TIP: Hidden commands exist... try exploring!",
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

export function resolveAlias(command) {
  return aliases[command] || command;
}

export { getUserStatus };
