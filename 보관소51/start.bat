@echo off
echo ============================
echo   OrcaX Widget Server Start
echo ============================

cd /d %~dp0

echo - Checking .env ...
IF NOT EXIST .env (
    echo [WARNING] .env file not found.
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    echo - Port 5000 busy. Killing process (PID: %%a)...
    taskkill /PID %%a /F > nul
    echo - Done.
)

echo - Starting server...
call npm run dev

pause
