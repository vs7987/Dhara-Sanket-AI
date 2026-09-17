'use client';

import { useState, useEffect } from 'react';
import { getAuditLogs } from '../../lib/api';
import styles from './page.module.css';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLogs().then((data) => {
      setLogs(data || []);
      setLoading(false);
    });
  }, []);

  const getActionClass = (action) => {
    if (action.includes('DISPUTE')) return styles.actionDispute;
    if (action.includes('SIMULATION')) return styles.actionSim;
    if (action.includes('VERIFIED') || action.includes('CLEAR')) return styles.actionVerified;
    return styles.actionCalibrate;
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Statutory Audit Trail & Security Governance
          </h1>
          <p className={styles.subtitle}>
            Immutable event ledger for RFCTLARR 2013 compliance and decision defensibility (SIH Slide 3 & 6)
          </p>
        </div>

        <span className={styles.badge}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
          AUDIT LOGGING: ACTIVE
        </span>
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Action Category</th>
                <th>Authorizing Official / System</th>
                <th>Target Asset / Sector</th>
                <th>Timestamp</th>
                <th>Statutory Compliance Rule</th>
                <th>Audit Details & Action Log</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((item) => (
                <tr key={item.id}>
                  <td className={styles.auditId}>{item.id}</td>
                  <td>
                    <span className={`${styles.actionTag} ${getActionClass(item.action)}`}>
                      {item.action}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600', color: '#ffffff' }}>{item.officer}</td>
                  <td style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{item.target}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '11.5px', color: '#94a3b8' }}>
                    {item.timestamp}
                  </td>
                  <td>
                    <span className={styles.ruleBadge}>{item.complianceRule}</span>
                  </td>
                  <td style={{ fontSize: '12px', maxWidth: '320px', color: '#cbd5e1' }}>
                    {item.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
