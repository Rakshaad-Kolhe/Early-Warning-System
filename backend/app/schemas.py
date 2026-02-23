from pydantic import BaseModel, field_validator
from typing import List, Dict, Any


class PredictionInput(BaseModel):
    district: str
    rainfall_dev: float   # mm deviation from normal, clamped [-100, 150]
    temperature: float    # °C realistic range [10, 50]
    case_growth: float    # % weekly case growth, clamped [-50, 150]
    baseline: float       # weekly baseline cases [0, 200]

    @field_validator("district")
    @classmethod
    def district_must_be_valid(cls, v):
        valid = {
            "Pune", "Nashik", "Mumbai", "Nagpur",
            "Aurangabad", "Thane", "Solapur", "Kolhapur",
        }
        if v not in valid:
            raise ValueError(f"Unknown district '{v}'. Valid: {sorted(valid)}")
        return v

    @field_validator("rainfall_dev")
    @classmethod
    def clamp_rainfall(cls, v):
        return max(-100.0, min(150.0, v))

    @field_validator("temperature")
    @classmethod
    def clamp_temperature(cls, v):
        if not (10 <= v <= 50):
            raise ValueError(f"Temperature {v}°C outside realistic range [10, 50]")
        return v

    @field_validator("case_growth")
    @classmethod
    def clamp_case_growth(cls, v):
        return max(-50.0, min(150.0, v))

    @field_validator("baseline")
    @classmethod
    def clamp_baseline(cls, v):
        return max(0.0, min(200.0, v))


class PredictionOutput(BaseModel):
    district: str
    raw_score: int
    calibrated_score: int
    category: str
    confidence: int
    top_contributors: List[Dict[str, Any]]
    response: Dict[str, Any]
    timestamp: str


class AlertRecord(BaseModel):
    id: int
    district: str
    score: int
    category: str
    confidence: int
    timestamp: str
