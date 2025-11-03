# Move project out of OneDrive to fix EPERM errors permanently
# This is the ONLY reliable solution for Next.js + OneDrive on Windows

$sourceDir = "C:\Users\bcw19\OneDrive\Desktop\Stratos"
$targetDir = "C:\dev\Stratos"

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host " Move Project Out of OneDrive" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Confirm with user
Write-Host "This will move your project from:" -ForegroundColor Yellow
Write-Host "  FROM: $sourceDir" -ForegroundColor White
Write-Host "  TO:   $targetDir" -ForegroundColor White
Write-Host ""
Write-Host "This is the ONLY reliable fix for EPERM errors on Windows + OneDrive." -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Continue? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Operation cancelled." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "[1/6] Stopping Node.js processes..." -ForegroundColor Cyan
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "  [OK] Processes stopped" -ForegroundColor Green

Write-Host ""
Write-Host "[2/6] Creating target directory..." -ForegroundColor Cyan
if (!(Test-Path "C:\dev")) {
    New-Item -ItemType Directory -Path "C:\dev" -Force | Out-Null
}
Write-Host "  [OK] C:\dev created" -ForegroundColor Green

Write-Host ""
Write-Host "[3/6] Copying project files..." -ForegroundColor Cyan
Write-Host "  This may take a few minutes..." -ForegroundColor Gray

# Use robocopy for faster, more reliable copying
$robocopyArgs = @(
    $sourceDir,
    $targetDir,
    "/E",           # Copy subdirectories, including empty ones
    "/COPYALL",     # Copy all file information
    "/R:0",         # No retries on failed copies
    "/W:0",         # No wait between retries
    "/MT:8",        # Multi-threaded (8 threads)
    "/XD", ".next", "node_modules", ".vercel", ".git",  # Exclude these directories
    "/NDL",         # No directory list
    "/NJH",         # No job header
    "/NJS"          # No job summary
)

$result = robocopy @robocopyArgs

# Robocopy exit codes: 0-7 are success, 8+ are failures
if ($LASTEXITCODE -le 7) {
    Write-Host "  [OK] Files copied successfully" -ForegroundColor Green
} else {
    Write-Host "  [ERROR] Failed to copy files (exit code: $LASTEXITCODE)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[4/6] Copying .git directory (if exists)..." -ForegroundColor Cyan
if (Test-Path "$sourceDir\.git") {
    Copy-Item -Path "$sourceDir\.git" -Destination "$targetDir\.git" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  [OK] Git repository copied" -ForegroundColor Green
} else {
    Write-Host "  [INFO] No .git directory found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "[5/6] Setting up new location..." -ForegroundColor Cyan
Set-Location $targetDir
Write-Host "  [OK] Changed directory to $targetDir" -ForegroundColor Green

Write-Host ""
Write-Host "[6/6] Installing dependencies..." -ForegroundColor Cyan
Write-Host "  Running: pnpm install" -ForegroundColor Gray
pnpm install --silent
Write-Host "  [OK] Dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
Write-Host " Migration Complete!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your project has been moved to: $targetDir" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Close your current terminal" -ForegroundColor White
Write-Host "  2. Open a new terminal in: $targetDir" -ForegroundColor White
Write-Host "  3. Run: pnpm run dev" -ForegroundColor White
Write-Host ""
Write-Host "The old OneDrive folder will remain at:" -ForegroundColor Yellow
Write-Host "  $sourceDir" -ForegroundColor White
Write-Host "You can delete it after verifying everything works." -ForegroundColor Gray
Write-Host ""
Write-Host "Opening new location in Explorer..." -ForegroundColor Cyan
Start-Process explorer.exe $targetDir
Write-Host ""
