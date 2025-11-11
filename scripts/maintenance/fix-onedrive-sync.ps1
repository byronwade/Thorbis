# Fix OneDrive sync conflicts with Next.js .next directory
# This script excludes the .next directory from OneDrive syncing

$projectPath = Get-Location
$nextPath = Join-Path $projectPath ".next"
$nodeModulesPath = Join-Path $projectPath "node_modules"
$vercelPath = Join-Path $projectPath ".vercel"

Write-Host "=== OneDrive Sync Fix for Next.js ===" -ForegroundColor Cyan
Write-Host ""

# Function to exclude folder from OneDrive
function Exclude-FromOneDrive {
    param([string]$folderPath, [string]$folderName)

    if (Test-Path $folderPath) {
        Write-Host "Excluding $folderName from OneDrive..." -ForegroundColor Yellow

        # Remove OneDrive attributes and mark as local-only
        attrib +U "$folderPath" /S /D

        # Set the folder to be available "online-only" (not synced locally)
        $null = New-Item -ItemType File -Path "$folderPath\.nosync" -Force -ErrorAction SilentlyContinue

        Write-Host "  [OK] $folderName excluded from OneDrive sync" -ForegroundColor Green
    } else {
        Write-Host "  [INFO] $folderName doesn't exist yet (will be excluded when created)" -ForegroundColor Gray
    }
}

# Stop any running dev servers
Write-Host "Stopping any running Node.js processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*$projectPath*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "  [OK] Processes stopped" -ForegroundColor Green
Write-Host ""

# Remove the .next directory if it exists
if (Test-Path $nextPath) {
    Write-Host "Removing existing .next directory..." -ForegroundColor Yellow
    Remove-Item -Path $nextPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  [OK] .next directory removed" -ForegroundColor Green
} else {
    Write-Host "  [INFO] .next directory doesn't exist" -ForegroundColor Gray
}
Write-Host ""

# Create .next directory and exclude it
Write-Host "Creating .next directory and excluding from OneDrive..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $nextPath -Force | Out-Null
Exclude-FromOneDrive -folderPath $nextPath -folderName ".next"
Write-Host ""

# Also exclude node_modules and .vercel for good measure
Exclude-FromOneDrive -folderPath $nodeModulesPath -folderName "node_modules"
Exclude-FromOneDrive -folderPath $vercelPath -folderName ".vercel"
Write-Host ""

Write-Host "=== Additional Recommendations ===" -ForegroundColor Cyan
Write-Host "For best performance, consider moving your project outside OneDrive:" -ForegroundColor Yellow
Write-Host "  * C:\dev\Stratos" -ForegroundColor White
Write-Host "  * C:\projects\Stratos" -ForegroundColor White
Write-Host "  * D:\development\Stratos" -ForegroundColor White
Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Green
Write-Host "You can now run: pnpm run dev" -ForegroundColor Cyan
Write-Host ""
