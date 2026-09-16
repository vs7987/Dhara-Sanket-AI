'use client';

import { useState } from 'react';
import styles from './GISMap.module.css';

const riskColors = {
  high: '#dc2626',
  medium: '#f59e0b',
  low: '#059669',
};

export default function GISMap({ hotspots, large = false, onSelectHotspot }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const w = 100;
  const h = 100;

  return (
    <div className={`${styles.wrapper} ${large ? styles.large : ''}`}>
      {!large && (
        <h3 className={styles.title}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 5l5-2 6 3 5-2v10l-5 2-6-3-5 2V5z" stroke="#059669" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M7 3v10M13 6v10" stroke="#059669" strokeWidth="1.4" />
          </svg>
          Live GIS Map
          <span className={styles.live}>
            <span className={styles.pulse} />
            Live
          </span>
        </h3>
      )}
      <div className={styles.mapContainer}>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className={styles.svg}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background grid */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={`gx-${i}`}
              x1={i * 10}
              y1={0}
              x2={i * 10}
              y2={h}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="0.2"
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={`gy-${i}`}
              x1={0}
              y1={i * 10}
              x2={w}
              y2={i * 10}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="0.2"
            />
          ))}

          {/* Madhya Pradesh blob shape */}
          <path
            d="M10,35 Q5,25 15,18 Q25,8 40,12 Q55,8 65,15 Q78,10 88,22 Q95,32 90,45 Q92,58 82,65 Q75,75 60,78 Q50,85 40,80 Q28,82 18,72 Q8,62 10,48 Q6,42 10,35Z"
            fill="#0f172a"
            stroke="#10b981"
            strokeWidth="0.7"
            fillOpacity="0.8"
          />

          {/* District labels */}
          <text x="20" y="38" fontSize="3.2" fill="#94a3b8" fontWeight="600">Indore</text>
          <text x="38" y="28" fontSize="3.2" fill="#94a3b8" fontWeight="600">Dewas</text>
          <text x="50" y="42" fontSize="3.2" fill="#94a3b8" fontWeight="600">Bhopal</text>
          <text x="68" y="45" fontSize="3.2" fill="#94a3b8" fontWeight="600">Raisen</text>
          <text x="48" y="75" fontSize="3.2" fill="#94a3b8" fontWeight="600">Sehore</text>

          {/* District boundaries (subtle) */}
          <path
            d="M35,15 L35,50 Q35,60 30,70"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="0.25"
            strokeDasharray="1,1"
            fill="none"
          />
          <path
            d="M35,50 L65,50"
            stroke="#94a3b8"
            strokeWidth="0.2"
            strokeDasharray="1,1"
            fill="none"
          />
          <path
            d="M40,50 Q45,62 50,68"
            stroke="#94a3b8"
            strokeWidth="0.2"
            strokeDasharray="1,1"
            fill="none"
          />

          {/* Risk hotspot markers */}
          {hotspots.map((hs, idx) => (
            <g
              key={idx}
              className={styles.hotspot}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => onSelectHotspot && onSelectHotspot(idx)}
              style={{ cursor: onSelectHotspot ? 'pointer' : 'default' }}
            >
              {/* Pulse ring for high risk */}
              {hs.risk === 'high' && (
                <circle
                  cx={hs.x}
                  cy={hs.y}
                  r="3.5"
                  fill="none"
                  stroke={riskColors[hs.risk]}
                  strokeWidth="0.4"
                  opacity="0.4"
                  className={styles.pulseRing}
                />
              )}
              <circle
                cx={hs.x}
                cy={hs.y}
                r="2"
                fill={riskColors[hs.risk]}
                fillOpacity="0.3"
                stroke={riskColors[hs.risk]}
                strokeWidth="0.6"
              />
              <circle
                cx={hs.x}
                cy={hs.y}
                r="0.8"
                fill={riskColors[hs.risk]}
              />
              {hoveredIdx === idx && (
                <g>
                  <rect
                    x={hs.x + 3}
                    y={hs.y - 6}
                    width={hs.label.length * 2.2 + 4}
                    height="8"
                    rx="1.5"
                    fill="#0f172a"
                    fillOpacity="0.9"
                  />
                  <text
                    x={hs.x + 5}
                    y={hs.y - 1}
                    fontSize="3"
                    fill="#fff"
                    fontWeight="500"
                  >
                    {hs.label}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.dot} style={{ background: '#dc2626' }} />
            <span>High Risk</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.dot} style={{ background: '#f59e0b' }} />
            <span>Medium Risk</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.dot} style={{ background: '#059669' }} />
            <span>Low Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
}
