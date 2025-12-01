#!/bin/bash
set -e

echo "🚀 Deploying both apps to Vercel..."

# Deploy web app
echo ""
echo "📦 Deploying web app (thorbis)..."
cd apps/web
npx vercel --prod --yes --cwd ../..
cd ../..

# Deploy admin app  
echo ""
echo "📦 Deploying admin app (thorbis-admin)..."
cd apps/admin
npx vercel --prod --yes --cwd ../..
cd ../..

echo ""
echo "✅ Both deployments initiated!"
echo ""
echo "Check deployment status at:"
echo "  Web: https://vercel.com/wades-web-dev/thorbis"
echo "  Admin: https://vercel.com/wades-web-dev/thorbis-admin"




