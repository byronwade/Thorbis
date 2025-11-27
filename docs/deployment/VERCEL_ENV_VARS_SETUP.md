# Vercel Environment Variables Setup - Admin App

## ⚠️ Required: Add Environment Variables to thorbis-admin Project

The admin app build is failing because required environment variables are missing in Vercel.

## Quick Setup (5 minutes)

### Step 1: Open Vercel Project Settings

1. Go to: https://vercel.com/wades-web-dev/thorbis-admin/settings/environment-variables

### Step 2: Add Required Environment Variables

Add these **5 environment variables** for **Production, Preview, and Development**:

#### 1. Admin Database (Primary)
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://iwudmixxoozwskgolqlz.supabase.co
Environment: Production, Preview, Development
```

```
Name: ADMIN_SUPABASE_SERVICE_ROLE_KEY
Value: [Get from Supabase Admin Dashboard]
Environment: Production, Preview, Development
```

**To get ADMIN_SUPABASE_SERVICE_ROLE_KEY:**
1. Go to: https://supabase.com/dashboard/project/iwudmixxoozwskgolqlz/settings/api
2. Copy the **service_role** key (NOT the anon key)
3. Paste into Vercel

#### 2. Web Database (Customer Data Access)
```
Name: WEB_SUPABASE_URL
Value: https://togejqdwggezkxahomeh.supabase.co
Environment: Production, Preview, Development
```

```
Name: WEB_SUPABASE_SERVICE_ROLE_KEY
Value: [Get from Supabase Web Dashboard]
Environment: Production, Preview, Development
```

**To get WEB_SUPABASE_SERVICE_ROLE_KEY:**
1. Go to: https://supabase.com/dashboard/project/togejqdwggezkxahomeh/settings/api
2. Copy the **service_role** key (NOT the anon key)
3. Paste into Vercel

#### 3. Admin JWT Secret
```
Name: ADMIN_JWT_SECRET
Value: [Generate a random hex string]
Environment: Production, Preview, Development
```

**To generate ADMIN_JWT_SECRET:**
```bash
# Run this command locally:
openssl rand -hex 32
```

Or use an online generator: https://randomkeygen.com/

**Important:** Use the **same** `ADMIN_JWT_SECRET` value for all environments (Production, Preview, Development) to maintain session compatibility.

### Step 3: Verify All Variables Are Added

You should have **5 environment variables** total:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `ADMIN_SUPABASE_SERVICE_ROLE_KEY`
- ✅ `WEB_SUPABASE_URL`
- ✅ `WEB_SUPABASE_SERVICE_ROLE_KEY`
- ✅ `ADMIN_JWT_SECRET`

### Step 4: Redeploy

After adding all environment variables:
1. Go to: https://vercel.com/wades-web-dev/thorbis-admin/deployments
2. Click **"Redeploy"** on the latest deployment
3. Or push a new commit to trigger a new deployment

## Current Error

```
Error: Missing WEB_SUPABASE_URL environment variable
```

This will be fixed once you add `WEB_SUPABASE_URL` to Vercel.

## Environment Variable Reference

| Variable | Purpose | Where to Get It |
|----------|---------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Admin database URL | Fixed: `https://iwudmixxoozwskgolqlz.supabase.co` |
| `ADMIN_SUPABASE_SERVICE_ROLE_KEY` | Admin DB service role key | Supabase Admin Dashboard → Settings → API |
| `WEB_SUPABASE_URL` | Web database URL | Fixed: `https://togejqdwggezkxahomeh.supabase.co` |
| `WEB_SUPABASE_SERVICE_ROLE_KEY` | Web DB service role key | Supabase Web Dashboard → Settings → API |
| `ADMIN_JWT_SECRET` | JWT secret for sessions | Generate with `openssl rand -hex 32` |

## Security Notes

⚠️ **IMPORTANT:**
- Service role keys have **full database access** - keep them secret
- Never commit these values to git
- Use Vercel's environment variables (not `.env` files in repo)
- Service role keys bypass Row Level Security (RLS)

## Verification

After adding all variables and redeploying, check the build logs for:
- ✅ No "Missing environment variable" errors
- ✅ "Detected Next.js version: 16.0.1"
- ✅ Build completes successfully

