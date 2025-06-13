$serverJob = Start-Job -ScriptBlock {
    Set-Location H:\EPortal2\server
    $env:PORT=5000
    npm run dev
}

$clientJob = Start-Job -ScriptBlock {
    Set-Location H:\EPortal2\client
    npm start
}

Receive-Job -Job $serverJob -Wait
Receive-Job -Job $clientJob -Wait
