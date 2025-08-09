# $PROMPT Staking dApp - Terminal Frontend

Terminal retro para hacer staking de tokens $PROMPT con recompensas en cualquier token SPL.

## 🎯 Características del Frontend

### ✨ Terminal Retro Completo
- **Estilo visual**: Verde neón tipo matrix con efectos CRT
- **Historial de comandos**: Navega con ↑/↓
- **Autocompletado**: Presiona TAB para sugerencias
- **Aliases**: Comandos cortos (h=help, c=clear, etc.)
- **Efectos visuales**: Scan lines, glitch, typewriter
- **Sistema de tips**: Consejos automáticos durante inactividad

### 🔧 Comandos Disponibles

#### 🔗 Wallet
- `connect <wallet>` - Conectar wallet (`phantom`/`solflare`)
- `disconnect` - Desconectar wallet
- `balance` - Ver balance de tokens

#### 💰 Staking  
- `stake <amount>` - Hacer staking de $PROMPT
- `unstake <amount>` - Retirar tokens
- `claim` - Reclamar recompensas

#### 📊 Información
- `status` - Estado del staking
- `rewards` - Ver recompensas disponibles
- `apy` - Estadísticas del pool
- `pools` - Pools disponibles

#### 🛠️ Utilidades
- `help` - Lista de comandos
- `about` - Información del protocolo
- `version` - Información del sistema
- `banner` - ASCII art de $PROMPT
- `clear` - Limpiar terminal

#### 🎈 Easter Eggs
- `ping` - Test de latencia
- `whoami` - Información del usuario
- `time` - Hora actual

### 🎮 Controles del Terminal

| Tecla | Función |
|-------|---------|
| `TAB` | Autocompletar comando |
| `↑/↓` | Navegar historial |
| `ESC` | Limpiar input |
| `Ctrl+C` | Interrumpir |
| `Ctrl+L` | Limpiar pantalla |

### 📊 Estadísticas del Sistema

El terminal muestra en tiempo real:
- **UPTIME**: Tiempo activo de la sesión
- **CMDS**: Comandos ejecutados
- **MEM**: Uso de memoria (simulado)
- **PING**: Latencia de red (simulado)

## 🏗️ Arquitectura del Código

### Estructura de Archivos
```
frontend/src/
├── components/
│   ├── Terminal.jsx       # Componente principal
│   └── SystemStats.jsx    # Estadísticas del sistema
├── hooks/
│   └── useTerminal.js     # Lógica del terminal
├── utils/
│   └── commands.js        # Sistema de comandos
├── styles/
│   └── terminal.css       # Estilos retro completos
├── App.jsx               # Aplicación principal
└── main.jsx              # Punto de entrada
```

### Patrones de Diseño Implementados

1. **Custom Hook**: `useTerminal` centraliza la lógica
2. **Command Pattern**: Sistema extensible de comandos
3. **Event System**: Comunicación entre componentes
4. **State Management**: Manejo de historial y sugerencias
5. **Responsive Design**: Adaptable a móviles

### Estado Mock para Desarrollo

El frontend incluye un estado simulado para desarrollo:
- Conexión de wallet ficticia
- Balances y stakes simulados
- Recompensas calculadas dinámicamente
- Estadísticas del sistema en tiempo real

## 🚀 Instalación y Ejecución

```bash
# Instalar dependencias
cd frontend
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview
```

## 🎨 Personalización Visual

### Variables CSS Principales
```css
--prompt-green: #00ff41        /* Verde principal */
--prompt-dark-green: #00cc33   /* Verde oscuro */
--prompt-bright-green: #66ff66 /* Verde brillante */
--terminal-bg: #0a0a0a         /* Fondo negro */
--terminal-bg-secondary: #111111 /* Fondo secundario */
```

### Efectos Visuales
- **Scan Lines**: Líneas horizontales de CRT
- **CRT Effect**: Distorsión de monitor retro
- **Glow Effects**: Resplandor en texto y elementos
- **Glitch Animation**: Efecto de error en comandos fallidos
- **Typewriter**: Animación de escritura en resultados

## 🔧 Próximas Mejoras

1. **Integración con Wallets Reales**
   - Phantom, Solflare, Backpack
   - Detección automática de wallets

2. **Smart Contracts**
   - Conexión con contratos Anchor
   - Transacciones reales de staking

3. **Jupiter Integration**
   - Swaps automáticos de recompensas
   - Selección de tokens SPL

4. **Funcionalidades Avanzadas**
   - Múltiples pools de staking
   - Notificaciones push
   - Historial de transacciones

## 📱 Compatibilidad

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers
- ✅ Modos de accesibilidad
- ✅ High contrast mode
- ✅ Reduced motion support

## 🔒 Consideraciones de Seguridad

- Validación de entrada en comandos
- Sanitización de output
- Rate limiting simulado
- Error handling robusto
- Estados seguros por defecto

---

**Frontend Status**: ✅ **COMPLETADO Y OPTIMIZADO**

Listo para integración con smart contracts y wallets reales.
