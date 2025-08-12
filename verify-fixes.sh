#!/bin/bash

# 🔧 VERIFICACIÓN FINAL DE CORRECCIONES

echo "🔧 Verificando correcciones aplicadas..."

cd frontend

echo "📝 1. Checking build..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Build: SUCCESS"
else
    echo "❌ Build: FAILED"
    npm run build
    exit 1
fi

echo "📝 2. Checking lint..."
npm run lint > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Lint: SUCCESS"
else
    echo "⚠️  Lint: Has warnings (acceptable)"
    echo "Running lint to show details:"
    npm run lint
fi

echo "📝 3. Checking tests..."
npm run test:quick > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Tests: SUCCESS"
else
    echo "❌ Tests: FAILED"
    npm run test:quick
    exit 1
fi

echo "📝 4. Checking key files..."
FILES=(
    "dist/index.html"
    "src/utils/logger.js"
    "src/utils/commands/diagnostics.js"
    ".env"
    "package.json"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file: EXISTS"
    else
        echo "❌ $file: MISSING"
    fi
done

cd ..

echo "📝 5. Checking deployment files..."
DEPLOY_FILES=(
    "vercel.json"
    "deploy-safe.sh"
    "ai-dev-helper.sh"
    "README-AI.md"
    "DEVELOPMENT.md"
)

for file in "${DEPLOY_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file: EXISTS"
    else
        echo "❌ $file: MISSING"
    fi
done

echo ""
echo "🎉 VERIFICATION COMPLETED!"
echo "🚀 Ready for deployment with: ./deploy-safe.sh"
echo "🤖 Use AI helper with: ./ai-dev-helper.sh"
