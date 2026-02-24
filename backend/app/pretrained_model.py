"""
Pretrained Model for Outbreak Prediction
Uses ensemble of ML models for disease outbreak forecasting
"""
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib
import pickle
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class OutbreakPredictor:
    """Pretrained model for outbreak risk prediction"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.classifier = None
        self.regressor = None
        self.scaler = StandardScaler()
        self.feature_names = [
            'population_density', 'temperature', 'humidity', 'rainfall',
            'hospital_capacity', 'cases_last_week', 'cases_last_month',
            'mobility_index', 'vaccination_rate', 'healthcare_quality'
        ]
        
        if model_path:
            self.load_model(model_path)
        else:
            self._initialize_models()
    
    def _initialize_models(self):
        """Initialize pretrained models with default parameters"""
        # Classification model for risk level
        self.classifier = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            random_state=42
        )
        
        # Regression model for case count prediction
        self.regressor = GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        
        logger.info("Initialized pretrained models")
    
    def generate_synthetic_training_data(self, n_samples: int = 1000) -> Tuple[pd.DataFrame, np.ndarray, np.ndarray]:
        """Generate synthetic training data for demonstration"""
        np.random.seed(42)
        
        data = {
            'population_density': np.random.uniform(100, 25000, n_samples),
            'temperature': np.random.uniform(15, 40, n_samples),
            'humidity': np.random.uniform(30, 95, n_samples),
            'rainfall': np.random.uniform(0, 300, n_samples),
            'hospital_capacity': np.random.uniform(500, 20000, n_samples),
            'cases_last_week': np.random.uniform(0, 5000, n_samples),
            'cases_last_month': np.random.uniform(0, 20000, n_samples),
            'mobility_index': np.random.uniform(0, 10, n_samples),
            'vaccination_rate': np.random.uniform(0, 100, n_samples),
            'healthcare_quality': np.random.uniform(1, 10, n_samples)
        }
        
        df = pd.DataFrame(data)
        
        # Generate risk labels (0=low, 1=medium, 2=high)
        risk_score = (
            df['population_density'] / 5000 +
            df['cases_last_week'] / 1000 +
            df['humidity'] / 30 +
            df['rainfall'] / 100 -
            df['hospital_capacity'] / 5000 -
            df['vaccination_rate'] / 50
        )
        
        y_risk = pd.cut(risk_score, bins=3, labels=[0, 1, 2]).astype(int)
        
        # Generate case predictions
        y_cases = (
            df['cases_last_week'] * 1.2 +
            df['population_density'] * 0.1 +
            df['humidity'] * 10 +
            np.random.normal(0, 100, n_samples)
        ).clip(0)
        
        return df, y_risk.values, y_cases.values
    
    def train(self, X: pd.DataFrame, y_risk: np.ndarray, y_cases: np.ndarray):
        """Train the models"""
        logger.info("Training outbreak prediction models...")
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train classifier
        self.classifier.fit(X_scaled, y_risk)
        logger.info(f"Classifier accuracy: {self.classifier.score(X_scaled, y_risk):.3f}")
        
        # Train regressor
        self.regressor.fit(X_scaled, y_cases)
        logger.info(f"Regressor R² score: {self.regressor.score(X_scaled, y_cases):.3f}")
        
        logger.info("Training completed")
    
    def predict_risk(self, features: Dict) -> Dict:
        """Predict outbreak risk for given features"""
        # Convert to DataFrame
        X = pd.DataFrame([features])[self.feature_names]
        X_scaled = self.scaler.transform(X)
        
        # Predict risk level
        risk_level = self.classifier.predict(X_scaled)[0]
        risk_proba = self.classifier.predict_proba(X_scaled)[0]
        
        # Predict case count
        predicted_cases = max(0, self.regressor.predict(X_scaled)[0])
        
        # Map risk level
        risk_map = {0: 'low', 1: 'medium', 2: 'high'}
        
        return {
            'risk_level': risk_map[risk_level],
            'risk_score': int(risk_proba[risk_level] * 100),
            'predicted_cases': int(predicted_cases),
            'confidence': float(max(risk_proba)),
            'probabilities': {
                'low': float(risk_proba[0]),
                'medium': float(risk_proba[1]),
                'high': float(risk_proba[2])
            }
        }
    
    def predict_district(self, district_data: Dict) -> Dict:
        """Predict outbreak for a district"""
        features = {
            'population_density': district_data.get('population_density', 5000),
            'temperature': district_data.get('temperature', 30),
            'humidity': district_data.get('humidity', 70),
            'rainfall': district_data.get('rainfall', 50),
            'hospital_capacity': district_data.get('hospital_capacity', 5000),
            'cases_last_week': district_data.get('cases_last_week', 100),
            'cases_last_month': district_data.get('cases_last_month', 400),
            'mobility_index': district_data.get('mobility_index', 5),
            'vaccination_rate': district_data.get('vaccination_rate', 60),
            'healthcare_quality': district_data.get('healthcare_quality', 6)
        }
        
        prediction = self.predict_risk(features)
        
        # Add reasoning
        reasoning = self._generate_reasoning(features, prediction)
        prediction['reasoning'] = reasoning
        
        return prediction
    
    def _generate_reasoning(self, features: Dict, prediction: Dict) -> List[str]:
        """Generate human-readable reasoning for prediction"""
        reasoning = []
        
        if features['population_density'] > 15000:
            reasoning.append(f"High population density ({features['population_density']:.0f}/km²) increases transmission risk")
        
        if features['humidity'] > 75:
            reasoning.append(f"High humidity ({features['humidity']:.0f}%) creates favorable conditions for vectors")
        
        if features['rainfall'] > 100:
            reasoning.append(f"Heavy rainfall ({features['rainfall']:.0f}mm) may create breeding sites")
        
        if features['cases_last_week'] > 500:
            reasoning.append(f"Significant case load last week ({features['cases_last_week']:.0f} cases)")
        
        if features['hospital_capacity'] < 3000:
            reasoning.append(f"Limited hospital capacity ({features['hospital_capacity']:.0f} beds) may strain resources")
        
        if features['mobility_index'] > 7:
            reasoning.append("High mobility index facilitates disease spread")
        
        if features['vaccination_rate'] < 50:
            reasoning.append(f"Low vaccination rate ({features['vaccination_rate']:.0f}%) reduces population immunity")
        
        if not reasoning:
            reasoning.append("Conditions are within normal parameters")
        
        return reasoning[:5]  # Limit to top 5
    
    def predict_time_series(self, current_cases: int, days: int = 14) -> List[Dict]:
        """Predict case trajectory over time"""
        predictions = []
        cases = current_cases
        
        for day in range(1, days + 1):
            # Simple exponential growth model with noise
            growth_rate = np.random.uniform(1.05, 1.15)
            cases = cases * growth_rate + np.random.normal(0, 10)
            cases = max(0, cases)
            
            predictions.append({
                'day': day,
                'date': (datetime.now() + timedelta(days=day)).strftime('%Y-%m-%d'),
                'predicted_cases': int(cases),
                'lower_bound': int(cases * 0.8),
                'upper_bound': int(cases * 1.2)
            })
        
        return predictions
    
    def save_model(self, path: str = 'models/outbreak_model.pkl'):
        """Save trained model"""
        model_data = {
            'classifier': self.classifier,
            'regressor': self.regressor,
            'scaler': self.scaler,
            'feature_names': self.feature_names,
            'version': '1.0',
            'trained_date': datetime.now().isoformat()
        }
        
        with open(path, 'wb') as f:
            pickle.dump(model_data, f)
        
        logger.info(f"Model saved to {path}")
    
    def load_model(self, path: str):
        """Load trained model"""
        try:
            with open(path, 'rb') as f:
                model_data = pickle.load(f)
            
            self.classifier = model_data['classifier']
            self.regressor = model_data['regressor']
            self.scaler = model_data['scaler']
            self.feature_names = model_data['feature_names']
            
            logger.info(f"Model loaded from {path}")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            self._initialize_models()


class EnsemblePredictor:
    """Ensemble of multiple prediction models"""
    
    def __init__(self):
        self.models = []
        self.weights = []
    
    def add_model(self, model: OutbreakPredictor, weight: float = 1.0):
        """Add a model to the ensemble"""
        self.models.append(model)
        self.weights.append(weight)
    
    def predict(self, features: Dict) -> Dict:
        """Predict using ensemble"""
        if not self.models:
            raise ValueError("No models in ensemble")
        
        predictions = [model.predict_risk(features) for model in self.models]
        
        # Weighted average of risk scores
        total_weight = sum(self.weights)
        avg_risk_score = sum(
            pred['risk_score'] * weight 
            for pred, weight in zip(predictions, self.weights)
        ) / total_weight
        
        # Majority vote for risk level
        risk_levels = [pred['risk_level'] for pred in predictions]
        risk_level = max(set(risk_levels), key=risk_levels.count)
        
        return {
            'risk_level': risk_level,
            'risk_score': int(avg_risk_score),
            'confidence': float(np.mean([pred['confidence'] for pred in predictions])),
            'ensemble_size': len(self.models)
        }


# Utility functions
def create_and_train_model(save_path: str = 'backend/app/models/outbreak_model.pkl') -> OutbreakPredictor:
    """Create and train a new model"""
    model = OutbreakPredictor()
    
    # Generate training data
    X, y_risk, y_cases = model.generate_synthetic_training_data(n_samples=2000)
    
    # Train
    model.train(X, y_risk, y_cases)
    
    # Save
    model.save_model(save_path)
    
    return model


if __name__ == '__main__':
    # Create and train model
    print("Creating and training outbreak prediction model...")
    model = create_and_train_model()
    
    # Test prediction
    test_data = {
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
    
    print("\nTesting prediction for Mumbai:")
    prediction = model.predict_district(test_data)
    print(f"Risk Level: {prediction['risk_level']}")
    print(f"Risk Score: {prediction['risk_score']}")
    print(f"Predicted Cases: {prediction['predicted_cases']}")
    print(f"Confidence: {prediction['confidence']:.2%}")
    print("\nReasoning:")
    for reason in prediction['reasoning']:
        print(f"  - {reason}")
    
    # Test time series
    print("\n14-day forecast:")
    forecast = model.predict_time_series(1240, days=14)
    for pred in forecast[:7]:
        print(f"  Day {pred['day']}: {pred['predicted_cases']} cases")
