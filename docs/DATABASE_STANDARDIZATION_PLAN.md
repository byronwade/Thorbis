# Database Standardization Plan: User, Auth & Company Management

## Current State Analysis

### The Problem
We currently have **3 overlapping user-related tables** that create confusion and data inconsistency:

1. **`auth.users`** (Supabase Auth) - 12 users
   - Handles authentication (passwords, magic links, OAuth)
   - Email, encrypted_password, confirmation tokens
   - This is the **source of truth for authentication**

2. **`public.users`** - 22 users
   - Profile data (name, email, avatar, bio, phone)
   - Stripe customer info
   - **Issue**: More users than auth.users (orphaned records)

3. **`team_members`** - 37 records
   - Links users to companies
   - Has `user_id`, but also duplicates email/name in `invited_email`/`invited_name`
   - Roles, departments, permissions
   - **Issue**: 37 records but only 12 match auth users (25 are invitations without accounts)

### Current Relationships
```
auth.users (12)
    ↓ (user_id)
public.users (22) ← 10 orphaned records with no auth
    ↓ (user_id)
team_members (37) ← 25 pending invitations, 12 active users
    ↓ (company_id)
companies (26)
```

### Key Issues
1. **Data Duplication**: Email and name stored in 3 places
2. **Orphaned Records**: 10 public.users without auth accounts
3. **Invitation Confusion**: 25 team_members without user accounts (pending invites)
4. **No Clear "Team"**: Are team_members the team? Or public.users?
5. **Multi-company Support**: One user can belong to multiple companies but structure is unclear

---

## Recommended Clean Architecture

### Core Principle
**One user account (`auth.users`) can belong to multiple companies with different roles.**

### Proposed Structure

```
┌─────────────────────────────────────────────────────────┐
│ auth.users (Supabase Managed - Authentication)         │
│ - id (uuid, primary key)                                │
│ - email                                                 │
│ - encrypted_password                                    │
│ - email_confirmed_at                                    │
│ - OAuth providers (Google, etc.)                        │
│ - Magic link tokens                                     │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ profiles (Profile Data - 1:1 with auth.users)           │
│ - id (uuid, FK → auth.users.id, primary key)           │
│ - email (synced from auth.users)                        │
│ - full_name                                             │
│ - avatar_url                                            │
│ - phone                                                 │
│ - bio                                                   │
│ - created_at, updated_at                                │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ company_memberships (Many-to-Many)                      │
│ - id (uuid, primary key)                                │
│ - user_id (FK → auth.users.id)                         │
│ - company_id (FK → companies.id)                        │
│ - role (enum: owner, admin, manager, member)            │
│ - permissions (jsonb - granular permissions)            │
│ - department_id (FK → departments.id, nullable)         │
│ - job_title                                             │
│ - status (enum: active, invited, suspended)             │
│ - invited_at, accepted_at                               │
│ - created_at, updated_at                                │
│ UNIQUE(user_id, company_id)                             │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ companies                                               │
│ - id (uuid, primary key)                                │
│ - name, slug, logo_url                                  │
│ - owner_id (FK → auth.users.id)                        │
│ - ... (existing fields)                                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ invitations (Pending Invites)                           │
│ - id (uuid, primary key)                                │
│ - company_id (FK → companies.id)                        │
│ - email                                                 │
│ - invited_name                                          │
│ - role (enum: owner, admin, manager, member)            │
│ - token (unique)                                        │
│ - invited_by (FK → auth.users.id)                      │
│ - expires_at                                            │
│ - status (enum: pending, accepted, expired, revoked)    │
│ - created_at                                            │
└─────────────────────────────────────────────────────────┘
```

---

## Migration Strategy

### Phase 1: Create New Tables ✅ Safe (No Data Loss)

```sql
-- 1. Create profiles table (replaces public.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to sync email from auth.users
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET email = NEW.email WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_email_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION sync_user_email();

-- 2. Create company_memberships (replaces team_members)
CREATE TABLE company_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'member')),
  permissions JSONB DEFAULT '{}'::jsonb,
  department_id UUID REFERENCES departments(id),
  job_title TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended')),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);

-- 3. Create invitations table (for pending invites)
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'member')),
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, email, status) WHERE status = 'pending'
);

-- Indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_company_memberships_user ON company_memberships(user_id);
CREATE INDEX idx_company_memberships_company ON company_memberships(company_id);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_status ON invitations(status);
```

### Phase 2: Migrate Data ⚠️ Run During Low Traffic

```sql
-- 1. Migrate public.users → profiles
INSERT INTO profiles (id, email, full_name, avatar_url, phone, bio, created_at, updated_at)
SELECT
  u.id,
  COALESCE(au.email, u.email),
  u.name,
  u.avatar,
  u.phone,
  u.bio,
  u.created_at,
  u.updated_at
FROM users u
LEFT JOIN auth.users au ON u.id = au.id
WHERE au.id IS NOT NULL; -- Only migrate users with auth accounts

-- 2. Migrate team_members → company_memberships (active users)
INSERT INTO company_memberships (
  user_id, company_id, role, permissions, department_id,
  job_title, status, invited_at, accepted_at, created_at, updated_at
)
SELECT
  tm.user_id,
  tm.company_id,
  COALESCE(tm.role::text, 'member'),
  COALESCE(tm.permissions, '{}'::jsonb),
  tm.department_id,
  tm.job_title,
  'active',
  tm.invited_at,
  tm.joined_at,
  tm.created_at,
  tm.updated_at
FROM team_members tm
WHERE tm.user_id IN (SELECT id FROM auth.users); -- Only active users

-- 3. Migrate team_members → invitations (pending invites)
INSERT INTO invitations (
  company_id, email, invited_name, role, invited_by, created_at, status
)
SELECT
  tm.company_id,
  tm.invited_email,
  tm.invited_name,
  COALESCE(tm.role::text, 'member'),
  tm.invited_by,
  tm.invited_at,
  CASE
    WHEN tm.invited_at < NOW() - INTERVAL '7 days' THEN 'expired'
    ELSE 'pending'
  END
FROM team_members tm
WHERE tm.user_id NOT IN (SELECT id FROM auth.users) -- Only pending invites
AND tm.invited_email IS NOT NULL;
```

### Phase 3: Update Application Code 🔧

**All queries must be updated to use new tables:**

#### Before (Current - Broken)
```typescript
// ❌ WRONG - queries users table without company_id
const { data: teamMembers } = await supabase
  .from("users")
  .select("id, email, full_name")
  .eq("company_id", activeCompanyId) // users table has no company_id!
```

#### After (Clean)
```typescript
// ✅ CORRECT - Join through company_memberships
const { data: teamMembers } = await supabase
  .from("company_memberships")
  .select(`
    id,
    user_id,
    role,
    status,
    profile:profiles(id, full_name, email, avatar_url)
  `)
  .eq("company_id", activeCompanyId)
  .eq("status", "active")
  .order("profile(full_name)");
```

### Phase 4: Add RLS Policies 🔒

```sql
-- Profiles: Users can read all profiles, update their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Company Memberships: Users can only see memberships in their companies
ALTER TABLE company_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view memberships in their companies"
  ON company_memberships FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM company_memberships WHERE user_id = auth.uid()
    )
  );

-- Invitations: Only company members can manage
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can view invitations"
  ON invitations FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM company_memberships WHERE user_id = auth.uid()
    )
  );
```

---

## Benefits of New Structure

### 1. **Single Source of Truth**
- `auth.users` = authentication only
- `profiles` = user profile data (1:1)
- `company_memberships` = which companies a user belongs to (many-to-many)
- `invitations` = pending invites (not yet users)

### 2. **Clean Multi-Company Support**
```sql
-- One user, multiple companies
SELECT c.name, cm.role
FROM company_memberships cm
JOIN companies c ON cm.company_id = c.id
WHERE cm.user_id = 'user-123';

-- Result:
-- Acme Corp | owner
-- Beta Inc  | admin
-- Gamma LLC | member
```

### 3. **Clear Invitation Flow**
1. Admin creates invitation → `invitations` table
2. User clicks invite link, creates account → `auth.users` + `profiles` created
3. Invitation accepted → `company_memberships` created, invitation status = 'accepted'

### 4. **No Orphaned Data**
- All `profiles.id` → `auth.users.id` (enforced by FK)
- All `company_memberships.user_id` → `auth.users.id` (enforced by FK)
- Deleting auth account cascades to profiles and memberships

---

## Rollback Plan (If Needed)

```sql
-- DO NOT DELETE OLD TABLES until verified working!
-- If issues arise, simply:

-- 1. Revert application code to use old tables
-- 2. Drop new tables (data is still in old tables)
DROP TABLE IF EXISTS invitations;
DROP TABLE IF EXISTS company_memberships;
DROP TABLE IF EXISTS profiles;

-- Old tables remain untouched throughout migration
```

---

## Implementation Checklist

### Preparation
- [ ] Backup database (full snapshot)
- [ ] Schedule migration during low-traffic period
- [ ] Notify team of upcoming changes

### Phase 1: Create Tables (No Risk)
- [ ] Run Phase 1 SQL (create new tables)
- [ ] Verify tables created with correct indexes
- [ ] Run security advisors to check RLS

### Phase 2: Migrate Data (Medium Risk)
- [ ] Run Phase 2 SQL (migrate data)
- [ ] Verify record counts match expectations
- [ ] Check for data integrity issues

### Phase 3: Update Code (High Risk)
- [ ] Update all queries in `/src/actions/`
- [ ] Update all queries in `/src/lib/queries/`
- [ ] Update form components to use new structure
- [ ] Test locally with migrated data copy

### Phase 4: Deploy & Monitor
- [ ] Deploy code changes
- [ ] Monitor error logs for 24 hours
- [ ] Verify user logins working
- [ ] Verify team member selection working
- [ ] Verify invitations working

### Phase 5: Cleanup (After 7 Days)
- [ ] Verify no issues reported
- [ ] Archive old tables (rename with `_deprecated_` prefix)
- [ ] Schedule permanent deletion in 30 days
- [ ] Update documentation

---

## Questions to Answer Before Migration

1. **What happens to the 10 orphaned `public.users` records?**
   - Skip them (they have no auth accounts)
   - OR manually create auth accounts for them

2. **What happens to the 25 pending invitations in `team_members`?**
   - Migrate to `invitations` table
   - Send new invitation emails?

3. **Should we preserve all `team_members` history?**
   - Archive to `team_members_archive` table before cleanup

4. **When should we run this migration?**
   - Recommended: Weekend during low traffic
   - Estimated downtime: 10-15 minutes

---

**Status**: Ready for review and approval before implementation
**Risk Level**: Medium (data migration always carries risk, but rollback plan exists)
**Estimated Time**: 2-4 hours including testing
