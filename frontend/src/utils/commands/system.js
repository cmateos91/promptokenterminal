import { mockWalletState, userProgress, getUserStatus } from '../userState';

export const systemCommands = {
  clear: () => ({
    type: 'clear',
    content: ''
  }),

  reset: () => {
    mockWalletState.connected = false;
    mockWalletState.address = null;
    mockWalletState.balance = 0;
    mockWalletState.stakedAmount = 0;
    mockWalletState.rewards = 0;
    mockWalletState.rewardToken = null;
    mockWalletState.provider = null;

    userProgress.level = 0;
    userProgress.commandCount = 0;
    userProgress.secretsFound = 0;
    userProgress.achievements = [];
    userProgress.unlockedCommands = new Set(['help', 'about', 'version', 'banner', 'clear', 'time', 'ping', 'price', 'slot', 'flip', 'dice', 'connect', 'levelup', 'reset', 'logs', 'debug', 'health', 'performance', 'cache', 'export', 'ai', 'contract-info', 'test-connection', 'setup-pool']);
    userProgress.secretsFoundSet = new Set();

    return { type: 'clear', content: 'SYSTEM RESET COMPLETE' };
  },

  // Comando de desarrollo para subir de nivel
  levelup: (args) => {
    const targetLevel = args[0] ? parseInt(args[0]) : 4;
    
    if (isNaN(targetLevel) || targetLevel < 0 || targetLevel > 4) {
      return {
        type: 'error',
        content: '📄 USAGE: levelup <0-4>\n\nLevels:\n0 = ANONYMOUS\n1 = USER\n2 = STAKER\n3 = EXPERT\n4 = HACKER'
      };
    }

    const oldLevel = userProgress.level;
    const oldStatus = getUserStatus();
    
    // Configurar estado según el nivel objetivo
    userProgress.level = targetLevel;
    userProgress.commandCount = targetLevel >= 3 ? 15 : targetLevel * 5;
    userProgress.secretsFound = targetLevel >= 4 ? 3 : 0;
    
    // Simular conexión de wallet para niveles > 0
    if (targetLevel > 0 && !mockWalletState.connected) {
      mockWalletState.connected = true;
      mockWalletState.address = 'DEV1111111111111111111111111111111111111111';
      mockWalletState.walletType = 'dev-wallet';
      mockWalletState.balance = 100.0;
      mockWalletState.isReal = false;
    }
    
    // Simular staking para niveles > 1
    if (targetLevel > 1) {
      mockWalletState.stakedAmount = 100;
      mockWalletState.rewards = 10.5;
    }
    
    // Desbloquear comandos según nivel
    userProgress.unlockedCommands = new Set([
      'help', 'about', 'version', 'banner', 'clear', 'time', 'ping', 'price', 'slot', 'flip', 'dice', 'connect'
    ]);
    
    if (targetLevel >= 1) {
      userProgress.unlockedCommands.add('disconnect');
      userProgress.unlockedCommands.add('balance');
      userProgress.unlockedCommands.add('walletinfo');
      userProgress.unlockedCommands.add('status');
      userProgress.unlockedCommands.add('stake');
      userProgress.unlockedCommands.add('tokeninfo');
    }
    
    if (targetLevel >= 2) {
      userProgress.unlockedCommands.add('unstake');
      userProgress.unlockedCommands.add('claim');
      userProgress.unlockedCommands.add('rewards');
      userProgress.unlockedCommands.add('apy');
      userProgress.unlockedCommands.add('pools');
    }
    
    if (targetLevel >= 3) {
      userProgress.unlockedCommands.add('debug');
      userProgress.unlockedCommands.add('health');
      userProgress.unlockedCommands.add('performance');
      userProgress.unlockedCommands.add('cache');
      userProgress.unlockedCommands.add('logs');
      userProgress.unlockedCommands.add('export');
      userProgress.unlockedCommands.add('dev');
      userProgress.unlockedCommands.add('whoami');
      userProgress.unlockedCommands.add('matrix');
    }
    
    if (targetLevel >= 4) {
      userProgress.unlockedCommands.add('hack');
      userProgress.unlockedCommands.add('override');
      userProgress.unlockedCommands.add('decrypt');
      userProgress.unlockedCommands.add('contract-info');
      userProgress.unlockedCommands.add('test-connection');
      userProgress.unlockedCommands.add('setup-pool');
      userProgress.unlockedCommands.add('easter');
      userProgress.unlockedCommands.add('ghost');
      userProgress.unlockedCommands.add('prompt');
      
      // Marcar secretos como encontrados
      userProgress.secretsFoundSet.add('easter');
      userProgress.secretsFoundSet.add('matrix');
      userProgress.secretsFoundSet.add('ghost');
    }
    
    // Comandos de desarrollo siempre disponibles
    userProgress.unlockedCommands.add('levelup');
    userProgress.unlockedCommands.add('reset');
    
    const newStatus = getUserStatus();
    
    return {
      type: 'result',
      content: `🚀 DEVELOPMENT LEVEL UP\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nLevel Changed: [${oldLevel}] ${oldStatus.name} → [${targetLevel}] ${newStatus.name}\nCommands: ${userProgress.commandCount}\nSecrets: ${userProgress.secretsFound}\nUnlocked Commands: ${Array.from(userProgress.unlockedCommands).length}\n\n🎮 All commands for level ${targetLevel} now available!\nUse 'help' to see available commands.`
    };
  }
};
