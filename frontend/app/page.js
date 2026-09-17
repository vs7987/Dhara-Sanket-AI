'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

// 5 Waypoint nodes across the Madhya Pradesh corridor (West to East)
const corridorNodes = [
  {
    id: 'indore',
    name: 'Indore Logistics Hub',
    district: 'Indore',
    code: 'MP-09',
    coords: '22.7196° N, 75.8577° E',
    svgX: 180,
    svgY: 440,
    projects: 'Indore Multi-Modal Logistics Park & Ring Road',
    parcels: '420 Parcels',
    value: '₹1,240 Cr',
    status: 'Active Monitoring',
    statusColor: '#10b981',
    description: 'Western industrial hub connecting DMIC corridor with real-time cadastral verification.',
  },
  {
    id: 'ujjain',
    name: 'Ujjain Spiritual & Solar Belt',
    district: 'Ujjain',
    code: 'MP-13',
    coords: '23.1765° N, 75.7885° E',
    svgX: 340,
    svgY: 260,
    projects: 'Ujjain Religious Tourism Expressway & Solar Park',
    parcels: '310 Parcels',
    value: '₹680 Cr',
    status: 'Verified Clear',
    statusColor: '#0ea5e9',
    description: 'Heritage boundary preservation zone with automated revenue deed synchronization.',
  },
  {
    id: 'bhopal',
    name: 'Bhopal Central Command',
    district: 'Bhopal',
    code: 'MP-04',
    coords: '23.2599° N, 77.4126° E',
    svgX: 580,
    svgY: 390,
    projects: 'Bhopal Metro Phase II & NH-46 Expansion',
    parcels: '540 Parcels',
    value: '₹1,850 Cr',
    status: 'Live AI Scan',
    statusColor: '#10b981',
    description: 'State capital revenue nerve center monitoring urban transit right-of-way acquisitions.',
  },
  {
    id: 'raisen',
    name: 'Raisen Industrial SEZ',
    district: 'Raisen',
    code: 'MP-38',
    coords: '23.3315° N, 77.7816° E',
    svgX: 820,
    svgY: 230,
    projects: 'Raisen Industrial SEZ & Forest Boundary',
    parcels: '290 Parcels',
    value: '₹420 Cr',
    status: 'High Alert',
    statusColor: '#ef4444',
    description: 'Critical eco-sensitive zone with automated forest rights & tribal land dispute alerts.',
  },
  {
    id: 'jabalpur',
    name: 'Jabalpur Eastern Terminal',
    district: 'Jabalpur',
    code: 'MP-20',
    coords: '23.1815° N, 79.9864° E',
    svgX: 1040,
    svgY: 430,
    projects: 'Jabalpur Defense Corridor & Ring Road',
    parcels: '480 Parcels',
    value: '₹960 Cr',
    status: 'Protected',
    statusColor: '#10b981',
    description: 'Eastern logistics terminal with multi-agency defense easement coordination.',
  },
];

// All platform options/modules
const platformModules = [
  {
    title: 'Command Dashboard',
    tag: 'Executive Overview',
    href: '/dashboard',
    stats: '6 Metrics · Live Telemetry',
    accent: '#10b981',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    description: 'High-level executive dashboard tracking total acquisitions, budget utilization, risk distribution charts, and live dispute feeds.',
    actionText: 'Launch Dashboard',
  },
  {
    title: 'Active Projects Registry',
    tag: 'Corridor Registry',
    href: '/active-projects',
    stats: '8 Active Corridors · ₹4,250 Cr',
    accent: '#0ea5e9',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 6h16M4 10h16M4 14h10M4 18h7" strokeLinecap="round" />
        <circle cx="18" cy="16" r="3" />
        <path d="M18 15v2h1.5" strokeLinecap="round" />
      </svg>
    ),
    description: 'Comprehensive inventory of ongoing infrastructure projects with parcel stage tracking, acquisition timelines, and add-project workflows.',
    actionText: 'Explore Projects',
  },
  {
    title: 'High Risk & Dispute Alerts',
    tag: 'Dispute Intelligence',
    href: '/high-risk',
    stats: '3 Critical Hotspots · Urgent',
    accent: '#ef4444',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3L2 20h20L12 3Z" strokeLinejoin="round" />
        <path d="M12 9v5" strokeLinecap="round" />
        <circle cx="12" cy="17" r="0.8" fill="currentColor" />
      </svg>
    ),
    description: 'AI-powered anomaly detector flagging overlapping deeds, court stays, fraudulent mutation records, and compensation disputes.',
    actionText: 'Inspect Risk Flags',
  },
  {
    title: 'Interactive GIS Spatial Map',
    tag: 'Cadastral Telemetry',
    href: '/gis-map',
    stats: '1,420 Parcels Mapped',
    accent: '#6366f1',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" strokeLinejoin="round" />
        <path d="M9 3v15M15 6v15" />
      </svg>
    ),
    description: 'Multi-layer spatial GIS map with parcel boundary overlays, satellite imagery, geofenced risk rings, and interactive parcel inspector.',
    actionText: 'Open GIS Map',
  },
  {
    title: 'Audit & Compliance Reports',
    tag: 'Statutory Audits',
    href: '/reports',
    stats: '100% RFCTLARR Compliant',
    accent: '#f59e0b',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
        <path d="M17 15l2 2 3-3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    description: 'Automated statutory compliance audits, compensation distribution analytics, risk breakdown charts, and one-click PDF/CSV reports.',
    actionText: 'Generate Reports',
  },
];

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down'); // 'down' (L->R) or 'up' (R->L)
  const [orbCoords, setOrbCoords] = useState({ x: 180, y: 440 });
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const [pathLength, setPathLength] = useState(1200);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);

  const pathRef = useRef(null);
  const lastScrollY = useRef(0);

  // Measure path length on mount
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
    }
  }, []);

  // Track scroll position and animate the light along the path
  useEffect(() => {
    let animFrame;

    const handleScroll = () => {
      cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? Math.min(Math.max(currentY / totalHeight, 0), 1) : 0;

        setScrollProgress(progress);
        setIsScrolled(currentY > 40);

        // Track direction: scrolling down moves Left to Right, scrolling up moves Right to Left
        if (currentY > lastScrollY.current) {
          setScrollDirection('down');
        } else if (currentY < lastScrollY.current) {
          setScrollDirection('up');
        }
        lastScrollY.current = currentY;

        // Compute exact (x, y) coordinates of the light along the SVG Bézier path
        if (pathRef.current) {
          const totalLen = pathRef.current.getTotalLength();
          const targetLen = progress * totalLen;
          const point = pathRef.current.getPointAtLength(targetLen);
          setOrbCoords({ x: point.x, y: point.y });

          // Pick closest active node (0 to 4)
          const nodeIdx = Math.min(Math.floor(progress * corridorNodes.length), corridorNodes.length - 1);
          setActiveNodeIndex(nodeIdx);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  const activeNode = corridorNodes[activeNodeIndex];
  const strokeOffset = pathLength * (1 - scrollProgress);

  return (
    <div className={styles.container}>
      {/* ============================================================ */}
      {/* 1. SCROLL-DRIVEN BACKGROUND MAP WITH TRACED PATH & LIGHT ORB */}
      {/* ============================================================ */}
      <div className={styles.mapBackgroundWrapper} aria-hidden="true">
        <svg
          viewBox="0 0 1200 650"
          className={styles.mapSvg}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Glow Filters */}
            <filter id="orbGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur1" />
              <feGaussianBlur stdDeviation="16" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="pathGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradient along the active traced highway path */}
            <linearGradient id="activePathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="85%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            {/* Radial Orb Glow */}
            <radialGradient id="lightOrbRadial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#34d399" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#059669" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0" />
            </radialGradient>

            {/* Subtle Grid Pattern */}
            <pattern id="gridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(51, 65, 85, 0.25)" strokeWidth="0.8" />
              <circle cx="60" cy="60" r="1.5" fill="rgba(16, 185, 129, 0.25)" />
            </pattern>
          </defs>

          {/* Deep Dark Cartographic Background */}
          <rect width="1200" height="650" fill="#070c14" />
          <rect width="1200" height="650" fill="url(#gridPattern)" />

          {/* Radial Dark Vignette */}
          <circle cx="600" cy="325" r="550" fill="radial-gradient(circle, rgba(16,185,129,0.06) 0%, rgba(7,12,20,0) 70%)" />

          {/* Cartographic Coordinate Lat/Long Reference Lines */}
          <g className={styles.coordinateGrid} opacity="0.4">
            <line x1="100" y1="180" x2="1100" y2="180" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 6" />
            <line x1="100" y1="340" x2="1100" y2="340" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 6" />
            <line x1="100" y1="500" x2="1100" y2="500" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 6" />
            <line x1="280" y1="60" x2="280" y2="600" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 6" />
            <line x1="600" y1="60" x2="600" y2="600" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 6" />
            <line x1="920" y1="60" x2="920" y2="600" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 6" />

            <text x="110" y="175" fill="#475569" fontSize="10" fontFamily="monospace">LAT 24°N</text>
            <text x="110" y="335" fill="#475569" fontSize="10" fontFamily="monospace">LAT 23°N (TROPIC OF CANCER)</text>
            <text x="110" y="495" fill="#475569" fontSize="10" fontFamily="monospace">LAT 22°N</text>
            <text x="285" y="80" fill="#475569" fontSize="10" fontFamily="monospace">LONG 76°E</text>
            <text x="605" y="80" fill="#475569" fontSize="10" fontFamily="monospace">LONG 77°E</text>
            <text x="925" y="80" fill="#475569" fontSize="10" fontFamily="monospace">LONG 80°E</text>
          </g>

          {/* Stylized Madhya Pradesh Regional Boundary Silhouettes */}
          <g opacity="0.6">
            {/* Western MP District Cluster (Indore-Ujjain) */}
            <path
              d="M 120 320 Q 160 210 260 200 Q 380 180 410 270 Q 370 410 280 470 Q 170 510 120 420 Z"
              fill="#0f172a"
              fillOpacity="0.4"
              stroke="#1e293b"
              strokeWidth="1.2"
            />
            {/* Central MP District Cluster (Bhopal-Sehore-Raisen) */}
            <path
              d="M 430 250 Q 550 160 700 200 Q 790 270 770 420 Q 690 490 530 460 Q 420 410 430 250 Z"
              fill="#0f172a"
              fillOpacity="0.5"
              stroke="#10b981"
              strokeOpacity="0.2"
              strokeWidth="1.2"
            />
            {/* Eastern MP District Cluster (Jabalpur-Katni) */}
            <path
              d="M 810 240 Q 940 180 1080 230 Q 1120 380 1060 500 Q 940 530 840 450 Q 790 350 810 240 Z"
              fill="#0f172a"
              fillOpacity="0.4"
              stroke="#1e293b"
              strokeWidth="1.2"
            />
          </g>

          {/* Secondary Arterial Survey Roads / Connectors */}
          <g stroke="rgba(71, 85, 105, 0.3)" strokeWidth="1" strokeDasharray="2 4">
            <line x1="180" y1="440" x2="340" y2="440" />
            <line x1="340" y1="260" x2="580" y2="260" />
            <line x1="580" y1="390" x2="820" y2="390" />
            <line x1="820" y1="230" x2="1040" y2="230" />
          </g>

          {/* ============================================================ */}
          {/* THE TRACED CORRIDOR HIGHWAY PATH (Left-to-Right Geometry) */}
          {/* ============================================================ */}
          {/* 1. Base Inactive Track (dashed slate) */}
          <path
            d="M 180 440 C 230 350, 280 260, 340 260 C 420 260, 490 390, 580 390 C 670 390, 740 230, 820 230 C 900 230, 970 340, 1040 430"
            fill="none"
            stroke="#1e293b"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 180 440 C 230 350, 280 260, 340 260 C 420 260, 490 390, 580 390 C 670 390, 740 230, 820 230 C 900 230, 970 340, 1040 430"
            fill="none"
            stroke="#334155"
            strokeWidth="2.5"
            strokeDasharray="6 8"
            strokeLinecap="round"
          />

          {/* 2. Traced Path Behind Light (Active Glowing Neon Trail) */}
          {/* Referenced via pathRef to dynamically compute totalLength and pointAtLength */}
          <path
            ref={pathRef}
            d="M 180 440 C 230 350, 280 260, 340 260 C 420 260, 490 390, 580 390 C 670 390, 740 230, 820 230 C 900 230, 970 340, 1040 430"
            fill="none"
            stroke="url(#activePathGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
            filter="url(#pathGlow)"
            strokeDasharray={pathLength}
            strokeDashoffset={strokeOffset}
          />

          {/* ============================================================ */}
          {/* 5 WAYPOINT STATIONS ON THE MAP */}
          {/* ============================================================ */}
          {corridorNodes.map((node, i) => {
            const isReached = scrollProgress >= (i / (corridorNodes.length - 1)) * 0.95;
            const isCurrent = activeNodeIndex === i;

            return (
              <g key={node.id} className={styles.stationGroup}>
                {/* Outer pulsing ring for active/reached node */}
                {isCurrent && (
                  <circle
                    cx={node.svgX}
                    cy={node.svgY}
                    r="26"
                    fill="none"
                    stroke={node.statusColor}
                    strokeWidth="1.5"
                    opacity="0.4"
                    className={styles.pulseRing}
                  />
                )}
                {/* Secondary radar ring */}
                <circle
                  cx={node.svgX}
                  cy={node.svgY}
                  r="16"
                  fill={isReached ? `${node.statusColor}18` : 'rgba(30, 41, 59, 0.3)'}
                  stroke={isReached ? node.statusColor : '#475569'}
                  strokeWidth={isCurrent ? '2' : '1'}
                />
                {/* Inner solid node core */}
                <circle
                  cx={node.svgX}
                  cy={node.svgY}
                  r={isCurrent ? '7' : '5'}
                  fill={isReached ? node.statusColor : '#64748b'}
                />

                {/* District Label & Status Tag on Map */}
                <g transform={`translate(${node.svgX}, ${node.svgY > 300 ? node.svgY + 28 : node.svgY - 24})`}>
                  <rect
                    x="-65"
                    y="-12"
                    width="130"
                    height="24"
                    rx="12"
                    fill="#0b1324"
                    stroke={isCurrent ? node.statusColor : 'rgba(255, 255, 255, 0.1)'}
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill={isCurrent ? '#ffffff' : '#94a3b8'}
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="inherit"
                  >
                    {node.name.split(' ')[0]} · {node.code}
                  </text>
                </g>
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* CADASTRAL SURVEY ALIGNMENT MARKER (Scroll Position Tracker) */}
          {/* ============================================================ */}
          <g
            transform={`translate(${orbCoords.x}, ${orbCoords.y})`}
            className={styles.travelingLightOrb}
          >
            {/* Clean Survey Pin / Target Crosshair */}
            <circle cx="0" cy="0" r="14" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="1.8" />
            <circle cx="0" cy="0" r="4.5" fill="#10b981" />
            <line x1="-18" y1="0" x2="18" y2="0" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="0" y1="-18" x2="0" y2="18" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />

            {/* Clean Telemetry Readout Flag */}
            <g transform="translate(20, -26)">
              <rect
                x="0"
                y="0"
                width="165"
                height="32"
                rx="6"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="1.2"
              />
              <circle cx="12" cy="16" r="3.5" fill="#10b981" className={styles.beaconBlink} />
              <text x="22" y="13" fill="#94a3b8" fontSize="8.5" fontFamily="monospace" fontWeight="600">
                SURVEY ALIGNMENT · {scrollDirection === 'down' ? 'EASTBOUND' : 'WESTBOUND'}
              </text>
              <text x="22" y="24" fill="#ffffff" fontSize="9.5" fontFamily="monospace" fontWeight="700">
                {Math.round(scrollProgress * 100)}% · {activeNode.name.split(' ')[0]}
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* ============================================================ */}
      {/* 2. FOREGROUND CONTENT & ALL OPTIONS IN FRONT */}
      {/* ============================================================ */}
      <div className={styles.contentLayer}>
        {/* Sticky Glass Navbar */}
        <header className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ''}`}>
          <div className={styles.navContainer}>
            {/* LEFT: Button of small 3 bars + Enter Dashboard + Brand */}
            <div className={styles.navLeft}>
              {/* Button of small 3 bars */}
              <button
                className={styles.hamburgerBtn}
                onClick={() => setMenuDrawerOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                title="Open platform menu"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2.5 4.5h13M2.5 9h13M2.5 13.5h13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>

              {/* Enter Dashboard option on the left */}
              <Link href="/dashboard" className={styles.navBtnPrimary}>
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                  <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                  <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                  <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                <span>Enter Dashboard</span>
              </Link>

              <div className={styles.navBrandDivider} />

              {/* Brand Logo & Name */}
              <div className={styles.navBrand}>
                <div className={styles.navLogo}>
                  <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
                    <path
                      d="M20 3L35 12V28L20 37L5 28V12L20 3Z"
                      fill="#059669"
                      fillOpacity="0.2"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                    <path
                      d="M20 10L28 15V25L20 30L12 25V15L20 10Z"
                      fill="#059669"
                      fillOpacity="0.4"
                      stroke="#10b981"
                      strokeWidth="1.5"
                    />
                    <circle cx="20" cy="20" r="4" fill="#10b981" />
                  </svg>
                </div>
                <div className={styles.navBrandInfo}>
                  <span className={styles.navBrandTitle}>Dhara Sanket AI</span>
                  <span className={styles.navBrandBadge}>SIH26017</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Section Anchor Links & Live Status */}
            <div className={styles.navRight}>
              <nav className={styles.navLinks}>
                <a href="#overview" className={styles.navLink}>Overview</a>
                <a href="#modules" className={styles.navLink}>All Modules</a>
                <a href="#corridor" className={styles.navLink}>Live Corridor</a>
                <a href="#engine" className={styles.navLink}>AI Engine</a>
                <a href="#metrics" className={styles.navLink}>Telemetry</a>
              </nav>
              <div className={styles.navStatusPill}>
                <span className={styles.navStatusDot} />
                <span>ONLINE</span>
              </div>
            </div>
          </div>
        </header>

        {/* Slide-out Navigation Drawer triggered by 3-bars button */}
        {menuDrawerOpen && (
          <div className={styles.drawerOverlay} onClick={() => setMenuDrawerOpen(false)}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
              <div className={styles.drawerHeader}>
                <div className={styles.drawerBrand}>
                  <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
                    <path d="M20 3L35 12V28L20 37L5 28V12L20 3Z" fill="#059669" fillOpacity="0.2" stroke="#10b981" strokeWidth="2" />
                    <circle cx="20" cy="20" r="4" fill="#10b981" />
                  </svg>
                  <span>Quick Navigation</span>
                </div>
                <button
                  className={styles.drawerCloseBtn}
                  onClick={() => setMenuDrawerOpen(false)}
                  aria-label="Close menu"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className={styles.drawerNav}>
                <Link href="/" className={styles.drawerNavItem} onClick={() => setMenuDrawerOpen(false)}>
                  <div className={styles.drawerNavIcon}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path d="M3 8.5L10 3L17 8.5V17C17 17.55 16.55 18 16 18H4C3.45 18 3 17.55 3 17V8.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      <path d="M7 18V11H13V18" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </div>
                  <div>
                    <div className={styles.drawerNavText}>Home Page</div>
                    <div className={styles.drawerNavDesc}>Corridor light tracker & overview</div>
                  </div>
                </Link>

                <Link href="/dashboard" className={styles.drawerNavItem} onClick={() => setMenuDrawerOpen(false)}>
                  <div className={styles.drawerNavIcon} style={{ color: '#10b981' }}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </div>
                  <div>
                    <div className={styles.drawerNavText}>Command Dashboard</div>
                    <div className={styles.drawerNavDesc}>Live enterprise metrics & disputes</div>
                  </div>
                </Link>

                <Link href="/active-projects" className={styles.drawerNavItem} onClick={() => setMenuDrawerOpen(false)}>
                  <div className={styles.drawerNavIcon} style={{ color: '#0ea5e9' }}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path d="M3 4h14M3 8h14M3 12h10M3 16h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <div className={styles.drawerNavText}>Active Projects</div>
                    <div className={styles.drawerNavDesc}>8 ongoing highway & SEZ corridors</div>
                  </div>
                </Link>

                <Link href="/high-risk" className={styles.drawerNavItem} onClick={() => setMenuDrawerOpen(false)}>
                  <div className={styles.drawerNavIcon} style={{ color: '#ef4444' }}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2L18 17H2L10 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      <path d="M10 8v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <circle cx="10" cy="14.5" r="0.8" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <div className={styles.drawerNavText}>High Risk Projects</div>
                    <div className={styles.drawerNavDesc}>AI dispute warnings & court stays</div>
                  </div>
                </Link>

                <Link href="/gis-map" className={styles.drawerNavItem} onClick={() => setMenuDrawerOpen(false)}>
                  <div className={styles.drawerNavIcon} style={{ color: '#6366f1' }}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path d="M2 5l5-2 6 3 5-2v12l-5 2-6-3-5 2V5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      <path d="M7 3v12M13 6v12" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </div>
                  <div>
                    <div className={styles.drawerNavText}>GIS Spatial Map</div>
                    <div className={styles.drawerNavDesc}>Cadastral parcel overlays & satellite</div>
                  </div>
                </Link>

                <Link href="/reports" className={styles.drawerNavItem} onClick={() => setMenuDrawerOpen(false)}>
                  <div className={styles.drawerNavIcon} style={{ color: '#f59e0b' }}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <div className={styles.drawerNavText}>Reports & Audits</div>
                    <div className={styles.drawerNavDesc}>RFCTLARR statutory audits & exports</div>
                  </div>
                </Link>
              </div>

              <div className={styles.drawerFooter}>
                <Link href="/dashboard" className={styles.drawerLaunchBtn} onClick={() => setMenuDrawerOpen(false)}>
                  <span>Launch Platform</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* HERO SECTION */}
        <section id="overview" className={styles.heroSection}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            <span>GOVERNMENT OF MADHYA PRADESH · REVENUE DEPARTMENT · SIH 2026 (SIH26017)</span>
          </div>

          <h1 className={styles.heroTitle}>
            Dhara-Sanket AI <br />
            <span className={styles.heroTitleGradient}>Land Acquisition Delay Early-Warning System</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Protecting Land, Enabling Trust. An automated predictive analytics system combining cadastral deed synchronization,
            explainable risk scoring (XAI), and RFCTLARR 2013 intervention simulations to proactively eliminate infrastructure delays.
          </p>

          <div className={styles.heroCtaGroup}>
            <Link href="/dashboard" className={styles.ctaPrimary}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span>Launch Full Platform</span>
            </Link>

            <Link href="/gis-map" className={styles.ctaSecondary}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M2 5l5-2 6 3 5-2v12l-5 2-6-3-5 2V5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M7 3v12M13 6v12" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              <span>Explore Spatial GIS Map</span>
            </Link>

            <Link href="/high-risk" className={styles.ctaWarning}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L18 17H2L10 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M10 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="10" cy="14.5" r="0.8" fill="currentColor" />
              </svg>
              <span>3 Critical Alerts</span>
            </Link>
          </div>

          {/* Floating Real-time Corridor Telemetry HUD */}
          <div className={styles.telemetryCard}>
            <div className={styles.telemetryHeader}>
              <div className={styles.telemetryStatus}>
                <span className={styles.telemetryLiveDot} />
                <span>ACTIVE TRACKING TELEMETRY</span>
              </div>
              <span className={styles.telemetryCoords}>
                {activeNode.coords}
              </span>
            </div>

            <div className={styles.telemetryBody}>
              <div className={styles.telemetryItem}>
                <span className={styles.telemetryLabel}>Current Sector</span>
                <span className={styles.telemetryValue}>{activeNode.name}</span>
              </div>
              <div className={styles.telemetryItem}>
                <span className={styles.telemetryLabel}>Corridor Progress</span>
                <span className={styles.telemetryValue}>
                  {Math.round(scrollProgress * 100)}% ({scrollDirection === 'down' ? 'Left → Right' : 'Right → Left'})
                </span>
              </div>
              <div className={styles.telemetryItem}>
                <span className={styles.telemetryLabel}>Monitored Value</span>
                <span className={styles.telemetryValue} style={{ color: '#10b981' }}>{activeNode.value}</span>
              </div>
              <div className={styles.telemetryItem}>
                <span className={styles.telemetryLabel}>Sector Status</span>
                <span
                  className={styles.telemetryBadge}
                  style={{ backgroundColor: `${activeNode.statusColor}22`, color: activeNode.statusColor, borderColor: activeNode.statusColor }}
                >
                  {activeNode.status}
                </span>
              </div>
            </div>

            {/* Scroll Indicator helper */}
            <div className={styles.scrollNotice}>
              <svg className={styles.scrollArrow} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Scroll down to propel the tracking light Eastbound across the corridor map</span>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* ALL PLATFORM OPTIONS PRESENTED IN FRONT (Feature Cards) */}
        {/* ============================================================ */}
        <section id="modules" className={styles.modulesSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>CORE PLATFORM SUITE</span>
            <h2 className={styles.sectionTitle}>Direct Access to All Modules</h2>
            <p className={styles.sectionDesc}>
              Every critical capability of Dhara Sanket AI is directly accessible. Select any module to view live data.
            </p>
          </div>

          <div className={styles.modulesGrid}>
            {platformModules.map((mod) => (
              <Link
                key={mod.href}
                href={mod.href}
                className={styles.moduleCard}
                style={{ '--card-accent': mod.accent }}
              >
                <div className={styles.moduleCardTop}>
                  <div className={styles.moduleIconWrapper} style={{ color: mod.accent, backgroundColor: `${mod.accent}15` }}>
                    {mod.icon}
                  </div>
                  <span className={styles.moduleTag} style={{ color: mod.accent, borderColor: `${mod.accent}30` }}>
                    {mod.tag}
                  </span>
                </div>

                <div className={styles.moduleCardContent}>
                  <h3 className={styles.moduleTitle}>{mod.title}</h3>
                  <div className={styles.moduleStats}>{mod.stats}</div>
                  <p className={styles.moduleDesc}>{mod.description}</p>
                </div>

                <div className={styles.moduleCardFooter}>
                  <span className={styles.moduleActionText}>{mod.actionText}</span>
                  <div className={styles.moduleArrowCircle}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* INTERACTIVE CORRIDOR STATIONS SHOWCASE (Synced with Scroll) */}
        {/* ============================================================ */}
        <section id="corridor" className={styles.corridorSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>LIVE CORRIDOR TELEMETRY</span>
            <h2 className={styles.sectionTitle}>Madhya Pradesh Traced Route Nodes</h2>
            <p className={styles.sectionDesc}>
              Watch the background light travel through these 5 major district checkpoints as you scroll.
            </p>
          </div>

          <div className={styles.stationsGrid}>
            {corridorNodes.map((node, idx) => {
              const isCurrent = activeNodeIndex === idx;
              return (
                <div
                  key={node.id}
                  className={`${styles.stationCard} ${isCurrent ? styles.stationCardActive : ''}`}
                  style={{ '--station-color': node.statusColor }}
                >
                  <div className={styles.stationCardHeader}>
                    <span className={styles.stationIndex}>0{idx + 1}</span>
                    <span
                      className={styles.stationStatusPill}
                      style={{ color: node.statusColor, backgroundColor: `${node.statusColor}18` }}
                    >
                      {node.status}
                    </span>
                  </div>

                  <h3 className={styles.stationName}>{node.name}</h3>
                  <div className={styles.stationCoords}>{node.coords}</div>
                  <div className={styles.stationProject}>{node.projects}</div>

                  <div className={styles.stationMetrics}>
                    <div className={styles.stationMetricItem}>
                      <span className={styles.stationMetricLabel}>Monitored Area</span>
                      <span className={styles.stationMetricValue}>{node.parcels}</span>
                    </div>
                    <div className={styles.stationMetricItem}>
                      <span className={styles.stationMetricLabel}>Asset Value</span>
                      <span className={styles.stationMetricValue}>{node.value}</span>
                    </div>
                  </div>

                  <p className={styles.stationDesc}>{node.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/* AI ENGINE & RISK DETECTION CAPABILITIES */}
        {/* ============================================================ */}
        <section id="engine" className={styles.aiEngineSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>INTELLIGENT RISK ENGINE</span>
            <h2 className={styles.sectionTitle}>Preventing Disputes with Multimodal AI</h2>
            <p className={styles.sectionDesc}>
              Cutting-edge algorithms analyze satellite imagery, cadastral boundaries, and legal records simultaneously.
            </p>
          </div>

          <div className={styles.capabilitiesGrid}>
            <div className={styles.capabilityCard}>
              <div className={styles.capIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className={styles.capTitle}>Cadastral Boundary AI Overlap Detection</h3>
              <p className={styles.capText}>
                Compares digitized MP Bhulekh khasra polygons with actual satellite land cover footprints to detect illegal encroachment and duplicate title claims before payouts.
              </p>
            </div>

            <div className={styles.capabilityCard}>
              <div className={styles.capIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <h3 className={styles.capTitle}>Judicial Precedent & Litigation Forecasting</h3>
              <p className={styles.capText}>
                NLP models continuously ingest Madhya Pradesh High Court and Revenue Board court dockets to identify parcels with active injunctions or pending inheritance disputes.
              </p>
            </div>

            <div className={styles.capabilityCard}>
              <div className={styles.capIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 className={styles.capTitle}>Automated RFCTLARR 2013 Valuation Engine</h3>
              <p className={styles.capText}>
                Standardizes compensation math across rural and urban multiplier guidelines, ensuring transparent rehabilitation and resettlement payouts with zero administrative leakage.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PLATFORM METRICS COUNTER BAR */}
        {/* ============================================================ */}
        <section id="metrics" className={styles.metricsSection}>
          <div className={styles.metricsGrid}>
            <div className={styles.metricCounterCard}>
              <span className={styles.metricNumber}>1,420+</span>
              <span className={styles.metricLabel}>Land Parcels Monitored</span>
              <span className={styles.metricSub}>Across 5 districts in MP</span>
            </div>
            <div className={styles.metricCounterCard}>
              <span className={styles.metricNumber}>₹4,250 Cr</span>
              <span className={styles.metricLabel}>Capital Infrastructure Protected</span>
              <span className={styles.metricSub}>Highway, Metro, & Solar SEZs</span>
            </div>
            <div className={styles.metricCounterCard}>
              <span className={styles.metricNumber}>99.4%</span>
              <span className={styles.metricLabel}>AI Anomaly Precision</span>
              <span className={styles.metricSub}>Verified against ground truth</span>
            </div>
            <div className={styles.metricCounterCard}>
              <span className={styles.metricNumber}>62%</span>
              <span className={styles.metricLabel}>Faster Acquisition Velocity</span>
              <span className={styles.metricSub}>Average 18 days vs 48 days</span>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* FOOTER */}
        {/* ============================================================ */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrandCol}>
              <div className={styles.footerLogo}>
                <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                  <path d="M20 3L35 12V28L20 37L5 28V12L20 3Z" fill="#059669" fillOpacity="0.3" stroke="#10b981" strokeWidth="2" />
                  <circle cx="20" cy="20" r="4" fill="#10b981" />
                </svg>
                <span>Dhara Sanket AI</span>
              </div>
              <p className={styles.footerTagline}>
                Protecting Land, Enabling Trust. Built for the Smart India Hackathon (SIH26017) to revolutionize land governance across India.
              </p>
            </div>

            <div className={styles.footerLinksCol}>
              <h4 className={styles.footerHeading}>Navigation</h4>
              <Link href="/" className={styles.footerLink}>Home</Link>
              <Link href="/dashboard" className={styles.footerLink}>Command Dashboard</Link>
              <Link href="/active-projects" className={styles.footerLink}>Active Projects</Link>
              <Link href="/high-risk" className={styles.footerLink}>High Risk Alerts</Link>
            </div>

            <div className={styles.footerLinksCol}>
              <h4 className={styles.footerHeading}>Spatial GIS</h4>
              <Link href="/gis-map" className={styles.footerLink}>Interactive GIS Map</Link>
              <Link href="/reports" className={styles.footerLink}>Compliance Reports</Link>
              <a href="#corridor" className={styles.footerLink}>Corridor Tracking</a>
              <a href="#engine" className={styles.footerLink}>AI Risk Engine</a>
            </div>

            <div className={styles.footerLinksCol}>
              <h4 className={styles.footerHeading}>Project Info</h4>
              <span className={styles.footerMetaItem}>SIH Problem ID: SIH26017</span>
              <span className={styles.footerMetaItem}>Focus State: Madhya Pradesh</span>
              <span className={styles.footerMetaItem}>Stack: Next.js · React · Inline SVG</span>
              <span className={styles.footerMetaItem} style={{ color: '#10b981' }}>Telemetry: ONLINE</span>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>© 2026 Dhara Sanket AI — SIH 2026 Land Acquisition Risk Intelligence Platform.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
