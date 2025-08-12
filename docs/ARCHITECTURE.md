# 🏗️ System Architecture & Design Patterns

## Overview

The PROMPT Staking Terminal is built with a modern, scalable architecture that prioritizes mobile-first design, security, and developer experience. This document outlines the system architecture, design patterns, and technical decisions that make the application robust and maintainable.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Design Patterns](#design-patterns)
4. [Data Flow](#data-flow)
5. [Security Architecture](#security-architecture)
6. [Mobile Architecture](#mobile-architecture)
7. [Performance Architecture](#performance-architecture)
8. [Testing Architecture](#testing-architecture)
9. [Deployment Architecture](#deployment-architecture)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React SPA)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Terminal   │  │   Wallet    │  │    Smart Contract   │  │
│  │  Interface  │  │ Integration │  │     Services        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Command   │  │    State    │  │     Performance     │  │
│  │   System    │  │ Management  │  │     Monitoring      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Security   │  │   Mobile    │  │      Utilities      │  │
│  │   Layer     │  │Optimization │  │    & Helpers        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Solana Blockchain                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │     RPC     │  │   Token     │  │      Smart          │  │
│  │ Endpoints   │  │ Programs    │  │    Contracts        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Core Principles

1. **Mobile-First Design**: Every component designed for touch interfaces first
2. **Progressive Enhancement**: Graceful degradation from desktop to mobile
3. **Security by Design**: Input validation and sanitization at every layer
4. **Performance-Oriented**: Optimized bundles, lazy loading, and efficient rendering
5. **Developer Experience**: Comprehensive tooling, testing, and debugging capabilities

---

## Architecture Layers

### 1. Presentation Layer

#### Component Architecture

```
src/
├── components/
│   ├── Terminal.jsx           # Main terminal interface
│   └── SystemStats.jsx        # Real-time system information
├── hooks/
│   └── useTerminal.js         # Terminal state management hook
└── styles/
    └── terminal.css          # Mobile-first responsive styles
```

**Key Patterns:**
- **Composition over Inheritance**: React functional components with hooks
- **Single Responsibility**: Each component has one clear purpose
- **Props Drilling Prevention**: Context API for shared state

#### Terminal Component Design

```javascript
// Terminal.jsx - Main component following mobile-first pattern
export default function Terminal() {
  const {
    history,
    input,
    suggestions,
    isLoading,
    isMobile,
    handleSubmit,
    handleKeyDown
  } = useTerminal();
  
  // Mobile-specific touch handling
  useEffect(() => {
    if (!isMobile) return;
    
    const preventDefault = (e) => {
      // Prevent pull-to-refresh on terminal area
      if (e.target.closest('.terminal-output')) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventDefault, { passive: false });
    return () => document.removeEventListener('touchmove', preventDefault);
  }, [isMobile]);
  
  return (
    <div className="terminal-container">
      {/* Mobile-optimized terminal interface */}
    </div>
  );
}
```

### 2. Business Logic Layer

#### Command System Architecture

```
src/utils/commands/
├── index.js              # Command router and execution engine
├── wallet.js             # Wallet-related commands
├── staking.js            # Staking operations
├── info.js              # Information commands
├── system.js            # System utilities
├── diagnostics.js       # Debug and monitoring
└── fun.js               # Entertainment commands
```

**Command Pattern Implementation:**

```javascript
// Command pattern with access control and validation
export async function executeCommand(input) {
  const [command, ...args] = input.toLowerCase().split(' ');
  const resolvedCommand = aliases[command] || command;
  
  // 1. Validation Layer
  if (!commands[resolvedCommand]) {
    return { type: 'error', content: `Command not found: ${command}` };
  }
  
  // 2. Access Control Layer
  if (!userProgress.unlockedCommands.has(resolvedCommand)) {
    return { type: 'error', content: 'Command not unlocked' };
  }
  
  // 3. Token Gating Layer
  const allowed = await hasRequiredBalance();
  if (!allowed && !unrestricted.has(resolvedCommand)) {
    return { type: 'error', content: 'ACCESS DENIED' };
  }
  
  // 4. Execution Layer
  try {
    const result = await commands[resolvedCommand](args);
    
    // 5. Post-execution Layer (level up check)
    const leveledUp = checkLevelUp(resolvedCommand);
    if (leveledUp) {
      result.content += '\n\n━━━ 🎉 LEVEL UP! 🎉 ━━━';
    }
    
    return result;
  } catch (error) {
    return { type: 'error', content: `Execution failed: ${error.message}` };
  }
}
```

#### State Management Architecture

```javascript
// User state with progression system
export const userProgress = {
  level: 0,
  commandCount: 0,
  walletAddress: null,
  unlockedCommands: new Set(['help', 'connect', 'clear', 'banner']),
  achievements: new Set(),
  
  // State persistence
  save() {
    localStorage.setItem('prompt_user_progress', JSON.stringify(this));
  },
  
  load() {
    const saved = localStorage.getItem('prompt_user_progress');
    if (saved) {
      Object.assign(this, JSON.parse(saved));
      this.unlockedCommands = new Set(this.unlockedCommands);
      this.achievements = new Set(this.achievements);
    }
  }
};

// Level progression system
const LEVEL_REQUIREMENTS = {
  0: { commands: 0, name: 'VISITOR' },
  1: { commands: 5, name: 'NEWCOMER' },
  2: { commands: 15, name: 'EXPLORER' },
  3: { commands: 30, name: 'TRADER' },
  4: { commands: 50, name: 'WHALE' }
};

export function checkLevelUp(command) {
  const currentLevel = userProgress.level;
  const nextLevel = currentLevel + 1;
  const requirement = LEVEL_REQUIREMENTS[nextLevel];
  
  if (requirement && userProgress.commandCount >= requirement.commands) {
    userProgress.level = nextLevel;
    unlockCommandsForLevel(nextLevel);
    userProgress.save();
    return true;
  }
  
  return false;
}
```

### 3. Service Layer

#### Blockchain Service Architecture

```javascript
// Staking service with comprehensive error handling and logging
export class StakingContractService {
  constructor() {
    this.connection = new Connection(RPC_URL, 'confirmed');
    this.programId = STAKING_PROGRAM_ID;
    this.performanceMetrics = {
      totalCalls: 0,
      averageLatency: 0,
      errors: 0
    };
  }
  
  async stakeTokens(amount, userWallet, poolAddress = null) {
    const startTime = performance.now();
    
    try {
      // 1. Input validation
      if (!userWallet?.publicKey) throw new Error('Wallet not connected');
      if (amount <= 0) throw new Error('Amount must be greater than 0');
      
      // 2. Transaction building
      const transaction = new Transaction();
      // Add staking instructions...
      
      // 3. Performance tracking
      const duration = performance.now() - startTime;
      this.updateMetrics(duration, false);
      
      // 4. Logging for debugging
      devLogger.command('stakeTokens', result, userWallet.publicKey.toString());
      
      return result;
      
    } catch (error) {
      const duration = performance.now() - startTime;
      this.updateMetrics(duration, true);
      devLogger.error('stakeTokens', error, { amount });
      throw error;
    }
  }
}
```

#### Wallet Integration Architecture

```javascript
// Multi-wallet support with standardized interface
export class WalletManager {
  constructor() {
    this.adapters = new Map();
    this.currentWallet = null;
    
    // Register wallet adapters
    this.registerAdapter('phantom', new PhantomWalletAdapter());
    this.registerAdapter('solflare', new SolflareWalletAdapter());
    this.registerAdapter('backpack', new BackpackWalletAdapter());
  }
  
  async connect(walletType) {
    const adapter = this.adapters.get(walletType);
    if (!adapter) {
      throw new Error(`Wallet ${walletType} not supported`);
    }
    
    try {
      await adapter.connect();
      this.currentWallet = adapter;
      
      // Store connection state
      localStorage.setItem('preferred_wallet', walletType);
      
      return {
        publicKey: adapter.publicKey,
        isConnected: adapter.connected,
        adapter
      };
    } catch (error) {
      devLogger.error('Wallet connection failed', error, { walletType });
      throw new Error(`Failed to connect ${walletType}: ${error.message}`);
    }
  }
}
```

### 4. Data Access Layer

#### RPC Management with Failover

```javascript
// Multi-RPC configuration with automatic failover
const RPC_ENDPOINTS = {
  devnet: [
    'https://api.devnet.solana.com',
    'https://rpc.ankr.com/solana_devnet',
    'https://solana-devnet.g.alchemy.com/v2/demo'
  ],
  mainnet: [
    'https://api.mainnet-beta.solana.com',
    'https://rpc.ankr.com/solana',
    'https://solana-mainnet.g.alchemy.com/v2/demo'
  ]
};

class RPCManager {
  constructor(network) {
    this.endpoints = RPC_ENDPOINTS[network] || RPC_ENDPOINTS.devnet;
    this.currentIndex = 0;
    this.failureCount = new Map();
  }
  
  async makeRequest(method, params) {
    for (let attempt = 0; attempt < this.endpoints.length; attempt++) {
      const endpoint = this.endpoints[this.currentIndex];
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
        });
        
        if (response.ok) {
          this.failureCount.set(endpoint, 0);
          return await response.json();
        }
        
        throw new Error(`HTTP ${response.status}`);
        
      } catch (error) {
        devLogger.network('RPC request failed', endpoint, error);
        
        const failures = this.failureCount.get(endpoint) || 0;
        this.failureCount.set(endpoint, failures + 1);
        
        // Move to next endpoint
        this.currentIndex = (this.currentIndex + 1) % this.endpoints.length;
        
        if (attempt === this.endpoints.length - 1) {
          throw new Error('All RPC endpoints failed');
        }
      }
    }
  }
}
```

---

## Design Patterns

### 1. Command Pattern

**Usage**: Terminal command system with extensible command registration.

```javascript
// Command interface
const commandInterface = {
  execute: async (args) => ({ type: 'result', content: 'Success' }),
  validate: (args) => true,
  help: 'Command description'
};

// Command registry
const commands = new Map();
commands.set('balance', balanceCommand);
commands.set('stake', stakeCommand);
```

**Benefits**:
- ✅ Easy to add new commands
- ✅ Centralized validation and access control
- ✅ Consistent error handling
- ✅ Command history and undo capabilities

### 2. Observer Pattern

**Usage**: User progression and achievement system.

```javascript
class ProgressObserver {
  constructor() {
    this.observers = [];
  }
  
  subscribe(callback) {
    this.observers.push(callback);
  }
  
  notify(event, data) {
    this.observers.forEach(callback => callback(event, data));
  }
}

// Usage
progressObserver.subscribe((event, data) => {
  if (event === 'level_up') {
    showLevelUpAnimation(data.newLevel);
  }
});
```

### 3. Factory Pattern

**Usage**: Wallet adapter creation and RPC endpoint management.

```javascript
class WalletAdapterFactory {
  static create(type) {
    switch (type) {
      case 'phantom': return new PhantomWalletAdapter();
      case 'solflare': return new SolflareWalletAdapter();
      case 'backpack': return new BackpackWalletAdapter();
      default: throw new Error(`Unknown wallet type: ${type}`);
    }
  }
}
```

### 4. Strategy Pattern

**Usage**: Different mobile optimization strategies based on device type.

```javascript
class MobileStrategy {
  static getStrategy(userAgent) {
    if (/iPhone|iPad/i.test(userAgent)) {
      return new IOSMobileStrategy();
    } else if (/Android/i.test(userAgent)) {
      return new AndroidMobileStrategy();
    }
    return new DefaultMobileStrategy();
  }
}

class IOSMobileStrategy {
  preventZoom() {
    // iOS-specific zoom prevention
    document.querySelectorAll('input').forEach(input => {
      input.style.fontSize = '16px';
    });
  }
  
  handleKeyboard() {
    // iOS keyboard handling
    window.addEventListener('focusin', (e) => {
      if (e.target.tagName === 'INPUT') {
        setTimeout(() => {
          e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    });
  }
}
```

### 5. Decorator Pattern

**Usage**: Command execution with logging, validation, and performance tracking.

```javascript
function withLogging(command) {
  return async (args) => {
    devLogger.command(`Executing ${command.name}`, args);
    const result = await command(args);
    devLogger.command(`Completed ${command.name}`, result);
    return result;
  };
}

function withValidation(command, validator) {
  return async (args) => {
    if (!validator(args)) {
      throw new Error('Invalid arguments');
    }
    return await command(args);
  };
}

function withPerformanceTracking(command) {
  return async (args) => {
    const start = performance.now();
    try {
      const result = await command(args);
      performanceLogger.track(command.name, performance.now() - start);
      return result;
    } catch (error) {
      performanceLogger.trackError(command.name, performance.now() - start);
      throw error;
    }
  };
}

// Usage: Compose decorators
const enhancedCommand = withPerformanceTracking(
  withLogging(
    withValidation(originalCommand, validateArgs)
  )
);
```

### 6. Singleton Pattern

**Usage**: Global services like logger, performance monitor, and configuration.

```javascript
class DevLogger {
  constructor() {
    if (DevLogger.instance) {
      return DevLogger.instance;
    }
    
    this.logs = [];
    this.maxLogs = 1000;
    DevLogger.instance = this;
  }
  
  static getInstance() {
    return new DevLogger();
  }
}

// Usage
const logger = DevLogger.getInstance();
```

---

## Data Flow

### Command Execution Flow

```
User Input → Input Validation → Command Resolution → Access Control 
    ↓
Token Gating → Command Execution → Result Processing → UI Update
    ↓
Logging → Performance Tracking → State Persistence
```

### Wallet Integration Flow

```
Connect Request → Wallet Detection → Connection Attempt → State Update
    ↓
Balance Fetch → Token Verification → Permission Update → UI Refresh
```

### State Management Flow

```
User Action → State Update → Validation → Persistence → UI Sync
    ↓
Level Check → Achievement Check → Observer Notification → Animation
```

---

## Security Architecture

### Input Validation Pipeline

```javascript
function securityPipeline(input) {
  // 1. Length validation
  if (input.length > MAX_INPUT_LENGTH) {
    throw new Error('Input too long');
  }
  
  // 2. Character whitelist
  const allowedChars = /^[a-zA-Z0-9\s\-_.]+$/;
  if (!allowedChars.test(input)) {
    throw new Error('Invalid characters');
  }
  
  // 3. XSS prevention
  const sanitized = input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
  
  // 4. Command injection prevention
  const dangerous = ['eval', 'function', 'constructor', '__proto__'];
  if (dangerous.some(word => sanitized.toLowerCase().includes(word))) {
    throw new Error('Potentially dangerous input');
  }
  
  return sanitized;
}
```

### Rate Limiting Implementation

```javascript
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }
  
  isAllowed(identifier) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }
    
    const userRequests = this.requests.get(identifier)
      .filter(timestamp => timestamp > windowStart);
    
    if (userRequests.length >= this.maxRequests) {
      return false;
    }
    
    userRequests.push(now);
    this.requests.set(identifier, userRequests);
    return true;
  }
}
```

### Transaction Security

```javascript
async function secureTransaction(transaction, wallet) {
  // 1. Transaction validation
  if (!transaction.instructions.length) {
    throw new Error('Empty transaction');
  }
  
  // 2. Amount validation
  const totalAmount = calculateTransactionAmount(transaction);
  if (totalAmount > MAX_TRANSACTION_AMOUNT) {
    throw new Error('Amount exceeds limit');
  }
  
  // 3. Recent blockhash
  transaction.recentBlockhash = await connection.getRecentBlockhash();
  
  // 4. Fee calculation
  const estimatedFee = await transaction.getEstimatedFee(connection);
  if (estimatedFee > MAX_FEE) {
    throw new Error('Fee too high');
  }
  
  // 5. Sign and send
  const signed = await wallet.signTransaction(transaction);
  return await connection.sendRawTransaction(signed.serialize());
}
```

---

## Mobile Architecture

### Responsive Design System

```css
/* Mobile-first CSS architecture */
:root {
  /* Base variables for mobile */
  --touch-target-size: 44px;
  --mobile-padding: 16px;
  --font-size-mobile: 14px;
  --terminal-height-mobile: calc(100vh - env(safe-area-inset-bottom));
}

/* Touch-optimized components */
.terminal-input {
  font-size: max(16px, var(--font-size-mobile)); /* Prevent iOS zoom */
  padding: 12px var(--mobile-padding);
  min-height: var(--touch-target-size);
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Safe area support */
.terminal-container {
  padding-bottom: max(20px, env(safe-area-inset-bottom));
  padding-left: max(var(--mobile-padding), env(safe-area-inset-left));
  padding-right: max(var(--mobile-padding), env(safe-area-inset-right));
}

/* Desktop enhancements */
@media (min-width: 768px) {
  :root {
    --font-size-mobile: 16px;
    --mobile-padding: 24px;
  }
}
```

### Touch Event Handling

```javascript
class TouchManager {
  constructor(element) {
    this.element = element;
    this.initTouchEvents();
  }
  
  initTouchEvents() {
    let startY = 0;
    let startTime = 0;
    
    this.element.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      startTime = Date.now();
    }, { passive: true });
    
    this.element.addEventListener('touchmove', (e) => {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      
      // Prevent pull-to-refresh if scrolling up from terminal
      if (deltaY > 0 && this.element.scrollTop === 0) {
        e.preventDefault();
      }
    }, { passive: false });
    
    this.element.addEventListener('touchend', (e) => {
      const duration = Date.now() - startTime;
      
      // Handle quick taps vs long presses
      if (duration < 200) {
        this.handleQuickTap(e);
      } else {
        this.handleLongPress(e);
      }
    });
  }
}
```

### Virtual Keyboard Management

```javascript
class KeyboardManager {
  constructor() {
    this.isKeyboardOpen = false;
    this.originalHeight = window.innerHeight;
    
    this.initKeyboardDetection();
  }
  
  initKeyboardDetection() {
    window.addEventListener('resize', () => {
      const currentHeight = window.innerHeight;
      const heightDiff = this.originalHeight - currentHeight;
      
      // Keyboard is likely open if height decreased significantly
      this.isKeyboardOpen = heightDiff > 150;
      
      if (this.isKeyboardOpen) {
        this.handleKeyboardOpen();
      } else {
        this.handleKeyboardClose();
      }
    });
    
    // iOS viewport changes
    window.addEventListener('focusin', (e) => {
      if (e.target.tagName === 'INPUT') {
        setTimeout(() => {
          this.scrollToElement(e.target);
        }, 300);
      }
    });
  }
  
  scrollToElement(element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });
  }
}
```

---

## Performance Architecture

### Bundle Optimization Strategy

```javascript
// Vite configuration for optimal bundling
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk
          vendor: ['react', 'react-dom'],
          
          // Solana chunk (loaded on demand)
          solana: ['@solana/web3.js', '@solana/spl-token'],
          
          // Utils chunk
          utils: ['buffer', 'crypto-browserify', 'stream-browserify'],
          
          // Wallet adapters (lazy loaded)
          wallets: ['@solana/wallet-adapter-phantom', '@solana/wallet-adapter-solflare']
        }
      }
    },
    
    // Tree shaking optimization
    treeshake: {
      moduleSideEffects: false
    },
    
    // Minimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

### Lazy Loading Implementation

```javascript
// Lazy load wallet adapters
const PhantomWallet = lazy(() => import('@solana/wallet-adapter-phantom'));
const SolflareWallet = lazy(() => import('@solana/wallet-adapter-solflare'));

// Lazy load heavy components
const StakingDashboard = lazy(() => import('./components/StakingDashboard'));

// Usage with Suspense
function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Router>
        <Routes>
          <Route path="/" element={<Terminal />} />
          <Route path="/dashboard" element={<StakingDashboard />} />
        </Routes>
      </Router>
    </Suspense>
  );
}
```

### Performance Monitoring

```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observer = null;
    
    this.initPerformanceObserver();
    this.initWebVitals();
  }
  
  initPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric(entry.name, entry.duration);
        });
      });
      
      this.observer.observe({ entryTypes: ['measure', 'navigation'] });
    }
  }
  
  initWebVitals() {
    // Core Web Vitals tracking
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(this.onVital);
      getFID(this.onVital);
      getFCP(this.onVital);
      getLCP(this.onVital);
      getTTFB(this.onVital);
    });
  }
  
  onVital = (vital) => {
    this.recordMetric(vital.name, vital.value);
    
    // Send to analytics if performance is poor
    if (vital.rating === 'poor') {
      this.reportPerformanceIssue(vital);
    }
  };
}
```

### Memory Management

```javascript
class MemoryManager {
  constructor() {
    this.cache = new Map();
    this.maxCacheSize = 100;
    this.cleanupInterval = 5 * 60 * 1000; // 5 minutes
    
    this.startCleanupCycle();
  }
  
  set(key, value, ttl = 300000) { // 5 minute default TTL
    if (this.cache.size >= this.maxCacheSize) {
      this.evictLRU();
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
      accessCount: 0
    });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    item.accessCount++;
    return item.value;
  }
  
  evictLRU() {
    let lruKey = null;
    let lruTime = Date.now();
    
    for (const [key, item] of this.cache) {
      if (item.timestamp < lruTime) {
        lruTime = item.timestamp;
        lruKey = key;
      }
    }
    
    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }
}
```

---

## Testing Architecture

### Test Pyramid Structure

```
┌─────────────────────────────────────┐
│            E2E Tests (Playwright)   │ ← Integration & User Flows
├─────────────────────────────────────┤
│        Integration Tests (Vitest)   │ ← Component Integration
├─────────────────────────────────────┤
│           Unit Tests (Vitest)       │ ← Pure Functions & Logic
└─────────────────────────────────────┘
```

### Test Configuration Architecture

```javascript
// vitest.config.js - Unit and integration tests
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.js'],
    coverage: {
      reporter: ['text', 'html', 'json'],
      threshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
});

// playwright.config.js - E2E tests
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } }
  ],
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
});
```

### Mock Architecture

```javascript
// Comprehensive mock system for testing
class MockSystem {
  constructor() {
    this.mocks = new Map();
    this.resetAll = this.resetAll.bind(this);
  }
  
  mockWallet(config = {}) {
    const mock = {
      publicKey: new PublicKey(config.publicKey || '11111111111111111111111111111112'),
      connected: config.connected ?? true,
      signTransaction: vi.fn().mockResolvedValue({}),
      connect: vi.fn().mockResolvedValue({}),
      disconnect: vi.fn().mockResolvedValue({})
    };
    
    this.mocks.set('wallet', mock);
    return mock;
  }
  
  mockRPC(responses = {}) {
    const mock = {
      getBalance: vi.fn().mockResolvedValue(responses.balance || 1000000000),
      getTokenAccountsByOwner: vi.fn().mockResolvedValue(responses.tokens || []),
      sendTransaction: vi.fn().mockResolvedValue('mock-signature')
    };
    
    this.mocks.set('rpc', mock);
    return mock;
  }
  
  resetAll() {
    this.mocks.clear();
  }
}
```

---

## Deployment Architecture

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Build application
        run: npm run build
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        uses: vercel/action@v24.0.0
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Infrastructure as Code

```javascript
// vercel.json - Deployment configuration
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/dist/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/frontend/dist/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "env": {
    "VITE_SOLANA_NETWORK": "@solana_network",
    "VITE_SOLANA_RPC_URL": "@solana_rpc_url",
    "VITE_PROMPT_TOKEN_MINT": "@prompt_token_mint"
  }
}
```

### Monitoring and Observability

```javascript
// Production monitoring setup
class ProductionMonitor {
  constructor() {
    this.errorReporting = new ErrorReporting();
    this.analytics = new Analytics();
    this.performance = new PerformanceMonitor();
  }
  
  init() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.errorReporting.captureError(event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
    
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.errorReporting.captureError(event.reason, {
        type: 'unhandledrejection'
      });
    });
    
    // Performance monitoring
    this.performance.startTracking();
    
    // User analytics
    this.analytics.track('app_initialized', {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }
}
```

---

## Conclusion

This architecture document provides a comprehensive overview of the PROMPT Staking Terminal's technical foundation. The system is designed with scalability, maintainability, and user experience as core priorities, leveraging modern React patterns, robust security measures, and comprehensive testing strategies.

Key architectural strengths:
- 🏗️ **Modular Design**: Clear separation of concerns with pluggable components
- 📱 **Mobile-First**: Native touch support with progressive enhancement
- 🔒 **Security-Focused**: Multi-layer validation and sanitization
- ⚡ **Performance-Optimized**: Lazy loading, code splitting, and efficient rendering
- 🧪 **Test-Driven**: Comprehensive test coverage across all layers
- 🚀 **Production-Ready**: Full CI/CD pipeline with monitoring and observability

This architecture serves as the foundation for building a robust, scalable, and maintainable DeFi application that provides an exceptional user experience across all devices and use cases.