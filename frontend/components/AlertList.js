import styles from './AlertList.module.css';

const severityColors = {
  high: '#dc2626',
  medium: '#f59e0b',
  low: '#059669',
};

const severityIcons = {
  high: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5l6.5 11.5H1.5L8 1.5z" fill="#dc2626" fillOpacity="0.15" stroke="#dc2626" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M8 6v3" stroke="#dc2626" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.6" fill="#dc2626" />
    </svg>
  ),
  medium: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="1.3" />
      <path d="M8 5v3.5" stroke="#f59e0b" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.6" fill="#f59e0b" />
    </svg>
  ),
  low: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" fill="#059669" fillOpacity="0.15" stroke="#059669" strokeWidth="1.3" />
      <path d="M5.5 8l2 2 3-3.5" stroke="#059669" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function AlertList({ alerts, maxItems }) {
  const displayAlerts = maxItems ? alerts.slice(0, maxItems) : alerts;

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 1a6 6 0 00-6 6v3.5l-1.2 2a.5.5 0 00.43.75h13.54a.5.5 0 00.43-.75L15 10.5V7a6 6 0 00-6-6z" stroke="#059669" strokeWidth="1.5" />
          <path d="M7 14a2 2 0 004 0" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Recent Alerts
      </h3>
      <ul className={styles.list}>
        {displayAlerts.map((alert) => (
          // TODO: Add onClick handler to either:
          // 1. Open an alert detail modal with full context & resolution actions, or
          // 2. Navigate to the related project's detail page.
          // Also add "Mark as Read" and "Dismiss" action buttons for each alert.
          <li
            key={alert.id}
            className={styles.item}
            style={{ borderLeftColor: severityColors[alert.severity], cursor: 'pointer' }}
          >
            <div className={styles.itemHeader}>
              <span className={styles.icon}>{severityIcons[alert.severity]}</span>
              <span className={styles.alertTitle}>{alert.title}</span>
              <span className={styles.time}>{alert.time}</span>
            </div>
            <p className={styles.description}>{alert.description}</p>
            <span className={styles.project}>{alert.project}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
