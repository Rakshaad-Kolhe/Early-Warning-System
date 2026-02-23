import numpy as np
from app.services.model_service import predict_probability

def compute_uncertainty(input_data):
    try:
        features = {
            "rainfall_dev": input_data.rainfall_dev,
            "temperature": input_data.temperature,
            "case_growth": input_data.case_growth,
            "baseline": input_data.baseline,
        }
        
        predictions = []
        for _ in range(10):
            noisy_features = {
                k: v + np.random.normal(0, 0.02 * abs(v)) if v != 0 else np.random.normal(0, 0.02)
                for k, v in features.items()
            }
            pred = predict_probability(noisy_features)
            predictions.append(pred * 100)
            
        uncertainty = np.std(predictions)
        return round(float(uncertainty), 2)
    except Exception:
        return None
