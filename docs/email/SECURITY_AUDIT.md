# Email System Security Audit & Safeguards

**Last Updated:** 2025-11-24
**System:** Per-User Gmail OAuth + Role-Based Permissions

---

## 🔴 CRITICAL ISSUES (Must Fix)

### 1. Token Security

**Issue:** OAuth refresh tokens stored in plaintext in database
**Risk:** Database breach exposes all Gmail accounts
**Status:** ⚠️ NEEDS ENCRYPTION

**Recommendation:**
- Encrypt tokens at rest using AES-256
- Use environment variable for encryption key
- Rotate encryption keys periodically
- Consider using Supabase Vault for secrets

**Implementation:** See `/src/lib/email/token-encryption.ts`

---

### 2. Rate Limiting

**Issue:** No rate limiting on Gmail API calls or sync operations
**Risk:** API quota exhaustion, cost overruns, abuse
**Status:** ⚠️ NEEDS IMPLEMENTATION

**Limits Needed:**
- Gmail API: 250 quota units/user/second (Google's limit)
- Inbox sync: Max 1 sync per user per 5 minutes
- API endpoints: 60 requests per minute per user
- Cron job: Stagger requests, max 10 concurrent syncs

**Implementation:** See `/src/lib/email/rate-limiter.ts`

---

### 3. OAuth State Entropy

**Issue:** State parameter uses basic JSON encoding
**Risk:** CSRF attacks, session fixation
**Status:** ⚠️ NEEDS ENHANCEMENT

**Current:** `Buffer.from(JSON.stringify(state)).toString("base64")`
**Recommended:** Add cryptographic random nonce + HMAC signature

**Implementation:**
```typescript
const nonce = crypto.randomBytes(32).toString('hex');
const state = { ...data, nonce, timestamp: Date.now() };
const signature = crypto.createHmac('sha256', SECRET).update(JSON.stringify(state)).digest('hex');
const encoded = Buffer.from(JSON.stringify({ state, signature })).toString('base64');
```

---

### 4. Token Cleanup

**Issue:** No automatic cleanup of invalid/expired tokens
**Risk:** Database bloat, orphaned records
**Status:** ⚠️ NEEDS IMPLEMENTATION

**Cleanup Needed:**
- Invalid tokens (sync_enabled = false for >30 days)
- Expired tokens with failed refresh (>7 days)
- Tokens for deleted team members
- Tokens for deleted companies

**Implementation:** Cron job at `/api/cron/cleanup-invalid-tokens`

---

## 🟡 HIGH PRIORITY (Should Fix)

### 5. Audit Logging

**Issue:** No audit trail for permission changes or email access
**Risk:** Cannot investigate security incidents or unauthorized access
**Status:** ⚠️ NEEDS IMPLEMENTATION

**Events to Log:**
- Permission grants/revokes (who, when, what)
- Gmail connections/disconnections
- Token refresh failures
- Sync errors and retries
- Email access (optional, for compliance)

**Implementation:** See `/src/lib/email/audit-logger.ts`

---

### 6. Permission Escalation Prevention

**Issue:** Need to verify users cannot grant themselves permissions
**Risk:** Privilege escalation
**Status:** ✅ PARTIALLY MITIGATED (API checks admin role)

**Additional Checks Needed:**
- Cannot grant higher permission than you have
- Cannot remove your own "all" permission (owners/admins)
- Cannot change role via permission system
- Cannot bypass company isolation

**Implementation:** Enhanced validation in `/api/email/permissions`

---

### 7. Database Cascade Rules

**Issue:** Need to verify cascade deletes are configured correctly
**Risk:** Orphaned records, data leaks
**Status:** ⚠️ NEEDS VERIFICATION

**Cascade Rules Needed:**
- Company deleted → Delete all email_permissions, user_gmail_tokens, user_email_accounts
- Team member deleted → Delete user_gmail_tokens, user_email_accounts, set communications.mailbox_owner_id to NULL
- User_email_account deleted → Delete user_gmail_tokens

**Implementation:** Database migration to add/verify foreign key constraints

---

### 8. Sync Error Handling

**Issue:** Sync failures don't notify users or disable problematic connections
**Risk:** Silent failures, stale data
**Status:** ⚠️ NEEDS ENHANCEMENT

**Enhancements Needed:**
- After 3 consecutive failures, disable sync and notify user
- Store error history per connection
- Automatic retry with exponential backoff
- Admin dashboard for sync health

**Implementation:** Enhanced error handling in `syncUserInbox()`

---

## 🟢 MEDIUM PRIORITY (Nice to Have)

### 9. PKCE for OAuth

**Issue:** Using standard OAuth 2.0 without PKCE
**Risk:** Authorization code interception (mitigated by HTTPS)
**Status:** ⚠️ OPTIONAL (but recommended)

**PKCE Benefits:**
- Protection against authorization code interception
- Required for mobile apps
- Industry best practice

**Implementation:** Add code_challenge and code_verifier to OAuth flow

---

### 10. Token Rotation

**Issue:** Refresh tokens never rotate
**Risk:** Long-lived credentials
**Status:** ⚠️ OPTIONAL (Google handles this)

**Google Behavior:**
- Refresh tokens don't expire unless revoked
- Google may issue new refresh token on refresh (optional)
- Token rotation handled automatically if provided

**Action:** Monitor and store new refresh tokens when provided

---

### 11. Multiple Account Support

**Issue:** User can only connect one Gmail account
**Risk:** Limitation for users with multiple accounts
**Status:** ✅ DESIGN DECISION (one account per user is sufficient)

**Considerations:**
- Database supports multiple accounts (unique on email_address)
- UI only shows one connection
- Could be enhanced later if needed

---

### 12. Email Content in Logs

**Issue:** Email bodies/subjects might leak into logs
**Risk:** Sensitive data exposure in log aggregation
**Status:** ⚠️ NEEDS REVIEW

**Recommendations:**
- Never log email bodies
- Truncate subjects in logs (first 50 chars)
- Redact email addresses in non-error logs
- Use structured logging with PII filtering

---

## 🔵 LOW PRIORITY (Monitoring)

### 13. Monitoring & Alerting

**Metrics Needed:**
- Sync success rate per user
- Gmail API error rate
- Token refresh failure rate
- Permission changes per day
- Average sync duration

**Alerts Needed:**
- Sync failure rate > 20%
- Gmail API quota approaching limit
- Multiple token refresh failures
- Unusual permission changes

**Implementation:** Integration with monitoring service (e.g., Sentry, DataDog)

---

### 14. Quota Management

**Issue:** No visibility into Gmail API quota usage
**Risk:** Unexpected API blocks
**Status:** ⚠️ NEEDS MONITORING

**Google Quotas:**
- 1 billion quota units per day (project-wide)
- 250 quota units/user/second
- Messages.get = 5 units, Messages.list = 5 units

**With 100 users syncing 50 messages/hour:**
- 100 users × 50 msgs × 5 units = 25,000 units/hour
- Daily usage: 600,000 units (well under 1B limit)

**Action:** Add quota usage tracking and alerts

---

## ✅ ALREADY IMPLEMENTED (Good)

### Security Features Already in Place:

1. **Authentication Required**
   - All API routes check `auth.getUser()`
   - Session-based authentication via Supabase

2. **Company Isolation**
   - RLS policies on all tables
   - Company ID checks in queries
   - Team member verification

3. **Role-Based Authorization**
   - Owner/Admin checks for permission management
   - Permission checks before email access
   - Visibility scope enforcement

4. **CSRF Protection**
   - State parameter in OAuth flow
   - User ID verification in callback
   - Session validation

5. **Input Validation**
   - Category validation (enum check)
   - Team member existence check
   - Company membership verification

6. **Secure Token Storage**
   - Refresh tokens stored server-side only
   - Access tokens never exposed to client
   - Token expiry tracking

7. **Permission Defaults**
   - Automatic permission grants via trigger
   - Personal category always granted
   - Owner/Admin "all" protected

8. **Deduplication**
   - Gmail message ID prevents duplicates
   - Email address uniqueness enforced
   - Upsert patterns used

---

## 📋 Implementation Priority

### Immediate (This Week):
1. ✅ Token encryption at rest
2. ✅ Rate limiting on API endpoints
3. ✅ OAuth state enhancement (nonce + HMAC)
4. ✅ Database cascade rules verification

### Short-term (This Month):
5. Audit logging implementation
6. Token cleanup cron job
7. Sync error handling enhancement
8. Permission escalation checks

### Long-term (This Quarter):
9. Monitoring and alerting setup
10. PKCE implementation (optional)
11. Quota management dashboard
12. Email content redaction in logs

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Tokens encrypted at rest
- [ ] Rate limiting enabled on all endpoints
- [ ] OAuth state uses cryptographic nonce
- [ ] Database cascade rules verified
- [ ] Audit logging operational
- [ ] Token cleanup cron scheduled
- [ ] Sync error notifications working
- [ ] Permission escalation tests pass
- [ ] Monitoring and alerts configured
- [ ] Security review completed
- [ ] Penetration testing performed (optional)

---

## 📞 Incident Response

### Gmail Account Compromised:
1. Immediately revoke token via `disconnectUserGmail()`
2. Check audit logs for unauthorized access
3. Notify team member
4. Force re-authentication

### Database Breach:
1. Rotate encryption keys
2. Revoke all Gmail tokens via Google Admin Console
3. Force all users to reconnect
4. Audit all permission changes

### API Quota Exceeded:
1. Temporarily disable cron sync
2. Identify top API consumers
3. Implement stricter rate limits
4. Request quota increase from Google

---

## 📚 References

- [Google OAuth 2.0 Security](https://developers.google.com/identity/protocols/oauth2/web-server#security-considerations)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Gmail API Quotas](https://developers.google.com/gmail/api/reference/quota)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/security)
