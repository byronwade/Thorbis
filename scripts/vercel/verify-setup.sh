#!/bin/bash

# Vercel Monorepo Setup Verification Script
# This script helps verify that your Vercel projects are configured correctly

set -e

echo "🔍 Verifying Vercel Monorepo Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Install it with: npm i -g vercel${NC}"
    echo ""
fi

# Check for required files
echo "📁 Checking configuration files..."

files=(
    "vercel.json"
    "apps/web/vercel.json"
    "apps/admin/vercel.json"
    "turbo.json"
    "pnpm-workspace.yaml"
    "package.json"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file exists"
    else
        echo -e "${RED}❌${NC} $file missing"
    fi
done

echo ""
echo "📦 Checking package.json scripts..."

# Check root package.json
if grep -q '"build": "turbo build"' package.json; then
    echo -e "${GREEN}✅${NC} Root package.json has turbo build script"
else
    echo -e "${YELLOW}⚠️  Root package.json build script may need verification${NC}"
fi

# Check web app package.json
if [ -f "apps/web/package.json" ]; then
    if grep -q '"build"' apps/web/package.json; then
        echo -e "${GREEN}✅${NC} Web app has build script"
    fi
fi

# Check admin app package.json
if [ -f "apps/admin/package.json" ]; then
    if grep -q '"build"' apps/admin/package.json; then
        echo -e "${GREEN}✅${NC} Admin app has build script"
    fi
fi

echo ""
echo "🔧 Vercel Project Configuration Checklist:"
echo ""
echo "For Web App (thorbis):"
echo "  1. Root Directory: apps/web"
echo "  2. Build Command: cd ../.. && turbo build --filter @stratos/web"
echo "  3. Output Directory: .next"
echo "  4. Install Command: pnpm install"
echo "  5. Framework: Next.js"
echo ""
echo "For Admin App (thorbis-admin):"
echo "  1. Root Directory: apps/admin"
echo "  2. Build Command: cd ../.. && turbo build --filter @stratos/admin"
echo "  3. Output Directory: .next"
echo "  4. Install Command: pnpm install"
echo "  5. Framework: Next.js"
echo ""
echo "📝 Next Steps:"
echo "  1. Go to Vercel Dashboard for each project"
echo "  2. Navigate to Settings > General"
echo "  3. Set Root Directory as shown above"
echo "  4. Navigate to Settings > Build & Development Settings"
echo "  5. Verify build commands match the above"
echo "  6. Ensure all environment variables are set"
echo ""
echo "🌐 Project URLs:"
echo "  Web App: https://vercel.com/wades-web-dev/thorbis/settings"
echo "  Admin App: https://vercel.com/wades-web-dev/thorbis-admin/settings"
echo ""

