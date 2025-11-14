# Clean Next.js build artifacts
# Use this when experiencing EPERM errors

$projectPath = "C:\Users\bcw19\OneDrive\Desktop\Thorbis"

Write-Host "Cleaning Next.js build artifacts..." -ForegroundColor Yellow

# Navigate to project directory
Set-Location $projectPath

# Stop any running processes that might be locking files
Write-Host "Checking for running Node processes..." -ForegroundColor Cyan
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Found $($nodeProcesses.Count) Node.js process(es). Please stop your dev server first." -ForegroundColor Red
    Write-Host "Press Ctrl+C in your terminal running 'pnpm dev'" -ForegroundColor Yellow
    exit 1
}

# Remove .next directory
if (Test-Path ".next") {
    Write-Host "Removing .next directory..." -ForegroundColor Cyan
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host ".next directory removed." -ForegroundColor Green
}

# Remove other cache directories
if (Test-Path "node_modules\.cache") {
    Write-Host "Removing node_modules cache..." -ForegroundColor Cyan
    Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Cache removed." -ForegroundColor Green
}

Write-Host ""
Write-Host "Clean completed successfully!" -ForegroundColor Green
Write-Host "You can now run 'pnpm dev'" -ForegroundColor Cyan
Write-Host ""
Write-Host "If you continue to experience EPERM errors:" -ForegroundColor Yellow
Write-Host "1. Run './scripts/fix-onedrive-sync.ps1' to exclude .next from OneDrive" -ForegroundColor Cyan
Write-Host "2. Or move your project outside of OneDrive (recommended)" -ForegroundColor Cyan
