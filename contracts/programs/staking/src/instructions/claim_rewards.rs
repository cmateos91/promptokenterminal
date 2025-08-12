use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
#[instruction(reward_token_mint: Pubkey)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub staking_pool: Account<'info, StakingPool>,
    
    #[account(
        mut,
        constraint = user_stake.user == user.key(),
        constraint = user_stake.pool == staking_pool.key(),
        constraint = user_stake.is_active @ StakingError::NoRewardsAvailable
    )]
    pub user_stake: Account<'info, UserStake>,
    
    // The desired reward token mint
    pub reward_token_mint: Account<'info, Mint>,
    
    #[account(
        mut,
        constraint = user_reward_account.owner == user.key(),
        constraint = user_reward_account.mint == reward_token_mint.key()
    )]
    pub user_reward_account: Account<'info, TokenAccount>,
    
    // Base token vault (what the pool pays rewards in)
    #[account(
        mut,
        constraint = base_token_vault.key() == staking_pool.base_token_vault,
        constraint = base_token_vault.mint == staking_pool.base_token_mint
    )]
    pub base_token_vault: Account<'info, TokenAccount>,
    
    // If user wants same token as base token, we skip the swap
    // If user wants different token, they need to provide swap accounts
    #[account(
        mut,
        constraint = user_base_token_account.owner == user.key(),
        constraint = user_base_token_account.mint == staking_pool.base_token_mint
    )]
    pub user_base_token_account: Option<Account<'info, TokenAccount>>,
    
    pub token_program: Program<'info, Token>,
    
    // Note: For production, you'd integrate with Jupiter or another DEX
    // For now, this is a simple direct transfer system
}

pub fn claim_rewards_handler(ctx: Context<ClaimRewards>, reward_token_mint: Pubkey) -> Result<()> {
    let clock = Clock::get()?;
    let user_stake = &mut ctx.accounts.user_stake;
    let staking_pool = &ctx.accounts.staking_pool;
    
    // Calculate time since last claim
    let time_elapsed = user_stake.time_since_last_claim(clock.unix_timestamp);
    require!(time_elapsed > 0, StakingError::NoRewardsAvailable);
    
    // Calculate reward amount in base tokens
    let reward_amount = staking_pool.calculate_base_token_rewards(
        user_stake.staked_amount, 
        time_elapsed
    )?;
    require!(reward_amount > 0, StakingError::NoRewardsAvailable);
    
    // Check if reward vault has enough base tokens
    require!(
        ctx.accounts.base_token_vault.amount >= reward_amount,
        StakingError::InsufficientRewardsInPool
    );
    
    // Case 1: User wants base token (direct transfer)
    if reward_token_mint == staking_pool.base_token_mint {
        let pool_key = staking_pool.key();
        let seeds = &[
            b"staking_pool",
            staking_pool.stake_mint.as_ref(),
            &[staking_pool.bump],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.base_token_vault.to_account_info(),
            to: ctx.accounts.user_reward_account.to_account_info(),
            authority: staking_pool.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, reward_amount)?;
    } else {
        // Case 2: User wants different token
        // First transfer base tokens to user's base token account
        if let Some(user_base_token_account) = &ctx.accounts.user_base_token_account {
            let pool_key = staking_pool.key();
            let seeds = &[
                b"staking_pool",
                staking_pool.stake_mint.as_ref(),
                &[staking_pool.bump],
            ];
            let signer = &[&seeds[..]];
            
            let cpi_accounts = Transfer {
                from: ctx.accounts.base_token_vault.to_account_info(),
                to: user_base_token_account.to_account_info(),
                authority: staking_pool.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
            token::transfer(cpi_ctx, reward_amount)?;
            
            // Note: In production, here you would integrate with Jupiter or another DEX
            // to swap the base tokens for the desired reward token
            // For now, we just give them the base tokens and they can swap externally
        } else {
            return Err(StakingError::RewardTokenNotSupported.into());
        }
    }
    
    // Update user stake
    user_stake.last_claim_timestamp = clock.unix_timestamp;
    user_stake.total_claimed_rewards = user_stake.total_claimed_rewards
        .checked_add(reward_amount)
        .ok_or(StakingError::MathematicalOverflow)?;
    
    Ok(())
}