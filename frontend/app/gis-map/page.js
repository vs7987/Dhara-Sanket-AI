'use client';

import { useState } from 'react';
import GISMap from '../../components/GISMap';
import RiskScoreRing from '../../components/RiskScoreRing';
import { hotspots, parcels } from '../../lib/mockData';
import styles from './page.module.css';

const factorLabels = {
  ownershipDispute: 'Ownership Dispute',
  documentMismatch: 'Document Mismatch',
  encroachment: 'Encroachment Risk',
  landUseViolation: 'Land Use Violation',
  priceAnomaly: 'Price Anomaly',
};

const factorColors = {
  ownershipDispute: '#dc2626',
  documentMismatch: '#f59e0b',
  encroachment: '#ef4444',
  landUseViolation: '#6366f1',
  priceAnomaly: '#0ea5e9',
};

export default function GISMapPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Map hotspot index to a parcel (cycle through parcels)
  const parcel = parcels[selectedIdx % parcels.length];

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        <div className={styles.mapCol}>
          <div className={styles.mapCard}>
            <div className={styles.mapHeader}>
              <h3 className={styles.mapTitle}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 5l5-2 6 3 5-2v10l-5 2-6-3-5 2V5z" stroke="#059669" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M7 3v10M13 6v10" stroke="#059669" strokeWidth="1.4" />
                </svg>
                Interactive GIS Map
              </h3>
              <span className={styles.liveTag}>
                <span className={styles.liveDot} />
                Real-time Monitoring
              </span>
            </div>
            <GISMap hotspots={hotspots} large onSelectHotspot={setSelectedIdx} />
          </div>
        </div>

        <div className={styles.detailCol}>
          <div className={styles.detailCard}>
            <h3 className={styles.detailTitle}>Parcel Details</h3>
            <div className={styles.parcelInfo}>
              <div className={styles.parcelId}>{parcel.id}</div>
              <h4 className={styles.parcelName}>{parcel.name}</h4>
              <div className={styles.metaRow}>
                <span className={styles.meta}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 4l4-2 4 2 4-2v8l-4 2-4-2-4 2V4z" stroke="#64748b" strokeWidth="1.2" />
                  </svg>
                  {parcel.district}
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
                  <span className={styles.infoLabel}>Owner</span>
                  <span className={styles.infoValue}>{parcel.owner}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Land Use</span>
                  <span className={styles.infoValue}>{parcel.landUse}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Last Updated</span>
                  <span className={styles.infoValue}>{parcel.lastUpdated}</span>
                </div>
              </div>
            </div>

            <div className={styles.riskSection}>
              <h4 className={styles.riskTitle}>Risk Assessment</h4>
              <div className={styles.ringCenter}>
                <RiskScoreRing score={parcel.riskScore} size={160} strokeWidth={14} />
              </div>
            </div>

            {/* TODO: Add action buttons to the parcel detail panel:
                1. "Generate Report" — trigger PDF report generation via FastAPI
                2. "Flag for Review" — POST to /api/parcels/{id}/flag endpoint
                3. "View Documents" — open a document viewer modal with linked records
                Currently parcel data comes from mock data; replace with a
                GET /api/parcels/{id} call when the FastAPI backend is ready. */}
            <div className={styles.factorsSection}>
              <h4 className={styles.factorsTitle}>Risk Factors</h4>
              <div className={styles.factors}>
                {Object.entries(parcel.riskFactors).map(([key, value]) => (
                  <div key={key} className={styles.factor}>
                    <div className={styles.factorHeader}>
                      <span className={styles.factorLabel}>{factorLabels[key]}</span>
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
                          background: factorColors[key],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
