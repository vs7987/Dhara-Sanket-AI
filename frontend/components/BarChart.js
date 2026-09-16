import styles from './BarChart.module.css';

export default function BarChart({ data, title = 'Projects by District' }) {
  const maxVal = Math.max(...data.map((d) => d.count));
  const svgWidth = 400;
  const svgHeight = 220;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;
  const barGap = 12;
  const barWidth = (chartW - barGap * (data.length - 1)) / data.length;

  const yTicks = 5;
  const yStep = Math.ceil(maxVal / yTicks);

  const barColors = ['#059669', '#6366f1', '#0ea5e9', '#f59e0b', '#ec4899'];

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.chartContainer}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className={styles.svg}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Y-axis grid lines and labels */}
          {Array.from({ length: yTicks + 1 }).map((_, i) => {
            const yVal = i * yStep;
            const y = padding.top + chartH - (yVal / (yStep * yTicks)) * chartH;
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

          {/* Bars */}
          {data.map((d, i) => {
            const barH = (d.count / (yStep * yTicks)) * chartH;
            const x = padding.left + i * (barWidth + barGap);
            const y = padding.top + chartH - barH;
            const color = barColors[i % barColors.length];

            return (
              <g key={d.district}>
                {/* Bar shadow */}
                <rect
                  x={x + 1}
                  y={y + 2}
                  width={barWidth}
                  height={barH}
                  rx={6}
                  fill="rgba(0,0,0,0.04)"
                />
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx={6}
                  fill={color}
                  className={styles.bar}
                >
                  <animate
                    attributeName="height"
                    from="0"
                    to={barH}
                    dur="0.6s"
                    fill="freeze"
                  />
                  <animate
                    attributeName="y"
                    from={padding.top + chartH}
                    to={y}
                    dur="0.6s"
                    fill="freeze"
                  />
                </rect>
                {/* Value label */}
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill={color}
                >
                  {d.count}
                </text>
                {/* X-axis label */}
                <text
                  x={x + barWidth / 2}
                  y={padding.top + chartH + 18}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#cbd5e1"
                  fontWeight="500"
                >
                  {d.district}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
