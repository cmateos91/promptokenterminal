# 🤝 Contributing to PROMPT Staking Terminal

¡Gracias por tu interés en contribuir al proyecto! Este documento te guiará sobre cómo contribuir de manera efectiva.

## 📋 Tabla de Contenidos

1. [Código de Conducta](#código-de-conducta)
2. [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
3. [Setup de Desarrollo](#setup-de-desarrollo)
4. [Process de Contribución](#process-de-contribución)
5. [Estándares de Código](#estándares-de-código)
6. [Testing Guidelines](#testing-guidelines)
7. [Documentación](#documentación)

## 📜 Código de Conducta

Este proyecto adhiere al [Contributor Covenant](https://www.contributor-covenant.org/). Al participar, se espera que mantengas este código de conducta.

### Comportamientos Esperados
- Usa lenguaje constructivo y acogedor
- Respeta diferentes puntos de vista y experiencias
- Acepta críticas constructivas con gracia
- Enfócate en lo que es mejor para la comunidad

## 🚀 ¿Cómo puedo contribuir?

### 🐛 Reportar Bugs

Antes de crear un issue:
1. **Busca** si el bug ya fue reportado
2. **Verifica** que no esté en la lista de problemas conocidos
3. **Usa** el template de bug report

**Información necesaria:**
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots/videos si aplica
- Información del sistema (OS, browser, wallet)

### ✨ Sugerir Features

Para nuevas funcionalidades:
1. **Revisa** el roadmap existente
2. **Describe** el problema que resuelve
3. **Explica** la solución propuesta
4. **Considera** el impacto en móvil y UX

### 🔧 Code Contributions

#### Tipos de Contribuciones Bienvenidas
- **Bug fixes** - Corrección de errores
- **Feature development** - Nuevas funcionalidades
- **Performance improvements** - Optimizaciones
- **Mobile optimization** - Mejoras para móvil
- **Testing** - Nuevos tests o mejoras
- **Documentation** - Mejoras en docs
- **Accessibility** - Mejoras de accesibilidad
- **i18n** - Internacionalización

## 🛠️ Setup de Desarrollo

### Prerequisites

- **Node.js** 18+ 
- **npm** 8+
- **Git**
- **Rust** 1.70+ (para smart contracts)
- **Solana CLI** (para blockchain development)

### Setup Local

```bash
# 1. Fork el repositorio
git clone https://github.com/YOUR_USERNAME/solana-staking-dapp.git
cd solana-staking-dapp

# 2. Setup completo
npm run setup

# 3. Configurar environment
cp .env.example .env
# Editar .env con tus valores

# 4. Instalar dependencies
cd frontend
npm install

# 5. Verificar setup
npm run lint
npm run test:quick
npm run build

# 6. Desarrollo
npm run dev
```

### Estructura de Branches

- **`main`** - Production branch (protegida)
- **`develop`** - Development branch para integración
- **`feature/*`** - Feature branches
- **`fix/*`** - Bug fix branches
- **`docs/*`** - Documentation branches

### Testing en Móvil

```bash
# Obtener IP local
hostname -I | awk '{print $1}'

# Acceder desde móvil: http://[IP]:3000
# Testear en múltiples dispositivos
# Verificar PWA functionality
```

## 🔄 Process de Contribución

### 1. Preparación

```bash
# Crear branch para tu contribución
git checkout -b feature/amazing-feature

# O para bug fixes
git checkout -b fix/issue-description
```

### 2. Desarrollo

1. **Desarrolla** tu feature/fix
2. **Sigue** las convenciones de código
3. **Añade** tests apropiados
4. **Actualiza** documentación si es necesario
5. **Verifica** que todo funciona en móvil

### 3. Testing

```bash
# Lint check
npm run lint:fix

# Unit tests
npm run test:quick

# E2E tests
npm run test:e2e

# Mobile tests específicos
npm run test:e2e:mobile

# Build verification
npm run build
```

### 4. Commit Guidelines

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Formato
<type>(<scope>): <description>

# Ejemplos
feat(wallet): add Backpack wallet support
fix(mobile): resolve touch events on iOS
docs(readme): update installation instructions
test(staking): add edge cases for stake validation
perf(bundle): reduce initial load size by 20KB
style(terminal): improve CRT effect on mobile
```

#### Tipos de Commit
- **feat**: Nueva funcionalidad
- **fix**: Bug fix
- **docs**: Cambios en documentación
- **style**: Formato, sin cambios de lógica
- **refactor**: Refactoring de código
- **test**: Añadir o modificar tests
- **perf**: Mejoras de performance
- **chore**: Mantenimiento, updates de deps

### 5. Pull Request

```bash
# Push tu branch
git push origin feature/amazing-feature

# Crear PR en GitHub
# Usar el template proporcionado
```

#### PR Template

```markdown
## 📋 Descripción
Breve descripción de los cambios realizados.

## 🎯 Tipo de cambio
- [ ] Bug fix (non-breaking change)
- [ ] Nueva funcionalidad (non-breaking change)
- [ ] Breaking change
- [ ] Mejora de documentación

## 📱 Testing en Móvil
- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] Tablet landscape/portrait
- [ ] PWA installation

## ✅ Checklist
- [ ] Código sigue las convenciones del proyecto
- [ ] Self-review completado
- [ ] Tests añadidos/actualizados
- [ ] Tests pasan localmente
- [ ] Documentación actualizada
- [ ] Mobile testing completado
- [ ] Linting sin errores
```

## 🎨 Estándares de Código

### JavaScript/React

```javascript
// Usa arrow functions para components
const Terminal = () => {
  // Hooks al inicio
  const [input, setInput] = useState('');
  const { isMobile } = useTerminal();
  
  // Early returns para condiciones
  if (!isConnected) {
    return <ConnectPrompt />;
  }
  
  // Event handlers con prefijo 'handle'
  const handleSubmit = useCallback((event) => {
    // Implementation
  }, []);
  
  return (
    <div className="terminal-container">
      {/* JSX content */}
    </div>
  );
};

// Exports named por defecto
export default Terminal;
```

### CSS/Styling

```css
/* Mobile-first approach */
.terminal-input {
  /* Base mobile styles */
  font-size: 16px; /* Prevent iOS zoom */
  padding: 12px;
  
  /* Desktop enhancements */
  @media (min-width: 768px) {
    font-size: 14px;
    padding: 8px 12px;
  }
}

/* Touch targets minimum 44px */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Safe area support */
.safe-area {
  padding-left: max(16px, env(safe-area-inset-left));
  padding-right: max(16px, env(safe-area-inset-right));
}
```

### Naming Conventions

- **Files**: camelCase para JS, kebab-case para assets
- **Components**: PascalCase
- **Functions**: camelCase con verbo descriptivo
- **Constants**: SCREAMING_SNAKE_CASE
- **CSS Classes**: kebab-case con BEM si es complejo

## 🧪 Testing Guidelines

### Unit Tests

```javascript
// Describe blocks descriptivos
describe('🎮 Terminal Component', () => {
  describe('Mobile interactions', () => {
    it('should handle touch events correctly', () => {
      // Test implementation
    });
  });
});

// Tests específicos de móvil
describe('📱 Mobile UX', () => {
  it('should prevent zoom on input focus', () => {
    // Mobile-specific test
  });
});
```

### E2E Tests

```javascript
// Mobile-first E2E tests
test('should work on mobile devices', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  
  // Test mobile interactions
  await page.tap('#terminal-input');
  // Assertions...
});
```

### Coverage Requirements

- **Minimum**: 80% lines, branches, functions
- **New features**: 90%+ coverage requerido
- **Mobile components**: Tests específicos obligatorios

## 📚 Documentación

### Code Documentation

```javascript
/**
 * Handles wallet connection with mobile optimization
 * @param {string} walletType - Type of wallet (phantom, solflare, etc.)
 * @param {Object} options - Connection options
 * @param {boolean} options.mobile - Whether this is a mobile connection
 * @returns {Promise<WalletConnection>} Connection result
 */
async function connectWallet(walletType, options = {}) {
  // Implementation
}
```

### README Updates

- Mantener ejemplos actualizados
- Incluir screenshots para nuevas features
- Documentar breaking changes
- Actualizar comandos si aplica

## 🏆 Reconocimiento

Los contribuidores son reconocidos en:
- README principal
- Release notes
- Contributors page

## 🚨 Reportar Problemas de Seguridad

Para issues de seguridad, NO uses GitHub issues. En su lugar:
- Envía email a: security@yourproject.com
- Incluye descripción detallada
- Tiempo de respuesta: 48 horas

## 📞 ¿Preguntas?

- **GitHub Discussions**: Para preguntas generales
- **Discord**: [Link al servidor] (si aplica)
- **Email**: maintainers@yourproject.com

---

**¡Gracias por contribuir al ecosistema Solana! 🚀**

Tu contribución ayuda a hacer el DeFi más accesible y user-friendly para todos.