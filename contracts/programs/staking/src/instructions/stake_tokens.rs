use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct StakeTokens<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        constraint = !staking_pool.is_paused @ StakingError::PoolPaused
    )]
    pub staking_pool: Account<'info, StakingPool>,
    
    #[account(
        init,
        payer = user,
        space = 8 + UserStake::LEN,
        seeds = [b"user_stake", user.key().as_ref(), staking_pool.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(
        mut,
        constraint = user_token_account.owner == user.key(),
        constraint = user_token_account.mint == staking_pool.stake_mint
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        constraint = stake_vault.key() == staking_pool.stake_vault
    )]
    pub stake_vault: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn stake_tokens_handler(ctx: Context<StakeTokens>, amount: u64) -> Result<()> {
    require!(amount > 0, StakingError::InsufficientStake);
    
    let clock = Clock::get()?;
    let user_stake = &mut ctx.accounts.user_stake;
    let staking_pool = &mut ctx.accounts.staking_pool;
    
    // Transfer tokens to vault
    let cpi_accounts = Transfer {
        from: ctx.accounts.user_token_account.to_account_info(),
        to: ctx.accounts.stake_vault.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, amount)?;
    
    // Initialize user stake
    user_stake.user = ctx.accounts.user.key();
    user_stake.pool = staking_pool.key();
    user_stake.staked_amount = amount;
    user_stake.stake_timestamp = clock.unix_timestamp;
    user_stake.last_claim_timestamp = clock.unix_timestamp;
    user_stake.total_claimed_rewards = 0;
    user_stake.is_active = true;
    user_stake.bump = ctx.bumps.user_stake;
    
    // Update pool total
    staking_pool.total_staked = staking_pool.total_staked
        .checked_add(amount)
        .ok_or(StakingError::MathematicalOverflow)?;
    
    staking_pool.last_update_slot = clock.slot;
    
    Ok(())
}