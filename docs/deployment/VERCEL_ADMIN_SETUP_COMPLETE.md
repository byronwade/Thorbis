# Vercel Admin Project Setup - Complete

## ✅ What Was Done

1. **Project Linked**: The `thorbis-admin` project (ID: `iwudmixxoozwskgolqlz`) is now linked to the local codebase
   - Created `.vercel/project.json` in `apps/admin/`
   - Project ID: `prj_7idHISWAMFTcDdwD1tpF9Y935XRF`

2. **Git Repository Connected**: Successfully connected to `https://github.com/byronwade/Thorbis`
   - Repository is now linked to the thorbis-admin project
   - Automatic deployments from Git should work

## ⚠️ Required Manual Steps in Vercel Dashboard

You still need to configure the **Root Directory** in the Vercel dashboard to fix the "No Next.js version detected" error:

### Step 1: Set Root Directory

1. Go to: https://vercel.com/wades-web-dev/thorbis-admin/settings
2. Navigate to **General** → **Root Directory**
3. Set to: `apps/admin`
4. Click **Save**

### Step 2: Verify Build Settings

After setting Root Directory, verify these settings in **Build & Development Settings**:

- **Framework Preset**: Next.js (should auto-detect)
- **Build Command**: `cd ../.. && turbo build --filter @stratos/admin`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`
- **Node.js Version**: 18.x or higher

### Step 3: Configure Git Settings

1. Go to **Git** settings
2. Verify:
   - Repository: `byronwade/Thorbis` ✅ (already connected)
   - Production Branch: `main`
   - Automatic deployments from Git: **Enabled**
   - Preview deployments: **Enabled**

### Step 4: Add Environment Variables

Add all required environment variables from `apps/admin/.env.local`:
- Go to **Settings** → **Environment Variables**
- Add variables for:
  - Production
  - Preview
  - Development (optional)

## Current Status

✅ Project exists: `thorbis-admin` (iwudmixxoozwskgolqlz)
✅ Git repository connected: `byronwade/Thorbis`
✅ Local project linked: `.vercel/project.json` created
✅ Configuration files: `apps/admin/vercel.json` exists
❌ **Root Directory**: Needs to be set to `apps/admin` in dashboard

## After Setting Root Directory

Once Root Directory is set to `apps/admin`:
1. Vercel will detect Next.js from `apps/admin/package.json`
2. Builds will run successfully
3. Automatic deployments will work on git push

## Verification

After completing the manual steps:
1. Push a commit to trigger a deployment
2. Check build logs - should see "Detected Next.js version: 16.0.1"
3. Verify deployment succeeds

## Project URLs

- **Dashboard**: https://vercel.com/wades-web-dev/thorbis-admin
- **Settings**: https://vercel.com/wades-web-dev/thorbis-admin/settings
- **Deployments**: https://vercel.com/wades-web-dev/thorbis-admin/deployments

