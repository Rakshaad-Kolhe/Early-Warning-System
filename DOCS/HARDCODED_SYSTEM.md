# Hardcoded Prediction System

## Overview

The prediction system now works **completely standalone** without requiring a backend server. All prediction logic, district data, and calculations are implemented in the frontend using realistic algorithms.

## ✅ What's Included

### Districts (8 Total)
All Maharashtra districts with realistic baseline data:

1. **Pune** - Population: 9.4M, Hospitals: 340, Beds: 18,400
2. **Mumbai** - Population: 12.4M, Hospitals: 450, Beds: 24,500
3. **Nashik** - Population: 6.1M, Hospitals: 210, Beds: 11,200
4. **Nagpur** - Population: 4.6M, Hospitals: 280, Beds: 14,800
5. **Aurangabad** - Population: 3.7M, Hospitals: 180, Beds: 9,600
6. **Thane** - Population: 11.0M, Hospitals: 380, Beds: 20,100
7. **Solapur** - Population: 4.3M, Hospitals: 165, Beds: 8,900
8. **Kolhapur** - Population: 3.9M, Hospitals: 190, Beds: 10,200

### Prediction Algorithm

The hardcoded predictor uses a **realistic risk calculation model** based on:

#### 1. District Baseline Risk (0-20 points)
- Each district has a baseline risk factor based on population density
- Mumbai and Thane have higher baseline due to density
- Solapur and Aurangabad have lower baseline

#### 2. Rainfall Impact (0-25 points)
- Heavy rainfall (>40mm deviation) = Maximum risk (25 points)
- Moderate rainfall (20-40mm) = Scaled risk (15-25 points)
- Light rainfall (0-20mm) = Proportional risk
- Drought (<-30mm) = Stress factor (5 points)

#### 3. Temperature Impact (0-20 points)
- Optimal vector temperature: 28-35°C = Maximum risk (20 points)
- Sub-optimal ranges: 25-28°C or 35-40°C = Reduced risk
- Extreme temperatures: <20°C or >40°C = Minimal risk

#### 4. Case Growth Impact (0-30 points)
- Exponential growth (>50%) = Maximum risk (30 points)
- High growth (30-50%) = Scaled risk (20-30 points)
- Moderate growth (10-30%) = Proportional risk
- Low/negative growth = Minimal risk

#### 5. Baseline Cases Impact (0-15 points)
- High baseline (>80 cases) = Maximum risk (15 points)
- Medium baseline (40-80 cases) = Scaled risk
- Low baseline (<40 cases) = Proportional risk

#### 6. Population Density Factor (0-10 points)
- Based on district population
- Higher density = Higher transmission potential

### Risk Classification

- **LOW**: Score 0-35 (Routine surveillance)
- **MEDIUM**: Score 36-65 (Enhanced monitoring, 2-3 field teams)
- **HIGH**: Score 66-100 (Emergency protocols, 5 field teams)

### Confidence Calculation

Base confidence: 85%

**Increases confidence (+5-8%):**
- Typical rainfall range (-20 to +40mm)
- Typical temperature range (24-36°C)
- Typical case growth (0-40%)

**Decreases confidence (-5-10%):**
- Extreme rainfall (<-50mm or >60mm)
- Extreme temperature (<20°C or >40°C)
- Extreme case growth (>60%)
- Very high baseline (>100 cases)

Final confidence range: 60-95%

### Uncertainty (Variance)

Base variance: ±3.5%

**Increases variance (+1-2%):**
- Extreme conditions
- High risk scores (>70)
- Rapid case growth (>50%)

**Decreases variance (-0.5-1%):**
- Stable conditions
- Low risk scores (<30)
- Slow case growth (<15%)

Final variance range: ±2.0% to ±8.0%

### Drift Detection

Triggers "warning" status when:
- Rainfall deviation < -50mm or > 60mm
- Temperature < 20°C or > 40°C
- Case growth > 60%
- Baseline cases > 100

### Feature Contributions (SHAP-like)

Calculates contribution of each input parameter:
- **Case Growth Rate**: Most impactful (0-30 points)
- **Rainfall Deviation**: High impact (0-25 points)
- **Temperature**: Moderate impact (0-20 points)
- **Baseline Cases**: Lower impact (0-15 points)

### Resource Recommendations

Based on risk score:

**LOW (0-35):**
- Field teams: 2
- Surveillance: Routine
- Vector control: Standard
- Public messaging: Awareness

**MEDIUM (36-65):**
- Field teams: 3
- Surveillance: Enhanced
- Vector control: Active
- Public messaging: Advisory

**HIGH (66-100):**
- Field teams: 5
- Surveillance: Intensive
- Vector control: Emergency
- Public messaging: Urgent

### Response Protocols

**LOW Risk:**
- Continue standard surveillance
- Weekly reporting
- Community awareness
- Vector control maintenance

**MEDIUM Risk:**
- Activate enhanced surveillance
- Deploy additional field teams
- Daily situation reports
- Intensify vector control
- Issue health advisory
- Coordinate with neighbors

**HIGH Risk:**
- Activate Emergency Operations Center
- Deploy all field teams
- Emergency vector control
- Public health advisory
- State coordination
- Hospital surge capacity
- Travel screening
- Daily media briefings

## 🚀 How to Use

### Running the System

1. **Start Frontend Only**:
```bash
cd frontend-react
npm install
npm run dev
```

2. **Open Browser**:
```
http://localhost:5173
```

3. **Navigate to Prediction System**:
Click "🎯 Prediction System" in the top navigation

4. **Make Predictions**:
- Select district
- Adjust parameters
- Click "RUN PREDICTION"
- Review all panels

### No Backend Required!

The system works completely in the browser. All calculations happen client-side using the hardcoded predictor in `src/utils/hardcodedPredictor.js`.

## 📊 Example Scenarios

### Scenario 1: Low Risk (Pune)
```javascript
{
  district: 'Pune',
  rainfall_dev: 5,
  temperature: 26,
  case_growth: 3,
  baseline: 25
}
```
**Expected**: Score ~40-45 (MEDIUM), Confidence 95%

### Scenario 2: Medium Risk (Mumbai)
```javascript
{
  district: 'Mumbai',
  rainfall_dev: 30,
  temperature: 32,
  case_growth: 25,
  baseline: 65
}
```
**Expected**: Score ~85-90 (HIGH), Confidence 95%

### Scenario 3: High Risk (Nagpur)
```javascript
{
  district: 'Nagpur',
  rainfall_dev: 55,
  temperature: 35,
  case_growth: 50,
  baseline: 95
}
```
**Expected**: Score ~95-100 (HIGH), Confidence 90%

### Scenario 4: Out of Distribution
```javascript
{
  district: 'Thane',
  rainfall_dev: -55,
  temperature: 42,
  case_growth: 70,
  baseline: 110
}
```
**Expected**: Score ~70-80 (HIGH), Confidence 60%, Drift Warning

## 🧪 Testing

Run the test suite:
```bash
cd frontend-react
node src/utils/testPredictor.js
```

This tests:
- All 8 districts
- Low/Medium/High risk scenarios
- Out-of-distribution detection
- Confidence calculations
- Feature contributions
- Resource recommendations

## 📁 File Structure

```
frontend-react/src/
├── utils/
│   ├── hardcodedPredictor.js    # Main prediction engine
│   └── testPredictor.js         # Test suite
├── pages/
│   └── PredictionPage.jsx       # Uses hardcoded predictor
├── components/
│   ├── InputPanel.jsx           # Uses DISTRICT_LIST
│   ├── ContributingFactors.jsx  # Updated for hardcoded data
│   └── ResponseProtocol.jsx     # Updated for hardcoded data
└── ...
```

## 🔧 Customization

### Adding New Districts

Edit `hardcodedPredictor.js`:

```javascript
const DISTRICTS = {
    'YourDistrict': { 
        baseline_risk: 0.40,  // 0.0-1.0
        population: 5.0,      // millions
        hospitals: 200,       // count
        beds: 10000          // count
    },
    // ... existing districts
};
```

### Adjusting Risk Calculation

Modify the `calculateRiskScore()` function to change how factors contribute to the final score.

### Changing Thresholds

Update the `classifyRisk()` function:

```javascript
export function classifyRisk(score) {
    if (score >= 70) return 'HIGH';    // Change from 66
    if (score >= 40) return 'MEDIUM';  // Change from 36
    return 'LOW';
}
```

### Modifying Confidence

Adjust the `calculateConfidence()` function to change how confidence is computed based on input ranges.

## 🎯 Advantages of Hardcoded System

1. **No Backend Required**: Works completely in browser
2. **Instant Predictions**: No network latency
3. **Offline Capable**: Can work without internet
4. **Easy to Demo**: Just open the page
5. **Transparent Logic**: All calculations visible in code
6. **Easy to Customize**: Modify algorithms directly
7. **No Dependencies**: No ML libraries needed
8. **Deterministic**: Same inputs = same outputs
9. **Fast Development**: No backend deployment
10. **Educational**: Clear algorithm implementation

## ⚠️ Limitations

1. **Not ML-based**: Uses rule-based calculations, not trained model
2. **Fixed Logic**: Doesn't learn from new data
3. **Simplified**: Real epidemiology is more complex
4. **No Historical Data**: Doesn't use past outbreak patterns
5. **No Real-time Updates**: Static district data

## 🔄 Migration to Backend

If you want to switch back to backend predictions:

1. Ensure backend is running
2. Update `PredictionPage.jsx`:
```javascript
import { fetchPrediction } from '../api/client';

const handleRun = async () => {
    const data = await fetchPrediction(inputs);
    setResult(data);
};
```

3. The rest of the system will work identically

## 📊 Validation

The hardcoded predictor has been validated to produce:
- Realistic risk scores (0-100)
- Appropriate risk categories
- Reasonable confidence levels
- Sensible resource recommendations
- Proper drift detection
- Accurate feature contributions

## 🎓 Educational Value

This implementation is excellent for:
- Understanding outbreak risk factors
- Learning epidemiological modeling
- Teaching decision-support systems
- Demonstrating UI/UX patterns
- Training public health officials
- Academic presentations
- Proof-of-concept demos

## 🚀 Production Considerations

For production use, consider:
1. Integrating real ML models
2. Using actual historical data
3. Adding real-time data feeds
4. Implementing user authentication
5. Adding database for audit logs
6. Deploying backend API
7. Adding data validation
8. Implementing rate limiting
9. Adding monitoring/logging
10. Conducting epidemiological validation

---

**System Status**: ✅ Fully Functional  
**Backend Required**: ❌ No  
**Districts Supported**: 8  
**Prediction Speed**: Instant (<1s)  
**Accuracy**: Realistic for demo purposes  
**Production Ready**: For demo/training use
