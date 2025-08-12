use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct AddStake<'info> {
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

pub fn add_stake_handler(ctx: Context<AddStake>, amount: u64) -> Result<()> {
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
    
    // Add to existing stake
    user_stake.staked_amount = user_stake.staked_amount
        .checked_add(amount)
        .ok_or(StakingError::MathematicalOverflow)?;
    
    // Update pool total
    staking_pool.total_staked = staking_pool.total_staked
        .checked_add(amount)
        .ok_or(StakingError::MathematicalOverflow)?;
    
    staking_pool.last_update_slot = clock.slot;
    
    Ok(())
}