#!/bin/bash
set -e

echo "=== Cleaning build directories ==="
rm -rf apps/admin/.next apps/web/.next

echo "=== Building web app ==="
cd apps/web
npm run build
cd ../..

echo "=== Building admin app ==="
cd apps/admin
npm run build
cd ../..

echo "=== All builds completed successfully ==="




