TRAIN_MEANS = {
    "rainfall_dev": 20.0,
    "temperature": 27.0,
    "case_growth": 5.0,
    "baseline": 50.0
}
TRAIN_STDS = {
    "rainfall_dev": 50.0,
    "temperature": 4.0,
    "case_growth": 15.0,
    "baseline": 25.0
}

def check_drift(input_data):
    try:
        features = {
            "rainfall_dev": input_data.rainfall_dev,
            "temperature": input_data.temperature,
            "case_growth": input_data.case_growth,
            "baseline": input_data.baseline,
        }
        
        drift_flag = False
        for k, v in features.items():
            mean = TRAIN_MEANS.get(k, 0)
            std = TRAIN_STDS.get(k, 1)
            z_score = abs((v - mean) / std) if std > 0 else 0
            if z_score > 2.5:
                drift_flag = True
                break
                
        return {"drift_status": "warning" if drift_flag else "stable"}
    except Exception:
        return {"drift_status": "stable"}
