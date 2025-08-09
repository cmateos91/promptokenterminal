# Development Guide - $PROMPT Staking dApp

## 🛠️ Arquitectura del Proyecto

### Estructura de Directorios
```
solana-staking-dapp/
├── frontend/                 # React + Vite App
│   ├── src/
│   │   ├── components/       # Terminal, SystemStats
│   │   ├── hooks/            # useTerminal hook personalizado
│   │   ├── utils/            # Sistema de comandos modular
│   │   ├── config/           # Configuración de Solana
│   │   ├── styles/           # CSS retro completo
│   │   ├── polyfills.js      # Polyfills para Node.js modules
│   │   └── main.jsx          # Entry point
│   ├── public/               # Assets estáticos
│   ├── package.json
│   └── vite.config.js        # Configuración optimizada
├── backend/                  # API endpoints (próximamente)
├── contracts/                # Smart contracts Anchor (próximamente)
├── docs/                     # Documentación
├── .github/workflows/        # CI/CD automático
├── .env.example              # Template de variables
├── vercel.json               # Configuración de Vercel
└── package.json              # Workspace root
```

## 💻 Setup Local

### Prerequisitos
- Node.js >= 16.0.0
- npm >= 8.0.0
- Git

### Instalación
```bash
# Clonar repo
git clone https://github.com/your-username/solana-staking-dapp.git
cd solana-staking-dapp

# Setup automático
chmod +x setup.sh
./setup.sh

# O manual
npm run setup
cp .env.example .env
```

### Development
```bash
# Desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Limpiar todo
npm run clean
```

## 🧩 Sistema de Comandos

### Estructura Modular
Los comandos están organizados en `frontend/src/utils/commands/`:

```javascript
// commands/index.js
export const commands = {
  help: helpCommand,
  connect: connectCommand,
  stake: stakeCommand,
  // ... más comandos
}

// Cada comando es una función async
const stakeCommand = async (args, context) => {
  const { walletAdapter, setSystemState } = context;
  // Lógica del comando
  return "Resultado del comando";
}
```

### Crear Nuevos Comandos

1. **Crear archivo del comando:**
```javascript
// frontend/src/utils/commands/myCommand.js
export const myCommand = async (args, context) => {
  // args: array de argumentos del comando
  // context: { walletAdapter, systemState, setSystemState }
  
  if (!args.length) {
    return "Error: Se requiere un argumento";
  }
  
  try {
    // Tu lógica aquí
    return "✅ Comando ejecutado correctamente";
  } catch (error) {
    return `❌ Error: ${error.message}`;
  }
}
```

2. **Registrar en index.js:**
```javascript
// frontend/src/utils/commands/index.js
import { myCommand } from './myCommand.js';

export const commands = {
  // ... comandos existentes
  mycmd: myCommand,
  // aliases
  mc: myCommand
}
```

### Context Available
- `walletAdapter`: Solana wallet connection
- `systemState`: Estado actual del sistema
- `setSystemState`: Función para actualizar estado

## 🎨 Theming y Estilos

### CSS Variables
```css
/* frontend/src/styles/terminal.css */
:root {
  --primary-color: #00ff00;    /* Verde terminal */
  --bg-color: #000000;         /* Fondo negro */
  --text-color: #00ff00;       /* Texto verde */
  --error-color: #ff0000;      /* Errores rojos */
  --warning-color: #ffff00;    /* Warnings amarillos */
}
```

### Temas Personalizados
```javascript
// Comando theme para cambiar colores
const themeCommand = async (args) => {
  const colors = {
    green: '#00ff00',
    blue: '#0088ff',
    purple: '#8800ff',
    amber: '#ffaa00'
  }
  
  if (colors[args[0]]) {
    document.documentElement.style.setProperty('--primary-color', colors[args[0]]);
    return `✅ Tema cambiado a ${args[0]}`;
  }
}
```

## 🔗 Integración con Solana

### Configuración de Red
```javascript
// frontend/src/config/solana.js
export const SOLANA_CONFIG = {
  network: import.meta.env.VITE_SOLANA_NETWORK,
  rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL,
  promptTokenMint: import.meta.env.VITE_PROMPT_TOKEN_MINT,
  minimumBalance: parseInt(import.meta.env.VITE_MINIMUM_TOKEN_BALANCE)
}
```

### Wallet Connection
```javascript
// Usar en comandos
const connectCommand = async (args, { walletAdapter }) => {
  try {
    await walletAdapter.connect();
    return "✅ Wallet conectada";
  } catch (error) {
    return `❌ Error: ${error.message}`;
  }
}
```

## 🔧 Performance y Optimización

### Bundle Analysis
```bash
# Analizar bundle size
npm run build
ls -la frontend/dist/assets/
```

### Chunks Configurados
- `vendor`: React, React-DOM
- `solana`: @solana/web3.js, @solana/spl-token
- Resto: código de la app

### Polyfills Optimizados
Solo carga polyfills necesarios para Solana en browser:
- Buffer
- Stream
- Crypto
- Events
- Util

## 🧪 Testing (Próximamente)

### Setup de Tests
```bash
npm install --save-dev vitest @testing-library/react
```

### Estructura de Tests
```
frontend/src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── commands/
```

## 🚀 CI/CD Pipeline

### GitHub Actions
- Build automático en PRs
- Deploy automático a Vercel en main
- Tests automáticos (cuando se implementen)

### Secrets Requeridos
```bash
# En GitHub repo settings
VERCEL_TOKEN=tu_token_de_vercel
VERCEL_ORG_ID=tu_org_id
VERCEL_PROJECT_ID=tu_project_id
VITE_PROMPT_TOKEN_MINT=direccion_del_token
```

## 🔍 Debugging

### Console Logs
```javascript
// En desarrollo, logs habilitados
if (import.meta.env.DEV) {
  console.log('Debug info:', data);
}
```

### Network Issues
```javascript
// Verificar conexión a Solana
const connection = new Connection(SOLANA_CONFIG.rpcUrl);
const health = await connection.getHealth();
console.log('Solana RPC health:', health);
```

## 📦 Dependencies

### Core Dependencies
- `react` - UI framework
- `@solana/web3.js` - Solana interaction
- `@solana/spl-token` - Token operations
- `buffer` - Node.js Buffer polyfill

### Dev Dependencies
- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin

## 🔮 Próximas Features

### Smart Contracts
```bash
# Setup Anchor framework
anchor init contracts
cd contracts
anchor build
anchor deploy
```

### Backend API
```bash
# Express.js server
mkdir backend/src
# JWT auth, rate limiting, caching
```

### Advanced Terminal Features
- Command history persistente
- Custom keybindings
- Plugin system
- Multi-tab support

---

**🎯 El frontend está 100% optimizado para desarrollo y producción. Listo para agregar smart contracts.**
