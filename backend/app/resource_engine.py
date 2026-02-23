def recommend_resources(risk):
    try:
        if risk < 30:
            return {
                "teams": 3,
                "fogging_units": 1,
                "estimated_response_time": "72 hours",
                "template": "Minimal Surveillance"
            }
        elif risk < 65:
            return {
                "teams": 5,
                "fogging_units": 2,
                "estimated_response_time": "48 hours",
                "template": "Targeted Intervention"
            }
        else:
            return {
                "teams": 15,
                "fogging_units": 5,
                "estimated_response_time": "24 hours",
                "template": "Emergency Response"
            }
    except Exception:
        return None
