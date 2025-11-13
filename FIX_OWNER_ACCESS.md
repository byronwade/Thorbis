# Fix Owner Access - Simple Guide

## ⚡ Quick Fix (5 minutes)

You're hitting this error because the permission system doesn't recognize that you (as owner) should have full access.

### What's Fixed
✅ **TypeScript code** - Already updated (no action needed)
🔄 **Database functions** - Need to apply SQL migration (1 step below)

---

## 🚀 Apply the Fix

### 1. Copy the SQL Migration
```bash
cat supabase/migrations/20250213000000_fix_owner_permissions.sql
```

### 2. Go to Supabase SQL Editor
**Direct Link:** https://supabase.com/dashboard/project/togejqdwggezkxahomeh/sql/new

### 3. Paste and Click "Run"
- Paste the entire SQL from step 1
- Click the "Run" button (or press Cmd+Enter)
- Wait for "Success" message

### 4. Restart Your Dev Server
```bash
# Press Ctrl+C to stop current server
pnpm dev
```

### 5. Test
Try archiving a job again - it should work! ✅

---

## 🤔 How It Works

**Architecture:**
- Owners ARE in the `team_members` table
- When checking permissions, we check if that team member IS the owner
- If YES → Full access to everything
- If NO → Normal role-based permissions

**What Changed:**
```
BEFORE: Check team_members → Get role → Check permissions → ❌ May fail
AFTER:  Check team_members → Is owner? → ✅ Full access
```

---

## 🆘 Still Having Issues?

**Check if you're in team_members:**
```sql
SELECT * FROM team_members 
WHERE user_id = auth.uid() 
AND status = 'active';
```

**Check if you're the owner:**
```sql
SELECT 
  c.name as company_name,
  (c.owner_id = auth.uid()) as am_i_owner
FROM companies c
JOIN team_members tm ON tm.company_id = c.id
WHERE tm.user_id = auth.uid()
AND tm.status = 'active';
```

If `am_i_owner` is `true`, you should have full access after applying the migration.

---

## 📝 Files Modified

✅ `src/lib/auth/authorization.ts` - TypeScript (already applied)
🔄 `supabase/migrations/20250213000000_fix_owner_permissions.sql` - Database (needs manual application)

---

**That's it!** Once you apply the SQL migration and restart, you'll have full owner access. 🎉

