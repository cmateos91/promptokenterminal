# PROMPToken Staking dApp

**Terminal retro para staking de tokens $PROMPT con recompensas en cualquier token SPL**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cmateos91/PROMPToken)

## 🎮 Demo

Terminal estilo retro con:

- Conexión multi-wallet (Phantom, Solflare, Backpack, Ledger)
- Sistema de comandos extensible (15+ comandos)
- Verificación automática de balance de tokens SPL
- Efectos visuales: CRT, scan lines, glitch
- Estadísticas del sistema en tiempo real

## 🚀 Quick Start

```bash
git clone https://github.com/cmateos91/PROMPToken.git
cd PROMPToken
npm run setup
cp .env.example .env
npm run dev
```

Visita [http://localhost:3000](http://localhost:3000)

## 🛠️ Stack Tecnológico

- **Frontend**: React + Vite
- **Blockchain**: Solana
- **Wallets**: @solana/wallet-adapter
- **Smart Contracts**: Anchor Framework (próximamente)
- **Deployment**: Vercel

## 📋 Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_PROMPT_TOKEN_MINT=your_token_mint_address
VITE_MINIMUM_TOKEN_BALANCE=100
```

## 🎯 Comandos del Terminal

| Comando               | Descripción                                |
| --------------------- | ------------------------------------------ |
| `help`                | Lista todos los comandos disponibles       |
| `connect <wallet>`    | Conecta wallet (phantom/solflare/backpack) |
| `disconnect`          | Desconecta wallet actual                   |
| `balance`             | Muestra balance de SOL y tokens            |
| `stake <amount>`      | Inicia proceso de staking                  |
| `unstake <amount>`    | Retira tokens del staking                  |
| `rewards`             | Ver recompensas acumuladas                 |
| `status`              | Estado actual del staking                  |
| `history`             | Historial de transacciones                 |
| `clear`               | Limpia el terminal                         |
| `theme <color>`       | Cambia color del terminal                  |
| `alias <n> <command>` | Crea alias de comandos                     |

## 📁 Estructura del Proyecto

```
PROMPToken/
├── frontend/              # React + Vite app
│   ├── src/
│   │   ├── components/    # Terminal y SystemStats
│   │   ├── hooks/         # useTerminal hook personalizado
│   │   ├── utils/         # Sistema de comandos modular
│   │   ├── config/        # Configuración de Solana
│   │   └── styles/        # CSS retro completo
│   ├── package.json
│   └── vite.config.js
├── backend/               # API endpoints (próximamente)
├── contracts/             # Smart contracts Anchor (próximamente)
├── .env.example           # Template de variables de entorno
├── package.json           # Workspace root
└── README.md
```

## 🔧 Development

### Prerequisitos

- Node.js >= 16.0.0
- npm >= 8.0.0

### Setup local

```bash
# Clonar repositorio
git clone https://github.com/cmateos91/PROMPToken.git
cd PROMPToken

# Instalar dependencias
npm run setup

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🚀 Deployment en Vercel

### Opción 1: Deploy automático

1. Fork este repositorio
2. Conecta tu GitHub con Vercel
3. Importa el repositorio
4. Configura las variables de entorno en Vercel
5. Deploy automático

### Opción 2: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Variables de entorno en Vercel

Configura estas variables en tu dashboard de Vercel:

- `VITE_SOLANA_NETWORK`
- `VITE_SOLANA_RPC_URL`
- `VITE_PROMPT_TOKEN_MINT`
- `VITE_MINIMUM_TOKEN_BALANCE`

## 🔐 Seguridad

- ✅ Variables de entorno para configuración sensible
- ✅ Verificación de balance mínimo de tokens
- ✅ Validación de direcciones de wallet
- ✅ Polyfills seguros para navegador
- ⏳ Auditoría de smart contracts (próximamente)

## 🤝 Contributing

1. Fork el repositorio
2. Crea una branch para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la branch (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 License

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🐛 Issues

¿Encontraste un bug? [Abre un issue](https://github.com/cmateos91/PROMPToken/issues)

## 🔮 Roadmap

### ✅ Completado

- [x] Terminal retro funcional
- [x] Integración multi-wallet
- [x] Verificación de tokens SPL
- [x] Sistema de comandos extensible
- [x] Deploy en Vercel

### 🔄 En Desarrollo

- [ ] Smart contracts Anchor
- [ ] Funcionalidad de staking real
- [ ] Integración con Jupiter Aggregator
- [ ] Sistema de recompensas

### 📋 Próximo

- [ ] Tests unitarios
- [ ] Auditoría de seguridad
- [ ] Mainnet deployment
- [ ] Documentación avanzada

---

**¿Preguntas?** Abre un [issue](https://github.com/cmateos91/PROMPToken/issues) o contacta al equipo.
