import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Staking } from "../target/types/staking";
import { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createMint,
  createAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

describe("staking", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Staking as Program<Staking>;
  const authority = (provider.wallet as anchor.Wallet).payer;
  
  let stakeMint: PublicKey;
  let baseTokenMint: PublicKey;
  let stakeTokenAccount: PublicKey;
  let baseTokenAccount: PublicKey;
  let stakingPool: PublicKey;
  let stakeVault: PublicKey;
  let baseTokenVault: PublicKey;
  let userStake: PublicKey;

  const user = Keypair.generate();

  before(async () => {
    // Airdrop SOL to user
    const signature = await provider.connection.requestAirdrop(
      user.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);

    // Create stake token mint
    stakeMint = await createMint(
      provider.connection,
      authority,
      authority.publicKey,
      null,
      6 // decimals
    );

    // Create base token mint (for rewards)
    baseTokenMint = await createMint(
      provider.connection,
      authority,
      authority.publicKey,
      null,
      6 // decimals
    );

    // Create token accounts
    stakeTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      user,
      stakeMint,
      user.publicKey
    );

    baseTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      user,
      baseTokenMint,
      user.publicKey
    );

    // Mint tokens to user
    await mintTo(
      provider.connection,
      authority,
      stakeMint,
      stakeTokenAccount,
      authority,
      1000 * 10**6 // 1000 tokens
    );

    // Mint base tokens to authority for funding rewards
    const authorityBaseTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      authority,
      baseTokenMint,
      authority.publicKey
    );

    await mintTo(
      provider.connection,
      authority,
      baseTokenMint,
      authorityBaseTokenAccount,
      authority,
      10000 * 10**6 // 10000 tokens
    );

    // Derive PDAs
    [stakingPool] = PublicKey.findProgramAddressSync(
      [Buffer.from("staking_pool"), stakeMint.toBuffer()],
      program.programId
    );

    [stakeVault] = PublicKey.findProgramAddressSync(
      [Buffer.from("stake_vault"), stakingPool.toBuffer()],
      program.programId
    );

    [baseTokenVault] = PublicKey.findProgramAddressSync(
      [Buffer.from("base_token_vault"), stakingPool.toBuffer()],
      program.programId
    );

    [userStake] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("user_stake"), 
        user.publicKey.toBuffer(), 
        stakingPool.toBuffer()
      ],
      program.programId
    );
  });

  it("Initialize staking pool", async () => {
    const tx = await program.methods
      .initializePool(
        new anchor.BN(100), // reward rate: 100 per second per token (scaled by 1e6)
        new anchor.BN(60) // min stake duration: 60 seconds
      )
      .accounts({
        authority: authority.publicKey,
        stakingPool,
        stakeMint,
        baseTokenMint,
        stakeVault,
        baseTokenVault,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([authority])
      .rpc();

    console.log("Initialize pool tx:", tx);

    // Verify pool was created correctly
    const poolAccount = await program.account.stakingPool.fetch(stakingPool);
    expect(poolAccount.authority.toString()).to.equal(authority.publicKey.toString());
    expect(poolAccount.stakeMint.toString()).to.equal(stakeMint.toString());
    expect(poolAccount.baseTokenMint.toString()).to.equal(baseTokenMint.toString());
    expect(poolAccount.rewardRate.toNumber()).to.equal(100);
    expect(poolAccount.totalStaked.toNumber()).to.equal(0);
  });

  it("Fund reward pool", async () => {
    const authorityBaseTokenAccount = getAssociatedTokenAddressSync(
      baseTokenMint,
      authority.publicKey
    );

    const fundAmount = new anchor.BN(1000 * 10**6); // 1000 base tokens

    const tx = await program.methods
      .fundRewardPool(fundAmount)
      .accounts({
        funder: authority.publicKey,
        stakingPool,
        funderTokenAccount: authorityBaseTokenAccount,
        baseTokenVault,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([authority])
      .rpc();

    console.log("Fund pool tx:", tx);

    // Verify vault has funds
    const vaultAccount = await provider.connection.getTokenAccountBalance(baseTokenVault);
    expect(vaultAccount.value.uiAmount).to.equal(1000);
  });

  it("Stake tokens", async () => {
    const stakeAmount = new anchor.BN(100 * 10**6); // 100 tokens

    const tx = await program.methods
      .stakeTokens(stakeAmount)
      .accounts({
        user: user.publicKey,
        stakingPool,
        userStake,
        userTokenAccount: stakeTokenAccount,
        stakeVault,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([user])
      .rpc();

    console.log("Stake tokens tx:", tx);

    // Verify user stake was created
    const userStakeAccount = await program.account.userStake.fetch(userStake);
    expect(userStakeAccount.user.toString()).to.equal(user.publicKey.toString());
    expect(userStakeAccount.stakedAmount.toNumber()).to.equal(100 * 10**6);
    expect(userStakeAccount.isActive).to.be.true;

    // Verify pool total updated
    const poolAccount = await program.account.stakingPool.fetch(stakingPool);
    expect(poolAccount.totalStaked.toNumber()).to.equal(100 * 10**6);
  });

  it("Claim rewards in base token", async () => {
    // Wait a bit to accumulate rewards
    await new Promise(resolve => setTimeout(resolve, 2000));

    const tx = await program.methods
      .claimRewards(baseTokenMint)
      .accounts({
        user: user.publicKey,
        stakingPool,
        userStake,
        rewardTokenMint: baseTokenMint,
        userRewardAccount: baseTokenAccount,
        baseTokenVault,
        userBaseTokenAccount: null, // Not needed for base token
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    console.log("Claim rewards tx:", tx);

    // Verify user received rewards
    const userTokenBalance = await provider.connection.getTokenAccountBalance(baseTokenAccount);
    expect(userTokenBalance.value.uiAmount).to.be.greaterThan(0);

    // Verify user stake timestamp was updated
    const userStakeAccount = await program.account.userStake.fetch(userStake);
    expect(userStakeAccount.totalClaimedRewards.toNumber()).to.be.greaterThan(0);
  });

  it("Unstake tokens after timelock", async () => {
    // Wait for timelock period (60 seconds)
    console.log("Waiting for timelock period...");
    await new Promise(resolve => setTimeout(resolve, 61000));

    const tx = await program.methods
      .unstakeTokens()
      .accounts({
        user: user.publicKey,
        stakingPool,
        userStake,
        userTokenAccount: stakeTokenAccount,
        stakeVault,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    console.log("Unstake tokens tx:", tx);

    // Verify user got their tokens back
    const userTokenBalance = await provider.connection.getTokenAccountBalance(stakeTokenAccount);
    expect(userTokenBalance.value.uiAmount).to.equal(1000); // Original amount

    // Verify user stake is inactive
    const userStakeAccount = await program.account.userStake.fetch(userStake);
    expect(userStakeAccount.isActive).to.be.false;
    expect(userStakeAccount.stakedAmount.toNumber()).to.equal(0);

    // Verify pool total updated
    const poolAccount = await program.account.stakingPool.fetch(stakingPool);
    expect(poolAccount.totalStaked.toNumber()).to.equal(0);
  });
});