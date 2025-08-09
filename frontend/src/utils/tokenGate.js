import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { retryWithFallback } from './solana';
import { mockWalletState } from './userState';
import { TOKEN_MINT, MIN_TOKEN_BALANCE } from './config';

/**
 * Checks whether the connected wallet holds at least MIN_TOKEN_BALANCE
 * of the required SPL token.
 */
export async function hasRequiredBalance() {
  if (!mockWalletState.connected || !mockWalletState.address) {
    return false;
  }

  try {
    const owner = new PublicKey(mockWalletState.address);
    const ata = await getAssociatedTokenAddress(TOKEN_MINT, owner);

    return await retryWithFallback(async (conn) => {
      const balance = await conn.getTokenAccountBalance(ata);
      const amount = BigInt(balance.value.amount);
      const decimals = balance.value.decimals;
      const minAmount = MIN_TOKEN_BALANCE * 10n ** BigInt(decimals);
      return amount >= minAmount;
    });
  } catch (err) {
    console.error('Token balance verification failed:', err);
    return false;
  }
}
