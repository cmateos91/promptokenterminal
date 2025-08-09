import { userProgress } from '../userState';

export const easterEggCommands = {
  easter: () => {
    if (!userProgress.secretsFoundSet.has('easter')) {
      userProgress.secretsFoundSet.add('easter');
      userProgress.secretsFound++;
    }
    return {
      type: 'result',
      content: `EASTER EGG FOUND!\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🥚 Congratulations, you found the hidden command!\n\nSecret message: "The future of staking is prompt."\n\nSecrets found: ${userProgress.secretsFound}/3\n\nTry: matrix, ghost, or dev for more secrets...`
    };
  },

  matrix: () => {
    if (!userProgress.secretsFoundSet.has('matrix')) {
      userProgress.secretsFoundSet.add('matrix');
      userProgress.secretsFound++;
    }
    return {
      type: 'result',
      content: `THE MATRIX HAS YOU...\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n01100110 01110101 01110100 01110101\n01110010 01100101 00100000 01101111\n01100110 00100000 01110011 01110100\n01100001 01101011 01101001 01101110\n01100111 00100000 01101001 01110011\n00100000 01110000 01110010 01101111\n01101101 01110000 01110100\n\nTranslated: "future of staking is prompt"\nSecrets found: ${userProgress.secretsFound}/3`
    };
  },

  ghost: () => {
    if (!userProgress.secretsFoundSet.has('ghost')) {
      userProgress.secretsFoundSet.add('ghost');
      userProgress.secretsFound++;
    }
    return {
      type: 'result',
      content: `👻 GHOST MODE ACTIVATED\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nYou are now invisible in the mempool...\nStaking operations will have 0% slippage\nRewards multiplied by 2x temporarily\n\nSecrets found: ${userProgress.secretsFound}/3\n\n[This is just for fun - no real effect]`
    };
  },

  dev: () => ({
    type: 'result',
    content: `DEVELOPER MODE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nDeveloper tools unlocked:\n• Advanced logging enabled\n• Debug mode active\n• Performance metrics visible\n• All RPC endpoints accessible\n\nProject: Solana Staking dApp\nFramework: Anchor + React + Vite\nAuthor: @mate0s91\n\nWant to contribute? Check the GitHub!`
  }),

  hack: () => {
    if (userProgress.level < 4) {
      return { type: 'error', content: 'ACCESS DENIED: HACKER level required' };
    }
    return {
      type: 'result',
      content: `INITIATING HACK SEQUENCE...\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n> Scanning network vulnerabilities...\n> Bypassing firewall protocols...\n> Accessing mainframe...\n\n[SUCCESS] System infiltration complete.\n[CAUTION] Use powers responsibly.`
    };
  },

  override: () => {
    if (userProgress.level < 4) {
      return { type: 'error', content: 'ACCESS DENIED: HACKER level required' };
    }
    return {
      type: 'result',
      content: `SYSTEM OVERRIDE ACTIVATED\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n> Emergency protocols disabled\n> Admin privileges escalated\n> Security constraints bypassed\n\n[WARNING] Override mode active.\nAll restrictions temporarily lifted.`
    };
  },

  decrypt: () => {
    if (userProgress.level < 4) {
      return { type: 'error', content: 'ACCESS DENIED: HACKER level required' };
    }
    const secretMessage = 'Welcome to the inner circle';
    return {
      type: 'result',
      content: `DECRYPTION MODULE ACTIVE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n> Analyzing encrypted payload...\n> Applying quantum decryption...\n> Message decoded successfully.\n\nDecrypted message: "${secretMessage}"\n\n[CLASSIFIED] You are now part of the inner circle.`
    };
  },

  prompt: () => ({
    type: 'result',
    content: `$PROMPT TOKEN INFO\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nContract: [To be deployed]\nSupply: 1,000,000,000 PROMPT\nDecimals: 9\nNetwork: Solana Mainnet\n\nUtility:\n• Staking rewards boost\n• Governance voting rights\n• Protocol fee discounts\n• Priority pool access\n\n"Building the future, one prompt at a time."`
  })
};
