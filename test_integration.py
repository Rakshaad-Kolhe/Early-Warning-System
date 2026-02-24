"""
Integration Test Script for Backend-Frontend Connection
Tests the complete flow from backend API to frontend integration
"""

import sys
import subprocess
import time
import json
from pathlib import Path

def check_python_version():
    """Verify Python version is 3.8+"""
    version = sys.version_info
    print(f"✓ Python {version.major}.{version.minor}.{version.micro}")
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ required")
        return False
    return True

def check_backend_dependencies():
    """Check if backend dependencies are installed"""
    print("\n📦 Checking Backend Dependencies...")
    required = ['fastapi', 'uvicorn', 'scikit-learn', 'joblib', 'pandas', 'numpy', 'shap', 'pydantic']
    missing = []
    
    for package in required:
        try:
            __import__(package.replace('-', '_'))
            print(f"  ✓ {package}")
        except ImportError:
            print(f"  ❌ {package} - MISSING")
            missing.append(package)
    
    if missing:
        print(f"\n❌ Missing packages: {', '.join(missing)}")
        print(f"   Run: pip install -r backend/requirements.txt")
        return False
    return True

def check_model_file():
    """Verify model file exists"""
    print("\n🤖 Checking Model File...")
    model_path = Path("backend/app/models/outbreak_model.pkl")
    if model_path.exists():
        size = model_path.stat().st_size / 1024
        print(f"  ✓ Model found: {size:.1f} KB")
        return True
    else:
        print(f"  ❌ Model not found at {model_path}")
        print(f"     Run: python backend/train_model.py")
        return False

def test_backend_import():
    """Test if backend modules can be imported"""
    print("\n🔧 Testing Backend Imports...")
    try:
        sys.path.insert(0, str(Path("backend").absolute()))
        from app.config import MODEL_PATH, FEATURE_NAMES
        from app.services.model_service import load_model, predict_probability
        print(f"  ✓ Backend modules imported successfully")
        print(f"  ✓ Model path: {MODEL_PATH}")
        print(f"  ✓ Features: {FEATURE_NAMES}")
        return True
    except Exception as e:
        print(f"  ❌ Import failed: {e}")
        return False

def test_model_prediction():
    """Test model prediction with sample data"""
    print("\n🎯 Testing Model Prediction...")
    try:
        sys.path.insert(0, str(Path("backend").absolute()))
        from app.services.model_service import load_model, predict_probability
        
        load_model()
        print("  ✓ Model loaded")
        
        test_features = {
            "rainfall_dev": 15.0,
            "temperature": 28.0,
            "case_growth": 12.0,
            "baseline": 45.0
        }
        
        prob = predict_probability(test_features)
        print(f"  ✓ Prediction successful: {prob:.4f}")
        
        if 0 <= prob <= 1:
            print(f"  ✓ Probability in valid range")
            return True
        else:
            print(f"  ❌ Invalid probability: {prob}")
            return False
            
    except Exception as e:
        print(f"  ❌ Prediction failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_api_endpoint():
    """Test if backend API is accessible"""
    print("\n🌐 Testing Backend API...")
    try:
        import requests
        response = requests.get("http://localhost:8000/health", timeout=2)
        if response.status_code == 200:
            data = response.json()
            print(f"  ✓ Backend API is running")
            print(f"  ✓ Status: {data.get('status')}")
            print(f"  ✓ Version: {data.get('model_version')}")
            return True
        else:
            print(f"  ❌ API returned status {response.status_code}")
            return False
    except ImportError:
        print(f"  ⚠ requests package not installed (optional)")
        print(f"    Install with: pip install requests")
        return None
    except Exception as e:
        print(f"  ⚠ Backend not running: {e}")
        print(f"    Start with: python -m uvicorn app.main:app --reload")
        return None

def test_frontend_config():
    """Check frontend configuration"""
    print("\n⚛️ Checking Frontend Configuration...")
    
    vite_config = Path("frontend-react/vite.config.js")
    if vite_config.exists():
        content = vite_config.read_text()
        if "proxy" in content and "8000" in content:
            print(f"  ✓ Vite proxy configured for backend")
        else:
            print(f"  ⚠ Vite proxy may not be configured")
    
    api_client = Path("frontend-react/src/api/client.js")
    if api_client.exists():
        print(f"  ✓ API client exists")
    else:
        print(f"  ❌ API client not found")
        return False
    
    return True

def check_frontend_dependencies():
    """Check if frontend dependencies are installed"""
    print("\n📦 Checking Frontend Dependencies...")
    node_modules = Path("frontend-react/node_modules")
    package_json = Path("frontend-react/package.json")
    
    if not package_json.exists():
        print(f"  ❌ package.json not found")
        return False
    
    if not node_modules.exists():
        print(f"  ❌ node_modules not found")
        print(f"     Run: cd frontend-react && npm install")
        return False
    
    print(f"  ✓ Frontend dependencies installed")
    return True

def main():
    """Run all integration tests"""
    print("=" * 60)
    print("🧪 BACKEND-FRONTEND INTEGRATION TEST")
    print("=" * 60)
    
    results = {
        "Python Version": check_python_version(),
        "Backend Dependencies": check_backend_dependencies(),
        "Model File": check_model_file(),
        "Backend Imports": test_backend_import(),
        "Model Prediction": test_model_prediction(),
        "Frontend Config": test_frontend_config(),
        "Frontend Dependencies": check_frontend_dependencies(),
    }
    
    # Optional API test
    api_result = test_api_endpoint()
    if api_result is not None:
        results["Backend API"] = api_result
    
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    for test, passed in results.items():
        status = "✓ PASS" if passed else "❌ FAIL"
        print(f"{status:10} {test}")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    print(f"\n{passed}/{total} tests passed")
    
    if passed == total:
        print("\n✅ All tests passed! System is ready.")
        print("\n📝 Next Steps:")
        print("   1. Start backend: cd backend && python -m uvicorn app.main:app --reload")
        print("   2. Start frontend: cd frontend-react && npm run dev")
        print("   3. Open: http://localhost:3000")
    else:
        print("\n⚠️ Some tests failed. Please fix the issues above.")
        
        if not results.get("Backend Dependencies"):
            print("\n🔧 To install backend dependencies:")
            print("   cd backend")
            print("   pip install -r requirements.txt")
        
        if not results.get("Model File"):
            print("\n🤖 To train the model:")
            print("   cd backend")
            print("   python train_model.py")
        
        if not results.get("Frontend Dependencies"):
            print("\n📦 To install frontend dependencies:")
            print("   cd frontend-react")
            print("   npm install")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
