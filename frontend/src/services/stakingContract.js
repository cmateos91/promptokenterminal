/**
 * 🤖 AI-Ready Smart Contract Service
 * Integración completa con logging y debugging para IA
 */

import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { devLogger, performanceLogger } from '../utils/logger';
import { RPC_URL } from '../utils/config';

// 🎯 Program IDs (actualizables por environment)
export const STAKING_PROGRAM_ID = new PublicKey(
  import.meta.env.VITE_STAKING_PROGRAM_ID || '7N4UDuARwRzAhU7hEjkdJcwxVoKUGQ7FzRBuqWJyqmh3'
);

export const PROMPT_TOKEN_MINT = new PublicKey(
  import.meta.env.VITE_PROMPT_TOKEN_MINT || '5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF'
);

/**
 * 🔧 Smart Contract Service
 * Maneja todas las interacciones con el programa de staking
 */
export class StakingContractService {
  constructor() {
    this.connection = new Connection(RPC_URL, 'confirmed');
    this.programId = STAKING_PROGRAM_ID;
    
    // 🤖 Logging para IA
    devLogger.network('Contract service initialized', RPC_URL, null);
    
    // 📊 Performance tracking
    this.performanceMetrics = {
      totalCalls: 0,
      averageLatency: 0,
      errors: 0,
      lastCall: null
    };
  }

  // 🏪 Pool Management
  async getStakingPools() {
    const startTime = performance.now();
    
    try {
      devLogger.command('getStakingPools', 'Starting', null);
      
      // Mock data while contracts aren't deployed
      const mockPools = [
        {
          address: new PublicKey('11111111111111111111111111111111'),
          tokenMint: PROMPT_TOKEN_MINT,
          rewardMint: PROMPT_TOKEN_MINT,
          totalStaked: 1000000,
          apy: 12.5,
          active: true,
          authority: new PublicKey('11111111111111111111111111111111')
        }
      ];
      
      const duration = performance.now() - startTime;
      this.updateMetrics(duration, false);
      
      devLogger.command('getStakingPools', mockPools, null);
      devLogger.performance('getStakingPools', duration);
      
      return mockPools;
      
    } catch (error) {
      const duration = performance.now() - startTime;
      this.updateMetrics(duration, true);
      
      devLogger.error('getStakingPools', error);
      throw new Error(`Failed to fetch staking pools: ${error.message}`);
    }
  }

  // 💰 Staking Operations
  async stakeTokens(amount, userWallet, poolAddress = null) {
    const startTime = performance.now();
    
    try {
      devLogger.command('stakeTokens', { amount, userWallet: userWallet.publicKey.toString() }, null);
      
      if (!userWallet || !userWallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      // 🏗️ Build transaction (mock for now)
      const transaction = new Transaction();
      
      // Add mock instruction
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: userWallet.publicKey,
          toPubkey: userWallet.publicKey, // Self transfer for testing
          lamports: 0
        })
      );

      // Mock successful result
      const result = {
        signature: 'mock_signature_' + Date.now(),
        amount,
        pool: poolAddress || 'default_pool',
        timestamp: new Date().toISOString()
      };

      const duration = performance.now() - startTime;
      this.updateMetrics(duration, false);
      
      devLogger.command('stakeTokens', result, null);
      devLogger.performance('stakeTokens', duration);
      
      return result;
      
    } catch (error) {
      const duration = performance.now() - startTime;
      this.updateMetrics(duration, true);
      
      devLogger.error('stakeTokens', error, { amount, userWallet: userWallet?.publicKey?.toString() });
      throw error;
    }
  }

  async unstakeTokens(amount, userWallet, poolAddress = null) {
    const startTime = performance.now();
    
    try {
      devLogger.command('unstakeTokens', { amount, userWallet: userWallet.publicKey.toString() }, null);
      
      if (!userWallet || !userWallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      // Mock unstaking with timelock
      const result = {
        signature: 'mock_unstake_' + Date.now(),
        amount,
        pool: poolAddress || 'default_pool',
        unlockTime: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        timestamp: new Date().toISOString()
      };

      const duration = performance.now() - startTime;
      this.updateMetrics(duration, false);
      
      devLogger.command('unstakeTokens', result, null);
      devLogger.performance('unstakeTokens', duration);
      
      return result;
      
    } catch (error) {
      const duration = performance.now() - startTime;
      this.updateMetrics(duration, true);
      
      devLogger.error('unstakeTokens', error, { amount });
      throw error;
    }
  }

  async claimRewards(userWallet, poolAddress = null) {
    const startTime = performance.now();
    
    try {
      devLogger.command('claimRewards', { userWallet: userWallet.publicKey.toString() }, null);
      
      if (!userWallet || !userWallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      // Mock claiming rewards
      const result = {
        signature: 'mock_claim_' + Date.now(),
        amount: Math.floor(Math.random() * 100) + 10, // Random rewards
        token: PROMPT_TOKEN_MINT.toString(),
        pool: poolAddress || 'default_pool',
        timestamp: new Date().toISOString()
      };

      const duration = performance.now() - startTime;
      this.updateMetrics(duration, false);
      
      devLogger.command('claimRewards', result, null);
      devLogger.performance('claimRewards', duration);
      
      return result;
      
    } catch (error) {
      const duration = performance.now() - startTime;
      this.updateMetrics(duration, true);
      
      devLogger.error('claimRewards', error);
      throw error;
    }
  }

  // 📊 Account Info
  async getUserStakeInfo(userWallet, poolAddress = null) {
    const startTime = performance.now();
    
    try {
      devLogger.command('getUserStakeInfo', { userWallet: userWallet.publicKey.toString() }, null);
      
      if (!userWallet || !userWallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      // Mock user stake data
      const result = {
        stakedAmount: 1000,
        pendingRewards: 25.5,
        lastStakeTime: Date.now() - (5 * 24 * 60 * 60 * 1000), // 5 days ago
        unlockTime: null,
        pool: poolAddress || 'default_pool'
      };

      const duration = performance.now() - startTime;
      this.updateMetrics(duration, false);
      
      devLogger.command('getUserStakeInfo', result, null);
      devLogger.performance('getUserStakeInfo', duration);
      
      return result;
      
    } catch (error) {
      const duration = performance.now() - startTime;
      this.updateMetrics(duration, true);
      
      devLogger.error('getUserStakeInfo', error);
      throw error;
    }
  }

  // 🔍 Debugging and Monitoring
  async getContractHealth() {
    const startTime = performance.now();
    
    try {
      devLogger.command('getContractHealth', 'Checking', null);
      
      // Check program account exists
      const programAccount = await this.connection.getAccountInfo(this.programId);
      
      const health = {
        programDeployed: !!programAccount,
        programId: this.programId.toString(),
        connection: {
          endpoint: this.connection.rpcEndpoint,
          commitment: this.connection.commitment
        },
        metrics: this.performanceMetrics,
        timestamp: new Date().toISOString()
      };

      const duration = performance.now() - startTime;
      this.updateMetrics(duration, false);
      
      devLogger.command('getContractHealth', health, null);
      devLogger.performance('getContractHealth', duration);
      
      return health;
      
    } catch (error) {
      const duration = performance.now() - startTime;
      this.updateMetrics(duration, true);
      
      devLogger.error('getContractHealth', error);
      throw error;
    }
  }

  // 📈 Performance Metrics
  updateMetrics(duration, isError) {
    this.performanceMetrics.totalCalls++;
    this.performanceMetrics.lastCall = Date.now();
    
    if (isError) {
      this.performanceMetrics.errors++;
    }
    
    // Calculate rolling average
    const currentAvg = this.performanceMetrics.averageLatency;
    const totalCalls = this.performanceMetrics.totalCalls;
    this.performanceMetrics.averageLatency = 
      (currentAvg * (totalCalls - 1) + duration) / totalCalls;
  }

  getMetrics() {
    return {
      ...this.performanceMetrics,
      errorRate: (this.performanceMetrics.errors / this.performanceMetrics.totalCalls) * 100,
      status: this.performanceMetrics.averageLatency < 2000 ? 'healthy' : 'slow'
    };
  }

  // 🤖 AI Debug Export
  exportDebugData() {
    const debugData = {
      service: 'StakingContractService',
      configuration: {
        programId: this.programId.toString(),
        connection: this.connection.rpcEndpoint,
        commitment: this.connection.commitment
      },
      metrics: this.getMetrics(),
      lastOperations: devLogger.exportForAI(),
      timestamp: new Date().toISOString()
    };

    devLogger.command('exportDebugData', debugData, null);
    return debugData;
  }
}

// 🌍 Global instance
export const stakingService = new StakingContractService();

// 🤖 Export para debugging con IA
export const contractDebugAPI = {
  getService: () => stakingService,
  getMetrics: () => stakingService.getMetrics(),
  exportDebug: () => stakingService.exportDebugData(),
  healthCheck: () => stakingService.getContractHealth()
};

export default stakingService;
