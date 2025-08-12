/**
 * 🚀 Initialize Real Staking Pool on Devnet
 * Creates a PROMPT staking pool with USDC as base reward token
 */

const anchor = require('@coral-xyz/anchor');
const { PublicKey, Keypair, SystemProgram } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const fs = require('fs');

// Configuration
const PROGRAM_ID = new PublicKey('Cm5PWAvAHWL4yh8UWnLGs6UYus6ur4PigEUYS2GuXt5P');
const PROMPT_MINT = new PublicKey('F1W4gQyFkhvLpMJQPWnk49THT7dza8HPepnff5AM6K6D');
const USDC_MINT = new PublicKey('2ejSzqgAJ139LMsikdqa2U2K2jutavdMwV1fcntyZ8qV');

// Pool configuration
const REWARD_RATE = 100; // 100 USDC per second per PROMPT staked (scaled by 1e6)
const MIN_STAKE_DURATION = 60; // 1 minute for testing

const IDL = {
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
    }
  ]
};

async function initializePool() {
  try {
    console.log('🚀 Initializing PROMPT Staking Pool on Devnet...\n');

    // Setup provider
    const connection = new anchor.web3.Connection('https://api.devnet.solana.com', 'confirmed');
    const wallet = anchor.Wallet.local();
    const provider = new anchor.AnchorProvider(connection, wallet, { commitment: 'confirmed' });
    anchor.setProvider(provider);

    // Create program instance
    const program = new anchor.Program(IDL, PROGRAM_ID, provider);

    console.log('📋 Configuration:');
    console.log(`   Program ID: ${PROGRAM_ID.toString()}`);
    console.log(`   PROMPT Mint: ${PROMPT_MINT.toString()}`);
    console.log(`   USDC Mint: ${USDC_MINT.toString()}`);
    console.log(`   Authority: ${wallet.publicKey.toString()}`);
    console.log(`   Reward Rate: ${REWARD_RATE} USDC per second per PROMPT`);
    console.log(`   Min Duration: ${MIN_STAKE_DURATION} seconds\n`);

    // Generate staking pool PDA
    const stakingPoolKeypair = Keypair.generate();
    const stakingPool = stakingPoolKeypair.publicKey;

    // Generate vault keypairs
    const stakeVaultKeypair = Keypair.generate();
    const baseTokenVaultKeypair = Keypair.generate();

    console.log('🏊 Pool Addresses:');
    console.log(`   Staking Pool: ${stakingPool.toString()}`);
    console.log(`   Stake Vault: ${stakeVaultKeypair.publicKey.toString()}`);
    console.log(`   Base Token Vault: ${baseTokenVaultKeypair.publicKey.toString()}\n`);

    // Initialize pool
    console.log('⚡ Initializing pool...');
    const tx = await program.methods
      .initializePool(
        new anchor.BN(REWARD_RATE),
        new anchor.BN(MIN_STAKE_DURATION)
      )
      .accounts({
        authority: wallet.publicKey,
        stakingPool: stakingPool,
        stakeMint: PROMPT_MINT,
        baseTokenMint: USDC_MINT,
        stakeVault: stakeVaultKeypair.publicKey,
        baseTokenVault: baseTokenVaultKeypair.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([stakingPoolKeypair, stakeVaultKeypair, baseTokenVaultKeypair])
      .rpc();

    console.log('✅ Pool initialized successfully!');
    console.log(`   Transaction: ${tx}\n`);

    // Save pool information
    const poolInfo = {
      stakingPool: stakingPool.toString(),
      stakeVault: stakeVaultKeypair.publicKey.toString(),
      baseTokenVault: baseTokenVaultKeypair.publicKey.toString(),
      promptMint: PROMPT_MINT.toString(),
      usdcMint: USDC_MINT.toString(),
      rewardRate: REWARD_RATE,
      minStakeDuration: MIN_STAKE_DURATION,
      transaction: tx,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync('pool-info.json', JSON.stringify(poolInfo, null, 2));
    console.log('📄 Pool info saved to pool-info.json');

    console.log('\n🎉 PROMPT Staking Pool is ready for testing!');
    console.log('\nNext steps:');
    console.log('1. Fund the base token vault with USDC for rewards');
    console.log('2. Test staking PROMPT tokens');
    console.log('3. Test claiming rewards in different tokens');

  } catch (error) {
    console.error('❌ Pool initialization failed:', error);
    
    if (error.logs) {
      console.error('Transaction logs:');
      error.logs.forEach(log => console.error(`   ${log}`));
    }
  }
}

// Run the initialization
initializePool();