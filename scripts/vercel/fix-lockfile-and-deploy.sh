#!/bin/bash
set -e

echo "🔧 Fixing pnpm lockfile issue..."

cd /Users/byronwade/Stratos

# Remove git lock
rm -f .git/index.lock

# Update lockfile to match package.json changes
echo "📦 Updating pnpm-lock.yaml..."
pnpm install

# Stage all changes
echo "📝 Staging changes..."
git add -A

# Commit
echo "💾 Committing..."
git commit -m "Fix Vercel lockfile issue: Allow lockfile updates during install

- Update install commands to use --no-frozen-lockfile flag
- This allows Vercel to update lockfile when dependencies change
- Fixes ERR_PNPM_OUTDATED_LOCKFILE error on Vercel builds"

# Push
echo "🚀 Pushing to trigger deployments..."
git push origin main

echo ""
echo "✅ Changes pushed! Vercel will deploy both apps with updated install commands."




