@echo off
echo Removing ChinaHospitalsGuide-AutoDeploy scheduled task...
schtasks /delete /tn "ChinaHospitalsGuide-AutoDeploy" /f
if errorlevel 1 (
    echo Task was not installed or could not be removed.
) else (
    echo Task removed successfully.
)
pause
