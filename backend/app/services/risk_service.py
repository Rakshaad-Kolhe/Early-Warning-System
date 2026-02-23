from app.config import RISK_THRESHOLDS


def classify(prob: float) -> tuple:
    score = round(min(max(prob * 100, 5), 95))

    if score < RISK_THRESHOLDS["LOW"]:
        category = "LOW"
    elif score < RISK_THRESHOLDS["MEDIUM"]:
        category = "MEDIUM"
    else:
        category = "HIGH"

    confidence = round(abs(prob - 0.5) * 200)

    return score, category, confidence
