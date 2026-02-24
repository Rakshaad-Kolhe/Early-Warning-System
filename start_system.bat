@echo off
echo ============================================
echo Starting Early Warning System
echo ============================================
echo.

echo Checking if backend dependencies are installed...
python -c "import fastapi, uvicorn, sklearn, joblib, pandas, shap" 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Backend dependencies not installed!
    echo Please run: setup_backend.bat
    echo.
    pause
    exit /b 1
)

echo Starting backend server...
start "Backend Server" cmd /k "cd backend && python -m uvicorn app.main:app --reload"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting frontend server...
start "Frontend Server" cmd /k "cd frontend-react && npm run dev"

echo.
echo ============================================
echo System Started!
echo ============================================
echo.
echo Backend:  http://localhost:8000/docs
echo Frontend: http://localhost:3000
echo.
echo Press any key to stop all servers...
pause >nul

echo.
echo Stopping servers...
taskkill /FI "WindowTitle eq Backend Server*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq Frontend Server*" /T /F >nul 2>&1

echo Servers stopped.
pause
