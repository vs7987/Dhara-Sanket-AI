import styles from './LineChart.module.css';

export default function LineChart({ data, title = 'Project Trend' }) {
  const svgWidth = 400;
  const svgHeight = 220;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.count));
  const yMax = Math.ceil(maxVal / 3) * 3 + 3;
  const yTicks = 5;
  const yStep = yMax / yTicks;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - (d.count / yMax) * chartH;
    return { x, y, ...d };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Area path (fill under line)
  const areaPath = `M${points[0].x},${padding.top + chartH} ${points
    .map((p) => `L${p.x},${p.y}`)
    .join(' ')} L${points[points.length - 1].x},${padding.top + chartH} Z`;

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.chartContainer}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className={styles.svg}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Y-axis grid lines */}
          {Array.from({ length: yTicks + 1 }).map((_, i) => {
            const yVal = Math.round(i * yStep);
            const y = padding.top + chartH - (yVal / yMax) * chartH;
            return (
              <g key={`y-${i}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartW}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="0.8"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94a3b8"
                  fontWeight="500"
                >
                  {yVal}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#lineGrad)" />

          {/* Line */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.line}
          />

          {/* Data points and labels */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#070c14"
                stroke="#10b981"
                strokeWidth="2.5"
                className={styles.point}
              />
              {/* X-axis labels */}
              <text
                x={p.x}
                y={padding.top + chartH + 18}
                textAnchor="middle"
                fontSize="10"
                fill="#cbd5e1"
                fontWeight="500"
              >
                {p.month}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
