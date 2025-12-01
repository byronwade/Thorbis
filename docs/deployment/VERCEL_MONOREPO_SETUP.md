# Vercel Monorepo Configuration Guide

## Fixed Issues

### 1. TypeScript Dependencies
- **Problem**: TypeScript was in `devDependencies`, but Vercel skips devDependencies in production builds
- **Solution**: Moved TypeScript to `dependencies` for both `apps/web` and `apps/admin`
- **Also moved**: Build-time dependencies like `@tailwindcss/postcss`, `postcss`, and `tailwindcss` to dependencies for admin app

### 2. Build Commands
- **Fixed**: Build commands now correctly navigate to monorepo root before running turbo
- **Web app**: `cd ../.. && turbo build --filter @stratos/web`
- **Admin app**: `cd ../.. && turbo build --filter @stratos/admin`
- **Install commands**: Also navigate to monorepo root: `cd ../.. && pnpm install`

### 3. Environment Variables
- **Status**: `SKIP_ENV_VALIDATION` is already in `turbo.json` env list ✅

## Required Vercel Project Settings

You need to configure these settings in the Vercel dashboard for each project:

### For "thorbis" (Web App) Project:
1. Go to Project Settings → General
2. Set **Root Directory** to: `apps/web`
3. Verify **Framework Preset** is: `Next.js`
4. Verify **Build Command** is: `cd ../.. && turbo build --filter @stratos/web` (or leave empty to use vercel.json)
5. Verify **Install Command** is: `cd ../.. && pnpm install` (or leave empty to use vercel.json)
6. Verify **Output Directory** is: `.next`

### For "thorbis-admin" (Admin App) Project:
1. Go to Project Settings → General
2. Set **Root Directory** to: `apps/admin`
3. Verify **Framework Preset** is: `Next.js`
4. Verify **Build Command** is: `cd ../.. && turbo build --filter @stratos/admin` (or leave empty to use vercel.json)
5. Verify **Install Command** is: `cd ../.. && pnpm install` (or leave empty to use vercel.json)
6. Verify **Output Directory** is: `.next`

## How It Works

1. Vercel clones the repository
2. Vercel sets the working directory to the **Root Directory** (e.g., `apps/web`)
3. Vercel runs the **Install Command** which navigates to monorepo root (`cd ../..`) and installs all dependencies
4. Vercel runs the **Build Command** which navigates to monorepo root and runs turbo with the appropriate filter
5. Turbo builds only the specified package and its dependencies
6. Vercel uses the **Output Directory** (`.next`) from the app directory

## Verification

After pushing these changes, the builds should:
- ✅ Install all dependencies (including TypeScript)
- ✅ Build only the specified app
- ✅ Have access to all environment variables
- ✅ Complete successfully

## Next Steps

1. Commit and push these changes
2. Verify Root Directory settings in Vercel dashboard for both projects
3. Trigger a new deployment
4. Monitor build logs to confirm success




