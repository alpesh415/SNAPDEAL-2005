@echo off
start "Backend" cmd /k "cd /d %~dp0backend && npm start"
timeout /t 4 /nobreak >nul
start "Frontend" cmd /k "cd /d %~dp0frontend\frontend && npm run dev"
timeout /t 6 /nobreak >nul
start http://localhost:5173
