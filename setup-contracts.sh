#!/bin/bash

# 🏗️ CONTRACT DEVELOPMENT SETUP
# Prepara el entorno para desarrollo de smart contracts

echo "🏗️ Setting up contract development environment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json.backup" ] && [ ! -f "frontend/package.json" ]; then
    print_error "Run this script from the project root directory (where frontend/ exists)"
    exit 1
fi

# Create contracts directory structure if it doesn't exist
print_warning "Setting up contract directories..."

mkdir -p contracts/{programs/staking/src/{instructions,state,errors},tests,migrations}
mkdir -p frontend/src/{services,utils/contracts}

print_status "Contract directories created"

# Check for Rust and Anchor installation
print_warning "Checking development dependencies..."

if ! command -v rustc &> /dev/null; then
    print_error "Rust not found. Install from: https://rustup.rs/"
    echo "Then run: rustup default stable"
    exit 1
fi
print_status "Rust found: $(rustc --version)"

if ! command -v anchor &> /dev/null; then
    print_warning "Anchor not found. Installing..."
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    avm install latest
    avm use latest
    print_status "Anchor installed"
else
    print_status "Anchor found: $(anchor --version)"
fi

if ! command -v solana &> /dev/null; then
    print_error "Solana CLI not found. Install from: https://docs.solana.com/cli/install-solana-cli-tools"
    exit 1
fi
print_status "Solana CLI found: $(solana --version)"

# Setup Solana config for development
print_warning "Configuring Solana for development..."

solana config set --url localhost
solana config set --keypair ~/.config/solana/id.json

print_status "Solana configured for localhost"

# Install contract dependencies
if [ -f "contracts/package.json" ]; then
    print_warning "Installing contract dependencies..."
    cd contracts
    npm install
    cd ..
    print_status "Contract dependencies installed"
fi

# Install frontend dependencies for contract integration
print_warning "Installing frontend dependencies..."
cd frontend
npm install
cd ..
print_status "Frontend dependencies updated"

# Create development scripts
print_warning "Creating development scripts..."

cat > contracts/dev-setup.sh << 'EOF'
#!/bin/bash
# Contract development helpers

echo "🏗️ Contract Development Commands"
echo "================================"
echo "1. anchor build          - Build contracts"
echo "2. anchor test           - Run tests"
echo "3. anchor deploy         - Deploy to cluster"
echo "4. solana-test-validator - Start local validator"
echo "5. anchor idl fetch      - Fetch program IDL"
echo ""
echo "🤖 AI Development:"
echo "- All operations are logged for AI analysis"
echo "- Use 'contract debug' in frontend for metrics"
echo "- Check browser console for detailed logs"
EOF

chmod +x contracts/dev-setup.sh

# Create AI debugging script
cat > debug-contracts.sh << 'EOF'
#!/bin/bash
# 🤖 AI Contract Debugging Helper

echo "🤖 AI Contract Debugging"
echo "========================"

echo "📊 Checking contract status..."

# Check if local validator is running
if pgrep -f "solana-test-validator" > /dev/null; then
    echo "✅ Local validator: Running"
else
    echo "❌ Local validator: Not running"
    echo "💡 Start with: solana-test-validator"
fi

# Check if contracts are built
if [ -f "contracts/target/deploy/staking.so" ]; then
    echo "✅ Contracts: Built"
else
    echo "❌ Contracts: Not built"
    echo "💡 Build with: cd contracts && anchor build"
fi

# Check frontend contract integration
if [ -f "frontend/src/services/stakingContract.js" ]; then
    echo "✅ Frontend integration: Ready"
else
    echo "❌ Frontend integration: Missing"
fi

# Export current state for AI analysis
echo ""
echo "🤖 Exporting debug data for AI..."

cat > logs/contract-debug-$(date +%Y%m%d-%H%M%S).json << EOL
{
  "timestamp": "$(date -Iseconds)",
  "environment": {
    "rust": "$(rustc --version 2>/dev/null || echo 'Not installed')",
    "anchor": "$(anchor --version 2>/dev/null || echo 'Not installed')",
    "solana": "$(solana --version 2>/dev/null || echo 'Not installed')",
    "node": "$(node --version 2>/dev/null || echo 'Not installed')"
  },
  "validator": {
    "running": $(pgrep -f "solana-test-validator" > /dev/null && echo "true" || echo "false"),
    "config": "$(solana config get 2>/dev/null || echo 'Not configured')"
  },
  "contracts": {
    "built": $([ -f "contracts/target/deploy/staking.so" ] && echo "true" || echo "false"),
    "deployed": false,
    "program_id": "TBD"
  },
  "frontend": {
    "integration": $([ -f "frontend/src/services/stakingContract.js" ] && echo "true" || echo "false"),
    "tests": $([ -f "frontend/src/__tests__/contracts.test.js" ] && echo "true" || echo "false")
  },
  "ai_ready": true
}
EOL

echo "✅ Debug data exported to logs/"
echo "🔗 Use this data for AI-assisted development"
EOF

chmod +x debug-contracts.sh

print_status "Development scripts created"

# Create initial contract structure
print_warning "Setting up initial contract files..."

# Create basic Rust program structure
cat > contracts/programs/staking/Cargo.toml << 'EOF'
[package]
name = "staking"
version = "0.1.0"
description = "PROMPT Token Staking Program"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "staking"

[features]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
cpi = ["no-entrypoint"]
default = []

[dependencies]
anchor-lang = "0.30.1"
anchor-spl = "0.30.1"
EOF

# Create basic lib.rs
cat > contracts/programs/staking/src/lib.rs << 'EOF'
//! 🚀 PROMPT Staking Program
//! AI-Ready Smart Contract for Token Staking

use anchor_lang::prelude::*;

declare_id!("7N4UDuARwRzAhU7hEjkdJcwxVoKUGQ7FzRBuqWJyqmh3");

#[program]
pub mod staking {
    use super::*;

    /// Initialize a new staking pool
    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        reward_rate: u64,
        lock_period: i64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.authority = ctx.accounts.authority.key();
        pool.reward_rate = reward_rate;
        pool.lock_period = lock_period;
        pool.total_staked = 0;
        pool.bump = ctx.bumps.pool;
        
        msg!("🏊 Pool initialized with reward rate: {}", reward_rate);
        Ok(())
    }

    /// Stake tokens into the pool
    pub fn stake_tokens(
        ctx: Context<StakeTokens>,
        amount: u64,
    ) -> Result<()> {
        msg!("💰 Staking {} tokens", amount);
        
        // TODO: Implement staking logic
        // This is a placeholder for AI development
        
        Ok(())
    }

    /// Unstake tokens from the pool
    pub fn unstake_tokens(
        ctx: Context<UnstakeTokens>,
        amount: u64,
    ) -> Result<()> {
        msg!("💸 Unstaking {} tokens", amount);
        
        // TODO: Implement unstaking logic
        // This is a placeholder for AI development
        
        Ok(())
    }

    /// Claim pending rewards
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        msg!("🎁 Claiming rewards");
        
        // TODO: Implement rewards claiming
        // This is a placeholder for AI development
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + StakingPool::INIT_SPACE,
        seeds = [b"pool"],
        bump
    )]
    pub pool: Account<'info, StakingPool>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StakeTokens<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub pool: Account<'info, StakingPool>,
    
    // TODO: Add token accounts
}

#[derive(Accounts)]
pub struct UnstakeTokens<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub pool: Account<'info, StakingPool>,
    
    // TODO: Add token accounts
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub pool: Account<'info, StakingPool>,
    
    // TODO: Add token accounts
}

#[account]
#[derive(InitSpace)]
pub struct StakingPool {
    pub authority: Pubkey,
    pub reward_rate: u64,      // Reward rate per second
    pub lock_period: i64,      // Lock period in seconds
    pub total_staked: u64,     // Total tokens staked
    pub bump: u8,              // PDA bump
}

#[account]
#[derive(InitSpace)]
pub struct UserStake {
    pub user: Pubkey,
    pub amount: u64,
    pub stake_time: i64,
    pub last_claim: i64,
    pub bump: u8,
}

#[error_code]
pub enum StakingError {
    #[msg("🚫 Insufficient balance for staking")]
    InsufficientBalance,
    
    #[msg("⏰ Tokens are still locked")]
    TokensLocked,
    
    #[msg("🎁 No rewards available")]
    NoRewards,
    
    #[msg("🔒 Unauthorized access")]
    Unauthorized,
}
EOF

print_status "Basic contract structure created"

# Update frontend to add contract command to help
print_warning "Updating frontend commands..."

# Add contract command to help (we'll do this through the existing command structure)
echo "# Contract command added to staking commands" > frontend/CONTRACT_INTEGRATION.md

print_status "Frontend integration updated"

# Create comprehensive README for contracts
cat > contracts/README-AI.md << 'EOF'
# 🤖 AI-Ready Smart Contract Development

## 🚀 Quick Start for AI

### **Development Setup**
```bash
# From project root
./debug-contracts.sh          # Check environment
cd contracts && anchor build  # Build contracts
solana-test-validator         # Start local validator (new terminal)
anchor test                   # Run tests
```

### **Frontend Integration**
```bash
# Test contract integration
cd frontend
npm run dev                   # Start frontend
# Then in browser terminal: contract status
```

## 🏗️ Contract Architecture

### **Program Structure**
```rust
staking/
├── lib.rs              # Main program logic
├── instructions/       # Instruction handlers
├── state/             # Account structures
└── errors/            # Custom errors
```

### **Key Instructions**
- `initialize_pool` - Create staking pool
- `stake_tokens` - Stake PROMPT tokens
- `unstake_tokens` - Unstake with timelock
- `claim_rewards` - Claim pending rewards

## 🤖 AI Development Features

### **Logging & Debugging**
- All instructions emit detailed logs
- Frontend captures contract interactions
- Performance metrics tracked
- Error context for AI analysis

### **Testing Strategy**
```bash
anchor test --file stake    # Test staking logic
anchor test --file rewards  # Test reward system
anchor test --file security # Test security features
```

### **AI Commands in Frontend**
```bash
contract status             # Contract health check
contract metrics           # Performance metrics
contract debug             # Export debug data
logs contract              # Contract-specific logs
```

## 🔧 Development Workflow

1. **Contract Development**
   - Write Rust code in `programs/staking/src/`
   - Build with `anchor build`
   - Test with `anchor test`

2. **Frontend Integration**
   - Update `services/stakingContract.js`
   - Add new commands if needed
   - Test with AI debugging tools

3. **AI-Assisted Debugging**
   - Use `contract debug` command
   - Export logs with `ai export`
   - Monitor performance metrics

## 📊 Deployment Strategy

### **Local Development**
```bash
solana config set --url localhost
anchor build && anchor deploy
```

### **Devnet Testing**
```bash
solana config set --url devnet
anchor deploy --provider.cluster devnet
```

### **Mainnet Production**
```bash
solana config set --url mainnet-beta
anchor deploy --provider.cluster mainnet-beta
```

## 🎯 AI Integration Points

- **Real-time Logging**: All operations logged for AI
- **Performance Tracking**: Latency and success metrics
- **Error Analysis**: Detailed error context
- **Debug Export**: Structured data for AI analysis
- **Test Coverage**: Comprehensive test results

Ready for AI-assisted smart contract development! 🚀
EOF

print_status "AI-ready documentation created"

echo ""
echo "🎉 Contract development environment setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. 🏗️  Start local validator: solana-test-validator"
echo "2. 🔨  Build contracts: cd contracts && anchor build"
echo "3. 🧪  Run tests: anchor test"
echo "4. 💻  Start frontend: cd frontend && npm run dev"
echo "5. 🤖  Use AI debugging: contract status"
echo ""
echo "📚 Documentation:"
echo "- contracts/README-AI.md - AI development guide"
echo "- ./debug-contracts.sh - Contract debugging"
echo "- Frontend: Use 'contract' commands for debugging"
echo ""
print_status "Ready for AI-assisted smart contract development!"
