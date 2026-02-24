import urllib.request
import json
import urllib.error

req = urllib.request.Request(
    'http://localhost:8000/predict',
    data=json.dumps({"district": "Pune", "rainfall_dev": 20.0, "temperature": 30.0, "case_growth": 10.0, "baseline": 50.0}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(e.read().decode('utf-8'))
