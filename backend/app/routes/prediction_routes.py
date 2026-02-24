"""
API routes for ML prediction functionality
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, List, Optional
import logging
import json
from datetime import datetime

from ..database import get_db
from ..pretrained_model import OutbreakPredictor
from ..models.outbreak_model import PredictionHistory

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/predictions", tags=["predictions"])

# Global model instance
try:
    predictor = OutbreakPredictor(model_path='backend/app/models/outbreak_model.pkl')
except:
    logger.warning("Could not load pretrained model, initializing new model")
    predictor = OutbreakPredictor()


class DistrictPredictionRequest(BaseModel):
    district: str
    population_density: float
    temperature
    uncertainty = compute_uncertainty(input_data)
    drift = check_drift(input_data)
    resources = recommend_resources(calibrated)

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
        uncertainty=uncertainty,
        drift_status=drift.get("drift_status", "stable"),
        recommended_resources=resources,
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
