while ($true) {
    Write-Host "Running 5-minute Auto-Backup Sequence..." -ForegroundColor Cyan
    git add .
    git commit -m "Auto-backup $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git push -u origin main
    
    Write-Host "Pushed! Waiting exactly 5 minutes (300 seconds) for the next synchronization..." -ForegroundColor Green
    Start-Sleep -Seconds 300
}
