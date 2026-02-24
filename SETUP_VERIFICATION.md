# Backend-Frontend Integration Setup & Verification Guide

## 🎯 Overview

This guide helps you verify that the backend, frontend, and ML model are properly integrated and working together.

## 📋 Quick Status Check

Run the integration test:

```bash
python test_integration.py
```

This will check:
- ✓ Python version
- ✓ Backend dependencies
- ✓ Model file exists
- ✓ Backend imports work
- ✓ Model predictions work
- ✓ Frontend configuration
- ✓ Frontend dependencies
- ✓ Backend API (if running)

---

## 🔧 Step-by-Step Setup

### 1. Backend Setup

#### Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

Required packages:
- fastapi==0.104.1
- uvicorn==0.24.0
- scikit-learn==1.3.2
- joblib==1.3.2
- pandas==2.1.4
- numpy==1.26.2
- shap==0.44.0
- pydantic==2.5.2

#### Train the Model (if needed)

```bash
cd backend
python train_model.py
```

This creates: `backend/app/models/outbreak_model.pkl`

#### Start the Backend

```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Expected output:
```
Startup complete — model loaded, DB initialized, SHAP ready.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

#### Verify Backend is Running

Open browser: http://localhost:8000/docs

You should see the FastAPI Swagger documentation.

Test the health endpoint:
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "operational",
  "model_version": "v2.1.4",
  "active_districts": 24,
  "last_sync": "2026-02-24T..."
}
```

---

### 2. Frontend Setup

#### Install Node Dependencies

```bash
cd frontend-react
npm install
```

#### Start the Frontend

```bash