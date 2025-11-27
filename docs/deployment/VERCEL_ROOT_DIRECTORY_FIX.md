# Vercel Root Directory Configuration - REQUIRED

## ⚠️ CRITICAL: This Must Be Done in Vercel Dashboard

The "No Next.js version detected" error **CANNOT** be fixed via code changes. The **Root Directory** setting must be configured in the Vercel dashboard for each project.

## Quick Fix (2 minutes)

### For Web App (thorbis)

1. **Open**: https://vercel.com/wades-web-dev/thorbis/settings/general
2. **Find**: "Root Directory" field
3. **Set to**: `apps/web`
4. **Click**: "Save"
5. **Go to**: Build & Development Settings
6. **Verify**:
   - Build Command: `cd ../.. && turbo build --filter @stratos/web`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

### For Admin App (thorbis-admin)

1. **Open**: https://vercel.com/wades-web-dev/thorbis-admin/settings/general
2. **Find**: "Root Directory" field
3. **Set to**: `apps/admin`
4. **Click**: "Save"
5. **Go to**: Build & Development Settings
6. **Verify**:
   - Build Command: `cd ../.. && turbo build --filter @stratos/admin`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

## Why This Is Required

Vercel's build process:
1. **Clones** the repository
2. **Checks** Root Directory setting
3. **Changes** to that directory (if set)
4. **Detects** framework from `package.json` in that directory
5. **Runs** build command

**Without Root Directory set:**
- Vercel stays in repository root
- Looks for `package.json` at root (doesn't exist)
- Can't find Next.js → Error

**With Root Directory set to `apps/web`:**
- Vercel changes to `apps/web/`
- Finds `apps/web/package.json`
- Detects Next.js 16.0.4 ✅
- Runs build command (which `cd ../..` to get to monorepo root)

## Current Configuration Status

✅ **Code Configuration** (Complete):
- `apps/web/vercel.json` - Configured correctly
- `apps/admin/vercel.json` - Configured correctly
- `package.json` files have Next.js dependencies
- Build commands are correct

❌ **Dashboard Configuration** (Required):
- Root Directory for `thorbis` → Needs to be `apps/web`
- Root Directory for `thorbis-admin` → Needs to be `apps/admin`

## After Setting Root Directory

The next deployment will:
1. ✅ Detect Next.js version correctly
2. ✅ Install dependencies successfully
3. ✅ Build both apps successfully
4. ✅ Deploy without errors

## Verification

After setting Root Directory, check the build logs for:
```
Detected Next.js version: 16.0.4
```
or
```
Detected Next.js version: 16.0.1
```

Instead of:
```
Error: No Next.js version detected
```

