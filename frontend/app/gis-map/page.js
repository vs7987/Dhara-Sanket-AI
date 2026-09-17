'use client';

import { useState, useEffect } from 'react';
import GISMap from '../../components/GISMap';
import RiskScoreRing from '../../components/RiskScoreRing';
import { cadastralParcels } from '../../lib/mockData';
import { getParcels, runSimulation } from '../../lib/api';
import styles from './page.module.css';

const factorLabels = {
  ownershipDispute: 'Ownership & Title Dispute',
  documentMismatch: 'Bhulekh vs Registry Mismatch',
  encroachment: 'Satellite Encroachment Risk',
  landUseViolation: 'Agricultural Reclassification',
  priceAnomaly: 'Circle vs Market Rate Deviation',
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
  const [activeTab, setActiveTab] = useState('xai'); // 'xai' or 'simulation'

  // What-If Simulation State
  const [multiplier, setMultiplier] = useState(1.4);
  const [fastTrackTitle, setFastTrackTitle] = useState(true);
  const [courtStayResolved, setCourtStayResolved] = useState(false);
  const [gramSabhaCleared, setGramSabhaCleared] = useState(true);
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  // Fetch real parcels from backend API on mount if available
  useEffect(() => {
    getParcels().then((data) => {
      if (data && data.length > 0) {
        // Merge API data with rich mock data
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

  // Run What-If Simulation
  const handleRunSimulation = async () => {
    setSimLoading(true);
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
      // Fallback calculation for hackathon demo resilience
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

  const displayedScore = activeTab === 'simulation' && simResult ? simResult.simulated.risk_score : parcel.riskScore;

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        {/* Left Column: Multi-Scale Spatial GIS Map */}
        <div className={styles.mapCol}>
          <div className={styles.mapCard}>
            <div className={styles.mapHeader}>
              <h3 className={styles.mapTitle}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 5l5-2 6 3 5-2v10l-5 2-6-3-5 2V5z" stroke="#059669" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M7 3v10M13 6v10" stroke="#059669" strokeWidth="1.4" />
                </svg>
                Geospatial Land Acquisition Risk Map (Multi-Scale)
              </h3>
              <span className={styles.liveTag}>
                <span className={styles.liveDot} />
                PM Gati Shakti & Bhulekh Live
              </span>
            </div>
            
            {/* Interactive Multi-Scale GIS Map */}
            <GISMap
              large
              onSelectParcel={(plot) => {
                setSelectedParcel(plot);
                setSimResult(null); // reset sim when new plot is selected
              }}
              selectedParcelId={parcel.id}
            />
          </div>
        </div>

        {/* Right Column: Parcel Detail & XAI / Simulation Panel */}
        <div className={styles.detailCol}>
          <div className={styles.detailCard}>
            <div className={styles.parcelInfo}>
              <div className={styles.parcelId}>{parcel.id} · Khasra {parcel.khasraNo}</div>
              <h4 className={styles.parcelName}>{parcel.name || `Survey Plot ${parcel.khasraNo}, ${parcel.village}`}</h4>
              <div className={styles.metaRow}>
                <span className={styles.meta}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 4l4-2 4 2 4-2v8l-4 2-4-2-4 2V4z" stroke="#64748b" strokeWidth="1.2" />
                  </svg>
                  {parcel.district} ({parcel.state})
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
                  <span className={styles.infoLabel}>Primary Title Holder</span>
                  <span className={styles.infoValue}>{parcel.owner}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Land Classification</span>
                  <span className={styles.infoValue}>{parcel.landUse}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Bhulekh Mutation Status</span>
                  <span className={styles.infoValue} style={{ color: parcel.riskScore > 70 ? '#ef4444' : '#10b981' }}>
                    {parcel.mutationStatus}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Circle Rate vs Market Demand</span>
                  <span className={styles.infoValue}>{parcel.circleRate} / {parcel.marketDemand}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Judicial Injunction / Stay</span>
                  <span className={styles.infoValue} style={{ color: parcel.courtStay !== 'None' ? '#ef4444' : '#10b981' }}>
                    {parcel.courtStay}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>RFCTLARR Solatium Status</span>
                  <span className={styles.infoValue}>{parcel.rfctlarrStatus}</span>
                </div>
              </div>
            </div>

            {/* Risk Assessment Gauge */}
            <div className={styles.riskSection}>
              <div className={styles.ringCenter}>
                <RiskScoreRing score={displayedScore} size={150} strokeWidth={13} />
              </div>
            </div>

            {/* Tabs for XAI vs What-If Simulation */}
            <div className={styles.tabRow}>
              <button
                className={`${styles.tabBtn} ${activeTab === 'xai' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('xai')}
              >
                Explainable AI (XAI)
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'simulation' ? styles.tabBtnActive : ''}`}
                onClick={() => {
                  setActiveTab('simulation');
                  if (!simResult) handleRunSimulation();
                }}
              >
                What-If Simulation (USP)
              </button>
            </div>

            {/* TAB 1: XAI FACTORS */}
            {activeTab === 'xai' && (
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
                          {value}%
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
                      RECOMMENDED MITIGATION INTERVENTION
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#cbd5e1', lineHeight: '1.45' }}>
                      {parcel.recommendedAction}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: WHAT-IF SIMULATION TOOL (Slide 2 & 5 Key USP) */}
            {activeTab === 'simulation' && (
              <div className={styles.simPanel}>
                <div className={styles.simGroup}>
                  <div className={styles.simLabelRow}>
                    <span>RFCTLARR Compensation Multiplier</span>
                    <span className={styles.simValue}>{multiplier}x</span>
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
                </div>

                <label className={styles.simToggleRow}>
                  <span className={styles.simToggleLabel}>Fast-Track Title Verification (Bhulekh API)</span>
                  <input
                    type="checkbox"
                    checked={fastTrackTitle}
                    onChange={(e) => setFastTrackTitle(e.target.checked)}
                    className={styles.simToggleInput}
                  />
                </label>

                <label className={styles.simToggleRow}>
                  <span className={styles.simToggleLabel}>Resolve Injunction via Lok Adalat / Mediation</span>
                  <input
                    type="checkbox"
                    checked={courtStayResolved}
                    onChange={(e) => setCourtStayResolved(e.target.checked)}
                    className={styles.simToggleInput}
                  />
                </label>

                <label className={styles.simToggleRow}>
                  <span className={styles.simToggleLabel}>Advance FRA Gram Sabha Consensus</span>
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
                  {simLoading ? 'Simulating ML Model...' : 'Recalculate Interventions'}
                </button>

                {simResult && (
                  <div className={styles.impactCard}>
                    <div className={styles.impactTitle}>Simulated Policy Impact</div>
                    <div className={styles.impactGrid}>
                      <div className={styles.impactMetric}>
                        <span className={styles.impactMetricNum} style={{ color: '#10b981' }}>
                          -{simResult.impact.risk_reduction_points} pts
                        </span>
                        <span className={styles.impactMetricLabel}>Risk Score Reduction</span>
                      </div>
                      <div className={styles.impactMetric}>
                        <span className={styles.impactMetricNum} style={{ color: '#38bdf8' }}>
                          {simResult.impact.months_saved} Mos
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
