@echo off
echo ============================================
echo Backend Setup Script
echo ============================================
echo.

echo [1/3] Installing Python dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo [2/3] Checking if model exists...
if exist "app\models\outbreak_model.pkl" (
    echo Model file found!
) else (
    echo Model not found. Training model...
    python train_model.py
    if %errorlevel% neq 0 (
        echo ERROR: Failed to train model
        pause
        exit /b 1
    )
)
echo.

echo [3/3] Testing backend...
python -c "from app.services.model_service import load_model; load_model(); print('Backend test successful!')"
if %errorlevel% neq 0 (
    echo ERROR: Backend test failed
    pause
    exit /b 1
)
echo.

echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo To start the backend:
echo   cd backend
echo   python -m uvicorn app.main:app --reload
echo.
echo To verify everything:
echo   python test_integration.py
echo.
pause
