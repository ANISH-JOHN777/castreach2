#!/bin/bash
# CastReach Setup Script

echo "🎙️ CastReach - Setup Script"
echo "======================================\n"

# Check Node.js version
echo "Checking Node.js..."
node --version || exit 1

# Install dependencies
echo "\n📦 Installing dependencies..."
npm install

# Generate Prisma
echo "\n🗄️  Generating Prisma client..."
npx prisma generate

echo "\n⚙️  Setup complete!"
echo "======================================\n"
echo "Next steps:"
echo "1. Copy .env.example to .env.local"
echo "2. Update .env.local with your credentials:"
echo "   - NEXTAUTH_SECRET"
echo "   - DATABASE_URL"
echo "   - GOOGLE_CLIENT_ID"
echo "   - GOOGLE_CLIENT_SECRET"
echo "3. Run: npx prisma migrate dev"
echo "4. Run: npm run dev"
echo "\n📖 See README.md for full setup guide"
