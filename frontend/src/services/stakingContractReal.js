/**
 * 🚀 Real Staking Contract Integration
 * Integrated with deployed Anchor program
 */

import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  getAssociatedTokenAddress, 
  createAssociatedTokenAccountInstruction,
  getMint,
  getAccount
} from '@solana/spl-token';
import * as anchor from '@coral-xyz/anchor';
import { devLogger } from '../utils/logger';
import { RPC_URL } from '../utils/config';

// 🎯 Deployed Program Configuration
export const STAKING_PROGRAM_ID = new PublicKey('Cm5PWAvAHWL4yh8UWnLGs6UYus6ur4PigEUYS2GuXt5P');

// 📋 Program IDL (Interface Definition)
const STAKING_IDL = {
  version: "0.1.0",
  name: "staking",
  instructions: [
    {
      name: "initializePool",
      accounts: [
        { name: "authority", isMut: true, isSigner: true },
        { name: "stakingPool", isMut: true, isSigner: false },
        { name: "stakeMint", isMut: false, isSigner: false },
        { name: "baseTokenMint", isMut: false, isSigner: false },
        { name: "stakeVault", isMut: true, isSigner: false },
        { name: "baseTokenVault", isMut: true, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
        { name: "rent", isMut: false, isSigner: false }
      ],
      args: [
        { name: "rewardRate", type: "u64" },
        { name: "minStakeDuration", type: "i64" }
      ]
    },
    {
      name: "stakeTokens",
      accounts: [
        { name: "user", isMut: true, isSigner: true },
        { name: "stakingPool", isMut: true, isSigner: false },
        { name: "userStake", isMut: true, isSigner: false },
        { name: "userTokenAccount", isMut: true, isSigner: false },
        { name: "stakeVault", isMut: true, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
        { name: "rent", isMut: false, isSigner: false }
      ],
      args: [
        { name: "amount", type: "u64" }
      ]
    },
    {
      name: "unstakeTokens",
      accounts: [
        { name: "user", isMut: true, isSigner: true },
        { name: "stakingPool", isMut: true, isSigner: false },
        { name: "userStake", isMut: true, isSigner: false },
        { name: "userTokenAccount", isMut: true, isSigner: false },
        { name: "stakeVault", isMut: true, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false }
      ],
      args: []
    },
    {
      name: "claimRewards",
      accounts: [
        { name: "user", isMut: true, isSigner: true },
        { name: "stakingPool", isMut: true, isSigner: false },
        { name: "userStake", isMut: true, isSigner: false },
        { name: "rewardTokenMint", isMut: false, isSigner: false },
        { name: "userRewardAccount", isMut: true, isSigner: false },
        { name: "baseTokenVault", isMut: true, isSigner: false },
        { name: "userBaseTokenAccount", isMut: true, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false }
      ],
      args: [
        { name: "rewardTokenMint", type: "publicKey" }
      ]
    },
    {
      name: "fundRewardPool",
      accounts: [
        { name: "funder", isMut: true, isSigner: true },
        { name: "stakingPool", isMut: true, isSigner: false },
        { name: "funderTokenAccount", isMut: true, isSigner: false },
        { name: "baseTokenVault", isMut: true, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false }
      ],
      args: [
        { name: "amount", type: "u64" }
      ]
    }
  ],
  accounts: [
    {
      name: "StakingPool",
      type: {
        kind: "struct",
        fields: [
          { name: "authority", type: "publicKey" },
          { name: "stakeMint", type: "publicKey" },
          { name: "stakeVault", type: "publicKey" },
          { name: "rewardRate", type: "u64" },
          { name: "totalStaked", type: "u64" },
          { name: "minStakeDuration", type: "i64" },
          { name: "bump", type: "u8" },
          { name: "isPaused", type: "bool" },
          { name: "lastUpdateSlot", type: "u64" },
          { name: "baseTokenMint", type: "publicKey" },
          { name: "baseTokenVault", type: "publicKey" }
        ]
      }
    },
    {
      name: "UserStake",
      type: {
        kind: "struct",
        fields: [
          { name: "user", type: "publicKey" },
          { name: "pool", type: "publicKey" },
          { name: "stakedAmount", type: "u64" },
          { name: "stakeTimestamp", type: "i64" },
          { name: "lastClaimTimestamp", type: "i64" },
          { name: "totalClaimedRewards", type: "u64" },
          { name: "isActive", type: "bool" },
          { name: "bump", type: "u8" }
        ]
      }
    }
  ]
};

/**
 * 🔧 Real Staking Contract Service
 */
export class RealStakingContractService {
  constructor() {
    this.connection = new Connection(RPC_URL, 'confirmed');
    this.programId = STAKING_PROGRAM_ID;
    this.program = null;
    
    devLogger.network('Real contract service initialized', RPC_URL, null);
  }

  /**
   * Initialize Anchor program with wallet
   */
  async initializeProgram(wallet) {
    if (!wallet) throw new Error('Wallet required');
    
    const provider = new anchor.AnchorProvider(
      this.connection,
      wallet,
      { commitment: 'confirmed' }
    );
    
    this.program = new anchor.Program(STAKING_IDL, this.programId, provider);
    devLogger.command('initializeProgram', 'Anchor program initialized', null);
  }

  /**
   * 🏗️ Get or derive staking pool address
   */
  getStakingPoolAddress(stakeMint) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('staking_pool'), stakeMint.toBuffer()],
      this.programId
    )[0];
  }

  /**
   * Get user stake account address
   */
  getUserStakeAddress(user, stakingPool) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('user_stake'), user.toBuffer(), stakingPool.toBuffer()],
      this.programId
    )[0];
  }

  /**
   * 🏪 Get staking pools
   */
  async getStakingPools() {
    try {
      devLogger.command('getStakingPools', 'Fetching real pools', null);
      
      // For now, return empty array since we don't have pools set up yet
      // In a real scenario, we'd query the blockchain for pool accounts
      const pools = [];
      
      devLogger.command('getStakingPools', `Found ${pools.length} pools`, null);
      return pools;

    } catch (error) {
      devLogger.error('getStakingPools', error);
      return []; // Return empty array on error
    }
  }

  /**
   * 💰 Stake tokens
   */
  async stakeTokens(amount, stakeMint, userWallet) {
    try {
      if (!this.program) await this.initializeProgram(userWallet);
      
      const stakingPool = this.getStakingPoolAddress(stakeMint);
      const userStake = this.getUserStakeAddress(userWallet.publicKey, stakingPool);
      const userTokenAccount = await getAssociatedTokenAddress(stakeMint, userWallet.publicKey);
      
      // Get pool account to get vault address
      const poolAccount = await this.program.account.stakingPool.fetch(stakingPool);
      const stakeVault = poolAccount.stakeVault;

      const tx = await this.program.methods
        .stakeTokens(new anchor.BN(amount))
        .accounts({
          user: userWallet.publicKey,
          stakingPool,
          userStake,
          userTokenAccount,
          stakeVault,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      devLogger.command('stakeTokens', { signature: tx, amount }, null);
      return { signature: tx, amount };

    } catch (error) {
      devLogger.error('stakeTokens', error);
      throw error;
    }
  }

  /**
   * 🔓 Unstake tokens
   */
  async unstakeTokens(stakeMint, userWallet) {
    try {
      if (!this.program) await this.initializeProgram(userWallet);
      
      const stakingPool = this.getStakingPoolAddress(stakeMint);
      const userStake = this.getUserStakeAddress(userWallet.publicKey, stakingPool);
      const userTokenAccount = await getAssociatedTokenAddress(stakeMint, userWallet.publicKey);
      
      // Get pool account to get vault address
      const poolAccount = await this.program.account.stakingPool.fetch(stakingPool);
      const stakeVault = poolAccount.stakeVault;

      const tx = await this.program.methods
        .unstakeTokens()
        .accounts({
          user: userWallet.publicKey,
          stakingPool,
          userStake,
          userTokenAccount,
          stakeVault,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      devLogger.command('unstakeTokens', { signature: tx }, null);
      return { signature: tx };

    } catch (error) {
      devLogger.error('unstakeTokens', error);
      throw error;
    }
  }

  /**
   * 🎁 Claim rewards
   */
  async claimRewards(stakeMint, rewardTokenMint, userWallet) {
    try {
      if (!this.program) await this.initializeProgram(userWallet);
      
      const stakingPool = this.getStakingPoolAddress(stakeMint);
      const userStake = this.getUserStakeAddress(userWallet.publicKey, stakingPool);
      const userRewardAccount = await getAssociatedTokenAddress(rewardTokenMint, userWallet.publicKey);
      
      // Get pool account
      const poolAccount = await this.program.account.stakingPool.fetch(stakingPool);
      const baseTokenVault = poolAccount.baseTokenVault;
      const baseTokenMint = poolAccount.baseTokenMint;
      
      // Get user base token account if different from reward token
      let userBaseTokenAccount = null;
      if (!rewardTokenMint.equals(baseTokenMint)) {
        userBaseTokenAccount = await getAssociatedTokenAddress(baseTokenMint, userWallet.publicKey);
      }

      const tx = await this.program.methods
        .claimRewards(rewardTokenMint)
        .accounts({
          user: userWallet.publicKey,
          stakingPool,
          userStake,
          rewardTokenMint,
          userRewardAccount,
          baseTokenVault,
          userBaseTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      devLogger.command('claimRewards', { signature: tx }, null);
      return { signature: tx };

    } catch (error) {
      devLogger.error('claimRewards', error);
      throw error;
    }
  }

  /**
   * 📊 Get user stake info
   */
  async getUserStakeInfo(stakeMint, userWallet) {
    try {
      if (!this.program) await this.initializeProgram(userWallet);
      
      const stakingPool = this.getStakingPoolAddress(stakeMint);
      const userStake = this.getUserStakeAddress(userWallet.publicKey, stakingPool);
      
      try {
        const userStakeAccount = await this.program.account.userStake.fetch(userStake);
        const poolAccount = await this.program.account.stakingPool.fetch(stakingPool);
        
        // Calculate pending rewards
        const currentTime = Math.floor(Date.now() / 1000);
        const timeSinceLastClaim = currentTime - userStakeAccount.lastClaimTimestamp.toNumber();
        const rewardRate = poolAccount.rewardRate.toNumber();
        const stakedAmount = userStakeAccount.stakedAmount.toNumber();
        
        const pendingRewards = Math.floor(
          (stakedAmount * rewardRate * timeSinceLastClaim) / 1_000_000
        );
        
        return {
          stakedAmount: userStakeAccount.stakedAmount.toString(),
          stakeTimestamp: userStakeAccount.stakeTimestamp.toNumber(),
          lastClaimTimestamp: userStakeAccount.lastClaimTimestamp.toNumber(),
          totalClaimedRewards: userStakeAccount.totalClaimedRewards.toString(),
          pendingRewards,
          isActive: userStakeAccount.isActive,
          canUnstake: currentTime >= (userStakeAccount.stakeTimestamp.toNumber() + poolAccount.minStakeDuration.toNumber())
        };
        
      } catch (error) {
        if (error.message.includes('Account does not exist')) {
          return {
            stakedAmount: '0',
            stakeTimestamp: 0,
            lastClaimTimestamp: 0,
            totalClaimedRewards: '0',
            pendingRewards: 0,
            isActive: false,
            canUnstake: false
          };
        }
        throw error;
      }

    } catch (error) {
      devLogger.error('getUserStakeInfo', error);
      throw error;
    }
  }

  /**
   * 🔍 Get contract health
   */
  async getContractHealth() {
    try {
      const programAccount = await this.connection.getAccountInfo(this.programId);
      
      return {
        programDeployed: !!programAccount,
        programId: this.programId.toString(),
        executable: programAccount?.executable || false,
        dataLength: programAccount?.data?.length || 0,
        owner: programAccount?.owner?.toString() || null,
        connection: {
          endpoint: this.connection.rpcEndpoint,
          commitment: this.connection.commitment
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      devLogger.error('getContractHealth', error);
      throw error;
    }
  }
}

// 🌍 Global instance
export const realStakingService = new RealStakingContractService();

export default realStakingService;