# ml/synthetic_dataset.py
"""
Generates realistic training data for Dhara-Sanket AI delay risk prediction model.
Factors are aligned with RFCTLARR 2013 guidelines and ground reality in Madhya Pradesh:
- Multiple title disputes & inheritance splits
- Circle rate vs market value disparities
- Judicial injunctions / High Court stays
- Forest clearance & FRA 2006 compliance
- Rehabilitation & Resettlement (R&R) friction
"""

import os
import random

DISTRICTS = ['Bhopal', 'Indore', 'Dewas', 'Raisen', 'Sehore', 'Jabalpur', 'Ujjain']
LAND_TYPES = ['Agricultural', 'Private Commercial', 'Forest/Eco-sensitive', 'Tribal Schedule V', 'Government Wasteland']

def generate_dataset(num_samples=600, random_seed=42):
    import numpy as np
    import pandas as pd
    random.seed(random_seed)
    np.random.seed(random_seed)

    data = []

    for i in range(num_samples):
        district = random.choice(DISTRICTS)
        land_type = random.choices(
            LAND_TYPES, 
            weights=[0.45, 0.20, 0.15, 0.12, 0.08], 
            k=1
        )[0]

        # Area in hectares
        area_ha = round(random.uniform(0.5, 85.0), 2)

        # Number of joint title holders (inheritance splits cause friction)
        if land_type == 'Tribal Schedule V':
            num_title_holders = random.randint(3, 14)
        elif land_type == 'Agricultural':
            num_title_holders = random.randint(1, 8)
        else:
            num_title_holders = random.randint(1, 4)

        # Circle rate vs Market value (in Lakh INR / ha)
        base_circle = random.uniform(25.0, 110.0)
        circle_rate = round(base_circle, 2)
        market_multiplier = random.uniform(0.95, 2.40)
        market_rate = round(circle_rate * market_multiplier, 2)
        rate_deviation_pct = round(((market_rate - circle_rate) / circle_rate) * 100, 1)

        # Regulatory & Judicial Indicators
        is_tribal = 1 if land_type == 'Tribal Schedule V' else 0
        is_forest = 1 if land_type == 'Forest/Eco-sensitive' else 0
        
        stay_prob = 0.15 + (0.05 * min(num_title_holders, 6)) + (0.25 if rate_deviation_pct > 50 else 0)
        active_court_stays = 1 if random.random() < stay_prob else 0
        if active_court_stays and random.random() < 0.25:
            active_court_stays = 2

        deed_mismatch = 1 if random.random() < (0.20 if land_type != 'Government Wasteland' else 0.05) else 0

        if is_tribal or is_forest:
            gram_sabha_pending = 1 if random.random() < 0.65 else 0
        else:
            gram_sabha_pending = 0

        rr_required = 1 if (area_ha > 15.0 or is_tribal) and random.random() < 0.70 else 0
        infra_proximity_km = round(random.uniform(0.5, 45.0), 1)

        # Delay Calculation Formula
        delay_score = 0.0
        delay_score += (num_title_holders - 1) * 3.5
        if deed_mismatch:
            delay_score += 15.0

        if rate_deviation_pct > 80:
            delay_score += 24.0
        elif rate_deviation_pct > 40:
            delay_score += 14.0
        elif rate_deviation_pct > 20:
            delay_score += 7.0

        delay_score += active_court_stays * 22.0

        if gram_sabha_pending:
            delay_score += 18.0
        if is_forest:
            delay_score += 12.0

        if rr_required:
            delay_score += 10.0

        delay_score += random.gauss(0, 4.0)
        delay_score = max(0.0, min(100.0, delay_score))

        risk_score = int(round(delay_score))
        delay_months = round(risk_score * 0.32, 1)

        if risk_score >= 65:
            risk_level = 'High'
        elif risk_score >= 38:
            risk_level = 'Medium'
        else:
            risk_level = 'Low'

        data.append({
            'parcel_id': f"PCL-MP-{1000 + i}",
            'district': district,
            'land_type': land_type,
            'area_ha': area_ha,
            'num_title_holders': num_title_holders,
            'circle_rate_lakh': circle_rate,
            'market_rate_lakh': market_rate,
            'rate_deviation_pct': rate_deviation_pct,
            'active_court_stays': active_court_stays,
            'deed_mismatch': deed_mismatch,
            'gram_sabha_pending': gram_sabha_pending,
            'is_forest': is_forest,
            'rr_required': rr_required,
            'infra_proximity_km': infra_proximity_km,
            'delay_months': delay_months,
            'risk_score': risk_score,
            'risk_level': risk_level
        })

    df = pd.DataFrame(data)
    return df

if __name__ == '__main__':
    import pandas as pd
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, 'synthetic_dataset.csv')
    df = generate_dataset()
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} records saved to {output_path}")
    print("Risk distribution:")
    print(df['risk_level'].value_counts())
