use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Mint};
use crate::state::*;

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + StakingPool::LEN
    )]
    pub staking_pool: Account<'info, StakingPool>,
    
    pub stake_mint: Account<'info, Mint>,
    pub base_token_mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = authority,
        token::mint = stake_mint,
        token::authority = authority
    )]
    pub stake_vault: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = authority,
        token::mint = base_token_mint,
        token::authority = authority
    )]
    pub base_token_vault: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn initialize_pool_handler(
    ctx: Context<InitializePool>,
    reward_rate: u64,
    min_stake_duration: i64,
) -> Result<()> {
    let pool = &mut ctx.accounts.staking_pool;
    
    pool.authority = ctx.accounts.authority.key();
    pool.stake_mint = ctx.accounts.stake_mint.key();
    pool.stake_vault = ctx.accounts.stake_vault.key();
    pool.reward_rate = reward_rate;
    pool.total_staked = 0;
    pool.min_stake_duration = min_stake_duration;
    pool.bump = 0; // No bump needed for simplified approach
    pool.is_paused = false;
    pool.last_update_slot = Clock::get()?.slot;
    pool.base_token_mint = ctx.accounts.base_token_mint.key();
    pool.base_token_vault = ctx.accounts.base_token_vault.key();
    
    Ok(())
}