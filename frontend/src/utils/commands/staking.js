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
      return { type: 'error', content: '🔒 Connect wallet first using: connect' };
    }

    if (!args.length) {
      return { 
        type: 'error', 
        content: '📄 USAGE: stake <amount>\n\nExample: stake 100\nMin amount: 0.001 PROMPT\nMax amount: Your available balance' 
      };
    }

    // Validación de amount con security utils
    const amountValidation = validateTransactionAmount(
      args[0], 
      mockWalletState.balance || 1000, // Mock balance
      9 // PROMPT decimals
    );
    
    if (!amountValidation.valid) {
      return { 
        type: 'error', 
        content: `❌ Invalid amount: ${amountValidation.error}\n\nEnter a valid number between 0.001 and ${mockWalletState.balance || 1000}` 
      };
    }

    const amount = amountValidation.value;
    
    // Verificación adicional de balance suficiente
    const availableBalance = (mockWalletState.balance || 1000) - mockWalletState.stakedAmount;
    if (amount > availableBalance) {
      return {
        type: 'error',
        content: `🚫 Insufficient balance\nRequested: ${amount} PROMPT\nAvailable: ${availableBalance.toFixed(4)} PROMPT`
      };
    }

    mockWalletState.stakedAmount += amount;
    const dailyRewards = (amount * 0.15 / 365).toFixed(6);
    const totalStaked = mockWalletState.stakedAmount.toFixed(4);

    return {
      type: 'result',
      content: `✅ STAKING TRANSACTION COMPLETED\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nAmount staked:     ${amount} PROMPT\nTotal staked:      ${totalStaked} PROMPT\nDaily rewards:     ${dailyRewards} tokens\nAPY:               15.2%\n\nTransaction processed successfully.`
    };
  },

  unstake: (args) => {
    if (!mockWalletState.connected) {
      return { type: 'error', content: '🔒 Connect wallet first using: connect' };
    }

    if (!args.length) {
      return { 
        type: 'error', 
        content: '📄 USAGE: unstake <amount>\n\nExample: unstake 50\nCurrent staked: ' + mockWalletState.stakedAmount + ' PROMPT' 
      };
    }

    // Validación con security utils
    const amountValidation = InputValidator.isValidNumber(args[0], {
      min: 0.001,
      max: mockWalletState.stakedAmount,
      allowDecimals: true,
      maxDecimals: 9
    });

    if (!amountValidation.valid) {
      return { 
        type: 'error', 
        content: `❌ Invalid amount: ${amountValidation.error}\n\nStaked amount: ${mockWalletState.stakedAmount} PROMPT` 
      };
    }

    const amount = amountValidation.value;

    if (amount > mockWalletState.stakedAmount) {
      return { 
        type: 'error', 
        content: `🚫 Insufficient staked amount\nRequested: ${amount} PROMPT\nStaked: ${mockWalletState.stakedAmount} PROMPT` 
      };
    }

    mockWalletState.stakedAmount -= amount;
    const remainingStaked = mockWalletState.stakedAmount.toFixed(4);

    return {
      type: 'result',
      content: `✅ UNSTAKING TRANSACTION COMPLETED\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nAmount unstaked:   ${amount} PROMPT\nRemaining staked:  ${remainingStaked} PROMPT\n\nTokens will be available in your wallet shortly.`
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
