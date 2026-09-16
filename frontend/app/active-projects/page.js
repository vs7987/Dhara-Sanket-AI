'use client';

import { useState } from 'react';
import ProjectTable from '../../components/ProjectTable';
import { projects } from '../../lib/mockData';
import styles from './page.module.css';

export default function ActiveProjectsPage() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.district.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.subtitle}>Manage and monitor all ongoing land acquisition projects</h2>
        </div>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add Project
        </button>
      </div>

      <div className={styles.searchRow}>
        <div className={styles.searchBox}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="#94a3b8" strokeWidth="1.8" />
            <path d="M11 11l3.5 3.5" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search by project name, ID, or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => setSearch('')}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        <span className={styles.count}>{filtered.length} projects found</span>
      </div>

      <ProjectTable projects={filtered} />

      {/* Add Project Modal */}
      {showModal && (
        <>
          <div className={styles.overlay} onClick={() => setShowModal(false)} />
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Add New Project</h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              {/* TODO: Add controlled state for all form fields (name, district, area).
                  Validate inputs before submission. Consider adding more fields:
                  Start Date, Assigned Officer, Risk Level, Land Records count. */}
              <div className={styles.formGroup}>
                <label>Project Name</label>
                <input type="text" placeholder="Enter project name" className={styles.formInput} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>District</label>
                  <select className={styles.formInput}>
                    <option>Bhopal</option>
                    <option>Indore</option>
                    <option>Dewas</option>
                    <option>Raisen</option>
                    <option>Sehore</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Area (ha)</label>
                  <input type="number" placeholder="0.0" className={styles.formInput} />
                </div>
              </div>
              <div className={styles.formActions}>
                <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                {/* TODO: Replace this onClick with a handler that:
                    1. Validates all form fields
                    2. Sends a POST request to FastAPI /api/projects endpoint
                    3. On success, adds the new project to local state & closes modal
                    4. On error, displays validation/error messages in the modal */}
                <button className={styles.submitBtn} onClick={() => { setShowModal(false); }}>
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
