# Admin View-As System - Testing Guide

**Complete end-to-end testing checklist for the admin view-as-customer system.**

---

## 🚀 Quick Start

### Prerequisites
- Admin app running: `http://localhost:3001`
- Web app running: `http://localhost:3000` (for web database)
- Both databases seeded with test data

### Test Admin Credentials
```
Email: admin@thorbis.com
Password: Admin123!
```

---

## ✅ Phase 1: Session Management Tests

### Test 1.1: Create Support Session

**Steps:**
1. Login to admin app (`http://localhost:3001/admin/login`)
2. Navigate to Companies page (`/admin/dashboard/work/companies`)
3. Find a company with data (jobs, invoices, etc.)
4. Click "View As" button

**Expected Results:**
- ✅ Session created in `support_sessions` table
- ✅ Status = 'active' (auto-approved for testing)
- ✅ Redirected to `/admin/dashboard/view-as/[companyId]/work/jobs`
- ✅ Admin banner appears at top (orange gradient)
- ✅ Timer starts counting down from 60:00

**Database Verification:**
```sql
-- Check session created
SELECT id, company_id, admin_user_id, status, expires_at
FROM support_sessions
ORDER BY created_at DESC
LIMIT 1;

-- Should show: status = 'active', expires_at = now() + 60 minutes
```

---

### Test 1.2: Session Timer Display

**Steps:**
1. While in view-as mode, observe the banner timer

**Expected Results:**
- ✅ Timer counts down: 59:59, 59:58, etc.
- ✅ Timer color green when > 10 min remaining
- ✅ Timer color yellow when 5-10 min remaining
- ✅ Timer color red when < 5 min remaining
- ✅ Shows company ID (first 8 chars)
- ✅ Shows "Viewing as [Company Name]" if available

---

### Test 1.3: End Session Manually

**Steps:**
1. While in view-as mode, click "End Session" button in banner
2. Confirm in dialog (if prompted)

**Expected Results:**
- ✅ Redirected to `/admin/dashboard/work/companies`
- ✅ Admin banner removed
- ✅ Session status updated to 'ended' in database
- ✅ Toast notification: "Session ended successfully"

**Database Verification:**
```sql
SELECT status, ended_at
FROM support_sessions
WHERE id = '[session-id]';

-- Should show: status = 'ended', ended_at = current timestamp
```

---

### Test 1.4: Session Auto-Expiration

**⚠️ Long Test - 60 minutes**

**Steps:**
1. Create a new session
2. Wait for timer to reach 00:00 (or modify session expires_at in DB for faster testing)

**Faster Testing:**
```sql
-- Set session to expire in 1 minute
UPDATE support_sessions
SET expires_at = NOW() + INTERVAL '1 minute'
WHERE id = '[session-id]';
```

**Expected Results:**
- ✅ Auto-redirect to companies page when timer hits 00:00
- ✅ Session status = 'expired' in database
- ✅ Toast notification about session expiration

---

## ✅ Phase 2: Data Views Tests

### Test 2.1: View Company Jobs

**Steps:**
1. Create session for company with jobs
2. Navigate to Jobs page (default page after session creation)

**Expected Results:**
- ✅ See Kanban board with job columns (Pending, In Progress, etc.)
- ✅ See Jobs table view
- ✅ Toggle between Kanban/Table views works
- ✅ Job data matches what customer would see
- ✅ No admin user's jobs visible (only impersonated company)

---

### Test 2.2: View Company Payments

**Steps:**
1. In view-as mode, navigate to Payments page
2. URL: `/admin/dashboard/view-as/[companyId]/work/payments`

**Expected Results:**
- ✅ Table shows customer's payments only
- ✅ Columns: Payment #, Customer, Invoice #, Method, Status, Amount, Date, Actions
- ✅ Currency formatted correctly ($X,XXX.XX)
- ✅ Status badges colored correctly
- ✅ Actions dropdown (⋮) visible on each row

---

### Test 2.3: View Company Invoices

**Steps:**
1. Navigate to Invoices page
2. URL: `/admin/dashboard/view-as/[companyId]/work/invoices`

**Expected Results:**
- ✅ Table shows customer's invoices only
- ✅ Columns: Invoice #, Customer, Status, Total, Paid, Balance, Due Date, Actions
- ✅ Status badges: Draft (grey), Sent (blue), Paid (green), Overdue (red)
- ✅ Actions dropdown visible

---

### Test 2.4: View Company Team

**Steps:**
1. Navigate to Team page
2. URL: `/admin/dashboard/view-as/[companyId]/work/team`

**Expected Results:**
- ✅ Table shows customer's team members only
- ✅ Columns: Name, Email, Phone, Role, Status, Joined, Actions
- ✅ Status badges show active/inactive
- ✅ Actions dropdown visible

---

## ✅ Phase 3: Admin Actions Tests

### Test 3.1: Issue Payment Refund

**Prerequisites:** Company has a completed payment with amount > 0

**Steps:**
1. Navigate to Payments page
2. Click Actions (⋮) on a completed payment
3. Select "Issue Refund"
4. Enter refund amount (e.g., $50.00)
5. Enter reason: "Testing refund functionality"
6. Click "Issue Refund"

**Expected Results:**
- ✅ Dialog shows max refund amount
- ✅ Can't enter amount > max
- ✅ Loading state shows "Processing..."
- ✅ Success toast: "Action completed successfully"
- ✅ Dialog closes automatically
- ✅ Page revalidates (payment table updates)
- ✅ Payment status changed to "partially_refunded" or "refunded"

**Database Verification:**
```sql
-- Check payment updated
SELECT id, amount, refunded_amount, status
FROM payments
WHERE id = '[payment-id]';

-- Check audit log
SELECT action, resource_type, resource_id, before_data, after_data, reason
FROM support_session_actions
WHERE session_id = '[session-id]'
AND action = 'issue_payment_refund'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected Audit Log:**
- ✅ `before_data` shows original payment state
- ✅ `after_data` shows new refunded_amount
- ✅ `reason` contains the entered reason

---

### Test 3.2: Void Invoice

**Prerequisites:** Company has a draft or sent invoice (not paid)

**Steps:**
1. Navigate to Invoices page
2. Click Actions (⋮) on a draft/sent invoice
3. Select "Void Invoice"
4. Enter reason: "Customer requested cancellation"
5. Click "Void Invoice"

**Expected Results:**
- ✅ Warning shown (destructive action, red button)
- ✅ Success toast appears
- ✅ Invoice status changed to "cancelled"
- ✅ Cannot void a paid invoice (error message)

**Test Edge Case - Try to Void Paid Invoice:**
1. Click Actions on paid invoice
2. Select "Void Invoice"
3. Expected: Error message "Cannot void a paid invoice. Issue a refund instead."

---

### Test 3.3: Reset Team Member Password

**Prerequisites:** Company has team members

**Steps:**
1. Navigate to Team page
2. Click Actions (⋮) on any team member
3. Select "Reset Password"
4. Enter reason: "User forgot password"
5. Click "Send Password Reset"

**Expected Results:**
- ✅ Confirmation dialog shows
- ✅ Success message shows email sent
- ✅ Check email inbox (if configured) for reset email

**Database Verification:**
```sql
-- Check audit log
SELECT action, resource_type, before_data, after_data, reason
FROM support_session_actions
WHERE action = 'reset_team_member_password'
ORDER BY created_at DESC
LIMIT 1;
```

---

### Test 3.4: Update Invoice Due Date

**Prerequisites:** Company has an invoice

**Steps:**
1. Navigate to Invoices page
2. Click Actions (⋮) on any invoice
3. Select "Update Due Date"
4. Pick a new date (e.g., 30 days from now)
5. Enter reason: "Customer requested extension"
6. Click "Update Due Date"

**Expected Results:**
- ✅ Date picker shows
- ✅ Success toast appears
- ✅ Invoice due_date updated in table
- ✅ Audit log captures before/after dates

---

### Test 3.5: Change Team Member Role

**Prerequisites:** Company has team members

**Steps:**
1. Navigate to Team page
2. Click Actions (⋮) on a team member
3. Select "Change Role"
4. Select new role (e.g., Manager → Admin)
5. Enter reason: "Promotion"
6. Click "Change Role"

**Expected Results:**
- ✅ Dropdown shows available roles
- ✅ Success toast appears
- ✅ Team member role updated
- ✅ Audit log shows old and new role

---

### Test 3.6: Update Job Status

**Prerequisites:** Jobs page available (uses floating tools or future job detail page)

**Note:** Jobs page uses mirror mode, so row actions aren't available. Job actions would be tested via:
- Floating tools (when implemented)
- Job detail page (future)
- Direct server action testing

**Skip for now** - jobs actions tested separately

---

## ✅ Phase 4: Floating Tools Tests

### Test 4.1: Floating Tools Visibility

**Steps:**
1. In view-as mode, look at bottom-right corner
2. Click to expand/collapse

**Expected Results:**
- ✅ Floating tools panel visible (orange border)
- ✅ Shows "Admin Tools" title with wrench icon
- ✅ Expands/collapses on click
- ✅ Shows session ID and company ID

---

### Test 4.2: Session Tools Actions

**Steps:**
1. Expand floating tools
2. Try each action button

**Expected Results:**
- ✅ "View Audit Trail" → Opens audit trail page (new tab)
- ✅ "Export Data" → Shows "coming soon" alert (placeholder)
- ✅ "View Session Log" → Opens session details page (new tab)

---

## ✅ Phase 5: Security & Permissions Tests

### Test 5.1: Company Isolation

**Steps:**
1. Create session for Company A
2. Note Company A's ID
3. Try to navigate to Company B's data
4. URL: `/admin/dashboard/view-as/[companyB-id]/work/payments`

**Expected Results:**
- ✅ Shows Company A's data (not Company B)
- ✅ Company ID in URL doesn't override session
- ✅ Session's company_id is authoritative

---

### Test 5.2: Session Expiration Validation

**Steps:**
1. Create session
2. Manually expire it in database:
```sql
UPDATE support_sessions
SET status = 'expired', expires_at = NOW() - INTERVAL '1 minute'
WHERE id = '[session-id]';
```
3. Try to navigate to any view-as page
4. Try to perform an admin action

**Expected Results:**
- ✅ Redirected to companies page
- ✅ Error message about expired session
- ✅ Actions fail with permission error

---

### Test 5.3: Permission Checks

**Steps:**
1. Check that each action requires appropriate permission
2. Verify permission names in code match database

**Current Permissions:**
- `view` - View customer data
- `edit_jobs` - Modify jobs
- `edit_invoices` - Modify invoices
- `edit_payments` - Modify payments
- `refund` - Issue refunds
- `edit_team` - Modify team members
- `reset_password` - Reset passwords

---

## ✅ Phase 6: Audit Trail Tests

### Test 6.1: Audit Log Completeness

**Steps:**
1. Perform multiple actions in a session:
   - Issue a refund
   - Void an invoice
   - Change a team member role
2. Query audit log:
```sql
SELECT
  action,
  resource_type,
  resource_id,
  before_data,
  after_data,
  reason,
  created_at
FROM support_session_actions
WHERE session_id = '[session-id]'
ORDER BY created_at ASC;
```

**Expected Results:**
- ✅ All 3 actions logged
- ✅ Each has before_data (original state)
- ✅ Each has after_data (new state)
- ✅ Reasons captured
- ✅ Timestamps accurate

---

### Test 6.2: Audit Log Immutability

**Steps:**
1. Try to update an audit log entry:
```sql
UPDATE support_session_actions
SET reason = 'Modified reason'
WHERE id = '[action-id]';
```

**Expected Results:**
- ✅ Error: RLS policy prevents modification
- ✅ Only inserts allowed, no updates/deletes

---

## ✅ Phase 7: Error Handling Tests

### Test 7.1: Network Errors

**Steps:**
1. Open browser dev tools → Network tab
2. Throttle to "Slow 3G"
3. Try to issue a refund

**Expected Results:**
- ✅ Loading state persists during slow request
- ✅ Success or error message appears eventually
- ✅ No UI freeze

---

### Test 7.2: Invalid Data

**Steps:**
1. Try to refund more than paid amount
2. Try to void a paid invoice
3. Try to update with invalid email

**Expected Results:**
- ✅ Validation errors shown
- ✅ Action doesn't execute
- ✅ Error toast with descriptive message

---

### Test 7.3: Missing Required Fields

**Steps:**
1. Open any action dialog
2. Leave required "Reason" field empty
3. Try to submit

**Expected Results:**
- ✅ HTML5 validation prevents submission
- ✅ "This field is required" message
- ✅ Cannot submit until filled

---

## 🧪 Regression Tests (After Changes)

### After Database Changes
- [ ] Sessions still create correctly
- [ ] Audit logs still insert
- [ ] Company data isolation still works

### After UI Changes
- [ ] All dialogs still open/close
- [ ] Forms still submit
- [ ] Toast notifications appear

### After Action Changes
- [ ] All 18 actions still execute
- [ ] Audit logs capture data
- [ ] Cache revalidation works

---

## 📊 Performance Tests

### Test P1: Page Load Times

**Steps:**
1. Open dev tools → Network tab
2. Navigate to each work section page
3. Measure load time

**Target:**
- ✅ Initial load < 2 seconds
- ✅ Subsequent navigation < 500ms

---

### Test P2: Action Response Times

**Steps:**
1. Perform each action type
2. Measure time from submit to success toast

**Target:**
- ✅ Simple actions (update status) < 500ms
- ✅ Complex actions (refund) < 1 second

---

## 🐛 Known Issues / Limitations

### Current Limitations

1. **Auto-Approval**: Sessions auto-approve (testing only)
   - ⚠️ **Remove before production**
   - Real flow requires customer approval via web app

2. **Job Actions**: Not available via row actions
   - Jobs page uses mirror mode (full web component)
   - Actions would be via floating tools or job details

3. **Email Sending**: Placeholder only
   - Invoice reminders don't actually send
   - Password resets create reset link but may not email

4. **Payment Processing**: No real integration
   - Refunds update database only
   - Need Stripe/processor integration

---

## 📝 Test Checklist Summary

**Session Management** (5/5):
- ✅ Create session
- ✅ Timer display
- ✅ End session manually
- ✅ Auto-expiration
- ✅ Session validation

**Data Views** (4/4):
- ✅ Jobs page
- ✅ Payments page
- ✅ Invoices page
- ✅ Team page

**Admin Actions** (5/6):
- ✅ Issue refund
- ✅ Void invoice
- ✅ Reset password
- ✅ Update due date
- ✅ Change role
- ⏭️ Job actions (via other means)

**UI Components** (3/3):
- ✅ Floating tools
- ✅ Action dialogs
- ✅ Row actions dropdown

**Security** (3/3):
- ✅ Company isolation
- ✅ Session expiration
- ✅ Permission checks

**Audit Trail** (2/2):
- ✅ Completeness
- ✅ Immutability

**Error Handling** (3/3):
- ✅ Network errors
- ✅ Invalid data
- ✅ Missing fields

**Total: 25/26 tests (96%)**

---

## 🚀 Next Testing Phase (Phase 5)

When customer notifications are implemented, test:
- [ ] Session request notification in web app
- [ ] Customer approval flow
- [ ] Active session banner in web app
- [ ] Real-time action notifications
- [ ] End-of-session summary email
- [ ] Customer audit log viewer

---

## 💡 Testing Tips

1. **Use Browser Dev Tools**:
   - Console: Watch for errors
   - Network: Monitor API calls
   - Application → Cookies: View session cookies

2. **Database Access**:
   - Keep Supabase dashboard open
   - Watch tables update in real-time
   - Verify audit logs after each action

3. **Multiple Browser Windows**:
   - Admin app in one window
   - Web app in another (for future Phase 5)
   - Database viewer in third

4. **Test Data**:
   - Create companies with various data states
   - Some with jobs, some with invoices
   - Edge cases: empty companies, large datasets

---

## 🎯 Critical Path Test (Full Workflow)

**The One Test That Matters™**

1. ✅ Login as admin
2. ✅ View companies list
3. ✅ Click "View As" on a company
4. ✅ See admin banner + timer
5. ✅ Navigate to Payments page
6. ✅ Click Actions (⋮) on a payment
7. ✅ Issue a partial refund ($50)
8. ✅ Enter reason
9. ✅ Submit and see success
10. ✅ Verify payment updated
11. ✅ Check audit log in database
12. ✅ End session
13. ✅ Verify redirected to companies

**All 13 steps pass** = ✅ **System Works!**

---

*Last Updated: 2025-01-25 (Phase 4 Complete)*
