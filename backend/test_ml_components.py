"""
Test script for ML components (scraper and pretrained model)
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.scraper import HealthDataScraper, NewsSignalScraper
from app.pretrained_model import OutbreakPredictor
import asyncio


def test_scraper():
    """Test the health data scraper"""
    print("\n" + "=" * 60)
    print("TESTING WEB SCRAPER")
    print("=" * 60)
    
    try:
        scraper = HealthDataScraper()
        print("✓ Health scraper initialized")
        
        # Test news scraper
        news_scraper = NewsSignalScraper()
        signals = news_scraper.scrape_news_signals('Mumbai')
        print(f"✓ News scraper working - found {len(signals)} signals")
        
        print("\nSample news signals:")
        for signal in signals[:3]:
            print(f"  - {signal['headline']}")
        
        print("\n✓ Scraper tests passed!")
        return True
        
    except Exception as e:
        print(f"✗ Scraper test failed: {e}")
        return False


def test_pretrained_model():
    """Test the pretrained model"""
    print("\n" + "=" * 60)
    print("TESTING PRETRAINED MODEL")
    print("=" * 60)
    
    try:
        # Try to load existing model
        model_path = 'app/models/outbreak_model.pkl'
        if os.path.exists(model_path):
            model = OutbreakPredictor(model_path=model_path)
            print(f"✓ Loaded pretrained model from {model_path}")
        else:
            model = OutbreakPredictor()
            print("✓ Initialized new model (no pretrained model found)")
            
            # Train with synthetic data
            print("  Training with synthetic data...")
            X, y_risk, y_cases = model.generate_synthetic_training_data(500)
            model.train(X, y_risk, y_cases)
            print("✓ Model trained successfully")
        
        # Test prediction
        test_data = {
            'district': 'Test City',
            'population_density': 15000,
            'temperature': 30,
            'humidity': 75,
            'rainfall': 100,
            'hospital_capacity': 5000,
            'cases_last_week': 500,
            'cases_last_month': 1800,
            'mobility_index': 7,
            'vaccination_rate': 60,
            'healthcare_quality': 6
        }
        
        prediction = model.predict_district(test_data)
        print(f"\n✓ Prediction successful:")
        print(f"  Risk Level: {prediction['risk_level']}")
        print(f"  Risk Score: {prediction['risk_score']}")
        print(f"  Predicted Cases: {prediction['predicted_cases']}")
        print(f"  Confidence: {prediction['confidence']:.1%}")
        
        # Test time series
        forecast = model.predict_time_series(500, days=7)
        print(f"\n✓ Time series forecast generated ({len(forecast)} days)")
        
        print("\n✓ Model tests passed!")
        return True
        
    except Exception as e:
        print(f"✗ Model test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_integration():
    """Test integration between components"""
    print("\n" + "=" * 60)
    print("TESTING COMPONENT INTEGRATION")
    print("=" * 60)
    
    try:
        # Initialize both components
        scraper = HealthDataScraper()
        news_scraper = NewsSignalScraper()
        
        model_path = 'app/models/outbreak_model.pkl'
        if os.path.exists(model_path):
            model = OutbreakPredictor(model_path=model_path)
        else:
            model = OutbreakPredictor()
        
        # Get news signals
        signals = news_scraper.scrape_news_signals('Delhi')
        print(f"✓ Retrieved {len(signals)} news signals")
        
        # Make prediction based on signals
        test_data = {
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
        }
        
        prediction = model.predict_district(test_data)
        print(f"✓ Generated prediction for {test_data['district']}")
        print(f"  Risk: {prediction['risk_level']} ({prediction['risk_score']}/100)")
        
        print("\n✓ Integration tests passed!")
        return True
        
    except Exception as e:
        print(f"✗ Integration test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("ML COMPONENTS TEST SUITE")
    print("=" * 60)
    
    results = []
    
    # Run tests
    results.append(("Scraper", test_scraper()))
    results.append(("Pretrained Model", test_pretrained_model()))
    results.append(("Integration", test_integration()))
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    for name, passed in results:
        status = "✓ PASSED" if passed else "✗ FAILED"
        print(f"{name:20s} {status}")
    
    all_passed = all(result[1] for result in results)
    
    print("\n" + "=" * 60)
    if all_passed:
        print("ALL TESTS PASSED!")
        print("=" * 60)
        print("\nYour ML components are ready to use.")
        print("Start the backend server with:")
        print("  uvicorn app.main:app --reload --port 8000")
    else:
        print("SOME TESTS FAILED")
        print("=" * 60)
        print("\nPlease check the errors above and fix them.")
    print()
    
    return 0 if all_passed else 1


if __name__ == '__main__':
    exit(main())
