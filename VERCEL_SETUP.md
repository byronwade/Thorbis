# Vercel Monorepo Setup Guide

This document outlines the Vercel configuration for the Stratos monorepo, which contains two Next.js applications:
- **Web App** (`apps/web`) - Main application
- **Admin App** (`apps/admin`) - Admin dashboard

## Project Configuration

### Web App (thorbis)
- **Project ID**: `togejqdwggezkxahomeh`
- **Project Name**: `thorbis`
- **Vercel Dashboard**: https://vercel.com/wades-web-dev/thorbis

### Admin App (thorbis-admin)
- **Project ID**: `iwudmixxoozwskgolqlz`
- **Project Name**: `thorbis-admin`
- **Vercel Dashboard**: https://vercel.com/wades-web-dev/thorbis-admin

## Required Vercel Project Settings

### For Web App (thorbis)

1. **Root Directory**: `apps/web`
2. **Framework Preset**: Next.js
3. **Build Command**: `cd ../.. && pnpm build --filter @stratos/web`
4. **Output Directory**: `.next`
5. **Install Command**: `pnpm install`
6. **Node.js Version**: 18.x or higher
7. **Environment Variables**: All required env vars from `.env.local`

### For Admin App (thorbis-admin)

1. **Root Directory**: `apps/admin`
2. **Framework Preset**: Next.js
3. **Build Command**: `cd ../.. && pnpm build --filter @stratos/admin`
4. **Output Directory**: `.next`
5. **Install Command**: `pnpm install`
6. **Node.js Version**: 18.x or higher
7. **Environment Variables**: All required env vars from `.env.local`

## Git Integration

Both projects should be connected to the same Git repository with the following settings:

- **Repository**: Your Git repository URL
- **Production Branch**: `main` or `master`
- **Auto-deploy**: Enabled
- **Preview Deployments**: Enabled

## Configuration Files

### Root `vercel.json`
- Contains cron job configurations for the web app
- Located at repository root

### `apps/web/vercel.json`
- Web app specific configuration
- Includes cron jobs and build settings

### `apps/admin/vercel.json`
- Admin app specific configuration
- Build settings for admin app

## Setting Up Projects in Vercel Dashboard

### Step 1: Configure Web App

1. Go to https://vercel.com/wades-web-dev/thorbis/settings
2. Navigate to **General** settings
3. Set **Root Directory** to `apps/web`
4. Navigate to **Build & Development Settings**
5. Verify:
   - Framework Preset: `Next.js`
   - Build Command: `cd ../.. && turbo build --filter @stratos/web`
   - Output Directory: `.next`
   - Install Command: `pnpm install`
6. Save changes

### Step 2: Configure Admin App

1. Go to https://vercel.com/wades-web-dev/thorbis-admin/settings
2. Navigate to **General** settings
3. Set **Root Directory** to `apps/admin`
4. Navigate to **Build & Development Settings**
5. Verify:
   - Framework Preset: `Next.js`
   - Build Command: `cd ../.. && turbo build --filter @stratos/admin`
   - Output Directory: `.next`
   - Install Command: `pnpm install`
6. Save changes

### Step 3: Environment Variables

For each project, add all required environment variables:

**Web App Environment Variables:**
- All variables from `apps/web/.env.local`
- Database URLs, API keys, etc.
- Note: Add these in Vercel Dashboard > Settings > Environment Variables

**Admin App Environment Variables:**
- All variables from `apps/admin/.env.local`
- Database URLs, API keys, etc.
- Note: Add these in Vercel Dashboard > Settings > Environment Variables

**Important:** Make sure to add environment variables for all environments:
- Production
- Preview
- Development (optional)

### Step 4: Git Integration

1. For each project, go to **Git** settings
2. Connect to your repository (if not already connected)
3. Set **Production Branch** to `main` or `master`
4. Enable **Automatic deployments from Git**
5. Enable **Preview deployments**

## Deployment Workflow

### Automatic Deployments

When you push to the main branch:
- **Web App**: Automatically deploys if changes are in `apps/web/**` or shared packages
- **Admin App**: Automatically deploys if changes are in `apps/admin/**` or shared packages

### Manual Deployments

You can trigger manual deployments from:
- Vercel Dashboard
- Vercel CLI: `vercel --prod`

### Preview Deployments

Every pull request automatically creates a preview deployment for both apps.

## Troubleshooting

### Build Failures

1. **Monorepo Build Issues**:
   - Ensure `Root Directory` is set correctly
   - Verify build command includes `cd ../..` to reach monorepo root
   - Check that `pnpm install` runs at root level

2. **Package Resolution Issues**:
   - Ensure workspace packages are properly linked
   - Check `pnpm-workspace.yaml` configuration
   - Verify `package.json` workspace dependencies

3. **Environment Variables**:
   - Ensure all required env vars are set in Vercel dashboard
   - Check that variable names match exactly (case-sensitive)

### Deployment Issues

1. **Wrong App Deploying**:
   - Verify Root Directory is set correctly
   - Check that build command filters the correct app

2. **Missing Dependencies**:
   - Ensure `pnpm install` runs at monorepo root
   - Check that workspace packages are included

## Verification Checklist

- [ ] Web app Root Directory set to `apps/web`
- [ ] Admin app Root Directory set to `apps/admin`
- [ ] Build commands configured correctly
- [ ] Install command set to `pnpm install`
- [ ] All environment variables added
- [ ] Git integration configured
- [ ] Auto-deploy enabled
- [ ] Preview deployments enabled
- [ ] Both projects successfully building

## Next Steps

After configuring both projects:

1. Test a deployment by pushing to main branch
2. Verify both apps deploy successfully
3. Check that cron jobs are running (web app only)
4. Monitor deployment logs for any issues
5. Set up deployment notifications if needed

