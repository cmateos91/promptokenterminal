# 🤖 AI-OPTIMIZED SOLANA STAKING DAPP

**Proyecto optimizado para desarrollo solo + IA | Terminal retro móvil-first**

[![Deploy Status](https://img.shields.io/badge/Deploy-Ready-00ff41?style=for-the-badge)](https://prompterminal.fun)
[![AI Optimized](https://img.shields.io/badge/AI-Optimized-00ff41?style=for-the-badge)](DEVELOPMENT.md)

## 🚀 **INICIO RÁPIDO PARA IA**

### **Setup en 30 segundos**
```bash
cd frontend
npm install
cp ../.env.example .env
npm run dev
```

### **Deploy seguro**
```bash
# Automatizado con validaciones
chmod +x deploy-safe.sh
./deploy-safe.sh
```

### **Helper para desarrollo**
```bash
# Menu interactivo
chmod +x ai-dev-helper.sh
./ai-dev-helper.sh
```

## 🎯 **COMANDOS ESENCIALES**

| Comando | Descripción | Uso |
|---------|-------------|-----|
| `npm run dev` | Desarrollo local | Terminal + mobile |
| `npm run deploy:safe` | Test + Build | Pre-deploy validation |
| `npm run test:quick` | Tests rápidos | CI/CD optimizado |
| `vercel --prod` | Deploy directo | Después de build |

## 🔧 **ESTRUCTURA OPTIMIZADA**

```
solana-staking-dapp/
├── 📱 frontend/           # Aplicación principal
│   ├── src/
│   │   ├── utils/         # Lógica modular
│   │   ├── components/    # React components
│   │   └── hooks/         # Custom hooks
│   ├── dist/              # Build output
│   └── package.json       # Dependencies
├── 🚀 vercel.json         # Deploy config
├── 📋 DEVELOPMENT.md      # Guía para IA
├── 🤖 ai-dev-helper.sh    # Menu interactivo
└── 🛡️ deploy-safe.sh      # Deploy con validaciones
```

## 🤖 **COMANDOS ESPECÍFICOS PARA IA**

### **En el terminal de la dApp:**
```bash
# Debug info para IA
ai status              # Estado del sistema para IA
ai export              # Exportar logs para análisis
ai debug               # Info de debugging
ai logs                # Logs recientes para análisis

# Diagnósticos
debug system           # Info completa del sistema
logs recent            # Logs de últimos 5 minutos
export ai              # Exportar todo para IA
health                 # Health check completo
```

### **En la terminal del sistema:**
```bash
# Helper interactivo
./ai-dev-helper.sh     # Menu con todas las opciones

# Comandos directos
npm run test:quick     # Tests rápidos
npm run lint:fix       # Auto-fix de código
./deploy-safe.sh       # Deploy con validaciones
```

## 📱 **TESTING MÓVIL**

```bash
# Obtener IP para testing
hostname -I | awk '{print $1}'

# URLs de testing
# Local: http://localhost:3000
# Red: http://[TU_IP]:3000
# Prod: https://prompterminal.fun
```

## 🔍 **DEBUGGING PARA IA**

### **Activar modo debug:**
```javascript
// En browser console
localStorage.setItem('debug', 'true');
localStorage.setItem('performance', 'true');
```

### **Exportar datos para IA:**
```bash
# En terminal dApp
export ai              # Exporta logs + estado completo

# En terminal sistema
./ai-dev-helper.sh     # Opción 8: Export Logs for AI
```

### **Estructura de logs para IA:**
- **Component logs**: wallet, command, rpc, terminal
- **Performance logs**: con métricas de timing
- **Error logs**: con stack traces completos
- **Security logs**: eventos de seguridad

## ⚡ **VARIABLES DE ENTORNO**

### **Development (.env)**
```bash
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_PROMPT_TOKEN_MINT=5gusfEv5k4jR32Nnj92ftqj8u4deKk8KxCUZudZcnWxF
VITE_MINIMUM_TOKEN_BALANCE=500
VITE_DEBUG_MODE=true
```

### **Production (Vercel Dashboard)**
```bash
VITE_SOLANA_NETWORK=mainnet-beta
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_PROMPT_TOKEN_MINT=[TOKEN_MAINNET]
VITE_MINIMUM_TOKEN_BALANCE=1000
VITE_DEBUG_MODE=false
```

## 🚨 **TROUBLESHOOTING RÁPIDO**

| Problema | Solución |
|----------|----------|
| Build falla | `npm run lint:fix && npm run build` |
| Deploy ERROR | Verificar vercel.json + variables env |
| Wallet no conecta | Probar en browser de wallet |
| Mobile no funciona | Verificar IP y puerto 3000 |
| Tests fallan | `npm run test:quick` y revisar errors |

## 🔧 **WORKFLOW OPTIMIZADO**

### **Desarrollo diario:**
1. `npm run dev` - Desarrollo local
2. Hacer cambios + probar
3. `npm run deploy:safe` - Deploy cuando funcione
4. Para debugging: usar comandos `ai` en terminal

### **Deploy a producción:**
1. `./deploy-safe.sh` - Deploy automatizado
2. Verifica en Vercel dashboard
3. Test en móvil real

### **Análisis con IA:**
1. `ai export` en terminal dApp
2. `./ai-dev-helper.sh` → opción 8
3. Compartir logs exportados con IA

## 📊 **MÉTRICAS CLAVE**

- **Bundle size**: < 500KB (optimizado)
- **Load time**: < 3s mobile
- **Test coverage**: Funcional
- **Deploy time**: < 2 minutos
- **Mobile score**: 95+ Lighthouse

## 🎯 **PRÓXIMOS PASOS RECOMENDADOS**

1. **✅ COMPLETADO** - Estructura optimizada para IA
2. **✅ COMPLETADO** - Scripts de deploy automatizados  
3. **✅ COMPLETADO** - Logging avanzado para debugging
4. **🔄 SIGUIENTE** - Añadir más tests unitarios
5. **🔄 SIGUIENTE** - Implementar smart contracts reales
6. **🔄 SIGUIENTE** - Optimizar performance bundle

## 🤝 **SUPPORT PARA IA**

- 📋 **Logs estructurados** con timestamps y contexto
- 🔍 **Debug commands** específicos para análisis  
- 📤 **Export functions** para compartir con IA
- 🏥 **Health checks** automatizados
- 📱 **Mobile testing** simplificado

---

## 🔗 **Links Rápidos**

| Link | Descripción |
|------|-------------|
| 🌐 [Live Demo](https://prompterminal.fun) | App en producción |
| 📋 [Development Guide](DEVELOPMENT.md) | Guía completa para IA |
| 🐛 [Debug Commands](frontend/src/utils/commands/diagnostics.js) | Comandos de debugging |
| ⚙️ [Config Files](vercel.json) | Configuración deploy |

**🚀 ¡Proyecto listo para desarrollo solo + IA!**
