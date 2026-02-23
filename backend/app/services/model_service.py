import joblib
import pandas as pd
from app.config import MODEL_PATH, FEATURE_NAMES

_model = None


def load_model():
    global _model
    _model = joblib.load(MODEL_PATH)
    print(f"Model loaded from {MODEL_PATH}")


def predict_probability(features: dict) -> float:
    if _model is None:
        raise RuntimeError("Model not loaded. Call load_model() first.")

    df = pd.DataFrame([features])[FEATURE_NAMES]
    base_prob = float(_model.predict_proba(df)[0][1])

    # ── Real-time condition amplifiers ──────────────────────────────────
    # The base model gives historical baseline risk (~5%).
    # These amplifiers scale the probability based on current field conditions,
    # matching how real-world hybrid risk-intelligence systems work.
    case_growth  = features.get("case_growth", 0)
    rainfall_dev = features.get("rainfall_dev", 0)
    temperature  = features.get("temperature", 27)
    baseline     = features.get("baseline", 50)

    # Each factor kicks in above a normal threshold
    case_factor     = max(0.0, (case_growth  - 10) / 100)   # >10% case growth adds risk
    rainfall_factor = max(0.0, (rainfall_dev - 20) / 150)   # >20mm deviation adds risk
    temp_factor     = max(0.0, (temperature  - 32) /  60)   # >32°C heat stress adds risk
    baseline_factor = max(0.0, (baseline     - 60) / 200)   # >60 baseline cases adds risk

    amplified = base_prob + case_factor + rainfall_factor + temp_factor + baseline_factor
    return float(min(amplified, 0.95))
