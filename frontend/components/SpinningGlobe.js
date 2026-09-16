'use client';

import { useEffect, useRef } from 'react';
import styles from './SpinningGlobe.module.css';

// Exact polygon boundary coordinates for the Indian Subcontinent [lat, lon]
const indiaCoords = [
  [35.5, 76.8], [34.5, 74.0], [32.5, 75.0], [30.5, 73.0], [27.0, 71.0],
  [24.5, 68.5], [23.0, 69.0], [21.5, 72.5], [19.0, 72.8], [15.5, 73.8],
  [12.0, 75.0], [9.5, 76.5], [8.1, 77.5], [10.5, 79.8], [13.0, 80.3],
  [16.0, 81.8], [18.0, 83.5], [20.0, 86.0], [21.8, 87.5], [22.5, 88.8],
  [25.0, 92.0], [27.5, 95.0], [28.5, 96.5], [27.0, 93.0], [26.0, 89.8],
  [27.5, 88.2], [28.2, 84.0], [30.5, 80.5], [32.5, 78.5], [35.5, 76.8]
];

// Simplified outline coordinates for major continents [lat, lon]
const continents = [
  // Eurasia
  [
    [70, 30], [60, 60], [55, 90], [60, 130], [50, 140], [35, 130], [20, 110],
    [10, 105], [5, 100], [20, 90], [25, 65], [15, 50], [30, 35], [36, 28],
    [45, 15], [55, 10], [65, 15], [70, 30]
  ],
  // Africa
  [
    [35, -5], [32, 25], [15, 45], [5, 48], [-5, 40], [-25, 32], [-34, 20],
    [-20, 12], [-5, 10], [5, 2], [15, -15], [30, -10], [35, -5]
  ],
  // Australia
  [
    [-12, 132], [-15, 145], [-25, 152], [-38, 145], [-35, 118], [-22, 114],
    [-15, 124], [-12, 132]
  ],
  // North America
  [
    [70, -140], [65, -90], [50, -55], [30, -80], [20, -100], [15, -90],
    [25, -115], [40, -125], [55, -135], [70, -165], [70, -140]
  ],
  // South America
  [
    [10, -75], [5, -50], [-10, -35], [-25, -45], [-45, -65], [-55, -70],
    [-35, -72], [-15, -75], [0, -80], [10, -75]
  ]
];

export default function SpinningGlobe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let rotation = 0; // Current rotation in radians
    const rotSpeed = 0.004; // Smooth continuous speed
    const tilt = 18 * (Math.PI / 180); // 18 degree axial tilt
    let lastTimestamp = performance.now();

    // Safe resize handler that sets canvas dimensions properly
    const resizeCanvas = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 3D Orthographic Projection from [lat, lon] to 2D [x, y]
    const project = (lat, lon, R, cx, cy, rotAngle) => {
      const phi = lat * (Math.PI / 180);
      const lambda = lon * (Math.PI / 180) + rotAngle;

      const x = Math.cos(phi) * Math.sin(lambda);
      const y = Math.sin(phi);
      const z = Math.cos(phi) * Math.cos(lambda);

      // Axial tilt transformation
      const yTilt = y * Math.cos(tilt) - z * Math.sin(tilt);
      const zTilt = y * Math.sin(tilt) + z * Math.cos(tilt);
      const xTilt = x;

      return {
        x: cx + R * xTilt,
        y: cy - R * yTilt,
        visible: zTilt > -0.05,
        depth: zTilt,
      };
    };

    // The continuous 60fps render loop — guaranteed to run full-time
    const render = (timestamp) => {
      // Re-queue next frame immediately at the start of loop
      animId = requestAnimationFrame(render);

      try {
        const delta = Math.min((timestamp - lastTimestamp) / 16.67, 2.0);
        lastTimestamp = timestamp;

        // Advance rotation smoothly modulo 2*PI
        rotation = (rotation + rotSpeed * delta) % (Math.PI * 2);

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        if (width <= 10 || height <= 10) return;

        // Reset transform and apply DPR scaling for crisp rendering
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);

        // Responsive globe geometry
        const R = Math.max(120, Math.min(width, height) * 0.38);
        const cx = width * 0.55;
        const cy = height * 0.5;

        // 1. Cosmic Atmosphere Radial Aura behind globe
        const bgGlow = ctx.createRadialGradient(cx, cy, Math.max(10, R * 0.2), cx, cy, Math.max(20, R * 1.8));
        bgGlow.addColorStop(0, 'rgba(16, 185, 129, 0.09)');
        bgGlow.addColorStop(0.5, 'rgba(6, 182, 212, 0.04)');
        bgGlow.addColorStop(1, 'rgba(7, 12, 20, 0)');
        ctx.fillStyle = bgGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(10, R * 1.8), 0, Math.PI * 2);
        ctx.fill();

        // 2. Base Dark Sphere Disc
        const sphereGrad = ctx.createRadialGradient(
          cx - R * 0.35, cy - R * 0.35, Math.max(5, R * 0.1),
          cx, cy, Math.max(10, R)
        );
        sphereGrad.addColorStop(0, '#0d1829');
        sphereGrad.addColorStop(0.7, '#070d18');
        sphereGrad.addColorStop(1, '#04070e');

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(10, R), 0, Math.PI * 2);
        ctx.fillStyle = sphereGrad;
        ctx.fill();

        // Clip all globe interior rendering strictly inside the sphere
        ctx.clip();

        // 3. Parallels (Latitude Circles)
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.24)';
        ctx.lineWidth = 1;
        for (let lat = -60; lat <= 60; lat += 30) {
          ctx.beginPath();
          let first = true;
          for (let lon = -180; lon <= 180; lon += 6) {
            const p = project(lat, lon, R, cx, cy, rotation);
            if (p.visible) {
              if (first) {
                ctx.moveTo(p.x, p.y);
                first = false;
              } else {
                ctx.lineTo(p.x, p.y);
              }
            } else {
              first = true;
            }
          }
          ctx.stroke();
        }

        // 4. Meridians (Longitude Circles)
        for (let lon = 0; lon < 360; lon += 30) {
          ctx.beginPath();
          let first = true;
          for (let lat = -80; lat <= 80; lat += 6) {
            const p = project(lat, lon, R, cx, cy, rotation);
            if (p.visible) {
              if (first) {
                ctx.moveTo(p.x, p.y);
                first = false;
              } else {
                ctx.lineTo(p.x, p.y);
              }
            } else {
              first = true;
            }
          }
          ctx.stroke();
        }

        // 5. Continents (Faint Slate Outlines)
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
        ctx.fillStyle = 'rgba(30, 41, 59, 0.15)';
        ctx.lineWidth = 1.2;

        continents.forEach((poly) => {
          ctx.beginPath();
          let visibleCount = 0;
          poly.forEach(([lat, lon], idx) => {
            const p = project(lat, lon, R, cx, cy, rotation);
            if (p.visible) visibleCount++;
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          });
          ctx.closePath();
          if (visibleCount > poly.length * 0.35) {
            ctx.fill();
            ctx.stroke();
          }
        });

        // 6. HIGHLIGHT INDIA SPECIFICALLY (Always Illuminated Full-Time)
        let indiaVisible = 0;
        const projectedIndia = indiaCoords.map(([lat, lon]) => {
          const p = project(lat, lon, R, cx, cy, rotation);
          if (p.visible) indiaVisible++;
          return p;
        });

        const isIndiaInFront = indiaVisible > indiaCoords.length * 0.4;

        if (isIndiaInFront) {
          // FRONT VIEW: Vibrant Solid Emerald Glow
          ctx.save();
          ctx.beginPath();
          projectedIndia.forEach((p, idx) => {
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          });
          ctx.closePath();

          ctx.fillStyle = 'rgba(16, 185, 129, 0.38)';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 20;
          ctx.fill();

          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2.4;
          ctx.stroke();
          ctx.restore();

          // Pulse Beacon over Central India (Madhya Pradesh: [23.25°N, 77.41°E])
          const mpNode = project(23.25, 77.41, R, cx, cy, rotation);
          if (mpNode.visible) {
            const now = Date.now();
            // Safe, strictly positive radar wave expansions
            const wave1 = (now % 1600) / 1600; // 0 to 1
            const rWave1 = Math.max(2, 4 + wave1 * 26);
            const alphaWave1 = Math.max(0, 1 - wave1);

            const wave2 = ((now + 800) % 1600) / 1600;
            const rWave2 = Math.max(2, 4 + wave2 * 34);
            const alphaWave2 = Math.max(0, 1 - wave2);

            ctx.save();
            // Wave 1
            ctx.beginPath();
            ctx.arc(mpNode.x, mpNode.y, rWave1, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(16, 185, 129, ${alphaWave1 * 0.85})`;
            ctx.lineWidth = 1.6;
            ctx.stroke();

            // Wave 2
            ctx.beginPath();
            ctx.arc(mpNode.x, mpNode.y, rWave2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alphaWave2 * 0.6})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Center solid waypoint core
            ctx.beginPath();
            ctx.arc(mpNode.x, mpNode.y, 4.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#34d399';
            ctx.shadowBlur = 14;
            ctx.fill();

            // Outer bright emerald circle
            ctx.beginPath();
            ctx.arc(mpNode.x, mpNode.y, 8.5, 0, Math.PI * 2);
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Holographic Telemetry Tag
            const tagX = mpNode.x + 18;
            const tagY = mpNode.y - 28;

            ctx.beginPath();
            ctx.moveTo(mpNode.x, mpNode.y);
            ctx.lineTo(tagX, tagY + 12);
            ctx.lineTo(tagX + 185, tagY + 12);
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Tag background box
            ctx.fillStyle = 'rgba(7, 12, 20, 0.92)';
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.roundRect(tagX, tagY - 8, 185, 36, 6);
            ctx.fill();
            ctx.stroke();

            // Tag text
            ctx.fillStyle = '#34d399';
            ctx.font = 'bold 9.5px monospace';
            ctx.fillText('★ INDIA · MP CADASTRAL HUB', tagX + 10, tagY + 8);

            ctx.fillStyle = '#cbd5e1';
            ctx.font = '8.5px monospace';
            ctx.fillText('SIH26017 · 23.25°N, 77.41°E [ACTIVE]', tagX + 10, tagY + 21);

            ctx.restore();
          }
        } else {
          // BACK VIEW: Translucent Emerald X-Ray Outline so India is NEVER lost!
          ctx.save();
          ctx.beginPath();
          projectedIndia.forEach((p, idx) => {
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          });
          ctx.closePath();
          ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }

        ctx.restore(); // Restore from globe clip

        // 7. Outer Atmosphere Rim & Aura
        ctx.save();
        const atmosphereGrad = ctx.createRadialGradient(
          cx, cy, Math.max(10, R * 0.95),
          cx, cy, Math.max(15, R * 1.08)
        );
        atmosphereGrad.addColorStop(0, 'rgba(16, 185, 129, 0.55)');
        atmosphereGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.35)');
        atmosphereGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(10, R * 1.08), 0, Math.PI * 2);
        ctx.fillStyle = atmosphereGrad;
        ctx.fill();

        // Outer rim
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(10, R), 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 8. Orbital Satellite Ring
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.max(10, R * 1.35), Math.max(10, R * 0.42), -tilt * 1.2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
        ctx.setLineDash([4, 8]);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);

        // Orbiting Satellite Beacon
        const satAngle = (rotation * 3.2) % (Math.PI * 2);
        const satX = cx + Math.cos(satAngle) * (R * 1.35);
        const satY = cy + Math.sin(satAngle) * (R * 0.42);

        ctx.beginPath();
        ctx.arc(satX, satY, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.fill();

        ctx.restore();
      } catch (err) {
        // Silently recover if any temporary render error occurs
      }
    };

    // Kick off the infinite render loop
    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className={styles.globeContainer} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
