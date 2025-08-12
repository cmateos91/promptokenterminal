use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct UnstakeTokens<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        constraint = !staking_pool.is_paused @ StakingError::PoolPaused
    )]
    pub staking_pool: Account<'info, StakingPool>,
    
    #[account(
        mut,
        constraint = user_stake.user == user.key(),
        constraint = user_stake.pool == staking_pool.key(),
        constraint = user_stake.is_active @ StakingError::NoRewardsAvailable
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
}

pub fn unstake_tokens_handler(ctx: Context<UnstakeTokens>) -> Result<()> {
    let clock = Clock::get()?;
    let user_stake = &mut ctx.accounts.user_stake;
    let staking_pool = &mut ctx.accounts.staking_pool;
    
    // Check if minimum staking duration has passed
    require!(
        user_stake.can_unstake(clock.unix_timestamp, staking_pool.min_stake_duration),
        StakingError::StakingPeriodNotCompleted
    );
    
    let amount = user_stake.staked_amount;
    require!(amount > 0, StakingError::InsufficientStake);
    
    // Transfer tokens back to user
    let pool_key = staking_pool.key();
    let seeds = &[
        b"staking_pool",
        staking_pool.stake_mint.as_ref(),
        &[staking_pool.bump],
    ];
    let signer = &[&seeds[..]];
    
    let cpi_accounts = Transfer {
        from: ctx.accounts.stake_vault.to_account_info(),
        to: ctx.accounts.user_token_account.to_account_info(),
        authority: staking_pool.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    token::transfer(cpi_ctx, amount)?;
    
    // Update pool total
    staking_pool.total_staked = staking_pool.total_staked
        .checked_sub(amount)
        .ok_or(StakingError::MathematicalOverflow)?;
    
    staking_pool.last_update_slot = clock.slot;
    
    // Mark user stake as inactive
    user_stake.is_active = false;
    user_stake.staked_amount = 0;
    
    Ok(())
}