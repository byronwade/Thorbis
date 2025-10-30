# ⚡ Thorbis Authentication - Quick Start

**5 Minutes to Full Authentication** 🚀

---

## 📋 Prerequisites

- ✅ Project ready at `/Users/byronwade/Stratos`
- ✅ All auth code already implemented
- ⏳ Need: Supabase account (free)

---

## 🚀 Setup Steps

### 1. Create Supabase Project (2 min)

```bash
1. Go to: https://supabase.com/dashboard
2. Click: "New Project"
3. Enter:
   - Name: Thorbis
   - Password: (generate strong password - SAVE IT!)
   - Region: (choose closest to you)
4. Click: "Create new project"
5. Wait ~2 minutes
```

### 2. Get Credentials (1 min)

```bash
1. In Supabase dashboard:
   Settings → API
2. Copy these 3 values:
   ✓ Project URL
   ✓ anon public key
   ✓ service_role key (secret!)
```

### 3. Add to .env.local (1 min)

Create `/Users/byronwade/Stratos/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
DATABASE_URL=postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Migrations (1 min)

```bash
1. In Supabase dashboard:
   SQL Editor → New Query
2. Copy/paste contents of:
   /Users/byronwade/Stratos/supabase/migrations/20250129000000_enable_rls_policies.sql
3. Click "Run"
4. Repeat for:
   /Users/byronwade/Stratos/supabase/migrations/20250129000001_storage_buckets.sql
```

### 5. Test (30 sec)

```bash
cd /Users/byronwade/Stratos
pnpm dev
open http://localhost:3000/register
```

**Try it:**
1. Register new account
2. Should redirect to `/dashboard` ✅
3. Check Supabase → Auth → Users ✅

---

## ✅ You're Done!

**What works now:**
- ✅ User registration
- ✅ Login/logout
- ✅ Dashboard protection
- ✅ File uploads
- ✅ OAuth (after provider setup)

---

## 📚 Full Documentation

- **Setup Guide**: [AUTHENTICATION_SETUP_GUIDE.md](AUTHENTICATION_SETUP_GUIDE.md)
- **Summary**: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- **Checklist**: [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)

---

## 🆘 Problems?

| Issue | Fix |
|-------|-----|
| "Auth not configured" | Check `.env.local` exists and has correct values |
| "Can't connect to DB" | Verify `DATABASE_URL` and Supabase password |
| "RLS error" | Run migration SQL files in Supabase SQL Editor |

**Full troubleshooting**: [AUTHENTICATION_SETUP_GUIDE.md § Troubleshooting](AUTHENTICATION_SETUP_GUIDE.md#-troubleshooting)

---

**Time**: 5 minutes
**Status**: Production-ready
**Security**: Enterprise-grade

🎉 **Start building!**
