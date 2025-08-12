use anchor_lang::prelude::*;

#[account]
pub struct UserStake {
    pub user: Pubkey,
    pub pool: Pubkey,
    pub staked_amount: u64,
    pub stake_timestamp: i64,
    pub last_claim_timestamp: i64,
    pub total_claimed_rewards: u64,
    pub is_active: bool,
    pub bump: u8,
}

impl UserStake {
    pub const LEN: usize = 
        32 + // user
        32 + // pool
        8 + // staked_amount
        8 + // stake_timestamp
        8 + // last_claim_timestamp
        8 + // total_claimed_rewards
        1 + // is_active
        1; // bump

    pub fn time_staked(&self, current_timestamp: i64) -> i64 {
        current_timestamp - self.stake_timestamp
    }

    pub fn time_since_last_claim(&self, current_timestamp: i64) -> i64 {
        current_timestamp - self.last_claim_timestamp
    }

    pub fn can_unstake(&self, current_timestamp: i64, min_duration: i64) -> bool {
        self.time_staked(current_timestamp) >= min_duration
    }
}