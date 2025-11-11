# Upload "Access Denied" Fix - Debug Mode Enabled 🔍

## Changes Made

### 1. ✅ Upload Button - Right Aligned (Fixed)
- Changed from `ml-auto` to proper `justify-between` layout
- Button now properly right-aligned across all upload sections

### 2. ✅ Multiple Clicks Issue - Fixed
- Improved state management in upload flow
- State now resets BEFORE calling callbacks
- Added `finally` block to ensure `isUploading` always resets
- Button disabled while `isUploading === true`

### 3. 🔍 Debug Logging - EXTENSIVE

Added comprehensive logging at multiple levels:

#### Client-Side (InlinePhotoUploader.tsx):
```typescript
console.log('🚀 Starting upload:', { jobId, companyId, fileCount });
console.log('Uploading:', fileName, 'companyId:', companyId, 'jobId:', jobId);
console.log('Upload result for', fileName, ':', result);
console.error('Upload failed for', fileName, ':', result.error);
```

#### Server-Side (actions/documents.ts):
```typescript
console.log('📤 Upload request received:', { fileName, companyId, contextType, contextId, folder });
console.log('👤 verifyCompanyAccess: User authenticated', { userId, companyId });
console.log('✅ verifyCompanyAccess: Membership found', { userId, companyId, role });
console.error('❌ verifyCompanyAccess: No membership found', { userId, companyId, error });
```

---

## 🔍 How to Debug "Access Denied" Error

### Step 1: Open Browser Console
1. Press `F12` (Windows/Linux) or `Cmd+Option+I` (Mac)
2. Go to the **Console** tab
3. Clear the console (🚫 icon)

### Step 2: Upload a File
1. Go to the job page
2. Click the Upload button (now right-aligned ✅)
3. Select a file
4. Click "Upload X Files"

### Step 3: Check Console Output

You should see a sequence like this:

#### ✅ SUCCESS CASE:
```
🚀 Starting upload: { jobId: '75381f87-...', companyId: '2b88a305-...', fileCount: 1 }
Uploading: photo.jpg companyId: 2b88a305-... jobId: 75381f87-...
📤 Upload request received: { fileName: 'photo.jpg', companyId: '2b88a305-...', contextType: 'job', contextId: '75381f87-...', folder: 'photos', hasFile: true }
👤 verifyCompanyAccess: User authenticated { userId: 'a1b2c3d4-...', companyId: '2b88a305-...' }
✅ verifyCompanyAccess: Membership found { userId: 'a1b2c3d4-...', companyId: '2b88a305-...', role: 'owner' }
Upload result for photo.jpg: { success: true, data: {...} }
```

#### ❌ FAILURE CASE (Access Denied):
```
🚀 Starting upload: { jobId: '75381f87-...', companyId: undefined, fileCount: 1 }
Uploading: photo.jpg companyId: undefined jobId: 75381f87-...
📤 Upload request received: { fileName: 'photo.jpg', companyId: undefined, contextType: 'job', contextId: '75381f87-...', folder: 'photos', hasFile: true }
❌ Missing required fields: { hasFile: true, companyId: undefined, contextType: 'job' }
```

OR

```
📤 Upload request received: { fileName: 'photo.jpg', companyId: '2b88a305-...', ... }
👤 verifyCompanyAccess: User authenticated { userId: 'a1b2c3d4-...', companyId: '2b88a305-...' }
❌ verifyCompanyAccess: No membership found { userId: 'a1b2c3d4-...', companyId: '2b88a305-...', error: 'Row not found' }
Upload result for photo.jpg: { success: false, error: 'Access denied' }
```

---

## 🐛 Common Issues & Fixes

### Issue 1: `companyId: undefined`

**Symptoms:**
```
🚀 Starting upload: { jobId: '...', companyId: undefined, fileCount: 1 }
```

**Cause:** The `job.company_id` prop is not being passed correctly

**Fix Options:**

1. **Check the job object structure:**
```typescript
// In job-page-content.tsx, add logging:
console.log('Job object:', job);
console.log('Company ID:', job.company_id);
```

2. **If the property name is different:**
```typescript
// It might be companyId instead of company_id
<InlinePhotoUploader
  jobId={job.id}
  companyId={job.companyId || job.company_id} // Try both
  ...
/>
```

3. **If it's nested:**
```typescript
// It might be in a nested structure
companyId={job.company?.id || job.company_id}
```

---

### Issue 2: No Membership Found

**Symptoms:**
```
❌ verifyCompanyAccess: No membership found
```

**Cause:** User is not in the `team_members` table for this company

**Check Database:**
```sql
-- Check if user is a team member
SELECT 
  tm.id,
  tm.user_id,
  tm.company_id,
  tm.role,
  tm.status,
  u.email
FROM team_members tm
JOIN auth.users u ON u.id = tm.user_id
WHERE tm.user_id = 'YOUR_USER_ID'
  AND tm.company_id = 'YOUR_COMPANY_ID';
```

**Fix:**
1. Make sure you're logged in as a user who is a member of the company
2. Check that the `team_members` record has `status = 'active'`
3. If no record exists, you need to add the user to the team

---

### Issue 3: Wrong Company ID

**Symptoms:**
```
verifyCompanyAccess: No membership found { companyId: 'wrong-id-...' }
```

**Cause:** The job's `company_id` doesn't match user's company membership

**Check:**
```sql
-- Verify job's company
SELECT id, job_number, company_id 
FROM jobs 
WHERE id = 'YOUR_JOB_ID';

-- Verify user's companies
SELECT company_id, role 
FROM team_members 
WHERE user_id = 'YOUR_USER_ID' 
  AND status = 'active';
```

---

## 📋 Quick Diagnostic Checklist

Copy/paste your console output and check:

- [ ] Is `companyId` defined? (Not `undefined`)
- [ ] Is `jobId` defined? (Not `undefined`)
- [ ] Does `verifyCompanyAccess` say "User authenticated"?
- [ ] Does `verifyCompanyAccess` say "Membership found"?
- [ ] If no membership, does the user exist in `team_members` table?
- [ ] Is `status = 'active'` in the team_members record?

---

## 🎯 Next Steps

1. **Try uploading again** with console open
2. **Copy the entire console output** from when you click Upload
3. **Share it** so we can see exactly what's happening
4. **Include:**
   - The `🚀 Starting upload:` line
   - All the `📤`, `👤`, `✅`, or `❌` lines
   - The final `Upload result` line

The logs will show us EXACTLY where it's failing! 🔍

---

## Summary of Fixes

✅ **Button alignment** - Now right-aligned with `justify-between`
✅ **Multiple clicks issue** - State properly resets after upload
✅ **Debug logging** - Comprehensive client and server-side logging
🔍 **Ready to diagnose** - Console will show exact failure point

**Try it now and check your console!** The detailed logs will tell us exactly what's wrong.

