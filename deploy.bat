@echo off
chcp 65001 >nul
setlocal

cd /d "%~dp0"

echo ============================================
echo   China Hospitals Guide - One-Click Deploy
echo ============================================
echo.

echo [1/4] Checking git status...
git status --short
echo.

echo [2/4] Adding all changes...
git add -A

echo.
echo [3/4] Creating commit (if there are changes)...
for /f "delims=" %%i in ('git status --porcelain') do set HAS_CHANGES=1
if defined HAS_CHANGES (
    set /p MSG="Enter commit message (or press Enter for auto): "
    if "%MSG%"=="" set MSG=auto: deploy %date% %time%
    git commit -m "%MSG%"
) else (
    echo No changes to commit.
)
echo.

echo [4/4] Pushing to GitHub via SSH...
git push origin main
if errorlevel 1 (
    echo.
    echo ============================================
    echo   PUSH FAILED
    echo ============================================
    echo Possible reasons:
    echo   1. SSH key not added to GitHub (https://github.com/settings/keys)
    echo   2. No network access to github.com (try a proxy)
    echo   3. ssh-agent not running (run: eval $(ssh-agent -s) ^&^& ssh-add ~/.ssh/id_ed25519)
    pause
    exit /b 1
)

echo.
echo ============================================
echo   DEPLOY SUCCESSFUL!
echo ============================================
echo GitHub: https://github.com/qzw-alt/chinahospitalsguide
echo Live site (after GitHub Pages build, ~1-3 min): https://chinahospitalsguide.com
echo.
pause
