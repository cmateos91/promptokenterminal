/**
 * 🤖 AI-Ready Contract Tests
 * Comprehensive testing for smart contract integration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { stakingCommands } from '../utils/commands/staking';
import { mockWalletState, userProgress } from '../utils/userState';
import { devLogger } from '../utils/logger';

// Mock the contract service
vi.mock('../services/stakingContract', () => ({
  stakingService: {
    getUserStakeInfo: vi.fn(),
    stakeTokens: vi.fn(),
    unstakeTokens: vi.fn(),
    claimRewards: vi.fn(),
    getStakingPools: vi.fn(),
    getContractHealth: vi.fn(),
    getMetrics: vi.fn(),
    exportDebugData: vi.fn(),
    programId: { toString: () => 'mock_program_id' }
  }
}));

describe('🏗️ Smart Contract Integration Tests', () => {
  beforeEach(() => {
    // Reset mock wallet state
    mockWalletState.connected = true;
    mockWalletState.address = 'mock_address_12345';
    mockWalletState.balance = 1000;
    mockWalletState.stakedAmount = 100;
    mockWalletState.rewards = 10;
    
    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('📊 Status Command', () => {
    it('should show disconnected status when wallet not connected', async () => {
      mockWalletState.connected = false;
      
      const result = await stakingCommands.status();
      
      expect(result.type).toBe('info');
      expect(result.content).toContain('Not connected');
      expect(result.content).toContain('Mock Mode');
    });

    it('should show connected status with contract data', async () => {
      const result = await stakingCommands.status();
      
      expect(result.type).toBe('result');
      expect(result.content).toContain('mock_address_12345');
      expect(result.content).toContain('100 PROMPT');
      expect(result.content).toContain('10 tokens');
    });

    it('should log performance metrics', async () => {
      const logSpy = vi.spyOn(devLogger, 'performance');
      
      await stakingCommands.status();
      
      expect(logSpy).toHaveBeenCalledWith('staking:status', expect.any(Number));
    });
  });

  describe('💰 Stake Command', () => {
    it('should require wallet connection', async () => {
      mockWalletState.connected = false;
      
      const result = await stakingCommands.stake(['100']);
      
      expect(result.type).toBe('error');
      expect(result.content).toContain('Connect wallet first');
    });

    it('should require amount parameter', async () => {
      const result = await stakingCommands.stake([]);
      
      expect(result.type).toBe('error');
      expect(result.content).toContain('USAGE: stake <amount>');
    });

    it('should validate amount format', async () => {
      const result = await stakingCommands.stake(['invalid']);
      
      expect(result.type).toBe('error');
      expect(result.content).toContain('Invalid amount');
    });

    it('should check sufficient balance', async () => {
      const result = await stakingCommands.stake(['2000']); // More than available
      
      expect(result.type).toBe('error');
      expect(result.content).toContain('Insufficient balance');
    });

    it('should successfully stake valid amount', async () => {
      const result = await stakingCommands.stake(['50']);
      
      expect(result.type).toBe('result');
      expect(result.content).toContain('STAKING TRANSACTION COMPLETED');
      expect(result.content).toContain('50 PROMPT');
      expect(mockWalletState.stakedAmount).toBe(150); // 100 + 50
    });

    it('should log staking operations for AI', async () => {
      const commandSpy = vi.spyOn(devLogger, 'command');
      
      await stakingCommands.stake(['50']);
      
      expect(commandSpy).toHaveBeenCalledWith('staking:stake', { args: ['50'] }, null);
    });
  });

  describe('💸 Unstake Command', () => {
    it('should require wallet connection', async () => {
      mockWalletState.connected = false;
      
      const result = await stakingCommands.unstake(['50']);
      
      expect(result.type).toBe('error');
      expect(result.content).toContain('Connect wallet first');
    });

    it('should check sufficient staked amount', async () => {
      const result = await stakingCommands.unstake(['200']); // More than staked
      
      expect(result.type).toBe('error');
      expect(result.content).toContain('Insufficient staked amount');
    });

    it('should successfully unstake valid amount', async () => {
      const result = await stakingCommands.unstake(['50']);
      
      expect(result.type).toBe('result');
      expect(result.content).toContain('UNSTAKING TRANSACTION COMPLETED');
      expect(result.content).toContain('50 PROMPT');
      expect(result.content).toContain('Unlock date');
      expect(mockWalletState.stakedAmount).toBe(50); // 100 - 50
    });
  });

  describe('🎁 Claim Command', () => {
    it('should require wallet connection', async () => {
      mockWalletState.connected = false;
      
      const result = await stakingCommands.claim();
      
      expect(result.type).toBe('error');
      expect(result.content).toContain('Connect wallet first');
    });

    it('should handle no rewards available', async () => {
      mockWalletState.rewards = 0;
      
      const result = await stakingCommands.claim();
      
      expect(result.type).toBe('info');
      expect(result.content).toContain('No rewards available');
    });

    it('should successfully claim rewards', async () => {
      const result = await stakingCommands.claim();
      
      expect(result.type).toBe('result');
      expect(result.content).toContain('REWARDS CLAIMED');
      expect(result.content).toContain('10 tokens');
      expect(mockWalletState.rewards).toBe(0);
    });
  });

  describe('🏗️ Contract Command (AI Debugging)', () => {
    it('should show contract status', async () => {
      const result = await stakingCommands.contract(['status']);
      
      expect(result.type).toBe('result');
      expect(result.content).toContain('CONTRACT STATUS');
      expect(result.content).toContain('AI Debug: Ready');
    });

    it('should show contract metrics', async () => {
      const result = await stakingCommands.contract(['metrics']);
      
      expect(result.type).toBe('result');
      expect(result.content).toContain('CONTRACT METRICS');
      expect(result.content).toContain('AI Monitoring: Active');
    });

    it('should export debug data for AI', async () => {
      const result = await stakingCommands.contract(['debug']);
      
      expect(result.type).toBe('result');
      expect(result.content).toContain('CONTRACT DEBUG');
      expect(result.content).toContain('Available for AI analysis');
    });

    it('should show available commands for unknown action', async () => {
      const result = await stakingCommands.contract(['unknown']);
      
      expect(result.type).toBe('result');
      expect(result.content).toContain('Contract commands: status, metrics, debug');
    });
  });

  describe('📊 Performance and Logging', () => {
    it('should log all command executions', async () => {
      const commandSpy = vi.spyOn(devLogger, 'command');
      
      await stakingCommands.status();
      await stakingCommands.stake(['100']);
      await stakingCommands.rewards();
      
      expect(commandSpy).toHaveBeenCalledTimes(3);
    });

    it('should track performance metrics', async () => {
      const perfSpy = vi.spyOn(devLogger, 'performance');
      
      await stakingCommands.status();
      
      expect(perfSpy).toHaveBeenCalledWith('staking:status', expect.any(Number));
    });

    it('should log errors for debugging', async () => {
      const errorSpy = vi.spyOn(devLogger, 'error');
      
      // Force an error by setting invalid state
      mockWalletState.connected = true;
      mockWalletState.balance = undefined;
      
      try {
        await stakingCommands.stake(['100']);
      } catch (error) {
        expect(errorSpy).toHaveBeenCalled();
      }
    });
  });

  describe('🔄 Integration Scenarios', () => {
    it('should handle complete staking workflow', async () => {
      // Step 1: Check initial status
      let result = await stakingCommands.status();
      expect(result.content).toContain('100 PROMPT'); // Initial staked
      
      // Step 2: Stake more tokens
      result = await stakingCommands.stake(['50']);
      expect(result.type).toBe('result');
      expect(mockWalletState.stakedAmount).toBe(150);
      
      // Step 3: Check updated status
      result = await stakingCommands.status();
      expect(result.content).toContain('150 PROMPT');
      
      // Step 4: Claim rewards
      result = await stakingCommands.claim();
      expect(result.type).toBe('result');
      expect(mockWalletState.rewards).toBe(0);
      
      // Step 5: Unstake partially
      result = await stakingCommands.unstake(['25']);
      expect(result.type).toBe('result');
      expect(mockWalletState.stakedAmount).toBe(125);
    });

    it('should maintain data consistency across operations', async () => {
      const initialStaked = mockWalletState.stakedAmount;
      const stakeAmount = 75;
      
      await stakingCommands.stake([stakeAmount.toString()]);
      expect(mockWalletState.stakedAmount).toBe(initialStaked + stakeAmount);
      
      await stakingCommands.unstake(['25']);
      expect(mockWalletState.stakedAmount).toBe(initialStaked + stakeAmount - 25);
    });
  });

  describe('🤖 AI-Specific Features', () => {
    it('should export comprehensive debug data', async () => {
      const result = await stakingCommands.contract(['debug']);
      
      expect(result.type).toBe('result');
      expect(result.content).toContain('Debug data exported to console');
      expect(result.content).toContain('Available for AI analysis');
    });

    it('should provide detailed error context for AI', async () => {
      const errorSpy = vi.spyOn(devLogger, 'error');
      
      // Trigger validation error
      await stakingCommands.stake(['invalid_amount']);
      
      expect(errorSpy).toHaveBeenCalledWith(
        'staking:stake',
        expect.any(Error),
        expect.objectContaining({ amount: 'invalid_amount' })
      );
    });

    it('should track contract interaction metrics', async () => {
      // Simulate multiple operations
      await stakingCommands.status();
      await stakingCommands.stake(['10']);
      await stakingCommands.rewards();
      await stakingCommands.contract(['metrics']);
      
      const result = await stakingCommands.contract(['metrics']);
      expect(result.content).toContain('CONTRACT METRICS');
    });
  });
});

// 🧪 Contract Service Integration Tests
describe('🔗 Contract Service Integration', () => {
  beforeEach(() => {
    mockWalletState.connected = true;
    vi.clearAllMocks();
  });

  it('should handle contract service unavailability gracefully', async () => {
    // Mock contract service as unavailable
    vi.doMock('../../services/stakingContract', () => ({
      stakingService: null
    }));
    
    const result = await stakingCommands.status();
    expect(result.content).toContain('Mock Mode');
  });

  it('should integrate with real contract calls when available', async () => {
    // This test will be more relevant when actual contracts are deployed
    const result = await stakingCommands.contract(['status']);
    expect(result.type).toBe('result');
  });
});

// 🔍 Performance Tests
describe('⚡ Performance Tests', () => {
  it('should complete operations within acceptable time limits', async () => {
    const start = performance.now();
    
    await stakingCommands.status();
    
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(100); // Should complete in under 100ms
  });

  it('should handle concurrent operations', async () => {
    const operations = [
      stakingCommands.status(),
      stakingCommands.rewards(),
      stakingCommands.apy(),
      stakingCommands.pools()
    ];
    
    const results = await Promise.all(operations);
    
    expect(results).toHaveLength(4);
    results.forEach(result => {
      expect(result.type).toMatch(/result|info/);
    });
  });
});

export default {
  name: 'Contract Integration Tests',
  description: '🤖 AI-ready smart contract testing suite',
  coverage: {
    commands: ['status', 'stake', 'unstake', 'claim', 'rewards', 'apy', 'pools', 'contract'],
    scenarios: ['happy-path', 'error-handling', 'edge-cases', 'performance'],
    aiFeatures: ['logging', 'debugging', 'metrics', 'error-context']
  }
};
