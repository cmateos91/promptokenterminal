/**
 * Application configuration for token gating and network selection.
 * Edit TOKEN_MINT and MIN_TOKEN_BALANCE to change the required token and amount.
 */
import { PublicKey } from '@solana/web3.js';

// SPL token mint required to access gated commands (devnet test token)
export const TOKEN_MINT = new PublicKey('5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF');

// Minimum token balance (whole tokens) required in the user's wallet
export const MIN_TOKEN_BALANCE = 5000n;

// Use Solana devnet by default
export const USE_DEVNET = true;
