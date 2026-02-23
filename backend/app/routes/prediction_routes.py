from fastapi import APIRouter
from datetime import datetime, timezone
from app.schemas import PredictionInput, PredictionOutput
from app.services.model_service import predict_probability
from app.services.risk_service import classify
from app.services.threshold_service import calibrate
from app.services.explain_service import explain
from app.services.response_service import generate_response
from app.alert_logger import log_alert, get_alerts

router = APIRouter()


@router.post("/predict", response_model=PredictionOutput)
def predict(input_data: PredictionInput):
    features = {
        "rainfall_dev": input_data.rainfall_dev,
        "temperature": input_data.temperature,
        "case_growth": input_data.case_growth,
        "baseline": input_data.baseline,
    }

    prob = predict_probability(features)

    score, category, confidence = classify(prob)

    calibrated = calibrate(score, input_data.district)

    contributors = explain(features)

    response = generate_response(category)

    timestamp = datetime.now().isoformat()

    log_alert(input_data.district, calibrated, category, confidence)

    return PredictionOutput(
        district=input_data.district,
        raw_score=score,
        calibrated_score=calibrated,
        category=category,
        confidence=confidence,
        top_contributors=contributors,
        response=response,
        timestamp=timestamp,
    )


@router.get("/alerts")
def alerts():
    return get_alerts()


@router.get("/health")
def health():
    return {
        "status": "operational",
        "model_version": "v2.1.4",
        "active_districts": 24,
        "last_sync": datetime.now().isoformat(),
    }
