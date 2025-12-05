@echo off
echo ========================================
echo   Deploy ke Render.com
echo ========================================
echo.
echo Langkah-langkah:
echo.
echo 1. Push ke GitHub dulu:
echo    git init
echo    git add .
echo    git commit -m "Deploy to Render"
echo    git branch -M main
echo    git remote add origin YOUR_GITHUB_URL
echo    git push -u origin main
echo.
echo 2. Buka https://render.com
echo 3. Sign up dengan GitHub
echo 4. New + ^> Web Service
echo 5. Connect repository
echo 6. Set environment variables:
echo    - DISCORD_TOKEN
echo    - CLIENT_ID
echo    - GUILD_ID
echo    - LOG_CHANNEL_ID
echo    - VOUCH_CHANNEL_ID
echo    - APP_URL
echo.
echo 7. Deploy!
echo.
pause
