use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct FundRewardPool<'info> {
    #[account(mut)]
    pub funder: Signer<'info>,
    
    #[account(mut)]
    pub staking_pool: Account<'info, StakingPool>,
    
    #[account(
        mut,
        constraint = funder_token_account.owner == funder.key(),
        constraint = funder_token_account.mint == staking_pool.base_token_mint
    )]
    pub funder_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        constraint = base_token_vault.key() == staking_pool.base_token_vault
    )]
    pub base_token_vault: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

pub fn fund_reward_pool_handler(ctx: Context<FundRewardPool>, amount: u64) -> Result<()> {
    require!(amount > 0, StakingError::InsufficientStake);
    
    // Transfer base tokens to the reward vault
    let cpi_accounts = Transfer {
        from: ctx.accounts.funder_token_account.to_account_info(),
        to: ctx.accounts.base_token_vault.to_account_info(),
        authority: ctx.accounts.funder.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, amount)?;
    
    Ok(())
}