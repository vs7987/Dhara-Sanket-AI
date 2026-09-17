'use client';

import { useState, useEffect } from 'react';
import { getDocuments, verifyDocument } from '../../lib/api';
import styles from './page.module.css';

export default function DocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('Khasra Extract');
  const [parcelId, setParcelId] = useState('PCL-BPL-001');
  const [projectName, setProjectName] = useState('Bhopal Smart City Ring Road');
  const [uploadedBy, setUploadedBy] = useState('Revenue Inspector');

  useEffect(() => {
    getDocuments().then((data) => {
      setDocs(data || []);
      setLoading(false);
    });
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!docName.trim()) {
      alert('Please enter document title');
      return;
    }

    setSubmitting(true);
    const newDoc = await verifyDocument({
      name: docName.trim(),
      doc_type: docType,
      parcel_id: parcelId,
      project_name: projectName,
      uploaded_by: uploadedBy,
    });

    setDocs((prev) => [newDoc, ...prev]);
    setSubmitting(false);
    setShowModal(false);
    setDocName('');
  };

  const verifiedCount = docs.filter((d) => d.verificationStatus === 'Verified').length;
  const flaggedCount = docs.filter((d) => d.verificationStatus === 'Discrepancy Flagged').length;

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Land Document Verification & Deed Matching
          </h1>
          <p className={styles.subtitle}>
            Cross-checks sale deeds and ownership documents directly against MP Bhulekh land records
          </p>
        </div>

        <button className={styles.submitBtn} onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Upload & Check Document
        </button>
      </div>

      {/* Summary Cards */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Deeds Checked</span>
          <span className={styles.statValue}>{docs.length}</span>
          <span className={styles.statSub}>Across 5 Districts</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Clean & Verified</span>
          <span className={styles.statValue} style={{ color: '#10b981' }}>{verifiedCount}</span>
          <span className={styles.statSub}>Matches Land Records</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Discrepancies Found</span>
          <span className={styles.statValue} style={{ color: '#ef4444' }}>{flaggedCount}</span>
          <span className={styles.statSub} style={{ color: '#f87171' }}>Needs Officer Review</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Reference Database</span>
          <span className={styles.statValue} style={{ color: '#38bdf8' }}>MP Bhulekh</span>
          <span className={styles.statSub}>Official Revenue Register</span>
        </div>
      </div>

      {/* Document Records Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Document Verification Register</h3>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
            {docs.length} Documents Processed
          </span>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Doc ID</th>
                <th>Document Title</th>
                <th>Category</th>
                <th>Plot ID</th>
                <th>Project Corridor</th>
                <th>Submitted By</th>
                <th>Record Match</th>
                <th>Status</th>
                <th>Notes / Issues Found</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc) => (
                <tr key={doc.id}>
                  <td className={styles.docId}>{doc.id}</td>
                  <td className={styles.docName}>{doc.name}</td>
                  <td><span className={styles.docType}>{doc.docType}</span></td>
                  <td style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{doc.parcelId}</td>
                  <td>{doc.project}</td>
                  <td>{doc.uploadedBy}</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: '700', color: doc.ocrMatchPct >= 90 ? '#10b981' : doc.ocrMatchPct >= 80 ? '#f59e0b' : '#ef4444' }}>
                    {doc.ocrMatchPct}% Match
                  </td>
                  <td>
                    {doc.verificationStatus === 'Verified' ? (
                      <span className={styles.statusVerified}>✓ Verified</span>
                    ) : doc.verificationStatus === 'Discrepancy Flagged' ? (
                      <span className={styles.statusFlagged}>⚠ Flagged</span>
                    ) : (
                      <span className={styles.statusPending}>⏳ In Review</span>
                    )}
                  </td>
                  <td style={{ fontSize: '11.5px', maxWidth: '280px', color: doc.discrepancyDetails?.includes('mismatch') ? '#fca5a5' : '#94a3b8' }}>
                    {doc.discrepancyDetails || 'Clean record'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <>
          <div className={styles.overlay} onClick={() => setShowModal(false)} />
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Upload Document for Verification</h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleVerify} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Khasra Form B-1 Extract (Plot 45/2)"
                  className={styles.formInput}
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Document Category</label>
                  <select
                    className={styles.formInput}
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                  >
                    <option>Khasra Extract</option>
                    <option>Sale Deed</option>
                    <option>Mutation Certificate</option>
                    <option>Gram Sabha Resolution</option>
                    <option>Environmental NOC</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Target Land Plot</label>
                  <select
                    className={styles.formInput}
                    value={parcelId}
                    onChange={(e) => setParcelId(e.target.value)}
                  >
                    <option>PCL-BPL-001 (Bhopal)</option>
                    <option>PCL-IND-001 (Indore)</option>
                    <option>PCL-DWS-001 (Dewas)</option>
                    <option>PCL-RSN-001 (Raisen)</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Project Corridor</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Submitted By (Officer / Landowner)</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={uploadedBy}
                  onChange={(e) => setUploadedBy(e.target.value)}
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={submitting}
                >
                  {submitting ? 'Checking Record...' : 'Upload & Check'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
