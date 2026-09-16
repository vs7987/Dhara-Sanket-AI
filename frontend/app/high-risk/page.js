import ProjectTable from '../../components/ProjectTable';
import GISMap from '../../components/GISMap';
import { projects, hotspots } from '../../lib/mockData';
import styles from './page.module.css';

export default function HighRiskPage() {
  const highRiskProjects = projects.filter((p) => p.risk === 'high');
  const highRiskHotspots = hotspots.filter((h) => h.risk === 'high');

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.subtitle}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2L16 15H2L9 2Z" fill="#dc2626" fillOpacity="0.1" stroke="#dc2626" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M9 7v3" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="9" cy="12.5" r="0.6" fill="#dc2626" />
          </svg>
          Projects requiring immediate attention due to elevated risk indicators
        </p>
        <span className={styles.badge}>{highRiskProjects.length} High Risk</span>
      </div>

      <div className={styles.grid}>
        <div className={styles.tableCol}>
          <ProjectTable projects={highRiskProjects} title="High Risk Projects" />
        </div>
        <div className={styles.mapCol}>
          <GISMap hotspots={highRiskHotspots} />
        </div>
      </div>
    </div>
  );
}
