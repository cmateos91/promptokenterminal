import { mockWalletState, userProgress } from '../userState';

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
    userProgress.unlockedCommands = new Set(['help', 'about', 'version', 'banner', 'clear', 'time', 'ping', 'price', 'slot', 'flip', 'dice', 'connect']);
    userProgress.secretsFoundSet = new Set();

    return { type: 'clear', content: 'SYSTEM RESET COMPLETE' };
  }
};
