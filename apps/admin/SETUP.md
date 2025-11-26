# Admin Database Setup Guide

This guide explains how to complete the admin database separation setup.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN APP (port 3001)                     │
├─────────────────────────────────────────────────────────────────┤
│  WRITES TO                    │  READS FROM                     │
│  Admin Supabase               │  Web Supabase (read-only)       │
│  (iwudmixxoozwskgolqlz)       │  (togejqdwggezkxahomeh)          │
└────────────┬──────────────────┴─────────────────┬───────────────┘
             │                                    │
             ▼                                    ▼
┌──────────────────────────┐    ┌─────────────────────────────────┐
│     ADMIN DATABASE       │    │      WEB DATABASE (read-only)   │
├──────────────────────────┤    ├─────────────────────────────────┤
│ • admin_users            │    │ • companies (READ)              │
│ • admin_sessions         │    │ • users (READ)                  │
│ • companies_registry     │    │ • jobs, invoices, etc (READ)    │
│ • subscriptions          │    │ • All business data (READ)      │
│ • support_tickets        │    │                                 │
│ • admin_audit_logs       │    │                                 │
│ • email_campaigns        │    │                                 │
│ • waitlist               │    │                                 │
└──────────────────────────┘    └─────────────────────────────────┘
```

## Setup Steps

### Step 1: Get Admin Supabase Service Role Key

1. Go to https://supabase.com/dashboard/project/iwudmixxoozwskgolqlz/settings/api
2. Copy the `service_role` key (NOT the anon key)
3. Add it to `apps/admin/.env.local`:
   ```
   ADMIN_SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
   ```

### Step 2: Run Admin Database Migrations

Go to the Supabase SQL Editor for the ADMIN project:
https://supabase.com/dashboard/project/iwudmixxoozwskgolqlz/sql

Run these migrations in order:
1. `supabase/migrations/001_initial_schema.sql` - Creates all tables
2. `supabase/migrations/002_password_functions.sql` - Creates password functions

### Step 3: Verify Initial Admin User

The migration creates a default admin user:
- **Email**: admin@thorbis.com
- **Password**: Admin123!
- **Role**: super_admin

⚠️ **IMPORTANT**: Change this password immediately after first login!

### Step 4: Test the Admin App

```bash
# From the Stratos root directory
pnpm dev:admin
```

Then visit http://localhost:3001 and log in with the default credentials.

### Step 5: Create Additional Admin Users

After logging in as super_admin, you can create additional admin users via the SQL editor:

```sql
INSERT INTO admin_users (email, password_hash, full_name, role, is_active, email_verified)
VALUES (
  'your.email@thorbis.com',
  crypt('YourSecurePassword!', gen_salt('bf', 12)),
  'Your Name',
  'admin',
  true,
  true
);
```

### Step 6: Remove Admin Tables from Web Database (OPTIONAL)

Only do this after verifying everything works:

1. Go to the WEB Supabase SQL Editor:
   https://supabase.com/dashboard/project/togejqdwggezkxahomeh/sql
2. Run `supabase/migrations/003_remove_from_web_db.sql`

## Environment Variables Summary

```env
# Admin Database (write access)
NEXT_PUBLIC_SUPABASE_URL=https://iwudmixxoozwskgolqlz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-admin-anon-key>
ADMIN_SUPABASE_SERVICE_ROLE_KEY=<your-admin-service-role-key>

# Web Database (read-only access for support)
WEB_SUPABASE_URL=https://togejqdwggezkxahomeh.supabase.co
WEB_SUPABASE_SERVICE_ROLE_KEY=<your-web-service-role-key>

# JWT Secret for admin sessions
ADMIN_JWT_SECRET=<generated-hex-string>
```

## Admin Roles

| Role | Permissions |
|------|-------------|
| `super_admin` | Full access, can create other admins |
| `admin` | Full access to dashboard features |
| `support` | Support tickets, read-only company data |

## Files Changed

- `apps/admin/.env.local` - Updated with dual database config
- `apps/admin/src/lib/supabase/server.ts` - Uses admin database
- `apps/admin/src/lib/supabase/client.ts` - Uses admin database
- `apps/admin/src/lib/supabase/admin-client.ts` - NEW: Admin DB client
- `apps/admin/src/lib/supabase/web-reader.ts` - NEW: Web DB reader
- `apps/admin/src/lib/auth/session.ts` - NEW: JWT session management
- `apps/admin/src/lib/auth/password.ts` - NEW: Password utilities
- `apps/admin/src/actions/auth.ts` - Uses admin_users table
- `apps/admin/src/actions/campaigns.ts` - Uses dual databases
- `apps/admin/src/middleware.ts` - Uses JWT sessions

## Security Notes

1. **Admin authentication** is now completely separate from web app authentication
2. **No email domain validation** - authentication is based on admin_users table
3. **JWT sessions** are stored in HTTP-only cookies and tracked in database
4. **Audit logging** persists to admin_audit_logs table
5. **Rate limiting** remains in place for login attempts
6. **Web database access** is read-only via service role key
