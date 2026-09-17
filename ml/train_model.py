# ml/train_model.py
"""
Trains the Dhara-Sanket AI delay risk model using Scikit-Learn.
Combines:
1. Classifier: Predicts Risk Category (Low / Medium / High)
2. Regressor: Predicts Continuous Risk Score (0-100) & Estimated Delay (Months)
3. Feature Importances: Basis for Explainable AI (XAI)
"""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.metrics import classification_report, accuracy_score, mean_absolute_error

from synthetic_dataset import generate_dataset

FEATURE_COLS = [
    'area_ha',
    'num_title_holders',
    'rate_deviation_pct',
    'active_court_stays',
    'deed_mismatch',
    'gram_sabha_pending',
    'is_forest',
    'rr_required',
    'infra_proximity_km'
]

def train_and_save():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, 'synthetic_dataset.csv')

    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
    else:
        print("Generating synthetic dataset...")
        df = generate_dataset(num_samples=750)
        df.to_csv(csv_path, index=False)

    X = df[FEATURE_COLS]
    y_class = df['risk_level']
    y_score = df['risk_score']

    # Train-test split
    X_train, X_test, y_train_class, y_test_class, y_train_score, y_test_score = train_test_split(
        X, y_class, y_score, test_size=0.2, random_state=42, stratify=y_class
    )

    print(f"Training on {len(X_train)} samples, testing on {len(X_test)} samples...")

    # 1. Classification Model
    clf = GradientBoostingClassifier(n_estimators=120, learning_rate=0.08, max_depth=3, random_state=42)
    clf.fit(X_train, y_train_class)
    y_pred_class = clf.predict(X_test)
    acc = accuracy_score(y_test_class, y_pred_class)
    print(f"\n[Classifier] Accuracy: {acc * 100:.2f}%")
    print(classification_report(y_test_class, y_pred_class))

    # 2. Regression Model (Risk Score 0-100)
    reg = GradientBoostingRegressor(n_estimators=120, learning_rate=0.08, max_depth=3, random_state=42)
    reg.fit(X_train, y_train_score)
    y_pred_score = reg.predict(X_test)
    mae = mean_absolute_error(y_test_score, y_pred_score)
    print(f"[Regressor] Mean Absolute Error on Risk Score: {mae:.2f} points")

    # 3. Compute Feature Importances
    feature_importances = dict(zip(FEATURE_COLS, [round(float(v), 4) for v in clf.feature_importances_]))
    print("\nFeature Importances:")
    for k, v in sorted(feature_importances.items(), key=lambda x: x[1], reverse=True):
        print(f"  - {k}: {v * 100:.1f}%")

    # 4. Save Artifact
    model_artifact = {
        'classifier': clf,
        'regressor': reg,
        'feature_cols': FEATURE_COLS,
        'feature_importances': feature_importances,
        'metrics': {
            'accuracy': float(acc),
            'mae': float(mae),
            'samples': len(df)
        }
    }

    model_path = os.path.join(script_dir, 'delay_model.joblib')
    joblib.dump(model_artifact, model_path)
    print(f"\nModel artifact successfully saved to {model_path}")

if __name__ == '__main__':
    train_and_save()
