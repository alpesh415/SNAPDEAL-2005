@echo off
cd /d "%~dp0backend"
call npm install
cd /d "%~dp0frontend\frontend"
call npm install
echo.
echo Install complete. Ab start-backend.bat aur start-frontend.bat chalayein.
pause
