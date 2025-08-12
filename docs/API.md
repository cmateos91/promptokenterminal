# 🔧 Technical API Documentation

## Overview

The PROMPT Staking Terminal provides a comprehensive set of APIs for wallet integration, blockchain interactions, and terminal functionality. This documentation covers all technical interfaces, utilities, and integration points.

## Table of Contents

1. [Core APIs](#core-apis)
2. [Wallet Integration](#wallet-integration)
3. [Blockchain Services](#blockchain-services)
4. [Terminal System](#terminal-system)
5. [Utilities & Helpers](#utilities--helpers)
6. [Error Handling](#error-handling)
7. [Performance Monitoring](#performance-monitoring)
8. [Testing APIs](#testing-apis)

---

## Core APIs

### Command System

#### `executeCommand(input: string): Promise<CommandResult>`

Executes terminal commands with full validation and access control.

```javascript
import { executeCommand } from './src/utils/commands';

const result = await executeCommand('balance');
// Returns: { type: 'result', content: 'SOL Balance: 1.25...' }
```

**Parameters:**
- `input` (string): The command string to execute

**Returns:** `CommandResult`
```typescript
interface CommandResult {
  type: 'result' | 'error' | 'info' | 'loading' | 'suggestion';
  content: string;
}
```

**Features:**
- ✅ Command validation and sanitization
- ✅ Access level verification
- ✅ Token gating enforcement
- ✅ Performance tracking
- ✅ Error boundary protection

#### `getCommandSuggestions(input: string): string[]`

Returns autocomplete suggestions for partial commands.

```javascript
const suggestions = getCommandSuggestions('bal');
// Returns: ['balance']
```

### User State Management

#### `getUserStatus(): UserStatus`

Gets current user progression and access level.

```javascript
import { getUserStatus } from './src/utils/userState';

const status = getUserStatus();
console.log(status.level, status.name, status.color);
```

**UserStatus Interface:**
```typescript
interface UserStatus {
  level: number;          // 0-4 access level
  name: string;          // Level name (e.g., "VISITOR", "VERIFIED")
  color: string;         // Terminal color for display
  description: string;   // Level description
}
```

#### `checkLevelUp(command: string): boolean`

Checks if user should level up after command execution.

---

## Wallet Integration

### Wallet Connection Manager

#### `connectWallet(walletType: string): Promise<WalletConnection>`

Connects to Solana wallets with full error handling.

```javascript
import { connectWallet } from './src/utils/solana';

try {
  const wallet = await connectWallet('phantom');
  console.log('Connected:', wallet.publicKey.toString());
} catch (error) {
  console.error('Connection failed:', error.message);
}
```

**Supported Wallets:**
- `phantom` - Phantom Wallet
- `solflare` - Solflare Wallet
- `backpack` - Backpack Wallet

**WalletConnection Interface:**
```typescript
interface WalletConnection {
  publicKey: PublicKey;
  isConnected: boolean;
  adapter: WalletAdapter;
  signTransaction: (tx: Transaction) => Promise<Transaction>;
  signAllTransactions: (txs: Transaction[]) => Promise<Transaction[]>;
}
```

#### `disconnectWallet(): Promise<void>`

Safely disconnects active wallet connection.

#### `getWalletBalance(address?: PublicKey): Promise<BalanceInfo>`

Gets SOL and SPL token balances.

```javascript
const balance = await getWalletBalance();
```

**BalanceInfo Interface:**
```typescript
interface BalanceInfo {
  sol: number;
  tokens: Array<{
    mint: string;
    symbol: string;
    balance: number;
    decimals: number;
  }>;
}
```

### Token Operations

#### `hasRequiredBalance(): Promise<boolean>`

Checks if user meets minimum token requirements for access.

#### `getTokenMetadata(mintAddress: string): Promise<TokenMetadata>`

Fetches token metadata from on-chain sources.

---

## Blockchain Services

### Staking Contract Service

#### `StakingContractService`

Main service class for smart contract interactions.

```javascript
import { stakingService } from './src/services/stakingContract';

// Get staking pools
const pools = await stakingService.getStakingPools();

// Stake tokens
const result = await stakingService.stakeTokens(100, wallet);

// Check user stake info
const stakeInfo = await stakingService.getUserStakeInfo(wallet);
```

**Methods:**

##### `getStakingPools(): Promise<StakingPool[]>`
Returns available staking pools with APY and statistics.

##### `stakeTokens(amount: number, wallet: WalletConnection): Promise<TransactionResult>`
Stakes tokens to the default pool.

##### `unstakeTokens(amount: number, wallet: WalletConnection): Promise<TransactionResult>`
Initiates unstaking with timelock period.

##### `claimRewards(wallet: WalletConnection): Promise<TransactionResult>`
Claims pending staking rewards.

##### `getUserStakeInfo(wallet: WalletConnection): Promise<StakeInfo>`
Gets user's staking position and rewards.

**Interface Definitions:**

```typescript
interface StakingPool {
  address: PublicKey;
  tokenMint: PublicKey;
  rewardMint: PublicKey;
  totalStaked: number;
  apy: number;
  active: boolean;
}

interface StakeInfo {
  stakedAmount: number;
  pendingRewards: number;
  lastStakeTime: number;
  unlockTime?: number;
}

interface TransactionResult {
  signature: string;
  amount?: number;
  timestamp: string;
}
```

### RPC Management

#### Multi-RPC Configuration

The system uses fallback RPC endpoints for reliability:

```javascript
import { RPC_ENDPOINTS, getCurrentRPC } from './src/utils/config';

const currentRPC = getCurrentRPC();
console.log('Using RPC:', currentRPC);
```

**Features:**
- ✅ Automatic failover on RPC errors
- ✅ Rate limiting protection
- ✅ Performance monitoring
- ✅ Network-specific endpoints (devnet/mainnet)

---

## Terminal System

### Terminal Hook

#### `useTerminal(): TerminalState`

Main React hook providing terminal functionality.

```javascript
import { useTerminal } from './src/hooks/useTerminal';

function MyTerminal() {
  const {
    history,
    input,
    suggestions,
    handleSubmit,
    handleKeyDown,
    isLoading
  } = useTerminal();
  
  // Component implementation
}
```

**TerminalState Interface:**
```typescript
interface TerminalState {
  history: HistoryItem[];
  input: string;
  suggestions: string[];
  showSuggestions: boolean;
  isLoading: boolean;
  isMobile: boolean;
  inputRef: RefObject<HTMLInputElement>;
  outputRef: RefObject<HTMLDivElement>;
  setInput: (value: string) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleSuggestionClick: (suggestion: string) => void;
}
```

### Mobile Optimization

#### Mobile Detection & Adaptation

```javascript
const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Touch event handling
useEffect(() => {
  if (!isMobile) return;
  
  const preventDefault = (e) => {
    // Prevent pull-to-refresh
    if (e.target.closest('.terminal-output')) {
      e.preventDefault();
    }
  };
  
  document.addEventListener('touchmove', preventDefault, { passive: false });
}, [isMobile]);
```

---

## Utilities & Helpers

### Security Utilities

#### `validateInput(input: string): boolean`

Validates and sanitizes user input to prevent XSS and injection attacks.

```javascript
import { validateInput, sanitizeInput } from './src/utils/security';

const isValid = validateInput(userInput);
const clean = sanitizeInput(userInput);
```

#### Rate Limiting

```javascript
import { checkRateLimit } from './src/utils/rpcSecurity';

const allowed = checkRateLimit(domain, endpoint);
if (!allowed) {
  throw new Error('Rate limit exceeded');
}
```

### Performance Utilities

#### `performanceLogger`

Tracks system performance and provides debugging data.

```javascript
import { performanceLogger } from './src/utils/performance';

performanceLogger.mark('operation-start');
// ... perform operation
performanceLogger.measure('operation-duration', 'operation-start');
```

#### `PerformanceMonitor`

Real-time performance monitoring class.

```javascript
const monitor = new PerformanceMonitor();
monitor.startTracking();

// Get performance metrics
const metrics = monitor.getMetrics();
console.log('Average response time:', metrics.averageResponseTime);
```

### Configuration Management

#### Environment Configuration

```javascript
import { 
  TOKEN_MINT,
  MIN_TOKEN_BALANCE,
  RPC_URL,
  NETWORK
} from './src/utils/config';
```

**Configuration Variables:**
- `VITE_SOLANA_NETWORK` - Target network (devnet/mainnet)
- `VITE_SOLANA_RPC_URL` - Primary RPC endpoint
- `VITE_PROMPT_TOKEN_MINT` - Token mint address for gating
- `VITE_MINIMUM_TOKEN_BALANCE` - Required token balance

---

## Error Handling

### Error Types

```typescript
interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}

// Common error codes
enum ErrorCodes {
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  ACCESS_DENIED = 'ACCESS_DENIED',
  INVALID_INPUT = 'INVALID_INPUT'
}
```

### Error Boundary

```javascript
import { ErrorBoundary } from './src/components/ErrorBoundary';

<ErrorBoundary fallback={<ErrorFallback />}>
  <Terminal />
</ErrorBoundary>
```

### Global Error Handler

```javascript
import { handleGlobalError } from './src/utils/errorHandling';

window.addEventListener('error', handleGlobalError);
window.addEventListener('unhandledrejection', handleGlobalError);
```

---

## Performance Monitoring

### DevLogger System

#### Development Logging

```javascript
import { devLogger } from './src/utils/logger';

// Command logging
devLogger.command('stake', { amount: 100 }, userWallet);

// Error logging
devLogger.error('stakeTokens', error, context);

// Network logging
devLogger.network('RPC request', endpoint, response);

// Performance logging
devLogger.performance('commandExecution', duration);
```

#### AI-Ready Export

```javascript
const debugData = devLogger.exportForAI();
// Returns structured data for AI analysis
```

### Metrics Collection

```javascript
import { metricsCollector } from './src/utils/metrics';

// Track user interactions
metricsCollector.track('command_executed', {
  command: 'balance',
  duration: 150,
  success: true
});

// Get analytics data
const analytics = metricsCollector.getAnalytics();
```

---

## Testing APIs

### Test Utilities

#### Mock Wallet Provider

```javascript
import { MockWalletProvider } from './src/__tests__/mocks/wallet';

const mockWallet = new MockWalletProvider({
  publicKey: 'mock_public_key',
  balance: 1000,
  connected: true
});
```

#### Test Helpers

```javascript
import { 
  createMockTransaction,
  simulateUserInput,
  waitForCommand
} from './src/__tests__/helpers';

// Simulate terminal interaction
await simulateUserInput(terminal, 'help');
await waitForCommand(terminal, 'help');
```

### E2E Testing

#### Page Objects

```javascript
import { TerminalPage } from './tests/e2e/pages/terminal.page';

const terminal = new TerminalPage(page);
await terminal.executeCommand('balance');
await terminal.expectResult('SOL Balance');
```

#### Mobile Testing Utilities

```javascript
import { mobileUtils } from './tests/e2e/utils/mobile';

await mobileUtils.simulateTouch(page, '.terminal-input');
await mobileUtils.handleVirtualKeyboard(page);
```

---

## Integration Examples

### Complete Wallet Integration

```javascript
import { connectWallet, getWalletBalance, stakingService } from './src/services';

async function completeStakingFlow() {
  try {
    // 1. Connect wallet
    const wallet = await connectWallet('phantom');
    
    // 2. Check balance
    const balance = await getWalletBalance(wallet.publicKey);
    
    // 3. Verify token access
    const hasAccess = await hasRequiredBalance();
    if (!hasAccess) throw new Error('Insufficient tokens');
    
    // 4. Stake tokens
    const result = await stakingService.stakeTokens(100, wallet);
    
    console.log('Staking successful:', result.signature);
    
  } catch (error) {
    console.error('Staking failed:', error.message);
  }
}
```

### Custom Command Creation

```javascript
// Add custom command to the system
const customCommands = {
  'mycustom': async (args) => {
    // Command implementation
    return {
      type: 'result',
      content: 'Custom command executed'
    };
  }
};

// Register with command system
Object.assign(commands, customCommands);
```

---

## Security Considerations

### Input Validation

```javascript
// All user inputs are validated
function validateCommand(input) {
  // Remove dangerous characters
  const clean = input.replace(/[<>"\']*/g, '');
  
  // Check length limits
  if (clean.length > 100) {
    throw new Error('Input too long');
  }
  
  return clean;
}
```

### Rate Limiting

```javascript
const rateLimits = new Map();

function checkRateLimit(identifier, limit = 10) {
  const now = Date.now();
  const windowStart = now - (60 * 1000); // 1 minute window
  
  if (!rateLimits.has(identifier)) {
    rateLimits.set(identifier, []);
  }
  
  const requests = rateLimits.get(identifier)
    .filter(time => time > windowStart);
  
  if (requests.length >= limit) {
    return false;
  }
  
  requests.push(now);
  rateLimits.set(identifier, requests);
  return true;
}
```

### Secure Transaction Handling

```javascript
async function secureTransactionFlow(transaction, wallet) {
  try {
    // 1. Validate transaction
    validateTransaction(transaction);
    
    // 2. Get recent blockhash
    transaction.recentBlockhash = await getRecentBlockhash();
    
    // 3. Sign transaction
    const signed = await wallet.signTransaction(transaction);
    
    // 4. Send with confirmation
    const signature = await connection.sendRawTransaction(signed.serialize());
    
    // 5. Wait for confirmation
    await connection.confirmTransaction(signature, 'confirmed');
    
    return signature;
    
  } catch (error) {
    devLogger.error('Transaction failed', error);
    throw new Error(`Transaction failed: ${error.message}`);
  }
}
```

---

## Performance Optimization

### Bundle Optimization

- **Code Splitting**: Dynamic imports for wallet adapters
- **Tree Shaking**: Unused code elimination
- **Compression**: Brotli/Gzip compression
- **Caching**: Service worker caching strategy

### Runtime Optimization

- **Virtual Scrolling**: For large command history
- **Debounced Input**: Reduced suggestion API calls
- **Connection Pooling**: Reused RPC connections
- **Lazy Loading**: Component and feature lazy loading

### Mobile Performance

- **Touch Optimization**: 44px minimum touch targets
- **Viewport Optimization**: Safe area insets
- **Keyboard Handling**: Virtual keyboard management
- **Pull-to-Refresh**: Prevention in terminal area

---

## Deployment Considerations

### Environment Variables

Required for production deployment:

```env
VITE_SOLANA_NETWORK=mainnet
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_PROMPT_TOKEN_MINT=your_token_mint_address
VITE_MINIMUM_TOKEN_BALANCE=1000
```

### Build Configuration

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          solana: ['@solana/web3.js', '@solana/spl-token'],
          utils: ['buffer', 'crypto-browserify']
        }
      }
    }
  }
};
```

---

This API documentation provides comprehensive coverage of all technical interfaces and integration points in the PROMPT Staking Terminal. For additional examples and advanced usage patterns, refer to the source code and test files.