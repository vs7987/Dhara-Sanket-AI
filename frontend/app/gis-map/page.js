'use client';

import { useState, useEffect } from 'react';
import GISMap from '../../components/GISMap';
import RiskScoreRing from '../../components/RiskScoreRing';
import { cadastralParcels, indiaStatesRisk, stateDistricts } from '../../lib/mockData';
import { getParcels, runSimulation } from '../../lib/api';
import styles from './page.module.css';

const factorLabels = {
  ownershipDispute: 'Multiple Ownership Claims & Disputes',
  documentMismatch: 'Land Registry vs Government Record Mismatch',
  encroachment: 'Physical Encroachment / Boundary Overlap',
  landUseViolation: 'Agricultural Land Reclassification Needed',
  priceAnomaly: 'Owner Asking Price Much Higher Than Circle Rate',
};

const factorColors = {
  ownershipDispute: '#dc2626',
  documentMismatch: '#f59e0b',
  encroachment: '#ef4444',
  landUseViolation: '#6366f1',
  priceAnomaly: '#0ea5e9',
};

export default function GISMapPage() {
  const [parcelsList, setParcelsList] = useState(cadastralParcels);
  const [selectedParcel, setSelectedParcel] = useState(cadastralParcels[0]);
  const [selectedState, setSelectedState] = useState(indiaStatesRisk[0]);
  const [activeTab, setActiveTab] = useState('reasons'); // 'reasons' or 'simulation'
  const [simScope, setSimScope] = useState('national'); // 'national' (All India) or 'parcel' (Selected Plot)

  // Solution Simulator State
  const [multiplier, setMultiplier] = useState(1.4);
  const [fastTrackTitle, setFastTrackTitle] = useState(true);
  const [courtStayResolved, setCourtStayResolved] = useState(false);
  const [gramSabhaCleared, setGramSabhaCleared] = useState(true);
  const [simResult, setSimResult] = useState(null);
  const [nationalSimResult, setNationalSimResult] = useState({
    projectsProtected: 142,
    monthsSavedAvg: 5.8,
    capitalSavedCr: 18450,
    riskReductionPct: 38,
  });
  const [simLoading, setSimLoading] = useState(false);

  useEffect(() => {
    getParcels().then((data) => {
      if (data && data.length > 0) {
        setParcelsList((prev) => {
          return prev.map((p, idx) => ({
            ...p,
            ...(data[idx] || {}),
          }));
        });
      }
    });
  }, []);

  const parcel = selectedParcel || parcelsList[0];

  // Calculate simulated outcomes
  const handleRunSimulation = async () => {
    setSimLoading(true);

    if (simScope === 'national') {
      // National India-wide simulation calculation
      setTimeout(() => {
        const multEffect = (parseFloat(multiplier) - 1.0) * 120;
        const titleEffect = fastTrackTitle ? 45 : 0;
        const courtEffect = courtStayResolved ? 60 : 0;
        const gramEffect = gramSabhaCleared ? 35 : 0;

        const totalProjectsSaved = Math.min(186, Math.round(75 + multEffect + titleEffect + courtEffect + gramEffect));
        const avgMonthsSaved = +(2.8 + (parseFloat(multiplier) - 1.0) * 3.5 + (courtStayResolved ? 2.2 : 0) + (fastTrackTitle ? 1.4 : 0)).toFixed(1);
        const capitalSaved = Math.round(totalProjectsSaved * 125);
        const riskReduction = Math.min(65, Math.round(20 + (parseFloat(multiplier) - 1.0) * 25 + (courtStayResolved ? 18 : 0) + (fastTrackTitle ? 12 : 0)));

        setNationalSimResult({
          projectsProtected: totalProjectsSaved,
          monthsSavedAvg: avgMonthsSaved,
          capitalSavedCr: capitalSaved,
          riskReductionPct: riskReduction,
        });
        setSimLoading(false);
      }, 300);
      return;
    }

    // Individual Parcel Simulation
    const payload = {
      base_features: {
        area_ha: parseFloat(parcel.area) || 12.5,
        num_title_holders: parcel.riskScore > 75 ? 5 : 2,
        rate_deviation_pct: parcel.riskScore > 70 ? 75.0 : 20.0,
        active_court_stays: parcel.courtStay !== 'None' ? 1 : 0,
        deed_mismatch: parcel.riskFactors?.documentMismatch > 50 ? 1 : 0,
        gram_sabha_pending: parcel.district === 'Raisen' ? 1 : 0,
        is_forest: parcel.district === 'Raisen' ? 1 : 0,
        rr_required: 1,
        infra_proximity_km: 8.0,
      },
      compensation_multiplier: parseFloat(multiplier),
      title_fast_tracked: fastTrackTitle,
      court_stay_resolved: courtStayResolved,
      gram_sabha_cleared: gramSabhaCleared,
      rehab_package_enhanced: true,
    };

    try {
      const res = await runSimulation(payload);
      setSimResult(res);
    } catch {
      const origRisk = parcel.riskScore;
      const reduction = Math.round((multiplier - 1.0) * 18 + (fastTrackTitle ? 14 : 0) + (courtStayResolved ? 20 : 0) + (gramSabhaCleared ? 12 : 0));
      const simulatedScore = Math.max(12, origRisk - reduction);
      setSimResult({
        baseline: { risk_score: origRisk, predicted_delay_months: parseFloat(parcel.estimatedDelay) || 9.5 },
        simulated: { risk_score: simulatedScore, predicted_delay_months: Math.max(1.2, (parseFloat(parcel.estimatedDelay) || 9.5) * (simulatedScore / origRisk)) },
        impact: { risk_reduction_points: origRisk - simulatedScore, months_saved: +( (parseFloat(parcel.estimatedDelay) || 9.5) * (1 - simulatedScore / origRisk) ).toFixed(1) }
      });
    }
    setSimLoading(false);
  };

  const displayedScore = activeTab === 'simulation' && simScope === 'parcel' && simResult ? simResult.simulated.risk_score : parcel.riskScore;

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        {/* Left Column: Multi-Scale Map */}
        <div className={styles.mapCol}>
          <div className={styles.mapCard}>
            <div className={styles.mapHeader}>
              <h3 className={styles.mapTitle}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 5l5-2 6 3 5-2v10l-5 2-6-3-5 2V5z" stroke="#059669" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M7 3v10M13 6v10" stroke="#059669" strokeWidth="1.4" />
                </svg>
                Land Acquisition Delay Map
              </h3>
              <span className={styles.liveTag}>
                <span className={styles.liveDot} />
                Government Land Records Connected
              </span>
            </div>
            
            {/* Interactive Multi-Scale GIS Map */}
            <GISMap
              large
              onSelectParcel={(plot) => {
                setSelectedParcel(plot);
                setSimResult(null);
              }}
              onSelectState={(st) => setSelectedState(st)}
              selectedParcelId={parcel.id}
            />
          </div>
        </div>

        {/* Right Column: Parcel Details & Solution Simulator */}
        <div className={styles.detailCol}>
          <div className={styles.detailCard}>
            <div className={styles.parcelInfo}>
              <div className={styles.parcelId}>Plot No. {parcel.khasraNo} · {parcel.district}</div>
              <h4 className={styles.parcelName}>{parcel.name || `Land Plot ${parcel.khasraNo}, ${parcel.village}`}</h4>
              <div className={styles.metaRow}>
                <span className={styles.meta}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 4l4-2 4 2 4-2v8l-4 2-4-2-4 2V4z" stroke="#64748b" strokeWidth="1.2" />
                  </svg>
                  {parcel.district} District ({parcel.state})
                </span>
                <span className={styles.meta}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="2" y="2" width="10" height="10" rx="1.5" stroke="#64748b" strokeWidth="1.2" />
                    <path d="M2 5.5h10" stroke="#64748b" strokeWidth="1.2" />
                  </svg>
                  {parcel.area}
                </span>
              </div>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Land Owner / Claimants</span>
                  <span className={styles.infoValue}>{parcel.owner}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Land Category</span>
                  <span className={styles.infoValue}>{parcel.landUse}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Official Land Register Status</span>
                  <span className={styles.infoValue} style={{ color: parcel.riskScore > 70 ? '#ef4444' : '#10b981' }}>
                    {parcel.mutationStatus}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Circle Rate / Demand</span>
                  <span className={styles.infoValue}>{parcel.circleRate} / {parcel.marketDemand}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Court Case Status</span>
                  <span className={styles.infoValue} style={{ color: parcel.courtStay !== 'None' ? '#ef4444' : '#10b981' }}>
                    {parcel.courtStay}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Compensation Status</span>
                  <span className={styles.infoValue}>{parcel.rfctlarrStatus}</span>
                </div>
              </div>
            </div>

            {/* Delay Risk Score Gauge */}
            <div className={styles.riskSection}>
              <div className={styles.ringCenter}>
                <RiskScoreRing score={displayedScore} size={150} strokeWidth={13} />
              </div>
            </div>

            {/* Tabs for Reasons vs Solution Testing */}
            <div className={styles.tabRow}>
              <button
                className={`${styles.tabBtn} ${activeTab === 'reasons' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('reasons')}
              >
                Why Delay Happens (Reasons)
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'simulation' ? styles.tabBtnActive : ''}`}
                onClick={() => {
                  setActiveTab('simulation');
                  if (!simResult && simScope === 'parcel') handleRunSimulation();
                }}
              >
                Test Solutions & Save Time
              </button>
            </div>

            {/* TAB 1: REASONS FOR DELAY */}
            {activeTab === 'reasons' && (
              <div className={styles.factorsSection}>
                <div className={styles.factors}>
                  {Object.entries(parcel.riskFactors || {}).map(([key, value]) => (
                    <div key={key} className={styles.factor}>
                      <div className={styles.factorHeader}>
                        <span className={styles.factorLabel}>{factorLabels[key] || key}</span>
                        <span
                          className={styles.factorValue}
                          style={{ color: value >= 70 ? '#dc2626' : value >= 40 ? '#f59e0b' : '#059669' }}
                        >
                          {value >= 70 ? 'High Delay Risk' : value >= 40 ? 'Moderate' : 'Low'} ({value}%)
                        </span>
                      </div>
                      <div className={styles.factorBar}>
                        <div
                          className={styles.factorFill}
                          style={{
                            width: `${value}%`,
                            background: factorColors[key] || '#10b981',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {parcel.recommendedAction && (
                  <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', marginBottom: '4px', letterSpacing: '0.04em' }}>
                      RECOMMENDED ACTION FOR OFFICERS
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#cbd5e1', lineHeight: '1.45' }}>
                      {parcel.recommendedAction}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SOLUTION SIMULATOR (All India & Plot Level) */}
            {activeTab === 'simulation' && (
              <div className={styles.simPanel}>
                {/* Simulation Scope Toggle: All India vs Selected Plot */}
                <div style={{ display: 'flex', gap: '6px', background: 'rgba(15,23,42,0.8)', padding: '3px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <button
                    style={{
                      flex: 1,
                      padding: '5px 8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      background: simScope === 'national' ? '#0284c7' : 'transparent',
                      color: simScope === 'national' ? '#ffffff' : '#94a3b8',
                    }}
                    onClick={() => {
                      setSimScope('national');
                    }}
                  >
                    🇮🇳 All India Level Actions
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: '5px 8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      background: simScope === 'parcel' ? '#0284c7' : 'transparent',
                      color: simScope === 'parcel' ? '#ffffff' : '#94a3b8',
                    }}
                    onClick={() => {
                      setSimScope('parcel');
                      if (!simResult) handleRunSimulation();
                    }}
                  >
                    📍 Plot {parcel.khasraNo} Actions
                  </button>
                </div>

                <div className={styles.simGroup}>
                  <div className={styles.simLabelRow}>
                    <span>Land Compensation Offer</span>
                    <span className={styles.simValue}>{multiplier}x Circle Rate</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="2.2"
                    step="0.1"
                    value={multiplier}
                    onChange={(e) => setMultiplier(e.target.value)}
                    className={styles.simSlider}
                  />
                  <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                    Fair compensation reduces owner disputes and court stays.
                  </span>
                </div>

                <label className={styles.simToggleRow}>
                  <span className={styles.simToggleLabel}>Fast-track Bhulekh land record verification</span>
                  <input
                    type="checkbox"
                    checked={fastTrackTitle}
                    onChange={(e) => setFastTrackTitle(e.target.checked)}
                    className={styles.simToggleInput}
                  />
                </label>

                <label className={styles.simToggleRow}>
                  <span className={styles.simToggleLabel}>Resolve court disputes via Lok Adalat settlement camps</span>
                  <input
                    type="checkbox"
                    checked={courtStayResolved}
                    onChange={(e) => setCourtStayResolved(e.target.checked)}
                    className={styles.simToggleInput}
                  />
                </label>

                <label className={styles.simToggleRow}>
                  <span className={styles.simToggleLabel}>Organize Gram Sabha / Village meetings for consent</span>
                  <input
                    type="checkbox"
                    checked={gramSabhaCleared}
                    onChange={(e) => setGramSabhaCleared(e.target.checked)}
                    className={styles.simToggleInput}
                  />
                </label>

                <button
                  className={styles.simActionBtn}
                  onClick={handleRunSimulation}
                  disabled={simLoading}
                >
                  {simLoading ? 'Calculating Time Saved...' : 'Calculate Time & Cost Saved'}
                </button>

                {/* NATIONAL LEVEL RESULTS */}
                {simScope === 'national' && nationalSimResult && (
                  <div className={styles.impactCard}>
                    <div className={styles.impactTitle}>All-India Impact of These Actions</div>
                    <div className={styles.impactGrid}>
                      <div className={styles.impactMetric}>
                        <span className={styles.impactMetricNum} style={{ color: '#10b981' }}>
                          {nationalSimResult.projectsProtected} Projects
                        </span>
                        <span className={styles.impactMetricLabel}>Saved from Long Delays</span>
                      </div>
                      <div className={styles.impactMetric}>
                        <span className={styles.impactMetricNum} style={{ color: '#38bdf8' }}>
                          {nationalSimResult.monthsSavedAvg} Months
                        </span>
                        <span className={styles.impactMetricLabel}>Avg. Project Time Saved</span>
                      </div>
                      <div className={styles.impactMetric}>
                        <span className={styles.impactMetricNum} style={{ color: '#f59e0b' }}>
                          ₹{nationalSimResult.capitalSavedCr.toLocaleString()} Cr
                        </span>
                        <span className={styles.impactMetricLabel}>Cost Overrun Prevented</span>
                      </div>
                      <div className={styles.impactMetric}>
                        <span className={styles.impactMetricNum} style={{ color: '#34d399' }}>
                          -{nationalSimResult.riskReductionPct}%
                        </span>
                        <span className={styles.impactMetricLabel}>National Delay Risk Drop</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* PLOT LEVEL RESULTS */}
                {simScope === 'parcel' && simResult && (
                  <div className={styles.impactCard}>
                    <div className={styles.impactTitle}>Plot Level Impact ({parcel.khasraNo})</div>
                    <div className={styles.impactGrid}>
                      <div className={styles.impactMetric}>
                        <span className={styles.impactMetricNum} style={{ color: '#10b981' }}>
                          -{simResult.impact.risk_reduction_points} pts
                        </span>
                        <span className={styles.impactMetricLabel}>Delay Risk Dropped to {simResult.simulated.risk_score}%</span>
                      </div>
                      <div className={styles.impactMetric}>
                        <span className={styles.impactMetricNum} style={{ color: '#38bdf8' }}>
                          {simResult.impact.months_saved} Months
                        </span>
                        <span className={styles.impactMetricLabel}>Acquisition Time Saved</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
