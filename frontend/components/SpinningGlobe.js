'use client';

import styles from './SpinningGlobe.module.css';

/**
 * CadastralBackground:
 * Replaces the futuristic/sci-fi spinning wireframe globe with an authoritative,
 * grounded Gov-Tech cartographic grid and coordinate telemetry watermark.
 * Clean, subtle, and appropriate for an official state land portal.
 */
export default function SpinningGlobe() {
  return (
    <div className={styles.globeContainer} aria-hidden="true">
      <svg
        className={styles.canvas}
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="govGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(148, 163, 184, 0.04)" strokeWidth="0.8" />
            <circle cx="60" cy="60" r="1" fill="rgba(16, 185, 129, 0.08)" />
          </pattern>
        </defs>

        {/* Subtle background grid */}
        <rect width="1200" height="800" fill="url(#govGrid)" />

        {/* Subtle administrative meridian & parallel grid lines */}
        <g opacity="0.15" stroke="#334155" strokeDasharray="3 6" strokeWidth="0.8">
          <line x1="120" y1="180" x2="1080" y2="180" />
          <line x1="120" y1="400" x2="1080" y2="400" />
          <line x1="120" y1="620" x2="1080" y2="620" />
          <line x1="280" y1="80" x2="280" y2="720" />
          <line x1="600" y1="80" x2="600" y2="720" />
          <line x1="920" y1="80" x2="920" y2="720" />
        </g>

        {/* Stylized Madhya Pradesh Cadastral Core Boundary watermark */}
        <path
          d="M 320 280 Q 420 180 580 200 Q 720 160 840 260 Q 920 380 820 540 Q 680 620 500 580 Q 360 540 320 280 Z"
          fill="rgba(16, 185, 129, 0.015)"
          stroke="rgba(16, 185, 129, 0.07)"
          strokeWidth="1.2"
        />

        {/* Faint cadastral sector survey marks */}
        <g fill="#475569" fontSize="9" fontFamily="monospace" opacity="0.3">
          <text x="130" y="175">LAT 24°00'N · MP NORTHERN HIGHWAY CORRIDOR</text>
          <text x="130" y="395">LAT 23°15'N · TROPIC OF CANCER (BHOPAL NERVE CENTER)</text>
          <text x="130" y="615">LAT 22°30'N · NARMADA BASIN LOGISTICS</text>
          <text x="285" y="100">LONG 76°E</text>
          <text x="605" y="100">LONG 77°E</text>
          <text x="925" y="100">LONG 80°E</text>
        </g>
      </svg>
    </div>
  );
}
