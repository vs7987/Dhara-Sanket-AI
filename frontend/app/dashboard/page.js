import Link from 'next/link';
import StatCard from '../../components/StatCard';
import ProjectTable from '../../components/ProjectTable';
import AlertList from '../../components/AlertList';
import GISMap from '../../components/GISMap';
import { stats, projects, alerts, hotspots } from '../../lib/mockData';
import styles from './page.module.css';

export default function DashboardPage() {
  const activeProjects = projects.filter((p) => p.status === 'In Progress');
  const highRiskProjects = projects.filter((p) => p.risk === 'high');

  return (
    <div className={styles.dashboard}>
      {/* Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Welcome to <span className={styles.brandAccent}>Dhara Sanket AI</span>
            </h1>
            <p className={styles.heroDesc}>
              AI-powered land acquisition risk monitoring platform. Analyze land records,
              detect ownership disputes, and ensure transparent land governance across
              Madhya Pradesh.
            </p>
            <div className={styles.heroCta}>
              <Link href="/active-projects" className={styles.btnPrimary}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 4h10M3 8h10M3 12h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                View Active Projects
              </Link>
              <Link href="/high-risk" className={styles.btnSecondary}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L14 13H2L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M8 6.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="8" cy="11" r="0.5" fill="currentColor" />
                </svg>
                Risk Analysis
              </Link>
            </div>
          </div>
          <div className={styles.heroGraphic}>
            <svg viewBox="0 0 180 140" fill="none" className={styles.heroSvg}>
              <path d="M90 10L155 45V95C155 115 125 135 90 140C55 135 25 115 25 95V45L90 10Z" fill="#059669" fillOpacity="0.08" stroke="#059669" strokeWidth="1.5" />
              <path d="M90 30L135 55V90C135 105 115 120 90 125C65 120 45 105 45 90V55L90 30Z" fill="#059669" fillOpacity="0.12" stroke="#059669" strokeWidth="1" />
              <circle cx="90" cy="70" r="12" fill="#059669" fillOpacity="0.2" stroke="#059669" strokeWidth="1.5" />
              <circle cx="90" cy="70" r="5" fill="#059669" />
              <circle cx="65" cy="55" r="4" fill="#6366f1" fillOpacity="0.3" stroke="#6366f1" strokeWidth="1" />
              <circle cx="115" cy="55" r="4" fill="#0ea5e9" fillOpacity="0.3" stroke="#0ea5e9" strokeWidth="1" />
              <circle cx="75" cy="95" r="3.5" fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1" />
              <circle cx="105" cy="95" r="3.5" fill="#dc2626" fillOpacity="0.3" stroke="#dc2626" strokeWidth="1" />
              <line x1="78" y1="65" x2="65" y2="55" stroke="#059669" strokeWidth="0.8" strokeDasharray="2,2" />
              <line x1="102" y1="65" x2="115" y2="55" stroke="#059669" strokeWidth="0.8" strokeDasharray="2,2" />
              <line x1="83" y1="78" x2="75" y2="95" stroke="#059669" strokeWidth="0.8" strokeDasharray="2,2" />
              <line x1="97" y1="78" x2="105" y2="95" stroke="#059669" strokeWidth="0.8" strokeDasharray="2,2" />
            </svg>
          </div>
        </div>
      </section>

      {/* Stat Cards */}
      <section className={styles.statsGrid}>
        {stats.map((s, i) => (
          <StatCard key={s.id} {...s} index={i} />
        ))}
      </section>

      {/* Map + Alerts */}
      <section className={styles.midRow}>
        <div className={styles.mapCol}>
          <GISMap hotspots={hotspots} />
        </div>
        <div className={styles.alertCol}>
          <AlertList alerts={alerts} maxItems={5} />
        </div>
      </section>

      {/* Tables */}
      <section className={styles.tablesRow}>
        <ProjectTable projects={activeProjects} title="Current Active Projects" maxRows={5} />
      </section>
      <section className={styles.tablesRow}>
        <ProjectTable projects={highRiskProjects} title="High Risk Projects" maxRows={5} />
      </section>
    </div>
  );
}
