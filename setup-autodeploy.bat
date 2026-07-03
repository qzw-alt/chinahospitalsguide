@echo off
echo ============================================
echo   Setting up AUTOMATIC deployment
echo   Will check for changes every 30 minutes
echo ============================================

REM Create a scheduled task that runs every 30 minutes
schtasks /create /tn "ChinaHospitalsGuide-AutoDeploy" /tr ""%~dp0auto-deploy.bat"" /sc minute /mo 30 /rl highest /f

if errorlevel 1 (
    echo.
    echo FAILED to create task. Try running as Administrator.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   SUCCESS! Auto-deploy is now active.
echo ============================================
echo.
echo From now on:
echo   - Every 30 min, if there are local changes:
echo     - They will be auto-committed
echo     - They will be auto-pushed to GitHub
echo     - GitHub Pagesn edit files freely - they deploy themselves!
echo.
echo To remove auto-deploy: run remove-autodeploy.bat
pause
