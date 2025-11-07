# Security Checklist

**Last Updated:** 2025-01-04

This document contains critical security configurations and checks for the Thorbis platform.

---

## ✅ Database Security

### Row Level Security (RLS)
- ✅ **All tables have RLS enabled** - Verified 2025-01-04
- ✅ **Payroll tables secured** - RLS policies applied
- ✅ **Background jobs secured** - RLS policies applied
- ✅ **Function search_path hardened** - All 7 functions fixed

### RLS Policy Coverage
| Table | Status | Last Verified |
|-------|--------|---------------|
| `payroll_overtime_settings` | ✅ Enabled | 2025-01-04 |
| `payroll_bonus_rules` | ✅ Enabled | 2025-01-04 |
| `payroll_bonus_tiers` | ✅ Enabled | 2025-01-04 |
| `payroll_callback_settings` | ✅ Enabled | 2025-01-04 |
| `background_jobs` | ✅ Enabled | 2025-01-04 |

### Function Security
| Function | search_path Status | Last Fixed |
|----------|-------------------|------------|
| `is_company_member` | ✅ Fixed | 2025-01-04 |
| `update_notifications_updated_at` | ✅ Fixed | 2025-01-04 |
| `update_notifications_read_at` | ✅ Fixed | 2025-01-04 |
| `update_updated_at_column` | ✅ Fixed | 2025-01-04 |
| `mark_all_notifications_read` | ✅ Fixed | 2025-01-04 |
| `get_unread_notification_count` | ✅ Fixed | 2025-01-04 |
| `cleanup_old_notifications` | ✅ Fixed | 2025-01-04 |

### Extension Security
- ✅ **pg_trgm** - Moved to `extensions` schema (2025-01-04)
- ✅ **unaccent** - Moved to `extensions` schema (2025-01-04)

---

## 🔐 Authentication Security

### Supabase Auth Configuration

#### Leaked Password Protection
**Status:** ⚠️ **ACTION REQUIRED** - Must be enabled manually in Supabase Dashboard

**What is it?**
Supabase Auth integrates with HaveIBeenPwned.org to prevent users from creating accounts with passwords that have been compromised in known data breaches. This significantly reduces the risk of credential stuffing attacks.

**How to Enable:**

1. **Navigate to Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: `Stratos (Thorbis)`

2. **Open Authentication Settings**
   - In the left sidebar, click **Authentication**
   - Click **Policies** tab

3. **Enable Leaked Password Protection**
   - Find the section: **"Password Requirements"**
   - Toggle **ON**: "Leaked Password Protection"
   - This checks passwords against the HaveIBeenPwned database
   - Passwords found in breaches will be rejected during signup

4. **Verify Configuration**
   - Test by attempting to create an account with a known weak password (e.g., "password123")
   - The signup should fail with an appropriate error message

**Security Benefits:**
- ✅ Prevents use of compromised passwords from data breaches
- ✅ Reduces credential stuffing attack surface
- ✅ Forces users to create unique, secure passwords
- ✅ No performance impact (check happens during signup only)
- ✅ Privacy-preserving (uses k-anonymity via hash prefixes)

**Recommended Additional Settings:**
While in the Authentication Policies section, also verify:
- ✅ Minimum password length: 8+ characters
- ✅ Password complexity: Require letters, numbers, special characters
- ✅ Email confirmation: Enabled
- ✅ Rate limiting: Enabled on auth endpoints

---

## 🛡️ Next.js Security

### Proxy Pattern (Next.js 16+)
- ✅ **Using proxy.ts** (NOT middleware.ts) - Security best practice
- ✅ **CVE fix applied** - No longer vulnerable to `x-middleware-subrequest` bypass
- ⚠️ **Never rely solely on proxy.ts for authorization** - Always validate in Server Actions/API routes

### Server-Side Validation
- ✅ All Server Actions validate authentication
- ✅ All Server Actions validate input with Zod
- ✅ All API routes check user permissions
- ✅ All mutations verify company membership

---

## 📋 Monthly Security Audit Checklist

Run this checklist monthly to ensure ongoing security:

### Database Security Audit
```bash
# Run Supabase security advisors
pnpm mcp:supabase:advisors:security

# Check for new tables without RLS
pnpm mcp:supabase:check-rls

# Verify all functions have search_path set
pnpm mcp:supabase:check-functions
```

### Code Security Audit
```bash
# Run static analysis
pnpm lint

# Check for security vulnerabilities in dependencies
pnpm audit

# Check for outdated dependencies with known CVEs
pnpm outdated
```

### Authentication Audit
- [ ] Verify leaked password protection is enabled
- [ ] Check auth rate limiting is active
- [ ] Review recent failed login attempts
- [ ] Verify MFA is available for admin accounts
- [ ] Check session timeout settings

### Access Control Audit
- [ ] Review custom role permissions
- [ ] Verify RLS policies are working as expected
- [ ] Check for orphaned team members
- [ ] Verify admin accounts are limited

---

## 🚨 Security Incident Response

If a security issue is discovered:

1. **Immediate Actions**
   - Disable affected functionality if possible
   - Revoke compromised credentials
   - Enable additional logging
   - Document the issue and timeline

2. **Investigation**
   - Check Supabase logs for unauthorized access
   - Review recent database changes
   - Verify no data exfiltration occurred
   - Identify root cause

3. **Remediation**
   - Apply security patches immediately
   - Run full security audit
   - Verify fix effectiveness
   - Update documentation

4. **Prevention**
   - Add monitoring/alerting for similar issues
   - Update security guidelines
   - Train team on lessons learned
   - Schedule follow-up audit

---

## 📞 Security Contacts

- **Security Issues:** Report to project maintainers immediately
- **Supabase Support:** https://supabase.com/support
- **CVE Database:** https://cve.mitre.org/

---

## 📚 Security Resources

- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [Next.js Security Headers](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [HaveIBeenPwned](https://haveibeenpwned.com/)

---

**Status Legend:**
- ✅ Completed/Verified
- ⚠️ Action Required
- ❌ Not Configured
- 🔄 In Progress
