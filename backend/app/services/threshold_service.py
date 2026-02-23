from app.config import DISTRICT_VARIANCE


def calibrate(score: int, district: str) -> int:
    variance = DISTRICT_VARIANCE.get(district, 0)
    adjusted = score + variance
    return max(0, min(100, adjusted))
