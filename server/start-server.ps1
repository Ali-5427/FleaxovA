# ========================================
# FleaxovA Server Startup Script
# ========================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Starting FleaxovA Backend Server" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Kill any existing node processes on port 5000
Write-Host "Checking for existing processes on port 5000..." -ForegroundColor Yellow
$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1

if ($process) {
    Write-Host "Found process $process on port 5000. Stopping it..." -ForegroundColor Yellow
    try {
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        Write-Host "Process stopped successfully!`n" -ForegroundColor Green
    } catch {
        Write-Host "Could not stop process. You may need to close it manually.`n" -ForegroundColor Red
    }
} else {
    Write-Host "Port 5000 is free!`n" -ForegroundColor Green
}

# Navigate to server directory
Set-Location -Path $PSScriptRoot

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Start the server
Write-Host "Starting server on port 5000...`n" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Server logs:" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

node src/server.js
