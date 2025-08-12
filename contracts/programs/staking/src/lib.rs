use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer};

declare_id!("Cm5PWAvAHWL4yh8UWnLGs6UYus6ur4PigEUYS2GuXt5P");

pub mod instructions;
pub mod state;
pub mod errors;

use instructions::*;
use state::*;
use errors::*;

#[program]
pub mod staking {
    use super::*;

    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        reward_rate: u64,
        min_stake_duration: i64,
    ) -> Result<()> {
        instructions::initialize_pool::initialize_pool_handler(ctx, reward_rate, min_stake_duration)
    }

    pub fn stake_tokens(ctx: Context<StakeTokens>, amount: u64) -> Result<()> {
        instructions::stake_tokens::stake_tokens_handler(ctx, amount)
    }

    pub fn add_stake(ctx: Context<AddStake>, amount: u64) -> Result<()> {
        instructions::add_stake::add_stake_handler(ctx, amount)
    }

    pub fn unstake_tokens(ctx: Context<UnstakeTokens>) -> Result<()> {
        instructions::unstake_tokens::unstake_tokens_handler(ctx)
    }

    pub fn claim_rewards(
        ctx: Context<ClaimRewards>,
        reward_token_mint: Pubkey,
    ) -> Result<()> {
        instructions::claim_rewards::claim_rewards_handler(ctx, reward_token_mint)
    }

    pub fn fund_reward_pool(
        ctx: Context<FundRewardPool>,
        amount: u64,
    ) -> Result<()> {
        instructions::fund_reward_pool::fund_reward_pool_handler(ctx, amount)
    }
}