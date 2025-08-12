# 🚀 Complete Deployment Guide

## Overview

This comprehensive guide covers all aspects of deploying the PROMPT Staking Terminal from local development to production environments. It includes best practices, security considerations, and troubleshooting steps.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Local Development Setup](#local-development-setup)
4. [Staging Environment](#staging-environment)
5. [Production Deployment](#production-deployment)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Troubleshooting](#troubleshooting)
9. [Performance Optimization](#performance-optimization)
10. [Security Hardening](#security-hardening)

---

## Pre-Deployment Checklist

### ✅ Code Quality Requirements

Before deploying, ensure the following requirements are met:

```bash
# Run all tests
npm run test:all

# Check code quality
npm run lint

# Verify build process
npm run build

# Check bundle size
npm run build && du -sh frontend/dist/*
```

**Requirements:**
- [ ] All unit tests passing (>80% coverage)
- [ ] All E2E tests passing
- [ ] No linting errors
- [ ] Bundle size < 500KB (gzipped)
- [ ] Build completes without warnings
- [ ] Security audit clean (`npm audit`)

### ✅ Environment Configuration

- [ ] Environment variables configured for target environment
- [ ] RPC endpoints tested and validated
- [ ] Token mint addresses verified
- [ ] Wallet connections tested on target network
- [ ] Domain and SSL certificates configured

### ✅ Performance Requirements

- [ ] Lighthouse score > 90 (mobile and desktop)
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 3s
- [ ] Cumulative Layout Shift < 0.1

---

## Environment Configuration

### Development Environment

```bash
# frontend/.env.development
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_PROMPT_TOKEN_MINT=5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF
VITE_MINIMUM_TOKEN_BALANCE=500

# Optional: Multiple RPC endpoints for failover
VITE_RPC_ENDPOINTS="https://api.devnet.solana.com,https://rpc.ankr.com/solana_devnet"

# Development flags
VITE_DEBUG_MODE=true
VITE_ENABLE_PERFORMANCE_LOGS=true
```

### Staging Environment

```bash
# frontend/.env.staging
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_PROMPT_TOKEN_MINT=5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF
VITE_MINIMUM_TOKEN_BALANCE=500

# Staging-specific settings
VITE_API_BASE_URL=https://staging-api.promptstaking.com
VITE_ANALYTICS_ENABLED=true
VITE_ERROR_REPORTING_ENABLED=true

# Performance monitoring
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

### Production Environment

```bash
# frontend/.env.production
VITE_SOLANA_NETWORK=mainnet
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_PROMPT_TOKEN_MINT=YOUR_MAINNET_TOKEN_MINT
VITE_MINIMUM_TOKEN_BALANCE=1000

# Production RPC endpoints (with fallbacks)
VITE_RPC_ENDPOINTS="https://api.mainnet-beta.solana.com,https://rpc.ankr.com/solana,https://solana-mainnet.g.alchemy.com/v2/YOUR_KEY"

# Production settings
VITE_DEBUG_MODE=false
VITE_ENABLE_PERFORMANCE_LOGS=false
VITE_ANALYTICS_ENABLED=true
VITE_ERROR_REPORTING_ENABLED=true
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### Environment Variable Validation

```javascript
// src/utils/config/validate.js
export function validateEnvironment() {
  const required = [
    'VITE_SOLANA_NETWORK',
    'VITE_SOLANA_RPC_URL',
    'VITE_PROMPT_TOKEN_MINT'
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  // Validate network
  const network = import.meta.env.VITE_SOLANA_NETWORK;
  if (!['devnet', 'testnet', 'mainnet'].includes(network)) {
    throw new Error(`Invalid VITE_SOLANA_NETWORK: ${network}`);
  }
  
  // Validate RPC URL
  try {
    new URL(import.meta.env.VITE_SOLANA_RPC_URL);
  } catch (error) {
    throw new Error(`Invalid VITE_SOLANA_RPC_URL: ${import.meta.env.VITE_SOLANA_RPC_URL}`);
  }
  
  console.log('✅ Environment validation passed');
}
```

---

## Local Development Setup

### Initial Setup

```bash
# 1. Clone repository
git clone https://github.com/your-username/solana-staking-dapp.git
cd solana-staking-dapp

# 2. Install dependencies
cd frontend
npm install

# 3. Install Playwright browsers for E2E testing
npx playwright install

# 4. Setup environment
cp .env.example .env.development
# Edit .env.development with your values

# 5. Start development server
npm run dev
```

### Development Workflow

```bash
# Terminal 1: Development server with hot reload
npm run dev

# Terminal 2: Watch unit tests
npm run test

# Terminal 3: Type checking (if using TypeScript)
npm run typecheck -- --watch

# Run E2E tests (requires dev server running)
npm run test:e2e

# Run specific E2E test
npm run test:e2e -- --grep "wallet integration"
```

### Local Network Testing

```bash
# Start Solana local validator (optional for advanced testing)
solana-test-validator --reset

# Connect to local network
export VITE_SOLANA_NETWORK=localnet
export VITE_SOLANA_RPC_URL=http://localhost:8899

# Fund test wallet
solana airdrop 10 YOUR_WALLET_ADDRESS --url localhost
```

### Mobile Development Testing

```bash
# Find your local IP address
hostname -I | awk '{print $1}'
# Example output: 192.168.1.100

# Start dev server with host binding
npm run dev -- --host

# Access from mobile device
# http://192.168.1.100:3000

# Test mobile-specific E2E tests
npm run test:e2e:mobile
```

---

## Staging Environment

### Staging Deployment with Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Configure project (run from project root)
vercel

# 4. Set staging environment variables
vercel env add VITE_SOLANA_NETWORK staging
vercel env add VITE_SOLANA_RPC_URL staging
vercel env add VITE_PROMPT_TOKEN_MINT staging
vercel env add VITE_MINIMUM_TOKEN_BALANCE staging

# 5. Deploy to staging
vercel --target=staging

# 6. Create staging alias
vercel alias set YOUR_DEPLOYMENT_URL staging.promptstaking.com
```

### Staging Validation

```bash
# Run E2E tests against staging
BASE_URL=https://staging.promptstaking.com npm run test:e2e

# Performance audit
npx lighthouse https://staging.promptstaking.com --view

# Security scan
npm audit
npx eslint-security-scanner src/

# Bundle analysis
npm run build
npx bundle-analyzer frontend/dist
```

### Staging Environment Variables (Vercel)

```bash
# Set via Vercel Dashboard or CLI
vercel env add VITE_SOLANA_NETWORK
# Enter: devnet

vercel env add VITE_SOLANA_RPC_URL
# Enter: https://api.devnet.solana.com

vercel env add VITE_PROMPT_TOKEN_MINT
# Enter: 5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF

vercel env add VITE_MINIMUM_TOKEN_BALANCE
# Enter: 500

vercel env add VITE_ANALYTICS_ENABLED
# Enter: true
```

---

## Production Deployment

### Pre-Production Validation

```bash
# 1. Final test suite
npm run test:all

# 2. Production build test
NODE_ENV=production npm run build

# 3. Bundle size check
du -sh frontend/dist/*

# 4. Security audit
npm audit --production
npm audit fix

# 5. Performance test
npm run build
npx serve frontend/dist &
npx lighthouse http://localhost:3000 --view
```

### Production Environment Setup

#### Vercel Production Deployment

```bash
# 1. Set production environment variables
vercel env add VITE_SOLANA_NETWORK production
# Enter: mainnet

vercel env add VITE_SOLANA_RPC_URL production
# Enter: https://api.mainnet-beta.solana.com

vercel env add VITE_PROMPT_TOKEN_MINT production
# Enter: YOUR_MAINNET_TOKEN_MINT

vercel env add VITE_MINIMUM_TOKEN_BALANCE production
# Enter: 1000

vercel env add VITE_RPC_ENDPOINTS production
# Enter: https://api.mainnet-beta.solana.com,https://rpc.ankr.com/solana

# 2. Deploy to production
vercel --prod

# 3. Set production domain
vercel domains add promptstaking.com
vercel alias set YOUR_DEPLOYMENT_URL promptstaking.com
```

#### Alternative: Netlify Deployment

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build project
npm run build

# 3. Deploy to Netlify
netlify deploy --prod --dir=frontend/dist

# 4. Set environment variables in Netlify dashboard
# Or via CLI:
netlify env:set VITE_SOLANA_NETWORK mainnet
netlify env:set VITE_SOLANA_RPC_URL https://api.mainnet-beta.solana.com
```

#### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS build

WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --only=production

COPY frontend/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and deploy with Docker
docker build -t prompt-staking-terminal .
docker run -p 80:80 prompt-staking-terminal
```

### Production Environment Variables

**Required Variables:**
```bash
VITE_SOLANA_NETWORK=mainnet
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_PROMPT_TOKEN_MINT=YOUR_MAINNET_TOKEN_MINT_ADDRESS
VITE_MINIMUM_TOKEN_BALANCE=1000
```

**Optional Production Variables:**
```bash
# Multiple RPC endpoints for reliability
VITE_RPC_ENDPOINTS=https://api.mainnet-beta.solana.com,https://rpc.ankr.com/solana

# Analytics and monitoring
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_MIXPANEL_TOKEN=your_mixpanel_token

# Feature flags
VITE_ENABLE_STAKING=true
VITE_ENABLE_REWARDS=true
VITE_ENABLE_ADVANCED_FEATURES=true

# Rate limiting
VITE_RATE_LIMIT_REQUESTS=100
VITE_RATE_LIMIT_WINDOW=3600000
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Build, Test, and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: 'frontend/package-lock.json'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Run linting
        run: |
          cd frontend
          npm run lint
      
      - name: Run unit tests
        run: |
          cd frontend
          npm run test:coverage
      
      - name: Install Playwright browsers
        run: |
          cd frontend
          npx playwright install --with-deps
      
      - name: Run E2E tests
        run: |
          cd frontend
          npm run test:e2e
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: |
            frontend/coverage/
            frontend/test-results/
            frontend/playwright-report/

  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Run security audit
        run: |
          cd frontend
          npm audit --audit-level high
      
      - name: Run CodeQL analysis
        uses: github/codeql-action/analyze@v2
        with:
          languages: javascript

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [test, security-scan]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: 'frontend/package-lock.json'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Build application
        run: |
          cd frontend
          npm run build
        env:
          VITE_SOLANA_NETWORK: ${{ github.ref == 'refs/heads/main' && 'mainnet' || 'devnet' }}
          VITE_SOLANA_RPC_URL: ${{ secrets.SOLANA_RPC_URL }}
          VITE_PROMPT_TOKEN_MINT: ${{ secrets.PROMPT_TOKEN_MINT }}
          VITE_MINIMUM_TOKEN_BALANCE: ${{ secrets.MINIMUM_TOKEN_BALANCE }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: frontend/dist/

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: frontend/dist/
      
      - name: Deploy to Vercel (Staging)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: frontend
          scope: ${{ secrets.VERCEL_TEAM_SLUG }}

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: frontend/dist/
      
      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: frontend
          scope: ${{ secrets.VERCEL_TEAM_SLUG }}

  post-deployment:
    name: Post-Deployment Tests
    runs-on: ubuntu-latest
    needs: [deploy-production]
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: 'frontend/package-lock.json'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Install Playwright browsers
        run: |
          cd frontend
          npx playwright install --with-deps
      
      - name: Run production E2E tests
        run: |
          cd frontend
          BASE_URL=https://promptstaking.com npm run test:e2e
        env:
          CI: true
      
      - name: Run Lighthouse audit
        run: |
          npm install -g lighthouse
          lighthouse https://promptstaking.com --output=json --output-path=./lighthouse-results.json
          cat lighthouse-results.json | jq '.categories.performance.score'
```

### Required GitHub Secrets

```bash
# Vercel deployment
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
VERCEL_TEAM_SLUG=your_team_slug

# Environment configuration
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
PROMPT_TOKEN_MINT=your_token_mint_address
MINIMUM_TOKEN_BALANCE=1000

# Optional: Analytics and monitoring
SENTRY_DSN=your_sentry_dsn
GOOGLE_ANALYTICS_ID=your_ga_id
```

---

## Monitoring and Maintenance

### Performance Monitoring

```javascript
// src/utils/monitoring/performance.js
class ProductionPerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoads: 0,
      averageLoadTime: 0,
      errors: 0,
      userSessions: 0
    };
    
    this.init();
  }
  
  init() {
    // Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(this.onVital);
      getFID(this.onVital);
      getFCP(this.onVital);
      getLCP(this.onVital);
      getTTFB(this.onVital);
    });
    
    // Custom metrics
    this.trackPageLoad();
    this.trackUserInteractions();
    this.trackErrors();
  }
  
  onVital = (vital) => {
    // Send to analytics service
    if (window.gtag) {
      window.gtag('event', vital.name, {
        event_category: 'Web Vitals',
        value: Math.round(vital.name === 'CLS' ? vital.value * 1000 : vital.value),
        event_label: vital.rating
      });
    }
    
    // Alert if performance is poor
    if (vital.rating === 'poor') {
      console.warn(`Poor ${vital.name}: ${vital.value}`);
      this.reportPerformanceIssue(vital);
    }
  };
}
```

### Error Monitoring with Sentry

```javascript
// src/utils/monitoring/errors.js
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_SOLANA_NETWORK,
  
  beforeSend(event, hint) {
    // Filter out development errors
    if (import.meta.env.DEV) {
      return null;
    }
    
    // Add custom context
    event.tags = {
      ...event.tags,
      network: import.meta.env.VITE_SOLANA_NETWORK,
      version: import.meta.env.VITE_APP_VERSION
    };
    
    return event;
  },
  
  tracesSampleRate: 0.1, // 10% of transactions
  
  beforeSendTransaction(event) {
    // Only send important transactions to reduce noise
    if (event.transaction?.includes('wallet') || 
        event.transaction?.includes('stake')) {
      return event;
    }
    return null;
  }
});
```

### Health Check Endpoint

```javascript
// src/utils/health/check.js
export class HealthChecker {
  constructor() {
    this.checks = [
      this.checkRPCConnection,
      this.checkWalletAdapters,
      this.checkTokenMetadata,
      this.checkLocalStorage
    ];
  }
  
  async runHealthCheck() {
    const results = await Promise.allSettled(
      this.checks.map(check => check())
    );
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {},
      environment: {
        network: import.meta.env.VITE_SOLANA_NETWORK,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };
    
    results.forEach((result, index) => {
      const checkName = this.checks[index].name;
      
      if (result.status === 'fulfilled') {
        health.checks[checkName] = { status: 'ok', ...result.value };
      } else {
        health.checks[checkName] = { 
          status: 'error', 
          error: result.reason.message 
        };
        health.status = 'degraded';
      }
    });
    
    return health;
  }
  
  async checkRPCConnection() {
    const connection = new Connection(import.meta.env.VITE_SOLANA_RPC_URL);
    const startTime = Date.now();
    
    try {
      await connection.getSlot();
      return { latency: Date.now() - startTime };
    } catch (error) {
      throw new Error(`RPC connection failed: ${error.message}`);
    }
  }
}
```

### Automated Monitoring Script

```bash
#!/bin/bash
# scripts/monitor-production.sh

echo "🔍 Production Monitoring Check"
echo "================================"

# Check site availability
echo "Checking site availability..."
if curl -f -s https://promptstaking.com > /dev/null; then
    echo "✅ Site is accessible"
else
    echo "❌ Site is not accessible"
    exit 1
fi

# Run Lighthouse audit
echo "Running performance audit..."
lighthouse https://promptstaking.com \
    --only-categories=performance,best-practices,seo \
    --output=json \
    --output-path=./lighthouse-results.json \
    --chrome-flags="--headless"

# Check Core Web Vitals
PERFORMANCE_SCORE=$(cat lighthouse-results.json | jq '.categories.performance.score')
echo "Performance Score: $PERFORMANCE_SCORE"

if (( $(echo "$PERFORMANCE_SCORE < 0.9" | bc -l) )); then
    echo "⚠️ Performance score below 90%"
else
    echo "✅ Performance score acceptable"
fi

# Check for broken links
echo "Checking for broken links..."
npx broken-link-checker https://promptstaking.com --recursive --ordered

# Security headers check
echo "Checking security headers..."
curl -I https://promptstaking.com | grep -E "(Content-Security-Policy|X-Frame-Options|X-Content-Type-Options)"

echo "✅ Monitoring check complete"
```

---

## Troubleshooting

### Common Deployment Issues

#### 1. Build Failures

```bash
# Problem: Build fails with "Cannot resolve module"
# Solution: Check import paths and dependencies

# Verify all dependencies are installed
npm ci

# Check for missing peer dependencies
npm ls

# Clean install
rm -rf node_modules package-lock.json
npm install
```

#### 2. Environment Variables Not Working

```bash
# Problem: Environment variables not loaded in production
# Solution: Ensure variables are prefixed with VITE_

# ❌ Wrong
SOLANA_NETWORK=mainnet

# ✅ Correct
VITE_SOLANA_NETWORK=mainnet

# Verify environment variables are loaded
npm run build && grep -r "VITE_" dist/
```

#### 3. RPC Connection Failures

```javascript
// Problem: RPC timeouts in production
// Solution: Implement proper retry logic

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function makeRPCRequest(method, params, retries = 0) {
  try {
    const response = await connection[method](...params);
    return response;
  } catch (error) {
    if (retries < MAX_RETRIES && error.code !== 'INVALID_PARAMS') {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retries + 1)));
      return makeRPCRequest(method, params, retries + 1);
    }
    throw error;
  }
}
```

#### 4. Mobile Performance Issues

```bash
# Problem: Poor mobile performance
# Solution: Enable specific mobile optimizations

# Check bundle size
npm run build
du -sh dist/* | sort -hr

# Analyze bundle
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/assets/*.js

# Optimize images
npm install -g imagemin-cli
imagemin public/images/* --out-dir=public/images/
```

#### 5. Wallet Connection Issues

```javascript
// Problem: Wallet connections failing in production
// Solution: Add proper error handling and fallbacks

async function connectWalletWithRetry(walletType, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const wallet = await connectWallet(walletType);
      return wallet;
    } catch (error) {
      console.warn(`Wallet connection attempt ${attempt} failed:`, error);
      
      if (attempt === maxAttempts) {
        throw new Error(`Failed to connect ${walletType} after ${maxAttempts} attempts`);
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

### Debugging Production Issues

#### Enable Debug Mode

```javascript
// Add to browser console for debugging
localStorage.setItem('debug', 'true');
localStorage.setItem('verbose_logs', 'true');
location.reload();
```

#### Performance Debugging

```javascript
// Add to browser console
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});
observer.observe({entryTypes: ['measure', 'navigation']});
```

#### Network Debugging

```javascript
// Monitor RPC calls
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('Fetch request:', args[0]);
  return originalFetch.apply(this, args)
    .then(response => {
      console.log('Fetch response:', response.status, response.statusText);
      return response;
    });
};
```

---

## Performance Optimization

### Bundle Size Optimization

```javascript
// vite.config.js - Advanced optimization
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor libraries
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('@solana')) return 'solana-vendor';
            if (id.includes('buffer') || id.includes('crypto')) return 'crypto-vendor';
            return 'vendor';
          }
          
          // Feature-based chunks
          if (id.includes('commands/')) return 'commands';
          if (id.includes('wallet')) return 'wallet';
          if (id.includes('staking')) return 'staking';
        }
      }
    },
    
    // Optimize chunk size
    chunkSizeWarningLimit: 600,
    
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    }
  }
});
```

### CDN Optimization

```html
<!-- index.html - Preload critical resources -->
<head>
  <!-- Preconnect to external domains -->
  <link rel="preconnect" href="https://api.mainnet-beta.solana.com">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  
  <!-- Preload critical assets -->
  <link rel="preload" href="/fonts/roboto-mono.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- DNS prefetch for external resources -->
  <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
  
  <!-- Resource hints -->
  <link rel="prefetch" href="/api/health">
</head>
```

### Service Worker for Caching

```javascript
// public/sw.js - Custom service worker
const CACHE_NAME = 'prompt-staking-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.js',
  '/static/css/main.css',
  '/fonts/roboto-mono.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'document') {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
```

---

## Security Hardening

### Content Security Policy

```html
<!-- index.html - CSP header -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  connect-src 'self' https://*.solana.com https://*.ankr.com;
  img-src 'self' data: https:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
">
```

### Security Headers (Vercel)

```json
// vercel.json - Security headers
{
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
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

### Environment Security Checklist

- [ ] No sensitive data in client-side code
- [ ] Environment variables properly scoped (VITE_ prefix)
- [ ] API keys restricted to specific domains
- [ ] HTTPS enforced in production
- [ ] Security headers configured
- [ ] Content Security Policy implemented
- [ ] Regular security audits scheduled
- [ ] Dependency vulnerabilities monitored

---

## Maintenance Schedule

### Weekly Tasks
- [ ] Check application health and performance metrics
- [ ] Review error logs and fix critical issues
- [ ] Update dependencies with security patches
- [ ] Monitor RPC endpoint performance
- [ ] Verify wallet connection functionality

### Monthly Tasks
- [ ] Full security audit (`npm audit`)
- [ ] Performance optimization review
- [ ] Lighthouse audit and optimization
- [ ] Backup configuration and environment variables
- [ ] Review and update monitoring thresholds

### Quarterly Tasks
- [ ] Major dependency updates
- [ ] Comprehensive penetration testing
- [ ] Infrastructure cost optimization
- [ ] Disaster recovery testing
- [ ] Documentation updates

---

This deployment guide provides comprehensive coverage of all aspects needed for successful deployment and maintenance of the PROMPT Staking Terminal. Follow the checklists and procedures to ensure reliable, secure, and performant production deployments.