import styles from './DonutChart.module.css';

const colors = {
  high: '#dc2626',
  medium: '#f59e0b',
  low: '#059669',
};

const labels = {
  high: 'High Risk',
  medium: 'Medium Risk',
  low: 'Low Risk',
};

export default function DonutChart({ data }) {
  const total = data.high + data.medium + data.low;
  const radius = 60;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;
  const center = 80;

  const segments = ['high', 'medium', 'low'];
  let cumulativeOffset = 0;

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Risk Distribution</h3>
      <div className={styles.chartArea}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          {segments.map((key) => {
            const value = data[key];
            const segmentLength = (value / total) * circumference;
            const dashArray = `${segmentLength} ${circumference - segmentLength}`;
            const dashOffset = -cumulativeOffset;
            cumulativeOffset += segmentLength;

            return (
              <circle
                key={key}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={colors[key]}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="butt"
                transform={`rotate(-90 ${center} ${center})`}
                className={styles.segment}
              />
            );
          })}
          <text
            x={center}
            y={center - 5}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="24"
            fontWeight="800"
            fill="#ffffff"
          >
            {total}
          </text>
          <text
            x={center}
            y={center + 14}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="10"
            fill="#94a3b8"
            fontWeight="500"
          >
            Projects
          </text>
        </svg>
        <div className={styles.legend}>
          {segments.map((key) => (
            <div key={key} className={styles.legendItem}>
              <span className={styles.dot} style={{ background: colors[key] }} />
              <span className={styles.legendLabel}>{labels[key]}</span>
              <span className={styles.legendValue}>{data[key]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
