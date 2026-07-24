@echo off

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do taskkill /F /PID %%a

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /F /PID %%a

exit