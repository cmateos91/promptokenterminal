#!/bin/bash

echo "🔍 Pre-deployment validation for Solana Staking dApp..."

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Check Node.js version
echo "1. Checking Node.js version..."
node_version=$(node -v | cut -c2- | cut -d. -f1)
if [ "$node_version" -lt 16 ]; then
    echo -e "${RED}❌ Error: Node.js 16+ required. Current: $(node -v)${NC}"
    ((errors++))
else
    echo -e "${GREEN}✅ Node.js version: $(node -v)${NC}"
fi

# Check if .env exists and has required variables
echo "2. Checking environment configuration..."
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Warning: .env file not found. Using defaults.${NC}"
    ((warnings++))
else
    required_vars=("VITE_SOLANA_NETWORK" "VITE_SOLANA_RPC_URL")
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" .env; then
            echo -e "${RED}❌ Missing required variable: $var${NC}"
            ((errors++))
        else
            echo -e "${GREEN}✅ Found: $var${NC}"
        fi
    done
fi

# Check dependencies
echo "3. Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo -e "${RED}❌ Dependencies not installed. Run: npm run setup${NC}"
    ((errors++))
else
    echo -e "${GREEN}✅ Dependencies installed${NC}"
fi

# Test build
echo "4. Testing build process..."
npm run build > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Run 'npm run build' to see errors${NC}"
    ((errors++))
else
    echo -e "${GREEN}✅ Build successful${NC}"
    
    # Check build size
    build_size=$(du -sh frontend/dist 2>/dev/null | cut -f1)
    if [ -n "$build_size" ]; then
        echo -e "${GREEN}📦 Build size: $build_size${NC}"
    fi
fi

# Check critical files
echo "5. Checking critical files..."
critical_files=(
    "frontend/src/main.jsx"
    "frontend/src/App.jsx"
    "frontend/src/polyfills.js"
    "frontend/index.html"
    "vercel.json"
    "package.json"
)

for file in "${critical_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Missing critical file: $file${NC}"
        ((errors++))
    else
        echo -e "${GREEN}✅ Found: $file${NC}"
    fi
done

# Check for common issues
echo "6. Checking for common issues..."

# Check if polyfills are imported
if ! grep -q "polyfills" frontend/src/main.jsx; then
    echo -e "${YELLOW}⚠️  Warning: Polyfills not imported in main.jsx${NC}"
    ((warnings++))
fi

# Check if Buffer polyfill is configured
if ! grep -q "Buffer" frontend/src/polyfills.js; then
    echo -e "${RED}❌ Buffer polyfill not configured${NC}"
    ((errors++))
fi

# Summary
echo ""
echo "📋 Validation Summary:"
echo -e "Errors: ${RED}$errors${NC}"
echo -e "Warnings: ${YELLOW}$warnings${NC}"

if [ $errors -eq 0 ]; then
    echo -e "${GREEN}🚀 Ready for deployment!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Push to GitHub"
    echo "2. Connect repository to Vercel"
    echo "3. Configure environment variables in Vercel"
    echo "4. Deploy!"
    exit 0
else
    echo -e "${RED}❌ Please fix the errors before deployment${NC}"
    exit 1
fi
