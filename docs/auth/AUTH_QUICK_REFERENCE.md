# Authentication System - Quick Reference Guide

**Last Updated:** 2025-10-31

---

## Quick Links

- 📋 **Full Security Audit:** [AUTHENTICATION_SECURITY_AUDIT.md](./AUTHENTICATION_SECURITY_AUDIT.md)
- 🗺️ **Backend Architecture:** [BACKEND_ARCHITECTURE_ANALYSIS.md](./BACKEND_ARCHITECTURE_ANALYSIS.md)
- 🗃️ **Database Review:** [DATABASE_ARCHITECTURE_REVIEW.md](./DATABASE_ARCHITECTURE_REVIEW.md)

---

## Critical Security Gaps (FIX IMMEDIATELY)

| Issue | Impact | Priority | Estimated Time |
|-------|--------|----------|----------------|
| ❌ **No Middleware** | Unauthenticated access to `/dashboard/*` | 🔴 P0 | 2 hours |
| ❌ **No Rate Limiting** | Brute force attacks on login | 🔴 P0 | 4 hours |
| ❌ **No CSRF Protection** | Request forgery attacks | 🔴 P0 | 3 hours |
| ❌ **No Session Timeout** | Sessions never expire | 🔴 P0 | 2 hours |
| ❌ **No MFA/2FA** | Account takeover if password compromised | 🟠 P1 | 8 hours |

---

## Authentication Flow Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION FLOWS                      │
└─────────────────────────────────────────────────────────────┘

1. SIGN UP
   User → Form → signUp() → Supabase Auth → Custom Token → Email
   └─> Verification Link → verifyEmail() → Welcome Email → Dashboard

2. SIGN IN
   User → Form → signIn() → Supabase Auth → Session Cookie → Dashboard
   ⚠️  NO RATE LIMITING - VULNERABLE TO BRUTE FORCE

3. PASSWORD RESET
   User → Form → forgotPassword() → Supabase Email → Reset Link
   └─> resetPassword() → Password Changed Email → Login

4. OAUTH
   User → signInWithOAuth() → Provider Login → Callback → Session
   ⚠️  NO STATE PARAMETER - VULNERABLE TO CSRF

5. LOGOUT
   User → signOut() → Clear Cookies → Redirect to /login
```

---

## File Structure

```
src/
├── actions/
│   ├── auth.ts                  # ✅ All auth Server Actions
│   ├── company.ts               # ✅ Company management
│   └── team.ts                  # ✅ Team member management
├── lib/
│   ├── auth/
│   │   ├── session.ts           # ✅ Session utilities (cached)
│   │   ├── tokens.ts            # ✅ Email verification tokens
│   │   └── user-data.ts         # ✅ User profile utilities
│   ├── supabase/
│   │   ├── server.ts            # ✅ Server-side client
│   │   └── client.ts            # ✅ Client-side client
│   └── errors/
│       └── with-error-handling.ts  # ✅ Centralized error handling
├── app/
│   └── auth/
│       ├── callback/route.ts    # ✅ OAuth callback handler
│       └── verify-email/        # ✅ Email verification page
└── middleware.ts                # ❌ MISSING - CRITICAL GAP

supabase/
└── migrations/
    ├── 20250131000010_rls_complete.sql           # ✅ 42+ RLS policies
    └── 20250131000020_complete_security_infrastructure.sql
```

---

## Key Components

### 1. Server Actions (`/src/actions/auth.ts`)

| Action | Description | Security Status |
|--------|-------------|-----------------|
| `signUp()` | Create account + email verification | ✅ Zod validation, ⚠️ No rate limit |
| `signIn()` | Email/password login | ✅ Supabase Auth, ⚠️ No rate limit |
| `signOut()` | End session | ✅ Secure |
| `signInWithOAuth()` | Google/Facebook OAuth | ⚠️ No state parameter |
| `forgotPassword()` | Request password reset | ⚠️ No rate limit |
| `resetPassword()` | Update password | ✅ Zod validation |
| `verifyEmail()` | Verify email with token | ✅ One-time use tokens |
| `getCurrentUser()` | Get authenticated user | ✅ Cached |
| `getSession()` | Get current session | ✅ Cached |

### 2. Session Utilities (`/src/lib/auth/session.ts`)

```typescript
import { getCurrentUser, requireUser } from "@/lib/auth/session";

// Get user (nullable)
const user = await getCurrentUser();

// Require user (throws if not authenticated)
const user = await requireUser();

// Get session
const session = await getSession();

// Check if authenticated
const isAuth = await isAuthenticated();
```

### 3. Company Context (`/src/actions/company.ts`)

**Pattern:** Users belong to companies via `team_members` table

```typescript
// Get user's company
const { data: teamMember } = await supabase
  .from("team_members")
  .select("company_id")
  .eq("user_id", user.id)
  .single();

// All data is isolated by company_id via RLS
```

### 4. RLS Policies (Supabase)

**Coverage:** ✅ 42+ tables with RLS enabled

**Pattern:**
```sql
CREATE POLICY "Company members can read customers"
  ON customers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = customers.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );
```

---

## Security Checklist

### ✅ Implemented

- [x] Password complexity validation (8+ chars, uppercase, lowercase, number)
- [x] Email verification with custom tokens
- [x] Secure password storage (Supabase bcrypt)
- [x] OAuth support (Google, Facebook)
- [x] RLS policies on all 42+ tables
- [x] Multi-tenant isolation via company_id
- [x] Role-based access control
- [x] Centralized error handling
- [x] Input validation with Zod
- [x] HTTP-only cookies
- [x] Secure flag in production
- [x] SameSite cookies

### ❌ Missing (Critical)

- [ ] **Middleware route protection**
- [ ] **Rate limiting (login, signup, password reset)**
- [ ] **CSRF protection on forms**
- [ ] **Session timeout enforcement**
- [ ] **MFA/2FA support**
- [ ] **Account lockout after failed attempts**
- [ ] **OAuth state parameter**
- [ ] **Token cleanup cron job**
- [ ] **Security monitoring (Sentry)**

---

## Common Operations

### Protect a Page (Server Component)

```typescript
// app/dashboard/page.tsx
import { requireUser } from "@/lib/auth/session";

export default async function DashboardPage() {
  // This throws if not authenticated
  const user = await requireUser();

  return <div>Welcome {user.email}</div>;
}
```

### Protect a Server Action

```typescript
"use server";

import { requireUser } from "@/lib/auth/session";

export async function createCustomer(formData: FormData) {
  // Require authentication
  const user = await requireUser();

  // Get user's company
  const { data: teamMember } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", user.id)
    .single();

  // Create customer (RLS ensures company isolation)
  const { data, error } = await supabase
    .from("customers")
    .insert({
      company_id: teamMember.company_id,
      // ... other fields
    })
    .select()
    .single();

  return data;
}
```

### Get User Profile

```typescript
import { getUserProfile } from "@/lib/auth/user-data";

export default async function ProfilePage() {
  const profile = await getUserProfile();

  if (!profile) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <img src={profile.avatar} alt={profile.name} />
      <h1>{profile.name}</h1>
      <p>{profile.email}</p>
    </div>
  );
}
```

### Send Custom Email Verification

```typescript
import { createEmailVerificationToken } from "@/lib/auth/tokens";
import { sendEmailVerification } from "@/actions/emails";

// Generate token
const { token, expiresAt } = await createEmailVerificationToken(
  email,
  userId,
  24 // Expires in 24 hours
);

// Send email
const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify-email?token=${token}`;

await sendEmailVerification(email, {
  name: user.name,
  verificationUrl,
});
```

---

## Database Schema (Key Tables)

```sql
-- Users (Supabase Auth)
auth.users (
  id UUID PRIMARY KEY,
  email TEXT,
  encrypted_password TEXT,
  email_confirmed_at TIMESTAMPTZ,
  user_metadata JSONB
)

-- User Profiles (Public)
public.users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  name TEXT,
  email TEXT,
  avatar TEXT,
  email_verified BOOLEAN,
  created_at TIMESTAMPTZ
)

-- Companies
public.companies (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  logo TEXT
)

-- Team Members (Multi-tenancy Join)
public.team_members (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies,
  user_id UUID REFERENCES auth.users,
  role_id UUID REFERENCES custom_roles,
  status TEXT DEFAULT 'active',
  -- 'active' | 'invited' | 'suspended'
)

-- Verification Tokens
public.verification_tokens (
  id UUID PRIMARY KEY,
  token TEXT UNIQUE,
  email TEXT,
  type TEXT, -- 'email_verification' | 'password_reset'
  user_id UUID,
  used BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ
)
```

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database
DATABASE_URL=postgresql://postgres:[password]@db.supabase.co:5432/postgres

# Email
RESEND_API_KEY=re_your-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Site
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production

# TODO: Add these for security
CSRF_SECRET=your-32-byte-secret
CRON_SECRET=your-cron-secret
UPSTASH_REDIS_URL=https://your-redis.upstash.io
UPSTASH_REDIS_TOKEN=your-redis-token
SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io
```

---

## Next Steps

### Week 1: Critical Fixes (11 hours)

1. **Create Middleware** (2 hours)
   - Create `/middleware.ts`
   - Protect `/dashboard/*` routes
   - Redirect unauthenticated users to `/login`
   - Test route protection

2. **Add Rate Limiting** (4 hours)
   - Set up Upstash Redis
   - Install `@upstash/ratelimit`
   - Create `/src/lib/rate-limit.ts`
   - Add to `signIn()`, `signUp()`, `forgotPassword()`
   - Test with automated scripts

3. **Add CSRF Protection** (3 hours)
   - Create `/src/lib/csrf.ts`
   - Add token generation endpoint
   - Update all forms with hidden CSRF field
   - Add validation to Server Actions

4. **Session Timeout** (2 hours)
   - Update `/src/lib/supabase/server.ts`
   - Set `maxAge: 7 * 24 * 60 * 60` (7 days)
   - Test session expiration

### Week 2: High Priority (19 hours)

1. **MFA Support** (8 hours)
2. **Token Hashing** (2 hours)
3. **Account Lockout** (3 hours)
4. **Token Cleanup Cron** (2 hours)
5. **Sentry Integration** (4 hours)

---

## Resources

- **Supabase Auth Docs:** https://supabase.com/docs/guides/auth
- **Next.js 16 Middleware:** https://nextjs.org/docs/app/building-your-application/routing/middleware
- **Upstash Redis:** https://upstash.com/docs/redis
- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **Zod Validation:** https://zod.dev/

---

## Support

**Questions?** Review the full security audit:
- `/docs/AUTHENTICATION_SECURITY_AUDIT.md`

**Need Help?** Check these files:
- `/src/actions/auth.ts` - All auth logic
- `/src/lib/auth/session.ts` - Session helpers
- `/supabase/migrations/*_rls_complete.sql` - RLS policies

---

**Document Version:** 1.0
**Last Updated:** 2025-10-31
