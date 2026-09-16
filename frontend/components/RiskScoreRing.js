import styles from './RiskScoreRing.module.css';

export default function RiskScoreRing({ score, size = 140, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  let color = '#059669';
  let label = 'Low';
  if (score >= 70) {
    color = '#dc2626';
    label = 'High';
  } else if (score >= 40) {
    color = '#f59e0b';
    label = 'Medium';
  }

  return (
    <div className={styles.wrapper}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Score ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          className={styles.ring}
        />
        {/* Score text */}
        <text
          x={center}
          y={center - 6}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={size * 0.22}
          fontWeight="800"
          fill="#ffffff"
        >
          {score}
        </text>
        <text
          x={center}
          y={center + size * 0.12}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={size * 0.09}
          fontWeight="600"
          fill={color}
        >
          {label} Risk
        </text>
      </svg>
    </div>
  );
}
