import sys
from app.routes.prediction_routes import predict
from app.schemas import PredictionInput
from app.database import init_db
from app.services import model_service, explain_service

init_db()
model_service.load_model()
explain_service.init_explainer()

inp = PredictionInput(
    district="Pune",
    rainfall_dev=20.0,
    temperature=30.0,
    case_growth=10.0,
    baseline=50.0
)

try:
    predict(inp)
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
