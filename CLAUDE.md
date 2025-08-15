# 🚀 PROMPT Staking Terminal - Documentación para Claude Code

## 📋 Información del Proyecto

**Proyecto:** PROMPT Staking Terminal
**Tipo:** DApp de staking en Solana con interfaz terminal retro
**Estado:** Desarrollo avanzado, optimizado para móvil, listo para deployment
**Frontend:** React 18 + Vite 5, completamente responsive y mobile-first

## 🎯 Objetivo Principal

Terminal retro optimizado para móvil que permite staking de tokens $PROMPT con:
- ✅ Integración real con wallets (Phantom, Solflare, Backpack)
- ✅ Sistema de token gating con balances SPL reales
- ✅ Interfaz 100% responsive y touch-optimizada
- ✅ PWA instalable como app nativa
- ✅ Performance < 500KB bundle, carga < 3s

## 🏗️ Arquitectura del Proyecto

### Estructura Principal
```
/
├── frontend/           # React SPA principal (directorio de trabajo)
├── contracts/         # Smart contracts Rust/Anchor (en desarrollo)
├── docs/              # Documentación técnica completa
└── scripts/           # Scripts de deployment y setup
```

### Frontend (Directorio Principal)
```
frontend/src/
├── components/        # Terminal.jsx, SystemStats.jsx
├── hooks/            # useTerminal.js (hook principal)
├── utils/            # Sistema modular de comandos y servicios
│   ├── commands/     # Comandos organizados por categoría
│   ├── solana.js     # Multi-RPC con fallbacks
│   ├── tokenGate.js  # Sistema de verificación SPL
│   └── security.js   # Validaciones y rate limiting
├── services/         # stakingContract.js, stakingContractReal.js
├── styles/           # terminal.css (mobile-first)
└── __tests__/        # Suite completa de tests
```

## 🔧 Comandos de Desarrollo

### Setup y Desarrollo
```bash
# Trabajar siempre desde el directorio frontend/
cd frontend/

# Desarrollo con hot reload
npm run dev                    # Local + red (0.0.0.0:3000)

# Testing
npm run lint                   # ESLint con 0 warnings
npm run test:quick             # Tests rápidos
npm run test:e2e               # Tests E2E con Playwright
npm run test:all               # Suite completa

# Build y Deploy
npm run build                  # Build optimizado
npm run deploy:safe            # Test + Build
```

### Scripts de Lint y Fix
```bash
# Siempre ejecutar desde frontend/
npm run lint                   # Verificar errores
npm run lint:fix               # Auto-fix errores corregibles
```

## 🧪 Testing

### Configuración Actual
- **Unit Tests:** Vitest + Testing Library
- **E2E Tests:** Playwright (Chrome, Mobile Chrome, Mobile Safari)
- **Coverage:** Configurado con thresholds
- **Mock System:** Wallets, RPC, contratos

### Estado de Tests
- ⚠️ **15 tests fallando** - Requieren corrección urgente
- ✅ **85 tests pasando** - Base sólida
- 🎯 **Errores principales:** Validaciones de balance, mocks de RPC

## 🔍 Errores Conocidos a Corregir

### Linting (154 problemas)
1. **Variables no usadas:** imports innecesarios en servicios
2. **Curly braces:** if statements sin llaves en games.js, staking.js
3. **Console statements:** warnings de console.log en producción
4. **Prefer const:** variables que deberían ser const

### Tests Críticos
1. **RPC_URL undefined:** Variable de entorno no definida en tests
2. **Balance validation:** Lógica de validación de balances incorrecta
3. **Mock functions:** Servicios de staking sin métodos requeridos

## 📱 Optimización Móvil

### Características Mobile-First
- **Touch targets:** 44px mínimo
- **Safe areas:** Soporte para notch/dynamic island
- **Virtual keyboard:** Manejo inteligente iOS/Android
- **PWA:** Manifest + Service Worker
- **Performance:** Bundle < 500KB, Core Web Vitals optimizados

### CSS Architecture
```css
/* Mobile-first approach */
:root {
  --touch-target-size: 44px;
  --mobile-padding: 16px;
  --terminal-height-mobile: calc(100vh - env(safe-area-inset-bottom));
}

/* Prevent iOS zoom */
input {
  font-size: max(16px, var(--font-size-mobile));
}
```

## 🔐 Configuración de Environment

### Variables Requeridas (.env)
```bash
# Red (devnet/mainnet)
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com

# Token Gating
VITE_PROMPT_TOKEN_MINT=5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF
VITE_MINIMUM_TOKEN_BALANCE=500
```

## 🚀 Deployment

### Vercel (Configurado)
- **Auto-deploy:** Push a main branch
- **Environment:** Variables configuradas en dashboard
- **Build:** `npm run build` desde frontend/
- **PWA:** Soporte completo con vite-plugin-pwa

### Performance Targets
- **First Paint:** < 2s
- **Interactive:** < 3s
- **Bundle Size:** 462KB total (145KB gzipped)
- **Lighthouse:** 95+ móvil, 98+ desktop

## 🛡️ Seguridad

### Implementado
- ✅ Input validation y sanitización
- ✅ Rate limiting por comando
- ✅ XSS prevention
- ✅ Token gating con verificación real
- ✅ Error boundaries y manejo robusto

### Headers de Seguridad (Vercel)
```json
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block"
}
```

## 🎮 Sistema de Comandos

### Categorías Principales
- **Wallet:** connect, disconnect, balance, walletinfo
- **Staking:** stake, unstake, claim, status, rewards
- **Info:** help, about, apy, profile, price
- **System:** clear, banner, health, performance
- **Games:** flip, dice, snake, arkanoid, pong
- **Diagnostics:** debug, logs (para AI debugging)

### Patrón de Comandos
```javascript
// Estructura estándar de comando
export async function commandName(args) {
  // 1. Validación de argumentos
  // 2. Verificación de permisos/token gating
  // 3. Lógica de negocio
  // 4. Logging para AI
  // 5. Retorno estructurado { type, content }
}
```

## 🤖 Características para IA

### Logging y Debugging
- **devLogger:** Sistema completo de logs categorizados
- **Performance tracking:** Métricas de comandos y operaciones
- **Error contexts:** Información detallada para debugging
- **Command analytics:** Tracking de uso para optimización

### Comandos de Debug
```bash
debug wallet                   # Info detallada de wallet
debug contract                 # Estado de contratos
health                        # Health check completo
performance                   # Métricas de rendimiento
logs <filter>                 # Logs filtrados
```

## 📚 Documentación Técnica

### Archivos de Referencia
- `docs/ARCHITECTURE.md` - Arquitectura completa del sistema
- `docs/API.md` - Documentación de API y contratos
- `docs/DEPLOYMENT-GUIDE.md` - Guía de deployment
- `MOBILE-OPTIMIZATION.md` - Optimización móvil detallada

### Estado de Smart Contracts
- **Ubicación:** `contracts/programs/staking/`
- **Framework:** Anchor (Rust)
- **Estado:** Estructura base implementada, pruebas pendientes
- **Deployment:** Scripts configurados para devnet

## ⚡ Próximos Pasos Críticos

### Prioridad Alta
1. **Corregir linting errors** - Eliminar 154 problemas
2. **Arreglar tests fallidos** - 15 tests críticos
3. **Completar mocks** - RPC y servicios de staking
4. **Validar environment** - Variables de entorno en tests

### Prioridad Media
1. **Smart contracts testing** - Integración con Anchor
2. **E2E wallet flows** - Tests de wallet completos
3. **Performance optimization** - Bundle analysis
4. **Security audit** - Revisión de vulnerabilidades

## 🎯 Información para Trabajo con IA

### Contexto Clave
- **Directorio de trabajo:** Siempre `frontend/`
- **Stack principal:** React 18 + Vite + Solana Web3.js
- **Patrón de desarrollo:** Mobile-first, progressive enhancement
- **Testing approach:** TDD con mocks comprehensivos
- **Deploy target:** Vercel con auto-deploy

### Comandos Críticos a Recordar
```bash
cd frontend/                   # SIEMPRE trabajar desde aquí
npm run lint:fix              # Corregir errores antes de commit
npm run test:quick            # Verificar tests después de cambios
npm run build                 # Verificar build antes de deploy
```

### Archivos Críticos No Modificar
- `package.json` - Scripts y dependencias estables
- `vite.config.js` - Configuración optimizada
- `vercel.json` - Deploy configurado
- `.env.example` - Template de configuración

---

**Última actualización:** $(date)
**Estado del proyecto:** Desarrollo avanzado - Listo para corrección de errores y deployment
**Próximo milestone:** Corrección de tests y linting → Production ready