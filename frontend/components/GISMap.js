'use client';

import { useState } from 'react';
import { indiaStatesRisk, stateDistricts, cadastralParcels } from '../lib/mockData';
import styles from './GISMap.module.css';

const riskColors = {
  'very-high': '#dc2626',
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#059669',
};

export default function GISMap({
  large = false,
  onSelectParcel,
  selectedParcelId,
  currentScale = 'national',
  onScaleChange,
  onSelectState,
  onSelectDistrict,
}) {
  const [scaleLevel, setScaleLevel] = useState(currentScale || 'national'); // 'national' | 'district' | 'cadastral'
  const [selectedState, setSelectedState] = useState(indiaStatesRisk[0]); // MP default
  const [selectedDistrict, setSelectedDistrict] = useState(stateDistricts[0]); // Bhopal default
  const [selectedPlot, setSelectedPlot] = useState(cadastralParcels[0]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeLayers, setActiveLayers] = useState({
    heatmap: true,
    corridors: true,
    labels: true,
    cadastralGrid: true,
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize internal scale level if controlled from outside
  const handleScaleSwitch = (lvl) => {
    setScaleLevel(lvl);
    if (onScaleChange) onScaleChange(lvl);
  };

  const handleStateClick = (state) => {
    setSelectedState(state);
    if (onSelectState) onSelectState(state);
    handleScaleSwitch('district');
  };

  const handleDistrictClick = (dist) => {
    setSelectedDistrict(dist);
    if (onSelectDistrict) onSelectDistrict(dist);
    // Find matching cadastral parcel
    const matchedPlot = cadastralParcels.find((p) => p.district.toLowerCase() === dist.name.toLowerCase()) || cadastralParcels[0];
    setSelectedPlot(matchedPlot);
    if (onSelectParcel) onSelectParcel(matchedPlot);
    handleScaleSwitch('cadastral');
  };

  const handlePlotClick = (plot) => {
    setSelectedPlot(plot);
    if (onSelectParcel) onSelectParcel(plot);
  };

  const toggleLayer = (layerKey) => {
    setActiveLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className={`${styles.wrapper} ${large ? styles.large : ''}`}>
      {/* Top Map Control Bar: Scale Switcher & Breadcrumbs */}
      <div className={styles.topControlBar}>
        <div className={styles.scaleTabs}>
          <button
            className={`${styles.scaleTab} ${scaleLevel === 'national' ? styles.scaleTabActive : ''}`}
            onClick={() => handleScaleSwitch('national')}
          >
            <span className={styles.scaleNumber}>1</span>
            <span>National View (All India)</span>
          </button>
          <button
            className={`${styles.scaleTab} ${scaleLevel === 'district' ? styles.scaleTabActive : ''}`}
            onClick={() => handleScaleSwitch('district')}
          >
            <span className={styles.scaleNumber}>2</span>
            <span>State & Districts ({selectedState.name})</span>
          </button>
          <button
            className={`${styles.scaleTab} ${scaleLevel === 'cadastral' ? styles.scaleTabActive : ''}`}
            onClick={() => handleScaleSwitch('cadastral')}
          >
            <span className={styles.scaleNumber}>3</span>
            <span>Village Land Plots (Khasra)</span>
          </button>
        </div>

        {/* Scale Breadcrumbs */}
        <div className={styles.breadcrumbBar}>
          <span className={styles.bcItem} onClick={() => handleScaleSwitch('national')}>
            All India
          </span>
          <span className={styles.bcSep}>/</span>
          <span
            className={`${styles.bcItem} ${scaleLevel === 'district' ? styles.bcActive : ''}`}
            onClick={() => handleScaleSwitch('district')}
          >
            {selectedState.name}
          </span>
          <span className={styles.bcSep}>/</span>
          <span
            className={`${styles.bcItem} ${scaleLevel === 'cadastral' ? styles.bcActive : ''}`}
            onClick={() => handleScaleSwitch('cadastral')}
          >
            {selectedDistrict.name} ({selectedPlot ? `Plot ${selectedPlot.khasraNo}` : 'Survey Plots'})
          </span>

          <div className={styles.scaleRatio}>
            Zoom Level: {scaleLevel === 'national' ? 'Country Overview' : scaleLevel === 'district' ? 'District Level' : 'Individual Plot Level'}
          </div>
        </div>
      </div>

      {/* Layer Toggles and Search */}
      <div className={styles.filterStrip}>
        <div className={styles.layerToggles}>
          <label className={styles.layerCheck}>
            <input
              type="checkbox"
              checked={activeLayers.heatmap}
              onChange={() => toggleLayer('heatmap')}
            />
            <span>Delay Risk Colors</span>
          </label>
          <label className={styles.layerCheck}>
            <input
              type="checkbox"
              checked={activeLayers.corridors}
              onChange={() => toggleLayer('corridors')}
            />
            <span>Highway & Rail Corridors</span>
          </label>
          <label className={styles.layerCheck}>
            <input
              type="checkbox"
              checked={activeLayers.labels}
              onChange={() => toggleLayer('labels')}
            />
            <span>Names & Numbers</span>
          </label>
          <label className={styles.layerCheck}>
            <input
              type="checkbox"
              checked={activeLayers.cadastralGrid}
              onChange={() => toggleLayer('cadastralGrid')}
            />
            <span>Survey Boundaries</span>
          </label>
        </div>

        <div className={styles.searchBox}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M6 10.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM12.5 12.5l-3.3-3.3" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder={scaleLevel === 'national' ? 'Search state (e.g. MP, Maharashtra)...' : scaleLevel === 'district' ? 'Search district (e.g. Bhopal, Indore)...' : 'Search Khasra / Plot number...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Main Map Canvas */}
      <div className={styles.mapContainer}>
        {/* LEVEL 1: NATIONAL SCALE (INDIA MAP HEATMAP) */}
        {scaleLevel === 'national' && (
          <div className={styles.viewport}>
            <svg viewBox="0 0 100 100" className={styles.svg}>
              <defs>
                <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
                </pattern>
              </defs>

              {/* Background Grid */}
              <rect width="100" height="100" fill="url(#gridPattern)" />

              {/* India National Outline */}
              <path
                d="M 32,5 C 38,4 44,8 48,14 C 52,18 64,18 70,22 C 76,26 84,26 90,30 C 94,33 96,40 92,44 C 84,46 80,42 75,44 C 74,48 76,54 75,60 C 72,66 68,70 60,74 C 55,80 50,88 44,97 C 40,94 36,86 35,76 C 30,68 22,60 16,52 C 14,46 18,40 22,38 C 24,32 26,26 28,18 Z"
                fill="#0b1324"
                stroke="#1e293b"
                strokeWidth="1.2"
              />

              {/* Major National Highway & Freight Corridors */}
              {activeLayers.corridors && (
                <g className={styles.corridorsLayer}>
                  <path d="M 36,20 L 48,52 L 44,90" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="1.5,1" opacity="0.6" />
                  <path d="M 22,48 L 48,52 L 74,44" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="1.5,1" opacity="0.6" />
                  <path d="M 38,66 L 48,52 L 52,34" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="1.5,1" opacity="0.6" />
                  <path d="M 74,44 L 88,34" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="1.5,1" opacity="0.6" />
                </g>
              )}

              {/* State Polygons with Risk Heatmap Color Fill */}
              {indiaStatesRisk
                .filter((st) => searchQuery === '' || st.name.toLowerCase().includes(searchQuery.toLowerCase()) || st.code.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((state) => {
                  const isHovered = hoveredItem?.id === state.id;
                  const isSelected = selectedState.id === state.id;
                  const fillColor = activeLayers.heatmap ? riskColors[state.riskLevel] : '#1e293b';

                  return (
                    <g
                      key={state.id}
                      className={styles.stateGroup}
                      onMouseEnter={() => setHoveredItem(state)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={() => handleStateClick(state)}
                    >
                      <path
                        d={state.path}
                        fill={fillColor}
                        fillOpacity={isSelected ? 0.85 : isHovered ? 0.75 : 0.45}
                        stroke={isSelected ? '#38bdf8' : isHovered ? '#ffffff' : '#334155'}
                        strokeWidth={isSelected ? 1.4 : isHovered ? 1.0 : 0.6}
                        className={styles.statePath}
                      />

                      {/* State Center Hotspot Dot */}
                      <circle
                        cx={state.centerCoords[0]}
                        cy={state.centerCoords[1]}
                        r={state.riskScore > 75 ? 2.2 : 1.6}
                        fill={riskColors[state.riskLevel]}
                        stroke="#ffffff"
                        strokeWidth="0.5"
                      />

                      {/* State Name & Risk Label */}
                      {activeLayers.labels && (
                        <text
                          x={state.centerCoords[0]}
                          y={state.centerCoords[1] + 4.5}
                          textAnchor="middle"
                          fontSize="2.4"
                          fill="#f8fafc"
                          fontWeight="600"
                          className={styles.mapLabel}
                        >
                          {state.id} ({state.riskScore}%)
                        </text>
                      )}
                    </g>
                  );
                })}

              {/* Clean Human-Friendly Hover Tooltip */}
              {hoveredItem && (
                <g className={styles.svgTooltip} transform={`translate(${Math.min(hoveredItem.centerCoords[0] + 3, 62)}, ${Math.max(hoveredItem.centerCoords[1] - 12, 8)})`}>
                  <rect width="36" height="20" rx="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.6" opacity="0.95" />
                  <text x="3" y="4.5" fontSize="2.8" fill="#ffffff" fontWeight="700">
                    {hoveredItem.name}
                  </text>
                  <text x="3" y="8.5" fontSize="2.2" fill={riskColors[hoveredItem.riskLevel]} fontWeight="600">
                    Delay Risk: {hoveredItem.riskScore}% ({hoveredItem.delayedProjects} Projects at Risk)
                  </text>
                  <text x="3" y="12.5" fontSize="2.0" fill="#94a3b8">
                    Estimated Budget at Stake: ₹{hoveredItem.capitalAtRiskCr} Cr
                  </text>
                  <text x="3" y="16.5" fontSize="1.8" fill="#38bdf8">
                    Click to view districts & projects →
                  </text>
                </g>
              )}
            </svg>

            {/* National Summary Overlay */}
            <div className={styles.nationalSummaryCard}>
              <div className={styles.summaryTitle}>
                <span>National Land Acquisition Overview</span>
                <span className={styles.liveIndicator}>Across All States</span>
              </div>
              <div className={styles.summaryMetrics}>
                <div className={styles.smItem}>
                  <span className={styles.smNum}>512</span>
                  <span className={styles.smLabel}>Total Projects</span>
                </div>
                <div className={styles.smItem}>
                  <span className={styles.smNum} style={{ color: '#ef4444' }}>186</span>
                  <span className={styles.smLabel}>High Delay Risk</span>
                </div>
                <div className={styles.smItem}>
                  <span className={styles.smNum} style={{ color: '#f59e0b' }}>₹52,480 Cr</span>
                  <span className={styles.smLabel}>Budget at Risk</span>
                </div>
                <div className={styles.smItem}>
                  <span className={styles.smNum} style={{ color: '#10b981' }}>87.3%</span>
                  <span className={styles.smLabel}>Prediction Accuracy</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEVEL 2: MEDIUM SCALE (STATE & DISTRICTS VIEW) */}
        {scaleLevel === 'district' && (
          <div className={styles.viewport}>
            <svg viewBox="0 0 100 100" className={styles.svg}>
              {/* State Boundary */}
              <path
                d="M 12,32 Q 8,20 22,14 Q 38,6 55,10 Q 72,6 84,18 Q 94,28 88,44 Q 92,60 80,68 Q 70,80 54,82 Q 44,88 34,82 Q 20,84 14,70 Q 6,58 10,44 Z"
                fill="#09101d"
                stroke="#10b981"
                strokeWidth="1"
                strokeOpacity="0.8"
              />

              {/* Major Corridors */}
              {activeLayers.corridors && (
                <g>
                  <path d="M 50,15 L 50,45 L 52,72 L 52,85" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="3,2" />
                  <path d="M 25,48 L 38,35 L 50,45 L 72,48" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="3,2" />
                  <text x="32" y="30" fontSize="2.2" fill="#38bdf8" fontWeight="600">NH-46 Highway</text>
                  <text x="56" y="42" fontSize="2.2" fill="#38bdf8" fontWeight="600">Bhopal Ring Road</text>
                </g>
              )}

              {/* District Polygons */}
              {stateDistricts
                .filter((d) => searchQuery === '' || d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.corridor.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((dist) => {
                  const isSelected = selectedDistrict.id === dist.id;
                  const isHovered = hoveredItem?.id === dist.id;
                  const fillColor = activeLayers.heatmap ? riskColors[dist.riskLevel] : '#1e293b';

                  return (
                    <g
                      key={dist.id}
                      className={styles.districtGroup}
                      onMouseEnter={() => setHoveredItem(dist)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={() => handleDistrictClick(dist)}
                    >
                      <path
                        d={dist.polygon}
                        fill={fillColor}
                        fillOpacity={isSelected ? 0.8 : isHovered ? 0.65 : 0.35}
                        stroke={isSelected ? '#38bdf8' : isHovered ? '#ffffff' : '#475569'}
                        strokeWidth={isSelected ? 1.2 : 0.6}
                        className={styles.districtPath}
                      />

                      <circle
                        cx={dist.center.x}
                        cy={dist.center.y}
                        r="3.2"
                        fill={riskColors[dist.riskLevel]}
                        stroke="#ffffff"
                        strokeWidth="0.8"
                      />

                      {dist.riskScore >= 70 && (
                        <circle
                          cx={dist.center.x}
                          cy={dist.center.y}
                          r="6"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="0.5"
                          opacity="0.5"
                          className={styles.pulseRing}
                        />
                      )}

                      {activeLayers.labels && (
                        <text
                          x={dist.center.x}
                          y={dist.center.y + 6.5}
                          textAnchor="middle"
                          fontSize="3.2"
                          fill="#ffffff"
                          fontWeight="700"
                          className={styles.mapLabel}
                        >
                          {dist.name} ({dist.riskScore}%)
                        </text>
                      )}
                    </g>
                  );
                })}

              {/* District Tooltip */}
              {hoveredItem && hoveredItem.projectCount && (
                <g className={styles.svgTooltip} transform={`translate(${Math.min(hoveredItem.center.x + 4, 58)}, ${Math.max(hoveredItem.center.y - 14, 10)})`}>
                  <rect width="38" height="22" rx="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.6" opacity="0.95" />
                  <text x="3" y="4.5" fontSize="2.8" fill="#ffffff" fontWeight="700">
                    {hoveredItem.name} District
                  </text>
                  <text x="3" y="8.5" fontSize="2.2" fill={riskColors[hoveredItem.riskLevel]} fontWeight="600">
                    Delay Risk: {hoveredItem.riskScore}% · {hoveredItem.projectCount} Projects
                  </text>
                  <text x="3" y="12.5" fontSize="1.9" fill="#cbd5e1">
                    Project Corridor: {hoveredItem.corridor}
                  </text>
                  <text x="3" y="16.5" fontSize="1.9" fill="#f59e0b">
                    Main Reason: {hoveredItem.leadBottleneck}
                  </text>
                  <text x="3" y="20.0" fontSize="1.8" fill="#38bdf8">
                    Click to inspect Village Land Plots (Khasra) →
                  </text>
                </g>
              )}
            </svg>

            {/* District Quick Info Bar */}
            <div className={styles.districtBottomBar}>
              <div className={styles.dbInfo}>
                <span className={styles.dbTag}>SELECTED STATE</span>
                <span className={styles.dbTitle}>{selectedState.name} ({selectedState.activeProjects} Active Projects)</span>
                <span className={styles.dbSub}>Main Challenge: {selectedState.primaryBottleneck}</span>
              </div>
              <button className={styles.dbActionBtn} onClick={() => handleScaleSwitch('cadastral')}>
                Open Land Plots (Khasra) View →
              </button>
            </div>
          </div>
        )}

        {/* LEVEL 3: MICRO SCALE (VILLAGE LAND PLOTS / KHASRA PARCELS) */}
        {scaleLevel === 'cadastral' && (
          <div className={styles.viewport}>
            <svg viewBox="0 0 100 100" className={styles.svg}>
              <defs>
                <pattern id="surveyHatch" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(220, 38, 38, 0.25)" strokeWidth="0.8" />
                </pattern>
              </defs>

              {/* Road / Alignment Centerline */}
              {activeLayers.corridors && (
                <g>
                  <polygon
                    points="0,28 100,24 100,42 0,46"
                    fill="rgba(56, 189, 248, 0.08)"
                    stroke="#38bdf8"
                    strokeWidth="0.4"
                    strokeDasharray="2,2"
                  />
                  <line x1="0" y1="37" x2="100" y2="33" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3,1.5" />
                  <text x="5" y="34" fontSize="2.2" fill="#38bdf8" fontWeight="600">
                    Proposed Highway 60-meter Acquisition Corridor (Right of Way)
                  </text>
                </g>
              )}

              {/* Cadastral Survey Polygons (Khasra Plots) */}
              {cadastralParcels
                .filter((p) => searchQuery === '' || p.khasraNo.toLowerCase().includes(searchQuery.toLowerCase()) || p.owner.toLowerCase().includes(searchQuery.toLowerCase()) || p.village.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((plot) => {
                  const isSelected = selectedPlot?.id === plot.id;
                  const isHovered = hoveredItem?.id === plot.id;

                  return (
                    <g
                      key={plot.id}
                      className={styles.plotGroup}
                      onMouseEnter={() => setHoveredItem(plot)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={() => handlePlotClick(plot)}
                    >
                      <polygon
                        points={plot.polygonPoints}
                        fill={plot.riskScore > 75 ? (isSelected ? 'url(#surveyHatch)' : plot.color) : plot.color}
                        fillOpacity={isSelected ? 0.75 : isHovered ? 0.6 : 0.35}
                        stroke={isSelected ? '#38bdf8' : isHovered ? '#ffffff' : '#64748b'}
                        strokeWidth={isSelected ? 1.6 : 0.8}
                        className={styles.plotPolygon}
                      />

                      {activeLayers.labels && (
                        <g>
                          <text
                            x={plot.polygonPoints.split(' ')[0].split(',')[0]}
                            y={plot.polygonPoints.split(' ')[0].split(',')[1]}
                            dx="3"
                            dy="5"
                            fontSize="2.6"
                            fill="#ffffff"
                            fontWeight="700"
                            className={styles.mapLabel}
                          >
                            Plot {plot.khasraNo}
                          </text>
                          <text
                            x={plot.polygonPoints.split(' ')[0].split(',')[0]}
                            y={plot.polygonPoints.split(' ')[0].split(',')[1]}
                            dx="3"
                            dy="9"
                            fontSize="2.0"
                            fill="#cbd5e1"
                            className={styles.mapLabel}
                          >
                            {plot.area.split(' ')[0]} ha · {plot.riskScore}% Delay Risk
                          </text>
                        </g>
                      )}

                      {/* Disputed marker */}
                      {plot.courtStay !== 'None' && (
                        <circle
                          cx={parseFloat(plot.polygonPoints.split(' ')[1].split(',')[0]) - 4}
                          cy={parseFloat(plot.polygonPoints.split(' ')[1].split(',')[1]) + 4}
                          r="2.2"
                          fill="#dc2626"
                          stroke="#ffffff"
                          strokeWidth="0.5"
                        />
                      )}
                    </g>
                  );
                })}

              {/* Plot Hover Tooltip */}
              {hoveredItem && hoveredItem.khasraNo && (
                <g className={styles.svgTooltip} transform="translate(10, 5)">
                  <rect width="80" height="18" rx="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.6" opacity="0.95" />
                  <text x="3" y="4.5" fontSize="2.8" fill="#ffffff" fontWeight="700">
                    Plot (Khasra) No. {hoveredItem.khasraNo} · {hoveredItem.village}, {hoveredItem.district}
                  </text>
                  <text x="3" y="8.5" fontSize="2.2" fill={riskColors[hoveredItem.riskLevel]} fontWeight="600">
                    Delay Risk: {hoveredItem.riskScore}% · Est. Delay: {hoveredItem.estimatedDelay}
                  </text>
                  <text x="3" y="12.2" fontSize="2.0" fill="#cbd5e1">
                    Land Owner: {hoveredItem.owner} · Circle Rate: {hoveredItem.circleRate}
                  </text>
                  <text x="3" y="15.8" fontSize="1.9" fill="#f59e0b">
                    Status: {hoveredItem.mutationStatus} · Court Cases: {hoveredItem.courtStay}
                  </text>
                </g>
              )}
            </svg>

            {/* Cadastral Bottom Ribbon */}
            <div className={styles.cadastralRibbon}>
              <div className={styles.crItem}>
                <span className={styles.crLabel}>Selected Land Plot</span>
                <span className={styles.crValue}>Plot {selectedPlot.khasraNo} ({selectedPlot.village})</span>
              </div>
              <div className={styles.crItem}>
                <span className={styles.crLabel}>Land Register Status</span>
                <span className={styles.crValue} style={{ color: selectedPlot.riskScore > 70 ? '#ef4444' : '#10b981' }}>
                  {selectedPlot.mutationStatus}
                </span>
              </div>
              <div className={styles.crItem}>
                <span className={styles.crLabel}>Court Stay / Dispute</span>
                <span className={styles.crValue} style={{ color: selectedPlot.courtStay !== 'None' ? '#ef4444' : '#10b981' }}>
                  {selectedPlot.courtStay}
                </span>
              </div>
              <div className={styles.crItem}>
                <span className={styles.crLabel}>Compensation Status</span>
                <span className={styles.crValue}>{selectedPlot.rfctlarrStatus}</span>
              </div>
            </div>
          </div>
        )}

        {/* Map Legend */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.dot} style={{ background: '#dc2626' }} />
            <span>Very High Delay Risk (&gt;75%)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.dot} style={{ background: '#ef4444' }} />
            <span>High Risk (60-74%)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.dot} style={{ background: '#f59e0b' }} />
            <span>Moderate (40-59%)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.dot} style={{ background: '#059669' }} />
            <span>Low Risk (&lt;40%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
