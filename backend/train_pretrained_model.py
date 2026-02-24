"""
Script to train and save the pretrained outbreak prediction model
"""
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.pretrained_model import OutbreakPredictor, create_and_train_model
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def main():
    """Train and save the model"""
    logger.info("=" * 60)
    logger.info("OUTBREAK PREDICTION MODEL TRAINING")
    logger.info("=" * 60)
    
    # Create models directory if it doesn't exist
    models_dir = 'app/models'
    if not os.path.exists(models_dir):
        os.makedirs(models_dir)
        logger.info(f"Created directory: {models_dir}")
    
    # Train model
    model_path = os.path.join(models_dir, 'outbreak_model.pkl')
    logger.info(f"\nTraining model and saving to: {model_path}")
    
    model = create_and_train_model(save_path=model_path)
    
    logger.info("\n" + "=" * 60)
    logger.info("MODEL TRAINING COMPLETED SUCCESSFULLY")
    logger.info("=" * 60)
    
    # Test the model
    logger.info("\nTesting model with sample data...")
    
    test_districts = [
        {
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
        },
        {
            'district': 'Delhi',
            'population_density': 11000,
            'temperature': 35,
            'humidity': 65,
            'rainfall': 12,
            'hospital_capacity': 9200,
            'cases_last_week': 1580,
            'cases_last_month': 5800,
            'mobility_index': 9,
            'vaccination_rate': 70,
            'healthcare_quality': 8
        },
        {
            'district': 'Bengaluru',
            'population_density': 4400,
            'temperature': 28,
            'humidity': 68,
            'rainfall': 28,
            'hospital_capacity': 8900,
            'cases_last_week': 720,
            'cases_last_month': 2600,
            'mobility_index': 6,
            'vaccination_rate': 75,
            'healthcare_quality': 8
        }
    ]
    
    print("\n" + "=" * 60)
    print("SAMPLE PREDICTIONS")
    print("=" * 60)
    
    for district_data in test_districts:
        print(f"\n{district_data['district']}:")
        print("-" * 40)
        
        prediction = model.predict_district(district_data)
        
        print(f"Risk Level: {prediction['risk_level'].upper()}")
        print(f"Risk Score: {prediction['risk_score']}/100")
        print(f"Predicted Cases: {prediction['predicted_cases']}")
        print(f"Confidence: {prediction['confidence']:.1%}")
        print("\nKey Factors:")
        for i, reason in enumerate(prediction['reasoning'], 1):
            print(f"  {i}. {reason}")
    
    # Test time series prediction
    print("\n" + "=" * 60)
    print("7-DAY FORECAST (Mumbai)")
    print("=" * 60)
    
    forecast = model.predict_time_series(1240, days=7)
    print("\nDay | Date       | Predicted Cases | Range")
    print("-" * 55)
    for pred in forecast:
        print(f" {pred['day']:2d} | {pred['date']} | {pred['predicted_cases']:6d}        | {pred['lower_bound']:5d}-{pred['upper_bound']:5d}")
    
    print("\n" + "=" * 60)
    print("Model ready for use in the application!")
    print("=" * 60)


if __name__ == '__main__':
    main()
