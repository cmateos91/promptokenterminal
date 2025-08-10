# 🤖 DESARROLLO CON IA - Comandos Rápidos

## 🚀 Setup Inicial
```bash
cd frontend
npm install
cp ../.env.example .env
npm run dev
```

## 📱 Testing Local en Móvil
```bash
# Obtener IP local
hostname -I | awk '{print $1}'
# Acceder desde móvil: http://[TU_IP]:3000
```

## 🔧 Comandos de Desarrollo
```bash
# Desarrollo con hot reload
npm run dev

# Build y verificación
npm run deploy:safe

# Tests rápidos
npm run test:quick

# Lint automático
npm run lint:fix

# Deploy a producción
cd .. && vercel --prod
```

## 🐛 Debug
```bash
# Activar debug mode
localStorage.setItem('debug', 'true')

# Ver performance
localStorage.setItem('performance', 'true')

# Comandos de debug en terminal:
debug wallet
debug performance
logs wallet
health
```

## 📦 Estructura Crítica para IA
```
frontend/src/
├── utils/commands/    # Un comando por archivo
├── utils/config.js    # Configuración centralizada
├── utils/security.js  # Validaciones y rate limiting
├── hooks/            # Custom hooks
└── components/       # Componentes React
```

## 🔒 Variables de Entorno Críticas
- VITE_SOLANA_NETWORK (devnet/mainnet-beta)
- VITE_SOLANA_RPC_URL
- VITE_PROMPT_TOKEN_MINT
- VITE_MINIMUM_TOKEN_BALANCE

## ⚡ Optimización Mobile
- Touch events: 44px min touch targets
- Viewport: safe-area-inset para notch
- Performance: < 500KB bundle
- PWA: manifest.json + service worker

## 🚨 Deployment Checklist
- [ ] npm run test:quick
- [ ] npm run build exitoso
- [ ] Variables env en Vercel
- [ ] vercel --prod
- [ ] Test en móvil real
