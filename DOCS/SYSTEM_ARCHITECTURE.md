# System Architecture - Outbreak Prediction Platform

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│                     (React + Framer Motion)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐                    ┌──────────────────────┐  │
│  │  Navigation  │                    │   National Overview  │  │
│  │     Bar      │◄──────────────────►│    (Map View)        │  │
│  └──────────────┘                    └──────────────────────┘  │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           PREDICTION SYSTEM (Main Interface)              │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                            │  │
│  │  ┌────────────┐  ┌─────────────────────────────────────┐ │  │
│  │  │   Input    │  │         Risk Hero Display           │ │  │
│  │  │   Panel    │  │    (Score, Category, Confidence)    │ │  │
│  │  │  (Sticky)  │  └─────────────────────────────────────┘ │  │
│  │  │            │                                            │  │
│  │  │ District   │  ┌──────────────┐  ┌──────────────────┐  │  │
│  │  │ Rainfall   │  │  Decision    │  │   Confidence &   │  │  │
│  │  │ Temp       │  │  Triggers    │  │   Uncertainty    │  │  │
│  │  │ Growth     │  └──────────────┘  └──────────────────┘  │  │
│  │  │ Baseline   │                                            │  │
│  │  │            │  ┌─────────────────────────────────────┐  │  │
│  │  │ [RUN]      │  │      14-Day Forecast Timeline       │  │  │
│  │  └────────────┘  └─────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │                  ┌──────────────┐  ┌──────────────────┐  │  │
│  │                  │  Resource    │  │   Governance     │  │  │
│  │                  │  Impact      │  │   Actions        │  │  │
│  │                  └──────────────┘  └──────────────────┘  │  │
│  │                                                            │  │
│  │                  ┌──────────────┐  ┌──────────────────┐  │  │
│  │                  │ Contributing │  │   Response       │  │  │
│  │                  │  Factors     │  │   Protocol       │  │  │
│  │                  └──────────────┘  └──────────────────┘  │  │
│  │                                                            │  │
│  │                  ┌─────────────────────────────────────┐  │  │
│  │                  │        Audit Trail & Run Log        │  │  │
│  │                  └─────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/JSON
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
│                      (FastAPI Backend)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  POST /api/predict                                               │
│  ├─► Input Validation (Pydantic)                                │
│  ├─► Feature Engineering                                         │
│  ├─► Model Prediction (Scikit-learn)                            │
│  ├─► Risk Classification                                         │
│  ├─► Threshold Calibration                                       │
│  ├─► Uncertainty Computation                                     │
│  ├─► Drift Detection                                             │
│  ├─► Resource Recommendation                                     │
│  ├─► SHAP Explanation                                            │
│  ├─► Response Generation                                         │
│  └─► Alert Logging                                               │
│                                                                   │
│  GET /api/alerts                                                 │
│  └─► Retrieve Alert History                                     │
│                                                                   │
│  GET /api/health                                                 │
│  └─► System Status Check                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │  Model Service   │  │  Risk Service    │                    │
│  │  - Load model    │  │  - Classify risk │                    │
│  │  - Predict prob  │  │  - Compute conf  │                    │
│  │  - Amplify       │  │  - Categorize    │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ Threshold Svc    │  │  Explain Service │                    │
│  │  - Calibrate     │  │  - SHAP values   │                    │
│  │  - District adj  │  │  - Top features  │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ Response Service │  │ Resource Engine  │                    │
│  │  - Protocols     │  │  - Recommend     │                    │
│  │  - Actions       │  │  - Calculate     │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ Uncertainty Eng  │  │  Drift Monitor   │                    │
│  │  - Compute var   │  │  - Check drift   │                    │
│  │  - Confidence    │  │  - Alert status  │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │   ML Model       │  │   Alert DB       │                    │
│  │  (Pickle file)   │  │  (SQLite)        │                    │
│  │  - Random Forest │  │  - Alert logs    │                    │
│  │  - Trained       │  │  - History       │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Diagram

```
User Input
    │
    ├─► District Selection
    ├─► Rainfall Deviation (-60 to +80 mm)
    ├─► Temperature (18-42°C)
    ├─► Case Growth (-20 to +80%)
    └─► Baseline Cases (10-120)
    │
    ▼
Input Validation
    │
    ├─► Range checks
    ├─► District validation
    └─► Type conversion
    │
    ▼
Feature Engineering
    │
    ├─► Normalize values
    ├─► Create feature vector
    └─► Apply transformations
    │
    ▼
Model Prediction
    │
    ├─► Random Forest inference
    ├─► Base probability (0-1)
    └─► Amplification factors
    │
    ▼
Risk Classification
    │
    ├─► Score calculation (0-100)
    ├─► Category assignment (LOW/MED/HIGH)
    └─► Confidence computation
    │
    ▼
Threshold Calibration
    │
    ├─► District-specific adjustment
    ├─► Historical baseline
    └─► Calibrated score
    │
    ▼
Parallel Processing
    │
    ├─► Uncertainty Computation
    │   ├─► Input variance
    │   ├─► Model uncertainty
    │   └─► Confidence interval
    │
    ├─► Drift Detection
    │   ├─► Distribution check
    │   ├─► Pattern analysis
    │   └─► Drift status
    │
    ├─► Resource Recommendation
    │   ├─► Bed requirements
    │   ├─► ICU needs
    │   ├─► Supply estimates
    │   └─► Team allocation
    │
    ├─► SHAP Explanation
    │   ├─► Feature importance
    │   ├─► Contribution values
    │   └─► Top contributors
    │
    └─► Response Generation
        ├─► Protocol selection
        ├─► Action items
        └─► Messaging templates
    │
    ▼
Alert Logging
    │
    ├─► Timestamp
    ├─► Input parameters
    ├─► Prediction results
    └─► Database storage
    │
    ▼
Response Assembly
    │
    ├─► Combine all results
    ├─► Format JSON
    └─► Add metadata
    │
    ▼
Frontend Rendering
    │
    ├─► Risk Hero Display
    ├─► Decision Triggers
    ├─► Confidence Metrics
    ├─► Forecast Timeline
    ├─► Resource Projections
    ├─► Governance Actions
    └─► Audit Trail Update
```

## 🔄 Component Interaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PredictionPage.jsx                            │
│                   (Main Orchestrator)                            │
└─────────────────────────────────────────────────────────────────┘
    │
    ├─► State Management
    │   ├─► inputs (district, rainfall, temp, growth, baseline)
    │   ├─► result (prediction response)
    │   ├─► loading (boolean)
    │   └─► error (string)
    │
    ├─► Event Handlers
    │   ├─► handleRun() → fetchPrediction()
    │   └─► setInputs() → update state
    │
    └─► Child Components (Props Flow)
        │
        ├─► InputPanel
        │   ├─► Receives: values, onChange, onRun, loading
        │   └─► Emits: onChange event, onRun event
        │
        ├─► RiskHero
        │   ├─► Receives: result
        │   └─► Displays: score, category, confidence
        │
        ├─► DecisionTriggerPanel
        │   ├─► Receives: result
        │   └─► Displays: thresholds, actions, deadlines
        │
        ├─► ConfidencePanel
        │   ├─► Receives: result, inputs
        │   └─► Displays: confidence, uncertainty, warnings
        │
        ├─► ForecastTimeline
        │   ├─► Receives: result, inputs
        │   ├─► Computes: baseline & intervention forecasts
        │   └─► Displays: 14-day projections
        │
        ├─► ResourceImpactPanel
        │   ├─► Receives: result, inputs
        │   ├─► Computes: capacity projections
        │   └─► Displays: bed/ICU/supply forecasts
        │
        ├─► GovernancePanel
        │   ├─► Receives: result
        │   └─► Displays: actions, messaging, escalation
        │
        ├─► ContributingFactors
        │   ├─► Receives: result
        │   └─► Displays: SHAP values
        │
        ├─► ResponseProtocol
        │   ├─► Receives: result
        │   └─► Displays: response protocols
        │
        └─► AuditTrailPanel
            ├─► Receives: result, inputs
            ├─► Manages: runHistory state
            ├─► Displays: timeline, logs
            └─► Exports: JSON download
```

## 🎨 Styling Architecture

```
index.css (Global Styles)
    │
    ├─► CSS Variables
    │   ├─► Colors (--accent, --danger, --amber, etc.)
    │   ├─► Backgrounds (--bg-0, --bg-1, --bg-2)
    │   ├─► Text (--text-primary, --text-muted)
    │   └─► Borders (--border, --border-subtle)
    │
    ├─► Base Styles
    │   ├─► Typography (Space Grotesk, IBM Plex Mono)
    │   ├─► Reset (box-sizing, margin, padding)
    │   └─► Body (gradient background)
    │
    ├─► Component Classes
    │   ├─► .glass-card (glassmorphism effect)
    │   ├─► .hero-card (large display card)
    │   ├─► .section-label (uppercase headers)
    │   └─► Utility classes (flex, items-center, etc.)
    │
    ├─► Animations
    │   ├─► @keyframes hero-pulse
    │   ├─► @keyframes badge-pulse
    │   └─► Framer Motion (in components)
    │
    └─► Responsive
        └─► @media queries for mobile
```

## 🔐 Security Architecture

```
Frontend Security
    │
    ├─► Input Validation
    │   ├─► Client-side range checks
    │   ├─► Type validation
    │   └─► Sanitization
    │
    ├─► API Communication
    │   ├─► HTTPS (production)
    │   ├─► CORS headers
    │   └─► Error handling
    │
    └─► Data Protection
        ├─► No sensitive data storage
        ├─► Session management (future)
        └─► XSS prevention

Backend Security
    │
    ├─► Input Validation
    │   ├─► Pydantic models
    │   ├─► Field validators
    │   └─► Range clamping
    │
    ├─► API Security
    │   ├─► CORS middleware
    │   ├─► Rate limiting (future)
    │   └─► Authentication (future)
    │
    └─► Data Security
        ├─► SQL injection prevention
        ├─► Audit logging
        └─► Access control (future)
```

## 📦 Deployment Architecture

```
Development
    │
    ├─► Frontend: npm run dev (Vite)
    ├─► Backend: uvicorn --reload
    └─► Database: SQLite (local)

Production (Docker)
    │
    ├─► Frontend Container
    │   ├─► Nginx server
    │   ├─► Static files
    │   └─► Port 3000
    │
    ├─► Backend Container
    │   ├─► Python/FastAPI
    │   ├─► ML model
    │   └─► Port 8000
    │
    └─► Docker Compose
        ├─► Network bridge
        ├─► Volume mounts
        └─► Environment variables

Cloud Deployment (Future)
    │
    ├─► Frontend: CDN (Cloudflare/AWS)
    ├─► Backend: Container service (ECS/GKE)
    ├─► Database: Managed DB (RDS/Cloud SQL)
    └─► Load Balancer: ALB/Cloud Load Balancing
```

## 🔄 State Management

```
Application State
    │
    ├─► Global State (AppWithRouting)
    │   └─► currentPage: 'prediction' | 'map'
    │
    ├─► Page State (PredictionPage)
    │   ├─► inputs: { district, rainfall_dev, temperature, case_growth, baseline }
    │   ├─► result: PredictionOutput | null
    │   ├─► loading: boolean
    │   └─► error: string | null
    │
    └─► Component State
        ├─► AuditTrailPanel
        │   └─► runHistory: Array<RunEntry>
        │
        ├─► ForecastTimeline
        │   └─► showIntervention: boolean
        │
        └─► InputPanel
            └─► activeSlider: string | null
```

## 📊 Performance Considerations

```
Frontend Optimization
    │
    ├─► Code Splitting
    │   ├─► Lazy loading (future)
    │   └─► Route-based chunks
    │
    ├─► Rendering
    │   ├─► Framer Motion animations
    │   ├─► Conditional rendering
    │   └─► Memoization (future)
    │
    └─► Assets
        ├─► SVG icons (inline)
        ├─► Optimized fonts
        └─► Minimal images

Backend Optimization
    │
    ├─► Model Loading
    │   ├─► Load once at startup
    │   └─► Keep in memory
    │
    ├─► Computation
    │   ├─► Parallel processing
    │   ├─► Efficient algorithms
    │   └─► Caching (future)
    │
    └─► Database
        ├─► Indexed queries
        ├─► Connection pooling
        └─► Query optimization
```

---

**Architecture Version**: 2.1.4  
**Last Updated**: February 2026  
**Status**: Production Ready
