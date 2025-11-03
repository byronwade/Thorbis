# Automated project migration - NO user prompts
# Move project out of OneDrive to fix EPERM errors permanently

$sourceDir = "C:\Users\bcw19\OneDrive\Desktop\Stratos"
$targetDir = "C:\dev\Stratos"

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host " Moving Project Out of OneDrive" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "FROM: $sourceDir" -ForegroundColor Yellow
Write-Host "TO:   $targetDir" -ForegroundColor Green
Write-Host ""

# [1/6] Stop processes
Write-Host "[1/6] Stopping Node.js processes..." -ForegroundColor Cyan
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "  [OK] Processes stopped" -ForegroundColor Green

# [2/6] Create target directory
Write-Host ""
Write-Host "[2/6] Creating C:\dev directory..." -ForegroundColor Cyan
if (!(Test-Path "C:\dev")) {
    New-Item -ItemType Directory -Path "C:\dev" -Force | Out-Null
}
Write-Host "  [OK] Directory created" -ForegroundColor Green

# [3/6] Copy files
Write-Host ""
Write-Host "[3/6] Copying project files..." -ForegroundColor Cyan
Write-Host "  This will take 2-3 minutes. Please wait..." -ForegroundColor Gray

# Create target if doesn't exist
if (!(Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

# Copy with robocopy (faster and more reliable)
$robocopyLog = robocopy "$sourceDir" "$targetDir" /E /COPYALL /R:0 /W:0 /MT:8 /XD ".next" "node_modules" ".vercel" /NFL /NDL 2>&1

if ($LASTEXITCODE -le 7) {
    Write-Host "  [OK] Files copied successfully" -ForegroundColor Green
} else {
    Write-Host "  [WARNING] Some files may not have copied (exit code: $LASTEXITCODE)" -ForegroundColor Yellow
}

# [4/6] Copy .git separately
Write-Host ""
Write-Host "[4/6] Copying .git directory..." -ForegroundColor Cyan
if (Test-Path "$sourceDir\.git") {
    # Remove existing .git in target if it exists
    if (Test-Path "$targetDir\.git") {
        Remove-Item "$targetDir\.git" -Recurse -Force -ErrorAction SilentlyContinue
    }

    # Copy .git
    Copy-Item -Path "$sourceDir\.git" -Destination "$targetDir\.git" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  [OK] Git repository copied" -ForegroundColor Green
} else {
    Write-Host "  [INFO] No .git directory found" -ForegroundColor Gray
}

# [5/6] Copy environment files
Write-Host ""
Write-Host "[5/6] Copying environment files..." -ForegroundColor Cyan
$envFiles = @(".env.local", ".env", ".env.development", ".vercel")
foreach ($file in $envFiles) {
    if (Test-Path "$sourceDir\$file") {
        Copy-Item -Path "$sourceDir\$file" -Destination "$targetDir\$file" -Force -ErrorAction SilentlyContinue
        Write-Host "  [OK] Copied $file" -ForegroundColor Green
    }
}

# [6/6] Install dependencies
Write-Host ""
Write-Host "[6/6] Installing dependencies in new location..." -ForegroundColor Cyan
Set-Location $targetDir
Write-Host "  Running: pnpm install" -ForegroundColor Gray
Write-Host ""

pnpm install 2>&1 | Out-String | Write-Host

Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
Write-Host " Migration Complete!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your project is now at: $targetDir" -ForegroundColor White
Write-Host ""
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now run: pnpm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "The original folder remains at:" -ForegroundColor Gray
Write-Host "  $sourceDir" -ForegroundColor DarkGray
Write-Host "  You can delete it after verifying everything works." -ForegroundColor DarkGray
Write-Host ""
