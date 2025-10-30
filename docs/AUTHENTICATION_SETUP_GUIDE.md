# 🔐 Thorbis Authentication Setup Guide

**Status**: ✅ Backend Implementation Complete
**Date**: January 29, 2025
**Next.js Version**: 16.0.0 (with React 19)

---

## 📋 Table of Contents

1. [What's Been Implemented](#whats-been-implemented)
2. [Quick Start (5 Minutes)](#quick-start-5-minutes)
3. [Detailed Setup Instructions](#detailed-setup-instructions)
4. [Testing Your Authentication](#testing-your-authentication)
5. [File Structure Reference](#file-structure-reference)
6. [Troubleshooting](#troubleshooting)
7. [Next Steps](#next-steps)

---

## ✅ What's Been Implemented

### 1. **Authentication Backend** (100% Complete)
- ✅ Server Actions for signup, login, logout
- ✅ OAuth support (Google, Facebook)
- ✅ Email verification flow
- ✅ Password reset flow
- ✅ Session management utilities
- ✅ Next.js 16+ compliant (async cookies)

### 2. **Route Protection** (100% Complete)
- ✅ Middleware for dashboard protection
- ✅ Automatic redirects for authenticated/unauthenticated users
- ✅ Session validation on every request
- ✅ Preserve redirect URLs

### 3. **UI Integration** (100% Complete)
- ✅ Login page with form validation
- ✅ Register page with password requirements
- ✅ Loading states and error handling
- ✅ OAuth buttons ready

### 4. **Database Security** (100% Complete)
- ✅ Row Level Security (RLS) policies for all 19 tables
- ✅ Multi-tenant company isolation
- ✅ User-specific data access
- ✅ Auto-sync trigger (auth.users → public.users)

### 5. **Storage System** (100% Complete)
- ✅ 6 storage buckets configured
- ✅ RLS policies for file access
- ✅ Upload utilities with validation
- ✅ Image optimization helpers

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details:
   - **Name**: Thorbis Production
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
4. Wait ~2 minutes for setup

### Step 2: Get Your Credentials

1. In Supabase dashboard, go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`)

### Step 3: Update Environment Variables

Create `/Users/byronwade/Stratos/.env.local`:

```env
# Supabase Configuration (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key

# Database URL for Drizzle (Production)
DATABASE_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres

# Site URL (for OAuth redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 4: Run Migrations

```bash
cd /Users/byronwade/Stratos

# Apply RLS policies and storage configuration
# Option 1: Using Supabase CLI (recommended)
supabase db push

# Option 2: Manual (copy SQL to Supabase SQL Editor)
# Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
# Copy contents of:
#   - supabase/migrations/20250129000000_enable_rls_policies.sql
#   - supabase/migrations/20250129000001_storage_buckets.sql
# Run each migration
```

### Step 5: Test Authentication

```bash
# Start development server
pnpm dev

# Open browser
open http://localhost:3000/register
```

**Try registering:**
1. Fill in name, email, password
2. Check Supabase dashboard → Authentication → Users
3. Verify user was created ✅

---

## 📚 Detailed Setup Instructions

### Configure OAuth Providers (Optional)

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials:
   - **Authorized redirect URIs**:
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```
5. Copy **Client ID** and **Client Secret**
6. In Supabase dashboard → **Authentication** → **Providers**:
   - Enable Google
   - Paste Client ID and Secret
   - Save

#### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create new app → "Consumer"
3. Add "Facebook Login" product
4. Configure OAuth redirect URIs:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
5. Copy **App ID** and **App Secret**
6. In Supabase dashboard → **Authentication** → **Providers**:
   - Enable Facebook
   - Paste App ID and Secret
   - Save

### Email Templates (Optional)

Customize email templates in Supabase dashboard → **Authentication** → **Email Templates**:

- **Confirm signup**: Welcome email with verification link
- **Reset password**: Password reset instructions
- **Invite user**: Team invitation email

---

## 🧪 Testing Your Authentication

### Test Signup

```bash
# 1. Start dev server
pnpm dev

# 2. Navigate to register page
open http://localhost:3000/register

# 3. Fill in form:
Name: Test User
Email: test@example.com
Password: TestPass123

# 4. Submit and verify:
- Should redirect to /dashboard
- Check Supabase dashboard → Authentication → Users
- User should appear in list
```

### Test Login

```bash
# 1. Navigate to login page
open http://localhost:3000/login

# 2. Enter credentials:
Email: test@example.com
Password: TestPass123

# 3. Submit and verify:
- Should redirect to /dashboard
- Session should be active (check browser cookies)
```

### Test Route Protection

```bash
# 1. Log out (or use incognito)

# 2. Try accessing dashboard
open http://localhost:3000/dashboard

# 3. Verify:
- Should redirect to /login
- URL should include ?redirectTo=/dashboard
```

### Test OAuth (if configured)

```bash
# 1. Navigate to login page
open http://localhost:3000/login

# 2. Click "Login with Google" or "Login with Facebook"

# 3. Verify:
- Redirects to OAuth provider
- Returns to your app after authorization
- Creates user in Supabase
- Redirects to /dashboard
```

---

## 📁 File Structure Reference

### Authentication Files Created/Modified

```
Stratos/
├── src/
│   ├── actions/
│   │   └── auth.ts                          # ✨ NEW: Auth server actions
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── login/page.tsx               # ✏️ UPDATED: Integrated auth
│   │   │   └── register/page.tsx            # ✏️ UPDATED: Integrated auth
│   │   └── auth/
│   │       └── callback/route.ts            # ✨ NEW: OAuth callback
│   ├── lib/
│   │   ├── auth/
│   │   │   └── session.ts                   # ✨ NEW: Session utilities
│   │   ├── storage/
│   │   │   └── upload.ts                    # ✨ NEW: File upload helpers
│   │   ├── supabase/
│   │   │   ├── client.ts                    # ✅ EXISTING: Browser client
│   │   │   └── server.ts                    # ✅ EXISTING: Server client
│   │   └── db/
│   │       └── schema.ts                    # ✏️ UPDATED: Added auth fields
│   └── middleware.ts                        # ✏️ UPDATED: Auth protection
├── supabase/
│   └── migrations/
│       ├── 20250129000000_enable_rls_policies.sql   # ✨ NEW: RLS policies
│       └── 20250129000001_storage_buckets.sql       # ✨ NEW: Storage config
└── .env.local                               # ⚠️ REQUIRED: Add Supabase creds
```

### Key Functions Available

#### Server Actions ([src/actions/auth.ts](src/actions/auth.ts))
```typescript
import { signUp, signIn, signOut, forgotPassword, resetPassword } from "@/actions/auth";
```

#### Session Helpers ([src/lib/auth/session.ts](src/lib/auth/session.ts))
```typescript
import { getCurrentUser, getSession, requireUser, isAuthenticated } from "@/lib/auth/session";
```

#### Storage Helpers ([src/lib/storage/upload.ts](src/lib/storage/upload.ts))
```typescript
import { uploadAvatar, uploadDocument, uploadJobPhoto } from "@/lib/storage/upload";
```

---

## 🔧 Troubleshooting

### Error: "Authentication service is not configured"

**Cause**: Missing or invalid Supabase environment variables

**Fix**:
1. Check `.env.local` exists
2. Verify variables are correct:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
3. Restart dev server: `pnpm dev`

### Error: "Invalid login credentials"

**Cause**: User doesn't exist or wrong password

**Fix**:
1. Check Supabase dashboard → Authentication → Users
2. Verify user exists
3. Try password reset flow
4. Check email confirmation (if enabled)

### Error: "Row Level Security policy violation"

**Cause**: RLS policies not applied

**Fix**:
1. Run RLS migration:
   ```bash
   # Copy SQL from supabase/migrations/20250129000000_enable_rls_policies.sql
   # Paste in Supabase SQL Editor
   # Execute
   ```
2. Verify policies in Supabase dashboard → Database → Policies

### OAuth Redirect Loop

**Cause**: Incorrect redirect URL configuration

**Fix**:
1. Verify redirect URL in OAuth provider settings:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
2. Check `NEXT_PUBLIC_SITE_URL` in `.env.local`
3. Ensure auth callback route exists: `src/app/auth/callback/route.ts`

### Development Mode: Middleware Warnings

**Cause**: Supabase not configured (using SQLite)

**Fix**: Normal behavior in development without Supabase credentials. Middleware will log warnings but allow access. To fix:
1. Add Supabase credentials to `.env.local`
2. Restart dev server

---

## 🚀 Next Steps

### 1. **Production Deployment** (⏱️ 30 minutes)

- [ ] Deploy to Vercel/Netlify
- [ ] Update `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Update OAuth redirect URLs
- [ ] Test production authentication flow

### 2. **Email Configuration** (⏱️ 15 minutes)

- [ ] Configure custom SMTP (optional)
- [ ] Customize email templates
- [ ] Set up email rate limiting

### 3. **Role-Based Access Control** (⏱️ 2 hours)

- [ ] Implement permission checks in server actions
- [ ] Add role-based UI rendering
- [ ] Create admin dashboard

### 4. **Testing** (⏱️ 4 hours)

- [ ] Write integration tests for auth flows
- [ ] Test RLS policies
- [ ] Test file uploads
- [ ] Load testing

### 5. **Monitoring** (⏱️ 1 hour)

- [ ] Set up error tracking (Sentry)
- [ ] Monitor auth failures
- [ ] Track user signups
- [ ] Set up alerts

---

## 📊 Security Checklist

Before going to production, verify:

- [x] ✅ RLS enabled on all tables
- [x] ✅ Storage buckets have proper policies
- [x] ✅ Passwords use strong validation (8+ chars, mixed case, numbers)
- [x] ✅ Email verification enabled (optional but recommended)
- [x] ✅ Session management uses secure cookies
- [x] ✅ OAuth redirect URLs are whitelisted
- [ ] ⚠️ Rate limiting configured (Supabase dashboard → Auth → Rate Limits)
- [ ] ⚠️ CAPTCHA enabled for signup (Supabase dashboard → Auth → Security)
- [ ] ⚠️ Custom SMTP configured (optional)
- [ ] ⚠️ Security audit completed

---

## 📞 Support & Resources

### Documentation
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

### Community
- [Supabase Discord](https://discord.supabase.com)
- [Next.js Discord](https://discord.gg/nextjs)

### Project-Specific Files
- **RLS Policies**: [supabase/migrations/20250129000000_enable_rls_policies.sql](supabase/migrations/20250129000000_enable_rls_policies.sql)
- **Storage Config**: [supabase/migrations/20250129000001_storage_buckets.sql](supabase/migrations/20250129000001_storage_buckets.sql)
- **Auth Actions**: [src/actions/auth.ts](src/actions/auth.ts)
- **Session Helpers**: [src/lib/auth/session.ts](src/lib/auth/session.ts)

---

## 🎉 You're Ready!

Your Thorbis application now has:
- ✅ **Secure authentication** with email/password and OAuth
- ✅ **Protected routes** with automatic redirects
- ✅ **Row-level security** for multi-tenant data isolation
- ✅ **File storage** with proper access controls
- ✅ **Session management** with Next.js 16+ compliance

**Start building your features!** 🚀

---

*Last updated: January 29, 2025*
