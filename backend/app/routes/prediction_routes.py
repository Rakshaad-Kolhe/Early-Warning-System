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
    temperature: float
    humidity: float
    rainfall: float
    hospital_capacity: int
    cases_last_week: int
    cases_last_month: int
    mobility_index: float
    vaccination_rate: float
    healthcare_quality: float


class TimeSeriesRequest(BaseModel):
    current_cases: int
    days: int = 14


@router.post("/district")
async def predict_district_risk(
    request: DistrictPredictionRequest,
    db: Session = Depends(get_db)
):
    """Predict outbreak risk for a district"""
    try:
        # Convert request to dict
        district_data = request.dict()
        
        # Make prediction
        prediction = predictor.predict_district(district_data)
        
        # Store prediction in history
        try:
            history = PredictionHistory(
                district=request.district,
                risk_level=prediction['risk_level'],
                risk_score=prediction['risk_score'],
                predicted_cases=prediction['predicted_cases'],
                confidence=prediction['confidence'],
                features_json=json.dumps(district_data)
            )
            db.add(history)
            db.commit()
        except Exception as e:
            logger.error(f"Error storing prediction history: {e}")
        
        return {
            "success": True,
            "district": request.district,
            "prediction": prediction
        }
        
    except Exception as e:
        logger.error(f"Error in district prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/timeseries")
async def predict_time_series(request: TimeSeriesRequest):
    """Predict case trajectory over time"""
    try:
        forecast = predictor.predict_time_series(
            current_cases=request.current_cases,
            days=request.days
        )
        
        return {
            "success": True,
            "forecast": forecast
        }
        
    except Exception as e:
        logger.error(f"Error in time series prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{district}")
async def get_prediction_history(
    district: str,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get prediction history for a district"""
    try:
        history = db.query(PredictionHistory).filter(
            PredictionHistory.district == district
        ).order_by(
            PredictionHistory.prediction_date.desc()
        ).limit(limit).all()
        
        return {
            "success": True,
            "district": district,
            "count": len(history),
            "history": [
                {
                    "id": h.id,
                    "risk_level": h.risk_level,
                    "risk_score": h.risk_score,
                    "predicted_cases": h.predicted_cases,
                    "confidence": h.confidence,
                    "date": h.prediction_date.isoformat()
                }
                for h in history
            ]
        }
        
    except Exception as e:
        logger.error(f"Error getting prediction history: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/model/info")
async def get_model_info():
    """Get information about the prediction model"""
    try:
        return {
            "success": True,
            "model": {
                "type": "Ensemble (RandomForest + GradientBoosting)",
                "features": predictor.feature_names,
                "version": "1.0",
                "status": "active"
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting model info: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/batch")
async def batch_predict(
    districts: List[DistrictPredictionRequest],
    db: Session = Depends(get_db)
):
    """Predict risk for multiple districts"""
    try:
        results = []
        
        for district_req in districts:
            district_data = district_req.dict()
            prediction = predictor.predict_district(district_data)
            
            results.append({
                "district": district_req.district,
                "prediction": prediction
            })
        
        return {
            "success": True,
            "count": len(results),
            "predictions": results
        }
        
    except Exception as e:
        logger.error(f"Error in batch prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/statistics")
async def get_prediction_statistics(db: Session = Depends(get_db)):
    """Get statistics about predictions"""
    try:
        total_predictions = db.query(PredictionHistory).count()
        
        # Count by risk level
        high_risk = db.query(PredictionHistory).filter(
            PredictionHistory.risk_level == 'high'
        ).count()
        
        medium_risk = db.query(PredictionHistory).filter(
            PredictionHistory.risk_level == 'medium'
        ).count()
        
        low_risk = db.query(PredictionHistory).filter(
            PredictionHistory.risk_level == 'low'
        ).count()
        
        # Get unique districts
        unique_districts = db.query(PredictionHistory.district).distinct().count()
        
        return {
            "success": True,
            "statistics": {
                "total_predictions": total_predictions,
                "unique_districts": unique_districts,
                "risk_distribution": {
                    "high": high_risk,
                    "medium": medium_risk,
                    "low": low_risk
                }
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting statistics: {e}")
        raise HTTPException(status_code=500, detail=str(e))
