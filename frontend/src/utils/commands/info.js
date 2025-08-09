import { connection } from '../solana';
import { getUserStatus, userProgress } from '../userState';
import { ASCII_ART } from '../asciiArt';

export const infoCommands = {
  profile: () => {
    const status = getUserStatus();
    return {
      type: 'result',
      content: `USER PROFILE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nAccess Level:     [${status.level}] ${status.name}\nDescription:      ${status.description}\nCommands Used:    ${status.commandCount}\nSecrets Found:    ${status.secretsFound}\n\nProgression:\n${status.nextLevelRequirement}\n\nUnlocked Commands: ${Array.from(userProgress.unlockedCommands).length}\nAchievements:      ${userProgress.achievements.length}`
    };
  },

  price: async () => {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await res.json();
      return {
        type: 'result',
        content: `SOL PRICE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n1 SOL = $${data.solana.usd} USD`
      };
    } catch (err) {
      return { type: 'error', content: `Price fetch failed: ${err.message}` };
    }
  },

  slot: async () => {
    try {
      const currentSlot = await connection.getSlot();
      return {
        type: 'result',
        content: `CURRENT SLOT\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${currentSlot}`
      };
    } catch (err) {
      return { type: 'error', content: `Slot fetch failed: ${err.message}` };
    }
  },

  about: () => ({
    type: 'result',
    content: `PROMPT STAKING PROTOCOL v1.0.0\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nAdvanced staking protocol built on Solana blockchain.\n\nFEATURES:\n• Stake PROMPT tokens with flexible reward systems\n• Earn rewards in any SPL token of choice\n• Powered by Jupiter Aggregator for optimal swaps\n• Built with Anchor smart contract framework\n\nLINKS:\nWebsite:   prompt.staking\nTwitter:   @prompt_protocol\nDiscord:   discord.gg/prompt\nGitHub:    github.com/prompt/staking-dapp\n\nDeveloped on Solana blockchain infrastructure.`
  }),

  version: () => ({
    type: 'result',
    content: `SYSTEM INFORMATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nTerminal:      v1.0.0\nProtocol:      v1.0.0\nSolana:        Mainnet Beta\nNetwork:       Connected\nRPC:           https://api.mainnet-beta.solana.com\n\nBuild Date:  ${new Date().toISOString().split('T')[0]}\nUptime:        ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`
  }),

  banner: () => ({
    type: 'result',
    content: ASCII_ART.prompt
  }),

  ping: () => ({
    type: 'result',
    content: 'NETWORK DIAGNOSTIC\n\nLatency: 42ms\nStatus: Connected'
  }),

  time: () => ({
    type: 'result',
    content: `SYSTEM TIME\n\nCurrent: ${new Date().toLocaleString()}\nTimezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`
  }),

  whoami: () => {
    const status = getUserStatus();
    return {
      type: 'result',
      content: `USER IDENTIFICATION\n\nUser: Anonymous Staker #1337\nAccess Level: [${status.level}] ${status.name}\nClearance: ${status.description}`
    };
  }
};
