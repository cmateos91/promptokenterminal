#!/bin/bash

# 🧹 GIT CLEANUP - Limpiar archivos innecesarios del repositorio

echo "🧹 Cleaning up git repository..."

# Verificar que estamos en el directorio correcto
if [ ! -d ".git" ]; then
    echo "❌ No estás en un repositorio git"
    exit 1
fi

echo "📁 Archivos que se van a eliminar:"

# Mostrar archivos que se van a eliminar
echo "🔍 Test artifacts:"
find . -name "test-failed-*.png" 2>/dev/null | head -5
find . -name "*.webm" 2>/dev/null | head -5
find . -name "junit.xml" 2>/dev/null | head -5
find . -name ".last-run.json" 2>/dev/null | head -5

echo ""
echo "📋 Build artifacts:"
find . -name "dist" -type d 2>/dev/null | head -5

echo ""
echo "📊 Logs y debug:"
find . -name "*.log" 2>/dev/null | head -5

echo ""
read -p "¿Continuar con la limpieza? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Limpieza cancelada"
    exit 0
fi

echo "🗑️ Eliminando archivos..."

# Eliminar archivos de test
rm -rf frontend/test-results/
rm -rf frontend/playwright-report/
rm -rf frontend/coverage/
echo "✅ Test artifacts eliminados"

# Eliminar builds
rm -rf frontend/dist/
rm -rf dist/
echo "✅ Build artifacts eliminados"

# Eliminar logs
find . -name "*.log" -delete 2>/dev/null
find . -name "ai-analysis-*.md" -delete 2>/dev/null
find . -name "contract-ai-debug-*.md" -delete 2>/dev/null
echo "✅ Logs eliminados"

# Eliminar archivos temporales
find . -name "*.tmp" -delete 2>/dev/null
find . -name "*~" -delete 2>/dev/null
find . -name ".DS_Store" -delete 2>/dev/null
echo "✅ Archivos temporales eliminados"

# Operaciones de git
echo "📝 Actualizando git..."

# Eliminar del tracking de git
git rm -r --cached frontend/test-results/ 2>/dev/null || true
git rm -r --cached frontend/playwright-report/ 2>/dev/null || true
git rm -r --cached frontend/coverage/ 2>/dev/null || true
git rm -r --cached frontend/dist/ 2>/dev/null || true
git rm --cached logs/*.md 2>/dev/null || true
git rm --cached *.log 2>/dev/null || true
git rm --cached "**/*.png" 2>/dev/null || true
git rm --cached "**/*.webm" 2>/dev/null || true

echo "✅ Archivos eliminados del tracking de git"

# Mostrar estado
echo ""
echo "📊 Estado del repositorio:"
git status --porcelain | head -10

echo ""
echo "🎉 ¡Limpieza completada!"
echo ""
echo "📋 Archivos principales del proyecto:"
echo "   ✅ frontend/src/ (código fuente)"
echo "   ✅ frontend/package.json (dependencias)"
echo "   ✅ vercel.json (config deployment)"
echo "   ✅ README*.md (documentación)"
echo "   ✅ contracts/ (smart contracts)"
echo ""
echo "🚫 Archivos eliminados:"
echo "   ❌ test-results/ (screenshots de tests)"
echo "   ❌ dist/ (builds temporales)"
echo "   ❌ coverage/ (reportes de coverage)"
echo "   ❌ *.log (logs de debug)"
echo "   ❌ *.png, *.webm (media de tests)"
echo ""
echo "📝 Para aplicar cambios:"
echo "   git add ."
echo "   git commit -m 'chore: cleanup test artifacts and improve gitignore'"
echo "   git push"
