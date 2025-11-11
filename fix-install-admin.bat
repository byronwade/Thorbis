@echo off
REM Run this script as Administrator to fix installation issues
echo ========================================
echo Installation Fix Script
echo ========================================
echo.

echo Step 1: Removing node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo node_modules removed.
) else (
    echo node_modules not found.
)

echo.
echo Step 2: Clearing pnpm store cache...
call pnpm store prune

echo.
echo Step 3: Installing dependencies...
call pnpm install

echo.
echo Step 4: Verifying installation...
if exist node_modules\.bin\next.cmd (
    echo [SUCCESS] Next.js installed!
    echo.
    echo You can now run: pnpm dev
) else (
    echo [WARNING] Next.js not found. Installation may have failed.
    echo Check the error messages above.
)

echo.
pause





