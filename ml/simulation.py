# ml/simulation.py
"""
What-If Simulation Engine for Dhara-Sanket AI (Slide 2 & 5 Key USP).
Simulates how policy interventions and administrative actions reduce land acquisition risk:
1. Increasing RFCTLARR compensation multiplier to match market expectations.
2. Fast-tracking mutation & title verification in revenue fast-track courts.
3. Special Lok Adalat tribunals for court injunction resolution.
4. Pre-emptive Gram Sabha sessions under FRA 2006.
"""

from explainability import predict_parcel

def run_what_if_simulation(
    base_features: dict,
    compensation_multiplier: float = 1.0,     # 1.0x to 2.5x multiplier
    title_fast_tracked: bool = False,         # Resolves deed mismatches
    court_stay_resolved: bool = False,        # Resolves active stays via Lok Adalat
    gram_sabha_cleared: bool = False,         # Obtains FRA consent in advance
    rehab_package_enhanced: bool = False      # Eliminates R&R friction
):
    # 1. Baseline prediction
    baseline = predict_parcel(base_features)
    orig_score = baseline['risk_score']
    orig_delay = baseline['estimated_delay_months']

    # 2. Modify features based on simulated interventions
    simulated_features = dict(base_features)

    # Intervention A: Higher compensation reduces dispute disparity
    if compensation_multiplier > 1.0:
        reduction_factor = max(0.2, 1.0 - (compensation_multiplier - 1.0) * 0.6)
        simulated_features['rate_deviation_pct'] = max(0.0, base_features.get('rate_deviation_pct', 0) * reduction_factor)

    # Intervention B: Title fast-tracking resolves deed discrepancy
    if title_fast_tracked:
        simulated_features['deed_mismatch'] = 0
        simulated_features['num_title_holders'] = max(1, int(base_features.get('num_title_holders', 1) * 0.6))

    # Intervention C: Lok Adalat resolution
    if court_stay_resolved:
        simulated_features['active_court_stays'] = 0

    # Intervention D: Gram Sabha clearance
    if gram_sabha_cleared:
        simulated_features['gram_sabha_pending'] = 0

    # Intervention E: Enhanced R&R
    if rehab_package_enhanced:
        simulated_features['rr_required'] = 0

    # 3. Predict new score with interventions
    simulated = predict_parcel(simulated_features)
    new_score = simulated['risk_score']
    new_delay = simulated['estimated_delay_months']

    score_reduction = orig_score - new_score
    months_saved = round(max(0.0, orig_delay - new_delay), 1)
    percent_reduction = round((score_reduction / max(1, orig_score)) * 100, 1)

    # Summary narrative
    interventions_applied = []
    if compensation_multiplier > 1.0:
        interventions_applied.append(f"Calibrated RFCTLARR compensation ({compensation_multiplier:.1f}x)")
    if title_fast_tracked:
        interventions_applied.append("Fast-tracked title & mutation deed verification")
    if court_stay_resolved:
        interventions_applied.append("Resolved injunction via Special Revenue Tribunal")
    if gram_sabha_cleared:
        interventions_applied.append("Pre-cleared FRA Gram Sabha consensus")
    if rehab_package_enhanced:
        interventions_applied.append("Standardized enhanced R&R resettlement package")

    if not interventions_applied:
        interventions_applied.append("No active interventions selected (baseline)")

    return {
        'baseline': {
            'risk_score': orig_score,
            'risk_level': baseline['risk_level'],
            'estimated_delay_months': orig_delay,
            'primary_delayer': baseline['primary_delayer']
        },
        'simulated': {
            'risk_score': new_score,
            'risk_level': simulated['risk_level'],
            'estimated_delay_months': new_delay,
            'primary_delayer': simulated['primary_delayer'],
            'xai_drivers': simulated['xai_drivers']
        },
        'impact': {
            'risk_reduction_points': score_reduction,
            'risk_reduction_pct': percent_reduction,
            'months_saved': months_saved,
            'interventions': interventions_applied
        }
    }
