#!/bin/bash

echo "🚀 Fixing Vercel deployment issues..."
echo "=================================="

cd /home/carlos/Documentos/Proyectos/solana-staking-dapp

# 1. Verificar directorio
echo "📁 Current directory: $(pwd)"

# 2. Instalar dependencias faltantes
echo "📦 Installing missing dependencies..."
cd frontend
npm install

# 3. Test local build
echo "🔨 Testing local build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Local build successful!"
    
    # 4. Test lint
    echo "🔍 Running lint check..."
    npm run lint
    
    if [ $? -eq 0 ]; then
        echo "✅ Lint passed!"
        
        # 5. Deploy to Vercel
        echo "🚀 Deploying to Vercel..."
        cd ..
        vercel --prod
        
    else
        echo "❌ Lint failed. Please fix lint errors first."
        npm run lint:fix
    fi
    
else
    echo "❌ Local build failed. Checking for PWA plugin issues..."
    
    # Backup current config and use fallback
    cp vite.config.js vite.config.original.js
    cp vite.config.backup.js vite.config.js
    
    echo "🔄 Trying build without PWA plugin..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Build successful without PWA! PWA plugin was the issue."
        echo "Deploying without PWA for now..."
        cd ..
        vercel --prod
    else
        echo "❌ Build still failing. Check the error above."
        # Restore original config
        cp vite.config.original.js vite.config.js
    fi
fi

echo ""
echo "🏁 Deployment script completed!"
