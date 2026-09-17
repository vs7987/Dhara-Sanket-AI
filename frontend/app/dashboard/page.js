'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StatCard from '../../components/StatCard';
import ProjectTable from '../../components/ProjectTable';
import AlertList from '../../components/AlertList';
import GISMap from '../../components/GISMap';
import { stats as initialStats, projects as initialProjects, alerts as initialAlerts, hotspots } from '../../lib/mockData';
import { getProjects, getAlerts, getPlatformStats } from '../../lib/api';
import styles from './page.module.css';

export default function DashboardPage() {
  const [projectList, setProjectList] = useState(initialProjects);
  const [alertList, setAlertList] = useState(initialAlerts);
  const [kpiStats, setKpiStats] = useState(initialStats);

  useEffect(() => {
    getProjects().then((data) => {
      if (data && data.length > 0) setProjectList(data);
    });
    getAlerts(5).then((data) => {
      if (data && data.length > 0) setAlertList(data);
    });
    getPlatformStats().then((data) => {
      if (data) {
        setKpiStats([
          { id: 'total-projects', label: 'Total Projects', value: data.total_projects || 47, trend: '+12%', trendUp: true, icon: 'projects' },
          { id: 'districts', label: 'Districts Covered', value: data.districts_covered || 5, trend: '+2 MP', trendUp: true, icon: 'districts' },
          { id: 'land-records', label: 'Land Records Analyzed', value: (data.land_records_analyzed || 12847).toLocaleString(), trend: '+1,240', trendUp: true, icon: 'records' },
          { id: 'accuracy', label: 'Monitoring Accuracy', value: data.ai_accuracy || '96.4%', trend: '+1.2%', trendUp: true, icon: 'accuracy' },
        ]);
      }
    });
  }, []);

  const activeProjects = projectList.filter((p) => p.status === 'In Progress');
  const highRiskProjects = projectList.filter((p) => p.risk === 'high');

  return (
    <div className={styles.dashboard}>
      {/* Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.heroBadge}>
              <span>STATE COMMAND CENTER · MADHYA PRADESH</span>
            </div>
            <h1 className={styles.heroTitle}>
              Dhara-Sanket AI <span className={styles.brandAccent}>Risk Command Portal</span>
            </h1>
            <p className={styles.heroDesc}>
              Predictive analytics system for early detection of land acquisition delays.
              Continuously cross-matches satellite GIS, MP Bhulekh cadastral polygons, and court records
              to prevent bottlenecks before compensation disbursement.
            </p>
            <div className={styles.heroCta}>
              <Link href="/gis-map" className={styles.btnPrimary}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M2 5l5-2 6 3 5-2v12l-5 2-6-3-5 2V5z" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                GIS Map & What-If Simulation
              </Link>
              <Link href="/documents" className={styles.btnSecondary}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                Verify Land Deeds
              </Link>
              <Link href="/audit-logs" className={styles.btnSecondary}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                Audit Trails
              </Link>
            </div>
          </div>

          <div className={styles.heroGraphic}>
            <svg viewBox="0 0 180 140" fill="none" className={styles.heroSvg}>
              <path d="M90 10L155 45V95C155 115 125 135 90 140C55 135 25 115 25 95V45L90 10Z" fill="#059669" fillOpacity="0.12" stroke="#059669" strokeWidth="1.5" />
              <path d="M90 30L135 55V90C135 105 115 120 90 125C65 120 45 105 45 90V55L90 30Z" fill="#059669" fillOpacity="0.2" stroke="#059669" strokeWidth="1" />
              <circle cx="90" cy="70" r="12" fill="#059669" fillOpacity="0.3" stroke="#059669" strokeWidth="1.5" />
              <circle cx="90" cy="70" r="5" fill="#10b981" />
              <circle cx="65" cy="55" r="4" fill="#38bdf8" />
              <circle cx="115" cy="55" r="4" fill="#34d399" />
              <circle cx="75" cy="95" r="3.5" fill="#f59e0b" />
              <circle cx="105" cy="95" r="3.5" fill="#ef4444" />
            </svg>
          </div>
        </div>
      </section>

      {/* 6-Step Decision Workflow Stepper (Slide 5 Match) */}
      <section className={styles.workflowSection}>
        <div className={styles.workflowHeader}>
          <h2 className={styles.workflowTitle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            6-Step Decision Workflow: From Land Data to Confident Decisions (Slide 5)
          </h2>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
            SIH26017 Implementation Pipeline
          </span>
        </div>

        <div className={styles.workflowGrid}>
          <Link href="/gis-map" className={styles.stepCard}>
            <span className={styles.stepNum}>Step 01</span>
            <span className={styles.stepName}>Risk Map</span>
            <span className={styles.stepDesc}>Identify high-risk hotspots across districts</span>
          </Link>

          <Link href="/active-projects" className={styles.stepCard}>
            <span className={styles.stepNum}>Step 02</span>
            <span className={styles.stepName}>Select Parcel</span>
            <span className={styles.stepDesc}>Choose corridor project or cadastral parcel</span>
          </Link>

          <Link href="/gis-map" className={styles.stepCard}>
            <span className={styles.stepNum}>Step 03</span>
            <span className={styles.stepName}>AI Risk Score</span>
            <span className={styles.stepDesc}>ML GradientBoosting risk score (0-100)</span>
          </Link>

          <Link href="/gis-map" className={styles.stepCard}>
            <span className={styles.stepNum}>Step 04</span>
            <span className={styles.stepName}>XAI Drivers</span>
            <span className={styles.stepDesc}>SHAP attribution: Title, Market, Legal, R&R</span>
          </Link>

          <Link href="/high-risk" className={styles.stepCard}>
            <span className={styles.stepNum}>Step 05</span>
            <span className={styles.stepName}>Recommendation</span>
            <span className={styles.stepDesc}>Best statutory mitigation action suggested</span>
          </Link>

          <Link href="/gis-map" className={styles.stepCard}>
            <span className={styles.stepNum}>Step 06</span>
            <span className={styles.stepName}>What-If Simulation</span>
            <span className={styles.stepDesc}>Test policy interventions & verify delay drop</span>
          </Link>
        </div>
      </section>

      {/* Stat Cards */}
      <section className={styles.statsGrid}>
        {kpiStats.map((s, i) => (
          <StatCard key={s.id} {...s} index={i} />
        ))}
      </section>

      {/* Map + Alerts */}
      <section className={styles.midRow}>
        <div className={styles.mapCol}>
          <GISMap hotspots={hotspots} />
        </div>
        <div className={styles.alertCol}>
          <AlertList alerts={alertList} maxItems={5} />
        </div>
      </section>

      {/* Tables */}
      <section className={styles.tablesRow}>
        <ProjectTable projects={activeProjects} title="Current Active Corridors" maxRows={5} />
      </section>
      <section className={styles.tablesRow}>
        <ProjectTable projects={highRiskProjects} title="High Risk Critical Projects" maxRows={5} />
      </section>
    </div>
  );
}
