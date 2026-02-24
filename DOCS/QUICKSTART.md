# Quick Start Guide - Outbreak Prediction System

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Docker (optional, for containerized deployment)

### Installation

#### 1. Start Backend
```bash
cd backend
pip install -r requirements.txt
python train_model.py  # Train the model (if not already done)
uvicorn app.main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`

#### 2. Start Frontend
```bash
cd frontend-react
npm install
npm run dev
```

Frontend will be available at: `http://localhost:5173`

#### 3. Using Docker Compose (Alternative)
```bash
docker-compose up --build
```

Access the application at: `http://localhost:3000`

## 📊 Using the Prediction System

### Navigation
The application has two main views:
- **🎯 Prediction System**: Comprehensive decision-support interface (NEW)
- **🗺️ National Overview**: India-wide outbreak map

### Making a Prediction

1. **Select District**: Choose from 8 districts (Pune, Mumbai, Nashik, etc.)

2. **Adjust Parameters**:
   - **Rainfall Deviation**: -60 to +80 mm from normal
   - **Temperature**: 18°C to 42°C
   - **Case Growth**: -20% to +80% weekly change
   - **Baseline Cases**: 10 to 120 weekly cases

3. **Run Prediction**: Click the "RUN PREDICTION" button

4. **Review Results**: The system displays:
   - Risk score (0-100) with category (LOW/MEDIUM/HIGH)
   - Decision triggers and mandated actions
   - Confidence metrics and uncertainty
   - 14-day forecast timeline
   - Resource impact projections
   - Governance recommendations
   - Audit trail

## 🎯 Key Features

### Decision Trigger Thresholds
- **LOW (0-35)**: Routine surveillance
- **MEDIUM (36-65)**: Enhanced monitoring, 2 field teams, 48-hour deadline
- **HIGH (66-100)**: Emergency protocols, 5 field teams, 24-hour deadline

### Confidence Metrics
- Signal confidence percentage
- Model reliability score
- Forecast confidence interval (±variance)
- Out-of-distribution warnings
- Drift detection alerts

### Resource Projections (14-day)
- Hospital bed occupancy
- ICU saturation
- Medical supply depletion
- Field team requirements

### Governance Actions
- Recommended administrative actions by risk level
- Public messaging templates
- Escalation pathways
- School/travel advisories

### Audit Trail
- Complete run history
- Input parameters logged
- Decision documentation
- Export capability (JSON)

## 📋 Example Scenarios

### Scenario 1: Low Risk
```
District: Pune
Rainfall: +10mm
Temperature: 26°C
Case Growth: 5%
Baseline: 30 cases

Expected: LOW risk (20-30), routine surveillance
```

### Scenario 2: Medium Risk
```
District: Mumbai
Rainfall: +35mm
Temperature: 32°C
Case Growth: 25%
Baseline: 65 cases

Expected: MEDIUM risk (50-60), enhanced monitoring
```

### Scenario 3: High Risk
```
District: Nagpur
Rainfall: +55mm
Temperature: 38°C
Case Growth: 45%
Baseline: 95 cases

Expected: HIGH risk (75-85), emergency protocols
```

## 🔧 Troubleshooting

### Backend Issues
- **Model not found**: Run `python train_model.py` first
- **Port already in use**: Change port in `uvicorn` command
- **Import errors**: Verify all dependencies installed

### Frontend Issues
- **Blank page**: Check browser console for errors
- **API errors**: Ensure backend is running on port 8000
- **Styling issues**: Clear browser cache

### Common Errors
- **CORS errors**: Backend CORS middleware should allow all origins
- **404 on /api/predict**: Verify backend URL in `client.js`
- **Slow predictions**: Normal for first run (model loading)

## 📁 Project Structure

```
outbreak-prediction/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app
│   │   ├── routes/              # API endpoints
│   │   ├── services/            # Business logic
│   │   ├── models/              # ML model files
│   │   └── ...
│   ├── requirements.txt
│   └── train_model.py
├── frontend-react/
│   ├── src/
│   │   ├── pages/
│   │   │   └── PredictionPage.jsx    # Main prediction UI
│   │   ├── components/               # UI components
│   │   ├── api/                      # API client
│   │   ├── AppWithRouting.jsx        # Navigation
│   │   └── index.css                 # Styles
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
├── PREDICTION_FEATURES.md       # Feature documentation
└── QUICKSTART.md               # This file
```

## 🔐 Security Notes

- This is a demonstration system
- In production, implement:
  - User authentication
  - Role-based access control
  - API rate limiting
  - Input validation
  - Audit log encryption
  - HTTPS/TLS

## 📊 API Endpoints

### POST /api/predict
Predict outbreak risk for a district

**Request:**
```json
{
  "district": "Pune",
  "rainfall_dev": 15,
  "temperature": 28,
  "case_growth": 12,
  "baseline": 45
}
```

**Response:**
```json
{
  "district": "Pune",
  "raw_score": 52,
  "calibrated_score": 58,
  "category": "MEDIUM",
  "confidence": 78,
  "uncertainty": 5.2,
  "drift_status": "stable",
  "top_contributors": [...],
  "response": {...},
  "recommended_resources": {...},
  "timestamp": "2026-02-24T11:30:00"
}
```

### GET /api/alerts
Get recent alert history

### GET /api/health
Check system health status

## 🎓 Learning Resources

- **SHAP Explanations**: Understanding feature contributions
- **Confidence Intervals**: Interpreting uncertainty
- **Risk Thresholds**: Public health decision-making
- **Resource Planning**: Capacity management
- **Governance Protocols**: Administrative response

## 🤝 Contributing

To add new features:
1. Create new component in `frontend-react/src/components/`
2. Add to `PredictionPage.jsx` layout
3. Update styles in `index.css`
4. Document in `PREDICTION_FEATURES.md`

## 📞 Support

For issues or questions:
- Check `PREDICTION_FEATURES.md` for detailed feature docs
- Review component source code comments
- Verify API responses in browser DevTools
- Check backend logs for errors

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Backend responds to `/api/health`
- ✅ Frontend loads without console errors
- ✅ Predictions return in < 2 seconds
- ✅ All panels populate with data
- ✅ Audit trail records runs
- ✅ Export functionality works

---

**Version**: 2.1.4  
**Last Updated**: February 2026  
**Status**: Production Ready
