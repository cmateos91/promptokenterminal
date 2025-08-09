import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { retryWithFallback } from './solana';
import { mockWalletState } from './userState';
import { TOKEN_MINT, MIN_TOKEN_BALANCE } from './config';
import { balanceCache, rpcRateLimiter } from './performance';

/**
 * Checks whether the connected wallet holds at least MIN_TOKEN_BALANCE
 * of the required SPL token with caching and rate limiting.
 */
export async function hasRequiredBalance() {
  if (!mockWalletState.connected || !mockWalletState.address) {
    return false;
  }

  const cacheKey = `token_balance_${mockWalletState.address}_${TOKEN_MINT.toBase58()}`;
  
  // Check cache first
  const cachedResult = balanceCache.get(cacheKey);
  if (cachedResult !== null) {
    console.log('🔄 Using cached token balance result');
    return cachedResult;
  }

  // Rate limiting
  if (!rpcRateLimiter.isAllowed(mockWalletState.address)) {
    const remainingTime = rpcRateLimiter.getRemainingTime(mockWalletState.address);
    console.warn(`⚠️ Rate limited. Try again in ${Math.ceil(remainingTime / 1000)}s`);
    // Return cached result if available, otherwise assume false
    return balanceCache.get(cacheKey) || false;
  }

  try {
    console.log('🔍 Checking token balance for access control...');
    const owner = new PublicKey(mockWalletState.address);
    const ata = await getAssociatedTokenAddress(TOKEN_MINT, owner);

    const hasBalance = await retryWithFallback(async (conn) => {
      const balance = await conn.getTokenAccountBalance(ata);
      const amount = BigInt(balance.value.amount);
      const decimals = balance.value.decimals;
      const minAmount = MIN_TOKEN_BALANCE * 10n ** BigInt(decimals);
      return amount >= minAmount;
    });

    // Cache the result
    balanceCache.set(cacheKey, hasBalance);
    console.log(`✅ Token balance check: ${hasBalance ? 'PASSED' : 'FAILED'}`);
    
    return hasBalance;
  } catch (err) {
    console.error('❌ Token balance verification failed:', err);
    
    // Cache negative result for shorter time
    balanceCache.set(cacheKey, false, 5000); // 5 seconds
    return false;
  }
}

/**
 * Clears the balance cache for the current wallet
 */
export function clearBalanceCache() {
  if (mockWalletState.address) {
    const cacheKey = `token_balance_${mockWalletState.address}_${TOKEN_MINT.toBase58()}`;
    balanceCache.cache.delete(cacheKey);
    console.log('🗑️ Balance cache cleared');
  }
}

/**
 * Pre-loads token balance check for better UX
 */
export async function preloadTokenBalance() {
  if (mockWalletState.connected && mockWalletState.address) {
    try {
      await hasRequiredBalance();
    } catch (error) {
      console.warn('Preload token balance failed:', error.message);
    }
  }
}
