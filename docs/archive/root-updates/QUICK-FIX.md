# Quick Fix - 3 Steps

## FASTEST SOLUTION

### Step 1: Close Cursor
**Close this window completely** (File → Exit or Alt+F4)

### Step 2: Open PowerShell as Admin
1. Press `Win + X`
2. Click **"Windows PowerShell (Admin)"** or **"Terminal (Admin)"**

### Step 3: Run Fix Script
```powershell
cd C:\dev\Thorbis
.\scripts\maintenance\fix-install-complete.ps1
```

That's it! The script will:
- Clean up locked files
- Stop conflicting processes
- Install all dependencies
- Verify the installation

**Time**: 2-3 minutes

---

## Alternative: Use Yarn (If PowerShell Script Fails)

Yarn handles Windows file locking better than pnpm:

```powershell
# Install Yarn globally
npm install -g yarn

# Clean and install
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
yarn install
```

**Note**: The project uses pnpm, but Yarn will work as a temporary solution.

---

## Troubleshooting

### Script won't run?
Enable script execution:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Still getting permission errors?
Add Windows Defender exclusion manually:
1. Open **Windows Security**
2. Go to **Virus & threat protection** → **Manage settings**
3. Under **Exclusions**, click **"Add or remove exclusions"**
4. Click **"Add an exclusion"** → **"Folder"**
5. Select: `C:\dev\Thorbis`
6. Retry installation

### Need more help?
See: [INSTALLATION_FIX.md](./INSTALLATION_FIX.md) for detailed solutions
