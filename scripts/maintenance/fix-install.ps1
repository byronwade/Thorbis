# Fix installation script for Windows file locking issues
Write-Host "Attempting to fix pnpm installation issues..." -ForegroundColor Yellow

# Step 1: Remove node_modules completely
if (Test-Path "node_modules") {
    Write-Host "Removing node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Step 2: Clear pnpm store cache for tailwindcss
Write-Host "Clearing pnpm store cache..." -ForegroundColor Yellow
pnpm store prune

# Step 3: Try installing with retry logic
Write-Host "Installing dependencies (this may take a few minutes)..." -ForegroundColor Green
$maxRetries = 3
$retryCount = 0
$success = $false

while ($retryCount -lt $maxRetries -and -not $success) {
    $retryCount++
    Write-Host "Attempt $retryCount of $maxRetries..." -ForegroundColor Cyan
    
    try {
        pnpm install --no-frozen-lockfile 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            $success = $true
            Write-Host "Installation successful!" -ForegroundColor Green
        } else {
            # Check if Next.js was installed despite the error
            if (Test-Path "node_modules\next") {
                Write-Host "Partial installation detected. Next.js is installed." -ForegroundColor Yellow
                Write-Host "Trying to fix tailwindcss issue..." -ForegroundColor Yellow
                
                # Wait a bit and try to remove the locked file
                Start-Sleep -Seconds 5
                $tailwindFile = "node_modules\@tailwindcss\oxide-win32-x64-msvc\tailwindcss-oxide.win32-x64-msvc.node"
                if (Test-Path $tailwindFile) {
                    try {
                        Remove-Item $tailwindFile -Force -ErrorAction Stop
                        Write-Host "Tailwindcss file removed. Retrying installation..." -ForegroundColor Green
                        pnpm install --no-frozen-lockfile 2>&1 | Out-Null
                        $success = $true
                    } catch {
                        Write-Host "File still locked. You may need to:" -ForegroundColor Red
                        Write-Host "1. Close Cursor/VS Code" -ForegroundColor Yellow
                        Write-Host "2. Temporarily disable Windows Defender" -ForegroundColor Yellow
                        Write-Host "3. Run this script as Administrator" -ForegroundColor Yellow
                        Write-Host "4. Or manually delete: $tailwindFile" -ForegroundColor Yellow
                    }
                }
            }
        }
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
    }
    
    if (-not $success) {
        Start-Sleep -Seconds 3
    }
}

if (-not $success) {
    Write-Host "`nInstallation failed. Manual steps:" -ForegroundColor Red
    Write-Host "1. Close all editors (Cursor, VS Code, etc.)" -ForegroundColor Yellow
    Write-Host "2. Open PowerShell as Administrator" -ForegroundColor Yellow
    Write-Host "3. Navigate to: cd C:\dev\Stratos" -ForegroundColor Yellow
    Write-Host "4. Run: Remove-Item -Recurse -Force node_modules" -ForegroundColor Yellow
    Write-Host "5. Run: pnpm install" -ForegroundColor Yellow
    Write-Host "`nOr try excluding the project folder from Windows Defender real-time protection." -ForegroundColor Yellow
} else {
    Write-Host "`nVerifying installation..." -ForegroundColor Green
    if (Test-Path "node_modules\.bin\next.cmd") {
        Write-Host "✓ Next.js installed successfully!" -ForegroundColor Green
        Write-Host "You can now run: pnpm dev" -ForegroundColor Green
    }
}





