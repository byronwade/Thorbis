# Upload Debug & Button Alignment - Fixed! ✅

## Changes Made

### 1. ✅ Button Alignment - Right Aligned

**Before:** Button was using `ml-auto` which wasn't properly right-aligning

**After:** Proper flexbox layout with `justify-between`

```typescript
<div className="flex w-full items-center justify-between">
  <div className="flex items-center gap-2">
    {/* Title, icon, badge on left */}
  </div>
  <Button>
    {/* Upload button on right */}
  </Button>
</div>
```

**Files Updated:**
- ✅ `job-page-content.tsx` - Photos & Documents section
- ✅ `photos-docs-tab.tsx` - Photos card
- ✅ `photos-docs-tab.tsx` - Documents card

### 2. ✅ Added Debug Logging

Added console.log statements to track upload progress:

```typescript
console.log('Uploading:', fileName, 'companyId:', companyId, 'jobId:', jobId);
console.log('Upload result for', fileName, ':', result);
console.error('Upload failed for', fileName, ':', result.error);
```

**This will help us see:**
- What file is being uploaded
- What IDs are being sent
- What the server response is
- Any errors that occur

## 🔍 Debugging Steps

### Check Console for Errors

1. **Open Browser Console** (F12 or Cmd+Option+I)
2. **Go to Console tab**
3. **Try uploading a file**
4. **Look for these messages:**
   ```
   Uploading: photo.jpg companyId: xxx jobId: xxx
   Upload result for photo.jpg: { success: false, error: "..." }
   ```

### Common Issues to Check

#### Issue 1: Missing Company ID or Job ID
**Symptom:** Console shows `companyId: undefined` or `jobId: undefined`

**Fix:** Make sure job object has correct properties:
```typescript
<InlinePhotoUploader
  jobId={job.id}           // ← Make sure job.id exists
  companyId={job.company_id} // ← Make sure job.company_id exists
/>
```

#### Issue 2: Server Action Error
**Symptom:** `Upload result for xxx: { success: false, error: "Access denied" }`

**Possible causes:**
- User not logged in
- User not a member of company
- RLS policies blocking access

**Fix:** Check authentication and team membership

#### Issue 3: File Validation Error
**Symptom:** `Upload result for xxx: { success: false, error: "File validation failed" }`

**Possible causes:**
- File type not allowed (check blocklist in `file-validator.ts`)
- File size too large (max 100MB)
- File appears to be malicious

#### Issue 4: Storage Error
**Symptom:** `Upload result for xxx: { success: false, error: "Storage upload failed" }`

**Possible causes:**
- Supabase storage bucket doesn't exist
- Storage bucket permissions incorrect
- Network issue

## 🧪 Testing Steps

1. **Open job page**
2. **Click Upload button** (should be right-aligned now ✅)
3. **Select a file**
4. **Open console** (F12)
5. **Click "Upload X Files"**
6. **Watch console for messages:**

### Expected Console Output (Success):
```
Uploading: test.jpg companyId: 2b88a305-... jobId: 75381f87-...
Upload result for test.jpg: { 
  success: true, 
  data: { 
    attachmentId: "...",
    fileName: "test.jpg",
    fileSize: 123456,
    storageUrl: "..."
  }
}
```

### Expected Console Output (Failure):
```
Uploading: test.jpg companyId: 2b88a305-... jobId: 75381f87-...
Upload result for test.jpg: { 
  success: false, 
  error: "Access denied" 
}
Upload failed for test.jpg: Access denied
```

## 🔧 Quick Fixes

### If companyId is undefined:
```typescript
// Check the job object being passed
console.log('Job object:', job);

// Make sure you're passing the right property
jobId={job.id}
companyId={job.company_id} // or job.companyId depending on your schema
```

### If you see "Access denied":
```sql
-- Check if user is a team member
SELECT * FROM team_members 
WHERE user_id = auth.uid() 
AND company_id = '2b88a305-...' 
AND status = 'active';
```

### If you see "Missing required fields":
The server needs:
- ✅ `file` (File object)
- ✅ `companyId` (string)
- ✅ `contextType` (must be 'job')
- ✅ `contextId` (job ID)

Optional:
- `folder` (string: 'photos' or 'documents')
- `description` (string)
- `tags` (JSON array string)

## 📋 Next Steps

1. **Try uploading** and check console
2. **Copy the error message** from console
3. **Share the error** so we can fix it

The console logs will tell us exactly what's failing! 🎯

## Summary

✅ **Button alignment fixed** - Now properly right-aligned
✅ **Debug logging added** - Console shows upload progress
✅ **Error messages improved** - Shows specific file failures

**Now try uploading and check your browser console!** The logs will show us exactly what's going wrong.

