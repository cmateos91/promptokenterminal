use anchor_lang::prelude::*;

#[account]
pub struct StakingPool {
    pub authority: Pubkey,
    pub stake_mint: Pubkey,
    pub stake_vault: Pubkey,
    pub reward_rate: u64, // Reward per second per token staked (scaled by 1e6)
    pub total_staked: u64,
    pub min_stake_duration: i64, // Minimum time in seconds before unstaking
    pub bump: u8,
    pub is_paused: bool,
    pub last_update_slot: u64,
    pub base_token_mint: Pubkey, // Base token used for funding rewards (e.g., USDC)
    pub base_token_vault: Pubkey, // Vault holding base tokens for swaps
}

impl StakingPool {
    pub const LEN: usize = 
        32 + // authority
        32 + // stake_mint  
        32 + // stake_vault
        8 + // reward_rate
        8 + // total_staked
        8 + // min_stake_duration
        1 + // bump
        1 + // is_paused
        8 + // last_update_slot
        32 + // base_token_mint
        32; // base_token_vault

    pub fn calculate_base_token_rewards(&self, staked_amount: u64, duration: i64) -> Result<u64> {
        let rewards = (staked_amount as u128)
            .checked_mul(self.reward_rate as u128)
            .ok_or(crate::errors::StakingError::MathematicalOverflow)?
            .checked_mul(duration as u128)
            .ok_or(crate::errors::StakingError::MathematicalOverflow)?
            .checked_div(1_000_000) // Scale down by 1e6
            .ok_or(crate::errors::StakingError::MathematicalOverflow)?;

        Ok(rewards as u64)
    }
}