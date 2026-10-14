@echo off
cd /d "%~dp0"
if not exist node_modules (
 echo First run pnpm install --frozen-lockfile and setup-local.bat.
 pause
 exit /b 1
)
call pnpm run dev
pause
