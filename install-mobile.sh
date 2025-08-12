#!/bin/bash

# 🚀 Script de instalación para optimización móvil
echo "📱 Installing PWA dependencies for mobile optimization..."

# Instalar dependencia PWA
cd frontend
npm install --save-dev vite-plugin-pwa@^0.20.0

echo "✅ PWA plugin installed successfully!"

# Verificar instalación
if npm list vite-plugin-pwa > /dev/null 2>&1; then
    echo "✅ vite-plugin-pwa is correctly installed"
else
    echo "❌ Error installing vite-plugin-pwa"
    exit 1
fi

echo ""
echo "📋 MOBILE OPTIMIZATION COMPLETED!"
echo "================================="
echo ""
echo "🎯 NEW FEATURES:"
echo "  ✅ Responsive design for all screen sizes"
echo "  ✅ Touch-optimized interface"
echo "  ✅ PWA support (installable app)"
echo "  ✅ Better mobile wallet integration"
echo "  ✅ Optimized for iOS Safari & Android Chrome"
echo "  ✅ Smooth scrolling and touch gestures"
echo "  ✅ Mobile-first CSS with safe areas"
echo "  ✅ Keyboard handling for mobile"
echo ""
echo "🚀 TO TEST:"
echo "  1. npm run dev"
echo "  2. Open on mobile browser"
echo "  3. Test wallet connections"
echo "  4. Try 'Add to Home Screen'"
echo ""
echo "📱 MOBILE TESTING URLS:"
echo "  • Local: http://localhost:3000"
echo "  • Network: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
