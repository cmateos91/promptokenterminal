# 🚀 PROMPT Staking Terminal

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/solana-staking-dapp)
[![Mobile Optimized](https://img.shields.io/badge/Mobile-Optimized-00ff41?style=flat-square)](#mobile-optimization)
[![Lighthouse Score](https://img.shields.io/badge/Lighthouse-95%2B-00ff41?style=flat-square)](#performance)

> **Terminal retro mobile-first para staking de tokens $PROMPT en Solana**

Un terminal interactivo inspirado en la estética cyberpunk, completamente optimizado para móvil, que permite hacer staking de tokens $PROMPT con integración real de wallets Solana.

## ✨ Características Principales

### 🎮 **Terminal Retro Interactivo**
- Interfaz de terminal cyberpunk con efectos CRT
- Comandos interactivos con autocompletado
- Sistema de progresión y logros gamificado
- Eastereggs y mini-juegos integrados

### 📱 **Mobile-First Design**
- **100% Responsive** desde 320px hasta 4K
- **Touch-optimized** con áreas táctiles de 44px mínimo
- **PWA ready** - instalable como app nativa
- **Virtual keyboard** manejo inteligente iOS/Android
- **Safe areas** soporte para notch/dynamic island

### 🔗 **Integración Blockchain Real**
- **Multi-wallet support**: Phantom, Solflare, Backpack
- **SPL Token gating** con verificación de balances real
- **Multi-RPC failover** para conexiones confiables
- **Smart contracts** en Rust/Anchor (en desarrollo)

### ⚡ **Performance Optimizado**
- **Bundle size**: < 500KB (145KB gzipped)
- **First Paint**: < 2s
- **Interactive**: < 3s
- **Lighthouse score**: 95+ móvil, 98+ desktop

## 🚀 Quick Start

### Desarrollo Local

```bash
# Clonar repositorio
git clone https://github.com/yourusername/solana-staking-dapp.git
cd solana-staking-dapp

# Setup completo
npm run setup

# Configurar environment
cp .env.example .env
# Editar .env con tus valores

# Desarrollo con hot reload
cd frontend
npm run dev

# Acceso local: http://localhost:3000
# Red local: http://[TU_IP]:3000 (para testing móvil)
```

### Deployment One-Click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/solana-staking-dapp)

## 🎯 Demo y Comandos

### 🌐 Live Demo
[**https://your-deployment-url.vercel.app**](https://your-deployment-url.vercel.app)

### 🎮 Comandos Principales

| Categoría | Comando | Descripción |
|-----------|---------|-------------|
| **Wallet** | `connect phantom` | Conectar wallet móvil/desktop |
| | `balance` | Ver balance SOL + tokens SPL |
| | `disconnect` | Desconectar wallet |
| **Staking** | `stake 100` | Hacer staking de tokens PROMPT |
| | `unstake 50` | Retirar tokens del staking |
| | `claim` | Reclamar recompensas |
| | `status` | Estado del staking y estadísticas |
| **Info** | `help` | Lista de todos los comandos |
| | `about` | Información del protocolo |
| | `apy` | Statistics y APY del pool |
| **Fun** | `flip` | Lanzar una moneda |
| | `snake` | Jugar Snake en terminal |
| | `banner` | ASCII art PROMPT |

## 🏗️ Arquitectura del Proyecto

```
solana-staking-dapp/
├── 📱 frontend/                # React app principal
│   ├── src/
│   │   ├── components/         # Terminal + SystemStats
│   │   ├── utils/commands/     # Sistema modular de comandos
│   │   ├── services/           # Integración blockchain
│   │   └── __tests__/          # Test suite completo
│   ├── public/                 # Assets y PWA manifest
│   └── package.json            # Dependencies y scripts
├── 🔧 contracts/               # Smart contracts Rust/Anchor
│   ├── programs/staking/       # Programa principal de staking
│   └── tests/                  # Tests de contratos
├── 📚 docs/                    # Documentación técnica
│   ├── ARCHITECTURE.md         # Arquitectura del sistema
│   ├── API.md                  # Documentación de API
│   └── DEPLOYMENT-GUIDE.md     # Guía de deployment
└── 🤖 CLAUDE.md                # Documentación para IA
```

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** + **Vite 5** - Build system ultra-rápido
- **Mobile-First CSS** - Diseño responsive desde 320px
- **PWA** - Service Worker + Manifest
- **Solana Web3.js** - Integración blockchain

### Blockchain
- **Solana** - Blockchain de alta performance
- **Anchor Framework** - Smart contracts en Rust
- **SPL Tokens** - Token estándar de Solana
- **Multi-RPC** - Failover automático de endpoints

### Testing & Quality
- **Vitest** - Unit testing ultrarrápido
- **Playwright** - E2E testing cross-browser
- **ESLint** - Linting y calidad de código
- **Coverage** - Métricas de cobertura

### Deployment
- **Vercel** - Edge deployment
- **GitHub Actions** - CI/CD pipeline
- **Environment Variables** - Configuración segura

## 🔐 Configuración

### Variables de Entorno

Crea `.env` en el directorio `frontend/`:

```bash
# Network Configuration
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com

# Token Configuration
VITE_PROMPT_TOKEN_MINT=5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF
VITE_MINIMUM_TOKEN_BALANCE=500

# Optional: Custom RPC for better performance
# VITE_SOLANA_RPC_URL=https://your-private-rpc.com
```

### Configuración por Red

**DEVNET (Testing):**
```bash
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
```

**MAINNET (Production):**
```bash
VITE_SOLANA_NETWORK=mainnet
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
# Actualizar VITE_PROMPT_TOKEN_MINT al address de mainnet
```

## 📱 Mobile Optimization

### Características Mobile-First
- **Touch targets**: 44px mínimo según guidelines de Apple/Google
- **Viewport handling**: Safe areas para dispositivos con notch
- **Keyboard management**: Scroll automático cuando aparece teclado virtual
- **Performance**: Bundle splitting y lazy loading
- **Gestures**: Soporte nativo para touch events

### Testing Local

```bash
# Testing completo local
cd frontend
npm run lint:fix         # Calidad de código
npm run test:quick       # Tests unitarios
npm run build           # Verificar build
npm run preview         # Test de producción

# Testing móvil
hostname -I | awk '{print $1}'
# Acceder desde móvil: http://[IP]:3000
```

## 🧪 Testing

### Scripts de Testing

```bash
# Unit tests rápidos
npm run test:quick

# Tests con coverage
npm run test:coverage

# E2E tests (todos los browsers)
npm run test:e2e

# E2E tests solo móvil
npm run test:e2e:mobile

# Suite completa
npm run test:all
```

### Coverage Targets
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## 🚀 Deployment

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy desde directorio raíz
vercel --prod

# Configurar variables de entorno en Vercel Dashboard
```

### Variables en Vercel

Configurar en Vercel Dashboard → Settings → Environment Variables:
- `VITE_SOLANA_NETWORK`
- `VITE_SOLANA_RPC_URL`
- `VITE_PROMPT_TOKEN_MINT`
- `VITE_MINIMUM_TOKEN_BALANCE`

### Manual Deploy

Deploy manualmente cuando esté listo:
```bash
vercel --prod
```

## 🛡️ Seguridad

### Características de Seguridad
- ✅ **Input validation** - Sanitización completa de entradas
- ✅ **Rate limiting** - Protección contra spam de comandos
- ✅ **XSS prevention** - Sanitización de output
- ✅ **Token verification** - Verificación real de balances SPL
- ✅ **Error boundaries** - Manejo robusto de errores
- ✅ **Security headers** - XSS y clickjacking protection

### Consideraciones para Producción
- Usar RPCs privados para operaciones críticas
- Implementar autenticación adicional si es necesario
- Monitorear analytics para detectar abuso
- Audit de smart contracts antes de mainnet

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor revisa [CONTRIBUTING.md](CONTRIBUTING.md) para guidelines.

### Development Flow

1. Fork el repositorio
2. Crear branch para tu feature: `git checkout -b feature/amazing-feature`
3. Hacer testing en múltiples dispositivos
4. Commit con mensajes descriptivos: `git commit -m "feat: add amazing feature"`
5. Push y crear Pull Request

### Issues y Bugs

Reporta bugs y solicita features en [GitHub Issues](https://github.com/yourusername/solana-staking-dapp/issues).

## 📄 License

Este proyecto está bajo la MIT License. Ver [LICENSE](LICENSE) para detalles.

## 🏆 Roadmap

### ✅ v1.0 (Actual)
- [x] Terminal mobile-first completamente funcional
- [x] Integración real con wallets Solana
- [x] Sistema de token gating con SPL
- [x] PWA con performance optimizada
- [x] Suite completa de testing

### 🔄 v1.1 (Próximo)
- [ ] Smart contracts Anchor en mainnet
- [ ] Staking real funcional
- [ ] Sistema de recompensas
- [ ] Integración con Jupiter (swaps)

### 📋 v2.0 (Futuro)
- [ ] App móvil nativa (React Native)
- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] DAO governance
- [ ] AI trading assistant

## 📞 Support

- 🐛 **Bugs**: [GitHub Issues](https://github.com/yourusername/solana-staking-dapp/issues)
- 💬 **Discusiones**: [GitHub Discussions](https://github.com/yourusername/solana-staking-dapp/discussions)
- 📧 **Contacto**: your-email@example.com
- 🐦 **Twitter**: [@yourhandle](https://twitter.com/yourhandle)

---

**🎯 Made with ❤️ for the Solana community**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GitHub Stars](https://img.shields.io/github/stars/yourusername/solana-staking-dapp.svg)](https://github.com/yourusername/solana-staking-dapp/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/yourusername/solana-staking-dapp.svg)](https://github.com/yourusername/solana-staking-dapp/network)