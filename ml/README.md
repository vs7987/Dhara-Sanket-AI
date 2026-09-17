# Dhara-Sanket AI — Machine Learning & Explainable AI (XAI) Engine

Delay-risk prediction and policy intervention simulation pipeline for **SIH26017** built with Python and Scikit-Learn.

---

## 🎯 Model Overview & Performance

* **Model Type**: Scikit-Learn `GradientBoostingClassifier` & `GradientBoostingRegressor`
* **Classifier Accuracy**: **87.33%** across High, Medium, and Low risk tiers
* **Regressor Precision**: Mean Absolute Error (MAE) of **3.58 points** on 0-100 risk scale
* **Model Artifact**: Serialized to `delay_model.joblib`

---

## 📊 Feature Importance Ranking

1. `active_court_stays` (**37.4%**): Active High Court or Civil Court injunctions.
2. `num_title_holders` (**14.5%**): Multi-claimant inheritance splits causing title disputes.
3. `rate_deviation_pct` (**13.8%**): Disparity between market expectations and government circle rates.
4. `gram_sabha_pending` (**13.4%**): Schedule V tribal consensus requirement under FRA 2006.
5. `deed_mismatch` (**5.0%**): Revenue mutation discrepancy vs Sub-Registrar deed.
6. `is_forest` (**4.8%**): Stage-I forest clearance and environmental buffer zone.
7. `area_ha` (**4.5%**): Scale of acquisition parcel footprint.
8. `infra_proximity_km` (**3.7%**): Proximity to urban / highway infrastructure.
9. `rr_required` (**2.9%**): Rehabilitation & Resettlement of displaced families.

---

## 🔬 Explainable AI (XAI) Formula

Maps raw features into the 5 transparent policy drivers presented in Slide 5 of the SIH pitch deck:
* **Land Title Dispute Factor**: $(N_{\text{titles}} \times 8.5) + (45 \text{ if deed mismatch else } 5)$
* **Market Value Factor**: $\max(10, \text{Rate Deviation \%} \times 0.95)$
* **Legal Risk Factor**: $(N_{\text{stays}} \times 45) + (20 \text{ if } N_{\text{titles}} > 4 \text{ else } 5)$
* **Infrastructure / Forest Factor**: $(55 \text{ if forest else } 15) + \max(0, 40 - \text{Proximity})$
* **R&R Friction Factor**: $(50 \text{ if R\&R else } 10) + (35 \text{ if Gram Sabha pending else } 5)$

---

## ⚙️ Retraining the Model

To generate a fresh synthetic dataset and retrain the model artifact:
```bash
python train_model.py
```
Outputs training metrics and saves `delay_model.joblib`.
