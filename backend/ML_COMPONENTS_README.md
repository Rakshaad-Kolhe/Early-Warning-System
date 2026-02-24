# ML Components - Scraper & Pretrained Model

This document describes the machine learning components added to the backend system.

## Components Overview

### 1. Web Scraper (`app/scraper.py`)
Scrapes health outbreak data from multiple sources:
- **WHO Disease Outbreak News**
- **CDC Outbreak Listings**
- **News signals for disease indicators**

**Features:**
- Asynchronous scraping with `aiohttp`
- HTML parsing with BeautifulSoup
- Location extraction from text
- Severity estimation
- Configurable sources

**Usage:**
```python
from app.scraper import HealthDataScraper, NewsSignalScraper

# Health data scraper
scraper = HealthDataScraper()
data = scraper.scrape_sync()

# News signals
news_scraper = NewsSignalScraper()
signals = news_scraper.scrape_news_signals('Mumbai')
```

### 2. Pretrained Model (`app/pretrained_model.py`)
Machine learning model for outbreak prediction using ensemble methods:
- **RandomForestClassifier** for risk level classification
- **GradientBoostingRegressor** for case count prediction

**Features:**
- 10 input features (population density, climate, healthcare metrics)
- Risk level prediction (low/medium/high)
- Case count forecasting
- Time series predictions
- Confidence scores
- Human-readable reasoning

**Input Features:**
1. `population_density` - People per km²
2. `temperature` - Current temperature (°C)
3. `humidity` - Humidity percentage
4. `rainfall` - Rainfall amount (mm)
5. `hospital_capacity` - Available beds
6. `cases_last_week` - Recent case count
7. `cases_last_month` - Monthly case count
8. `mobility_index` - Population movement (0-10)
9. `vaccination_rate` - Vaccination coverage (%)
10. `healthcare_quality` - Healthcare quality score (1-10)

**Usage:**
```python
from app.pretrained_model import OutbreakPredictor

# Load model
model = OutbreakPredictor(model_path='app/models/outbreak_model.pkl')

# Make prediction
district_data = {
    'district': 'Mumbai',
    'population_density': 20000,
    'temperature': 32,
    'humidity': 78,
    'rainfall': 145,
    'hospital_capacity': 8000,
    'cases_last_week': 1240,
    'cases_last_month': 4500,
    'mobility_index': 8,
    'vaccination_rate': 65,
    'healthcare_quality': 7
}

prediction = model.predict_district(district_data)
# Returns: risk_level, risk_score, predicted_cases, confidence, reasoning
```

### 3. Database Models (`app/models/outbreak_model.py`)
SQLAlchemy models for storing data:
- **OutbreakData** - Scraped outbreak information
- **PredictionHistory** - Historical predictions
- **ModelMetrics** - Model performance tracking

### 4. Services

#### Scraper Service (`app/services/scraper_service.py`)
Manages scraping operations:
- Scheduled scraping (every 6 hours)
- Data storage in database
- Aggregation by location
- Severity distribution analysis

#### API Routes

**Scraper Routes** (`app/routes/scraper_routes.py`):
- `GET /api/scraper/status` - Get scraper status
- `POST /api/scraper/scrape` - Trigger manual scrape
- `GET /api/scraper/outbreaks/recent` - Get recent outbreaks
- `GET /api/scraper/outbreaks/by-location` - Aggregate by location
- `GET /api/scraper/outbreaks/severity` - Severity distribution
- `GET /api/scraper/news/signals` - Get news signals

**Prediction Routes** (`app/routes/prediction_routes.py`):
- `POST /api/predictions/district` - Predict district risk
- `POST /api/predictions/timeseries` - Time series forecast
- `GET /api/predictions/history/{district}` - Prediction history
- `GET /api/predictions/model/info` - Model information
- `POST /api/predictions/batch` - Batch predictions
- `GET /api/predictions/statistics` - Prediction statistics

## Setup Instructions

### Quick Setup
```bash
cd backend
setup_ml_components.bat
```

### Manual Setup

1. **Install dependencies:**
```bash
pip install aiohttp beautifulsoup4 lxml sqlalchemy python-multipart
```

2. **Train the model:**
```bash
python train_pretrained_model.py
```

3. **Test components:**
```bash
python test_ml_components.py
```

4. **Start the server:**
```bash
uvicorn app.main:app --reload --port 8000
```

## API Examples

### Scrape Health Data
```bash
curl -X POST http://localhost:8000/api/scraper/scrape
```

### Predict District Risk
```bash
curl -X POST http://localhost:8000/api/predictions/district \
  -H "Content-Type: application/json" \
  -d '{
    "district": "Mumbai",
    "population_density": 20000,
    "temperature": 32,
    "humidity": 78,
    "rainfall": 145,
    "hospital_capacity": 8000,
    "cases_last_week": 1240,
    "cases_last_month": 4500,
    "mobility_index": 8,
    "vaccination_rate": 65,
    "healthcare_quality": 7
  }'
```

### Get Time Series Forecast
```bash
curl -X POST http://localhost:8000/api/predictions/timeseries \
  -H "Content-Type