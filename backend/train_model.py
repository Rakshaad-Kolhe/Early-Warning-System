import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

np.random.seed(42)

data = []
for _ in range(3000):
    rainfall = np.random.normal(0, 25)
    temp = np.random.normal(27, 2)
    growth = np.random.normal(15, 12)
    baseline = np.random.normal(50, 10)

    outbreak = 1 if (
        growth > 20 and rainfall > 10 and 24 <= temp <= 29
    ) else 0

    data.append([rainfall, temp, growth, baseline, outbreak])

df = pd.DataFrame(data, columns=[
    "rainfall_dev", "temperature", "case_growth", "baseline", "outbreak"
])

X = df.drop("outbreak", axis=1)
y = df["outbreak"]

model = RandomForestClassifier(
    n_estimators=500,
    max_depth=8,
    random_state=42
)

model.fit(X, y)

os.makedirs("app/models", exist_ok=True)
joblib.dump(model, "app/models/outbreak_model.pkl")

print(f"Model trained on {len(df)} samples.")
print(f"Outbreak ratio: {y.mean():.2%}")
print("Saved to app/models/outbreak_model.pkl")
