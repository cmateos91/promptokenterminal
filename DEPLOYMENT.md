# Deployment Manual a Vercel

Este proyecto ahora usa deployment manual con Vercel CLI en lugar de sincronización automática con GitHub.

## Configuración inicial

1. **Instalar Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login a Vercel**:
   ```bash
   vercel login
   ```

3. **Verificar configuración**:
   ```bash
   vercel --version
   ```

## Comandos de deployment

### Deploy a producción
```bash
npm run deploy
# o directamente
vercel --prod
```

### Deploy de preview
```bash
npm run deploy:preview
# o directamente
vercel
```

### Build local antes de deploy
```bash
npm run build
npm run deploy
```

## Variables de entorno

Asegúrate de configurar las variables en Vercel dashboard:

- `VITE_SOLANA_NETWORK=devnet`
- `VITE_SOLANA_RPC_URL=https://api.devnet.solana.com`
- `VITE_PROMPT_TOKEN_MINT=<token_mint_address>`
- `VITE_MINIMUM_TOKEN_BALANCE=100`

## Configuración actual

- ✅ **GitHub Actions**: Deshabilitado
- ✅ **Auto-deploy**: Deshabilitado en vercel.json
- ✅ **Deploy manual**: Configurado con Vercel CLI
- ✅ **Scripts npm**: Agregados para facilidad de uso

## Workflow recomendado

1. Desarrollar localmente: `npm run dev`
2. Testear build: `npm run build`
3. Preview local: `npm run preview`
4. Deploy preview: `npm run deploy:preview`
5. Deploy producción: `npm run deploy`

## Ventajas del deployment manual

- Control total sobre cuándo hacer deploy
- No hay deployments accidentales por commits
- Posibilidad de testear antes de producción
- Menor uso de recursos en Vercel
- Deployments más rápidos (sin esperar CI/CD)
