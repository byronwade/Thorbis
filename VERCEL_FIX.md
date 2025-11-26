# Vercel Monorepo Fix - Next.js Detection Error

## Problem

Vercel is showing this error:
```
Warning: Could not identify Next.js version, ensure it is defined as a project dependency.
Error: No Next.js version detected. Make sure your package.json has "next" in either "dependencies" or "devDependencies". Also check your Root Directory setting matches the directory of your package.json file.
```

## Root Cause

Vercel is trying to detect Next.js from the repository root, but Next.js is installed in the individual app directories (`apps/web` and `apps/admin`). The **Root Directory** setting in the Vercel dashboard must be configured correctly.

## Solution

### Step 1: Set Root Directory in Vercel Dashboard

**For Web App (thorbis):**
1. Go to: https://vercel.com/wades-web-dev/thorbis/settings
2. Navigate to **General** → **Root Directory**
3. Set to: `apps/web`
4. Click **Save**

**For Admin App (thorbis-admin):**
1. Go to: https://vercel.com/wades-web-dev/thorbis-admin/settings
2. Navigate to **General** → **Root Directory**
3. Set to: `apps/admin`
4. Click **Save**

### Step 2: Verify Build Settings

**For Web App:**
- **Build Command**: `cd ../.. && turbo build --filter @stratos/web`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`
- **Framework Preset**: Next.js (should auto-detect after Root Directory is set)

**For Admin App:**
- **Build Command**: `cd ../.. && turbo build --filter @stratos/admin`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`
- **Framework Preset**: Next.js (should auto-detect after Root Directory is set)

### Step 3: Verify package.json Location

After setting Root Directory to `apps/web` or `apps/admin`, Vercel will:
1. Change to that directory
2. Read the `package.json` in that directory
3. Detect Next.js from the dependencies
4. Run the build command from the monorepo root (via `cd ../..`)

## Verification

After setting Root Directory:
1. Trigger a new deployment
2. Check the build logs - you should see:
   - "Detected Next.js version: 16.0.4" (for web) or "16.0.1" (for admin)
   - No more "No Next.js version detected" error

## Why This Happens

In a monorepo:
- Next.js is in `apps/web/package.json` and `apps/admin/package.json`
- Vercel defaults to detecting from repository root
- Root Directory tells Vercel where to look for the framework
- Once Root Directory is set, Vercel changes to that directory before detection

## Current Status

✅ `apps/web/package.json` has `"next": "16.0.4"` in dependencies
✅ `apps/admin/package.json` has `"next": "16.0.1"` in dependencies
✅ `vercel.json` files are configured correctly
❌ **Root Directory needs to be set in Vercel dashboard** (manual step)

## Next Steps

1. Set Root Directory in Vercel dashboard for both projects
2. Trigger a new deployment
3. Verify Next.js is detected correctly
4. Monitor build logs for success

