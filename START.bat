@echo off
color 0A
title NotFlix Ultra - Server

echo.
echo  ███╗   ██╗ ██████╗ ████████╗███████╗██╗     ██╗██╗  ██╗
echo  ████╗  ██║██╔═══██╗╚══██╔══╝██╔════╝██║     ██║╚██╗██╔╝
echo  ██╔██╗ ██║██║   ██║   ██║   █████╗  ██║     ██║ ╚███╔╝ 
echo  ██║╚██╗██║██║   ██║   ██║   ██╔══╝  ██║     ██║ ██╔██╗ 
echo  ██║ ╚████║╚██████╔╝   ██║   ██║     ███████╗██║██╔╝ ██╗
echo  ╚═╝  ╚═══╝ ╚═════╝    ╚═╝   ╚═╝     ╚══════╝╚═╝╚═╝  ╚═╝
echo.
echo  --------------------------------------------------------------------------------
echo   NotFlix Ultra Server v2.0
echo  --------------------------------------------------------------------------------
echo.

REM Check if .env exists
if not exist ".env" (
    echo [ERROR] .env file not found!
    echo Please run SETUP-ENV.bat first
    pause
    exit
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo [ERROR] Dependencies not installed!
    echo Run: npm install
    pause
    exit
)

echo [+] Starting server...
echo [+] Server will run on http://localhost:5000
echo [+] Opening browser in 3 seconds...
echo.
timeout /t 3 /nobreak >nul

REM Open browser
start http://localhost:5000

echo.
echo --------------------------------------------------------------------------------
echo  SERVER RUNNING
echo  Keep this window open
echo  Press Ctrl+C to stop the server
echo --------------------------------------------------------------------------------
echo.

REM Start Node.js server
node backend/server.js

pause