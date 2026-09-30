@echo off
title Quantum Guess - Number Guessing Game
echo ========================================================
echo        Starting Quantum Guess Game Server...
echo ========================================================
echo.

cd /d "%~dp0"

echo Opening browser at http://localhost:5173...
start http://localhost:5173

echo Starting Vite development server...
call npm.cmd run dev

pause
