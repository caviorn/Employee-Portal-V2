Write-Host "Stopping any running node processes..."
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Removing old database..."
Remove-Item -Path "h:\EPortal2\server\employees.db" -ErrorAction SilentlyContinue

Write-Host "Installing dependencies..."
Set-Location "h:\EPortal2"
npm run install-all

Write-Host "Initializing database..."
Set-Location "h:\EPortal2\server"
npm run init-db

Write-Host "Starting development servers..."
Set-Location "h:\EPortal2"
npm run dev
