import styles from './ProjectTable.module.css';

const riskColors = {
  high: '#dc2626',
  medium: '#f59e0b',
  low: '#059669',
};

const statusColors = {
  'In Progress': '#6366f1',
  'Planning': '#64748b',
  'Review': '#f59e0b',
  'Approved': '#059669',
};

export default function ProjectTable({ projects, title, maxRows }) {
  const displayProjects = maxRows ? projects.slice(0, maxRows) : projects;

  return (
    <div className={styles.wrapper}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Name</th>
              <th>District</th>
              <th>Area</th>
              <th>Status</th>
              <th>Risk</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {displayProjects.map((p) => (
              // TODO: Add onClick handler to navigate to a project detail page
              // e.g. router.push(`/projects/${p.id}`) — requires creating
              // app/projects/[id]/page.js with full project details, documents,
              // risk assessment, and timeline views.
              <tr key={p.id} style={{ cursor: 'pointer' }}>
                <td className={styles.id}>{p.id}</td>
                <td className={styles.name}>{p.name}</td>
                <td>{p.district}</td>
                <td>{p.area}</td>
                <td>
                  <span
                    className={styles.statusBadge}
                    style={{
                      color: statusColors[p.status] || '#64748b',
                      background: `${statusColors[p.status] || '#64748b'}15`,
                    }}
                  >
                    {p.status}
                  </span>
                </td>
                <td>
                  <span
                    className={styles.riskBadge}
                    style={{
                      color: '#fff',
                      background: riskColors[p.risk],
                    }}
                  >
                    {p.risk.charAt(0).toUpperCase() + p.risk.slice(1)}
                  </span>
                </td>
                <td>
                  <div className={styles.progressWrap}>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${p.progress}%`,
                          background: riskColors[p.risk],
                        }}
                      />
                    </div>
                    <span className={styles.progressText}>{p.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
