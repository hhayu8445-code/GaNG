@echo off
echo ========================================
echo   Starting Bot with Public Access
echo ========================================
echo.
start "Discord Bot" cmd /k "node index.js"
timeout /t 5 /nobreak >nul
start "Ngrok Tunnel" cmd /k "ngrok http 3003"
echo.
echo Bot started! Check ngrok window for public URL
echo Copy the https://xxxxx.ngrok.io URL and update config.js
echo.
pause
