# ✅ Backend-Frontend Integration Verification Checklist

## 🎯 Quick Verification

Run this command to check everything:

```bash
python test_integration.py
```

---

## 📋 Manual Verification Steps

### 1. Backend Setup ✓

#### Check Python Version
```bash
python --version
```
Expected: Python 3.8 or higher

#### Check Backend Dependencies
```bash
cd backend
python -c "import fastapi, uvicorn, sklearn, joblib, pandas, shap; print('All dependencies installed')"
```

If this fails:
```bash
pip install -r requirements.txt
```

#### Check Model File
```bash
dir backend\app\models\outbreak_model.pkl
```
Expected: File exists (~1 MB)

If missing:
```bash
cd backend
python train_model.py
```

#### Test Model Loading
```bash
cd backend
python -c "from app.services.model_service import load_model; load_model(); print('Model loaded successfully')"
```

#### Test Prediction
```bash
cd backend
python -c "from app.services.model_service import load_model, predict_probability; load_model(); prob = predict_probability({'rainfall_dev': 15, 'temperature': 28, 'case_growth': 12, 'baseline': 45}); print(f'Prediction: {prob}')"
```

---

### 2. Backend Server ✓

#### Start Backend
```bash
cd backend
python -m uvicorn app.main:app --reload
```

Expected output:
```
Startup complete — model loaded, DB initialized, SHAP ready.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

#### Test Health Endpoint
Open browser: http://localhost:8000/health

Or use curl:
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

#### Test API Documentation
Open browser: http://localhost:8000/docs

Should see FastAPI Swagger UI

#### Test Prediction Endpoint
```bash
curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" -d "{\"district\":\"Pune\",\"rainfall_dev\":15,\"temperature\":28,\"case_growth\":12,\"baseline\":45}"
```

Expected: JSON response with prediction results

---

### 3. Frontend Setup ✓

#### Check Node.js
```bash
node --version
npm --version
```

#### Check Frontend Dependencies
```bash
cd frontend-react
dir node_modules
```

If missing:
```bash
npm install
```

#### Check Vite Config
```bash
type frontend-react\vite.config.js
```

Should contain:
```javascript
proxy: {
    '/api': {
        target: 'http://localhost:8000',
        ...
    }
}
```

#### Check API Client
```bash
type frontend-react\src\api\client.js
```

Should contain `fetchPrediction`, `fetchAlerts`, `fetchHealth` functions

---

### 4. Frontend Server ✓

#### Start Frontend
```bash
cd frontend-react
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

#### Open Application
Browser: http://localhost:3000

Should see the main dashboard

#### Navigate to Prediction Page
Click: "🎯 Prediction System"

Should see the prediction interface

---

### 5. Integration Testing ✓

#### Test Backend Detection

With backend running:
- Look for "Prediction Source" section
- Should show "✓ Available" in green
- "Use Backend API" checkbox should be enabled

Without backend running:
- Should show "(Backend not running)" in red
- "Use Backend API" checkbox should be disabled

#### Test Hardcoded Mode

1. Uncheck "Use Backend API" (or stop backend)
2. Enter test values:
   - District: Pune
   - Rainfall: 15
   - Temperature: 28
   - Case Growth: 12
   - Baseline: 45
3. Click "Run Prediction"
4. Should see results in ~800ms
5. Check source indicator: "Source: hardcoded"

#### Test Backend Mode

1. Ensure backend is running
2. Check "Use Backend API"
3. Enter same test values
4. Click "Run Prediction"
5. Should see results in ~200-500ms
6. Check source indicator: "Source: backend-api"
7. Open browser DevTools → Network tab
8. Should see POST request to `/api/predict`

#### Test Fallback

1. Enable "Use Backend API"
2. Stop the backend server
3. Click "Run Prediction"
4. Should see error message
5. Should fallback to hardcoded predictor
6. Check source: "Source: hardcoded-fallback"

---

### 6. Results Verification ✓

#### Check Risk Score
- Should display large number (0-100)
- Color coded: Green (LOW), Yellow (MEDIUM), Red (HIGH)

#### Check Decision Triggers
- Should show threshold ladder
- Current score highlighted
- Teams, deadline, authority displayed

#### Check Confidence Panel
- Confidence percentage shown
- Uncertainty metrics displayed
- Drift status indicated

#### Check Forecast Timeline
- Graph with baseline and intervention lines
- 14-day projection
- Hover tooltips working

#### Check Resource Impact
- Beds, ICU, ventilators, teams projected
- 14-day forecast
- Capacity indicators

#### Check Governance Panel
- Administrative actions listed
- Public messaging guidance
- Escalation protocols

#### Check Contributing Factors
- Feature importance bars
- SHAP values (if backend)
- Impact percentages

#### Check Response Protocol
- Recommended actions
- Timeline
- Resources needed

#### Check Audit Trail
- Run history displayed
- Export button present
- Timestamps shown

---

### 7. Error Handling ✓

#### Test Invalid Input

Try entering:
- Temperature: 100 (should be clamped to 50)
- Rainfall: -200 (should be clamped to -100)
- Case Growth: 200 (should be clamped to 150)

Should handle gracefully with validation

#### Test Network Error

1. Enable backend mode
2. Stop backend mid-request
3. Should show error message
4. Should fallback to hardcoded

#### Test Invalid District

Try entering invalid district name
Should show validation error

---

### 8. Performance ✓

#### Backend Startup Time
- Should be < 10 seconds
- Model loading message should appear

#### Prediction Latency

Hardcoded mode:
- ~800ms (simulated delay)

Backend mode:
- 200-500ms typical
- Check Network tab for actual timing

#### UI Responsiveness
- Smooth animations
- No lag when typing
- Instant button feedback

---

### 9. Browser Compatibility ✓

Test in:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

All features should work consistently

---

### 10. Console Checks ✓

#### Backend Console

Should NOT show:
- ❌ Errors
- ❌ Warnings about missing modules
- ❌ CORS errors

Should show:
- ✅ "Startup complete — model loaded..."
- ✅ Request logs (POST /predict)
- ✅ Response status codes (200)

#### Frontend Console (F12)

Should NOT show:
- ❌ JavaScript errors
- ❌ Failed network requests (except when testing fallback)
- ❌ React warnings

Should show:
- ✅ Prediction results logged
- ✅ Network requests (when using backend)
- ✅ Component render logs (if any)

---

## 🎯 Final Verification

### All Systems Go Checklist

- [ ] Backend dependencies installed
- [ ] Model file exists
- [ ] Backend starts without errors
- [ ] Health endpoint returns 200
- [ ] Prediction endpoint works
- [ ] Frontend dependencies installed
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:3000
- [ ] Prediction page loads
- [ ] Backend detection works
- [ ] Hardcoded mode works
- [ ] Backend mode works
- [ ] Fallback works
- [ ] All panels display correctly
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Integration test passes

### Run Final Test

```bash
python test_integration.py
```

Expected output:
```
✓ PASS     Python Version
✓ PASS     Backend Dependencies
✓ PASS     Model File
✓ PASS     Backend Imports
✓ PASS     Model Prediction
✓ PASS     Frontend Config
✓ PASS     Frontend Dependencies
✓ PASS     Backend API

8/8 tests passed

✅ All tests passed! System is ready.
```

---

## 🚀 Ready for Production

If all checks pass:

1. ✅ System is fully functional
2. ✅ Backend and frontend integrated
3. ✅ Model is working
4. ✅ Both modes operational
5. ✅ Error handling in place
6. ✅ Performance acceptable
7. ✅ Ready for deployment

---

## 📝 Quick Commands Reference

### Start Everything
```bash
# Option 1: Automated (Windows)
start_system.bat

# Option 2: Manual
# Terminal 1
cd backend && python -m uvicorn app.main:app --reload

# Terminal 2
cd frontend-react && npm run dev
```

### Test Everything
```bash
python test_integration.py
```

### Stop Everything
```bash
# Ctrl+C in both terminals
# Or close the command windows
```

---

## 🐛 If Something Fails

1. Check which test failed in `test_integration.py`
2. Review the specific section above
3. Check `SETUP_VERIFICATION.md` for detailed troubleshooting
4. Review `INTEGRATION_GUIDE.md` for architecture details
5. Check `BACKEND_FRONTEND_STATUS.md` for current status

---

**Last Updated:** February 24, 2026  
**Version:** 2.1.4  
**Status:** Ready for Verification
