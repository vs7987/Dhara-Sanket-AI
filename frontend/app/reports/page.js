import StatCard from '../../components/StatCard';
import DonutChart from '../../components/DonutChart';
import BarChart from '../../components/BarChart';
import LineChart from '../../components/LineChart';
import { reportStats, riskDistribution, projectsByDistrict, projectTrend } from '../../lib/mockData';
import styles from './page.module.css';

export default function ReportsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.subtitle}>
          Comprehensive analytics and reporting for land acquisition monitoring
        </p>
      </div>

      {/* Summary Cards */}
      <section className={styles.statsGrid}>
        {reportStats.map((s, i) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} index={i} />
        ))}
      </section>

      {/* Charts */}
      <section className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <DonutChart data={riskDistribution} />
        </div>
        <div className={styles.chartCard}>
          <BarChart data={projectsByDistrict} title="Projects by District" />
        </div>
      </section>

      <section className={styles.lineRow}>
        <LineChart data={projectTrend} title="Project Trend (2026)" />
      </section>
    </div>
  );
}
