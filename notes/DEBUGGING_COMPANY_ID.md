# Debugging Company ID Issue

## Current Status

✅ **Code is updated** - The new code with session fallback is running  
⚠️ **Issue**: `companyId` is not being found in URL params or session

---

## Enhanced Debugging

I've added comprehensive logging to help diagnose the issue. Here's what to look for in the console:

### When Making a Call (Outbound)

**In the main app (phone dropdown):**
```
📞 Opening call window with: {
  callId: "abc-123",
  companyId: "uuid-here" or null,
  customerId: "uuid-here" or undefined,
  to: "+1234567890",
  from: "+0987654321",
  direction: "outbound"
}
📞 Call window URL: /call-window?callId=...&companyId=...
```

**In the call window:**
```
📞 Call Window - Company ID from URL: "uuid-here" or null
📞 Call Window - Using company ID: "uuid-here"
```

### When Answering a Call (Inbound)

**In the main app (incoming call notification):**
```
📞 Opening call window with: {
  callId: "abc-123",
  companyId: "uuid-here" or null,
  from: "+1234567890",
  direction: "inbound"
}
📞 Call window URL: /call-window?callId=...&companyId=...
```

**In the call window:**
```
📞 Call Window - Company ID from URL: "uuid-here" or null
📞 Call Window - Using company ID: "uuid-here"
```

### If Company ID Not in URL (Session Fallback)

```
📞 Call Window - No companyId in URL, fetching from session...
📞 Call Window - User found: "user-uuid"
📞 Call Window - Company ID from session: "uuid-here"
📞 Call Window - Using company ID: "uuid-here"
```

### If Company ID Not Found (Error Case)

```
📞 Call Window - No companyId in URL, fetching from session...
📞 Call Window - User found: "user-uuid"
📞 Call Window - Failed to fetch team member: { ... }
📞 Call Window - No company ID available. URL params: {
  callId: "abc-123",
  customerId: null,
  allParams: { callId: "abc-123", direction: "inbound" }
}
```

---

## Troubleshooting Steps

### Step 1: Check if `companyId` is being fetched in main app

1. Open browser console
2. Make a call or answer a call
3. Look for: `📞 Opening call window with:`
4. Check if `companyId` is present and not `null`

**If `companyId` is `null`:**
- The main app isn't finding the company ID
- Check if user is logged in
- Check if user has a `team_members` record
- Check database: `SELECT * FROM team_members WHERE user_id = 'your-user-id'`

### Step 2: Check if `companyId` is in the URL

1. When call window opens, look at the URL bar
2. Should see: `/call-window?callId=...&companyId=...`

**If `companyId` is missing from URL:**
- The main app has `companyId` but it's not being passed
- Check the console log: `📞 Call window URL:`
- Verify the URLSearchParams logic

### Step 3: Check session fallback

1. Open call window console
2. Look for: `📞 Call Window - No companyId in URL, fetching from session...`

**If you see this:**
- URL didn't have `companyId`, fallback is working
- Check next log: `📞 Call Window - User found:` or `📞 Call Window - No user logged in`

**If user is found but no company ID:**
- Check: `📞 Call Window - Failed to fetch team member:`
- User might not have a `team_members` record
- Or the record doesn't have `company_id` set

### Step 4: Verify database

Run these queries in Supabase SQL Editor:

```sql
-- Check if user exists
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Check team_members record
SELECT * FROM team_members WHERE user_id = 'your-user-id';

-- Check if company_id is set
SELECT user_id, company_id, status FROM team_members WHERE user_id = 'your-user-id';
```

---

## Common Issues & Fixes

### Issue 1: User Not in `team_members` Table

**Symptom:**
```
📞 Call Window - No team member record found for user
```

**Fix:**
```sql
-- Insert team member record
INSERT INTO team_members (user_id, company_id, status)
VALUES ('your-user-id', 'your-company-id', 'active');
```

### Issue 2: `company_id` is NULL

**Symptom:**
```
📞 Call Window - Company ID from session: null
```

**Fix:**
```sql
-- Update team member with company_id
UPDATE team_members 
SET company_id = 'your-company-id'
WHERE user_id = 'your-user-id';
```

### Issue 3: Multiple `team_members` Records

**Symptom:**
```
📞 Call Window - Failed to fetch team member: { code: "PGRST116" }
```

**Fix:**
```sql
-- Check for multiple records
SELECT * FROM team_members WHERE user_id = 'your-user-id';

-- If multiple, keep only one active
UPDATE team_members 
SET status = 'inactive' 
WHERE user_id = 'your-user-id' AND id != 'keep-this-id';
```

### Issue 4: Browser Cache

**Symptom:**
- Old error messages
- Old line numbers in errors

**Fix:**
1. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Or clear cache: DevTools → Application → Clear storage
3. Or incognito window

---

## Quick Test Script

Run this in the browser console to check your setup:

```javascript
// Check if user is logged in
const { createClient } = await import('/src/lib/supabase/client.js');
const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user?.id, user?.email);

// Check team_members record
if (user) {
  const { data, error } = await supabase
    .from('team_members')
    .select('company_id, status')
    .eq('user_id', user.id)
    .single();
  
  console.log('Team Member:', data);
  console.log('Company ID:', data?.company_id);
  console.log('Error:', error);
}
```

---

## Expected Console Output (Success)

### Main App (when making call):
```
📞 Opening call window with: {
  callId: "call_abc123",
  companyId: "550e8400-e29b-41d4-a716-446655440000",
  customerId: "660e8400-e29b-41d4-a716-446655440001",
  to: "+1234567890",
  from: "+0987654321",
  direction: "outbound"
}
📞 Call window URL: /call-window?callId=call_abc123&companyId=550e8400-e29b-41d4-a716-446655440000&customerId=660e8400-e29b-41d4-a716-446655440001&to=%2B1234567890&from=%2B0987654321&direction=outbound
```

### Call Window:
```
📞 Call Window - Company ID from URL: "550e8400-e29b-41d4-a716-446655440000"
📞 Call Window - Using company ID: "550e8400-e29b-41d4-a716-446655440000"
```

---

## Next Steps

1. **Clear browser cache** - Make sure you're running the new code
2. **Make a test call** - Check console for the 📞 logs
3. **Share the logs** - Copy/paste the console output
4. **Check database** - Verify `team_members` record exists

---

## Files Modified (with logging)

- ✅ `src/app/call-window/page.tsx` - Enhanced logging for company ID fetch
- ✅ `src/components/layout/incoming-call-notification.tsx` - Log params before opening window
- ✅ `src/components/layout/phone-dropdown.tsx` - Log params before opening window

---

## Status

✅ **Logging added** - Comprehensive debugging in place  
⏳ **Waiting** - For console output to diagnose issue  
📊 **Next** - Analyze logs and fix root cause  

