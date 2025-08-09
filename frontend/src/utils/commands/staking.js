import { mockWalletState } from '../userState';

export const stakingCommands = {
  status: () => {
    if (!mockWalletState.connected) {
      return {
        type: 'info',
        content: `STAKING STATUS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nWallet:     Not connected\nStaked:     0 PROMPT\nRewards:    0 tokens\nPool APY:   15.2%\n\nConnect wallet to initialize staking protocol.`
      };
    }

    return {
      type: 'result',
      content: `STAKING STATUS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nWallet:       ${mockWalletState.address}\nStaked:       ${mockWalletState.stakedAmount} PROMPT\nRewards:      ${mockWalletState.rewards} tokens\nPool APY:     15.2%\nReward Token: ${mockWalletState.rewardToken || 'Not configured'}`
    };
  },

  stake: (args) => {
    if (!mockWalletState.connected) {
      return { type: 'error', content: 'Connect wallet first using: connect' };
    }

    if (!args.length) {
      return { type: 'error', content: 'Usage: stake <amount>\nExample: stake 100' };
    }

    const amount = parseFloat(args[0]);
    if (isNaN(amount) || amount <= 0) {
      return { type: 'error', content: 'Invalid amount. Please enter a positive number.' };
    }

    mockWalletState.stakedAmount += amount;

    return {
      type: 'result',
      content: `STAKING TRANSACTION COMPLETED\n\nAmount staked:     ${amount} PROMPT\nTotal staked:      ${mockWalletState.stakedAmount} PROMPT\nDaily rewards:     ${(amount * 0.15 / 365).toFixed(4)} tokens`
    };
  },

  unstake: (args) => {
    if (!mockWalletState.connected) {
      return { type: 'error', content: 'Connect wallet first using: connect' };
    }

    if (!args.length) {
      return { type: 'error', content: 'Usage: unstake <amount>\nExample: unstake 50' };
    }

    const amount = parseFloat(args[0]);
    if (isNaN(amount) || amount <= 0) {
      return { type: 'error', content: 'Invalid amount. Please enter a positive number.' };
    }

    if (amount > mockWalletState.stakedAmount) {
      return { type: 'error', content: `Insufficient staked amount. You have ${mockWalletState.stakedAmount} $PROMPT staked.` };
    }

    mockWalletState.stakedAmount -= amount;

    return {
      type: 'result',
      content: `UNSTAKING TRANSACTION COMPLETED\n\nAmount unstaked:   ${amount} PROMPT\nRemaining staked:  ${mockWalletState.stakedAmount} PROMPT`
    };
  },

  claim: () => {
    if (!mockWalletState.connected) {
      return { type: 'error', content: 'Connect wallet first using: connect' };
    }

    if (mockWalletState.rewards === 0) {
      return { type: 'info', content: 'No rewards available to claim.' };
    }

    const claimedRewards = mockWalletState.rewards;
    mockWalletState.rewards = 0;

    return {
      type: 'result',
      content: `REWARDS CLAIMED\n\nTokens claimed:    ${claimedRewards}\nTransaction completed successfully.`
    };
  },

  rewards: () => {
    if (!mockWalletState.connected) {
      return {
        type: 'info',
        content: `REWARDS INFORMATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nAvailable:      0 tokens\nReward Token:   Any SPL token\nDaily Rate:     15.2% APY\n\nWallet connection required for rewards access.`
      };
    }

    return {
      type: 'result',
      content: `REWARDS SUMMARY\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nAvailable:      ${mockWalletState.rewards} tokens\nReward Token:   ${mockWalletState.rewardToken || 'Not configured'}\nDaily Rate:     ${(mockWalletState.stakedAmount * 0.15 / 365).toFixed(4)} tokens/day\nTotal Earned:   ${mockWalletState.rewards} tokens`
    };
  },

  apy: () => ({
    type: 'result',
    content: `POOL STATISTICS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nBase APY:         15.2%\nBonus APY: +2.3% (PROMPT holders)\nTotal APY:        17.5%\n\nPool TVL:         $2,450,000\nActive Stakers:   1,247\nAverage Stake:    1,965 PROMPT`
  }),

  pools: () => ({
    type: 'result',
    content: `STAKING POOLS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n[1] MAIN POOL - ACTIVE\n    APY: 15.2% | TVL: $2.45M | Stakers: 1,247\n\n[2] VIP POOL - DEVELOPMENT\n    APY: 25.0% | Min: 10,000 PROMPT | Status: Soon\n\n[3] LIGHTNING POOL - PLANNED\n    APY: 8.5% | Instant unstake | Status: Development`
  })
};
