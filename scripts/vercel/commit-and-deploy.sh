#!/bin/bash
set -e

echo "🔓 Removing git lock file..."
rm -f .git/index.lock

echo "📦 Staging all changes..."
git add -A

echo "💾 Committing changes..."
git commit -m "Fix Vercel builds: Move TypeScript to dependencies and fix build commands

- Move TypeScript from devDependencies to dependencies for both web and admin apps
- Move build-time deps (@tailwindcss/postcss, postcss, tailwindcss) to dependencies for admin
- Fix vercel.json build commands to navigate to monorepo root
- Fix install commands to run from monorepo root
- Add VERCEL_MONOREPO_SETUP.md documentation

This fixes the 'Cannot find module typescript' error on Vercel builds."

echo "🚀 Pushing to origin main (this will trigger Vercel deployments)..."
git push origin main

echo ""
echo "✅ Changes pushed! Vercel will automatically deploy both apps:"
echo "   - Web app: https://vercel.com/wades-web-dev/thorbis"
echo "   - Admin app: https://vercel.com/wades-web-dev/thorbis-admin"




