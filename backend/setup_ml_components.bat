@echo off
echo ============================================================
echo   ML Components Setup - Scraper and Pretrained Model
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/4] Installing required packages...
pip install aiohttp beautifulsoup4 lxml sqlalchemy python-multipart
if errorlevel 1 (
    echo ERROR: Failed to install packages
    pause
    exit /b 1
)
echo.

echo [2/4] Creating models directory...
if not exist "app\models" mkdir app\models
echo Models directory ready.
echo.

echo [3/4] Training pretrained model...
python train_pretrained_model.py
if errorlevel 1 (
    echo ERROR: Model training failed
    pause
    exit /b 1
)
echo.

echo [4/4] Testing scraper...
python -c "from app.scraper import HealthDataScraper; scraper = HealthDataScraper(); print('Scraper initialized successfully')"
if errorlevel 1 (
    echo ERROR: Scraper test failed
    pause
    exit /b 1
)
echo.

echo ============================================================
echo   Setup Complete!
echo ============================================================
echo.
echo The following components are now ready:
echo   - Web scraper for health data
echo   - Pretrained ML model for outbreak prediction
echo   - Database models for storing data
echo   - API routes for scraper and predictions
echo.
echo You can now start the backend server with:
echo   uvicorn app.main:app --reload --port 8000
echo.
pause
