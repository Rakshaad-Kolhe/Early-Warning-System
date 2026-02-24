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
cd frontend-react
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

#### Open the Application

Browser: http://localhost:3000

---

## 🧪 Testing the Integration

### Test 1: Backend API Direct Test

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "district": "Pune",
    "rainfall_dev": 15,
    "temperature": 28,
    "case_growth": 12,
    "baseline": 45
  }'
```

Expected response:
```json
{
  "district": "Pune",
  "raw_score": 42,
  "calibrated_score": 47,
  "category": "MEDIUM",
  "confidence": 78,
  "top_contributors": [...],
  "response": {...},
  "timestamp": "2026-02-24T...",
  "uncertainty": 0.15,
  "drift_status": "stable",
  "recommended_resources": {...}
}
```

### Test 2: Frontend with Backend

1. Open http://localhost:3000
2. Click "🎯 Prediction System"
3. Check the "Use Backend API" checkbox
4. Should show "✓ Available" in green
5. Click "Run Prediction"
6. Should see results with source: "backend-api"

### Test 3: Frontend Standalone (Hardcoded)

1. Stop the backend (Ctrl+C)
2. Refresh the frontend
3. Uncheck "Use Backend API" (or it will be disabled)
4. Click "Run Prediction"
5. Should see results with source: "hardcoded"

---

## 🔍 Verification Checklist

### Backend Verification

- [ ] Python 3.8+ installed
- [ ] All dependencies installed (`pip list`)
- [ ] Model file exists: `backend/app/models/outbreak_model.pkl`
- [ ] Backend starts without errors
- [ ] `/health` endpoint returns 200
- [ ] `/predict` endpoint accepts POST requests
- [ ] Predictions return valid JSON

### Frontend Verification

- [ ] Node.js installed
- [ ] Dependencies installed (`node_modules` exists)
- [ ] Vite config has proxy to port 8000
- [ ] API client exists: `src/api/client.js`
- [ ] Frontend starts on port 3000
- [ ] Can access http://localhost:3000
- [ ] Prediction page loads

### Integration Verification

- [ ] Frontend can detect backend availability
- [ ] Backend toggle shows "✓ Available" when backend is running
- [ ] Predictions work with backend API
- [ ] Predictions work with hardcoded fallback
- [ ] Error messages display correctly
- [ ] Results display properly

---

## 🐛 Troubleshooting

### Backend Issues

#### "ModuleNotFoundError: No module named 'fastapi'"

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

#### "Model not loaded. Call load_model() first."

**Solution:**
```bash
cd backend
python train_model.py
```

#### "Address already in use"

**Solution:**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or use a different port
python -m uvicorn app.main:app --port 8001
```

#### CORS Errors

The backend already has CORS configured:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

If still having issues, check browser console for specific errors.

### Frontend Issues

#### "Cannot GET /api/predict"

**Cause:** Backend not running or proxy not configured

**Solution:**
1. Start backend: `cd backend && python -m uvicorn app.main:app --reload`
2. Check vite.config.js has proxy configuration
3. Restart frontend: `npm run dev`

#### "Failed to fetch"

**Cause:** Backend not accessible

**Solution:**
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check browser console for specific error
3. Try using hardcoded predictor instead

#### Blank Page

**Solution:**
1. Check browser console for errors
2. Clear browser cache
3. Rebuild: `npm run build && npm run dev`

---

## 🔄 Data Flow

### With Backend API

```
User Input (Frontend)
    ↓
InputPanel Component
    ↓
fetchPrediction() in client.js
    ↓
Vite Proxy (/api → localhost:8000)
    ↓
FastAPI Backend (/predict)
    ↓
Model Service (ML prediction)
    ↓
Risk Service (classification)
    ↓
Threshold Service (calibration)
    ↓
Explain Service (SHAP)
    ↓
Response Service (recommendations)
    ↓
JSON Response
    ↓
Frontend Components (display)
```

### With Hardcoded Predictor

```
User Input (Frontend)
    ↓
InputPanel Component
    ↓
predictOutbreak() in hardcodedPredictor.js
    ↓
Rule-based calculation
    ↓
JSON Response
    ↓
Frontend Components (display)
```

---

## 📊 Expected Behavior

### Backend Response Format

```javascript
{
  district: "Pune",
  raw_score: 42,
  calibrated_score: 47,
  category: "MEDIUM",
  confidence: 78,
  top_contributors: [
    { feature: "case_growth", value: 12, impact: 0.25 },
    { feature: "rainfall_dev", value: 15, impact: 0.18 },
    { feature: "temperature", value: 28, impact: 0.12 },
    { feature: "baseline", value: 45, impact: 0.08 }
  ],
  response: {
    teams: 3,
    deadline: "48 hours",
    authority: "District Epidemiology Officer",
    actions: [...]
  },
  timestamp: "2026-02-24T10:30:00",
  uncertainty: 0.15,
  drift_status: "stable",
  recommended_resources: {
    beds: 120,
    icu: 15,
    ventilators: 8,
    teams: 3
  }
}
```

### Hardcoded Response Format

```javascript
{
  score: 47,
  category: "MEDIUM",
  confidence: 78,
  contributors: [...],
  response: {...},
  timestamp: "2026-02-24T10:30:00",
  uncertainty: 0.15,
  drift_status: "stable",
  resources: {...},
  source: "hardcoded"
}
```

---

## 🚀 Production Deployment

### Using Docker Compose

```bash
docker-compose up --build
```

This starts:
- Backend on port 8000
- Frontend on port 3000
- Shared volume for database

### Manual Production Build

#### Backend
```bash
cd backend
pip install -r requirements.txt
python train_model.py
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### Frontend
```bash
cd frontend-react
npm install
npm run build
# Serve the dist folder with nginx or similar
```

---

## 📈 Performance Expectations

### Backend
- Model loading: ~2-5 seconds on startup
- Prediction latency: 50-200ms
- SHAP explanation: 100-300ms
- Total response time: 200-500ms

### Frontend
- Initial load: 1-3 seconds
- Hardcoded prediction: 800ms (simulated delay)
- Backend prediction: 200-500ms + network
- UI rendering: <100ms

---

## 🔐 Security Notes

### Development
- CORS is wide open (`allow_origins=["*"]`)
- No authentication required
- Suitable for local development only

### Production
- Restrict CORS to specific origins
- Add authentication (JWT, API keys)
- Use HTTPS
- Rate limiting
- Input validation (already implemented with Pydantic)

---

## 📝 Next Steps

1. ✅ Run `python test_integration.py`
2. ✅ Fix any failing tests
3. ✅ Start backend
4. ✅ Start frontend
5. ✅ Test with backend API
6. ✅ Test with hardcoded fallback
7. ✅ Review results
8. ✅ Deploy to production (optional)

---

## 🎯 Success Criteria

Your system is working correctly when:

1. ✓ Integration test passes all checks
2. ✓ Backend starts without errors
3. ✓ Frontend loads at http://localhost:3000
4. ✓ Backend toggle shows "✓ Available"
5. ✓ Predictions work with both modes
6. ✓ Results display correctly
7. ✓ No console errors
8. ✓ Smooth user experience

---

## 📞 Support

If you encounter issues:

1. Run `python test_integration.py` for diagnostics
2. Check browser console for errors
3. Check backend logs for errors
4. Review this guide's troubleshooting section
5. Verify all dependencies are installed
6. Try the hardcoded mode first to isolate issues

---

**Version:** 2.1.4  
**Last Updated:** February 2026  
**Status:** Production Ready
