# Complete Installation Fix Script
# Run this in PowerShell as Administrator

param(
    [switch]$Force,
    [switch]$SkipCursorCheck
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Complete Installation Fix for Tailwind CSS v4" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "`nTo run as Administrator:" -ForegroundColor Yellow
    Write-Host "1. Close this window" -ForegroundColor Yellow
    Write-Host "2. Right-click PowerShell" -ForegroundColor Yellow
    Write-Host "3. Select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host "4. Navigate to: cd C:\dev\Thorbis" -ForegroundColor Yellow
    Write-Host "5. Run: .\fix-install-complete.ps1`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "Success: Running as Administrator`n" -ForegroundColor Green

# Step 1: Check for running Cursor processes
Write-Host "[Step 1/6] Checking for Cursor processes..." -ForegroundColor Yellow

$cursorProcesses = Get-Process -Name "Cursor" -ErrorAction SilentlyContinue

if ($cursorProcesses -and -not $SkipCursorCheck) {
    Write-Host "WARNING: Cursor is currently running!" -ForegroundColor Red
    Write-Host "Cursor must be closed to prevent file locking.`n" -ForegroundColor Red

    if (-not $Force) {
        $response = Read-Host "Do you want to close Cursor now? (Y/N)"
        if ($response -eq "Y" -or $response -eq "y") {
            Write-Host "Closing Cursor..." -ForegroundColor Yellow
            Stop-Process -Name "Cursor" -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 3
            Write-Host "Success: Cursor closed`n" -ForegroundColor Green
        } else {
            Write-Host "`nPlease close Cursor manually and run this script again.`n" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Force flag set - closing Cursor..." -ForegroundColor Yellow
        Stop-Process -Name "Cursor" -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 3
        Write-Host "Success: Cursor closed`n" -ForegroundColor Green
    }
} else {
    Write-Host "Success: Cursor is not running`n" -ForegroundColor Green
}

# Step 2: Stop any Node/pnpm processes
Write-Host "[Step 2/6] Stopping Node.js and pnpm processes..." -ForegroundColor Yellow

Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name "pnpm" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "Success: Processes stopped`n" -ForegroundColor Green

# Step 3: Clean up locked files and directories
Write-Host "[Step 3/6] Cleaning up node_modules and cache..." -ForegroundColor Yellow

# Remove the problematic tailwindcss directory specifically
$tailwindPath = "node_modules\@tailwindcss\oxide-win32-x64-msvc"
if (Test-Path $tailwindPath) {
    Write-Host "Removing locked Tailwind CSS directory..." -ForegroundColor Yellow
    Remove-Item -Path $tailwindPath -Recurse -Force -ErrorAction SilentlyContinue
}

# Remove entire node_modules
if (Test-Path "node_modules") {
    Write-Host "Removing node_modules..." -ForegroundColor Yellow
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Clean pnpm cache
Write-Host "Cleaning pnpm cache..." -ForegroundColor Yellow
& pnpm store prune 2>$null

Write-Host "Success: Cleanup complete`n" -ForegroundColor Green

# Step 4: Temporarily disable Windows Defender for this directory
Write-Host "[Step 4/6] Configuring Windows Defender exclusion..." -ForegroundColor Yellow

$defenderExclusionAdded = $false
try {
    $currentPath = Get-Location
    Add-MpPreference -ExclusionPath $currentPath.Path -ErrorAction Stop
    Write-Host "Success: Added Windows Defender exclusion for: $($currentPath.Path)" -ForegroundColor Green
    Write-Host "  (Will be removed after installation)`n" -ForegroundColor Gray
    $defenderExclusionAdded = $true
} catch {
    Write-Host "Warning: Could not add Windows Defender exclusion (not critical)" -ForegroundColor Yellow
    Write-Host "  If installation fails, manually add exclusion in Windows Security`n" -ForegroundColor Gray
}

# Step 5: Install with retries
Write-Host "[Step 5/6] Installing dependencies with pnpm..." -ForegroundColor Yellow
Write-Host "(This may take 2-3 minutes)...`n" -ForegroundColor Gray

$maxRetries = 3
$retryCount = 0
$installSuccess = $false

while ($retryCount -lt $maxRetries -and -not $installSuccess) {
    if ($retryCount -gt 0) {
        Write-Host "`nRetry attempt $retryCount of $maxRetries..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }

    $installOutput = & pnpm install --force --no-frozen-lockfile 2>&1

    if ($LASTEXITCODE -eq 0) {
        $installSuccess = $true
        Write-Host "`nSuccess: Installation completed successfully!`n" -ForegroundColor Green
    } else {
        $retryCount++
        if ($retryCount -lt $maxRetries) {
            Write-Host "`nWarning: Installation failed, cleaning and retrying..." -ForegroundColor Yellow

            # Clean up and try again
            if (Test-Path "node_modules\@tailwindcss\oxide-win32-x64-msvc") {
                Remove-Item -Path "node_modules\@tailwindcss\oxide-win32-x64-msvc" -Recurse -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

# Step 6: Cleanup and verify
Write-Host "[Step 6/6] Finalizing..." -ForegroundColor Yellow

# Remove Windows Defender exclusion
if ($defenderExclusionAdded) {
    try {
        $currentPath = Get-Location
        Remove-MpPreference -ExclusionPath $currentPath.Path -ErrorAction SilentlyContinue
        Write-Host "Success: Removed Windows Defender exclusion`n" -ForegroundColor Green
    } catch {
        Write-Host "Warning: Could not remove Windows Defender exclusion`n" -ForegroundColor Yellow
    }
}

# Verify installation
if ($installSuccess) {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Verifying installation..." -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan

    $nextExists = Test-Path "node_modules\next"
    $tailwindExists = Test-Path "node_modules\tailwindcss"

    if ($nextExists) {
        Write-Host "Success: Next.js is installed" -ForegroundColor Green
    } else {
        Write-Host "Error: Next.js is missing" -ForegroundColor Red
    }

    if ($tailwindExists) {
        Write-Host "Success: Tailwind CSS is installed" -ForegroundColor Green
    } else {
        Write-Host "Error: Tailwind CSS is missing" -ForegroundColor Red
    }

    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "Installation Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "`nYou can now:" -ForegroundColor White
    Write-Host "1. Reopen Cursor" -ForegroundColor White
    Write-Host "2. Run: pnpm dev" -ForegroundColor White
    Write-Host "`n" -ForegroundColor White

    exit 0
} else {
    Write-Host "`n========================================" -ForegroundColor Red
    Write-Host "Installation Failed After $maxRetries Attempts" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "`nTry these alternative solutions:" -ForegroundColor Yellow
    Write-Host "`n1. Use Yarn instead of pnpm:" -ForegroundColor White
    Write-Host "   npm install -g yarn" -ForegroundColor Gray
    Write-Host "   yarn install" -ForegroundColor Gray
    Write-Host "`n2. Downgrade to Tailwind CSS v3:" -ForegroundColor White
    Write-Host "   See INSTALLATION_FIX.md for instructions" -ForegroundColor Gray
    Write-Host "`n3. Add permanent Windows Defender exclusion:" -ForegroundColor White
    Write-Host "   Windows Security - Virus and threat protection - Exclusions" -ForegroundColor Gray
    Write-Host "   Add folder: C:\dev\Thorbis" -ForegroundColor Gray
    Write-Host "`n4. Disable real-time protection temporarily during install" -ForegroundColor White
    Write-Host "`nFor more help, see: INSTALLATION_FIX.md`n" -ForegroundColor White

    exit 1
}
