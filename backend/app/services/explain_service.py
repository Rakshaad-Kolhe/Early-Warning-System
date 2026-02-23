import shap
import numpy as np
import pandas as pd
import joblib
from app.config import MODEL_PATH, FEATURE_NAMES

_explainer = None


def init_explainer():
    global _explainer
    model = joblib.load(MODEL_PATH)
    _explainer = shap.TreeExplainer(model)
    print("SHAP TreeExplainer initialized.")


def explain(features: dict) -> list:
    if _explainer is None:
        raise RuntimeError("Explainer not initialized. Call init_explainer() first.")

    df = pd.DataFrame([features])[FEATURE_NAMES]
    shap_values = _explainer.shap_values(df)

    # RandomForest binary classifier returns list of 2 arrays (one per class)
    # or a 3D ndarray (n_samples, n_features, n_classes)
    if isinstance(shap_values, list):
        values = np.array(shap_values[1][0])
    elif shap_values.ndim == 3:
        values = shap_values[0, :, 1]
    else:
        values = shap_values[0]

    contributions = dict(zip(FEATURE_NAMES, values.tolist()))

    sorted_contribs = sorted(
        contributions.items(), key=lambda x: abs(x[1]), reverse=True
    )

    return [{"feature": k, "contribution": round(float(v), 4)} for k, v in sorted_contribs]
