@echo off
chcp 65001 >nul
cd /d "%~dp0"

REM Check if there are changes to commit
for /f "delims=" %%i in ('git status --porcelain') do set HAS_CHANGES=1
if not defined HAS_CHANGES (
    REM No changes, exit silently (won't even create a window)
    exit /b 0
)

REM There are changes - commit with auto message and push
git add -A
git commit -m "auto: %date% %time% - automated deploy"
git push origin main
exit /b %errorlevel%
