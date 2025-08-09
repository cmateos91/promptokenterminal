# Deployment Guide - $PROMPT Staking dApp

## 🚀 Vercel Deployment (Recomendado)

### Método 1: Import desde GitHub (Automático)

1. **Fork el repositorio** en tu cuenta de GitHub

2. **Conecta Vercel con GitHub:**
   - Ve a [vercel.com](https://vercel.com)
   - "Import Project" → Selecciona tu fork
   - Framework Preset: **Vite** (auto-detectado)
   - Root Directory: **/** (raíz del proyecto)
   - Build Command: `npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm run setup`

3. **Configura Variables de Entorno en Vercel:**
   ```
   VITE_SOLANA_NETWORK=devnet
   VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
   VITE_PROMPT_TOKEN_MINT=tu_direccion_del_token
   VITE_MINIMUM_TOKEN_BALANCE=100
   ```

4. **Deploy:** Vercel hará el deploy automático

### Método 2: Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login a Vercel
vercel login

# Deploy desde la raíz del proyecto
vercel

# Para production
vercel --prod
```

## 🔧 Variables de Entorno

### Para Development (.env local)
```bash
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_PROMPT_TOKEN_MINT=tu_direccion_del_token
VITE_MINIMUM_TOKEN_BALANCE=100
```

### Para Production (Vercel Dashboard)
```bash
# Mainnet
VITE_SOLANA_NETWORK=mainnet-beta
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_PROMPT_TOKEN_MINT=tu_direccion_real_del_token
VITE_MINIMUM_TOKEN_BALANCE=1000
```

## 📋 Pre-deployment Checklist

### Antes de hacer deploy:

- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Token mint address válida
- [ ] ✅ RPC endpoint funcional
- [ ] ✅ Build local exitoso (`npm run build`)
- [ ] ✅ Preview local funcional (`npm run preview`)
- [ ] ✅ Wallet connections probadas
- [ ] ✅ Dominio personalizado configurado (opcional)

### Performance Checklist:

- [ ] ✅ Chunks optimizados (vendor/solana separados)
- [ ] ✅ Assets minificados
- [ ] ✅ Polyfills optimizados
- [ ] ✅ Meta tags configurados
- [ ] ✅ Favicon y robots.txt

## 🔍 Troubleshooting

### Error: "Buffer is not defined"
```bash
# Verificar que los polyfills estén cargados
# frontend/src/main.jsx debe importar './polyfills.js'
```

### Error: "Failed to resolve module"
```bash
# Limpiar caché y reinstalar
npm run clean
npm run setup
```

### Build falla en Vercel
```bash
# Verificar Node.js version en vercel.json
# Debe ser 18.x o superior
```

### Variables de entorno no se cargan
```bash
# Variables VITE_ son públicas y se exponen en el cliente
# No incluir claves privadas en variables VITE_
```

## 🌐 Dominios Personalizados

### En Vercel:
1. Project Settings → Domains
2. Agregar tu dominio
3. Configurar DNS records:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

## 📊 Monitoring

### Analytics en Vercel:
- Analytics automático habilitado
- Core Web Vitals tracking
- Error tracking integrado

### Custom Analytics:
```bash
# Para agregar Google Analytics u otros
# Editar frontend/index.html
```

## 🔒 Security Headers

Agregar a `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 📱 PWA (Progressive Web App)

Para convertir en PWA:
1. Agregar `vite-plugin-pwa`
2. Configurar service worker
3. Agregar manifest.json

## 🚀 Performance Tips

- Usar CDN para assets estáticos
- Habilitar Edge Functions si es necesario
- Configurar caching apropiado
- Monitorear bundle size

---

**✅ Una vez deployado, el terminal estará disponible 24/7 con conexión automática a Solana.**
