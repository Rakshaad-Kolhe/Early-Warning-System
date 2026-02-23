# 🏥 District Surveillance Intelligence Layer (Climate-Aware Epidemiological Intelligence System)

A highly resilient, multi-district disease outbreak early warning platform. Moving beyond traditional dashboards, this system acts as a **decision-intelligence layer** for public health officials. It uses a machine learning hybrid model (RandomForest + Real-Time Condition Amplifiers) to forecast outbreak risks, backed by **SHAP explainability**, **Uncertainty Quantification**, and **Model Drift Monitoring**. 

Featuring a premium, Bloomberg-terminal-inspired analytical interface, it is engineered to be **deterministic, judge-proof, and operationally transparent**.

---

## 🌟 Key Features & Judge Explainability

### 1. Transparent & Explainable AI
- **Contributing Factors (SHAP)**: The system doesn't just output a risk score. It mathematically breaks down the prediction, showing exactly how much *Rainfall*, *Temperature*, or *Case Growth* pushed the vulnerability score up or down. 
- **Prediction Uncertainty Engine**: AI is never 100% certain. The system runs 10 background Monte Carlo simulations with ±2% Gaussian noise to calculate the standard deviation (uncertainty) of the prediction, proving to officials whether the AI is highly confident or operating in a noisy data space.
- **Model Drift Monitoring**: Real-time inputs are constantly evaluated against the original training data distribution using Z-scores. If an input (like an unprecedented 50°C heatwave) is an extreme outlier, the system flags a **Drift Warning**, indicating the model is operating outside its trained expertise.

### 2. Operational Intelligence
- **Scenario Comparison Mode**: A built-in simulation layer allowing officials to compare live "Baseline Risk" against hypothetical "Scenario Risk" side-by-side, visually connected by animated data flows.
- **Automated Resource Pipeline**: Risk tiers (LOW 🔵, MEDIUM 🟡, HIGH 🔴) don't just alert; they trigger deterministic resource estimations (ICU Beds, Test Kits, Medical Personnel) tailored to the district severity.
- **Risk Trend & Alert Memory**: A live 30-day interactive history graph (clamped and bezier-smoothed) tracks trajectory, while a persistently logged Alert History computes the `Δ vs Prev` delta, highlighting worsening localized conditions instantly via severity stripes.

### 3. Enterprise-Grade Reliability & UX
- **Graceful Degradation**: All new intelligence modules (Uncertainty, Drift, Resources) are strictly modular and wrapped in safe-execution blocks. If one module fails, the system safely falls back to core predictions without crashing.
- **Strict Input Validation**: Pydantic models reject impossible metrics instantly protecting the intelligence engine.
- **Race Condition Guard**: Frontend architectural locks prevent duplicate database logs if the user spams the prediction button under pressure.
- **Apple-esque Aesthetic**: Neon cyan/amber/red color palette, glassy UI cards, dynamic vignettes, background drift animations, and micro-interactions focus the user perfectly without visual noise.

---

## 🏗️ Architecture Stack

### Frontend (React + Vite)
- **Framework**: React 18, Vite
- **Motion & Visualization**: Framer Motion (micro-interactions), Recharts (data smoothing)
- **Styling**: Custom CSS variables, 4-tone premium palette, frosted glassmorphism

### Backend (Python + FastAPI)
- **API Engine**: FastAPI (High-performance synchronous routing)
- **Machine Learning**: `scikit-learn` (RandomForestClassifier)
- **Explainability**: `shap` (TreeExplainer)
- **Persistence**: SQLite (Local persistent storage via SQLAlchemy)
- **Data Guarding**: Pydantic v2 (Strict boundary validation)

---

## 🚀 Quick Start

### 1. Run the Backend (FastAPI)
Open a terminal in the `backend` directory:
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate # Mac/Linux
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API will run at `http://localhost:8000`.

### 2. Run the Frontend (React / Vite)
Open a new terminal in the `frontend-react` directory:
```bash
cd frontend-react
npm install
npm run dev
```
The application UI will run at `http://localhost:3000`.

---

## 🧪 System Logic & Calibration

### Risk Amplifiers
Because rare events like disease outbreaks have naturally low historic probabilities (~5%), the backend applies dynamically scaled risk amplifiers. Surging Weekly Case Growth or extreme Rainfall Deviations proportionately elevate the final vulnerability score, ensuring the system catches rapid onset anomalies deterministically.

### Regional Variance
Districts have built-in geographical calibration factors applied automatically to raw ML probabilities:
| District | Calibration Offset |
|----------|-------------------|
| Pune | +5 |
| Nagpur | +4 |
| Nashik | +3 |
| Mumbai | -2 |
| Thane | -1 |
