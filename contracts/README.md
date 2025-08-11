# 🚀 PROMPT Staking Contracts

## 📁 Estructura

```
contracts/
├── Anchor.toml          # Configuración de Anchor
├── Cargo.toml          # Configuración de Cargo
├── package.json        # Dependencies para testing
├── programs/
│   └── staking/        # Programa principal de staking
│       ├── Cargo.toml
│       └── src/
│           ├── lib.rs
│           ├── instructions/
│           ├── state/
│           └── errors/
├── tests/
│   ├── staking.ts      # Tests del contrato
│   └── utils.ts        # Utilidades para testing
└── migrations/
    └── deploy.js       # Scripts de deployment
```

## 🎯 Funcionalidades Planeadas

### **Core Staking**
- [x] Stake PROMPT tokens
- [x] Unstake with timelock
- [x] Claim rewards
- [x] Emergency withdraw

### **Reward System**
- [x] Flexible reward tokens (any SPL)
- [x] Variable APY based on pool size
- [x] Compound staking rewards
- [x] Reward token swap integration

### **Pool Management**
- [x] Multiple staking pools
- [x] Pool creation by authority
- [x] Pool pause/unpause
- [x] Fee management

### **Security Features**
- [x] Timelock for unstaking
- [x] Emergency pause
- [x] Authority management
- [x] Slippage protection

## 🔧 Commands para IA

### **Testing**
```bash
anchor test           # Run all tests
anchor test --file staking  # Run specific test
```

### **Deployment**
```bash
anchor deploy         # Deploy to cluster
anchor upgrade        # Upgrade existing program
```

### **Debugging**
```bash
solana logs           # Monitor program logs
anchor idl fetch      # Fetch program IDL
```

## 🤖 AI Integration Ready

- ✅ Structured testing framework
- ✅ Debug commands prepared
- ✅ Integration with frontend utilities
- ✅ Mock data for development
- ✅ Error handling and logging
