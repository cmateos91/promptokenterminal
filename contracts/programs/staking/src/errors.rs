use anchor_lang::prelude::*;

#[error_code]
pub enum StakingError {
    #[msg("Insufficient stake amount")]
    InsufficientStake,
    
    #[msg("Staking period not completed")]
    StakingPeriodNotCompleted,
    
    #[msg("No rewards available")]
    NoRewardsAvailable,
    
    #[msg("Reward token not supported")]
    RewardTokenNotSupported,
    
    #[msg("Invalid exchange rate")]
    InvalidExchangeRate,
    
    #[msg("Pool is paused")]
    PoolPaused,
    
    #[msg("Unauthorized")]
    Unauthorized,
    
    #[msg("Mathematical overflow")]
    MathematicalOverflow,
    
    #[msg("Invalid timelock duration")]
    InvalidTimelockDuration,
    
    #[msg("Insufficient rewards in pool")]
    InsufficientRewardsInPool,
}