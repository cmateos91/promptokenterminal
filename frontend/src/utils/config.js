/**
 * Application configuration for token gating and network selection.
 * Uses environment variables for flexible configuration.
 */
import { PublicKey } from '@solana/web3.js';

// SPL token mint required to access gated commands
export const TOKEN_MINT = new PublicKey(
  import.meta.env.VITE_PROMPT_TOKEN_MINT || '5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF'
);

// Minimum token balance (whole tokens) required in the user's wallet
export const MIN_TOKEN_BALANCE = BigInt(
  import.meta.env.VITE_MINIMUM_TOKEN_BALANCE || 1000
);

// Network configuration
export const USE_DEVNET = import.meta.env.VITE_ENVIRONMENT === 'devnet';

// RPC URL
export const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://api.devnet.solana.com';

// Staking Program ID
export const STAKING_PROGRAM_ID = new PublicKey(
  import.meta.env.VITE_STAKING_PROGRAM_ID || 'Cm5PWAvAHWL4yh8UWnLGs6UYus6ur4PigEUYS2GuXt5P'
);

// USDC Mint for base token rewards
export const USDC_MINT = new PublicKey(
  import.meta.env.VITE_USDC_MINT || '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
);
