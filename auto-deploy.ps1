# auto-deploy.ps1 - Silent auto-deploy
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    exit 0  # No changes, exit silently
}

try {
    git add -A | Out-Null
    $msg = "auto: " + (Get-Date -Format "yyyy-MM-dd HH:mm") + " - automated deploy"
    git commit -m $msg | Out-Null
    git push origin main | Out-Null
    exit 0
} catch {
    exit 1
}
