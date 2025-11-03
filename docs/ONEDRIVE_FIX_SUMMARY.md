# OneDrive Sync Fix - Summary

**Date**: 2025-11-03
**Status**: ✅ RESOLVED

## Problem

The Next.js dev server was experiencing persistent EPERM (operation not permitted) errors when running in a folder synced by OneDrive:

```
Error: EPERM: operation not permitted, rename 'C:\Users\bcw19\OneDrive\Desktop\Stratos\.next\dev\server\server-reference-manifest.js.tmp.xxx' -> '...\server-reference-manifest.js'
```

These errors occurred because:
- OneDrive was actively syncing files in the `.next` directory
- Next.js needs to rapidly create, rename, and delete files during development
- OneDrive file locking prevented these operations

## Solution Implemented

Created an automated PowerShell script (`scripts/fix-onedrive-sync.ps1`) that:

1. **Stops running Node.js processes** to unlock files
2. **Removes the existing `.next` directory** to start fresh
3. **Excludes critical folders from OneDrive sync** using `attrib +U` command:
   - `.next` - Build output and development files
   - `node_modules` - Dependencies (should never be synced)
   - `.vercel` - Deployment configuration

4. **Creates `.nosync` marker files** in each excluded folder for additional protection

## How to Use

If you encounter EPERM errors again, simply run:

```bash
powershell -ExecutionPolicy Bypass -File scripts/fix-onedrive-sync.ps1
```

Then start your dev server:

```bash
pnpm run dev
```

## Verification

✅ Dev server starts successfully on port 3000
✅ No EPERM errors during compilation
✅ Pages compile and render correctly
✅ Hot reload works without file locking issues

## Long-term Recommendations

For optimal development experience, consider one of these approaches:

### Option 1: Keep Project in OneDrive (Current Setup)
- ✅ **Already configured** - The fix script has excluded the necessary folders
- 📁 Excluded folders: `.next`, `node_modules`, `.vercel`
- ⚠️ **Caveat**: If OneDrive re-enables syncing, re-run the fix script

### Option 2: Move Project Outside OneDrive (Recommended for Best Performance)
Move your project to a non-synced location:

```powershell
# Example: Move to C:\dev\
xcopy "C:\Users\bcw19\OneDrive\Desktop\Stratos" "C:\dev\Stratos" /E /I /H
cd C:\dev\Stratos
pnpm install
pnpm run dev
```

**Benefits**:
- Faster file operations
- No sync conflicts
- Better disk I/O performance
- No need to re-run fix scripts

**Recommended paths**:
- `C:\dev\Stratos`
- `C:\projects\Stratos`
- `D:\development\Stratos` (if you have a second drive)

## Additional Notes

### What the `attrib +U` Command Does

The `attrib +U` command marks files/folders as "unpinned" from OneDrive, meaning:
- Files remain on your local disk
- OneDrive doesn't actively sync or lock these files
- The folders are excluded from cloud storage

### OneDrive Folders to Always Exclude from Sync

For any Node.js/Next.js project in OneDrive, always exclude:
- `.next` - Next.js build output
- `node_modules` - npm dependencies
- `.vercel` - Deployment config
- `.turbo` - Turborepo cache (if using)
- `dist` / `build` - Build outputs
- `.cache` - Various caches

### Troubleshooting

If EPERM errors return:

1. **Re-run the fix script**:
   ```bash
   powershell -ExecutionPolicy Bypass -File scripts/fix-onedrive-sync.ps1
   ```

2. **Check OneDrive status**:
   - Right-click the `.next` folder in File Explorer
   - Ensure it shows "Available when online" or has a cloud icon with a slash

3. **Manual exclusion** (if script fails):
   - Right-click `.next` folder → "Free up space"
   - This removes the folder from OneDrive sync

4. **Nuclear option** (if all else fails):
   - Move project outside OneDrive entirely
   - Update git remote if needed
   - Benefits: permanent fix, better performance

## Success Metrics

After applying the fix:
- ✅ Dev server ready in ~6 seconds
- ✅ Zero EPERM errors during startup
- ✅ Pages compile successfully
- ✅ Hot reload works correctly
- ✅ No file locking issues

## Files Modified

- **Created**: `scripts/fix-onedrive-sync.ps1` - Automated fix script
- **Created**: `docs/ONEDRIVE_FIX_SUMMARY.md` - This document

## Related Issues

This fix resolves common Windows + OneDrive + Next.js development issues:
- [Next.js Issue #12523](https://github.com/vercel/next.js/issues/12523)
- [Next.js Issue #48232](https://github.com/vercel/next.js/issues/48232)

## Conclusion

The OneDrive sync conflict has been successfully resolved. The dev server now runs without EPERM errors. The automated fix script is available for future use if needed.

For the best long-term development experience, consider moving your project outside of OneDrive to a dedicated development folder.
