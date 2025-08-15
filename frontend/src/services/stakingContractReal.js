/**
 * 🚀 Real Staking Contract Integration
 * Integrated with deployed Anchor program
 */

import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import * as anchor from '@coral-xyz/anchor';
import { devLogger } from '../utils/logger';
import { RPC_URL } from '../utils/config';

// 🎯 Deployed Program Configuration
export const STAKING_PROGRAM_ID = new PublicKey('Cm5PWAvAHWL4yh8UWnLGs6UYus6ur4PigEUYS2GuXt5P');

// 📋 Simplified Program IDL (Interface Definition)  
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
    if (!wallet) {throw new Error('Wallet required');}
    if (!wallet.publicKey) {throw new Error('Wallet not connected properly');}
    
    // Debug wallet object
    console.log('Wallet object:', {
      hasPublicKey: !!wallet.publicKey,
      publicKeyType: typeof wallet.publicKey,
      publicKeyToString: wallet.publicKey?.toString(),
      hasSignTransaction: !!wallet.signTransaction,
      hasSignAllTransactions: !!wallet.signAllTransactions,
      walletKeys: Object.keys(wallet)
    });
    
    // Create a more robust wallet adapter for Anchor
    const walletAdapter = {
      get publicKey() {
        return wallet.publicKey;
      },
      signTransaction: async (transaction) => {
        if (!wallet.signTransaction) {
          throw new Error('Wallet does not support transaction signing');
        }
        return await wallet.signTransaction(transaction);
      },
      signAllTransactions: async (transactions) => {
        if (!wallet.signAllTransactions) {
          throw new Error('Wallet does not support multiple transaction signing');
        }
        return await wallet.signAllTransactions(transactions);
      },
    };
    
    // Validate wallet adapter
    if (!walletAdapter.publicKey) {
      throw new Error('Wallet adapter publicKey is null or undefined');
    }
    
    const provider = new anchor.AnchorProvider(
      this.connection,
      walletAdapter,
      { 
        commitment: 'confirmed',
        preflightCommitment: 'confirmed',
        skipPreflight: false
      }
    );
    
    // Debug program creation
    console.log('Creating Anchor Program with:', {
      idlName: STAKING_IDL.name,
      idlVersion: STAKING_IDL.version,
      programId: this.programId.toString(),
      programIdType: typeof this.programId,
      hasProvider: !!provider,
      providerWallet: provider.wallet?.publicKey?.toString()
    });
    
    // First, verify the program exists and is executable
    try {
      const programAccount = await this.connection.getAccountInfo(this.programId);
      console.log('Program account info:', {
        exists: !!programAccount,
        executable: programAccount?.executable,
        dataLength: programAccount?.data?.length,
        owner: programAccount?.owner?.toString()
      });
      
      if (!programAccount) {
        throw new Error('Program not found on blockchain - not deployed');
      }
      
      if (!programAccount.executable) {
        throw new Error('Program exists but is not executable');
      }
      
    } catch (accountError) {
      console.error('Program account verification failed:', accountError);
      throw new Error(`Program verification failed: ${accountError.message}`);
    }

    // Try to create the program with a minimal approach
    try {
      // Create program without IDL first to test basic connectivity
      this.program = new anchor.Program(STAKING_IDL, this.programId, provider);
      console.log('Program created successfully');
      devLogger.command('initializeProgram', 'Anchor program initialized', null);
    } catch (programError) {
      console.error('Failed to create Anchor Program:', programError);
      
      // If IDL fails, let's try to fetch IDL from the program
      try {
        console.log('Attempting to fetch IDL from program...');
        const fetchedIdl = await anchor.Program.fetchIdl(this.programId, provider);
        console.log('Fetched IDL:', fetchedIdl ? 'Found' : 'Not found');
        
        if (fetchedIdl) {
          this.program = new anchor.Program(fetchedIdl, this.programId, provider);
          console.log('Program created with fetched IDL');
        } else {
          throw new Error('No IDL found on program account');
        }
      } catch (fetchError) {
        console.error('IDL fetch failed:', fetchError);
        throw new Error(`Program creation failed: ${programError.message}`);
      }
    }
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
   * 🏊 Initialize a new staking pool
   */
  async initializePool(stakeMint, baseTokenMint, rewardRate, minStakeDuration, userWallet) {
    try {
      if (!this.program) {await this.initializeProgram(userWallet);}
      
      const stakingPool = this.getStakingPoolAddress(stakeMint);
      
      // Derive vault addresses
      const [stakeVault] = PublicKey.findProgramAddressSync(
        [Buffer.from('stake_vault'), stakingPool.toBuffer()],
        this.programId
      );
      
      const [baseTokenVault] = PublicKey.findProgramAddressSync(
        [Buffer.from('base_token_vault'), stakingPool.toBuffer()],
        this.programId
      );

      const tx = await this.program.methods
        .initializePool(
          new anchor.BN(rewardRate),
          new anchor.BN(minStakeDuration)
        )
        .accounts({
          authority: userWallet.publicKey,
          stakingPool,
          stakeMint,
          baseTokenMint,
          stakeVault,
          baseTokenVault,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      devLogger.command('initializePool', { signature: tx, poolAddress: stakingPool.toString() }, null);
      return tx;

    } catch (error) {
      devLogger.error('initializePool', error);
      throw error;
    }
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
      if (!this.program) {await this.initializeProgram(userWallet);}
      
      const stakingPool = this.getStakingPoolAddress(stakeMint);
      const userStake = this.getUserStakeAddress(userWallet.publicKey, stakingPool);
      const userTokenAccount = await getAssociatedTokenAddress(stakeMint, userWallet.publicKey);
      
      // Get pool account to get vault address
      const poolAccount = await this.program.account.stakingPool.fetch(stakingPool);
      const stakeVault = poolAccount.stakeVault;

      // Ensure amount is properly converted to BN
      const amountBN = new anchor.BN(amount.toString());
      
      const tx = await this.program.methods
        .stakeTokens(amountBN)
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
      if (!this.program) {await this.initializeProgram(userWallet);}
      
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
      if (!this.program) {await this.initializeProgram(userWallet);}
      
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
      if (!this.program) {await this.initializeProgram(userWallet);}
      
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