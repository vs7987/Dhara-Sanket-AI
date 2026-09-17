'use client';

import { useState, useEffect } from 'react';
import ProjectTable from '../../components/ProjectTable';
import { projects as initialProjects } from '../../lib/mockData';
import { getProjects, createProject } from '../../lib/api';
import styles from './page.module.css';

export default function ActiveProjectsPage() {
  const [projectList, setProjectList] = useState(initialProjects);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Bhopal');
  const [area, setArea] = useState('');
  const [risk, setRisk] = useState('medium');
  const [status, setStatus] = useState('In Progress');
  const [submitting, setSubmitting] = useState(false);

  // Fetch real projects from FastAPI on load
  useEffect(() => {
    getProjects().then((data) => {
      if (data && data.length > 0) {
        setProjectList(data);
      }
    });
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a valid project name.');
      return;
    }

    setSubmitting(true);
    const newProject = await createProject({
      name: name.trim(),
      district,
      area_ha: parseFloat(area) || 50.0,
      risk,
      status,
      start_date: new Date().toISOString().split('T')[0],
      land_records: Math.floor(400 + Math.random() * 1200),
      progress: status === 'In Progress' ? 20 : status === 'Planning' ? 5 : 60,
    });

    setProjectList((prev) => [newProject, ...prev]);
    setSubmitting(false);
    setShowModal(false);
    setName('');
    setArea('');
  };

  const filtered = projectList.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.district.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.subtitle}>Manage and monitor all ongoing land acquisition corridors</h2>
        </div>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add Corridor Project
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
              <h3>Register New Acquisition Corridor</h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateProject} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Project Corridor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ujjain-Dewas Express Logistics Link"
                  className={styles.formInput}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>District (MP)</label>
                  <select
                    className={styles.formInput}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  >
                    <option>Bhopal</option>
                    <option>Indore</option>
                    <option>Dewas</option>
                    <option>Raisen</option>
                    <option>Sehore</option>
                    <option>Jabalpur</option>
                    <option>Ujjain</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Total Area (ha)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="120.5"
                    className={styles.formInput}
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Initial Risk Estimate</label>
                  <select
                    className={styles.formInput}
                    value={risk}
                    onChange={(e) => setRisk(e.target.value)}
                  >
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Acquisition Status</label>
                  <select
                    className={styles.formInput}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option>Planning</option>
                    <option>In Progress</option>
                    <option>Review</option>
                    <option>Approved</option>
                  </select>
                </div>
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
                  {submitting ? 'Saving to Database...' : 'Register Corridor'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
