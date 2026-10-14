@echo off
cd /d "%~dp0"
node scripts/setup-local.mjs
if errorlevel 1 (
 echo Setup failed. Do not continue until the error is fixed.
 pause
 exit /b 1
)
pause
