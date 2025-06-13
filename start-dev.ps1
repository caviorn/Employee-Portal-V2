# Start server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd h:\EPortal2\server; $env:PORT=5000; npm run dev"

# Start client
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd h:\EPortal2\client; npm start"
