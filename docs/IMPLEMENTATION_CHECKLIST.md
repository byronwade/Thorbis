# Thorbis Project - Implementation Checklist for Production Ready

## Overview
This checklist tracks what needs to be implemented to make the Thorbis project production-ready for Supabase and Drizzle ORM.

**Total Estimated Time**: 45 hours
**Current Readiness**: 35% (Database layer: 100%, Auth/Security: 0%)

---

## Phase 1: Database Activation (2 hours)

### Supabase Project Setup
- [ ] Create Supabase project at https://supabase.com/dashboard
- [ ] Copy PROJECT_URL to environment variable `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copy ANON_KEY to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Copy SERVICE_ROLE_KEY to `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Get PostgreSQL connection URL: `Settings → Database → Connection string`
- [ ] Copy PostgreSQL URL to `DATABASE_URL` in `.env.local`
- [ ] Verify `NODE_ENV=production` in `.env.local`

### Database Initialization
- [ ] Run `pnpm db:push` to apply all migrations to PostgreSQL
- [ ] Verify all tables created in Supabase dashboard
- [ ] Check migrations in Drizzle Kit log
- [ ] Run `pnpm db:seed` to populate with sample data

### Verification
- [ ] Access Supabase SQL Editor and query `SELECT COUNT(*) FROM users;`
- [ ] Verify schema matches local SQLite structure
- [ ] Test connection using Drizzle Studio (if available for PostgreSQL)

---

## Phase 2: Authentication Implementation (12 hours)

### Server Actions for Authentication

#### Sign Up Action
- [ ] Create `/src/actions/auth.ts` with `signUp` Server Action
- [ ] Validate input with Zod schema (email, password, name)
- [ ] Hash password using `bcrypt-ts`
- [ ] Call `supabase.auth.signUp()` to create Supabase user
- [ ] Insert user profile in `users` table via Drizzle
- [ ] Handle errors and validation failures
- [ ] Return success/error response
- [ ] File: `/Users/byronwade/Thorbis/src/actions/auth.ts`

#### Sign In Action
- [ ] Create `signIn` Server Action in same file
- [ ] Validate email and password with Zod
- [ ] Call `supabase.auth.signInWithPassword()`
- [ ] Verify user exists in `users` table
- [ ] Set secure session cookie
- [ ] Return user data and session token
- [ ] Handle incorrect credentials gracefully

#### Sign Out Action
- [ ] Create `signOut` Server Action
- [ ] Call `supabase.auth.signOut()`
- [ ] Clear session cookies
- [ ] Redirect to login page

#### Get Session Action
- [ ] Create `getSession` Server Action
- [ ] Get current session from cookies
- [ ] Return session or null if not authenticated
- [ ] Cache result to avoid repeated DB calls

### Authentication UI Integration
- [ ] Update `/src/app/(marketing)/login/page.tsx`
  - [ ] Replace TODO comments with `signIn` Server Action
  - [ ] Add form submission handler
  - [ ] Show validation errors
  - [ ] Redirect to dashboard on success
  - [ ] Handle loading state

- [ ] Update `/src/app/(marketing)/register/page.tsx`
  - [ ] Create if doesn't exist
  - [ ] Connect to `signUp` Server Action
  - [ ] Add form validation
  - [ ] Show password strength indicator
  - [ ] Redirect to login/dashboard after signup

### OAuth Integration (Optional but Recommended)
- [ ] Configure Google OAuth in Supabase
  - [ ] Get OAuth credentials from Google Console
  - [ ] Add to Supabase Auth settings
  - [ ] Implement `signInWithGoogle()` Server Action
  - [ ] Update login UI with Google button

- [ ] Configure Facebook OAuth (if needed)
  - [ ] Similar to Google setup
  - [ ] Implement `signInWithFacebook()`

### Password Reset
- [ ] Create `resetPassword` Server Action
- [ ] Create `/src/app/(marketing)/forgot-password/page.tsx`
- [ ] Create `/src/app/(marketing)/reset-password/page.tsx`
- [ ] Use Supabase password reset flow

---

## Phase 3: Row Level Security (RLS) Policies (6 hours)

### Create RLS Policies in Supabase
Execute these SQL policies in Supabase SQL Editor:

#### Users Table Policies
- [ ] Allow users to read own profile only
  ```sql
  CREATE POLICY "Users see own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = id);
  ```

- [ ] Allow users to update own profile
  ```sql
  CREATE POLICY "Users update own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id);
  ```

#### Companies Table Policies
- [ ] Only company members can view company
  ```sql
  CREATE POLICY "Team members see company"
  ON companies FOR SELECT
  USING (
    id IN (
      SELECT company_id FROM team_members 
      WHERE user_id = auth.uid()::text
    )
  );
  ```

#### Team Members Table Policies
- [ ] Team members can view their company's team
  ```sql
  CREATE POLICY "View company team"
  ON team_members FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM team_members 
      WHERE user_id = auth.uid()::text
    )
  );
  ```

#### Properties Table Policies
- [ ] Company members can view properties
  ```sql
  CREATE POLICY "View company properties"
  ON properties FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM team_members 
      WHERE user_id = auth.uid()::text
    )
  );
  ```

#### Jobs Table Policies
- [ ] Technicians see assigned jobs
- [ ] Managers see company jobs
- [ ] Customers see their jobs

#### Estimates Table Policies
- [ ] Customers see own estimates
- [ ] Staff see assigned estimates

#### Invoices Table Policies
- [ ] Customers see own invoices
- [ ] Staff see company invoices

#### Purchase Orders Table Policies
- [ ] Staff can view company POs
- [ ] Role-based access (admin, manager)

### Enable RLS
- [ ] Enable RLS on each table in Supabase
- [ ] Test policies with different user roles
- [ ] Verify data isolation works correctly

### Testing RLS Policies
- [ ] Create test users in different roles
- [ ] Verify users can't access other user's data
- [ ] Verify team members can't access other company data
- [ ] Verify unauthorized queries are blocked
- [ ] Document all policies in `/docs/RLS_POLICIES.md`

---

## Phase 4: Session Management & Protected Routes (5 hours)

### Middleware Enhancement
- [ ] Update `/Users/byronwade/Thorbis/middleware.ts`
  - [ ] Add authentication middleware
  - [ ] Verify session on every request
  - [ ] Check authorization for protected routes
  - [ ] Redirect unauthenticated users to login

### Auth Context/Store (Zustand)
- [ ] Create `/src/lib/stores/auth-store.ts` (Zustand store)
  - [ ] Store current user
  - [ ] Store authentication status
  - [ ] Store user role/permissions
  - [ ] Handle logout action
  - [ ] Persist to localStorage

### Protected Routes
- [ ] Create `src/app/(dashboard)/layout.tsx` wrapper
  - [ ] Check authentication on page load
  - [ ] Redirect to login if not authenticated
  - [ ] Show loading state while checking auth

- [ ] Protect individual pages:
  - [ ] `/dashboard/*` - All dashboard pages
  - [ ] `/settings/*` - Settings pages
  - [ ] `/admin/*` - Admin pages (if exists)

### Protected API Routes
- [ ] Create auth middleware for API routes
- [ ] Validate session token on each request
- [ ] Require specific user roles for admin endpoints
- [ ] Return 401 Unauthorized if not authenticated
- [ ] Return 403 Forbidden if insufficient permissions

### Session Refresh
- [ ] Implement automatic session refresh
- [ ] Handle expired sessions
- [ ] Redirect to login when session expires
- [ ] Show notification to user

---

## Phase 5: Authorization & Role-Based Access Control (3 hours)

### Role System
- [ ] Review `customRoles` table schema
- [ ] Implement role checking in Zustand store
- [ ] Create role constants: `ADMIN`, `MANAGER`, `TECHNICIAN`, `CUSTOMER`
- [ ] Add permission checks to components

### Component-Level Access Control
- [ ] Create `<ProtectedComponent>` wrapper component
- [ ] Implement role-based visibility
- [ ] Hide buttons/forms for unauthorized users
- [ ] Show appropriate error messages

### Route-Level Access Control
- [ ] Verify user role in protected pages
- [ ] Redirect to 403 if insufficient permissions
- [ ] Check company ownership for resources

### API Endpoint Authorization
- [ ] Add role checks to API routes
- [ ] Verify user belongs to correct company
- [ ] Prevent cross-company data access
- [ ] Log authorization failures

---

## Phase 6: Storage Buckets (8 hours)

### Create Storage Buckets
- [ ] Create `documents` bucket in Supabase Storage
  - [ ] Set max file size (e.g., 50MB)
  - [ ] Allowed file types: PDF, DOC, DOCX, XLS, XLSX

- [ ] Create `images` bucket
  - [ ] Set max file size (e.g., 10MB)
  - [ ] Allowed file types: JPG, PNG, WEBP

- [ ] Create `invoices` bucket
  - [ ] Auto-generate PDFs of invoices
  - [ ] Set 100MB limit

### Storage RLS Policies
- [ ] Users can only upload to their company folder
- [ ] Users can only download their own files
- [ ] Admins can access all files in company

### File Upload Endpoints
- [ ] Create `/src/app/api/upload/documents` endpoint
- [ ] Create `/src/app/api/upload/images` endpoint
- [ ] Validate file type and size
- [ ] Store file path in database
- [ ] Generate signed URLs for download

### File Handling
- [ ] Create `<FileUpload>` component
- [ ] Show upload progress
- [ ] Handle errors gracefully
- [ ] List uploaded files
- [ ] Allow file deletion

### Document Features
- [ ] Display uploaded documents
- [ ] Generate signed URLs with expiration
- [ ] Implement file preview (if applicable)
- [ ] Track who uploaded each file

---

## Phase 7: Enhanced Seed Data (3 hours)

### Create Comprehensive Seed Script
- [ ] Enhance `/src/lib/db/seed.ts`
  - [ ] Add 5-10 sample companies
  - [ ] Add departments for each company
  - [ ] Add 10-20 team members with different roles
  - [ ] Add 20-30 customers
  - [ ] Add 50+ properties
  - [ ] Add 50+ jobs with various statuses
  - [ ] Add 20+ estimates
  - [ ] Add 15+ invoices
  - [ ] Add 10+ purchase orders
  - [ ] Add realistic data (actual addresses, phone numbers, etc.)

### Seed Data Organization
- [ ] Create separate seed files for each entity type
- [ ] Import and run them in order
- [ ] Handle foreign key constraints properly
- [ ] Create relationships between entities

### Testing Seed Data
- [ ] Verify data is realistic
- [ ] Check all foreign keys are valid
- [ ] Test workflows with seed data
- [ ] Include edge cases in seed data

---

## Phase 8: Testing (12 hours)

### Unit Tests
- [ ] Test authentication functions
  - [ ] Password validation
  - [ ] Email validation
  - [ ] Hash comparison

- [ ] Test database queries
  - [ ] CRUD operations on each table
  - [ ] Foreign key relationships
  - [ ] Filtering and sorting

- [ ] Test utility functions
  - [ ] Role checking
  - [ ] Permission verification

### Integration Tests
- [ ] Test sign up to sign in flow
- [ ] Test data isolation (RLS)
- [ ] Test file upload and download
- [ ] Test protected routes
- [ ] Test different user roles

### E2E Tests (Playwright)
- [ ] User registration flow
- [ ] User login flow
- [ ] Dashboard access
- [ ] Job creation and assignment
- [ ] Invoice generation
- [ ] File upload
- [ ] Role-based visibility

### Security Tests
- [ ] Verify RLS policies work
- [ ] Try to access other user's data
- [ ] Try to access other company's data
- [ ] Test permission boundaries
- [ ] Test CSRF protection

### Load Tests
- [ ] Test with 100 concurrent users
- [ ] Test with large datasets
- [ ] Monitor database performance
- [ ] Check for query optimization needs

---

## Phase 9: Documentation (4 hours)

### API Documentation
- [ ] Document all endpoints
- [ ] Include request/response examples
- [ ] Document error codes
- [ ] Document authentication requirements
- [ ] Document RLS policies

### Database Documentation
- [ ] Document all tables
- [ ] Document relationships
- [ ] Document indexes
- [ ] Document RLS policies
- [ ] Create ERD (Entity Relationship Diagram)

### Deployment Guide
- [ ] Document environment setup
- [ ] Document how to migrate schema
- [ ] Document how to apply RLS policies
- [ ] Document how to set up storage buckets
- [ ] Document backup/restore procedures

### Troubleshooting Guide
- [ ] Common issues and solutions
- [ ] Performance optimization tips
- [ ] Debugging guides
- [ ] Database connection issues

### Security Guide
- [ ] Environment variable handling
- [ ] Password security best practices
- [ ] RLS policy design
- [ ] API security checklist

---

## Phase 10: Security Audit (4 hours)

### Code Security Review
- [ ] Check for SQL injection vulnerabilities
- [ ] Check for XSS vulnerabilities
- [ ] Check for CSRF protection
- [ ] Check environment variable handling
- [ ] Check password hashing implementation

### Database Security
- [ ] Verify all RLS policies are enabled
- [ ] Test RLS policy effectiveness
- [ ] Check for missing policies
- [ ] Verify indexes exist for performance
- [ ] Review and limit user permissions

### API Security
- [ ] Verify authentication on all protected endpoints
- [ ] Check rate limiting
- [ ] Verify CORS configuration
- [ ] Test for unauthorized access
- [ ] Review error messages (don't leak data)

### Storage Security
- [ ] Verify bucket RLS policies
- [ ] Test file access controls
- [ ] Check signed URL expiration
- [ ] Verify file type validation
- [ ] Test file size limits

### Secrets Management
- [ ] Verify no secrets in code
- [ ] Check environment variables are not logged
- [ ] Verify API keys are rotated
- [ ] Check service role key is only on server
- [ ] Test that anon key has limited permissions

---

## Pre-Deployment Verification

### Database Checks
- [ ] All tables created in PostgreSQL
- [ ] All indexes created
- [ ] RLS policies enabled on all tables
- [ ] Foreign key constraints in place
- [ ] Sample data looks correct

### Application Checks
- [ ] Authentication works (sign up, sign in, sign out)
- [ ] Protected routes redirect correctly
- [ ] RLS policies prevent unauthorized access
- [ ] File uploads work
- [ ] All API endpoints respond correctly

### Environment Checks
- [ ] All required environment variables set
- [ ] No credentials in code
- [ ] `.env.local` is in `.gitignore`
- [ ] Production environment variables configured
- [ ] Database backups configured

### Testing Checks
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] Security tests passing
- [ ] Load tests showing acceptable performance

### Documentation Checks
- [ ] API documentation complete
- [ ] Database documentation complete
- [ ] Deployment guide complete
- [ ] Troubleshooting guide complete
- [ ] Security guide complete

---

## Deployment

### Before Deploy
- [ ] All tests passing
- [ ] Code review completed
- [ ] Security audit completed
- [ ] Database backups configured
- [ ] Monitoring configured

### Deploy Steps
1. [ ] Deploy to staging environment first
2. [ ] Run smoke tests on staging
3. [ ] Verify data migrations work
4. [ ] Get approval for production deploy
5. [ ] Schedule deployment window
6. [ ] Notify team members
7. [ ] Deploy to production
8. [ ] Verify all systems operational
9. [ ] Monitor error logs and performance

### Post-Deployment
- [ ] Verify all features working
- [ ] Check error logs for issues
- [ ] Monitor database performance
- [ ] Monitor API response times
- [ ] Gather user feedback
- [ ] Create incident report if needed

---

## Final Verification Checklist

- [ ] Users can sign up
- [ ] Users can sign in
- [ ] Protected routes work
- [ ] Data is properly isolated by company
- [ ] RLS policies prevent unauthorized access
- [ ] File uploads work
- [ ] All tables have proper permissions
- [ ] Error handling works correctly
- [ ] Performance is acceptable
- [ ] No sensitive data in logs
- [ ] Documentation is complete
- [ ] Monitoring is configured
- [ ] Backups are working

---

## Success Criteria

The project is **PRODUCTION READY** when:

1. ✓ All critical checklist items completed
2. ✓ All tests passing
3. ✓ Security audit passed
4. ✓ Performance benchmarks met
5. ✓ Documentation complete
6. ✓ Team trained on system
7. ✓ Monitoring and alerting configured
8. ✓ Backup and disaster recovery tested

---

## Questions & Support

Refer to:
- `SUPABASE_ASSESSMENT.md` - Detailed analysis of current state
- `SUPABASE_QUICK_START.md` - Quick reference guide
- `src/lib/db/README.md` - Database usage documentation
- Supabase docs: https://supabase.com/docs
- Drizzle docs: https://orm.drizzle.team/docs/overview

---

**Last Updated**: October 29, 2025
**Estimated Completion**: 45 hours of development work
**Current Progress**: Phase 1 Ready (waiting for credentials)
