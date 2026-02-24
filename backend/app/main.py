from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.services import model_service, explain_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    model_service.load_model()
    explain_service.init_explainer()
    print("Startup complete — model loaded, DB initialized, SHAP ready.")
    yield
    print("Shutting down.")


app = FastAPI(
    title="District Early Warning System",
    description="Multi-district outbreak risk prediction with SHAP explainability",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routes.prediction_routes import router as prediction_router
from app.routes.scraper_routes import router as scraper_router
from app.routes.prediction_routes import router as ml_prediction_router

app.include_router(prediction_router)
app.include_router(scraper_router)
app.include_router(ml_prediction_router)

@app.get("/")
async def root():
    return {
        "message": "District Early Warning System API",
        "version": "1.0.0",
        "endpoints": {
            "predictions": "/api/predict",
            "scraper": "/api/scraper",
            "ml_predictions": "/api/predictions"
        }
    }

# Triggering uvicorn reload
