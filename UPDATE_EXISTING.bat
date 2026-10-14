@echo off
cd /d "%~dp0"
echo Stop the old dev server with Ctrl+C before updating.
set /p kb_update_target=Existing KitchenBox-Website folder path: 
node scripts/update-local.mjs "%kb_update_target%"
if errorlevel 1 (
 echo Update failed. Do not continue; share the error.
 pause
 exit /b 1
)
pause
