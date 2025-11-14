# 🧪 Authentication Testing Guide

Quick testing checklist for your new auth system.

---

## ⚡ Quick Test (2 Minutes)

### 1. Start Server
```bash
cd /Users/byronwade/Thorbis
pnpm dev
```

### 2. Test Registration
```bash
open http://localhost:3000/register
```

**Fill in:**
- Name: `Test User`
- Email: `test@example.com`
- Password: `TestPass123`
- ✅ Check "I agree to terms"
- Click "Sign Up to Thorbis"

**Expected:**
- ✅ Redirects to `/dashboard`
- ✅ Marketing header shows user avatar
- ✅ Click avatar → See dropdown menu
- ✅ Dropdown shows "Test User" and "test@example.com"

### 3. Test Session Persistence
- ✅ Refresh page → Still logged in
- ✅ Close tab, reopen → Still logged in
- ✅ **Cookies are working!** 🎉

### 4. Test Logout
- ✅ Click user avatar
- ✅ Click "Log out"
- ✅ Redirects to `/login`
- ✅ Marketing header shows "Sign In" button again

### 5. Test Login
```bash
open http://localhost:3000/login
```

**Fill in:**
- Email: `test@example.com`
- Password: `TestPass123`
- Click "Sign in to Thorbis"

**Expected:**
- ✅ Redirects to `/dashboard`
- ✅ User avatar appears in header
- ✅ Click avatar → Dropdown works

---

## 🔍 Detailed Testing

### Registration Edge Cases

**Test 1: Weak Password**
```
Password: test123
Expected: ❌ Error: "Password must contain uppercase, lowercase, and number"
```

**Test 2: Short Password**
```
Password: Test12
Expected: ❌ Error: "Password must be at least 8 characters"
```

**Test 3: No Terms Accepted**
```
Uncheck terms checkbox
Expected: ❌ Form validation prevents submission
```

**Test 4: Invalid Email**
```
Email: notanemail
Expected: ❌ Error: "Invalid email address"
```

**Test 5: Duplicate Email**
```
Register with same email twice
Expected: ❌ Error from Supabase about existing user
```

### Login Edge Cases

**Test 1: Wrong Password**
```
Email: test@example.com
Password: WrongPass123
Expected: ❌ Error: "Invalid login credentials"
```

**Test 2: Non-existent User**
```
Email: doesnotexist@example.com
Password: TestPass123
Expected: ❌ Error: "Invalid login credentials"
```

**Test 3: Empty Fields**
```
Leave fields empty
Expected: ❌ Browser validation or form error
```

### Route Protection

**Test 1: Access Dashboard While Logged Out**
```bash
# Log out first
open http://localhost:3000/dashboard
```
**Expected:**
- ✅ Redirects to `/login?redirectTo=/dashboard`
- ✅ After login, redirects back to `/dashboard`

**Test 2: Access Login While Logged In**
```bash
# While logged in
open http://localhost:3000/login
```
**Expected:**
- ✅ Redirects to `/dashboard`
- ✅ No way to access login page while authenticated

### User Dropdown

**Test 1: Avatar Click**
- ✅ Click avatar → Dropdown opens
- ✅ Shows user name and email
- ✅ Shows "My Company" organization

**Test 2: Theme Switcher**
- ✅ Click theme row → Cycles Light → Dark → System
- ✅ Page theme changes immediately
- ✅ Preference persists on refresh

**Test 3: Navigation Links**
- ✅ Account → Goes to `/dashboard/settings/profile/personal`
- ✅ Billing → Goes to `/dashboard/settings/billing`
- ✅ Settings → Goes to `/dashboard/settings`
- ✅ All links work

**Test 4: Logout**
- ✅ Click "Log out"
- ✅ Instant redirect to `/login`
- ✅ Session cleared
- ✅ Marketing header shows login buttons again

### Session Management

**Test 1: Refresh Page**
```
While logged in, press F5
Expected: ✅ Still logged in, no redirect
```

**Test 2: Close and Reopen Browser**
```
Close all browser windows, reopen
Expected: ✅ Still logged in
```

**Test 3: New Tab**
```
Open new tab, go to site
Expected: ✅ Already logged in
```

**Test 4: After Logout**
```
Log out, try accessing dashboard
Expected: ✅ Redirected to login
```

---

## 🐛 Common Issues & Fixes

### Issue: "RLS policy violation"
**Symptom**: Error when trying to read/write data
**Fix**: Run migrations:
```bash
# Go to Supabase SQL Editor and run:
# supabase/migrations/20250129000000_enable_rls_policies.sql
```

### Issue: User dropdown doesn't show
**Symptom**: Still sees "Sign In" button when logged in
**Fix**:
1. Check browser console for errors
2. Verify Supabase credentials in `.env.local`
3. Clear browser cache
4. Refresh page

### Issue: Not staying logged in
**Symptom**: Redirects to login after refresh
**Fix**:
1. Check browser allows cookies
2. Verify `NEXT_PUBLIC_SITE_URL` is correct
3. Clear browser cookies and try again
4. Check browser dev tools → Application → Cookies

### Issue: OAuth buttons don't work
**Symptom**: Clicking Google/Facebook does nothing or errors
**Fix**:
1. OAuth providers not configured yet
2. Go to Supabase Dashboard → Authentication → Providers
3. Enable and configure Google/Facebook
4. Add redirect URL: `https://togejqdwggezkxahomeh.supabase.co/auth/v1/callback`

---

## ✅ Success Criteria

Your auth system is working correctly if:

- [x] ✅ Can register new users
- [x] ✅ Can log in with correct credentials
- [x] ✅ Sessions persist across refreshes
- [x] ✅ User dropdown shows when logged in
- [x] ✅ Logout works and clears session
- [x] ✅ Dashboard is protected (redirects when logged out)
- [x] ✅ Login/register show errors for invalid input
- [x] ✅ Theme switcher cycles through options
- [x] ✅ Marketing header detects auth status

---

## 📊 Test Results Template

Use this to track your testing:

```
# Authentication Test Results
Date: _____________
Tester: _____________

## Registration
- [ ] Valid registration works
- [ ] Weak password rejected
- [ ] Duplicate email rejected
- [ ] Terms checkbox required

## Login
- [ ] Valid login works
- [ ] Wrong password rejected
- [ ] Non-existent user rejected
- [ ] Redirects to dashboard

## Session
- [ ] Persists on refresh
- [ ] Persists after browser close
- [ ] Shared across tabs
- [ ] Cleared on logout

## User Dropdown
- [ ] Shows when logged in
- [ ] Shows correct user info
- [ ] Theme switcher works
- [ ] Logout works

## Route Protection
- [ ] Dashboard requires auth
- [ ] Redirects preserve URL
- [ ] Can't access login when logged in

## Overall
- [ ] All tests passed
- [ ] Ready for production
- [ ] No errors in console

Notes:
________________
________________
```

---

## 🎯 Next Steps After Testing

Once all tests pass:

1. **Configure OAuth** (optional)
   - Set up Google/Facebook in Supabase
   - Test OAuth login flow

2. **Enable Email Verification** (optional)
   - Turn on in Supabase settings
   - Test email confirmation flow

3. **Customize Emails** (optional)
   - Edit email templates in Supabase
   - Add your branding

4. **Deploy to Production**
   - Update `NEXT_PUBLIC_SITE_URL` to production domain
   - Update OAuth redirect URLs
   - Test in production environment

---

**Happy Testing!** 🚀

If you find any issues, check:
1. Browser console for errors
2. Supabase logs in dashboard
3. Network tab for failed requests
4. [Troubleshooting guide](SETUP_COMPLETE.md#-troubleshooting)
