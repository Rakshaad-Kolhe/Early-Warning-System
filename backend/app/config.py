import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "models", "outbreak_model.pkl")
DB_PATH = os.path.join(BASE_DIR, "database", "alerts.db")

RISK_THRESHOLDS = {
    "LOW": 30,      # < 30  = Routine / no action needed
    "MEDIUM": 65,   # 30–64 = Elevated alert / monitor closely
                    # ≥ 65  = HIGH outbreak risk / immediate response
}

DISTRICT_VARIANCE = {
    "Pune": 5,
    "Nashik": 3,
    "Mumbai": -2,
    "Nagpur": 4,
    "Aurangabad": 2,
    "Thane": -1,
    "Solapur": 3,
    "Kolhapur": 1,
}

FEATURE_NAMES = ["rainfall_dev", "temperature", "case_growth", "baseline"]
