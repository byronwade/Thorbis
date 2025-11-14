# Authentication System Architecture - Comprehensive Security Audit

**Generated:** 2025-10-31
**Project:** Thorbis (Thorbis)
**Auditor:** Senior Backend Security Specialist

---

## Executive Summary

This document provides a comprehensive analysis of the authentication and authorization system for the Thorbis platform. The system uses **Supabase Auth** with custom email verification tokens, **Row Level Security (RLS)** policies for multi-tenant data isolation, and **Server Actions** for secure server-side operations.

### Overall Security Rating: **B+ (Good with Critical Gaps)**

**Strengths:**
- ✅ Comprehensive RLS policies on all 42+ tables
- ✅ Strong password policies with Zod validation
- ✅ Custom email verification with secure tokens
- ✅ Multi-tenant isolation via company_id
- ✅ Server-side validation for all mutations
- ✅ Centralized error handling with proper logging

**Critical Gaps:**
- ❌ **NO MIDDLEWARE** - No auth protection on routes
- ❌ **NO RATE LIMITING** - Vulnerable to brute force attacks
- ❌ **NO CSRF PROTECTION** - Missing CSRF tokens on forms
- ❌ **NO SESSION TIMEOUT** - Sessions never expire
- ❌ **NO MFA/2FA** - Single factor authentication only
- ❌ **INCOMPLETE TOKEN CLEANUP** - Old verification tokens not purged

---

## 1. Authentication Flow Analysis

### 1.1 Sign Up Flow

**File:** `/src/actions/auth.ts` (Lines 92-218)

```typescript
// Flow: User Registration → Email Verification → Welcome Email
export async function signUp(formData: FormData)
```

**Security Implementation:**
1. ✅ **Input Validation:** Zod schema validates all inputs
   - Email format validation
   - Password complexity: min 8 chars, uppercase, lowercase, number
   - Terms acceptance required
2. ✅ **Custom Token Generation:** Uses `crypto.randomBytes(32)` for secure tokens
3. ✅ **Email Verification:** Custom tokens stored in `verification_tokens` table
4. ✅ **Database Trigger:** Auto-creates user profile on signup
5. ⚠️ **Password Storage:** Delegated to Supabase Auth (bcrypt internally)

**Issues Identified:**

| Severity | Issue | Location | Impact |
|----------|-------|----------|--------|
| **HIGH** | No account lockout after failed signups | `signUp()` | Brute force vulnerability |
| **MEDIUM** | Email enumeration possible | Line 137 | Attacker can identify valid emails |
| **LOW** | No CAPTCHA protection | `signUp()` | Bot signup vulnerability |

**Recommendations:**
```typescript
// 1. Add rate limiting
import { Ratelimit } from "@upstash/ratelimit";
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 signups per hour per IP
});

// 2. Prevent email enumeration
// Always return success message even if email exists
return {
  success: true,
  data: {
    message: "Please check your email to verify your account.",
  }
};

// 3. Add CAPTCHA verification
const captchaValid = await verifyCaptcha(formData.get("captcha"));
if (!captchaValid) {
  return { success: false, error: "CAPTCHA verification failed" };
}
```

---

### 1.2 Sign In Flow

**File:** `/src/actions/auth.ts` (Lines 229-292)

```typescript
export async function signIn(formData: FormData)
```

**Security Implementation:**
1. ✅ **Input Validation:** Email and password validation with Zod
2. ✅ **Supabase Auth:** Uses `signInWithPassword()` - secure bcrypt comparison
3. ✅ **Session Creation:** Automatic session management via Supabase
4. ❌ **NO RATE LIMITING:** Unlimited login attempts allowed
5. ❌ **NO MFA:** Single factor authentication only

**Critical Vulnerabilities:**

| Severity | Issue | Location | Impact | CVE Reference |
|----------|-------|----------|--------|---------------|
| **CRITICAL** | No rate limiting on login | Lines 229-292 | Brute force attacks | CWE-307 |
| **CRITICAL** | No account lockout | N/A | Credential stuffing | CWE-307 |
| **HIGH** | No IP-based blocking | N/A | Distributed attacks | CWE-799 |
| **HIGH** | No MFA support | N/A | Account takeover | CWE-308 |
| **MEDIUM** | Generic error messages leak info | Line 257-260 | Information disclosure | CWE-209 |

**Recommended Implementation:**

```typescript
// src/lib/auth/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"), // 5 attempts per 15 minutes
  analytics: true,
});

export const signupRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 signups per hour
  analytics: true,
});

// Usage in signIn action:
const identifier = `login:${formData.get("email")}`;
const { success: rateLimitOk } = await loginRateLimit.limit(identifier);

if (!rateLimitOk) {
  return {
    success: false,
    error: "Too many login attempts. Please try again in 15 minutes.",
  };
}
```

---

### 1.3 OAuth Flow

**File:** `/src/actions/auth.ts` (Lines 347-394)

```typescript
export async function signInWithOAuth(provider: "google" | "facebook")
```

**Security Implementation:**
1. ✅ **Secure Redirect:** Uses `NEXT_PUBLIC_SITE_URL` for callback
2. ✅ **Callback Handler:** `/src/app/auth/callback/route.ts` validates OAuth code
3. ⚠️ **State Parameter Missing:** No CSRF protection on OAuth flow
4. ❌ **Limited Providers:** Only Google and Facebook supported

**OAuth Callback Issues:**

| Severity | Issue | Location | Impact |
|----------|-------|----------|--------|
| **HIGH** | Missing state parameter validation | `signInWithOAuth()` | CSRF attacks on OAuth |
| **MEDIUM** | No nonce validation | `/auth/callback/route.ts` | Replay attacks |
| **LOW** | Error messages expose details | Lines 22-26 | Information leakage |

**Secure OAuth Implementation:**

```typescript
// Generate and store state parameter
export async function signInWithOAuth(provider: "google" | "facebook") {
  const state = crypto.randomBytes(32).toString("hex");

  // Store state in encrypted cookie
  cookies().set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      queryParams: {
        state, // CSRF protection
      },
    },
  });
}

// Validate state in callback
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");
  const storedState = cookies().get("oauth_state")?.value;

  if (!state || state !== storedState) {
    return NextResponse.redirect(
      `${origin}/login?error=Invalid+state+parameter`
    );
  }

  // Clear state cookie after validation
  cookies().delete("oauth_state");

  // Continue with code exchange...
}
```

---

### 1.4 Password Reset Flow

**File:** `/src/actions/auth.ts` (Lines 404-477, 488-561)

**Security Implementation:**
1. ✅ **Supabase Native:** Uses `resetPasswordForEmail()`
2. ⚠️ **TODO Comment:** Custom token system planned but not implemented
3. ❌ **No Rate Limiting:** Unlimited reset requests
4. ✅ **Confirmation Email:** Sends password changed notification

**Password Reset Vulnerabilities:**

| Severity | Issue | Location | Impact |
|----------|-------|----------|--------|
| **HIGH** | No rate limiting on reset requests | Lines 404-477 | Email flooding |
| **MEDIUM** | Reset link never expires | N/A | Extended attack window |
| **MEDIUM** | No notification of suspicious activity | N/A | Account takeover detection |
| **LOW** | Uses Supabase email vs custom | Line 438-443 | Less control over UX |

**Recommendations:**
```typescript
// 1. Implement rate limiting
const resetIdentifier = `reset:${validatedData.email}`;
const { success } = await passwordResetRateLimit.limit(resetIdentifier);

if (!success) {
  return {
    success: false,
    error: "Too many reset requests. Please try again later.",
  };
}

// 2. Add suspicious activity detection
// If user has active session, send alert email
const { data: session } = await supabase.auth.getSession();
if (session) {
  await sendSecurityAlert(validatedData.email, {
    type: "password_reset_requested",
    ip: request.headers.get("x-forwarded-for"),
    userAgent: request.headers.get("user-agent"),
  });
}

// 3. Set explicit expiration
const { error } = await supabase.auth.resetPasswordForEmail(
  validatedData.email,
  {
    redirectTo: `${emailConfig.siteUrl}/auth/reset-password`,
    // TODO: Add expiration parameter when Supabase supports it
  }
);
```

---

## 2. Session Management Analysis

### 2.1 Server-Side Session Handling

**File:** `/src/lib/supabase/server.ts`

```typescript
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options) {
        try {
          cookieStore.set(name, value, options);
        } catch {
          // Silently fail in Server Components
        }
      },
      remove(name: string) {
        try {
          cookieStore.delete(name);
        } catch {
          // Silently fail in Server Components
        }
      },
    },
  });
}
```

**Security Analysis:**

✅ **Good Practices:**
- Uses Next.js 16 async `cookies()` API
- Server-side cookie handling via Supabase SSR
- HTTP-only cookies (set by Supabase)
- Secure flag in production (set by Supabase)

❌ **Missing Security Features:**

| Feature | Status | Impact | Recommendation |
|---------|--------|--------|----------------|
| **Session Timeout** | ❌ Missing | Sessions never expire | Add `maxAge` to cookies |
| **Session Rotation** | ❌ Missing | Session fixation attacks | Rotate on privilege change |
| **IP Binding** | ❌ Missing | Session hijacking | Bind session to IP |
| **Device Fingerprinting** | ❌ Missing | Session theft | Add device validation |
| **Concurrent Session Limit** | ❌ Missing | Account sharing | Limit active sessions |

**Cookie Security Hardening:**

```typescript
// src/lib/supabase/server.ts
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options) {
        try {
          cookieStore.set(name, value, {
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax", // CSRF protection
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
          });
        } catch {
          // Server Component - ignore
        }
      },
      remove(name: string, options) {
        try {
          cookieStore.delete(name);
        } catch {
          // Server Component - ignore
        }
      },
    },
  });
}
```

### 2.2 Session Utilities

**File:** `/src/lib/auth/session.ts`

**Security Features:**
1. ✅ **React Cache:** Request-level memoization prevents multiple DB calls
2. ✅ **Null Safety:** Proper error handling for missing sessions
3. ✅ **Type Safety:** Full TypeScript support
4. ❌ **No Session Validation:** Doesn't check IP, device, or expiration

**Missing Session Security:**

```typescript
// src/lib/auth/session.ts
import { headers } from "next/headers";

/**
 * Validate Session Security
 *
 * Checks IP address, device fingerprint, and expiration
 */
export async function validateSessionSecurity(
  session: Session
): Promise<boolean> {
  const headersList = await headers();
  const currentIp = headersList.get("x-forwarded-for");
  const currentUserAgent = headersList.get("user-agent");

  // Get session metadata from database
  const { data: sessionMeta } = await supabase
    .from("sessions")
    .select("ip_address, user_agent, created_at")
    .eq("access_token", session.access_token)
    .single();

  if (!sessionMeta) {
    return false;
  }

  // Check IP match
  if (sessionMeta.ip_address !== currentIp) {
    console.warn("Session IP mismatch", {
      stored: sessionMeta.ip_address,
      current: currentIp,
    });
    return false;
  }

  // Check device fingerprint
  if (sessionMeta.user_agent !== currentUserAgent) {
    console.warn("Session device mismatch");
    return false;
  }

  // Check session age (max 7 days)
  const sessionAge = Date.now() - new Date(sessionMeta.created_at).getTime();
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

  if (sessionAge > maxAge) {
    console.warn("Session expired");
    return false;
  }

  return true;
}

/**
 * Enhanced Get Session with Security Validation
 */
export const getSession = cache(async (): Promise<Session | null> => {
  try {
    const supabase = await createClient();
    if (!supabase) return null;

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    // Validate session security
    const isValid = await validateSessionSecurity(session);
    if (!isValid) {
      await supabase.auth.signOut();
      return null;
    }

    return session;
  } catch (error) {
    console.error("Session validation error:", error);
    return null;
  }
});
```

---

## 3. Security Assessment - Critical Findings

### 3.1 Missing Middleware (CRITICAL)

**Issue:** No middleware file exists to protect routes

**Impact:**
- ❌ Unauthenticated users can access `/dashboard/*` pages
- ❌ No automatic session refresh
- ❌ No role-based route protection
- ❌ API routes are unprotected

**Evidence:**
```bash
# Search result shows NO middleware.ts in project root
$ find /Users/byronwade/Thorbis -name "middleware.ts" -o -name "middleware.js" | grep -v node_modules
# No results - CRITICAL SECURITY GAP
```

**Required Implementation:**

Create: `/Users/byronwade/Thorbis/middleware.ts`

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware - Auth Protection for All Routes
 *
 * CRITICAL: This file protects all authenticated routes
 * and ensures session refresh on every request.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options) {
          request.cookies.set({ name, value: "", ...options });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes require authentication
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Redirect authenticated users away from auth pages
  if (
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup")
  ) {
    if (session) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

---

### 3.2 CSRF Protection (HIGH SEVERITY)

**Issue:** No CSRF tokens on forms or Server Actions

**Impact:**
- Attacker can forge requests from authenticated users
- Cross-site request forgery attacks possible
- All state-changing operations vulnerable

**Vulnerable Forms:**
- Sign up form
- Sign in form
- Password reset form
- All settings forms
- Company management forms

**Current State:**
```typescript
// src/actions/auth.ts - NO CSRF PROTECTION
export async function signIn(formData: FormData): Promise<AuthActionResult> {
  // ❌ No CSRF token validation
  const validatedData = signInSchema.parse(rawData);
  // ...
}
```

**Required Implementation:**

```typescript
// src/lib/csrf.ts
import { headers } from "next/headers";
import { randomBytes } from "crypto";

const CSRF_SECRET = process.env.CSRF_SECRET!;
const CSRF_COOKIE_NAME = "csrf_token";

/**
 * Generate CSRF Token
 */
export async function generateCsrfToken(): Promise<string> {
  const token = randomBytes(32).toString("hex");

  // Store in HTTP-only cookie
  cookies().set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour
  });

  return token;
}

/**
 * Validate CSRF Token
 */
export async function validateCsrfToken(token: string): Promise<boolean> {
  const cookieToken = cookies().get(CSRF_COOKIE_NAME)?.value;

  if (!cookieToken || !token) {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(cookieToken),
    Buffer.from(token)
  );
}

/**
 * CSRF Middleware for Server Actions
 */
export async function withCsrfProtection<T>(
  fn: () => Promise<T>,
  csrfToken: string
): Promise<T> {
  const isValid = await validateCsrfToken(csrfToken);

  if (!isValid) {
    throw new Error("Invalid CSRF token");
  }

  return fn();
}
```

**Usage in Server Actions:**

```typescript
// src/actions/auth.ts
export async function signIn(formData: FormData): Promise<AuthActionResult> {
  return withCsrfProtection(
    async () => {
      // Existing sign in logic
    },
    formData.get("csrf_token") as string
  );
}
```

**Form Updates:**

```tsx
// components/auth/sign-in-form.tsx
"use client";

import { useEffect, useState } from "react";

export function SignInForm() {
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    // Fetch CSRF token from server
    fetch("/api/csrf-token")
      .then(res => res.json())
      .then(data => setCsrfToken(data.token));
  }, []);

  return (
    <form action={signIn}>
      <input type="hidden" name="csrf_token" value={csrfToken} />
      {/* Rest of form */}
    </form>
  );
}
```

---

### 3.3 Rate Limiting (CRITICAL)

**Issue:** No rate limiting on any endpoints

**Impact:**
- Brute force attacks on login
- Account enumeration via signup
- Email flooding via password reset
- API abuse

**Required Implementation:**

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

/**
 * Rate Limiters for Different Operations
 */
export const rateLimiters = {
  // Auth operations
  login: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    analytics: true,
    prefix: "ratelimit:login",
  }),

  signup: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 h"),
    analytics: true,
    prefix: "ratelimit:signup",
  }),

  passwordReset: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 h"),
    analytics: true,
    prefix: "ratelimit:password-reset",
  }),

  emailVerification: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: true,
    prefix: "ratelimit:email-verification",
  }),

  // API operations
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m"),
    analytics: true,
    prefix: "ratelimit:api",
  }),
};

/**
 * Get Client Identifier (IP + User Agent)
 */
export async function getClientIdentifier(): Promise<string> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";
  const userAgent = headersList.get("user-agent") || "unknown";

  return `${ip}:${userAgent}`;
}

/**
 * Rate Limit Middleware
 */
export async function rateLimit(
  identifier: string,
  limiter: Ratelimit
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  return { success, limit, remaining, reset };
}
```

**Environment Variables:**

```bash
# .env.local
UPSTASH_REDIS_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_TOKEN=your-redis-token
```

**Package Installation:**

```bash
pnpm add @upstash/ratelimit @upstash/redis
```

---

### 3.4 Multi-Factor Authentication (HIGH PRIORITY)

**Issue:** No MFA/2FA support

**Impact:**
- Account takeover if password compromised
- No protection against phishing
- Compliance issues (SOC 2, ISO 27001)

**Recommended Implementation:**

```typescript
// src/lib/auth/mfa.ts
import { authenticator } from "otplib";
import QRCode from "qrcode";

/**
 * Generate MFA Secret
 */
export async function generateMfaSecret(
  userId: string,
  email: string
): Promise<{ secret: string; qrCode: string }> {
  const secret = authenticator.generateSecret();

  // Generate OTP Auth URL
  const otpauthUrl = authenticator.keyuri(
    email,
    "Thorbis",
    secret
  );

  // Generate QR code
  const qrCode = await QRCode.toDataURL(otpauthUrl);

  // Store secret in database (encrypted)
  await supabase
    .from("user_mfa")
    .upsert({
      user_id: userId,
      secret: encrypt(secret), // Use AES-256-GCM encryption
      enabled: false,
      created_at: new Date().toISOString(),
    });

  return { secret, qrCode };
}

/**
 * Verify MFA Code
 */
export async function verifyMfaCode(
  userId: string,
  code: string
): Promise<boolean> {
  // Get encrypted secret from database
  const { data: mfaData } = await supabase
    .from("user_mfa")
    .select("secret, enabled")
    .eq("user_id", userId)
    .single();

  if (!mfaData || !mfaData.enabled) {
    return false;
  }

  // Decrypt secret
  const secret = decrypt(mfaData.secret);

  // Verify code with time window of ±1 period (30 seconds)
  return authenticator.verify({
    token: code,
    secret,
  });
}

/**
 * Enable MFA for User
 */
export async function enableMfa(
  userId: string,
  verificationCode: string
): Promise<{ success: boolean; backupCodes: string[] }> {
  // Verify code before enabling
  const isValid = await verifyMfaCode(userId, verificationCode);

  if (!isValid) {
    throw new Error("Invalid verification code");
  }

  // Generate backup codes
  const backupCodes = Array.from({ length: 10 }, () =>
    randomBytes(4).toString("hex").toUpperCase()
  );

  // Store hashed backup codes
  await supabase
    .from("user_mfa")
    .update({
      enabled: true,
      backup_codes: backupCodes.map(code => hashBackupCode(code)),
      enabled_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  return { success: true, backupCodes };
}
```

**Database Schema Addition:**

```sql
-- supabase/migrations/YYYYMMDD_add_mfa_support.sql
CREATE TABLE user_mfa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  secret TEXT NOT NULL, -- Encrypted TOTP secret
  enabled BOOLEAN NOT NULL DEFAULT false,
  backup_codes TEXT[], -- Hashed backup codes
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  enabled_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_mfa ENABLE ROW LEVEL SECURITY;

-- Users can only access their own MFA settings
CREATE POLICY "Users can read own MFA settings"
  ON user_mfa
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own MFA settings"
  ON user_mfa
  FOR UPDATE
  USING (auth.uid() = user_id);
```

---

## 4. Company Data Integration Analysis

### 4.1 Multi-Tenancy Architecture

**Pattern:** Row Level Security (RLS) with company_id isolation

**Implementation:**
- All data tables include `company_id` foreign key
- RLS policies enforce company-based access control
- Users belong to companies via `team_members` table
- No cross-company data access possible

**Security Model:**

```sql
-- Example RLS Policy (from 20250131000010_rls_complete.sql)
CREATE POLICY "Company members can read customers"
  ON customers
  FOR SELECT
  USING (
    deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = customers.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );
```

**Coverage:** ✅ 42+ tables protected with RLS

**Tables with Company Isolation:**
- ✅ customers
- ✅ properties
- ✅ jobs
- ✅ invoices
- ✅ estimates
- ✅ payments
- ✅ communications
- ✅ equipment
- ✅ schedules
- ✅ inventory
- ✅ And 32 more...

### 4.2 Company Switching Logic

**File:** `/src/actions/company.ts`

**Pattern:** User queries `team_members` table to get company context

```typescript
// Get user's company
const { data: teamMember } = await supabase
  .from("team_members")
  .select("company_id")
  .eq("user_id", user.id)
  .single();
```

**Issues:**

| Severity | Issue | Impact | Recommendation |
|----------|-------|--------|----------------|
| **MEDIUM** | No caching of company context | Performance hit on every request | Cache in session |
| **MEDIUM** | No support for multiple companies | Users limited to one company | Add company selector |
| **LOW** | No company-level audit logs | Hard to track cross-company activity | Add audit table |

**Enhanced Company Context:**

```typescript
// src/lib/auth/company-context.ts
import { cache } from "react";

/**
 * Get User's Companies (with caching)
 */
export const getUserCompanies = cache(
  async (): Promise<Array<{ id: string; name: string; role: string }>> => {
    const user = await getCurrentUser();
    if (!user) return [];

    const supabase = await createClient();

    const { data: memberships } = await supabase
      .from("team_members")
      .select(`
        company_id,
        role_id,
        companies!inner (
          id,
          name,
          logo
        ),
        custom_roles (
          name
        )
      `)
      .eq("user_id", user.id)
      .eq("status", "active");

    return memberships?.map((m: any) => ({
      id: m.companies.id,
      name: m.companies.name,
      logo: m.companies.logo,
      role: m.custom_roles?.name || "member",
    })) || [];
  }
);

/**
 * Get Active Company (from session or first available)
 */
export const getActiveCompany = cache(async (): Promise<string | null> => {
  const session = await getSession();

  // Check session for active company
  const activeCompanyId = session?.user?.user_metadata?.active_company_id;

  if (activeCompanyId) {
    return activeCompanyId;
  }

  // Fallback to first company
  const companies = await getUserCompanies();
  return companies[0]?.id || null;
});

/**
 * Switch Active Company
 */
export async function switchCompany(
  companyId: string
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const user = await getCurrentUser();
    assertAuthenticated(user?.id);

    // Verify user has access to company
    const companies = await getUserCompanies();
    const hasAccess = companies.some(c => c.id === companyId);

    if (!hasAccess) {
      throw new ActionError(
        "Access denied to company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Update user metadata
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      data: {
        active_company_id: companyId,
      },
    });

    if (error) {
      throw new ActionError(
        "Failed to switch company",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/", "layout");
  });
}
```

---

## 5. Token Management Security

### 5.1 Verification Tokens

**File:** `/src/lib/auth/tokens.ts`

**Implementation:**
- ✅ Secure token generation: `crypto.randomBytes(32)` (64 hex chars)
- ✅ Database storage with expiration
- ✅ One-time use enforcement
- ✅ Type-based tokens: email_verification, password_reset, magic_link

**Token Schema:**

```typescript
// From schema.ts
export const verificationTokens = pgTable("verification_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  token: pgText("token").notNull().unique(),
  email: pgText("email").notNull(),
  type: pgText("type").notNull().default("email_verification"),
  userId: uuid("user_id"),
  used: pgBoolean("used").notNull().default(false),
  usedAt: timestamp("used_at"),
  expiresAt: timestamp("expires_at").notNull(),
  metadata: pgJson("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

**Security Analysis:**

✅ **Strengths:**
1. Cryptographically secure random tokens
2. Unique constraint prevents duplicates
3. Expiration enforcement (24 hours for email, 1 hour for password reset)
4. One-time use prevents replay attacks
5. Type-based separation

❌ **Weaknesses:**

| Issue | Severity | Impact | Recommendation |
|-------|----------|--------|----------------|
| No automatic cleanup of expired tokens | MEDIUM | Database bloat | Add cron job |
| No rate limit on token generation | HIGH | Token enumeration | Add rate limiting |
| Tokens stored in plaintext | MEDIUM | Database breach exposure | Hash tokens |
| No IP binding | LOW | Token theft | Store request IP |

**Enhanced Token System:**

```typescript
// src/lib/auth/tokens-enhanced.ts
import { createHash } from "crypto";

/**
 * Hash Token for Storage (one-way hash)
 */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Create Email Verification Token (Enhanced)
 */
export async function createEmailVerificationToken(
  email: string,
  userId?: string,
  expiresInHours = 24
): Promise<{ token: string; expiresAt: Date }> {
  // Check rate limit
  const identifier = `token:email:${email}`;
  const { success } = await rateLimiters.emailVerification.limit(identifier);

  if (!success) {
    throw new ActionError(
      "Too many verification requests",
      ERROR_CODES.RATE_LIMIT_EXCEEDED
    );
  }

  const token = generateSecureToken();
  const hashedToken = hashToken(token);
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

  // Get request metadata
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for");
  const userAgent = headersList.get("user-agent");

  // Store hashed token
  await db.insert(verificationTokens).values({
    token: hashedToken, // Store hash, not plaintext
    email,
    type: "email_verification",
    userId,
    expiresAt,
    used: false,
    metadata: {
      ip,
      userAgent,
      generatedAt: new Date().toISOString(),
    },
  });

  return { token, expiresAt }; // Return plaintext for email
}

/**
 * Verify and Consume Token (Enhanced)
 */
export async function verifyAndConsumeToken(
  token: string,
  type: "email_verification" | "password_reset" | "magic_link"
) {
  const hashedToken = hashToken(token);
  const now = new Date();

  // Validate request IP matches
  const headersList = await headers();
  const currentIp = headersList.get("x-forwarded-for");

  const [tokenRecord] = await db
    .select()
    .from(verificationTokens)
    .where(
      and(
        eq(verificationTokens.token, hashedToken),
        eq(verificationTokens.type, type),
        eq(verificationTokens.used, false),
        gt(verificationTokens.expiresAt, now)
      )
    )
    .limit(1);

  if (!tokenRecord) {
    return null;
  }

  // Validate IP (optional, can be disabled for mobile apps)
  const storedIp = (tokenRecord.metadata as any)?.ip;
  if (storedIp && storedIp !== currentIp) {
    console.warn("Token IP mismatch", {
      stored: storedIp,
      current: currentIp,
    });
    // Don't fail, just log for security monitoring
  }

  // Mark as used
  await db
    .update(verificationTokens)
    .set({
      used: true,
      usedAt: now,
    })
    .where(eq(verificationTokens.id, tokenRecord.id));

  return tokenRecord;
}

/**
 * Cleanup Expired Tokens (Cron Job)
 */
export async function cleanupExpiredTokens() {
  const now = new Date();
  const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days

  const result = await db
    .delete(verificationTokens)
    .where(
      or(
        lt(verificationTokens.expiresAt, cutoff), // Expired > 30 days ago
        and(
          eq(verificationTokens.used, true),
          lt(verificationTokens.usedAt, cutoff) // Used > 30 days ago
        )
      )
    );

  console.log(`Cleaned up ${result.rowsAffected} expired tokens`);
  return result.rowsAffected;
}
```

**Cron Job Setup:**

```typescript
// src/app/api/cron/cleanup-tokens/route.ts
import { cleanupExpiredTokens } from "@/lib/auth/tokens-enhanced";
import { NextResponse } from "next/server";

/**
 * Cron endpoint to cleanup expired tokens
 *
 * Configure in Vercel:
 * - Create cron job in vercel.json
 * - Set CRON_SECRET environment variable
 * - Run daily at 2 AM UTC
 */
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = await cleanupExpiredTokens();

  return NextResponse.json({
    success: true,
    deleted,
    timestamp: new Date().toISOString(),
  });
}
```

**vercel.json:**

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-tokens",
      "schedule": "0 2 * * *"
    }
  ]
}
```

---

## 6. Input Validation & Sanitization

### 6.1 Zod Validation

**Implementation:** All auth actions use Zod schemas

**Examples:**

```typescript
// Sign up validation
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
  terms: z.boolean().refine((val) => val === true),
});
```

**Strengths:**
- ✅ Email format validation
- ✅ Password complexity requirements
- ✅ Max length prevention (DoS protection)
- ✅ Custom error messages
- ✅ Type safety

**Gaps:**

| Issue | Severity | Impact | Recommendation |
|-------|----------|--------|----------------|
| No XSS sanitization | HIGH | Stored XSS attacks | Add DOMPurify |
| No SQL injection prevention | MEDIUM | Database compromise | Use parameterized queries |
| No path traversal protection | MEDIUM | File system access | Validate file paths |
| No unicode validation | LOW | Homograph attacks | Normalize unicode |

**Enhanced Validation:**

```typescript
// src/lib/validation/sanitize.ts
import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML Input (XSS Prevention)
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br"],
    ALLOWED_ATTR: ["href"],
  });
}

/**
 * Sanitize User Input (General)
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove < and >
    .slice(0, 1000); // Max length
}

/**
 * Validate File Path (Path Traversal Prevention)
 */
export function validateFilePath(path: string): boolean {
  // Prevent path traversal
  const normalized = path.replace(/\\/g, "/");

  if (
    normalized.includes("../") ||
    normalized.includes("/..") ||
    normalized.startsWith("/")
  ) {
    return false;
  }

  // Allowed extensions only
  const allowedExtensions = [".jpg", ".png", ".pdf", ".docx"];
  const ext = path.slice(path.lastIndexOf(".")).toLowerCase();

  return allowedExtensions.includes(ext);
}

/**
 * Enhanced Zod Schemas with Sanitization
 */
export const sanitizedStringSchema = z
  .string()
  .transform(sanitizeInput)
  .refine((val) => val.length > 0, "Field cannot be empty");

export const sanitizedHtmlSchema = z
  .string()
  .transform(sanitizeHtml)
  .refine((val) => val.length > 0, "Field cannot be empty");

// Usage:
const userInputSchema = z.object({
  name: sanitizedStringSchema.min(2).max(100),
  bio: sanitizedHtmlSchema.max(500),
  email: z.string().email(),
});
```

---

## 7. Error Handling & Information Disclosure

### 7.1 Error Response Analysis

**File:** `/src/lib/errors/with-error-handling.ts`

**Current Implementation:**

```typescript
export async function withErrorHandling<T>(
  fn: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    if (error instanceof ActionError) {
      console.error(`[ActionError ${error.code}]:`, error.message);
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }

    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation failed",
        code: ERROR_CODES.VALIDATION_FAILED,
        details: {
          issues: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      };
    }

    // Generic error in development, sanitized in production
    return {
      success: false,
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "An unexpected error occurred",
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    };
  }
}
```

**Security Analysis:**

✅ **Good Practices:**
1. Different error handling by type
2. Sanitized errors in production
3. Detailed validation errors with field mapping
4. Error codes for client handling

❌ **Information Leakage Issues:**

| Severity | Issue | Location | Impact |
|----------|-------|----------|--------|
| **MEDIUM** | Stack traces logged to console | Line 65, 79, 95 | Internal paths exposed |
| **MEDIUM** | Database errors expose schema | Generic catch | Table/column names leak |
| **LOW** | Validation details expose fields | Line 84-90 | Field enumeration |

**Production-Safe Error Handling:**

```typescript
// src/lib/errors/with-error-handling-enhanced.ts
import * as Sentry from "@sentry/nextjs";

/**
 * Enhanced Error Handler with Security
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    // Log to monitoring service (not console)
    if (process.env.NODE_ENV === "production") {
      Sentry.captureException(error, {
        level: "error",
        tags: {
          errorType: error instanceof ActionError ? "action" : "unexpected",
        },
      });
    } else {
      // Development: detailed logs
      console.error("[Error]:", error);
    }

    // Handle custom action errors
    if (error instanceof ActionError) {
      return {
        success: false,
        error: error.message,
        code: error.code,
        // Never expose details in production
        ...(process.env.NODE_ENV === "development" && error.details
          ? { details: error.details }
          : {}),
      };
    }

    // Handle validation errors
    if (error instanceof ZodError) {
      return {
        success: false,
        error: "Validation failed. Please check your input.",
        code: ERROR_CODES.VALIDATION_FAILED,
        // Only expose field names, not values
        ...(process.env.NODE_ENV === "development"
          ? {
              details: {
                issues: error.issues.map((issue) => ({
                  field: issue.path.join("."),
                  message: issue.message,
                })),
              },
            }
          : {}),
      };
    }

    // Database errors - never expose schema
    if (error instanceof Error && error.message.includes("violates")) {
      return {
        success: false,
        error: "The operation could not be completed due to a conflict.",
        code: ERROR_CODES.DB_CONSTRAINT_VIOLATION,
      };
    }

    // Generic errors - no details
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    };
  }
}
```

---

## 8. Recommendations Summary

### 8.1 Critical Priority (Implement Immediately)

| Priority | Issue | Impact | Effort | Files Affected |
|----------|-------|--------|--------|----------------|
| 🔴 **P0** | Add middleware for route protection | Complete auth bypass | 2 hours | `middleware.ts` (new) |
| 🔴 **P0** | Implement rate limiting | Brute force attacks | 4 hours | `src/lib/rate-limit.ts` (new), all auth actions |
| 🔴 **P0** | Add CSRF protection | Request forgery | 3 hours | `src/lib/csrf.ts` (new), all forms |
| 🔴 **P0** | Session timeout enforcement | Session hijacking | 2 hours | `src/lib/supabase/server.ts` |

**Estimated Total:** 11 hours

### 8.2 High Priority (Implement Within 1 Week)

| Priority | Issue | Impact | Effort | Files Affected |
|----------|-------|--------|--------|----------------|
| 🟠 **P1** | Add MFA support | Account takeover | 8 hours | `src/lib/auth/mfa.ts` (new), database migration |
| 🟠 **P1** | Hash verification tokens | Token theft | 2 hours | `src/lib/auth/tokens.ts` |
| 🟠 **P1** | Add account lockout | Credential stuffing | 3 hours | `src/actions/auth.ts`, `src/lib/auth/lockout.ts` (new) |
| 🟠 **P1** | Implement token cleanup cron | Database bloat | 2 hours | `src/app/api/cron/cleanup-tokens/route.ts` (new) |
| 🟠 **P1** | Add security monitoring | Attack detection | 4 hours | Sentry integration |

**Estimated Total:** 19 hours

### 8.3 Medium Priority (Implement Within 1 Month)

| Priority | Issue | Impact | Effort | Files Affected |
|----------|-------|--------|--------|----------------|
| 🟡 **P2** | Session security validation | Session theft | 4 hours | `src/lib/auth/session.ts` |
| 🟡 **P2** | Add OAuth state parameter | CSRF on OAuth | 2 hours | `src/actions/auth.ts` |
| 🟡 **P2** | Enhanced input sanitization | XSS attacks | 3 hours | `src/lib/validation/sanitize.ts` (new) |
| 🟡 **P2** | Company context caching | Performance | 2 hours | `src/lib/auth/company-context.ts` |
| 🟡 **P2** | Add audit logging | Compliance | 6 hours | `src/lib/audit/` (new) |

**Estimated Total:** 17 hours

### 8.4 Low Priority (Implement Within 3 Months)

| Priority | Issue | Impact | Effort | Files Affected |
|----------|-------|--------|--------|----------------|
| 🟢 **P3** | Add CAPTCHA on signup | Bot signups | 2 hours | Forms |
| 🟢 **P3** | Device fingerprinting | Session security | 4 hours | Multiple |
| 🟢 **P3** | Concurrent session limits | Account sharing | 3 hours | Database, session logic |
| 🟢 **P3** | Security headers | Browser security | 1 hour | `next.config.ts` |

**Estimated Total:** 10 hours

---

## 9. Security Best Practices Checklist

### 9.1 Authentication

- [x] Strong password policy (8+ chars, complexity)
- [x] Email verification required
- [x] Secure password storage (Supabase bcrypt)
- [ ] **Rate limiting on login attempts**
- [ ] **Account lockout after failed attempts**
- [ ] **MFA/2FA support**
- [ ] **CAPTCHA on signup**
- [x] Password reset functionality
- [ ] **Password reset rate limiting**
- [x] OAuth support (Google, Facebook)
- [ ] **OAuth state parameter**
- [x] Session management
- [ ] **Session timeout**
- [ ] **Concurrent session limits**

### 9.2 Authorization

- [x] Row Level Security (RLS) enabled on all tables
- [x] Multi-tenant isolation via company_id
- [x] Role-based access control (RBAC)
- [x] Permission checking in Server Actions
- [ ] **Middleware route protection**
- [x] User context caching
- [ ] **Company context caching**
- [x] Soft delete policies

### 9.3 Input Validation

- [x] Zod schema validation
- [x] Email format validation
- [x] Password complexity validation
- [x] Max length constraints
- [ ] **XSS sanitization**
- [x] SQL injection prevention (parameterized queries)
- [ ] **Path traversal protection**
- [ ] **Unicode normalization**

### 9.4 Session Security

- [x] HTTP-only cookies
- [x] Secure flag in production
- [x] SameSite attribute
- [ ] **Session timeout**
- [ ] **IP binding**
- [ ] **Device fingerprinting**
- [ ] **Session rotation on privilege change**

### 9.5 CSRF Protection

- [ ] **CSRF tokens on forms**
- [ ] **SameSite cookies (strict)**
- [ ] **Origin header validation**
- [ ] **Referer header validation**

### 9.6 Rate Limiting

- [ ] **Login rate limiting**
- [ ] **Signup rate limiting**
- [ ] **Password reset rate limiting**
- [ ] **API rate limiting**
- [ ] **Per-user rate limiting**
- [ ] **Per-IP rate limiting**

### 9.7 Error Handling

- [x] Centralized error handling
- [x] Production vs development error messages
- [x] Error logging
- [ ] **Sentry/monitoring integration**
- [ ] **No sensitive data in errors**
- [x] Error codes for clients

### 9.8 Token Security

- [x] Secure token generation
- [x] One-time use enforcement
- [x] Expiration enforcement
- [ ] **Token hashing in storage**
- [ ] **Rate limiting on token generation**
- [ ] **Token cleanup cron job**
- [ ] **IP binding on tokens**

### 9.9 Compliance

- [x] GDPR: User data deletion
- [x] GDPR: Data export
- [ ] **SOC 2: Audit logging**
- [ ] **SOC 2: MFA support**
- [ ] **ISO 27001: Security policies**
- [ ] **PCI DSS: If handling payments**

---

## 10. Implementation Roadmap

### Week 1: Critical Security Fixes

**Day 1-2: Middleware & Route Protection**
- [ ] Create `middleware.ts` with auth protection
- [ ] Test protected routes redirect to login
- [ ] Test authenticated users redirect from auth pages
- [ ] Add session refresh logic

**Day 3-4: Rate Limiting**
- [ ] Set up Upstash Redis account
- [ ] Install `@upstash/ratelimit` and `@upstash/redis`
- [ ] Create `src/lib/rate-limit.ts`
- [ ] Add rate limiting to all auth actions
- [ ] Test rate limits with automated scripts

**Day 5: CSRF Protection**
- [ ] Create `src/lib/csrf.ts`
- [ ] Add CSRF token generation endpoint
- [ ] Update all forms to include CSRF token
- [ ] Add CSRF validation to Server Actions
- [ ] Test CSRF protection

### Week 2: High Priority Features

**Day 1-3: MFA Implementation**
- [ ] Install `otplib` and `qrcode`
- [ ] Create `src/lib/auth/mfa.ts`
- [ ] Create database migration for `user_mfa` table
- [ ] Build MFA setup UI
- [ ] Build MFA verification UI
- [ ] Test MFA flow end-to-end

**Day 4: Token Security**
- [ ] Update `src/lib/auth/tokens.ts` to hash tokens
- [ ] Create token cleanup cron job
- [ ] Configure Vercel cron in `vercel.json`
- [ ] Test token cleanup

**Day 5: Account Lockout**
- [ ] Create `src/lib/auth/lockout.ts`
- [ ] Add lockout logic to `signIn()`
- [ ] Create unlock mechanism
- [ ] Test lockout behavior

### Week 3-4: Medium Priority Enhancements

**Week 3:**
- [ ] Session security validation (IP, device)
- [ ] OAuth state parameter
- [ ] Input sanitization library
- [ ] Company context caching
- [ ] Audit logging infrastructure

**Week 4:**
- [ ] Sentry integration
- [ ] Security headers in `next.config.ts`
- [ ] Enhanced error handling
- [ ] Security documentation
- [ ] Penetration testing

---

## 11. Testing Plan

### 11.1 Security Test Cases

**Authentication Tests:**
```typescript
// __tests__/auth/rate-limiting.test.ts
describe("Rate Limiting", () => {
  it("should block after 5 failed login attempts", async () => {
    const email = "test@example.com";
    const password = "wrong";

    // Make 5 failed attempts
    for (let i = 0; i < 5; i++) {
      await signIn({ email, password });
    }

    // 6th attempt should be blocked
    const result = await signIn({ email, password });
    expect(result.success).toBe(false);
    expect(result.error).toContain("Too many login attempts");
  });

  it("should reset rate limit after 15 minutes", async () => {
    // ... test implementation
  });
});

describe("CSRF Protection", () => {
  it("should reject requests without CSRF token", async () => {
    const result = await signIn({ email: "test@example.com", password: "test" });
    expect(result.success).toBe(false);
    expect(result.error).toContain("Invalid CSRF token");
  });

  it("should accept requests with valid CSRF token", async () => {
    // ... test implementation
  });
});

describe("Session Security", () => {
  it("should invalidate session on IP change", async () => {
    // ... test implementation
  });

  it("should expire session after timeout", async () => {
    // ... test implementation
  });
});
```

**RLS Policy Tests:**
```typescript
// __tests__/security/rls.test.ts
describe("RLS Policies", () => {
  it("should prevent cross-company data access", async () => {
    const user1 = await createTestUser("company-1");
    const user2 = await createTestUser("company-2");

    // User 1 creates customer
    const customer = await createCustomer(user1, { name: "Test Customer" });

    // User 2 should NOT see customer
    const result = await getCustomer(user2, customer.id);
    expect(result).toBeNull();
  });

  it("should allow company members to read customers", async () => {
    // ... test implementation
  });
});
```

### 11.2 Penetration Testing Checklist

- [ ] **SQL Injection Testing**
  - [ ] Test all input fields with SQL payloads
  - [ ] Test URL parameters
  - [ ] Test JSON payloads

- [ ] **XSS Testing**
  - [ ] Test all input fields with XSS payloads
  - [ ] Test stored XSS in user profiles
  - [ ] Test reflected XSS in error messages

- [ ] **CSRF Testing**
  - [ ] Test state-changing operations without CSRF token
  - [ ] Test token reuse
  - [ ] Test cross-origin requests

- [ ] **Authentication Bypass**
  - [ ] Test direct URL access to protected routes
  - [ ] Test API endpoints without auth
  - [ ] Test JWT/session manipulation

- [ ] **Authorization Bypass**
  - [ ] Test accessing other users' data
  - [ ] Test accessing other companies' data
  - [ ] Test privilege escalation

- [ ] **Rate Limiting**
  - [ ] Test brute force on login
  - [ ] Test account enumeration
  - [ ] Test API abuse

---

## 12. Monitoring & Alerting

### 12.1 Security Metrics to Track

**Authentication Metrics:**
- Failed login attempts per IP
- Failed login attempts per user
- Account lockouts
- Password reset requests
- MFA enrollment rate
- MFA bypass attempts

**Authorization Metrics:**
- RLS policy violations
- Cross-company access attempts
- Permission denied errors
- Suspicious API calls

**Session Metrics:**
- Session duration average
- Concurrent sessions per user
- IP changes during session
- Device changes during session

**Token Metrics:**
- Expired token usage attempts
- Reused token attempts
- Token generation rate

### 12.2 Sentry Integration

```typescript
// src/lib/monitoring/sentry.ts
import * as Sentry from "@sentry/nextjs";

/**
 * Log Security Event to Sentry
 */
export function logSecurityEvent(
  event: string,
  level: "info" | "warning" | "error",
  data?: Record<string, any>
) {
  Sentry.captureMessage(event, {
    level,
    tags: {
      category: "security",
      event,
    },
    extra: data,
  });
}

/**
 * Usage Examples
 */

// Failed login
logSecurityEvent("failed_login", "warning", {
  email,
  ip,
  attempts,
});

// Account lockout
logSecurityEvent("account_lockout", "error", {
  userId,
  email,
  lockoutDuration,
});

// RLS violation
logSecurityEvent("rls_violation", "error", {
  userId,
  table,
  attemptedAction,
});

// Suspicious activity
logSecurityEvent("suspicious_activity", "warning", {
  userId,
  activityType,
  details,
});
```

### 12.3 Alert Configuration

**Critical Alerts (PagerDuty/Slack):**
- More than 10 failed logins from same IP in 5 minutes
- RLS policy violation detected
- Account lockout triggered
- Suspicious token usage
- Privilege escalation attempt

**Warning Alerts (Email):**
- High rate of password resets
- Unusual login patterns
- MFA bypass attempts
- Session anomalies

---

## 13. Compliance Requirements

### 13.1 GDPR Compliance

**Current Status:** ✅ Partial Compliance

**Implemented:**
- ✅ User data deletion (soft delete)
- ✅ Email verification
- ✅ User consent (terms checkbox)
- ✅ Secure data storage (RLS)

**Missing:**
- [ ] Data export functionality
- [ ] Cookie consent banner
- [ ] Privacy policy page
- [ ] Data retention policies
- [ ] Breach notification procedure

### 13.2 SOC 2 Compliance

**Current Status:** ❌ Not Compliant

**Requirements:**
- [ ] MFA for all users
- [ ] Audit logging (all data changes)
- [ ] Access reviews (quarterly)
- [ ] Security training (annual)
- [ ] Incident response plan
- [ ] Backup and recovery testing
- [ ] Vendor risk assessment

### 13.3 ISO 27001 Compliance

**Current Status:** ❌ Not Compliant

**Requirements:**
- [ ] Information security policy
- [ ] Risk assessment procedure
- [ ] Asset inventory
- [ ] Access control policy
- [ ] Cryptography policy
- [ ] Security incident management
- [ ] Business continuity plan

---

## 14. Conclusion

### 14.1 Overall Security Posture

The Thorbis authentication system demonstrates **strong foundation** with comprehensive RLS policies, Zod validation, and Supabase Auth integration. However, critical gaps in **middleware protection**, **rate limiting**, and **CSRF protection** expose the application to serious security risks.

**Risk Level:** **MEDIUM-HIGH**

**Primary Concerns:**
1. **No route protection** - Unauthenticated access possible
2. **No rate limiting** - Vulnerable to brute force attacks
3. **No CSRF protection** - Request forgery attacks possible
4. **No MFA** - Single point of failure for account security

### 14.2 Next Steps

**Immediate Actions (Week 1):**
1. Implement middleware for route protection
2. Add rate limiting to all auth endpoints
3. Implement CSRF protection on forms
4. Add session timeout enforcement

**Short-term Actions (Month 1):**
1. Implement MFA/2FA support
2. Add account lockout mechanism
3. Hash verification tokens
4. Set up security monitoring

**Long-term Actions (Month 2-3):**
1. Complete SOC 2 compliance
2. Implement audit logging
3. Add device fingerprinting
4. Conduct penetration testing

### 14.3 Resources Required

**Development Time:**
- Critical fixes: ~11 hours
- High priority: ~19 hours
- Medium priority: ~17 hours
- **Total estimated:** ~47 hours (≈ 6 work days)

**Infrastructure Costs:**
- Upstash Redis: $0-10/month
- Sentry monitoring: $0-26/month
- Total: $0-36/month

**Third-party Services:**
- Upstash (rate limiting)
- Sentry (monitoring)
- Vercel (cron jobs)

---

## Appendix A: File Locations

**Auth Files:**
- `/src/actions/auth.ts` - Authentication Server Actions
- `/src/lib/auth/session.ts` - Session utilities
- `/src/lib/auth/tokens.ts` - Token management
- `/src/lib/auth/user-data.ts` - User data utilities
- `/src/lib/supabase/server.ts` - Server-side Supabase client
- `/src/lib/supabase/client.ts` - Client-side Supabase client
- `/src/app/auth/callback/route.ts` - OAuth callback handler

**Company Files:**
- `/src/actions/company.ts` - Company management
- `/src/actions/team.ts` - Team member management

**Database Files:**
- `/src/lib/db/schema.ts` - Database schema
- `/supabase/migrations/20250131000010_rls_complete.sql` - RLS policies
- `/supabase/migrations/20250131000020_complete_security_infrastructure.sql` - Security infrastructure

**Error Handling:**
- `/src/lib/errors/with-error-handling.ts` - Error wrapper
- `/src/lib/errors/action-error.ts` - Custom error types

---

## Appendix B: Environment Variables

**Required:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production

# Email (Resend)
RESEND_API_KEY=re_your-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Security (ADD THESE)
CSRF_SECRET=your-random-32-byte-secret
CRON_SECRET=your-cron-secret

# Rate Limiting (ADD THESE)
UPSTASH_REDIS_URL=https://your-redis.upstash.io
UPSTASH_REDIS_TOKEN=your-redis-token

# Monitoring (ADD THIS)
SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io
```

---

**Document Version:** 1.0
**Last Updated:** 2025-10-31
**Next Review:** 2025-11-15

---

*This security audit is a living document and should be updated as the authentication system evolves.*
