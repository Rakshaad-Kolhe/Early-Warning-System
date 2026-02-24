# 🔗 Backend-Frontend Integration Guide

## 🎯 Quick Start (3 Steps)

### Option A: Automated Setup (Windows)

```bash
# 1. Setup backend
setup_backend.bat

# 2. Start everything
start_system.bat

# 3. Open browser
http://localhost:3000
```

### Option B: Manual Setup

```bash
# 1. Install backend dependencies
cd backend
pip install -r requirements.txt

# 2. Start backend (Terminal 1)
cd backend
python -m uvicorn app.main:app --reload

# 3. Start frontend (Terminal 2)
cd frontend-react
npm run dev

# 4. Open browser
http://localhost:3000
```

---

## 📊 Current System Status

Run this to check everything:

```bash
python test_integration.py
```

### What It Checks

✅ Python version (3.8+)  
✅ Backend dependencies installed  
✅ Model file exists  
✅ Backend can import modules  
✅ Model can make predictions  
✅ Frontend configuration  
✅ Frontend dependencies  
✅ Backend API running (optional)

---

## 🔧 System Architecture

### Current Setup

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                         │
│                 http://localhost:3000                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              React Frontend (Vite)                      │
│                                                         │
│  ┌──────────────────┐      ┌──────────────────┐       │
│  │  PredictionPage  │      │  Hardcoded       │       │
│  │                  │◄────►│  Predictor       │       │
│  └────────┬─────────┘      └──────────────────┘       │
│           │                                             │
│           │ /api/predict                                │
│           ▼                                             │
│  ┌──────────────────┐                                  │
│  │  API Client      │                                  │
│  │  (client.js)     │                                  │
│  └────────┬─────────┘                                  │
└───────────┼─────────────────────────────────────────────┘
            │
            │ Vite Proxy: /api → http://localhost:8000
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│              FastAPI Backend                            │
│              http://localhost:8000                      │
│                                                         │
│  ┌──────────────────┐      ┌──────────────────┐       │
│  │  /predict        │      │  Model Service   │       │
│  │  (POST)          │─────►│  (ML Model)      │       │
│  └──────────────────┘      └──────────────────┘       │
│                                                         │
│  ┌──────────────────┐      ┌──────────────────┐       │
│  │  /health         │      │  SHAP Explainer  │       │
│  │  (GET)           │      │  (Explain)       │       │
│  └──────────────────┘      └──────────────────┘       │
│                                                         │
│  ┌──────────────────┐      ┌──────────────────┐       │
│  │  /alerts         │      │  SQLite DB       │       │
│  │  (GET)           │─────►│  (Audit Log)     │       │
│  └──────────────────┘      └──────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Two Operating Modes

### Mode 1: Standalone (Hardcoded Predictor)

**When to use:** Demo, training, no backend needed

**How it works:**
- Frontend uses `hardcodedPredictor.js`
- Rule-based calculations
- No network calls
- Instant results
- Works offline

**Advantages:**
- ✅ No backend setup required
- ✅ Fast and reliable
- ✅ Perfect for demos
- ✅ No dependencies

**Limitations:**
- ❌ Fixed algorithm
- ❌ No real ML model
- ❌ No database logging
- ❌ No SHAP explanations

### Mode 2: Full Stack (Backend API)

**When to use:** Production, real predictions, full features

**How it works:**
- Frontend calls `/api/predict`
- Backend runs ML model
- SHAP generates explanations
- Results logged to database
- Full uncertainty quantification

**Advantages:**
- ✅ Real ML predictions
- ✅ SHAP explanations
- ✅ Database audit trail
- ✅ Model drift detection
- ✅ Uncertainty quantification

**Requirements:**
- ✅ Backend running
- ✅ Dependencies installed
- ✅ Model trained

---

## 🎛️ Switching Between Modes

### In the UI

1. Open http://localhost:3000
2. Click "🎯 Prediction System"
3. Look for "Prediction Source" toggle
4. Check/uncheck "Use Backend API"

### Automatic Fallback

If backend is unavailable:
- Frontend automatically uses hardcoded predictor
- Shows warning message
- Results still display correctly

---

## 📝 API Endpoints

### Backend Endpoints

#### POST /predict

**Request:**
```json
{
  "district": "Pune",
  "rainfall_dev": 15.0,
  "temperature": 28.0,
  "case_growth": 12.0,
  "baseline": 45.0
}
```

**Response:**
```json
{
  "district": "Pune",
  "raw_score": 42,
  "calibrated_score": 47,
  "category": "MEDIUM",
  "confidence": 78,
  "top_contributors": [
    {
      "feature": "case_growth",
      "value": 12.0,
      "impact": 0.25
    }
  ],
  "response": {
    "teams": 3,
    "deadline": "48 hours",
    "authority": "District Epidemiology Officer"
  },
  "timestamp": "2026-02-24T10:30:00",
  "uncertainty": 0.15,
  "drift_status": "stable",
  "recommended_resources": {
    "beds": 120,
    "icu": 15,
    "ventilators": 8
  }
}
```

#### GET /health

**Response:**
```json
{
  "status": "operational",
  "model_version": "v2.1.4",
  "active_districts": 24,
  "last_sync": "2026-02-24T10:30:00"
}
```

#### GET /alerts

**Response:**
```json
[
  {
    "id": 1,
    "district": "Pune",
    "score": 47,
    "category": "MEDIUM",
    "confidence": 78,
    "timestamp": "2026-02-24T10:30:00"
  }
]
```

---

## 🧪 Testing

### Test Backend Directly

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test prediction endpoint
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

### Test Frontend Integration

1. Open http://localhost:3000
2. Open browser DevTools (F12)
3. Go to Network tab
4. Enable "Use Backend API"
5. Click "Run Prediction"
6. Check Network tab for `/api/predict` call

### Run Integration Tests

```bash
python test_integration.py
```

---

## 🐛 Common Issues & Solutions

### Issue: "ModuleNotFoundError: No module named 'joblib'"

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

### Issue: "Backend not running"

**Solution:**
```bash
cd backend
python -m uvicorn app.main:app --reload
```

### Issue: "Model file not found"

**Solution:**
```bash
cd backend
python train_model.py
```

### Issue: "CORS error"

**Check:** Backend CORS is already configured for all origins
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    ...
)
```

### Issue: "Port 8000 already in use"

**Solution:**
```bash
# Find and kill process
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use different port
python -m uvicorn app.main:app --port 8001
```

### Issue: "Frontend shows 'Backend not running'"

**Check:**
1. Is backend actually running? `curl http://localhost:8000/health`
2. Is it on port 8000?
3. Check vite.config.js proxy settings
4. Restart frontend: `npm run dev`

---

## 📦 Dependencies

### Backend (Python)

```
fastapi==0.104.1       # Web framework
uvicorn==0.24.0        # ASGI server
scikit-learn==1.3.2    # ML model
joblib==1.3.2          # Model serialization
pandas==2.1.4          # Data handling
numpy==1.26.2          # Numerical computing
shap==0.44.0           # Explainability
pydantic==2.5.2        # Data validation
```

### Frontend (Node.js)

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.x",
  "framer-motion": "^10.x",
  "react-simple-maps": "^3.x"
}
```

---

## 🚀 Deployment

### Development

```bash
# Backend
cd backend
python -m uvicorn app.main:app --reload

# Frontend
cd frontend-react
npm run dev
```

### Production

```bash
# Backend
cd backend
pip install -r requirements.txt
python train_model.py
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker

# Frontend
cd frontend-react
npm run build
# Serve dist/ with nginx or similar
```

### Docker

```bash
docker-compose up --build
```

---

## 📊 Performance

### Backend
- Startup time: 2-5 seconds (model loading)
- Prediction latency: 50-200ms
- SHAP explanation: 100-300ms
- Total response: 200-500ms

### Frontend
- Initial load: 1-3 seconds
- Hardcoded prediction: 800ms (simulated)
- Backend prediction: 200-500ms + network
- UI rendering: <100ms

---

## 🔐 Security

### Development
- CORS: Allow all origins
- Auth: None
- HTTPS: Not required

### Production
- CORS: Restrict to specific domains
- Auth: Add JWT or API keys
- HTTPS: Required
- Rate limiting: Recommended
- Input validation: Already implemented (Pydantic)

---

## 📈 Monitoring

### Backend Logs

```bash
# View logs
cd backend
python -m uvicorn app.main:app --log-level debug
```

### Database Audit Trail

```bash
# View alerts
curl http://localhost:8000/alerts

# Or check SQLite directly
sqlite3 backend/app/database/alerts.db
SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 10;
```

### Frontend Console

Open DevTools (F12) → Console tab
- Network requests
- Prediction results
- Error messages

---

## 🎯 Next Steps

1. ✅ Run `python test_integration.py`
2. ✅ Fix any failing tests
3. ✅ Run `setup_backend.bat` (Windows) or install manually
4. ✅ Run `start_system.bat` or start manually
5. ✅ Open http://localhost:3000
6. ✅ Test both modes (hardcoded and backend)
7. ✅ Review results
8. ✅ Deploy to production (optional)

---

## 📚 Additional Resources

- [SETUP_VERIFICATION.md](SETUP_VERIFICATION.md) - Detailed verification guide
- [README.md](README.md) - Project overview
- [QUICKSTART.md](DOCS/QUICKSTART.md) - Quick start guide
- [SYSTEM_ARCHITECTURE.md](DOCS/SYSTEM_ARCHITECTURE.md) - Technical details

---

## ✅ Success Checklist

- [ ] Backend dependencies installed
- [ ] Model file exists
- [ ] Backend starts without errors
- [ ] Frontend dependencies installed
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can toggle between modes
- [ ] Predictions work in both modes
- [ ] No console errors
- [ ] Integration test passes

---

**Version:** 2.1.4  
**Last Updated:** February 2026  
**Status:** Production Ready
