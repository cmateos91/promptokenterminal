#!/bin/bash

# 🔍 ANALIZAR REPOSITORIO - Ver qué archivos están siendo trackeados

echo "🔍 Analizando archivos en el repositorio git..."
echo ""

echo "📊 RESUMEN DEL REPOSITORIO:"
echo "=========================="
total_files=$(git ls-files | wc -l)
total_size=$(git ls-files | xargs ls -la 2>/dev/null | awk '{sum += $5} END {print sum/1024/1024}')
echo "Total archivos: $total_files"
echo "Tamaño aprox: ${total_size}MB"
echo ""

echo "🚫 ARCHIVOS PROBLEMÁTICOS (que deberían eliminarse):"
echo "=================================================="

echo "📱 Media files (PNG, WEBM, etc.):"
git ls-files | grep -E '\.(png|webm|mp4|jpg|jpeg|gif)$' | head -10
media_count=$(git ls-files | grep -E '\.(png|webm|mp4|jpg|jpeg|gif)$' | wc -l)
echo "   → Total: $media_count archivos"
echo ""

echo "🧪 Test artifacts:"
git ls-files | grep -E '(test-failed|junit\.xml|\.last-run\.json|test-results|playwright-report)' | head -10
test_count=$(git ls-files | grep -E '(test-failed|junit\.xml|\.last-run\.json|test-results|playwright-report)' | wc -l)
echo "   → Total: $test_count archivos"
echo ""

echo "📋 Log files:"
git ls-files | grep -E '\.log$|debug.*\.json|ai-analysis.*\.md' | head -10
log_count=$(git ls-files | grep -E '\.log$|debug.*\.json|ai-analysis.*\.md' | wc -l)
echo "   → Total: $log_count archivos"
echo ""

echo "🏗️ Build artifacts:"
git ls-files | grep -E '(dist/|build/|coverage/)' | head -10
build_count=$(git ls-files | grep -E '(dist/|build/|coverage/)' | wc -l)
echo "   → Total: $build_count archivos"
echo ""

echo "✅ ARCHIVOS ESENCIALES (que deben mantenerse):"
echo "=============================================="

echo "📱 Código fuente:"
git ls-files | grep -E '\.(js|jsx|ts|tsx|css|html)$' | wc -l | xargs echo "   → Total archivos de código:"

echo "📄 Configuración:"
git ls-files | grep -E '(package\.json|vercel\.json|\.gitignore|vite\.config|eslint)' | wc -l | xargs echo "   → Total archivos de config:"

echo "📚 Documentación:"
git ls-files | grep -E '\.md$' | grep -v -E '(ai-analysis|contract-ai-debug|DRAFT)' | wc -l | xargs echo "   → Total archivos de docs:"

echo ""
echo "🎯 RECOMENDACIÓN:"
echo "================"

problemmatic_total=$((media_count + test_count + log_count + build_count))
if [ $problemmatic_total -gt 0 ]; then
    echo "❌ Hay $problemmatic_total archivos innecesarios en el repositorio"
    echo "💡 Ejecuta: chmod +x git-cleanup.sh && ./git-cleanup.sh"
else
    echo "✅ El repositorio está limpio - no hay archivos innecesarios"
fi

echo ""
echo "📋 ARCHIVOS MÁS GRANDES:"
echo "========================"
git ls-files | xargs ls -la 2>/dev/null | sort -k5 -nr | head -10 | awk '{print $5/1024/1024 "MB", $9}'
