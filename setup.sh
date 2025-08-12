#!/bin/bash

echo "🚀 Setting up Solana Staking dApp..."

# Check Node.js version
node_version=$(node -v | cut -c2- | cut -d. -f1)
if [ "$node_version" -lt 16 ]; then
    echo "❌ Error: Node.js 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install workspace dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "📦 Installing backend dependencies..."
cd backend && npm install 2>/dev/null || echo "⚠️  Backend dependencies not found (optional)" && cd ..

echo "📦 Installing contracts dependencies..."
cd contracts && npm install 2>/dev/null || echo "⚠️  Contracts dependencies not found (optional)" && cd ..

# Check for environment file
if [ ! -f .env ]; then
    echo "⚠️  Creating .env file from template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration"
fi

# Build check
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Edit .env file with your Solana configuration"
    echo "2. Run 'npm run dev' to start development server"
    echo "3. Visit http://localhost:3000"
else
    echo "❌ Build failed. Check the errors above."
    exit 1
fi
