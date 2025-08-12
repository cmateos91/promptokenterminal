// Manages wallet and user progression state

export const mockWalletState = {
  connected: false,
  address: null,
  balance: 0,
  stakedAmount: 0,
  rewards: 0,
  rewardToken: null,
  provider: null,
  // Nuevos campos para datos reales
  walletType: null,      // 'phantom', 'solflare', etc.
  tokenCount: 0,         // Número de tokens SPL
  connectionTime: null,  // Timestamp de conexión
  isReal: true          // Flag para distinguir datos reales de mock
};

export const userProgress = {
  level: 0,
  commandCount: 0,
  secretsFound: 0,
  achievements: [],
  unlockedCommands: new Set(['help', 'about', 'version', 'banner', 'clear', 'time', 'ping', 'price', 'slot', 'flip', 'dice', 'play', 'connect', 'levelup', 'reset', 'logs', 'debug', 'health', 'performance', 'cache', 'export', 'ai', 'contract-info', 'test-connection', 'setup-pool']),
  secretsFoundSet: new Set()
};

export const USER_LEVELS = [
  { name: 'ANONYMOUS', color: '#888888', description: 'Unknown entity' },
  { name: 'USER', color: '#00ff41', description: 'Connected user' },
  { name: 'STAKER', color: '#66ff66', description: 'Active staker' },
  { name: 'EXPERT', color: '#00cc33', description: 'Terminal expert' },
  { name: 'HACKER', color: '#ffffff', description: 'System infiltrator' }
];

export function checkLevelUp(commandName) {
  const oldLevel = userProgress.level;

  if (userProgress.level === 0 && commandName === 'connect' && mockWalletState.connected) {
    userProgress.level = 1;
    userProgress.unlockedCommands.add('disconnect');
    userProgress.unlockedCommands.add('balance');
    userProgress.unlockedCommands.add('walletinfo');
    userProgress.unlockedCommands.add('status');
    userProgress.unlockedCommands.add('stake');
  }

  if (userProgress.level === 1 && commandName === 'stake' && mockWalletState.stakedAmount > 0) {
    userProgress.level = 2;
    userProgress.unlockedCommands.add('unstake');
    userProgress.unlockedCommands.add('claim');
    userProgress.unlockedCommands.add('rewards');
  }

  if (userProgress.level === 2 && userProgress.commandCount >= 15) {
    userProgress.level = 3;
    userProgress.unlockedCommands.add('dev');
    userProgress.unlockedCommands.add('whoami');
    userProgress.unlockedCommands.add('matrix');
  }

  if (userProgress.level === 3 && userProgress.secretsFound >= 3) {
    userProgress.level = 4;
    userProgress.unlockedCommands.add('hack');
    userProgress.unlockedCommands.add('override');
    userProgress.unlockedCommands.add('decrypt');
    userProgress.unlockedCommands.add('contract-info');
    userProgress.unlockedCommands.add('test-connection');
    userProgress.unlockedCommands.add('setup-pool');
  }

  return userProgress.level > oldLevel;
}

export function getUserStatus() {
  const level = USER_LEVELS[userProgress.level];
  return {
    level: userProgress.level,
    name: level.name,
    color: level.color,
    description: level.description,
    commandCount: userProgress.commandCount,
    secretsFound: userProgress.secretsFound,
    nextLevelRequirement: getNextLevelRequirement()
  };
}

export function getNextLevelRequirement() {
  switch (userProgress.level) {
    case 0: return 'Connect a wallet to reach USER level';
    case 1: return 'Stake tokens to reach STAKER level';
    case 2: return `Execute ${15 - userProgress.commandCount} more commands to reach EXPERT level`;
    case 3: return `Find ${3 - userProgress.secretsFound} more secrets to reach HACKER level`;
    case 4: return 'Maximum level achieved';
    default: return 'Unknown';
  }
}
