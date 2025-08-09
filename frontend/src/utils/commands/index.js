import { walletCommands } from './wallet';
import { stakingCommands } from './staking';
import { infoCommands } from './info';
import { funCommands } from './fun';
import { systemCommands } from './system';
import { easterEggCommands } from './easterEggs';
import { userProgress, checkLevelUp, getUserStatus } from '../userState';
import { hasRequiredBalance } from '../tokenGate';
import { MIN_TOKEN_BALANCE, TOKEN_MINT } from '../config';
import { getTokenMetadata, formatTokenDisplay } from '../tokenMetadata';

const commands = {
  ...walletCommands,
  ...stakingCommands,
  ...infoCommands,
  ...funCommands,
  ...systemCommands,
  ...easterEggCommands
};

const aliases = {
  'h': 'help', 'c': 'clear', 'r': 'reset', 'p': 'profile', 'st': 'status',
  'bal': 'balance', 'conn': 'connect', 'disc': 'disconnect', 'winfo': 'walletinfo',
  'tinfo': 'tokeninfo', 'ti': 'tokeninfo',
  'pr': 'price', 'sol': 'price', 'sl': 'slot',
  'coin': 'flip', 'roll': 'dice',
  '???': 'easter', '👻': 'ghost', 'debug': 'dev'
};

commands.help = () => {
  const aliasList = Object.keys(aliases)
    .filter(a => !['???', '👻', 'debug'].includes(a))
    .join(', ');
  return {
    type: 'result',
    content: `AVAILABLE COMMANDS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nWALLET OPERATIONS\n  connect <wallet> │ Connect wallet (phantom | solflare)\n  disconnect       │ Disconnect current wallet\n  balance          │ Display wallet balances\n  walletinfo       │ Detailed connection information\n  tokeninfo <addr> │ Get token metadata and details\n\nSTAKING OPERATIONS\n  stake <amount>   │ Stake PROMPT tokens\n  unstake <amount> │ Withdraw staked tokens\n  claim            │ Claim pending rewards\n\nINFORMATION\n  status           │ Current staking status\n  rewards          │ Available reward tokens\n  apy              │ Pool statistics and APY\n  pools            │ Available staking pools\n  price            │ Current SOL price\n  slot             │ Latest network slot\n  profile          │ View user progression\n\nFUN\n  flip             │ Flip a coin\n  dice             │ Roll a six-sided die\n\nSYSTEM\n  about            │ Protocol information\n  version          │ System version details\n  banner           │ Display PROMPT logo\n  clear            │ Clear terminal output\n  reset            │ Full system reset\n\nHIDDEN\n  ??????           │ ??????\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nTAB: autocomplete │ UP/DOWN: command history │ ALIASES: ${aliasList}`
  };
};

export async function executeCommand(input) {
  const [command, ...args] = input.toLowerCase().split(' ');
  const resolvedCommand = aliases[command] || command;

  if (commands[resolvedCommand]) {
    const unrestricted = new Set(['help', 'connect', 'disconnect', 'clear', 'banner', 'version', 'about']);

    if (!unrestricted.has(resolvedCommand)) {
      const allowed = await hasRequiredBalance();
      
      if (!allowed) {
        // Obtener metadatos del token para mostrar nombre en lugar de dirección
        try {
          const tokenData = await getTokenMetadata(TOKEN_MINT);
          const tokenDisplay = formatTokenDisplay(tokenData);
          return {
            type: 'error',
            content: `ACCESS DENIED\nRequires at least ${MIN_TOKEN_BALANCE} ${tokenData.symbol} tokens\n\nToken: ${tokenDisplay}`
          };
        } catch (error) {
          // Fallback al comportamiento original si falla la obtención de metadatos
          return {
            type: 'error',
            content: `ACCESS DENIED\nRequires at least ${MIN_TOKEN_BALANCE} tokens of ${TOKEN_MINT.toBase58()}`
          };
        }
      }
    }

    userProgress.commandCount++;

    try {
      const result = await commands[resolvedCommand](args);
      const leveledUp = checkLevelUp(resolvedCommand);

      if (leveledUp) {
        const status = getUserStatus();
        const levelUpMsg = `\n\n━━━ LEVEL UP! ━━━\nAccess Level: [${status.level}] ${status.name}\nNew commands unlocked! Use 'help' to see them.`;
        result.content += levelUpMsg;
      }

      return result;
    } catch (error) {
      return { type: 'error', content: `Command execution failed: ${error.message}` };
    }
  }

  return { type: 'error', content: `Command not found: ${command}\nType "help" for available commands` };
}

export function getCommandSuggestions(input) {
  const allCommands = [...Object.keys(commands), ...Object.keys(aliases)];
  const hiddenCommands = new Set(['easter', 'matrix', 'ghost', 'dev', 'prompt', '???', '👻', 'debug', 'hack', 'override', 'decrypt']);

  const availableCommands = allCommands.filter(cmd =>
    userProgress.unlockedCommands.has(aliases[cmd] || cmd) && !hiddenCommands.has(cmd)
  );

  return availableCommands.filter(cmd => cmd.startsWith(input.toLowerCase()));
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
    "TIP: Hidden commands exist... try exploring!"
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

export function resolveAlias(command) {
  return aliases[command] || command;
}

export { getUserStatus };
