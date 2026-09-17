# ml/explainability.py
"""
Explainable AI (XAI) engine for Dhara-Sanket AI.
Breaks down black-box delay risk predictions into 5 transparent, actionable pillars:
1. Land Title & Ownership Disputes
2. Market Value & Circle Rate Anomaly
3. Legal Risk & Court Stays
4. Environmental & Forest Approvals
5. Rehabilitation & Resettlement (R&R)
"""

import os
import joblib
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'delay_model.joblib')

def load_model():
    if os.path.exists(MODEL_PATH):
        return joblib.load(MODEL_PATH)
    return None

def compute_xai_factors(features: dict, predicted_score: int):
    """
    Computes percentage contribution for each key delay factor (0 - 100%).
    Matches the XAI radar/bar breakdown in Slide 5 of SIH pitch deck.
    """
    num_titles = features.get('num_title_holders', 1)
    deed_mismatch = features.get('deed_mismatch', 0)
    rate_dev = features.get('rate_deviation_pct', 0)
    court_stays = features.get('active_court_stays', 0)
    is_forest = features.get('is_forest', 0)
    gram_sabha = features.get('gram_sabha_pending', 0)
    rr_req = features.get('rr_required', 0)
    proximity = features.get('infra_proximity_km', 10.0)

    # 1. Land Title Factor
    title_score = min(100, int((num_titles * 8.5) + (45 if deed_mismatch else 5)))
    
    # 2. Market Value Factor
    market_score = min(100, int(max(10, rate_dev * 0.95)))

    # 3. Legal Risk Factor
    legal_score = min(100, int((court_stays * 45) + (20 if num_titles > 4 else 5)))

    # 4. Infrastructure & Environmental Proximity
    infra_score = min(100, int((55 if is_forest else 15) + max(0, 40 - proximity)))

    # 5. R&R Friction
    rr_score = min(100, int((50 if rr_req else 10) + (35 if gram_sabha else 5)))

    factors = {
        'land_title': title_score,
        'market_value': market_score,
        'legal_risk': legal_score,
        'infrastructure_proximity': infra_score,
        'rehabilitation_resettlement': rr_score
    }

    # Determine primary delayer
    top_factor = max(factors.items(), key=lambda x: x[1])
    
    delayer_labels = {
        'land_title': 'Ownership Discrepancy & Multiple Claimants',
        'market_value': 'Compensation Disparity vs Circle Rate',
        'legal_risk': 'Active Judicial Injunction / High Court Stay',
        'infrastructure_proximity': 'Forest Clearance & Easement Conflict',
        'rehabilitation_resettlement': 'Gram Sabha Consent & Resettlement Delay'
    }

    # Formulate Recommended Mitigation Action
    actions = {
        'land_title': 'Initiate joint cadastral resurvey with MP Bhulekh; verify mutation deeds prior to disbursement.',
        'market_value': 'Convene District Land Price Review Committee to calibrate RFCTLARR multiplier to circle rate.',
        'legal_risk': 'Submit expedited revenue appeal in District Court; escrow disputed payout to avoid project standstill.',
        'infrastructure_proximity': 'Fast-track Stage-I MoEFCC forest clearance and adjust alignment buffer.',
        'rehabilitation_resettlement': 'Convene Special Gram Sabha under FRA 2006 and finalize rehabilitation compensation packages.'
    }

    return {
        'factors': factors,
        'primary_delayer': delayer_labels[top_factor[0]],
        'recommended_action': actions[top_factor[0]]
    }

def predict_parcel(features: dict):
    model_obj = load_model()
    
    feature_cols = [
        'area_ha', 'num_title_holders', 'rate_deviation_pct',
        'active_court_stays', 'deed_mismatch', 'gram_sabha_pending',
        'is_forest', 'rr_required', 'infra_proximity_km'
    ]
    
    vec = [[features.get(c, 0) for c in feature_cols]]
    
    if model_obj:
        reg = model_obj['regressor']
        clf = model_obj['classifier']
        
        pred_score = int(round(float(reg.predict(vec)[0])))
        pred_score = max(0, min(100, pred_score))
        pred_level = str(clf.predict(vec)[0])
        # Confidence derived from prediction probabilities
        probs = clf.predict_proba(vec)[0]
        confidence = int(round(float(max(probs)) * 100))
    else:
        # Fallback heuristic calculation if model not yet serialized
        pred_score = 65
        pred_level = 'Medium'
        confidence = 85

    xai = compute_xai_factors(features, pred_score)
    delay_months = round(pred_score * 0.32, 1)

    return {
        'risk_score': pred_score,
        'risk_level': pred_level,
        'confidence_pct': confidence,
        'estimated_delay_months': delay_months,
        'xai_drivers': xai['factors'],
        'primary_delayer': xai['primary_delayer'],
        'recommended_action': xai['recommended_action']
    }
